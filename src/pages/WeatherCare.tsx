
import React from 'react';
import { motion } from 'framer-motion';
import { Navigation, WeatherAlert, PrawnCard, FeedIntakeByPond } from '@/components';
import { Button } from '@/components/ui/button';
import { CloudSunIcon, ThermometerIcon, DropletIcon, CloudRainIcon, RefreshCwIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWeather } from '@/hooks/useWeather';

const WeatherCare = () => {
  const { weather, recommendations, feedingRecommendation, loading, fetchWeatherData } = useWeather();
  
  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-aqua-50/50 to-white dark:from-gray-900/50 dark:to-gray-950">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-8 px-6 max-w-md mx-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Weather Care</h1>
            <p className="text-muted-foreground">
              Weather-based recommendations
            </p>
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={fetchWeatherData}
            className="h-10 w-10"
            disabled={loading}
          >
            <RefreshCwIcon size={18} className={cn(loading && "animate-spin")} />
          </Button>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <CloudSunIcon size={48} className="text-aqua-400 animate-pulse mb-4" />
            <p className="text-muted-foreground">Loading weather data...</p>
          </div>
        ) : (
          <>
            <WeatherAlert 
              temperature={weather.temperature}
              humidity={weather.humidity}
              rainfall={weather.rainfall}
              className="mb-8"
            />
            
            <section className="mb-8">
              <h2 className="text-xl font-medium mb-4">Feeding Adjustment</h2>
              <PrawnCard
                title="Weather-Based Feeding Recommendation"
                className="border-l-4 border-aqua-400"
              >
                <p className="text-sm">{feedingRecommendation}</p>
              </PrawnCard>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-medium mb-4">Pond Performance Predictions</h2>
              <FeedIntakeByPond 
                temperature={weather.temperature}
                humidity={weather.humidity}
                rainfall={weather.rainfall}
              />
            </section>
            
            {recommendations.length > 0 && (
              <section>
                <h2 className="text-xl font-medium mb-4">Care Recommendations</h2>
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <PrawnCard
                        title={rec.title}
                        description={rec.description}
                        icon={
                          rec.type === 'temperature' ? <ThermometerIcon size={24} /> :
                          rec.type === 'rainfall' ? <CloudRainIcon size={24} /> :
                          <DropletIcon size={24} />
                        }
                        className={cn(
                          "border-l-4",
                          rec.severity === 'high' ? "border-red-500" :
                          rec.severity === 'medium' ? "border-yellow-500" :
                          "border-blue-500"
                        )}
                      >
                        <ul className="mt-2 space-y-1 text-sm">
                          {rec.actions.map((action, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-aqua-500 font-medium">•</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </PrawnCard>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </motion.div>
      
      <Navigation />
    </div>
  );
};

export default WeatherCare;
