// Fonte Única e Centralizada para Gestão de Produtos, Suplementos e Estoque Clínico
// Rigorosamente alinhado às 3 personas:
// - Frontend: Diretor de Design Clínico (foco visual sóbrio, densidade informacional, alinhamento numérico e facilidade em consulta)
// - Backend: Arquiteto de Domínio Clínico (fórmulas de Custo Médio, Margem/Markup, Curva ABC, Ponto de Pedido, PEPS/FIFO e RDC ANVISA)
// - Segurança: Guardião de Dados de Saúde (Rastreabilidade de lotes, datas de validade para consumo humano, auditoria de movimentações)

export interface InventoryMasterFeature {
  id: string;
  number: number;
  title: string;
  category: string;
  description: string;
  clinicalImpact: string;
  isActive: boolean;
}

export const INVENTORY_MASTER_FEATURES: InventoryMasterFeature[] = [
  {
    id: 'estoque-feat-1',
    number: 1,
    title: 'Catálogo Geral de Produtos, Suplementos & Insumos Clínicos',
    category: 'Catálogo & SKU',
    description: 'Cadastro detalhado com SKU, código de barras EAN, marca, categoria, apresentação (cápsulas, pó, sachês, gotas) e dosagens.',
    clinicalImpact: 'Padronização dos suplementos prescritos e disponíveis para pronta-entrega na clínica.',
    isActive: true
  },
  {
    id: 'estoque-feat-2',
    number: 2,
    title: 'Controle de Saldo em Tempo Real & Alerta de Estoque Mínimo (Ponto de Reposição)',
    category: 'Saldo & Reposição',
    description: 'Monitoramento contínuo de unidades disponíveis com alerta visual automático quando o saldo atinge o ponto de pedido de segurança.',
    clinicalImpact: 'Garante que o paciente nunca saia da consulta sem o suplemento ou insumo essencial.',
    isActive: true
  },
  {
    id: 'estoque-feat-3',
    number: 3,
    title: 'Rastreabilidade de Lotes & Controle de Validade ANVISA (PEPS / FIFO)',
    category: 'Conformidade Sanitária',
    description: 'Gestão de lote, fabricação e data de vencimento com alertas preventivos de 30, 60 e 90 dias para rotatividade prioritária.',
    clinicalImpact: 'Total conformidade com normas da ANVISA (RDC nº 243/2018) e garantia de segurança ao paciente.',
    isActive: true
  },
  {
    id: 'estoque-feat-4',
    number: 4,
    title: 'Gestão de Compras, Fornecedores & Entrada por Nota Fiscal (Custo Médio)',
    category: 'Suprimentos & Custos',
    description: 'Registro de compras, fornecedores homologados, valor unitário de aquisição, frete, impostos e cálculo do Custo Médio Ponderado.',
    clinicalImpact: 'Transparência financeira e controle rigoroso do custo de cada item adquirido.',
    isActive: true
  },
  {
    id: 'estoque-feat-5',
    number: 5,
    title: 'Calculadora de Formação de Preço, Markup Multiplicador & Margem Bruta',
    category: 'Precificação & Rentabilidade',
    description: 'Cálculo automatizado de margem de lucro líquida, markup sobre o custo de compra e sugestão de preço competitivo de revenda.',
    clinicalImpact: 'Maximização da rentabilidade da clínica com preços justos e sustentáveis.',
    isActive: true
  },
  {
    id: 'estoque-feat-6',
    number: 6,
    title: 'Ponto de Venda (PDV) / Saída Integrada ao Atendimento & Prontuário',
    category: 'Vendas & Baixa Automática',
    description: 'Registro de vendas diretas no balcão ou vinculadas à consulta do paciente, gerando baixa imediata no estoque e recibo.',
    clinicalImpact: 'Redução de 100% de erros manuais na conferência de saídas e vínculo direto com o histórico do paciente.',
    isActive: true
  },
  {
    id: 'estoque-feat-7',
    number: 7,
    title: 'Inventário Periódico, Auditoria Física & Ajuste de Perdas/Avarias',
    category: 'Auditoria & Governança',
    description: 'Ferramenta de contagem física periódica com registro auditado de divergências, avarias, consumo interno ou amostras grátis.',
    clinicalImpact: 'Confiabilidade contábil e prevenção de desvios e perdas por vencimento.',
    isActive: true
  },
  {
    id: 'estoque-feat-8',
    number: 8,
    title: 'Gestão de Insumos Clínicos de Avaliação & Consultório',
    category: 'Materiais Clínicos',
    description: 'Controle de fitas métricas descartáveis, eletrodos para bioimpedância, papel lençol, luvas e tubos de coleta laboratorial.',
    clinicalImpact: 'Organização impecável dos insumos usados durante a avaliação antropométrica e exames.',
    isActive: true
  },
  {
    id: 'estoque-feat-9',
    number: 9,
    title: 'Relatórios de Giro de Estoque, Curva ABC & Rentabilidade por Categoria',
    category: 'Inteligência de Estoque',
    description: 'Classificação de itens por volume e faturamento (Curva ABC), tempo médio de estocagem e identificação de itens parados.',
    clinicalImpact: 'Decisões de recompra baseadas em dados concretos, liberando capital de giro preso.',
    isActive: true
  },
  {
    id: 'estoque-feat-10',
    number: 10,
    title: 'Sincronização com Financeiro, Fluxo de Caixa & DRE da Clínica',
    category: 'Integração Financeira',
    description: 'Lançamento automático de compras no Contas a Pagar e de receitas de revenda no Contas a Receber e Demonstrativo de Resultados.',
    clinicalImpact: 'Visão holística da saúde financeira da clínica sem lançamentos manuais duplicados.',
    isActive: true
  }
];

