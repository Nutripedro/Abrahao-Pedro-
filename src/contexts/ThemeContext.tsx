import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';
export type LightPaletteId = 'green-balance' | 'fresh-mint' | 'minimalist-oat';

export interface PaletteInfo {
  id: LightPaletteId;
  optionNumber: number;
  name: string;
  subtitle: string;
  icon: string;
  focus: string;
  targetNiche: string;
  colors: {
    background: string;
    card: string;
    accent: string;
    accentHover: string;
    textPrimary: string;
    textSecondary: string;
    supportSuccess: string;
    secondaryElement?: {
      bg: string;
      text: string;
      label: string;
    };
    border: string;
    borderDescription: string;
  };
  shadowDescription: string;
  typography: string;
  borderRadius: string;
}

export const PALETTE_OPTIONS: PaletteInfo[] = [
  {
    id: 'green-balance',
    optionNumber: 1,
    name: 'Green Balance',
    subtitle: 'O Clássico Renovado',
    icon: '🌿',
    focus: 'Focado em um visual natural, orgânico e clínico de alto padrão.',
    targetNiche: 'Escolha ideal para o nicho geral de nutricionistas.',
    colors: {
      background: '#F8FAF6',
      card: '#FFFFFF',
      accent: '#2A6B46',
      accentHover: '#205436',
      textPrimary: '#1C2B21',
      textSecondary: '#4A6052',
      supportSuccess: '#4E9F3D',
      secondaryElement: {
        bg: '#EAF3ED',
        text: '#2A6B46',
        label: 'Badge & Balanço Positivo'
      },
      border: '#EAEFEA',
      borderDescription: '#EAEFEA (Suave esverdeado)'
    },
    shadowDescription: '0 4px 6px -1px rgba(28, 43, 33, 0.05)',
    typography: 'Plus Jakarta Sans (Sem serifa limpa)',
    borderRadius: '12px a 16px em cards e botões'
  },
  {
    id: 'fresh-mint',
    optionNumber: 2,
    name: 'Fresh Mint & Salmon',
    subtitle: 'Moderno e Dinâmico',
    icon: '🍃',
    focus: 'Traz energia sem perder o rigor profissional e clínico.',
    targetNiche: 'Excelente se o seu público-alvo atua fortemente com nutrição esportiva ou estética.',
    colors: {
      background: '#F4F7F6',
      card: '#FFFFFF',
      accent: '#0E8388',
      accentHover: '#0B6D71',
      textPrimary: '#2C3E50',
      textSecondary: '#546E7A',
      supportSuccess: '#0E8388',
      secondaryElement: {
        bg: '#FFE9E4',
        text: '#E07A5F',
        label: 'Salmão/Coral para destacar alertas, calorias ou jejum'
      },
      border: '#E2E8F0',
      borderDescription: '#E2E8F0 (Cinza claro azulado)'
    },
    shadowDescription: '0 4px 6px -1px rgba(14, 131, 136, 0.05)',
    typography: 'Plus Jakarta Sans (Sem serifa limpa)',
    borderRadius: '12px a 16px em cards e botões'
  },
  {
    id: 'minimalist-oat',
    optionNumber: 3,
    name: 'Minimalist Oat',
    subtitle: 'Comportamental e Premium',
    icon: '🌾',
    focus: 'Transmite calma, acolhimento humanizado e sofisticação.',
    targetNiche: 'Perfeito para softwares focados em nutrição comportamental ou clínicas de luxo.',
    colors: {
      background: '#FAF8F5',
      card: '#FFFFFF',
      accent: '#8C7863',
      accentHover: '#73614F',
      textPrimary: '#332C26',
      textSecondary: '#6E6259',
      supportSuccess: '#5B8C5A',
      secondaryElement: {
        bg: '#E6F0FA',
        text: '#2B6CB0',
        label: 'Azul sereno para destacar dados clínicos ou água'
      },
      border: '#EAE4DC',
      borderDescription: '#EAE4DC (Aveia sutil)'
    },
    shadowDescription: '0 4px 6px -1px rgba(51, 44, 38, 0.05)',
    typography: 'Plus Jakarta Sans (Sem serifa limpa)',
    borderRadius: '12px a 16px em cards e botões'
  }
];

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  palette: LightPaletteId;
  currentPalette: PaletteInfo;
  setPalette: (palette: LightPaletteId) => void;
  isPaletteModalOpen: boolean;
  setPaletteModalOpen: (open: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'clinicsaas_theme_mode_v1';
const PALETTE_STORAGE_KEY = 'clinicsaas_light_palette_v2';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (e) {
      console.warn('Could not read theme from localStorage', e);
    }
    return 'light';
  });

  const [palette, setPaletteState] = useState<LightPaletteId>(() => {
    try {
      const savedPalette = localStorage.getItem(PALETTE_STORAGE_KEY);
      if (savedPalette === 'green-balance' || savedPalette === 'fresh-mint' || savedPalette === 'minimalist-oat') {
        return savedPalette;
      }
    } catch (e) {
      console.warn('Could not read palette from localStorage', e);
    }
    return 'green-balance';
  });

  const [isPaletteModalOpen, setPaletteModalOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }

    // Apply palette attribute
    root.setAttribute('data-palette', palette);

    try {
      localStorage.setItem(STORAGE_KEY, theme);
      localStorage.setItem(PALETTE_STORAGE_KEY, palette);
    } catch (e) {
      console.warn('Could not save theme to localStorage', e);
    }
  }, [theme, palette]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const setPalette = (newPalette: LightPaletteId) => {
    setPaletteState(newPalette);
    // If currently dark, when user chooses a light palette they might want to see it in light mode:
    if (theme === 'dark') {
      setThemeState('light');
    }
  };

  const currentPalette = PALETTE_OPTIONS.find((p) => p.id === palette) || PALETTE_OPTIONS[0];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        toggleTheme,
        setTheme,
        palette,
        currentPalette,
        setPalette,
        isPaletteModalOpen,
        setPaletteModalOpen
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
