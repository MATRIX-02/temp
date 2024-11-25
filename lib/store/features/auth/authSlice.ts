'use client';

import { createSlice } from '@reduxjs/toolkit';
import { authApi } from './authApi';
import type { RootState } from '../../store';

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string; name: string } | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.checkAuth.matchFulfilled,
      (state, { payload }) => {
        state.isAuthenticated = true;
        state.user = payload.user;
      }
    );
    builder.addMatcher(authApi.endpoints.checkAuth.matchRejected, (state) => {
      state.isAuthenticated = false;
      state.user = null;
    });
    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = null;
    });
  }
});

export const { logout } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
