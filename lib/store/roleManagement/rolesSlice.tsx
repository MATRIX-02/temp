import { rolesData } from '@/app/dashboard/RoleManagement/_components/_utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { rolesApi } from './rtk_query';
import { Role } from '@/app/dashboard/RoleManagement/_components/_interface';

// Update interfaces to match new data structure
interface ObjectActionPayload {
  objectId: string;
}
interface UpdateRoleDetailsPayload {
  role_id: string;
  updates: {
    role_name: string;
    role_id: string;
    description: string;
    status: 'Active' | 'Inactive';
  };
}
interface SelectedTasksByActivity {
  [activityName: string]: string[];
}
interface CreateRolePayload {
  role_name: string;
  role_id: string;
  description: string;
  status: 'Active' | 'Inactive';
  object: {
    id: string;
    object_name: string;
    activity: {
      activity_name: string;
      status: boolean;
      data_field_actions: {
        label: string;
        status: boolean;
        description: string;
      }[];
    }[];
  }[];
  created_by: string;
  created_on: string;
  modified_by: string;
  modified_on: string;
}
interface RolesState {
  roles: Role[];
  selectedRoleId: string | null;
  activeActivities: { [key: string]: boolean };
  selectedTasksByActivity: SelectedTasksByActivity;
  searchQuery: string;
  statusFilter: 'all' | 'Active' | 'Inactive';
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: RolesState = {
  roles: rolesData,
  selectedRoleId: null, // Store only the ID
  activeActivities: {},
  selectedTasksByActivity: {},
  searchQuery: '',
  statusFilter: 'all',
  loading: 'idle',
  error: null
};

interface ToggleTaskPayload {
  activityName: string;
  actionLabel: string;
}

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    // createRole: (state, action: PayloadAction<CreateRolePayload>) => {
    //   const {
    //     role_name,
    //     role_id,
    //     description,
    //     status,
    //     object,
    //     created_by,
    //     created_on,
    //     modified_by,
    //     modified_on
    //   } = action.payload;

    //   // Check if role_id already exists
    //   if (state.roles.some((role) => role.role_id === role_id)) {
    //     throw new Error('Role ID already exists');
    //   }

    //   // Create new role object with exactly matching structure
    //   const newRole: Role = {
    //     role_name,
    //     role_id,
    //     description,
    //     object,
    //     status,
    //     created_by,
    //     created_on,
    //     modified_by,
    //     modified_on
    //   };

    //   // Add new role to state
    //   state.roles.push(newRole);
    // },
    // updateRoleDetails: (
    //   state,
    //   action: PayloadAction<UpdateRoleDetailsPayload>
    // ) => {
    //   const { role_id, updates } = action.payload;
    //   const roleIndex = state.roles.findIndex(
    //     (role) => role.role_id === role_id
    //   );

    //   if (roleIndex !== -1) {
    //     state.roles[roleIndex] = {
    //       ...state.roles[roleIndex],
    //       ...updates,
    //       modified_on: new Date().toISOString(),
    //       modified_by: 'Current User'
    //     };
    //   }
    // },
    setSelectedRole: (state, action: PayloadAction<Role | null>) => {
      // Only store the ID
      state.selectedRoleId = action.payload?.role_id || null;

      // Find the current role data from roles array
      const currentRole = state.roles.find(
        (role) => role.role_id === action.payload?.role_id
      );

      if (currentRole) {
        const activities =
          currentRole.object?.flatMap((roleObject) => roleObject.activity) ||
          [];

        // Initialize activeActivities based on activity status
        const initialActiveState = activities.reduce(
          (acc, activity) => ({
            ...acc,
            [activity.activity_name]: activity.status
          }),
          {}
        );
        state.activeActivities = initialActiveState;

        // Initialize selectedTasksByActivity with all active tasks per activity
        const initialSelectedTasks = activities.reduce((acc, activity) => {
          acc[activity.activity_name] = activity.data_field_actions
            .filter((action) => action.status)
            .map((action) => action.label);
          return acc;
        }, {} as SelectedTasksByActivity);
        state.selectedTasksByActivity = initialSelectedTasks;
      } else {
        state.selectedTasksByActivity = {};
        state.activeActivities = {};
      }
    },

