
import { WeatherCareRecommendation, getWeatherCareRecommendations } from '@/utils/weatherUtils';
import { getWeatherBasedFeedingRecommendations } from '@/utils/feedingData';

interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
}

/**
 * WeatherService - Handles all weather related operations
 */
export const WeatherService = {
  /**
   * Get local weather data
   */
  getLocalWeather: async (): Promise<WeatherData> => {
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
  },

  /**
   * Get weather care recommendations based on weather data
   */
  getWeatherCareRecommendations: (weather: WeatherData): WeatherCareRecommendation[] => {
    return getWeatherCareRecommendations(
      weather.temperature,
      weather.humidity,
      weather.rainfall
    );
  },

  /**
   * Get feeding recommendations based on weather data
   */
  getFeedingRecommendation: (weather: WeatherData): string => {
    return getWeatherBasedFeedingRecommendations(
      weather.temperature,
      weather.rainfall
    );
  }
};
