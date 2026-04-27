import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if a valid session cookie exists
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Verify session with the server.
   * Returns true if authenticated, false otherwise.
   */
  const checkAuth = async () => {
    try {
      const { data } = await authAPI.getProfile();
      setUser(data.user);
      setOrg(data.org);
      return true;
    } catch {
      setUser(null);
      setOrg(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    setUser(data.user);
    setOrg(data.org);
    return data;
  };

  const register = async ({ name, email, password, org_name }) => {
    const { data } = await authAPI.register({ name, email, password, org_name });
    setUser(data.user);
    setOrg(data.org);
    return data;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // even if logout API fails, clear local state
    }
    setUser(null);
    setOrg(null);
  };

  return (
    <AuthContext.Provider value={{ user, org, login, register, logout, checkAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
