import React, { useState } from 'react';
import Icon from '../components/Icon';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import StatusBadge from '../components/StatusBadge';
import { useERP } from '../context/ERPContext';

export default function MastersView({ onNavigate }) {
  const { state, addParty, addProduct } = useERP();
  const [subTab, setSubTab] = useState('overview');

  const [isPartyFormOpen, setIsPartyFormOpen] = useState(false);
  const [isProdFormOpen, setIsProdFormOpen] = useState(false);
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  const [partySearch, setPartySearch] = useState('');
  const [partyTypeFilter, setPartyTypeFilter] = useState('All');
  const [prodSearch, setProdSearch] = useState('');

  const [partyName, setPartyName] = useState('');
  const [partyType, setPartyType] = useState('Supplier');
  const [partyPhone, setPartyPhone] = useState('');
  const [partyEmail, setPartyEmail] = useState('');
  const [partyGstin, setPartyGstin] = useState('');
  const [partyState, setPartyState] = useState('Tamil Nadu');
  const [partyAddress, setPartyAddress] = useState('');

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

  if (!state) return null;

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
    setIsPartyFormOpen(false);
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
    setIsProdFormOpen(false);
    setPName('');
  };

  const masterCards = [
    { id: 'parties', title: 'Parties', desc: 'Unified Customers & Suppliers management', count: `${state.parties?.length || 0} Parties`, icon: 'Users' },
    { id: 'products', title: 'Products', desc: 'Item Master, UOMs, and Stock Specifications', count: `${state.products?.length || 0} Products`, icon: 'Box' },
    { id: 'categories', title: 'Categories & Hierarchies', desc: 'Major Groups, Sub Groups, and Sub-Sub Groups', count: `${state.categories?.major?.length || 0} Groups`, icon: 'FolderTree' },
    { id: 'uom', title: 'Units of Measure (UOM)', desc: 'Kilograms, Meters, Pieces, Rolls, Boxes', count: `${state.uoms?.length || 0} UOMs`, icon: 'Ruler' },
    { id: 'locations', title: 'Countries & States', desc: 'Geographic location hierarchy for tax & billing', count: `${state.locations?.length || 0} Countries`, icon: 'Globe' }
  ];

  if (subTab === 'overview') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="pb-2 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Master Data Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Configure parties, product hierarchies, UOMs, and location masters</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {masterCards.map(c => (
            <div
              key={c.id}
              onClick={() => setSubTab(c.id)}
              className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <Icon name={c.icon} className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-500 font-mono">{c.count}</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{c.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{c.desc}</p>
              </div>
              <div className="flex items-center text-xs font-semibold text-slate-600 group-hover:text-slate-900 gap-1 pt-2 border-t border-slate-100">
                <span>Manage master</span>
                <Icon name="ArrowRight" className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (subTab === 'parties') {
    const filteredParties = (state.parties || []).filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(partySearch.toLowerCase()) ||
        p.phone.includes(partySearch) || p.location.toLowerCase().includes(partySearch.toLowerCase());
      const matchesType = partyTypeFilter === 'All' || p.type === partyTypeFilter;
      return matchesSearch && matchesType;
    });

    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSubTab('overview')}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Icon name="ArrowLeft" className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Parties Master</h1>
              <p className="text-xs text-slate-500 mt-0.5">Unified ledger for Customers, Suppliers, and Both</p>
            </div>
          </div>
          <Button variant="primary" size="md" onClick={() => setIsPartyFormOpen(!isPartyFormOpen)}>
            <Icon name="UserPlus" className="w-4 h-4" />
            {isPartyFormOpen ? 'Close Form' : 'Add Party'}
          </Button>
        </div>

        {/* INLINE MAIN AREA PARTY CREATION FORM */}
        {isPartyFormOpen && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Add New Party</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input label="Party Name" placeholder="E.g. Sri Balaji Yarns" value={partyName} onChange={(e) => setPartyName(e.target.value)} />
              <Select label="Party Type" options={['Supplier', 'Customer', 'Both']} value={partyType} onChange={(e) => setPartyType(e.target.value)} />
              <Input label="Phone Number" placeholder="+91 98420 12345" value={partyPhone} onChange={(e) => setPartyPhone(e.target.value)} />
              <Input label="GSTIN Number" placeholder="33AAACS1234F1Z9" value={partyGstin} onChange={(e) => setPartyGstin(e.target.value)} />
              <Select label="State" options={['Tamil Nadu', 'Gujarat', 'Maharashtra', 'Karnataka', 'Punjab']} value={partyState} onChange={(e) => setPartyState(e.target.value)} />
              <Input label="Billing Address" placeholder="Door #, Street, City" value={partyAddress} onChange={(e) => setPartyAddress(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="secondary" size="sm" onClick={() => setIsPartyFormOpen(false)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={handleSaveParty}>Save Party</Button>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="w-full sm:w-72">
            <Input
              icon="Search"
              placeholder="Search party name, location..."
              value={partySearch}
              onChange={(e) => setPartySearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto text-xs font-medium text-slate-600">
            {['All', 'Supplier', 'Customer', 'Both'].map(t => (
              <button
                key={t}
                onClick={() => setPartyTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  partyTypeFilter === t ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 font-semibold text-slate-600 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Party Name</th>
                <th className="py-3 px-4 text-center">Type</th>
                <th className="py-3 px-4">Phone / Email</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">GSTIN</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredParties.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 italic">No parties found. Click "Add Party" above to create one.</td>
                </tr>
              ) : (
                filteredParties.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">{p.type}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono text-slate-800">{p.phone}</div>
                      <div className="text-[11px] text-slate-400 font-sans">{p.email}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{p.location}</td>
                    <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">{p.gstin}</td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (subTab === 'products') {
    const filteredProds = (state.products || []).filter(p => p.name.toLowerCase().includes(prodSearch.toLowerCase()) || p.id.toLowerCase().includes(prodSearch.toLowerCase()));

    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSubTab('overview')}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Icon name="ArrowLeft" className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Products Master</h1>
              <p className="text-xs text-slate-500 mt-0.5">Master repository of items, UOMs, and reorder levels</p>
            </div>
          </div>
          <Button variant="primary" size="md" onClick={() => setIsProdFormOpen(!isProdFormOpen)}>
            <Icon name="Plus" className="w-4 h-4" />
            {isProdFormOpen ? 'Close Form' : 'Add Product'}
          </Button>
        </div>

        {/* INLINE MAIN AREA PRODUCT CREATION FORM */}
        {isProdFormOpen && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Add New Product</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input label="Product Name" placeholder="E.g. Viscose Yarn 40s" value={pName} onChange={(e) => setPName(e.target.value)} />
              <Select label="UOM" options={(state.uoms || []).map(u => u.code)} value={pUom} onChange={(e) => setPUom(e.target.value)} />
              <Select label="Major Group" options={['Yarn', 'Fabric', 'Trims']} value={pMajor} onChange={(e) => setPMajor(e.target.value)} />
              <Select label="Sub Group" options={['Cotton Yarn', 'Synthetic Yarn', 'Knitted Fabric', 'Woven Fabric']} value={pSub} onChange={(e) => setPSub(e.target.value)} />
              <Select label="Sub-Sub Group" options={['Combed Cotton', 'Carded Cotton', 'Polyester Filament', 'Single Jersey']} value={pSubSub} onChange={(e) => setPSubSub(e.target.value)} />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowMoreDetails(!showMoreDetails)}
                className="w-full py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-semibold text-slate-700 transition-colors"
              >
                <span>{showMoreDetails ? 'Hide additional parameters' : 'More details (Opening Stock, HSN, Tax Rate)'}</span>
                <Icon name={showMoreDetails ? 'ChevronUp' : 'ChevronDown'} className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {showMoreDetails && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Opening Stock" type="number" value={pStock} onChange={(e) => setPStock(e.target.value)} />
                  <Input label="Purchase Rate (₹)" type="number" value={pRate} onChange={(e) => setPRate(e.target.value)} />
                  <Input label="Reorder Level" type="number" value={pMinLevel} onChange={(e) => setPMinLevel(e.target.value)} />
                  <Input label="HSN Code" value={pHsn} onChange={(e) => setPHsn(e.target.value)} />
                </div>
                <Select label="GST Rate %" options={[0, 5, 12, 18]} value={pGst} onChange={(e) => setPGst(e.target.value)} />
                <Input label="Item Description" placeholder="Detailed specifications..." value={pDesc} onChange={(e) => setPDesc(e.target.value)} />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="secondary" size="sm" onClick={() => setIsProdFormOpen(false)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={handleSaveProduct}>Save Product</Button>
            </div>
          </div>
        )}

        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs w-full sm:w-80">
          <Input
            icon="Search"
            placeholder="Search product name..."
            value={prodSearch}
            onChange={(e) => setProdSearch(e.target.value)}
          />
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 font-semibold text-slate-600 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4 text-center">UOM</th>
                <th className="py-3 px-4">Major Group</th>
                <th className="py-3 px-4">Sub Group</th>
                <th className="py-3 px-4">Sub-Sub Group</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredProds.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 italic">No products found. Click "Add Product" above to create one.</td>
                </tr>
              ) : (
                filteredProds.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                    <td className="py-3 px-4 text-center font-mono text-slate-500">{p.uom}</td>
                    <td className="py-3 px-4 text-slate-700">{p.majorGroup}</td>
                    <td className="py-3 px-4 text-slate-600">{p.subGroup}</td>
                    <td className="py-3 px-4 text-slate-500">{p.subSubGroup}</td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (subTab === 'categories') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
          <button
            onClick={() => setSubTab('overview')}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Icon name="ArrowLeft" className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Category Hierarchies</h1>
            <p className="text-xs text-slate-500 mt-0.5">Major Groups, Sub Groups, and Sub-Sub Groups tree</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-4 text-xs">
          {(state.categories?.major || []).map(mj => (
            <div key={mj.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Icon name="Folder" className="w-4 h-4 text-indigo-600" />
                  <span>{mj.name}</span>
                </div>
                <span className="font-mono text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-bold">{mj.code}</span>
              </div>
              <div className="pl-4 space-y-2 pt-1">
                {(state.categories?.sub || []).filter(sb => sb.majorId === mj.id).map(sb => (
                  <div key={sb.id} className="flex items-center gap-2 text-slate-700 font-semibold">
                    <Icon name="CornerDownRight" className="w-3.5 h-3.5 text-slate-400" />
                    <span>{sb.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (subTab === 'uom') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
          <button
            onClick={() => setSubTab('overview')}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Icon name="ArrowLeft" className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Units of Measure (UOM)</h1>
            <p className="text-xs text-slate-500 mt-0.5">Standard inventory measurement units</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600 text-[10px] uppercase">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">UOM Name</th>
                <th className="py-3 px-4 text-center">Decimal Precision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {(state.uoms || []).map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-bold font-mono text-slate-900">{u.code}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{u.name}</td>
                  <td className="py-3 px-4 text-center font-mono text-slate-500">{u.decimalPlaces} Decimals</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (subTab === 'locations') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
          <button
            onClick={() => setSubTab('overview')}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Icon name="ArrowLeft" className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Countries & States Master</h1>
            <p className="text-xs text-slate-500 mt-0.5">Geographic entities for billing and shipping master records</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {(state.locations || []).map((loc, idx) => (
            <div key={idx} className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 font-bold text-slate-900 text-sm">
                <span>{loc.country}</span>
                <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{loc.code}</span>
              </div>
              <div className="space-y-1 text-slate-600 font-medium">
                {(loc.states || []).map((st, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>{st}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

window.MastersView = MastersView;