    toggleActivity: (state, action: PayloadAction<string>) => {
      const activityName = action.payload;

      // Toggle the activity status
      state.activeActivities[activityName] =
        !state.activeActivities[activityName];

      // If there's no selected role, we can't proceed with task management
      if (!state.selectedRoleId) return;

      // Find the current role
      const selectedRole = state.roles.find(
        (role) => role.role_id === state.selectedRoleId
      );
      if (!selectedRole) return;

      // Find the activity in the selected role
      const activity = selectedRole.object
        ?.flatMap((obj) => obj.activity)
        .find((act) => act.activity_name === activityName);

      if (!activity) return;

      // Initialize the activity in selectedTasksByActivity if it doesn't exist
      if (!state.selectedTasksByActivity[activityName]) {
        state.selectedTasksByActivity[activityName] = [];
      }

      // When disabling an activity, clear its selected tasks
      if (!state.activeActivities[activityName]) {
        state.selectedTasksByActivity[activityName] = [];
      } else {
        // When enabling an activity, restore all available tasks for that activity
        state.selectedTasksByActivity[activityName] =
          activity.data_field_actions
            .filter((action) => action.status) // Only include tasks that were previously active
            .map((action) => action.label);
      }
    },

    toggleTaskSelection: (state, action: PayloadAction<ToggleTaskPayload>) => {
      const { activityName, actionLabel } = action.payload;

      if (!state.selectedTasksByActivity[activityName]) {
        state.selectedTasksByActivity[activityName] = [];
      }

      const tasks = state.selectedTasksByActivity[activityName];
      const taskIndex = tasks.indexOf(actionLabel);

      if (taskIndex > -1) {
        // Remove task if it exists
        state.selectedTasksByActivity[activityName] = tasks.filter(
          (label) => label !== actionLabel
        );
      } else {
        // Add task if it doesn't exist
        state.selectedTasksByActivity[activityName].push(actionLabel);
      }
    },

    resetAll: (state) => {
      // Set all activities to false
      Object.keys(state.activeActivities).forEach((activityName) => {
        state.activeActivities[activityName] = false;
      });

      // Clear all selected tasks
      Object.keys(state.selectedTasksByActivity).forEach((activityName) => {
        state.selectedTasksByActivity[activityName] = [];
      });
    },
    enableAll: (state) => {
      if (!state.selectedRoleId) return;

      // First, find the selected role
      const selectedRole = state.roles.find(
        (role) => role.role_id === state.selectedRoleId
      );
      if (!selectedRole) return;

      // Now safely access the activities from the found role
      const activities =
        selectedRole.object?.flatMap((obj) => obj.activity) || [];

      // Enable all activities
      activities.forEach((activity) => {
        state.activeActivities[activity.activity_name] = true;
      });

      // Select all tasks for each activity
      activities.forEach((activity) => {
        state.selectedTasksByActivity[activity.activity_name] =
          activity.data_field_actions.map((action) => action.label);
      });
    },

    // submitRoleChanges: (state) => {
    //   const selectedRole = state.roles.find(
    //     (role) => role.role_id === state.selectedRoleId
    //   );
    //   if (!selectedRole) return;

    //   // Find the role in roles array
    //   const roleIndex = state.roles.findIndex(
    //     (role) => role.role_id === state.selectedRoleId
    //   );

    //   if (roleIndex === -1) return;

    //   // Create a deep copy of the selected role
    //   const updatedRole = JSON.parse(JSON.stringify(selectedRole)) as Role;

    //   // Update each object's activities based on activeActivities and selectedTasksByActivity
    //   updatedRole.object =
    //     updatedRole.object?.map((obj) => {
    //       obj.activity = obj.activity.map((activity) => {
    //         activity.status = state.activeActivities[activity.activity_name];

    //         const selectedTasks =
    //           state.selectedTasksByActivity[activity.activity_name] || [];
    //         activity.data_field_actions = activity.data_field_actions.map(
    //           (action) => ({
    //             ...action,
    //             status: selectedTasks.includes(action.label)
    //           })
    //         );

