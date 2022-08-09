import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

type data_type = {
  Component: any;
  pageProps: any;
  session: any;
};
function MyApp({ Component, pageProps: { session, ...pageProps } }: data_type) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
