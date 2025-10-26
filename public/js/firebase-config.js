// Firebase configuration
const firebaseConfig = {
  // Replace with your Firebase project configuration
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Google Auth Provider configuration
let googleProvider;

// Demo mode - Initialize Firebase only if config is provided
let auth, db, storage;

try {
  if (typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "your-api-key-here") {
    // Initialize Firebase with real config
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    storage = firebase.storage();
    
    // Initialize Google Auth Provider
    googleProvider = new firebase.auth.GoogleAuthProvider();
    googleProvider.addScope('email');
    googleProvider.addScope('profile');
    
    console.log('Firebase initialized successfully');
  } else {
    // Demo mode - create mock objects
    console.log('Running in demo mode - Firebase not configured');
    auth = {
      currentUser: null,
      signInWithEmailAndPassword: (email, password) => Promise.resolve({ 
        user: { 
          uid: 'demo-user-' + Date.now(), 
          email: email, 
          displayName: 'Demo User',
          updateProfile: (profile) => Promise.resolve()
        } 
      }),
      createUserWithEmailAndPassword: (email, password) => Promise.resolve({ 
        user: { 
          uid: 'demo-user-' + Date.now(), 
          email: email, 
          displayName: 'Demo User',
          updateProfile: (profile) => Promise.resolve()
        } 
      }),
      signInWithPopup: (provider) => Promise.resolve({ 
        user: { 
          uid: 'google-demo-user-' + Date.now(), 
          email: 'demo.user@gmail.com', 
          displayName: 'Demo Google User',
          photoURL: 'https://via.placeholder.com/150',
          updateProfile: (profile) => Promise.resolve()
        } 
      }),
      signOut: () => Promise.resolve(),
      onAuthStateChanged: (callback) => callback(null),
      sendPasswordResetEmail: (email) => Promise.resolve()
    };
    
    // Mock Google Provider for demo
    googleProvider = {
      providerId: 'google.com',
      addScope: () => {}
    };
    db = {
      collection: () => ({
        doc: () => ({
          set: () => Promise.resolve(),
          update: () => Promise.resolve(),
          get: () => Promise.resolve({ exists: false, data: () => ({}) }),
          delete: () => Promise.resolve()
        }),
        add: () => Promise.resolve({ id: 'mock-doc-id' }),
        get: () => Promise.resolve({ docs: [] }),
        where: () => ({
          get: () => Promise.resolve({ docs: [] })
        })
      })
    };
    storage = {
      ref: () => ({
        put: () => Promise.resolve(),
        getDownloadURL: () => Promise.resolve('demo-url')
      })
    };
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

// Export for use in other modules
window.firebaseServices = { auth, db, storage, googleProvider };

// Configure Firestore settings only if we have a real Firebase instance
if (typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "your-api-key-here" && db && db.settings) {
  try {
    db.settings({
      timestampsInSnapshots: true
    });
    console.log('Firebase Firestore configured successfully');
  } catch (error) {
    console.warn('Firestore configuration warning (non-critical):', error.message);
  }
}

console.log('Firebase services initialized:', {
  hasFirebase: typeof firebase !== 'undefined',
  hasAuth: !!auth,
  hasDb: !!db,
  hasStorage: !!storage,
  mode: firebaseConfig.apiKey === "your-api-key-here" ? 'demo' : 'firebase'
});
