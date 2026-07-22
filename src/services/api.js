import { supabase } from '../supabase/client';

// ========== HELPER: ERROR HANDLING ==========
const handleError = (error, operation) => {
  console.error(`❌ ${operation} error:`, error);
  throw new Error(`${operation} failed: ${error.message}`);
};

// ========== HELPER: GET PUBLIC URL ==========
const getPublicUrl = (bucket, path) => {
  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
  return publicUrl;
};

// ========== HELPER: UPLOAD FILE ==========
const uploadFile = async (bucket, file, folder = '') => {
  const fileName = `${Date.now()}_${file.name}`;
  const filePath = folder ? `${folder}/${fileName}` : fileName;
  
  const { error } = await supabase.storage.from(bucket).upload(filePath, file);
  if (error) throw error;
  
  return getPublicUrl(bucket, filePath);
};

// ========== ========================================== ==========
// ========== PENGURUS API ==========
// ========== ========================================== ==========
export const pengurusAPI = {
  getAll: async (options = {}) => {
    try {
      let query = supabase.from('pengurus').select('*');
      
      // Filter by tipe
      if (options.tipe) {
        query = query.eq('tipe_pengurus', options.tipe);
      }
      
      // Search
      if (options.search) {
        query = query.ilike('nama', `%${options.search}%`);
      }
      
      // Order
      query = query.order(options.orderBy || 'urutan', { ascending: true });
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      return handleError(error, 'Get all pengurus');
    }
  },
  
  getAllWithPagination: async (page = 1, limit = 10, options = {}) => {
    try {
      const start = (page - 1) * limit;
      const end = start + limit - 1;
      
      let query = supabase.from('pengurus').select('*', { count: 'exact' });
      
      if (options.tipe) {
        query = query.eq('tipe_pengurus', options.tipe);
      }
      if (options.search) {
        query = query.ilike('nama', `%${options.search}%`);
      }
      
      const { data, error, count } = await query
        .order(options.orderBy || 'urutan', { ascending: true })
        .range(start, end);
      
      if (error) throw error;
      return { data, count, page, limit, totalPages: Math.ceil(count / limit) };
    } catch (error) {
      return handleError(error, 'Get pengurus with pagination');
    }
  },
  
  getById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('pengurus')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      return handleError(error, `Get pengurus by id ${id}`);
    }
  },
  
  create: async (pengurus) => {
    try {
      const { data, error } = await supabase
        .from('pengurus')
        .insert(pengurus)
        .select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      return handleError(error, 'Create pengurus');
    }
  },
  
  update: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('pengurus')
        .update(updates)
        .eq('id', id)
        .select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      return handleError(error, `Update pengurus ${id}`);
    }
  },
  
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('pengurus')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      return handleError(error, `Delete pengurus ${id}`);
    }
  },
  
  // Realtime subscription
  subscribe: (callback) => {
    return supabase
      .channel('pengurus-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'pengurus' },
        (payload) => callback(payload)
      )
      .subscribe();
  },
};

// ========== ========================================== ==========
// ========== PROGRAM KERJA API ==========
// ========== ========================================== ==========
export const programAPI = {
  getAll: async (options = {}) => {
    try {
      let query = supabase.from('program_kerja').select('*');
      
      // Filter by status
      if (options.status) {
        query = query.eq('status', options.status);
      }
      
      // Filter by divisi
      if (options.divisi) {
        query = query.eq('divisi', options.divisi);
      }
      
      // Search
      if (options.search) {
        query = query.ilike('judul', `%${options.search}%`);
      }
      
      query = query.order(options.orderBy || 'created_at', { ascending: false });
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      return handleError(error, 'Get all programs');
    }
  },
  
  getStats: async () => {
    try {
      const { data, error } = await supabase
        .from('program_kerja')
        .select('status');
      if (error) throw error;
      
      const stats = {
        total: data.length,
        rencana: data.filter(p => p.status === 'Rencana').length,
        berjalan: data.filter(p => p.status === 'Berjalan').length,
        selesai: data.filter(p => p.status === 'Selesai').length,
        rahasia: data.filter(p => p.status === 'Rahasia').length,
      };
      return stats;
    } catch (error) {
      return handleError(error, 'Get program stats');
    }
  },
  
  create: async (program) => {
    try {
      const { data, error } = await supabase
        .from('program_kerja')
        .insert(program)
        .select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      return handleError(error, 'Create program');
    }
  },
  
  update: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('program_kerja')
        .update(updates)
        .eq('id', id)
        .select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      return handleError(error, `Update program ${id}`);
    }
  },
  
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('program_kerja')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      return handleError(error, `Delete program ${id}`);
    }
  },
};

