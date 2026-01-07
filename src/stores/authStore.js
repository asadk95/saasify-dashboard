import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  supabase,
  isSupabaseConfigured,
  signIn as supabaseSignIn,
  signUp as supabaseSignUp,
  signOut as supabaseSignOut,
  getProfile,
  updateProfile as supabaseUpdateProfile
} from '../lib/supabase';

// Mock user data for when Supabase is not configured
const mockUser = {
  id: 'mock-user-id',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: null,
  role: 'admin',
  plan: 'professional',
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      initialized: false,

      // Initialize auth state
      initialize: async () => {
        if (get().initialized) return;

        set({ isLoading: true });

        if (isSupabaseConfigured) {
          // Check Supabase session
          const { data: { session } } = await supabase.auth.getSession();

          if (session?.user) {
            const { data: profile } = await getProfile(session.user.id);
            set({
              user: {
                id: session.user.id,
                email: session.user.email,
                name: profile?.name || session.user.user_metadata?.name || 'User',
                avatar: profile?.avatar_url,
                avatar_url: profile?.avatar_url,
                role: profile?.role || 'member',
                plan: profile?.plan || 'starter',
                job_title: profile?.job_title || '',
                company: profile?.company || '',
                bio: profile?.bio || '',
              },
              isAuthenticated: true,
              isLoading: false,
              initialized: true,
            });
          } else {
            set({ isLoading: false, initialized: true });
          }

          supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
              const { data: profile } = await getProfile(session.user.id);
              set({
                user: {
                  id: session.user.id,
                  email: session.user.email,
                  name: profile?.name || session.user.user_metadata?.name || 'User',
                  avatar: profile?.avatar_url,
                  avatar_url: profile?.avatar_url,
                  role: profile?.role || 'member',
                  plan: profile?.plan || 'starter',
                  job_title: profile?.job_title || '',
                  company: profile?.company || '',
                  bio: profile?.bio || '',
                },
                isAuthenticated: true,
              });
            } else if (event === 'SIGNED_OUT') {
              set({ user: null, isAuthenticated: false });
            }
          });
        } else {
          // Mock mode - check persisted state
          set({ isLoading: false, initialized: true });
        }
      },

      // Login
      login: async (email, password) => {
        set({ isLoading: true, error: null });

        if (isSupabaseConfigured) {
          const { data, error } = await supabaseSignIn(email, password);

          if (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
          }

          // Profile will be set by auth state listener
          set({ isLoading: false });
          return { success: true };
        } else {
          // Mock login
          await new Promise(resolve => setTimeout(resolve, 1000));

          if (email && password) {
            set({
              user: { ...mockUser, email },
              isAuthenticated: true,
              isLoading: false,
            });
            return { success: true };
          } else {
            set({ error: 'Invalid credentials', isLoading: false });
            return { success: false, error: 'Invalid credentials' };
          }
        }
      },

      // Register
      register: async (name, email, password) => {
        set({ isLoading: true, error: null });

        if (isSupabaseConfigured) {
          const { data, error } = await supabaseSignUp(email, password, { name });

          if (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
          }

          set({ isLoading: false });
          return { success: true, message: 'Check your email to confirm your account' };
        } else {
          // Mock register
          await new Promise(resolve => setTimeout(resolve, 1500));

          if (email && password && name) {
            set({
              user: { ...mockUser, name, email },
              isAuthenticated: true,
              isLoading: false,
            });
            return { success: true };
          } else {
            set({ error: 'Registration failed', isLoading: false });
            return { success: false, error: 'Registration failed' };
          }
        }
      },

      // Logout
      logout: async () => {
        if (isSupabaseConfigured) {
          await supabaseSignOut();
        }
        set({ user: null, isAuthenticated: false, error: null });
      },

      // Update profile
      updateProfile: async (data) => {
        set({ isLoading: true });

        if (isSupabaseConfigured) {
          const user = get().user;
          if (!user?.id) {
            set({ isLoading: false });
            return { success: false, error: 'Not authenticated' };
          }

          const { data: profile, error } = await supabaseUpdateProfile(user.id, data);

          if (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
          }

          set({
            user: { ...user, ...profile },
            isLoading: false,
          });
          return { success: true };
        } else {
          // Mock update
          await new Promise(resolve => setTimeout(resolve, 500));

          const currentUser = get().user;
          set({
            user: { ...currentUser, ...data },
            isLoading: false,
          });
          return { success: true };
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
