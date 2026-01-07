import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  isSupabaseConfigured,
  fetchTasks as supabaseFetchTasks,
  createTask as supabaseCreateTask,
  updateTask as supabaseUpdateTask,
  deleteTask as supabaseDeleteTask,
} from '../lib/supabase';
import { useAuthStore } from './authStore';

// Mock tasks for development
const mockTasks = [
  {
    id: '1',
    project_id: '1',
    title: 'Design new landing page',
    description: 'Create a modern landing page design with hero section and features.',
    status: 'todo',
    priority: 'high',
    due_date: '2024-01-15',
    tags: ['Design', 'UI'],
  },
  {
    id: '2',
    project_id: '1',
    title: 'Implement user authentication',
    description: 'Set up JWT authentication with refresh tokens.',
    status: 'in_progress',
    priority: 'high',
    due_date: '2024-01-12',
    tags: ['Backend', 'Security'],
  },
  {
    id: '3',
    project_id: '1',
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated deployment.',
    status: 'in_review',
    priority: 'medium',
    due_date: '2024-01-10',
    tags: ['DevOps'],
  },
  {
    id: '4',
    project_id: '1',
    title: 'Write API documentation',
    description: 'Document all REST endpoints with examples.',
    status: 'in_progress',
    priority: 'medium',
    due_date: '2024-01-20',
    tags: ['Documentation'],
  },
  {
    id: '5',
    project_id: '1',
    title: 'Optimize database queries',
    description: 'Improve query performance for analytics.',
    status: 'done',
    priority: 'low',
    due_date: '2024-01-05',
    tags: ['Backend', 'Performance'],
  },
  {
    id: '6',
    project_id: '1',
    title: 'Create email templates',
    description: 'Design responsive email templates for notifications.',
    status: 'todo',
    priority: 'low',
    due_date: '2024-01-30',
    tags: ['Design', 'Email'],
  },
];

export const useTaskStore = create(
  persist(
    (set, get) => ({
      // State
      tasks: [],
      isLoading: false,
      error: null,

      // Fetch tasks for a project
      fetchTasks: async (projectId) => {
        set({ isLoading: true, error: null });

        if (isSupabaseConfigured) {
          const { data, error } = await supabaseFetchTasks(projectId);

          if (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
          }

          set({
            tasks: data || [],
            isLoading: false,
          });
          return { success: true, tasks: data };
        } else {
          // Mock - filter tasks by project
          const projectTasks = mockTasks.filter(t => t.project_id === projectId);
          set({ tasks: projectTasks, isLoading: false });
          return { success: true, tasks: projectTasks };
        }
      },

      // Add task
      addTask: async (taskData) => {
        set({ isLoading: true, error: null });

        if (isSupabaseConfigured) {
          const user = useAuthStore.getState().user;
          if (!user?.id) {
            set({ isLoading: false });
            return { success: false, error: 'Not authenticated' };
          }

          const { data, error } = await supabaseCreateTask({
            ...taskData,
            user_id: user.id,
          });

          if (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
          }

          set(state => ({
            tasks: [data, ...state.tasks],
            isLoading: false,
          }));
          return { success: true, task: data };
        } else {
          // Mock add
          await new Promise(resolve => setTimeout(resolve, 300));

          const newTask = {
            id: Date.now().toString(),
            ...taskData,
            created_at: new Date().toISOString(),
          };

          set(state => ({
            tasks: [newTask, ...state.tasks],
            isLoading: false,
          }));
          return { success: true, task: newTask };
        }
      },

      // Update task
      updateTask: async (id, data) => {
        set({ isLoading: true, error: null });

        if (isSupabaseConfigured) {
          const { data: updated, error } = await supabaseUpdateTask(id, data);

          if (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
          }

          set(state => ({
            tasks: state.tasks.map(t => t.id === id ? updated : t),
            isLoading: false,
          }));
          return { success: true };
        } else {
          // Mock update
          await new Promise(resolve => setTimeout(resolve, 200));

          set(state => ({
            tasks: state.tasks.map(t => t.id === id ? { ...t, ...data } : t),
            isLoading: false,
          }));
          return { success: true };
        }
      },

      // Delete task
      deleteTask: async (id) => {
        set({ isLoading: true, error: null });

        if (isSupabaseConfigured) {
          const { error } = await supabaseDeleteTask(id);

          if (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
          }
        }

        // Update state (same for mock and real)
        set(state => ({
          tasks: state.tasks.filter(t => t.id !== id),
          isLoading: false,
        }));
        return { success: true };
      },

      // Move task (update status)
      moveTask: async (id, newStatus) => {
        return get().updateTask(id, { status: newStatus });
      },

      // Clear tasks
      clearTasks: () => {
        set({ tasks: [], error: null });
      },
    }),
    {
      name: 'task-storage',
      partialize: (state) => ({
        tasks: state.tasks,
      }),
    }
  )
);
