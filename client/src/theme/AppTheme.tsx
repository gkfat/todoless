import {
    cloneElement,
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

interface AppThemeProps {
    children: ReactNode;
  }
  
export const AppTheme = (props: AppThemeProps) => {
    const [mode, setMode] = useState<'light' | 'dark' | 'system'>(() => {
        const savedMode = localStorage.getItem('themeMode');
        return (savedMode as 'light' | 'dark' | 'system') || 'light';
    });

    const { children } = props;
    
    const theme = useMemo(() => {
        return createTheme({
            palette: {
                mode,
                ...(mode === 'system' ? {} : colorSchemes[mode]),
            },
            cssVariables: {
                colorSchemeSelector: 'data-mui-color-scheme',
                cssVarPrefix: 'template',
            },
            colorSchemes,
            typography,
            shadows,
            shape,
            components: { ...inputsCustomizations },
        });
    }, [mode]);

    const handleModeChange = (newMode: 'light' | 'dark' | 'system') => {
        setMode(newMode);
        localStorage.setItem('themeMode', newMode);
    };
   
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            {cloneElement(children as React.ReactElement, { setMode: handleModeChange })}
        </ThemeProvider>
    );
};
  