import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from './_utils';
import { Edit2, Plus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addUser, updateUser } from '@/lib/store/userManagement/userSlice';
import { emptyUser } from './_constants';

function AddUser({ userData, edit }: { userData?: User; edit?: boolean }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState<User>(emptyUser);

  useEffect(() => {
    if (edit && userData) {
      setFormData(userData);
    }
  }, [userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  console.log(userData);

  const handleUserSave = () => {
    if (edit) {
      dispatch(updateUser(formData));
    } else {
      dispatch(addUser(formData));
      console.log(formData);
    }
  };

  useEffect(() => {
    // Check if all required fields are filled
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

  const handleUserActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.checked);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {edit ? (
          <Button>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit User
          </Button>
        ) : (
          <Button size="sm" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            Fill in all user details. Required fields are marked with *
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="roles">Roles</TabsTrigger>
              <TabsTrigger value="substitute">Substitute</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                    // value={userData.active}
                    onCheckedChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        active: e
                      }));
                    }}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="employment" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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

            <TabsContent value="roles" className="space-y-4">
              <div className="space-y-2">
                <Label>Roles will be configured separately</Label>
              </div>
            </TabsContent>

            <TabsContent value="substitute" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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

          <DialogFooter className="mt-6">
            <Button type="submit" disabled={!isFormValid}>
              {edit ? 'Update User' : 'Add User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddUser;
