// Logger helper that uses global logger if available
const Logger = {
    info: (message, data = {}) => {
        if (window.logger) {
            window.logger.info(message, data);
        } else {
            console.log(`[INFO] ${message}`, data);
        }
    },
    error: (message, error = {}) => {
        if (window.logger) {
            window.logger.error(message, error);
        } else {
            console.error(`[ERROR] ${message}`, error);
        }
    },
    warn: (message, data = {}) => {
        if (window.logger) {
            window.logger.warn(message, data);
        } else {
            console.warn(`[WARN] ${message}`, data);
        }
    }
};

// Helper functions for UI feedback
function showLoading(show) {
    if (typeof Utils !== 'undefined' && Utils.showLoading) {
        Utils.showLoading(show);
    } else {
        // Fallback - create simple loading indicator
        let spinner = document.getElementById('auth-loading-spinner');
        if (!spinner && show) {
            spinner = document.createElement('div');
            spinner.id = 'auth-loading-spinner';
            spinner.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            spinner.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                z-index: 10000;
            `;
            document.body.appendChild(spinner);
        } else if (spinner && !show) {
            spinner.remove();
        }
    }
}

function showNotification(message, type) {
    if (typeof Utils !== 'undefined' && Utils.showNotification) {
        Utils.showNotification(message, type);
    } else {
        // Enhanced fallback notification
        let notification = document.getElementById('auth-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'auth-notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transform: translateX(400px);
                transition: transform 0.3s ease;
            `;
            document.body.appendChild(notification);
        }
        
        // Set color based on type
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#FF9800',
            info: '#2196F3'
        };
        
        notification.style.backgroundColor = colors[type] || colors.info;
        notification.textContent = message;
        notification.style.transform = 'translateX(0)';
        
        // Auto hide after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
        }, 4000);
    }
}

// Authentication Module
class AuthManager {
    constructor() {
        // Use Firebase services from config or fallback
        const services = window.firebaseServices || {};
        this.auth = services.auth || (typeof firebase !== 'undefined' ? firebase.auth() : null);
        this.db = services.db || (typeof firebase !== 'undefined' ? firebase.firestore() : null);
        this.currentUser = null;
        
        // Listen to auth state changes if auth is available
        if (this.auth && this.auth.onAuthStateChanged) {
            this.auth.onAuthStateChanged((user) => {
                this.currentUser = user;
                this.handleAuthStateChange(user);
            });
        } else {
            // Demo mode - check localStorage for auth state
            const isSignedIn = localStorage.getItem('userSignedIn');
            if (isSignedIn) {
                this.currentUser = {
                    uid: 'demo-user',
                    email: localStorage.getItem('userEmail'),
                    displayName: localStorage.getItem('userName')
                };
                this.handleAuthStateChange(this.currentUser);
            }
        }
    }
    
    // Handle authentication state changes
    handleAuthStateChange(user) {
        if (user) {
            Logger.info('User signed in', { uid: user.uid, email: user.email });
            this.onUserSignedIn(user);
        } else {
            Logger.info('User signed out');
            this.onUserSignedOut();
        }
    }
    
    // User signed in callback
    onUserSignedIn(user) {
        // Update UI elements
        this.updateAuthUI(true);
        
        // Store user session
        localStorage.setItem('userSignedIn', 'true');
        
        // Redirect if on login page
        if (window.location.pathname.includes('login') || window.location.pathname.includes('signup')) {
            window.location.href = '../index.html';
        }
    }
    
    // User signed out callback
    onUserSignedOut() {
        // Update UI elements
        this.updateAuthUI(false);
        
        // Clear user session
        localStorage.removeItem('userSignedIn');
        
        // Redirect to home if on protected page
        const protectedPages = ['student-details', 'career-selection', 'college-list', 'aptitude-test'];
        const currentPage = window.location.pathname;
        
        if (protectedPages.some(page => currentPage.includes(page))) {
            window.location.href = '../pages/student-login.html';
        }
    }
    
