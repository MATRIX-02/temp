import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ActionsDropdown from '@/components/ActionDropdown';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import DeleteRoleDialog from './DeleteRoleDialog';

interface RoleHeaderProps {
  roleName: string;
  roleId: string;
  status: string;
  isSheetOpen: boolean;
  setIsSheetOpen: (open: boolean) => void;
}

export const RoleHeader: React.FC<RoleHeaderProps> = ({
  roleName,
  roleId,
  status,
  isSheetOpen,
  setIsSheetOpen
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <CardHeader className="space-y-0 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <CardTitle className="text-xl font-bold text-gray-800">
                {roleName || 'Unnamed Role'}
              </CardTitle>
              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                <span>ID: {roleId || 'N/A'}</span>
                <Badge variant="outline" className="px-3 py-1">
                  {status || 'N/A'}
                </Badge>
              </div>
            </div>
          </div>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <ActionsDropdown
                onEdit={() => setIsSheetOpen(true)}
                onDelete={() => setIsDeleteDialogOpen(true)}
                type="Role"
              />
            </SheetTrigger>
          </Sheet>
        </div>
      </CardHeader>

      <DeleteRoleDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        roleId={roleId}
        roleName={roleName}
      />
    </>
  );
};
