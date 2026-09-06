import { dbService } from './db';
import { supabase } from './supabase';

/**
 * SyncService: Gerencia a sincronização de dados offline para o Supabase.
 * Persona: Segurança & Compliance
 * Garante que dados sensíveis são transmitidos de forma segura e apenas quando a conexão é confiável.
 */
export const syncService = {
  async syncPendingEvaluations() {
    if (!navigator.onLine) {
      console.warn('Sync ignorado: dispositivo offline.');
      return;
    }

    const pending = await dbService.getAllPendingEvaluations();
    if (pending.length === 0) return;

    console.log(`Iniciando sincronização de ${pending.length} registros...`);

    for (const record of pending) {
      try {
        // Envia para o Supabase
        const { error } = await supabase
          .from('evaluations')
          .insert([
            {
              patient_id: record.patient_id,
              titulo: record.titulo,
              peso: record.peso,
              dobras_json: record.dobras_json,
              results_json: record.results_json,
              created_at: record.created_at,
            },
          ]);

        if (error) throw error;

        // Remove do IndexedDB apenas se inserção no Supabase for confirmada
        await dbService.deletePendingEvaluation(record.id);
        console.log(`Registro ${record.id} sincronizado com sucesso.`);
      } catch (err) {
        console.error(`Falha ao sincronizar registro ${record.id}:`, err);
        // Mantém no IndexedDB para próxima tentativa
      }
    }
  },
};

// Monitora reestabelecimento de conexão
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('Conexão reestabelecida, disparando sincronização...');
    syncService.syncPendingEvaluations();
  });
}
