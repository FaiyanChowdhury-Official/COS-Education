import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AdminUser {
  id: number;
  uid: string;
  name: string;
  email: string;
  role: 'admin' | 'counsellor';
  avatar?: string;
  phone?: string;
  counsellorId?: number; // if counsellor
}

interface AdminAuthContextType {
  user: AdminUser;
  setUser: (user: AdminUser) => void;
  availableProfiles: AdminUser[];
  switchProfile: (profile: AdminUser) => void;
  getAuthHeaders: () => Record<string, string>;
}

const DEFAULT_PROFILES: AdminUser[] = [
  {
    id: 1,
    uid: 'admin-faiyan-001',
    name: 'Faiyan Chowdhury',
    email: 'faiyanchowdhury.official@gmail.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    phone: '+880 1712 345678',
  },
  {
    id: 2,
    uid: 'counsellor-uk-003',
    name: 'Tanvir Ahmed (UK Specialist)',
    email: 'counsellor.uk@cos-education.com',
    role: 'counsellor',
    counsellorId: 1,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    phone: '+880 1572 231717',
  },
  {
    id: 3,
    uid: 'counsellor-nordic-004',
    name: 'Nusrat Jahan (Nordic Specialist)',
    email: 'counsellor.finland@cos-education.com',
    role: 'counsellor',
    counsellorId: 2,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    phone: '+880 1572 231717',
  },
];

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser>(() => {
    const saved = localStorage.getItem('cos_admin_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_PROFILES[0];
  });

  const switchProfile = (profile: AdminUser) => {
    setUser(profile);
    localStorage.setItem('cos_admin_user', JSON.stringify(profile));
  };

  const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Admin-Role': user.role,
      'X-Admin-Email': user.email,
      'X-Admin-Name': user.name,
      'X-Admin-Uid': user.uid,
    };
    if (user.counsellorId) {
      headers['X-Counsellor-Id'] = String(user.counsellorId);
    }
    return headers;
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        setUser,
        availableProfiles: DEFAULT_PROFILES,
        switchProfile,
        getAuthHeaders,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
