import React from 'react';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  selectNewObject,
  setNewObjectName,
  addActivityToNewObject,
  updateNewObjectActivity,
  addDataFieldToNewActivity,
  updateDataFieldInNewActivity,
  removeDataFieldFromNewActivity,
  saveNewObject,
  cancelCreatingObject,
  selectIsCreatingObject
} from '@/lib/store/objectManagement/objectSlice';

export const CreateObjectSheet = () => {
  const dispatch = useAppDispatch();
  const newObject = useAppSelector(selectNewObject);
  const isCreatingObject = useAppSelector(selectIsCreatingObject);

  const handleObjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setNewObjectName(e.target.value));
  };

  const handleAddActivity = () => {
    dispatch(addActivityToNewObject());
  };

  const handleActivityNameChange = (index: number, value: string) => {
    dispatch(
      updateNewObjectActivity({
        index,
        field: 'activity_name',
        value
      })
    );
  };

  const handleAddField = (activityIndex: number) => {
    dispatch(addDataFieldToNewActivity(activityIndex));
  };

  const handleFieldChange = (
    activityIndex: number,
    fieldIndex: number,
    field: 'label' | 'description',
    value: string
  ) => {
    dispatch(
      updateDataFieldInNewActivity({
        activityIndex,
        fieldIndex,
        field,
        value
      })
    );
  };

  const handleRemoveField = (activityIndex: number, fieldIndex: number) => {
    dispatch(removeDataFieldFromNewActivity({ activityIndex, fieldIndex }));
  };

  const handleSave = () => {
    dispatch(saveNewObject());
  };

  const handleCancel = () => {
    dispatch(cancelCreatingObject());
  };

  return (
    <Sheet
      open={isCreatingObject}
      onOpenChange={(open) => !open && handleCancel()}
    >
      <SheetContent side="right" className="w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Object</SheetTitle>
          <SheetDescription>
            Fill in object details. Required fields are marked with *
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Object Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={newObject.object_name}
              onChange={handleObjectNameChange}
              className="w-full"
              placeholder="Enter object name"
            />
          </div>

          <div className="space-y-4">
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

            {newObject.activity.map((activity, activityIndex) => (
              <div
                key={activityIndex}
                className="space-y-4 rounded-lg border p-4"
              >
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Activity Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={activity.activity_name}
                    onChange={(e) =>
                      handleActivityNameChange(activityIndex, e.target.value)
                    }
                    placeholder="Enter activity name"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-700">
                      Data Fields
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddField(activityIndex)}
                      className="text-purple-600 hover:bg-purple-50"
                    >
                      <FiPlus className="mr-2 h-4 w-4" />
                      Add Field
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {activity.data_field_actions.map((field, fieldIndex) => (
                      <div
                        key={fieldIndex}
                        className="flex items-center space-x-2 rounded-lg border p-3"
                      >
                        <div className="flex-1 space-y-2">
                          <Input
                            value={field.label}
                            onChange={(e) =>
                              handleFieldChange(
                                activityIndex,
                                fieldIndex,
                                'label',
                                e.target.value
                              )
                            }
                            placeholder="Field Label"
                          />
                          <Input
                            value={field.description}
                            onChange={(e) =>
                              handleFieldChange(
                                activityIndex,
                                fieldIndex,
                                'description',
                                e.target.value
                              )
                            }
                            placeholder="Field Description"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleRemoveField(activityIndex, fieldIndex)
                          }
                          className="text-red-500 hover:bg-red-50"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <SheetFooter className="mt-4">
          <SheetClose asChild>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </SheetClose>
          <Button
            onClick={handleSave}
            disabled={!newObject.object_name || newObject.activity.length === 0}
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            Add Object
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
