import React from 'react';

import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { RoleEnum } from '../../enums/role';
import { RootState } from '../../store';

interface RoleGuardProps {
    children?: React.ReactNode;
    allowRoles: RoleEnum[];
}

export const RoleGuard = (props: RoleGuardProps) => {
    const {
        allowRoles, children, 
    } = props;
    const account = useSelector((state: RootState) => {
        return state.auth.account;
    });

    if (!account) {
        return <Navigate
            to="/dashboard"
            replace
        />;
    }

    const valid = account.roles.map((v) => v.role).some((role) => allowRoles.includes(role));

    if (!valid) {
        return <Navigate
            to="/403"
            replace
        />;
    }

    return children;
};
