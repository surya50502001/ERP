import React, { useState } from 'react';
import Icon from '../components/Icon';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import { useERP } from '../context/ERPContext';

export default function RegisterView({ onNavigate }) {
  const { registerUser } = useERP();
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Store Manager');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !companyName.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Please fill in all required fields including Company Name.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser(fullName, email, password, role, companyName);
      if (res && res.success) {
        onNavigate('dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 selection:bg-slate-800 selection:text-white">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-bold text-xl flex items-center justify-center mx-auto shadow-md">
            E
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create your ERP Account</h1>
          <p className="text-xs text-slate-500 font-medium">Join ERP to manage your inventory, sales, and purchase workflows</p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <Icon name="AlertCircle" className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <Input
            label="Company / Enterprise Name"
            placeholder="Acme Corporation Pvt Ltd"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="user@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Select
            label="User Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={[
              { value: 'Store Manager', label: 'Store Manager' },
              { value: 'Inventory Admin', label: 'Inventory Admin' },
              { value: 'Sales Executive', label: 'Sales Executive' },
              { value: 'Purchasing Agent', label: 'Purchasing Agent' }
            ]}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center py-2.5 text-xs font-bold"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating account...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Create Account <Icon name="ArrowRight" className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>

        {/* Footer Link */}
        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="font-bold text-slate-900 hover:underline"
          >
            Sign in here
          </button>
        </div>
      </div>
    </div>
  );
}

window.RegisterView = RegisterView;
