import { createContext, ReactNode, useEffect, useState } from 'react';
import { User, UserRole } from '../types';
import { indexedDbService } from '../services/indexedDb';

interface AuthContextType {
  currentUser: User | null;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  isLoading: boolean;
  canEditTransactions: () => boolean;
  canViewAllData: () => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const adminUser = await indexedDbService.getUser('default-user');
        if (adminUser) {
          setCurrentUser(adminUser);
          setCurrentRole(adminUser.role);
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load user:', err);
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const switchRole = async (role: UserRole) => {
    setCurrentRole(role);
    if (currentUser) {
      const updatedUser = { ...currentUser, role };
      setCurrentUser(updatedUser);
      try {
        await indexedDbService.updateUser(updatedUser);
      } catch (err) {
        console.error('Failed to update user role:', err);
      }
    }
  };

  const canEditTransactions = () => true;
  const canViewAllData = () => true;

  const value: AuthContextType = {
    currentUser,
    currentRole,
    switchRole,
    isLoading,
    canEditTransactions,
    canViewAllData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
