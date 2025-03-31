import { createBrowserRouter } from 'react-router-dom';

import { Layout } from '../layout/Layout';
import { homeRoutes } from './home';
import { notfoundRoutes } from './notfound';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [...homeRoutes, ...notfoundRoutes],
    },
]);
