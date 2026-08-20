(function () {
  const { useState, useEffect } = React;

  function MainApp() {
    const [currentTab, setCurrentTab] = useState('dashboard');

    useEffect(() => {
      const handleHashChange = () => {
        const hash = window.location.hash.replace('#', '');
        if (['dashboard', 'purchases', 'sales', 'inventory', 'masters', 'reports', 'settings'].includes(hash)) {
          setCurrentTab(hash);
        }
      };

      handleHashChange();
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const navigateTo = (tabId) => {
      setCurrentTab(tabId);
      window.location.hash = tabId;
    };

    let ViewComponent = window.DashboardView;
    if (currentTab === 'purchases') ViewComponent = window.PurchasesView;
    if (currentTab === 'sales') ViewComponent = window.SalesView;
    if (currentTab === 'inventory') ViewComponent = window.InventoryView;
    if (currentTab === 'masters') ViewComponent = window.MastersView;
    if (currentTab === 'reports') ViewComponent = window.ReportsView;
    if (currentTab === 'settings') ViewComponent = window.SettingsView;

    return React.createElement(window.AppShell, { currentTab, onNavigate: navigateTo },
      React.createElement(ViewComponent, { onNavigate: navigateTo })
    );
  }

  function AppRoot() {
    return React.createElement(window.ERPProvider, null,
      React.createElement(MainApp)
    );
  }

  // Render Root into DOM
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(React.createElement(AppRoot));
  }
})();
