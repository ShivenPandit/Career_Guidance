# Career Guidance Web Application

A comprehensive web platform designed to help students discover their ideal career paths and find suitable colleges. Built with HTML5, CSS3, JavaScript, and Firebase backend services.

## 🎯 Project Overview

The Career Guidance Web Application is an educational platform that assists students in making informed decisions about their career and college choices. The application provides personalized recommendations based on student preferences, aptitude test results, and career goals.

### ✨ Key Features

- **Student Authentication**: Secure login/signup with email and Google OAuth
- **Career Selection**: Interactive career field selection with detailed information
- **Aptitude Testing**: Comprehensive aptitude tests with timer and scoring
- **College Discovery**: Advanced search and filtering for colleges worldwide
- **Location-Based Search**: Find colleges by country, state, and city
- **Application Tracking**: Monitor college application status
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Updates**: Live data synchronization using Firebase
- **Admin Dashboard**: College management and application oversight
- **Progressive Web App**: Offline capabilities and fast loading

## 🛠 Technology Stack

### Frontend
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript ES6+**: Interactive functionality and DOM manipulation
- **Progressive Web App**: Service Worker for offline capabilities

### Backend & Services
- **Firebase Authentication**: User management and OAuth
- **Firestore Database**: NoSQL document database
- **Firebase Storage**: File upload and storage
- **Firebase Hosting**: Static site hosting with CDN

### External Libraries
- **Font Awesome**: Icon library
- **Google Fonts**: Typography (Poppins font family)

## 📁 Project Structure

```
career-guidance/
├── public/                     # Public web files
│   ├── index.html             # Homepage
│   ├── pages/                 # Application pages
│   │   ├── student-login.html
│   │   ├── signup.html
│   │   ├── career-selection.html
│   │   ├── aptitude-test.html
│   │   ├── college-list.html
│   │   ├── college-details.html
│   │   ├── location-selection.html
│   │   ├── registration.html
│   │   ├── student-details.html
│   │   ├── test-completion.html
│   │   └── college-signup.html
│   ├── css/                   # Stylesheets
│   │   ├── style.css         # Main styles
│   │   └── responsive.css    # Responsive design
│   ├── js/                    # JavaScript modules
│   │   ├── app.js            # Main application
│   │   ├── auth.js           # Authentication
│   │   ├── career.js         # Career management
│   │   ├── test.js           # Aptitude testing
│   │   ├── college.js        # College management
│   │   ├── location.js       # Location handling
│   │   └── firebase-config.js # Firebase configuration
│   ├── images/               # Static images
│   ├── icons/                # Application icons
│   ├── manifest.json         # PWA manifest
│   └── sw.js                 # Service worker
├── docs/                      # Documentation
│   ├── LLD.md               # Low-level design
│   ├── architecture.md      # System architecture
│   ├── test-cases.md        # Test documentation
│   └── deployment-guide.md  # Deployment instructions
├── scripts/                   # Utility scripts
│   └── setup-data.js        # Sample data import
├── firebase.json             # Firebase configuration
├── firestore.rules          # Database security rules
├── storage.rules            # Storage security rules
└── .gitignore               # Git ignore file
```


## 📋 Features Detailed

### 1. Student Authentication System
- **Email/Password Registration**: Complete signup form with validation
- **Google OAuth Integration**: One-click Google sign-in
- **Password Reset**: Secure password recovery via email
- **Profile Management**: Update personal information and preferences
- **Session Management**: Persistent login with secure tokens

### 2. Career Exploration
- **Career Field Selection**: 8+ major career categories
- **Interest Assessment**: Preferences and goals collection
- **Career Information**: Detailed descriptions and requirements
- **Skill Matching**: Match skills with career requirements

### 3. Aptitude Testing Engine
- **Multiple Test Categories**: Verbal, Quantitative, Logical, Technical
- **Timed Assessments**: Configurable test duration
- **Question Navigation**: Skip, review, and mark for review
- **Real-time Scoring**: Immediate results and analysis
- **Detailed Reports**: Category-wise performance breakdown

### 4. College Discovery Platform
- **Advanced Search**: Filter by location, fees, ranking, programs
- **Detailed Profiles**: Comprehensive college information
- **Admission Requirements**: Entry criteria and prerequisites
- **Fee Structure**: Tuition, accommodation, and other costs
- **Rankings & Reviews**: Multiple ranking systems and user reviews

### 5. Application Management
- **Application Tracking**: Real-time status updates
- **Document Upload**: Secure file storage and management
- **Deadline Reminders**: Important date notifications
- **Communication Hub**: Messages between students and colleges

## 🔒 Security Features

- **Authentication**: Firebase Auth with JWT tokens
- **Data Validation**: Client and server-side validation
- **XSS Protection**: Input sanitization and Content Security Policy
- **HTTPS Enforcement**: SSL/TLS encryption for all communications
- **Database Rules**: Firestore security rules for data protection

## 📱 Responsive Design

- **Mobile-First Approach**: Optimized for mobile devices
- **Breakpoint Strategy**: Tablet and desktop adaptations
- **Touch-Friendly UI**: Large buttons and gesture support
- **Performance Optimized**: Fast loading on all devices
- **Cross-Browser Support**: Works on all modern browsers

## Modules

### 1. Authentication System
- Student login and registration
- College login and registration
- Admin authentication

### 2. Career Guidance
- Career selection based on interests
- Location preference (India/Abroad)
- College recommendation engine

### 3. College Management
- College listing and details
- Eligibility criteria checking
- Registration process

### 4. Aptitude Testing
- Multiple-choice questions
- Verbal, quantitative, and general knowledge sections
- Scoring and evaluation

### 5. Admin Panel
- College management (add/remove/edit)
- Student data monitoring
- System configuration

## Database Schema

### Students Collection
```javascript
{
  id: "student_id",
  name: "Student Name",
  email: "email@example.com",
  phone: "1234567890",
  dateOfBirth: "1999-01-01",
  education: {
    tenthMarks: 85,
    twelfthMarks: 90,
    cgpa: 8.5
  },
  preferences: {
    career: "Engineering",
    location: "India",
    budget: 500000
  },
  aptitudeScore: 85,
  createdAt: timestamp
}
```

### Colleges Collection
```javascript
{
  id: "college_id",
  name: "College Name",
  location: "City, State",
  country: "India",
  type: "Engineering",
  fees: {
    tuition: 200000,
    hostel: 80000
  },
  eligibility: {
    minCGPA: 7.0,
    entranceExam: "JEE",
    minScore: 75
  },
  facilities: ["Hostel", "Library", "Labs"],
  placement: {
    percentage: 85,
    averagePackage: 600000
  },
  createdAt: timestamp
}
```

## Testing

### Unit Tests
- Authentication functions
- College filtering algorithms
- Aptitude test scoring

### Integration Tests
- Firebase integration
- User workflow testing
- Data persistence testing

### End-to-End Tests
- Complete user journey
- Cross-browser compatibility
- Mobile responsiveness

## License
This project is licensed under the MIT License.
