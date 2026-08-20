// src/App.jsx
import React from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import AppShell from './components/AppShell.jsx';
import DashboardView from './views/DashboardView.jsx';
import PurchasesView from './views/PurchasesView.jsx';
import SalesView from './views/SalesView.jsx';
import InventoryView from './views/InventoryView.jsx';
import MastersView from './views/MastersView.jsx';
import ReportsView from './views/ReportsView.jsx';
import SettingsView from './views/SettingsView.jsx';
import { ERPProvider } from './context/ERPContext.jsx';

function App() {
  const navigate = useNavigate();
  const onNavigate = (tabId) => {
    navigate(`/${tabId}`);
  };

  // Determine current tab from location pathname (without leading slash)
  const currentTab = window.location.hash.replace('#/', '') || 'dashboard';

  // Map tab to component view
  const viewMap = {
    dashboard: DashboardView,
    purchases: PurchasesView,
    sales: SalesView,
    inventory: InventoryView,
    masters: MastersView,
    reports: ReportsView,
    settings: SettingsView,
  };
  const ViewComponent = viewMap[currentTab] || DashboardView;

  return (
    <ERPProvider>
      <AppShell currentTab={currentTab} onNavigate={onNavigate}>
        <ViewComponent onNavigate={onNavigate} />
      </AppShell>
    </ERPProvider>
  );
}

export default function WrappedApp() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </HashRouter>
  );
}