// ========== ========================================== ==========
// ========== KEGIATAN API ==========
// ========== ========================================== ==========
export const kegiatanAPI = {
  getAll: async (options = {}) => {
    try {
      let query = supabase.from('kegiatan').select('*');
      
      if (options.kategori) {
        query = query.eq('kategori', options.kategori);
      }
      if (options.search) {
        query = query.ilike('judul', `%${options.search}%`);
      }
      
      query = query.order(options.orderBy || 'tanggal', { ascending: false });
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      return handleError(error, 'Get all kegiatan');
    }
  },
  
  getLatest: async (limit = 3) => {
    try {
      const { data, error } = await supabase
        .from('kegiatan')
        .select('*')
        .order('tanggal', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data;
    } catch (error) {
      return handleError(error, 'Get latest kegiatan');
    }
  },
  
  create: async (kegiatan) => {
    try {
      const { data, error } = await supabase
        .from('kegiatan')
        .insert(kegiatan)
        .select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      return handleError(error, 'Create kegiatan');
    }
  },
  
  update: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('kegiatan')
        .update(updates)
        .eq('id', id)
        .select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      return handleError(error, `Update kegiatan ${id}`);
    }
  },
  
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('kegiatan')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      return handleError(error, `Delete kegiatan ${id}`);
    }
  },
};

// ========== ========================================== ==========
// ========== GALERI API ==========
// ========== ========================================== ==========
export const galeriAPI = {
  getAll: async (options = {}) => {
    try {
      let query = supabase.from('galeri').select('*');
      
      if (options.album_id) {
        query = query.eq('album_id', options.album_id);
      }
      if (options.tipe) {
        query = query.eq('tipe', options.tipe);
      }
      
      query = query.order(options.orderBy || 'created_at', { ascending: false });
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      return handleError(error, 'Get all galeri');
    }
  },
  
  getByAlbum: async (albumId) => {
    try {
      const { data, error } = await supabase
        .from('galeri')
        .select('*')
        .eq('album_id', albumId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    } catch (error) {
      return handleError(error, `Get galeri by album ${albumId}`);
    }
  },
  
  upload: async (file, folder = 'galeri') => {
    try {
      return await uploadFile('galeri', file, folder);
    } catch (error) {
      return handleError(error, 'Upload file to galeri');
    }
  },
  
  uploadMultiple: async (files, folder = 'galeri') => {
    try {
      const urls = [];
      for (const file of files) {
        const url = await uploadFile('galeri', file, folder);
        urls.push(url);
      }
      return urls;
    } catch (error) {
      return handleError(error, 'Upload multiple files to galeri');
    }
  },
  
  create: async (galeriData) => {
    try {
      const { data, error } = await supabase
        .from('galeri')
        .insert(galeriData)
        .select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      return handleError(error, 'Create galeri item');
    }
  },
  
  delete: async (id, url) => {
    try {
      // Hapus dari database
      const { error: dbError } = await supabase
        .from('galeri')
        .delete()
        .eq('id', id);
      if (dbError) throw dbError;
      
      // Hapus dari storage
      if (url) {
        const path = url.split('/').slice(-2).join('/');
        await supabase.storage.from('galeri').remove([path]);
      }
      
      return true;
    } catch (error) {
      return handleError(error, `Delete galeri item ${id}`);
    }
  },
};

// ========== ========================================== ==========
// ========== ALBUM API ==========
// ========== ========================================== ==========
export const albumAPI = {
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('album')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } catch (error) {
      return handleError(error, 'Get all albums');
    }
  },
  
  create: async (album) => {
    try {
      const { data, error } = await supabase
        .from('album')
        .insert(album)
        .select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      return handleError(error, 'Create album');
    }
  },
  
  update: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('album')
        .update(updates)
        .eq('id', id)
        .select();
      if (error) throw error;
      return data[0];
    } catch (error) {
      return handleError(error, `Update album ${id}`);
    }
  },
  
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('album')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      return handleError(error, `Delete album ${id}`);
    }
  },
};

