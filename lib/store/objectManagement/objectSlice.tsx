import { objectData } from '@/app/dashboard/ObjectManagement/_components/_utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import {
  DataFieldAction,
  EditableActivity,
  NewObject,
  ObjectManagementState,
  RoleObject
} from '@/app/dashboard/RoleManagement/_components/_interface';

const initialState: ObjectManagementState = {
  objects: objectData,
  selectedObjectId: null,
  isCreatingObject: false,
  isEditingObject: false,
  isSearching: false,
  searchQuery: '',
  newObject: {
    objectName: '',
    activityName: '',
    dataFieldActions: [{ label: '', status: true, description: '' }]
  },
  editingObject: null
};

const objectManagementSlice = createSlice({
  name: 'objectManagement',
  initialState,
  reducers: {
    // Load initial objects
    setObjects: (state, action: PayloadAction<RoleObject[]>) => {
      state.objects = action.payload;
    },

    // Object selection
    selectObject: (state, action: PayloadAction<string>) => {
      state.selectedObjectId = action.payload;
    },
    clearSelectedObject: (state) => {
      state.selectedObjectId = null;
    },

    // Search functionality
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    toggleSearch: (state) => {
      state.isSearching = !state.isSearching;
      if (!state.isSearching) {
        state.searchQuery = '';
      }
    },

    // Create object mode
    startCreatingObject: (state) => {
      state.isCreatingObject = true;
    },
    cancelCreatingObject: (state) => {
      state.isCreatingObject = false;
      state.newObject = {
        objectName: '',
        activityName: '',
        dataFieldActions: [{ label: '', status: true, description: '' }]
      };
    },

    // New object form management
    setNewObjectName: (state, action: PayloadAction<string>) => {
      state.newObject.objectName = action.payload;
    },
    setNewActivityName: (state, action: PayloadAction<string>) => {
      state.newObject.activityName = action.payload;
    },
    addDataFieldAction: (state) => {
      state.newObject.dataFieldActions.push({
        label: '',
        status: true,
        description: ''
      });
    },
    removeDataFieldAction: (state, action: PayloadAction<number>) => {
      state.newObject.dataFieldActions.splice(action.payload, 1);
    },
    updateDataFieldAction: (
      state,
      action: PayloadAction<{
        index: number;
        field: keyof DataFieldAction;
        value: string | boolean;
      }>
    ) => {
      const { index, field, value } = action.payload;
      state.newObject.dataFieldActions[index][field] = value;
    },

    // Save new object
    saveNewObject: (state) => {
      if (state.newObject.objectName.trim() !== '') {
        const newObject: RoleObject = {
          object_name: state.newObject.objectName,
          activity: [
            {
              activity_name: state.newObject.activityName,
              status: true,
              data_field_actions: state.newObject.dataFieldActions
            }
          ]
        };
        state.objects.push(newObject);
        state.isCreatingObject = false;
        state.newObject = {
          objectName: '',
          activityName: '',
          dataFieldActions: [{ label: '', status: true, description: '' }]
        };
      }
    },
    startEditingObject: (state, action: PayloadAction<string>) => {
      const objectToEdit = state.objects.find(
        (obj) => obj.object_name === action.payload
      );
      if (objectToEdit) {
        state.isEditingObject = true;
        state.editingObject = {
          objectName: objectToEdit.object_name,
          activities: objectToEdit.activity.map((act) => ({
            activityName: act.activity_name,
            status: act.status,
            dataFieldActions: act.data_field_actions
          }))
        };
      }
    },

    cancelEditingObject: (state) => {
      state.isEditingObject = false;
      state.editingObject = null;
    },

    updateEditingObjectName: (state, action: PayloadAction<string>) => {
      if (state.editingObject) {
        state.editingObject.objectName = action.payload;
      }
    },

    addActivityToEditingObject: (state) => {
      if (state.editingObject) {
        const newActivity: EditableActivity = {
          activityName: '',
          status: true,
          dataFieldActions: [{ label: '', status: true, description: '' }]
        };
        state.editingObject.activities.push(newActivity);
      }
    },

    removeActivityFromEditingObject: (state, action: PayloadAction<number>) => {
      if (state.editingObject) {
        state.editingObject.activities.splice(action.payload, 1);
      }
    },

    updateEditingObjectActivity: (
      state,
      action: PayloadAction<{
        index: number;
        field: keyof Omit<EditableActivity, 'dataFieldActions'>;
        value: string | boolean;
      }>
    ) => {
      const { index, field, value } = action.payload;
      if (state.editingObject && state.editingObject.activities[index]) {
        state.editingObject.activities[index][field] = value as any;
      }
    },

    addDataFieldToActivity: (state, action: PayloadAction<number>) => {
      if (state.editingObject) {
        const newDataField: DataFieldAction = {
          label: '',
          status: true,
          description: ''
        };
        state.editingObject.activities[action.payload].dataFieldActions.push(
          newDataField
        );
      }
    },

    removeDataFieldFromActivity: (
      state,
      action: PayloadAction<{ activityIndex: number; fieldIndex: number }>
    ) => {
      const { activityIndex, fieldIndex } = action.payload;
      if (
        state.editingObject &&
        state.editingObject.activities[activityIndex]
      ) {
        state.editingObject.activities[activityIndex].dataFieldActions.splice(
          fieldIndex,
          1
        );
      }
    },

    updateDataFieldInActivity: (
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
        state.editingObject &&
        state.editingObject.activities[activityIndex]?.dataFieldActions[
          fieldIndex
        ]
      ) {
        state.editingObject.activities[activityIndex].dataFieldActions[
          fieldIndex
        ][field] = value as any;
      }
    },

    saveEditingObject: (state) => {
      if (state.editingObject && state.editingObject.objectName.trim() !== '') {
        const objectIndex = state.objects.findIndex(
          (obj) => obj.object_name === state.selectedObjectId
        );

        if (objectIndex !== -1) {
          const updatedObject: RoleObject = {
            object_name: state.editingObject.objectName,
            activity: state.editingObject.activities.map((act) => ({
              activity_name: act.activityName,
              status: act.status,
              data_field_actions: act.dataFieldActions
            }))
          };
          state.objects[objectIndex] = updatedObject;
        }

        state.selectedObjectId = state.editingObject.objectName;
        state.isEditingObject = false;
        state.editingObject = null;
      }
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
  setNewActivityName,
  addDataFieldAction,
  removeDataFieldAction,
  updateDataFieldAction,
  saveNewObject,
  startEditingObject,
  cancelEditingObject,
  updateEditingObjectName,
  addActivityToEditingObject,
  removeActivityFromEditingObject,
  updateEditingObjectActivity,
  addDataFieldToActivity,
  removeDataFieldFromActivity,
  updateDataFieldInActivity,
  saveEditingObject
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
  return objects.find((obj) => obj.object_name === selectedObjectId) || null;
};

export const selectIsCreatingObject = (state: RootState) =>
  state.objectManagement.isCreatingObject;

export const selectIsSearching = (state: RootState) =>
  state.objectManagement.isSearching;

export const selectSearchQuery = (state: RootState) =>
  state.objectManagement.searchQuery;

export const selectNewObject = (state: RootState) =>
  state.objectManagement.newObject;
export const selectEditingObject = (state: RootState) =>
  state.objectManagement.editingObject;

export const selectIsEditingObject = (state: RootState) =>
  state.objectManagement.isEditingObject;
export default objectManagementSlice.reducer;
