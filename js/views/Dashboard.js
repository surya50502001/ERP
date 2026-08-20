(function () {
  window.DashboardView = function ({ onNavigate }) {
    const { state } = window.useERP();

    // Compute live metrics
    const totalPurchases = state.purchaseOrders.reduce((acc, po) => acc + (po.totalAmount || 0), 0);
    const totalSales = state.salesInvoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);
    const totalStockValue = state.products.reduce((acc, p) => acc + (p.stockValue || 0), 0);

    const pendingPOsCount = state.purchaseOrders.filter(p => p.status === 'Pending' || p.status === 'Partial').length;
    const lowStockCount = state.products.filter(p => p.availableStock <= p.minReorderLevel).length;
    const pendingInvoicesCount = state.salesInvoices.filter(i => i.status === 'Pending' || i.status === 'Overdue').length;

    return React.createElement('div', { className: 'space-y-6 max-w-7xl mx-auto' },

      // Header Banner
      React.createElement('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60' },
        React.createElement('div', null,
          React.createElement('h1', { className: 'text-xl font-bold text-slate-900 tracking-tight' }, 'Good morning, Store Manager'),
          React.createElement('p', { className: 'text-xs text-slate-500 mt-1 font-medium' }, 'Operational overview for Sri Lakshmi Fabrics Pvt Ltd • Thursday, 20 Aug 2026')
        ),
        React.createElement('div', { className: 'flex items-center gap-2' },
          React.createElement(window.Button, { size: 'sm', variant: 'secondary', onClick: () => onNavigate('purchases') },
            React.createElement(window.Icon, { name: 'Plus', className: 'w-3.5 h-3.5' }), 'Create PO'
          ),
          React.createElement(window.Button, { size: 'sm', variant: 'primary', onClick: () => onNavigate('sales') },
            React.createElement(window.Icon, { name: 'Plus', className: 'w-3.5 h-3.5' }), 'Create Invoice'
          )
        )
      ),

      // Today's Overview Metric Strip (3 Compact Stats)
      React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-3 gap-4' },
        
        // Purchases Stat
        React.createElement('div', { className: 'bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs hover:border-slate-300 transition-colors' },
          React.createElement('div', { className: 'flex items-center justify-between' },
            React.createElement('span', { className: 'text-xs font-semibold text-slate-500 uppercase tracking-wider' }, 'Total Purchases'),
            React.createElement('span', { className: 'p-1.5 rounded-md bg-slate-100 text-slate-700' },
              React.createElement(window.Icon, { name: 'ShoppingBag', className: 'w-4 h-4' })
            )
          ),
          React.createElement('div', { className: 'mt-2 flex items-baseline gap-2' },
            React.createElement('span', { className: 'text-2xl font-bold text-slate-900 tracking-tight font-mono' }, `₹${(totalPurchases / 1000).toFixed(2)}L`),
            React.createElement('span', { className: 'text-xs text-emerald-600 font-semibold flex items-center' }, '↑ 12% vs last week')
          )
        ),

        // Sales Stat
        React.createElement('div', { className: 'bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs hover:border-slate-300 transition-colors' },
          React.createElement('div', { className: 'flex items-center justify-between' },
            React.createElement('span', { className: 'text-xs font-semibold text-slate-500 uppercase tracking-wider' }, 'Total Sales'),
            React.createElement('span', { className: 'p-1.5 rounded-md bg-slate-100 text-slate-700' },
              React.createElement(window.Icon, { name: 'Receipt', className: 'w-4 h-4' })
            )
          ),
          React.createElement('div', { className: 'mt-2 flex items-baseline gap-2' },
            React.createElement('span', { className: 'text-2xl font-bold text-slate-900 tracking-tight font-mono' }, `₹${(totalSales / 100000).toFixed(2)}L`),
            React.createElement('span', { className: 'text-xs text-emerald-600 font-semibold flex items-center' }, '↑ 8% vs target')
          )
        ),

        // Stock Value Stat
        React.createElement('div', { className: 'bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs hover:border-slate-300 transition-colors' },
          React.createElement('div', { className: 'flex items-center justify-between' },
            React.createElement('span', { className: 'text-xs font-semibold text-slate-500 uppercase tracking-wider' }, 'Stock Value (FIFO)'),
            React.createElement('span', { className: 'p-1.5 rounded-md bg-slate-100 text-slate-700' },
              React.createElement(window.Icon, { name: 'Package', className: 'w-4 h-4' })
            )
          ),
          React.createElement('div', { className: 'mt-2 flex items-baseline gap-2' },
            React.createElement('span', { className: 'text-2xl font-bold text-slate-900 tracking-tight font-mono' }, `₹${(totalStockValue / 100000).toFixed(2)}L`),
            React.createElement('span', { className: 'text-xs text-slate-500 font-medium' }, `${state.products.length} products active`)
          )
        )
      ),

      // Needs Attention Operational Alerts
      React.createElement('div', { className: 'bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-3' },
        React.createElement('div', { className: 'flex items-center justify-between border-b border-slate-100 pb-3' },
          React.createElement('h3', { className: 'text-sm font-bold text-slate-900 flex items-center gap-2' },
            React.createElement(window.Icon, { name: 'AlertCircle', className: 'w-4 h-4 text-amber-500' }),
            'Needs attention'
          ),
          React.createElement('span', { className: 'text-xs text-slate-400 font-medium' }, 'Action required')
        ),

        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-3 text-xs' },
          
          // Pending PO Alert
          React.createElement('div', {
            onClick: () => onNavigate('purchases'),
            className: 'p-3 rounded-lg border border-amber-200/60 bg-amber-50/40 hover:bg-amber-50 transition-colors cursor-pointer flex items-center justify-between group'
          },
            React.createElement('div', null,
              React.createElement('p', { className: 'font-semibold text-amber-900' }, `${pendingPOsCount} Purchase Orders awaiting GRN`),
              React.createElement('p', { className: 'text-amber-700/80 mt-0.5' }, 'Receiving required to update inventory')
            ),
            React.createElement(window.Icon, { name: 'ArrowRight', className: 'w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform' })
          ),

          // Low Stock Alert
          React.createElement('div', {
            onClick: () => onNavigate('inventory'),
            className: 'p-3 rounded-lg border border-rose-200/60 bg-rose-50/40 hover:bg-rose-50 transition-colors cursor-pointer flex items-center justify-between group'
          },
            React.createElement('div', null,
              React.createElement('p', { className: 'font-semibold text-rose-900' }, `${lowStockCount} products running low`),
              React.createElement('p', { className: 'text-rose-700/80 mt-0.5' }, 'Organic Cotton Yarn 30s at 15 KG')
            ),
            React.createElement(window.Icon, { name: 'ArrowRight', className: 'w-4 h-4 text-rose-600 group-hover:translate-x-1 transition-transform' })
          ),

          // Pending Invoices Alert
          React.createElement('div', {
            onClick: () => onNavigate('sales'),
            className: 'p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-between group'
          },
            React.createElement('div', null,
              React.createElement('p', { className: 'font-semibold text-slate-900' }, `${pendingInvoicesCount} pending invoices`),
              React.createElement('p', { className: 'text-slate-600 mt-0.5' }, 'Follow up on payment collection')
            ),
            React.createElement(window.Icon, { name: 'ArrowRight', className: 'w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform' })
          )
        )
      ),

      // Recent Activity Stream Table
      React.createElement('div', { className: 'bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs' },
        React.createElement('div', { className: 'px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40' },
          React.createElement('div', null,
            React.createElement('h3', { className: 'text-sm font-bold text-slate-900' }, 'Recent activity'),
            React.createElement('p', { className: 'text-xs text-slate-500 mt-0.5' }, 'Real-time audit log of purchases, GRNs, and sales')
          ),
          React.createElement(window.Button, { size: 'sm', variant: 'ghost', onClick: () => onNavigate('reports') }, 'View full log')
        ),

        React.createElement('div', { className: 'divide-y divide-slate-100' },
          state.recentActivities.map(act => React.createElement('div', {
            key: act.id,
            className: 'px-5 py-3 flex items-center justify-between hover:bg-slate-50/80 transition-colors text-xs'
          },
            React.createElement('div', { className: 'flex items-center gap-3' },
              React.createElement('div', { className: 'w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold font-mono text-[11px] text-slate-800 border border-slate-200' },
                act.code.split('-')[0]
              ),
              React.createElement('div', null,
                React.createElement('div', { className: 'flex items-center gap-2' },
                  React.createElement('span', { className: 'font-bold text-slate-900 font-mono' }, act.code),
                  React.createElement('span', { className: 'text-slate-400 font-normal' }, '•'),
                  React.createElement('span', { className: 'font-semibold text-slate-800' }, act.party)
                ),
                React.createElement('p', { className: 'text-slate-500 mt-0.5 text-[11px]' }, act.detail)
              )
            ),

            React.createElement('div', { className: 'flex items-center gap-3' },
              React.createElement(window.StatusBadge, { status: act.status }),
              React.createElement('span', { className: 'text-slate-400 text-[11px] font-medium hidden sm:inline' }, act.time)
            )
          ))
        )
      )
    );
  };
})();
