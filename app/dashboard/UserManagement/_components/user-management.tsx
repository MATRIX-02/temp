'use client';
import React, { useMemo, useState } from 'react';
import {
  Search,
  ChevronDown,
  Check,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

// import { usersData } from './_constants';
import { PermissionItem } from './permission-item';
import AddUser from './AddUser';
import { User } from './_utils';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, usersSelector } from '@/lib/store/userManagement/userSlice';
import { LiaUserEditSolid } from 'react-icons/lia';
import UserList from './UserList';

const UserManagementList = () => {
  const usersData = useSelector(usersSelector) || [];
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return usersData;

    const searchLower = searchQuery.toLowerCase().trim();

    return usersData.filter((user) => {
      const searchableFields = [
        user.first_name,
        user.last_name,
        user.email,
        user.employee_id,
        user.department,
        user.site,
        user.company,
        user.supervisor,
        user.role.map((role) => role.role_name),
        ...user.category
      ];

      // Join all fields into a single string for searching
      const userDataString = searchableFields
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return userDataString.includes(searchLower);
    });
  }, [usersData, searchQuery]);
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  return (
    <div className="mx-auto h-[calc(100vh-64px)] w-[100%] overflow-y-auto">
      <UserList />
    </div>
  );
};
export default UserManagementList;
