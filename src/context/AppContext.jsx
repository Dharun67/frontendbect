import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeDefaultData, getSessionUser, logoutUser } from '../utils/storage';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export const AppProvider = ({ children }) => {
  const [sessionUser, setSessionUser] = useState(null);
  const [sessionType, setSessionType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wake up backend and check for an active MongoDB session on app load
    initializeDefaultData();
    const checkSession = async () => {
      try {
        const session = await getSessionUser();
        if (session && session.success) {
          setSessionUser(session.user);
          setSessionType(session.type);
        }
      } catch (e) {
        // No session — user is not logged in
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const logout = async () => {
    await logoutUser();
    setSessionUser(null);
    setSessionType(null);
  };

  return (
    <AppContext.Provider value={{ sessionUser, setSessionUser, sessionType, setSessionType, loading, logout }}>
      {children}
    </AppContext.Provider>
  );
};
