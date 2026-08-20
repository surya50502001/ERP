(function () {
  window.ReportsView = function ({ onNavigate }) {
    const { state } = window.useERP();

    const totalValuation = state.products.reduce((acc, p) => acc + (p.stockValue || 0), 0);

    return React.createElement('div', { className: 'space-y-6 max-w-7xl mx-auto' },

      // Header Bar
      React.createElement('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200' },
        React.createElement('div', null,
          React.createElement('h1', { className: 'text-xl font-bold text-slate-900 tracking-tight' }, 'ERP Operational Reports'),
          React.createElement('p', { className: 'text-xs text-slate-500 mt-0.5' }, 'Stock valuation, purchase registers, and sales performance analytics')
        ),
        React.createElement(window.Button, { variant: 'secondary', size: 'md' },
          React.createElement(window.Icon, { name: 'Download', className: 'w-4 h-4' }),
          'Export CSV'
        )
      ),

      // Valuation Summary Strip
      React.createElement('div', { className: 'bg-slate-900 text-white p-6 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
        React.createElement('div', null,
          React.createElement('span', { className: 'text-xs font-semibold text-slate-400 uppercase tracking-wider block' }, 'Total Inventory Valuation (FIFO)'),
          React.createElement('h2', { className: 'text-3xl font-bold font-mono text-emerald-400 mt-1' }, `₹${totalValuation.toLocaleString('en-IN')}`),
          React.createElement('p', { className: 'text-xs text-slate-300 mt-1' }, `Valued across ${state.products.length} active products and batch queues.`)
        ),
        React.createElement('div', { className: 'flex items-center gap-3 text-xs font-medium' },
          React.createElement('div', { className: 'bg-slate-800 p-3 rounded-lg border border-slate-700' },
            React.createElement('span', { className: 'text-slate-400 block text-[10px]' }, 'Total POs Issued'),
            React.createElement('span', { className: 'text-lg font-bold font-mono text-white' }, state.purchaseOrders.length)
          ),
          React.createElement('div', { className: 'bg-slate-800 p-3 rounded-lg border border-slate-700' },
            React.createElement('span', { className: 'text-slate-400 block text-[10px]' }, 'Total Invoices'),
            React.createElement('span', { className: 'text-lg font-bold font-mono text-white' }, state.salesInvoices.length)
          )
        )
      ),

      // Stock Valuation Table Report
      React.createElement('div', { className: 'bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs space-y-3 p-5' },
        React.createElement('div', { className: 'flex items-center justify-between border-b border-slate-100 pb-3' },
          React.createElement('h3', { className: 'text-sm font-bold text-slate-900' }, 'Stock Valuation Ledger (FIFO)'),
          React.createElement('span', { className: 'text-xs text-slate-400 font-mono' }, 'Live Valuation')
        ),

        React.createElement('table', { className: 'w-full text-left text-xs border-collapse' },
          React.createElement('thead', { className: 'bg-slate-50 border-b border-slate-200 font-semibold text-slate-600 text-[10px] uppercase' },
            React.createElement('tr', null,
              React.createElement('th', { className: 'py-2.5 px-3' }, 'Product Name'),
              React.createElement('th', { className: 'py-2.5 px-3 text-right' }, 'Available Stock'),
              React.createElement('th', { className: 'py-2.5 px-3 text-center' }, 'UOM'),
              React.createElement('th', { className: 'py-2.5 px-3 text-right' }, 'Avg Rate (₹)'),
              React.createElement('th', { className: 'py-2.5 px-3 text-right' }, 'Stock Value (₹)')
            )
          ),
          React.createElement('tbody', { className: 'divide-y divide-slate-100 font-medium text-slate-800' },
            state.products.map(prod => React.createElement('tr', { key: prod.id, className: 'hover:bg-slate-50/50' },
              React.createElement('td', { className: 'py-3 px-3 font-bold text-slate-900' }, prod.name),
              React.createElement('td', { className: 'py-3 px-3 text-right font-mono font-bold' }, prod.availableStock),
              React.createElement('td', { className: 'py-3 px-3 text-center font-mono text-slate-500' }, prod.uom),
              React.createElement('td', { className: 'py-3 px-3 text-right font-mono' }, `₹${prod.avgRate}`),
              React.createElement('td', { className: 'py-3 px-3 text-right font-mono font-bold text-slate-900' }, `₹${prod.stockValue.toLocaleString('en-IN')}`)
            ))
          )
        )
      )
    );
  };
})();
