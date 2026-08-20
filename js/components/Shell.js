(function () {
  const { useState, useEffect } = React;

  window.AppShell = function ({ currentTab, onNavigate, children }) {
    const { state, setIsCmdPaletteOpen, sidebarCollapsed, setSidebarCollapsed } = window.useERP();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
      { id: 'purchases', label: 'Purchases', icon: 'ShoppingBag' },
      { id: 'sales', label: 'Sales', icon: 'Receipt' },
      { id: 'inventory', label: 'Inventory', icon: 'Package' },
      { divider: true },
      { id: 'masters', label: 'Masters', icon: 'Database' },
      { id: 'reports', label: 'Reports', icon: 'BarChart3' },
      { divider: true },
      { id: 'settings', label: 'Settings', icon: 'Settings' }
    ];

    const unreadCount = state.notifications.filter(n => n.unread).length;

    return React.createElement('div', { className: 'min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-slate-200' },
      React.createElement('div', { className: 'flex-1 flex overflow-hidden' },

        // Persistent Left Sidebar
        React.createElement('aside', {
          className: `${sidebarCollapsed ? 'w-16' : 'w-60'} bg-white border-r border-slate-200/80 flex flex-col transition-all duration-200 z-30 select-none shadow-xs`
        },
          // Sidebar Logo Header
          React.createElement('div', { className: 'h-14 px-4 border-b border-slate-100 flex items-center justify-between' },
            !sidebarCollapsed && React.createElement('div', { className: 'flex items-center gap-2.5 cursor-pointer', onClick: () => onNavigate('dashboard') },
              React.createElement('div', { className: 'w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm' }, 'E'),
              React.createElement('div', null,
                React.createElement('span', { className: 'font-bold text-sm tracking-tight text-slate-900 block leading-none' }, 'PRIME ERP'),
                React.createElement('span', { className: 'text-[10px] text-slate-500 font-medium tracking-wide block mt-0.5' }, 'ENTERPRISE SAAS')
              )
            ),
            sidebarCollapsed && React.createElement('div', { className: 'w-7 h-7 mx-auto rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs' }, 'E'),
            React.createElement('button', {
              onClick: () => setSidebarCollapsed(!sidebarCollapsed),
              className: 'p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors hidden sm:block'
            }, React.createElement(window.Icon, { name: sidebarCollapsed ? 'PanelLeftOpen' : 'PanelLeftClose', className: 'w-4 h-4' }))
          ),

          // Sidebar Navigation Links
          React.createElement('nav', { className: 'flex-1 p-2.5 space-y-1 overflow-y-auto' },
            navItems.map((item, idx) => {
              if (item.divider) {
                return React.createElement('div', { key: idx, className: 'my-2 border-t border-slate-100' });
              }

              const isActive = currentTab === item.id;

              return React.createElement('button', {
                key: item.id,
                onClick: () => onNavigate(item.id),
                title: sidebarCollapsed ? item.label : undefined,
                className: `w-full flex items-center ${sidebarCollapsed ? 'justify-center px-0' : 'px-3'} py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              },
                React.createElement(window.Icon, { name: item.icon, className: `w-4 h-4 ${sidebarCollapsed ? '' : 'mr-3'} ${isActive ? 'text-white' : 'text-slate-500'}` }),
                !sidebarCollapsed && React.createElement('span', null, item.label)
              );
            })
          ),

          // Sidebar Footer Status Card
          !sidebarCollapsed && React.createElement('div', { className: 'p-3 border-t border-slate-100 bg-slate-50/50' },
            React.createElement('div', { className: 'flex items-center justify-between text-[11px] font-medium text-slate-500' },
              React.createElement('span', { className: 'flex items-center gap-1.5' },
                React.createElement('span', { className: 'w-2 h-2 rounded-full bg-emerald-500 animate-pulse' }),
                'ERP System Online'
              ),
              React.createElement('span', { className: 'font-mono text-[10px]' }, 'v2.4')
            )
          )
        ),

        // Main Content Area
        React.createElement('div', { className: 'flex-1 flex flex-col min-w-0 overflow-hidden' },

          // Top Navigation Bar
          React.createElement('header', { className: 'h-14 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between z-20 shadow-2xs' },
            
            // Global Search Trigger
            React.createElement('div', { className: 'flex items-center gap-4 flex-1 max-w-md' },
              React.createElement('button', {
                onClick: () => setIsCmdPaletteOpen(true),
                className: 'w-full bg-slate-100/80 hover:bg-slate-100 border border-slate-200/80 rounded-lg px-3 py-1.5 text-xs text-slate-500 flex items-center justify-between transition-colors shadow-2xs group'
              },
                React.createElement('div', { className: 'flex items-center gap-2' },
                  React.createElement(window.Icon, { name: 'Search', className: 'w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600' }),
                  React.createElement('span', null, 'Search POs, Invoices, Customers, Stock...')
                ),
                React.createElement('kbd', { className: 'px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-white rounded border border-slate-200 shadow-2xs' }, 'Ctrl + K')
              )
            ),

            // Top Bar Action Tools
            React.createElement('div', { className: 'flex items-center gap-3' },

              // Quick Action Button
              React.createElement(window.Button, {
                size: 'sm',
                variant: 'secondary',
                onClick: () => onNavigate('purchases'),
                className: 'hidden sm:inline-flex'
              },
                React.createElement(window.Icon, { name: 'Plus', className: 'w-3.5 h-3.5' }),
                'New PO'
              ),

              React.createElement(window.Button, {
                size: 'sm',
                variant: 'primary',
                onClick: () => onNavigate('sales'),
                className: 'hidden sm:inline-flex'
              },
                React.createElement(window.Icon, { name: 'Plus', className: 'w-3.5 h-3.5' }),
                'New Invoice'
              ),

              // Notifications Menu Dropdown
              React.createElement('div', { className: 'relative' },
                React.createElement('button', {
                  onClick: () => {
                    setShowNotifications(!showNotifications);
                    setShowProfile(false);
                  },
                  className: 'p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative transition-colors'
                },
                  React.createElement(window.Icon, { name: 'Bell', className: 'w-4 h-4' }),
                  unreadCount > 0 && React.createElement('span', { className: 'absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white' })
                ),

                showNotifications && React.createElement('div', { className: 'absolute right-0 mt-2 w-80 rounded-xl bg-white border border-slate-200 shadow-xl z-50 p-3 space-y-2 animate-in fade-in zoom-in-95' },
                  React.createElement('div', { className: 'flex items-center justify-between pb-2 border-b border-slate-100' },
                    React.createElement('h4', { className: 'text-xs font-bold text-slate-900' }, 'Notifications'),
                    React.createElement('span', { className: 'text-[10px] text-slate-500 font-semibold' }, `${unreadCount} new`)
                  ),
                  React.createElement('div', { className: 'space-y-1.5 max-h-64 overflow-y-auto' },
                    state.notifications.map(n => React.createElement('div', { key: n.id, className: 'p-2 rounded-lg hover:bg-slate-50 text-xs transition-colors' },
                      React.createElement('div', { className: 'font-semibold text-slate-800 flex items-center justify-between' },
                        React.createElement('span', null, n.title),
                        React.createElement('span', { className: 'text-[10px] text-slate-400 font-normal' }, n.time)
                      ),
                      React.createElement('p', { className: 'text-slate-500 mt-0.5 text-[11px] leading-relaxed' }, n.message)
                    ))
                  )
                )
              ),

              // User Profile Dropdown
              React.createElement('div', { className: 'relative' },
                React.createElement('button', {
                  onClick: () => {
                    setShowProfile(!showProfile);
                    setShowNotifications(false);
                  },
                  className: 'flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 transition-colors'
                },
                  React.createElement('div', { className: 'w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-300' }, 'ST'),
                  React.createElement('div', { className: 'text-left hidden md:block' },
                    React.createElement('span', { className: 'text-xs font-semibold text-slate-800 block leading-tight' }, 'Sri Lakshmi Fabrics'),
                    React.createElement('span', { className: 'text-[10px] text-slate-500 block' }, 'Store Manager')
                  ),
                  React.createElement(window.Icon, { name: 'ChevronDown', className: 'w-3.5 h-3.5 text-slate-400' })
                ),

                showProfile && React.createElement('div', { className: 'absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-xl z-50 p-2 text-xs space-y-1 animate-in fade-in zoom-in-95' },
                  React.createElement('div', { className: 'px-3 py-2 border-b border-slate-100' },
                    React.createElement('p', { className: 'font-semibold text-slate-900' }, 'Sri Lakshmi Fabrics Pvt Ltd'),
                    React.createElement('p', { className: 'text-[10px] text-slate-500 mt-0.5 font-mono' }, 'GSTIN: 33AAACS1234F1Z9')
                  ),
                  React.createElement('button', { onClick: () => { onNavigate('settings'); setShowProfile(false); }, className: 'w-full text-left px-3 py-1.5 rounded-md hover:bg-slate-100 flex items-center gap-2 text-slate-700' },
                    React.createElement(window.Icon, { name: 'Settings', className: 'w-3.5 h-3.5' }), 'System Settings'
                  ),
                  React.createElement('button', { onClick: () => { onNavigate('masters'); setShowProfile(false); }, className: 'w-full text-left px-3 py-1.5 rounded-md hover:bg-slate-100 flex items-center gap-2 text-slate-700' },
                    React.createElement(window.Icon, { name: 'Database', className: 'w-3.5 h-3.5' }), 'Master Data Overview'
                  )
                )
              )
            )
          ),

          // Main View Content Slot
          React.createElement('main', { className: 'flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6' }, children)
        )
      ),

      // Global Command Palette Overlay
      React.createElement(window.CommandPalette),

      // Toast Notifications
      React.createElement(window.ToastContainer)
    );
  };
})();