    //         return activity;
    //       });
    //       return obj;
    //     }) || [];

    //   // Update modification metadata
    //   updatedRole.modified_on = new Date().toISOString();
    //   updatedRole.modified_by = 'Current User';

    //   // Update the role in the roles array
    //   state.roles[roleIndex] = updatedRole;
    // },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    setStatusFilter: (
      state,
      action: PayloadAction<'all' | 'Active' | 'Inactive'>
    ) => {
      state.statusFilter = action.payload;
    },
    resetObject: (state, action: PayloadAction<ObjectActionPayload>) => {
      if (!state.selectedRoleId) return;
      const { objectId } = action.payload; // Changed from objectName to objectId

      // Find the object in the current role
      const selectedRole = state.roles.find(
        (role) => role.role_id === state.selectedRoleId
      );
      if (!selectedRole) return;

      const targetObject = selectedRole.object?.find(
        (obj) => obj.id === objectId // Changed from object_name to id
      );
      if (!targetObject) return;

      // Reset all activities in this object
      targetObject.activity.forEach((activity) => {
        // Reset activity state
        state.activeActivities[activity.activity_name] = false;

        // Reset selected tasks
        state.selectedTasksByActivity[activity.activity_name] = [];
      });
    },

    enableObject: (state, action: PayloadAction<ObjectActionPayload>) => {
      if (!state.selectedRoleId) return;
      const { objectId } = action.payload; // Changed from objectName to objectId

      // Find the object in the current role
      const selectedRole = state.roles.find(
        (role) => role.role_id === state.selectedRoleId
      );
      if (!selectedRole) return;

      const targetObject = selectedRole.object?.find(
        (obj) => obj.id === objectId // Changed from object_name to id
      );
      if (!targetObject) return;

      // Enable all activities in this object
      targetObject.activity.forEach((activity) => {
        // Enable activity
        state.activeActivities[activity.activity_name] = true;

        // Select all tasks for this activity
        state.selectedTasksByActivity[activity.activity_name] =
          activity.data_field_actions.map((action) => action.label);
      });
    },
    setRolesFromApi: (state, action: PayloadAction<Role[]>) => {
      state.roles = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Handle the getAllRoles query
    builder
      .addMatcher(
        rolesApi.endpoints.getAllRoles.matchFulfilled,
        (state, action) => {
          state.roles = action.payload;
          state.loading = 'succeeded';
          state.error = null;
        }
      )
      .addMatcher(rolesApi.endpoints.getAllRoles.matchPending, (state) => {
        state.loading = 'pending';
      })
      .addMatcher(
        rolesApi.endpoints.getAllRoles.matchRejected,
        (state, action) => {
          state.loading = 'failed';
          state.error = action.error.message || 'Failed to fetch roles';
        }
      );
  }
});
export const {
  setSelectedRole,
  toggleActivity,
  toggleTaskSelection,
  resetAll,
  enableAll,
  // submitRoleChanges,
  setSearchQuery,
  setStatusFilter,
  // createRole,
  // updateRoleDetails,
  resetObject,
  enableObject,
  setRolesFromApi
} = rolesSlice.actions;

export const selectRoles = (state: RootState) => state.roles.roles;
export const selectSelectedRoleId = (state: RootState) =>
  state.roles.selectedRoleId;

// Updated selector to always get fresh data from roles array
export const selectSelectedRole = (state: RootState) => {
  const roles = state.roles.roles;
  const selectedRoleId = state.roles.selectedRoleId;
  return roles.find((role) => role.role_id === selectedRoleId) || null;
};

export const selectActiveActivities = (state: RootState) =>
  state.roles.activeActivities;
export const selectSelectedTasksByActivity = (state: RootState) =>
  state.roles.selectedTasksByActivity;
export const selectSearchQuery = (state: RootState) => state.roles.searchQuery;
export const selectStatusFilter = (state: RootState) =>
  state.roles.statusFilter;

export default rolesSlice.reducer;
