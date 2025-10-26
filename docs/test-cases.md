# Test Cases Document
## Career Guidance Web Application

### 1. Introduction

This document outlines comprehensive test cases for the Career Guidance Web Application. The testing strategy covers functional testing, non-functional testing, security testing, and user acceptance testing.

### 2. Test Strategy

#### 2.1 Testing Types
- **Unit Testing**: Individual component testing
- **Integration Testing**: Component interaction testing
- **End-to-End Testing**: Complete user workflow testing
- **Performance Testing**: Load and stress testing
- **Security Testing**: Vulnerability and penetration testing
- **Usability Testing**: User experience testing
- **Compatibility Testing**: Cross-browser and device testing

#### 2.2 Testing Tools
- **Unit Testing**: Jest, Mocha
- **Integration Testing**: Firebase Test SDK
- **E2E Testing**: Cypress, Selenium
- **Performance Testing**: Lighthouse, WebPageTest
- **Security Testing**: OWASP ZAP, Burp Suite
- **Browser Testing**: BrowserStack, Sauce Labs

### 3. Functional Test Cases

#### 3.1 User Authentication Module

**Test Case ID**: AUTH_001
**Test Case Name**: User Registration with Valid Data
**Priority**: High
**Prerequisites**: Application is accessible
**Test Steps**:
1. Navigate to signup page
2. Enter valid first name, last name, email, phone, date of birth
3. Enter valid password and confirm password
4. Select education level and stream
5. Accept terms and conditions
6. Click "Create Account" button
**Expected Result**: User account is created successfully and user is redirected to career selection page
**Test Data**: 
- Name: "John Doe"
- Email: "john.doe@example.com"
- Phone: "+1234567890"
- Password: "SecurePass123!"

**Test Case ID**: AUTH_002
**Test Case Name**: User Login with Valid Credentials
**Priority**: High
**Prerequisites**: User account exists
**Test Steps**:
1. Navigate to login page
2. Enter valid email address
3. Enter valid password
4. Click "Sign In" button
**Expected Result**: User is authenticated and redirected to dashboard
**Test Data**:
- Email: "john.doe@example.com"
- Password: "SecurePass123!"

**Test Case ID**: AUTH_003
**Test Case Name**: User Login with Invalid Credentials
**Priority**: Medium
**Prerequisites**: User account exists
**Test Steps**:
1. Navigate to login page
2. Enter valid email address
3. Enter invalid password
4. Click "Sign In" button
**Expected Result**: Error message "Incorrect password" is displayed
**Test Data**:
- Email: "john.doe@example.com"
- Password: "WrongPassword"

**Test Case ID**: AUTH_004
**Test Case Name**: Password Reset Functionality
**Priority**: Medium
**Prerequisites**: User account exists
**Test Steps**:
1. Navigate to login page
2. Click "Forgot password?" link
3. Enter registered email address
4. Click "Send Reset Link" button
5. Check email for reset link
6. Click reset link and set new password
**Expected Result**: Password is successfully reset and user can login with new password
**Test Data**:
- Email: "john.doe@example.com"

**Test Case ID**: AUTH_005
**Test Case Name**: Google OAuth Login
**Priority**: Medium
**Prerequisites**: Valid Google account
**Test Steps**:
1. Navigate to login page
2. Click "Continue with Google" button
3. Enter Google credentials in popup
4. Grant permissions to the application
**Expected Result**: User is authenticated via Google and account is created/logged in
**Test Data**: Valid Google account credentials

#### 3.2 Career Selection Module

**Test Case ID**: CAREER_001
**Test Case Name**: Select Single Career Field
**Priority**: High
**Prerequisites**: User is authenticated
**Test Steps**:
1. Navigate to career selection page
2. Click on "Engineering & Technology" card
3. Verify card is selected (highlighted)
4. Select study level preferences
5. Select duration preferences
6. Select career goals
7. Select priority factors
8. Click "Next: Choose Location" button
**Expected Result**: Career preference is saved and user is redirected to location selection
**Test Data**: Engineering & Technology field

**Test Case ID**: CAREER_002
**Test Case Name**: Select Multiple Career Fields
**Priority**: High
**Prerequisites**: User is authenticated
**Test Steps**:
1. Navigate to career selection page
2. Click on "Engineering & Technology" card
3. Click on "Computer Science & IT" card
4. Click on "Business & Management" card
5. Verify all three cards are selected
6. Complete preference selections
7. Click "Next: Choose Location" button
**Expected Result**: Multiple career preferences are saved correctly
**Test Data**: Multiple career fields

