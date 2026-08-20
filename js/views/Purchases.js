(function () {
  const { useState } = React;

  window.PurchasesView = function ({ onNavigate }) {
    const { state, createPurchaseOrder, receiveGoods, addProduct, addParty } = window.useERP();
    const [selectedPO, setSelectedPO] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    // Drawer states
    const [isNewPODrawerOpen, setIsNewPODrawerOpen] = useState(false);
    const [isGRNDrawerOpen, setIsGRNDrawerOpen] = useState(false);
    const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
    const [isCreatePartyOpen, setIsCreatePartyOpen] = useState(false);

    // Form states for New PO
    const [poSupplierId, setPoSupplierId] = useState('');
    const [poExpectedDate, setPoExpectedDate] = useState('');
    const [poItems, setPoItems] = useState([
      { productId: '', qty: 100, rate: 0 }
    ]);

    // Form state for Inline Create Product
    const [newProdName, setNewProdName] = useState('');
    const [newProdUom, setNewProdUom] = useState('KG');
    const [newProdRate, setNewProdRate] = useState(200);

    // Form state for Inline Create Party
    const [newPartyName, setNewPartyName] = useState('');
    const [newPartyType, setNewPartyType] = useState('Supplier');
    const [newPartyPhone, setNewPartyPhone] = useState('');
    const [newPartyState, setNewPartyState] = useState('Tamil Nadu');

    // GRN Receiving state
    const [grnReceivedQtyMap, setGrnReceivedQtyMap] = useState({});
    const [grnBatchNoMap, setGrnBatchNoMap] = useState({});
    const [grnNotes, setGrnNotes] = useState('');

    // Filter POs
    const filteredPOs = state.purchaseOrders.filter(po => {
      const matchesSearch = po.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        po.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || po.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    const currentPO = selectedPO ? state.purchaseOrders.find(p => p.id === selectedPO.id) || selectedPO : null;

    // Handle PO creation
    const handleSavePO = () => {
      const supplier = state.parties.find(p => p.id === poSupplierId);
      if (!supplier || poItems.length === 0) return;

      const formattedItems = poItems.map(item => {
        const prod = state.products.find(p => p.id === item.productId);
        return {
          productId: item.productId,
          productName: prod ? prod.name : 'Custom Product',
          qty: parseFloat(item.qty || 1),
          uom: prod ? prod.uom : 'KG',
          rate: parseFloat(item.rate || (prod ? prod.avgRate : 100)),
          amount: parseFloat(item.qty || 1) * parseFloat(item.rate || (prod ? prod.avgRate : 100))
        };
      });

      const totalAmount = formattedItems.reduce((acc, i) => acc + i.amount, 0);

      createPurchaseOrder({
        supplierId: supplier.id,
        supplierName: supplier.name,
        expectedDate: poExpectedDate || '2026-08-25',
        itemsCount: formattedItems.length,
        totalAmount,
        items: formattedItems
      });

      setIsNewPODrawerOpen(false);
      setPoSupplierId('');
      setPoItems([{ productId: '', qty: 100, rate: 0 }]);
    };

    // Handle GRN Receive Goods
    const handleOpenGRNDrawer = () => {
      if (!currentPO) return;
      const initialQtyMap = {};
      const initialBatchMap = {};
      currentPO.items.forEach((item, idx) => {
        const remaining = Math.max(0, item.qty - (item.receivedQty || 0));
        initialQtyMap[item.productId] = remaining;
        initialBatchMap[item.productId] = `B${Math.floor(Math.random() * 900) + 100}`;
      });
      setGrnReceivedQtyMap(initialQtyMap);
      setGrnBatchNoMap(initialBatchMap);
      setIsGRNDrawerOpen(true);
    };

    const handleConfirmGRN = () => {
      if (!currentPO) return;
      const receivedItemsList = currentPO.items.map(item => ({
        productId: item.productId,
        receivedQty: parseFloat(grnReceivedQtyMap[item.productId] || 0),
        rate: item.rate,
        batchNo: grnBatchNoMap[item.productId] || 'B001'
      }));

      receiveGoods(currentPO.id, receivedItemsList, grnNotes, currentPO.supplierName);
      setIsGRNDrawerOpen(false);
      setGrnNotes('');
    };

    // Inline Product Save
    const handleInlineSaveProduct = () => {
      if (!newProdName) return;
      addProduct({
        name: newProdName,
        uom: newProdUom,
        majorGroup: 'Yarn',
        subGroup: 'Cotton Yarn',
        subSubGroup: 'Combed Cotton',
        purchaseRate: parseFloat(newProdRate),
        openingStock: 0
      });
      setNewProdName('');
      setIsCreateProductOpen(false);
    };

    // Inline Party Save
    const handleInlineSaveParty = () => {
      if (!newPartyName) return;
      addParty({
        name: newPartyName,
        type: newPartyType,
        phone: newPartyPhone || '+91 98420 00000',
        location: `Coimbatore, ${newPartyState}`,
        country: 'India',
        state: newPartyState
      });
      setNewPartyName('');
      setIsCreatePartyOpen(false);
    };

    // Render PO Workspace if a PO is selected
    if (currentPO) {
      return React.createElement('div', { className: 'space-y-6 max-w-7xl mx-auto' },
        
        // Workspace Top Bar
        React.createElement('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200' },
          React.createElement('div', { className: 'flex items-center gap-3' },
            React.createElement('button', {
              onClick: () => setSelectedPO(null),
              className: 'p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors'
            }, React.createElement(window.Icon, { name: 'ArrowLeft', className: 'w-5 h-5' })),

            React.createElement('div', null,
              React.createElement('div', { className: 'flex items-center gap-3' },
                React.createElement('h1', { className: 'text-xl font-bold text-slate-900 font-mono tracking-tight' }, currentPO.id),
                React.createElement(window.StatusBadge, { status: currentPO.status })
              ),
              React.createElement('p', { className: 'text-xs text-slate-500 mt-0.5 font-medium' },
                `Supplier: ${currentPO.supplierName} • Order Date: ${currentPO.date}`
              )
            )
          ),

          React.createElement('div', { className: 'flex items-center gap-2' },
            currentPO.status !== 'Received' && currentPO.status !== 'Cancelled' &&
            React.createElement(window.Button, {
              variant: 'accent',
              size: 'md',
              onClick: handleOpenGRNDrawer
            },
              React.createElement(window.Icon, { name: 'Truck', className: 'w-4 h-4' }),
              'Receive Goods (GRN)'
            ),

            React.createElement(window.Button, { variant: 'secondary', size: 'md' },
              React.createElement(window.Icon, { name: 'Printer', className: 'w-4 h-4' }),
              'Print PO'
            )
          )
        ),

        // Workspace Navigation Tabs
        React.createElement('div', { className: 'border-b border-slate-200 flex items-center gap-6 text-xs font-semibold text-slate-500' },
          ['Overview', 'Items', 'Receiving', 'Activity'].map(tab => {
            const key = tab.toLowerCase();
            const isActive = activeTab === key;
            return React.createElement('button', {
              key,
              onClick: () => setActiveTab(key),
              className: `pb-2.5 transition-colors border-b-2 cursor-pointer ${
                isActive ? 'border-slate-900 text-slate-900 font-bold' : 'border-transparent hover:text-slate-800'
              }`
            }, tab);
          })
        ),

        // TAB 1: OVERVIEW
        activeTab === 'overview' && React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-6' },
          React.createElement('div', { className: 'md:col-span-2 bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-4' },
            React.createElement('h3', { className: 'text-sm font-bold text-slate-900 border-b border-slate-100 pb-2' }, 'Supplier & Order Details'),
            React.createElement('div', { className: 'grid grid-cols-2 gap-4 text-xs' },
              React.createElement('div', null,
                React.createElement('span', { className: 'text-slate-400 font-semibold block uppercase text-[10px]' }, 'Supplier Name'),
                React.createElement('span', { className: 'font-bold text-slate-900 mt-0.5 block' }, currentPO.supplierName)
              ),
              React.createElement('div', null,
                React.createElement('span', { className: 'text-slate-400 font-semibold block uppercase text-[10px]' }, 'PO Date'),
                React.createElement('span', { className: 'font-semibold text-slate-800 mt-0.5 block' }, currentPO.date)
              ),
              React.createElement('div', null,
                React.createElement('span', { className: 'text-slate-400 font-semibold block uppercase text-[10px]' }, 'Expected Delivery'),
                React.createElement('span', { className: 'font-semibold text-slate-800 mt-0.5 block' }, currentPO.expectedDate || '2026-08-25')
              ),
              React.createElement('div', null,
                React.createElement('span', { className: 'text-slate-400 font-semibold block uppercase text-[10px]' }, 'GRN Status'),
                React.createElement('span', { className: 'font-semibold text-slate-800 mt-0.5 block font-mono' }, currentPO.grnId || 'Pending GRN')
              )
            ),
            React.createElement('div', { className: 'pt-3 border-t border-slate-100 text-xs' },
              React.createElement('span', { className: 'text-slate-400 font-semibold block uppercase text-[10px]' }, 'Delivery Notes'),
              React.createElement('p', { className: 'text-slate-600 mt-1 leading-relaxed' }, currentPO.notes || 'Standard logistics delivery terms.')
            )
          ),

          React.createElement('div', { className: 'bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-4' },
            React.createElement('h3', { className: 'text-sm font-bold text-slate-900 border-b border-slate-100 pb-2' }, 'Financial Summary'),
            React.createElement('div', { className: 'space-y-2 text-xs' },
              React.createElement('div', { className: 'flex justify-between text-slate-600' },
                React.createElement('span', null, 'Subtotal'),
                React.createElement('span', { className: 'font-mono' }, `₹${(currentPO.totalAmount * 0.95).toLocaleString('en-IN')}`)
              ),
              React.createElement('div', { className: 'flex justify-between text-slate-600' },
                React.createElement('span', null, 'Estimated GST (5%)'),
                React.createElement('span', { className: 'font-mono' }, `₹${(currentPO.totalAmount * 0.05).toLocaleString('en-IN')}`)
              ),
              React.createElement('div', { className: 'flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-100' },
                React.createElement('span', null, 'Total PO Value'),
                React.createElement('span', { className: 'font-mono' }, `₹${currentPO.totalAmount.toLocaleString('en-IN')}`)
              )
            )
          )
        ),

        // TAB 2: ITEMS WORKSPACE
        activeTab === 'items' && React.createElement('div', { className: 'bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs space-y-4 p-5' },
          React.createElement('div', { className: 'flex items-center justify-between' },
            React.createElement('h3', { className: 'text-sm font-bold text-slate-900' }, 'Line Items in PO'),
            React.createElement(window.Button, {
              size: 'sm',
              variant: 'secondary',
              onClick: () => setIsCreateProductOpen(true)
            },
              React.createElement(window.Icon, { name: 'Plus', className: 'w-3.5 h-3.5' }),
              'Create Missing Product'
            )
          ),

          React.createElement('table', { className: 'w-full text-left text-xs border-collapse' },
            React.createElement('thead', { className: 'bg-slate-50 border-y border-slate-200/80 font-semibold text-slate-600 uppercase tracking-wider text-[10px]' },
              React.createElement('tr', null,
                React.createElement('th', { className: 'py-2.5 px-3' }, 'Product Name'),
                React.createElement('th', { className: 'py-2.5 px-3 text-right' }, 'Ordered Qty'),
                React.createElement('th', { className: 'py-2.5 px-3 text-center' }, 'UOM'),
                React.createElement('th', { className: 'py-2.5 px-3 text-right' }, 'Unit Rate (₹)'),
                React.createElement('th', { className: 'py-2.5 px-3 text-right' }, 'Total Amount (₹)')
              )
            ),
            React.createElement('tbody', { className: 'divide-y divide-slate-100 font-medium text-slate-800' },
              currentPO.items.map((item, idx) => React.createElement('tr', { key: idx, className: 'hover:bg-slate-50/50' },
                React.createElement('td', { className: 'py-3 px-3 font-semibold text-slate-900' }, item.productName),
                React.createElement('td', { className: 'py-3 px-3 text-right font-mono font-semibold' }, item.qty),
                React.createElement('td', { className: 'py-3 px-3 text-center font-mono text-slate-500' }, item.uom),
                React.createElement('td', { className: 'py-3 px-3 text-right font-mono' }, `₹${item.rate}`),
                React.createElement('td', { className: 'py-3 px-3 text-right font-mono font-bold text-slate-900' }, `₹${item.amount.toLocaleString('en-IN')}`)
              ))
            )
          )
        ),

        // TAB 3: RECEIVING & GRN LOGS
        activeTab === 'receiving' && React.createElement('div', { className: 'bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-4' },
          React.createElement('div', { className: 'flex items-center justify-between border-b border-slate-100 pb-3' },
            React.createElement('div', null,
              React.createElement('h3', { className: 'text-sm font-bold text-slate-900' }, 'Goods Receipt Notes (GRN)'),
              React.createElement('p', { className: 'text-xs text-slate-500 mt-0.5' }, 'Receiving automatically updates FIFO inventory queues.')
            ),
            currentPO.status !== 'Received' && React.createElement(window.Button, { size: 'sm', variant: 'accent', onClick: handleOpenGRNDrawer },
              React.createElement(window.Icon, { name: 'Truck', className: 'w-3.5 h-3.5' }), 'Receive Goods'
            )
          ),

          currentPO.grnId ? React.createElement('div', { className: 'border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-2 text-xs' },
            React.createElement('div', { className: 'flex items-center justify-between' },
              React.createElement('span', { className: 'font-bold font-mono text-slate-900 text-sm' }, currentPO.grnId),
              React.createElement('span', { className: 'text-slate-500' }, currentPO.grnDate || '2026-08-20')
            ),
            React.createElement('p', { className: 'text-slate-600' }, 'All line items received into Warehouse A. Stock quantities updated successfully.')
          ) : React.createElement('div', { className: 'py-8 text-center text-xs text-slate-400 font-medium' }, 'No GRN recorded yet. Click "Receive Goods" to log arrival.')
        ),

        // TAB 4: AUDIT ACTIVITY
        activeTab === 'activity' && React.createElement('div', { className: 'bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-4' },
          React.createElement('h3', { className: 'text-sm font-bold text-slate-900 border-b border-slate-100 pb-3' }, 'PO Activity Log'),
          React.createElement('div', { className: 'space-y-3 text-xs' },
            currentPO.activity.map((act, idx) => React.createElement('div', { key: idx, className: 'flex items-start gap-3' },
              React.createElement('div', { className: 'w-2 h-2 rounded-full bg-slate-900 mt-1.5' }),
              React.createElement('div', null,
                React.createElement('p', { className: 'font-bold text-slate-900' }, `${act.title} • ${act.user}`),
                React.createElement('p', { className: 'text-slate-500 mt-0.5' }, act.detail),
                React.createElement('span', { className: 'text-[10px] text-slate-400 mt-1 block font-mono' }, act.date)
              )
            ))
          )
        ),

        // GRN RECEIVING SIDE PANEL DRAWER
        React.createElement(window.Drawer, {
          isOpen: isGRNDrawerOpen,
          onClose: () => setIsGRNDrawerOpen(false),
          title: `Receive Goods - ${currentPO.id}`,
          subtitle: `Supplier: ${currentPO.supplierName}`,
          footer: React.createElement('div', { className: 'flex items-center gap-2' },
            React.createElement(window.Button, { variant: 'secondary', size: 'md', onClick: () => setIsGRNDrawerOpen(false) }, 'Cancel'),
            React.createElement(window.Button, { variant: 'primary', size: 'md', onClick: handleConfirmGRN }, 'Confirm & Update Stock')
          )
        },
          React.createElement('div', { className: 'space-y-5 text-xs' },
            React.createElement('div', { className: 'p-3 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-900 text-[11px] leading-relaxed' },
              React.createElement('p', { className: 'font-semibold flex items-center gap-1.5' },
                React.createElement(window.Icon, { name: 'Info', className: 'w-4 h-4 text-indigo-600' }),
                'Inventory & FIFO Mechanics'
              ),
              'Entering received quantities will automatically generate a new GRN log, create FIFO batch entries, and update product available stock in real time.'
            ),

            currentPO.items.map((item) => {
              const remaining = Math.max(0, item.qty - (item.receivedQty || 0));
              return React.createElement('div', { key: item.productId, className: 'p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs' },
                React.createElement('div', { className: 'flex justify-between font-bold text-slate-900' },
                  React.createElement('span', null, item.productName),
                  React.createElement('span', { className: 'text-slate-500 font-mono text-[11px]' }, `Ordered: ${item.qty} ${item.uom}`)
                ),

                React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
                  React.createElement(window.Input, {
                    label: 'Received Qty',
                    type: 'number',
                    value: grnReceivedQtyMap[item.productId] ?? remaining,
                    onChange: (e) => setGrnReceivedQtyMap({ ...grnReceivedQtyMap, [item.productId]: e.target.value })
                  }),
                  React.createElement(window.Input, {
                    label: 'Batch Number',
                    value: grnBatchNoMap[item.productId] || 'B001',
                    onChange: (e) => setGrnBatchNoMap({ ...grnBatchNoMap, [item.productId]: e.target.value })
                  })
                )
              );
            }),

            React.createElement(window.Input, {
              label: 'GRN Remarks / Delivery Note',
              placeholder: 'E.g. Received via VRL Logistics truck #TN38-1234',
              value: grnNotes,
              onChange: (e) => setGrnNotes(e.target.value)
            })
          )
        )
      );
    }

    // MAIN PURCHASES LIST TABLE VIEW
    return React.createElement('div', { className: 'space-y-6 max-w-7xl mx-auto' },

      // Header Bar
      React.createElement('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200' },
        React.createElement('div', null,
          React.createElement('h1', { className: 'text-xl font-bold text-slate-900 tracking-tight' }, 'Purchases'),
          React.createElement('p', { className: 'text-xs text-slate-500 mt-0.5' }, 'Manage Purchase Orders, GRNs, and Supplier Transactions')
        ),
        React.createElement(window.Button, { variant: 'primary', size: 'md', onClick: () => setIsNewPODrawerOpen(true) },
          React.createElement(window.Icon, { name: 'Plus', className: 'w-4 h-4' }),
          'New Purchase Order'
        )
      ),

      // Filters & Search Bar
      React.createElement('div', { className: 'flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs' },
        React.createElement('div', { className: 'w-full sm:w-72' },
          React.createElement(window.Input, {
            icon: 'Search',
            placeholder: 'Search PO number, supplier...',
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value)
          })
        ),

        React.createElement('div', { className: 'flex items-center gap-2 overflow-x-auto w-full sm:w-auto text-xs font-medium text-slate-600' },
          ['All', 'Pending', 'Partial', 'Received', 'Cancelled'].map(st => React.createElement('button', {
            key: st,
            onClick: () => setStatusFilter(st),
            className: `px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              statusFilter === st ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`
          }, st))
        )
      ),

      // PO Data Table
      React.createElement('div', { className: 'bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs' },
        React.createElement('table', { className: 'w-full text-left text-xs border-collapse' },
          React.createElement('thead', { className: 'bg-slate-50/80 border-b border-slate-200/80 font-semibold text-slate-600 uppercase tracking-wider text-[10px]' },
            React.createElement('tr', null,
              React.createElement('th', { className: 'py-3 px-4' }, 'PO Number'),
              React.createElement('th', { className: 'py-3 px-4' }, 'Supplier'),
              React.createElement('th', { className: 'py-3 px-4' }, 'Date'),
              React.createElement('th', { className: 'py-3 px-4 text-center' }, 'Items'),
              React.createElement('th', { className: 'py-3 px-4 text-right' }, 'Total Amount (₹)'),
              React.createElement('th', { className: 'py-3 px-4 text-center' }, 'Status'),
              React.createElement('th', { className: 'py-3 px-4 text-right' }, 'Action')
            )
          ),
          React.createElement('tbody', { className: 'divide-y divide-slate-100 font-medium text-slate-800' },
            filteredPOs.map(po => React.createElement('tr', {
              key: po.id,
              onClick: () => setSelectedPO(po),
              className: 'hover:bg-slate-50/80 transition-colors cursor-pointer'
            },
              React.createElement('td', { className: 'py-3 px-4 font-bold font-mono text-slate-900' }, po.id),
              React.createElement('td', { className: 'py-3 px-4 font-semibold text-slate-900' }, po.supplierName),
              React.createElement('td', { className: 'py-3 px-4 text-slate-500' }, po.date),
              React.createElement('td', { className: 'py-3 px-4 text-center font-mono' }, `${po.itemsCount} items`),
              React.createElement('td', { className: 'py-3 px-4 text-right font-mono font-bold text-slate-900' }, `₹${po.totalAmount.toLocaleString('en-IN')}`),
              React.createElement('td', { className: 'py-3 px-4 text-center' },
                React.createElement(window.StatusBadge, { status: po.status })
              ),
              React.createElement('td', { className: 'py-3 px-4 text-right' },
                React.createElement(window.Button, { size: 'sm', variant: 'ghost' }, 'View')
              )
            ))
          )
        )
      ),

      // NEW PURCHASE ORDER DRAWER
      React.createElement(window.Drawer, {
        isOpen: isNewPODrawerOpen,
        onClose: () => setIsNewPODrawerOpen(false),
        title: 'Create Purchase Order',
        subtitle: 'Issue a new PO to a registered supplier',
        footer: React.createElement('div', { className: 'flex items-center gap-2' },
          React.createElement(window.Button, { variant: 'secondary', size: 'md', onClick: () => setIsNewPODrawerOpen(false) }, 'Cancel'),
          React.createElement(window.Button, { variant: 'primary', size: 'md', onClick: handleSavePO }, 'Generate PO')
        )
      },
        React.createElement('div', { className: 'space-y-4 text-xs' },
          
          // Supplier Combobox with Inline Create Supplier Trigger
          React.createElement(window.Combobox, {
            label: 'Select Supplier',
            placeholder: 'Search supplier...',
            options: state.parties.filter(p => p.type === 'Supplier' || p.type === 'Both').map(p => ({ label: p.name, value: p.id, sublabel: p.location })),
            value: poSupplierId,
            onChange: (val) => setPoSupplierId(val),
            onCreateNew: () => setIsCreatePartyOpen(true),
            createLabel: '+ Create new supplier'
          }),

          React.createElement(window.Input, {
            label: 'Expected Delivery Date',
            type: 'date',
            value: poExpectedDate,
            onChange: (e) => setPoExpectedDate(e.target.value)
          }),

          // Dynamic Line Items Section
          React.createElement('div', { className: 'space-y-3 pt-3 border-t border-slate-100' },
            React.createElement('div', { className: 'flex items-center justify-between' },
              React.createElement('h4', { className: 'font-bold text-slate-900' }, 'Order Line Items'),
              React.createElement('button', {
                type: 'button',
                onClick: () => setPoItems([...poItems, { productId: '', qty: 100, rate: 0 }]),
                className: 'text-xs font-semibold text-indigo-600 hover:text-indigo-800'
              }, '+ Add Item')
            ),

            poItems.map((item, idx) => React.createElement('div', { key: idx, className: 'p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2' },
              React.createElement(window.Combobox, {
                label: `Item #${idx + 1}`,
                placeholder: 'Select product...',
                options: state.products.map(p => ({ label: p.name, value: p.id, sublabel: `Stock: ${p.availableStock} ${p.uom}` })),
                value: item.productId,
                onChange: (val) => {
                  const prod = state.products.find(p => p.id === val);
                  const updated = [...poItems];
                  updated[idx] = { ...updated[idx], productId: val, rate: prod ? prod.avgRate : 200 };
                  setPoItems(updated);
                },
                onCreateNew: () => setIsCreateProductOpen(true),
                createLabel: '+ Create product'
              }),

              React.createElement('div', { className: 'grid grid-cols-2 gap-2' },
                React.createElement(window.Input, {
                  label: 'Qty',
                  type: 'number',
                  value: item.qty,
                  onChange: (e) => {
                    const updated = [...poItems];
                    updated[idx].qty = e.target.value;
                    setPoItems(updated);
                  }
                }),
                React.createElement(window.Input, {
                  label: 'Rate (₹)',
                  type: 'number',
                  value: item.rate,
                  onChange: (e) => {
                    const updated = [...poItems];
                    updated[idx].rate = e.target.value;
                    setPoItems(updated);
                  }
                })
              )
            ))
          )
        )
      ),

      // INLINE CREATE PRODUCT DRAWER
      React.createElement(window.Drawer, {
        isOpen: isCreateProductOpen,
        onClose: () => setIsCreateProductOpen(false),
        title: 'Create Missing Product',
        subtitle: 'Add a new product without losing PO workflow context',
        footer: React.createElement('div', { className: 'flex items-center gap-2' },
          React.createElement(window.Button, { variant: 'secondary', size: 'md', onClick: () => setIsCreateProductOpen(false) }, 'Cancel'),
          React.createElement(window.Button, { variant: 'primary', size: 'md', onClick: handleInlineSaveProduct }, 'Save Product')
        )
      },
        React.createElement('div', { className: 'space-y-4 text-xs' },
          React.createElement(window.Input, {
            label: 'Product Name',
            placeholder: 'E.g. Viscose Yarn 40s',
            value: newProdName,
            onChange: (e) => setNewProdName(e.target.value)
          }),
          React.createElement(window.Select, {
            label: 'Unit of Measure (UOM)',
            options: state.uoms.map(u => ({ label: `${u.name} (${u.code})`, value: u.code })),
            value: newProdUom,
            onChange: (e) => setNewProdUom(e.target.value)
          }),
          React.createElement(window.Input, {
            label: 'Standard Rate (₹)',
            type: 'number',
            value: newProdRate,
            onChange: (e) => setNewProdRate(e.target.value)
          })
        )
      ),

      // INLINE CREATE PARTY DRAWER
      React.createElement(window.Drawer, {
        isOpen: isCreatePartyOpen,
        onClose: () => setIsCreatePartyOpen(false),
        title: 'Create Supplier / Party',
        subtitle: 'Quickly register a new party inline',
        footer: React.createElement('div', { className: 'flex items-center gap-2' },
          React.createElement(window.Button, { variant: 'secondary', size: 'md', onClick: () => setIsCreatePartyOpen(false) }, 'Cancel'),
          React.createElement(window.Button, { variant: 'primary', size: 'md', onClick: handleInlineSaveParty }, 'Save Party')
        )
      },
        React.createElement('div', { className: 'space-y-4 text-xs' },
          React.createElement(window.Input, {
            label: 'Party Name',
            placeholder: 'E.g. Sri Lakshmi Yarns',
            value: newPartyName,
            onChange: (e) => setNewPartyName(e.target.value)
          }),
          React.createElement(window.Select, {
            label: 'Party Type',
            options: ['Supplier', 'Customer', 'Both'],
            value: newPartyType,
            onChange: (e) => setNewPartyType(e.target.value)
          }),
          React.createElement(window.Input, {
            label: 'Phone Number',
            placeholder: '+91 98421 00000',
            value: newPartyPhone,
            onChange: (e) => setNewPartyPhone(e.target.value)
          })
        )
      )
    );
  };
})();
