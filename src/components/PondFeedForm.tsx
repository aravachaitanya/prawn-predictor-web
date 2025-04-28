
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

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

interface PondFeedFormProps {
  onAddRecord: (record: PondFeedingRecord) => Promise<boolean>;
  isSubmitting?: boolean;
}

const PondFeedForm: React.FC<PondFeedFormProps> = ({ onAddRecord, isSubmitting = false }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [record, setRecord] = useState<Omit<PondFeedingRecord, 'id'>>({
    pondName: '',
    pondSize: 0,
    feedType: '',
    feedAmount: 0,
    feedingTime: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setRecord(prev => ({
      ...prev,
      [name]: name === 'pondSize' || name === 'feedAmount' 
        ? parseFloat(value) || 0 
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!record.pondName || !record.feedType || !record.feedAmount) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Set submitting state
    setSubmitting(true);

    try {
      // Create the record with a unique ID
      const newRecord: PondFeedingRecord = {
        ...record,
        id: Date.now().toString(),
      };

      // Add the record
      const success = await onAddRecord(newRecord);
      
      if (success) {
        toast({
          title: "Feed record added",
          description: `Added feeding record for ${record.pondName}`,
        });

        // Reset form and close dialog
        setRecord({
          pondName: '',
          pondSize: 0,
          feedType: '',
          feedAmount: 0,
          feedingTime: '',
          notes: '',
          date: new Date().toISOString().split('T')[0],
        });
        setOpen(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission failed",
        description: "There was a problem saving your record",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isProcessing = submitting || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-aqua-500 hover:bg-aqua-600 text-white" disabled={isProcessing}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Feeding Record
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Pond Feeding Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pondName">Pond Name <span className="text-red-500">*</span></Label>
              <Input
                id="pondName"
                name="pondName"
                value={record.pondName}
                onChange={handleChange}
                placeholder="e.g., North Pond"
                disabled={isProcessing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pondSize">Pond Size (hectares)</Label>
              <Input
                id="pondSize"
                name="pondSize"
                type="number"
                step="0.1"
                min="0.1"
                value={record.pondSize || ''}
                onChange={handleChange}
                placeholder="e.g., 1.5"
                disabled={isProcessing}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="feedType">Feed Type <span className="text-red-500">*</span></Label>
              <Input
                id="feedType"
                name="feedType"
                value={record.feedType}
                onChange={handleChange}
                placeholder="e.g., High Protein Pellets"
                disabled={isProcessing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedAmount">Amount (kg) <span className="text-red-500">*</span></Label>
              <Input
                id="feedAmount"
                name="feedAmount"
                type="number"
                step="0.1"
                min="0.1"
                value={record.feedAmount || ''}
                onChange={handleChange}
                placeholder="e.g., 5.5"
                disabled={isProcessing}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={record.date}
                onChange={handleChange}
                disabled={isProcessing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedingTime">Feeding Time</Label>
              <Input
                id="feedingTime"
                name="feedingTime"
                type="time"
                value={record.feedingTime}
                onChange={handleChange}
                disabled={isProcessing}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={record.notes}
              onChange={handleChange}
              placeholder="Any observations or special conditions..."
              rows={3}
              disabled={isProcessing}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-aqua-500 hover:bg-aqua-600"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Record
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PondFeedForm;
