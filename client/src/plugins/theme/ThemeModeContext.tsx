import {
    createContext,
    useContext,
} from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

export const ThemeModeContext = createContext<{
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
        } | undefined>(undefined);

export const useThemeMode = () => {
    const context = useContext(ThemeModeContext);

    if (!context) {
        throw new Error('useThemeMode must be used.');
    }

    return context;
};