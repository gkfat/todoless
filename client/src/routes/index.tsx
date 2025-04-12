import { createBrowserRouter } from 'react-router-dom';

import { Layout } from '../layout/Layout';
import { SignInPage } from '../pages/auth/sign-in/SignInPage';
import { SignUpPage } from '../pages/auth/sign-up/SignUpPage';
import { dashboardRoutes } from './dashboard';
import { notfoundRoutes } from './notfound';
import { settingsRoutes } from './settings';
import { AuthGuard } from './utils/AuthGuard';

export const routes = createBrowserRouter([
    {
        path: '/',
        element: <AuthGuard />,
        children: [
            {
                element: <Layout />,
                children: [
                    ...dashboardRoutes,
                    ...settingsRoutes,
                    ...notfoundRoutes,
                ],
            },
        ],
    },
    {
        path: 'sign-in',
        element: <SignInPage />,
    },
    {
        path: 'sign-up',
        element: <SignUpPage />,
    },
    {
        path: '**',
        element: <SignInPage />,
    },
]);
