import { useState, useEffect, useCallback } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // ========== CEK SSR ==========
  const isBrowser = typeof window !== 'undefined';

  // ========== GET STORED VALUE ==========
  const getStoredValue = useCallback(() => {
    if (!isBrowser) return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      
      // Kalo initialValue adalah function, panggil
      if (typeof initialValue === 'function') {
        return initialValue();
      }
      return initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [isBrowser, key, initialValue]);

  // ========== STATE ==========
  const [storedValue, setStoredValue] = useState(getStoredValue);

  // ========== SET VALUE ==========
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      if (isBrowser) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [isBrowser, key, storedValue]);

  // ========== REMOVE VALUE ==========
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (isBrowser) {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [isBrowser, key, initialValue]);

  // ========== SYNC ACROSS TABS ==========
  useEffect(() => {
    if (!isBrowser) return;

    const handleStorageChange = (event) => {
      if (event.key === key && event.storageArea === window.localStorage) {
        try {
          const newValue = event.newValue ? JSON.parse(event.newValue) : initialValue;
          setStoredValue(newValue);
        } catch (error) {
          console.warn(`Error syncing localStorage key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isBrowser, key, initialValue]);

  // ========== SYNC WHEN KEY CHANGES ==========
  useEffect(() => {
    if (!isBrowser) return;
    
    const newValue = getStoredValue();
    setStoredValue(newValue);
  }, [isBrowser, key, getStoredValue]);

  return [storedValue, setValue, removeValue];
};

// ========== HOOKS WITH DEBOUNCE (OPTIONAL) ==========
export const useDebouncedLocalStorage = (key, initialValue, delay = 500) => {
  const [value, setValue] = useLocalStorage(key, initialValue);
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return [debouncedValue, setValue];
};