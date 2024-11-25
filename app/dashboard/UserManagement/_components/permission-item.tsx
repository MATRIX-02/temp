'use client';
import { Button } from '@/components/ui/button';
import { Permission } from './_utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Check, X } from 'lucide-react';
const PermissionDetails = ({
  label,
  details
}: {
  label: string;
  details: string[];
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="whitespace-nowrap text-xs">
          {details.length} {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Permitted {label}</DialogTitle>
          <DialogDescription>
            The user has permissions in the following {label.toLowerCase()}:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 divide-y">
          {details.map((item, idx) => (
            <div key={idx} className="py-2">
              {item}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export const PermissionItem = ({ permission }: { permission: Permission }) => {
  return (
    <div className="flex items-center justify-between border-b p-2 last:border-b-0">
      <div className="flex items-center space-x-4">
        {/* Permission Name */}
        <span className="font-medium">{permission.name}</span>

        {/* Permission Status */}
        {permission.status ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <X className="h-4 w-4 text-red-500" />
        )}
      </div>

      {/* Permission Details */}
      <div className="flex items-center space-x-4">
        {permission.department && (
          <PermissionDetails
            label="Departments"
            details={permission.department}
          />
        )}
        {permission.site && (
          <PermissionDetails label="Sites" details={permission.site} />
        )}
        {permission.company && (
          <PermissionDetails label="Companies" details={permission.company} />
        )}
        {permission.category && (
          <PermissionDetails label="Categories" details={permission.category} />
        )}
      </div>
    </div>
  );
};