    // Update UI based on auth state
    updateAuthUI(isSignedIn) {
        const loginButtons = document.querySelectorAll('.btn-login');
        const authElements = document.querySelectorAll('[data-auth]');
        
        loginButtons.forEach(btn => {
            if (isSignedIn) {
                btn.textContent = 'Dashboard';
                btn.href = 'pages/student-details.html';
            } else {
                btn.textContent = 'Login';
                btn.href = 'pages/student-login.html';
            }
        });
        
        authElements.forEach(element => {
            const authType = element.getAttribute('data-auth');
            if (authType === 'signed-in' && isSignedIn) {
                element.style.display = 'block';
            } else if (authType === 'signed-out' && !isSignedIn) {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });
    }
    
    // Sign up with email and password
    async signUp(email, password, userData) {
        try {
            Logger.info('Attempting to sign up user', { email });
            showLoading(true);
            
            // Check if we have Firebase auth or should use local auth
            if (this.auth && this.auth.createUserWithEmailAndPassword && 
                typeof this.auth.createUserWithEmailAndPassword === 'function' &&
                window.firebaseServices && window.firebaseServices.auth !== null &&
                this.db && this.db.collection) {
                
                // Firebase authentication
                const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;
                
                // Update user profile
                await user.updateProfile({
                    displayName: userData.name
                });
                
                // Store additional user data in Firestore
                const timestamp = (typeof firebase !== 'undefined' && firebase.firestore) 
                    ? firebase.firestore.FieldValue.serverTimestamp() 
                    : new Date().toISOString();
                
                try {
                    await this.db.collection('users').doc(user.uid).set({
                        ...userData,
                        email: user.email,
                        uid: user.uid,
                        createdAt: timestamp,
                        lastLoginAt: timestamp
                    });
                } catch (dbError) {
                    Logger.warn('Database operation failed (non-critical)', dbError);
                    // Continue with signup even if database storage fails
                }
                
                Logger.info('User signed up successfully with Firebase', { uid: user.uid });
                showNotification('Account created successfully! Welcome to Career Guidance.', 'success');
                
                return user;
            } else {
                // Local authentication fallback
                Logger.info('Using local authentication for signup');
                
                if (typeof LocalAuthManager === 'undefined') {
                    throw new Error('Local authentication system not available');
                }
                
                const localAuth = new LocalAuthManager();
                const signupData = {
                    email: email,
                    password: password,
                    name: userData.name,
                    userType: userData.userType || 'student',
                    profile: {
                        phone: userData.phone,
                        grade: userData.education,
                        interests: [userData.stream],
                        location: userData.location || 'Not specified'
                    }
                };
                
                const result = await localAuth.signUp(signupData);
                
                if (result.success) {
                    Logger.info('User signed up successfully with local auth');
                    showNotification('Account created successfully! Please sign in to continue.', 'success');
                    
                    // Redirect to login page
                    setTimeout(() => {
                        window.location.href = 'student-login.html?message=Account created successfully! Please sign in.';
                    }, 1500);
                    
                    return { uid: result.user.id, email: result.user.email, displayName: result.user.name };
                } else {
                    throw new Error(result.error);
                }
            }
            
        } catch (error) {
            Logger.error('Sign up failed', error);
            this.handleAuthError(error);
            throw error;
        } finally {
            showLoading(false);
        }
    }
    
    // Sign in with email and password
    async signIn(email, password) {
        try {
            console.log('🔐 AuthManager.signIn called with:', { email });
            Logger.info('Attempting to sign in user', { email });
            showLoading(true);
            
            // Check if we have Firebase auth or should use local auth
            if (this.auth && this.auth.signInWithEmailAndPassword && 
                typeof this.auth.signInWithEmailAndPassword === 'function' &&
                window.firebaseServices && window.firebaseServices.auth !== null &&
                this.db && this.db.collection) {
                
                // Firebase authentication
                const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
                const user = userCredential.user;
                
                // Update last login time
                const timestamp = (typeof firebase !== 'undefined' && firebase.firestore) 
                    ? firebase.firestore.FieldValue.serverTimestamp() 
                    : new Date().toISOString();
                
                try {
                    await this.db.collection('users').doc(user.uid).update({
                        lastLoginAt: timestamp
                    });
                } catch (dbError) {
                    Logger.warn('Database update failed (non-critical)', dbError);
                    // Continue with signin even if database update fails
                }
                
                Logger.info('User signed in successfully with Firebase', { uid: user.uid });
                showNotification('Welcome back!', 'success');
                
                return user;
            } else {
                // Local authentication fallback
                console.log('🏠 Using local authentication for signin');
                Logger.info('Using local authentication for signin');
                
                if (typeof LocalAuthManager === 'undefined') {
                    throw new Error('Local authentication system not available');
                }
                
                const localAuth = new LocalAuthManager();
                console.log('📞 Calling localAuth.signIn...');
                const result = await localAuth.signIn(email, password, false);
                console.log('📊 LocalAuth result:', result);
                
                if (result.success) {
                    console.log('✅ Local auth signin successful');
                    Logger.info('User signed in successfully with local auth');
                    showNotification('Welcome back!', 'success');
                    
                    // Set current user for local auth
                    this.currentUser = {
                        uid: result.user.id,
                        email: result.user.email,
                        displayName: result.user.name
                    };
                    
                    console.log('🚀 Scheduling redirect in 1 second...');
                    // Redirect to student details or dashboard
                    setTimeout(() => {
                        console.log('⏰ Redirect timeout reached, navigating to student-details.html');
                        window.location.href = 'student-details.html';
                    }, 1000);
                    
                    return this.currentUser;
                } else {
                    console.log('❌ Local auth signin failed:', result.error);
                    throw new Error(result.error);
                }
            }
            
        } catch (error) {
            Logger.error('Sign in failed', error);
            this.handleAuthError(error);
            throw error;
        } finally {
            showLoading(false);
        }
    }
    
    // Sign out
    async signOut() {
        try {
            Logger.info('Signing out user');
            await this.auth.signOut();
            showNotification('Signed out successfully', 'success');
        } catch (error) {
            Logger.error('Sign out failed', error);
            showNotification('Failed to sign out', 'error');
        }
    }
    
    // Reset password
    async resetPassword(email) {
        try {
            Logger.info('Sending password reset email', { email });
            showLoading(true);
            
            await this.auth.sendPasswordResetEmail(email);
            
            Logger.info('Password reset email sent');
            showNotification('Password reset email sent. Check your inbox.', 'success');
        } catch (error) {
            Logger.error('Password reset failed', error);
            this.handleAuthError(error);
            throw error;
        } finally {
            showLoading(false);
        }
    }
    
    // Sign in with Google
    async signInWithGoogle() {
        try {
            Logger.info('Attempting Google sign in');
            showLoading(true);
            
            // Use the provider from Firebase services
            const provider = window.firebaseServices?.googleProvider || new firebase.auth.GoogleAuthProvider();
            
            if (provider.addScope) {
                provider.addScope('email');
                provider.addScope('profile');
            }
            
            const result = await this.auth.signInWithPopup(provider);
            const user = result.user;
            
            // Store user data for demo mode or real Firebase
            if (window.firebaseServices?.auth?.signInWithPopup && user) {
                // Demo mode - store in localStorage
                localStorage.setItem('userSignedIn', 'true');
                localStorage.setItem('userEmail', user.email);
                localStorage.setItem('userName', user.displayName);
                localStorage.setItem('userPhoto', user.photoURL || '');
                localStorage.setItem('authProvider', 'google');
            } else {
                // Real Firebase mode
                const userDoc = await this.db.collection('users').doc(user.uid).get();
                
                if (!userDoc.exists) {
                    // Create user document for new Google users
                    const timestamp = (typeof firebase !== 'undefined' && firebase.firestore) 
                        ? firebase.firestore.FieldValue.serverTimestamp() 
                        : new Date().toISOString();
                    
                    try {
                        await this.db.collection('users').doc(user.uid).set({
                            name: user.displayName,
                            email: user.email,
                            uid: user.uid,
                            photoURL: user.photoURL,
                            provider: 'google',
                            createdAt: timestamp,
                            lastLoginAt: timestamp
                        });
                    } catch (dbError) {
                        Logger.warn('Database storage failed (non-critical)', dbError);
                    }
                } else {
                    // Update last login time
                    const timestamp = (typeof firebase !== 'undefined' && firebase.firestore) 
                        ? firebase.firestore.FieldValue.serverTimestamp() 
                        : new Date().toISOString();
                    
                    try {
                        await this.db.collection('users').doc(user.uid).update({
                            lastLoginAt: timestamp
                        });
                    } catch (dbError) {
                        Logger.warn('Database update failed (non-critical)', dbError);
                    }
                }
            }
            
            Logger.info('Google sign in successful', { uid: user.uid });
            showNotification('Signed in with Google successfully!', 'success');
            
            return user;
        } catch (error) {
            Logger.error('Google sign in failed', error);
            this.handleAuthError(error);
            throw error;
        } finally {
            showLoading(false);
        }
    }
    
    // Get current user data
    async getCurrentUserData() {
        if (!this.currentUser) {
            return null;
        }
        
        try {
            if (this.db && this.db.collection) {
                const userDoc = await this.db.collection('users').doc(this.currentUser.uid).get();
                
                if (userDoc.exists) {
                    return {
                        uid: this.currentUser.uid,
                        ...userDoc.data()
                    };
                }
            }
            
            // Fallback to basic user info
            return {
                uid: this.currentUser.uid,
                email: this.currentUser.email,
                displayName: this.currentUser.displayName
            };
        } catch (error) {
            Logger.error('Failed to get user data', error);
            // Return basic info as fallback
            return {
                uid: this.currentUser.uid,
                email: this.currentUser.email,
                displayName: this.currentUser.displayName
            };
        }
    }
    
    // Update user profile
    async updateUserProfile(userData) {
        if (!this.currentUser) {
            throw new Error('No user signed in');
        }
        
        try {
            Logger.info('Updating user profile', { uid: this.currentUser.uid });
            showLoading(true);
            
            // Update Firebase Auth profile
            if (userData.name) {
                await this.currentUser.updateProfile({
                    displayName: userData.name
                });
            }
            
            // Update Firestore document
            if (this.db && this.db.collection) {
                const timestamp = (typeof firebase !== 'undefined' && firebase.firestore) 
                    ? firebase.firestore.FieldValue.serverTimestamp() 
                    : new Date().toISOString();
                
                try {
                    await this.db.collection('users').doc(this.currentUser.uid).update({
                        ...userData,
                        updatedAt: timestamp
                    });
                } catch (dbError) {
                    Logger.warn('Database update failed (non-critical)', dbError);
                }
            }
            
            Logger.info('User profile updated successfully');
            showNotification('Profile updated successfully!', 'success');
        } catch (error) {
            Logger.error('Failed to update user profile', error);
            showNotification('Failed to update profile', 'error');
            throw error;
        } finally {
            showLoading(false);
        }
    }
    
    // Handle authentication errors
    handleAuthError(error) {
        let message = 'An error occurred. Please try again.';
        
        // Handle Firebase auth errors
        if (error.code) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    message = 'An account with this email already exists.';
                    break;
                case 'auth/weak-password':
                    message = 'Password should be at least 6 characters.';
                    break;
                case 'auth/invalid-email':
                    message = 'Please enter a valid email address.';
                    break;
                case 'auth/user-not-found':
                    message = 'No account found with this email.';
                    break;
                case 'auth/wrong-password':
                    message = 'Incorrect password.';
                    break;
                case 'auth/too-many-requests':
                    message = 'Too many failed attempts. Please try again later.';
                    break;
                case 'auth/network-request-failed':
                    message = 'Network error. Please check your connection.';
                    break;
                case 'auth/popup-closed-by-user':
                    message = 'Sign-in popup was closed. Please try again.';
                    break;
                default:
                    Logger.error('Unhandled Firebase auth error', { code: error.code, message: error.message });
            }
        } 
        // Handle local auth errors
        else if (typeof error === 'string') {
            message = error;
        }
        // Handle generic errors
        else if (error.message) {
            message = error.message;
        }
        
