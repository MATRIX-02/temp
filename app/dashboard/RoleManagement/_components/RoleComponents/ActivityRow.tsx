import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { TooltipWrapper } from '../TooltipWrapper';

interface ActivityRowProps {
  activityName: string;
  actions: Array<{ label: string; description: string }>;
  isActive: boolean;
  selectedTasks: string[];
  onActivityToggle: (name: string) => void;
  onTaskSelect: (activity: string, action: string) => void;
}

export const ActivityRow: React.FC<ActivityRowProps> = ({
  activityName,
  actions,
  isActive,
  selectedTasks,
  onActivityToggle,
  onTaskSelect
}) => (
  <tr className="border-b last:border-b-0">
    <td className="py-3 pl-10">
      <div className="flex items-center gap-2">
        <Switch
          id={`${activityName}-switch`}
          checked={isActive}
          onCheckedChange={() => onActivityToggle(activityName)}
        />
        <span className="text-sm text-gray-600">{activityName}</span>
      </div>
    </td>
    <td className="py-3 pl-4">
      <div className="flex flex-wrap gap-4">
        {actions.map((action, index) => (
          <div key={index} className="flex items-center gap-2">
            <Checkbox
              id={`${activityName}-${action.label}`}
              checked={selectedTasks.includes(action.label)}
              onCheckedChange={() => onTaskSelect(activityName, action.label)}
              disabled={!isActive}
            />
            <TooltipWrapper content={action.description || ''}>
              <label
                htmlFor={`${activityName}-${action.label}`}
                className={`cursor-pointer text-sm ${
                  isActive ? 'text-gray-600' : 'text-gray-400'
                }`}
              >
                {action.label || 'Unnamed Action'}
              </label>
            </TooltipWrapper>
          </div>
        ))}
      </div>
    </td>
  </tr>
);
