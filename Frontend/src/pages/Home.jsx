import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Briefcase, DollarSign, Clock, Star, TrendingUp, Users, Award } from 'lucide-react';
import toast from 'react-hot-toast';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const filtered = jobs.filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  const fetchJobs = async () => {
    try {
              const response = await axios.get('/job/get');
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Try public endpoint as fallback
      try {
                  const publicResponse = await axios.get('/job/get', { withCredentials: false });
        setJobs(publicResponse.data.jobs || []);
      } catch (publicError) {
        console.error('Error fetching public jobs:', publicError);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'shortlisted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'applied':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl mb-12 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative px-8 py-16 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your <span className="text-yellow-300">Dream Job</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
              Discover thousands of job opportunities with all the information you need. 
              Your next career move starts here.
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-3xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-xl focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50 shadow-lg text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex justify-center mt-8 space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold">{jobs.length}+</div>
                <div className="text-blue-100 text-sm">Active Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-blue-100 text-sm">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-blue-100 text-sm">Locations</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Why Choose Our Job Portal?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Latest Opportunities</h3>
            <p className="text-gray-600">Get access to the most recent job postings from top companies worldwide.</p>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Direct Application</h3>
            <p className="text-gray-600">Apply directly to companies without any intermediaries or hidden fees.</p>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Assurance</h3>
            <p className="text-gray-600">All jobs are verified and quality-checked to ensure the best opportunities.</p>
          </div>
        </div>
      </div>

      {/* Jobs Section Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Available Jobs
          </h2>
          <p className="text-gray-600">
            {filteredJobs.length} jobs found
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Star className="h-4 w-4" />
          <span>Featured opportunities</span>
        </div>
      </div>

      {/* Enhanced Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredJobs.map((job) => (
          <div key={job._id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-gray-600 font-medium mb-2">{job.company?.name || 'Company Name'}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(job.status)}`}>
                  {job.status || 'Active'}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-3 text-blue-500" />
                  <span className="font-medium">{job.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Briefcase className="h-5 w-5 mr-3 text-green-500" />
                  <span className="font-medium">{job.jobType}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="h-5 w-5 mr-3 text-yellow-500" />
                  <span className="font-medium">{job.salary}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-3 text-purple-500" />
                  <span className="font-medium">{job.experience} years experience</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                {job.description}
              </p>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <Link
                  to={`/job/${job._id}`}
                  className="btn-primary text-sm px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
                >
                  View Details
                </Link>
                <span className="text-xs text-gray-500">
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 mb-6">
              <svg className="h-24 w-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {searchTerm ? 'No jobs found' : 'No jobs available yet'}
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              {searchTerm 
                ? 'Try adjusting your search criteria or browse all available jobs.'
                : 'Be the first to post a job! Recruiters can start posting job opportunities.'
              }
            </p>
            {!searchTerm && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                <p className="text-sm text-gray-700 font-medium mb-4">
                  To get started:
                </p>
                <ol className="text-sm text-gray-600 space-y-2 text-left max-w-xs mx-auto">
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">1</span>
                    Register as a recruiter
                  </li>
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">2</span>
                    Create a company profile
                  </li>
                  <li className="flex items-center">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">3</span>
                    Post your first job
                  </li>
                </ol>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 