import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from './_utils';
import { LuPlus, LuPen, LuCheck } from 'react-icons/lu';
import { HiDotsVertical } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, updateUser } from '@/lib/store/userManagement/userSlice';
import { emptyUser } from './_constants';
import {
  selectedUserSelector,
  updateSelectedUser
} from '@/lib/store/userManagement/selectedUser';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command';
import { selectRoles } from '@/lib/store/roleManagement/rolesSlice';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import UserActionsDropdown from './UserActionDropdown';
import ActionsDropdown from '@/components/ActionDropdown';

function AddUser({ edit }: { selectedUserDetails?: User; edit?: boolean }) {
  const dispatch = useDispatch();
  const allRoles = useSelector(selectRoles);
  const selectedUserDetails = useSelector(selectedUserSelector);
  const [open, setOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState<User>(emptyUser);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  useEffect(() => {
    if (edit && selectedUserDetails) {
      setFormData(selectedUserDetails);
    }
  }, [selectedUserDetails]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const cn = (...inputs) => {
    return twMerge(clsx(inputs));
  };

  const handleUserSave = () => {
    if (edit) {
      dispatch(updateUser(formData));
      dispatch(updateSelectedUser(formData));
    } else {
      dispatch(addUser(formData));
    }
  };
  const toggleRole = (roleName) => {
    setSelectedRoles((current) =>
      current.includes(roleName)
        ? current.filter((name) => name !== roleName)
        : [...current, roleName]
    );
  };

  useEffect(() => {
    const isValid =
      formData.first_name.trim() !== '' &&
      formData.last_name.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.employee_id.trim() !== '';
    setIsFormValid(isValid);
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      handleUserSave();
      setOpen(false);

      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        employee_id: '',
        start_date: '',
        department: '',
        site: '',
        company: '',
        supervisor: '',
        category: [],
        requisition_limit: '',
        role: [],
        substitute_user: '',
        substitute_start_date: '',
        substitute_end_date: '',
        permissions: {
          own: [],
          other: []
        },
        active: true
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {edit ? (
          // <Button variant={'ghost'}>
          //   <HiDotsVertical className=" h-4 w-4" />
          //   {/* <LuPen className="mr-2 h-4 w-4" /> */}
          //   {/* Edit User */}
          // </Button>
          <ActionsDropdown
            onEdit={() => setOpen(true)}
            onDelete={() => {}}
            type="User"
          />
        ) : (
          <Button size="sm" variant="outline">
            <LuPlus className="h-4 w-4" />
            {edit ? 'Edit User' : 'Add User'}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-[500px]">
        <SheetHeader>
          <SheetTitle>{edit ? 'Edit User' : 'Add User'}</SheetTitle>
          <SheetDescription>
            Fill in all user details. Required fields are marked with *
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info & Roles</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              {/* <TabsTrigger value="roles">Roles</TabsTrigger> */}
              <TabsTrigger value="substitute">Substitute</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employee_id">Employee ID *</Label>
                  <Input
                    id="employee_id"
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1 space-y-2">
                  <Label htmlFor="user-active">User Active</Label>
                  <Switch
                    id="user-active"
                    checked={formData.active}
                    onCheckedChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        active: e
                      }));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Roles</Label>
                  <Command className="rounded-lg border shadow-md">
                    <CommandInput placeholder="Search roles..." />
                    <CommandEmpty>No roles found.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-y-auto">
                      {allRoles.map((object) => (
                        <CommandItem
                          key={object.role_name}
                          onSelect={() => toggleRole(object.role_name)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className={cn(
                                'flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                selectedRoles.includes(object.role_name)
                                  ? 'bg-primary text-primary-foreground'
                                  : 'opacity-50'
                              )}
                            >
                              {selectedRoles.includes(object.role_name) && (
                                <LuCheck className="h-3 w-3" />
                              )}
                            </div>
                            <span>{object.role_name}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="employment" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site">Site</Label>
                  <Input
                    id="site"
                    name="site"
                    value={formData.site}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supervisor">Supervisor</Label>
                  <Input
                    id="supervisor"
                    name="supervisor"
                    value={formData.supervisor}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requisition_limit">Requisition Limit</Label>
                  <Input
                    id="requisition_limit"
                    name="requisition_limit"
                    type="number"
                    value={formData.requisition_limit}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="substitute" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="substitute_user">Substitute User</Label>
                  <Input
                    id="substitute_user"
                    name="substitute_user"
                    value={formData.substitute_user}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="substitute_start_date">
                    Substitute Start Date
                  </Label>
                  <Input
                    id="substitute_start_date"
                    name="substitute_start_date"
                    type="date"
                    value={formData.substitute_start_date}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="substitute_end_date">
                    Substitute End Date
                  </Label>
                  <Input
                    id="substitute_end_date"
                    name="substitute_end_date"
                    type="date"
                    value={formData.substitute_end_date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <SheetFooter className="mt-12">
            <Button type="submit" disabled={!isFormValid}>
              {edit ? 'Update User' : 'Add User'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default AddUser;
