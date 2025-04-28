
import { useState, useEffect, useCallback } from 'react';
import { WeatherService } from '@/services/weatherService';
import { WeatherCareRecommendation } from '@/utils/weatherUtils';
import { useToast } from '@/hooks/use-toast';

interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
}

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData>({ temperature: 0, humidity: 0, rainfall: 0 });
  const [recommendations, setRecommendations] = useState<WeatherCareRecommendation[]>([]);
  const [feedingRecommendation, setFeedingRecommendation] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const fetchWeatherData = useCallback(async () => {
    setLoading(true);
    try {
      // Get weather data from the weather service
      const weatherData = await WeatherService.getLocalWeather();
      setWeather(weatherData);
      
      // Get recommendations from the weather service
      setRecommendations(WeatherService.getWeatherCareRecommendations(weatherData));
      
      // Get feeding recommendation from the weather service
      setFeedingRecommendation(WeatherService.getFeedingRecommendation(weatherData));
      
      toast({
        title: "Weather updated",
        description: "Latest weather data has been loaded",
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      toast({
        title: "Weather update failed",
        description: "Could not fetch the latest weather data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    fetchWeatherData();
    
    // Set up automatic refresh every 30 minutes
    const refreshInterval = setInterval(fetchWeatherData, 30 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [fetchWeatherData]);
  
  return {
    weather,
    recommendations,
    feedingRecommendation,
    loading,
    fetchWeatherData
  };
};
