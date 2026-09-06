import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'nutricao-saas-db';
const DB_VERSION = 1;
const STORE_EVALUATIONS = 'pending-evaluations';

export interface PendingEvaluation {
  id: string;
  patient_id: string;
  titulo: string;
  peso: number;
  dobras_json: any;
  results_json: any;
  created_at: string;
}

let dbPromise: Promise<IDBPDatabase<any>>;

if (typeof window !== 'undefined') {
  dbPromise = openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_EVALUATIONS)) {
        db.createObjectStore(STORE_EVALUATIONS, { keyPath: 'id' });
      }
    },
  });
}

export const dbService = {
  async savePendingEvaluation(evalData: PendingEvaluation) {
    const db = await dbPromise;
    await db.put(STORE_EVALUATIONS, evalData);
  },

  async getAllPendingEvaluations(): Promise<PendingEvaluation[]> {
    const db = await dbPromise;
    return await db.getAll(STORE_EVALUATIONS);
  },

  async deletePendingEvaluation(id: string) {
    const db = await dbPromise;
    await db.delete(STORE_EVALUATIONS, id);
  },
};
