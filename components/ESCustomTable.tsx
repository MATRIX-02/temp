import React, { useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_DensityState,
  type MRT_Row,
  type MaterialReactTableProps
} from 'material-react-table';
import { type MRT_ColumnDef } from 'material-react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Columns,
  Filter,
  Maximize2,
  Minimize2,
  Monitor,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface TableConfig {
  enableRowSelection?: boolean;
  enableColumnPinning?: boolean;
  enableHiding?: boolean;
  enableRowActions?: boolean;
  enableSearch?: boolean;
  enableExport?: boolean;
  enableColumnVisibility?: boolean;
  enableFilters?: boolean;
  enableDensityToggle?: boolean;
  enableFullScreen?: boolean;
  enablePagination?: boolean;
  enableSorting?: boolean;
  enableSticky?: boolean;
  enableColumnOrdering?: boolean;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
}

interface MuiCustomProps {
  tableContainerProps?: Record<string, any>;
  tablePaperProps?: Record<string, any>;
  tableProps?: Record<string, any>;
  tableHeadProps?: Record<string, any>;
  tableBodyProps?: Record<string, any>;
  toolbarProps?: Record<string, any>;
  bottomToolbarProps?: Record<string, any>;
  tableHeadCellProps?: Record<string, any>;
  tableBodyCellProps?: Record<string, any>;
  tableHeadRowProps?: Record<string, any>;
  tableBodyRowProps?: Record<string, any>;
}

interface TableProps<T extends Record<string, any>> {
  data: T[];
  columns: MRT_ColumnDef<T>[];
  config?: TableConfig;
  muiProps?: MuiCustomProps;
  tableProps?: Partial<MaterialReactTableProps<T>>;
}

const defaultConfig: TableConfig = {
  enableSearch: true,
  enableExport: true,
  enableHiding: false,
  enableColumnVisibility: true,
  enableFilters: true,
  enableDensityToggle: true,
  enableFullScreen: true,
  enablePagination: true,
  enableSorting: true,
  enableSticky: true,
  enableColumnOrdering: true,
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 30, 40, 50]
};

