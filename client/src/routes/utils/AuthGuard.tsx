import { useSelector } from 'react-redux';
import {
    Navigate,
    Outlet,
} from 'react-router-dom';

import { RootState } from '../../store';

export const AuthGuard = () => {
    const {
        isAuthenticated, initialized, 
    } = useSelector((state: RootState) => {
        return state.auth;
    });

    if (!initialized) {
        return null;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" replace />;
};
