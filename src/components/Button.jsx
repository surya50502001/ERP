// src/components/Button.jsx


/**
 * Reusable button component.
 * Props: variant (primary, secondary, ghost, accent, danger), size (sm, md, lg), className, children, ...rest
 */
export default function Button({ variant = 'primary', size = 'md', className = '', children, ...rest }) {
  const base = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900 shadow-sm",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-400 shadow-xs",
    ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 focus:ring-slate-300",
    accent: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-600 shadow-sm",
    danger: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-600 shadow-sm",
  };
  const sizes = {
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-3.5 py-1.5 text-sm gap-2",
    lg: "px-4 py-2 text-base gap-2.5",
  };
  return (
    <button className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`} {...rest}>
      {children}
    </button>
  );
}