export interface ProductItem {
  id: string;
  sku: string;
  barcode?: string;
  name: string;
  category: 'Suplemento' | 'Fitoterápico' | 'Vitamina/Mineral' | 'Proteína/Aminoácido' | 'Insumo Clínico' | 'Material de Avaliação';
  brand: string;
  presentation: string; // Ex: 60 cápsulas, Pote 900g, 30 sachês, Rolo 50m
  unit: 'un' | 'cx' | 'fr' | 'pct' | 'kg' | 'rolo';
  currentStock: number;
  minStock: number;
  maxStock: number;
  costPrice: number; // Preço de Custo (R$)
  sellingPrice: number; // Preço de Venda (R$)
  markup: number; // Multiplicador
  marginPercent: number; // Margem de Lucro Bruta %
  supplier: string;
  location: string; // Ex: Armário A - Prateleira 2
  batches: ProductBatch[];
  curveAbc: 'A' | 'B' | 'C';
  status: 'Normal' | 'Estoque Baixo' | 'Crítico' | 'Vencendo';
  isActive: boolean;
  notes?: string;
}

export interface ProductBatch {
  batchNumber: string;
  quantity: number;
  manufacturingDate: string;
  expirationDate: string;
  status: 'Válido' | 'Vence em 30d' | 'Vence em 60d' | 'Vencido';
}

export interface StockMovement {
  id: string;
  date: string;
  time: string;
  productId: string;
  productName: string;
  sku: string;
  type: 'Entrada (Compra)' | 'Saída (Venda)' | 'Saída (Uso Clínico)' | 'Ajuste (Inventário)' | 'Perda/Avaria';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  batchNumber?: string;
  responsibleName: string;
  patientName?: string;
  invoiceNumber?: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  cnpj: string;
  contactName: string;
  phone: string;
  email: string;
  city: string;
  leadTimeDays: number;
  rating: number; // 1 to 5
}

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 'forn-1',
    name: 'VitaNutri Distribuidora Farmacêutica Ltda',
    cnpj: '18.349.821/0001-44',
    contactName: 'Carlos Eduardo Mendes',
    phone: '(11) 98877-2211',
    email: 'pedidos@vitanutri.com.br',
    city: 'São Paulo - SP',
    leadTimeDays: 3,
    rating: 5
  },
  {
    id: 'forn-2',
    name: 'PharmaLab Nutracêuticos do Brasil',
    cnpj: '24.119.502/0001-90',
    contactName: 'Renata Albuquerque',
    phone: '(19) 97722-4433',
    email: 'comercial@pharmalabnutra.com.br',
    city: 'Campinas - SP',
    leadTimeDays: 4,
    rating: 4.8
  },
  {
    id: 'forn-3',
    name: 'MedEquip Equipamentos & Insumos Médicos',
    cnpj: '09.871.233/0001-12',
    contactName: 'Fernando Guimarães',
    phone: '(21) 99112-8877',
    email: 'vendas@medequip.com.br',
    city: 'Rio de Janeiro - RJ',
    leadTimeDays: 5,
    rating: 4.9
  }
];

