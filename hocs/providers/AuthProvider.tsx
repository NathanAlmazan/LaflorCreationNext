import { firebaseAuth } from "../../config/firebase/client";
import { User } from "firebase/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { setCookie } from 'nookies';

const AuthContext = createContext<{ user: User | null }>({
  user: null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return firebaseAuth.onIdTokenChanged(async (user) => {
      if (!user) {
        setUser(null);
        setCookie(null, 'token', '', { path: '/' });
      } else {
        const token = await user.getIdToken();
        setUser(user);
        setCookie(null, 'token', token, {
          maxAge: 30 * 60 * 1000,
          path: '/',
        });
      }
    });
  }, []);

  useEffect(() => {
    const handle = setInterval(async () => {
      const user = firebaseAuth.currentUser;
      if (user) await user.getIdToken(true);
    }, 20 * 60 * 1000);

    return () => clearInterval(handle);
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}