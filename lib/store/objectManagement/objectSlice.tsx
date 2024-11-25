import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import {
  DataFieldAction,
  Activity,
  RoleObject,
  ObjectManagementState
} from '@/app/dashboard/RoleManagement/_components/_interface';
import { objectData } from '@/app/dashboard/ObjectManagement/_components/_utils';

const initialState: ObjectManagementState = {
  objects: objectData,
  selectedObjectId: null,
  isCreatingObject: false,
  isEditingObject: false,
  isSearching: false,
  searchQuery: '',
  newObject: {
    id: '',
    object_name: '',
    activity: []
  },
  editingObject: null
};

const objectManagementSlice = createSlice({
  name: 'objectManagement',
  initialState,
  reducers: {
    setObjects: (state, action: PayloadAction<RoleObject[]>) => {
      state.objects = action.payload;
    },

    selectObject: (state, action: PayloadAction<string>) => {
      state.selectedObjectId = action.payload;
    },

    clearSelectedObject: (state) => {
      state.selectedObjectId = null;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    toggleSearch: (state) => {
      state.isSearching = !state.isSearching;
      if (!state.isSearching) {
        state.searchQuery = '';
      }
    },

    startCreatingObject: (state) => {
      state.isCreatingObject = true;
      state.newObject = {
        id: String(Date.now()), // Generate temporary ID
        object_name: '',
        activity: [
          {
            activity_name: '',
            status: true,
            data_field_actions: []
          }
        ]
      };
    },

    cancelCreatingObject: (state) => {
      state.isCreatingObject = false;
      state.newObject = {
        id: '',
        object_name: '',
        activity: []
      };
    },

    setNewObjectName: (state, action: PayloadAction<string>) => {
      state.newObject.object_name = action.payload;
    },

    addActivityToNewObject: (state) => {
      state.newObject.activity.push({
        activity_name: '',
        status: true,
        data_field_actions: []
      });
    },

    updateNewObjectActivity: (
      state,
      action: PayloadAction<{
        index: number;
        field: keyof Activity;
        value: string | boolean;
      }>
    ) => {
      const { index, field, value } = action.payload;
      if (state.newObject.activity[index]) {
        state.newObject.activity[index][field] = value as never;
      }
    },

    addDataFieldToNewActivity: (state, action: PayloadAction<number>) => {
      const activityIndex = action.payload;
      if (state.newObject.activity[activityIndex]) {
        state.newObject.activity[activityIndex].data_field_actions.push({
          label: '',
          status: true,
          description: ''
        });
      }
    },

    updateDataFieldInNewActivity: (
      state,
      action: PayloadAction<{
        activityIndex: number;
        fieldIndex: number;
        field: keyof DataFieldAction;
        value: string | boolean;
      }>
    ) => {
      const { activityIndex, fieldIndex, field, value } = action.payload;
      if (
        state.newObject.activity[activityIndex]?.data_field_actions[fieldIndex]
      ) {
        state.newObject.activity[activityIndex].data_field_actions[fieldIndex][
          field
        ] = value as never;
      }
    },

    removeDataFieldFromNewActivity: (
      state,
      action: PayloadAction<{
        activityIndex: number;
        fieldIndex: number;
      }>
    ) => {
      const { activityIndex, fieldIndex } = action.payload;
      if (state.newObject.activity[activityIndex]) {
        state.newObject.activity[activityIndex].data_field_actions.splice(
          fieldIndex,
          1
        );
      }
    },

    saveNewObject: (state) => {
      if (state.newObject.object_name.trim() !== '') {
        state.objects.push({ ...state.newObject });
        state.isCreatingObject = false;
        state.newObject = {
          id: '',
          object_name: '',
          activity: []
        };
      }
    },

    startEditingObject: (state, action: PayloadAction<string>) => {
      const objectToEdit = state.objects.find(
        (obj) => obj.id === action.payload
      );
      if (objectToEdit) {
        state.isEditingObject = true;
        state.editingObject = { ...objectToEdit };
      }
    },

    updateEditingObject: (
      state,
      action: PayloadAction<{
        field: keyof RoleObject;
        value: string | Activity[];
      }>
    ) => {
      const { field, value } = action.payload;
      if (state.editingObject) {
        state.editingObject[field] = value as never;
      }
    },

    updateEditingObjectActivity: (
      state,
      action: PayloadAction<{
        activityIndex: number;
        field: keyof Activity;
        value: string | boolean | DataFieldAction[];
      }>
    ) => {
      const { activityIndex, field, value } = action.payload;
      if (state.editingObject?.activity[activityIndex]) {
        state.editingObject.activity[activityIndex][field] = value as never;
      }
    },

    addActivityToEditingObject: (state) => {
      if (state.editingObject) {
        state.editingObject.activity.push({
          activity_name: '',
          status: true,
          data_field_actions: []
        });
      }
    },

    removeActivityFromEditingObject: (state, action: PayloadAction<number>) => {
      if (state.editingObject) {
        state.editingObject.activity.splice(action.payload, 1);
      }
    },

    saveEditingObject: (state) => {
      if (
        state.editingObject &&
        state.editingObject.object_name.trim() !== ''
      ) {
        const index = state.objects.findIndex(
          (obj) => obj.id === state.editingObject?.id
        );
        if (index !== -1) {
          state.objects[index] = { ...state.editingObject };
        }
        state.isEditingObject = false;
        state.editingObject = null;
      }
    },

    cancelEditingObject: (state) => {
      state.isEditingObject = false;
      state.editingObject = null;
    }
  }
});

// Export actions
export const {
  setObjects,
  selectObject,
  clearSelectedObject,
  setSearchQuery,
  toggleSearch,
  startCreatingObject,
  cancelCreatingObject,
  setNewObjectName,
  addActivityToNewObject,
  updateNewObjectActivity,
  addDataFieldToNewActivity,
  updateDataFieldInNewActivity,
  removeDataFieldFromNewActivity,
  saveNewObject,
  startEditingObject,
  updateEditingObject,
  updateEditingObjectActivity,
  addActivityToEditingObject,
  removeActivityFromEditingObject,
  saveEditingObject,
  cancelEditingObject
} = objectManagementSlice.actions;

// Selectors
export const selectAllObjects = (state: RootState) =>
  state.objectManagement.objects;

export const selectFilteredObjects = (state: RootState) => {
  const { objects, searchQuery } = state.objectManagement;
  return objects.filter((obj) =>
    obj.object_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

export const selectSelectedObject = (state: RootState) => {
  const { objects, selectedObjectId } = state.objectManagement;
  return objects.find((obj) => obj.id === selectedObjectId) || null;
};

export const selectIsCreatingObject = (state: RootState) =>
  state.objectManagement.isCreatingObject;

export const selectIsEditingObject = (state: RootState) =>
  state.objectManagement.isEditingObject;

export const selectIsSearching = (state: RootState) =>
  state.objectManagement.isSearching;

export const selectSearchQuery = (state: RootState) =>
  state.objectManagement.searchQuery;

export const selectNewObject = (state: RootState) =>
  state.objectManagement.newObject;

export const selectEditingObject = (state: RootState) =>
  state.objectManagement.editingObject;

export default objectManagementSlice.reducer;
