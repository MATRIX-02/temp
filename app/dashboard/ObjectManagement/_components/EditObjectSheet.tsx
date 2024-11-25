'use client';
import React from 'react';
import { FiTrash2, FiEdit2, FiPlus } from 'react-icons/fi';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  selectSelectedObject,
  selectIsEditingObject,
  selectEditingObject,
  startEditingObject,
  cancelEditingObject,
  updateEditingObject,
  addActivityToEditingObject,
  removeActivityFromEditingObject,
  updateEditingObjectActivity,
  saveEditingObject
} from '@/lib/store/objectManagement/objectSlice';
import { Activity, DataFieldAction } from './_interface';

export const EditObjectSheet = () => {
  const dispatch = useAppDispatch();
  const selectedObject = useAppSelector(selectSelectedObject);
  const isEditingObject = useAppSelector(selectIsEditingObject);
  const editingObject = useAppSelector(selectEditingObject);

  const handleStartEditing = () => {
    if (selectedObject) {
      dispatch(startEditingObject(selectedObject.id));
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
    dispatch(
      updateEditingObject({
        field: 'object_name',
        value: e.target.value
      })
    );
  };

  const handleAddActivity = () => {
    dispatch(addActivityToEditingObject());
  };

  const handleRemoveActivity = (index: number) => {
    dispatch(removeActivityFromEditingObject(index));
  };

  const handleActivityChange = (
    activityIndex: number,
    field: keyof Activity,
    value: string | boolean | DataFieldAction[]
  ) => {
    dispatch(updateEditingObjectActivity({ activityIndex, field, value }));
  };

  const handleAddDataField = (activityIndex: number) => {
    const newDataField: DataFieldAction = {
      label: '',
      status: true,
      description: ''
    };
    const currentActivity = editingObject?.activity[activityIndex];
    if (currentActivity) {
      handleActivityChange(activityIndex, 'data_field_actions', [
        ...currentActivity.data_field_actions,
        newDataField
      ]);
    }
  };

  const handleRemoveDataField = (activityIndex: number, fieldIndex: number) => {
    const currentActivity = editingObject?.activity[activityIndex];
    if (currentActivity) {
      const updatedFields = [...currentActivity.data_field_actions];
      updatedFields.splice(fieldIndex, 1);
      handleActivityChange(activityIndex, 'data_field_actions', updatedFields);
    }
  };

  const handleUpdateDataField = (
    activityIndex: number,
    fieldIndex: number,
    field: keyof DataFieldAction,
    value: string | boolean
  ) => {
    const currentActivity = editingObject?.activity[activityIndex];
    if (currentActivity) {
      const updatedFields = [...currentActivity.data_field_actions];
      updatedFields[fieldIndex] = {
        ...updatedFields[fieldIndex],
        [field]: value
      };
      handleActivityChange(activityIndex, 'data_field_actions', updatedFields);
    }
  };

  return (
    <Sheet
      open={isEditingObject}
      onOpenChange={(open) => !open && handleCancelEditing()}
    >
      <SheetTrigger asChild>
        <Button variant="outline" onClick={handleStartEditing}>
          <FiEdit2 className="mr-2 h-4 w-4" />
          Edit Object
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Object: {selectedObject?.object_name}</SheetTitle>
          <SheetDescription>
            Modify object details and activities
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Object Name
            </label>
            <Input
              value={editingObject?.object_name || ''}
              onChange={handleEditingObjectNameChange}
              className="w-full"
              placeholder="Enter object name"
            />
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">Activities</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddActivity}
                className="text-purple-600 hover:bg-purple-50"
              >
                <FiPlus className="mr-2 h-4 w-4" />
                Add Activity
              </Button>
            </div>

            {editingObject?.activity.map((activity, activityIndex) => (
              <div
                key={activityIndex}
                className="space-y-3 rounded-lg border p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={activity.activity_name}
                      onChange={(e) =>
                        handleActivityChange(
                          activityIndex,
                          'activity_name',
                          e.target.value
                        )
                      }
                      placeholder="Activity Name"
                      className="w-full"
                    />
                    {/* <div className="flex items-center space-x-2">
                      <Switch
                        checked={activity.status}
                        onCheckedChange={(checked) =>
                          handleActivityChange(activityIndex, 'status', checked)
                        }
                      />
                      <span className="text-sm text-gray-600">
                        {activity.status ? 'Active' : 'Inactive'}
                      </span>
                    </div> */}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveActivity(activityIndex)}
                  >
                    <FiTrash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-700">
                      Data Fields
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddDataField(activityIndex)}
                      className="text-purple-600 hover:bg-purple-50"
                    >
                      <FiPlus className="mr-2 h-4 w-4" />
                      Add Field
                    </Button>
                  </div>

                  {activity.data_field_actions.map((field, fieldIndex) => (
                    <div
                      key={fieldIndex}
                      className="space-y-2 rounded-lg border p-3"
                    >
                      <div className="flex items-center justify-between">
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
                          placeholder="Field Label"
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleRemoveDataField(activityIndex, fieldIndex)
                          }
                          className="ml-2 text-red-500 hover:bg-red-50"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        value={field.description}
                        onChange={(e) =>
                          handleUpdateDataField(
                            activityIndex,
                            fieldIndex,
                            'description',
                            e.target.value
                          )
                        }
                        placeholder="Field Description"
                      />
                      {/* <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.status}
                          onCheckedChange={(checked) =>
                            handleUpdateDataField(
                              activityIndex,
                              fieldIndex,
                              'status',
                              checked
                            )
                          }
                        />
                        <span className="text-sm text-gray-600">
                          {field.status ? 'Active' : 'Inactive'}
                        </span>
                      </div> */}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <SheetFooter className="mt-4">
          <SheetClose asChild>
            <Button variant="outline" onClick={handleCancelEditing}>
              Cancel
            </Button>
          </SheetClose>
          <Button
            onClick={handleSaveEditing}
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            Save Changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
