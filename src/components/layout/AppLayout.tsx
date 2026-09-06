import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Home,
  Smartphone,
  Users,
  Calendar,
  Stethoscope,
  Calculator,
  Apple,
  ShoppingCart,
  DollarSign,
  BarChart2,
  Megaphone,
  UserCircle,
  Building,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  FileText,
  Search,
  Sparkles,
  CheckCircle2,
  Shield,
  Activity,
  Scale,
  Clock,
  ExternalLink,
  ChevronLeft,
  Table2,
  ClipboardList,
  Maximize2,
  Download
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useClinicalFocus } from '../../contexts/ClinicalFocusContext';
import { useTheme } from '../../contexts/ThemeContext';
import { OfflineIndicator } from '../pwa/OfflineIndicator';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { ClinicalFocusWorkspace } from '../clinical/ClinicalFocusWorkspace';
import { ThemeToggle } from '../ThemeToggle';
import { PaletteQuickDropdown } from '../palette/PaletteQuickDropdown';
import { PaletteSelectorModal } from '../palette/PaletteSelectorModal';
import { TrainingModeBanner } from '../training/TrainingModeBanner';
import { TrainingToggleBadge } from '../training/TrainingToggleBadge';
import { TrainingGuideModal } from '../training/TrainingGuideModal';
import clsx from 'clsx';

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Header quick search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Notification dropdown state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // User menu dropdown state
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isClinicalFocusActive, enableClinicalFocus } = useClinicalFocus();
  const { setPaletteModalOpen } = useTheme();

  // Global shortcut Alt+P to toggle Palette Selector Modal
  useEffect(() => {
    const handlePaletteShortcut = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        setPaletteModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handlePaletteShortcut);
    return () => window.removeEventListener('keydown', handlePaletteShortcut);
  }, [setPaletteModalOpen]);

  // Close menus on route change or outside click
  useEffect(() => {
    setIsSidebarOpen(false);
    setIsSearchOpen(false);
    setIsNotificationsOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenPdfReport = () => {
    if (location.pathname !== '/calculadoras/dobras-cutaneas') {
      navigate('/calculadoras/dobras-cutaneas');
    }
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('open-printable-report'));
    }, 120);
  };

  // Derive breadcrumbs based on current pathname
  const breadcrumb = useMemo(() => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') {
      return { group: 'Principal', title: 'Dashboard Geral' };
    }
    if (path === '/visao-geral') {
      return { group: 'Principal', title: 'Visão Geral' };
    }
    if (path.startsWith('/aplicativo')) {
      return { group: 'Principal', title: 'Aplicativo do Paciente (Simulador)' };
    }
    if (path.startsWith('/clientes')) {
      return { group: 'Principal', title: 'Prontuário de Clientes / Pacientes' };
    }
    if (path.startsWith('/agenda')) {
      return { group: 'Principal', title: 'Agenda de Atendimentos' };
    }
    if (path.startsWith('/unidades')) {
      return { group: 'Administração & Rede', title: 'Unidades / Clínicas (10/10 Ativo)' };
    }
    if (path.startsWith('/configuracoes') || path === '/minha-conta' || path === '/conta') {
      return { group: 'Configurações', title: 'Minha Conta & Central de Funções (100% Ativo)' };
    }
    if (path === '/nutricao/suplementos' || path === '/atendimentos/prescricoes') {
      return { group: 'Clínico & Nutrição', title: 'Receituário de Suplementos (Doses Nutri/Médico)' };
    }
    if (path === '/clinico/exames' || path === '/atendimentos/exames') {
      return { group: 'Clínico & Nutrição', title: 'Requisição de Exames Laboratoriais (9 Painéis)' };
    }
    if (path === '/nutricao/tabela-anvisa') {
      return { group: 'Nutrição & Rotulagem', title: 'Tabela Nutricional Oficial ANVISA (RDC 429/2020)' };
    }
    if (path === '/calculadoras/dobras-cutaneas') {
      return { group: 'Clínico & Nutrição', title: 'Calculadora de Dobras Cutâneas' };
    }
    if (path === '/calculadoras/metabolismo') {
      return { group: 'Calculadoras', title: 'TMB & Gasto Energético (GET)' };
    }
    if (path === '/calculadoras/imc') {
      return { group: 'Calculadoras', title: 'IMC & Peso Ideal' };
    }
    if (path === '/calculadoras/nutricional') {
      return { group: 'Calculadoras', title: 'Distribuição Nutricional' };
    }
    return { group: 'Clínico', title: 'Central Clínica ClinicSaaS' };
  }, [location.pathname]);

  // Quick search entries matching App.tsx routes
  const quickSearchItems = useMemo(() => {
    return [
      {
        label: 'Modo Foco Clínico Presencial (Tela Cheia)',
        desc: 'Ativar visão limpa do prontuário em tela cheia com atalhos de teclado (Alt+F)',
        route: '#focus-mode-trigger',
        icon: <Maximize2 className="w-4 h-4 text-emerald-500" />
      },
      {
        label: 'Calculadora de Dobras Cutâneas',
        desc: 'Protocolos Jackson-Pollock 3/7, Durnin-Womersley e laudo PDF',
        route: '/calculadoras/dobras-cutaneas',
        icon: <Calculator className="w-4 h-4 text-sky-500" />
      },
      {
        label: 'Aplicativo do Paciente (Simulador)',
        desc: 'Diário alimentar, registro de água, fotos e chat em tempo real',
        route: '/aplicativo',
        icon: <Smartphone className="w-4 h-4 text-emerald-500" />
      },
      {
        label: 'Prontuário de Pacientes',
        desc: 'Lista de clientes, histórico de consultas e nova avaliação',
        route: '/clientes',
        icon: <Users className="w-4 h-4 text-indigo-500" />
      },
      {
        label: 'Agenda de Consultas',
        desc: 'Horários do dia, confirmações de presença e status',
        route: '/agenda',
        icon: <Calendar className="w-4 h-4 text-indigo-500" />
      },
      {
        label: 'Calculadora de TMB & GET',
        desc: 'Equações Mifflin-St Jeor e Harris-Benedict com NAF',
        route: '/calculadoras/metabolismo',
        icon: <Scale className="w-4 h-4 text-amber-500" />
      },
      {
        label: 'IMC & Peso Teórico Ideal',
        desc: 'Fórmula de Devine e faixas de classificação da OMS',
        route: '/calculadoras/imc',
        icon: <Activity className="w-4 h-4 text-emerald-500" />
      },
      {
        label: 'Minha Conta & Central de Funções (Ativação Master)',
        desc: 'Ativar todas as funções do SaaS, dados do conselho CRN/CRM e parâmetros clínicos',
        route: '/configuracoes/conta',
        icon: <UserCircle className="w-4 h-4 text-emerald-500" />
      },
      {
        label: 'Tabela Nutricional Oficial ANVISA (RDC 429/2020)',
        desc: 'Rotulagem nutricional, porções regulamentadas e lupa frontal',
        route: '/nutricao/tabela-anvisa',
        icon: <Table2 className="w-4 h-4 text-sky-500" />
      },
      {
        label: 'Receituário de Suplementos (Doses Nutri vs Médico)',
        desc: 'Prescrição magistral, fitoterapia e diferenciação por conselho',
        route: '/nutricao/suplementos',
        icon: <Apple className="w-4 h-4 text-amber-500" />
      },
      {
        label: 'Requisição de Exames Laboratoriais (9 Painéis)',
        desc: 'Painel metabólico, lipídico, hormonal, inflamatório e laudo oficial',
        route: '/clinico/exames',
        icon: <ClipboardList className="w-4 h-4 text-indigo-500" />
      },
      {
        label: 'Unidades / Clínicas (Central 10/10)',
        desc: 'Filiais, alvará de Vigilância Sanitária (VISA), RT e calibração de instrumentos',
        route: '/unidades',
        icon: <Building className="w-4 h-4 text-emerald-600" />
      }
    ].filter(item =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Mock clinic notifications
  const notifications = [
    {
      id: 'notif-1',
      title: 'Mariana Lima Santos',
      desc: 'Confirmou presença para a consulta das 08:30.',
      time: '10 min atrás',
      unread: true
    },
    {
      id: 'notif-2',
      title: 'Aplicativo do Paciente',
      desc: 'Carlos atingiu a meta diária de 2.500ml de água.',
      time: '25 min atrás',
      unread: true
    },
    {
      id: 'notif-3',
      title: 'Laudo Antropométrico',
      desc: 'Laudo de Jackson-Pollock 7 dobras pronto para emissão.',
      time: '1h atrás',
      unread: false
    }
  ];

  // Render Clinical Focus Workspace in Fullscreen if active
  if (isClinicalFocusActive) {
    return <ClinicalFocusWorkspace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans transition-colors duration-200">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Offline Status Indicator */}
      <OfflineIndicator />

      {/* ========================================================================= */}
      {/* 3. MAIN WRAPPER (HEADER + CONTENT + BOTTOM BAR)                           */}
      {/* ========================================================================= */}
      <div
        className={clsx(
          "flex-1 flex flex-col min-h-screen transition-all duration-300",
          isSidebarCollapsed ? "lg:ml-[80px]" : "lg:ml-[280px]"
        )}
      >
        {/* Top Header Bar */}
        <header className="h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-30 shadow-2xs transition-colors duration-200">
          {/* Left Header: Mobile Toggle, Logo & Dynamic Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors cursor-pointer"
              aria-label="Abrir menu de navegação"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo on mobile */}
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-2 lg:hidden cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-sky-500 text-slate-950 flex items-center justify-center font-bold text-sm shrink-0">
                C
              </div>
            </div>

            {/* Dynamic Breadcrumbs & Current Page Indicator */}
            <div className="hidden sm:flex items-center gap-2 text-xs truncate">
              <span className="text-slate-400 dark:text-slate-500 font-medium">
                {breadcrumb.group}
              </span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="font-bold text-slate-900 dark:text-white truncate">
                {breadcrumb.title}
              </span>
            </div>
          </div>

          {/* Center/Right: Quick Search & Core Action Shortcuts */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Shortcut & Dialog Trigger */}
            <div className="relative" ref={searchRef}>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Buscar rotas, ferramentas..."
                  className="w-36 sm:w-56 md:w-64 pl-9 pr-3 py-1.5 text-xs rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 transition-all"
                />
              </div>

              {/* Search Results Dropdown */}
              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 text-xs space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Acesso Rápido às Rotas do App
                  </div>
                  {quickSearchItems.length > 0 ? (
                    quickSearchItems.map((item) => (
                      <div
                        key={item.route}
                        onClick={() => {
                          if (item.route === '#focus-mode-trigger') {
                            enableClinicalFocus();
                          } else {
                            navigate(item.route);
                          }
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="flex items-start gap-2.5 p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                      >
                        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white truncate">
                            {item.label}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-slate-400 text-xs">
                      Nenhuma rota encontrada para &quot;{searchQuery}&quot;
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Shortcut: Ativar / Abrir Aplicativo do Paciente */}
            <button
              type="button"
              onClick={() => navigate('/aplicativo')}
              className={clsx(
                "hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
                location.pathname.startsWith('/aplicativo')
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
              )}
              title="Abrir Simulador do Aplicativo do Paciente"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
              <span>App Paciente</span>
            </button>

            {/* Shortcut: Unidades / Clínicas */}
            <button
              type="button"
              onClick={() => navigate('/unidades')}
              className={clsx(
                "hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
                location.pathname.startsWith('/unidades')
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
              )}
              title="Central de Gestão e Ativação de Unidades e Filiais (10/10)"
            >
              <Building className="w-3.5 h-3.5 text-emerald-600" />
              <span>Unidades</span>
              <span className="px-1.5 py-0.2 rounded-md bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 text-[10px] font-bold font-mono">
                10/10
              </span>
            </button>

            {/* Dedicated PDF Report Button */}
            <button
              id="btn-gerar-relatorio-pdf-header"
              type="button"
              onClick={handleOpenPdfReport}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-bold rounded-2xl text-slate-950 bg-sky-400 hover:bg-sky-300 shadow-2xs transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              title="Gerar laudo antropométrico formatado em PDF para entrega ao paciente"
            >
              <FileText className="w-3.5 h-3.5 text-slate-950" />
              <span className="hidden sm:inline">Relatório PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>

            {/* Dedicated Modo Foco Clínico Presencial (Alt+F) Button */}
            <button
              id="btn-foco-clinico-header"
              type="button"
              onClick={() => enableClinicalFocus()}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-bold rounded-2xl text-emerald-950 bg-emerald-400 hover:bg-emerald-300 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 shadow-2xs transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              title="Ativar Modo Foco Clínico Presencial em Tela Cheia [Alt+F]"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Modo Foco</span>
              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-emerald-700/20 text-emerald-950 dark:text-slate-950 font-extrabold hidden md:inline">
                Alt+F
              </span>
            </button>

            {/* Notification Bell with Dropdown */}
            <div className="relative" ref={notificationsRef}>
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
                aria-label="Ver notificações"
                title="Notificações da clínica"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-500 ring-2 ring-white dark:ring-slate-900" />
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 text-xs space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 px-1">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">
                      Notificações Recentes
                    </span>
                    <span className="text-[10px] font-bold text-sky-500 font-mono">2 novas</span>
                  </div>

                  <div className="space-y-1.5">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={clsx(
                          "p-2.5 rounded-2xl border transition-colors cursor-pointer",
                          n.unread
                            ? "bg-sky-50/60 dark:bg-sky-950/30 border-sky-200 dark:border-sky-900/60"
                            : "bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800"
                        )}
                        onClick={() => setIsNotificationsOpen(false)}
                      >
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-900 dark:text-white">
                          <span>{n.title}</span>
                          <span className="text-[9px] text-slate-400 font-mono">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                          {n.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        navigate('/agenda');
                        setIsNotificationsOpen(false);
                      }}
                      className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                    >
                      Ver todos os avisos na Agenda
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Training Mode Quick Toggle Badge */}
            <TrainingToggleBadge />

            {/* Quick Light Palette Selector Dropdown */}
            <PaletteQuickDropdown />

            {/* Theme Toggle Button */}
            <ThemeToggle showLabel={false} />

            {/* Quick User Avatar Badge with Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 cursor-pointer text-left"
                aria-label="Menu do usuário"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                    {user?.name?.charAt(0) || 'V'}
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                </div>
                <div className="leading-tight hidden xl:block">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                    {user?.name || 'Dra. Vanessa'}
                  </p>
                  <p className="text-[10px] text-sky-600 dark:text-sky-400 font-medium">
                    {user?.role || 'Nutricionista'}
                  </p>
                </div>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 text-xs space-y-1">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-slate-900 dark:text-white truncate">
                      {user?.name || 'Dra. Vanessa Rios'}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      vanessa.rios@clinicsaas.com
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/configuracoes/conta');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold flex items-center justify-between cursor-pointer"
                  >
                    <span>Minha Conta & Funções</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      100% Ativo
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/profissionais');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium cursor-pointer"
                  >
                    Profissionais & Ativação
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/unidades');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium cursor-pointer"
                  >
                    Unidades & Clínicas (10/10)
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Global Training Mode Banner when active */}
        <TrainingModeBanner />

        {/* Main Content Area: Renders the active route defined in App.tsx */}
        <main className="flex-1 pb-20 md:pb-8 overflow-x-hidden">
          <Outlet />
        </main>

        {/* Interactive Training Guide Modal */}
        <TrainingGuideModal />

        {/* Clinical Light Palette Customization Modal (Alt+P) */}
        <PaletteSelectorModal />

        {/* ======================================================================= */}
        {/* 4. MOBILE BOTTOM NAVIGATION BAR (< md) FOR QUICK ROUTE SWITCHING       */}
        {/* ======================================================================= */}
        <nav
          aria-label="Navegação móvel rápida"
          className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-40 px-3 flex items-center justify-around text-[10px]"
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              clsx(
                "flex flex-col items-center gap-1 cursor-pointer transition-colors py-1 px-2.5 rounded-xl",
                isActive
                  ? "text-sky-600 dark:text-sky-400 font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              )
            }
          >
            <Home className="w-4 h-4" />
            <span>Início</span>
          </NavLink>

          <NavLink
            to="/calculadoras/dobras-cutaneas"
            className={({ isActive }) =>
              clsx(
                "flex flex-col items-center gap-1 cursor-pointer transition-colors py-1 px-2.5 rounded-xl",
                isActive
                  ? "text-sky-600 dark:text-sky-400 font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              )
            }
          >
            <Calculator className="w-4 h-4" />
            <span>Dobras</span>
          </NavLink>

          <NavLink
            to="/aplicativo"
            className={({ isActive }) =>
              clsx(
                "flex flex-col items-center gap-1 cursor-pointer transition-colors py-1 px-2.5 rounded-xl relative",
                isActive
                  ? "text-emerald-600 dark:text-emerald-400 font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              )
            }
          >
            <Smartphone className="w-4 h-4" />
            <span>App</span>
            <span className="absolute top-0.5 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </NavLink>

          <NavLink
            to="/clientes"
            className={({ isActive }) =>
              clsx(
                "flex flex-col items-center gap-1 cursor-pointer transition-colors py-1 px-2.5 rounded-xl",
                isActive
                  ? "text-indigo-600 dark:text-indigo-400 font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              )
            }
          >
            <Users className="w-4 h-4" />
            <span>Pacientes</span>
          </NavLink>

          <NavLink
            to="/agenda"
            className={({ isActive }) =>
              clsx(
                "flex flex-col items-center gap-1 cursor-pointer transition-colors py-1 px-2.5 rounded-xl",
                isActive
                  ? "text-sky-600 dark:text-sky-400 font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              )
            }
          >
            <Calendar className="w-4 h-4" />
            <span>Agenda</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};
