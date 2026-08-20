import React from 'react';
import Icon from '../components/Icon';
import Button from '../components/Button';
import { useERP } from '../context/ERPContext';

export default function ReportsView({ onNavigate }) {
  const { state } = useERP();
  if (!state) return null;

  const totalValuation = (state.products || []).reduce((acc, p) => acc + (p.stockValue || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">ERP Operational Reports</h1>
          <p className="text-xs text-slate-500 mt-0.5">Stock valuation, purchase registers, and sales performance analytics</p>
        </div>
        <Button variant="secondary" size="md">
          <Icon name="Download" className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Inventory Valuation (FIFO)</span>
          <h2 className="text-3xl font-bold font-mono text-emerald-400 mt-1">₹{totalValuation.toLocaleString('en-IN')}</h2>
          <p className="text-xs text-slate-300 mt-1">Valued across {state.products?.length || 0} active products and batch queues.</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-medium">
          <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
            <span className="text-slate-400 block text-[10px]">Total POs Issued</span>
            <span className="text-lg font-bold font-mono text-white">{state.purchaseOrders?.length || 0}</span>
          </div>
          <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
            <span className="text-slate-400 block text-[10px]">Total Invoices</span>
            <span className="text-lg font-bold font-mono text-white">{state.salesInvoices?.length || 0}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs space-y-3 p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Stock Valuation Ledger (FIFO)</h3>
          <span className="text-xs text-slate-400 font-mono">Live Valuation</span>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600 text-[10px] uppercase">
            <tr>
              <th className="py-2.5 px-3">Product Name</th>
              <th className="py-2.5 px-3 text-right">Available Stock</th>
              <th className="py-2.5 px-3 text-center">UOM</th>
              <th className="py-2.5 px-3 text-right">Avg Rate (₹)</th>
              <th className="py-2.5 px-3 text-right">Stock Value (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {(state.products || []).map(prod => (
              <tr key={prod.id} className="hover:bg-slate-50/50">
                <td className="py-3 px-3 font-bold text-slate-900">{prod.name}</td>
                <td className="py-3 px-3 text-right font-mono font-bold">{prod.availableStock}</td>
                <td className="py-3 px-3 text-center font-mono text-slate-500">{prod.uom}</td>
                <td className="py-3 px-3 text-right font-mono">₹{prod.avgRate}</td>
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">₹{prod.stockValue.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

window.ReportsView = ReportsView;
