import { createContext, useContext, useMemo, useState, useEffect, Dispatch, SetStateAction } from 'react';

interface SessionContextType {
  session: any; // Replace 'any' with your specific session type
  setSession: Dispatch<SetStateAction<any>>; // Replace 'any' with your specific session type
}

const defaultSessionContext: SessionContextType = {
  session: null,
  setSession: () => {},
};

const SessionContext = createContext<SessionContextType>(defaultSessionContext);

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/auth/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const sessionData = await response.json();
          setSession(sessionData);
        } else {
          // Handle errors or set session to null if unauthorized
          setSession(null);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        setSession(null);
      }
    };

    fetchSession();
  }, []);

  const value = useMemo(() => ({ session, setSession }), [session]);

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};
