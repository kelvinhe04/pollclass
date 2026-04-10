import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = api.getToken();
    const storedUser = api.getUser();
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    api.setToken(data.token);
    api.setUser(data.user);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (email, password, name, role) => {
    const data = await api.register(email, password, name, role);
    api.setToken(data.token);
    api.setUser(data.user);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    api.removeToken();
    api.removeUser();
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}