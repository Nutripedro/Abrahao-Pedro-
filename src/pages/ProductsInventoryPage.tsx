import React, { useState } from 'react';
import {
  Package,
  Sparkles,
  Zap,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Search,
  Filter,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  Printer,
  Download,
  Share2,
  ShieldCheck,
  Building2,
  FileText,
  AlertCircle,
  Truck,
  RotateCcw,
  Check,
  Edit,
  Trash2,
  Tag,
  Percent,
  Calculator,
  Barcode,
  Layers,
  Archive,
  RefreshCw,
  Eye,
  Save,
  ChevronRight
} from 'lucide-react';
import {
  INVENTORY_MASTER_FEATURES,
  InventoryMasterFeature,
  MOCK_PRODUCTS,
  ProductItem,
  MOCK_STOCK_MOVEMENTS,
  StockMovement,
  MOCK_SUPPLIERS,
  Supplier,
  calculateStockIndicators,
  getInventoryFeatureStatus,
  setInventoryFeatureStatus,
  activateAllInventoryFeatures
} from '../data/productsInventoryData';
import { useAuth } from '../contexts/AuthContext';
import { useClinic } from '../contexts/ClinicContext';

export const ProductsInventoryPage: React.FC = () => {
  const { user } = useAuth();
  const { selectedClinic } = useClinic();

  // Features Master (10/10)
  const [featuresList, setFeaturesList] = useState<InventoryMasterFeature[]>(() =>
    INVENTORY_MASTER_FEATURES.map(f => ({
      ...f,
      isActive: getInventoryFeatureStatus(f.id)
    }))
  );
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<'catalogo' | 'movimentacoes' | 'pdv_venda' | 'compras_fornecedores' | 'validade_anvisa' | 'precificacao' | 'features'>('catalogo');

  // Products state
  const [products, setProducts] = useState<ProductItem[]>(MOCK_PRODUCTS);
  const [movements, setMovements] = useState<StockMovement[]>(MOCK_STOCK_MOVEMENTS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(MOCK_PRODUCTS[0]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal Novo Produto / Edição
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductItem['category']>('Suplemento');
  const [newProdBrand, setNewProdBrand] = useState('VitaNutri Pro');
  const [newProdPresentation, setNewProdPresentation] = useState('60 cápsulas');
  const [newProdStock, setNewProdStock] = useState<number>(10);
  const [newProdMinStock, setNewProdMinStock] = useState<number>(5);
  const [newProdCost, setNewProdCost] = useState<number>(45.00);
  const [newProdSelling, setNewProdSelling] = useState<number>(95.00);
  const [newProdSupplier, setNewProdSupplier] = useState('VitaNutri Distribuidora Farmacêutica Ltda');

  // Modal PDV / Venda Balcão
  const [pdvPatient, setPdvPatient] = useState('Camila Mendonça Ferreira');
  const [pdvProductSku, setPdvProductSku] = useState('SUP-CREA-300');
  const [pdvQty, setPdvQty] = useState<number>(1);
  const [pdvDiscountPercent, setPdvDiscountPercent] = useState<number>(0);

  // Modal Nova Compra / Entrada por NF-e
  const [purchaseInvoice, setPurchaseInvoice] = useState('NF-e 005.118');
  const [purchaseSupplier, setPurchaseSupplier] = useState('VitaNutri Distribuidora Farmacêutica Ltda');
  const [purchaseProductSku, setPurchaseProductSku] = useState('SUP-WHEY-ISO900');
  const [purchaseQty, setPurchaseQty] = useState<number>(10);
  const [purchaseUnitCost, setPurchaseUnitCost] = useState<number>(115.00);
  const [purchaseBatch, setPurchaseBatch] = useState('LOTE-WP-2026B');
  const [purchaseExpDate, setPurchaseExpDate] = useState('2028-02-15');

  // Calculadora de Markup & Preço
  const [calcCost, setCalcCost] = useState<number>(50.00);
  const [calcMarkup, setCalcMarkup] = useState<number>(2.0);
  const [calcTaxesPercent, setCalcTaxesPercent] = useState<number>(8.0);
  const [calcDesiredMargin, setCalcDesiredMargin] = useState<number>(50.0);

  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleToggleFeature = (featId: string) => {
    setFeaturesList(prev =>
      prev.map(f => {
        if (f.id === featId) {
          const newState = !f.isActive;
          setInventoryFeatureStatus(featId, newState);
          return { ...f, isActive: newState };
        }
        return f;
      })
    );
    notify('Status da funcionalidade de produtos/estoque atualizado!');
  };

  const handleActivateAll = () => {
    activateAllInventoryFeatures();
    setFeaturesList(prev =>
      prev.map(f => ({ ...f, isActive: true }))
    );
    notify('🎉 Todas as 10 Funções de Produtos / Estoque foram ativadas com sucesso!');
  };

  // Filtragem de Produtos
  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  const indicators = calculateStockIndicators(products);
  const allActive = featuresList.every(f => f.isActive);
  const activeCount = featuresList.filter(f => f.isActive).length;

  // Registrar Novo Produto
  const handleSaveNewProduct = () => {
    if (!newProdName.trim() || !newProdSku.trim()) {
      notify('Por favor, preencha o Nome e o SKU do produto.');
      return;
    }

    const markup = newProdCost > 0 ? Number((newProdSelling / newProdCost).toFixed(2)) : 1.0;
    const margin = newProdSelling > 0 ? Number((((newProdSelling - newProdCost) / newProdSelling) * 100).toFixed(1)) : 0;

    const newProd: ProductItem = {
      id: `prod-${Date.now().toString().slice(-4)}`,
      sku: newProdSku.toUpperCase(),
      name: newProdName,
      category: newProdCategory,
      brand: newProdBrand,
      presentation: newProdPresentation,
      unit: 'un',
      currentStock: newProdStock,
      minStock: newProdMinStock,
      maxStock: newProdStock * 3,
      costPrice: newProdCost,
      sellingPrice: newProdSelling,
      markup: markup,
      marginPercent: margin,
      supplier: newProdSupplier,
      location: 'Consultório / Almoxarifado Central',
      batches: [
        {
          batchNumber: `LOTE-${Date.now().toString().slice(-5)}`,
          quantity: newProdStock,
          manufacturingDate: new Date().toLocaleDateString('pt-BR'),
          expirationDate: '01/01/2028',
          status: 'Válido'
        }
      ],
      curveAbc: 'B',
      status: newProdStock <= newProdMinStock ? 'Estoque Baixo' : 'Normal',
      isActive: true,
      notes: 'Produto cadastrado via painel administrativo.'
    };

    setProducts(prev => [newProd, ...prev]);
    setSelectedProduct(newProd);
    setShowNewProductModal(false);
    // Limpar campos
    setNewProdName('');
    setNewProdSku('');
    notify('Produto cadastrado com sucesso e integrado ao estoque!');
  };

  // Registrar Venda PDV / Saída
  const handleExecutePdvSale = () => {
    const targetProduct = products.find(p => p.sku === pdvProductSku);
    if (!targetProduct) return;

    if (targetProduct.currentStock < pdvQty) {
      notify(`Saldo insuficiente em estoque! Saldo atual: ${targetProduct.currentStock} un.`);
      return;
    }

    const unitPrice = targetProduct.sellingPrice * (1 - pdvDiscountPercent / 100);
    const totalPrice = unitPrice * pdvQty;

    // Atualizar estoque do produto
    setProducts(prev =>
      prev.map(p => {
        if (p.sku === pdvProductSku) {
          const updatedStock = p.currentStock - pdvQty;
          return {
            ...p,
            currentStock: updatedStock,
            status: updatedStock <= 0 ? 'Crítico' : updatedStock <= p.minStock ? 'Estoque Baixo' : 'Normal'
          };
        }
        return p;
      })
    );

    // Lançar movimentação
    const newMovement: StockMovement = {
      id: `mov-${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      productId: targetProduct.id,
      productName: targetProduct.name,
      sku: targetProduct.sku,
      type: 'Saída (Venda)',
      quantity: pdvQty,
      unitPrice: unitPrice,
      totalPrice: totalPrice,
      batchNumber: targetProduct.batches[0]?.batchNumber || 'LOTE-PADRAO',
      responsibleName: user?.name || 'Dra. Mariana Costa Silva',
      patientName: pdvPatient,
      notes: `Venda balcão / consulta para ${pdvPatient}. Desconto: ${pdvDiscountPercent}%`
    };

    setMovements(prev => [newMovement, ...prev]);
    notify(`Venda de ${pdvQty}x ${targetProduct.name} realizada com sucesso! Estoque atualizado.`);
    setActiveTab('movimentacoes');
  };

  // Registrar Compra / Entrada NF-e
  const handleExecutePurchase = () => {
    const targetProduct = products.find(p => p.sku === purchaseProductSku);
    if (!targetProduct) return;

    // Calcular novo custo médio ponderado
    const previousStock = targetProduct.currentStock;
    const previousCost = targetProduct.costPrice;
    const totalPreviousValue = previousStock * previousCost;
    const totalNewValue = purchaseQty * purchaseUnitCost;
    const newTotalStock = previousStock + purchaseQty;
    const newWeightedCost = Number(((totalPreviousValue + totalNewValue) / newTotalStock).toFixed(2));

    setProducts(prev =>
      prev.map(p => {
        if (p.sku === purchaseProductSku) {
          const newBatches = [
            {
              batchNumber: purchaseBatch,
              quantity: purchaseQty,
              manufacturingDate: new Date().toLocaleDateString('pt-BR'),
              expirationDate: new Date(purchaseExpDate).toLocaleDateString('pt-BR'),
              status: 'Válido' as const
            },
            ...p.batches
          ];
          return {
            ...p,
            currentStock: newTotalStock,
            costPrice: newWeightedCost,
            markup: Number((p.sellingPrice / newWeightedCost).toFixed(2)),
            marginPercent: Number((((p.sellingPrice - newWeightedCost) / p.sellingPrice) * 100).toFixed(1)),
            batches: newBatches,
            status: newTotalStock <= p.minStock ? 'Estoque Baixo' : 'Normal'
          };
        }
        return p;
      })
    );

    const newMov: StockMovement = {
      id: `mov-${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      productId: targetProduct.id,
      productName: targetProduct.name,
      sku: targetProduct.sku,
      type: 'Entrada (Compra)',
      quantity: purchaseQty,
      unitPrice: purchaseUnitCost,
      totalPrice: purchaseQty * purchaseUnitCost,
      batchNumber: purchaseBatch,
      responsibleName: user?.name || 'Administrador da Clínica',
      invoiceNumber: purchaseInvoice,
      notes: `Entrada via ${purchaseInvoice} - Fornecedor: ${purchaseSupplier}`
    };

    setMovements(prev => [newMov, ...prev]);
    notify(`Entrada de ${purchaseQty}x ${targetProduct.name} lançada! Custo Médio recalculado.`);
    setActiveTab('catalogo');
  };

  return (
    <div id="modulo-produtos-estoque-clinico" className="space-y-6 max-w-7xl mx-auto pb-20 font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 border border-emerald-500 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* BANNER MASTER: 10 Funções de Produtos / Estoque */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-5 sm:p-6 border border-emerald-700/50 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-extrabold uppercase tracking-wider border border-emerald-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Produtos, Suplementos & Controle de Estoque
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 font-mono text-[11px] font-bold border border-sky-400/30">
                {activeCount}/10 Funções Ativas
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              Gestão de Produtos, Suplementos & Insumos Clínicos
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Catálogo com SKU, controle de saldo em tempo real, rastreabilidade de lotes e validade ANVISA, cálculo de Custo Médio Ponderado, Markup, PDV integrado à consulta e Curva ABC.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={handleActivateAll}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
            >
              <Zap className="w-4 h-4" />
              <span>{allActive ? 'Todas as 10 Funções Ativadas' : 'Ativar Todas as 10 Funções'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowFeaturesModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer shrink-0"
            >
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Ver Funções (10)</span>
            </button>
          </div>
        </div>
      </div>

      {/* CARDS DE INDICADORES DO ESTOQUE */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Total de Itens / SKUs</span>
            <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xl font-mono font-extrabold text-slate-900 dark:text-white">
            {indicators.totalItemsCount} <span className="text-xs text-slate-400 font-sans">({indicators.totalSkus} SKUs)</span>
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            Estoque operacional ativo
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Valor em Custo</span>
            <DollarSign className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="text-xl font-mono font-extrabold text-slate-900 dark:text-white">
            R$ {indicators.totalCostValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
            Venda: R$ {indicators.totalSellingValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Potencial de Lucro</span>
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
            R$ {indicators.potentialProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            Margem média de ~52%
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Alertas de Reposição</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-mono font-extrabold text-amber-600 dark:text-amber-400">
            {indicators.lowStockCount + indicators.criticalStockCount} <span className="text-xs text-slate-400 font-sans">itens</span>
          </div>
          <div className="text-[11px] font-mono text-rose-500">
            {indicators.expiringCount} lote(s) vencendo em &lt;60d
          </div>
        </div>
      </div>

      {/* Tabs Principais de Estoque */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('catalogo')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
            activeTab === 'catalogo'
              ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <Package className="w-4 h-4 text-emerald-300" />
          <span>Catálogo Geral & Saldo</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {products.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('movimentacoes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
            activeTab === 'movimentacoes'
              ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <RotateCcw className="w-4 h-4 text-sky-400" />
          <span>Movimentações & Histórico</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pdv_venda')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
            activeTab === 'pdv_venda'
              ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <ShoppingCart className="w-4 h-4 text-emerald-400" />
          <span>PDV / Venda na Consulta</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('compras_fornecedores')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
            activeTab === 'compras_fornecedores'
              ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <Truck className="w-4 h-4 text-purple-400" />
          <span>Compras & Entrada NF-e</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('validade_anvisa')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
            activeTab === 'validade_anvisa'
              ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Lotes & Validade ANVISA</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('precificacao')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
            activeTab === 'precificacao'
              ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <Calculator className="w-4 h-4 text-amber-400" />
          <span>Calculadora de Markup</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('features')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
            activeTab === 'features'
              ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Gestão das 10 Funções</span>
        </button>
      </div>

      {/* ABA 1: CATÁLOGO GERAL & SALDO */}
      {activeTab === 'catalogo' && (
        <div className="space-y-6">
          {/* Barra de Filtros & Ações Rápidas */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por SKU, nome ou marca..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-hidden font-sans"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-medium focus:outline-hidden cursor-pointer"
              >
                <option value="all">Todas as Categorias</option>
                <option value="Proteína/Aminoácido">Proteína / Aminoácido</option>
                <option value="Vitamina/Mineral">Vitamina / Mineral</option>
                <option value="Fitoterápico">Fitoterápico</option>
                <option value="Material de Avaliação">Material de Avaliação</option>
                <option value="Insumo Clínico">Insumo Clínico</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-medium focus:outline-hidden cursor-pointer"
              >
                <option value="all">Todos os Status</option>
                <option value="Normal">Normal</option>
                <option value="Estoque Baixo">Estoque Baixo</option>
                <option value="Crítico">Crítico</option>
                <option value="Vencendo">Vencendo</option>
              </select>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={() => setShowNewProductModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Cadastrar Produto</span>
              </button>
            </div>
          </div>

          {/* Tabela Densa & Estruturada de Produtos */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    <th className="p-3.5 pl-4 font-bold">Produto & SKU</th>
                    <th className="p-3.5 font-bold">Categoria & Marca</th>
                    <th className="p-3.5 font-bold text-center">Saldo / Mín</th>
                    <th className="p-3.5 font-bold text-right">Custo Médio</th>
                    <th className="p-3.5 font-bold text-right">Preço Venda</th>
                    <th className="p-3.5 font-bold text-right">Markup / Margem</th>
                    <th className="p-3.5 font-bold text-center">Status</th>
                    <th className="p-3.5 pr-4 font-bold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {filteredProducts.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="p-3.5 pl-4">
                        <div className="font-bold text-slate-900 dark:text-white text-xs">
                          {p.name}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 mt-0.5">
                          <span>SKU: {p.sku}</span>
                          <span>•</span>
                          <span>{p.presentation}</span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="text-slate-700 dark:text-slate-300">{p.category}</div>
                        <div className="text-[10px] text-slate-400">{p.brand}</div>
                      </td>

                      <td className="p-3.5 text-center font-mono">
                        <div className="font-extrabold text-slate-900 dark:text-white">
                          {p.currentStock} {p.unit}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Mín: {p.minStock} {p.unit}
                        </div>
                      </td>

                      <td className="p-3.5 text-right font-mono text-slate-600 dark:text-slate-300">
                        R$ {p.costPrice.toFixed(2)}
                      </td>

                      <td className="p-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {p.sellingPrice > 0 ? `R$ ${p.sellingPrice.toFixed(2)}` : <span className="text-slate-400 text-[10px]">Uso Interno</span>}
                      </td>

                      <td className="p-3.5 text-right font-mono">
                        {p.sellingPrice > 0 ? (
                          <>
                            <div className="font-bold text-emerald-600 dark:text-emerald-400">
                              {p.markup.toFixed(2)}x
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {p.marginPercent.toFixed(1)}% margem
                            </div>
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-400">Custo 100%</span>
                        )}
                      </td>

                      <td className="p-3.5 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          p.status === 'Normal' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' :
                          p.status === 'Estoque Baixo' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300' :
                          p.status === 'Crítico' ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300' :
                          'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                        }`}>
                          {p.status}
                        </span>
                      </td>

                      <td className="p-3.5 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setPdvProductSku(p.sku);
                              setActiveTab('pdv_venda');
                            }}
                            title="Vender / Lançar Saída"
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                          >
                            <ShoppingCart className="w-3.5 h-3.5 text-emerald-500" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPurchaseProductSku(p.sku);
                              setActiveTab('compras_fornecedores');
                            }}
                            title="Repor Estoque / Entrada"
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 text-sky-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: MOVIMENTAÇÕES & HISTÓRICO */}
      {activeTab === 'movimentacoes' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-sky-500" />
                  <span>Livro Registro de Movimentações de Estoque</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Auditoria completa de entradas, vendas na consulta, saídas de uso clínico e baixas de estoque.
                </p>
              </div>

              <button
                type="button"
                onClick={() => notify('Relatório de movimentações exportado em PDF/Planilha!')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Livro</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    <th className="p-3 pl-4 font-bold">Data/Hora</th>
                    <th className="p-3 font-bold">Tipo</th>
                    <th className="p-3 font-bold">Produto & SKU</th>
                    <th className="p-3 font-bold text-center">Qtd</th>
                    <th className="p-3 font-bold text-right">Valor Total</th>
                    <th className="p-3 font-bold">Responsável / Paciente</th>
                    <th className="p-3 pr-4 font-bold">Lote / NF-e</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {movements.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-3 pl-4 font-mono text-slate-500 text-[11px]">
                        {m.date} <br />
                        <span className="text-[10px] text-slate-400">{m.time}</span>
                      </td>

                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                          m.type.includes('Entrada')
                            ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                            : m.type.includes('Venda')
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        }`}>
                          {m.type.includes('Entrada') ? <ArrowDownRight className="w-3 h-3 text-sky-500" /> : <ArrowUpRight className="w-3 h-3 text-emerald-500" />}
                          {m.type}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white">{m.productName}</div>
                        <div className="text-[10px] font-mono text-slate-400">{m.sku}</div>
                      </td>

                      <td className="p-3 text-center font-mono font-bold text-slate-900 dark:text-white">
                        {m.quantity} un
                      </td>

                      <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        R$ {m.totalPrice.toFixed(2)}
                      </td>

                      <td className="p-3">
                        <div className="text-slate-800 dark:text-slate-200">{m.responsibleName}</div>
                        {m.patientName && (
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Paciente: {m.patientName}</div>
                        )}
                      </td>

                      <td className="p-3 pr-4 font-mono text-[10px] text-slate-500">
                        {m.batchNumber || m.invoiceNumber || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: PDV / VENDA NA CONSULTA */}
      {activeTab === 'pdv_venda' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold uppercase">
                    Ponto de Venda Clínico
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  Saída / Venda Rápida de Suplemento ou Insumo
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Formulário de Venda */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Vincular ao Paciente (Prontuário)
                  </label>
                  <select
                    value={pdvPatient}
                    onChange={(e) => setPdvPatient(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-hidden"
                  >
                    <option value="Camila Mendonça Ferreira">Camila Mendonça Ferreira</option>
                    <option value="Rodrigo Silveira da Rocha">Rodrigo Silveira da Rocha</option>
                    <option value="Juliana Paes Cavalcanti">Juliana Paes Cavalcanti</option>
                    <option value="Venda Balcão (Sem Prontuário)">Venda Balcão (Sem Prontuário)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Selecione o Suplemento / Produto
                  </label>
                  <select
                    value={pdvProductSku}
                    onChange={(e) => setPdvProductSku(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-hidden"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.sku}>
                        {p.name} ({p.sku}) — Saldo: {p.currentStock} un — R$ {p.sellingPrice.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Quantidade (Unidades)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={pdvQty}
                      onChange={(e) => setPdvQty(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Desconto do Paciente (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={pdvDiscountPercent}
                      onChange={(e) => setPdvDiscountPercent(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Resumo da Venda / Recibo */}
              {(() => {
                const prod = products.find(p => p.sku === pdvProductSku);
                const unitPrice = (prod?.sellingPrice || 0) * (1 - pdvDiscountPercent / 100);
                const total = unitPrice * pdvQty;
                return (
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block mb-2">
                        Resumo da Operação PDV
                      </span>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-slate-600 dark:text-slate-300">
                          <span>Item:</span>
                          <strong className="text-slate-900 dark:text-white">{prod?.name}</strong>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-300">
                          <span>Saldo Atual em Estoque:</span>
                          <span className="font-mono">{prod?.currentStock} {prod?.unit}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-300">
                          <span>Preço Unitário com Desconto:</span>
                          <span className="font-mono">R$ {unitPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-300">
                          <span>Lote Rastreável:</span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400">
                            {prod?.batches[0]?.batchNumber || 'LOTE-PADRAO'}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
                          <span>Total da Venda:</span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400">
                            R$ {total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleExecutePdvSale}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Check className="w-4 h-4" />
                      <span>Confirmar Saída & Dar Baixa no Estoque</span>
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ABA 4: COMPRAS & ENTRADA NF-E */}
      {activeTab === 'compras_fornecedores' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-mono text-[10px] font-bold uppercase">
                    Entrada por NF-e & Custo Médio
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  Lançamento de Compras & Reposição de Estoque
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Número da Nota Fiscal (NF-e)
                </label>
                <input
                  type="text"
                  value={purchaseInvoice}
                  onChange={(e) => setPurchaseInvoice(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Fornecedor Homologado
                </label>
                <select
                  value={purchaseSupplier}
                  onChange={(e) => setPurchaseSupplier(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-hidden"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.name}>{s.name} ({s.city})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Produto para Entrada
                </label>
                <select
                  value={purchaseProductSku}
                  onChange={(e) => setPurchaseProductSku(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-hidden"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.sku}>{p.name} ({p.sku})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Quantidade Adquirida
                </label>
                <input
                  type="number"
                  min={1}
                  value={purchaseQty}
                  onChange={(e) => setPurchaseQty(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Custo Unitário de Aquisição (R$)
                </label>
                <input
                  type="number"
                  step="0.10"
                  value={purchaseUnitCost}
                  onChange={(e) => setPurchaseUnitCost(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Número do Lote do Fabricante
                </label>
                <input
                  type="text"
                  value={purchaseBatch}
                  onChange={(e) => setPurchaseBatch(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleExecutePurchase}
                className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs transition-colors cursor-pointer flex items-center gap-2 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Confirmar Entrada & Recalcular Custo Médio Ponderado</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ABA 5: LOTES & VALIDADE ANVISA */}
      {activeTab === 'validade_anvisa' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Painel de Rastreabilidade & Validade ANVISA (RDC nº 243/2018)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Monitoramento preventivo de vencimento de lotes para consumo humano e garantia de segurança sanitária.
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold">
                Padrão PEPS / FIFO Ativo
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.flatMap(p =>
                p.batches.map(b => ({
                  ...b,
                  productName: p.name,
                  sku: p.sku,
                  brand: p.brand
                }))
              ).map((batch, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    batch.status === 'Vence em 60d' || batch.status === 'Vence em 30d'
                      ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                      : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                        {batch.batchNumber}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-1.5">{batch.productName}</h4>
                      <span className="text-[10px] text-slate-400">{batch.brand} • SKU: {batch.sku}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      batch.status === 'Válido' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                      'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}>
                      {batch.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] font-mono">
                    <div>Saldo: <strong className="text-slate-900 dark:text-white">{batch.quantity} un</strong></div>
                    <div>Vencimento: <strong className="text-slate-900 dark:text-white">{batch.expirationDate}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA 6: CALCULADORA DE MARKUP & PREÇO */}
      {activeTab === 'precificacao' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-amber-500" />
                  <span>Calculadora de Formação de Preço, Markup & Margem</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Simulador de rentabilidade para consultório considerando custo do produto, impostos e margem líquida desejada.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Custo de Compra (R$)
                  </label>
                  <input
                    type="number"
                    step="1.00"
                    value={calcCost}
                    onChange={(e) => setCalcCost(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Multiplicador Markup (ex.: 2.0x = 100% sobre o custo)
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    value={calcMarkup}
                    onChange={(e) => setCalcMarkup(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Impostos / Taxa de Cartão (%)
                  </label>
                  <input
                    type="number"
                    value={calcTaxesPercent}
                    onChange={(e) => setCalcTaxesPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              {(() => {
                const suggestedSelling = calcCost * calcMarkup;
                const taxesValue = suggestedSelling * (calcTaxesPercent / 100);
                const grossProfit = suggestedSelling - calcCost - taxesValue;
                const netMarginPercent = suggestedSelling > 0 ? (grossProfit / suggestedSelling) * 100 : 0;

                return (
                  <div className="md:col-span-2 p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 space-y-4">
                    <h3 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase font-mono">
                      Resultado da Precificação
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60">
                        <span className="text-[10px] text-slate-500 block">Preço de Venda Sugerido</span>
                        <span className="text-lg font-mono font-extrabold text-slate-900 dark:text-white">
                          R$ {suggestedSelling.toFixed(2)}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60">
                        <span className="text-[10px] text-slate-500 block">Impostos & Taxas</span>
                        <span className="text-lg font-mono font-extrabold text-amber-600">
                          R$ {taxesValue.toFixed(2)}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60">
                        <span className="text-[10px] text-slate-500 block">Lucro Bruto por Unidade</span>
                        <span className="text-lg font-mono font-extrabold text-emerald-600">
                          R$ {grossProfit.toFixed(2)}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60">
                        <span className="text-[10px] text-slate-500 block">Margem Líquida</span>
                        <span className="text-lg font-mono font-extrabold text-emerald-600">
                          {netMarginPercent.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ABA 7: GESTÃO DAS 10 FUNÇÕES & ATIVIDADES */}
      {activeTab === 'features' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold uppercase">
                    Status: {activeCount}/10 Ativadas
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  Matriz das 10 Funções de Produtos, Suplementos & Estoque Clínico
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Ative ou desative cada funcionalidade individualmente ou ative todas de uma só vez para liberar o ecossistema completo de gestão.
                </p>
              </div>

              <button
                type="button"
                onClick={handleActivateAll}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer shrink-0 shadow-sm"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Ativar Todas as 10</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuresList.map((f) => (
                <div
                  key={f.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    f.isActive
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 shadow-2xs'
                      : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700 opacity-70'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                          {f.number}
                        </span>
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {f.category}
                        </span>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={f.isActive}
                          onChange={() => handleToggleFeature(f.id)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600" />
                      </label>
                    </div>

                    <h3 className="font-bold text-xs text-slate-900 dark:text-white leading-snug">
                      {f.title}
                    </h3>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {f.description}
                    </p>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>{f.clinicalImpact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CADASTRO DE NOVO PRODUTO */}
      {showNewProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-500" />
                <span>Cadastrar Novo Produto / Suplemento</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowNewProductModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nome do Produto</label>
                <input
                  type="text"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="Ex.: Ômega 3 TG 1000mg Alta Pureza"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Código SKU</label>
                  <input
                    type="text"
                    value={newProdSku}
                    onChange={(e) => setNewProdSku(e.target.value)}
                    placeholder="Ex.: SUP-OMG3-120"
                    className="w-full px-3 py-2 font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden uppercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Categoria</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-hidden"
                  >
                    <option value="Suplemento">Suplemento</option>
                    <option value="Proteína/Aminoácido">Proteína / Aminoácido</option>
                    <option value="Vitamina/Mineral">Vitamina / Mineral</option>
                    <option value="Fitoterápico">Fitoterápico</option>
                    <option value="Material de Avaliação">Material de Avaliação</option>
                    <option value="Insumo Clínico">Insumo Clínico</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Marca / Laboratório</label>
                  <input
                    type="text"
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Apresentação</label>
                  <input
                    type="text"
                    value={newProdPresentation}
                    onChange={(e) => setNewProdPresentation(e.target.value)}
                    placeholder="Ex.: 60 cápsulas softgel"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Saldo Inicial</label>
                  <input
                    type="number"
                    min={0}
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full px-3 py-2 font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Estoque Mínimo</label>
                  <input
                    type="number"
                    min={1}
                    value={newProdMinStock}
                    onChange={(e) => setNewProdMinStock(Number(e.target.value))}
                    className="w-full px-3 py-2 font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Preço de Custo (R$)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={newProdCost}
                    onChange={(e) => setNewProdCost(Number(e.target.value))}
                    className="w-full px-3 py-2 font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Preço de Venda (R$)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={newProdSelling}
                    onChange={(e) => setNewProdSelling(Number(e.target.value))}
                    className="w-full px-3 py-2 font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowNewProductModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveNewProduct}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Salvar Produto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL MASTER: DETALHES DAS 10 FUNÇÕES */}
      {showFeaturesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-3xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  Conformidade Sanitária & Domínio Clínico
                </span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Todas as 10 Funções e Atividades de Produtos / Estoque
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFeaturesModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {featuresList.map((f) => (
                <div key={f.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {f.number}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{f.title}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                        {f.isActive ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">{f.description}</p>
                    <p className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-medium">
                      Impacto Clínico: {f.clinicalImpact}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleActivateAll}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
              >
                Ativar Todas as 10 Funções
              </button>
              <button
                type="button"
                onClick={() => setShowFeaturesModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
