
import React from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components';
import PondFeedForm from '@/components/PondFeedForm';
import PondFeedingRecordsList from '@/components/PondFeedingRecordsList';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { usePondFeeding } from '@/hooks/usePondFeeding';

const PondFeeding = () => {
  const { records, loading, addRecord, deleteRecord, exportRecords } = usePondFeeding();

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-aqua-50/50 to-white dark:from-gray-900/50 dark:to-gray-950">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-8 px-6 max-w-3xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Pond Feeding Records</h1>
            <p className="text-muted-foreground">
              Track your daily feeding activities for each pond
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <PondFeedForm onAddRecord={addRecord} isSubmitting={loading} />
            {records.length > 0 && (
              <Button 
                variant="outline" 
                onClick={exportRecords}
                className="flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Export
              </Button>
            )}
          </div>
        </div>
        
        <PondFeedingRecordsList 
          records={records} 
          onDeleteRecord={deleteRecord}
          loading={loading} 
        />
      </motion.div>
      
      <Navigation />
    </div>
  );
};

export default PondFeeding;
