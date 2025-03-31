import { StrictMode } from 'react';

import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import {
    CssBaseline,
    ThemeProvider,
} from '@mui/material';
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';

import { registerPlugins } from '../plugins/index.ts';
import { theme } from '../plugins/mui.ts';
import { router } from '../routes/index.tsx';
import { store } from '../store/index.ts';

export function boot() {
    const queryClient = new QueryClient;

    const app = (
        <StrictMode>
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider theme={theme}>
                        {/* 重置瀏覽器預設樣式 */}
                        <CssBaseline/>
                        <RouterProvider router={router} />
                    </ThemeProvider>
                </QueryClientProvider>
            </Provider>
        </StrictMode>
    );

    registerPlugins();

    return app;
}
