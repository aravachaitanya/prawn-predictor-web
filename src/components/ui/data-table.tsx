
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Search,
  RotateCcw,
  Download
} from "lucide-react";

interface DataTableColumn<T> {
  header: string;
  accessorKey: keyof T | ((row: T) => React.ReactNode);
  cell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  title?: string;
  pagination?: boolean;
  searchable?: boolean;
  exportable?: boolean;
  loading?: boolean;
  pageSize?: number;
  onRefresh?: () => void;
}

export function DataTable<T>({
  data,
  columns,
  title,
  pagination = true,
  searchable = true,
  exportable = true,
  loading = false,
  pageSize = 10,
  onRefresh,
}: DataTableProps<T>) {
  const [page, setPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState("");
  
  // Filter data based on search term - MOVED THIS BEFORE IT'S USED
  const filteredData = React.useMemo(() => {
    if (!searchTerm.trim()) return data;
    
    return data.filter((row) => {
      return columns.some((column) => {
        const value = typeof column.accessorKey === "function"
          ? ""  // Skip function accessors for searching
          : String(row[column.accessorKey as keyof T] || "").toLowerCase();
        
        return value.includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, columns]);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / pageSize);
  
  // Get current page data
  const currentPageData = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, page, pageSize]);
  
  // Export data as CSV
  const exportData = () => {
    const headers = columns.map((column) => typeof column.header === 'string' ? column.header : 'Column');
    
    const csvRows = [
      headers.join(','),
      ...filteredData.map((row) => {
        return columns.map((column) => {
          if (typeof column.accessorKey === "function") {
            return "";
          }
          const value = row[column.accessorKey as keyof T];
          return typeof value === 'string' ? `"${value}"` : String(value);
        }).join(',');
      }),
    ];
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${title || 'data'}-export.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="w-full space-y-4 rounded-md border p-4">
      {title && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{title}</h3>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={loading}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            )}
            {exportable && (
              <Button
                variant="outline"
                size="sm"
                onClick={exportData}
                disabled={loading || filteredData.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>
      )}
      
      {searchable && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1); // Reset to first page when searching
              }}
              className="pl-8"
            />
          </div>
        </div>
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <span className="ml-2">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : currentPageData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              currentPageData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, columnIndex) => (
                    <TableCell key={columnIndex}>
                      {column.cell
                        ? column.cell(row)
                        : typeof column.accessorKey === "function"
                        ? column.accessorKey(row)
                        : String(row[column.accessorKey as keyof T] || "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <strong>{Math.min(filteredData.length, (page - 1) * pageSize + 1)}</strong> to{" "}
            <strong>{Math.min(page * pageSize, filteredData.length)}</strong> of{" "}
            <strong>{filteredData.length}</strong> results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
