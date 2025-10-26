// Firebase Configuration
const firebaseConfig = {
    // Replace with your Firebase config
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Global variables
let currentUser = null;
let collegeData = [];
let aptitudeQuestions = [];

// Logger utility
class Logger {
    static log(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            data,
            user: currentUser ? currentUser.uid : 'anonymous'
        };
        
        console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`, data);
        
        // Store log in Firestore (optional)
        if (level === 'ERROR' || level === 'WARN') {
            db.collection('logs').add(logEntry).catch(err => {
                console.error('Failed to log to Firestore:', err);
            });
        }
    }
    
    static info(message, data = null) {
        this.log('INFO', message, data);
    }
    
    static error(message, data = null) {
        this.log('ERROR', message, data);
    }
    
    static warn(message, data = null) {
        this.log('WARN', message, data);
    }
    
    static debug(message, data = null) {
        this.log('DEBUG', message, data);
    }
}

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    Logger.info('DOM Content Loaded');
    initializeApp();
});

// Initialize Application
function initializeApp() {
    try {
        Logger.info('Initializing Career Guidance Application');
        
        // Initialize navigation
        initializeNavigation();
        
        // Initialize scroll effects
        initializeScrollEffects();
        
        // Initialize forms
        initializeForms();
        
        // Check authentication state
        auth.onAuthStateChanged(user => {
            if (user) {
                currentUser = user;
                Logger.info('User authenticated', { uid: user.uid, email: user.email });
                updateUIForAuthenticatedUser();
            } else {
                currentUser = null;
                Logger.info('User not authenticated');
                updateUIForAnonymousUser();
            }
        });
        
        // Load initial data
        loadCollegeData();
        loadAptitudeQuestions();
        
        Logger.info('Application initialized successfully');
    } catch (error) {
        Logger.error('Failed to initialize application', error);
        showNotification('Failed to initialize application. Please refresh the page.', 'error');
    }
}

// Navigation Functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll Effects
function initializeScrollEffects() {
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .step, .stat-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Form Initialization
function initializeForms() {
    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterForm);
    }
}

// Handle Contact Form Submission
async function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const contactData = {
        name: formData.get('name') || e.target.querySelector('input[type="text"]').value,
        email: formData.get('email') || e.target.querySelector('input[type="email"]').value,
        message: formData.get('message') || e.target.querySelector('textarea').value,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        showLoading(true);
        Logger.info('Submitting contact form', contactData);
        
        await db.collection('contacts').add(contactData);
        
        showNotification('Thank you for your message! We will get back to you soon.', 'success');
        e.target.reset();
        Logger.info('Contact form submitted successfully');
    } catch (error) {
        Logger.error('Failed to submit contact form', error);
        showNotification('Failed to send message. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// Handle Newsletter Form Submission
async function handleNewsletterForm(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    
    try {
        showLoading(true);
        Logger.info('Subscribing to newsletter', { email });
        
        await db.collection('newsletter').add({
            email,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showNotification('Successfully subscribed to newsletter!', 'success');
        e.target.reset();
        Logger.info('Newsletter subscription successful');
    } catch (error) {
        Logger.error('Failed to subscribe to newsletter', error);
        showNotification('Failed to subscribe. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// Load College Data
async function loadCollegeData() {
    try {
        Logger.info('Loading college data');
        
        const snapshot = await db.collection('colleges').get();
        collegeData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        Logger.info('College data loaded', { count: collegeData.length });
    } catch (error) {
        Logger.error('Failed to load college data', error);
        // Load sample data as fallback
        collegeData = getSampleCollegeData();
    }
}

// Load Aptitude Questions
async function loadAptitudeQuestions() {
    try {
        Logger.info('Loading aptitude questions');
        
        const snapshot = await db.collection('aptitudeQuestions').get();
        aptitudeQuestions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        Logger.info('Aptitude questions loaded', { count: aptitudeQuestions.length });
    } catch (error) {
        Logger.error('Failed to load aptitude questions', error);
        // Load sample data as fallback
        aptitudeQuestions = getSampleAptitudeQuestions();
    }
}

// Sample College Data
function getSampleCollegeData() {
    return [
        {
            id: 'iit-delhi',
            name: 'Indian Institute of Technology, Delhi',
            location: 'New Delhi, Delhi',
            country: 'India',
            type: 'Engineering',
            fees: { tuition: 200000, hostel: 80000 },
            eligibility: { minCGPA: 8.5, entranceExam: 'JEE Advanced', minScore: 85 },
            facilities: ['Hostel', 'Library', 'Labs', 'Sports Complex'],
            placement: { percentage: 95, averagePackage: 1200000 },
            ranking: 1,
            image: 'assets/images/iit-delhi.jpg'
        },
        {
            id: 'iim-ahmedabad',
            name: 'Indian Institute of Management, Ahmedabad',
            location: 'Ahmedabad, Gujarat',
            country: 'India',
            type: 'Management',
            fees: { tuition: 2500000, hostel: 150000 },
            eligibility: { minCGPA: 7.0, entranceExam: 'CAT', minScore: 90 },
            facilities: ['Hostel', 'Library', 'Case Study Rooms', 'Gym'],
            placement: { percentage: 100, averagePackage: 2500000 },
            ranking: 1,
            image: 'assets/images/iim-ahmedabad.jpg'
        }
    ];
}

// Sample Aptitude Questions
function getSampleAptitudeQuestions() {
    return [
        {
            id: 'q1',
            category: 'verbal',
            question: 'Choose the word that best completes the sentence: The research was so _____ that it took years to complete.',
            options: ['comprehensive', 'simple', 'quick', 'basic'],
            correct: 0,
            difficulty: 'medium'
        },
        {
            id: 'q2',
            category: 'quantitative',
            question: 'If a train travels 60 km in 45 minutes, what is its speed in km/h?',
            options: ['80', '75', '90', '85'],
            correct: 0,
            difficulty: 'easy'
        },
        {
            id: 'q3',
            category: 'general',
            question: 'Who is known as the Father of the Indian Constitution?',
            options: ['Mahatma Gandhi', 'Dr. B.R. Ambedkar', 'Jawaharlal Nehru', 'Sardar Patel'],
            correct: 1,
            difficulty: 'easy'
        }
    ];
}

// UI Update Functions
function updateUIForAuthenticatedUser() {
    const loginButton = document.querySelector('.btn-login');
    if (loginButton) {
        loginButton.textContent = 'Dashboard';
        loginButton.href = 'pages/student-details.html';
    }
}

function updateUIForAnonymousUser() {
    const loginButton = document.querySelector('.btn-login');
    if (loginButton) {
        loginButton.textContent = 'Login';
        loginButton.href = 'pages/student-login.html';
    }
}

// Utility Functions
function showLoading(show) {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        if (show) {
            spinner.classList.remove('hidden');
        } else {
            spinner.classList.add('hidden');
        }
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '10000';
    notification.style.minWidth = '300px';
    notification.style.animation = 'slideInRight 0.3s ease';
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Error Handler
window.addEventListener('error', (event) => {
    Logger.error('JavaScript Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack
    });
});

// Unhandled Promise Rejection Handler
window.addEventListener('unhandledrejection', (event) => {
    Logger.error('Unhandled Promise Rejection', {
        reason: event.reason,
        promise: event.promise
    });
});

// Export functions for other modules
window.CareerGuidanceApp = {
    Logger,
    auth,
    db,
    showLoading,
    showNotification,
    formatCurrency,
    formatDate,
    debounce,
    throttle,
    collegeData,
    aptitudeQuestions
};
