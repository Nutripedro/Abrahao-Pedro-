import { ReactNode } from 'react';
import { 
  Home, Users, Calendar, Stethoscope, Calculator, Apple, 
  ShoppingCart, DollarSign, BarChart2, Megaphone, UserCircle, 
  Building, Bell, Settings, HelpCircle, FileText, Activity, Shield,
  Smartphone, ClipboardList, Table2
} from 'lucide-react';
import { UserRole } from '../contexts/AuthContext';

export interface MenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  route?: string;
  permission?: UserRole[];
  badge?: string | number;
  children?: MenuItem[];
}

export interface MenuGroup {
  id: string;
  label: string;
  items: MenuItem[];
}

// Map Lucide icons for cleaner config
const I = {
  Home: <Home className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Calendar: <Calendar className="w-5 h-5" />,
  Stethoscope: <Stethoscope className="w-5 h-5" />,
  Calculator: <Calculator className="w-5 h-5" />,
  Apple: <Apple className="w-5 h-5" />,
  ShoppingCart: <ShoppingCart className="w-5 h-5" />,
  DollarSign: <DollarSign className="w-5 h-5" />,
  BarChart2: <BarChart2 className="w-5 h-5" />,
  Megaphone: <Megaphone className="w-5 h-5" />,
  UserCircle: <UserCircle className="w-5 h-5" />,
  Building: <Building className="w-5 h-5" />,
  Bell: <Bell className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
  Smartphone: <Smartphone className="w-5 h-5" />,
  ClipboardList: <ClipboardList className="w-5 h-5" />,
  Table2: <Table2 className="w-5 h-5" />
};

