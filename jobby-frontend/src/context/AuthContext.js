import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('jobby_user')) || null
  );
  const [token, setToken] = useState(
    localStorage.getItem('jobby_token') || ''
  );

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('jobby_user', JSON.stringify(userData));
    localStorage.setItem('jobby_token', tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('jobby_user');
    localStorage.removeItem('jobby_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);