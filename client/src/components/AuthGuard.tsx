import { useSelector } from 'react-redux';
import {
    Navigate,
    Outlet,
} from 'react-router-dom';

import { RootState } from '../store';

const AuthGuard = () => {
    const isAuthenticated = useSelector((state: RootState) => {
        return state.auth.isAuthenticated;
    });

    return isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" replace />;
};

export default AuthGuard;