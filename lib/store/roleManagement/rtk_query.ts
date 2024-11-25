import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Role } from '@/app/dashboard/RoleManagement/_components/_interface';

export const rolesApi = createApi({
  reducerPath: 'rolesApi',
  baseQuery: fetchBaseQuery({
    baseUrl:
      'https://userrolemanagement.agreeablemeadow-f51dff9d.centralindia.azurecontainerapps.io/Role'
  }),
  tagTypes: ['Roles'],
  endpoints: (builder) => ({
    // Fetch all roles
    getAllRoles: builder.query<Role[], void>({
      query: () => ({ url: 'get_all_roles', method: 'GET' }),
      providesTags: ['Roles']
    }),

    // Create a new role
    createRole: builder.mutation<Role, Partial<Role>>({
      query: (newRole) => ({
        url: 'create_role',
        method: 'POST',
        body: newRole
      }),
      invalidatesTags: ['Roles']
    }),

    // Update an existing role
    updateRole: builder.mutation<
      Role,
      { role_id: string; updates: Partial<Role> }
    >({
      query: ({ role_id, updates }) => ({
        url: `update_role`,
        method: 'PUT',
        body: updates
      }),
      invalidatesTags: ['Roles']
    }),

    // Delete a role
    deleteRole: builder.mutation<void, string>({
      query: (role_id) => ({
        url: `delete_role?role_id=${role_id}`, // Changed to include role_id as query parameter
        method: 'DELETE'
      }),
      invalidatesTags: ['Roles']
    }),

    // Update role permissions
    updateRolePermissions: builder.mutation<Role, Role>({
      query: (fullRoleData) => ({
        url: `update_role`,
        method: 'PUT',
        body: fullRoleData // Send the entire role object
      }),
      invalidatesTags: ['Roles']
    })
  })
});

// Export hooks for usage in components
export const {
  useGetAllRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useUpdateRolePermissionsMutation
} = rolesApi;
