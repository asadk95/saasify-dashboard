import { useState, useEffect } from 'react';
import { CreditCard, Download, Receipt, Building2, X, Check } from 'lucide-react';
import { Button, Card, Badge, ConfirmDialog, Input } from '../../components/common';
import { PricingPlans, UsageProgress } from '../../components/subscription';
import { useSubscriptionStore, useAuthStore, useProjectStore } from '../../stores';
import toast from 'react-hot-toast';
import './Billing.css';

const invoiceHistory = [
  { id: 'INV-001', date: 'Dec 15, 2025', amount: 29, status: 'paid' },
  { id: 'INV-002', date: 'Nov 15, 2025', amount: 29, status: 'paid' },
  { id: 'INV-003', date: 'Oct 15, 2025', amount: 29, status: 'paid' },
];

const planPrices = {
  starter: { monthly: 9, yearly: 7 },
  professional: { monthly: 29, yearly: 23 },
  enterprise: { monthly: 99, yearly: 79 },
};

const planNames = {
  starter: 'Starter',
  professional: 'Professional',
  enterprise: 'Enterprise',
};

export default function Billing() {
  const { user } = useAuthStore();
  const { projects } = useProjectStore();
  const { currentPlan, billingCycle, toggleBillingCycle, upgradePlan, cancelSubscription, isLoading } = useSubscriptionStore();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [bankForm, setBankForm] = useState({
    bankName: '',
    accountName: '',
    accountNumber: '',
    routingNumber: '',
  });
  const [savingBank, setSavingBank] = useState(false);

  // Load saved bank accounts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bankAccounts');
    if (saved) {
      setBankAccounts(JSON.parse(saved));
    }
  }, []);

  // Use real plan from user profile if available
  const activePlan = user?.plan || currentPlan || 'starter';

  // Real usage data based on actual counts
  const usageData = [
    { label: 'Team Members', used: 1, total: activePlan === 'starter' ? 5 : activePlan === 'professional' ? 25 : 999 },
    { label: 'Projects', used: projects.length, total: activePlan === 'starter' ? 5 : activePlan === 'professional' ? 50 : 999 },
    { label: 'Storage Used', used: 0.1, total: activePlan === 'starter' ? 1 : activePlan === 'professional' ? 10 : 100, unit: 'GB' },
  ];

  const price = planPrices[activePlan]?.[billingCycle] || planPrices[currentPlan]?.[billingCycle] || 29;

  const handleUpgrade = async (plan) => {
    if (plan === currentPlan) {
      toast.error('You are already on this plan');
      return;
    }
    const result = await upgradePlan(plan);
    if (result.success) {
      toast.success(result.message);
      setShowUpgrade(false);
    } else {
      toast.error('Failed to update plan');
    }
  };

  const handleCancelSubscription = async () => {
    const result = await cancelSubscription();
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error('Failed to cancel subscription');
    }
  };

  const handleDownloadInvoice = (invoiceId) => {
    toast.success(`Downloading ${invoiceId}...`);
  };

  const handleBankFormChange = (e) => {
    const { name, value } = e.target;
    setBankForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddBankAccount = async () => {
    // Validate form
    if (!bankForm.bankName || !bankForm.accountName || !bankForm.accountNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSavingBank(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newAccount = {
      id: Date.now(),
      ...bankForm,
      lastFour: bankForm.accountNumber.slice(-4),
      isDefault: bankAccounts.length === 0,
    };

    const updated = [...bankAccounts, newAccount];
    setBankAccounts(updated);
    localStorage.setItem('bankAccounts', JSON.stringify(updated));

    toast.success('Bank account added successfully!');
    setShowBankModal(false);
    setBankForm({ bankName: '', accountName: '', accountNumber: '', routingNumber: '' });
    setSavingBank(false);
  };

  const handleSetDefaultBank = (accountId) => {
    const updated = bankAccounts.map(acc => ({
      ...acc,
      isDefault: acc.id === accountId,
    }));
    setBankAccounts(updated);
    localStorage.setItem('bankAccounts', JSON.stringify(updated));
    toast.success('Default payment method updated');
  };

  const handleRemoveBank = (accountId) => {
    const updated = bankAccounts.filter(acc => acc.id !== accountId);
    setBankAccounts(updated);
    localStorage.setItem('bankAccounts', JSON.stringify(updated));
    toast.success('Bank account removed');
  };

  return (
    <div className="billing-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Billing</h1>
          <p className="page-subtitle">Manage your subscription, payment methods, and invoices</p>
        </div>
      </div>

      {/* Current Plan */}
      <Card className="billing-current-plan">
        <div className="plan-info">
          <div className="plan-details">
            <div className="plan-header">
              <h3 className="plan-name">{planNames[activePlan]}</h3>
              <Badge variant="success">active</Badge>
            </div>
            <p className="plan-price">
              <span className="plan-amount">${price}</span>
              <span className="plan-cycle">/{billingCycle}</span>
            </p>
            <p className="plan-next-billing">
              Next billing date: January 15, 2026
            </p>
          </div>
          <div className="plan-actions">
            <Button variant="secondary" onClick={() => setShowUpgrade(!showUpgrade)}>
              {showUpgrade ? 'Hide Plans' : 'Change Plan'}
            </Button>
            <Button variant="ghost" onClick={() => setShowCancelConfirm(true)}>
              Cancel Subscription
            </Button>
          </div>
        </div>
      </Card>

      {/* Upgrade Plans */}
      {showUpgrade && (
        <div className="billing-upgrade animate-slide-up">
          <div className="billing-cycle-toggle">
            <span className={billingCycle === 'monthly' ? 'active' : ''}>Monthly</span>
            <button
              className={`cycle-toggle ${billingCycle === 'yearly' ? 'active' : ''}`}
              onClick={toggleBillingCycle}
            >
              <span className="toggle-dot" />
            </button>
            <span className={billingCycle === 'yearly' ? 'active' : ''}>
              Yearly <Badge variant="success" size="sm">Save 20%</Badge>
            </span>
          </div>
          <PricingPlans
            billingCycle={billingCycle}
            currentPlan={activePlan}
            onSelectPlan={handleUpgrade}
          />
        </div>
      )}

      {/* Usage & Payment Grid */}
      <div className="billing-grid">
        {/* Usage */}
        <Card className="billing-usage">
          <h3 className="card-title-custom">Usage This Period</h3>
          <div className="usage-list">
            {usageData.map((item, index) => (
              <UsageProgress
                key={index}
                label={item.label}
                used={item.used}
                total={item.total}
                unit={item.unit}
              />
            ))}
          </div>
        </Card>

        {/* Payment Method */}
        <Card className="billing-payment">
          <h3 className="card-title-custom">Payment Methods</h3>

          {/* Saved Bank Accounts */}
          {bankAccounts.map((account) => (
            <div key={account.id} className={`payment-card ${account.isDefault ? 'default' : ''}`}>
              <div className="payment-card-icon bank">
                <Building2 size={24} />
              </div>
              <div className="payment-card-details">
                <p className="payment-card-number">{account.bankName}</p>
                <p className="payment-card-expiry">****{account.lastFour} • {account.accountName}</p>
              </div>
              {account.isDefault ? (
                <Badge variant="success" size="sm">Default</Badge>
              ) : (
                <div className="payment-actions">
                  <Button variant="ghost" size="sm" onClick={() => handleSetDefaultBank(account.id)}>
                    Set Default
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveBank(account.id)}>
                    <X size={14} />
                  </Button>
                </div>
              )}
            </div>
          ))}

          {/* Stripe - Optional */}
          <div className="payment-card optional">
            <div className="payment-card-icon stripe">
              <CreditCard size={24} />
            </div>
            <div className="payment-card-details">
              <p className="payment-card-number">Stripe (Optional)</p>
              <p className="payment-card-expiry">Credit/Debit Card</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => toast('Stripe integration coming soon!', { icon: '💳' })}>
              Connect
            </Button>
          </div>

          <Button variant="secondary" fullWidth className="payment-add-btn" onClick={() => setShowBankModal(true)}>
            Add Bank Account
          </Button>
        </Card>
      </div>

      {/* Invoice History */}
      <Card className="billing-invoices">
        <div className="invoices-header">
          <h3 className="card-title-custom">Invoice History</h3>
          <Button variant="ghost" size="sm" icon={Download} onClick={() => toast.success('Downloading all invoices...')}>
            Download All
          </Button>
        </div>
        <div className="invoices-table">
          <div className="invoices-row invoices-header-row">
            <span>Invoice</span>
            <span>Date</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          {invoiceHistory.map((invoice) => (
            <div key={invoice.id} className="invoices-row">
              <span className="invoice-id">{invoice.id}</span>
              <span>{invoice.date}</span>
              <span>${invoice.amount}.00</span>
              <Badge variant="success" size="sm">{invoice.status}</Badge>
              <Button variant="ghost" size="sm" icon={Receipt} onClick={() => handleDownloadInvoice(invoice.id)}>
                View
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Cancel Subscription Confirmation */}
      <ConfirmDialog
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={handleCancelSubscription}
        title="Cancel Subscription"
        message="Are you sure you want to cancel your subscription? You'll be downgraded to the Starter plan and lose access to premium features."
        confirmText="Yes, Cancel"
        cancelText="Keep Subscription"
        variant="danger"
        loading={isLoading}
      />

      {/* Add Bank Account Modal */}
      {showBankModal && (
        <div className="modal-overlay" onClick={() => setShowBankModal(false)}>
          <div className="modal-content bank-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Bank Account</h2>
              <button className="modal-close" onClick={() => setShowBankModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="bank-form">
                <Input
                  label="Bank Name"
                  name="bankName"
                  placeholder="e.g. Chase, Bank of America"
                  value={bankForm.bankName}
                  onChange={handleBankFormChange}
                  icon={Building2}
                />
                <Input
                  label="Account Holder Name"
                  name="accountName"
                  placeholder="Full name on account"
                  value={bankForm.accountName}
                  onChange={handleBankFormChange}
                />
                <Input
                  label="Account Number"
                  name="accountNumber"
                  placeholder="Enter account number"
                  value={bankForm.accountNumber}
                  onChange={handleBankFormChange}
                  type="password"
                />
                <Input
                  label="Routing Number (Optional)"
                  name="routingNumber"
                  placeholder="9-digit routing number"
                  value={bankForm.routingNumber}
                  onChange={handleBankFormChange}
                />
              </div>
              <p className="bank-disclaimer">
                Your banking information is encrypted and securely stored. We use industry-standard security measures to protect your data.
              </p>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={() => setShowBankModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddBankAccount} loading={savingBank}>
                Add Bank Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
