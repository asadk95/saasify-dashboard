import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
// To use a real Supabase project, create a .env file with:
// VITE_SUPABASE_URL=your-project-url
// VITE_SUPABASE_ANON_KEY=your-anon-key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Check if we have real credentials
export const isSupabaseConfigured =
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key';

// Debug log for production troubleshooting
console.log('[Supabase] Config status:', {
  isConfigured: isSupabaseConfigured,
  urlSet: !!import.meta.env.VITE_SUPABASE_URL,
  keySet: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Auth helpers
export const signUp = async (email, password, metadata = {}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
};

// Update password
export const updatePassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });
  return { data, error };
};

// Reset password (send reset email)
export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { data, error };
};

// Database helpers
export const fetchProjects = async (userId) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createProject = async (project) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single();
  return { data, error };
};

export const updateProject = async (id, updates) => {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const deleteProject = async (id) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  return { error };
};

export const fetchTasks = async (projectId) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*, assignees:task_assignees(user_id, profiles(name, avatar_url))')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createTask = async (task) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select()
    .single();
  return { data, error };
};

export const updateTask = async (id, updates) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const deleteTask = async (id) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
  return { error };
};

// Profile helpers
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

// Avatar upload helper
export const uploadAvatar = async (userId, file) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  // Upload file to storage
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    return { data: null, error: uploadError };
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  const avatarUrl = urlData.publicUrl;

  // Update profile with new avatar URL
  const { data, error } = await updateProfile(userId, { avatar_url: avatarUrl });

  return { data: { ...data, avatar_url: avatarUrl }, error };
};

export default supabase;
