import React, { useState } from 'react';
import Icon from '../components/Icon';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Drawer from '../components/Drawer';
import StatusBadge from '../components/StatusBadge';
import { useERP } from '../context/ERPContext';

export default function InventoryView({ onNavigate }) {
  const { state } = useERP();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (!state) return null;

  const filteredProducts = (state.products || []).filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || p.majorGroup === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const activeProd = selectedProduct ? (state.products || []).find(p => p.id === selectedProduct.id) || selectedProduct : null;
  const prodBatches = activeProd ? ((state.batches && state.batches[activeProd.id]) || []) : [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Stock & FIFO Inventory</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time available stock levels and automated FIFO batch queues</p>
        </div>
        <Button variant="secondary" size="md" onClick={() => onNavigate('reports')}>
          <Icon name="FileSpreadsheet" className="w-4 h-4" />
          Valuation Report
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="w-full sm:w-80">
          <Input
            icon="Search"
            placeholder="Search product name, code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto text-xs">
          <Select
            options={['All', 'Yarn', 'Fabric', 'Trims']}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-32"
          />
          <Select
            options={['All', 'Active', 'Low Stock']}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-32"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden overflow-x-auto shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50/80 border-b border-slate-200/80 font-semibold text-slate-600 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Product Name</th>
              <th className="py-3 px-4 text-right">Available Stock</th>
              <th className="py-3 px-4 text-center">UOM</th>
              <th className="py-3 px-4 text-right">Average Rate (₹)</th>
              <th className="py-3 px-4 text-right">Stock Value (₹)</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Batches</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {filteredProducts.map(prod => (
              <tr
                key={prod.id}
                onClick={() => setSelectedProduct(prod)}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer"
              >
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900">{prod.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">{prod.id} • {prod.majorGroup} / {prod.subGroup}</div>
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 text-sm">{prod.availableStock}</td>
                <td className="py-3 px-4 text-center font-mono text-slate-500">{prod.uom}</td>
                <td className="py-3 px-4 text-right font-mono">₹{prod.avgRate}</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">₹{prod.stockValue.toLocaleString('en-IN')}</td>
                <td className="py-3 px-4 text-center">
                  <StatusBadge status={prod.status} />
                </td>
                <td className="py-3 px-4 text-right">
                  <Button size="sm" variant="ghost">
                    <Icon name="Layers" className="w-3.5 h-3.5 mr-1" />
                    View Batches
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Drawer
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={activeProd ? activeProd.name : 'Product Batches'}
        subtitle={activeProd ? `Available Stock: ${activeProd.availableStock} ${activeProd.uom} • Avg Rate: ₹${activeProd.avgRate}` : ''}
        footer={<Button variant="secondary" size="md" onClick={() => setSelectedProduct(null)}>Close Panel</Button>}
      >
        {activeProd && (
          <div className="space-y-5 text-xs">
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-bold block">Total Value</span>
                <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">₹{activeProd.stockValue.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-bold block">Reorder Level</span>
                <span className="text-base font-bold text-slate-800 font-mono mt-0.5 block">{activeProd.minReorderLevel} {activeProd.uom}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-900 text-[11px] leading-relaxed flex items-start gap-2">
              <Icon name="ShieldCheck" className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                <strong className="block font-bold">Automated FIFO Queue</strong>
                During sales invoice dispatch, stock is deducted chronologically starting from the oldest available batch.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900">FIFO Batch Ledger</h4>
              {prodBatches.length === 0 ? (
                <div className="py-6 text-center text-slate-400 italic">No active batches found.</div>
              ) : (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600 text-[10px] uppercase">
                      <tr>
                        <th className="py-2 px-3">Batch No</th>
                        <th className="py-2 px-3 text-right">Available</th>
                        <th className="py-2 px-3 text-right">Purchase Rate</th>
                        <th className="py-2 px-3 text-right">Batch Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                      {prodBatches.map((b, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3">
                            <span className="font-bold font-mono text-slate-900 block">{b.batchNo}</span>
                            <span className="text-[10px] text-slate-400 block">{b.receivedDate}</span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{b.availableQty} {activeProd.uom}</td>
                          <td className="py-2.5 px-3 text-right font-mono">₹{b.rate}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">₹{(b.availableQty * b.rate).toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

window.InventoryView = InventoryView;
