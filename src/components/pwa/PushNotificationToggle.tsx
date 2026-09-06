import React, { useState, useEffect } from 'react';
import { Bell, BellOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';

export const PushNotificationToggle: React.FC = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setPermission('denied');
      setLoading(false);
      return;
    }

    setPermission(Notification.permission);
    
    // Check for existing subscription
    navigator.serviceWorker.ready.then((registration) => {
      registration.pushManager.getSubscription().then((subscription) => {
        setIsSubscribed(!!subscription);
        setLoading(false);
      });
    });
  }, []);

  const subscribeUser = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result !== 'granted') {
        throw new Error('Permissão negada para notificações.');
      }

      const registration = await navigator.serviceWorker.ready;
      
      // In a real app, you would fetch the public VAPID key from your server
      // For this demo, we'll simulate the subscription logic
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        // applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
      
      console.log('[PWA] Push Subscription:', subscription);
      setIsSubscribed(true);
      
      // Send subscription to server
      // await api.post('/api/push/subscribe', subscription);

    } catch (err: any) {
      console.error('[PWA] Subscription error:', err);
      setError(err.message || 'Erro ao ativar notificações.');
    } finally {
      setLoading(false);
    }
  };

  const unsubscribeUser = async () => {
    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        // Notify server
        // await api.post('/api/push/unsubscribe', { endpoint: subscription.endpoint });
      }
      
      setIsSubscribed(false);
    } catch (err) {
      console.error('[PWA] Unsubscription error:', err);
      setError('Erro ao desativar notificações.');
    } finally {
      setLoading(false);
    }
  };

  if (permission === 'denied' && !error) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 text-xs">
        <BellOff className="w-4 h-4" />
        <span>Notificações bloqueadas no navegador</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={isSubscribed ? unsubscribeUser : subscribeUser}
        disabled={loading}
        className={clsx(
          "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group border",
          isSubscribed 
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
            : "bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"
        )}
      >
        <div className="flex items-center gap-2">
          {isSubscribed ? (
            <Bell className="w-4 h-4 animate-bounce" />
          ) : (
            <Bell className="w-4 h-4" />
          )}
          <span className="text-xs font-semibold">
            {isSubscribed ? 'Notificações Ativas' : 'Ativar Notificações'}
          </span>
        </div>
        
        {loading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : isSubscribed ? (
          <CheckCircle2 className="w-4 h-4" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-emerald-500 transition-colors" />
        )}
      </button>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex items-center gap-2 px-3 py-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-[10px]"
          >
            <AlertCircle className="w-3 h-3 shrink-0" />
            <p className="leading-tight">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
