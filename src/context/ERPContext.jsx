import React, { createContext, useContext, useState, useEffect, useReducer } from 'react';

const INITIAL_ERP_DATA = {
  parties: [
    { id: 'PTY-101', name: 'ABC Traders', type: 'Supplier', phone: '+91 98421 12345', email: 'orders@abctraders.in', location: 'Coimbatore, Tamil Nadu', gstin: '33AAAC1234F1Z1', address: '104 Cross Cut Road, Gandhipuram', country: 'India', state: 'Tamil Nadu', status: 'Active' },
    { id: 'PTY-104', name: 'XYZ Textiles', type: 'Customer', phone: '+91 98250 45678', email: 'purchasing@xyztextiles.com', location: 'Surat, Gujarat', gstin: '24AABX3456J4Z4', address: '702 Ring Road Market', country: 'India', state: 'Gujarat', status: 'Active' },
    { id: 'PTY-105', name: 'Fashion Crafters', type: 'Customer', phone: '+91 98200 56789', email: 'accounts@fashioncrafters.in', location: 'Mumbai, Maharashtra', gstin: '27AAAC9876K5Z5', address: '18 Lower Parel West', country: 'India', state: 'Maharashtra', status: 'Active' }
  ],
  categories: {
    major: [
      { id: 'MJ-01', name: 'Yarn', code: 'YRN' },
      { id: 'MJ-02', name: 'Fabric', code: 'FBC' },
      { id: 'MJ-03', name: 'Trims & Accessories', code: 'TRM' }
    ],
    sub: [
      { id: 'SB-01', majorId: 'MJ-01', name: 'Cotton Yarn' },
      { id: 'SB-02', majorId: 'MJ-01', name: 'Synthetic Yarn' },
      { id: 'SB-03', majorId: 'MJ-02', name: 'Knitted Fabric' },
      { id: 'SB-04', majorId: 'MJ-02', name: 'Woven Fabric' }
    ],
    subSub: [
      { id: 'SSB-01', subId: 'SB-01', name: 'Combed Cotton' },
      { id: 'SSB-02', subId: 'SB-01', name: 'Carded Cotton' },
      { id: 'SSB-03', subId: 'SB-02', name: 'Polyester Filament' },
      { id: 'SSB-04', subId: 'SB-03', name: 'Single Jersey' }
    ]
  },
  uoms: [
    { id: 'UOM-01', code: 'KG', name: 'Kilograms', decimalPlaces: 2 },
    { id: 'UOM-02', code: 'MTR', name: 'Meters', decimalPlaces: 2 },
    { id: 'UOM-03', code: 'PCS', name: 'Pieces', decimalPlaces: 0 },
    { id: 'UOM-04', code: 'RLL', name: 'Rolls', decimalPlaces: 0 },
    { id: 'UOM-05', code: 'BOX', name: 'Boxes', decimalPlaces: 0 }
  ],
  locations: [
    { country: 'India', code: 'IN', states: ['Tamil Nadu', 'Gujarat', 'Maharashtra', 'Karnataka', 'Punjab', 'West Bengal', 'Rajasthan'] },
    { country: 'United Arab Emirates', code: 'AE', states: ['Dubai', 'Abu Dhabi', 'Sharjah'] },
    { country: 'United States', code: 'US', states: ['California', 'Texas', 'New York', 'North Carolina'] }
  ],
  products: [
    { id: 'PRD-001', name: 'Cotton Yarn 40s Combed', uom: 'KG', majorGroup: 'Yarn', subGroup: 'Cotton Yarn', subSubGroup: 'Combed Cotton', availableStock: 180, minReorderLevel: 50, avgRate: 210, stockValue: 37800, hsnCode: '52051210', gstRate: 5, status: 'Active', description: 'Premium quality 40s combed cotton yarn.' },
    { id: 'PRD-002', name: 'Polyester Yarn 150D/48F', uom: 'KG', majorGroup: 'Yarn', subGroup: 'Synthetic Yarn', subSubGroup: 'Polyester Filament', availableStock: 125, minReorderLevel: 30, avgRate: 160, stockValue: 20000, hsnCode: '54023300', gstRate: 12, status: 'Active', description: 'Textured polyester yarn.' }
  ],
  batches: {
    'PRD-001': [{ batchNo: 'B001', receivedDate: '2026-08-10', initialQty: 180, availableQty: 180, rate: 210, grnId: 'GRN-1090' }],
    'PRD-002': [{ batchNo: 'B002', receivedDate: '2026-08-12', initialQty: 125, availableQty: 125, rate: 160, grnId: 'GRN-1085' }]
  },
  purchaseOrders: [
    {
      id: 'PO-1042', supplierId: 'PTY-101', supplierName: 'ABC Traders', date: '2026-08-20', expectedDate: '2026-08-25', status: 'Received', itemsCount: 2, totalAmount: 42500, grnId: 'GRN-1092', grnDate: '2026-08-20', notes: 'Standard delivery via VRL Logistics.',
      items: [{ productId: 'PRD-001', productName: 'Cotton Yarn 40s Combed', qty: 100, uom: 'KG', rate: 210, amount: 21000 }],
      activity: [{ date: '2026-08-20 09:30', user: 'Admin', title: 'PO Created', detail: 'Purchase order PO-1042 issued.' }]
    }
  ],
  salesInvoices: [
    {
      id: 'INV-2081',
      customerId: 'PTY-104',
      customerName: 'XYZ Textiles',
      date: '2026-08-20',
      dueDate: '2026-09-04',
      status: 'Pending Approval',
      itemsCount: 2,
      subtotal: 49500,
      tax: 2475,
      totalAmount: 51975,
      items: [
        { productId: 'PRD-001', productName: 'Cotton Yarn 40s Combed', qty: 50, uom: 'KG', rate: 230, amount: 11500 }
      ]
    },
    {
      id: 'INV-2082',
      customerId: 'PTY-105',
      customerName: 'Fashion Crafters',
      date: '2026-08-19',
      dueDate: '2026-09-03',
      status: 'Pending Approval',
      itemsCount: 1,
      subtotal: 7200,
      tax: 864,
      totalAmount: 8064,
      items: [
        { productId: 'PRD-002', productName: 'Polyester Yarn 150D/48F', qty: 40, uom: 'KG', rate: 180, amount: 7200 }
      ]
    }
  ],
  recentActivities: [
    { id: 'ACT-01', code: 'INV-2081', party: 'XYZ Textiles', detail: '₹51,975 • Submitted for Approval', time: '10 mins ago', type: 'sales', status: 'Pending Approval' }
  ],
  notifications: [
    { id: 'N1', title: 'Invoice Approval Needed', message: 'INV-2081 (₹51,975) for XYZ Textiles requires approval.', time: '10m ago', unread: true }
  ]
};

