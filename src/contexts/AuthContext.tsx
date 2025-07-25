import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  botnoiToken: string | null;
  setBotnoiToken: (token: string | null) => void;
  botnoiProfile: any | null;
  setBotnoiProfile: (profile: any | null) => void;
  botnoiApiKey: string | null;
  setBotnoiApiKey: (key: string | null) => void;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [botnoiToken, setBotnoiToken] = useState<string | null>(null);
  const [botnoiProfile, setBotnoiProfile] = useState<any | null>(null);
  const [botnoiApiKey, setBotnoiApiKey] = useState<string | null>(null);

  const signup = async (email: string, password: string, displayName?: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(user, { displayName });
    }
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
      // Fetch Botnoi token, profile, and API key if user is logged in
      if (user) {
        try {
          const firebaseToken = await user.getIdToken();
          const res = await fetch('https://api-voice-staging.botnoi.ai/api/dashboard/firebase_auth', {
            method: 'GET',
            headers: {
              'botnoi-token': `Bearer ${firebaseToken}`,
            },
          });
          if (!res.ok) throw new Error('Failed to fetch Botnoi token');
          const data = await res.json();
          if (data.data && data.data.token) {
            setBotnoiToken(data.data.token);
            // Fetch Botnoi profile
            try {
              const profileRes = await fetch('https://api-voice.botnoi.ai/api/dashboard/get_profile', {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${data.data.token}`,
                },
              });
              if (!profileRes.ok) throw new Error('Failed to fetch Botnoi profile');
              const profileData = await profileRes.json();
              setBotnoiProfile(profileData.data || null);
            } catch {
              setBotnoiProfile(null);
            }
            // Fetch Botnoi API Key (different from profile token)
            try {
              const userId = data.data.uid || user.uid;
              const apiKeyRes = await fetch(`https://api-voice.botnoi.ai/db/dashboard/get_token?user_id=${userId}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${data.data.token}`,
                },
              });
              const apiKeyData = await apiKeyRes.json();
              console.log('Botnoi API key response:', apiKeyData);
              if (apiKeyData && apiKeyData.message === 'success' && apiKeyData.data) {
                if (apiKeyData.data.token) {
                  console.log('Retrieved API key successfully from Botnoi API');
                  setBotnoiApiKey(apiKeyData.data.token);
                } else {
                  console.log('API key is empty, using Botnoi token as fallback');
                  setBotnoiApiKey(data.data.token);
                }
              } else {
                console.log('Invalid API key response format, using Botnoi token as fallback');
                setBotnoiApiKey(data.data.token);
              }
            } catch (err) {
              console.error('Error getting Botnoi API key:', err);
              console.log('Using Botnoi token as fallback due to error');
              setBotnoiApiKey(data.data.token);
            }
          } else {
            setBotnoiToken(null);
            setBotnoiProfile(null);
            setBotnoiApiKey(null);
          }
        } catch {
          setBotnoiToken(null);
          setBotnoiProfile(null);
          setBotnoiApiKey(null);
        }
      } else {
        setBotnoiToken(null);
        setBotnoiProfile(null);
        setBotnoiApiKey(null);
      }
    });
    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    botnoiToken,
    setBotnoiToken,
    botnoiProfile,
    setBotnoiProfile,
    botnoiApiKey,
    setBotnoiApiKey,
    signup,
    login,
    logout,
    loginWithGoogle,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
