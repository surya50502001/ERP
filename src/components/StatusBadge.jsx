import React from 'react';

export default function StatusBadge({ status }) {
  const statusConfig = {
    'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200/60 font-semibold',
    'Received': 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    'Paid': 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    'Success': 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    'Active': 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    'Pending Approval': 'bg-amber-100 text-amber-900 border-amber-300 font-semibold',
    'Pending': 'bg-amber-50 text-amber-700 border-amber-200/60',
    'Partial': 'bg-sky-50 text-sky-700 border-sky-200/60',
    'Low Stock': 'bg-rose-50 text-rose-700 border-rose-200/60',
    'Overdue': 'bg-rose-50 text-rose-700 border-rose-200/60',
    'Rejected': 'bg-rose-100 text-rose-800 border-rose-300 font-semibold',
    'Cancelled': 'bg-slate-100 text-slate-600 border-slate-200'
  };

  const style = statusConfig[status] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {status}
    </span>
  );
}

window.StatusBadge = StatusBadge;