        showNotification(message, 'error');
    }
    
    // Check if user is authenticated
    isAuthenticated() {
        return !!this.currentUser;
    }
    
    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }
    
    // Require authentication for protected pages
    requireAuth() {
        if (!this.isAuthenticated()) {
            Logger.warn('Access denied - user not authenticated');
            window.location.href = '../pages/student-login.html';
            return false;
        }
        return true;
    }
}

// Initialize authentication manager
const authManager = new AuthManager();

// Form handlers for authentication pages
document.addEventListener('DOMContentLoaded', function() {
    // Sign up form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignUpForm);
    }
    
    // Sign in form
    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
        signinForm.addEventListener('submit', handleSignInForm);
    }
    
    // Password reset form
    const resetForm = document.getElementById('reset-form');
    if (resetForm) {
        resetForm.addEventListener('submit', handlePasswordResetForm);
    }
    
    // Google sign in button
    const googleSignInBtn = document.getElementById('google-signin-btn');
    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', handleGoogleSignIn);
    }
    
    // Sign out button
    const signOutBtn = document.getElementById('signout-btn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', handleSignOut);
    }
});

// Handle sign up form submission
async function handleSignUpForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    // Handle both 'name' field and 'firstName'/'lastName' fields
    let name = formData.get('name');
    if (!name) {
        const firstName = formData.get('firstName') || '';
        const lastName = formData.get('lastName') || '';
        name = `${firstName} ${lastName}`.trim();
    }
    
    const userData = {
        name: name,
        email: formData.get('email'),
        phone: formData.get('phone'),
        dateOfBirth: formData.get('dateOfBirth'),
        userType: formData.get('userType') || 'student',
        education: formData.get('education'),
        stream: formData.get('stream')
    };
    
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    // Validate password confirmation
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    try {
        await authManager.signUp(userData.email, password, userData);
    } catch (error) {
        // Error is already handled in signUp method
    }
}

// Handle sign in form submission
async function handleSignInForm(e) {
    e.preventDefault();
    
    console.log('🎯 Sign in form submitted via auth.js');
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    console.log('📧 Sign in attempt:', { email, hasPassword: !!password });
    
    try {
        console.log('🔄 Calling authManager.signIn...');
        const result = await authManager.signIn(email, password);
        console.log('✅ Sign in completed:', result);
    } catch (error) {
        console.error('❌ Sign in error in form handler:', error);
        // Error is already handled in signIn method
    }
}

// Handle password reset form submission
async function handlePasswordResetForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    
    try {
        await authManager.resetPassword(email);
    } catch (error) {
        // Error is already handled in resetPassword method
    }
}

// Handle Google sign in
async function handleGoogleSignIn() {
    try {
        await authManager.signInWithGoogle();
    } catch (error) {
        // Error is already handled in signInWithGoogle method
    }
}

// Handle sign out
async function handleSignOut() {
    await authManager.signOut();
}

// Export auth manager for other modules
window.authManager = authManager;
