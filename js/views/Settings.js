(function () {
  const { useState } = React;

  window.SettingsView = function ({ onNavigate }) {
    const { currentUser, showToast, resetToMockData } = window.useERP();
    const [companyName, setCompanyName] = useState((currentUser && currentUser.companyName) || 'My Enterprise');
    const [gstin, setGstin] = useState('33AAACS1234F1Z9');
    const [address, setAddress] = useState('104 Cross Cut Road, Gandhipuram, Coimbatore');
    const [currency, setCurrency] = useState('₹ (INR)');

    const handleSaveSettings = () => {
      showToast('Settings Saved', 'System preferences updated successfully.');
    };

    return React.createElement('div', { className: 'space-y-6 max-w-4xl mx-auto' },

      // Header Bar
      React.createElement('div', { className: 'pb-2 border-b border-slate-200' },
        React.createElement('h1', { className: 'text-xl font-bold text-slate-900 tracking-tight' }, 'System Settings'),
        React.createElement('p', { className: 'text-xs text-slate-500 mt-0.5' }, 'Configure company profile, GST defaults, and LocalStorage data flow')
      ),

      // Company Info Card
      React.createElement('div', { className: 'bg-white border border-slate-200/80 rounded-xl p-6 shadow-2xs space-y-4 text-xs' },
        React.createElement('h3', { className: 'text-sm font-bold text-slate-900 border-b border-slate-100 pb-2' }, 'Company Profile'),

        React.createElement(window.Input, {
          label: 'Registered Company Name',
          value: companyName,
          onChange: (e) => setCompanyName(e.target.value)
        }),

        React.createElement('div', { className: 'grid grid-cols-2 gap-4' },
          React.createElement(window.Input, {
            label: 'GSTIN Number',
            value: gstin,
            onChange: (e) => setGstin(e.target.value)
          }),
          React.createElement(window.Input, {
            label: 'Primary Currency',
            value: currency,
            onChange: (e) => setCurrency(e.target.value)
          })
        ),

        React.createElement(window.Input, {
          label: 'Registered Address',
          value: address,
          onChange: (e) => setAddress(e.target.value)
        })
      ),

      // Local Storage Data Management Card
      React.createElement('div', { className: 'bg-white border border-slate-200/80 rounded-xl p-6 shadow-2xs space-y-4 text-xs' },
        React.createElement('h3', { className: 'text-sm font-bold text-slate-900 border-b border-slate-100 pb-2' }, 'LocalStorage Data Persistence'),

        React.createElement('div', { className: 'flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-slate-50' },
          React.createElement('div', null,
            React.createElement('h4', { className: 'font-bold text-slate-900' }, 'Browser LocalStorage Active'),
            React.createElement('p', { className: 'text-slate-500 text-[11px] mt-0.5' }, 'All parties, POs, GRNs, FIFO batch movements, and sales invoices are automatically persisted to window.localStorage.')
          ),
          React.createElement('span', { className: 'px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase' }, 'Persisted')
        ),

        React.createElement('div', { className: 'pt-2 flex items-center justify-between' },
          React.createElement(window.Button, { variant: 'danger', size: 'md', onClick: resetToMockData },
            React.createElement(window.Icon, { name: 'RotateCcw', className: 'w-4 h-4' }),
            'Reset to Fresh Mock Data'
          ),
          React.createElement(window.Button, { variant: 'primary', size: 'md', onClick: handleSaveSettings }, 'Save Profile Changes')
        )
      )
    );
  };
})();
