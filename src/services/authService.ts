import { supabase } from './supabase';

export const authService = {
  async signIn(email: string) {
    // Para simplificar no preview, usamos o fluxo de Magic Link ou OTP se configurado,
    // mas aqui implementaremos o padrão de senha se houver.
    // Como é um SaaS, o nutricionista geralmente faz login com email/senha.
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
};
