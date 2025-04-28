import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangleIcon, 
  ThermometerIcon, 
  DropletIcon, 
  CloudRainIcon, 
  WifiIcon,
  WindIcon,
  SunIcon,
  TimerIcon,
  BrainIcon,
  BarChart4Icon,
  CalendarIcon,
  ActivityIcon,
  TrendingUpIcon,
  HeartPulseIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PondPrediction, getGrowthRateColorClass, getRiskLevelColorClass } from '@/utils/pondPredictions';

interface WeatherAlertProps {
  temperature: number;
  humidity: number;
  rainfall: number;
  className?: string;
  pondPredictions?: Record<string, PondPrediction>;
  selectedPondId?: string;
}

const WeatherAlert: React.FC<WeatherAlertProps> = ({ 
  temperature, 
  humidity, 
  rainfall,
  className,
  pondPredictions = {},
  selectedPondId
}) => {
  const selectedPondPrediction = selectedPondId ? pondPredictions[selectedPondId] : null;
  const [activeTab, setActiveTab] = useState('feeding');
  
  // Determine alert levels
  const temperatureAlert = temperature > 35 || temperature < 22;
  const humidityAlert = humidity < 30 || humidity > 90;
  const rainfallAlert = rainfall > 50;
  
  const hasAnyAlert = temperatureAlert || humidityAlert || rainfallAlert;
  
  const renderAlertMessage = () => {
    if (temperature > 35) {
      return {
        icon: <ThermometerIcon className="text-red-500" />,
        message: "High temperature may cause stress to prawns. Consider additional aeration.",
        severity: "high"
      };
    } else if (temperature < 22) {
      return {
        icon: <ThermometerIcon className="text-blue-500" />,
        message: "Low temperature may slow growth. Monitor feeding carefully.",
        severity: "medium"
      };
    } else if (rainfall > 50) {
      return {
        icon: <CloudRainIcon className="text-blue-500" />,
        message: "Heavy rainfall may affect pond water quality. Check pH and salinity.",
        severity: "high"
      };
    } else if (humidity < 30) {
      return {
        icon: <DropletIcon className="text-yellow-500" />,
        message: "Low humidity may increase water evaporation. Monitor water levels.",
        severity: "low"
      };
    } else if (humidity > 90) {
      return {
        icon: <DropletIcon className="text-blue-500" />,
        message: "High humidity with high temperature may reduce oxygen levels. Increase aeration.",
        severity: "medium"
      };
    }
    return null;
  };
  
  const alert = renderAlertMessage();

  // Calculate optimal feed adjustments based on weather
  const calculateFeedAdjustment = () => {
    if (temperature > 35) {
      return {
        reduction: "20%",
        frequency: "Feed during cooler hours (early morning, evening)",
        reason: "High temperatures reduce appetite and increase stress"
      };
    } else if (temperature < 22) {
      return {
        reduction: "30%",
        frequency: "Reduce to once or twice daily",
        reason: "Slow metabolism in cooler temperatures"
      };
    } else if (rainfall > 50) {
      return {
        reduction: "25%",
        frequency: "Consider pausing feeding if water quality deteriorates",
        reason: "Heavy rainfall affects water quality parameters"
      };
    } else if (temperature >= 28 && temperature <= 30) {
      return {
        reduction: "0%",
        frequency: "Regular schedule (3-4 times for juveniles, 2 times for adults)",
        reason: "Optimal temperature range for growth"
      };
    } else {
      return {
        reduction: "10%",
        frequency: "Standard schedule with monitoring",
        reason: "Moderate conditions require regular monitoring"
      };
    }
  };

  const feedAdjustment = calculateFeedAdjustment();

  // Determine optimal harvesting recommendation
  const getHarvestingRecommendation = () => {
    if (temperature >= 28 && temperature <= 32 && rainfall < 30 && humidity >= 40 && humidity <= 80) {
      return {
        status: "favorable",
        message: "Current weather conditions are favorable for harvesting if prawns have reached marketable size."
      };
    } else if (rainfall > 50) {
      return {
        status: "unfavorable",
        message: "Heavy rainfall may stress prawns. Consider delaying harvest until conditions improve."
      };
    } else if (temperature > 35) {
      return {
        status: "caution",
        message: "High temperatures can stress prawns during harvest. Consider early morning or night harvesting."
      };
    } else {
      return {
        status: "neutral",
        message: "Standard harvesting procedures recommended. Monitor water quality parameters."
      };
    }
  };

  const harvestRecommendation = getHarvestingRecommendation();
  
  return (
    <div className={className}>
      <div className="glass-card p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Current Weather Conditions</h3>
          <div className="flex items-center gap-1 text-xs text-aqua-600 dark:text-aqua-400">
            <WifiIcon size={12} className="animate-pulse" />
            <span>Real-time</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <ThermometerIcon size={24} className={cn(
              "mb-2",
              temperatureAlert ? "text-red-500" : "text-aqua-500"
            )} />
            <p className="text-sm font-medium">Temperature</p>
            <p className={cn(
              "text-lg font-semibold",
              temperature > 35 ? "text-red-500" : temperature < 22 ? "text-blue-500" : "text-foreground"
            )}>
              {temperature}°C
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <DropletIcon size={24} className={cn(
              "mb-2",
              humidityAlert ? "text-yellow-500" : "text-aqua-500"
            )} />
            <p className="text-sm font-medium">Humidity</p>
            <p className={cn(
              "text-lg font-semibold",
              humidity > 90 ? "text-blue-500" : humidity < 30 ? "text-yellow-500" : "text-foreground"
            )}>
              {humidity}%
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <CloudRainIcon size={24} className={cn(
              "mb-2",
              rainfallAlert ? "text-blue-500" : "text-aqua-500"
            )} />
            <p className="text-sm font-medium">Rainfall</p>
            <p className={cn(
              "text-lg font-semibold",
              rainfall > 50 ? "text-blue-500" : "text-foreground"
            )}>
              {rainfall} mm
            </p>
          </div>
        </div>
      </div>
      
      {hasAnyAlert && alert && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "border rounded-lg p-4 mb-6 flex items-start gap-3",
            alert.severity === "high" ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800" :
            alert.severity === "medium" ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800" :
            "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
          )}
        >
          <div className="mt-1">{alert.icon}</div>
          <div>
            <h4 className="font-medium mb-1">Weather Alert</h4>
            <p className="text-sm">{alert.message}</p>
          </div>
        </motion.div>
      )}

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="feeding">Smart Feeding</TabsTrigger>
          <TabsTrigger value="analysis">Data Analysis</TabsTrigger>
          <TabsTrigger value="harvesting">Harvesting</TabsTrigger>
          <TabsTrigger value="predictions" className="relative">
            Predictions
            {selectedPondPrediction && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-aqua-500 rounded-full" />
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="feeding" className="space-y-4 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <TimerIcon size={20} className="text-aqua-500" />
              <h4 className="font-medium">Smart Feeding Schedule</h4>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Feed Reduction</span>
                  <span className="font-medium">{feedAdjustment.reduction}</span>
                </div>
                <div className="flex flex-col col-span-2">
                  <span className="text-muted-foreground">Optimal Frequency</span>
                  <span className="font-medium">{feedAdjustment.frequency}</span>
                </div>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Reason: </span>
                <span className="text-xs">{feedAdjustment.reason}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="border rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <BrainIcon size={20} className="text-aqua-500" />
              <h4 className="font-medium">Automated Recommendations</h4>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-aqua-500 font-medium mt-1">•</span>
                <span>{temperature > 30 ? "Increase aeration during feeding to maintain oxygen levels" : "Standard aeration is sufficient for current conditions"}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-aqua-500 font-medium mt-1">•</span>
                <span>{rainfall > 30 ? "Monitor pH levels closely, adjust feed amount based on water clarity" : "Regular pH monitoring recommended"}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-aqua-500 font-medium mt-1">•</span>
                <span>Feed type: {temperature < 25 ? "Higher energy content feed recommended for low temperatures" : "Standard feed composition appropriate"}</span>
              </li>
            </ul>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="analysis" className="space-y-4 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <BarChart4Icon size={20} className="text-aqua-500" />
              <h4 className="font-medium">Real-Time Analysis</h4>
            </div>
            <div className="space-y-3 text-sm">
              <p>Weather conditions are currently {temperature >= 28 && temperature <= 32 ? "optimal" : "suboptimal"} for prawn growth.</p>
              
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Growth Impact</span>
                  <span className={cn(
                    "font-medium",
                    temperature >= 28 && temperature <= 32 ? "text-green-500" : 
                    temperature > 35 || temperature < 22 ? "text-red-500" : "text-yellow-500"
                  )}>
                    {temperature >= 28 && temperature <= 32 ? "Positive" : 
                     temperature > 35 || temperature < 22 ? "Negative" : "Neutral"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Stress Level</span>
                  <span className={cn(
                    "font-medium",
                    temperature > 35 || rainfall > 50 ? "text-red-500" : 
                    temperature < 22 || humidity > 90 ? "text-yellow-500" : "text-green-500"
                  )}>
                    {temperature > 35 || rainfall > 50 ? "High" : 
                     temperature < 22 || humidity > 90 ? "Moderate" : "Low"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="border rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <SunIcon size={20} className="text-aqua-500" />
              <h4 className="font-medium">Environmental Forecast</h4>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Recommended Actions</p>
                <ul className="space-y-1">
                  <li className="flex items-start gap-1">
                    <span className="text-aqua-500 font-medium">•</span>
                    <span>{temperature > 32 ? "Increase water exchange" : "Maintain standard water exchange"}</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="text-aqua-500 font-medium">•</span>
                    <span>{rainfall > 30 ? "Monitor salinity levels" : "Standard monitoring"}</span>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">System Adjustments</p>
                <ul className="space-y-1">
                  <li className="flex items-start gap-1">
                    <span className="text-aqua-500 font-medium">•</span>
                    <span>Aeration: {temperature > 32 || humidity > 85 ? "Increase by 20%" : "Normal operation"}</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="text-aqua-500 font-medium">•</span>
                    <span>Water depth: {temperature > 34 ? "Consider increasing" : "Maintain standard level"}</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="harvesting" className="pt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "border rounded-lg p-4",
              harvestRecommendation.status === "favorable" ? "border-l-4 border-l-green-500" :
              harvestRecommendation.status === "unfavorable" ? "border-l-4 border-l-red-500" :
              harvestRecommendation.status === "caution" ? "border-l-4 border-l-yellow-500" : ""
            )}
          >
            <div className="flex items-center gap-2 mb-3">
              <CalendarIcon size={20} className="text-aqua-500" />
              <h4 className="font-medium">Optimal Harvesting Time</h4>
            </div>
            <p className="text-sm mb-3">{harvestRecommendation.message}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Harvesting Conditions</p>
                <p className={cn(
                  "font-medium",
                  harvestRecommendation.status === "favorable" ? "text-green-500" :
                  harvestRecommendation.status === "unfavorable" ? "text-red-500" :
                  harvestRecommendation.status === "caution" ? "text-yellow-500" : ""
                )}>
                  {harvestRecommendation.status === "favorable" ? "Favorable" :
                   harvestRecommendation.status === "unfavorable" ? "Unfavorable" :
                   harvestRecommendation.status === "caution" ? "Use Caution" : "Neutral"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Best Time to Harvest</p>
                <p className="font-medium">
                  {temperature > 32 ? "Early Morning / Late Evening" : 
                   rainfall > 30 ? "Delay Until Dry Conditions" : "Standard Daytime Hours"}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-aqua-600 border-aqua-200 hover:bg-aqua-50 hover:text-aqua-700"
              >
                View Detailed Harvest Planning
              </Button>
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="predictions" className="pt-4">
          {selectedPondPrediction ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUpIcon size={20} className="text-aqua-500" />
                <h4 className="font-medium">Pond Performance Predictions</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm text-muted-foreground">Growth Rate</span>
                  <p className={cn("font-medium", getGrowthRateColorClass(selectedPondPrediction.growthRate))}>
                    {selectedPondPrediction.growthRate.charAt(0).toUpperCase() + selectedPondPrediction.growthRate.slice(1)}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Risk Level</span>
                  <p className={cn("font-medium", getRiskLevelColorClass(selectedPondPrediction.riskLevel))}>
                    {selectedPondPrediction.riskLevel.charAt(0).toUpperCase() + selectedPondPrediction.riskLevel.slice(1)}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <span className="text-sm text-muted-foreground">Survival Rate</span>
                  <p className="font-medium">{selectedPondPrediction.survivalRate}%</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Days to Harvest</span>
                  <p className="font-medium">{selectedPondPrediction.daysToHarvest}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">FCR</span>
                  <p className="font-medium">{selectedPondPrediction.fcr}</p>
                </div>
              </div>
              
              <div>
                <span className="text-sm text-muted-foreground">Recommendations</span>
                <ul className="mt-1 space-y-2 text-sm">
                  {selectedPondPrediction.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-aqua-500 font-medium mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <ActivityIcon size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-1">No Pond Selected</h3>
              <p className="text-sm text-muted-foreground">
                Select a pond to view performance predictions based on current weather conditions
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WeatherAlert;
