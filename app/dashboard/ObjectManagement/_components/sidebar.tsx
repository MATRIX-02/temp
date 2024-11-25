import React from 'react';
import { Plus, Search, X } from 'lucide-react';
import { FiPackage } from 'react-icons/fi';
import {
  selectFilteredObjects,
  selectIsSearching,
  selectObject,
  selectSearchQuery,
  selectSelectedObject,
  setSearchQuery,
  startCreatingObject,
  toggleSearch,
  clearSelectedObject
} from '@/lib/store/objectManagement/objectSlice';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ObjectManagementSideBar = () => {
  const dispatch = useAppDispatch();
  const filteredObjects = useAppSelector(selectFilteredObjects);
  const isSearching = useAppSelector(selectIsSearching);
  const searchQuery = useAppSelector(selectSearchQuery);
  const selectedObject = useAppSelector(selectSelectedObject);

  const handleObjectSelect = (objectId: string) => {
    if (selectedObject?.id === objectId) {
      dispatch(clearSelectedObject());
    } else {
      dispatch(selectObject(objectId));
    }
  };

  const handleSearchToggle = () => {
    dispatch(toggleSearch());
    if (isSearching) {
      dispatch(setSearchQuery(''));
    }
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
          <div className="flex w-full items-center justify-between space-x-2">
            <h2 className="text-sm font-semibold text-gray-700">Objects</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSearchToggle}
                className="p-1 text-gray-400 transition-colors hover:text-gray-600"
              >
                <Search className="h-4 w-4" />
              </button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCreateObject}
                className="flex items-center"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Object
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex w-full animate-slide-left items-center space-x-2 rounded-md border bg-white px-2">
            <Search className="h-4 w-4 flex-shrink-0 text-gray-400" />
            <Input
              type="text"
              placeholder="Search objects..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
            <button
              onClick={handleSearchToggle}
              className="flex-shrink-0 p-1 text-gray-400 transition-colors hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Objects List */}
      <div className="flex flex-col space-y-1 overflow-y-auto">
        {filteredObjects.map((obj) => (
          <button
            key={obj.id}
            onClick={() => handleObjectSelect(obj.id)}
            className={`flex cursor-pointer items-center justify-between rounded-sm px-3 py-2 text-left text-sm transition-colors ${
              selectedObject?.id === obj.id
                ? 'bg-purple-50 text-purple-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <FiPackage
                className={`${
                  selectedObject?.id === obj.id
                    ? 'text-purple-500'
                    : 'text-gray-500'
                }`}
              />
              <span className="truncate">{obj.object_name}</span>
            </div>
            {obj.activity.length > 0 && (
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                {obj.activity.length}
              </span>
            )}
          </button>
        ))}

        {filteredObjects.length === 0 && searchQuery && (
          <div className="px-3 py-2 text-sm text-gray-500">
            No objects found
          </div>
        )}
      </div>
    </div>
  );
};

export default ObjectManagementSideBar;
