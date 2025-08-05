import mongoose from 'mongoose';
import Application from './models/application.model.js';
import Job from './models/job.model.js';
import User from './models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

const debugApplications = async () => {
  try {
    console.log('\n=== DEBUGGING APPLICATIONS ===\n');
    
    // 1. Check all applications
    const applications = await Application.find()
      .populate('job')
      .populate('applicant');
    
    console.log(`Total applications in database: ${applications.length}`);
    
    if (applications.length > 0) {
      console.log('\nApplications found:');
      applications.forEach((app, index) => {
        console.log(`${index + 1}. Job: ${app.job?.title || 'Unknown'}`);
        console.log(`   Applicant: ${app.applicant?.fullname || 'Unknown'}`);
        console.log(`   Status: ${app.status}`);
        console.log(`   Job ID: ${app.job?._id}`);
        console.log(`   Applicant ID: ${app.applicant?._id}`);
        console.log('---');
      });
    }
    
    // 2. Check all jobs
    const jobs = await Job.find().populate('created_by');
    console.log(`\nTotal jobs in database: ${jobs.length}`);
    
    if (jobs.length > 0) {
      console.log('\nJobs found:');
      jobs.forEach((job, index) => {
        console.log(`${index + 1}. Title: ${job.title}`);
        console.log(`   Created by: ${job.created_by?.fullname || 'Unknown'}`);
        console.log(`   Created by ID: ${job.created_by?._id}`);
        console.log(`   Applications count: ${job.applications?.length || 0}`);
        console.log('---');
      });
    }
    
    // 3. Check users
    const users = await User.find();
    console.log(`\nTotal users in database: ${users.length}`);
    
    if (users.length > 0) {
      console.log('\nUsers found:');
      users.forEach((user, index) => {
        console.log(`${index + 1}. Name: ${user.fullname}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   ID: ${user._id}`);
        console.log('---');
      });
    }
    
    // 4. Find recruiter
    const recruiter = await User.findOne({ role: 'recruiter' });
    if (recruiter) {
      console.log(`\nRecruiter found: ${recruiter.fullname} (${recruiter._id})`);
      
      // 5. Check recruiter's jobs
      const recruiterJobs = await Job.find({ created_by: recruiter._id });
      console.log(`Recruiter has ${recruiterJobs.length} jobs`);
      
      if (recruiterJobs.length > 0) {
        console.log('\nRecruiter jobs:');
        recruiterJobs.forEach((job, index) => {
          console.log(`${index + 1}. ${job.title} (${job._id})`);
        });
        
        // 6. Check applications for recruiter's jobs
        for (const job of recruiterJobs) {
          const jobApplications = await Application.find({ job: job._id })
            .populate('applicant');
          console.log(`\nApplications for job "${job.title}": ${jobApplications.length}`);
          
          jobApplications.forEach((app, index) => {
            console.log(`  ${index + 1}. ${app.applicant?.fullname} - ${app.status}`);
          });
        }
      }
    }
    
  } catch (error) {
    console.error('Error debugging applications:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nMongoDB disconnected');
  }
};

// Run the debug
connectDB().then(debugApplications); 