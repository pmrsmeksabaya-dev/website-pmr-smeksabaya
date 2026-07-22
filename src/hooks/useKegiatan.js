import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase/client';

export const useKegiatan = (limit = 3, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('kegiatan')
        .select('*')
        .order('tanggal', { ascending: false });

      if (limit) query = query.limit(limit);
      if (options.kategori) query = query.eq('kategori', options.kategori);
      if (options.search) query = query.ilike('judul', `%${options.search}%`);

      const { data: result, error: err } = await query;

      if (err) throw err;
      setData(result || []);
    } catch (err) {
      console.error('🔥 Error fetching kegiatan:', err);
      setError(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [limit, options.kategori, options.search]);

  // Realtime subscription
  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('kegiatan-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'kegiatan'
        },
        () => {
          console.log('🔄 Kegiatan updated, refetching...');
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData, refetchTrigger]);

  const refetch = useCallback(() => {
    setRefetchTrigger(prev => prev + 1);
  }, []);

  return { data, loading, error, refetch };
};