window.ERP_MOCK_DATA = INITIAL_ERP_DATA;

export const ERPContext = createContext();
const STORAGE_KEY = 'PRIME_ERP_DATA_V2';

function loadInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.salesInvoices) && parsed.salesInvoices.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load localStorage:', e);
  }
  return INITIAL_ERP_DATA;
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
      newState = JSON.parse(JSON.stringify(INITIAL_ERP_DATA));
      break;
    }
    case 'ADD_PARTY': {
      const newParty = {
        id: `PTY-${100 + (state.parties?.length || 0) + 1}`,
        status: 'Active',
        ...action.payload
      };
      newState = { ...state, parties: [newParty, ...(state.parties || [])] };
      break;
    }
    case 'ADD_PRODUCT': {
      const newProd = {
        id: `PRD-00${(state.products?.length || 0) + 1}`,
        availableStock: parseFloat(action.payload.openingStock || 0),
        minReorderLevel: parseFloat(action.payload.minReorderLevel || 50),
        avgRate: parseFloat(action.payload.purchaseRate || 100),
        stockValue: (parseFloat(action.payload.openingStock || 0) * parseFloat(action.payload.purchaseRate || 100)),
        status: 'Active',
        ...action.payload
      };

      const updatedBatches = { ...(state.batches || {}) };
      if (newProd.availableStock > 0) {
        updatedBatches[newProd.id] = [
          {
            batchNo: `B0${(state.products?.length || 0) + 10}`,
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
        products: [newProd, ...(state.products || [])],
        batches: updatedBatches
      };
      break;
    }
    case 'CREATE_PO': {
      const newPO = {
        id: `PO-${1040 + (state.purchaseOrders?.length || 0) + 1}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        grnId: null,
        activity: [
          { date: new Date().toLocaleString(), user: 'Admin', title: 'PO Created', detail: 'Purchase order issued.' }
        ],
        ...action.payload
      };
      newState = { ...state, purchaseOrders: [newPO, ...(state.purchaseOrders || [])] };
      break;
    }
    case 'RECEIVE_GOODS': {
      const { poId, receivedItems, notes } = action.payload;
      const grnNumber = `GRN-${1090 + Math.floor(Math.random() * 90) + 10}`;
      const todayStr = new Date().toISOString().split('T')[0];

      const updatedPOs = (state.purchaseOrders || []).map(po => {
        if (po.id === poId) {
          const updatedItems = (po.items || []).map(item => {
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
              ...(po.activity || [])
            ]
          };
        }
        return po;
      });

      const newBatches = { ...(state.batches || {}) };
      const updatedProducts = (state.products || []).map(prod => {
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
        recentActivities: [newAct, ...(state.recentActivities || [])]
      };
      break;
    }
    case 'CREATE_INVOICE': {
      const invData = action.payload;
      const invNumber = `INV-${2080 + (state.salesInvoices?.length || 0) + 1}`;
      const todayStr = new Date().toISOString().split('T')[0];

      const newBatches = { ...(state.batches || {}) };
      const updatedProducts = (state.products || []).map(prod => {
        const invItem = (invData.items || []).find(i => i.productId === prod.id);
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
        status: 'Pending Approval',
        ...invData
      };

      const newAct = {
        id: `ACT-${Date.now()}`,
        code: invNumber,
        party: invData.customerName || 'Customer',
        detail: `₹${(invData.totalAmount || 0).toLocaleString('en-IN')} • Submitted for Approval`,
        time: 'Just now',
        type: 'sales',
        status: 'Pending Approval'
      };

      newState = {
        ...state,
        salesInvoices: [newInvoice, ...(state.salesInvoices || [])],
        products: updatedProducts,
        batches: newBatches,
        recentActivities: [newAct, ...(state.recentActivities || [])]
      };
      break;
    }
    case 'APPROVE_INVOICE': {
      const { invoiceId, approverName } = action.payload;
      const idStr = String(invoiceId).toLowerCase();

      const updatedInvoices = (state.salesInvoices || []).map(inv => {
        if (String(inv.id).toLowerCase() === idStr) {
          return { ...inv, status: 'Approved' };
        }
        return inv;
      });

      const targetInv = (state.salesInvoices || []).find(inv => String(inv.id).toLowerCase() === idStr);
      const newAct = {
        id: `ACT-${Date.now()}`,
        code: String(invoiceId),
        party: targetInv ? targetInv.customerName : 'Customer',
        detail: `Invoice ${invoiceId} Approved by ${approverName || 'Store Manager'}`,
        time: 'Just now',
        type: 'sales',
        status: 'Approved'
      };

      newState = {
        ...state,
        salesInvoices: updatedInvoices,
        recentActivities: [newAct, ...(state.recentActivities || [])]
      };
      break;
    }
    case 'REJECT_INVOICE': {
      const { invoiceId, reason } = action.payload;
      const idStr = String(invoiceId).toLowerCase();

      const updatedInvoices = (state.salesInvoices || []).map(inv => {
        if (String(inv.id).toLowerCase() === idStr) {
          return { ...inv, status: 'Rejected', rejectionReason: reason };
        }
        return inv;
      });

      const targetInv = (state.salesInvoices || []).find(inv => String(inv.id).toLowerCase() === idStr);
      const newAct = {
        id: `ACT-${Date.now()}`,
        code: String(invoiceId),
        party: targetInv ? targetInv.customerName : 'Customer',
        detail: `Invoice ${invoiceId} Rejected: ${reason || 'Not approved'}`,
        time: 'Just now',
        type: 'sales',
        status: 'Rejected'
      };

      newState = {
        ...state,
        salesInvoices: updatedInvoices,
        recentActivities: [newAct, ...(state.recentActivities || [])]
      };
      break;
    }
    default:
      return state;
  }

  return saveToLocalStorage(newState);
}

export function ERPProvider({ children }) {
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
    showToast('Data Restored', 'Restored sample dataset.');
  };

  const addParty = (partyData) => {
    dispatch({ type: 'ADD_PARTY', payload: partyData });
    showToast('Party Created', `${partyData.name} created.`);
  };

  const addProduct = (productData) => {
    dispatch({ type: 'ADD_PRODUCT', payload: productData });
    showToast('Product Created', `${productData.name} created.`);
  };

  const createPurchaseOrder = (poData) => {
    dispatch({ type: 'CREATE_PO', payload: poData });
    showToast('PO Generated', `Purchase Order generated.`);
  };

  const receiveGoods = (poId, receivedItems, notes, supplierName) => {
    dispatch({ type: 'RECEIVE_GOODS', payload: { poId, receivedItems, notes, supplierName } });
    showToast('Goods Received', `Stock & FIFO batch ledger updated.`);
  };

  const createSalesInvoice = (invData) => {
    dispatch({ type: 'CREATE_INVOICE', payload: invData });
    showToast('Invoice Submitted', `Invoice created and submitted for approval.`);
  };

  const approveInvoice = (invoiceId, approverName = 'Store Manager') => {
    dispatch({ type: 'APPROVE_INVOICE', payload: { invoiceId, approverName } });
    showToast('Invoice Approved', `Invoice ${invoiceId} has been approved.`);
  };

  const rejectInvoice = (invoiceId, reason = 'Spec mismatch') => {
    dispatch({ type: 'REJECT_INVOICE', payload: { invoiceId, reason } });
    showToast('Invoice Rejected', `Invoice ${invoiceId} rejected.`, 'error');
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
    approveInvoice,
    rejectInvoice,
    isCmdPaletteOpen,
    setIsCmdPaletteOpen,
    sidebarCollapsed,
    setSidebarCollapsed
  };

  return <ERPContext.Provider value={value}>{children}</ERPContext.Provider>;
}

export function useERP() {
  return useContext(ERPContext);
}

window.useERP = useERP;
