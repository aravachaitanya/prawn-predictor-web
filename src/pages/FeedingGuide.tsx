
import React from 'react';
import { motion } from 'framer-motion';
import { Navigation, FeedingSchedule, PrawnCard } from '@/components';
import { InfoIcon, FishIcon, DollarSignIcon, ThermometerIcon, DropletIcon } from 'lucide-react';

const FeedingGuide = () => {
  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-aqua-50/50 to-white dark:from-gray-900/50 dark:to-gray-950">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-8 px-6 max-w-md mx-auto"
      >
        <h1 className="text-2xl font-bold mb-2">Vannamei Feeding Guide</h1>
        <p className="text-muted-foreground mb-8">
          Optimize your vannamei shrimp feeding schedule based on age, size and pond conditions.
        </p>
        
        <FeedingSchedule className="mb-8" />
        
        <h2 className="text-xl font-medium mb-4">Vannamei Feeding Best Practices</h2>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <PrawnCard
            title="Feeding Frequency"
            icon={<InfoIcon size={24} />}
            className="border-l-4 border-aqua-400"
          >
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-aqua-500 font-medium">•</span>
                <span>Post-larvae (PL10-20): Feed 6-8 times daily</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-aqua-500 font-medium">•</span>
                <span>Juvenile (1-5g): Feed 4-5 times daily</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-aqua-500 font-medium">•</span>
                <span>Growing (5-15g): Feed 3-4 times daily</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-aqua-500 font-medium">•</span>
                <span>Final stage (15g+): Feed 2-3 times daily</span>
              </li>
            </ul>
          </PrawnCard>
          
          <PrawnCard
            title="Feed Types by Growth Stage"
            icon={<FishIcon size={24} />}
            className="border-l-4 border-aqua-400"
          >
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium">PL10-20</td>
                  <td className="py-2">High protein (40-45%), 0.3-0.5mm crumbles</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">1-5g</td>
                  <td className="py-2">35-40% protein, 0.8-1.2mm pellets</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">5-15g</td>
                  <td className="py-2">30-35% protein, 1.8-2.2mm pellets</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">15g+</td>
                  <td className="py-2">25-30% protein, 2.5-3mm pellets</td>
                </tr>
              </tbody>
            </table>
          </PrawnCard>
          
          <PrawnCard
            title="Feeding Efficiency Tips"
            icon={<DollarSignIcon size={24} />}
            className="border-l-4 border-aqua-400"
          >
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-aqua-500 font-medium">•</span>
                <span>Use feeding trays to monitor consumption (4-6 trays per hectare)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-aqua-500 font-medium">•</span>
                <span>Check feeding trays 2 hours after feeding</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-aqua-500 font-medium">•</span>
                <span>Increase amount by 5-10% if all feed is consumed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-aqua-500 font-medium">•</span>
                <span>Decrease by 10-20% if more than 30% feed remains</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-aqua-500 font-medium">•</span>
                <span>Calculate FCR regularly: Feed given ÷ Weight gained</span>
              </li>
            </ul>
          </PrawnCard>

          <PrawnCard
            title="Vannamei-Specific Considerations"
            icon={<ThermometerIcon size={24} />}
            className="border-l-4 border-aqua-400"
          >
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-aqua-500 font-medium">•</span>
                <span>Optimal temperature: 28-32°C (82-90°F)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-aqua-500 font-medium">•</span>
                <span>Salinity: 10-15 ppt ideal for growth</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-aqua-500 font-medium">•</span>
                <span>Dissolved oxygen: Maintain above 4 mg/L</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-aqua-500 font-medium">•</span>
                <span>pH: 7.5-8.5 is optimal range</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-aqua-500 font-medium">•</span>
                <span>Reduce feeding during molting periods</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-aqua-500 font-medium">•</span>
                <span>Target FCR: 1.2-1.8 for efficient production</span>
              </li>
            </ul>
          </PrawnCard>
          
          <PrawnCard
            title="Recommended pH Levels by Pond Size"
            icon={<DropletIcon size={24} />}
            className="border-l-4 border-aqua-400"
          >
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium">Small ponds (&lt;0.5 ha)</td>
                  <td className="py-2">7.8-8.2 pH</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Medium ponds (0.5-2 ha)</td>
                  <td className="py-2">7.6-8.3 pH</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Large ponds (&gt;2 ha)</td>
                  <td className="py-2">7.5-8.5 pH</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Biofloc systems</td>
                  <td className="py-2">7.2-7.8 pH</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-3 text-sm text-muted-foreground">
              <p>pH considerations for Vannamei farming:</p>
              <ul className="mt-2 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-aqua-500 font-medium">•</span>
                  <span>Smaller ponds require tighter pH control due to rapid fluctuations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-aqua-500 font-medium">•</span>
                  <span>Morning pH is typically lower due to nighttime respiration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-aqua-500 font-medium">•</span>
                  <span>Apply agricultural limestone to increase pH if below 7.5</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-aqua-500 font-medium">•</span>
                  <span>If pH exceeds 8.5, increase water exchange by 10-15%</span>
                </li>
              </ul>
            </div>
          </PrawnCard>
        </div>
      </motion.div>
      
      <Navigation />
    </div>
  );
};

export default FeedingGuide;
