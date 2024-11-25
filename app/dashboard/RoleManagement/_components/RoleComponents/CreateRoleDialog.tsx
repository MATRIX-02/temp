'use client';
import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { useAppSelector } from '@/lib/store/hooks';
import { selectAllObjects } from '@/lib/store/objectManagement/objectSlice';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner'; // Assuming you're using sonner for notifications
import { useCreateRoleMutation } from '@/lib/store/roleManagement/rtk_query';
import { log } from 'console';

const RoleCreationDrawer = () => {
  const objectsData = useAppSelector(selectAllObjects) || [];
  const [createRole, { isLoading }] = useCreateRoleMutation();
  const [open, setOpen] = useState(false);
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    role_name: '',
    role_id: '',
    description: '',
    status: 'Active' as 'Active' | 'Inactive'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleObject = (value: string) => {
    if (!value) return;
    setSelectedObjects((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.role_name || !formData.role_id) {
      toast.error('Role Name and Role ID are required');
      return;
    }

    try {
      // Transform selectedObjectsData to match the required payload
      const selectedObjectsData = objectsData
        .filter((obj) => selectedObjects.includes(obj.object_name))
        .map((obj) => ({
          id: obj.id || '', // Add id if available
          object_name: obj.object_name,
          activity: obj.activity.map((activity) => ({
            activity_name: activity.activity_name, // Note the capital A
            status: false, // Set to false by default as per schema
            data_field_actions: activity.data_field_actions.map((action) => ({
              label: action.label,
              status: true, // Set initial status to true for new roles
              description: action.description
            }))
          }))
        }));

      // Create new role using RTK Query mutation
      const result = await createRole({
        role_name: formData.role_name,
        role_id: formData.role_id,
        description: formData.description,
        object: selectedObjectsData,
        status: formData.status,
        created_by: 'Current User', // You might want to get this from your auth context
        created_on: new Date().toISOString(), // Full ISO string
        modified_by: 'Current User',
        modified_on: new Date().toISOString()
      }).unwrap();

      // Success notification
      toast.success('Role created successfully');

      // Reset form
      setOpen(false);
      setFormData({
        role_name: '',
        role_id: '',
        description: '',
        status: 'Active'
      });
      setSelectedObjects([]);
    } catch (error) {
      // Error handling
      console.error('Error creating role:', error);
      toast.error('Failed to create role', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Role
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-1/2">
          <SheetHeader>
            <SheetTitle>Create New Role</SheetTitle>
            <SheetDescription>
              Add a new role with specified information and objects.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="role_name">Role Name</Label>
              <Input
                id="role_name"
                name="role_name"
                value={formData.role_name}
                onChange={handleInputChange}
                placeholder="Enter role name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role_id">Role ID</Label>
              <Input
                id="role_id"
                name="role_id"
                value={formData.role_id}
                onChange={handleInputChange}
                placeholder="Enter role ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter role description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: value as 'Active' | 'Inactive'
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Objects ({selectedObjects.length} selected)</Label>
              <div className="rounded-lg border shadow-md">
                <Command>
                  <CommandInput placeholder="Search objects..." />
                  <CommandEmpty>No objects found.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-y-auto">
                    {Array.isArray(objectsData) &&
                      objectsData.map((object) =>
                        object?.object_name ? (
                          <CommandItem
                            key={object.object_name}
                            onSelect={() => toggleObject(object.object_name)}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center space-x-2">
                              <div
                                className={cn(
                                  'flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                  selectedObjects.includes(object.object_name)
                                    ? 'bg-primary text-primary-foreground'
                                    : 'opacity-50'
                                )}
                              >
                                {selectedObjects.includes(
                                  object.object_name
                                ) && <Check className="h-3 w-3" />}
                              </div>
                              <span>{object.object_name}</span>
                            </div>
                          </CommandItem>
                        ) : null
                      )}
                  </CommandGroup>
                </Command>
              </div>
            </div>
          </div>

          <SheetFooter className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex w-full justify-end space-x-2">
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Role'}
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default RoleCreationDrawer;
