import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PrawnCard } from '@/components';
import { CalendarIcon, ClockIcon, ScaleIcon, PlusIcon, InfoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateFeedingSchedule, FeedingScheduleType } from '@/utils/feedingData';
import { useToast } from "@/hooks/use-toast";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FeedIntakeByPond } from '@/components';

interface FeedingScheduleProps {
  className?: string;
}

interface FeedIntakeRecord {
  id: string;
  date: string;
  feedAmount: number;
  consumed: number;
  consumptionRate: number;
  feedType: string;
  notes: string;
}

const FeedingSchedule: React.FC<FeedingScheduleProps> = ({ className }) => {
  const { toast } = useToast();
  const [prawnAge, setPrawnAge] = useState<number>(30);
  const [pondSize, setPondSize] = useState<number>(1);
  const [stockingDensity, setStockingDensity] = useState<number>(40000);
  const [schedule, setSchedule] = useState<FeedingScheduleType | null>(null);

  const handleCalculate = () => {
    const result = calculateFeedingSchedule(prawnAge, pondSize, stockingDensity);
    setSchedule(result);
  };

  return (
    <div className={className}>
      <div className="glass-card p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Feeding Calculator</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="prawnAge" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Prawn Age (days)
            </label>
            <Input
              id="prawnAge"
              type="number"
              min="1"
              max="150"
              value={prawnAge}
              onChange={(e) => setPrawnAge(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="pondSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pond Size (hectares)
            </label>
            <Input
              id="pondSize"
              type="number"
              min="0.1"
              step="0.1"
              value={pondSize}
              onChange={(e) => setPondSize(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="stockingDensity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Stocking Density (PL/acre)
            </label>
            <Input
              id="stockingDensity"
              type="number"
              min="1000"
              max="100000"
              value={stockingDensity}
              onChange={(e) => setStockingDensity(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
        <Button 
          onClick={handleCalculate}
          className="w-full bg-aqua-500 hover:bg-aqua-600 text-white"
        >
          Calculate Feeding Schedule
        </Button>
      </div>

      {schedule && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h3 className="text-lg font-medium mb-4">Recommended Feeding Schedule</h3>
          <div className="space-y-4">
            <PrawnCard
              title="Daily Feeding Amount"
              icon={<ScaleIcon size={24} />}
              className="border-l-4 border-aqua-500"
            >
              <p className="text-2xl font-semibold text-aqua-600">{schedule.dailyAmount} kg</p>
              <p className="text-sm text-muted-foreground">Protein content: {schedule.proteinContent}%</p>
            </PrawnCard>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PrawnCard
                title="Feeding Times"
                icon={<ClockIcon size={24} />}
              >
                <ul className="space-y-2">
                  {schedule.feedingTimes.map((time, index) => (
                    <li key={index} className="flex justify-between">
                      <span>Feeding {index + 1}</span>
                      <span className="font-medium">{time}</span>
                    </li>
                  ))}
                </ul>
              </PrawnCard>
              
              <PrawnCard
                title="Feed Type"
                icon={<CalendarIcon size={24} />}
              >
                <p className="mb-2">{schedule.feedType}</p>
                <div className="text-sm text-muted-foreground">
                  <p>Size: {schedule.feedSize} mm</p>
                  <p>Application: {schedule.applicationMethod}</p>
                </div>
              </PrawnCard>
            </div>
          </div>
        </motion.div>
      )}

      {/* Pond Feed Intake Section */}
      <FeedIntakeByPond />
    </div>
  );
};

export default FeedingSchedule;
