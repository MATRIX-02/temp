import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

interface IconButtonProps {
  icon: React.ElementType;
  onClick: () => void;
  disabled?: boolean;
  label: string;
}

interface PageButtonProps {
  page: number;
  isActive: boolean;
  onClick: () => void;
}

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  onClick,
  disabled,
  label
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="rounded-lg p-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
    aria-label={label}
  >
    <Icon className="h-4 w-4" />
  </button>
);

const PageButton: React.FC<PageButtonProps> = ({ page, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`rounded-lg px-3 py-2 ${
      isActive
        ? 'bg-[#6016e9] text-white hover:bg-[#6016e9e6]'
        : 'text-gray-700 hover:bg-gray-100'
    }`}
  >
    {page}
  </button>
);

const Ellipsis: React.FC = () => (
  <span className="px-3 py-2 text-gray-400">...</span>
);

const Pagination: React.FC<PaginationProps> = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {}
}) => {
  const getVisiblePages = () => {
    const delta = 1; // Number of pages to show on each side of current page
    const pages: (number | string)[] = [];

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pages.push('start-ellipsis');
    }

    // Add pages in the middle range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pages.push('end-ellipsis');
    }

    // Always show last page if it exists
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav className="flex items-center gap-1" aria-label="Pagination">
      {/* First page */}
      <IconButton
        icon={ChevronsLeft}
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        label="First page"
      />
      {/* Previous page */}
      <IconButton
        icon={ChevronLeft}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        label="Previous page"
      />

      {/* Page numbers and ellipses */}
      <div className="flex items-center gap-1">
        {getVisiblePages().map((page, index) => {
          if (page === 'start-ellipsis' || page === 'end-ellipsis') {
            return <Ellipsis key={`${page}-${index}`} />;
          }
          return (
            <PageButton
              key={page}
              page={page as number}
              isActive={page === currentPage}
              onClick={() => onPageChange(page as number)}
            />
          );
        })}
      </div>

      {/* Next page */}
      <IconButton
        icon={ChevronRight}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        label="Next page"
      />
      {/* Last page */}
      <IconButton
        icon={ChevronsRight}
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        label="Last page"
      />
    </nav>
  );
};

export default Pagination;
