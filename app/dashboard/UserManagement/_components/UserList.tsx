'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LuUser, LuSearch } from 'react-icons/lu';
import { User as UserType } from './_utils';
import AddUser from './AddUser';
import { useDispatch, useSelector } from 'react-redux';
import { usersSelector } from '@/lib/store/userManagement/userSlice';
import UserDetails from './UserDetails';
import { emptyUser } from './_constants';
import Pagination from '@/components/Pagination';
import {
  selectedUserSelector,
  updateSelectedUser
} from '@/lib/store/userManagement/selectedUser';
import {
  updateUserFilter,
  userFiltersSelector
} from '@/lib/store/userManagement/userManagementFilters';
import { setStatusFilter } from '@/lib/store/roleManagement/rolesSlice';

const USERS_PER_PAGE = 6;

const UserList = () => {
  const dispatch = useDispatch();
  const usersFilters = useSelector(userFiltersSelector);
  const selectedUserDetails = useSelector(selectedUserSelector);
  const [selectedUser, setSelectedUser] = useState<UserType>(emptyUser);
  const [activeFilter, setActiveFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const users = useSelector(usersSelector);

  // Combined filtering function that handles both search and active status
  const filteredUsers = users.filter((user) => {
    // First, check the active status filter
    if (usersFilters.activeStatus !== 'All') {
      const isActive = usersFilters.activeStatus === 'Active';
      if (user.active !== isActive) return false;
    }

    // Then, apply the search filter
    const searchTerm = searchQuery.toLowerCase();
    return (
      user.first_name.toLowerCase().includes(searchTerm) ||
      user.last_name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.employee_id.toLowerCase().includes(searchTerm) ||
      user.department.toLowerCase().includes(searchTerm) ||
      user.site.toLowerCase().includes(searchTerm)
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + USERS_PER_PAGE
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusFilterChange = (filter: 'All' | 'Active' | 'Inactive') => {
    dispatch(updateUserFilter(filter));
    setCurrentPage(1); // Reset to first page when changing filters
  };

  const setSelectedUserHandler = (user: UserType) => {
    dispatch(updateSelectedUser(user));
  };

  useEffect(() => {
    if (selectedUser) {
      const updatedUser = users.find(
        (u) => u.employee_id === selectedUser.employee_id
      );
      if (updatedUser && updatedUser !== selectedUser) {
        setSelectedUser(updatedUser);
        dispatch(updateSelectedUser(updatedUser));
      }
    }
  }, [users, selectedUser]);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left Sidebar */}
      <div className="mt-6 w-80 border-r">
        <div className="flex h-full w-full flex-col">
          <div className="space-y-3 p-4 pb-0">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold">User List</h2>
              <AddUser userData={{}} />
            </div>

            <div className="relative">
              <LuSearch className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div className="flex space-x-2 px-3">
              <button
                onClick={() => handleStatusFilterChange('All')}
                className={`rounded-md px-3 py-1 text-xs ${
                  usersFilters.activeStatus === 'All'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleStatusFilterChange('Active')}
                className={`rounded-md px-3 py-1 text-xs ${
                  usersFilters.activeStatus === 'Active'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => handleStatusFilterChange('Inactive')}
                className={`rounded-md px-3 py-1 text-xs ${
                  usersFilters.activeStatus === 'Inactive'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Inactive
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto p-4 pb-0">
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user: UserType) => (
                <Card
                  key={user.employee_id}
                  className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedUserDetails?.employee_id === user.employee_id
                      ? 'border-blue-500'
                      : ''
                  }`}
                  onClick={() => setSelectedUserHandler(user)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {user.profile_picture ? (
                          <div className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-200">
                            <img
                              src={user.profile_picture}
                              alt="Profile"
                              className="h-full w-full rounded-full object-cover"
                            />
                            <span
                              className={`absolute right-[-1px] top-[-1px] block h-3 w-3 rounded-full border-2 border-white ${
                                user.active ? 'bg-green-500' : 'bg-red-500'
                              }`}
                            ></span>
                          </div>
                        ) : (
                          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                            <LuUser className="h-6 w-6 text-gray-600" />
                            <span
                              className={`absolute right-[-1px] top-[-1px] block h-3 w-3 rounded-full border-2 border-white ${
                                user.active ? 'bg-green-500' : 'bg-red-500'
                              }`}
                            ></span>
                          </div>
                        )}
                        <div>
                          <h3 className="flex w-full flex-row items-center gap-2 font-medium">
                            {`${user.first_name} ${user.last_name}`}{' '}
                          </h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {user.category.map((cat) => (
                        <Badge
                          key={cat}
                          variant="secondary"
                          className="text-xs"
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex h-32 items-center justify-center text-center text-gray-500">
                No users found matching your search
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-center pb-4">
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              maxDisplayedPages={3}
            />
          )}
        </div>
      </div>

      <UserDetails />
    </div>
  );
};

export default UserList;
