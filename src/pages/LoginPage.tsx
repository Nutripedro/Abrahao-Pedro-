import React, { useState } from 'react';
import { isSupabaseConfigured } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Mail, Lock, Loader2, Apple, Sparkles, AlertCircle, UserPlus, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { signInWithPassword, signUp: signUpAuth, schemaError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const getFriendlyErrorMessage = (error: any) => {
    const message = error.message || '';
    if (message.includes('Invalid login credentials')) {
      return 'Email ou senha incorretos. Por favor, verifique seus dados.';
    }
    if (message.includes('User already registered')) {
      return 'Este email já está cadastrado. Tente fazer login.';
    }
    if (message.includes('Password should be at least 6 characters')) {
      return 'A senha deve ter pelo menos 6 caracteres.';
    }
    if (message.includes('Email not confirmed')) {
      return 'Seu email ainda não foi confirmado. Verifique sua caixa de entrada.';
    }
    return message || 'Ocorreu um erro inesperado. Tente novamente em instantes.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isLogin) {
        await signInWithPassword(email, password);
      } else {
        if (!name.trim()) {
          throw new Error('Por favor, informe seu nome.');
        }
        await signUpAuth(email, password, name);
        setMessage({ type: 'success', text: 'Cadastro realizado com sucesso! Verifique seu email para confirmar o acesso.' });
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setMessage({ type: 'error', text: getFriendlyErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-600 text-white shadow-lg mb-4">
            <Apple className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            NutriSaaS
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {isLogin ? 'Bem-vindo de volta ao seu consultório' : 'Comece sua jornada digital hoje'}
          </p>
        </div>

        {!isSupabaseConfigured && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-amber-800">Ação Necessária</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                As chaves do Supabase não foram configuradas. Acesse o menu de configurações do AI Studio e adicione <strong>VITE_SUPABASE_URL</strong> e <strong>VITE_SUPABASE_PUBLISHABLE_KEY</strong>.
              </p>
            </div>
          </div>
        )}

        {schemaError && isSupabaseConfigured && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-rose-800">Banco de Dados não Inicializado</p>
              <p className="text-xs text-rose-700 leading-relaxed">
                As tabelas clínicas não foram encontradas no seu projeto Supabase. 
                Abra o <strong>SQL Editor</strong> no Supabase e execute o conteúdo do arquivo <code>supabase_schema.sql</code> que criei na raiz do projeto.
              </p>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                  placeholder="Seu nome completo"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                placeholder="Seu email profissional"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                placeholder="Sua senha"
              />
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-2xl text-sm font-bold ${
              message.type === 'success' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {message.text}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isLogin ? (
                <>
                  <LogIn className="w-5 h-5" />
                  Entrar no Consultório
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Criar Conta de Nutricionista
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage(null);
              }}
              className="text-sm font-medium text-sky-600 hover:text-sky-500 transition-colors"
            >
              {isLogin ? 'Ainda não tem conta? Cadastre-se' : 'Já possui conta? Faça login'}
            </button>
          </div>
        </form>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-sky-400" />
            Conectado ao Backend Supabase Real
          </p>
        </div>
      </div>
    </div>
  );
};
