import {
    ReactNode,
    useMemo,
} from 'react';

import { ThemeProvider } from '@emotion/react';
import {
    createTheme,
    ThemeOptions,
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
    themeComponents?: ThemeOptions['components'];
  }
  
export default function AppTheme(props: AppThemeProps) {
    const {
        children, themeComponents, 
    } = props;
    
    const theme = useMemo(() => {
        return createTheme({
            cssVariables: {
                colorSchemeSelector: 'data-mui-color-scheme',
                cssVarPrefix: 'template',
            },
            colorSchemes,
            typography,
            shadows,
            shape,
            components: {
                ...inputsCustomizations,
                // ...navigationCustomizations,
                // ...surfacesCustomizations,
                ...themeComponents,
            },
        });
    }, [themeComponents]);
   
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    );
}
  