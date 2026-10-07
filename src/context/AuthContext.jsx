import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const DEMO_USERS = {
  student: {
    role: 'student',
    id: 'NCTMS2026CS1092',
    name: 'Alexander James Thompson',
    email: 'alexander.cs@nctms.in',
    enrollmentNo: 'ENR-2025-TN-9812',
    course: 'Post Graduate Diploma in Computer Science',
    courseCode: 'PGDCS-201',
    center: 'National Academy of Technical & Computer Science (TN-104)',
    centerCode: 'NCTMS-TN-104',
    avatar: '👨‍🎓',
    academicYear: '2025 - 2026'
  },
  institution: {
    role: 'institution',
    id: 'NCTMS-TN-104',
    name: 'National Academy of Technical & Computer Science',
    email: 'chennai.center@nctms.in',
    centerCode: 'NCTMS-TN-104',
    principal: 'Dr. K. Sundararajan, M.Tech, Ph.D.',
    location: 'Guindy, Chennai, Tamil Nadu',
    avatar: '🏫',
    activeStudents: 412
  },
  admin: {
    role: 'admin',
    id: 'NCTMS-ADM-01',
    name: 'Central Council Administrator',
    email: 'admin.council@nctms.in',
    designation: 'Director of Academic Affairs',
    avatar: '🛡️',
    permissions: 'Full System Super Admin'
  }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nctms_auth_user');
      return saved ? JSON.parse(saved) : DEMO_USERS.student;
    } catch {
      return DEMO_USERS.student;
    }
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('nctms_auth_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('nctms_auth_user');
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  const loginAs = (role) => {
    if (DEMO_USERS[role]) {
      setCurrentUser(DEMO_USERS[role]);
      return DEMO_USERS[role];
    }
    return null;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
