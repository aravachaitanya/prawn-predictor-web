
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface PrawnCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  hoverEffect?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const PrawnCard: React.FC<PrawnCardProps> = ({
  title,
  description,
  icon,
  hoverEffect = true,
  className,
  children,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hoverEffect ? { y: -5, transition: { duration: 0.2 } } : undefined}
      className={cn(
        "glass-card p-6 overflow-hidden",
        "transition-all duration-300 ease-in-out",
        className
      )}
    >
      {icon && (
        <div className="mb-4 text-aqua-500">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
      )}
      {children}
    </motion.div>
  );
};

export default PrawnCard;
