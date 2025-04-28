
export interface FeedingScheduleType {
  dailyAmount: number;
  feedingTimes: string[];
  proteinContent: number;
  feedType: string;
  feedSize: number;
  applicationMethod: string;
}

// Calculate feeding schedule based on prawn age, pond size and stocking density
export const calculateFeedingSchedule = (
  prawnAge: number,
  pondSize: number, 
  stockingDensity: number
): FeedingScheduleType => {
  let feedingRate: number;
  let proteinContent: number;
  let feedSize: number;
  let feedType: string;
  let feedingTimes: string[];
  let applicationMethod: string;
  
  // Estimated total prawn weight in the pond
  const estimatedPrawnWeight = calculateEstimatedBiomass(prawnAge, pondSize, stockingDensity);
  
  // Adjust feeding based on prawn age
  if (prawnAge <= 30) {
    // Post larvae to juvenile stage
    feedingRate = 0.08; // 8% of body weight
    proteinContent = 40;
    feedSize = 0.5;
    feedType = "Crumbled High-Protein Feed";
    feedingTimes = ["06:00", "10:00", "14:00", "18:00", "22:00"];
    applicationMethod = "Broadcast evenly";
  } else if (prawnAge <= 60) {
    // Juvenile stage
    feedingRate = 0.06; // 6% of body weight
    proteinContent = 35;
    feedSize = 1.0;
    feedType = "Pelleted Prawn Feed";
    feedingTimes = ["06:00", "12:00", "18:00", "22:00"];
    applicationMethod = "Feed tray + broadcast";
  } else if (prawnAge <= 90) {
    // Growing stage
    feedingRate = 0.04; // 4% of body weight
    proteinContent = 30;
    feedSize = 2.0;
    feedType = "Standard Growth Feed";
    feedingTimes = ["06:00", "14:00", "22:00"];
    applicationMethod = "Feed tray monitoring";
  } else {
    // Final growth stage
    feedingRate = 0.03; // 3% of body weight
    proteinContent = 25;
    feedSize = 3.0;
    feedType = "Finishing Feed";
    feedingTimes = ["06:00", "18:00"];
    applicationMethod = "Feed tray with careful monitoring";
  }
  
  // Calculate daily feed amount in kg
  const dailyAmount = calculateDailyFeed(estimatedPrawnWeight, feedingRate);
  
  return {
    dailyAmount: parseFloat(dailyAmount.toFixed(2)),
    feedingTimes,
    proteinContent,
    feedType,
    feedSize,
    applicationMethod
  };
};

// Calculate estimated biomass based on age, pond size and stocking density
const calculateEstimatedBiomass = (
  prawnAge: number, 
  pondSize: number, 
  stockingDensity: number
): number => {
  // Estimate individual prawn weight based on age (in grams)
  let individualWeight: number;
  
  if (prawnAge < 30) {
    // Early stage growth
    individualWeight = 0.5 + (prawnAge * 0.05);
  } else if (prawnAge < 60) {
    // Juvenile stage
    individualWeight = 2 + ((prawnAge - 30) * 0.2);
  } else if (prawnAge < 90) {
    // Growing stage
    individualWeight = 8 + ((prawnAge - 60) * 0.3);
  } else {
    // Final stage
    individualWeight = 17 + ((prawnAge - 90) * 0.2);
  }
  
  // Estimate survival rate based on age
  const survivalRate = Math.max(0.5, 1 - (prawnAge * 0.002));
  
  // Calculate total prawns
  const totalPrawns = pondSize * 10000 * stockingDensity * survivalRate;
  
  // Calculate total biomass in kg
  return (totalPrawns * individualWeight) / 1000;
};

// Calculate daily feed amount
const calculateDailyFeed = (totalBiomass: number, feedingRate: number): number => {
  return totalBiomass * feedingRate;
};

// Feeding recommendations based on weather conditions
export const getWeatherBasedFeedingRecommendations = (
  temperature: number,
  rainfall: number
): string => {
  if (temperature > 35) {
    return "Reduce feed by 20% and feed during cooler hours (early morning, evening).";
  } else if (temperature < 22) {
    return "Reduce feed by 30% as metabolism slows down in cooler temperatures.";
  } else if (rainfall > 50) {
    return "Temporarily pause feeding if water quality is affected by heavy rainfall.";
  } else if (temperature >= 28 && temperature <= 32) {
    return "Optimal temperature range - maintain regular feeding schedule.";
  } else {
    return "Normal feeding schedule recommended. Monitor consumption in feeding trays.";
  }
};
