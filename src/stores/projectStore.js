import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  isSupabaseConfigured,
  fetchProjects as supabaseFetchProjects,
  createProject as supabaseCreateProject,
  updateProject as supabaseUpdateProject,
  deleteProject as supabaseDeleteProject,
} from '../lib/supabase';
import { useAuthStore } from './authStore';

// Mock initial projects
const mockProjects = [
  {
    id: '1',
    name: 'Marketing Campaign',
    color: '#6366f1',
    description: 'Q1 marketing initiatives',
    created_at: '2024-01-15',
  },
  {
    id: '2',
    name: 'Website Redesign',
    color: '#8b5cf6',
    description: 'Complete website overhaul',
    created_at: '2024-02-01',
  },
  {
    id: '3',
    name: 'Mobile App v2',
    color: '#06b6d4',
    description: 'Mobile app second version',
    created_at: '2024-03-10',
  },
];

export const useProjectStore = create(
  persist(
    (set, get) => ({
      // State
      projects: mockProjects,
      currentProject: mockProjects[0],
      isLoading: false,
      error: null,

      // Fetch projects
      fetchProjects: async () => {
        set({ isLoading: true, error: null });

        if (isSupabaseConfigured) {
          const user = useAuthStore.getState().user;
          if (!user?.id) {
            set({ isLoading: false });
            return { success: false, error: 'Not authenticated' };
          }

          const { data, error } = await supabaseFetchProjects(user.id);

          if (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
          }

          set({
            projects: data || [],
            currentProject: data?.[0] || null,
            isLoading: false,
          });
          return { success: true, projects: data };
        } else {
          // Mock - use stored projects
          set({ isLoading: false });
          return { success: true, projects: get().projects };
        }
      },

      // Set current project
      setCurrentProject: (project) => {
        set({ currentProject: project });
      },

      // Add project
      addProject: async (projectData) => {
        set({ isLoading: true, error: null });

        if (isSupabaseConfigured) {
          const user = useAuthStore.getState().user;
          if (!user?.id) {
            set({ isLoading: false });
            return { success: false, error: 'Not authenticated' };
          }

          const { data, error } = await supabaseCreateProject({
            ...projectData,
            user_id: user.id,
          });

          if (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
          }

          set(state => ({
            projects: [data, ...state.projects],
            currentProject: data,
            isLoading: false,
          }));
          return { success: true, project: data };
        } else {
          // Mock add
          await new Promise(resolve => setTimeout(resolve, 500));

          const newProject = {
            id: Date.now().toString(),
            ...projectData,
            created_at: new Date().toISOString().split('T')[0],
          };

          set(state => ({
            projects: [newProject, ...state.projects],
            currentProject: newProject,
            isLoading: false,
          }));
          return { success: true, project: newProject };
        }
      },

      // Update project
      updateProject: async (id, data) => {
        set({ isLoading: true, error: null });

        if (isSupabaseConfigured) {
          const { data: updated, error } = await supabaseUpdateProject(id, data);

          if (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
          }

          set(state => ({
            projects: state.projects.map(p => p.id === id ? updated : p),
            currentProject: state.currentProject?.id === id ? updated : state.currentProject,
            isLoading: false,
          }));
          return { success: true };
        } else {
          // Mock update
          await new Promise(resolve => setTimeout(resolve, 300));

          set(state => ({
            projects: state.projects.map(p => p.id === id ? { ...p, ...data } : p),
            isLoading: false,
          }));
          return { success: true };
        }
      },

      // Delete project
      deleteProject: async (id) => {
        set({ isLoading: true, error: null });

        if (isSupabaseConfigured) {
          const { error } = await supabaseDeleteProject(id);

          if (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
          }
        }

        // Update state (same for mock and real)
        const projects = get().projects.filter(p => p.id !== id);
        const currentProject = get().currentProject;

        set({
          projects,
          currentProject: currentProject?.id === id ? projects[0] || null : currentProject,
          isLoading: false,
        });
        return { success: true };
      },
    }),
    {
      name: 'project-storage',
      partialize: (state) => ({
        projects: state.projects,
        currentProject: state.currentProject,
      }),
    }
  )
);
