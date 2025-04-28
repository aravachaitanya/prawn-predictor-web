
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOutIcon, UserIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Display either email or phone
  const displayIdentifier = user?.email || user?.phone || '';
  
  if (!isAuthenticated) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="fixed top-4 right-4 z-50"
        onClick={() => navigate('/login')}
      >
        <UserIcon className="h-4 w-4 mr-2" />
        Log in
      </Button>
    );
  }
  
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <span className="text-sm font-medium hidden sm:inline-block">
        {displayIdentifier}
      </span>
      <Button 
        variant="outline" 
        size="sm"
        onClick={logout}
      >
        <LogOutIcon className="h-4 w-4 mr-2" />
        Log out
      </Button>
    </div>
  );
};

export default UserMenu;
