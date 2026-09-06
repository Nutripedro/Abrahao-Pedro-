import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { 
  ChevronDown, ChevronRight, ChevronLeft, X, LogOut, Settings, UserCircle, Zap,
  CheckCircle2, Sparkles, ShieldCheck
} from 'lucide-react';
import clsx from 'clsx';
import { navigationConfig, MenuItem, MenuGroup } from '../../config/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useClinic } from '../../contexts/ClinicContext';
import { usePatientApp } from '../../contexts/PatientAppContext';
import { useCrm } from '../../contexts/CrmContext';
import { useMealPlan } from '../../contexts/MealPlanContext';
import { activateAllExamFeatures } from '../../data/clinicalExamsData';
import { activateAllReportsFeatures } from '../../data/reportsClinicalData';
import { activateAllConsultationsFeatures } from '../../data/consultationsData';
import { activateAllInventoryFeatures } from '../../data/productsInventoryData';
import { activateAllFinancialFeatures } from '../../data/financialData';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { PushNotificationToggle } from '../pwa/PushNotificationToggle';
import { ThemeToggle } from '../ThemeToggle';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  setIsOpen, 
  isCollapsed, 
  setIsCollapsed 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasPermission, activateAllTeamFeatures, allProfessionalFeaturesActive, setAllProfessionalFeaturesActive } = useAuth();
  const { activateAllUnitsFeatures } = useClinic();
  const { activateAllFeatures: activateAllPatientAppFeatures } = usePatientApp();
  const { activateAllCrmFeatures } = useCrm();
  const { activateAllFeatures: activateAllMealPlanFeatures } = useMealPlan();

  const [activationFeedback, setActivationFeedback] = useState(false);
  
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    'principal': true,
    'clinico': true,
    'gestao': true,
    'admin': true,
  });

  // Comprehensive master activation of all annex and clinical features
  const handleActivateAllAnnexFunctions = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // 1. Auth & Clinical Team
    activateAllTeamFeatures();
    if (setAllProfessionalFeaturesActive) {
      setAllProfessionalFeaturesActive(true);
    }

    // 2. Multi-Unit & Clinics (10/10)
    if (activateAllUnitsFeatures) activateAllUnitsFeatures();

    // 3. Patient App (10/10)
    if (activateAllPatientAppFeatures) activateAllPatientAppFeatures();

    // 4. CRM & WhatsApp Automations (10/10)
    if (activateAllCrmFeatures) activateAllCrmFeatures();

    // 5. Meal Plans & TACO Database (10/10)
    if (activateAllMealPlanFeatures) activateAllMealPlanFeatures();

    // 6. Clinical Exam Requisitions (9 Panels)
    activateAllExamFeatures();

    // 7. Clinical & Management Reports (10/10)
    activateAllReportsFeatures();

    // 8. Consultations & SOAP Records
    activateAllConsultationsFeatures();

    // 9. Products & Inventory
    activateAllInventoryFeatures();

    // 10. Financial DRE & Pix
    activateAllFinancialFeatures();

    // Expand all sidebar menus and submenus so every function is immediately visible
    setExpandedMenus({
      'principal': true,
      'clinico': true,
      'gestao': true,
      'admin': true,
      'aplicativo': true,
      'clientes': true,
      'agenda': true,
      'atendimentos': true,
      'calculadoras': true,
      'nutricao': true,
      'financeiro': true,
      'relatorios': true,
      'crm': true,
      'configuracoes': true,
    });

    // Save global master activation flags to localStorage
    try {
      localStorage.setItem('nutri_saas_all_master_features_unlocked', 'true');
      localStorage.setItem('nutri_saas_all_pro_features', 'true');
    } catch {
      // Ignore in strict storage environments
    }

    // Dispatch global event for live reactive UI updates across all open views
    window.dispatchEvent(new CustomEvent('nutri-saas-all-features-activated'));

    // Visual feedback indicator
    setActivationFeedback(true);
    setTimeout(() => setActivationFeedback(false), 3500);
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [location.pathname, setIsOpen]);

  const toggleSubmenu = (id: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const isRouteActive = (route?: string) => {
    if (!route) return false;
    if (route === '/' && location.pathname !== '/') return false;
    return location.pathname === route || (route !== '/' && location.pathname.startsWith(route));
  };

  const renderMenuItem = (item: MenuItem, isChild = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = isRouteActive(item.route);
    const isExpanded = expandedMenus[item.id] ?? isActive;

    if (!hasPermission(item.permission)) return null;

    return (
      <li key={item.id} className="relative">
        {hasChildren ? (
          <div>
            <button
              type="button"
              onClick={() => {
                if (isCollapsed && window.innerWidth >= 1024) {
                  setIsCollapsed(false);
                }
                toggleSubmenu(item.id);
              }}
              className={clsx(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all group text-left cursor-pointer",
                isActive
                  ? "bg-slate-800/80 text-white font-semibold shadow-sm"
                  : "hover:bg-slate-800/50 hover:text-white text-slate-400"
              )}
            >
              <span className={clsx("shrink-0 transition-colors", isActive ? "text-emerald-400" : "group-hover:text-emerald-300")}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <>
                  <span className="flex-1 truncate text-sm">{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono">
                      {item.badge}
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
                  )}
                </>
              )}
            </button>

            <AnimatePresence>
              {isExpanded && !isCollapsed && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-1 ml-4 pl-4 border-l border-slate-800 space-y-1 overflow-hidden"
                >
                  {item.children?.map(child => (
                    <li key={child.id}>
                      <NavLink
                        to={child.route || '#'}
                        className={({ isActive }) => clsx(
                          "flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-all group",
                          isActive
                            ? "text-white font-medium bg-emerald-500/10"
                            : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30"
                        )}
                      >
                        <span className="truncate">{child.label}</span>
                        {child.badge && (
                          <span className="text-[9px] font-mono font-bold bg-slate-800 text-slate-400 px-1 rounded uppercase tracking-tighter">
                            {child.badge}
                          </span>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <NavLink
            to={item.route || '#'}
            className={({ isActive }) => clsx(
              "flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all group relative",
              isActive
                ? "bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-900/20"
                : "hover:bg-slate-800/50 hover:text-white text-slate-400"
            )}
            title={isCollapsed ? item.label : undefined}
          >
            <span className={clsx("shrink-0 transition-colors", isActive ? "text-white" : "group-hover:text-emerald-300")}>
              {item.icon}
            </span>
            {!isCollapsed && (
              <>
                <span className="flex-1 truncate text-sm">{item.label}</span>
                {item.badge && (
                  <span className={clsx(
                    "px-1.5 py-0.5 rounded-md text-[10px] font-bold font-mono",
                    isActive ? "bg-white/20 text-white" : "bg-emerald-500/20 text-emerald-400"
                  )}>
                    {item.badge}
                  </span>
                )}
              </>
            )}
            {isActive && isCollapsed && (
              <motion.div 
                layoutId="active-pill"
                className="absolute left-0 w-1 h-6 bg-emerald-400 rounded-r-full"
              />
            )}
          </NavLink>
        )}
      </li>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden cursor-pointer backdrop-blur-sm"
            style={{ WebkitBackdropFilter: 'blur(8px)' }}
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        drag={isOpen && window.innerWidth < 1024 ? "x" : false}
        dragConstraints={{ left: -280, right: 0 }}
        dragElastic={0.05}
        onDragEnd={(_e, info: PanInfo) => {
          if (info.offset.x < -80 || info.velocity.x < -300) {
            setIsOpen(false);
          }
        }}
        animate={{ 
          width: isCollapsed ? 80 : 280,
          x: isOpen || window.innerWidth >= 1024 ? 0 : -280
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={clsx(
          "fixed top-0 left-0 z-50 h-screen bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shadow-2xl lg:shadow-none select-none overflow-hidden"
        )}
      >
        {/* Top Header / Brand */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800 shrink-0 bg-slate-950/40">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 overflow-hidden cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 flex items-center justify-center font-extrabold text-lg shrink-0 shadow-sm group-hover:rotate-6 transition-transform">
              N
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <span className="font-bold text-white text-base tracking-tight block leading-tight">
                  NutriSaaS
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-medium block">
                  Clínica & Antropometria
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              if (window.innerWidth < 1024) setIsOpen(false);
              else setIsCollapsed(!isCollapsed);
            }}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label={isCollapsed ? "Expandir barra lateral" : "Recolher barra lateral"}
          >
            {window.innerWidth < 1024 ? (
              <X className="w-5 h-5" />
            ) : isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* User Profile Area */}
        <div className={clsx("border-b border-slate-800 shrink-0 bg-slate-900/50", isCollapsed ? "p-3" : "p-4")}>
          <div className={clsx("flex items-center gap-3", isCollapsed && "justify-center")}>
            <div className="relative group cursor-pointer" onClick={() => navigate('/configuracoes/conta')}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-800 border border-slate-700 flex items-center justify-center text-white font-bold text-sm shadow-xs overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                {user?.name?.charAt(0) || 'D'}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 bg-emerald-500" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Dr. Nutricionista'}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-emerald-400 font-medium truncate">
                    {user?.role || 'Nutricionista'}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span className="text-[10px] text-slate-500 font-mono">Premium</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu List */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {navigationConfig.map((group) => {
            const visibleItems = group.items.filter(item => hasPermission(item.permission));
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.id} className="px-3">
                {!isCollapsed && (
                  <div className="flex items-center justify-between px-3 mb-2">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 font-mono">
                      {group.label}
                    </h3>
                    {group.id === 'gestao' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          activateAllTeamFeatures();
                        }}
                        className="p-1 rounded-md hover:bg-slate-800 text-slate-500 hover:text-amber-400 transition-colors cursor-pointer group/zap"
                        title="Ativar todas as funções profissionais"
                      >
                        <Zap className="w-3 h-3 group-hover/zap:fill-amber-400" />
                      </button>
                    )}
                  </div>
                )}

                <ul className="space-y-1">
                  {visibleItems.map((item) => renderMenuItem(item))}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer Area */}
        <div className="p-3.5 border-t border-slate-800 shrink-0 space-y-3 bg-slate-950/40">
          {/* PWA Features */}
          {!isCollapsed && (
            <div className="px-1 space-y-2">
              <PushNotificationToggle />
            </div>
          )}
          
          <div className={clsx(isCollapsed ? "flex justify-center" : "px-1")}>
            <PWAInstallButton />
          </div>

          {/* Master 10/10 Activation Control for All Annex Functions */}
          <div className="relative">
            <button
              id="btn-ativar-todas-funcoes-anexo"
              type="button"
              onClick={handleActivateAllAnnexFunctions}
              className={clsx(
                "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl transition-all text-xs font-bold cursor-pointer group shadow-sm border text-left",
                allProfessionalFeaturesActive
                  ? "bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/30 text-emerald-300"
                  : "bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/40 text-amber-300 animate-pulse",
                isCollapsed && "justify-center px-2"
              )}
              title="Ativar e desbloquear todas as funções do anexo e módulos do sistema"
            >
              {activationFeedback ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" />
              ) : (
                <Zap className={clsx(
                  "w-4 h-4 shrink-0 transition-transform group-hover:scale-110",
                  allProfessionalFeaturesActive ? "fill-emerald-400 text-emerald-400" : "fill-amber-400 text-amber-400"
                )} />
              )}
              
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <div className="min-w-0">
                    <p className="leading-tight truncate font-bold">
                      {activationFeedback 
                        ? "10/10 Funções Ativadas!" 
                        : allProfessionalFeaturesActive 
                          ? "Todas as Funções Ativas" 
                          : "Ativar Funções do Anexo"}
                    </p>
                    <span className="text-[10px] font-normal text-slate-400 block truncate">
                      {allProfessionalFeaturesActive ? "100% dos módulos liberados" : "Clique para ativar todas"}
                    </span>
                  </div>
                  <span className={clsx(
                    "text-[10px] font-mono px-1.5 py-0.5 rounded font-extrabold shrink-0 ml-1.5",
                    allProfessionalFeaturesActive ? "bg-emerald-500/25 text-emerald-300" : "bg-amber-500/25 text-amber-300"
                  )}>
                    10/10
                  </span>
                </div>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between px-2 py-2 bg-slate-900 rounded-2xl border border-slate-800 gap-1.5 overflow-hidden">
            {!isCollapsed && (
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Ajustes</span>
            )}
            <div className={clsx("flex items-center gap-2", isCollapsed && "flex-col")}>
              <ThemeToggle />
              <button
                onClick={() => logout()}
                className="p-2 rounded-xl hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                title="Sair do sistema"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};
