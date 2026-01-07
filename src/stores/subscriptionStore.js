import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const plans = {
  starter: { name: 'Starter', price: 9, features: ['5 Projects', '10GB Storage', 'Basic Support'] },
  professional: { name: 'Professional', price: 29, features: ['Unlimited Projects', '100GB Storage', 'Priority Support'] },
  enterprise: { name: 'Enterprise', price: 99, features: ['Unlimited Everything', 'Dedicated Support', 'Custom Integrations'] },
};

export const useSubscriptionStore = create(
  persist(
    (set, get) => ({
      // State
      currentPlan: 'professional',
      billingCycle: 'monthly',
      isLoading: false,
      paymentMethod: {
        type: 'card',
        last4: '4242',
        brand: 'Visa',
        expiryMonth: 12,
        expiryYear: 2027,
      },

      // Actions
      getPlanDetails: () => {
        return plans[get().currentPlan];
      },

      upgradePlan: async (planId) => {
        set({ isLoading: true });

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        set({ currentPlan: planId, isLoading: false });
        return { success: true, message: `Upgraded to ${plans[planId].name}` };
      },

      cancelSubscription: async () => {
        set({ isLoading: true });

        await new Promise(resolve => setTimeout(resolve, 1000));

        set({ currentPlan: 'starter', isLoading: false });
        return { success: true, message: 'Subscription cancelled. Downgraded to Starter plan.' };
      },

      toggleBillingCycle: () => {
        set(state => ({
          billingCycle: state.billingCycle === 'monthly' ? 'yearly' : 'monthly'
        }));
      },

      updatePaymentMethod: async (paymentData) => {
        set({ isLoading: true });

        await new Promise(resolve => setTimeout(resolve, 500));

        set({ paymentMethod: paymentData, isLoading: false });
        return { success: true };
      },
    }),
    {
      name: 'subscription-storage',
      partialize: (state) => ({
        currentPlan: state.currentPlan,
        billingCycle: state.billingCycle,
      }),
    }
  )
);
