import { User } from '@/app/dashboard/UserManagement/_components/_utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { emptyUser } from '@/app/dashboard/UserManagement/_components/_constants';

// Define the TypeScript types for each part of the user data

// Initial state based on your data
const initialState: User = emptyUser;
// Create the slice
const selectedUserSlice = createSlice({
  name: 'selectedUser',
  initialState,
  reducers: {
    updateSelectedUser: (state, action: PayloadAction<User>) => {
      return action.payload;
    }
  }
});

// Export actions and reducer
export const { updateSelectedUser } = selectedUserSlice.actions;
export const selectedUserSelector = (state: RootState) => state.selectedUser;

export default selectedUserSlice.reducer;
