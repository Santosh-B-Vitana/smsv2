
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export type ModuleName = 
  | 'students' 
  | 'staff' 
  | 'attendance' 
  | 'fees' 
  | 'timetable' 
  | 'examinations' 
  | 'announcements' 
  | 'reports' 
  | 'documents'
  | 'admissions';

export type PermissionLevel = 'read' | 'write' | 'delete';

export interface ModulePermissions {
  enabled: boolean;
  permissions: PermissionLevel[];
}

export interface SchoolPermissions {
  schoolId: string;
  schoolName: string;
  modules: Record<ModuleName, ModulePermissions>;
}

interface PermissionsContextType {
  schoolPermissions: SchoolPermissions[];
  currentSchoolPermissions: Record<ModuleName, ModulePermissions> | null;
  updateSchoolPermissions: (schoolId: string, moduleName: ModuleName, permissions: ModulePermissions) => Promise<void>;
  hasPermission: (module: ModuleName, permission: PermissionLevel) => boolean;
  isModuleEnabled: (module: ModuleName) => boolean;
  loading: boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};

// Enhanced mock data for more realistic permissions
const createSchoolPermissions = (schoolId: string, schoolName: string, isRestricted = false): SchoolPermissions => {
  const fullPermissions: ModulePermissions = {
    enabled: true,
    permissions: ['read', 'write', 'delete']
  };
  
  const readOnlyPermissions: ModulePermissions = {
    enabled: true,
    permissions: ['read']
  };
  
  const readWritePermissions: ModulePermissions = {
    enabled: true,
    permissions: ['read', 'write']
  };
  
  const disabledPermissions: ModulePermissions = {
    enabled: false,
    permissions: []
  };

  return {
    schoolId,
    schoolName,
    modules: {
      students: fullPermissions,
      staff: isRestricted ? readWritePermissions : fullPermissions,
      attendance: fullPermissions,
      fees: isRestricted ? disabledPermissions : fullPermissions,
      timetable: fullPermissions,
      examinations: isRestricted ? readOnlyPermissions : fullPermissions,
      announcements: fullPermissions,
      reports: isRestricted ? readOnlyPermissions : fullPermissions,
      documents: fullPermissions,
      admissions: isRestricted ? disabledPermissions : fullPermissions,
    }
  };
};

const mockSchoolPermissions: SchoolPermissions[] = [
  createSchoolPermissions('school1', 'Vitana Schools', false),
  createSchoolPermissions('school2', 'Riverside High School', true),
  createSchoolPermissions('school3', 'Oakwood Elementary', false),
  createSchoolPermissions('school4', 'Central High School', true),
];

// Mock API functions for more realistic implementation
const mockApiDelay = () => new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));

const mockUpdatePermissions = async (schoolId: string, moduleName: ModuleName, permissions: ModulePermissions) => {
  await mockApiDelay();
  
  // Simulate occasional API failures
  if (Math.random() < 0.05) {
    throw new Error('Network error: Failed to update permissions');
  }
  
  // Updated permissions for ${schoolId}/${moduleName}
  return { success: true, data: permissions };
};

interface PermissionsProviderProps {
  children: React.ReactNode;
}

export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({ children }) => {
  const [schoolPermissions, setSchoolPermissions] = useState<SchoolPermissions[]>([]);
  const [loading, setLoading] = useState(true);
  const authContext = useAuth();

  const user = authContext?.user;
  const authLoading = authContext?.loading;

  useEffect(() => {
    if (authLoading) {
      return;
    }
    
    const loadPermissions = async () => {
      try {
        await mockApiDelay();
        // Permissions loaded successfully
        setSchoolPermissions(mockSchoolPermissions);
      } catch (error) {
        console.error('PermissionsProvider: Failed to load permissions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, [authLoading]);

  const updateSchoolPermissions = async (schoolId: string, moduleName: ModuleName, permissions: ModulePermissions) => {
    try {
      // Call mock API
      await mockUpdatePermissions(schoolId, moduleName, permissions);
      
      // Update local state on success
      setSchoolPermissions(prev => 
        prev.map(school => 
          school.schoolId === schoolId 
            ? { ...school, modules: { ...school.modules, [moduleName]: permissions } }
            : school
        )
      );
      
      // Successfully updated permissions for ${schoolId}/${moduleName}
    } catch (error) {
      console.error('Failed to update permissions:', error);
      throw error;
    }
  };

  const getCurrentSchoolPermissions = (): Record<ModuleName, ModulePermissions> | null => {
    if (!user?.schoolId) return null;
    
    const school = schoolPermissions.find(s => s.schoolId === user.schoolId);
    return school?.modules || null;
  };

  const hasPermission = (module: ModuleName, permission: PermissionLevel): boolean => {
    // Super admin has all permissions
    if (user?.role === 'super_admin') return true;
    
    const currentPermissions = getCurrentSchoolPermissions();
    if (!currentPermissions) return false;
    
    const modulePermissions = currentPermissions[module];
    return modulePermissions?.enabled && modulePermissions.permissions.includes(permission);
  };

  const isModuleEnabled = (module: ModuleName): boolean => {
    // Super admin can see all modules
    if (user?.role === 'super_admin') return true;
    
    const currentPermissions = getCurrentSchoolPermissions();
    if (!currentPermissions) return false;
    
    return currentPermissions[module]?.enabled || false;
  };


  const value: PermissionsContextType = {
    schoolPermissions,
    currentSchoolPermissions: getCurrentSchoolPermissions(),
    updateSchoolPermissions,
    hasPermission,
    isModuleEnabled,
    loading: authLoading || loading
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};
