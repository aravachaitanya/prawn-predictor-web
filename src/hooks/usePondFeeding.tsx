
import { useState, useEffect, useCallback } from 'react';
import { PondService, PondFeedingRecord } from '@/services/pondService';
import { useToast } from '@/hooks/use-toast';

export const usePondFeeding = () => {
  const { toast } = useToast();
  const [records, setRecords] = useState<PondFeedingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize the database and load records
  useEffect(() => {
    const initializeAndLoad = async () => {
      try {
        setLoading(true);
        // Initialize the pond service (which initializes the database)
        await PondService.initialize();
        
        // Load saved records
        const savedRecords = await PondService.getPondFeedingRecords();
        setRecords(savedRecords);
      } catch (err) {
        console.error('Error initializing or loading records:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        toast({
          title: "Error loading records",
          description: "There was a problem loading your saved records",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    initializeAndLoad();
  }, [toast]);

  // Add a new record using pond service
  const addRecord = useCallback(async (record: PondFeedingRecord) => {
    try {
      setLoading(true);
      const updatedRecords = await PondService.addPondFeedingRecord(record);
      setRecords(updatedRecords);
      return true;
    } catch (err) {
      console.error('Error adding record:', err);
      toast({
        title: "Error adding record",
        description: "There was a problem saving your record",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Delete a record using pond service
  const deleteRecord = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const updatedRecords = await PondService.deletePondFeedingRecord(id);
      setRecords(updatedRecords);
      toast({
        title: "Record deleted",
        description: "Feeding record has been removed",
      });
      return true;
    } catch (err) {
      console.error('Error deleting record:', err);
      toast({
        title: "Error deleting record",
        description: "There was a problem removing your record",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Export records to JSON
  const exportRecords = useCallback(() => {
    const dataStr = JSON.stringify(records, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `prawn-feeding-records-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [records]);

  return {
    records,
    loading,
    error,
    addRecord,
    deleteRecord,
    exportRecords
  };
};
