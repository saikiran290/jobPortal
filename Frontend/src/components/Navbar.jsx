import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Briefcase, User, LogOut, Plus, Home, FileText, Settings, Bell, Search, Building } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [applicationCount, setApplicationCount] = useState(0);
  const [hasUpdates, setHasUpdates] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Fetch application count and check for updates
  useEffect(() => {
    if (user && user.role === 'student') {
      const fetchApplications = async () => {
        try {
          const response = await axios.get('/application/get');
          const applications = response.data.applications || [];
          setApplicationCount(applications.length);
          
          // Check if there are any shortlisted or rejected applications
          const hasStatusUpdates = applications.some(app => 
            app.status === 'shortlisted' || app.status === 'rejected'
          );
          setHasUpdates(hasStatusUpdates);
        } catch (error) {
          console.error('Error fetching applications:', error);
        }
      };
      
      fetchApplications();
    }
  }, [user]);

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">JobPortal</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            
            <Link to="/about" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
              <span>About</span>
            </Link>
            
            {user && (
              <>
                <Link to="/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                
                {user.role === 'student' && (
                  <Link to="/browse-jobs" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
                    <Search className="h-4 w-4" />
                    <span>Browse Jobs</span>
                  </Link>
                )}
                
                {user.role === 'recruiter' && (
                  <>
                    <Link to="/all-jobs" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
                      <Building className="h-4 w-4" />
                      <span>All Jobs</span>
                    </Link>
                    <Link to="/companies" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
                      <Building className="h-4 w-4" />
                      <span>Companies</span>
                    </Link>
                    <Link to="/post-job" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
                      <Plus className="h-4 w-4" />
                      <span>Post Job</span>
                    </Link>
                  </>
                )}
                
                <Link to="/applications" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors relative">
                  <FileText className="h-4 w-4" />
                  <span>Applications</span>
                  {user.role === 'student' && applicationCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {applicationCount}
                    </span>
                  )}
                  {user.role === 'student' && hasUpdates && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </Link>
                
                <Link to="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
                  <Settings className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium text-sm">
                      {user.fullname?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 hidden sm:block">
                    {user.fullname}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 