export const navigationConfig: MenuGroup[] = [
  {
    id: 'principal',
    label: 'Principal',
    items: [
      {
        id: 'inicio',
        label: 'Início',
        icon: I.Home,
        route: '/',
      },
      {
        id: 'aplicativo',
        label: 'Aplicativo do Paciente',
        icon: I.Smartphone,
        route: '/aplicativo',
        badge: 'Ativo',
        children: [
          { id: 'app-visao', label: 'Simulador do App', route: '/aplicativo' },
          { id: 'app-recursos', label: 'Recursos & Módulos', route: '/aplicativo/recursos' },
          { id: 'app-notificacoes', label: 'Engajamento & Alertas', route: '/aplicativo/notificacoes' },
        ]
      },
      {
        id: 'clientes',
        label: 'Clientes / Pacientes',
        icon: I.Users,
        route: '/clientes',
        permission: ['Nutricionista', 'Recepcionista', 'Profissional', 'Gestor', 'Administrador'],
        children: [
          { id: 'clientes-todos', label: 'Todos os clientes', route: '/clientes/todos' },
          { id: 'clientes-novo', label: 'Novo cliente', route: '/clientes/novo' },
          { id: 'clientes-prontuario', label: 'Prontuário', route: '/clientes/prontuario' },
          { id: 'clientes-anamnese', label: 'Anamnese', route: '/clientes/anamnese' },
        ]
      },
      {
        id: 'agenda',
        label: 'Agenda',
        icon: I.Calendar,
        route: '/agenda',
        badge: 3,
        children: [
          { id: 'agenda-calendario', label: 'Calendário', route: '/agenda/calendario' },
          { id: 'agenda-novo', label: 'Novo agendamento', route: '/agenda/novo' },
          { id: 'agenda-confirmacoes', label: 'Confirmações', route: '/agenda/confirmacoes', badge: '1 pendente' },
        ]
      },
      {
        id: 'atendimentos',
        label: 'Atendimentos & Laudos',
        icon: I.Stethoscope,
        route: '/atendimentos',
        badge: '10/10 Ativo',
        permission: ['Nutricionista', 'Profissional', 'Gestor', 'Administrador'],
        children: [
          { id: 'atend-lista', label: 'Histórico & Prontuários', route: '/atendimentos/lista', badge: 'Ativo' },
          { id: 'atend-novo', label: 'Novo atendimento (SOAP)', route: '/atendimentos/novo', badge: 'Sala' },
          { id: 'atend-prescricoes', label: 'Receituário de Suplementos', route: '/atendimentos/prescricoes', badge: 'Ativo' },
          { id: 'atend-exames', label: 'Requisição de Exames', route: '/atendimentos/exames', badge: 'Ativo' },
        ]
      }
    ]
  },
  {
    id: 'clinico',
    label: 'Clínico & Nutrição',
    items: [
      {
        id: 'calculadoras',
        label: 'Calculadoras Clínicas',
        icon: I.Calculator,
        route: '/calculadoras',
        children: [
          { id: 'calc-dobras', label: 'Dobras Cutâneas & IA', route: '/calculadoras/dobras-cutaneas', badge: 'IA' },
          { id: 'calc-nutri', label: 'Necessidade Energética & Macros', route: '/calculadoras/nutricional' },
          { id: 'calc-tmb', label: 'TMB / GET (Fórmulas Puras)', route: '/calculadoras/metabolismo' },
          { id: 'calc-imc', label: 'IMC & Peso Ideal', route: '/calculadoras/imc' },
        ]
      },
      {
        id: 'nutricao',
        label: 'Nutrição & Rotulagem',
        icon: I.Apple,
        route: '/nutricao',
        permission: ['Nutricionista', 'Profissional', 'Gestor', 'Administrador'],
        children: [
          { id: 'nutri-planos', label: 'Planos alimentares', route: '/nutricao/planos', badge: '10/10 Ativo' },
          { id: 'nutri-alimentos', label: 'Banco de alimentos (TACO)', route: '/nutricao/alimentos', badge: 'TACO' },
          { id: 'nutri-suplementos', label: 'Receituário de Suplementos', route: '/nutricao/suplementos', badge: 'Ativo' },
          { id: 'nutri-tabela-anvisa', label: 'Tabela ANVISA (RDC 429)', route: '/nutricao/tabela-anvisa', badge: 'Oficial' },
        ]
      },
      {
        id: 'exames-laboratoriais',
        label: 'Requisição de Exames',
        icon: I.ClipboardList,
        route: '/clinico/exames',
        permission: ['Nutricionista', 'Profissional', 'Gestor', 'Administrador'],
        badge: 'Ativo'
      }
    ]
  },
  {
    id: 'gestao',
    label: 'Gestão',
    items: [
      {
        id: 'estoque',
        label: 'Produtos / Estoque',
        icon: I.ShoppingCart,
        route: '/estoque',
        badge: '10/10 Ativo',
        permission: ['Nutricionista', 'Profissional', 'Gestor', 'Administrador']
      },
      {
        id: 'financeiro',
        label: 'Financeiro',
        icon: I.DollarSign,
        route: '/financeiro',
        badge: '10/10 Ativo',
        permission: ['Nutricionista', 'Profissional', 'Financeiro', 'Gestor', 'Administrador'],
        children: [
          { id: 'fin-visao', label: 'Visão financeira', route: '/financeiro/visao' },
          { id: 'fin-receitas', label: 'Receitas', route: '/financeiro/receitas' },
          { id: 'fin-despesas', label: 'Despesas', route: '/financeiro/despesas' },
          { id: 'fin-dre', label: 'DRE Gerencial Clínico', route: '/financeiro/dre' },
          { id: 'fin-contas', label: 'Contas bancárias', route: '/financeiro/contas' },
          { id: 'fin-comissoes', label: 'Comissões & Repasses', route: '/financeiro/comissoes' },
          { id: 'fin-cobranca', label: 'Cobrança Pix & Régua', route: '/financeiro/cobranca' },
          { id: 'fin-assinaturas', label: 'Assinaturas (MRR)', route: '/financeiro/assinaturas' },
          { id: 'fin-recibos', label: 'Recibos DMED / IRPF', route: '/financeiro/recibos' },
        ]
      },
      {
        id: 'relatorios',
        label: 'Relatórios Clínicos & DRE',
        icon: I.BarChart2,
        route: '/relatorios',
        badge: '10/10 Ativo',
        permission: ['Nutricionista', 'Profissional', 'Gestor', 'Administrador'],
        children: [
          { id: 'rel-desfechos', label: 'Eficácia & Desfechos', route: '/relatorios' },
          { id: 'rel-antropo', label: 'Evolução Antropométrica', route: '/relatorios' },
          { id: 'rel-adesao', label: 'Adesão ao App & Diário', route: '/relatorios' },
          { id: 'rel-dre', label: 'Financeiro DRE & LTV', route: '/relatorios' },
          { id: 'rel-epidemio', label: 'Epidemiologia & Patologias', route: '/relatorios' },
          { id: 'rel-export', label: 'Exportação & Auditoria LGPD', route: '/relatorios' },
        ]
      }
    ]
  },
  {
    id: 'admin',
    label: 'Administração',
    items: [
      {
        id: 'crm',
        label: 'CRM & Marketing Clínico',
        icon: I.Megaphone,
        route: '/crm',
        badge: '10/10 Ativo',
        permission: ['Profissional', 'Nutricionista', 'Gestor', 'Vendedor', 'Administrador'],
        children: [
          { id: 'crm-pipeline', label: 'Funil de Pacientes', route: '/crm/pipeline' },
          { id: 'crm-automacoes', label: 'Automações WhatsApp (10)', route: '/crm/automacoes', badge: 'Ativo' },
          { id: 'crm-recuperacao', label: 'Recuperação de Inativos', route: '/crm/recuperacao' },
          { id: 'crm-campanhas', label: 'Campanhas & Retenção', route: '/crm/campanhas' },
          { id: 'crm-nps', label: 'Pesquisas NPS (94)', route: '/crm/nps' },
        ]
      },
      {
        id: 'profissionais',
        label: 'Profissionais & Ativação',
        icon: I.UserCircle,
        route: '/profissionais',
        permission: ['Profissional', 'Nutricionista', 'Gestor', 'Administrador'],
        badge: 'Ativo'
      },
      {
        id: 'unidades',
        label: 'Unidades / Clínicas',
        icon: I.Building,
        route: '/unidades',
        permission: ['Administrador', 'Gestor', 'Profissional', 'Nutricionista'],
        badge: '10/10 Ativo'
      },
      {
        id: 'configuracoes',
        label: 'Configurações',
        icon: I.Settings,
        route: '/configuracoes',
        children: [
          { id: 'cfg-conta', label: 'Minha conta', route: '/configuracoes/conta' },
          { id: 'cfg-empresa', label: 'Empresa', route: '/configuracoes/empresa', permission: ['Administrador'] },
          { id: 'cfg-usuarios', label: 'Usuários', route: '/configuracoes/usuarios', permission: ['Administrador'] },
        ]
      }
    ]
  }
];
