import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { AuthState } from '@/types/auth';
import { RootState } from '../../store';
import { cookies } from 'next/headers';

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  user: null
};

const BASE_URL = process.env.NEXT_PUBLIC_AUTH;

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/auth/authenticate`, {
        withCredentials: true
      });
      if (response.status === 200) {
        return response.data;
      }
      throw new Error('Authentication check failed');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return rejectWithValue('Session expired');
      }
      return rejectWithValue('Authentication check failed');
    }
  }
);

export const initiateLogin = createAsyncThunk(
  'auth/login',
  async (_, { rejectWithValue }) => {
    try {
      // Store the intended destination before redirect
      sessionStorage.setItem('returnUrl', window.location.pathname);
      window.location.href = `${BASE_URL}/auth/microsoft/login`;
      return true;
    } catch (error) {
      return rejectWithValue('Failed to initiate login');
    }
  }
);

export const initiateLogout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.get(`${BASE_URL}/auth/logout`, {
        withCredentials: true
      });
      if (response.status === 200) {
        // Clear the specific session cookie
        document.cookie =
          'session_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        // Clear the auth state
        dispatch(clearAuthState());
        return true;
      }
      throw new Error('Logout failed');
    } catch (error) {
      return rejectWithValue('Failed to logout');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuthState: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      })
      .addCase(initiateLogout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiateLogout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(initiateLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError, clearAuthState } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
