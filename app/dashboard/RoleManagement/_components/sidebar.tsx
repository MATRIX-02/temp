'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FilterState, Role, searchBarStyles } from './_interface';
import { Search, X, Filter, ChevronDown } from 'lucide-react';
import {
  selectSearchQuery,
  selectSelectedRole,
  setSelectedRole,
  selectStatusFilter,
  setSearchQuery,
  setStatusFilter,
  selectRoles
} from '@/lib/store/roleManagement/rolesSlice';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import RoleCreationDrawer from './create-role-dialog';
import { FilterDrawer } from './filterRolesDrawer';

const ModernRoleSidebar: React.FC = () => {
  const searchParams = useSearchParams();
  const selectedRole = useAppSelector(selectSelectedRole);
  const searchQuery = useAppSelector(selectSearchQuery);
  const statusFilter = useAppSelector(selectStatusFilter);
  const rolesData = useAppSelector(selectRoles) as Role[];
  const dispatch = useAppDispatch();

  const [isSearching, setIsSearching] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    objects: [],
    activities: [],
    dataFieldActions: []
  });

  // Handle initial role selection from URL parameter
  useEffect(() => {
    const roleId = searchParams.get('roleId');
    if (roleId && (!selectedRole || selectedRole.role_id !== roleId)) {
      const roleFromUrl = rolesData.find((role) => role.role_id === roleId);
      if (roleFromUrl) {
        dispatch(setSelectedRole(roleFromUrl));
      }
    }
  }, [searchParams, selectedRole, rolesData, dispatch]);

  const handleStatusFilterChange = (filter: 'all' | 'Active' | 'Inactive') => {
    dispatch(setStatusFilter(filter));
  };

  const handleRoleSelect = (role: Role) => {
    dispatch(setSelectedRole(role));
    const url = new URL(window.location.href);
    url.searchParams.set('roleId', role.role_id);
    window.history.pushState({}, '', url.toString());
  };

  const checkRoleMatchesFilters = (role: Role) => {
    // Check objects
    if (activeFilters.objects.length > 0) {
      const hasMatchingObject = role.object?.some((obj) =>
        activeFilters.objects.includes(obj.object_name)
      );
      if (!hasMatchingObject) return false;
    }

    // Check activities
    if (activeFilters.activities.length > 0) {
      const hasMatchingActivity = role.object?.some((obj) => {
        // Skip if object doesn't match filter
        if (
          activeFilters.objects.length > 0 &&
          !activeFilters.objects.includes(obj.object_name)
        ) {
          return false;
        }

        return obj.activity.some(
          (act) =>
            // Match activity name AND check status
            activeFilters.activities.includes(act.activity_name) &&
            act.status === true
        );
      });
      if (!hasMatchingActivity) return false;
    }

    // Check data field actions
    if (activeFilters.dataFieldActions.length > 0) {
      const hasMatchingAction = role.object?.some((obj) => {
        // Skip if object doesn't match filter
        if (
          activeFilters.objects.length > 0 &&
          !activeFilters.objects.includes(obj.object_name)
        ) {
          return false;
        }

        return obj.activity.some((act) => {
          // Skip if activity doesn't match filter or status is false
          if (
            (activeFilters.activities.length > 0 &&
              !activeFilters.activities.includes(act.activity_name)) ||
            act.status === false
          ) {
            return false;
          }

          // Check each selected data field action
          return activeFilters.dataFieldActions.every((selectedAction) => {
            const matchingAction = act.data_field_actions.find(
              (action) => action.label === selectedAction
            );
            // Return true only if the action exists and its status is true
            return matchingAction?.status === true;
          });
        });
      });
      if (!hasMatchingAction) return false;
    }
    return true;
  };

  const filteredRoles = useMemo(() => {
    return rolesData.filter((role: Role) => {
      const matchesSearch = role.role_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || statusFilter === role.status;

      const matchesFilters =
        Object.values(activeFilters).every(
          (filterArray) => filterArray.length === 0
        ) || checkRoleMatchesFilters(role);

      return matchesSearch && matchesStatus && matchesFilters;
    });
  }, [searchQuery, statusFilter, rolesData, activeFilters]);

  const toggleSearch = () => {
    setIsSearching(!isSearching);
    if (!isSearching) {
      dispatch(setSearchQuery(''));
    }
  };

  return (
    <div className="mt-10 flex w-64 flex-col space-y-4">
      {/* Header with Search */}
      <div className="flex items-center px-3">
        {!isSearching ? (
          <>
            <h2 className="flex-1 text-sm font-semibold text-gray-700">
              Roles
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={toggleSearch}
                className="p-1 text-gray-400 transition-colors hover:text-gray-600"
              >
                <Search className="h-4 w-4" />
              </button>
              <FilterDrawer
                roles={rolesData}
                onFilterChange={setActiveFilters}
              />
              <RoleCreationDrawer />
            </div>
          </>
        ) : (
          <div className="flex w-full animate-slide-left items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
              autoFocus
            />
            <button
              onClick={toggleSearch}
              className="p-1 text-gray-400 transition-colors hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Status Filter */}
      <div className="flex space-x-2 px-3">
        <button
          onClick={() => handleStatusFilterChange('all')}
          className={`rounded-md px-3 py-1 text-xs ${
            statusFilter === 'all'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          All
        </button>
        <button
          onClick={() => handleStatusFilterChange('Active')}
          className={`rounded-md px-3 py-1 text-xs ${
            statusFilter === 'Active'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => handleStatusFilterChange('Inactive')}
          className={`rounded-md px-3 py-1 text-xs ${
            statusFilter === 'Inactive'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Inactive
        </button>
      </div>
      {/* Roles List */}
      <div className="flex flex-col space-y-1">
        {filteredRoles.map((role: Role) => (
          <button
            key={role.role_id}
            onClick={() => handleRoleSelect(role)}
            className={`flex cursor-pointer items-center justify-between rounded-sm px-3 py-2 text-left text-sm transition-colors ${
              selectedRole?.role_id === role.role_id
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-2">
              {role.icon}
              <span>{role.role_name}</span>
            </div>
            {role.status === 'Active' ? (
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            ) : (
              <span className="flex h-2 w-2 rounded-full bg-rose-400" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModernRoleSidebar;