export default function ESCustomTable<T extends Record<string, any>>({
  data,
  columns,
  config = {},
  muiProps = {},
  tableProps = {}
}: TableProps<T>) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const finalConfig = { ...defaultConfig, ...config };
  const [showFilters, setShowFilters] = useState(false);

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true
  });

  const handleExportRows = (rows: MRT_Row<T>[]) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportRowsPDF = (rows: MRT_Row<T>[]) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData
    });

    doc.save('table-export.pdf');
  };

  const table = useMaterialReactTable({
    columns,
    data,
    enableStickyHeader: finalConfig.enableSticky,
    enableColumnOrdering: finalConfig.enableColumnOrdering,
    enableSorting: finalConfig.enableSorting,
    enableColumnFilters: finalConfig.enableFilters,
    enableColumnActions: false,
    enableGlobalFilter: finalConfig.enableSearch,
    enablePagination: finalConfig.enablePagination,
    enableRowSelection: finalConfig.enableRowSelection,
    enableColumnPinning: finalConfig.enableColumnPinning,
    muiPaginationProps: {
      color: 'secondary',
      shape: 'rounded',
      showRowsPerPage: false,
      variant: 'outlined'
    },
    paginationDisplayMode: 'pages',
    renderToolbarInternalActions: ({ table }) => (
      <div className="flex items-center gap-2">
        {finalConfig.enableSearch && (
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={table.getState().globalFilter ?? ''}
              onChange={(e) => table.setGlobalFilter(e.target.value)}
              className={`w-[300px] pl-8 ${
                showFilters ? 'text-green' : 'text-green'
              }`}
            />
          </div>
        )}

        {finalConfig.enableExport && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-2">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-[2000]" align="end">
              <DropdownMenuItem
                onClick={() =>
                  handleExportRows(
                    table.getPrePaginationRowModel().rows as MRT_Row<T>[]
                  )
                }
              >
                Export All (CSV)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleExportRows(table.getRowModel().rows as MRT_Row<T>[])
                }
              >
                Export Page (CSV)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleExportRowsPDF(
                    table.getPrePaginationRowModel().rows as MRT_Row<T>[]
                  )
                }
              >
                Export All (PDF)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleExportRowsPDF(table.getRowModel().rows as MRT_Row<T>[])
                }
              >
                Export Page (PDF)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {finalConfig.enableColumnVisibility && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-2">
                <Columns className="mr-2 h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-[2000]" align="end">
              {table.getAllColumns().map((column) => (
                <DropdownMenuItem
                  key={column.id}
                  className="capitalize"
                  onClick={() =>
                    column.toggleVisibility(!column.getIsVisible())
                  }
                >
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    onChange={() =>
                      column.toggleVisibility(!column.getIsVisible())
                    }
                    className="mr-2"
                  />
                  {column.id}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {finalConfig.enableFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowFilters(!showFilters);
              table.setShowColumnFilters(!table.getState().showColumnFilters);
            }}
          >
            <Filter className="mr-2 h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        )}

        {finalConfig.enableDensityToggle && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const currentDensity = table.getState().density;
              const newDensity: MRT_DensityState =
                currentDensity === 'comfortable'
                  ? 'compact'
                  : currentDensity === 'compact'
                  ? 'spacious'
                  : 'comfortable';
              table.setDensity(newDensity);
            }}
          >
            <Monitor className="mr-2 h-4 w-4" />
            Density
          </Button>
        )}

        {finalConfig.enableFullScreen && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsFullScreen(!isFullScreen);
              table.setIsFullScreen(!isFullScreen);
            }}
          >
            {isFullScreen ? (
              <Minimize2 className="mr-2 h-4 w-4" />
            ) : (
              <Maximize2 className="mr-2 h-4 w-4" />
            )}
            {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </Button>
        )}
      </div>
    ),
    renderBottomToolbar: () => {
      const currentPage = table.getState().pagination.pageIndex + 1;
      const totalPages = table.getPageCount();

      const getVisiblePages = () => {
        const pages = [];
        const sidePages = 2; // Number of pages to show on each side of current page

        // Always add page 1
        pages.push(1);

        if (currentPage <= 4) {
          // Near the start
          for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
            pages.push(i);
          }
          if (totalPages > 6) pages.push('ellipsis');
        } else if (currentPage >= totalPages - 3) {
          // Near the end
          if (totalPages > 6) pages.push('ellipsis');
          for (let i = totalPages - 4; i < totalPages; i++) {
            pages.push(i);
          }
        } else {
          // In the middle
          pages.push('ellipsis');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push('ellipsis');
        }

        // Always add last page
        if (totalPages > 1) {
          pages.push(totalPages);
        }

        return pages;
      };

      return (
        <div className="flex items-center justify-between px-2 py-4">
          {finalConfig.enablePagination && (
            <>
              <div className="flex items-center space-x-4">
                <Select
                  value={table.getState().pagination.pageSize.toString()}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue>
                      {table.getState().pagination.pageSize}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {finalConfig.pageSizeOptions?.map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">
                  rows per page
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {getVisiblePages().map((pageNum, idx) => {
                    if (pageNum === 'ellipsis') {
                      return (
                        <Button
                          key={`ellipsis-${idx}`}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 cursor-default"
                          disabled
                        >
                          ...
                        </Button>
                      );
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? 'default' : 'outline'
                        }
                        size="icon"
                        onClick={() =>
                          typeof pageNum === 'number' &&
                          table.setPageIndex(pageNum - 1)
                        }
                        className="h-8 w-8"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      );
    },
    initialState: {
      pagination: { pageSize: finalConfig.defaultPageSize ?? 10, pageIndex: 0 },
      showColumnFilters: false
    },

    muiTablePaperProps: {
      elevation: 0,
      sx: {
        backgroundColor: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))',
        '& .MuiBox-root': {
          backgroundColor: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))'
        },
        '& .MuiBadge-root': {
          '& .MuiButtonBase-root': {
            '& .MuiSvgIcon-root': {
              fill: 'hsl(var(--background))'
            }
          }
        },
        ...(muiProps.tablePaperProps?.sx || {})
      },
      ...muiProps.tablePaperProps
    },
    muiTableContainerProps: {
      sx: {
        border: '1px solid hsl(var(--border))',
        borderRadius: '8px',
        ...(muiProps.tableContainerProps?.sx || {})
      },
      ...muiProps.tableContainerProps
    },
    muiTableProps: {
      sx: {
        backgroundColor: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))',
        ...(muiProps.tableProps?.sx || {})
      },
      ...muiProps.tableProps
    },
    muiTableBodyRowProps: {
      sx: {
        backgroundColor: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))',
        ...(muiProps.tableBodyRowProps?.sx || {})
      },
      ...muiProps.tableBodyRowProps
    },
    muiTableHeadRowProps: {
      sx: {
        backgroundColor: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))',
        ...(muiProps.tableHeadRowProps?.sx || {})
      },
      ...muiProps.tableHeadRowProps
    },
    muiTableBodyCellProps: {
      sx: {
        color: 'hsl(var(--foreground))',
        borderBottom: '1px solid hsl(var(--border))',
        ...(muiProps.tableBodyCellProps?.sx || {})
      },
      ...muiProps.tableBodyCellProps
    },
    muiTableHeadProps: muiProps.tableHeadProps,
    muiTableBodyProps: {
      sx: {
        backgroundColor: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))',
        ...(muiProps.tableBodyProps?.sx || {})
      },
      ...muiProps.tableBodyProps
    },
    muiTopToolbarProps: {
      sx: {
        color: 'hsl(var(--foreground))',
        ...(muiProps.toolbarProps?.sx || {})
      },
      ...muiProps.toolbarProps
    },
    muiBottomToolbarProps: {
      sx: {
        boxShadow: 'none',
        color: 'hsl(var(--foreground))',
        '& .MuiTablePagination-root button': {
          border: '1px solid hsl(var(--border))',
          color: 'hsl(var(--foreground))',
          '&.Mui-selected': {
            color: '#9c27b0',
            backgroundColor: 'rgba(156, 39, 176, 0.12)',
            border: '1px solid rgba(156, 39, 176, 0.5)'
          }
        },
        ...(muiProps.bottomToolbarProps?.sx || {})
      },
      ...muiProps.bottomToolbarProps
    },
    muiTableHeadCellProps: {
      sx: {
        '& .MuiBadge-root': {
          '& .MuiButtonBase-root': {
            '& .MuiSvgIcon-root': {
              fill: 'hsl(var(--foreground))'
            }
          }
        },
        '& .MuiButtonBase-root': {
          '& .MuiSvgIcon-root': {
            fill: 'hsl(var(--foreground))'
          }
        },
        ...(muiProps.tableHeadCellProps?.sx || {})
      },
      ...muiProps.tableHeadCellProps
    },
    ...tableProps
  });

  return <MaterialReactTable table={table} />;
}
