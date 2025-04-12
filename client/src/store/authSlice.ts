import {
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';

const TOKEN = 'todoless-token';

interface AuthState {
    initialized: boolean;
    isAuthenticated: boolean;
    token: string | null;
}

const initialState: AuthState = {
    initialized: false,
    isAuthenticated: false,
    token: null,
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
        logout: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            localStorage.removeItem(TOKEN);
        },
    },
});

export const {
    init, login, logout, 
} = authSlice.actions;
export default authSlice.reducer;