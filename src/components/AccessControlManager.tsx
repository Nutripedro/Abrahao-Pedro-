import React, { useState } from 'react';
import { Shield, Save } from 'lucide-react';

// Tipos base para o sistema de permissões
type Role = 'Admin' | 'Nutricionista' | 'Recepcionista';
type Feature = 'dashboard' | 'pacientes' | 'dietas' | 'financeiro' | 'relatorios';

interface PermissionMatrix {
  [key: string]: { [key in Feature]: boolean };
}

const initialPermissions: PermissionMatrix = {
  Admin: { dashboard: true, pacientes: true, dietas: true, financeiro: true, relatorios: true },
  Nutricionista: { dashboard: true, pacientes: true, dietas: true, financeiro: false, relatorios: true },
  Recepcionista: { dashboard: true, pacientes: true, dietas: false, financeiro: true, relatorios: false },
};

const features: { id: Feature; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'pacientes', label: 'Pacientes' },
  { id: 'dietas', label: 'Dietas e Prescrições' },
  { id: 'financeiro', label: 'Financeiro' },
  { id: 'relatorios', label: 'Relatórios' },
];

export const AccessControlManager: React.FC = () => {
  const [permissions, setPermissions] = useState<PermissionMatrix>(initialPermissions);

  const handleToggle = (role: Role, feature: Feature) => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [feature]: !prev[role][feature]
      }
    }));
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <Shield className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Gerenciamento de Níveis de Acesso</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <th className="py-2 text-slate-500 font-medium">Funcionalidade</th>
              {(['Admin', 'Nutricionista', 'Recepcionista'] as Role[]).map(role => (
                <th key={role} className="py-2 text-center text-slate-700 dark:text-slate-200">{role}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {features.map(feature => (
              <tr key={feature.id}>
                <td className="py-3 text-slate-900 dark:text-white font-semibold">{feature.label}</td>
                {(['Admin', 'Nutricionista', 'Recepcionista'] as Role[]).map(role => (
                  <td key={role} className="py-3 text-center">
                    <input
                      type="checkbox"
                      checked={permissions[role][feature.id]}
                      onChange={() => handleToggle(role, feature.id)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end pt-3">
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors active:scale-95">
          <Save className="w-3.5 h-3.5" />
          Salvar Permissões
        </button>
      </div>

      <p className="text-[10px] text-slate-400 italic">
        * Nota: Esta interface gerencia a visibilidade visual das funcionalidades. 
        A segurança real dos dados deve ser garantida por políticas RLS no banco de dados Supabase.
      </p>
    </div>
  );
};
