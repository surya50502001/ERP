import React, { useState } from 'react';
import Icon from '../components/Icon';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Combobox from '../components/Combobox';
import StatusBadge from '../components/StatusBadge';
import { useERP } from '../context/ERPContext';

export default function SalesView({ onNavigate }) {
  const { state, createSalesInvoice, approveInvoice, rejectInvoice, addParty, addProduct } = useERP();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);

  // Form states for New Invoice
  const [invCustomerId, setInvCustomerId] = useState('');
  const [invDueDate, setInvDueDate] = useState('');
  const [gstRate, setGstRate] = useState(5);
  const [invItems, setInvItems] = useState([
    { productId: '', qty: 10, rate: 0 }
  ]);

  // Inline forms in main area
  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState(false);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);

  // Inline Customer state
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custState, setCustState] = useState('Gujarat');

  // Inline Product state
  const [prodName, setProdName] = useState('');
  const [prodUom, setProdUom] = useState('KG');
  const [prodRate, setProdRate] = useState(250);

  if (!state) return null;

  const filteredInvoices = (state.salesInvoices || []).filter(inv => {
    const matchesSearch = String(inv.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(inv.customerName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingApprovalInvoices = (state.salesInvoices || []).filter(inv => inv.status === 'Pending Approval');

  const formattedLineItems = invItems.map(item => {
    const prod = (state.products || []).find(p => p.id === item.productId) || (state.products && state.products[0]);
    const qty = parseFloat(item.qty || 10);
    const rate = parseFloat(item.rate || (prod ? prod.avgRate * 1.15 : 230));
    return {
      productId: item.productId || (prod ? prod.id : 'PRD-001'),
      productName: prod ? prod.name : 'Cotton Yarn 40s Combed',
      uom: prod ? prod.uom : 'KG',
      qty,
      rate: Math.round(rate),
      amount: Math.round(qty * rate)
    };
  });

  const subtotal = formattedLineItems.reduce((acc, i) => acc + i.amount, 0) || 5000;
  const taxAmount = Math.round(subtotal * (gstRate / 100));
  const grandTotal = subtotal + taxAmount;

  const handleCreateInvoice = () => {
    const customer = (state.parties || []).find(p => p.id === invCustomerId) ||
      (state.parties && state.parties.find(p => p.type === 'Customer')) ||
      { id: 'PTY-104', name: 'XYZ Textiles' };

    createSalesInvoice({
      customerId: customer.id,
      customerName: customer.name,
      dueDate: invDueDate || '2026-09-05',
      itemsCount: formattedLineItems.length,
      subtotal,
      tax: taxAmount,
      totalAmount: grandTotal,
      items: formattedLineItems,
      status: 'Pending Approval'
    });

    setIsNewInvoiceOpen(false);
    setInvCustomerId('');
    setInvItems([{ productId: '', qty: 10, rate: 0 }]);
  };

  const handleSaveInlineCustomer = () => {
    if (!custName) return;
    addParty({
      name: custName,
      type: 'Customer',
      phone: custPhone || '+91 98250 00000',
      location: `Surat, ${custState}`,
      country: 'India',
      state: custState
    });
    setCustName('');
    setIsCreateCustomerOpen(false);
  };

  const handleSaveInlineProduct = () => {
    if (!prodName) return;
    addProduct({
      name: prodName,
      uom: prodUom,
      majorGroup: 'Yarn',
      subGroup: 'Cotton Yarn',
      subSubGroup: 'Combed Cotton',
      purchaseRate: parseFloat(prodRate * 0.85),
      openingStock: 100
    });
    setProdName('');
    setIsCreateProductOpen(false);
  };

  // FULL MAIN AREA CREATION VIEW
  if (isNewInvoiceOpen) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNewInvoiceOpen(false)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Icon name="ArrowLeft" className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create New Sales Invoice</h1>
              <p className="text-xs text-slate-500 mt-0.5">Fills items, calculates GST, and submits invoice for approval</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" onClick={() => setIsNewInvoiceOpen(false)}>Cancel</Button>
            <Button variant="primary" size="md" onClick={handleCreateInvoice}>
              <Icon name="Plus" className="w-4 h-4" /> Submit for Approval
            </Button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <Combobox
              label="Select Customer"
              placeholder="Search customer name..."
              options={(state.parties || []).filter(p => p.type === 'Customer' || p.type === 'Both').map(p => ({ label: p.name, value: p.id, sublabel: p.location }))}
              value={invCustomerId}
              onChange={(val) => setInvCustomerId(val)}
              onCreateNew={() => setIsCreateCustomerOpen(true)}
              createLabel="+ Create new customer inline"
            />
            <Input
              label="Payment Due Date"
              type="date"
              value={invDueDate}
              onChange={(e) => setInvDueDate(e.target.value)}
            />
          </div>

          {/* Customer Inline Form */}
          {isCreateCustomerOpen && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <h4 className="font-bold text-slate-900 text-xs flex items-center justify-between">
                <span>Quick Add New Customer</span>
                <button onClick={() => setIsCreateCustomerOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input label="Customer Name" value={custName} onChange={(e) => setCustName(e.target.value)} />
                <Input label="Phone" value={custPhone} onChange={(e) => setCustPhone(e.target.value)} />
                <Select label="State" options={['Tamil Nadu', 'Gujarat', 'Maharashtra', 'Karnataka', 'Punjab']} value={custState} onChange={(e) => setCustState(e.target.value)} />
              </div>
              <Button size="sm" variant="primary" onClick={handleSaveInlineCustomer}>Save Customer</Button>
            </div>
          )}

          {/* Products Section */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Invoice Line Items</h3>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setInvItems([...invItems, { productId: '', qty: 10, rate: 0 }])}
              >
                + Add Item
              </Button>
            </div>

            {invItems.map((item, idx) => {
              const selectedProd = (state.products || []).find(p => p.id === item.productId);
              return (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-1">
                      <Combobox
                        label={`Product #${idx + 1}`}
                        placeholder="Search product..."
                        options={(state.products || []).map(p => ({ label: p.name, value: p.id, sublabel: `Stock: ${p.availableStock} ${p.uom}` }))}
                        value={item.productId}
                        onChange={(val) => {
                          const prod = (state.products || []).find(p => p.id === val);
                          const updated = [...invItems];
                          updated[idx] = { ...updated[idx], productId: val, rate: prod ? Math.round(prod.avgRate * 1.15) : 250 };
                          setInvItems(updated);
                        }}
                        onCreateNew={() => setIsCreateProductOpen(true)}
                        createLabel="+ Create product inline"
                      />
                    </div>
                    <Input
                      label="Qty"
                      type="number"
                      value={item.qty}
                      onChange={(e) => {
                        const updated = [...invItems];
                        updated[idx].qty = e.target.value;
                        setInvItems(updated);
                      }}
                    />
                    <Input
                      label="Selling Rate (₹)"
                      type="number"
                      value={item.rate}
                      onChange={(e) => {
                        const updated = [...invItems];
                        updated[idx].rate = e.target.value;
                        setInvItems(updated);
                      }}
                    />
                  </div>
                  {selectedProd && (
                    <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <Icon name="CheckCircle2" className="w-3.5 h-3.5" />
                      Available FIFO Stock: {selectedProd.availableStock} {selectedProd.uom}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Product Inline Form */}
          {isCreateProductOpen && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <h4 className="font-bold text-slate-900 text-xs flex items-center justify-between">
                <span>Quick Add Product</span>
                <button onClick={() => setIsCreateProductOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input label="Product Name" value={prodName} onChange={(e) => setProdName(e.target.value)} />
                <Select label="UOM" options={['KG', 'MTR', 'PCS']} value={prodUom} onChange={(e) => setProdUom(e.target.value)} />
                <Input label="Selling Rate (₹)" type="number" value={prodRate} onChange={(e) => setProdRate(e.target.value)} />
              </div>
              <Button size="sm" variant="primary" onClick={handleSaveInlineProduct}>Save Product</Button>
            </div>
          )}

          {/* Financial Calculation Box */}
          <div className="p-5 rounded-xl bg-slate-900 text-white space-y-3">
            <div className="flex justify-between text-slate-300 text-xs">
              <span>Subtotal</span>
              <span className="font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300 text-xs">
              <span>GST Tax Rate</span>
              <select
                className="bg-slate-800 text-white rounded px-2.5 py-1 text-xs font-mono border border-slate-700 focus:outline-none"
                value={gstRate}
                onChange={(e) => setGstRate(parseFloat(e.target.value))}
              >
                <option value={0}>0% Exempt</option>
                <option value={5}>5% GST</option>
                <option value={12}>12% GST</option>
                <option value={18}>18% GST</option>
              </select>
            </div>
            <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-slate-800">
              <span>Grand Total</span>
              <span className="font-mono text-lg text-emerald-400">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="md" onClick={() => setIsNewInvoiceOpen(false)}>Cancel</Button>
            <Button variant="primary" size="md" onClick={handleCreateInvoice}>Submit for Approval</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sales & Invoicing</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage Customer Invoices, Approvals, Payment Tracking, and Stock Dispatch</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setIsNewInvoiceOpen(true)}>
          <Icon name="Plus" className="w-4 h-4" />
          New Sales Invoice
        </Button>
      </div>

      {/* PROMINENT INVOICE APPROVAL WORKFLOW SECTION */}
      {pendingApprovalInvoices.length > 0 && (
        <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
            <div className="flex items-center gap-2">
              <Icon name="AlertCircle" className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-amber-900">
                Invoice Approvals Required ({pendingApprovalInvoices.length})
              </h3>
            </div>
            <span className="text-xs font-semibold text-amber-800 bg-amber-200/70 px-2.5 py-0.5 rounded">Action Needed</span>
          </div>

          <div className="divide-y divide-amber-200/60">
            {pendingApprovalInvoices.map(inv => (
              <div key={inv.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-amber-950 text-sm">{inv.id}</span>
                    <span className="font-semibold text-slate-800">• {inv.customerName}</span>
                    <StatusBadge status={inv.status} />
                  </div>
                  <p className="text-slate-600 mt-1 font-mono">
                    Total: ₹{(inv.totalAmount || 0).toLocaleString('en-IN')} • Due: {inv.dueDate || '2026-09-05'}
                  </p>
                </div>

                {/* APPROVAL & REJECTION BUTTONS */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="accent"
                    onClick={() => approveInvoice(inv.id, 'Store Manager')}
                  >
                    <Icon name="CheckCircle2" className="w-3.5 h-3.5" /> Approve Invoice
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => rejectInvoice(inv.id, 'Manager rejection')}
                  >
                    <Icon name="X" className="w-3.5 h-3.5" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="w-full sm:w-72">
          <Input
            icon="Search"
            placeholder="Search invoice no, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs font-medium text-slate-600">
          {['All', 'Pending Approval', 'Approved', 'Paid', 'Pending', 'Overdue', 'Rejected'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === st ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Sales Invoices Data Table */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden overflow-x-auto shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50/80 border-b border-slate-200/80 font-semibold text-slate-600 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Invoice No</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-center">Items</th>
              <th className="py-3 px-4 text-right">Total Amount (₹)</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Approval & Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-400 italic">No invoices found for filter "{statusFilter}". Click "New Sales Invoice" to create one.</td>
              </tr>
            ) : (
              filteredInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold font-mono text-slate-900">{inv.id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{inv.customerName}</td>
                  <td className="py-3 px-4 text-slate-500">{inv.date}</td>
                  <td className="py-3 px-4 text-center font-mono">{inv.itemsCount} items</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">₹{(inv.totalAmount || 0).toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    {inv.status === 'Pending Approval' ? (
                      <div className="inline-flex items-center gap-1.5">
                        <Button size="sm" variant="accent" onClick={() => approveInvoice(inv.id, 'Store Manager')}>
                          <Icon name="CheckCircle2" className="w-3.5 h-3.5" /> Approve
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => rejectInvoice(inv.id, 'Manager rejection')}>
                          <Icon name="X" className="w-3.5 h-3.5" /> Reject
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="ghost">Print</Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

window.SalesView = SalesView;
