'use client';
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LuBriefcase,
  LuUser,
  LuUsers,
  LuWrench,
  LuExternalLink,
  LuArrowLeft,
  LuUserX,
  LuMousePointerClick,
  LuCircle
} from 'react-icons/lu';
import { User as UserType } from './_utils';
import AddUser from './AddUser';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfilePicture } from '@/lib/store/userManagement/userSlice';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import EditUserProfile from './EditUserProfile';
import { useRouter } from 'next/navigation';
import {
  selectedUserSelector,
  updateSelectedUser
} from '@/lib/store/userManagement/selectedUser';

function UserDetails() {
  const selectedUserDetails = useSelector(selectedUserSelector);
  const dispatch = useDispatch();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    aspect: 1,
    x: 0,
    y: 0,
    height: 100
  });
  const [showCropDialog, setShowCropDialog] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];
    const month = months[date.getMonth()];
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const clickInputField = () => {
    fileInputRef.current?.click();
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropWidth = Math.min(width, height);
    const x = (width - cropWidth) / 2;
    const y = (height - cropWidth) / 2;

    setCrop({
      unit: 'px',
      width: cropWidth,
      height: cropWidth,
      x,
      y,
      aspect: 1
    });
  };

  const getCroppedImage = (image: HTMLImageElement, crop: Crop): string => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width!;
    canvas.height = crop.height!;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(
        image,
        crop.x! * scaleX,
        crop.y! * scaleY,
        crop.width! * scaleX,
        crop.height! * scaleY,
        0,
        0,
        crop.width!,
        crop.height!
      );
    }

    return canvas.toDataURL('image/jpeg');
  };

  const handleProfilePictureUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files![0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          setSelectedImage(result);
          setShowCropDialog(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = () => {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImageUrl = getCroppedImage(imgRef.current, crop);
      dispatch(
        updateProfilePicture({
          profile_picture: croppedImageUrl,
          employee_id: selectedUserDetails.employee_id
        })
      );
      dispatch(
        updateSelectedUser({
          ...selectedUserDetails,
          profile_picture: croppedImageUrl
        })
      );
      setShowCropDialog(false);
      setSelectedImage(null);
    }
  };

  const redirectToRolePage = (roleId: string): void => {
    router.push(`/dashboard/RoleManagement?roleId=${roleId}`);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h1 className="mb-4 text-2xl font-bold">User Management</h1>

      {selectedUserDetails.first_name ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                className="hidden"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                ref={fileInputRef}
              />
              <EditUserProfile
                profilePicture={selectedUserDetails.profile_picture}
                clickInputField={clickInputField}
                active={selectedUserDetails.active}
              />

              <div className="ml-3">
                <h1 className="flex flex-row items-center gap-2 text-xl font-bold">
                  {`${selectedUserDetails.first_name} ${selectedUserDetails.last_name}`}
                </h1>
                <p className="text-gray-500">{selectedUserDetails.email}</p>
              </div>
            </div>
            <AddUser edit />
          </div>

          {/* Image Cropping Dialog */}
          <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Crop Profile Picture</DialogTitle>
              </DialogHeader>
              <div className="align-center flex justify-center">
                {selectedImage && (
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    aspect={1}
                    circularCrop
                  >
                    <img
                      ref={imgRef}
                      src={selectedImage}
                      alt="Crop preview"
                      onLoad={handleImageLoad}
                      className="max-h-[50px] w-auto"
                    />
                  </ReactCrop>
                )}
              </div>
              <div className=" flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCropDialog(false);
                    setSelectedImage(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleCropComplete}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex gap-2">
            {selectedUserDetails.category.map((cat) => (
              <Badge key={cat} variant="secondary">
                {cat}
              </Badge>
            ))}
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="roles">Roles</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LuUser className="h-5 w-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Employee ID
                      </label>
                      <p className="mt-1">{selectedUserDetails.employee_id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Start Date
                      </label>
                      <p className="mt-1">
                        {formatDate(selectedUserDetails.start_date)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Department
                      </label>
                      <p className="mt-1">{selectedUserDetails.department}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Site
                      </label>
                      <p className="mt-1">{selectedUserDetails.site}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Company
                      </label>
                      <p className="mt-1">{selectedUserDetails.company}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Supervisor
                      </label>
                      <p className="mt-1">{selectedUserDetails.supervisor}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LuUsers className="h-5 w-5" />
                      Substitution Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Substitute User
                      </label>
                      <p className="mt-1">
                        {selectedUserDetails.substitute_user}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Substitution Period
                      </label>
                      <p className="mt-1">
                        {formatDate(selectedUserDetails.substitute_start_date!)}{' '}
                        - {formatDate(selectedUserDetails.substitute_end_date!)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="roles">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LuBriefcase className="h-5 w-5" />
                    Role Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedUserDetails.role.map((role, index) => (
                    <div
                      key={`${role.role_id}-${index}`}
                      className="border-b pb-6 last:border-b-0 last:pb-0"
                    >
                      <div className="mb-4">
                        <h3
                          className="flex w-max cursor-pointer items-center gap-1 text-lg font-semibold "
                          onClick={() => redirectToRolePage(role.role_id)}
                        >
                          {role.role_name}
                          <Badge
                            variant="outline"
                            className="bg-primary text-secondary"
                          >
                            Manage
                          </Badge>
                        </h3>
                        <p className="text-sm text-gray-500">
                          {role.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="mr-1 font-medium">Status:</span>{' '}
                          <Badge
                            variant={
                              role.status === 'Active' ? 'default' : 'secondary'
                            }
                          >
                            {role.status}
                          </Badge>
                        </div>
                        <div>
                          <span className="font-medium">Role ID:</span>{' '}
                          {role.role_id}
                        </div>
                        <div>
                          <span className="font-medium">Created By:</span>{' '}
                          {role.created_by}
                        </div>
                        <div>
                          <span className="font-medium">Created On:</span>{' '}
                          {formatDate(role.created_on)}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="permissions">
              <Card className="mt-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LuWrench className="h-5 w-5" />
                    Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Own Permissions */}
                  <div>
                    <h3 className="mb-4 text-base font-semibold">
                      Own Permissions
                    </h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      {selectedUserDetails.permissions.own.map((perm) => (
                        <div
                          key={perm.name}
                          className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4"
                        >
                          <span className="font-medium">{perm.name}</span>
                          <Badge
                            variant={perm.status ? 'default' : 'secondary'}
                          >
                            {perm.status ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Other Permissions */}
                  <div>
                    <h3 className="mb-4 text-base font-semibold">
                      Other Permissions
                    </h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      {selectedUserDetails.permissions.other.map((perm) => (
                        <div
                          key={perm.name}
                          className="rounded-lg border border-slate-200 bg-white"
                        >
                          {/* Main Permission Info */}
                          <div className="flex items-center justify-between border-b border-slate-200 p-4">
                            <span className="font-medium">{perm.name}</span>
                            <Badge
                              variant={perm.status ? 'default' : 'secondary'}
                            >
                              {perm.status ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </div>

                          {/* Additional Details */}
                          <div className="space-y-3 p-4">
                            {perm.department!.length > 0 && (
                              <div>
                                <span className="mb-2 block text-sm text-slate-500">
                                  Departments
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {perm.department!.map((dept) => (
                                    <Badge
                                      key={dept}
                                      variant="outline"
                                      className="bg-white"
                                    >
                                      {dept}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {perm.site!.length > 0 && (
                              <div>
                                <span className="mb-2 block text-sm text-slate-500">
                                  Sites
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {perm.site!.map((site) => (
                                    <Badge
                                      key={site}
                                      variant="outline"
                                      className="bg-white"
                                    >
                                      {site}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="mt-[15%] flex flex-col items-center justify-center space-y-8 p-8 text-center">
          <div className="relative">
            <div className="rounded-full bg-gray-50 p-8">
              <LuUser className="h-16 w-16 text-gray-300" />
            </div>
          </div>
          <div className="relative max-w-sm space-y-2">
            <h3 className="text-xl font-medium text-gray-900">Select a User</h3>
            <p className="text-sm text-gray-500">
              Choose a user from the list to view their profile information
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDetails;
