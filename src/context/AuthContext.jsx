import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // ========== FETCH USER ROLE ==========
  const fetchUserRole = async (userId) => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (!error && data) {
        setUserRole(data.role);
      } else {
        setUserRole('user');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('user');
    }
  };

  // ========== GET SESSION ==========
  const getSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (session?.user) {
        setUser(session.user);
        await fetchUserRole(session.user.id);
      } else {
        setUser(null);
        setUserRole(null);
      }
    } catch (error) {
      console.error('Error getting session:', error);
      setUser(null);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  // ========== AUTH STATE CHANGE ==========
  useEffect(() => {
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchUserRole(session.user.id);
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // ========== GET APP URL ==========
  const getAppUrl = () => {
    // Cek environment
    const isProduction = import.meta.env.PROD;
    
    // Kalo production, pake URL dari env atau domain Vercel
    if (isProduction) {
      return import.meta.env.VITE_APP_URL || 'https://pmr-smeksabaya.vercel.app';
    }
    
    // Kalo development, pake localhost
    return 'http://localhost:5173';
  };

  // ========== LOGIN ==========
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      if (data.user) {
        await fetchUserRole(data.user.id);
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // ========== LOGOUT ==========
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserRole(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // ========== MAGIC LINK (LOGIN TANPA PASSWORD) ==========
  const sendMagicLink = async (email) => {
    try {
      const appUrl = getAppUrl();
      const redirectUrl = `${appUrl}/admin`;
      
      console.log('📧 Sending magic link to:', email);
      console.log('🔗 Redirect URL:', redirectUrl);
      
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Magic link error:', error);
      throw error;
    }
  };

  // ========== FORGOT PASSWORD ==========
  const forgotPassword = async (email) => {
    try {
      const appUrl = getAppUrl();
      const redirectUrl = `${appUrl}/admin/reset-password`;
      
      console.log('📧 Sending reset password to:', email);
      console.log('🔗 Redirect URL:', redirectUrl);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  };

  // ========== RESET PASSWORD ==========
  const resetPassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  // ========== UPDATE PROFILE ==========
  const updateProfile = async (data) => {
    try {
      const { error } = await supabase.auth.updateUser(data);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user,
      userRole,
      loading,
      login,
      logout,
      sendMagicLink,
      forgotPassword,
      resetPassword,
      updateProfile,
      refreshUser: getSession,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};