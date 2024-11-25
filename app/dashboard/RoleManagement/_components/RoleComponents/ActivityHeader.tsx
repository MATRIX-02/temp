import { FiActivity } from 'react-icons/fi';
import { Button } from '@/components/ui/button';

interface ActivityHeaderProps {
  onResetAll: () => void;
  onEnableAll: () => void;
}

export const ActivityHeader: React.FC<ActivityHeaderProps> = ({
  onResetAll,
  onEnableAll
}) => (
  <div className="flex items-center justify-between pb-4">
    <div className="flex items-center space-x-2">
      <h3 className="text-lg font-semibold text-gray-700">
        <FiActivity className="mr-2 inline-block text-gray-500" />
        Objects & Activities
      </h3>
    </div>
    <div className="flex items-center space-x-4">
      <Button variant="outline" size="sm" onClick={onResetAll}>
        Reset All Objects
      </Button>
      <Button variant="outline" size="sm" onClick={onEnableAll}>
        Enable All Objects
      </Button>
    </div>
  </div>
);
