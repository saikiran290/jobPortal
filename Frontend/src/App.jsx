import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import JobDetails from './pages/JobDetails';
import PostJob from './pages/PostJob';
import Applications from './pages/Applications';
import Profile from './pages/Profile';
import ManageApplications from './pages/ManageApplications';
import About from './pages/About';
import BrowseJobs from './pages/BrowseJobs';
import AllJobs from './pages/AllJobs';
import Companies from './pages/Companies';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/job/:id" element={<JobDetails />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/browse-jobs" element={
            <ProtectedRoute requiredRole="student">
              <BrowseJobs />
            </ProtectedRoute>
          } />
          
          <Route path="/all-jobs" element={
            <ProtectedRoute requiredRole="recruiter">
              <AllJobs />
            </ProtectedRoute>
          } />
          
          <Route path="/companies" element={
            <ProtectedRoute requiredRole="recruiter">
              <Companies />
            </ProtectedRoute>
          } />
          
          <Route path="/post-job" element={
            <ProtectedRoute requiredRole="recruiter">
              <PostJob />
            </ProtectedRoute>
          } />
          
          <Route path="/applications" element={
            <ProtectedRoute>
              <Applications />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/manage-applications/:jobId" element={
            <ProtectedRoute requiredRole="recruiter">
              <ManageApplications />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App; 