export const MOCK_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-101',
    sku: 'SUP-CREA-300',
    barcode: '7898561234011',
    name: 'Creatina Monohidratada 100% Creapure®',
    category: 'Proteína/Aminoácido',
    brand: 'VitaNutri Pro',
    presentation: 'Pote 300g pó puro',
    unit: 'un',
    currentStock: 18,
    minStock: 8,
    maxStock: 35,
    costPrice: 58.00,
    sellingPrice: 119.90,
    markup: 2.07,
    marginPercent: 51.6,
    supplier: 'VitaNutri Distribuidora Farmacêutica Ltda',
    location: 'Gôndola A1 - Suplementos Esportivos',
    batches: [
      { batchNumber: 'LOTE-CR-2026A', quantity: 12, manufacturingDate: '10/01/2026', expirationDate: '10/01/2028', status: 'Válido' },
      { batchNumber: 'LOTE-CR-2025D', quantity: 6, manufacturingDate: '15/08/2025', expirationDate: '15/08/2027', status: 'Válido' }
    ],
    curveAbc: 'A',
    status: 'Normal',
    isActive: true,
    notes: 'Suplemento mais vendido da clínica. Alto índice de recompra por atletas e hipertrofia.'
  },
  {
    id: 'prod-102',
    sku: 'SUP-WHEY-ISO900',
    barcode: '7898561234028',
    name: 'Whey Protein Isolado 90% (Baunilha Natural)',
    category: 'Proteína/Aminoácido',
    brand: 'PharmaLab Nutra',
    presentation: 'Pote 900g pó',
    unit: 'un',
    currentStock: 6,
    minStock: 10,
    maxStock: 30,
    costPrice: 115.00,
    sellingPrice: 229.00,
    markup: 1.99,
    marginPercent: 49.8,
    supplier: 'PharmaLab Nutracêuticos do Brasil',
    location: 'Gôndola A2 - Proteínas',
    batches: [
      { batchNumber: 'LOTE-WP-9921', quantity: 6, manufacturingDate: '05/02/2026', expirationDate: '05/02/2028', status: 'Válido' }
    ],
    curveAbc: 'A',
    status: 'Estoque Baixo',
    isActive: true,
    notes: 'Abaixo do estoque mínimo (6/10). Recomenda-se pedido de reposição de 15 unidades.'
  },
  {
    id: 'prod-103',
    sku: 'SUP-INOS-2000',
    barcode: '7898561234035',
    name: 'Mio-Inositol 2000mg + D-Chiro-Inositol 50mg',
    category: 'Vitamina/Mineral',
    brand: 'PharmaLab Nutra',
    presentation: 'Caixa com 30 sachês 4g',
    unit: 'cx',
    currentStock: 14,
    minStock: 6,
    maxStock: 25,
    costPrice: 48.50,
    sellingPrice: 98.00,
    markup: 2.02,
    marginPercent: 50.5,
    supplier: 'PharmaLab Nutracêuticos do Brasil',
    location: 'Armário B - Modulação Metabólica & SOP',
    batches: [
      { batchNumber: 'LOTE-INOS-441', quantity: 14, manufacturingDate: '20/12/2025', expirationDate: '20/12/2027', status: 'Válido' }
    ],
    curveAbc: 'A',
    status: 'Normal',
    isActive: true,
    notes: 'Prescrição padrão para pacientes com SOP e sensibilidade à insulina.'
  },
  {
    id: 'prod-104',
    sku: 'SUP-MAG-INOS',
    barcode: '7898561234042',
    name: 'Magnésio Inositol Quelato (Sabor Maracujá)',
    category: 'Vitamina/Mineral',
    brand: 'VitaNutri Pro',
    presentation: 'Pote 250g em pó',
    unit: 'un',
    currentStock: 2,
    minStock: 8,
    maxStock: 20,
    costPrice: 39.00,
    sellingPrice: 85.00,
    markup: 2.18,
    marginPercent: 54.1,
    supplier: 'VitaNutri Distribuidora Farmacêutica Ltda',
    location: 'Armário B - Sono & Ansiedade',
    batches: [
      { batchNumber: 'LOTE-MAG-108', quantity: 2, manufacturingDate: '10/06/2025', expirationDate: '10/06/2027', status: 'Válido' }
    ],
    curveAbc: 'B',
    status: 'Crítico',
    isActive: true,
    notes: 'Estoque em nível crítico (2 unidades). Produto com alta saída para ceia e sono reparador.'
  },
  {
    id: 'prod-105',
    sku: 'SUP-COQ10-100',
    barcode: '7898561234059',
    name: 'Coenzima Q10 100mg com Vitamina E',
    category: 'Vitamina/Mineral',
    brand: 'VitaNutri Pro',
    presentation: 'Frasco 60 cápsulas softgel',
    unit: 'fr',
    currentStock: 9,
    minStock: 5,
    maxStock: 20,
    costPrice: 52.00,
    sellingPrice: 110.00,
    markup: 2.12,
    marginPercent: 52.7,
    supplier: 'VitaNutri Distribuidora Farmacêutica Ltda',
    location: 'Armário C - Mitocôndrias & Longevidade',
    batches: [
      { batchNumber: 'LOTE-Q10-332', quantity: 9, manufacturingDate: '01/10/2025', expirationDate: '28/10/2026', status: 'Vence em 60d' }
    ],
    curveAbc: 'B',
    status: 'Vencendo',
    isActive: true,
    notes: 'Lote vence em aproximadamente 60 dias. Aplicar desconto ou priorizar em saídas imediatas.'
  },
  {
    id: 'prod-106',
    sku: 'INS-FITA-DESC',
    barcode: '7898561234066',
    name: 'Fita Métrica Antropométrica Descartável (1,50m)',
    category: 'Material de Avaliação',
    brand: 'MedEquip',
    presentation: 'Pacote com 100 unidades',
    unit: 'pct',
    currentStock: 4,
    minStock: 2,
    maxStock: 8,
    costPrice: 32.00,
    sellingPrice: 0.00, // Insumo interno de atendimento
    markup: 1.0,
    marginPercent: 0,
    supplier: 'MedEquip Equipamentos & Insumos Médicos',
    location: 'Consultório 1 - Gaveta Antropometria',
    batches: [
      { batchNumber: 'LOTE-FITA-882', quantity: 4, manufacturingDate: '01/01/2026', expirationDate: '01/01/2030', status: 'Válido' }
    ],
    curveAbc: 'C',
    status: 'Normal',
    isActive: true,
    notes: 'Uso clínico diário nas consultas de avaliação física.'
  },
  {
    id: 'prod-107',
    sku: 'INS-ELET-BIA',
    barcode: '7898561234073',
    name: 'Eletrodos Descartáveis para Bioimpedância Tetrapolar',
    category: 'Insumo Clínico',
    brand: 'MedEquip',
    presentation: 'Caixa com 200 pares',
    unit: 'cx',
    currentStock: 3,
    minStock: 2,
    maxStock: 6,
    costPrice: 85.00,
    sellingPrice: 0.00,
    markup: 1.0,
    marginPercent: 0,
    supplier: 'MedEquip Equipamentos & Insumos Médicos',
    location: 'Sala de Bioimpedância - Armário 2',
    batches: [
      { batchNumber: 'LOTE-ELET-771', quantity: 3, manufacturingDate: '15/11/2025', expirationDate: '15/11/2028', status: 'Válido' }
    ],
    curveAbc: 'C',
    status: 'Normal',
    isActive: true,
    notes: 'Insumo essencial para realização dos exames de composição corporal InBody.'
  }
];

