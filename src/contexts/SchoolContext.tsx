
import React, { createContext, useContext, useEffect, useState } from 'react';
import { mockApi, SchoolInfo } from '../services/mockApi';

interface SchoolContextType {
  schoolInfo: SchoolInfo | null;
  loading: boolean;
  error: string | null;
  refreshSchoolInfo: () => Promise<void>;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (context === undefined) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};

interface SchoolProviderProps {
  children: React.ReactNode;
}

export const SchoolProvider: React.FC<SchoolProviderProps> = ({ children }) => {
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSchoolInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const info = await mockApi.getSchoolInfo();
      setSchoolInfo(info);
    } catch (err) {
      setError('Failed to load school information');
      console.error('Error fetching school info:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSchoolInfo();
  }, []);

  const value: SchoolContextType = {
    schoolInfo,
    loading,
    error,
    refreshSchoolInfo
  };

  return (
    <SchoolContext.Provider value={value}>
      {children}
    </SchoolContext.Provider>
  );
};
