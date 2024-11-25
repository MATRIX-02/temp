'use client';
import { LuClock, LuMoreVertical } from 'react-icons/lu';
import { SelectTimePeriod } from './select-time-period';

export function ActionButtons() {
  return (
    <div className="flex gap-1">
      <SelectTimePeriod>
        <button className="rounded-full p-1 transition-colors hover:bg-purple-100">
          <LuClock className="size-5 text-gray-600" />
        </button>
      </SelectTimePeriod>
      <button className="rounded-full p-1 transition-colors hover:bg-purple-100">
        <LuMoreVertical className="size-5 text-gray-600" />
      </button>
    </div>
  );
}
