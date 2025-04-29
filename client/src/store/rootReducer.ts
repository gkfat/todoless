import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import notificationReducer from './notificationSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    notification: notificationReducer, 
});

export default rootReducer;