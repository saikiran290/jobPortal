import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { User, Mail, Phone, Calendar, CheckCircle, XCircle, Clock, FileText, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const Applications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      if (user.role === 'recruiter') {
        // For recruiters, we need to get applications for their jobs
        console.log('Fetching recruiter jobs...');
        const jobsResponse = await axios.get('/job/getadminjobs');
        console.log('Jobs response:', jobsResponse.data);
        const jobs = jobsResponse.data.jobs || [];
        console.log('Jobs found:', jobs.length);
        
        // Get applications for each job
        const allApplications = [];
        for (const job of jobs) {
          try {
            console.log(`Fetching applications for job: ${job._id} - ${job.title}`);
            const applicationsResponse = await axios.get(`/application/applicants/${job._id}`);
            console.log(`Applications for job ${job._id}:`, applicationsResponse.data);
            const jobApplications = applicationsResponse.data.applications || [];
            allApplications.push(...jobApplications.map(app => ({ ...app, jobTitle: job.title })));
          } catch (error) {
            console.error(`Error fetching applications for job ${job._id}:`, error);
          }
        }
        console.log('Total applications found:', allApplications.length);
        setApplications(allApplications);
      } else {
        // For students, get their own applications
        const response = await axios.get('/application/get');
        setApplications(response.data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    setUpdatingStatus(applicationId);
    try {
      await axios.put(`/application/status/${applicationId}`, { status });
      toast.success(`Application ${status} successfully`);
      
      // Update the local state
      setApplications(prev => 
        prev.map(app => 
          app._id === applicationId 
            ? { ...app, status } 
            : app
        )
      );
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    } finally {
      setUpdatingStatus(null);
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
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'shortlisted':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {user.role === 'recruiter' ? 'Job Applications' : 'My Applications'}
        </h1>
        <p className="text-gray-600 mt-2">
          {user.role === 'recruiter' 
            ? 'Review and manage applications for your job postings'
            : 'Track the status of your job applications'
          }
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-gray-400 mb-4">
            <FileText className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {user.role === 'recruiter' ? 'No Applications Yet' : 'No Applications Yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {user.role === 'recruiter' 
              ? 'Applications will appear here once candidates apply to your job postings.'
              : 'Start applying to jobs to see your applications here.'
            }
          </p>
          {user.role === 'student' && (
            <Link to="/" className="btn-primary">
              Browse Jobs
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((application) => (
            <div key={application._id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user.role === 'recruiter' 
                          ? application.applicant?.fullname 
                          : application.job?.title
                        }
                      </h3>
                      <p className="text-gray-600">
                        {user.role === 'recruiter' 
                          ? application.jobTitle
                          : application.job?.company?.name
                        }
                      </p>
                    </div>
                  </div>

                  {user.role === 'recruiter' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{application.applicant?.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{application.applicant?.phoneNumber}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Applied {new Date(application.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}

                  {user.role === 'student' && (
                    <div className="space-y-3 mt-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Applied {new Date(application.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{application.job?.location}</span>
                        </div>
                      </div>
                      
                      {/* Status Update Notification for Students */}
                      {application.status === 'shortlisted' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="text-sm font-medium text-green-800">
                                Congratulations! You've been shortlisted for this position.
                              </p>
                              <p className="text-xs text-green-600 mt-1">
                                The recruiter will contact you soon for next steps.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {application.status === 'rejected' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <XCircle className="h-5 w-5 text-red-600" />
                            <div>
                              <p className="text-sm font-medium text-red-800">
                                Application Status: Not Selected
                              </p>
                              <p className="text-xs text-red-600 mt-1">
                                Don't worry! Keep applying to other opportunities.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {application.status === 'pending' && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-5 w-5 text-yellow-600" />
                            <div>
                              <p className="text-sm font-medium text-yellow-800">
                                Application Under Review
                              </p>
                              <p className="text-xs text-yellow-600 mt-1">
                                The recruiter is reviewing your application. You'll be notified soon.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)}
                    <span className="capitalize">{application.status}</span>
                  </span>

                  {user.role === 'recruiter' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateApplicationStatus(application._id, 'shortlisted')}
                        disabled={updatingStatus === application._id || application.status === 'shortlisted'}
                        className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 disabled:opacity-50"
                      >
                        Shortlist
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(application._id, 'rejected')}
                        disabled={updatingStatus === application._id || application.status === 'rejected'}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {user.role === 'student' && (
                    <Link
                      to={`/job/${application.job?._id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View Job
                    </Link>
                  )}
                </div>
              </div>

              {application.resumeLink && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <a
                    href={application.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View Resume
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications; 