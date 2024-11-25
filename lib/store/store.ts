'use client';

import { configureStore } from '@reduxjs/toolkit';
import rolesReducer from '@/lib/store/roleManagement/rolesSlice';
import authReducer from './features/auth/authSlice';
import usersReducer from './userManagement/userSlice';

import objectManagementReducer from './objectManagement/objectSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      roles: rolesReducer,
      users: usersReducer,
      objectManagement: objectManagementReducer
    }
  });
};

export const store = makeStore();

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
