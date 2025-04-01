import {
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';

const TOKEN = 'todoless-token';

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
}

const initialState: AuthState = {
    isAuthenticated: !!localStorage.getItem(TOKEN),
    token: localStorage.getItem(TOKEN) || null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
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
    login, logout, 
} = authSlice.actions;
export default authSlice.reducer;