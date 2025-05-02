import {
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';

import { Account } from '../types/account';
import { RootState } from './';

const TOKEN = 'todoless-token';

interface AuthState {
    initialized: boolean;
    isAuthenticated: boolean;
    token: string | null;
    account: Account | null;
}

const initialState: AuthState = {
    initialized: false,
    isAuthenticated: false,
    token: null,
    account: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        init: (state) => {
            const token = localStorage.getItem(TOKEN);
            state.token = token;
            state.isAuthenticated = !!token;
            state.initialized = true;
        },
        login: (state, action: PayloadAction<string>) => {
            state.isAuthenticated = true;
            state.token = action.payload;
            localStorage.setItem(TOKEN, action.payload);
        },
        setAccount: (state, action: PayloadAction<Account>) => {
            state.account = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.account = null;
            localStorage.removeItem(TOKEN);
        },
    },
});

export const havePermissions = (state: RootState, requiredPermissions: string[], strategy: 'allOf' | 'oneOf' = 'allOf') => {
    const permissions = state.auth.account?.permissions ?? [];
    
    if (strategy === 'allOf') {
        return requiredPermissions.every((p) => permissions.includes(p));
    }

    return requiredPermissions.some((p) => permissions.includes(p));
};

export const {
    init, login, setAccount, logout, 
} = authSlice.actions;
export default authSlice.reducer;