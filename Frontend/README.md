# Job Portal Frontend

A modern React frontend for the Job Portal application with role-based access control for students and recruiters.

## Features

### For Students/Job Seekers:
- Browse and search all available jobs
- Apply to jobs with one click
- Track application status (pending, shortlisted, rejected)
- View detailed job information
- Manage profile and skills
- Dashboard with application statistics

### For Recruiters/Employers:
- Post new job listings
- View applications for posted jobs
- Shortlist or reject applicants
- Manage company information
- Dashboard with job and application statistics

## Tech Stack

- **React 18** - Frontend framework
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:8000`

## Installation

1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
Frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx      # Navigation bar
│   │   ├── ProtectedRoute.jsx # Route protection
│   │   └── LoadingSpinner.jsx # Loading component
│   ├── contexts/           # React contexts
│   │   └── AuthContext.jsx # Authentication context
│   ├── pages/              # Page components
│   │   ├── Home.jsx        # Home page with job listings
│   │   ├── Login.jsx       # Login page
│   │   ├── Register.jsx    # Registration page
│   │   ├── Dashboard.jsx   # User dashboard
│   │   ├── JobDetails.jsx  # Job details page
│   │   ├── PostJob.jsx     # Job posting page
│   │   ├── Applications.jsx # Applications management
│   │   └── Profile.jsx     # User profile page
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md               # This file
```

## API Integration

The frontend integrates with your backend API endpoints:

- **Authentication**: `/api/v1/user/*`
- **Jobs**: `/api/v1/job/*`
- **Applications**: `/api/v1/application/*`
- **Companies**: `/api/v1/company/*`

## Key Features

### Authentication
- JWT-based authentication
- Role-based access control (student/recruiter)
- Protected routes
- Persistent login state

### Job Management
- Browse all jobs with search functionality
- Detailed job view with application button
- Job posting for recruiters
- Company selection for job posts

### Application System
- One-click job application for students
- Application status tracking
- Recruiter can shortlist/reject applicants
- Application history for both roles

### User Experience
- Responsive design for all devices
- Modern UI with Tailwind CSS
- Toast notifications for user feedback
- Loading states and error handling
- Form validation

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Configuration

The application is configured to connect to your backend at `http://localhost:8000`. If your backend runs on a different port, update the `vite.config.js` file:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:YOUR_BACKEND_PORT',
      changeOrigin: true,
    },
  },
},
```

## Usage

1. **Registration**: Users can register as either a student or recruiter
2. **Login**: Authenticated users can access their dashboard
3. **Students**: Can browse jobs, apply, and track application status
4. **Recruiters**: Can post jobs, view applications, and manage candidates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Job Portal application. 