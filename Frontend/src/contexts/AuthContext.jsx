import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Configure axios defaults
  axios.defaults.baseURL = 'http://localhost:8000/api/v1';
  axios.defaults.withCredentials = true;

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        // Since we're using cookies, we'll check if user data exists in localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password, role) => {
    try {
      const response = await axios.post('/user/login', { email, password, role });
      const { user, token } = response.data;
      setUser(user);
      setToken(token);
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/user/register', userData);
      const { user, token } = response.data;
      setUser(user);
      setToken(token);
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await axios.get('/user/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      toast.success('Logged out successfully!');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.post('/user/profile/update', profileData);
      setUser(response.data.user);
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const checkAuth = async () => {
    try {
      const response = await axios.get('/user/me');
      setUser(response.data.user);
      return true;
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setToken(null);
      return false;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 