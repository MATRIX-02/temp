import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string; name: string, image: string } | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null
};

const ALLOWED_USERS = [
  { email: 'mayank@easeworkai.com', name: 'Mayank', image: 'https://media.licdn.com/dms/image/v2/D4E03AQHKw1rZYemfEQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1710833108326?e=1735776000&v=beta&t=hhj0hl-jN8K_TBsVfPD0iiPK7T0grNnycrF5l3wfu4w' },
  { email: 'ratha@easeworkai.com', name: 'Ratharamanan N', image: 'https://media.licdn.com/dms/image/v2/C4E03AQHws1UIXlTmJQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1549997841676?e=1735776000&v=beta&t=Z5ZHRUXup60gMUp4yDhjqagB6hPrpNzAa9m4Hya6CGk' },
  { email: 'aryan@easeworkai.com', name: 'Aryan', image: '' },
  { email: 'siddhant@easeworkai.com', name: 'Siddhant Mahato', image: 'https://media.licdn.com/dms/image/v2/D4D03AQGUDg08P1ORkA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1728728556771?e=1735776000&v=beta&t=bsZmF-GCaA0_lE-QjJK1iJX4YtsqfWgx5xF0P8S8ndA' },
  { email: 'rajdeep@easeworkai.com', name: 'Rajdeep Chowdhury', image: 'https://media.licdn.com/dms/image/v2/D4D35AQFAmeDUOAEuRQ/profile-framedphoto-shrink_200_200/profile-framedphoto-shrink_200_200/0/1680422484157?e=1730818800&v=beta&t=zlhCus7vw6PldyAP8kNUCPPWjtUhQwmNee2KRll5lGQ' }
];

export const loginUser = createAsyncThunk(
  'auth/login',
  async (email: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = ALLOWED_USERS.find(user => user.email === email);

      if (!user) {
        throw new Error('Invalid email address');
      }
      
      return user;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { logout } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
