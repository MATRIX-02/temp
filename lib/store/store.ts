'use client';

import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import rolesReducer from '@/lib/store/roleManagement/rolesSlice';
import authReducer from './features/auth/authSlice';
import usersReducer from './userManagement/userSlice';
import userFiltersReducer from './userManagement/userManagementFilters';
import selectedUserReducer from './userManagement/selectedUser';
import sessionStorage from 'redux-persist/lib/storage/session';
import objectManagementReducer from './objectManagement/objectSlice';
import { rolesApi } from './roleManagement/rtk_query';
const persistConfig = {
  key: 'root',
  storage: sessionStorage // Use sessionStorage instead of localStorage
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: persistedReducer,
      roles: rolesReducer,
      users: usersReducer,
      objectManagement: objectManagementReducer,
      [rolesApi.reducerPath]: rolesApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(rolesApi.middleware)
  });
};

export const store = makeStore();
export const persistor = persistStore(store);

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
