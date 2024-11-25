'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ModernRoleSidebar from './RoleComponents/RolesSidebar';
import {
  selectSelectedRole,
  selectSelectedTasksByActivity,
  setSelectedRole,
  selectActiveActivities,
  selectSelectedRoleId,
  selectRoles,
  setRolesFromApi,
  enableAll,
  resetAll,
  enableObject,
  resetObject,
  toggleTaskSelection,
  toggleActivity
} from '@/lib/store/roleManagement/rolesSlice';
import {
  useGetAllRolesQuery,
  useUpdateRoleMutation,
  useUpdateRolePermissionsMutation
} from '@/lib/store/roleManagement/rtk_query';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { Role } from '@/app/dashboard/RoleManagement/_components/_interface';

import { ActivityHeader } from './RoleComponents/ActivityHeader';

import { ObjectRow } from './RoleComponents/ObjectRow';
import { EditRoleSheet } from './RoleComponents/EditRoleSheet';

import RoleLoader from './Loaders/LoadingRolesLoader';
import RoleErrorScreen from './Loaders/ErrorLoadingSkeleton';
import NoRolesAvailable from './Loaders/NoRolesAvailable';
import { ActivityRow } from './RoleComponents/ActivityRow';
import { RoleHeader } from './RoleComponents/RoleHeader';
import { RoleInfoGrid } from './RoleComponents/RoleInfoGrid';

const RoleManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: roles, isLoading, error } = useGetAllRolesQuery();
  const [updateRole] = useUpdateRoleMutation();
  React.useEffect(() => {
    if (roles) {
      dispatch(setRolesFromApi(roles));
    }
  }, [roles, dispatch]);

  const selectedRoleId = useAppSelector(selectSelectedRoleId);
  const selectedRole = useAppSelector(selectSelectedRole);
  const activeActivities = useAppSelector(selectActiveActivities);
  const selectedTasksByActivity = useAppSelector(selectSelectedTasksByActivity);
  const [updateRolePermissions] = useUpdateRolePermissionsMutation();
  const [hasChanges, setHasChanges] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    role_name: '',
    role_id: '',
    description: '',
    status: 'Active' as 'Active' | 'Inactive'
  });

  // Fetch roles and set initial selected role
  useEffect(() => {
    if (roles && roles.length > 0 && !selectedRoleId) {
      dispatch(setSelectedRole(roles[0]));
    }
  }, [roles, selectedRoleId, dispatch]);

  // Update edit form when selected role changes
  useEffect(() => {
    if (selectedRole) {
      setEditForm({
        role_name: selectedRole.role_name,
        role_id: selectedRole.role_id,
        description: selectedRole.description,
        status: selectedRole.status
      });
    }
  }, [selectedRole]);

  // Reset changes when selected role changes
  useEffect(() => {
    setHasChanges(false);
  }, [selectedRoleId]);

  const handleObjectReset = (objectId: string) => {
    if (
      window.confirm(
        `Are you sure you want to reset all activities in this object?`
      )
    ) {
      dispatch(resetObject({ objectId })); // Changed from objectName to objectId
      setHasChanges(true);
    }
  };

  const handleObjectEnable = (objectId: string) => {
    dispatch(enableObject({ objectId })); // Changed from objectName to objectId
    setHasChanges(true);
  };
  const handleResetAll = () => {
    if (window.confirm('Are you sure you want to reset all changes?')) {
      dispatch(resetAll());
      setHasChanges(true);
    }
  };
  const handleEnableAll = () => {
    dispatch(enableAll());
    setHasChanges(true);
  };

  const handleTaskSelect = (activityName: string, actionLabel: string) => {
    dispatch(toggleTaskSelection({ activityName, actionLabel }));
    setHasChanges(true);
  };

  const handleActivityToggle = (activityName: string) => {
    dispatch(toggleActivity(activityName));
    setHasChanges(true);
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) return;

    try {
      // Validation
      if (!editForm.role_name.trim()) {
        throw new Error('Role name is required');
      }

      if (!editForm.role_id.trim()) {
        throw new Error('Role ID is required');
      }

      // Check if new role_id already exists (only if it's different from current)
      if (editForm.role_id !== selectedRole.role_id) {
        const roleExists = roles?.some(
          (role) => role.role_id === editForm.role_id
        );
        if (roleExists) {
          throw new Error('A role with this ID already exists');
        }
      }

      // Prepare updates
      const updates = {
        role_name: editForm.role_name.trim(),
        role_id: editForm.role_id.trim(),
        description: editForm.description.trim(),
        status: editForm.status,
        object: selectedRole.object, // Preserve existing object structure
        created_by: selectedRole.created_by,
        created_on: selectedRole.created_on,
        modified_by: 'Current User', // Or dynamically get current user
        modified_on: new Date().toISOString()
      };

      // Call update mutation
      await updateRole({
        role_id: selectedRole.role_id,
        updates
      }).unwrap();

      // Close the sheet
      setIsSheetOpen(false);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : 'Failed to update role details'
      );
    }
  };
  const handleSavePermissions = async () => {
    if (!selectedRole) return;

    try {
      // Prepare full role data payload with updated permissions
      const fullRolePayload: Role = {
        ...selectedRole,
        object: selectedRole.object.map((obj) => ({
          ...obj,
          activity: obj.activity.map((act) => ({
            ...act,
            status: activeActivities[act.activity_name] || false,
            data_field_actions: act.data_field_actions.map((action) => ({
              ...action,
              status:
                selectedTasksByActivity[act.activity_name]?.includes(
                  action.label
                ) || false
            }))
          }))
        })),
        modified_on: new Date().toISOString(),
        modified_by: 'Current User' // Replace with actual user if available
      };

      // Call permissions update mutation with full role data
      await updateRolePermissions(fullRolePayload).unwrap();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to update role permissions'
      );
    }
  };
  // Loading and error states
  if (isLoading) {
    console.log(isLoading);

    return <RoleLoader />;
  }

  if (error) {
    return (
      <RoleErrorScreen
        error={error}
        onRetry={() => {
          // Trigger your refetch logic here
          // refetch();
        }}
        onGoHome={() => {
          // Navigate to dashboard/home
          // router.push('/dashboard');
        }}
      />
    );
  }
  // if (!selectedRole) return <div>No role selected</div>;
  // No roles available
  if (!roles || roles.length === 0) {
    return <NoRolesAvailable />;
  }

  // No role selected
  if (!selectedRole) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <ModernRoleSidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">
            Role Management
          </h1>
          <p className="mt-20 text-center text-gray-500">
            Please select a role from the left sidebar.
          </p>
        </main>
      </div>
    );
  }
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <ModernRoleSidebar />
      <div className="flex-1 overflow-y-auto px-8">
        <div className="mb-6 flex items-center justify-between pt-8">
          <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
        </div>

        <Card className="mb-8 shadow-lg">
          <RoleHeader
            roleName={selectedRole.role_name}
            roleId={selectedRole.role_id}
            status={selectedRole.status}
            isSheetOpen={isSheetOpen}
            setIsSheetOpen={setIsSheetOpen}
          />

          <CardContent>
            <RoleInfoGrid
              description={selectedRole.description}
              createdOn={selectedRole.created_on}
              createdBy={selectedRole.created_by}
              modifiedOn={selectedRole.modified_on}
              modifiedBy={selectedRole.modified_by}
            />

            <div className="mt-6">
              <ActivityHeader
                onResetAll={handleResetAll}
                onEnableAll={handleEnableAll}
              />

              <div className="rounded-lg border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="w-1/4 py-2 pl-4 text-left text-sm font-semibold text-gray-700">
                        Object / Activity
                      </th>
                      <th className="py-2 pl-4 text-left text-sm font-semibold text-gray-700">
                        Permissions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRole.object?.map((obj, objIndex) => (
                      <React.Fragment key={objIndex}>
                        <ObjectRow
                          objectName={obj.object_name}
                          objectId={obj.id}
                          onReset={handleObjectReset}
                          onEnable={handleObjectEnable}
                        />
                        {obj.activity.map((activity, actIndex) => (
                          <ActivityRow
                            key={`${objIndex}-${actIndex}`}
                            activityName={activity.activity_name}
                            actions={activity.data_field_actions}
                            isActive={
                              activeActivities[activity.activity_name] || false
                            }
                            selectedTasks={
                              selectedTasksByActivity[activity.activity_name] ||
                              []
                            }
                            onActivityToggle={handleActivityToggle}
                            onTaskSelect={handleTaskSelect}
                          />
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end border-t bg-gray-50 px-6 py-4">
            <Button
              onClick={handleSavePermissions}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Save Permissions
            </Button>
          </CardFooter>
        </Card>

        <EditRoleSheet
          isOpen={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          formData={editForm}
          onFormChange={(updates) =>
            setEditForm((prev) => ({ ...prev, ...updates }))
          }
          onSubmit={handleEditSubmit}
        />
      </div>
    </div>
  );
};

export default RoleManagement;
