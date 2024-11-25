import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface EditRoleFormData {
  role_name: string;
  role_id: string;
  description: string;
  status: 'Active' | 'Inactive';
}

interface EditRoleSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: EditRoleFormData;
  onFormChange: (updates: Partial<EditRoleFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const EditRoleSheet: React.FC<EditRoleSheetProps> = ({
  isOpen,
  onOpenChange,
  formData,
  onFormChange,
  onSubmit
}) => (
  <Sheet open={isOpen} onOpenChange={onOpenChange}>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Edit Role</SheetTitle>
      </SheetHeader>
      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="role_name">Role Name</Label>
          <Input
            id="role_name"
            value={formData.role_name}
            onChange={(e) => onFormChange({ role_name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role_id">Role ID</Label>
          <Input
            id="role_id"
            value={formData.role_id}
            onChange={(e) => onFormChange({ role_id: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => onFormChange({ description: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.status === 'Active'}
              onCheckedChange={(checked) =>
                onFormChange({ status: checked ? 'Active' : 'Inactive' })
              }
            />
            <span>{formData.status}</span>
          </div>
        </div>
        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </SheetContent>
  </Sheet>
);
