import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/user.model.js';
import Company from './models/company.model.js';
import { Job } from './models/job.model.js';
import Profile from './models/profile.model.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const createTestData = async () => {
  try {
    console.log('Creating test data...');

    // Create a test user (recruiter)
    const recruiter = await User.findOneAndUpdate(
      { email: 'recruiter@test.com' },
      {
        fullname: 'Test Recruiter',
        email: 'recruiter@test.com',
        phoneNumber: 1234567890,
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        role: 'recruiter'
      },
      { upsert: true, new: true }
    );

    console.log('Recruiter created:', recruiter._id);

    // Create a test company
    const company = await Company.findOneAndUpdate(
      { name: 'Test Company' },
      {
        name: 'Test Company',
        description: 'A test company for development',
        location: 'New York, NY',
        website: 'https://testcompany.com',
        userId: recruiter._id
      },
      { upsert: true, new: true }
    );

    console.log('Company created:', company._id);

    // Create a test job
    const job = await Job.findOneAndUpdate(
      { title: 'Test Software Engineer' },
      {
        title: 'Test Software Engineer',
        description: 'We are looking for a talented software engineer to join our team...',
        requirements: ['JavaScript', 'React', 'Node.js'],
        salary: '$80,000 - $120,000',
        location: 'New York, NY',
        jobType: 'full-time',
        experience: 3,
        position: 'Software Engineer',
        company: company._id,
        created_by: recruiter._id,
        applications: []
      },
      { upsert: true, new: true }
    );

    console.log('Job created:', job._id);

    // Create a test student
    const student = await User.findOneAndUpdate(
      { email: 'student@test.com' },
      {
        fullname: 'Test Student',
        email: 'student@test.com',
        phoneNumber: 9876543210,
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        role: 'student'
      },
      { upsert: true, new: true }
    );

    console.log('Student created:', student._id);

    // Create a test profile for the student
    const studentProfile = await Profile.findOneAndUpdate(
      { user: student._id },
      {
        user: student._id,
        fullName: 'Test Student',
        email: 'student@test.com',
        phoneNumber: '9876543210',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        experience: '1 year',
        education: 'Bachelor\'s in Computer Science',
        resumeLink: 'test-student-resume.pdf',
        bio: 'Passionate software developer with experience in modern web technologies.',
        location: 'New York, NY',
        linkedin: 'https://linkedin.com/in/teststudent',
        github: 'https://github.com/teststudent',
        portfolio: 'https://teststudent.dev'
      },
      { upsert: true, new: true }
    );

    console.log('Student profile created:', studentProfile._id);

    console.log('\n=== Test Data Created ===');
    console.log('Recruiter ID:', recruiter._id);
    console.log('Company ID:', company._id);
    console.log('Job ID:', job._id);
    console.log('Student ID:', student._id);
    console.log('Student Profile ID:', studentProfile._id);
    console.log('\nTest Credentials:');
    console.log('Recruiter: recruiter@test.com / password');
    console.log('Student: student@test.com / password');

  } catch (error) {
    console.error('Error creating test data:', error);
  }
};

const main = async () => {
  await connectDB();
  await createTestData();
  process.exit(0);
};

main(); 