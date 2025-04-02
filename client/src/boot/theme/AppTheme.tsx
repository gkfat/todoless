import React from 'react';

import { Fragment } from 'react/jsx-runtime';

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
    children: React.ReactNode;
    /**
     * This is for the docs site. You can ignore it or remove it.
     */
    disableCustomTheme?: boolean;
    themeComponents?: ThemeOptions['components'];
  }
  
export default function AppTheme(props: AppThemeProps) {
    const {
        children, disableCustomTheme, themeComponents, 
    } = props;
    const theme = React.useMemo(() => {
        return disableCustomTheme
            ? {}
            : createTheme({
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
    }, [disableCustomTheme, themeComponents]);
    if (disableCustomTheme) {
        return <Fragment>{children}</Fragment>;
    }
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    );
}
  