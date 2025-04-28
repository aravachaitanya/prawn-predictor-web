
import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import { usePondFeeding } from '@/hooks/usePondFeeding';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const PondDataTable = () => {
  const { records, deleteRecord, exportRecords } = usePondFeeding();
  
  const columns = [
    {
      header: "Pond Name",
      accessorKey: "pondName",
    },
    {
      header: "Size (ha)",
      accessorKey: "pondSize",
      cell: (row) => row.pondSize.toFixed(2),
    },
    {
      header: "Feed Type",
      accessorKey: "feedType",
    },
    {
      header: "Amount (kg)",
      accessorKey: "feedAmount",
      cell: (row) => row.feedAmount.toFixed(2),
    },
    {
      header: "Date",
      accessorKey: "date",
      cell: (row) => {
        try {
          return format(new Date(row.date), 'MMM dd, yyyy');
        } catch (e) {
          return row.date || 'N/A';
        }
      },
    },
    {
      header: "Time",
      accessorKey: "feedingTime",
      cell: (row) => row.feedingTime || 'N/A',
    },
    {
      header: "Notes",
      accessorKey: "notes",
      cell: (row) => row.notes || 'N/A',
    },
    {
      header: "Actions",
      accessorKey: (row) => (
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => deleteRecord(row.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      data={records}
      columns={columns}
      title="Pond Feeding Records"
      exportable={true}
      pagination={true}
      searchable={true}
      onRefresh={exportRecords}
    />
  );
};

export default PondDataTable;
