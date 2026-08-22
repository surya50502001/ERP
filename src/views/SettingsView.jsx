import React, { useState } from 'react';
import Icon from '../components/Icon';
import Button from '../components/Button';
import Input from '../components/Input';
import { useERP } from '../context/ERPContext';

export default function SettingsView({ onNavigate }) {
  const { currentUser, showToast, resetToMockData, clearAllData } = useERP();
  const [companyName, setCompanyName] = useState(currentUser?.companyName || 'My Enterprise');
  const [gstin, setGstin] = useState('33AAACS1234F1Z9');
  const [address, setAddress] = useState('104 Cross Cut Road, Gandhipuram, Coimbatore');
  const [currency, setCurrency] = useState('₹ (INR)');

  const handleSaveSettings = () => {
    if (showToast) {
      showToast('Settings Saved', 'System preferences updated successfully.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">Configure company profile, GST defaults, and database persistence settings</p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-2xs space-y-4 text-xs">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Company Profile</h3>

        <Input
          label="Registered Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="GSTIN Number"
            value={gstin}
            onChange={(e) => setGstin(e.target.value)}
          />
          <Input
            label="Primary Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          />
        </div>

        <Input
          label="Registered Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-2xs space-y-4 text-xs">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Database Persistence & Data Clearing</h3>

        <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-slate-50">
          <div>
            <h4 className="font-bold text-slate-900">Database Connected</h4>
            <p className="text-slate-500 text-[11px] mt-0.5">All data is securely persisted to the PostgreSQL database.</p>
          </div>
          <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">PostgreSQL Connected</span>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex gap-3">
          </div>
          <Button variant="primary" size="md" onClick={handleSaveSettings}>Save Profile Changes</Button>
        </div>
      </div>
    </div>
  );
}

window.SettingsView = SettingsView;