// ========== ========================================== ==========
// ========== SETTINGS API ==========
// ========== ========================================== ==========
export const settingsAPI = {
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('pengaturan_website')
        .select('*');
      if (error) throw error;
      
      const settings = {};
      data.forEach(item => { settings[item.key] = item.value; });
      return settings;
    } catch (error) {
      return handleError(error, 'Get all settings');
    }
  },
  
  get: async (key) => {
    try {
      const { data, error } = await supabase
        .from('pengaturan_website')
        .select('value')
        .eq('key', key)
        .single();
      if (error) throw error;
      return data?.value || null;
    } catch (error) {
      return handleError(error, `Get setting ${key}`);
    }
  },
  
  update: async (key, value) => {
    try {
      const { error } = await supabase
        .from('pengaturan_website')
        .update({ value, updated_at: new Date() })
        .eq('key', key);
      if (error) throw error;
      return true;
    } catch (error) {
      return handleError(error, `Update setting ${key}`);
    }
  },
  
  upsert: async (settings) => {
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date(),
      }));
      
      for (const item of updates) {
        const { error } = await supabase
          .from('pengaturan_website')
          .upsert(item, { onConflict: 'key' });
        if (error) throw error;
      }
      return true;
    } catch (error) {
      return handleError(error, 'Upsert settings');
    }
  },
};

// ========== ========================================== ==========
// ========== UPLOAD API ==========
// ========== ========================================== ==========
export const uploadAPI = {
  uploadFoto: async (file, folder = 'foto') => {
    try {
      return await uploadFile('foto', file, folder);
    } catch (error) {
      return handleError(error, 'Upload foto');
    }
  },
  
  uploadMultiple: async (files, folder = 'foto') => {
    try {
      const urls = [];
      for (const file of files) {
        const url = await uploadFile('foto', file, folder);
        urls.push(url);
      }
      return urls;
    } catch (error) {
      return handleError(error, 'Upload multiple foto');
    }
  },
  
  delete: async (bucket, path) => {
    try {
      const { error } = await supabase.storage.from(bucket).remove([path]);
      if (error) throw error;
      return true;
    } catch (error) {
      return handleError(error, `Delete file from ${bucket}`);
    }
  },
};

// ========== ========================================== ==========
// ========== STATS API ==========
// ========== ========================================== ==========
export const statsAPI = {
  getAll: async () => {
    try {
      const [pengurus, program, kegiatan, galeri] = await Promise.all([
        supabase.from('pengurus').select('*', { count: 'exact', head: true }),
        supabase.from('program_kerja').select('*', { count: 'exact', head: true }),
        supabase.from('kegiatan').select('*', { count: 'exact', head: true }),
        supabase.from('galeri').select('*', { count: 'exact', head: true }),
      ]);
      
      return {
        pengurus: pengurus.count || 0,
        program: program.count || 0,
        kegiatan: kegiatan.count || 0,
        galeri: galeri.count || 0,
      };
    } catch (error) {
      return handleError(error, 'Get all stats');
    }
  },
};