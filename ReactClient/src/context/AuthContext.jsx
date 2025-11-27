import { createContext, useContext, useMemo, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    // Initialize from localStorage
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    return {
      isAuthenticated: Boolean(token),
      user,
    };
  });

  const login = (user, token) => {
    if (token) {
      localStorage.setItem('access_token', token);
    }
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    setAuthState({ isAuthenticated: true, user });
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setAuthState({ isAuthenticated: false, user: null });
  };

  const value = useMemo(() => ({
    ...authState,
    login,
    logout,
  }), [authState]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
