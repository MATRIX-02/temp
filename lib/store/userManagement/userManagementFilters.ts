import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define the TypeScript types for each part of the user data

export interface UserFilters {
  activeStatus: 'All' | 'Active' | 'Inactive';
}
// Initial state based on your data
const initialState: UserFilters = {
  activeStatus: 'All'
};
// Create the slice
const usersFiltersSlice = createSlice({
  name: 'usersFilters',
  initialState,
  reducers: {
    updateUserFilter: (
      state,
      action: PayloadAction<'All' | 'Active' | 'Inactive'>
    ) => {
      return {
        ...state,
        activeStatus: action.payload
      };
    }
  }
});

// Export actions and reducer
export const { updateUserFilter } = usersFiltersSlice.actions;
export const userFiltersSelector = (state: RootState) => state.usersFilters;

export default usersFiltersSlice.reducer;
