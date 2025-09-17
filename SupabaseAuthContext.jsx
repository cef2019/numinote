import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authActionLoading, setAuthActionLoading] = useState(false);

  const handleSession = useCallback(async (currentSession) => {
    setSession(currentSession);
    setUser(currentSession?.user ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      handleSession(currentSession);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        handleSession(currentSession);
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession]);

  const signUp = useCallback(async (email, password, options) => {
    setAuthActionLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign up Failed",
        description: error.message || "Something went wrong",
      });
      return { data: null, error };
    } finally {
      setAuthActionLoading(false);
    }
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    setAuthActionLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign in Failed",
        description: error.message || "Something went wrong. Please check your credentials and try again.",
      });
      return { data: null, error };
    } finally {
      setAuthActionLoading(false);
    }
  }, [toast]);

  const signOut = useCallback(async () => {
    setAuthActionLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign out Failed",
        description: error.message || "Something went wrong",
      });
    } finally {
      setAuthActionLoading(false);
    }
  }, [toast]);

  const value = useMemo(() => ({
    user,
    session,
    loading,
    authActionLoading,
    signUp,
    signIn,
    signOut,
  }), [user, session, loading, authActionLoading, signUp, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};