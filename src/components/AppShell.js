import React from 'react';

const AppShell = ({ currentTab, onNavigate, children }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'purchases', label: 'Purchases' },
    { id: 'sales', label: 'Sales' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'masters', label: 'Masters' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-6">Prime ERP</h2>
          <nav className="space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  currentTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold">{tabs.find(t => t.id === currentTab)?.label || ''}</h1>
          {/* Command Palette Placeholder */}
          <button
            onClick={() => alert('Command Palette (Ctrl+K)')}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            K
          </button>
        </div>
        {children}
      </main>
    </div>
  );
};

export default AppShell;