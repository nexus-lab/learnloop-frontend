import { useSession } from '../contexts/SessionContext';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '@/lib/api/auth/helper';

export const useSessionCheck = () => {
  const { session, setSession } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      // Implement logic to check if token is near expiration
      if (session && await !isAuthenticated(session.access_token)) {
        // Attempt to refresh the token
        const refreshResponse = await fetch('/api/auth/refresh');
        if (refreshResponse.ok) {
          const newSessionData = await refreshResponse.json();
          setSession(newSessionData);
        } else {
          setSession(null);
          router.push('/login');
        }
      }
    };

    checkSession();
  }, [router.asPath]); // Re-run the effect when the route changes
};
