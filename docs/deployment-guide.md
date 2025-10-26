# Deployment Guide
## Career Guidance Web Application

### 1. Overview

This guide provides step-by-step instructions for deploying the Career Guidance Web Application to Firebase Hosting and setting up the development environment.

### 2. Prerequisites

#### 2.1 Software Requirements
- **Node.js**: Version 16.0 or higher
- **npm**: Version 8.0 or higher (comes with Node.js)
- **Git**: Latest version
- **Firebase CLI**: Latest version
- **Code Editor**: VS Code (recommended)

#### 2.2 Account Requirements
- **Google Account**: For Firebase Console access
- **GitHub Account**: For repository management (optional)
- **Firebase Project**: Created via Firebase Console

### 3. Environment Setup

#### 3.1 Install Node.js and npm

**Windows:**
```powershell
# Download and install from https://nodejs.org/
# Verify installation
node --version
npm --version
```

**macOS (using Homebrew):**
```bash
brew install node
node --version
npm --version
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
npm --version
```

#### 3.2 Install Firebase CLI

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Verify installation
firebase --version

# Login to Firebase
firebase login
```

#### 3.3 Install Git

**Windows:**
```powershell
# Download from https://git-scm.com/download/win
# Or use Windows Package Manager
winget install Git.Git
```

**macOS:**
```bash
# Using Homebrew
brew install git
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install git

# CentOS/RHEL
sudo yum install git
```

### 4. Project Setup

#### 4.1 Clone Repository (if using Git)

```bash
# Clone the repository
git clone https://github.com/yourusername/career-guidance.git
cd career-guidance

# Or if starting fresh, create directory
mkdir career-guidance
cd career-guidance
```

#### 4.2 Initialize Firebase Project

```bash
# Initialize Firebase in project directory
firebase init

# Select services to set up:
# ✓ Firestore: Deploy rules and create indexes
# ✓ Hosting: Configure files for Firebase Hosting
# ✓ Storage: Configure a security rules file for Cloud Storage

# Select existing Firebase project or create new one
# Use default settings or customize as needed
```

#### 4.3 Firebase Configuration

**Create Firebase Project:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: "career-guidance-app"
4. Enable Google Analytics (optional)
5. Select or create Google Analytics account

**Enable Firebase Services:**

1. **Authentication:**
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"
   - Enable "Google" provider
   - Add authorized domains

2. **Firestore Database:**
   - Go to Firestore Database
   - Click "Create database"
   - Start in test mode (update rules later)
   - Choose location (closest to users)

3. **Storage:**
   - Go to Storage
   - Click "Get started"
   - Start in test mode
   - Use default location

4. **Hosting:**
   - Go to Hosting
   - Click "Get started"
   - Follow setup instructions

### 5. Firebase Configuration Files

#### 5.1 Update Firebase Config

Edit `public/js/firebase-config.js`:

```javascript
// Firebase configuration
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Export for use in other modules
window.firebaseServices = { auth, db, storage };
```

#### 5.2 Firestore Security Rules

Update `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own documents
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // User profiles (public read, owner write)
    match /userProfiles/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Colleges (public read, admin write)
    match /colleges/{collegeId} {
      allow read: if true;
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Applications (user specific)
    match /applications/{applicationId} {
      allow read, write: if request.auth != null && 
                            resource.data.userId == request.auth.uid;
    }
    
    // Test results (user specific)
    match /testResults/{resultId} {
      allow read, write: if request.auth != null && 
                            resource.data.userId == request.auth.uid;
    }
    
    // College applications (college and user access)
    match /collegeApplications/{applicationId} {
      allow read: if request.auth != null && 
                     (resource.data.userId == request.auth.uid || 
                      resource.data.collegeId in 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.collegeIds);
      allow write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

#### 5.3 Storage Security Rules

Update `storage.rules`:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User documents (profile photos, certificates)
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // College documents (public read, college admin write)
    match /colleges/{collegeId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                      get(/databases/$(request.auth.uid)/documents/users/$(request.auth.uid)).data.collegeIds[collegeId] == true;
    }
    
    // Application documents
    match /applications/{applicationId}/{allPaths=**} {
      allow read, write: if request.auth != null && 
                            get(/databases/$(request.auth.uid)/documents/applications/$(applicationId)).data.userId == request.auth.uid;
    }
  }
}
```

### 6. Local Development

#### 6.1 Start Firebase Emulators

```bash
# Install Firebase emulator dependencies
firebase setup:emulators:firestore
firebase setup:emulators:auth
firebase setup:emulators:storage

# Start emulators
firebase emulators:start
```

#### 6.2 Local Development Server

```bash
# Serve the app locally
firebase serve

# Or use Python's built-in server
python -m http.server 8000

# Or use Node.js live-server
npm install -g live-server
live-server public/
```

#### 6.3 Environment Variables

Create `.env` file for local development:

```bash
# .env file (DO NOT commit to version control)
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id

