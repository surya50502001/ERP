import React from 'react';

export default function Select({ label, options = [], className = '', ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>}
      <select
        className={`w-full rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors ${className}`}
        {...props}
      >
        {options.map((opt, i) => (
          <option key={i} value={typeof opt === 'object' ? opt.value : opt}>
            {typeof opt === 'object' ? opt.label : opt}
          </option>
        ))}
      </select>
    </div>
  );
}

window.Select = Select;
