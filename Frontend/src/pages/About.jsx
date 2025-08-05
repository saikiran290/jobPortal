import { Link } from 'react-router-dom';
import { 
  Users, 
  Building, 
  Search, 
  FileText, 
  Shield, 
  TrendingUp, 
  Globe, 
  Award,
  CheckCircle,
  Star,
  Zap,
  Heart
} from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <Search className="h-8 w-8 text-blue-600" />,
      title: "Smart Job Search",
      description: "Advanced search filters to find the perfect job match based on location, salary, experience, and more."
    },
    {
      icon: <Building className="h-8 w-8 text-green-600" />,
      title: "Company Profiles",
      description: "Detailed company profiles with insights into culture, benefits, and growth opportunities."
    },
    {
      icon: <FileText className="h-8 w-8 text-purple-600" />,
      title: "Easy Applications",
      description: "One-click job applications with resume upload and application tracking system."
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "Secure Platform",
      description: "Enterprise-grade security to protect your personal information and application data."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-yellow-600" />,
      title: "Career Growth",
      description: "Track your application progress and get insights to improve your job search strategy."
    },
    {
      icon: <Globe className="h-8 w-8 text-indigo-600" />,
      title: "Global Reach",
      description: "Connect with companies worldwide and explore opportunities across different industries."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Jobs", icon: <FileText className="h-6 w-6" /> },
    { number: "500+", label: "Companies", icon: <Building className="h-6 w-6" /> },
    { number: "50+", label: "Locations", icon: <Globe className="h-6 w-6" /> },
    { number: "99%", label: "Success Rate", icon: <CheckCircle className="h-6 w-6" /> }
  ];

  const benefits = [
    "No hidden fees or commissions",
    "Direct communication with employers",
    "Real-time application status updates",
    "Personalized job recommendations",
    "Resume builder and optimization tools",
    "Interview preparation resources",
    "Career counseling and guidance",
    "Mobile-friendly platform"
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-12 text-white mb-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About Our <span className="text-yellow-300">Job Portal</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 leading-relaxed max-w-4xl mx-auto">
            We're revolutionizing the way people find jobs and companies hire talent. 
            Our platform connects talented professionals with amazing opportunities worldwide.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              To create a seamless, transparent, and efficient job marketplace that empowers 
              both job seekers and employers. We believe everyone deserves to find their dream job 
              and every company deserves to find the perfect candidate.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our platform eliminates the barriers between talent and opportunity, making the 
              hiring process faster, more efficient, and more human.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Zap className="h-5 w-5" />
              <span>Get Started Today</span>
            </Link>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8">
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-lg">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We've built the most comprehensive job portal with features designed to make 
            your job search or hiring process as smooth as possible.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mb-16">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What You Get
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied users who have found their dream jobs through our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                For Job Seekers
              </h3>
              <ul className="space-y-4">
                {benefits.slice(0, 4).map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Building className="h-8 w-8 text-green-600 mr-3" />
                For Employers
              </h3>
              <ul className="space-y-4">
                {benefits.slice(4).map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600">
            Don't just take our word for it - hear from our satisfied users
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              "Found my dream job within 2 weeks! The platform is incredibly user-friendly 
              and the job recommendations were spot on."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Sarah Johnson</div>
                <div className="text-sm text-gray-600">Software Engineer</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              "As a recruiter, this platform has made hiring so much easier. The quality 
              of candidates and the application process is excellent."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Building className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Mike Chen</div>
                <div className="text-sm text-gray-600">HR Manager</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              "The application tracking feature is amazing. I always know where I stand 
              with my applications and can focus on the right opportunities."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Emily Davis</div>
                <div className="text-sm text-gray-600">Marketing Specialist</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Find Your Dream Job?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have already found their perfect match. 
            Start your journey today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Heart className="h-5 w-5" />
              <span>Get Started</span>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105"
            >
              <Search className="h-5 w-5" />
              <span>Browse Jobs</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 