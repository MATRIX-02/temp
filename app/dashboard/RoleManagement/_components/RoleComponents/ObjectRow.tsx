import { Button } from '@/components/ui/button';
import { FiPackage } from 'react-icons/fi';

interface ObjectRowProps {
  objectName: string;
  objectId: string;
  onReset: (id: string) => void;
  onEnable: (id: string) => void;
}

export const ObjectRow: React.FC<ObjectRowProps> = ({
  objectName,
  objectId,
  onReset,
  onEnable
}) => (
  <tr className="border-b bg-gray-100">
    <td colSpan={2} className="py-3 pl-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiPackage className="text-gray-500" />
          <span className="font-semibold text-gray-800">{objectName}</span>
        </div>
        <div className="flex items-center gap-2 pr-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReset(objectId)}
            className="text-xs"
          >
            Reset All Activity
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEnable(objectId)}
            className="text-xs"
          >
            Enable All Activity
          </Button>
        </div>
      </div>
    </td>
  </tr>
);
