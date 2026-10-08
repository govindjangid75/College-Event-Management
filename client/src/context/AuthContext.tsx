// CampusSphere - Authentication Context & State Manager
// Platform: Arya College of Engineering & IT (ACEIT), Jaipur

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { SEED_USERS } from '../data/seedData';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (identifier: string, password?: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: Partial<User> & { password?: string; rollNo?: string; enrollmentNo?: string; department?: string; semester?: number }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  switchRole: (role: UserRole, clubSlug?: string) => void;
  switchClubAdmin: (clubSlug: string) => void;
  updateActivityPoints: (points: number) => void;
  allClubAdmins: User[];
  isStudent: boolean;
  isClubAdmin: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'campussphere_user';
const STORAGE_KEY_TOKEN = 'campussphere_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse cached user', e);
    }
    // Default to Govind Jangid (Student) for instant demo
    return SEED_USERS[0];
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY_TOKEN) || 'demo_jwt_token_arya_student_089';
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_KEY_TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEY_TOKEN);
    }
  }, [token]);

  // All 15 dedicated Club Admin accounts
  const allClubAdmins = SEED_USERS.filter(u => u.role === 'CLUB_ADMIN');

  /**
   * Universal Login Method:
   * Accepts:
   *  1. Email Address (e.g. govind@aryacollege.in, cipher.admin@aryacollege.in)
   *  2. RTU Roll Number (e.g. 22EACIT089, 22EACIT045)
   *  3. Enrollment Number (e.g. 22EAICSE089, 22EAICSE045)
   */
  const login = async (identifier: string, _password?: string): Promise<{ success: boolean; message: string }> => {
    const clean = identifier.trim().toLowerCase();

    // 1. Check seeded users (Students, 15 Club Admins, Super Admin)
    const matched = SEED_USERS.find(u => {
      const emailMatch = u.email.toLowerCase() === clean;
      const rollMatch = u.studentProfile?.rollNo?.toLowerCase() === clean;
      const enrollMatch = u.studentProfile?.enrollmentNo?.toLowerCase() === clean;
      return emailMatch || rollMatch || enrollMatch;
    });

    if (matched) {
      setCurrentUser(matched);
      const generatedToken = `jwt_arya_${matched.role.toLowerCase()}_${Date.now()}`;
      setToken(generatedToken);
      const roleBadge = matched.role === 'CLUB_ADMIN' ? ` [Club Admin: ${matched.administeredClubId}]` : (matched.role === 'SUPER_ADMIN' ? ' [Dean]' : '');
      return { success: true, message: `Welcome back, ${matched.name}!${roleBadge}` };
    }

    // 2. Check dynamically registered users in localStorage
    try {
      const dynamicUsers: User[] = JSON.parse(localStorage.getItem('campussphere_registered_users') || '[]');
      const dynMatched = dynamicUsers.find(u => {
        const emailMatch = u.email.toLowerCase() === clean;
        const rollMatch = u.studentProfile?.rollNo?.toLowerCase() === clean;
        const enrollMatch = u.studentProfile?.enrollmentNo?.toLowerCase() === clean;
        return emailMatch || rollMatch || enrollMatch;
      });
      if (dynMatched) {
        setCurrentUser(dynMatched);
        setToken(`jwt_arya_student_${Date.now()}`);
        return { success: true, message: `Welcome back, ${dynMatched.name}!` };
      }
    } catch {
      // ignore
    }

    return {
      success: false,
      message: 'Invalid credentials. Enter registered Email, RTU Roll No (e.g. 22EACIT089), or Enrollment No (e.g. 22EAICSE089).'
    };
  };

  const register = async (userData: Partial<User> & { password?: string; rollNo?: string; enrollmentNo?: string; department?: string; semester?: number }): Promise<{ success: boolean; message: string }> => {
    const rollNo = userData.rollNo || `22EACIT${Math.floor(100 + Math.random() * 900)}`;
    const enrollmentNo = userData.enrollmentNo || `22EAICSE${Math.floor(100 + Math.random() * 900)}`;

    const newUser: User = {
      id: `user_student_${Date.now()}`,
      name: userData.name || 'New Student',
      email: userData.email || `student_${Date.now()}@aryacollege.in`,
      role: 'STUDENT',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name || 'student'}`,
      studentProfile: {
        rollNo,
        enrollmentNo,
        department: userData.department || 'Computer Science & Engineering',
        semester: userData.semester || 4,
        batch: 2026,
        phone: '+91 9800000000',
        interests: ['Coding', 'Hackathons', 'Robotics'],
        activityPointsTotal: 0,
      },
      createdAt: new Date().toISOString(),
    };

    // Save to dynamic users array
    try {
      const dynamicUsers: User[] = JSON.parse(localStorage.getItem('campussphere_registered_users') || '[]');
      dynamicUsers.push(newUser);
      localStorage.setItem('campussphere_registered_users', JSON.stringify(dynamicUsers));
    } catch {
      // ignore
    }

    setCurrentUser(newUser);
    setToken(`jwt_arya_student_${Date.now()}`);
    return { success: true, message: `Account registered! Login with Email, Roll No (${rollNo}), or Enrollment No (${enrollmentNo}).` };
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  };

  // Quick 1-Click Role Switcher for instant evaluator demo
  const switchRole = (role: UserRole, clubSlug?: string) => {
    if (role === 'CLUB_ADMIN') {
      const targetSlug = clubSlug || 'arya_cipher';
      const clubAdmin = SEED_USERS.find(u => u.role === 'CLUB_ADMIN' && u.administeredClubId === targetSlug);
      if (clubAdmin) {
        setCurrentUser(clubAdmin);
        setToken(`jwt_arya_club_admin_${Date.now()}`);
        return;
      }
    }

    const targetUser = SEED_USERS.find(u => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      setToken(`jwt_arya_${role.toLowerCase()}_${Date.now()}`);
    }
  };

  // Switch directly to any of the 15 Club Admins
  const switchClubAdmin = (clubSlug: string) => {
    const admin = SEED_USERS.find(u => u.role === 'CLUB_ADMIN' && u.administeredClubId === clubSlug);
    if (admin) {
      setCurrentUser(admin);
      setToken(`jwt_arya_club_admin_${Date.now()}`);
    }
  };

  const updateActivityPoints = (points: number) => {
    setCurrentUser(prev => {
      if (!prev || !prev.studentProfile) return prev;
      const updated = {
        ...prev,
        studentProfile: {
          ...prev.studentProfile,
          activityPointsTotal: points,
        },
      };
      try {
        const dynamicUsers: User[] = JSON.parse(localStorage.getItem('campussphere_registered_users') || '[]');
        const idx = dynamicUsers.findIndex(u => u.id === updated.id);
        if (idx !== -1) {
          dynamicUsers[idx] = updated;
          localStorage.setItem('campussphere_registered_users', JSON.stringify(dynamicUsers));
        }
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const isStudent = currentUser?.role === 'STUDENT';
  const isClubAdmin = currentUser?.role === 'CLUB_ADMIN';
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        token,
        login,
        register,
        logout,
        switchRole,
        switchClubAdmin,
        updateActivityPoints,
        allClubAdmins,
        isStudent,
        isClubAdmin,
        isSuperAdmin,
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
