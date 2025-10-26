/**
 * Demo Data for Career Guidance Application
 * This file contains sample data for testing without Firebase
 */

// Sample user data
const demoUsers = [
  {
    id: 'demo-user-1',
    email: 'student@demo.com',
    name: 'John Doe',
    phone: '+1234567890',
    dateOfBirth: '2000-01-15',
    educationLevel: 'High School',
    stream: 'Science'
  }
];

// Sample colleges data
const demoColleges = [
  {
    id: 'mit',
    name: 'Massachusetts Institute of Technology',
    location: {
      country: 'USA',
      state: 'Massachusetts',
      city: 'Cambridge'
    },
    type: 'Private',
    establishedYear: 1861,
    fees: {
      tuition: 57590,
      total: 75790,
      currency: 'USD'
    },
    programs: ['Engineering', 'Computer Science', 'Business'],
    ranking: {
      global: 1,
      national: 1
    },
    acceptanceRate: 6.7,
    image: 'https://via.placeholder.com/300x200?text=MIT',
    description: 'Leading research university known for science and technology.'
  },
  {
    id: 'stanford',
    name: 'Stanford University',
    location: {
      country: 'USA',
      state: 'California',
      city: 'Stanford'
    },
    type: 'Private',
    establishedYear: 1885,
    fees: {
      tuition: 56169,
      total: 74570,
      currency: 'USD'
    },
    programs: ['Engineering', 'Computer Science', 'Business', 'Medicine'],
    ranking: {
      global: 2,
      national: 2
    },
    acceptanceRate: 4.3,
    image: 'https://via.placeholder.com/300x200?text=Stanford',
    description: 'Premier research university in Silicon Valley.'
  },
  {
    id: 'iit-bombay',
    name: 'Indian Institute of Technology Bombay',
    location: {
      country: 'India',
      state: 'Maharashtra',
      city: 'Mumbai'
    },
    type: 'Government',
    establishedYear: 1958,
    fees: {
      tuition: 200000,
      total: 245000,
      currency: 'INR'
    },
    programs: ['Engineering', 'Computer Science', 'Management'],
    ranking: {
      global: 177,
      national: 1
    },
    acceptanceRate: 1.2,
    image: 'https://via.placeholder.com/300x200?text=IIT+Bombay',
    description: 'Premier engineering institute in India.'
  },
  {
    id: 'harvard',
    name: 'Harvard University',
    location: {
      country: 'USA',
      state: 'Massachusetts',
      city: 'Cambridge'
    },
    type: 'Private',
    establishedYear: 1636,
    fees: {
      tuition: 54002,
      total: 73800,
      currency: 'USD'
    },
    programs: ['Business', 'Medicine', 'Law', 'Arts'],
    ranking: {
      global: 3,
      national: 3
    },
    acceptanceRate: 3.4,
    image: 'https://via.placeholder.com/300x200?text=Harvard',
    description: 'Oldest higher education institution in the United States.'
  },
  {
    id: 'oxford',
    name: 'University of Oxford',
    location: {
      country: 'UK',
      state: 'Oxfordshire',
      city: 'Oxford'
    },
    type: 'Public',
    establishedYear: 1096,
    fees: {
      tuition: 11220,
      total: 25000,
      currency: 'GBP'
    },
    programs: ['Arts', 'Sciences', 'Medicine', 'Engineering'],
    ranking: {
      global: 4,
      national: 1
    },
    acceptanceRate: 17.5,
    image: 'https://via.placeholder.com/300x200?text=Oxford',
    description: 'One of the oldest universities in the English-speaking world.'
  }
];

// Sample aptitude test questions
const demoQuestions = [
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
  },
  {
    id: 'verbal_002',
    category: 'verbal',
    difficulty: 'easy',
    question: 'What is the synonym of "abundant"?',
    options: ['scarce', 'plentiful', 'limited', 'rare'],
    correctAnswer: 1,
    explanation: 'Abundant means existing in large quantities; plentiful.',
    timeLimit: 45,
    points: 1
  },
  {
    id: 'quantitative_002',
    category: 'quantitative',
    difficulty: 'medium',
    question: 'What is 25% of 80?',
    options: ['15', '20', '25', '30'],
    correctAnswer: 1,
    explanation: '25% of 80 = (25/100) × 80 = 20',
    timeLimit: 60,
    points: 2
  }
];

// Career fields data
const demoCareerFields = [
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
  },
  {
    id: 'arts',
    name: 'Arts & Humanities',
    description: 'Express creativity and explore human culture',
    icon: 'fas fa-palette',
    subfields: ['Literature', 'History', 'Philosophy', 'Fine Arts', 'Languages'],
    avgSalary: 45000,
    jobGrowth: 5,
    skills: ['Creativity', 'Critical thinking', 'Communication', 'Cultural awareness']
  },
  {
    id: 'science',
    name: 'Science & Research',
    description: 'Discover and understand the natural world',
    icon: 'fas fa-flask',
    subfields: ['Physics', 'Chemistry', 'Biology', 'Environmental Science', 'Research'],
    avgSalary: 70000,
    jobGrowth: 12,
    skills: ['Analytical thinking', 'Research', 'Mathematics', 'Observation']
  },
  {
    id: 'computer-science',
    name: 'Computer Science & IT',
    description: 'Develop software and manage information systems',
    icon: 'fas fa-laptop-code',
    subfields: ['Software Development', 'Data Science', 'Cybersecurity', 'AI/ML', 'Web Development'],
    avgSalary: 85000,
    jobGrowth: 22,
    skills: ['Programming', 'Problem-solving', 'Logic', 'Continuous learning']
  }
];

// Demo data access functions
window.demoData = {
  users: demoUsers,
  colleges: demoColleges,
  questions: demoQuestions,
  careerFields: demoCareerFields,
  
  // Helper functions
  getColleges: (filters = {}) => {
    let filtered = [...demoColleges];
    
    if (filters.location) {
      filtered = filtered.filter(college => 
        college.location.country.toLowerCase() === filters.location.toLowerCase()
      );
    }
    
    if (filters.program) {
      filtered = filtered.filter(college => 
        college.programs.some(program => 
          program.toLowerCase().includes(filters.program.toLowerCase())
        )
      );
    }
    
    if (filters.maxFees) {
      filtered = filtered.filter(college => {
        const fees = college.fees.currency === 'USD' ? college.fees.total : college.fees.total / 80;
        return fees <= filters.maxFees;
      });
    }
    
    return filtered;
  },
  
  getQuestions: (category = null, count = 5) => {
    let questions = category 
      ? demoQuestions.filter(q => q.category === category)
      : demoQuestions;
    
    // Shuffle and return limited count
    return questions.sort(() => 0.5 - Math.random()).slice(0, count);
  },
  
  getCareerFields: () => demoCareerFields,
  
  authenticateUser: (email, password) => {
    // Simple demo authentication
    const user = demoUsers.find(u => u.email === email);
    return user ? Promise.resolve(user) : Promise.reject('Invalid credentials');
  }
};

console.log('Demo data loaded successfully');
