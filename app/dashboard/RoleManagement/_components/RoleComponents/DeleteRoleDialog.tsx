import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useDeleteRoleMutation } from '@/lib/store/roleManagement/rtk_query';
// import { useToast } from '@/components/ui/use-toast';

interface DeleteRoleDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  roleId: string;
  roleName: string;
}

const DeleteRoleDialog: React.FC<DeleteRoleDialogProps> = ({
  isOpen,
  setIsOpen,
  roleId,
  roleName
}) => {
  //   const { toast } = useToast();
  const [deleteRole, { isLoading }] = useDeleteRoleMutation();

  const handleDelete = async () => {
    try {
      await deleteRole(roleId).unwrap();
      //   toast({
      //     title: 'Role deleted',
      //     description: `${roleName} has been successfully deleted.`
      //   });
      setIsOpen(false);
    } catch (error) {
      //   toast({
      //     title: 'Error',
      //     description: 'Failed to delete role. Please try again.',
      //     variant: 'destructive'
      //   });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Role</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the role "{roleName}"? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteRoleDialog;
