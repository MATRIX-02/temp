import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Filter } from 'lucide-react';

import { useMemo, useState } from 'react';
import { extractUniqueValues } from '../functions';
import { FilterSection } from './filterSection';
import { FilterState, Role } from '../_interface';

export const FilterDrawer = ({
  roles,
  onFilterChange
}: {
  roles: Role[];
  onFilterChange: (filters: FilterState) => void;
}) => {
  const uniqueValues = useMemo(() => extractUniqueValues(roles), [roles]);

  const [filters, setFilters] = useState<FilterState>({
    objects: [],
    activities: [],
    dataFieldActions: []
  });

  // Get available activities based on selected objects
  const getAvailableActivities = useMemo(() => {
    if (filters.objects.length === 0) return uniqueValues.activities;
    if (filters.objects.length > 1) return [];

    const selectedObject = filters.objects[0];
    const activities = new Set<string>();

    roles.forEach((role) => {
      role.object?.forEach((obj) => {
        if (obj.object_name === selectedObject) {
          obj.activity.forEach((activity) => {
            activities.add(activity.activity_name);
          });
        }
      });
    });

    return Array.from(activities);
  }, [filters.objects, roles, uniqueValues.activities]);

  // Get available data field actions based on selected activities
  const getAvailableDataFieldActions = useMemo(() => {
    if (filters.activities.length === 0) return uniqueValues.dataFieldActions;
    if (filters.activities.length > 1) return [];
    if (filters.objects.length !== 1) return [];

    const selectedObject = filters.objects[0];
    const selectedActivity = filters.activities[0];
    const actions = new Set<string>();

    roles.forEach((role) => {
      role.object?.forEach((obj) => {
        if (obj.object_name === selectedObject) {
          obj.activity.forEach((activity) => {
            if (activity.activity_name === selectedActivity) {
              activity.data_field_actions.forEach((action) => {
                actions.add(action.label);
              });
            }
          });
        }
      });
    });

    return Array.from(actions);
  }, [
    filters.objects,
    filters.activities,
    roles,
    uniqueValues.dataFieldActions
  ]);

  const handleFilterToggle = (category: keyof FilterState, item: string) => {
    setFilters((prev) => {
      const updated = {
        ...prev,
        [category]: prev[category].includes(item)
          ? prev[category].filter((i) => i !== item)
          : [...prev[category], item]
      };

      // Reset dependent filters when multiple selections are made
      if (category === 'objects') {
        if (updated.objects.length !== 1) {
          updated.activities = [];
          updated.dataFieldActions = [];
        }
      }
      if (category === 'activities') {
        if (updated.activities.length !== 1) {
          updated.dataFieldActions = [];
        }
      }

      onFilterChange(updated);
      return updated;
    });
  };

  const handleClearFilters = (category: keyof FilterState) => {
    setFilters((prev) => {
      const updated = { ...prev, [category]: [] };

      // Clear dependent filters
      if (category === 'objects') {
        updated.activities = [];
        updated.dataFieldActions = [];
      } else if (category === 'activities') {
        updated.dataFieldActions = [];
      }

      onFilterChange(updated);
      return updated;
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-1 text-gray-400 transition-colors hover:text-gray-600">
          <Filter className="h-4 w-4" />
        </button>
      </SheetTrigger>
      <SheetContent className="w-[40vw] min-w-[700px]">
        <SheetHeader className="flex  justify-between">
          <SheetTitle className="text-[1.4rem] font-bold">
            Filter Roles
          </SheetTitle>
          {Object.values(filters).some((arr) => arr.length > 0) && (
            <button
              onClick={() =>
                setFilters({
                  objects: [],
                  activities: [],
                  dataFieldActions: []
                })
              }
              className=" text-right text-sm font-bold text-gray-500 underline hover:text-gray-700"
            >
              Clear all filters
            </button>
          )}
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-80px)] px-4">
          <div className="space-y-4 py-4">
            <FilterSection
              title="Objects"
              items={uniqueValues.objects}
              selectedItems={filters.objects}
              onItemToggle={(item) => handleFilterToggle('objects', item)}
              onClearFilters={() => handleClearFilters('objects')}
            />
            <FilterSection
              title="Activities"
              items={getAvailableActivities}
              selectedItems={filters.activities}
              onItemToggle={(item) => handleFilterToggle('activities', item)}
              onClearFilters={() => handleClearFilters('activities')}
              disabled={filters.objects.length !== 1}
            />
            <FilterSection
              title="Data Field Actions"
              items={getAvailableDataFieldActions}
              selectedItems={filters.dataFieldActions}
              onItemToggle={(item) =>
                handleFilterToggle('dataFieldActions', item)
              }
              onClearFilters={() => handleClearFilters('dataFieldActions')}
              disabled={
                filters.activities.length !== 1 || filters.objects.length !== 1
              }
            />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
