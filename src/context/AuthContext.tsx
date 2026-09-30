import React, { createContext, useContext, useState, useEffect } from 'react';

export interface PortalUser {
  id: number;
  uid: string;
  name: string;
  email: string;
  role: 'student' | 'counsellor' | 'admin';
  avatar?: string;
  phone?: string;
  studentId?: number;
  counsellorId?: number;
}

interface AuthContextType {
  user: PortalUser | null;
  studentDetails: any | null;
  counsellorDetails: any | null;
  isLoading: boolean;
  login: (email?: string, password?: string, demoLogin?: boolean, userId?: number, role?: string) => Promise<{ success: boolean; redirectTo: string; error?: string }>;
  logout: () => void;
  switchAccount: (userId: number) => Promise<string>;
  getAuthHeaders: () => Record<string, string>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'cos_portal_session_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PortalUser | null>(null);
  const [studentDetails, setStudentDetails] = useState<any | null>(null);
  const [counsellorDetails, setCounsellorDetails] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load saved session on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.user) {
          setUser(parsed.user);
          setStudentDetails(parsed.studentDetails || null);
          setCounsellorDetails(parsed.counsellorDetails || null);
        }
      } catch (e) {
        console.error('Failed to parse saved session:', e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const getAuthHeaders = (): Record<string, string> => {
    if (!user) {
      return {
        'X-Auth-Role': 'student',
        'X-Admin-Role': 'admin',
      };
    }

    return {
      'X-Auth-Role': user.role,
      'X-Auth-Email': user.email,
      'X-Auth-Uid': user.uid,
      'X-Auth-Name': user.name,
      'X-Admin-Role': user.role,
      'X-Admin-Email': user.email,
      'X-Admin-Uid': user.uid,
      'X-Admin-Name': user.name,
      ...(user.studentId ? { 'X-Student-Id': String(user.studentId) } : {}),
      ...(user.counsellorId ? { 'X-Counsellor-Id': String(user.counsellorId) } : {}),
    };
  };

  const login = async (email?: string, password?: string, demoLogin?: boolean, userId?: number, role?: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, demoLogin, userId, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, redirectTo: '/login', error: data.error || 'Login failed' };
      }

      setUser(data.user);
      setStudentDetails(data.studentDetails || null);
      setCounsellorDetails(data.counsellorDetails || null);

      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        user: data.user,
        studentDetails: data.studentDetails,
        counsellorDetails: data.counsellorDetails,
      }));

      // Also sync to AdminAuthContext localStorage if admin
      if (data.user.role === 'admin') {
        localStorage.setItem('cos_admin_user', JSON.stringify({
          uid: data.user.uid,
          email: data.user.email,
          name: data.user.name,
          role: 'admin',
          avatar: data.user.avatar,
        }));
      }

      return { success: true, redirectTo: data.redirectTo };
    } catch (err: any) {
      return { success: false, redirectTo: '/login', error: err.message || 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    setStudentDetails(null);
    setCounsellorDetails(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const switchAccount = async (userId: number): Promise<string> => {
    const res = await login(undefined, undefined, true, userId);
    return res.redirectTo;
  };

  const refreshProfile = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setStudentDetails(data.studentDetails);
        setCounsellorDetails(data.counsellorDetails);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          user: data.user,
          studentDetails: data.studentDetails,
          counsellorDetails: data.counsellorDetails,
        }));
      }
    } catch (e) {
      console.error('Failed to refresh profile:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        studentDetails,
        counsellorDetails,
        isLoading,
        login,
        logout,
        switchAccount,
        getAuthHeaders,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
