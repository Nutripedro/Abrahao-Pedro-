import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PatientAppProvider } from './contexts/PatientAppContext';
import { ClinicProvider } from './contexts/ClinicContext';
import { CrmProvider } from './contexts/CrmContext';
import { TrainingModeProvider } from './contexts/TrainingModeContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { MealPlanProvider } from './contexts/MealPlanContext';
import { ClinicalFocusProvider } from './contexts/ClinicalFocusContext';
import { AppLayout } from './components/layout/AppLayout';
import { navigationConfig } from './config/navigation';

// Lazy loading of main pages for performance
const Placeholder = lazy(() => import('./pages/Placeholder').then(m => ({ default: m.Placeholder })));
const Anthropometry = lazy(() => import('./pages/Anthropometry').then(m => ({ default: m.Anthropometry })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const PatientAppPage = lazy(() => import('./pages/PatientAppPage').then(m => ({ default: m.PatientAppPage })));
const PatientsPage = lazy(() => import('./pages/PatientsPage').then(m => ({ default: m.PatientsPage })));
const AgendaPage = lazy(() => import('./pages/AgendaPage').then(m => ({ default: m.AgendaPage })));
const ClinicalCalculatorsPage = lazy(() => import('./pages/ClinicalCalculatorsPage').then(m => ({ default: m.ClinicalCalculatorsPage })));
const ProfessionalsPage = lazy(() => import('./pages/ProfessionalsPage').then(m => ({ default: m.ProfessionalsPage })));
const UnitsPage = lazy(() => import('./pages/UnitsPage').then(m => ({ default: m.UnitsPage })));
const SupplementPrescriptionPage = lazy(() => import('./pages/SupplementPrescriptionPage').then(m => ({ default: m.SupplementPrescriptionPage })));
const ExamRequisitionPage = lazy(() => import('./pages/ExamRequisitionPage').then(m => ({ default: m.ExamRequisitionPage })));
const AnvisaTablePage = lazy(() => import('./pages/AnvisaTablePage').then(m => ({ default: m.AnvisaTablePage })));
const AccountSettingsPage = lazy(() => import('./pages/AccountSettingsPage').then(m => ({ default: m.AccountSettingsPage })));
const CrmMarketingPage = lazy(() => import('./pages/CrmMarketingPage').then(m => ({ default: m.CrmMarketingPage })));
const MealPlansPage = lazy(() => import('./pages/MealPlansPage').then(m => ({ default: m.MealPlansPage })));
const ReportsPage = lazy(() => import('./pages/ReportsPage').then(m => ({ default: m.ReportsPage })));
const ConsultationsPage = lazy(() => import('./pages/ConsultationsPage').then(m => ({ default: m.ConsultationsPage })));
const ProductsInventoryPage = lazy(() => import('./pages/ProductsInventoryPage').then(m => ({ default: m.ProductsInventoryPage })));
const FinancialPage = lazy(() => import('./pages/FinancialPage').then(m => ({ default: m.FinancialPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));

// Loading component for Suspense
const RouteLoader = () => (
  <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-center animate-pulse">
        <div className="w-6 h-6 rounded-lg bg-emerald-500 animate-spin"></div>
      </div>
      <div className="space-y-1 text-center">
        <p className="text-sm font-bold text-slate-900 dark:text-white">Carregando módulo...</p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">Otimizando sua experiência clínica</p>
      </div>
    </div>
  </div>
);

import { useAuth } from './contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth() as any;
  
  if (loading) return <RouteLoader />;
  if (!user) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

export default function App() {
  // Helper to flatten routes for the router
  const allRoutes: { route: string; label: string }[] = [];
  navigationConfig.forEach(group => {
    group.items.forEach(item => {
      if (item.route) allRoutes.push({ route: item.route, label: item.label });
      if (item.children) {
        item.children.forEach(child => {
          if (child.route) allRoutes.push({ route: child.route, label: child.label });
        });
      }
    });
  });

  const explicitlyHandledRoutes = [
    '/',
    '/dashboard',
    '/visao-geral',
    '/aplicativo',
    '/aplicativo/recursos',
    '/aplicativo/notificacoes',
    '/clientes',
    '/clientes/todos',
    '/clientes/novo',
    '/clientes/prontuario',
    '/clientes/anamnese',
    '/agenda',
    '/agenda/calendario',
    '/agenda/novo',
    '/agenda/confirmacoes',
    '/calculadoras',
    '/calculadoras/dobras-cutaneas',
    '/calculadoras/metabolismo',
    '/calculadoras/imc',
    '/calculadoras/nutricional',
    '/profissionais',
    '/nutricao/planos',
    '/nutricao/alimentos',
    '/nutricao/cardapios',
    '/planos-alimentares',
    '/nutricao/suplementos',
    '/atendimentos',
    '/atendimentos/lista',
    '/atendimentos/novo',
    '/atendimentos/prontuario',
    '/atendimentos/prescricoes',
    '/clinico/exames',
    '/atendimentos/exames',
    '/nutricao/tabela-anvisa',
    '/unidades',
    '/crm',
    '/crm/pipeline',
    '/crm/automacoes',
    '/crm/campanhas',
    '/crm/recuperacao',
    '/crm/nps',
    '/relatorios',
    '/relatorios/clinicos',
    '/relatorios/financeiros',
    '/estoque',
    '/estoque/produtos',
    '/estoque/movimentacoes',
    '/estoque/compras',
    '/estoque/validade',
    '/produtos',
    '/financeiro',
    '/financeiro/visao',
    '/financeiro/receitas',
    '/financeiro/despesas',
    '/financeiro/dre',
    '/financeiro/contas',
    '/financeiro/comissoes',
    '/financeiro/cobranca',
    '/financeiro/assinaturas',
    '/financeiro/recibos',
    '/configuracoes',
    '/configuracoes/conta',
    '/configuracoes/empresa',
    '/configuracoes/usuarios',
    '/minha-conta',
    '/conta'
  ];

  return (
    <ThemeProvider>
      <AuthProvider>
        <ClinicProvider>
          <CrmProvider>
            <PatientAppProvider>
              <MealPlanProvider>
                <ClinicalFocusProvider>
                  <TrainingModeProvider>
                    <Router>
                      <Suspense fallback={<RouteLoader />}>
                        <Routes>
                          <Route path="/login" element={<LoginPage />} />
                          
                          <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                            {/* 1. Dashboard Principal */}
                            <Route index element={<Dashboard />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="visao-geral" element={<Dashboard />} />
                            
                            {/* 2. Módulo do Aplicativo do Paciente (Simulador & Funções) */}
                            <Route path="aplicativo" element={<PatientAppPage />} />
                            <Route path="aplicativo/recursos" element={<PatientAppPage />} />
                            <Route path="aplicativo/notificacoes" element={<PatientAppPage />} />

                            {/* 3. Clientes e Prontuários */}
                            <Route path="clientes" element={<PatientsPage />} />
                            <Route path="clientes/todos" element={<PatientsPage />} />
                            <Route path="clientes/novo" element={<PatientsPage />} />
                            <Route path="clientes/prontuario" element={<PatientsPage />} />
                            <Route path="clientes/anamnese" element={<PatientsPage />} />

                            {/* 4. Agenda de Atendimentos */}
                            <Route path="agenda" element={<AgendaPage />} />
                            <Route path="agenda/calendario" element={<AgendaPage />} />
                            <Route path="agenda/novo" element={<AgendaPage />} />
                            <Route path="agenda/confirmacoes" element={<AgendaPage />} />

                            {/* 5. Calculadoras Clínicas & Antropometria com IA */}
                            <Route path="calculadoras/dobras-cutaneas" element={<Anthropometry />} />
                            <Route path="calculadoras/metabolismo" element={<ClinicalCalculatorsPage initialTab="tmb" />} />
                            <Route path="calculadoras/imc" element={<ClinicalCalculatorsPage initialTab="imc" />} />
                            <Route path="calculadoras/nutricional" element={<ClinicalCalculatorsPage initialTab="macros" />} />
                            <Route path="calculadoras" element={<ClinicalCalculatorsPage />} />

                            {/* 6. Módulo de Profissionais & Ativação de Recursos */}
                            <Route path="profissionais" element={<ProfessionalsPage />} />

                            {/* 6.1 Módulo de Unidades / Clínicas (Central de Gestão & Ativação 10/10) */}
                            <Route path="unidades" element={<UnitsPage />} />

                            {/* 6.2 Módulo de Planos Alimentares & Banco TACO (10/10 Funções Ativas) */}
                            <Route path="nutricao/planos" element={<MealPlansPage />} />
                            <Route path="nutricao/alimentos" element={<MealPlansPage />} />
                            <Route path="nutricao/cardapios" element={<MealPlansPage />} />
                            <Route path="planos-alimentares" element={<MealPlansPage />} />

                            {/* 6.3 Módulo de Atendimentos Clínicos & Prontuário SOAP (10/10 Funções Ativas) */}
                            <Route path="atendimentos" element={<ConsultationsPage />} />
                            <Route path="atendimentos/lista" element={<ConsultationsPage />} />
                            <Route path="atendimentos/novo" element={<ConsultationsPage />} />
                            <Route path="atendimentos/prontuario" element={<ConsultationsPage />} />

                            {/* 7. Receituário Inteligente de Suplementos (Doses Nutri vs. Médico) */}
                            <Route path="nutricao/suplementos" element={<SupplementPrescriptionPage />} />
                            <Route path="atendimentos/prescricoes" element={<SupplementPrescriptionPage />} />

                            {/* 8. Requisição Inteligente de Exames Laboratoriais */}
                            <Route path="clinico/exames" element={<ExamRequisitionPage />} />
                            <Route path="atendimentos/exames" element={<ExamRequisitionPage />} />

                            {/* 9. Gerador de Tabela Nutricional Oficial ANVISA (RDC 429/2020 & IN 75/2020) */}
                            <Route path="nutricao/tabela-anvisa" element={<AnvisaTablePage />} />

                            {/* 10. Módulo de CRM & Marketing Clínico Ético (10/10 Funções Ativas) */}
                            <Route path="crm" element={<CrmMarketingPage />} />
                            <Route path="crm/pipeline" element={<CrmMarketingPage />} />
                            <Route path="crm/automacoes" element={<CrmMarketingPage />} />
                            <Route path="crm/campanhas" element={<CrmMarketingPage />} />
                            <Route path="crm/recuperacao" element={<CrmMarketingPage />} />
                            <Route path="crm/nps" element={<CrmMarketingPage />} />

                            {/* 10.1 Central de Relatórios Clínicos, Gerenciais & DRE (10/10 Atividades Ativas) */}
                            <Route path="relatorios" element={<ReportsPage />} />
                            <Route path="relatorios/clinicos" element={<ReportsPage />} />
                            <Route path="relatorios/financeiros" element={<ReportsPage />} />

                            {/* 10.2 Gestão de Produtos, Suplementos & Estoque Clínico (10/10 Funções Ativas) */}
                            <Route path="estoque" element={<ProductsInventoryPage />} />
                            <Route path="estoque/produtos" element={<ProductsInventoryPage />} />
                            <Route path="estoque/movimentacoes" element={<ProductsInventoryPage />} />
                            <Route path="estoque/compras" element={<ProductsInventoryPage />} />
                            <Route path="estoque/validade" element={<ProductsInventoryPage />} />
                            <Route path="produtos" element={<ProductsInventoryPage />} />

                            {/* 10.3 Módulo Financeiro & DRE Clínico (10/10 Funções Ativas) */}
                            <Route path="financeiro" element={<FinancialPage initialTab="visao" />} />
                            <Route path="financeiro/visao" element={<FinancialPage initialTab="visao" />} />
                            <Route path="financeiro/receitas" element={<FinancialPage initialTab="receitas" />} />
                            <Route path="financeiro/despesas" element={<FinancialPage initialTab="despesas" />} />
                            <Route path="financeiro/dre" element={<FinancialPage initialTab="dre" />} />
                            <Route path="financeiro/contas" element={<FinancialPage initialTab="contas" />} />
                            <Route path="financeiro/comissoes" element={<FinancialPage initialTab="comissoes" />} />
                            <Route path="financeiro/cobranca" element={<FinancialPage initialTab="cobranca" />} />
                            <Route path="financeiro/assinaturas" element={<FinancialPage initialTab="assinaturas" />} />
                            <Route path="financeiro/recibos" element={<FinancialPage initialTab="recibos" />} />

                            {/* 11. Minha Conta & Central Master de Funções (Configurações & Perfil) */}
                            <Route path="configuracoes" element={<AccountSettingsPage />} />
                            <Route path="configuracoes/conta" element={<AccountSettingsPage />} />
                            <Route path="configuracoes/empresa" element={<AccountSettingsPage />} />
                            <Route path="configuracoes/usuarios" element={<AccountSettingsPage />} />
                            <Route path="minha-conta" element={<AccountSettingsPage />} />
                            <Route path="conta" element={<AccountSettingsPage />} />

                            {/* 12. Dynamic catch-all for remaining config pages */}
                            {allRoutes
                              .filter(item => item.route && !explicitlyHandledRoutes.includes(item.route))
                              .map(item => (
                                <Route 
                                  // @ts-ignore
                                  key={item.route}
                                  path={item.route!.replace(/^\//, '')} 
                                  element={<Placeholder title={item.label} />} 
                                />
                              ))}

                            <Route path="*" element={<Navigate to="/" replace />} />
                          </Route>
                        </Routes>
                      </Suspense>
                    </Router>
                  </TrainingModeProvider>
                </ClinicalFocusProvider>
              </MealPlanProvider>
            </PatientAppProvider>
          </CrmProvider>
        </ClinicProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
