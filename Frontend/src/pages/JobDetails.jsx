import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { MapPin, Briefcase, DollarSign, Clock, Building, Calendar, CheckCircle, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`/job/get/${id}`);
      setJob(response.data.job);
      
      // Check if user has already applied
      if (user) {
        const applicationsResponse = await axios.get('/application/get');
        const applications = applicationsResponse.data.applications || [];
        const hasAppliedToThisJob = applications.some(app => app.job === id);
        setHasApplied(hasAppliedToThisJob);
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      toast.error('Please login to apply for this job');
      return;
    }

    if (user.role !== 'student') {
      toast.error('Only students can apply for jobs');
      return;
    }

    setApplying(true);
    try {
      // First check if user is authenticated
              const authCheck = await axios.get('/user/me');
      console.log('Auth check result:', authCheck.data);
      
      await axios.get(`/application/apply/${id}`);
      setHasApplied(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying for job:', error);
      if (error.response?.status === 401) {
        toast.error('Please login again to apply for this job');
        // Redirect to login
        window.location.href = '/login';
      } else {
        toast.error(error.response?.data?.message || 'Failed to apply for job');
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
        <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="btn-primary">
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Job Header */}
      <div className="card p-8 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <p className="text-xl text-gray-600 mb-4">{job.company?.name || 'Company Name'}</p>
          </div>
          <div className="flex space-x-4">
            {user && user.role === 'student' && (
              <>
                {hasApplied ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Applied</span>
                  </div>
                ) : (
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="btn-primary disabled:opacity-50"
                  >
                    {applying ? 'Applying...' : 'Apply Now'}
                  </button>
                )}
              </>
            )}
            
            {user && user.role === 'recruiter' && job.created_by === user._id && (
              <Link
                to={`/manage-applications/${job._id}`}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Users className="h-4 w-4" />
                <span>Manage Applications</span>
              </Link>
            )}
          </div>
        </div>

        {/* Job Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium text-gray-900">{job.location}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Briefcase className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Job Type</p>
              <p className="font-medium text-gray-900">{job.jobType}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <DollarSign className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Salary</p>
              <p className="font-medium text-gray-900">{job.salary}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Experience</p>
              <p className="font-medium text-gray-900">{job.experience} years</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>Posted on {new Date(job.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Job Description */}
      <div className="card p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Description</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed mb-6">{job.description}</p>
        </div>
      </div>

      {/* Requirements */}
      <div className="card p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Requirements</h2>
        <ul className="space-y-3">
          {job.requirements.map((requirement, index) => (
            <li key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">{requirement}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Company Information */}
      {job.company && (
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Company</h2>
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.company.name}</h3>
              <p className="text-gray-600 mb-4">{job.company.description || 'No company description available.'}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{job.company.location || 'Location not specified'}</span>
                {job.company.website && (
                  <a 
                    href={job.company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to Jobs */}
      <div className="text-center mt-8">
        <Link to="/" className="btn-secondary">
          Back to All Jobs
        </Link>
      </div>
    </div>
  );
};

export default JobDetails; 