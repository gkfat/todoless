import {
    ReactNode,
    useMemo,
    useState,
} from 'react';

import { ThemeProvider } from '@emotion/react';
import {
    createTheme,
    CssBaseline,
} from '@mui/material';

import { inputsCustomizations } from './components/inputs';
import {
    colorSchemes,
    shadows,
    shape,
    typography,
} from './themeConfig';
import { ThemeModeContext } from './ThemeModeContext';

type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_THEME = 'todoless-theme';
  
export const AppTheme = ({ children }: { children: ReactNode}) => {
    const [mode, setMode] = useState<ThemeMode>(() => {
        return (localStorage.getItem(STORAGE_THEME as ThemeMode) || 'light');
    });

    const resolvedMode = useMemo(() => {
        if (mode === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return mode;
    }, [mode]);
    
    const theme = useMemo(() => {
        return createTheme({
            palette: {
                mode: resolvedMode,
                ...colorSchemes[resolvedMode],
            },
            colorSchemes,
            typography,
            shadows,
            shape,
            components: { ...inputsCustomizations },
        });
    }, [resolvedMode]);

    return (
        <ThemeModeContext.Provider
            value={{
                mode,
                setMode, 
            }}
        >
            <ThemeProvider theme={theme}>
                <CssBaseline enableColorScheme />
                {children}
            </ThemeProvider>
        </ThemeModeContext.Provider>
    );
};
  