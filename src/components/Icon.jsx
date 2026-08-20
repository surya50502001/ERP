// src/components/Icon.jsx
import React from 'react';
import * as LucideIcons from 'lucide-react';

/**
 * Icon component that renders a Lucide icon by name.
 * Usage: <Icon name="Search" className="w-4 h-4" />
 */
export default function Icon({ name, ...props }) {
  const Component = LucideIcons[name];
  return Component ? <Component {...props} /> : null;
}