**Test Case ID**: CAREER_003
**Test Case Name**: Career Selection Validation
**Priority**: Medium
**Prerequisites**: User is authenticated
**Test Steps**:
1. Navigate to career selection page
2. Do not select any career field
3. Try to click "Next: Choose Location" button
**Expected Result**: Button remains disabled and user cannot proceed
**Test Data**: No selection

#### 3.3 Aptitude Test Module

**Test Case ID**: TEST_001
**Test Case Name**: Complete Aptitude Test Successfully
**Priority**: High
**Prerequisites**: User has completed career selection
**Test Steps**:
1. Navigate to aptitude test page
2. Read instructions
3. Click "Start Test" button
4. Answer all questions in sequence
5. Click "Submit Test" button
6. Confirm submission in dialog
**Expected Result**: Test is submitted successfully and results are calculated
**Test Data**: Complete set of answers

**Test Case ID**: TEST_002
**Test Case Name**: Navigate Between Questions
**Priority**: Medium
**Prerequisites**: Test is started
**Test Steps**:
1. Start aptitude test
2. Answer first question
3. Click "Next" button
4. Click "Previous" button
5. Verify previous answer is retained
6. Use question navigation bubbles to jump to different questions
**Expected Result**: Navigation works correctly and answers are preserved
**Test Data**: Sample answers

**Test Case ID**: TEST_003
**Test Case Name**: Test Timer Functionality
**Priority**: High
**Prerequisites**: Test is started
**Test Steps**:
1. Start aptitude test
2. Observe timer countdown
3. Wait for timer to reach 5 minutes remaining
4. Verify warning message is displayed
5. Let timer reach zero
**Expected Result**: Test is auto-submitted when timer expires
**Test Data**: Time-based scenario

**Test Case ID**: TEST_004
**Test Case Name**: Submit Test with Unanswered Questions
**Priority**: Medium
**Prerequisites**: Test is in progress
**Test Steps**:
1. Start aptitude test
2. Answer only 50% of questions
3. Click "Submit Test" button
4. Read confirmation dialog
5. Confirm submission
**Expected Result**: Confirmation dialog warns about unanswered questions and allows submission
**Test Data**: Partial answers

**Test Case ID**: TEST_005
**Test Case Name**: Test Score Calculation
**Priority**: High
**Prerequisites**: Test is completed
**Test Steps**:
1. Complete aptitude test with known answers
2. Submit test
3. Verify score calculation
4. Check category-wise scores
5. Verify percentage calculation
**Expected Result**: Scores are calculated correctly based on correct answers and difficulty levels
**Test Data**: Known correct/incorrect answers

#### 3.4 College Search Module

**Test Case ID**: COLLEGE_001
**Test Case Name**: Search Colleges by Location
**Priority**: High
**Prerequisites**: User preferences are saved
**Test Steps**:
1. Navigate to college list page
2. Select "India" as location
3. Select specific states
4. Apply filters
5. Verify college results
**Expected Result**: Colleges are filtered by selected location criteria
**Test Data**: India, specific states

**Test Case ID**: COLLEGE_002
**Test Case Name**: Filter Colleges by Fees
**Priority**: Medium
**Prerequisites**: College list is displayed
**Test Steps**:
1. Navigate to college list page
2. Set fee range slider (₹2,00,000 - ₹5,00,000)
3. Apply filter
4. Verify all displayed colleges fall within fee range
**Expected Result**: Only colleges within fee range are displayed
**Test Data**: Fee range ₹2,00,000 - ₹5,00,000

**Test Case ID**: COLLEGE_003
**Test Case Name**: Sort Colleges by Ranking
**Priority**: Medium
**Prerequisites**: College list is displayed
**Test Steps**:
1. Navigate to college list page
2. Select "Sort by Ranking" option
3. Verify colleges are sorted by ranking (ascending)
4. Select "Sort by Ranking (Descending)"
5. Verify sort order is reversed
**Expected Result**: Colleges are correctly sorted by ranking
**Test Data**: Ranking-based sort

#### 3.5 College Application Module

**Test Case ID**: APP_001
**Test Case Name**: Apply to College Successfully
**Priority**: High
**Prerequisites**: User is viewing college details
**Test Steps**:
1. Click "Apply Now" button on college details page
2. Fill out application form with required documents
3. Upload necessary documents
4. Review application
5. Submit application
**Expected Result**: Application is submitted successfully and confirmation is displayed
**Test Data**: Complete application data

