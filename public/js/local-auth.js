/**
 * Simple Local Authentication System for Career Guidance Application
 * Stores user data in localStorage and provides basic authentication functionality
 */

class LocalAuthManager {
    constructor() {
        this.storageKeys = {
            users: 'career_guidance_users',
            currentUser: 'career_guidance_current_user',
            isLoggedIn: 'career_guidance_logged_in'
        };
        
        // Initialize with default demo users if none exist
        this.initializeDefaultUsers();
        
        // Initialize logger if available
        this.logger = window.logger || this.createFallbackLogger();
    }

    createFallbackLogger() {
        return {
            info: (msg, data) => console.log(`[INFO] ${msg}`, data),
            error: (msg, data) => console.error(`[ERROR] ${msg}`, data),
            warn: (msg, data) => console.warn(`[WARN] ${msg}`, data)
        };
    }

    initializeDefaultUsers() {
        const existingUsers = this.getStoredUsers();
        if (existingUsers.length === 0) {
            const defaultUsers = [
                {
                    id: 'user_1',
                    email: 'student@example.com',
                    password: 'password123', // In real app, this would be hashed
                    name: 'Demo Student',
                    userType: 'student',
                    profile: {
                        phone: '+1234567890',
                        grade: '12',
                        interests: ['Engineering', 'Technology'],
                        location: 'Demo City'
                    },
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'user_2',
                    email: 'john.doe@email.com',
                    password: 'student123',
                    name: 'John Doe',
                    userType: 'student',
                    profile: {
                        phone: '+1987654321',
                        grade: '12',
                        interests: ['Medicine', 'Science'],
                        location: 'New York'
                    },
                    createdAt: new Date().toISOString()
                }
            ];
            
            localStorage.setItem(this.storageKeys.users, JSON.stringify(defaultUsers));
            this.logger.info('Initialized default users for local authentication');
        }
    }

    getStoredUsers() {
        try {
            const users = localStorage.getItem(this.storageKeys.users);
            return users ? JSON.parse(users) : [];
        } catch (error) {
            this.logger.error('Error reading stored users', error);
            return [];
        }
    }

    saveUsers(users) {
        try {
            localStorage.setItem(this.storageKeys.users, JSON.stringify(users));
            return true;
        } catch (error) {
            this.logger.error('Error saving users', error);
            return false;
        }
    }

    async signIn(email, password, rememberMe = false) {
        try {
            this.logger.info('Attempting local sign in', { email, rememberMe });

            // Validate input
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            // Find user
            const users = this.getStoredUsers();
            const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (!user) {
                throw new Error('User not found. Please check your email or sign up.');
            }

            if (user.password !== password) {
                throw new Error('Incorrect password. Please try again.');
            }

            // Set user as logged in
            const userSession = {
                id: user.id,
                email: user.email,
                name: user.name,
                userType: user.userType,
                profile: user.profile,
                loginTime: new Date().toISOString(),
                rememberMe: rememberMe
            };

            localStorage.setItem(this.storageKeys.currentUser, JSON.stringify(userSession));
            localStorage.setItem(this.storageKeys.isLoggedIn, 'true');

            this.logger.info('User signed in successfully', { userId: user.id, email: user.email });

            return {
                success: true,
                user: userSession,
                message: 'Signed in successfully!'
            };

        } catch (error) {
            this.logger.error('Sign in failed', { email, error: error.message });
            return {
                success: false,
                error: error.message
            };
        }
    }

    async signUp(userData) {
        try {
            this.logger.info('Attempting local sign up', { email: userData.email });

            // Validate required fields
            if (!userData.email || !userData.password || !userData.name) {
                throw new Error('Email, password, and name are required');
            }

            // Check if user already exists
            const users = this.getStoredUsers();
            const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());

            if (existingUser) {
                throw new Error('An account with this email already exists. Please sign in instead.');
            }

            // Create new user
            const newUser = {
                id: 'user_' + Date.now(),
                email: userData.email,
                password: userData.password, // In real app, this would be hashed
                name: userData.name,
                userType: 'student',
                profile: {
                    phone: userData.phone || '',
                    grade: userData.grade || '',
                    interests: userData.interests || [],
                    location: userData.location || ''
                },
                createdAt: new Date().toISOString()
            };

            // Save user
            users.push(newUser);
            this.saveUsers(users);

            this.logger.info('User registered successfully', { userId: newUser.id, email: newUser.email });

            return {
                success: true,
                user: newUser,
                message: 'Account created successfully! You can now sign in.'
            };

        } catch (error) {
            this.logger.error('Sign up failed', { email: userData.email, error: error.message });
            return {
                success: false,
                error: error.message
            };
        }
    }

    signOut() {
        try {
            const currentUser = this.getCurrentUser();
            if (currentUser) {
                this.logger.info('User signed out', { userId: currentUser.id });
            }

            localStorage.removeItem(this.storageKeys.currentUser);
            localStorage.removeItem(this.storageKeys.isLoggedIn);

            return {
                success: true,
                message: 'Signed out successfully'
            };
        } catch (error) {
            this.logger.error('Sign out failed', error);
            return {
                success: false,
                error: 'Failed to sign out'
            };
        }
    }

    isAuthenticated() {
        return localStorage.getItem(this.storageKeys.isLoggedIn) === 'true';
    }

    getCurrentUser() {
        try {
            const userStr = localStorage.getItem(this.storageKeys.currentUser);
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            this.logger.error('Error getting current user', error);
            return null;
        }
    }

    async resetPassword(email) {
        try {
            this.logger.info('Password reset requested', { email });

            const users = this.getStoredUsers();
            const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (!user) {
                throw new Error('No account found with this email address');
            }

            // In a real app, this would send an email
            // For demo, we'll just show the current password (not recommended in production)
            this.logger.warn('Password reset - showing current password for demo', { email });

            return {
                success: true,
                message: `Demo Mode: Your current password is "${user.password}". In a real application, a reset link would be sent to your email.`
            };

        } catch (error) {
            this.logger.error('Password reset failed', { email, error: error.message });
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get all registered users (for demo/admin purposes)
    getAllUsers() {
        if (this.isAuthenticated()) {
            return this.getStoredUsers().map(user => ({
                id: user.id,
                email: user.email,
                name: user.name,
                userType: user.userType,
                createdAt: user.createdAt
            }));
        }
        return [];
    }

    // Update user profile
    async updateProfile(updates) {
        try {
            const currentUser = this.getCurrentUser();
            if (!currentUser) {
                throw new Error('Not authenticated');
            }

            const users = this.getStoredUsers();
            const userIndex = users.findIndex(u => u.id === currentUser.id);

            if (userIndex === -1) {
                throw new Error('User not found');
            }

            // Update user data
            users[userIndex] = { ...users[userIndex], ...updates };
            this.saveUsers(users);

            // Update current session
            const updatedSession = { ...currentUser, ...updates };
            localStorage.setItem(this.storageKeys.currentUser, JSON.stringify(updatedSession));

            this.logger.info('Profile updated successfully', { userId: currentUser.id });

            return {
                success: true,
                user: updatedSession,
                message: 'Profile updated successfully'
            };

        } catch (error) {
            this.logger.error('Profile update failed', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Export for use in other scripts
window.LocalAuthManager = LocalAuthManager;