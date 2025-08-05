import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useParams } from 'react-router-dom';
import { CheckCircle, XCircle, Eye, User, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManageApplications = () => {
  const { user } = useAuth();
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetchJobAndApplications();
  }, [jobId]);

  const fetchJobAndApplications = async () => {
    try {
      // Fetch job details
      const jobResponse = await axios.get(`/job/get/${jobId}`);
      setJob(jobResponse.data.job);

      // Fetch applications for this job
      const applicationsResponse = await axios.get(`/application/applicants/${jobId}`);
      setApplications(applicationsResponse.data.applications || []);
    } catch (error) {
      console.error('Error fetching job and applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    setUpdating(true);
    try {
      await axios.put(`/application/status/${applicationId}`, { status: newStatus });
      toast.success(`Application ${newStatus} successfully!`);
      
      // Update the local state
      setApplications(prev => prev.map(app => 
        app._id === applicationId 
          ? { ...app, status: newStatus }
          : app
      ));
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    } finally {
      setUpdating(false);
    }
  };

  const viewApplicantProfile = async (applicantId) => {
    try {
      const response = await axios.get(`/profile/user/${applicantId}`);
      setSelectedApplication(response.data.profile);
    } catch (error) {
      console.error('Error fetching applicant profile:', error);
      toast.error('Failed to load applicant profile');
    }
  };

  if (!user || user.role !== 'recruiter') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only recruiters can view this page.</p>
        </div>
      </div>
    );
  }

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
        <p className="text-gray-600">The job you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Job Header */}
      <div className="card p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
        <p className="text-xl text-gray-600 mb-4">{job.company?.name}</p>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>{job.location}</span>
          <span>•</span>
          <span>{job.jobType}</span>
          <span>•</span>
          <span>{job.experience} years experience</span>
        </div>
      </div>

      {/* Applications Count */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Applications ({applications.length})
        </h2>
        <p className="text-gray-600">
          Manage applications for this job posting
        </p>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="text-gray-400 mb-4">
            <User className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
          <p className="text-gray-600">
            Applications will appear here once students apply for this job.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div key={application._id} className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {application.applicant?.fullname || 'Unknown Applicant'}
                      </h3>
                      <p className="text-gray-600">{application.applicant?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{application.applicant?.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{application.applicant?.phoneNumber}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{application.applicant?.location || 'Not specified'}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      application.status === 'shortlisted' 
                        ? 'bg-green-100 text-green-800'
                        : application.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Applied on {new Date(application.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {application.resumeLink && (
                    <div className="mb-4">
                      <span className="text-sm text-gray-600">Resume: </span>
                      <a 
                        href={application.resumeLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        View Resume
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => viewApplicantProfile(application.applicant._id)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Profile</span>
                  </button>

                  {application.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(application._id, 'shortlisted')}
                        disabled={updating}
                        className="flex items-center space-x-2 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Shortlist</span>
                      </button>

                      <button
                        onClick={() => handleStatusUpdate(application._id, 'rejected')}
                        disabled={updating}
                        className="flex items-center space-x-2 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Applicant Profile Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Applicant Profile</h2>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <p className="text-gray-900">{selectedApplication.fullName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-gray-900">{selectedApplication.phoneNumber}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <p className="text-gray-900">{selectedApplication.location || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Experience</label>
                      <p className="text-gray-900">{selectedApplication.experience}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Education</label>
                      <p className="text-gray-900">{selectedApplication.education || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Skills</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedApplication.skills?.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-primary-100 text-primary-800 rounded text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bio</label>
                      <p className="text-gray-900">{selectedApplication.bio || 'No bio provided'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Social Links</h3>
                  <div className="space-y-2">
                    {selectedApplication.linkedin && (
                      <a href={selectedApplication.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 block">
                        LinkedIn Profile
                      </a>
                    )}
                    {selectedApplication.github && (
                      <a href={selectedApplication.github} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 block">
                        GitHub Profile
                      </a>
                    )}
                    {selectedApplication.portfolio && (
                      <a href={selectedApplication.portfolio} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 block">
                        Portfolio Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageApplications; 