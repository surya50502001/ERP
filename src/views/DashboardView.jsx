import React from 'react';
import Icon from '../components/Icon';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { useERP } from '../context/ERPContext';

export default function DashboardView({ onNavigate }) {
  const { state } = useERP();
  if (!state) return null;

  const totalPurchases = (state.purchaseOrders || []).reduce((acc, po) => acc + (po.totalAmount || 0), 0);
  const totalSales = (state.salesInvoices || []).reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);
  const totalStockValue = (state.products || []).reduce((acc, p) => acc + (p.stockValue || 0), 0);

  const pendingPOsCount = (state.purchaseOrders || []).filter(p => p.status === 'Pending' || p.status === 'Partial').length;
  const lowStockCount = (state.products || []).filter(p => p.availableStock <= p.minReorderLevel).length;
  const pendingInvoicesCount = (state.salesInvoices || []).filter(i => i.status === 'Pending' || i.status === 'Overdue').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Good morning, Store Manager</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Operational overview for Sri Lakshmi Fabrics Pvt Ltd • Thursday, 20 Aug 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => onNavigate('purchases')}>
            <Icon name="Plus" className="w-3.5 h-3.5" /> Create PO
          </Button>
          <Button size="sm" variant="primary" onClick={() => onNavigate('sales')}>
            <Icon name="Plus" className="w-3.5 h-3.5" /> Create Invoice
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Purchases</span>
            <span className="p-1.5 rounded-md bg-slate-100 text-slate-700">
              <Icon name="ShoppingBag" className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight font-mono">₹{(totalPurchases / 1000).toFixed(2)}L</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">↑ 12% vs last week</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Sales</span>
            <span className="p-1.5 rounded-md bg-slate-100 text-slate-700">
              <Icon name="Receipt" className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight font-mono">₹{(totalSales / 100000).toFixed(2)}L</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">↑ 8% vs target</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock Value (FIFO)</span>
            <span className="p-1.5 rounded-md bg-slate-100 text-slate-700">
              <Icon name="Package" className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight font-mono">₹{(totalStockValue / 100000).toFixed(2)}L</span>
            <span className="text-xs text-slate-500 font-medium">{state.products?.length || 0} products active</span>
          </div>
        </div>
      </div>

      {/* Needs Attention */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Icon name="AlertCircle" className="w-4 h-4 text-amber-500" />
            Needs attention
          </h3>
          <span className="text-xs text-slate-400 font-medium">Action required</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div
            onClick={() => onNavigate('purchases')}
            className="p-3 rounded-lg border border-amber-200/60 bg-amber-50/40 hover:bg-amber-50 transition-colors cursor-pointer flex items-center justify-between group"
          >
            <div>
              <p className="font-semibold text-amber-900">{pendingPOsCount} Purchase Orders awaiting GRN</p>
              <p className="text-amber-700/80 mt-0.5">Receiving required to update inventory</p>
            </div>
            <Icon name="ArrowRight" className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
          </div>

          <div
            onClick={() => onNavigate('inventory')}
            className="p-3 rounded-lg border border-rose-200/60 bg-rose-50/40 hover:bg-rose-50 transition-colors cursor-pointer flex items-center justify-between group"
          >
            <div>
              <p className="font-semibold text-rose-900">{lowStockCount} products running low</p>
              <p className="text-rose-700/80 mt-0.5">Organic Cotton Yarn 30s at 15 KG</p>
            </div>
            <Icon name="ArrowRight" className="w-4 h-4 text-rose-600 group-hover:translate-x-1 transition-transform" />
          </div>

          <div
            onClick={() => onNavigate('sales')}
            className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-between group"
          >
            <div>
              <p className="font-semibold text-slate-900">{pendingInvoicesCount} pending invoices</p>
              <p className="text-slate-600 mt-0.5">Follow up on payment collection</p>
            </div>
            <Icon name="ArrowRight" className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent activity</h3>
            <p className="text-xs text-slate-500 mt-0.5">Real-time audit log of purchases, GRNs, and sales</p>
          </div>
          <Button size="sm" variant="ghost" onClick={() => onNavigate('reports')}>View full log</Button>
        </div>

        <div className="divide-y divide-slate-100">
          {(state.recentActivities || []).map(act => (
            <div key={act.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50/80 transition-colors text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold font-mono text-[11px] text-slate-800 border border-slate-200">
                  {act.code.split('-')[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 font-mono">{act.code}</span>
                    <span className="text-slate-400 font-normal">•</span>
                    <span className="font-semibold text-slate-800">{act.party}</span>
                  </div>
                  <p className="text-slate-500 mt-0.5 text-[11px]">{act.detail}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={act.status} />
                <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">{act.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.DashboardView = DashboardView;
