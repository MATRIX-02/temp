'use client';
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { FiPackage, FiCalendar, FiActivity, FiInfo } from 'react-icons/fi';
import ModernRoleSidebar from './sidebar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { FiEdit2 } from 'react-icons/fi';
import { Input } from '@/components/ui/input';
import {
  selectSelectedRole,
  selectSelectedTasksByActivity,
  toggleActivity,
  selectActiveActivities,
  toggleTaskSelection,
  resetAll,
  enableAll,
  submitRoleChanges,
  selectSelectedRoleId,
  selectRoles,
  updateRoleDetails,
  resetObject,
  enableObject
} from '@/lib/store/roleManagement/rolesSlice';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';

const RoleManagement: React.FC = () => {
  const roles = useAppSelector(selectRoles);
  const selectedRoleId = useAppSelector(selectSelectedRoleId);
  const selectedRole = useAppSelector(selectSelectedRole);
  const activeActivities = useAppSelector(selectActiveActivities);
  const selectedTasksByActivity = useAppSelector(selectSelectedTasksByActivity);
  const dispatch = useAppDispatch();
  const [hasChanges, setHasChanges] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    role_name: '',
    role_id: '',
    description: '',
    status: 'Active' as 'Active' | 'Inactive'
  });
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
  useEffect(() => {
    setHasChanges(false);
  }, [selectedRoleId]);
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };
  const handleObjectReset = (objectName: string) => {
    if (
      window.confirm(
        `Are you sure you want to reset all activities in ${objectName}?`
      )
    ) {
      dispatch(resetObject({ objectName }));
      setHasChanges(true);
    }
  };

  const handleObjectEnable = (objectName: string) => {
    dispatch(enableObject({ objectName }));
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
  const handleSave = () => {
    dispatch(submitRoleChanges());
    setHasChanges(false);
    alert('Changes Saved Successfully');
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
        const roleExists = roles.some(
          (role) => role.role_id === editForm.role_id
        );
        if (roleExists) {
          throw new Error('A role with this ID already exists');
        }
      }

      dispatch(
        updateRoleDetails({
          role_id: selectedRole.role_id,
          updates: {
            role_name: editForm.role_name.trim(),
            role_id: editForm.role_id.trim(),
            description: editForm.description.trim(),
            status: editForm.status
          }
        })
      );

      // Close the sheet
      setIsSheetOpen(false);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : 'Failed to update role details'
      );
    }
  };
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
          <CardHeader className="space-y-0 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-800">
                    {selectedRole.role_name || 'Unnamed Role'}
                  </CardTitle>
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                    <span>ID: {selectedRole.role_id || 'N/A'}</span>
                    <Badge variant="outline" className="px-3 py-1">
                      {selectedRole.status || 'N/A'}
                    </Badge>
                  </div>
                </div>
              </div>
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSheetOpen(true)}
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Edit Role</SheetTitle>
                  </SheetHeader>
                  <form onSubmit={handleEditSubmit} className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="role_name">Role Name</Label>
                      <Input
                        id="role_name"
                        value={editForm.role_name}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            role_name: e.target.value
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role_id">Role ID</Label>
                      <Input
                        id="role_id"
                        value={editForm.role_id}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            role_id: e.target.value
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            description: e.target.value
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={editForm.status === 'Active'}
                          onCheckedChange={(checked) =>
                            setEditForm((prev) => ({
                              ...prev,
                              status: checked ? 'Active' : 'Inactive'
                            }))
                          }
                        />
                        <span>{editForm.status}</span>
                      </div>
                    </div>
                    <Button
                      onClick={handleEditSubmit}
                      type="submit"
                      className="w-full"
                    >
                      Save Changes
                    </Button>
                  </form>
                </SheetContent>
              </Sheet>
            </div>
          </CardHeader>

          <CardContent>
            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 rounded-lg border bg-gray-50 p-4">
              <div className="col-span-2">
                <div className="flex items-center space-x-2 text-sm">
                  <FiInfo className="text-gray-500" />
                  <span className="font-medium text-gray-700">
                    Description:
                  </span>
                  <span className="text-gray-600">
                    {selectedRole.description || 'No description available'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <FiCalendar className="text-gray-500" />
                <span className="font-medium text-gray-700">Created:</span>
                <span className="text-gray-600">
                  {formatDate(selectedRole.created_on || '')} by{' '}
                  {selectedRole.created_by || 'N/A'}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <FiCalendar className="text-gray-500" />
                <span className="font-medium text-gray-700">Modified:</span>
                <span className="text-gray-600">
                  {formatDate(selectedRole.modified_on || '')} by{' '}
                  {selectedRole.modified_by || 'N/A'}
                </span>
              </div>
            </div>

            {/* Activities Section */}
            <div className="mt-6">
              <div className="flex items-center justify-between pb-4">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-700">
                    <FiActivity className="mr-2 inline-block text-gray-500" />
                    Objects & Activities
                  </h3>
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm" onClick={handleResetAll}>
                    Reset All Objects
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleEnableAll}>
                    Enable All Objects
                  </Button>
                </div>
              </div>

              {/* Objects and Activities Table */}
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
                        {/* Object Row */}
                        <tr className="border-b bg-gray-100">
                          <td colSpan={2} className="py-3 pl-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FiPackage className="text-gray-500" />
                                <span className="font-semibold text-gray-800">
                                  {obj.object_name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 pr-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleObjectReset(obj.object_name)
                                  }
                                  className="text-xs"
                                >
                                  Reset All Activity
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleObjectEnable(obj.object_name)
                                  }
                                  className="text-xs"
                                >
                                  Enable All Activity
                                </Button>
                              </div>
                            </div>
                          </td>
                        </tr>
                        {/* Activity Rows */}
                        {obj.activity.map((activity, actIndex) => (
                          <tr
                            key={`${objIndex}-${actIndex}`}
                            className="border-b last:border-b-0"
                          >
                            <td className="py-3 pl-10">
                              <div className="flex items-center gap-2">
                                <Switch
                                  id={`${activity.activity_name}-switch`}
                                  checked={
                                    activeActivities[activity.activity_name] ||
                                    false
                                  }
                                  onCheckedChange={() =>
                                    handleActivityToggle(activity.activity_name)
                                  }
                                />
                                <span className="text-sm text-gray-600">
                                  {activity.activity_name}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 pl-4">
                              <div className="flex flex-wrap gap-4">
                                {activity.data_field_actions.map(
                                  (action, actionIndex) => (
                                    <div
                                      key={actionIndex}
                                      className="flex items-center gap-2"
                                    >
                                      <Checkbox
                                        id={`${activity.activity_name}-${action.label}`}
                                        checked={selectedTasksByActivity[
                                          activity.activity_name
                                        ]?.includes(action.label)}
                                        onClick={() =>
                                          handleTaskSelect(
                                            activity.activity_name,
                                            action.label
                                          )
                                        }
                                        disabled={
                                          !activeActivities[
                                            activity.activity_name
                                          ]
                                        }
                                      />
                                      <Tooltip
                                        content={action.description || ''}
                                        placement="top"
                                      >
                                        <label
                                          htmlFor={`${activity.activity_name}-${action.label}`}
                                          className={`cursor-pointer text-sm ${
                                            activeActivities[
                                              activity.activity_name
                                            ]
                                              ? 'text-gray-600'
                                              : 'text-gray-400'
                                          }`}
                                        >
                                          {action.label || 'Unnamed Action'}
                                        </label>
                                      </Tooltip>
                                    </div>
                                  )
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end border-t bg-gray-50 px-6 py-4">
            <div className="flex space-x-3">
              {hasChanges && (
                <Button
                  onClick={handleSave}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save Changes
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RoleManagement;
