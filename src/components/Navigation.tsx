
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, CalendarIcon, CloudSunIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Home', path: '/', icon: <HomeIcon size={24} /> },
    { name: 'Feeding Guide', path: '/feeding-guide', icon: <CalendarIcon size={24} /> },
    { name: 'Weather Care', path: '/weather-care', icon: <CloudSunIcon size={24} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 py-2 px-6 z-50">
      <div className="max-w-md mx-auto flex justify-between items-center">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center p-2 rounded-lg transition-all duration-300 ease-in-out",
              location.pathname === item.path 
                ? "text-aqua-600 scale-110" 
                : "text-gray-500 hover:text-aqua-500"
            )}
          >
            <div className={cn(
              "mb-1 transition-transform duration-300",
              location.pathname === item.path && "animate-float"
            )}>
              {item.icon}
            </div>
            <span className="text-xs font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
