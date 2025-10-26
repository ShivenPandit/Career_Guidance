# Low-Level Design Document
## Career Guidance Web Application

### 1. System Overview

The Career Guidance Web Application is a comprehensive platform designed to help students make informed decisions about their educational and career paths. The system provides personalized college recommendations, aptitude testing, and expert career guidance.

### 2. Architecture Overview

#### 2.1 High-Level Architecture
- **Frontend**: Single Page Application (SPA) using HTML5, CSS3, JavaScript ES6+
- **Backend**: Firebase serverless architecture
- **Database**: Firestore NoSQL database
- **Authentication**: Firebase Authentication
- **Hosting**: Firebase Hosting with CDN

#### 2.2 System Components
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Interface│    │  Business Logic │    │     Database    │
│                 │    │                 │    │                 │
│  • HTML Pages   │    │  • Auth Manager │    │  • Firestore    │
│  • CSS Styles   │◄──►│  • College Mgmt │◄──►│  • Collections  │
│  • JavaScript   │    │  • Test Engine  │    │  • Documents    │
│                 │    │  • Logging      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 3. Module Design

#### 3.1 Authentication Module

**Purpose**: Handle user registration, login, and session management

**Components**:
- `AuthManager` class
- Login/Signup forms
- Password reset functionality
- Google OAuth integration

**Key Methods**:
```javascript
class AuthManager {
  async signUp(email, password, userData)
  async signIn(email, password)
  async signOut()
  async resetPassword(email)
  async signInWithGoogle()
  getCurrentUser()
  requireAuth()
}
```

**Data Flow**:
1. User enters credentials
2. Form validation
3. Firebase Authentication API call
4. Success: Store user session, redirect
5. Error: Display error message

#### 3.2 College Management Module

**Purpose**: Handle college data, search, and recommendations

**Components**:
- College data models
- Search and filter functionality
- Recommendation engine
- College details display

**Data Model**:
```javascript
College {
  id: string,
  name: string,
  location: string,
  country: string,
  type: string,
  fees: {
    tuition: number,
    hostel: number
  },
  eligibility: {
    minCGPA: number,
    entranceExam: string,
    minScore: number
  },
  facilities: string[],
  placement: {
    percentage: number,
    averagePackage: number
  },
  ranking: number
}
```

#### 3.3 Aptitude Test Module

**Purpose**: Conduct aptitude tests and evaluate results

**Components**:
- Question management
- Test interface
- Timer functionality
- Scoring algorithm
- Result generation

**Question Model**:
```javascript
Question {
  id: string,
  category: 'verbal' | 'quantitative' | 'general',
  question: string,
  options: string[],
  correct: number,
  difficulty: 'easy' | 'medium' | 'hard'
}
```

**Test Flow**:
1. Load questions from database
2. Start timer
3. Display questions sequentially
4. Record user answers
5. Calculate score
6. Generate detailed report

#### 3.4 Career Selection Module

**Purpose**: Help users select career paths and preferences

**Components**:
- Career field database
- Preference collection
- Interest assessment
- Recommendation matching

**Career Model**:
```javascript
CareerField {
  id: string,
  name: string,
  description: string,
  details: string[],
  icon: string,
  relatedCareers: string[],
  typicalSalary: number,
  jobOutlook: string
}
```

### 4. Database Design

#### 4.1 Firestore Collections

**users**
```
{
  uid: string,
  name: string,
  email: string,
  phone: string,
  dateOfBirth: string,
  education: string,
  stream: string,
  careerPreferences: {
    selectedCareers: string[],
    studyLevel: string,
    duration: string,
    goals: string[],
    priorities: string[]
  },
  locationPreferences: {
    preferredCountry: string,
    preferredStates: string[],
    budget: number
  },
  aptitudeTest: {
    totalScore: number,
    percentage: number,
    categoryScores: object,
    completedAt: timestamp
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**colleges**
```
{
  id: string,
  name: string,
  location: string,
  country: string,
  type: string,
  description: string,
  website: string,
  fees: object,
  eligibility: object,
  facilities: array,
  placement: object,
  ranking: number,
  courses: array,
  admissionProcess: string,
  deadlines: object,
  scholarships: array,
  createdAt: timestamp
}
```

**aptitudeQuestions**
```
{
  id: string,
  category: string,
  question: string,
  options: array,
  correct: number,
  difficulty: string,
  explanation: string,
  tags: array,
  createdAt: timestamp
}
```

#### 4.2 Database Indexes

**Performance Indexes**:
- colleges: country, type, ranking
- aptitudeQuestions: category, difficulty
- users: email, createdAt
- testResults: userId, submittedAt

### 5. Security Design

#### 5.1 Authentication Security
- Firebase Authentication with secure token management
- Password strength validation
- Rate limiting for login attempts
- Secure session management

#### 5.2 Data Security
- Firestore security rules for access control
- Input validation and sanitization
- XSS protection
- CSRF protection

#### 5.3 Security Rules Example
```javascript
// Users can only access their own data
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}