export const MOCK_STOCK_MOVEMENTS: StockMovement[] = [
  {
    id: 'mov-501',
    date: '04/09/2026',
    time: '15:10',
    productId: 'prod-101',
    productName: 'Creatina Monohidratada 100% Creapure®',
    sku: 'SUP-CREA-300',
    type: 'Saída (Venda)',
    quantity: 2,
    unitPrice: 119.90,
    totalPrice: 239.80,
    batchNumber: 'LOTE-CR-2026A',
    responsibleName: 'Dra. Mariana Costa Silva',
    patientName: 'Rodrigo Silveira da Rocha',
    notes: 'Venda vinculada ao plano hipertrófico da consulta.'
  },
  {
    id: 'mov-502',
    date: '04/09/2026',
    time: '14:45',
    productId: 'prod-103',
    productName: 'Mio-Inositol 2000mg + D-Chiro-Inositol 50mg',
    sku: 'SUP-INOS-2000',
    type: 'Saída (Venda)',
    quantity: 1,
    unitPrice: 98.00,
    totalPrice: 98.00,
    batchNumber: 'LOTE-INOS-441',
    responsibleName: 'Dra. Mariana Costa Silva',
    patientName: 'Juliana Paes Cavalcanti',
    notes: 'Início imediato do protocolo de SOP.'
  },
  {
    id: 'mov-503',
    date: '03/09/2026',
    time: '10:30',
    productId: 'prod-101',
    productName: 'Creatina Monohidratada 100% Creapure®',
    sku: 'SUP-CREA-300',
    type: 'Entrada (Compra)',
    quantity: 15,
    unitPrice: 58.00,
    totalPrice: 870.00,
    batchNumber: 'LOTE-CR-2026A',
    responsibleName: 'Administrador da Clínica',
    invoiceNumber: 'NF-e 004.892',
    notes: 'Reposição quinzenal de estoque.'
  },
  {
    id: 'mov-504',
    date: '02/09/2026',
    time: '16:20',
    productId: 'INS-FITA-DESC',
    productName: 'Fita Métrica Antropométrica Descartável (1,50m)',
    sku: 'INS-FITA-DESC',
    type: 'Saída (Uso Clínico)',
    quantity: 1,
    unitPrice: 32.00,
    totalPrice: 32.00,
    batchNumber: 'LOTE-FITA-882',
    responsibleName: 'Dr. Lucas Vianna Alencar',
    notes: 'Abertura de novo pacote para o Consultório 1.'
  }
];

