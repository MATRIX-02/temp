import React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  selectNewObject,
  setNewObjectName,
  setNewActivityName,
  addDataFieldAction,
  removeDataFieldAction,
  updateDataFieldAction,
  saveNewObject,
  cancelCreatingObject,
  selectIsCreatingObject
} from '@/lib/store/objectManagement/objectSlice';

const CreateObjectDialog = () => {
  const dispatch = useAppDispatch();
  const newObject = useAppSelector(selectNewObject);
  const isCreatingObject = useAppSelector(selectIsCreatingObject);

  const handleObjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setNewObjectName(e.target.value));
  };

  const handleActivityNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setNewActivityName(e.target.value));
  };

  const handleAddField = () => {
    dispatch(addDataFieldAction());
  };

  const handleRemoveField = (index: number) => {
    dispatch(removeDataFieldAction(index));
  };

  const handleFieldChange = (
    index: number,
    field: 'label' | 'description',
    value: string
  ) => {
    dispatch(updateDataFieldAction({ index, field, value }));
  };

  const handleSave = () => {
    dispatch(saveNewObject());
  };

  const handleCancel = () => {
    dispatch(cancelCreatingObject());
  };

  return (
    <Dialog
      open={isCreatingObject}
      onOpenChange={(open) => !open && handleCancel()}
    >
      <DialogContent className="flex max-h-[80vh] flex-col overflow-hidden sm:max-w-[600px]">
        <DialogHeader className="flex-shrink-0 border-b px-6 py-4">
          <DialogTitle className="text-lg font-semibold">
            Add Object
          </DialogTitle>
          <p className="text-sm text-gray-500">
            Fill in all object details. Required fields are marked with *
          </p>
        </DialogHeader>

        <div className="scrollbar-thin flex-1 overflow-y-auto px-6 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Object Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={newObject.objectName}
                onChange={handleObjectNameChange}
                className="w-full rounded-md"
                placeholder="Enter object name"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Activity Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={newObject.activityName}
                onChange={handleActivityNameChange}
                className="w-full rounded-md"
                placeholder="Enter activity name"
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">Data Fields</h3>
            </div>

            <div className="space-y-4">
              {newObject.dataFieldActions.map((field, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-3">
                      <Input
                        value={field.label}
                        onChange={(e) =>
                          handleFieldChange(index, 'label', e.target.value)
                        }
                        className="w-full"
                        placeholder="Field Label"
                      />
                      <Input
                        value={field.description}
                        onChange={(e) =>
                          handleFieldChange(
                            index,
                            'description',
                            e.target.value
                          )
                        }
                        className="w-full"
                        placeholder="Field Description"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => handleRemoveField(index)}
                      className="h-8 w-8 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t bg-gray-50 px-6 py-4">
          <Button
            variant="outline"
            onClick={handleAddField}
            className="text-sm text-purple-600 hover:bg-purple-50"
          >
            Add Field
          </Button>
          <div className="flex w-full items-center justify-end space-x-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-purple-600 text-white hover:bg-purple-700"
              disabled={!newObject.objectName || !newObject.activityName}
            >
              Add Object
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateObjectDialog;
