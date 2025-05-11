import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User as FirebaseUser
} from 'firebase/auth';

// Initialize Firebase (normally would be in a separate file)
const firebaseConfig = {
  apiKey: "AIzaSyAeT6Q5wKPVdj6Rp87tCqBN3vrfIt6xRLA",
  authDomain: "hararetetweb.firebaseapp.com",
  projectId: "hararetetweb",
  storageBucket: "hararetetweb.firebasestorage.app",
  messagingSenderId: "791172528316",
  appId: "1:791172528316:web:89658e452b58e0b44378b9"
};

// Initialize Firebase if it hasn't been initialized already
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

interface User {
  uid: string;
  email: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  googleSignIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!loading && segments) {
      const inAuthGroup = segments[0] === '(auth)';
      
      if (!user && !inAuthGroup) {
        router.replace('/login');
      } else if (user && inAuthGroup) {
        router.replace('/(tabs)');
      }
    }
  }, [user, loading, segments]);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const googleSignIn = async () => {
    try {
      // In a real app, we would use GoogleSignIn from @react-native-google-signin/google-signin
      Alert.alert('Google Sign In', 'This would be real Google sign in in a production app.');
    } catch (error) {
      console.error('Google Sign In error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleSignIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}