// Fórmulas Clínicas e Financeiras de Estoque
export const calculateStockIndicators = (products: ProductItem[]) => {
  const totalItemsCount = products.reduce((acc, p) => acc + p.currentStock, 0);
  const totalCostValue = products.reduce((acc, p) => acc + (p.currentStock * p.costPrice), 0);
  const totalSellingValue = products.reduce((acc, p) => acc + (p.currentStock * p.sellingPrice), 0);
  const potentialProfit = totalSellingValue - totalCostValue;

  const lowStockCount = products.filter(p => p.currentStock <= p.minStock && p.currentStock > 0).length;
  const criticalStockCount = products.filter(p => p.currentStock <= Math.floor(p.minStock / 2) || p.currentStock === 0).length;
  const expiringCount = products.filter(p => p.batches.some(b => b.status === 'Vence em 30d' || b.status === 'Vence em 60d')).length;

  return {
    totalSkus: products.length,
    totalItemsCount,
    totalCostValue,
    totalSellingValue,
    potentialProfit,
    lowStockCount,
    criticalStockCount,
    expiringCount
  };
};

// Funções de Persistência das 10 Features de Estoque
export const getInventoryFeatureStatus = (featureId: string): boolean => {
  const stored = localStorage.getItem(`nutri_saas_inv_feat_${featureId}`);
  if (stored !== null) return stored === 'true';
  const allMaster = localStorage.getItem('nutri_saas_all_master_features_unlocked');
  if (allMaster === 'true') return true;
  return true; // Padrão: todas ativas
};

export const setInventoryFeatureStatus = (featureId: string, active: boolean) => {
  localStorage.setItem(`nutri_saas_inv_feat_${featureId}`, String(active));
};

export const activateAllInventoryFeatures = () => {
  INVENTORY_MASTER_FEATURES.forEach(f => {
    localStorage.setItem(`nutri_saas_inv_feat_${f.id}`, 'true');
  });
};
