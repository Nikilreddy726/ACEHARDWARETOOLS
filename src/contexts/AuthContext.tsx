import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  sendPasswordResetEmail,
  type User
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isDemoMode } from '../lib/firebase';
import type { Profile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const docRef = doc(db, 'profiles', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data() as Profile);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setProfile(null);
    }
  };

  useEffect(() => {
    // Safety timeout
    const timeout = setTimeout(() => setLoading(false), 3000);

    // Check for Demo User first (from local storage bypass)
    const savedDemoUser = localStorage.getItem('demo_user');
    if (savedDemoUser) {
      const { user: dUser, profile: dProfile } = JSON.parse(savedDemoUser);
      setUser(dUser as User);
      setProfile(dProfile as Profile);
      setLoading(false);
      clearTimeout(timeout);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      clearTimeout(timeout);
      setUser(firebaseUser);
      if (firebaseUser) {
        fetchProfile(firebaseUser.uid);
      } else if (!localStorage.getItem('demo_user')) {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    // 1. Hardcoded Admin Bypass
    if (email.toUpperCase() === 'ADMIN' && password === 'ADMIN@123') {
      await new Promise(resolve => setTimeout(resolve, 800));
      const adminUser = { email: 'admin@acehardware.com', uid: 'admin-id' };
      const adminProfile = { id: 'admin-id', full_name: 'System Admin', is_admin: true };
      setUser(adminUser as any);
      setProfile(adminProfile as any);
      localStorage.setItem('demo_user', JSON.stringify({ user: adminUser, profile: adminProfile }));
      return { error: null };
    }

    // 2. Demo Mode Bypass
    if (email === 'demo@example.com' || isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const demoUser = { email: email || 'demo@example.com', uid: 'demo-user-id' };
      const demoProfile = { id: 'demo-user-id', full_name: 'Demo User', is_admin: false };
      setUser(demoUser as any);
      setProfile(demoProfile as any);
      localStorage.setItem('demo_user', JSON.stringify({ user: demoUser, profile: demoProfile }));
      return { error: null };
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    // Demo Mode fallback
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const demoUser = { email, uid: 'demo-user-id' };
      const demoProfile = { id: 'demo-user-id', full_name: fullName, is_admin: false };
      setUser(demoUser as any);
      setProfile(demoProfile as any);
      localStorage.setItem('demo_user', JSON.stringify({ user: demoUser, profile: demoProfile }));
      return { error: null };
    }

    try {
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
      // Create profile in Firestore
      const profileData = {
        id: newUser.uid,
        full_name: fullName,
        is_admin: false,
        created_at: new Date().toISOString()
      };
      await setDoc(doc(db, 'profiles', newUser.uid), profileData);
      setProfile(profileData as Profile);
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('demo_user');
    await firebaseSignOut(auth);
  };

  const resetPassword = async (email: string) => {
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { error: null };
    }

    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        isAdmin: profile?.is_admin ?? false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

