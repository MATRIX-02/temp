import { FiInfo, FiCalendar } from 'react-icons/fi';
import { formatDate } from '../functions';

interface RoleInfoGridProps {
  description: string;
  createdOn: string;
  createdBy: string;
  modifiedOn: string;
  modifiedBy: string;
}

export const RoleInfoGrid: React.FC<RoleInfoGridProps> = ({
  description,
  createdOn,
  createdBy,
  modifiedOn,
  modifiedBy
}) => (
  <div className="grid grid-cols-2 gap-4 rounded-lg border bg-gray-50 p-4">
    <div className="col-span-2">
      <div className="flex items-center space-x-2 text-sm">
        <FiInfo className="text-gray-500" />
        <span className="font-medium text-gray-700">Description:</span>
        <span className="text-gray-600">
          {description || 'No description available'}
        </span>
      </div>
    </div>
    <div className="flex items-center space-x-2 text-sm">
      <FiCalendar className="text-gray-500" />
      <span className="font-medium text-gray-700">Created:</span>
      <span className="text-gray-600">
        {formatDate(createdOn)} by {createdBy || 'N/A'}
      </span>
    </div>
    <div className="flex items-center space-x-2 text-sm">
      <FiCalendar className="text-gray-500" />
      <span className="font-medium text-gray-700">Modified:</span>
      <span className="text-gray-600">
        {formatDate(modifiedOn)} by {modifiedBy || 'N/A'}
      </span>
    </div>
  </div>
);
