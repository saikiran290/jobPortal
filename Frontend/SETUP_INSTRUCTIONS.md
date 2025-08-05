# Job Portal Setup Instructions

## 🚀 Quick Start Guide

### Step 1: Start Your Backend Server
Make sure your backend is running on `http://localhost:8000`

```bash
cd Backend
npm run dev
```

### Step 2: Start Your Frontend Server
In a new terminal:

```bash
cd Frontend
npm run dev
```

Your frontend will be available at: `http://localhost:5173`

## 🎯 How to Test the Application

### Step 1: Register as a Recruiter
1. Go to `http://localhost:5173/register`
2. Fill in your details
3. Select "Recruiter/Employer" as your role
4. Click "Create account"

### Step 2: Create a Company
1. After logging in, you'll be redirected to the dashboard
2. You'll need to create a company first (this feature needs to be implemented in your backend)
3. Or you can manually add a company to your database

### Step 3: Post Your First Job
1. Click "Post Job" in the navigation
2. Fill in all the job details
3. Select your company
4. Click "Post Job"

### Step 4: Register as a Student
1. Logout from the recruiter account
2. Go to `http://localhost:5173/register`
3. Select "Student/Job Seeker" as your role
4. Create the account

### Step 5: Browse and Apply to Jobs
1. You'll see the jobs on the home page
2. Click "View Details" on any job
3. Click "Apply Now" to apply

## 🔧 Troubleshooting

### Issue: "No jobs found"
**Solution:** This means no jobs have been posted yet. Follow Step 3 above to post your first job.

### Issue: "Failed to load jobs"
**Solution:** 
1. Make sure your backend is running on port 8000
2. Check the browser console for error messages
3. Verify your database connection

### Issue: "Company not found" when posting jobs
**Solution:** You need to create companies first. Add this to your backend or manually insert companies into your database.

## 📝 Database Setup

If you need to manually add test data, here's what you need:

### 1. Add a Company
```javascript
// In your MongoDB database
db.companies.insertOne({
  name: "Test Company",
  description: "A test company for development",
  location: "New York, NY",
  website: "https://testcompany.com"
})
```

### 2. Add a Job
```javascript
// In your MongoDB database
db.jobs.insertOne({
  title: "Software Engineer",
  description: "We are looking for a talented software engineer...",
  requirements: ["JavaScript", "React", "Node.js"],
  salary: "$80,000 - $120,000",
  location: "New York, NY",
  jobType: "full-time",
  experience: 3,
  position: "Software Engineer",
  company: ObjectId("your_company_id_here"),
  created_by: ObjectId("your_user_id_here")
})
```

## 🎉 You're Ready!

Once you've followed these steps, your job portal will be fully functional with:
- ✅ Job browsing for students
- ✅ Job posting for recruiters
- ✅ Application system
- ✅ Status tracking

Happy testing! 🚀 