import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { Search, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { searchBarStyles } from './_interface';

export const FilterSection = ({
  title,
  items,
  selectedItems,
  onItemToggle,
  onClearFilters,
  disabled = false
}: {
  title: string;
  items: string[];
  selectedItems: string[];
  onItemToggle: (item: string) => void;
  onClearFilters: () => void;
  disabled?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  if (items.length === 0) return null;

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSearch = () => {
    setIsSearching(!isSearching);
    if (!isSearching) {
      setSearchQuery('');
    }
  };

  return (
    <>
      <style>{searchBarStyles}</style>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
        <div className="flex items-center justify-between">
          <CollapsibleTrigger
            className={`flex items-center space-x-1 py-2 text-sm font-medium ${
              disabled ? 'text-gray-400' : ''
            }`}
            disabled={disabled}
          >
            <span>{title}</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>
          <div className="flex items-center space-x-2">
            {selectedItems.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClearFilters();
                }}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSearch();
              }}
              className="p-1 text-gray-400 transition-colors hover:text-gray-600"
              disabled={disabled}
            >
              {isSearching ? (
                <X className="h-4 w-4" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        <CollapsibleContent>
          <div className="space-y-2">
            {/* Search Bar Container */}
            <div className="h-[34px]">
              {' '}
              {/* Fixed height container to prevent content shift */}
              {isSearching && (
                <div className="search-bar-enter flex w-full items-center space-x-2 rounded-md border border-gray-200 px-2 py-1">
                  <Search className="h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search ${title.toLowerCase()}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="grid grid-cols-2 gap-2">
              {filteredItems.map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={item}
                    checked={selectedItems.includes(item)}
                    onCheckedChange={() => onItemToggle(item)}
                    disabled={disabled}
                  />
                  <label
                    htmlFor={item}
                    className={`text-sm ${
                      disabled ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {item}
                  </label>
                </div>
              ))}
            </div>
            {filteredItems.length === 0 && searchQuery && (
              <p className="text-center text-sm text-gray-500">
                No results found
              </p>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};
