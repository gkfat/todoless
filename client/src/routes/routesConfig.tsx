import DashboardIcon from '@mui/icons-material/DashboardRounded';
import PeopleIcon from '@mui/icons-material/PeopleAltRounded';

import { RoleEnum } from '../enums/role';
import { AccountsPage } from '../pages/accounts/AccountsPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { AppRoute } from '../types/route';

export const protectedRoutes: AppRoute[] = [
    {
        path: 'dashboard',
        name: 'Dashboard',
        icon: <DashboardIcon />,
        element: <DashboardPage />,
    }, {
        path: 'accounts',
        name: 'Accounts',
        icon: <PeopleIcon />,
        element: <AccountsPage />,
        roles: [RoleEnum.SUPER],
    },
];