import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, ClipboardIcon, PenIcon, TrashIcon, AlertCircleIcon, CheckCircleIcon, ActivityIcon, BarChart3Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { PrawnCard, WeatherAlert } from '@/components';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { generatePondPredictions } from '@/utils/pondPredictions';
import { cn } from '@/lib/utils';

// Pond data structure
interface Pond {
  id: string;
  pondNumber: string;
  size: number;
  uom: 'hectares' | 'acres';
  feedingType: string;
  status: 'active' | 'inactive' | 'maintenance';
}

// Feed intake record structure
interface FeedIntakeRecord {
  id: string;
  pondId: string;
  date: string;
  feedAmount: number;
  consumedAmount: number;
  consumptionRate: number;
  notes: string;
}

const FeedIntakeByPond: React.FC<{
  temperature?: number;
  humidity?: number;
  rainfall?: number;
}> = ({ 
  temperature = 28, 
  humidity = 70, 
  rainfall = 10 
}) => {
  const { toast } = useToast();
  const [ponds, setPonds] = useState<Pond[]>([]);
  const [feedRecords, setFeedRecords] = useState<FeedIntakeRecord[]>([]);
  const [showPondForm, setShowPondForm] = useState<boolean>(false);
  const [showFeedForm, setShowFeedForm] = useState<boolean>(false);
  const [selectedPondId, setSelectedPondId] = useState<string>('');
  const [selectedPondForPredict, setSelectedPondForPredict] = useState<string>('');
  const [pondPredictions, setPondPredictions] = useState<Record<string, any>>({});
  
  // Form states
  const [pondNumber, setPondNumber] = useState<string>('');
  const [pondSize, setPondSize] = useState<number>(0);
  const [pondUOM, setPondUOM] = useState<'hectares' | 'acres'>('hectares');
  const [feedingType, setFeedingType] = useState<string>('');
  const [pondStatus, setPondStatus] = useState<'active' | 'inactive' | 'maintenance'>('active');
  
  const [feedAmount, setFeedAmount] = useState<number>(0);
  const [consumedAmount, setConsumedAmount] = useState<number>(0);
  const [feedNotes, setFeedNotes] = useState<string>('');

  // Status color mapping
  const statusColors = {
    active: 'text-green-600',
    inactive: 'text-red-600',
    maintenance: 'text-amber-600',
  };

  // Toggle pond form
  const togglePondForm = () => {
    setShowPondForm(!showPondForm);
    if (!showPondForm) {
      setPondNumber('');
      setPondSize(0);
      setPondUOM('hectares');
      setFeedingType('');
      setPondStatus('active');
    }
  };

  // Toggle feed form
  const toggleFeedForm = () => {
    setShowFeedForm(!showFeedForm);
    if (!showFeedForm) {
      setFeedAmount(0);
      setConsumedAmount(0);
      setFeedNotes('');
    }
  };

  // Add new pond
  const handleAddPond = () => {
    if (!pondNumber || pondSize <= 0) {
      toast({
        title: "Invalid pond details",
        description: "Please enter a valid pond number and size",
        variant: "destructive",
      });
      return;
    }

    const newPond: Pond = {
      id: Date.now().toString(),
      pondNumber,
      size: pondSize,
      uom: pondUOM,
      feedingType,
      status: pondStatus,
    };

    setPonds([...ponds, newPond]);
    setShowPondForm(false);
    
    toast({
      title: "Pond added",
      description: `Pond ${pondNumber} has been added successfully`,
    });
  };

  // Add feed intake record
  const handleAddFeedIntake = () => {
    if (!selectedPondId) {
      toast({
        title: "Select a pond",
        description: "Please select a pond for the feed intake record",
        variant: "destructive",
      });
      return;
    }

    if (feedAmount <= 0) {
      toast({
        title: "Invalid feed amount",
        description: "Please enter a valid feed amount",
        variant: "destructive",
      });
      return;
    }

    if (consumedAmount > feedAmount) {
      toast({
        title: "Invalid consumed amount",
        description: "Consumed amount cannot be greater than feed amount",
        variant: "destructive",
      });
      return;
    }

    const consumptionRate = (consumedAmount / feedAmount) * 100;
    
    const newRecord: FeedIntakeRecord = {
      id: Date.now().toString(),
      pondId: selectedPondId,
      date: new Date().toISOString().split('T')[0],
      feedAmount,
      consumedAmount,
      consumptionRate,
      notes: feedNotes
    };

    setFeedRecords([newRecord, ...feedRecords]);
    setShowFeedForm(false);
    
    toast({
      title: "Feed intake recorded",
      description: `Feed consumption rate: ${consumptionRate.toFixed(1)}%`,
    });
  };

  // Delete pond
  const handleDeletePond = (pondId: string) => {
    setPonds(ponds.filter(pond => pond.id !== pondId));
    setFeedRecords(feedRecords.filter(record => record.pondId !== pondId));
    
    toast({
      title: "Pond deleted",
      description: "Pond and associated feed records have been deleted",
    });
  };

  // Get feed records for a specific pond
  const getPondFeedRecords = (pondId: string) => {
    return feedRecords.filter(record => record.pondId === pondId);
  };

  // Get pond by ID
  const getPondById = (pondId: string) => {
    return ponds.find(pond => pond.id === pondId);
  };

  // Generate predictions whenever ponds or weather changes
  useEffect(() => {
    if (ponds.length > 0) {
      const predictions = generatePondPredictions(temperature, humidity, rainfall, ponds);
      setPondPredictions(predictions);
    }
  }, [ponds, temperature, humidity, rainfall]);

  return (
    <div className="glass-card p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Pond Feed Intake Management</h2>
        <div className="flex gap-2">
          <Button 
            onClick={togglePondForm} 
            variant="outline" 
            size="sm"
            className="text-aqua-600"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Pond
          </Button>
          
          {ponds.length > 0 && (
            <Button 
              onClick={toggleFeedForm} 
              variant="outline" 
              size="sm"
              className="bg-aqua-50 text-aqua-600 border-aqua-200 hover:bg-aqua-100"
            >
              <ClipboardIcon className="mr-2 h-4 w-4" />
              Record Feed Intake
            </Button>
          )}
        </div>
      </div>

      {/* Weather-based predictions section */}
      {ponds.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center">
              <BarChart3Icon className="mr-2 h-5 w-5 text-aqua-500" />
              Weather-Based Pond Predictions
            </h3>
            <Select value={selectedPondForPredict} onValueChange={setSelectedPondForPredict}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a pond" />
              </SelectTrigger>
              <SelectContent>
                {ponds.map(pond => (
                  <SelectItem key={pond.id} value={pond.id}>
                    {pond.pondNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <WeatherAlert
            temperature={temperature}
            humidity={humidity}
            rainfall={rainfall}
            pondPredictions={pondPredictions}
            selectedPondId={selectedPondForPredict}
            className="mb-6"
          />
        </div>
      )}

      {/* Pond Form */}
      {showPondForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="p-4 border border-aqua-200 rounded-md bg-aqua-50/30 dark:bg-aqua-900/10 dark:border-aqua-800">
            <h3 className="text-md font-medium mb-4">Add New Pond</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="pondNumber">Pond ID/Number</Label>
                <Input
                  id="pondNumber"
                  value={pondNumber}
                  onChange={(e) => setPondNumber(e.target.value)}
                  placeholder="e.g., P001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pondSize">Pond Size</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    id="pondSize"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={pondSize || ''}
                    onChange={(e) => setPondSize(Number(e.target.value))}
                    placeholder="e.g., 1.5"
                  />
                  <Select value={pondUOM} onValueChange={(value: 'hectares' | 'acres') => setPondUOM(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hectares">Hectares</SelectItem>
                      <SelectItem value="acres">Acres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="feedingType">Feeding Type</Label>
                <Input
                  id="feedingType"
                  value={feedingType}
                  onChange={(e) => setFeedingType(e.target.value)}
                  placeholder="e.g., High Protein Pellets"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pondStatus">Status</Label>
                <Select value={pondStatus} onValueChange={(value: 'active' | 'inactive' | 'maintenance') => setPondStatus(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={togglePondForm}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddPond}
                className="bg-aqua-500 hover:bg-aqua-600 text-white"
              >
                Add Pond
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Feed Intake Form */}
      {showFeedForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="p-4 border border-aqua-200 rounded-md bg-aqua-50/30 dark:bg-aqua-900/10 dark:border-aqua-800">
            <h3 className="text-md font-medium mb-4">Record Feed Intake</h3>
            
            <div className="space-y-2 mb-4">
              <Label htmlFor="selectedPond">Select Pond</Label>
              <Select value={selectedPondId} onValueChange={setSelectedPondId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a pond" />
                </SelectTrigger>
                <SelectContent>
                  {ponds.map(pond => (
                    <SelectItem key={pond.id} value={pond.id}>
                      {pond.pondNumber} ({pond.size} {pond.uom})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="feedAmount">Feed Amount (kg)</Label>
                <Input
                  id="feedAmount"
                  type="number"
                  min="0"
                  step="0.1"
                  value={feedAmount || ''}
                  onChange={(e) => setFeedAmount(Number(e.target.value))}
                  placeholder="e.g., 5.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="consumedAmount">Consumed Amount (kg)</Label>
                <Input
                  id="consumedAmount"
                  type="number"
                  min="0"
                  step="0.1"
                  value={consumedAmount || ''}
                  onChange={(e) => setConsumedAmount(Number(e.target.value))}
                  placeholder="e.g., 4.8"
                />
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <Label htmlFor="feedNotes">Notes</Label>
              <Textarea
                id="feedNotes"
                value={feedNotes}
                onChange={(e) => setFeedNotes(e.target.value)}
                placeholder="Any observations about feed consumption..."
                rows={2}
              />
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={toggleFeedForm}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddFeedIntake}
                className="bg-aqua-500 hover:bg-aqua-600 text-white"
              >
                Record Feed Intake
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Ponds List */}
      {ponds.length > 0 ? (
        <div className="mt-6 space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-3">Registered Ponds</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pond ID</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>UOM</TableHead>
                  <TableHead>Feeding Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prediction</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ponds.map((pond) => (
                  <TableRow key={pond.id}>
                    <TableCell className="font-medium">{pond.pondNumber}</TableCell>
                    <TableCell>{pond.size}</TableCell>
                    <TableCell>{pond.uom}</TableCell>
                    <TableCell>{pond.feedingType}</TableCell>
                    <TableCell>
                      <span className={statusColors[pond.status]}>
                        {pond.status.charAt(0).toUpperCase() + pond.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {pond.id in pondPredictions && (
                        <div className="flex items-center">
                          <span className={cn(
                            "w-2 h-2 rounded-full mr-2",
                            pondPredictions[pond.id].riskLevel === 'low' ? "bg-green-500" :
                            pondPredictions[pond.id].riskLevel === 'medium' ? "bg-yellow-500" :
                            pondPredictions[pond.id].riskLevel === 'high' ? "bg-orange-500" : "bg-red-500"
                          )} />
                          <span>{pondPredictions[pond.id].growthRate}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500"
                        onClick={() => handleDeletePond(pond.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Feed Intake Records */}
          {feedRecords.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Recent Feed Intake Records</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedRecords.slice(0, 6).map((record) => {
                  const pond = getPondById(record.pondId);
                  if (!pond) return null;
                  
                  return (
                    <PrawnCard
                      key={record.id}
                      title={`Pond ${pond.pondNumber}`}
                      description={`Feed: ${record.feedAmount} kg, Consumed: ${record.consumedAmount} kg`}
                      className="border-l-4 border-aqua-400"
                    >
                      <div className="mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Consumption Rate:</span>
                          <span className={`font-medium ${
                            record.consumptionRate >= 80 ? 'text-green-600' : 
                            record.consumptionRate >= 60 ? 'text-amber-600' : 'text-red-600'
                          }`}>
                            {record.consumptionRate.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Date:</span>
                          <span className="text-sm">{record.date}</span>
                        </div>
                        {record.notes && (
                          <div className="mt-2 pt-2 border-t text-sm">
                            <p className="text-muted-foreground">Notes:</p>
                            <p>{record.notes}</p>
                          </div>
                        )}
                      </div>
                    </PrawnCard>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <AlertCircleIcon className="mx-auto h-12 w-12 text-aqua-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Ponds Registered</h3>
          <p className="text-muted-foreground mb-4">Add your first pond to start tracking feed intake</p>
          <Button 
            onClick={togglePondForm}
            className="bg-aqua-500 hover:bg-aqua-600 text-white"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Your First Pond
          </Button>
        </div>
      )}
    </div>
  );
};

export default FeedIntakeByPond;
