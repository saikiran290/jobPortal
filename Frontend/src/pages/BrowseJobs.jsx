import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Briefcase, DollarSign, Clock, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter states
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    jobTitle: '',
    salary: '',
    experience: '',
    showFilters: false
  });

  // Available filter options
  const locations = ['Remote', 'New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Austin', 'Seattle', 'Boston', 'Denver', 'Miami', 'Hyderabad', 'Bangalore', 'Mumbai', 'Delhi'];
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
  const jobTitles = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'React Developer', 'Node.js Developer', 'Python Developer', 'Java Developer', 'DevOps Engineer', 'Data Scientist', 'UI/UX Designer', 'Product Manager', 'Software Engineer'];
  const salaryRanges = ['₹0 - ₹5,00,000', '₹5,00,000 - ₹10,00,000', '₹10,00,000 - ₹15,00,000', '₹15,00,000 - ₹20,00,000', '₹20,00,000+'];
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, searchTerm, filters]);

  const fetchJobs = async () => {
    try {
              const response = await axios.get('/job/get');
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = jobs.filter(job => {
      // Search term filter
      const matchesSearch = 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Location filter
      const matchesLocation = !filters.location || 
        job.location.toLowerCase().includes(filters.location.toLowerCase());

      // Job type filter
      const matchesJobType = !filters.jobType || 
        job.jobType.toLowerCase().includes(filters.jobType.toLowerCase());

      // Job title filter
      const matchesJobTitle = !filters.jobTitle || 
        job.title.toLowerCase().includes(filters.jobTitle.toLowerCase());

      // Experience filter
      const matchesExperience = !filters.experience || 
        job.experience.toString().includes(filters.experience);

      return matchesSearch && matchesLocation && matchesJobType && matchesJobTitle && matchesExperience;
    });

    // Salary filter (if implemented)
    if (filters.salary) {
      filtered = filtered.filter(job => {
        // This is a simplified salary filter - you might want to implement more sophisticated logic
        return true; // Placeholder
      });
    }

    setFilteredJobs(filtered);
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      jobType: '',
      jobTitle: '',
      salary: '',
      experience: '',
      showFilters: false
    });
    setSearchTerm('');
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse All Jobs</h1>
        <p className="text-lg text-gray-600">Find your perfect job opportunity</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search jobs, companies, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setFilters({ ...filters, showFilters: !filters.showFilters })}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Advanced Filters */}
        {filters.showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Job Title Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                <select
                  value={filters.jobTitle}
                  onChange={(e) => setFilters({ ...filters, jobTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Titles</option>
                  {jobTitles.map((title) => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>
              </div>

              {/* Job Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                <select
                  value={filters.jobType}
                  onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Experience Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <select
                  value={filters.experience}
                  onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Levels</option>
                  {experienceLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Salary Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                <select
                  value={filters.salary}
                  onChange={(e) => setFilters({ ...filters, salary: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Salaries</option>
                  {salaryRanges.map((range) => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Clear All Filters</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
        </p>
        {filters.showFilters && (
          <div className="flex flex-wrap gap-2">
            {filters.location && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Location: {filters.location}
              </span>
            )}
            {filters.jobTitle && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                Title: {filters.jobTitle}
              </span>
            )}
            {filters.jobType && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Type: {filters.jobType}
              </span>
            )}
            {filters.experience && (
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                Experience: {filters.experience}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div key={job._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
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

      {/* No Results */}
      {filteredJobs.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 mb-6">
              <Search className="h-24 w-24 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No jobs found
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Try adjusting your search criteria or filters to find more opportunities.
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              <X className="h-5 w-5" />
              <span>Clear Filters</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseJobs; 