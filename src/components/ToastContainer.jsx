import React from 'react';
import Icon from './Icon';
import { useERP } from '../context/ERPContext';

export default function ToastContainer() {
  const erp = useERP();
  const toasts = erp?.toasts || [];
  const removeToast = erp?.removeToast || (() => {});

  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-2.5 pointer-events-none max-w-sm w-full">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-slate-900 text-white p-3.5 rounded-xl shadow-xl flex items-start gap-3 border border-slate-800 animate-in slide-in-from-bottom-2 transition-all"
        >
          <div className={`p-1 rounded-full ${toast.type === 'error' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
            <Icon name={toast.type === 'error' ? 'AlertCircle' : 'CheckCircle2'} className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-semibold text-white">{toast.title}</h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white p-0.5"
          >
            <Icon name="X" className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

window.ToastContainer = ToastContainer;
