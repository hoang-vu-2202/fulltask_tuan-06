import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: Boolean(localStorage.getItem('access_token')),
    user: null,
  });

  const login = (user, token) => {
    if (token) {
      localStorage.setItem('access_token', token);
    }
    setAuthState({ isAuthenticated: true, user });
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setAuthState({ isAuthenticated: false, user: null });
  };

  const value = useMemo(() => ({ authState, login, logout }), [authState]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
