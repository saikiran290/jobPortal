import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Briefcase, Users, FileText, Plus, Eye, TrendingUp, Building, DollarSign, Calendar, Target, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    shortlisted: 0,
    rejected: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      if (user.role === 'recruiter') {
        // Fetch recruiter dashboard data - only their own jobs
        const [jobsResponse, applicationsResponse] = await Promise.all([
          axios.get('/job/getadminjobs'),
          axios.get('/application/recruiter'),
        ]);

        const jobs = jobsResponse.data.jobs || [];
        const applications = applicationsResponse.data.applications || [];

        setStats({
          totalJobs: jobs.length,
          totalApplications: applications.length,
          shortlisted: applications.filter(app => app.status === 'shortlisted').length,
          rejected: applications.filter(app => app.status === 'rejected').length,
        });

        setRecentJobs(jobs.slice(0, 5));
      } else {
        // Fetch student dashboard data
        const applicationsResponse = await axios.get('/application/get');
        const applications = applicationsResponse.data.applications || [];

        setStats({
          totalApplications: applications.length,
          shortlisted: applications.filter(app => app.status === 'shortlisted').length,
          rejected: applications.filter(app => app.status === 'rejected').length,
          pending: applications.filter(app => app.status === 'pending').length,
        });

        setRecentJobs(applications.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {user.fullname}! 👋
              </h1>
              <p className="text-xl text-blue-100">
                {user.role === 'recruiter' 
                  ? 'Manage your job postings and find the perfect candidates'
                  : 'Track your applications and discover new opportunities'
                }
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                {user.role === 'recruiter' ? (
                  <Building className="h-10 w-10 text-white" />
                ) : (
                  <Users className="h-10 w-10 text-white" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {user.role === 'recruiter' ? (
          <>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">My Job Postings</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalJobs}</p>
                  <p className="text-xs text-green-600 mt-1">Your uploaded jobs</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Applications</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
                  <p className="text-xs text-blue-600 mt-1">+8% from last week</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Shortlisted</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.shortlisted}</p>
                  <p className="text-xs text-yellow-600 mt-1">Top candidates</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Rejected</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.rejected}</p>
                  <p className="text-xs text-red-600 mt-1">Not suitable</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Applications Sent</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
                  <p className="text-xs text-blue-600 mt-1">Keep applying!</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Pending Review</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
                  <p className="text-xs text-yellow-600 mt-1">Under consideration</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Shortlisted</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.shortlisted}</p>
                  <p className="text-xs text-green-600 mt-1">Great progress!</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Rejected</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.rejected}</p>
                  <p className="text-xs text-red-600 mt-1">Learn & improve</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Enhanced Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          {user.role === 'recruiter' && (
            <>
              <Link
                to="/post-job"
                className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Plus className="h-5 w-5" />
                <span>Post New Job</span>
              </Link>
              <Link
                to="/all-jobs"
                className="flex items-center space-x-3 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Building className="h-5 w-5" />
                <span>View All Jobs</span>
              </Link>
            </>
          )}
          {user.role === 'student' && (
            <Link
              to="/browse-jobs"
              className="flex items-center space-x-3 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Eye className="h-5 w-5" />
              <span>Browse Jobs</span>
            </Link>
          )}
          <Link
            to="/applications"
            className="flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <FileText className="h-5 w-5" />
            <span>View Applications</span>
          </Link>
          <Link
            to="/profile"
            className="flex items-center space-x-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Users className="h-5 w-5" />
            <span>Update Profile</span>
          </Link>
        </div>
      </div>

      {/* Enhanced Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {user.role === 'recruiter' ? 'My Recent Job Postings' : 'Recent Applications'}
        </h2>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {recentJobs.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentJobs.map((item) => (
                <div key={item._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {user.role === 'recruiter' ? item.title : item.job?.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {user.role === 'recruiter' 
                          ? item.company?.name 
                          : item.job?.company?.name
                        }
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span>{user.role === 'recruiter' ? item.salary : item.job?.salary}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Posted {formatDate(user.role === 'recruiter' ? item.createdAt : item.job?.createdAt)}</span>
                        </div>
                      </div>
                      {user.role === 'student' && (
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-3 ${
                          item.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                          item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status}
                        </span>
                      )}
                    </div>
                    <Link
                      to={user.role === 'recruiter' ? `/job/${item._id}` : `/job/${item.job?._id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-semibold hover:underline transition-colors"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {user.role === 'recruiter' ? (
                  <Briefcase className="h-8 w-8 text-gray-400" />
                ) : (
                  <FileText className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {user.role === 'recruiter' 
                  ? 'No job postings yet'
                  : 'No applications yet'
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {user.role === 'recruiter' 
                  ? 'Create your first job posting to start attracting candidates!'
                  : 'Start applying to jobs to track your applications here!'
                }
              </p>
              {user.role === 'recruiter' ? (
                <Link
                  to="/post-job"
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Post Your First Job</span>
                </Link>
              ) : (
                <Link
                  to="/browse-jobs"
                  className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  <Eye className="h-5 w-5" />
                  <span>Browse Jobs</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 