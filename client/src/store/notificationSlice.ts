// src/store/notificationSlice.ts
import {
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';

export type NotificationType = 'success' | 'info' | 'error' | 'warning' | 'normal';

export interface NotificationState {
  open: boolean;
  message: string;
  type: NotificationType;
}

const initialState: NotificationState = {
    open: false,
    message: '',
    type: 'normal',
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        showNotification: (
            state,
            action: PayloadAction<{ message: string; type?: NotificationType }>,
        ) => {
            state.open = true;
            state.message = action.payload.message;
            state.type = action.payload.type ?? 'normal';
        },
        hideNotification: (state) => {
            state.open = false;
        },
    },
});

export const {
    showNotification, hideNotification, 
} = notificationSlice.actions;
export default notificationSlice.reducer;
