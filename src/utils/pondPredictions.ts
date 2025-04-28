
import { WeatherCareRecommendation } from './weatherUtils';

// Interface for pond prediction results
export interface PondPrediction {
  growthRate: 'accelerated' | 'normal' | 'reduced' | 'severely reduced';
  survivalRate: number; // percentage
  daysToHarvest: number;
  fcr: number; // Feed Conversion Ratio
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

// Interface for pond data with feeding information
export interface PondData {
  id: string;
  pondNumber: string;
  size: number;
  feedingType: string;
  feedAmount: number;
  consumptionRate: number;
}

/**
 * Calculate pond predictions based on weather conditions and feeding data
 */
export const calculatePondPredictions = (
  temperature: number,
  humidity: number,
  rainfall: number,
  pond: PondData
): PondPrediction => {
  // Base values for optimal conditions
  let baseGrowthRate: 'accelerated' | 'normal' | 'reduced' | 'severely reduced' = 'normal';
  let baseSurvivalRate = 90; // 90% survival in optimal conditions
  let baseDaysToHarvest = 120; // 120 days in optimal conditions
  let baseFCR = 1.6; // Feed Conversion Ratio in optimal conditions
  let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
  const recommendations: string[] = [];

  // Adjust for temperature effects
  if (temperature > 35) {
    baseGrowthRate = 'severely reduced';
    baseSurvivalRate -= 15;
    baseDaysToHarvest += 20;
    baseFCR += 0.4;
    riskLevel = 'critical';
    recommendations.push('Extreme temperature is critically affecting prawn health. Increase aeration immediately.');
  } else if (temperature > 32) {
    baseGrowthRate = 'reduced';
    baseSurvivalRate -= 8;
    baseDaysToHarvest += 10;
    baseFCR += 0.2;
    riskLevel = 'high';
    recommendations.push('High temperature is slowing growth. Consider additional aeration and feed during cooler periods.');
  } else if (temperature >= 28 && temperature <= 30) {
    baseGrowthRate = 'accelerated';
    baseSurvivalRate += 3;
    baseDaysToHarvest -= 5;
    baseFCR -= 0.1;
    recommendations.push('Temperature is in optimal range for growth. Maintain current conditions.');
  } else if (temperature < 24) {
    baseGrowthRate = 'reduced';
    baseSurvivalRate -= 5;
    baseDaysToHarvest += 15;
    baseFCR += 0.3;
    riskLevel = 'high';
    recommendations.push('Low temperature is reducing metabolic rate. Reduce feeding amount to avoid waste.');
  }

  // Adjust for rainfall effects
  if (rainfall > 60) {
    baseSurvivalRate -= 10;
    baseDaysToHarvest += 15;
    baseFCR += 0.3;
    riskLevel = riskLevel === 'critical' ? 'critical' : 'high';
    recommendations.push('Heavy rainfall is affecting water quality. Monitor pH and adjust feed accordingly.');
  } else if (rainfall > 30) {
    baseSurvivalRate -= 5;
    baseDaysToHarvest += 5;
    baseFCR += 0.1;
    riskLevel = riskLevel === 'low' ? 'medium' : riskLevel;
    recommendations.push('Moderate rainfall may alter water parameters. Check water quality regularly.');
  }

  // Adjust for humidity effects (when combined with temperature)
  if (humidity > 90 && temperature > 30) {
    baseSurvivalRate -= 7;
    baseDaysToHarvest += 8;
    baseFCR += 0.2;
    riskLevel = riskLevel === 'low' ? 'medium' : riskLevel;
    recommendations.push('High humidity with high temperature may reduce oxygen levels. Consider additional aeration.');
  } else if (humidity < 30) {
    baseSurvivalRate -= 3;
    recommendations.push('Low humidity may increase water evaporation. Monitor water levels.');
  }

  // Adjust for feed consumption rate
  if (pond.consumptionRate < 60) {
    baseDaysToHarvest += 10;
    baseFCR += 0.4;
    riskLevel = riskLevel === 'low' ? 'medium' : riskLevel;
    recommendations.push('Low feed consumption indicates potential stress or health issues. Check water quality and prawn health.');
  } else if (pond.consumptionRate > 95) {
    baseGrowthRate = baseGrowthRate === 'severely reduced' ? 'reduced' : 
                    baseGrowthRate === 'reduced' ? 'normal' : 'accelerated';
    baseDaysToHarvest -= 8;
    baseFCR -= 0.2;
    recommendations.push('Excellent feed consumption. Consider incremental increase in feed amount.');
  }

  // Pond size factor (larger ponds may have more stability but slower identification of issues)
  if (pond.size > 3) {
    riskLevel = riskLevel === 'critical' ? 'high' : 
               riskLevel === 'high' ? 'medium' : riskLevel;
    recommendations.push('Large pond size helps buffer environmental changes. Ensure adequate water circulation throughout.');
  } else if (pond.size < 0.5) {
    riskLevel = riskLevel === 'low' ? 'medium' : 
               riskLevel === 'medium' ? 'high' : riskLevel;
    recommendations.push('Small pond size may lead to rapid parameter changes. Monitor more frequently.');
  }

  // Ensure survival rate doesn't go below 50% or above 95%
  baseSurvivalRate = Math.max(50, Math.min(95, baseSurvivalRate));
  
  // Ensure FCR doesn't go below 1.3 (theoretically optimal) or above 3.0 (very poor)
  baseFCR = Math.max(1.3, Math.min(3.0, baseFCR));

  return {
    growthRate: baseGrowthRate,
    survivalRate: baseSurvivalRate,
    daysToHarvest: baseDaysToHarvest,
    fcr: parseFloat(baseFCR.toFixed(2)),
    riskLevel,
    recommendations
  };
};

// Generate sample predictions for all ponds (when actual feeding data is not available)
export const generatePondPredictions = (
  temperature: number,
  humidity: number,
  rainfall: number,
  ponds: { id: string; pondNumber: string; size: number; feedingType: string; }[]
): Record<string, PondPrediction> => {
  const predictions: Record<string, PondPrediction> = {};
  
  ponds.forEach(pond => {
    // Generate sample consumption data if not provided
    const samplePondData: PondData = {
      ...pond,
      feedAmount: 5.0, // Sample feed amount
      consumptionRate: Math.min(95, Math.max(60, 80 - (Math.abs(temperature - 28) * 2))), // Sample rate based on how far from optimal temp
    };
    
    predictions[pond.id] = calculatePondPredictions(
      temperature,
      humidity,
      rainfall,
      samplePondData
    );
  });
  
  return predictions;
};

// Get color class based on growth rate
export const getGrowthRateColorClass = (growthRate: string): string => {
  switch (growthRate) {
    case 'accelerated': return 'text-green-600';
    case 'normal': return 'text-aqua-600';
    case 'reduced': return 'text-yellow-600';
    case 'severely reduced': return 'text-red-600';
    default: return 'text-muted-foreground';
  }
};

// Get color class based on risk level
export const getRiskLevelColorClass = (riskLevel: string): string => {
  switch (riskLevel) {
    case 'low': return 'text-green-600';
    case 'medium': return 'text-yellow-600';
    case 'high': return 'text-orange-600';
    case 'critical': return 'text-red-600';
    default: return 'text-muted-foreground';
  }
};
