import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import loadingReducer from './slices/loadingSlice';
import notificationReducer from './slices/notificationSlice';

// Configure the store
const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    notifications: notificationReducer,
    // Add other reducers here as needed
  },
  // Optional: Add middleware or devTools configuration
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store; 