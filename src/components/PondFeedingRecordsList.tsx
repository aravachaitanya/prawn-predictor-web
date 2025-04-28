
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Droplets, FileText, Trash2, Loader2 } from 'lucide-react';
import { PrawnCard } from '@/components';
import { Button } from '@/components/ui/button';

interface PondFeedingRecord {
  id: string;
  pondName: string;
  pondSize: number;
  feedType: string;
  feedAmount: number;
  feedingTime: string;
  notes: string;
  date: string;
}

interface PondFeedingRecordsListProps {
  records: PondFeedingRecord[];
  onDeleteRecord: (id: string) => void;
  loading?: boolean;
}

const PondFeedingRecordsList: React.FC<PondFeedingRecordsListProps> = ({
  records,
  onDeleteRecord,
  loading = false
}) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-aqua-500 mr-2" />
        <p>Loading records...</p>
      </div>
    );
  }

  // Show empty state
  if (records.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground mb-2">No feeding records yet</p>
        <p className="text-sm">Add your first feeding record to get started</p>
      </div>
    );
  }

  // Group records by date
  const recordsByDate = records.reduce((acc, record) => {
    const date = record.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {} as Record<string, PondFeedingRecord[]>);

  // Sort dates from most recent to oldest
  const sortedDates = Object.keys(recordsByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-6">
      {sortedDates.map(date => (
        <div key={date}>
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-aqua-500" />
            {formatDate(date)}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recordsByDate[date].map(record => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PrawnCard
                  title={record.pondName}
                  description={`${record.feedType} - ${record.feedAmount} kg`}
                  className="relative border-l-4 border-aqua-400"
                >
                  <div className="space-y-2 mt-3">
                    <div className="flex items-center text-sm">
                      <Droplets className="mr-2 h-4 w-4 text-aqua-500" />
                      <span className="text-muted-foreground">Pond Size:</span>
                      <span className="ml-1 font-medium">{record.pondSize} hectares</span>
                    </div>
                    
                    {record.feedingTime && (
                      <div className="flex items-center text-sm">
                        <Clock className="mr-2 h-4 w-4 text-aqua-500" />
                        <span className="text-muted-foreground">Time:</span>
                        <span className="ml-1 font-medium">{record.feedingTime}</span>
                      </div>
                    )}
                    
                    {record.notes && (
                      <div className="flex items-start text-sm">
                        <FileText className="mr-2 h-4 w-4 text-aqua-500 mt-1" />
                        <div>
                          <span className="text-muted-foreground">Notes:</span>
                          <p className="ml-1">{record.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                    onClick={() => onDeleteRecord(record.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </PrawnCard>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PondFeedingRecordsList;
