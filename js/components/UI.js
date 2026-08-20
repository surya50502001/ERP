(function () {
  const { useState, useEffect, useRef } = React;

  // Embedded Lucide SVG path definitions for standalone browser rendering
  const ICON_SVGS = {
    LayoutDashboard: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
    ShoppingBag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    Receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 6v12"/>',
    Package: '<path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"/>',
    Database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>',
    BarChart3: '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    Settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    Search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    Plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    Bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    ChevronDown: '<path d="m6 9 6 6 6-6"/>',
    ChevronUp: '<path d="m18 15-6-6-6 6"/>',
    ArrowLeft: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    ArrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    Truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14v10Z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    Printer: '<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect width="12" height="8" x="6" y="14" rx="1"/>',
    X: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    CheckCircle2: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    AlertCircle: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
    UserPlus: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>',
    FileSpreadsheet: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a1 1 0 0 0 1 1h4"/><path d="M8 13h8"/><path d="M8 17h8"/><path d="M12 9v10"/>',
    Download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    Layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    ShieldCheck: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    CornerDownRight: '<polyline points="15 10 20 15 15 20"/><path d="M4 4v7a4 4 0 0 0 4 4h12"/>',
    Folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
    FolderTree: '<path d="M20 10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6.9A2 2 0 0 0 7.93 0H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2Z"/><path d="M4 10v12"/><path d="M4 17h6"/>',
    Globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/>',
    Ruler: '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/>',
    Users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    Box: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    RotateCcw: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    PanelLeftClose: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/>',
    PanelLeftOpen: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m13 9 3 3-3 3"/>',
    Info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    PlusCircle: '<circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/>'
  };

  // Icon Helper component
  window.Icon = function ({ name, className = "w-4 h-4", ...props }) {
    const svgInner = ICON_SVGS[name] || '<circle cx="12" cy="12" r="8"/>';
    return React.createElement('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      className,
      dangerouslySetInnerHTML: { __html: svgInner },
      ...props
    });
  };

  // Status Badge Component
  window.StatusBadge = function ({ status }) {
    const statusConfig = {
      'Received': 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      'Paid': 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      'Success': 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      'Active': 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      'Pending': 'bg-amber-50 text-amber-700 border-amber-200/60',
      'Partial': 'bg-sky-50 text-sky-700 border-sky-200/60',
      'Low Stock': 'bg-rose-50 text-rose-700 border-rose-200/60',
      'Overdue': 'bg-rose-50 text-rose-700 border-rose-200/60',
      'Cancelled': 'bg-slate-100 text-slate-600 border-slate-200'
    };

    const style = statusConfig[status] || 'bg-slate-50 text-slate-700 border-slate-200';

    return React.createElement(
      'span',
      { className: `inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${style}` },
      React.createElement('span', { className: 'w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80' }),
      status
    );
  };

  // Button Component
  window.Button = function ({ children, variant = 'primary', size = 'md', className = '', ...props }) {
    const baseStyle = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
    
    const variants = {
      primary: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900 shadow-sm",
      secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-400 shadow-xs",
      ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 focus:ring-slate-300",
      accent: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-600 shadow-sm",
      danger: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-600 shadow-sm"
    };

    const sizes = {
      sm: "px-2.5 py-1 text-xs gap-1.5",
      md: "px-3.5 py-1.5 text-sm gap-2",
      lg: "px-4 py-2 text-base gap-2.5"
    };

    return React.createElement('button', {
      className: `${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`,
      ...props
    }, children);
  };

  // Input Field
  window.Input = function ({ label, error, icon, className = '', ...props }) {
    return React.createElement('div', { className: 'w-full' },
      label && React.createElement('label', { className: 'block text-xs font-semibold text-slate-700 mb-1.5' }, label),
      React.createElement('div', { className: 'relative rounded-lg shadow-xs' },
        icon && React.createElement('div', { className: 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400' },
          React.createElement(window.Icon, { name: icon, className: 'w-4 h-4' })
        ),
        React.createElement('input', {
          className: `w-full rounded-lg border border-slate-200 bg-white py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors ${icon ? 'pl-9' : 'px-3'} ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''} ${className}`,
          ...props
        })
      ),
      error && React.createElement('p', { className: 'mt-1 text-xs text-rose-600 font-medium' }, error)
    );
  };

  // Select Dropdown
  window.Select = function ({ label, options = [], className = '', ...props }) {
    return React.createElement('div', { className: 'w-full' },
      label && React.createElement('label', { className: 'block text-xs font-semibold text-slate-700 mb-1.5' }, label),
      React.createElement('select', {
        className: `w-full rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors ${className}`,
        ...props
      },
        options.map((opt, i) => React.createElement('option', { key: i, value: typeof opt === 'object' ? opt.value : opt }, typeof opt === 'object' ? opt.label : opt))
      )
    );
  };

  // Searchable Combobox with Inline Creation Option
  window.Combobox = function ({ label, options = [], value, onChange, placeholder = "Search...", onCreateNew, createLabel = "+ Create item", className = "" }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const wrapperRef = useRef(null);

    const selectedOption = options.find(o => o.value === value);

    useEffect(() => {
      function handleClickOutside(event) {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter(o =>
      o.label.toLowerCase().includes(search.toLowerCase()) ||
      (o.sublabel && o.sublabel.toLowerCase().includes(search.toLowerCase()))
    );

    return React.createElement('div', { className: `w-full relative ${className}`, ref: wrapperRef },
      label && React.createElement('label', { className: 'block text-xs font-semibold text-slate-700 mb-1.5' }, label),
      React.createElement('div', {
        className: 'w-full rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-sm text-slate-900 focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900 flex items-center justify-between cursor-pointer transition-colors shadow-xs',
        onClick: () => setIsOpen(!isOpen)
      },
        React.createElement('span', { className: selectedOption ? 'text-slate-900 font-medium' : 'text-slate-400' },
          selectedOption ? selectedOption.label : placeholder
        ),
        React.createElement(window.Icon, { name: 'ChevronDown', className: 'w-4 h-4 text-slate-400' })
      ),

      isOpen && React.createElement('div', { className: 'absolute z-50 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden py-1 text-sm' },
        React.createElement('div', { className: 'p-1.5 border-b border-slate-100' },
          React.createElement('input', {
            type: 'text',
            autoFocus: true,
            className: 'w-full px-2.5 py-1 text-xs rounded border border-slate-200 focus:outline-none focus:border-slate-900',
            placeholder: 'Type to filter...',
            value: search,
            onChange: (e) => setSearch(e.target.value)
          })
        ),

        React.createElement('div', { className: 'max-h-48 overflow-y-auto py-1' },
          filteredOptions.length === 0 ? React.createElement('div', { className: 'px-3 py-2 text-xs text-slate-400 italic' }, 'No matches found') :
            filteredOptions.map((opt) => React.createElement('div', {
              key: opt.value,
              className: `px-3 py-2 cursor-pointer text-xs flex items-center justify-between hover:bg-slate-100 ${value === opt.value ? 'bg-slate-50 font-semibold text-slate-900' : 'text-slate-700'}`,
              onClick: () => {
                onChange(opt.value);
                setIsOpen(false);
              }
            },
              React.createElement('span', null, opt.label),
              opt.sublabel && React.createElement('span', { className: 'text-[11px] text-slate-400 font-normal ml-2' }, opt.sublabel)
            ))
        ),

        onCreateNew && React.createElement('div', {
          className: 'border-t border-slate-100 p-1.5 bg-slate-50/70 hover:bg-slate-100 cursor-pointer text-xs font-semibold text-indigo-600 flex items-center gap-1.5 transition-colors',
          onClick: () => {
            setIsOpen(false);
            onCreateNew();
          }
        },
          React.createElement(window.Icon, { name: 'PlusCircle', className: 'w-3.5 h-3.5' }),
          createLabel
        )
      )
    );
  };

  // Drawer Component (Right side overlay panel)
  window.Drawer = function ({ isOpen, onClose, title, subtitle, children, footer }) {
    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape' && isOpen) onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    if (!isOpen) return null;

    return React.createElement('div', { className: 'fixed inset-0 z-50 overflow-hidden' },
      // Backdrop
      React.createElement('div', {
        className: 'absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200',
        onClick: onClose
      }),

      // Drawer panel
      React.createElement('div', { className: 'fixed inset-y-0 right-0 max-w-full flex pl-10' },
        React.createElement('div', { className: 'w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200' },
          // Header
          React.createElement('div', { className: 'px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50' },
            React.createElement('div', null,
              React.createElement('h2', { className: 'text-base font-semibold text-slate-900' }, title),
              subtitle && React.createElement('p', { className: 'text-xs text-slate-500 mt-0.5' }, subtitle)
            ),
            React.createElement('button', {
              onClick: onClose,
              className: 'p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors'
            }, React.createElement(window.Icon, { name: 'X', className: 'w-5 h-5' }))
          ),

          // Content body
          React.createElement('div', { className: 'flex-1 overflow-y-auto p-6 space-y-5' }, children),

          // Footer actions
          footer && React.createElement('div', { className: 'px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2.5' }, footer)
        )
      )
    );
  };

  // Toast Container
  window.ToastContainer = function () {
    const { toasts, removeToast } = window.useERP();

    return React.createElement('div', { className: 'fixed bottom-5 right-5 z-50 space-y-2.5 pointer-events-none max-w-sm w-full' },
      toasts.map(toast => React.createElement('div', {
        key: toast.id,
        className: 'pointer-events-auto bg-slate-900 text-white p-3.5 rounded-xl shadow-xl flex items-start gap-3 border border-slate-800 animate-in slide-in-from-bottom-2 transition-all'
      },
        React.createElement('div', { className: `p-1 rounded-full ${toast.type === 'error' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}` },
          React.createElement(window.Icon, { name: toast.type === 'error' ? 'AlertCircle' : 'CheckCircle2', className: 'w-4 h-4' })
        ),
        React.createElement('div', { className: 'flex-1' },
          React.createElement('h4', { className: 'text-xs font-semibold text-white' }, toast.title),
          React.createElement('p', { className: 'text-xs text-slate-300 mt-0.5 leading-relaxed' }, toast.message)
        ),
        React.createElement('button', {
          onClick: () => removeToast(toast.id),
          className: 'text-slate-400 hover:text-white p-0.5'
        }, React.createElement(window.Icon, { name: 'X', className: 'w-3.5 h-3.5' }))
      ))
    );
  };

  // Command Palette Overlay (Ctrl + K)
  window.CommandPalette = function () {
    const { isCmdPaletteOpen, setIsCmdPaletteOpen, state } = window.useERP();
    const [query, setQuery] = useState('');

    useEffect(() => {
      if (!isCmdPaletteOpen) setQuery('');
    }, [isCmdPaletteOpen]);

    if (!isCmdPaletteOpen) return null;

    const allItems = [
      ...state.purchaseOrders.map(p => ({ id: p.id, title: `${p.id} - ${p.supplierName}`, category: 'Purchase Orders', meta: `₹${p.totalAmount.toLocaleString('en-IN')}`, route: '#purchases' })),
      ...state.salesInvoices.map(i => ({ id: i.id, title: `${i.id} - ${i.customerName}`, category: 'Invoices', meta: `₹${i.totalAmount.toLocaleString('en-IN')}`, route: '#sales' })),
      ...state.products.map(p => ({ id: p.id, title: p.name, category: 'Products', meta: `${p.availableStock} ${p.uom}`, route: '#inventory' })),
      ...state.parties.map(p => ({ id: p.id, title: `${p.name} (${p.type})`, category: 'Parties', meta: p.location, route: '#masters' })),
      { id: 'NAV-1', title: 'Go to Dashboard', category: 'Navigation', route: '#dashboard' },
      { id: 'NAV-2', title: 'Go to Purchases', category: 'Navigation', route: '#purchases' },
      { id: 'NAV-3', title: 'Go to Inventory & FIFO Stock', category: 'Navigation', route: '#inventory' },
      { id: 'NAV-4', title: 'Go to Sales & Invoices', category: 'Navigation', route: '#sales' },
      { id: 'NAV-5', title: 'Go to Master Data', category: 'Navigation', route: '#masters' }
    ];

    const filtered = query.trim() === '' ? allItems.slice(0, 8) : allItems.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );

    return React.createElement('div', { className: 'fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20' },
      React.createElement('div', {
        className: 'fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity',
        onClick: () => setIsCmdPaletteOpen(false)
      }),

      React.createElement('div', { className: 'relative mx-auto max-w-xl rounded-xl bg-white shadow-2xl ring-1 ring-slate-900/10 overflow-hidden divide-y divide-slate-100 mt-10 animate-in fade-in zoom-in-95 duration-150' },
        // Search header
        React.createElement('div', { className: 'flex items-center px-4 py-3 bg-slate-50/50' },
          React.createElement(window.Icon, { name: 'Search', className: 'w-5 h-5 text-slate-400 mr-3' }),
          React.createElement('input', {
            type: 'text',
            autoFocus: true,
            className: 'w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium',
            placeholder: 'Search POs, Invoices, Customers, Products... (Esc to close)',
            value: query,
            onChange: (e) => setQuery(e.target.value)
          }),
          React.createElement('kbd', { className: 'hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-xs' }, 'ESC')
        ),

        // Search Results List
        React.createElement('div', { className: 'max-h-80 overflow-y-auto p-2 space-y-1' },
          filtered.length === 0 ? React.createElement('div', { className: 'py-8 text-center text-xs text-slate-400 font-medium' }, 'No search results found') :
            filtered.map(item => React.createElement('a', {
              key: item.id,
              href: item.route,
              onClick: () => setIsCmdPaletteOpen(false),
              className: 'flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 cursor-pointer group transition-colors'
            },
              React.createElement('div', { className: 'flex items-center gap-2.5' },
                React.createElement('span', { className: 'px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-200/60 rounded' }, item.category),
                React.createElement('span', { className: 'text-xs font-semibold text-slate-800 group-hover:text-slate-900' }, item.title)
              ),
              item.meta && React.createElement('span', { className: 'text-xs font-mono font-medium text-slate-500' }, item.meta)
            ))
        ),

        // Footer shortcut tips
        React.createElement('div', { className: 'px-4 py-2 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between font-medium' },
          React.createElement('span', null, 'Tip: Type keywords to search across all ERP modules'),
          React.createElement('div', { className: 'flex items-center gap-2' },
            React.createElement('span', null, 'Use Ctrl + K to toggle anytime')
          )
        )
      )
    );
  };
})();
