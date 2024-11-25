import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { AuthState, User } from '@/types/auth';
import { RootState } from '../../store';

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  user: null
};

const BASE_URL = process.env.NEXT_PUBLIC_AUTH;

interface AuthResponse {
  message: string;
  user: User;
}

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<AuthResponse>(
        `${BASE_URL}/auth/authenticate`,
        {
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue('Authentication failed');
    }
  }
);

export const initiateMicrosoftLogin = createAsyncThunk(
  'auth/microsoftLogin',
  async (_, { rejectWithValue }) => {
    try {
      window.location.href = `${BASE_URL}/auth/microsoft/login`;
      return true;
    } catch (error) {
      return rejectWithValue('Failed to initiate Microsoft login');
    }
  }
);

export const initiateGoogleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (_, { rejectWithValue }) => {
    try {
      window.location.href = `${BASE_URL}/auth/google/login`;
      return true;
    } catch (error) {
      return rejectWithValue('Failed to initiate Google login');
    }
  }
);

export const initiateLogout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/auth/logout`, {
        withCredentials: true
      });
      if (response.status === 200) {
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
        state.user = action.payload.user;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        state.user = null;
      })
      .addCase(initiateMicrosoftLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiateMicrosoftLogin.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(initiateMicrosoftLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(initiateGoogleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiateGoogleLogin.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(initiateGoogleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(initiateLogout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiateLogout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = null;
        state.user = null;
      })
      .addCase(initiateLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
