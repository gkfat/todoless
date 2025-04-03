import { createBrowserRouter } from 'react-router-dom';

import AuthGuard from '../components/AuthGuard';
import { Layout } from '../layout/Layout';
import { SignInPage } from '../pages/auth/sign-in/SignInPage';
import SignUpPage from '../pages/auth/sign-up/SignUpPage';
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
    },
    {
        path: 'sign-in',
        element: <SignInPage />,
    },
    {
        path: 'sign-up',
        element: <SignUpPage />,
    },
]);