// Public read access for colleges
match /colleges/{collegeId} {
  allow read: if true;
  allow write: if request.auth != null && isAdmin();
}
```

### 6. API Design

#### 6.1 Firebase SDK Integration
```javascript
// Initialize Firebase
const firebaseConfig = { ... };
firebase.initializeApp(firebaseConfig);

// Services
const auth = firebase.auth();
const db = firebase.firestore();
```

#### 6.2 Key API Operations

**User Management**:
```javascript
// Create user
await auth.createUserWithEmailAndPassword(email, password);

// Store user data
await db.collection('users').doc(uid).set(userData);

// Get user data
const userDoc = await db.collection('users').doc(uid).get();
```

**College Operations**:
```javascript
// Get colleges with filters
const colleges = await db.collection('colleges')
  .where('country', '==', 'India')
  .where('type', '==', 'Engineering')
  .orderBy('ranking')
  .limit(20)
  .get();
```

**Test Management**:
```javascript
// Save test result
await db.collection('testResults').add({
  userId: uid,
  answers: userAnswers,
  score: calculatedScore,
  submittedAt: firebase.firestore.FieldValue.serverTimestamp()
});
```

### 7. Error Handling

#### 7.1 Error Categories
- **Authentication Errors**: Invalid credentials, network issues
- **Database Errors**: Connection failures, permission denied
- **Validation Errors**: Invalid input data
- **Network Errors**: Connectivity issues

#### 7.2 Error Handling Strategy
```javascript
class Logger {
  static error(message, data) {
    console.error(message, data);
    // Log to Firestore for monitoring
    db.collection('logs').add({
      level: 'ERROR',
      message,
      data,
      timestamp: new Date(),
      userId: currentUser?.uid
    });
  }
}

// Usage
try {
  await performOperation();
} catch (error) {
  Logger.error('Operation failed', error);
  showNotification('Something went wrong. Please try again.', 'error');
}
```

### 8. Performance Optimization

#### 8.1 Frontend Optimization
- Lazy loading of JavaScript modules
- CSS and JS minification
- Image optimization
- Browser caching strategies

#### 8.2 Database Optimization
- Efficient query design
- Proper indexing
- Pagination for large datasets
- Connection pooling

#### 8.3 Caching Strategy
```javascript
// Client-side caching
const cache = new Map();

async function getCachedData(key, fetchFunction) {
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const data = await fetchFunction();
  cache.set(key, data);
  return data;
}
```

### 9. Testing Strategy

#### 9.1 Unit Testing
- Individual function testing
- Mock Firebase services
- Input validation testing
- Error condition testing

#### 9.2 Integration Testing
- Firebase service integration
- User workflow testing
- Cross-browser compatibility

#### 9.3 End-to-End Testing
- Complete user journeys
- Performance testing
- Security testing

### 10. Logging and Monitoring

#### 10.1 Logging Implementation
```javascript
class Logger {
  static log(level, message, data = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      userId: currentUser?.uid || 'anonymous',
      sessionId: generateSessionId(),
      userAgent: navigator.userAgent
    };
    
    // Console logging
    console.log(logEntry);
    
    // Remote logging for errors
    if (level === 'ERROR' || level === 'WARN') {
      db.collection('logs').add(logEntry);
    }
  }
}
```

#### 10.2 Monitoring Points
- User authentication events
- Test completion rates
- College search patterns
- Error occurrences
- Performance metrics

### 11. Deployment Architecture

#### 11.1 Firebase Hosting
- Automatic SSL certificates
- Global CDN distribution
- Custom domain support
- Continuous deployment

#### 11.2 Environment Configuration
```javascript
// Environment-specific configs
const configs = {
  development: {
    apiKey: "dev-api-key",
    // ... other dev settings
  },
  production: {
    apiKey: "prod-api-key",
    // ... other prod settings
  }
};

const config = configs[process.env.NODE_ENV] || configs.development;
```

### 12. Scalability Considerations

#### 12.1 Horizontal Scaling
- Firebase automatically scales
- Stateless application design
- Load balancing via Firebase

#### 12.2 Data Scaling
- Sharding strategies for large datasets
- Archive old test results
- Efficient data pagination

### 13. Maintenance and Updates

#### 13.1 Code Maintenance
- Modular architecture for easy updates
- Version control with Git
- Code documentation
- Regular dependency updates

#### 13.2 Database Maintenance
- Regular backup strategies
- Data cleanup procedures
- Performance monitoring
- Index optimization

This Low-Level Design document provides a comprehensive technical blueprint for implementing the Career Guidance Web Application, ensuring scalability, maintainability, and security.
