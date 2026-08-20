(function () {
  const { useState } = React;

  window.SalesView = function ({ onNavigate }) {
    const { state, createSalesInvoice, addParty, addProduct } = window.useERP();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);

    // Form states for New Invoice
    const [invCustomerId, setInvCustomerId] = useState('');
    const [invDueDate, setInvDueDate] = useState('');
    const [gstRate, setGstRate] = useState(5);
    const [invItems, setInvItems] = useState([
      { productId: '', qty: 10, rate: 0 }
    ]);

    // Inline Drawer states
    const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState(false);
    const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);

    // Inline Customer state
    const [custName, setCustName] = useState('');
    const [custPhone, setCustPhone] = useState('');
    const [custState, setCustState] = useState('Gujarat');

    // Inline Product state
    const [prodName, setProdName] = useState('');
    const [prodUom, setProdUom] = useState('KG');
    const [prodRate, setProdRate] = useState(250);

    const filteredInvoices = state.salesInvoices.filter(inv => {
      const matchesSearch = inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Calculate totals for New Invoice
    const formattedLineItems = invItems.map(item => {
      const prod = state.products.find(p => p.id === item.productId);
      const qty = parseFloat(item.qty || 0);
      const rate = parseFloat(item.rate || (prod ? prod.avgRate * 1.15 : 200));
      return {
        productId: item.productId,
        productName: prod ? prod.name : 'Product',
        uom: prod ? prod.uom : 'KG',
        qty,
        rate: Math.round(rate),
        amount: Math.round(qty * rate)
      };
    });

    const subtotal = formattedLineItems.reduce((acc, i) => acc + i.amount, 0);
    const taxAmount = Math.round(subtotal * (gstRate / 100));
    const grandTotal = subtotal + taxAmount;

    const handleCreateInvoice = () => {
      const customer = state.parties.find(p => p.id === invCustomerId);
      if (!customer || invItems.length === 0 || subtotal === 0) return;

      createSalesInvoice({
        customerId: customer.id,
        customerName: customer.name,
        dueDate: invDueDate || '2026-09-05',
        itemsCount: formattedLineItems.length,
        subtotal,
        tax: taxAmount,
        totalAmount: grandTotal,
        items: formattedLineItems
      });

      setIsNewInvoiceOpen(false);
      setInvCustomerId('');
      setInvItems([{ productId: '', qty: 10, rate: 0 }]);
    };

    const handleSaveInlineCustomer = () => {
      if (!custName) return;
      addParty({
        name: custName,
        type: 'Customer',
        phone: custPhone || '+91 98250 00000',
        location: `Surat, ${custState}`,
        country: 'India',
        state: custState
      });
      setCustName('');
      setIsCreateCustomerOpen(false);
    };

    const handleSaveInlineProduct = () => {
      if (!prodName) return;
      addProduct({
        name: prodName,
        uom: prodUom,
        majorGroup: 'Yarn',
        subGroup: 'Cotton Yarn',
        subSubGroup: 'Combed Cotton',
        purchaseRate: parseFloat(prodRate * 0.85),
        openingStock: 100
      });
      setProdName('');
      setIsCreateProductOpen(false);
    };

    return React.createElement('div', { className: 'space-y-6 max-w-7xl mx-auto' },

      // Header Bar
      React.createElement('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200' },
        React.createElement('div', null,
          React.createElement('h1', { className: 'text-xl font-bold text-slate-900 tracking-tight' }, 'Sales & Invoicing'),
          React.createElement('p', { className: 'text-xs text-slate-500 mt-0.5' }, 'Customer Invoices, Payment Tracking, and Stock Dispatch')
        ),
        React.createElement(window.Button, { variant: 'primary', size: 'md', onClick: () => setIsNewInvoiceOpen(true) },
          React.createElement(window.Icon, { name: 'Plus', className: 'w-4 h-4' }),
          'New Invoice'
        )
      ),

      // Filters Bar
      React.createElement('div', { className: 'flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs' },
        React.createElement('div', { className: 'w-full sm:w-72' },
          React.createElement(window.Input, {
            icon: 'Search',
            placeholder: 'Search invoice no, customer...',
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value)
          })
        ),

        React.createElement('div', { className: 'flex items-center gap-2 overflow-x-auto text-xs font-medium text-slate-600' },
          ['All', 'Paid', 'Pending', 'Overdue'].map(st => React.createElement('button', {
            key: st,
            onClick: () => setStatusFilter(st),
            className: `px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              statusFilter === st ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`
          }, st))
        )
      ),

      // Sales Invoices Data Table
      React.createElement('div', { className: 'bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs' },
        React.createElement('table', { className: 'w-full text-left text-xs border-collapse' },
          React.createElement('thead', { className: 'bg-slate-50/80 border-b border-slate-200/80 font-semibold text-slate-600 uppercase tracking-wider text-[10px]' },
            React.createElement('tr', null,
              React.createElement('th', { className: 'py-3 px-4' }, 'Invoice No'),
              React.createElement('th', { className: 'py-3 px-4' }, 'Customer'),
              React.createElement('th', { className: 'py-3 px-4' }, 'Date'),
              React.createElement('th', { className: 'py-3 px-4 text-center' }, 'Items'),
              React.createElement('th', { className: 'py-3 px-4 text-right' }, 'Total Amount (₹)'),
              React.createElement('th', { className: 'py-3 px-4 text-center' }, 'Status'),
              React.createElement('th', { className: 'py-3 px-4 text-right' }, 'Action')
            )
          ),
          React.createElement('tbody', { className: 'divide-y divide-slate-100 font-medium text-slate-800' },
            filteredInvoices.map(inv => React.createElement('tr', { key: inv.id, className: 'hover:bg-slate-50/80 transition-colors' },
              React.createElement('td', { className: 'py-3 px-4 font-bold font-mono text-slate-900' }, inv.id),
              React.createElement('td', { className: 'py-3 px-4 font-semibold text-slate-900' }, inv.customerName),
              React.createElement('td', { className: 'py-3 px-4 text-slate-500' }, inv.date),
              React.createElement('td', { className: 'py-3 px-4 text-center font-mono' }, `${inv.itemsCount} items`),
              React.createElement('td', { className: 'py-3 px-4 text-right font-mono font-bold text-slate-900' }, `₹${inv.totalAmount.toLocaleString('en-IN')}`),
              React.createElement('td', { className: 'py-3 px-4 text-center' },
                React.createElement(window.StatusBadge, { status: inv.status })
              ),
              React.createElement('td', { className: 'py-3 px-4 text-right' },
                React.createElement(window.Button, { size: 'sm', variant: 'ghost' }, 'Print')
              )
            ))
          )
        )
      ),

      // FAST INVOICE CREATION WORKSPACE DRAWER
      React.createElement(window.Drawer, {
        isOpen: isNewInvoiceOpen,
        onClose: () => setIsNewInvoiceOpen(false),
        title: 'Create Sales Invoice',
        subtitle: 'Generates customer invoice and deducts stock via FIFO',
        footer: React.createElement('div', { className: 'flex items-center gap-2' },
          React.createElement(window.Button, { variant: 'secondary', size: 'md', onClick: () => setIsNewInvoiceOpen(false) }, 'Cancel'),
          React.createElement(window.Button, { variant: 'primary', size: 'md', onClick: handleCreateInvoice }, 'Create Invoice & Dispatch Stock')
        )
      },
        React.createElement('div', { className: 'space-y-4 text-xs' },
          
          // Customer Combobox with Inline Create Customer Trigger
          React.createElement(window.Combobox, {
            label: 'Select Customer',
            placeholder: 'Search customer name...',
            options: state.parties.filter(p => p.type === 'Customer' || p.type === 'Both').map(p => ({ label: p.name, value: p.id, sublabel: p.location })),
            value: invCustomerId,
            onChange: (val) => setInvCustomerId(val),
            onCreateNew: () => setIsCreateCustomerOpen(true),
            createLabel: '+ Create new customer'
          }),

          React.createElement(window.Input, {
            label: 'Payment Due Date',
            type: 'date',
            value: invDueDate,
            onChange: (e) => setInvDueDate(e.target.value)
          }),

          // Line Items
          React.createElement('div', { className: 'space-y-3 pt-3 border-t border-slate-100' },
            React.createElement('div', { className: 'flex items-center justify-between' },
              React.createElement('h4', { className: 'font-bold text-slate-900' }, 'Invoice Products'),
              React.createElement('button', {
                type: 'button',
                onClick: () => setInvItems([...invItems, { productId: '', qty: 10, rate: 0 }]),
                className: 'text-xs font-semibold text-indigo-600 hover:text-indigo-800'
              }, '+ Add Line Item')
            ),

            invItems.map((item, idx) => {
              const selectedProd = state.products.find(p => p.id === item.productId);
              return React.createElement('div', { key: idx, className: 'p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2' },
                React.createElement(window.Combobox, {
                  label: `Item #${idx + 1}`,
                  placeholder: 'Search product...',
                  options: state.products.map(p => ({ label: p.name, value: p.id, sublabel: `Avail Stock: ${p.availableStock} ${p.uom}` })),
                  value: item.productId,
                  onChange: (val) => {
                    const prod = state.products.find(p => p.id === val);
                    const updated = [...invItems];
                    updated[idx] = { ...updated[idx], productId: val, rate: prod ? Math.round(prod.avgRate * 1.15) : 250 };
                    setInvItems(updated);
                  },
                  onCreateNew: () => setIsCreateProductOpen(true),
                  createLabel: '+ Create product'
                }),

                selectedProd && React.createElement('div', { className: 'text-[11px] text-emerald-700 font-semibold flex items-center gap-1' },
                  React.createElement(window.Icon, { name: 'CheckCircle2', className: 'w-3 h-3' }),
                  `Available FIFO Stock: ${selectedProd.availableStock} ${selectedProd.uom}`
                ),

                React.createElement('div', { className: 'grid grid-cols-2 gap-2' },
                  React.createElement(window.Input, {
                    label: 'Qty',
                    type: 'number',
                    value: item.qty,
                    onChange: (e) => {
                      const updated = [...invItems];
                      updated[idx].qty = e.target.value;
                      setInvItems(updated);
                    }
                  }),
                  React.createElement(window.Input, {
                    label: 'Selling Rate (₹)',
                    type: 'number',
                    value: item.rate,
                    onChange: (e) => {
                      const updated = [...invItems];
                      updated[idx].rate = e.target.value;
                      setInvItems(updated);
                    }
                  })
                )
              );
            })
          ),

          // Total Calculation Summary Box
          React.createElement('div', { className: 'p-4 rounded-xl bg-slate-900 text-white space-y-2 mt-4' },
            React.createElement('div', { className: 'flex justify-between text-slate-300' },
              React.createElement('span', null, 'Subtotal'),
              React.createElement('span', { className: 'font-mono' }, `₹${subtotal.toLocaleString('en-IN')}`)
            ),
            React.createElement('div', { className: 'flex justify-between items-center text-slate-300' },
              React.createElement('span', null, 'GST Tax Rate'),
              React.createElement('select', {
                className: 'bg-slate-800 text-white rounded px-2 py-0.5 text-xs font-mono border border-slate-700 focus:outline-none',
                value: gstRate,
                onChange: (e) => setGstRate(parseFloat(e.target.value))
              },
                React.createElement('option', { value: 0 }, '0% Exempt'),
                React.createElement('option', { value: 5 }, '5% GST'),
                React.createElement('option', { value: 12 }, '12% GST'),
                React.createElement('option', { value: 18 }, '18% GST')
              )
            ),
            React.createElement('div', { className: 'flex justify-between font-bold text-sm text-white pt-2 border-t border-slate-800' },
              React.createElement('span', null, 'Grand Total'),
              React.createElement('span', { className: 'font-mono text-base text-emerald-400' }, `₹${grandTotal.toLocaleString('en-IN')}`)
            )
          )
        )
      ),

      // INLINE CREATE CUSTOMER DRAWER
      React.createElement(window.Drawer, {
        isOpen: isCreateCustomerOpen,
        onClose: () => setIsCreateCustomerOpen(false),
        title: 'Create Customer',
        subtitle: 'Quickly add customer without leaving invoice workspace',
        footer: React.createElement('div', { className: 'flex items-center gap-2' },
          React.createElement(window.Button, { variant: 'secondary', size: 'md', onClick: () => setIsCreateCustomerOpen(false) }, 'Cancel'),
          React.createElement(window.Button, { variant: 'primary', size: 'md', onClick: handleSaveInlineCustomer }, 'Save Customer')
        )
      },
        React.createElement('div', { className: 'space-y-4 text-xs' },
          React.createElement(window.Input, {
            label: 'Customer Name',
            placeholder: 'E.g. XYZ Fabrics',
            value: custName,
            onChange: (e) => setCustName(e.target.value)
          }),
          React.createElement(window.Input, {
            label: 'Phone Number',
            placeholder: '+91 98250 12345',
            value: custPhone,
            onChange: (e) => setCustPhone(e.target.value)
          }),
          React.createElement(window.Select, {
            label: 'State',
            options: ['Tamil Nadu', 'Gujarat', 'Maharashtra', 'Karnataka', 'Punjab'],
            value: custState,
            onChange: (e) => setCustState(e.target.value)
          })
        )
      ),

      // INLINE CREATE PRODUCT DRAWER FOR SALES
      React.createElement(window.Drawer, {
        isOpen: isCreateProductOpen,
        onClose: () => setIsCreateProductOpen(false),
        title: 'Create Product',
        subtitle: 'Add new product to master inline',
        footer: React.createElement('div', { className: 'flex items-center gap-2' },
          React.createElement(window.Button, { variant: 'secondary', size: 'md', onClick: () => setIsCreateProductOpen(false) }, 'Cancel'),
          React.createElement(window.Button, { variant: 'primary', size: 'md', onClick: handleSaveInlineProduct }, 'Save Product')
        )
      },
        React.createElement('div', { className: 'space-y-4 text-xs' },
          React.createElement(window.Input, {
            label: 'Product Name',
            value: prodName,
            onChange: (e) => setProdName(e.target.value)
          }),
          React.createElement(window.Select, {
            label: 'UOM',
            options: ['KG', 'MTR', 'PCS'],
            value: prodUom,
            onChange: (e) => setProdUom(e.target.value)
          }),
          React.createElement(window.Input, {
            label: 'Default Selling Rate (₹)',
            type: 'number',
            value: prodRate,
            onChange: (e) => setProdRate(e.target.value)
          })
        )
      )
    );
  };
})();
