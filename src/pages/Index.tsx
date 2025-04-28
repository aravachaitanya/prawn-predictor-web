
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Navigation, PrawnCard } from '@/components';
import { Button } from '@/components/ui/button';
import { FishIcon, CalendarIcon, CloudSunIcon, TrendingUpIcon } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen pb-20">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden pt-12 pb-20 px-6"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-aqua-100/80 to-white/20 dark:from-aqua-900/20 dark:to-black/0 -z-10" />
        
        <div className="max-w-md mx-auto text-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <FishIcon size={48} className="text-aqua-500" />
              <motion.div
                animate={{ 
                  opacity: [0.2, 0.8, 0.2],
                  scale: [0.8, 1.1, 0.8],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute inset-0 bg-aqua-300/20 dark:bg-aqua-500/20 rounded-full blur-xl -z-10"
              />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl font-bold mb-3 tracking-tight"
          >
            PrawnPredictor
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-muted-foreground mb-10"
          >
            Optimize your prawn culture with smart feeding schedules and weather-based care recommendations.
          </motion.p>
          
          <div className="grid grid-cols-1 gap-6 mb-10">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Link to="/feeding-guide">
                <PrawnCard
                  title="Feeding Guide"
                  description="Get personalized feeding schedules based on prawn age and pond conditions."
                  icon={<CalendarIcon size={28} />}
                  className="h-full"
                >
                  <Button variant="outline" className="w-full mt-2 border-aqua-300 hover:bg-aqua-100 dark:hover:bg-aqua-950">
                    View Feeding Guide
                  </Button>
                </PrawnCard>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link to="/weather-care">
                <PrawnCard
                  title="Weather Care"
                  description="Receive recommendations based on current weather conditions."
                  icon={<CloudSunIcon size={28} />}
                  className="h-full"
                >
                  <Button variant="outline" className="w-full mt-2 border-aqua-300 hover:bg-aqua-100 dark:hover:bg-aqua-950">
                    Check Weather Care
                  </Button>
                </PrawnCard>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <PrawnCard
                title="Prawn Growth Tracker"
                description="Track growth patterns and project harvesting schedules."
                icon={<TrendingUpIcon size={28} />}
                className="h-full"
              >
                <Button variant="outline" className="w-full mt-2 border-aqua-300 hover:bg-aqua-100 dark:hover:bg-aqua-950" disabled>
                  Coming Soon
                </Button>
              </PrawnCard>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      <Navigation />
    </div>
  );
};

export default Index;
