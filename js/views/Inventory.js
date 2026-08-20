(function () {
  const { useState } = React;

  window.InventoryView = function ({ onNavigate }) {
    const { state } = window.useERP();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Filter products
    const filteredProducts = state.products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchesCategory = categoryFilter === 'All' || p.majorGroup === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });

    const activeProd = selectedProduct ? state.products.find(p => p.id === selectedProduct.id) || selectedProduct : null;
    const prodBatches = activeProd ? (state.batches[activeProd.id] || []) : [];

    return React.createElement('div', { className: 'space-y-6 max-w-7xl mx-auto' },

      // Header Bar
      React.createElement('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200' },
        React.createElement('div', null,
          React.createElement('h1', { className: 'text-xl font-bold text-slate-900 tracking-tight' }, 'Stock & FIFO Inventory'),
          React.createElement('p', { className: 'text-xs text-slate-500 mt-0.5' }, 'Real-time available stock levels and automated FIFO batch queues')
        ),
        React.createElement(window.Button, { variant: 'secondary', size: 'md', onClick: () => onNavigate('reports') },
          React.createElement(window.Icon, { name: 'FileSpreadsheet', className: 'w-4 h-4' }),
          'Valuation Report'
        )
      ),

      // Search & Filters Bar
      React.createElement('div', { className: 'flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs' },
        React.createElement('div', { className: 'w-full sm:w-80' },
          React.createElement(window.Input, {
            icon: 'Search',
            placeholder: 'Search product name, code...',
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value)
          })
        ),

        React.createElement('div', { className: 'flex flex-wrap items-center gap-2 w-full sm:w-auto text-xs' },
          React.createElement(window.Select, {
            options: ['All', 'Yarn', 'Fabric', 'Trims'],
            value: categoryFilter,
            onChange: (e) => setCategoryFilter(e.target.value),
            className: 'w-32'
          }),
          React.createElement(window.Select, {
            options: ['All', 'Active', 'Low Stock'],
            value: statusFilter,
            onChange: (e) => setStatusFilter(e.target.value),
            className: 'w-32'
          })
        )
      ),

      // Main Inventory Data Table
      React.createElement('div', { className: 'bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs' },
        React.createElement('table', { className: 'w-full text-left text-xs border-collapse' },
          React.createElement('thead', { className: 'bg-slate-50/80 border-b border-slate-200/80 font-semibold text-slate-600 uppercase tracking-wider text-[10px]' },
            React.createElement('tr', null,
              React.createElement('th', { className: 'py-3 px-4' }, 'Product Name'),
              React.createElement('th', { className: 'py-3 px-4 text-right' }, 'Available Stock'),
              React.createElement('th', { className: 'py-3 px-4 text-center' }, 'UOM'),
              React.createElement('th', { className: 'py-3 px-4 text-right' }, 'Average Rate (₹)'),
              React.createElement('th', { className: 'py-3 px-4 text-right' }, 'Stock Value (₹)'),
              React.createElement('th', { className: 'py-3 px-4 text-center' }, 'Status'),
              React.createElement('th', { className: 'py-3 px-4 text-right' }, 'Batches')
            )
          ),
          React.createElement('tbody', { className: 'divide-y divide-slate-100 font-medium text-slate-800' },
            filteredProducts.map(prod => React.createElement('tr', {
              key: prod.id,
              onClick: () => setSelectedProduct(prod),
              className: 'hover:bg-slate-50/80 transition-colors cursor-pointer'
            },
              React.createElement('td', { className: 'py-3 px-4' },
                React.createElement('div', { className: 'font-bold text-slate-900' }, prod.name),
                React.createElement('div', { className: 'text-[11px] text-slate-400 font-mono mt-0.5' }, `${prod.id} • ${prod.majorGroup} / ${prod.subGroup}`)
              ),
              React.createElement('td', { className: 'py-3 px-4 text-right font-mono font-bold text-slate-900 text-sm' }, prod.availableStock),
              React.createElement('td', { className: 'py-3 px-4 text-center font-mono text-slate-500' }, prod.uom),
              React.createElement('td', { className: 'py-3 px-4 text-right font-mono' }, `₹${prod.avgRate}`),
              React.createElement('td', { className: 'py-3 px-4 text-right font-mono font-bold text-slate-900' }, `₹${prod.stockValue.toLocaleString('en-IN')}`),
              React.createElement('td', { className: 'py-3 px-4 text-center' },
                React.createElement(window.StatusBadge, { status: prod.status })
              ),
              React.createElement('td', { className: 'py-3 px-4 text-right' },
                React.createElement(window.Button, { size: 'sm', variant: 'ghost' },
                  React.createElement(window.Icon, { name: 'Layers', className: 'w-3.5 h-3.5 mr-1' }),
                  'View Batches'
                )
              )
            ))
          )
        )
      ),

      // DETAILED FIFO BATCH BREAKDOWN DRAWER
      React.createElement(window.Drawer, {
        isOpen: !!selectedProduct,
        onClose: () => setSelectedProduct(null),
        title: activeProd ? activeProd.name : 'Product Batches',
        subtitle: activeProd ? `Available Stock: ${activeProd.availableStock} ${activeProd.uom} • Avg Rate: ₹${activeProd.avgRate}` : '',
        footer: React.createElement(window.Button, { variant: 'secondary', size: 'md', onClick: () => setSelectedProduct(null) }, 'Close Panel')
      },
        activeProd && React.createElement('div', { className: 'space-y-5 text-xs' },
          
          // Stock Metric Card
          React.createElement('div', { className: 'grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200' },
            React.createElement('div', null,
              React.createElement('span', { className: 'text-slate-400 uppercase text-[10px] font-bold block' }, 'Total Value'),
              React.createElement('span', { className: 'text-base font-bold text-slate-900 font-mono mt-0.5 block' }, `₹${activeProd.stockValue.toLocaleString('en-IN')}`)
            ),
            React.createElement('div', null,
              React.createElement('span', { className: 'text-slate-400 uppercase text-[10px] font-bold block' }, 'Reorder Level'),
              React.createElement('span', { className: 'text-base font-bold text-slate-800 font-mono mt-0.5 block' }, `${activeProd.minReorderLevel} ${activeProd.uom}`)
            )
          ),

          // Informative FIFO Note
          React.createElement('div', { className: 'p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-900 text-[11px] leading-relaxed flex items-start gap-2' },
            React.createElement(window.Icon, { name: 'ShieldCheck', className: 'w-4 h-4 text-emerald-600 shrink-0 mt-0.5' }),
            React.createElement('p', null,
              React.createElement('strong', { className: 'block font-bold' }, 'Automated FIFO Queue'),
              'During sales invoice dispatch, stock is deducted chronologically starting from the oldest available batch.'
            )
          ),

          // Batches Table
          React.createElement('div', { className: 'space-y-2' },
            React.createElement('h4', { className: 'font-bold text-slate-900' }, 'FIFO Batch Ledger'),

            prodBatches.length === 0 ? React.createElement('div', { className: 'py-6 text-center text-slate-400 italic' }, 'No active batches found.') :
              React.createElement('div', { className: 'border border-slate-200 rounded-lg overflow-hidden' },
                React.createElement('table', { className: 'w-full text-left text-xs border-collapse' },
                  React.createElement('thead', { className: 'bg-slate-50 border-b border-slate-200 font-semibold text-slate-600 text-[10px] uppercase' },
                    React.createElement('tr', null,
                      React.createElement('th', { className: 'py-2 px-3' }, 'Batch No'),
                      React.createElement('th', { className: 'py-2 px-3 text-right' }, 'Available'),
                      React.createElement('th', { className: 'py-2 px-3 text-right' }, 'Purchase Rate'),
                      React.createElement('th', { className: 'py-2 px-3 text-right' }, 'Batch Value')
                    )
                  ),
                  React.createElement('tbody', { className: 'divide-y divide-slate-100 font-medium text-slate-800' },
                    prodBatches.map((b, i) => React.createElement('tr', { key: i, className: 'hover:bg-slate-50/50' },
                      React.createElement('td', { className: 'py-2.5 px-3' },
                        React.createElement('span', { className: 'font-bold font-mono text-slate-900 block' }, b.batchNo),
                        React.createElement('span', { className: 'text-[10px] text-slate-400 block' }, b.receivedDate)
                      ),
                      React.createElement('td', { className: 'py-2.5 px-3 text-right font-mono font-bold text-slate-900' }, `${b.availableQty} ${activeProd.uom}`),
                      React.createElement('td', { className: 'py-2.5 px-3 text-right font-mono' }, `₹${b.rate}`),
                      React.createElement('td', { className: 'py-2.5 px-3 text-right font-mono font-bold text-slate-900' }, `₹${(b.availableQty * b.rate).toLocaleString('en-IN')}`)
                    ))
                  )
                )
              )
          )
        )
      )
    );
  };
})();
