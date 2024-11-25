import React from 'react';
import { Plus, Search, X } from 'lucide-react';
import { FiPackage, FiPlus } from 'react-icons/fi';
import {
  selectFilteredObjects,
  selectIsSearching,
  selectObject,
  selectSearchQuery,
  selectSelectedObject,
  setSearchQuery,
  startCreatingObject,
  toggleSearch
} from '@/lib/store/objectManagement/objectSlice';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { Button } from '@/components/ui/button';
const ObjectManagementSideBar = () => {
  const dispatch = useAppDispatch();
  const filteredObjects = useAppSelector(selectFilteredObjects);
  const isSearching = useAppSelector(selectIsSearching);
  const searchQuery = useAppSelector(selectSearchQuery);
  const selectedObject = useAppSelector(selectSelectedObject);
  const handleObjectSelect = (objectName: string) => {
    dispatch(selectObject(objectName));
  };

  const handleSearchToggle = () => {
    dispatch(toggleSearch());
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleCreateObject = () => {
    dispatch(startCreatingObject());
  };
  return (
    <div className="mt-10 flex w-64 flex-col space-y-4">
      {/* Header with Search */}
      <div className="flex items-center px-3">
        {!isSearching ? (
          <>
            <h2 className="flex-1 text-sm font-semibold text-gray-700">
              Objects
            </h2>
            <button
              onClick={handleSearchToggle}
              className="p-1 text-gray-400 transition-colors hover:text-gray-600"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              onClick={handleCreateObject}
              className="text-grey p-1 transition-colors hover:text-gray-600"
            >
              <Button size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Object
              </Button>
            </button>
          </>
        ) : (
          <div className="flex w-full animate-slide-left items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search objects..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
              autoFocus
            />
            <button
              onClick={handleSearchToggle}
              className="p-1 text-gray-400 transition-colors hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Objects List */}
      <div className="flex flex-col space-y-1">
        {filteredObjects.map((obj) => (
          <button
            key={obj.object_name}
            onClick={() => handleObjectSelect(obj.object_name)}
            className={`flex cursor-pointer items-center justify-between rounded-sm px-3 py-2 text-left text-sm transition-colors ${
              selectedObject?.object_name === obj.object_name
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <FiPackage className="text-gray-500" />
              <span>{obj.object_name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ObjectManagementSideBar;
