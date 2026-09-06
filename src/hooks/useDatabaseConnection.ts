import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface ConnectionState {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to verify Supabase connectivity and authentication status.
 * Focuses on clinical-grade reliability during application boot.
 */
export const useDatabaseConnection = (): ConnectionState => {
  const [state, setState] = useState<ConnectionState>({
    isConnected: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const checkConnection = async () => {
      // 1. Initial Configuration Guard
      if (!isSupabaseConfigured) {
        setState({
          isConnected: false,
          isLoading: false,
          error: 'Configuração do banco de dados não detectada. Verifique as credenciais do ambiente.',
        });
        return;
      }

      try {
        // 2. Connectivity/Auth Check
        // getSession is light and verifies if the token is valid or expired,
        // effectively checking network and auth configuration.
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw new Error('Falha ao estabelecer conexão segura com o servidor.');
        }

        setState({
          isConnected: true,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        console.error('Database connection error:', err);
        setState({
          isConnected: false,
          isLoading: false,
          error: 'O sistema não conseguiu conectar-se ao servidor de dados no momento.',
        });
      }
    };

    checkConnection();
  }, []);

  return state;
};
