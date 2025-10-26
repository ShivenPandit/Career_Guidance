#!/usr/bin/env node

/**
 * Setup script for Career Guidance Web Application
 * This script helps initialize the project and import sample data
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Sample data for colleges
const sampleColleges = [
  {
    id: 'mit',
    name: 'Massachusetts Institute of Technology',
    location: {
      country: 'USA',
      state: 'Massachusetts',
      city: 'Cambridge',
      address: '77 Massachusetts Ave, Cambridge, MA 02139'
    },
    type: 'Private',
    establishedYear: 1861,
    fees: {
      tuition: 57590,
      room: 11550,
      board: 6650,
      total: 75790,
      currency: 'USD'
    },
    programs: ['Engineering', 'Computer Science', 'Business', 'Science'],
    ranking: {
      global: 1,
      national: 1,
      engineering: 1,
      computerScience: 1
    },
    admissionRequirements: {
      gpa: 4.0,
      sat: 1520,
      act: 34,
      toefl: 100,
      ielts: 7.0
    },
    contactInfo: {
      phone: '+1-617-253-1000',
      email: 'admissions@mit.edu',
      website: 'https://web.mit.edu'
    },
    facilities: ['Library', 'Labs', 'Sports Complex', 'Hostel', 'Cafeteria'],
    createdAt: new Date()
  },
  {
    id: 'iit-bombay',
    name: 'Indian Institute of Technology Bombay',
    location: {
      country: 'India',
      state: 'Maharashtra',
      city: 'Mumbai',
      address: 'Powai, Mumbai, Maharashtra 400076'
    },
    type: 'Government',
    establishedYear: 1958,
    fees: {
      tuition: 200000,
      hostel: 15000,
      mess: 30000,
      total: 245000,
      currency: 'INR'
    },
    programs: ['Engineering', 'Computer Science', 'Management', 'Design'],
    ranking: {
      global: 177,
      national: 1,
      engineering: 1,
      computerScience: 2
    },
    admissionRequirements: {
      jeeAdvanced: 50,
      class12: 75,
      english: 'Required'
    },
    contactInfo: {
      phone: '+91-22-2572-2545',
      email: 'admissions@iitb.ac.in',
      website: 'https://www.iitb.ac.in'
    },
    facilities: ['Library', 'Labs', 'Sports Complex', 'Hostel', 'Cafeteria'],
    createdAt: new Date()
  }
];

// Sample questions for aptitude test
const sampleQuestions = [
  {
    id: 'verbal_001',
    category: 'verbal',
    difficulty: 'medium',
    question: 'Choose the word that best completes the sentence: The scientist was known for his ___ approach to research.',
    options: ['methodical', 'haphazard', 'creative', 'theoretical'],
    correctAnswer: 0,
    explanation: 'Methodical means systematic and organized, which is typically valued in scientific research.',
    timeLimit: 60,
    points: 2
  },
  {
    id: 'quantitative_001',
    category: 'quantitative',
    difficulty: 'easy',
    question: 'If a car travels 120 km in 2 hours, what is its average speed?',
    options: ['50 km/h', '60 km/h', '70 km/h', '80 km/h'],
    correctAnswer: 1,
    explanation: 'Speed = Distance / Time = 120 km / 2 hours = 60 km/h',
    timeLimit: 90,
    points: 1
  },
  {
    id: 'logical_001',
    category: 'logical',
    difficulty: 'hard',
    question: 'In a sequence: 2, 6, 12, 20, 30, ?, what is the next number?',
    options: ['40', '42', '44', '46'],
    correctAnswer: 1,
    explanation: 'The pattern is n(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42',
    timeLimit: 120,
    points: 3
  }
];

// Career fields data
const careerFields = [
  {
    id: 'engineering',
    name: 'Engineering & Technology',
    description: 'Design, build, and maintain technological solutions',
    icon: 'fas fa-cogs',
    subfields: ['Mechanical', 'Electrical', 'Computer', 'Civil', 'Chemical'],
    avgSalary: 75000,
    jobGrowth: 8,
    skills: ['Problem-solving', 'Mathematics', 'Technical skills', 'Innovation']
  },
  {
    id: 'medicine',
    name: 'Medicine & Healthcare',
    description: 'Diagnose, treat, and prevent diseases and injuries',
    icon: 'fas fa-heartbeat',
    subfields: ['Doctor', 'Nurse', 'Pharmacist', 'Therapist', 'Surgeon'],
    avgSalary: 95000,
    jobGrowth: 15,
    skills: ['Empathy', 'Critical thinking', 'Communication', 'Attention to detail']
  },
  {
    id: 'business',
    name: 'Business & Management',
    description: 'Lead organizations and manage business operations',
    icon: 'fas fa-briefcase',
    subfields: ['Marketing', 'Finance', 'Operations', 'HR', 'Strategy'],
    avgSalary: 65000,
    jobGrowth: 10,
    skills: ['Leadership', 'Communication', 'Analytics', 'Strategic thinking']
  }
];

async function initializeFirebase() {
  try {
    // Check if service account key exists
    const serviceAccountPath = path.join(__dirname, 'service-account-key.json');
    
    if (!fs.existsSync(serviceAccountPath)) {
      console.log('⚠️  Service account key not found. Please:');
      console.log('1. Go to Firebase Console > Project Settings > Service Accounts');
      console.log('2. Generate new private key');
      console.log('3. Save as service-account-key.json in the scripts folder');
      return;
    }

    const serviceAccount = require(serviceAccountPath);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id
    });

    console.log('✅ Firebase initialized successfully');
    return admin.firestore();
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error.message);
    return null;
  }
}

async function importSampleData(db) {
  try {
    console.log('📥 Importing sample data...');

    // Import colleges
    for (const college of sampleColleges) {
      await db.collection('colleges').doc(college.id).set(college);
      console.log(`✅ Imported college: ${college.name}`);
    }

    // Import questions
    for (const question of sampleQuestions) {
      await db.collection('questions').doc(question.id).set(question);
      console.log(`✅ Imported question: ${question.id}`);
    }

    // Import career fields
    for (const field of careerFields) {
      await db.collection('careerFields').doc(field.id).set(field);
      console.log(`✅ Imported career field: ${field.name}`);
    }

    console.log('🎉 Sample data import completed successfully!');
  } catch (error) {
    console.error('❌ Error importing data:', error);
  }
}

async function setupProject() {
  console.log('🚀 Setting up Career Guidance Project...');
  
  const db = await initializeFirebase();
  if (!db) {
    console.log('❌ Setup failed. Please check Firebase configuration.');
    return;
  }

  await importSampleData(db);
  
  console.log('\n✅ Project setup completed!');
  console.log('\nNext steps:');
  console.log('1. Update firebase-config.js with your project configuration');
  console.log('2. Deploy: firebase deploy');
  console.log('3. Test the application');
}

// Run setup if called directly
if (require.main === module) {
  setupProject();
}

module.exports = {
  initializeFirebase,
  importSampleData,
  sampleColleges,
  sampleQuestions,
  careerFields
};
