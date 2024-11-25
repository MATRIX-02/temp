import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { LuPenSquare, LuTrash2 } from 'react-icons/lu';
import { HiDotsVertical } from 'react-icons/hi';

const ActionsDropdown = ({
  onEdit,
  onDelete,
  type
}: {
  onEdit: () => void;
  onDelete: () => void;
  type: 'Role' | 'User' | 'Object';
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <HiDotsVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={onEdit}
          className="flex cursor-pointer items-center gap-2"
        >
          <LuPenSquare className="h-4 w-4" />
          <span>Edit {type}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          className="flex cursor-pointer items-center gap-2 text-red-600 focus:text-red-600"
        >
          <LuTrash2 className="h-4 w-4" />
          <span>Delete {type}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionsDropdown;
