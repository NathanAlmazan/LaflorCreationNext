import { firebaseAuth } from "../../config/firebase/client";
import { User } from "firebase/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { setCookie } from 'nookies';

interface CustomUser extends User {
  admin: boolean;
}

const adminEmails = ["nathanael.almazan@gmail.com", "admin.account@laflorcreation.com"];

const AuthContext = createContext<{ user: CustomUser | null }>({
  user: null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomUser | null>(null);

  useEffect(() => {
    return firebaseAuth.onIdTokenChanged(async (user) => {
      if (!user) {
        setUser(null);
        setCookie(null, 'token', '', { path: '/' });
      } else {
        const token = await user.getIdToken();

        if (adminEmails.includes(user.email as string)) setUser({ ...user, admin: true });
        else setUser({ ...user, admin: false });

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