**Test Case ID**: APP_002
**Test Case Name**: Track Application Status
**Priority**: Medium
**Prerequisites**: Application has been submitted
**Test Steps**:
1. Navigate to student dashboard
2. Go to "My Applications" section
3. View application status
4. Click on specific application for details
**Expected Result**: Application status is displayed correctly with timeline
**Test Data**: Submitted application

### 4. Non-Functional Test Cases

#### 4.1 Performance Testing

**Test Case ID**: PERF_001
**Test Case Name**: Page Load Performance
**Priority**: High
**Test Method**: Automated testing with Lighthouse
**Test Steps**:
1. Run Lighthouse audit on main pages
2. Measure Time to First Byte (TTFB)
3. Measure First Contentful Paint (FCP)
4. Measure Largest Contentful Paint (LCP)
**Expected Result**: 
- TTFB < 200ms
- FCP < 1.5s
- LCP < 2.5s
- Performance score > 90

**Test Case ID**: PERF_002
**Test Case Name**: Concurrent User Load Testing
**Priority**: High
**Test Method**: Load testing with Artillery/JMeter
**Test Steps**:
1. Simulate 100 concurrent users
2. Perform various user actions
3. Monitor response times
4. Check for any failures
**Expected Result**:
- Response time < 3s for 95% of requests
- Error rate < 1%
- System remains stable

**Test Case ID**: PERF_003
**Test Case Name**: Database Query Performance
**Priority**: Medium
**Test Method**: Firebase Performance Monitoring
**Test Steps**:
1. Execute college search queries
2. Monitor Firestore read operations
3. Measure query execution time
4. Check for query optimization
**Expected Result**:
- Query response time < 500ms
- Efficient use of indexes
- No unnecessary reads

#### 4.2 Security Testing

**Test Case ID**: SEC_001
**Test Case Name**: SQL Injection Prevention
**Priority**: High
**Test Method**: Automated security scanning
**Test Steps**:
1. Input malicious SQL code in form fields
2. Attempt to inject code through URL parameters
3. Monitor for any database errors
**Expected Result**: No SQL injection vulnerabilities (Note: Using Firestore, so NoSQL injection testing)
**Test Data**: Common injection patterns

**Test Case ID**: SEC_002
**Test Case Name**: Cross-Site Scripting (XSS) Prevention
**Priority**: High
**Test Method**: Manual and automated testing
**Test Steps**:
1. Input script tags in text fields
2. Attempt to inject JavaScript code
3. Check if scripts are executed
**Expected Result**: All user inputs are properly sanitized and scripts are not executed
**Test Data**: XSS payload strings

**Test Case ID**: SEC_003
**Test Case Name**: Authentication Security
**Priority**: High
**Test Method**: Manual testing
**Test Steps**:
1. Attempt to access protected pages without authentication
2. Try to access other user's data
3. Test session timeout
4. Verify JWT token security
**Expected Result**: Unauthorized access is prevented and sessions are secure
**Test Data**: Various authentication scenarios

**Test Case ID**: SEC_004
**Test Case Name**: Data Encryption Verification
**Priority**: High
**Test Method**: Network traffic analysis
**Test Steps**:
1. Monitor network traffic during data transmission
2. Verify HTTPS encryption
3. Check for sensitive data in transit
**Expected Result**: All data transmission is encrypted and secure
**Test Data**: Network packet analysis

#### 4.3 Usability Testing

**Test Case ID**: USAB_001
**Test Case Name**: Navigation Intuitiveness
**Priority**: Medium
**Test Method**: User testing sessions
**Test Steps**:
1. Give users specific tasks to complete
2. Observe navigation patterns
3. Note any confusion or difficulties
4. Measure task completion time
**Expected Result**: Users can complete tasks without assistance in reasonable time
**Test Data**: Task scenarios

**Test Case ID**: USAB_002
**Test Case Name**: Mobile Responsiveness
**Priority**: High
**Test Method**: Multi-device testing
**Test Steps**:
1. Access application on various mobile devices
2. Test touch interactions
3. Verify content readability
4. Check for horizontal scrolling
**Expected Result**: Application works seamlessly on mobile devices
**Test Data**: Multiple device sizes

#### 4.4 Compatibility Testing

