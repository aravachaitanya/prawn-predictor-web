
// Weather-based care recommendations
export const getWeatherCareRecommendations = (
  temperature: number,
  humidity: number,
  rainfall: number
): WeatherCareRecommendation[] => {
  const recommendations: WeatherCareRecommendation[] = [];

  // Temperature-based recommendations
  if (temperature > 35) {
    recommendations.push({
      type: 'temperature',
      severity: 'high',
      title: 'High Temperature Alert',
      description: 'Prawns may experience stress due to high temperature.',
      actions: [
        'Increase aeration to maintain adequate dissolved oxygen levels.',
        'Consider adding additional aerators or using a paddle wheel aerator.',
        'Apply feed during cooler hours of the day (early morning, late evening).',
        'Reduce feeding quantity by 15-20%.',
        'Monitor oxygen levels closely, especially during early morning hours.'
      ]
    });
  } else if (temperature < 22) {
    recommendations.push({
      type: 'temperature',
      severity: 'medium',
      title: 'Low Temperature Alert',
      description: 'Prawn metabolism slows down at lower temperatures.',
      actions: [
        'Reduce feeding by 30% as prawns consume less food.',
        'Monitor leftover feed carefully to avoid water quality issues.',
        'Check water quality parameters more frequently.',
        'Consider adding probiotics to maintain water quality.',
        'Adjust feed protein content if low temperature persists.'
      ]
    });
  } else if (temperature >= 28 && temperature <= 32) {
    recommendations.push({
      type: 'temperature',
      severity: 'low',
      title: 'Optimal Temperature',
      description: 'Current temperature is in the ideal range for prawn growth.',
      actions: [
        'Maintain regular feeding schedule.',
        'Monitor normal water quality parameters.',
        'Continue standard pond management practices.',
      ]
    });
  }

  // Rainfall-based recommendations
  if (rainfall > 50) {
    recommendations.push({
      type: 'rainfall',
      severity: 'high',
      title: 'Heavy Rainfall Alert',
      description: 'Heavy rainfall may affect pond water quality and cause stress.',
      actions: [
        'Check and adjust pH levels if necessary.',
        'Monitor salinity levels which may decrease due to rainwater.',
        'Ensure proper drainage systems are functioning.',
        'Temporarily reduce or pause feeding if water is highly turbid.',
        'Add lime if pH drops significantly.',
        'Watch for sudden changes in water color or odor.'
      ]
    });
  } else if (rainfall > 20 && rainfall <= 50) {
    recommendations.push({
      type: 'rainfall',
      severity: 'medium',
      title: 'Moderate Rainfall',
      description: 'Moderate rainfall may cause some changes in water parameters.',
      actions: [
        'Monitor water pH and adjust if necessary.',
        'Check water color for any unusual changes.',
        'Ensure proper water inflow and outflow.',
        'Adjust feeding accordingly if water becomes turbid.'
      ]
    });
  } else if (rainfall <= 5 && temperature > 30) {
    recommendations.push({
      type: 'rainfall',
      severity: 'medium',
      title: 'Dry Conditions',
      description: 'Low rainfall with high temperature may lead to water quality issues.',
      actions: [
        'Maintain adequate water levels in the pond.',
        'Increase water exchange if necessary.',
        'Monitor dissolved oxygen levels more frequently.',
        'Consider adding fresh water to compensate for evaporation.'
      ]
    });
  }

  // Humidity-based recommendations
  if (humidity > 90 && temperature > 30) {
    recommendations.push({
      type: 'humidity',
      severity: 'medium',
      title: 'High Humidity and Temperature',
      description: 'Combined high humidity and temperature may reduce oxygen levels.',
      actions: [
        'Increase aeration, especially during night hours.',
        'Monitor oxygen levels closely in early morning.',
        'Reduce stocking density for future cycles if this condition persists seasonally.',
        'Consider emergency oxygen supplementation equipment.'
      ]
    });
  } else if (humidity < 30) {
    recommendations.push({
      type: 'humidity',
      severity: 'low',
      title: 'Low Humidity Alert',
      description: 'Low humidity may increase water evaporation rate.',
      actions: [
        'Monitor water levels more frequently.',
        'Be prepared to add fresh water to maintain optimal levels.',
        'Check salinity levels which may increase due to evaporation.'
      ]
    });
  }

  return recommendations;
};

export interface WeatherCareRecommendation {
  type: 'temperature' | 'rainfall' | 'humidity';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  actions: string[];
}

// Get real-time weather data
export const getLocalWeather = async (): Promise<{ temperature: number; humidity: number; rainfall: number }> => {
  try {
    // Use OpenWeatherMap API for real weather data (free tier)
    // Default location: Manila, Philippines (common area for prawn farming)
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Manila,ph&units=metric&appid=bd5e378503939ddaee76f12ad7a97608`
    );
    
    if (!response.ok) {
      throw new Error('Weather data fetch failed');
    }
    
    const data = await response.json();
    
    return {
      temperature: Math.round(data.main.temp), // Temperature in Celsius
      humidity: data.main.humidity, // Humidity in %
      rainfall: data.rain ? Math.round(data.rain['1h'] * 10) : 0, // Convert to mm if available, or 0 if no rain
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Fallback to simulated data if the API fails
    return {
      temperature: Math.floor(Math.random() * (38 - 20) + 20), // Between 20°C and 38°C
      humidity: Math.floor(Math.random() * (95 - 25) + 25),    // Between 25% and 95%
      rainfall: Math.floor(Math.random() * 80),               // Between 0mm and 80mm
    };
  }
};
