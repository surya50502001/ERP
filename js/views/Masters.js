(function () {
  const { useState } = React;

  window.MastersView = function ({ onNavigate }) {
    const { state, addParty, addProduct } = window.useERP();
    const [subTab, setSubTab] = useState('overview'); // 'overview', 'parties', 'products', 'categories', 'uom', 'locations'
    
    // Drawers
    const [isPartyDrawerOpen, setIsPartyDrawerOpen] = useState(false);
    const [isProdDrawerOpen, setIsProdDrawerOpen] = useState(false);
    const [showMoreDetails, setShowMoreDetails] = useState(false);

    // Search & Filters
    const [partySearch, setPartySearch] = useState('');
    const [partyTypeFilter, setPartyTypeFilter] = useState('All');
    const [prodSearch, setProdSearch] = useState('');

    // Party Form State
    const [partyName, setPartyName] = useState('');
    const [partyType, setPartyType] = useState('Supplier');
    const [partyPhone, setPartyPhone] = useState('');
    const [partyEmail, setPartyEmail] = useState('');
    const [partyGstin, setPartyGstin] = useState('');
    const [partyState, setPartyState] = useState('Tamil Nadu');
    const [partyAddress, setPartyAddress] = useState('');

    // Product Form State
    const [pName, setPName] = useState('');
    const [pUom, setPUom] = useState('KG');
    const [pMajor, setPMajor] = useState('Yarn');
    const [pSub, setPSub] = useState('Cotton Yarn');
    const [pSubSub, setPSubSub] = useState('Combed Cotton');
    const [pStock, setPStock] = useState(100);
    const [pRate, setPRate] = useState(200);
    const [pMinLevel, setPMinLevel] = useState(50);
    const [pHsn, setPHsn] = useState('52051210');
    const [pGst, setPGst] = useState(5);
    const [pDesc, setPDesc] = useState('');

    const handleSaveParty = () => {
      if (!partyName) return;
      addParty({
        name: partyName,
        type: partyType,
        phone: partyPhone || '+91 98420 12345',
        email: partyEmail || `${partyName.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`,
        gstin: partyGstin || '33AAAC1234F1Z1',
        address: partyAddress || 'Main Road',
        location: `Coimbatore, ${partyState}`,
        country: 'India',
        state: partyState
      });
      setIsPartyDrawerOpen(false);
      setPartyName('');
    };

    const handleSaveProduct = () => {
      if (!pName) return;
      addProduct({
        name: pName,
        uom: pUom,
        majorGroup: pMajor,
        subGroup: pSub,
        subSubGroup: pSubSub,
        openingStock: parseFloat(pStock || 0),
        purchaseRate: parseFloat(pRate || 100),
        minReorderLevel: parseFloat(pMinLevel || 50),
        hsnCode: pHsn,
        gstRate: parseFloat(pGst),
        description: pDesc
      });
      setIsProdDrawerOpen(false);
      setPName('');
    };

    const masterCards = [
      { id: 'parties', title: 'Parties', desc: 'Unified Customers & Suppliers management', count: `${state.parties.length} Parties`, icon: 'Users' },
      { id: 'products', title: 'Products', desc: 'Item Master, UOMs, and Stock Specifications', count: `${state.products.length} Products`, icon: 'Box' },
      { id: 'categories', title: 'Categories & Hierarchies', desc: 'Major Groups, Sub Groups, and Sub-Sub Groups', count: `${state.categories.major.length} Groups`, icon: 'FolderTree' },
      { id: 'uom', title: 'Units of Measure (UOM)', desc: 'Kilograms, Meters, Pieces, Rolls, Boxes', count: `${state.uoms.length} UOMs`, icon: 'Ruler' },
      { id: 'locations', title: 'Countries & States', desc: 'Geographic location hierarchy for tax & billing', count: `${state.locations.length} Countries`, icon: 'Globe' }
    ];

    // OVERVIEW LANDING HUB
    if (subTab === 'overview') {
      return React.createElement('div', { className: 'space-y-6 max-w-7xl mx-auto' },
        React.createElement('div', { className: 'pb-2 border-b border-slate-200' },
          React.createElement('h1', { className: 'text-xl font-bold text-slate-900 tracking-tight' }, 'Master Data Management'),
          React.createElement('p', { className: 'text-xs text-slate-500 mt-0.5' }, 'Configure parties, product hierarchies, UOMs, and location masters')
        ),

        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' },
          masterCards.map(c => React.createElement('div', {
            key: c.id,
            onClick: () => setSubTab(c.id),
            className: 'bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer space-y-3 group'
          },
            React.createElement('div', { className: 'flex items-center justify-between' },
              React.createElement('div', { className: 'p-2 rounded-lg bg-slate-100 text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-colors' },
                React.createElement(window.Icon, { name: c.icon, className: 'w-5 h-5' })
              ),
              React.createElement('span', { className: 'text-xs font-semibold text-slate-500 font-mono' }, c.count)
            ),
            React.createElement('div', null,
              React.createElement('h3', { className: 'text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors' }, c.title),
              React.createElement('p', { className: 'text-xs text-slate-500 mt-1 leading-relaxed' }, c.desc)
            ),
            React.createElement('div', { className: 'flex items-center text-xs font-semibold text-slate-600 group-hover:text-slate-900 gap-1 pt-2 border-t border-slate-100' },
              React.createElement('span', null, 'Manage master'),
              React.createElement(window.Icon, { name: 'ArrowRight', className: 'w-3.5 h-3.5 group-hover:translate-x-1 transition-transform' })
            )
          ))
        )
      );
    }

    // PARTIES MASTER SUBPAGE
    if (subTab === 'parties') {
      const filteredParties = state.parties.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(partySearch.toLowerCase()) ||
          p.phone.includes(partySearch) || p.location.toLowerCase().includes(partySearch.toLowerCase());
        const matchesType = partyTypeFilter === 'All' || p.type === partyTypeFilter;
        return matchesSearch && matchesType;
      });

      return React.createElement('div', { className: 'space-y-6 max-w-7xl mx-auto' },
        React.createElement('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200' },
          React.createElement('div', { className: 'flex items-center gap-3' },
            React.createElement('button', {
              onClick: () => setSubTab('overview'),
              className: 'p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors'
            }, React.createElement(window.Icon, { name: 'ArrowLeft', className: 'w-5 h-5' })),
            React.createElement('div', null,
              React.createElement('h1', { className: 'text-xl font-bold text-slate-900 tracking-tight' }, 'Parties Master'),
              React.createElement('p', { className: 'text-xs text-slate-500 mt-0.5' }, 'Unified ledger for Customers, Suppliers, and Both')
            )
          ),
          React.createElement(window.Button, { variant: 'primary', size: 'md', onClick: () => setIsPartyDrawerOpen(true) },
            React.createElement(window.Icon, { name: 'UserPlus', className: 'w-4 h-4' }),
            'Add Party'
          )
        ),

        React.createElement('div', { className: 'flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs' },
          React.createElement('div', { className: 'w-full sm:w-72' },
            React.createElement(window.Input, {
              icon: 'Search',
              placeholder: 'Search party name, location...',
              value: partySearch,
              onChange: (e) => setPartySearch(e.target.value)
            })
          ),
          React.createElement('div', { className: 'flex items-center gap-2 overflow-x-auto text-xs font-medium text-slate-600' },
            ['All', 'Supplier', 'Customer', 'Both'].map(t => React.createElement('button', {
              key: t,
              onClick: () => setPartyTypeFilter(t),
              className: `px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                partyTypeFilter === t ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`
            }, t))
          )
        ),

        React.createElement('div', { className: 'bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs' },
          React.createElement('table', { className: 'w-full text-left text-xs border-collapse' },
            React.createElement('thead', { className: 'bg-slate-50/80 border-b border-slate-200/80 font-semibold text-slate-600 uppercase tracking-wider text-[10px]' },
              React.createElement('tr', null,
                React.createElement('th', { className: 'py-3 px-4' }, 'Party Name'),
                React.createElement('th', { className: 'py-3 px-4 text-center' }, 'Type'),
                React.createElement('th', { className: 'py-3 px-4' }, 'Phone / Email'),
                React.createElement('th', { className: 'py-3 px-4' }, 'Location'),
                React.createElement('th', { className: 'py-3 px-4' }, 'GSTIN'),
                React.createElement('th', { className: 'py-3 px-4 text-center' }, 'Status')
              )
            ),
            React.createElement('tbody', { className: 'divide-y divide-slate-100 font-medium text-slate-800' },
              filteredParties.map(p => React.createElement('tr', { key: p.id, className: 'hover:bg-slate-50/80' },
                React.createElement('td', { className: 'py-3 px-4 font-bold text-slate-900' }, p.name),
                React.createElement('td', { className: 'py-3 px-4 text-center' },
                  React.createElement('span', { className: 'px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700' }, p.type)
                ),
                React.createElement('td', { className: 'py-3 px-4' },
                  React.createElement('div', { className: 'font-mono text-slate-800' }, p.phone),
                  React.createElement('div', { className: 'text-[11px] text-slate-400 font-sans' }, p.email)
                ),
                React.createElement('td', { className: 'py-3 px-4 text-slate-600' }, p.location),
                React.createElement('td', { className: 'py-3 px-4 font-mono text-slate-600 text-[11px]' }, p.gstin),
                React.createElement('td', { className: 'py-3 px-4 text-center' },
                  React.createElement(window.StatusBadge, { status: p.status })
                )
              ))
            )
          )
        ),

        // ADD PARTY DRAWER
        React.createElement(window.Drawer, {
          isOpen: isPartyDrawerOpen,
          onClose: () => setIsPartyDrawerOpen(false),
          title: 'Add New Party',
          subtitle: 'Create Customer, Supplier, or Both',
          footer: React.createElement('div', { className: 'flex items-center gap-2' },
            React.createElement(window.Button, { variant: 'secondary', size: 'md', onClick: () => setIsPartyDrawerOpen(false) }, 'Cancel'),
            React.createElement(window.Button, { variant: 'primary', size: 'md', onClick: handleSaveParty }, 'Save Party')
          )
        },
          React.createElement('div', { className: 'space-y-4 text-xs' },
            React.createElement(window.Input, {
              label: 'Party Name',
              placeholder: 'E.g. Sri Balaji Yarns',
              value: partyName,
              onChange: (e) => setPartyName(e.target.value)
            }),
            React.createElement(window.Select, {
              label: 'Party Type',
              options: ['Supplier', 'Customer', 'Both'],
              value: partyType,
              onChange: (e) => setPartyType(e.target.value)
            }),
            React.createElement(window.Input, {
              label: 'Phone Number',
              placeholder: '+91 98420 12345',
              value: partyPhone,
              onChange: (e) => setPartyPhone(e.target.value)
            }),
            React.createElement(window.Input, {
              label: 'GSTIN Number',
              placeholder: '33AAACS1234F1Z9',
              value: partyGstin,
              onChange: (e) => setPartyGstin(e.target.value)
            }),
            React.createElement(window.Select, {
              label: 'State',
              options: ['Tamil Nadu', 'Gujarat', 'Maharashtra', 'Karnataka', 'Punjab'],
              value: partyState,
              onChange: (e) => setPartyState(e.target.value)
            }),
            React.createElement(window.Input, {
              label: 'Billing Address',
              placeholder: 'Door #, Street, City',
              value: partyAddress,
              onChange: (e) => setPartyAddress(e.target.value)
            })
          )
        )
      );
    }

    // PRODUCTS MASTER SUBPAGE (With Progressive Disclosure "More Details")
    if (subTab === 'products') {
      const filteredProds = state.products.filter(p => p.name.toLowerCase().includes(prodSearch.toLowerCase()) || p.id.toLowerCase().includes(prodSearch.toLowerCase()));

      return React.createElement('div', { className: 'space-y-6 max-w-7xl mx-auto' },
        React.createElement('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200' },
          React.createElement('div', { className: 'flex items-center gap-3' },
            React.createElement('button', {
              onClick: () => setSubTab('overview'),
              className: 'p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors'
            }, React.createElement(window.Icon, { name: 'ArrowLeft', className: 'w-5 h-5' })),
            React.createElement('div', null,
              React.createElement('h1', { className: 'text-xl font-bold text-slate-900 tracking-tight' }, 'Products Master'),
              React.createElement('p', { className: 'text-xs text-slate-500 mt-0.5' }, 'Master repository of items, UOMs, and reorder levels')
            )
          ),
          React.createElement(window.Button, { variant: 'primary', size: 'md', onClick: () => setIsProdDrawerOpen(true) },
            React.createElement(window.Icon, { name: 'Plus', className: 'w-4 h-4' }),
            'Add Product'
          )
        ),

        React.createElement('div', { className: 'bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs w-full sm:w-80' },
          React.createElement(window.Input, {
            icon: 'Search',
            placeholder: 'Search product name...',
            value: prodSearch,
            onChange: (e) => setProdSearch(e.target.value)
          })
        ),

        React.createElement('div', { className: 'bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs' },
          React.createElement('table', { className: 'w-full text-left text-xs border-collapse' },
            React.createElement('thead', { className: 'bg-slate-50/80 border-b border-slate-200/80 font-semibold text-slate-600 uppercase tracking-wider text-[10px]' },
              React.createElement('tr', null,
                React.createElement('th', { className: 'py-3 px-4' }, 'Product Name'),
                React.createElement('th', { className: 'py-3 px-4 text-center' }, 'UOM'),
                React.createElement('th', { className: 'py-3 px-4' }, 'Major Group'),
                React.createElement('th', { className: 'py-3 px-4' }, 'Sub Group'),
                React.createElement('th', { className: 'py-3 px-4' }, 'Sub-Sub Group'),
                React.createElement('th', { className: 'py-3 px-4 text-center' }, 'Status')
              )
            ),
            React.createElement('tbody', { className: 'divide-y divide-slate-100 font-medium text-slate-800' },
              filteredProds.map(p => React.createElement('tr', { key: p.id, className: 'hover:bg-slate-50/80' },
                React.createElement('td', { className: 'py-3 px-4 font-bold text-slate-900' }, p.name),
                React.createElement('td', { className: 'py-3 px-4 text-center font-mono text-slate-500' }, p.uom),
                React.createElement('td', { className: 'py-3 px-4 text-slate-700' }, p.majorGroup),
                React.createElement('td', { className: 'py-3 px-4 text-slate-600' }, p.subGroup),
                React.createElement('td', { className: 'py-3 px-4 text-slate-500' }, p.subSubGroup),
                React.createElement('td', { className: 'py-3 px-4 text-center' },
                  React.createElement(window.StatusBadge, { status: p.status })
                )
              ))
            )
          )
        ),

        // ADD PRODUCT DRAWER WITH PROGRESSIVE DISCLOSURE ("More Details")
        React.createElement(window.Drawer, {
          isOpen: isProdDrawerOpen,
          onClose: () => setIsProdDrawerOpen(false),
          title: 'Add New Product',
          subtitle: 'Simple default view with progressive disclosure for advanced attributes',
          footer: React.createElement('div', { className: 'flex items-center gap-2' },
            React.createElement(window.Button, { variant: 'secondary', size: 'md', onClick: () => setIsProdDrawerOpen(false) }, 'Cancel'),
            React.createElement(window.Button, { variant: 'primary', size: 'md', onClick: handleSaveProduct }, 'Save Product')
          )
        },
          React.createElement('div', { className: 'space-y-4 text-xs' },
            
            // Primary Fields
            React.createElement(window.Input, {
              label: 'Product Name',
              placeholder: 'E.g. Viscose Yarn 40s',
              value: pName,
              onChange: (e) => setPName(e.target.value)
            }),
            React.createElement(window.Select, {
              label: 'UOM',
              options: state.uoms.map(u => u.code),
              value: pUom,
              onChange: (e) => setPUom(e.target.value)
            }),
            React.createElement(window.Select, {
              label: 'Major Group',
              options: ['Yarn', 'Fabric', 'Trims'],
              value: pMajor,
              onChange: (e) => setPMajor(e.target.value)
            }),
            React.createElement(window.Select, {
              label: 'Sub Group',
              options: ['Cotton Yarn', 'Synthetic Yarn', 'Knitted Fabric', 'Woven Fabric'],
              value: pSub,
              onChange: (e) => setPSub(e.target.value)
            }),
            React.createElement(window.Select, {
              label: 'Sub-Sub Group',
              options: ['Combed Cotton', 'Carded Cotton', 'Polyester Filament', 'Single Jersey'],
              value: pSubSub,
              onChange: (e) => setPSubSub(e.target.value)
            }),

            // Progressive Disclosure Trigger Button
            React.createElement('div', { className: 'pt-2 border-t border-slate-100' },
              React.createElement('button', {
                type: 'button',
                onClick: () => setShowMoreDetails(!showMoreDetails),
                className: 'w-full py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-semibold text-slate-700 transition-colors'
              },
                React.createElement('span', null, showMoreDetails ? 'Hide additional parameters' : 'More details (Opening Stock, HSN, Tax Rate)'),
                React.createElement(window.Icon, { name: showMoreDetails ? 'ChevronUp' : 'ChevronDown', className: 'w-4 h-4 text-slate-500' })
              )
            ),

            // Progressive Disclosure Advanced Fields Section
            showMoreDetails && React.createElement('div', { className: 'p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in duration-150' },
              React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
                React.createElement(window.Input, {
                  label: 'Opening Stock',
                  type: 'number',
                  value: pStock,
                  onChange: (e) => setPStock(e.target.value)
                }),
                React.createElement(window.Input, {
                  label: 'Purchase Rate (₹)',
                  type: 'number',
                  value: pRate,
                  onChange: (e) => setPRate(e.target.value)
                })
              ),
              React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
                React.createElement(window.Input, {
                  label: 'Reorder Level',
                  type: 'number',
                  value: pMinLevel,
                  onChange: (e) => setPMinLevel(e.target.value)
                }),
                React.createElement(window.Input, {
                  label: 'HSN Code',
                  value: pHsn,
                  onChange: (e) => setPHsn(e.target.value)
                })
              ),
              React.createElement(window.Select, {
                label: 'GST Rate %',
                options: [0, 5, 12, 18],
                value: pGst,
                onChange: (e) => setPGst(e.target.value)
              }),
              React.createElement(window.Input, {
                label: 'Item Description',
                placeholder: 'Detailed specifications...',
                value: pDesc,
                onChange: (e) => setPDesc(e.target.value)
              })
            )
          )
        )
      );
    }

    // CATEGORIES HIERARCHY SUBPAGE
    if (subTab === 'categories') {
      return React.createElement('div', { className: 'space-y-6 max-w-7xl mx-auto' },
        React.createElement('div', { className: 'flex items-center gap-3 pb-2 border-b border-slate-200' },
          React.createElement('button', {
            onClick: () => setSubTab('overview'),
            className: 'p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors'
          }, React.createElement(window.Icon, { name: 'ArrowLeft', className: 'w-5 h-5' })),
          React.createElement('div', null,
            React.createElement('h1', { className: 'text-xl font-bold text-slate-900 tracking-tight' }, 'Category Hierarchies'),
            React.createElement('p', { className: 'text-xs text-slate-500 mt-0.5' }, 'Major Groups, Sub Groups, and Sub-Sub Groups tree')
          )
        ),

        React.createElement('div', { className: 'bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-4 text-xs' },
          state.categories.major.map(mj => React.createElement('div', { key: mj.id, className: 'border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-2' },
            React.createElement('div', { className: 'flex items-center justify-between border-b border-slate-200 pb-2' },
              React.createElement('div', { className: 'flex items-center gap-2 font-bold text-slate-900 text-sm' },
                React.createElement(window.Icon, { name: 'Folder', className: 'w-4 h-4 text-indigo-600' }),
                React.createElement('span', null, mj.name)
              ),
              React.createElement('span', { className: 'font-mono text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-bold' }, mj.code)
            ),
            React.createElement('div', { className: 'pl-4 space-y-2 pt-1' },
              state.categories.sub.filter(sb => sb.majorId === mj.id).map(sb => React.createElement('div', { key: sb.id, className: 'flex items-center gap-2 text-slate-700 font-semibold' },
                React.createElement(window.Icon, { name: 'CornerDownRight', className: 'w-3.5 h-3.5 text-slate-400' }),
                React.createElement('span', null, sb.name)
              ))
            )
          ))
        )
      );
    }

    // UOM SUBPAGE
    if (subTab === 'uom') {
      return React.createElement('div', { className: 'space-y-6 max-w-7xl mx-auto' },
        React.createElement('div', { className: 'flex items-center gap-3 pb-2 border-b border-slate-200' },
          React.createElement('button', {
            onClick: () => setSubTab('overview'),
            className: 'p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors'
          }, React.createElement(window.Icon, { name: 'ArrowLeft', className: 'w-5 h-5' })),
          React.createElement('div', null,
            React.createElement('h1', { className: 'text-xl font-bold text-slate-900 tracking-tight' }, 'Units of Measure (UOM)'),
            React.createElement('p', { className: 'text-xs text-slate-500 mt-0.5' }, 'Standard inventory measurement units')
          )
        ),

        React.createElement('div', { className: 'bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs' },
          React.createElement('table', { className: 'w-full text-left text-xs border-collapse' },
            React.createElement('thead', { className: 'bg-slate-50 border-b border-slate-200 font-semibold text-slate-600 text-[10px] uppercase' },
              React.createElement('tr', null,
                React.createElement('th', { className: 'py-3 px-4' }, 'Code'),
                React.createElement('th', { className: 'py-3 px-4' }, 'UOM Name'),
                React.createElement('th', { className: 'py-3 px-4 text-center' }, 'Decimal Precision')
              )
            ),
            React.createElement('tbody', { className: 'divide-y divide-slate-100 font-medium text-slate-800' },
              state.uoms.map(u => React.createElement('tr', { key: u.id, className: 'hover:bg-slate-50/50' },
                React.createElement('td', { className: 'py-3 px-4 font-bold font-mono text-slate-900' }, u.code),
                React.createElement('td', { className: 'py-3 px-4 font-semibold text-slate-800' }, u.name),
                React.createElement('td', { className: 'py-3 px-4 text-center font-mono text-slate-500' }, `${u.decimalPlaces} Decimals`)
              ))
            )
          )
        )
      );
    }

    // LOCATIONS SUBPAGE
    if (subTab === 'locations') {
      return React.createElement('div', { className: 'space-y-6 max-w-7xl mx-auto' },
        React.createElement('div', { className: 'flex items-center gap-3 pb-2 border-b border-slate-200' },
          React.createElement('button', {
            onClick: () => setSubTab('overview'),
            className: 'p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors'
          }, React.createElement(window.Icon, { name: 'ArrowLeft', className: 'w-5 h-5' })),
          React.createElement('div', null,
            React.createElement('h1', { className: 'text-xl font-bold text-slate-900 tracking-tight' }, 'Countries & States Master'),
            React.createElement('p', { className: 'text-xs text-slate-500 mt-0.5' }, 'Geographic entities for billing and shipping master records')
          )
        ),

        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 text-xs' },
          state.locations.map((loc, idx) => React.createElement('div', { key: idx, className: 'bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs space-y-3' },
            React.createElement('div', { className: 'flex items-center justify-between border-b border-slate-100 pb-2 font-bold text-slate-900 text-sm' },
              React.createElement('span', null, loc.country),
              React.createElement('span', { className: 'font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600' }, loc.code)
            ),
            React.createElement('div', { className: 'space-y-1 text-slate-600 font-medium' },
              loc.states.map((st, i) => React.createElement('div', { key: i, className: 'flex items-center gap-2' },
                React.createElement('span', { className: 'w-1.5 h-1.5 rounded-full bg-slate-400' }),
                React.createElement('span', null, st)
              ))
            )
          ))
        )
      );
    }
  };
})();
