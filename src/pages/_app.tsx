import { useNextRouterViewTransitions } from 'use-view-transitions/next';
import { useRouter } from 'next/router';
import './globals.css'

const App = ({ Component, pageProps }: {Component: any, pageProps: any}) => {
  const router = useRouter();

  useNextRouterViewTransitions({ 
    events: {
      on: (event, callback) => router.events.on(event as any, callback),
      off: (event, callback) => router.events.off(event as any, callback),
    } 
  });

  return <Component {...pageProps} />;
};

export default App;
