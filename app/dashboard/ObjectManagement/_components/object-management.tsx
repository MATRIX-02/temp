'use client';

import React from 'react';
import { FiShoppingBag, FiEdit2, FiTrash2, FiGrid } from 'react-icons/fi';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import ObjectManagementSideBar from './sidebar';
import {
  selectSelectedObject,
  selectIsEditingObject,
  selectEditingObject,
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
} from '@/lib/store/objectManagement/objectSlice';

import CreateObjectDialog from './create-object-form';
import { Badge } from '@/components/ui/badge';

const ObjectManagement: React.FC = () => {
  const dispatch = useAppDispatch();

  const selectedObject = useAppSelector(selectSelectedObject);
  const isEditingObject = useAppSelector(selectIsEditingObject);
  const editingObject = useAppSelector(selectEditingObject);

  const handleStartEditing = () => {
    if (selectedObject) {
      dispatch(startEditingObject(selectedObject.object_name));
    }
  };

  const handleCancelEditing = () => {
    dispatch(cancelEditingObject());
  };

  const handleSaveEditing = () => {
    dispatch(saveEditingObject());
  };

  const handleEditingObjectNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(updateEditingObjectName(e.target.value));
  };

  const handleAddActivity = () => {
    dispatch(addActivityToEditingObject());
  };

  const handleRemoveActivity = (index: number) => {
    dispatch(removeActivityFromEditingObject(index));
  };

  const handleActivityChange = (
    index: number,
    field: 'activityName' | 'status',
    value: string | boolean
  ) => {
    dispatch(updateEditingObjectActivity({ index, field, value }));
  };

  const handleAddDataField = (activityIndex: number) => {
    dispatch(addDataFieldToActivity(activityIndex));
  };

  const handleRemoveDataField = (activityIndex: number, fieldIndex: number) => {
    dispatch(removeDataFieldFromActivity({ activityIndex, fieldIndex }));
  };

  const handleUpdateDataField = (
    activityIndex: number,
    fieldIndex: number,
    field: 'label' | 'status' | 'description',
    value: string | boolean
  ) => {
    dispatch(
      updateDataFieldInActivity({
        activityIndex,
        fieldIndex,
        field,
        value
      })
    );
  };

  const renderEditingForm = () => (
    <Card className="mb-8">
      <CardHeader className="sticky top-0 z-10 border-b bg-white pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CardTitle className="text-xl font-bold text-gray-800">
              Edit Object
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="overflow-y-auto px-6">
        <div className="space-y-8 py-4">
          {/* Object Name Section */}
          <div className="space-y-2">
            <label
              htmlFor="object-name"
              className="block text-sm font-medium text-gray-700"
            >
              Object Name
            </label>
            <Input
              id="object-name"
              value={editingObject?.objectName}
              onChange={handleEditingObjectNameChange}
              className="mt-1 block w-full"
            />
          </div>

          {/* Activities Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FiGrid className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-700">
                  Activities
                </h3>
              </div>
              <Button
                variant="outline"
                onClick={handleAddActivity}
                className="bg-gray-50 text-sm hover:bg-gray-100"
              >
                Add Activity
              </Button>
            </div>

            <div className="space-y-6">
              {editingObject?.activities.map((activity, activityIndex) => (
                <div
                  key={activityIndex}
                  className="rounded-lg border border-gray-200 bg-white shadow-sm"
                >
                  {/* Activity Header */}
                  <div className="rounded-t-lg border-b bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-1 items-center space-x-3">
                        <Badge
                          variant="secondary"
                          className="flex h-6 w-6 items-center justify-center rounded-full"
                        >
                          {activityIndex + 1}
                        </Badge>
                        <Input
                          value={activity.activityName}
                          onChange={(e) =>
                            handleActivityChange(
                              activityIndex,
                              'activityName',
                              e.target.value
                            )
                          }
                          className="w-2/3 bg-white"
                          placeholder="Activity Name"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => handleRemoveActivity(activityIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Activity Content */}
                  <div className="space-y-4 p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-700">
                          Data Field Actions
                        </h4>
                        <Button
                          variant="outline"
                          onClick={() => handleAddDataField(activityIndex)}
                          className="text-sm"
                          size="sm"
                        >
                          Add Field
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {activity.dataFieldActions.map((field, fieldIndex) => (
                          <div
                            key={fieldIndex}
                            className="flex items-center space-x-2 rounded-md bg-gray-50 p-2"
                          >
                            <Input
                              value={field.label}
                              onChange={(e) =>
                                handleUpdateDataField(
                                  activityIndex,
                                  fieldIndex,
                                  'label',
                                  e.target.value
                                )
                              }
                              className="flex-1 bg-white"
                              placeholder="Field Label"
                            />
                            <Button
                              variant="ghost"
                              onClick={() =>
                                handleRemoveDataField(activityIndex, fieldIndex)
                              }
                              className="text-red-500 hover:text-red-700"
                              size="sm"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="sticky bottom-0 flex justify-end border-t bg-white px-6 py-4">
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleCancelEditing}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveEditing}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Save Changes
          </Button>
        </div>
      </CardFooter>
    </Card>
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
          <Button
            variant="outline"
            onClick={handleStartEditing}
            className="flex items-center space-x-2"
          >
            <FiEdit2 className="h-4 w-4" />
            <span>Edit</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="overflow-y-auto">
        <div className="mt-6">
          <div className="flex items-center justify-between pb-4">
            <h3 className="flex items-center text-lg font-semibold text-gray-700">
              <FiShoppingBag className="mr-2 text-gray-500" />
              Activities
            </h3>
          </div>

          <div className="rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="py-2 pl-4 text-left text-sm font-semibold text-gray-700">
                    Activity
                  </th>
                  <th className="py-2 pl-4 text-left text-sm font-semibold text-gray-700">
                    Permissions
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedObject?.activity.map((activity, index) => (
                  <tr
                    key={index}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="py-3 pl-4">
                      <div className="flex items-center gap-2">
                        <FiShoppingBag className="text-gray-500" />
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
                              <FiEdit2 className="text-gray-500" />
                              <span className="text-sm text-gray-600">
                                {action.label || 'Unnamed Action'}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <ObjectManagementSideBar />
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-20  px-8 pb-6 pt-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Object Management
            </h1>
          </div>
        </div>

        <div className="px-8">
          {selectedObject ? (
            isEditingObject ? (
              renderEditingForm()
            ) : (
              renderObjectView()
            )
          ) : (
            <p className="mt-20 text-center text-gray-500">
              Please select an object or create a new one.
            </p>
          )}
        </div>
      </div>
      <CreateObjectDialog />
    </div>
  );
};

export default ObjectManagement;
