import { useNextRouterViewTransitions } from "use-view-transitions/next";
import { useRouter } from "next/router";
import { SessionProvider } from "../contexts/SessionContext";
import "./globals.css";
import { usePathname } from "next/navigation";

const App = ({ Component, pageProps }: { Component: any; pageProps: any }) => {
  const router = useRouter();
  const pathname = usePathname();

  // If page layout is available, use it. Else return the page
  const getLayout = Component.getLayout || ((page: React.ReactNode) => page);

  useNextRouterViewTransitions({
    events: {
      on: (event, callback) => router.events.on(event as any, callback),
      off: (event, callback) => router.events.off(event as any, callback),
    },
  });

  return (
    <SessionProvider>{getLayout(<Component {...pageProps} />)}</SessionProvider>
  );
};

export default App;
