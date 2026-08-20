(function () {
  const { createContext, useContext, useState, useEffect, useReducer } = React;

  const ERPContext = createContext();
  const STORAGE_KEY = 'PRIME_ERP_DATA_V1';

  function loadInitialState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.parties && parsed.products) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load ERP state from localStorage:', e);
    }
    return window.ERP_MOCK_DATA || {};
  }

  function saveToLocalStorage(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save ERP state to localStorage:', e);
    }
    return data;
  }

  function erpReducer(state, action) {
    let newState = state;

    switch (action.type) {
      case 'RESET_DATA': {
        newState = JSON.parse(JSON.stringify(window.ERP_MOCK_DATA || {}));
        break;
      }

      case 'ADD_PARTY': {
        const newParty = {
          id: `PTY-${100 + state.parties.length + 1}`,
          status: 'Active',
          ...action.payload
        };
        newState = {
          ...state,
          parties: [newParty, ...state.parties]
        };
        break;
      }

      case 'ADD_PRODUCT': {
        const newProd = {
          id: `PRD-00${state.products.length + 1}`,
          availableStock: parseFloat(action.payload.openingStock || 0),
          minReorderLevel: parseFloat(action.payload.minReorderLevel || 50),
          avgRate: parseFloat(action.payload.purchaseRate || 100),
          stockValue: (parseFloat(action.payload.openingStock || 0) * parseFloat(action.payload.purchaseRate || 100)),
          status: 'Active',
          ...action.payload
        };

        const updatedBatches = { ...state.batches };
        if (newProd.availableStock > 0) {
          updatedBatches[newProd.id] = [
            {
              batchNo: `B0${state.products.length + 10}`,
              receivedDate: new Date().toISOString().split('T')[0],
              initialQty: newProd.availableStock,
              availableQty: newProd.availableStock,
              rate: newProd.avgRate,
              grnId: 'INITIAL-STOCK'
            }
          ];
        }

        newState = {
          ...state,
          products: [newProd, ...state.products],
          batches: updatedBatches
        };
        break;
      }

      case 'CREATE_PO': {
        const newPO = {
          id: `PO-${1040 + state.purchaseOrders.length + 1}`,
          date: new Date().toISOString().split('T')[0],
          status: 'Pending',
          grnId: null,
          activity: [
            { date: new Date().toLocaleString(), user: 'Admin', title: 'PO Created', detail: 'Purchase order issued.' }
          ],
          ...action.payload
        };
        newState = {
          ...state,
          purchaseOrders: [newPO, ...state.purchaseOrders]
        };
        break;
      }

      case 'RECEIVE_GOODS': {
        const { poId, receivedItems, notes } = action.payload;
        const grnNumber = `GRN-${1090 + Math.floor(Math.random() * 90) + 10}`;
        const todayStr = new Date().toISOString().split('T')[0];

        // 1. Update PO status & activity
        const updatedPOs = state.purchaseOrders.map(po => {
          if (po.id === poId) {
            const updatedItems = po.items.map(item => {
              const rec = receivedItems.find(r => r.productId === item.productId);
              const recQty = rec ? parseFloat(rec.receivedQty || 0) : item.qty;
              return {
                ...item,
                receivedQty: (item.receivedQty || 0) + recQty
              };
            });

            const isAllReceived = updatedItems.every(i => (i.receivedQty || 0) >= i.qty);
            const isPartial = updatedItems.some(i => (i.receivedQty || 0) > 0) && !isAllReceived;

            return {
              ...po,
              status: isAllReceived ? 'Received' : (isPartial ? 'Partial' : po.status),
              grnId: grnNumber,
              grnDate: todayStr,
              items: updatedItems,
              activity: [
                {
                  date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
                  user: 'Store Manager',
                  title: `Goods Received (${grnNumber})`,
                  detail: notes || `Received items into inventory stock under ${grnNumber}.`
                },
                ...po.activity
              ]
            };
          }
          return po;
        });

        // 2. Update stock & FIFO batches
        const newBatches = { ...state.batches };
        const updatedProducts = state.products.map(prod => {
          const rec = receivedItems.find(r => r.productId === prod.id);
          if (rec && parseFloat(rec.receivedQty || 0) > 0) {
            const addedQty = parseFloat(rec.receivedQty);
            const rate = parseFloat(rec.rate || prod.avgRate);
            const batchNo = rec.batchNo || `B0${Math.floor(Math.random() * 900) + 100}`;

            const prodBatches = newBatches[prod.id] ? [...newBatches[prod.id]] : [];
            prodBatches.push({
              batchNo,
              receivedDate: todayStr,
              initialQty: addedQty,
              availableQty: addedQty,
              rate: rate,
              grnId: grnNumber
            });
            newBatches[prod.id] = prodBatches;

            const newTotalStock = prod.availableStock + addedQty;
            const newStockVal = prod.stockValue + (addedQty * rate);
            const newAvgRate = newTotalStock > 0 ? (newStockVal / newTotalStock) : prod.avgRate;

            return {
              ...prod,
              availableStock: newTotalStock,
              stockValue: newStockVal,
              avgRate: Math.round(newAvgRate * 100) / 100,
              status: newTotalStock > prod.minReorderLevel ? 'Active' : 'Low Stock'
            };
          }
          return prod;
        });

        const newAct = {
          id: `ACT-${Date.now()}`,
          code: grnNumber,
          party: action.payload.supplierName || 'Supplier',
          detail: `Stock Updated via ${grnNumber}`,
          time: 'Just now',
          type: 'grn',
          status: 'Success'
        };

        newState = {
          ...state,
          purchaseOrders: updatedPOs,
          products: updatedProducts,
          batches: newBatches,
          recentActivities: [newAct, ...state.recentActivities]
        };
        break;
      }

      case 'CREATE_INVOICE': {
        const invData = action.payload;
        const invNumber = `INV-${2080 + state.salesInvoices.length + 1}`;
        const todayStr = new Date().toISOString().split('T')[0];

        // FIFO Stock Reduction
        const newBatches = { ...state.batches };
        const updatedProducts = state.products.map(prod => {
          const invItem = invData.items.find(i => i.productId === prod.id);
          if (invItem && parseFloat(invItem.qty || 0) > 0) {
            let qtyToDeduct = parseFloat(invItem.qty);
            const prodBatches = newBatches[prod.id] ? [...newBatches[prod.id]] : [];

            const updatedProdBatches = prodBatches.map(b => {
              if (qtyToDeduct <= 0) return b;
              if (b.availableQty <= 0) return b;

              if (b.availableQty >= qtyToDeduct) {
                const updated = { ...b, availableQty: b.availableQty - qtyToDeduct };
                qtyToDeduct = 0;
                return updated;
              } else {
                qtyToDeduct -= b.availableQty;
                return { ...b, availableQty: 0 };
              }
            });

            newBatches[prod.id] = updatedProdBatches;
            const newStock = Math.max(0, prod.availableStock - parseFloat(invItem.qty));
            const newStockVal = newStock * prod.avgRate;

            return {
              ...prod,
              availableStock: newStock,
              stockValue: newStockVal,
              status: newStock > prod.minReorderLevel ? 'Active' : 'Low Stock'
            };
          }
          return prod;
        });

        const newInvoice = {
          id: invNumber,
          date: todayStr,
          status: 'Pending',
          ...invData
        };

        const newAct = {
          id: `ACT-${Date.now()}`,
          code: invNumber,
          party: invData.customerName,
          detail: `₹${invData.totalAmount.toLocaleString('en-IN')} • Invoice Created`,
          time: 'Just now',
          type: 'sales',
          status: 'Pending'
        };

        newState = {
          ...state,
          salesInvoices: [newInvoice, ...state.salesInvoices],
          products: updatedProducts,
          batches: newBatches,
          recentActivities: [newAct, ...state.recentActivities]
        };
        break;
      }

      default:
        return state;
    }

    return saveToLocalStorage(newState);
  }

  window.ERPProvider = function ({ children }) {
    const [state, dispatch] = useReducer(erpReducer, null, loadInitialState);
    const [toasts, setToasts] = useState([]);
    const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
      const handleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          setIsCmdPaletteOpen(prev => !prev);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const showToast = (title, message, type = 'success') => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, title, message, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 4000);
    };

    const removeToast = (id) => {
      setToasts(prev => prev.filter(t => t.id !== id));
    };

    const resetToMockData = () => {
      dispatch({ type: 'RESET_DATA' });
      showToast('Data Reset', 'Restored initial mock ERP dataset.');
    };

    const addParty = (partyData) => {
      dispatch({ type: 'ADD_PARTY', payload: partyData });
      showToast('Party Created', `${partyData.name} saved to local storage.`);
    };

    const addProduct = (productData) => {
      dispatch({ type: 'ADD_PRODUCT', payload: productData });
      showToast('Product Created', `${productData.name} saved to local storage.`);
    };

    const createPurchaseOrder = (poData) => {
      dispatch({ type: 'CREATE_PO', payload: poData });
      showToast('PO Generated', `Purchase Order saved to local storage.`);
    };

    const receiveGoods = (poId, receivedItems, notes, supplierName) => {
      dispatch({ type: 'RECEIVE_GOODS', payload: { poId, receivedItems, notes, supplierName } });
      showToast('Goods Received', `Stock & FIFO batch ledger updated in local storage.`);
    };

    const createSalesInvoice = (invData) => {
      dispatch({ type: 'CREATE_INVOICE', payload: invData });
      showToast('Invoice Created', `Invoice saved & stock reduced in local storage.`);
    };

    const value = {
      state,
      toasts,
      showToast,
      removeToast,
      resetToMockData,
      addParty,
      addProduct,
      createPurchaseOrder,
      receiveGoods,
      createSalesInvoice,
      isCmdPaletteOpen,
      setIsCmdPaletteOpen,
      sidebarCollapsed,
      setSidebarCollapsed
    };

    return React.createElement(ERPContext.Provider, { value }, children);
  };

  window.useERP = function () {
    return useContext(ERPContext);
  };
})();
