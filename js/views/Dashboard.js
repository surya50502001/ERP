(function () {
  window.DashboardView = function ({ onNavigate }) {
    const { state } = window.useERP();

    // Compute live metrics
    const totalPurchases = (state.purchaseOrders || []).reduce((acc, po) => acc + (po.totalAmount || 0), 0);
    const totalSales = (state.salesInvoices || []).reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);
    const totalStockValue = (state.products || []).reduce((acc, p) => acc + (p.stockValue || 0), 0);

    const pendingPOs = (state.purchaseOrders || []).filter(p => p.status === 'Pending' || p.status === 'Partial');
    const lowStockProducts = (state.products || []).filter(p => {
      const stock = p.availableStock !== undefined ? p.availableStock : (p.currentStock || 0);
      const minLevel = p.minReorderLevel !== undefined ? p.minReorderLevel : 0;
      return stock <= minLevel;
    });
    const pendingInvoices = (state.salesInvoices || []).filter(i => i.status === 'Pending' || i.status === 'Pending Approval' || i.status === 'Overdue');

    const attentionItems = [];

    if (pendingPOs.length > 0) {
      const firstPO = pendingPOs[0];
      const extraCount = pendingPOs.length - 1;
      attentionItems.push({
        id: 'po',
        cardStyle: 'border-amber-200/60 bg-amber-50/40 hover:bg-amber-50',
        titleStyle: 'text-amber-900',
        subStyle: 'text-amber-700/80',
        iconStyle: 'text-amber-600',
        title: `${pendingPOs.length} Purchase Order${pendingPOs.length > 1 ? 's' : ''} awaiting GRN`,
        subtitle: extraCount > 0 
          ? `${firstPO.id} (${firstPO.supplierName || 'Supplier'}) & ${extraCount} more awaiting receiving`
          : `${firstPO.id} (${firstPO.supplierName || 'Supplier'}) awaiting receiving`,
        onClick: () => onNavigate('purchases')
      });
    }

    if (lowStockProducts.length > 0) {
      const firstProd = lowStockProducts[0];
      const extraCount = lowStockProducts.length - 1;
      attentionItems.push({
        id: 'stock',
        cardStyle: 'border-rose-200/60 bg-rose-50/40 hover:bg-rose-50',
        titleStyle: 'text-rose-900',
        subStyle: 'text-rose-700/80',
        iconStyle: 'text-rose-600',
        title: `${lowStockProducts.length} product${lowStockProducts.length > 1 ? 's' : ''} running low`,
        subtitle: extraCount > 0
          ? `${firstProd.name} at ${firstProd.availableStock} ${firstProd.uom || 'units'} & ${extraCount} more`
          : `${firstProd.name} at ${firstProd.availableStock} ${firstProd.uom || 'units'}`,
        onClick: () => onNavigate('inventory')
      });
    }

    if (pendingInvoices.length > 0) {
      const firstInv = pendingInvoices[0];
      const extraCount = pendingInvoices.length - 1;
      attentionItems.push({
        id: 'invoice',
        cardStyle: 'border-slate-200 bg-slate-50/60 hover:bg-slate-100',
        titleStyle: 'text-slate-900',
        subStyle: 'text-slate-600',
        iconStyle: 'text-slate-500',
        title: `${pendingInvoices.length} pending invoice${pendingInvoices.length > 1 ? 's' : ''}`,
        subtitle: extraCount > 0
          ? `${firstInv.id} (${firstInv.customerName || 'Customer'}) & ${extraCount} more awaiting action`
          : `${firstInv.id} (${firstInv.customerName || 'Customer'}) awaiting action`,
        onClick: () => onNavigate('sales')
      });
    }

    const todayStr = new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    return React.createElement('div', { className: 'space-y-6 max-w-7xl mx-auto' },

      // Header Banner
      React.createElement('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60' },
        React.createElement('div', null,
          React.createElement('h1', { className: 'text-xl font-bold text-slate-900 tracking-tight' }, 'Good morning, Store Manager'),
          React.createElement('p', { className: 'text-xs text-slate-500 mt-1 font-medium' }, `Operational overview for Prime Enterprise Pvt Ltd • ${todayStr}`)
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
            React.createElement('span', { className: 'text-2xl font-bold text-slate-900 tracking-tight font-mono' }, `₹${(totalPurchases / 100000).toFixed(2)}L`),
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
            React.createElement('span', { className: 'text-xs text-slate-500 font-medium' }, `${state.products ? state.products.length : 0} products active`)
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

        attentionItems.length > 0 ? (
          React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-3 text-xs' },
            attentionItems.map(item => React.createElement('div', {
              key: item.id,
              onClick: item.onClick,
              className: `p-3 rounded-lg border transition-colors cursor-pointer flex items-center justify-between group ${item.cardStyle}`
            },
              React.createElement('div', null,
                React.createElement('p', { className: `font-semibold ${item.titleStyle}` }, item.title),
                React.createElement('p', { className: `${item.subStyle} mt-0.5` }, item.subtitle)
              ),
              React.createElement(window.Icon, { name: 'ArrowRight', className: `w-4 h-4 ${item.iconStyle} group-hover:translate-x-1 transition-transform` })
            ))
          )
        ) : (
          React.createElement('div', { className: 'p-4 bg-slate-50/60 rounded-lg border border-slate-200/60 flex items-center justify-between text-xs' },
            React.createElement('div', { className: 'flex items-center gap-2.5 text-slate-600' },
              React.createElement(window.Icon, { name: 'CheckCircle', className: 'w-4 h-4 text-emerald-500' }),
              React.createElement('span', null, 'All operational checks normal. No urgent actions required.')
            ),
            React.createElement('span', { className: 'text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60' }, 'All clear')
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
