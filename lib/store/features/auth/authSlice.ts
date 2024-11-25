import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { AuthState } from '@/types/auth';
import { RootState } from '../../store';

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null
};

const BASE_URL = process.env.NEXT_PUBLIC_AUTH;

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}`,
  withCredentials: true,
  headers: {
    'X-Environment':
      process.env.NODE_ENV === 'development' ? 'local' : 'production'
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/auth/authenticate`, {
        withCredentials: true
      });
      return response.status === 200;
    } catch (error) {
      return rejectWithValue('Authentication failed');
    }
  }
);

// export const checkAuthStatus = createAsyncThunk(
//   'auth/checkStatus',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${BASE_URL}/auth/protected`, {
//         headers: {
//           'X-Environment': 'local'
//         },
//         withCredentials: true
//       });
//       return response.status === 200;
//     } catch (error) {
//       return rejectWithValue('Authentication failed');
//     }
//   }
// );

export const initiateLogin = createAsyncThunk(
  'auth/login',
  async (_, { rejectWithValue }) => {
    try {
      window.location.href = `${BASE_URL}/auth/microsoft/login`;
      return true;
      // const response = await axiosInstance.get('auth/microsoft/login', {
      //   // Ensure credentials are included
      //   withCredentials: true
      // });
      // return response.data;
    } catch (error) {
      return rejectWithValue('Failed to initiate login');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.error = null;
    },
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
        state.isAuthenticated = action.payload;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      .addCase(initiateLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiateLogin.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(initiateLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