**Test Case ID**: COMPAT_001
**Test Case Name**: Cross-Browser Compatibility
**Priority**: High
**Test Method**: Browser testing matrix
**Test Steps**:
1. Test application on Chrome, Firefox, Safari, Edge
2. Verify functionality across browsers
3. Check for visual inconsistencies
4. Test JavaScript compatibility
**Expected Result**: Application works consistently across all supported browsers
**Test Data**: Browser matrix

**Test Case ID**: COMPAT_002
**Test Case Name**: Operating System Compatibility
**Priority**: Medium
**Test Method**: OS testing
**Test Steps**:
1. Test on Windows, macOS, Linux
2. Verify functionality on each OS
3. Check for OS-specific issues
**Expected Result**: Application works on all major operating systems
**Test Data**: OS matrix

### 5. Integration Test Cases

#### 5.1 Firebase Integration

**Test Case ID**: INT_001
**Test Case Name**: Firestore Database Integration
**Priority**: High
**Test Steps**:
1. Perform CRUD operations on user data
2. Test real-time listeners
3. Verify data consistency
4. Test offline synchronization
**Expected Result**: Database operations work correctly and data is synchronized
**Test Data**: User profile data

**Test Case ID**: INT_002
**Test Case Name**: Firebase Authentication Integration
**Priority**: High
**Test Steps**:
1. Test email/password authentication
2. Test Google OAuth integration
3. Verify token management
4. Test session persistence
**Expected Result**: Authentication flows work seamlessly
**Test Data**: Various authentication methods

**Test Case ID**: INT_003
**Test Case Name**: Firebase Hosting Integration
**Priority**: Medium
**Test Steps**:
1. Deploy application to Firebase Hosting
2. Test custom domain functionality
3. Verify SSL certificate
4. Test CDN performance
**Expected Result**: Hosting works correctly with optimal performance
**Test Data**: Deployment configurations

#### 5.2 Third-Party Integration

**Test Case ID**: INT_004
**Test Case Name**: Google OAuth Integration
**Priority**: High
**Test Steps**:
1. Initiate Google OAuth flow
2. Handle authentication callback
3. Extract user profile information
4. Create/update user account
**Expected Result**: Google OAuth integration works smoothly
**Test Data**: Google account credentials

### 6. User Acceptance Test Cases

#### 6.1 Student User Journey

**Test Case ID**: UAT_001
**Test Case Name**: Complete Student Onboarding Journey
**Priority**: High
**User Type**: New Student
**Scenario**: First-time user completes entire flow
**Test Steps**:
1. Register new account
2. Complete career selection
3. Choose location preferences
4. Take aptitude test
5. View college recommendations
6. Apply to colleges
**Expected Result**: User successfully completes onboarding and receives relevant recommendations
**Success Criteria**: 
- Registration completion rate > 90%
- User satisfaction score > 4/5
- Task completion time < 30 minutes

**Test Case ID**: UAT_002
**Test Case Name**: Returning User Experience
**Priority**: Medium
**User Type**: Existing Student
**Scenario**: User returns to check application status
**Test Steps**:
1. Login to existing account
2. Navigate to dashboard
3. Check application status
4. Update profile information
5. Search for new colleges
**Expected Result**: Returning user can easily access their data and perform tasks
**Success Criteria**:
- Login success rate > 95%
- Dashboard load time < 3 seconds
- User retention rate > 70%

#### 6.2 College Representative Journey

**Test Case ID**: UAT_003
**Test Case Name**: College Registration and Profile Setup
**Priority**: Medium
**User Type**: College Representative
**Scenario**: College wants to register on platform
**Test Steps**:
1. Register college account
2. Complete college profile
3. Upload college information
4. Set admission criteria
5. Publish college profile
**Expected Result**: College can successfully register and create an attractive profile
**Success Criteria**:
- Profile completion rate > 80%
- Information accuracy > 95%
- Time to publish < 60 minutes

### 7. Test Execution Strategy

#### 7.1 Test Phases

**Phase 1: Unit Testing**
- Duration: 2 weeks
- Coverage: Individual components
- Automated: 100%
- Exit Criteria: 90% code coverage, all tests pass

**Phase 2: Integration Testing**
- Duration: 1 week
- Coverage: Component interactions
- Automated: 80%
- Exit Criteria: All critical integrations work

**Phase 3: System Testing**
- Duration: 2 weeks
- Coverage: End-to-end scenarios
- Automated: 60%
- Exit Criteria: All major features work

**Phase 4: User Acceptance Testing**
- Duration: 1 week
- Coverage: Real user scenarios
- Automated: 20%
- Exit Criteria: User satisfaction > 4/5

