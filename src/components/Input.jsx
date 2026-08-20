import React from 'react';
import Icon from './Icon';

export default function Input({ label, error, icon, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>}
      <div className="relative rounded-lg shadow-xs">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon name={icon} className="w-4 h-4" />
          </div>
        )}
        <input
          className={`w-full rounded-lg border border-slate-200 bg-white py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors ${icon ? 'pl-9' : 'px-3'} ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
}

window.Input = Input;
