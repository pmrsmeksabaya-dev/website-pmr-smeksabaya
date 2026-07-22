import { createClient } from '@supabase/supabase-js';

// ========== ENV VARIABLES ==========
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isDev = import.meta.env.DEV;

// ========== VALIDASI ==========
if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL is missing. Please check your .env file.');
  throw new Error('VITE_SUPABASE_URL is required');
}

if (!supabaseAnonKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY is missing. Please check your .env file.');
  throw new Error('VITE_SUPABASE_ANON_KEY is required');
}

// ========== CUSTOM FETCH WITH RETRY ==========
const customFetch = async (url, options = {}, retries = 3) => {
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      
      // Handle rate limiting (429) with exponential backoff
      if (response.status === 429) {
        const delay = Math.pow(2, i) * 1000;
        console.warn(`⚠️ Rate limited. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      lastError = error;
      console.warn(`🔄 Retry ${i + 1}/${retries} failed:`, error.message);
      
      // Wait before retrying (exponential backoff)
      if (i < retries - 1) {
        const delay = Math.pow(2, i) * 500;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new Error(`Failed after ${retries} retries: ${lastError?.message || 'Unknown error'}`);
};

// ========== CUSTOM HEADERS ==========
const getCustomHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    'apikey': supabaseAnonKey,
  };
  
  // Add authorization if token exists (for RLS)
  const token = localStorage.getItem('supabase.auth.token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// ========== CREATE SUPABASE CLIENT ==========
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  global: {
    headers: getCustomHeaders(),
    fetch: customFetch,
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// ========== TEST CONNECTION ==========
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('pengurus').select('count', { count: 'exact', head: true });
    if (error) throw error;
    console.log('✅ Supabase connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    return false;
  }
};

// ========== GET STORAGE URL ==========
export const getStorageUrl = (bucket, path) => {
  if (!bucket || !path) return null;
  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
  return publicUrl;
};

// ========== UPLOAD TO STORAGE ==========
export const uploadToStorage = async (bucket, file, path = '') => {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path ? `${path}/${fileName}` : fileName;
    
    const { error } = await supabase.storage.from(bucket).upload(filePath, file);
    if (error) throw error;
    
    return getStorageUrl(bucket, filePath);
  } catch (error) {
    console.error('❌ Upload error:', error.message);
    throw error;
  }
};

// ========== DELETE FROM STORAGE ==========
export const deleteFromStorage = async (bucket, path) => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('❌ Delete error:', error.message);
    throw error;
  }
};

// ========== LIST STORAGE FILES ==========
export const listStorageFiles = async (bucket, path = '') => {
  try {
    const { data, error } = await supabase.storage.from(bucket).list(path);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('❌ List files error:', error.message);
    throw error;
  }
};

// ========== DEBUG MODE (DEV ONLY) ==========
if (isDev) {
  console.log('🚀 Supabase client initialized');
  console.log(`📡 URL: ${supabaseUrl}`);
  console.log(`🔑 Key: ${supabaseAnonKey.slice(0, 20)}...`);
}

// ========== EXPORT ==========
export default supabase;