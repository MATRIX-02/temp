'use client';

import { useState, type PropsWithChildren } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

type TimePeriod =
  | 'last-day'
  | 'last-week'
  | 'last-month'
  | 'last-quarter'
  | 'last-year';

export function SelectTimePeriod({ children }: PropsWithChildren) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('last-day');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Select Time Period</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={timePeriod}
          onValueChange={(e) => setTimePeriod(e as TimePeriod)}
        >
          <DropdownMenuRadioItem value="last-day">
            Last Day
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="last-week">
            Last Week
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="last-month">
            Last Month
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="last-quarter">
            Last Quarter
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="last-year">
            Last Year
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
