// contexts/SessionContext.tsx
import { createContext, useContext, useMemo, useState, Dispatch, SetStateAction } from "react";

interface SessionContextType {
  session: any; // Replace 'any' with your session type
  setSession: Dispatch<SetStateAction<any>>; // Replace 'any' with your session type
}

const defaultSessionContext: SessionContextType = {
  session: null,
  setSession: () => {},
};

const SessionContext = createContext<SessionContextType>(defaultSessionContext);

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [session, setSession] = useState(null);

  const value = useMemo(() => ({ session, setSession }), [session]);

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};
