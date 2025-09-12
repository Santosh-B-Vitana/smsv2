
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'super_admin' | 'admin' | 'staff' | 'parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  schoolId?: string; // For tracking which school the user belongs to
  // Role-specific data
  staffData?: {
    employeeId: string;
    department: string;
    designation: string;
  };
  parentData?: {
    children: string[]; // student IDs
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: 'super_admin1',
  name: 'Super Admin Access',
    email: 'superadmin@schoolsystem.com',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=center'
  },
  {
    id: 'admin1',
  name: 'Dr. Rajesh Sharma',
  email: 'admin@vitanaSchools.edu',
    role: 'admin',
    schoolId: 'school1',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=center'
  },
  {
    id: 'staff1',
    name: 'Anil Kumar',
  email: 'anil.kumar@vitanaSchools.edu',
    role: 'staff',
    schoolId: 'school1',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=center',
    staffData: {
      employeeId: 'STAFF002',
      department: 'Mathematics',
      designation: 'Mathematics Teacher'
    }
  },
  {
    id: 'parent1',
  name: 'Suresh Gupta',
  email: 'suresh.gupta@email.com',
    role: 'parent',
    schoolId: 'school1',
  avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop&crop=center',
  parentData: {
      children: ['STU001']
    }
  }
];

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('AuthProvider: Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    
    setLoading(false);
    
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Find user
      const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      
      if (!foundUser) {
        throw new Error('No account found with this email address');
      }

      // Check password (simple check for demo)
      if (password !== 'password') {
        throw new Error('Invalid password');
      }

      // Success
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      
      // Navigate to correct dashboard after successful login
      if (foundUser.role === 'admin') {
        window.location.href = '/admin-dashboard';
      } else if (foundUser.role === 'staff') {
        window.location.href = '/staff-dashboard';
      } else if (foundUser.role === 'parent') {
        window.location.href = '/parent-dashboard';
      } else if (foundUser.role === 'super_admin') {
        window.location.href = '/super-admin-dashboard';
      } else {
        window.location.href = '/dashboard';
      }
      
    } catch (error) {
      console.error('AuthProvider: Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    
    setUser(null);
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
