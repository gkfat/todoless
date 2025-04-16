import { StrictMode } from 'react';

import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';

import { registerPlugins } from '../plugins/index.ts';
import { AppTheme } from '../plugins/theme/AppTheme.tsx';
import { routes } from '../routes/index.tsx';
import { init as initAuthStore } from '../store/authSlice.ts';
import { store } from '../store/index.ts';

export function boot() {
    const queryClient = new QueryClient;

    store.dispatch(initAuthStore());

    const app = (
        <StrictMode>
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <AppTheme>
                        <RouterProvider router={routes} />
                    </AppTheme>
                </QueryClientProvider>
            </Provider>
        </StrictMode>
    );

    registerPlugins();

    return app;
}
