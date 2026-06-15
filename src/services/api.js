import { supabase } from '../supabase/client';

// PENGURUS
export const pengurusAPI = {
  getAll: async () => {
    const { data, error } = await supabase.from('pengurus').select('*').order('urutan');
    if (error) throw error;
    return data;
  },
  getById: async (id) => {
    const { data, error } = await supabase.from('pengurus').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  create: async (pengurus) => {
    const { data, error } = await supabase.from('pengurus').insert(pengurus).select();
    if (error) throw error;
    return data[0];
  },
  update: async (id, updates) => {
    const { data, error } = await supabase.from('pengurus').update(updates).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },
  delete: async (id) => {
    const { error } = await supabase.from('pengurus').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
};

// PROGRAM KERJA
export const programAPI = {
  getAll: async () => {
    const { data, error } = await supabase.from('program_kerja').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  create: async (program) => {
    const { data, error } = await supabase.from('program_kerja').insert(program).select();
    if (error) throw error;
    return data[0];
  },
  update: async (id, updates) => {
    const { data, error } = await supabase.from('program_kerja').update(updates).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },
  delete: async (id) => {
    const { error } = await supabase.from('program_kerja').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
};

// BERITA
export const beritaAPI = {
  getAll: async () => {
    const { data, error } = await supabase.from('berita').select('*').order('published_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  getBySlug: async (slug) => {
    const { data, error } = await supabase.from('berita').select('*').eq('slug', slug).single();
    if (error) throw error;
    return data;
  },
  create: async (berita) => {
    const { data, error } = await supabase.from('berita').insert(berita).select();
    if (error) throw error;
    return data[0];
  },
  update: async (id, updates) => {
    const { data, error } = await supabase.from('berita').update(updates).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },
  delete: async (id) => {
    const { error } = await supabase.from('berita').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
};

// GALERI
export const galeriAPI = {
  getAll: async () => {
    const { data, error } = await supabase.from('galeri').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  upload: async (file, folder = 'galeri') => {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from('galeri').upload(`${folder}/${fileName}`, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from('galeri').getPublicUrl(`${folder}/${fileName}`);
    return publicUrl;
  },
  create: async (galeriData) => {
    const { data, error } = await supabase.from('galeri').insert(galeriData).select();
    if (error) throw error;
    return data[0];
  },
  delete: async (id, url) => {
    // Hapus dari database
    const { error: dbError } = await supabase.from('galeri').delete().eq('id', id);
    if (dbError) throw dbError;
    
    // Hapus dari storage
    const path = url.split('/').slice(-2).join('/');
    await supabase.storage.from('galeri').remove([path]);
    
    return true;
  },
};

// PENGATURAN
export const settingsAPI = {
  getAll: async () => {
    const { data, error } = await supabase.from('pengaturan_website').select('*');
    if (error) throw error;
    const settings = {};
    data.forEach(item => { settings[item.key] = item.value; });
    return settings;
  },
  update: async (key, value) => {
    const { error } = await supabase.from('pengaturan_website').update({ value, updated_at: new Date() }).eq('key', key);
    if (error) throw error;
    return true;
  },
};

// UPLOAD FOTO (umum)
export const uploadAPI = {
  uploadFoto: async (file, folder = 'foto') => {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from('foto').upload(`${folder}/${fileName}`, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from('foto').getPublicUrl(`${folder}/${fileName}`);
    return publicUrl;
  },
};