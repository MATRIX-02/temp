'use client';

import { Clock, MoreVertical } from 'lucide-react';
import { SelectTimePeriod } from './select-time-period';

export function ActionButtons() {
  return (
    <div className="flex gap-1">
      <SelectTimePeriod>
        <button className="rounded-full p-1 transition-colors hover:bg-purple-100">
          <Clock className="size-5 text-gray-600" />
        </button>
      </SelectTimePeriod>
      <button className="rounded-full p-1 transition-colors hover:bg-purple-100">
        <MoreVertical className="size-5 text-gray-600" />
      </button>
    </div>
  );
}