#### 7.2 Test Environment Setup

**Development Environment**:
- Local development servers
- Test Firebase project
- Mock data and services
- Debug mode enabled

**Staging Environment**:
- Production-like setup
- Staging Firebase project
- Real data (sanitized)
- Performance monitoring

**Production Environment**:
- Live system testing
- Production Firebase project
- Real user data
- Full monitoring

### 8. Test Data Management

#### 8.1 Test Data Categories

**Positive Test Data**:
- Valid user credentials
- Complete profile information
- Correct answer sets
- Valid college data

**Negative Test Data**:
- Invalid email formats
- Weak passwords
- Incomplete forms
- Invalid file uploads

**Edge Case Data**:
- Boundary values
- Special characters
- Large data sets
- Network failures

**Security Test Data**:
- SQL injection patterns
- XSS payloads
- Invalid tokens
- Malicious files

#### 8.2 Test Data Sources

```javascript
// Sample Test Data Structure
const testData = {
  users: {
    valid: {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "SecurePass123!",
      phone: "+1234567890"
    },
    invalid: {
      email: "invalid-email",
      password: "123",
      phone: "invalid-phone"
    }
  },
  
  colleges: {
    engineering: {
      name: "MIT",
      location: "Massachusetts, USA",
      fees: 50000,
      ranking: 1
    }
  },
  
  questions: {
    verbal: {
      question: "Sample question",
      options: ["A", "B", "C", "D"],
      correct: 0
    }
  }
};
```

### 9. Defect Management

#### 9.1 Defect Classification

**Severity Levels**:
- **Critical**: System crash, data loss, security breach
- **High**: Major functionality broken, workflow blocked
- **Medium**: Minor functionality issues, workaround available
- **Low**: Cosmetic issues, enhancement requests

**Priority Levels**:
- **P1**: Fix immediately (Critical/High severity)
- **P2**: Fix in current release (High/Medium severity)
- **P3**: Fix in next release (Medium/Low severity)
- **P4**: Fix when time permits (Low severity)

#### 9.2 Defect Tracking

```javascript
// Defect Report Template
const defectReport = {
  id: "DEF_001",
  title: "Login fails with valid credentials",
  description: "User cannot login with correct email/password",
  severity: "High",
  priority: "P1",
  status: "Open",
  assignee: "Developer Name",
  reporter: "Tester Name",
  environment: "Staging",
  steps: [
    "Navigate to login page",
    "Enter valid credentials",
    "Click login button"
  ],
  expected: "User should be logged in",
  actual: "Error message displayed",
  attachments: ["screenshot.png"],
  created: "2025-01-01T10:00:00Z"
};
```

### 10. Test Metrics and Reporting

#### 10.1 Key Metrics

**Test Coverage Metrics**:
- Code Coverage: >90%
- Requirement Coverage: 100%
- Feature Coverage: 100%
- Test Case Coverage: >95%

**Quality Metrics**:
- Defect Density: <5 defects per 100 lines of code
- Defect Leakage: <10% defects found in production
- Test Effectiveness: >95% defects found in testing

**Performance Metrics**:
- Test Execution Time: <4 hours for full suite
- Automation Rate: >80%
- First-time Pass Rate: >85%

#### 10.2 Test Reports

**Daily Test Report**:
- Tests executed
- Pass/Fail status
- New defects found
- Resolved defects
- Blocked tests

**Weekly Test Summary**:
- Test progress
- Quality trends
- Risk assessment
- Resource utilization

**Final Test Report**:
- Overall test results
- Quality assessment
- Recommendations
- Sign-off status

### 11. Risk Assessment

#### 11.1 Testing Risks

**High Risk Areas**:
- Third-party integrations (Google OAuth, Firebase)
- Data security and privacy
- Performance under load
- Cross-browser compatibility

**Mitigation Strategies**:
- Early integration testing
- Automated security testing
- Performance testing from day 1
- Continuous cross-browser testing

### 12. Conclusion

This comprehensive test plan ensures thorough testing of the Career Guidance Web Application across all functional and non-functional aspects. The combination of automated and manual testing, along with proper test data management and defect tracking, will help deliver a high-quality, reliable application that meets user expectations and business requirements.

The test cases cover all critical user journeys and edge cases, ensuring that the application is robust, secure, and user-friendly. Regular execution of these test cases during development will help maintain quality throughout the development lifecycle.
