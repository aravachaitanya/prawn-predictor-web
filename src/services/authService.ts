
// Authentication service to handle all auth related operations
interface User {
  email?: string;
  phone?: string;
  displayName?: string;
}

// Local storage keys
const AUTH_STORAGE_KEY = 'isAuthenticated';
const USER_STORAGE_KEY = 'user';

/**
 * AuthService - Handles all authentication related operations
 */
export const AuthService = {
  /**
   * Login user and store authentication data in localStorage
   */
  login: (userData: User): void => {
    localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  },

  /**
   * Logout user and remove authentication data from localStorage
   */
  logout: (): void => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  },

  /**
   * Get user data from localStorage
   */
  getUser: (): User | null => {
    const userData = localStorage.getItem(USER_STORAGE_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Mock authentication API call with email
   * In a real application, this would be an API call to a backend service
   */
  authenticateWithEmail: async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication logic
    if (email === "admin@example.com" && password === "password") {
      return { success: true };
    }
    
    return { 
      success: false, 
      message: "Invalid email or password. Try admin@example.com / password" 
    };
  },

  /**
   * Mock authentication API call with phone number
   * In a real application, this would be an API call to a backend service
   */
  authenticateWithPhone: async (phone: string, code: string): Promise<{ success: boolean; message?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication logic - accept any 6-digit code for the demo phone number
    if (phone === "+12345678901" && code.length === 6) {
      return { success: true };
    }
    
    return { 
      success: false, 
      message: "Invalid phone number or verification code. Try +12345678901 with any 6-digit code" 
    };
  },

  /**
   * Mock send verification code
   * In a real application, this would be an API call to a backend service that sends SMS
   */
  sendVerificationCode: async (phone: string): Promise<{ success: boolean; message?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock sending verification code
    if (phone === "+12345678901") {
      return { success: true, message: "Verification code sent! For demo, use any 6-digit code." };
    }
    
    return { 
      success: false, 
      message: "Failed to send verification code. Try demo number: +12345678901" 
    };
  }
};
