import { Check } from 'lucide-react';
import { Button, Badge } from '../common';
import './PricingPlans.css';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for individuals and small teams',
    price: { monthly: 9, yearly: 7 },
    features: [
      '5 team members',
      '10 projects',
      '5GB storage',
      'Basic analytics',
      'Email support',
    ],
    popular: false,
    color: 'default'
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Best for growing teams and businesses',
    price: { monthly: 29, yearly: 24 },
    features: [
      '25 team members',
      'Unlimited projects',
      '100GB storage',
      'Advanced analytics',
      'Priority support',
      'API access',
      'Custom integrations',
    ],
    popular: true,
    color: 'primary'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with advanced needs',
    price: { monthly: 99, yearly: 79 },
    features: [
      'Unlimited team members',
      'Unlimited projects',
      'Unlimited storage',
      'Enterprise analytics',
      '24/7 dedicated support',
      'API access',
      'Custom integrations',
      'SSO & SAML',
      'Dedicated account manager',
    ],
    popular: false,
    color: 'accent'
  }
];

export default function PricingPlans({ billingCycle = 'monthly', onSelectPlan, currentPlan }) {
  return (
    <div className="pricing-plans">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`pricing-card ${plan.popular ? 'pricing-card-popular' : ''} pricing-card-${plan.color}`}
        >
          {plan.popular && (
            <Badge variant="primary" className="pricing-badge">Most Popular</Badge>
          )}
          <div className="pricing-header">
            <h3 className="pricing-name">{plan.name}</h3>
            <p className="pricing-description">{plan.description}</p>
          </div>
          <div className="pricing-price">
            <span className="pricing-currency">$</span>
            <span className="pricing-amount">{plan.price[billingCycle]}</span>
            <span className="pricing-period">/month</span>
          </div>
          {billingCycle === 'yearly' && (
            <p className="pricing-savings">
              Save ${(plan.price.monthly - plan.price.yearly) * 12}/year
            </p>
          )}
          <Button
            variant={plan.popular ? 'primary' : 'secondary'}
            fullWidth
            onClick={() => onSelectPlan?.(plan.id)}
            disabled={currentPlan === plan.id}
          >
            {currentPlan === plan.id ? 'Current Plan' : 'Get Started'}
          </Button>
          <ul className="pricing-features">
            {plan.features.map((feature, index) => (
              <li key={index} className="pricing-feature">
                <Check size={16} className="pricing-feature-icon" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
