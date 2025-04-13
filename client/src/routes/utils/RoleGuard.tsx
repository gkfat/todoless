import { useSelector } from 'react-redux';
import {
    Navigate,
    Outlet,
} from 'react-router-dom';

import { RoleEnum } from '../../enums/role';
import { RootState } from '../../store';
import { AppRoute } from '../../types/route';

interface RoleGuardProps {
    children?: AppRoute[];
    allowRoles: RoleEnum[];
}

export const RoleGuard = (props: RoleGuardProps) => {
    const { allowRoles } = props;
    const account = useSelector((state: RootState) => {
        return state.auth.account;
    });

    if (!account) {
        return <Navigate to="/dashboard" replace />;
    }

    const valid = account.roles.map((v) => v.role).some((role) => allowRoles.includes(role));

    if (!valid) {
        return <Navigate to="/403" replace />;
    }

    return <Outlet />;
};
