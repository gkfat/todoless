import { StrictMode } from 'react';

import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';

import { registerPlugins } from '../plugins/index.ts';
import { router } from '../routes/index.tsx';
import { store } from '../store/index.ts';
import { AppTheme } from '../theme/AppTheme.tsx';

export function boot() {
    const queryClient = new QueryClient;

    const app = (
        <StrictMode>
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <AppTheme>
                        <RouterProvider router={router} />
                    </AppTheme>
                </QueryClientProvider>
            </Provider>
        </StrictMode>
    );

    registerPlugins();

    return app;
}