# Development settings
NODE_ENV=development
DEBUG=true
```

### 7. Production Deployment

#### 7.1 Pre-deployment Checklist

- [ ] Update Firebase configuration with production keys
- [ ] Set Firestore security rules to production mode
- [ ] Update Storage security rules
- [ ] Remove debug logging and console statements
- [ ] Minify CSS and JavaScript files
- [ ] Optimize images and assets
- [ ] Test all functionality in staging environment
- [ ] Update meta tags and SEO information

#### 7.2 Build Process

```bash
# Create production build directory
mkdir dist

# Copy and optimize files
cp -r public/* dist/

# Minify JavaScript (optional)
npm install -g terser
find dist/js -name "*.js" -exec terser {} -o {} \;

# Minify CSS (optional)
npm install -g clean-css-cli
find dist/css -name "*.css" -exec cleancss -o {} {} \;

# Optimize images (optional)
npm install -g imagemin-cli
imagemin dist/images/* --out-dir=dist/images
```

#### 7.3 Deploy to Firebase Hosting

```bash
# Deploy to Firebase Hosting
firebase deploy

# Deploy specific services only
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only storage:rules

# Deploy with custom message
firebase deploy -m "Production deployment v1.0"
```

#### 7.4 Custom Domain Setup

1. **Purchase Domain**: Buy domain from registrar (GoDaddy, Namecheap, etc.)

2. **Add Custom Domain in Firebase:**
   ```bash
   # Go to Firebase Console > Hosting > Add custom domain
   # Follow the verification steps
   ```

3. **Update DNS Records:**
   ```
   # Add these DNS records at your domain registrar:
   Type: A
   Name: @
   Value: 151.101.1.195
   
   Type: A
   Name: @
   Value: 151.101.65.195
   
   Type: CNAME
   Name: www
   Value: your-project-id.web.app
   ```

### 8. CI/CD Pipeline Setup

#### 8.1 GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build project
      run: npm run build
      env:
        FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
        FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
        FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
    
    - name: Deploy to Firebase
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: ${{ secrets.GITHUB_TOKEN }}
        firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
        channelId: live
        projectId: your-project-id
```

#### 8.2 Set up GitHub Secrets

1. Go to GitHub repository > Settings > Secrets and variables > Actions
2. Add the following secrets:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_SERVICE_ACCOUNT` (JSON key from Firebase)

### 9. Database Setup and Initial Data

#### 9.1 Sample Data Import

Create `scripts/setup-data.js`:

```javascript
// Sample data setup script
const admin = require('firebase-admin');
const serviceAccount = require('./service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'your-project-id'
});

const db = admin.firestore();

// Sample colleges data
const colleges = [
  {
    id: 'mit',
    name: 'Massachusetts Institute of Technology',
    location: 'Cambridge, MA, USA',
    type: 'Private',
    establishedYear: 1861,
    fees: {
      tuition: 57590,
      room: 11550,
      board: 6650
    },
    programs: ['Engineering', 'Computer Science', 'Business'],
    ranking: {
      global: 1,
      national: 1
    },
    admissionRequirements: {
      gpa: 4.0,
      sat: 1520,
      act: 34
    },
    contactInfo: {
      phone: '+1-617-253-1000',
      email: 'admissions@mit.edu',
      website: 'https://web.mit.edu'
    }
  },
  // Add more colleges...
];

// Sample questions for aptitude test
const questions = [
  {
    id: 'verbal_001',
    category: 'verbal',
    difficulty: 'medium',
    question: 'Choose the word that best completes the sentence: The scientist was known for his ___ approach to research.',
    options: ['methodical', 'haphazard', 'creative', 'theoretical'],
    correctAnswer: 0,
    explanation: 'Methodical means systematic and organized, which is typically valued in scientific research.'
  },
  // Add more questions...
];

// Import data function
async function importData() {
  try {
    // Import colleges
    for (const college of colleges) {
      await db.collection('colleges').doc(college.id).set(college);
      console.log(`Imported college: ${college.name}`);
    }
    
    // Import questions
    for (const question of questions) {
      await db.collection('questions').doc(question.id).set(question);
      console.log(`Imported question: ${question.id}`);
    }
    
    console.log('Data import completed successfully!');
  } catch (error) {
    console.error('Error importing data:', error);
  }
}

importData();
```

Run the import script:

```bash
# Install Firebase Admin SDK
npm install firebase-admin

# Run the setup script
node scripts/setup-data.js
```

### 10. Monitoring and Analytics

#### 10.1 Firebase Performance Monitoring

Add to `public/index.html`:

```html
<!-- Firebase Performance Monitoring -->
<script>
  // Initialize Performance Monitoring
  const perf = firebase.performance();
  
  // Custom traces
  const trace = perf.trace('page_load');
  trace.start();
  
  window.addEventListener('load', () => {
    trace.stop();
  });
</script>
```

#### 10.2 Google Analytics Setup

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### 10.3 Error Tracking

```javascript
// Add to app.js
class ErrorTracker {
  static track(error, context = {}) {
    console.error('Error tracked:', error, context);
    
    // Send to Firebase Analytics
    gtag('event', 'exception', {
      description: error.message,
      fatal: false,
      custom_map: context
    });
    
    // Store in Firestore for detailed analysis
    if (window.firebaseServices.auth.currentUser) {
      window.firebaseServices.db.collection('errors').add({
        message: error.message,
        stack: error.stack,
        context: context,
        userId: window.firebaseServices.auth.currentUser.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    }
  }
}

// Global error handler
window.addEventListener('error', (event) => {
  ErrorTracker.track(event.error, {
    type: 'javascript_error',
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  ErrorTracker.track(new Error(event.reason), {
    type: 'unhandled_promise_rejection'
  });
});
```

### 11. Security Configuration

#### 11.1 Content Security Policy

Add to `public/index.html`:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://apis.google.com https://www.gstatic.com https://www.googleapis.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://*.firebaseio.com https://*.googleapis.com;
">
```

#### 11.2 HTTPS Redirection

Update `firebase.json`:

```json
{
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Strict-Transport-Security",
            "value": "max-age=31536000; includeSubDomains"
          },
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          }
        ]
      }
    ]
  }
}
```

### 12. Performance Optimization

#### 12.1 Enable Compression

Update `firebase.json`:

```json
{
  "hosting": {
    "public": "public",
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=7200"
          }
        ]
      }
    ]
  }
}
```

#### 12.2 Implement Service Worker

Create `public/sw.js`:

```javascript
const CACHE_NAME = 'career-guidance-v1';
const urlsToCache = [
  '/',
  '/css/style.css',
  '/css/responsive.css',
  '/js/app.js',
  '/js/auth.js',
  '/pages/student-login.html',
  '/pages/signup.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
```

Register service worker in `public/index.html`:

```html
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
</script>
```

### 13. Backup and Recovery

#### 13.1 Automated Backups

Create Cloud Function for automated backups:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

admin.initializeApp();
const db = getFirestore();

exports.backupFirestore = functions.pubsub
  .schedule('0 2 * * *') // Daily at 2 AM
  .onRun(async (context) => {
    const bucket = admin.storage().bucket('your-backup-bucket');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    try {
      // Export all collections
      const collections = await db.listCollections();
      
      for (const collection of collections) {
        const snapshot = await collection.get();
        const data = [];
        
        snapshot.forEach(doc => {
          data.push({
            id: doc.id,
            data: doc.data()
          });
        });
        
        const fileName = `backups/${timestamp}/${collection.id}.json`;
        const file = bucket.file(fileName);
        
        await file.save(JSON.stringify(data, null, 2), {
          metadata: {
            contentType: 'application/json'
          }
        });
        
        console.log(`Backed up ${collection.id} collection`);
      }
      
      return null;
    } catch (error) {
      console.error('Backup failed:', error);
      throw error;
    }
  });
```

### 14. Troubleshooting

#### 14.1 Common Issues

**Issue**: Firebase hosting deployment fails
**Solution**: 
```bash
# Clear Firebase cache
firebase logout
firebase login
rm -rf .firebase
firebase init hosting
firebase deploy
```

**Issue**: Firestore permissions denied
**Solution**: Check security rules and ensure user is authenticated

**Issue**: Authentication not working
**Solution**: Verify Firebase config and check authorized domains

**Issue**: Slow loading times
**Solution**: Enable compression, implement caching, optimize images

#### 14.2 Debug Commands

```bash
# Check Firebase project status
firebase projects:list

# View current Firebase config
firebase use

# Check hosting status
firebase hosting:sites:list

# View logs
firebase functions:log

# Test Firestore rules
firebase firestore:rules:test
```

### 15. Maintenance

#### 15.1 Regular Tasks

**Weekly:**
- Review error logs
- Check performance metrics
- Update dependencies
- Review security alerts

**Monthly:**
- Update Firebase SDK
- Review and update security rules
- Analyze user feedback
- Performance optimization

**Quarterly:**
- Security audit
- Backup verification
- Disaster recovery testing
- Code review and refactoring

#### 15.2 Update Process

```bash
# Update Firebase CLI
npm update -g firebase-tools

# Update Firebase SDK (if using npm)
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### 16. Support and Documentation

#### 16.1 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Hosting Guide](https://firebase.google.com/docs/hosting)

#### 16.2 Community Support

- [Firebase Slack Community](https://firebase.community/)
- [Stack Overflow Firebase Tag](https://stackoverflow.com/questions/tagged/firebase)
- [Firebase GitHub Discussions](https://github.com/firebase/firebase-js-sdk/discussions)

### 17. Conclusion

This deployment guide provides comprehensive instructions for setting up, deploying, and maintaining the Career Guidance Web Application. Following these steps will ensure a smooth deployment process and a stable production environment.

For additional support or questions, refer to the documentation links provided or reach out to the development team.
