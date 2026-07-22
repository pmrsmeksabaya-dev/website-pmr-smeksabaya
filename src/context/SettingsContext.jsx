// src/context/SettingsContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase/client';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('pengaturan_website')
        .select('*');

      if (error) throw error;

      const settingsObj = {};
      data.forEach(item => {
        settingsObj[item.key] = item.value;
      });

      setSettings(settingsObj);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);