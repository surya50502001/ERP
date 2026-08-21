import React, { useState } from 'react';
import Icon from '../components/Icon';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import StatusBadge from '../components/StatusBadge';
import { useERP } from '../context/ERPContext';

export default function MastersView({ onNavigate }) {
  const {
    state,
    addParty,
    addProduct,
    addItemType,
    deleteItemType,
    addBrand,
    deleteBrand,
    addMajorCategory,
    deleteMajorCategory,
    addSubCategory,
    deleteSubCategory,
    addSubSubCategory,
    deleteSubSubCategory,
    addUOM,
    deleteUOM,
    clearAllData
  } = useERP();

  const [subTab, setSubTab] = useState('overview');

  // Forms open state
  const [isPartyFormOpen, setIsPartyFormOpen] = useState(false);
  const [isProdFormOpen, setIsProdFormOpen] = useState(false);

  // Quick Add Modal State
  const [quickAddType, setQuickAddType] = useState(null); // 'itemType' | 'major' | 'sub' | 'subSub' | 'brand' | 'uom'
  const [quickAddName, setQuickAddName] = useState('');
  const [quickAddCode, setQuickAddCode] = useState('');

  // Party Form State
  const [partySearch, setPartySearch] = useState('');
  const [partyTypeFilter, setPartyTypeFilter] = useState('All');
  const [partyName, setPartyName] = useState('');
  const [partyType, setPartyType] = useState('Supplier');
  const [partyPhone, setPartyPhone] = useState('');
  const [partyEmail, setPartyEmail] = useState('');
  const [partyGstin, setPartyGstin] = useState('');
  const [partyState, setPartyState] = useState('Tamil Nadu');
  const [partyAddress, setPartyAddress] = useState('');

  // Product Form State (Tabbed)
  const [prodSearch, setProdSearch] = useState('');
  const [prodModalTab, setProdModalTab] = useState('general');

  const [pItemType, setPItemType] = useState('');
  const [pName, setPName] = useState('');
  const [pBrand, setPBrand] = useState('');
  const [pMajor, setPMajor] = useState('');
  const [pSub, setPSub] = useState('');
  const [pSubSub, setPSubSub] = useState('');
  const [pUom, setPUom] = useState('');
  const [pStock, setPStock] = useState(100);
  const [pRate, setPRate] = useState(200);
  const [pSellingRate, setPSellingRate] = useState(240);
  const [pMinLevel, setPMinLevel] = useState(50);
  const [pHsn, setPHsn] = useState('52051210');
  const [pGst, setPGst] = useState(5);
  const [pDesc, setPDesc] = useState('');

  // Standalone Master creation states
  const [newItemTypeName, setNewItemTypeName] = useState('');
  const [newItemTypeCode, setNewItemTypeCode] = useState('');

  const [newBrandName, setNewBrandName] = useState('');

  const [newMajName, setNewMajName] = useState('');
  const [newMajCode, setNewMajCode] = useState('');

  const [newSubMajId, setNewSubMajId] = useState('');
  const [newSubName, setNewSubName] = useState('');

  const [newSubSubSubId, setNewSubSubSubId] = useState('');
  const [newSubSubName, setNewSubSubName] = useState('');

  const [newUomCode, setNewUomCode] = useState('');
  const [newUomName, setNewUomName] = useState('');
  const [newUomDecimals, setNewUomDecimals] = useState(2);

  if (!state) return null;

  // Defaults for product dropdowns if blank
  const itemTypeOptions = (state.itemTypes || []).map(it => typeof it === 'string' ? it : it.name);
  const brandOptions = (state.brands || []).map(b => typeof b === 'string' ? b : b.name);
  const majorOptions = (state.categories?.major || []).map(m => m.name);

  const selectedMajorObj = (state.categories?.major || []).find(m => m.name === (pMajor || majorOptions[0]));
  const subOptions = (state.categories?.sub || [])
    .filter(s => !selectedMajorObj || s.majorId === selectedMajorObj.id)
    .map(s => s.name);

  const selectedSubObj = (state.categories?.sub || []).find(s => s.name === (pSub || subOptions[0]));
  const subSubOptions = (state.categories?.subSub || [])
    .filter(ss => !selectedSubObj || ss.subId === selectedSubObj.id)
    .map(ss => ss.name);

  const uomOptions = (state.uoms || []).map(u => u.code);

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
      itemType: pItemType || itemTypeOptions[0] || 'Raw Material',
      brand: pBrand || brandOptions[0] || 'Generic',
      uom: pUom || uomOptions[0] || 'KG',
      majorGroup: pMajor || majorOptions[0] || 'Yarn',
      subGroup: pSub || subOptions[0] || 'Cotton Yarn',
      subSubGroup: pSubSub || subSubOptions[0] || 'Combed Cotton',
      openingStock: parseFloat(pStock || 0),
      purchaseRate: parseFloat(pRate || 100),
      sellingPrice: parseFloat(pSellingRate || 120),
      minReorderLevel: parseFloat(pMinLevel || 50),
      hsnCode: pHsn,
      gstRate: parseFloat(pGst),
      description: pDesc
    });
    setIsProdFormOpen(false);
    setPName('');
  };

  const handleQuickAddSave = () => {
    if (!quickAddName) return;
    if (quickAddType === 'itemType') {
      addItemType(quickAddName, quickAddCode);
      setPItemType(quickAddName);
    } else if (quickAddType === 'brand') {
      addBrand(quickAddName);
      setPBrand(quickAddName);
    } else if (quickAddType === 'major') {
      addMajorCategory(quickAddName, quickAddCode);
      setPMajor(quickAddName);
    } else if (quickAddType === 'sub') {
      const majObj = (state.categories?.major || []).find(m => m.name === pMajor) || state.categories?.major[0];
      if (majObj) {
        addSubCategory(majObj.id, quickAddName);
        setPSub(quickAddName);
      }
    } else if (quickAddType === 'subSub') {
      const subObj = (state.categories?.sub || []).find(s => s.name === pSub) || state.categories?.sub[0];
      if (subObj) {
        addSubSubCategory(subObj.id, quickAddName);
        setPSubSub(quickAddName);
      }
    } else if (quickAddType === 'uom') {
      addUOM(quickAddCode || quickAddName.substring(0, 3).toUpperCase(), quickAddName, 2);
      setPUom(quickAddCode || quickAddName.substring(0, 3).toUpperCase());
    }
    setQuickAddType(null);
    setQuickAddName('');
    setQuickAddCode('');
  };

  const masterCards = [
    { id: 'parties', title: 'Parties Master', desc: 'Manage Customers & Suppliers ledgers', count: `${state.parties?.length || 0} Parties`, icon: 'Users' },
    { id: 'products', title: 'Products (Item Master)', desc: 'Item Master, UOMs, and Stock Specs', count: `${state.products?.length || 0} Products`, icon: 'Box' },
    { id: 'itemTypes', title: 'Item Types', desc: 'Raw Material, Finished Goods, Services, etc.', count: `${(state.itemTypes || []).length} Types`, icon: 'Tags' },
    { id: 'brands', title: 'Brands', desc: 'User-defined Brands & Trademarks', count: `${(state.brands || []).length} Brands`, icon: 'Bookmark' },
    { id: 'categories', title: 'Categories & Hierarchies', desc: 'Major Groups, Sub Groups, and Sub-Sub Groups', count: `${state.categories?.major?.length || 0} Groups`, icon: 'FolderTree' },
    { id: 'uom', title: 'Units of Measure (UOM)', desc: 'Kilograms, Meters, Pieces, Boxes, etc.', count: `${state.uoms?.length || 0} UOMs`, icon: 'Ruler' },
    { id: 'locations', title: 'Countries & States', desc: 'Geographic location hierarchy for GST & billing', count: `${state.locations?.length || 0} Countries`, icon: 'Globe' }
  ];

  if (subTab === 'overview') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Enterprise Master Data Management</h1>
            <p className="text-xs text-slate-500 mt-0.5">Fully user-controlled master hub for Item Types, Categories, Brands, UOMs, Parties, and Products</p>
          </div>
          <Button variant="danger" size="sm" onClick={clearAllData}>
            <Icon name="Trash2" className="w-3.5 h-3.5" /> Clear Mock Data
          </Button>
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
                <span>Configure & Edit</span>
                <Icon name="ArrowRight" className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- ITEM TYPES SUB-TAB ---
  if (subTab === 'itemTypes') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
          <button onClick={() => setSubTab('overview')} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
            <Icon name="ArrowLeft" className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Item Types Master</h1>
            <p className="text-xs text-slate-500 mt-0.5">User-configured Item Types for categorizing inventory (Raw Material, Finished Goods, etc.)</p>
          </div>
        </div>

        {/* Add Item Type Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3 text-xs">
          <h3 className="font-bold text-slate-900">Add New Item Type</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input label="Item Type Name" placeholder="E.g. Spare Parts" value={newItemTypeName} onChange={(e) => setNewItemTypeName(e.target.value)} />
            <Input label="Type Code (Optional)" placeholder="E.g. SPR" value={newItemTypeCode} onChange={(e) => setNewItemTypeCode(e.target.value)} />
            <div className="flex items-end">
              <Button variant="primary" size="md" onClick={() => {
                if (!newItemTypeName) return;
                addItemType(newItemTypeName, newItemTypeCode);
                setNewItemTypeName('');
                setNewItemTypeCode('');
              }}>
                <Icon name="Plus" className="w-4 h-4" /> Save Item Type
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600 text-[10px] uppercase">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Item Type Name</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {(state.itemTypes || []).map((it, idx) => {
                const name = typeof it === 'string' ? it : it.name;
                const code = typeof it === 'string' ? it.substring(0, 3).toUpperCase() : (it.code || 'TYP');
                const id = typeof it === 'string' ? it : it.id;
                return (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold font-mono text-slate-900">{code}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{name}</td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => deleteItemType(id)} className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors" title="Delete Item Type">
                        <Icon name="Trash2" className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // --- BRANDS SUB-TAB ---
  if (subTab === 'brands') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
          <button onClick={() => setSubTab('overview')} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
            <Icon name="ArrowLeft" className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Brands Master</h1>
            <p className="text-xs text-slate-500 mt-0.5">User-defined brands, trademarks, and manufacturer lines</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3 text-xs">
          <h3 className="font-bold text-slate-900">Add New Brand</h3>
          <div className="flex items-end gap-3 max-w-md">
            <div className="flex-1">
              <Input label="Brand Name" placeholder="E.g. CottonPure" value={newBrandName} onChange={(e) => setNewBrandName(e.target.value)} />
            </div>
            <Button variant="primary" size="md" onClick={() => {
              if (!newBrandName) return;
              addBrand(newBrandName);
              setNewBrandName('');
            }}>
              <Icon name="Plus" className="w-4 h-4" /> Save Brand
            </Button>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs max-w-2xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600 text-[10px] uppercase">
              <tr>
                <th className="py-3 px-4">Brand Name</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {(state.brands || []).map((b, idx) => {
                const name = typeof b === 'string' ? b : b.name;
                const id = typeof b === 'string' ? b : b.id;
                return (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-semibold text-slate-900">{name}</td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => deleteBrand(id)} className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors" title="Delete Brand">
                        <Icon name="Trash2" className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // --- CATEGORIES SUB-TAB ---
  if (subTab === 'categories') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
          <button onClick={() => setSubTab('overview')} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
            <Icon name="ArrowLeft" className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Category Hierarchies Master</h1>
            <p className="text-xs text-slate-500 mt-0.5">User-controlled Major Category Groups, Sub Groups, and Sub-Sub Groups</p>
          </div>
        </div>

        {/* Create Major Group Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3 text-xs">
          <h3 className="font-bold text-slate-900">Add New Major Category Group</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input label="Major Group Name" placeholder="E.g. Dyes & Chemicals" value={newMajName} onChange={(e) => setNewMajName(e.target.value)} />
            <Input label="Code (Optional)" placeholder="E.g. CHM" value={newMajCode} onChange={(e) => setNewMajCode(e.target.value)} />
            <div className="flex items-end">
              <Button variant="primary" size="md" onClick={() => {
                if (!newMajName) return;
                addMajorCategory(newMajName, newMajCode);
                setNewMajName('');
                setNewMajCode('');
              }}>
                <Icon name="Plus" className="w-4 h-4" /> Save Major Group
              </Button>
            </div>
          </div>
        </div>

        {/* Tree View */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-5 text-xs">
          {(state.categories?.major || []).map(mj => (
            <div key={mj.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Icon name="Folder" className="w-4 h-4 text-indigo-600" />
                  <span>{mj.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-bold">{mj.code}</span>
                  <button onClick={() => deleteMajorCategory(mj.id)} className="p-1 text-rose-500 hover:bg-rose-100 rounded">
                    <Icon name="Trash2" className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Add Sub Category Form Inline */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder={`Add Sub Group under ${mj.name}...`}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs w-64 bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                  value={newSubMajId === mj.id ? newSubName : ''}
                  onChange={(e) => {
                    setNewSubMajId(mj.id);
                    setNewSubName(e.target.value);
                  }}
                />
                <Button size="sm" variant="secondary" onClick={() => {
                  if (newSubMajId === mj.id && newSubName) {
                    addSubCategory(mj.id, newSubName);
                    setNewSubName('');
                  }
                }}>
                  <Icon name="Plus" className="w-3.5 h-3.5" /> Add Sub Group
                </Button>
              </div>

              {/* Sub Categories list */}
              <div className="pl-4 space-y-3 pt-2">
                {(state.categories?.sub || []).filter(sb => sb.majorId === mj.id).map(sb => (
                  <div key={sb.id} className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <div className="flex items-center gap-2">
                        <Icon name="CornerDownRight" className="w-3.5 h-3.5 text-slate-400" />
                        <span>{sb.name}</span>
                      </div>
                      <button onClick={() => deleteSubCategory(sb.id)} className="p-1 text-rose-500 hover:bg-rose-50 rounded">
                        <Icon name="Trash2" className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Add Sub-Sub Category Form Inline */}
                    <div className="flex items-center gap-2 pl-5 pt-1">
                      <input
                        type="text"
                        placeholder={`Add Sub-Sub Group under ${sb.name}...`}
                        className="px-2.5 py-1 border border-slate-200 rounded-md text-xs w-56 bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                        value={newSubSubSubId === sb.id ? newSubSubName : ''}
                        onChange={(e) => {
                          setNewSubSubSubId(sb.id);
                          setNewSubSubName(e.target.value);
                        }}
                      />
                      <Button size="sm" variant="ghost" onClick={() => {
                        if (newSubSubSubId === sb.id && newSubSubName) {
                          addSubSubCategory(sb.id, newSubSubName);
                          setNewSubSubName('');
                        }
                      }}>
                        + Add Sub-Sub Group
                      </Button>
                    </div>

                    {/* Sub-Sub categories list */}
                    <div className="pl-6 space-y-1 pt-1">
                      {(state.categories?.subSub || []).filter(ssb => ssb.subId === sb.id).map(ssb => (
                        <div key={ssb.id} className="flex items-center justify-between text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-100">
                          <span className="font-medium text-[11px]">• {ssb.name}</span>
                          <button onClick={() => deleteSubSubCategory(ssb.id)} className="text-rose-500 hover:text-rose-700">
                            <Icon name="X" className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- UOM SUB-TAB ---
  if (subTab === 'uom') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
          <button onClick={() => setSubTab('overview')} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
            <Icon name="ArrowLeft" className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Units of Measure (UOM) Master</h1>
            <p className="text-xs text-slate-500 mt-0.5">User-configured standard measurement units</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3 text-xs">
          <h3 className="font-bold text-slate-900">Add New Unit of Measure</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <Input label="UOM Code" placeholder="E.g. LTR" value={newUomCode} onChange={(e) => setNewUomCode(e.target.value)} />
            <Input label="Full Name" placeholder="E.g. Liters" value={newUomName} onChange={(e) => setNewUomName(e.target.value)} />
            <Input label="Decimal Places" type="number" value={newUomDecimals} onChange={(e) => setNewUomDecimals(e.target.value)} />
            <div className="flex items-end">
              <Button variant="primary" size="md" onClick={() => {
                if (!newUomCode || !newUomName) return;
                addUOM(newUomCode, newUomName, newUomDecimals);
                setNewUomCode('');
                setNewUomName('');
              }}>
                <Icon name="Plus" className="w-4 h-4" /> Save UOM
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600 text-[10px] uppercase">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">UOM Name</th>
                <th className="py-3 px-4 text-center">Decimal Precision</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {(state.uoms || []).map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-bold font-mono text-slate-900">{u.code}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{u.name}</td>
                  <td className="py-3 px-4 text-center font-mono text-slate-500">{u.decimalPlaces} Decimals</td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => deleteUOM(u.id)} className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors" title="Delete UOM">
                      <Icon name="Trash2" className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // --- PARTIES SUB-TAB ---
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
            <button onClick={() => setSubTab('overview')} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
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
            <Input icon="Search" placeholder="Search party name, location..." value={partySearch} onChange={(e) => setPartySearch(e.target.value)} />
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

  // --- PRODUCTS / ITEM MASTER SUB-TAB ---
  if (subTab === 'products') {
    const filteredProds = (state.products || []).filter(p => p.name.toLowerCase().includes(prodSearch.toLowerCase()) || p.id.toLowerCase().includes(prodSearch.toLowerCase()));

    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button onClick={() => setSubTab('overview')} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
              <Icon name="ArrowLeft" className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Products Master</h1>
              <p className="text-xs text-slate-500 mt-0.5">Master repository of items, types, groups, UOMs, and reorder levels</p>
            </div>
          </div>
          <Button variant="primary" size="md" onClick={() => setIsProdFormOpen(true)}>
            <Icon name="Plus" className="w-4 h-4" /> Add Item Master
          </Button>
        </div>

        {/* MODAL: CREATE ITEM MASTER (Tabbed Dialog matching user screenshot) */}
        {isProdFormOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 my-8">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Create Item Master</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">Code: ITM00000{(state.products?.length || 0) + 1}</p>
                </div>
                <button onClick={() => setIsProdFormOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
                  <Icon name="X" className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-6 text-xs font-semibold text-slate-500">
                {[
                  { id: 'general', label: 'General' },
                  { id: 'tax', label: 'Tax & HSN' },
                  { id: 'uomStock', label: 'UOM & Stock' },
                  { id: 'purchaseSales', label: 'Purchase & Sales' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setProdModalTab(t.id)}
                    className={`py-3 border-b-2 transition-colors cursor-pointer ${
                      prodModalTab === t.id ? 'border-slate-900 text-slate-900 font-bold' : 'border-transparent hover:text-slate-800'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6 space-y-4 text-xs">
                {prodModalTab === 'general' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Item Code (Auto Generated)</label>
                        <input
                          disabled
                          value={`ITM00000${(state.products?.length || 0) + 1}`}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-100 font-mono text-slate-500 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <Input
                          label="Item Name *"
                          placeholder="E.g. Cotton Yarn 40s Combed"
                          value={pName}
                          onChange={(e) => setPName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Item Type with Quick Add */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block font-semibold text-slate-700">Item Type</label>
                          <button onClick={() => setQuickAddType('itemType')} className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5">
                            + New
                          </button>
                        </div>
                        <Select
                          options={itemTypeOptions}
                          value={pItemType || itemTypeOptions[0]}
                          onChange={(e) => setPItemType(e.target.value)}
                        />
                      </div>

                      {/* Major Category Group with Quick Add */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block font-semibold text-slate-700">Major Category Group</label>
                          <button onClick={() => setQuickAddType('major')} className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5">
                            + New
                          </button>
                        </div>
                        <Select
                          options={majorOptions}
                          value={pMajor || majorOptions[0]}
                          onChange={(e) => setPMajor(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Sub Category Group with Quick Add */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block font-semibold text-slate-700">Sub Category Group</label>
                          <button onClick={() => setQuickAddType('sub')} className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5">
                            + New
                          </button>
                        </div>
                        <Select
                          options={subOptions.length > 0 ? subOptions : ['No Sub Groups']}
                          value={pSub || subOptions[0]}
                          onChange={(e) => setPSub(e.target.value)}
                        />
                      </div>

                      {/* Sub-Sub Category Group with Quick Add */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block font-semibold text-slate-700">Sub-Sub Category Group</label>
                          <button onClick={() => setQuickAddType('subSub')} className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5">
                            + New
                          </button>
                        </div>
                        <Select
                          options={subSubOptions.length > 0 ? subSubOptions : ['No Sub-Sub Groups']}
                          value={pSubSub || subSubOptions[0]}
                          onChange={(e) => setPSubSub(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Brand with Quick Add */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block font-semibold text-slate-700">Brand</label>
                          <button onClick={() => setQuickAddType('brand')} className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5">
                            + New
                          </button>
                        </div>
                        <Select
                          options={brandOptions}
                          value={pBrand || brandOptions[0]}
                          onChange={(e) => setPBrand(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {prodModalTab === 'tax' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="HSN / SAC Code" placeholder="E.g. 52051210" value={pHsn} onChange={(e) => setPHsn(e.target.value)} />
                      <Select label="GST Rate %" options={[0, 5, 12, 18, 28]} value={pGst} onChange={(e) => setPGst(e.target.value)} />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Item Description</label>
                      <textarea
                        rows={3}
                        placeholder="Detailed technical specifications..."
                        value={pDesc}
                        onChange={(e) => setPDesc(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                      />
                    </div>
                  </div>
                )}

                {prodModalTab === 'uomStock' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block font-semibold text-slate-700">Primary UOM</label>
                          <button onClick={() => setQuickAddType('uom')} className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5">
                            + New
                          </button>
                        </div>
                        <Select options={uomOptions} value={pUom || uomOptions[0]} onChange={(e) => setPUom(e.target.value)} />
                      </div>
                      <Input label="Opening Stock" type="number" value={pStock} onChange={(e) => setPStock(e.target.value)} />
                      <Input label="Min Reorder Level" type="number" value={pMinLevel} onChange={(e) => setPMinLevel(e.target.value)} />
                    </div>
                  </div>
                )}

                {prodModalTab === 'purchaseSales' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Default Purchase Rate (₹)" type="number" value={pRate} onChange={(e) => setPRate(e.target.value)} />
                      <Input label="Default Selling Rate (₹)" type="number" value={pSellingRate} onChange={(e) => setPSellingRate(e.target.value)} />
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
                <Button variant="secondary" size="md" onClick={() => setIsProdFormOpen(false)}>Cancel</Button>
                <Button variant="primary" size="md" onClick={handleSaveProduct}>Save Item Master</Button>
              </div>
            </div>
          </div>
        )}

        {/* QUICK ADD MODAL FOR DROPDOWNS */}
        {quickAddType && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 text-sm">
                Add New {quickAddType === 'itemType' ? 'Item Type' : quickAddType === 'major' ? 'Major Category Group' : quickAddType === 'sub' ? 'Sub Category Group' : quickAddType === 'subSub' ? 'Sub-Sub Category Group' : quickAddType === 'brand' ? 'Brand' : 'Unit of Measure'}
              </h3>
              <Input
                label="Name *"
                placeholder="Enter name..."
                value={quickAddName}
                onChange={(e) => setQuickAddName(e.target.value)}
              />
              {(quickAddType === 'itemType' || quickAddType === 'major' || quickAddType === 'uom') && (
                <Input
                  label="Code (Optional)"
                  placeholder="E.g. ABC"
                  value={quickAddCode}
                  onChange={(e) => setQuickAddCode(e.target.value)}
                />
              )}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="secondary" size="sm" onClick={() => setQuickAddType(null)}>Cancel</Button>
                <Button variant="primary" size="sm" onClick={handleQuickAddSave}>Save & Select</Button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs w-full sm:w-80">
          <Input icon="Search" placeholder="Search product name..." value={prodSearch} onChange={(e) => setProdSearch(e.target.value)} />
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 font-semibold text-slate-600 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Item Type</th>
                <th className="py-3 px-4 text-center">UOM</th>
                <th className="py-3 px-4">Major Group</th>
                <th className="py-3 px-4">Sub Group</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredProds.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400 italic">No items found. Click "Add Item Master" above to create one.</td>
                </tr>
              ) : (
                filteredProds.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                    <td className="py-3 px-4 text-slate-600"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">{p.itemType || 'Raw Material'}</span></td>
                    <td className="py-3 px-4 text-center font-mono text-slate-500">{p.uom}</td>
                    <td className="py-3 px-4 text-slate-700">{p.majorGroup}</td>
                    <td className="py-3 px-4 text-slate-600">{p.subGroup}</td>
                    <td className="py-3 px-4 text-slate-600">{p.brand || 'Generic'}</td>
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

  if (subTab === 'locations') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
          <button onClick={() => setSubTab('overview')} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
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
