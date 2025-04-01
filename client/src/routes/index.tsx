import { createBrowserRouter } from 'react-router-dom';

import AuthGuard from '../components/AuthGuard';
import { Layout } from '../layout/Layout';
import LoginPage from '../pages/login/LoginPage';
import { homeRoutes } from './home';
import { notfoundRoutes } from './notfound';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                element: <AuthGuard />,
                children: [...homeRoutes],
            }, ...notfoundRoutes,
        ],
    }, {
        path: '/login',
        element: <LoginPage />,
    },
]);
