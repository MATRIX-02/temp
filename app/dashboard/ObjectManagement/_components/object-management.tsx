'use client';

import React from 'react';
import { FiShoppingBag, FiEdit2, FiGrid } from 'react-icons/fi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import ObjectManagementSideBar from './sidebar';
import {
  selectSelectedObject,
  selectIsEditingObject,
  selectEditingObject,
  startEditingObject,
  cancelEditingObject,
  updateEditingObject,
  updateEditingObjectActivity,
  saveEditingObject
} from '@/lib/store/objectManagement/objectSlice';
import { CreateObjectSheet } from './create-object-form';
import { EditObjectSheet } from './EditObjectSheet';
import {
  Activity,
  DataFieldAction
} from '../../RoleManagement/_components/_interface';

const ObjectManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedObject = useAppSelector(selectSelectedObject);
  const isEditing = useAppSelector(selectIsEditingObject);
  const editingObject = useAppSelector(selectEditingObject);

  const handleStartEditing = () => {
    if (selectedObject) {
      dispatch(startEditingObject(selectedObject.id));
    }
  };

  const handleActivityChange = (
    activityIndex: number,
    field: keyof Activity,
    value: string | boolean | DataFieldAction[]
  ) => {
    dispatch(updateEditingObjectActivity({ activityIndex, field, value }));
  };

  const renderDataFieldActions = (actions: DataFieldAction[]) => (
    <div className="flex flex-wrap gap-2">
      {actions.map((action, index) => (
        <div
          key={index}
          className="flex items-center rounded-md bg-gray-100 px-3 py-1"
        >
          <span className="text-sm text-gray-700">{action.label}</span>
          {action.status && (
            <span className="ml-2 h-2 w-2 rounded-full bg-green-500"></span>
          )}
        </div>
      ))}
    </div>
  );

  const renderActivityTable = () => (
    <div className="rounded-lg border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="py-3 pl-4 text-left text-sm font-semibold text-gray-700">
              Activity Name
            </th>
            <th className="py-3 pl-4 text-left text-sm font-semibold text-gray-700">
              Status
            </th>
            <th className="py-3 pl-4 text-left text-sm font-semibold text-gray-700">
              Data Field Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {selectedObject?.activity.map((activity, index) => (
            <tr
              key={index}
              className="border-b last:border-b-0 hover:bg-gray-50"
            >
              <td className="py-4 pl-4">
                <div className="flex items-center gap-2">
                  <FiShoppingBag className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {activity.activity_name}
                  </span>
                </div>
              </td>
              <td className="py-4 pl-4">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                    activity.status
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {activity.status ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="py-4 pl-4">
                {renderDataFieldActions(activity.data_field_actions)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderObjectView = () => (
    <Card className="mb-8">
      <CardHeader className="sticky top-0 z-10 border-b bg-white pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CardTitle className="text-xl font-bold text-gray-800">
              {selectedObject?.object_name}
            </CardTitle>
          </div>
          <EditObjectSheet />
        </div>
      </CardHeader>

      <CardContent className="overflow-y-auto">
        <div className="mt-6">
          <div className="flex items-center justify-between pb-4">
            <h3 className="flex items-center text-lg font-semibold text-gray-700">
              <FiGrid className="mr-2 text-gray-500" />
              Activities and Permissions
            </h3>
          </div>
          {renderActivityTable()}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <ObjectManagementSideBar />
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-20 border-b bg-white px-8 pb-6 pt-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Object Management
            </h1>
            <CreateObjectSheet />
          </div>
        </div>

        <div className="px-8 py-6">
          {selectedObject ? (
            renderObjectView()
          ) : (
            <div className="mt-20 flex flex-col items-center justify-center">
              <FiGrid className="mb-4 h-12 w-12 text-gray-400" />
              <p className="text-center text-gray-500">
                Select an object from the sidebar or create a new one to get
                started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ObjectManagement;
