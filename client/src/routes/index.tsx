import { createBrowserRouter } from 'react-router-dom';

import { Layout } from '../layout/Layout';
import { SignInPage } from '../pages/auth/sign-in/SignInPage';
import { SignUpPage } from '../pages/auth/sign-up/SignUpPage';
import { VerifyEmailPage } from '../pages/auth/verify-email/VerifyEmailPage';
import { NotFoundPage } from '../pages/error/NotfoundPage';
import { UnauthorizedPage } from '../pages/error/UnauthorizedPage';
import { AppRoute } from '../types/route';
import { protectedRoutes } from './routesConfig';
import { AuthGuard } from './utils/AuthGuard';
import { RoleGuard } from './utils/RoleGuard';

const wrapWithGuards = (route: AppRoute): AppRoute => {
    const {
        path, element, roles, children, 
    } = route;

    const guardedElement = roles ? (
        <RoleGuard allowRoles={roles}>{element}</RoleGuard>
    ) : element;

    return {
        path,
        element: guardedElement,
        children: children?.map(wrapWithGuards),
    };
};

export const routes = createBrowserRouter([
    {
        path: '/',
        element: <AuthGuard />,
        children: [
            {
                element: <Layout />,
                children: [
                    ...protectedRoutes.map(wrapWithGuards),
                    {
                        path: '403',
                        element: <UnauthorizedPage />,
                    },
                    {
                        path: '*',
                        element: <NotFoundPage />,
                    },
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
        path: 'verify-email',
        element: <VerifyEmailPage />,
    },
    {
        path: '**',
        element: <SignInPage />,
    },
]);
