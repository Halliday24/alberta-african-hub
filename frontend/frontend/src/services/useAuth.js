import { useState, useEffect, useContext, createContext } from 'react';
import { authService } from '../services';

// This is the context that will be used to access the authentication service
const AuthContext = createContext(); 

/**
 * This hook is used to access the authentication service
 * @returns {Object} - The authentication context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
/**
 * This component is used to provide the authentication context to the app
 * @param {Object} props  
 * @returns 
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token'); //
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  /**
   * This function is used to load the user from the database
   * @returns {Promise} - The user data
   */
  const loadUser = async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    console.log(response);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    setUser(user);
    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    setUser(user);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};