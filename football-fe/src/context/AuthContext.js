import React, { createContext, useState, useEffect, useContext } from 'react';
import { message } from 'antd';
import { login as apiLogin, checkAuth, logout as apiLogout } from '../api/auth';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Initialize auth state from localStorage and verify with backend
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Verify token is still valid with backend
          const response = await checkAuth();
          
          if (response.data && response.data.success) {
            const userData = response.data.data;
            
            // Update state with current user data
            setUser(userData);
            setIsAuthenticated(true);
            setIsAdmin(userData.role === 'admin');
            
            // Update localStorage with fresh data
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            // Token invalid or expired
            handleLogout();
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          handleLogout();
        }
      }
      
      setLoading(false);
      setInitialCheckDone(true);
    };

    initAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await apiLogin(credentials);
      
      if (response.data && response.data.success) {
        const { token, data: userData } = response.data;
        
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Update state
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(userData.role === 'admin');
        
        message.success('Đăng nhập thành công!');
        return true;
      } else {
        message.error('Đăng nhập thất bại!');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.response?.data?.message || 'Đăng nhập thất bại!');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Internal logout helper
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };
  
  // Logout function with API call
  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      handleLogout();
      message.success('Đăng xuất thành công!');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        loading,
        initialCheckDone,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;