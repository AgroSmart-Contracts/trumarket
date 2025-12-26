import "react-toastify/dist/ReactToastify.css";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

import { Inter } from "next/font/google";
import "src/styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Auth0Provider } from "@auth0/auth0-react";

import { Web3AuthContextProvider } from "src/context/web3-auth-context";
import { wrapper } from "src/lib/store";
import { ModalProvider } from "src/context/modal-context";

import Layout from "./layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  // Log NEXT_PUBLIC_ variables on server-side (will appear in CloudWatch)
  if (typeof window === 'undefined') {
    console.log('========================================');
    console.log('🌐 NEXT_PUBLIC Environment Variables (_app.tsx server-side):');
    console.log('========================================');
    const nextPublicVars: Record<string, string | undefined> = {
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_BLOCKCHAIN_CHAIN_ID: process.env.NEXT_PUBLIC_BLOCKCHAIN_CHAIN_ID,
      NEXT_PUBLIC_BLOCKCHAIN_RPC_URL: process.env.NEXT_PUBLIC_BLOCKCHAIN_RPC_URL,
      NEXT_PUBLIC_BLOCKCHAIN_NAME: process.env.NEXT_PUBLIC_BLOCKCHAIN_NAME,
      NEXT_PUBLIC_BLOCKCHAIN_EXPLORER: process.env.NEXT_PUBLIC_BLOCKCHAIN_EXPLORER,
      NEXT_PUBLIC_BLOCKCHAIN_TICKER: process.env.NEXT_PUBLIC_BLOCKCHAIN_TICKER,
      NEXT_PUBLIC_BLOCKCHAIN_TICKER_NAME: process.env.NEXT_PUBLIC_BLOCKCHAIN_TICKER_NAME,
      NEXT_PUBLIC_NFT_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS,
      NEXT_PUBLIC_INVESTMENT_TOKEN_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_INVESTMENT_TOKEN_CONTRACT_ADDRESS,
      NEXT_PUBLIC_INVESTMENT_TOKEN_SYMBOL: process.env.NEXT_PUBLIC_INVESTMENT_TOKEN_SYMBOL,
      NEXT_PUBLIC_INVESTMENT_TOKEN_DECIMALS: process.env.NEXT_PUBLIC_INVESTMENT_TOKEN_DECIMALS,
      NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID: process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID,
      NEXT_PUBLIC_WEB3AUTH_CONNECTION_ID: process.env.NEXT_PUBLIC_WEB3AUTH_CONNECTION_ID,
      NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID,
      NEXT_PUBLIC_AUTH0_BASE_URL: process.env.NEXT_PUBLIC_AUTH0_BASE_URL,
      NEXT_PUBLIC_AUTH0_CLIENT_ID_SOCIAL: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID_SOCIAL,
      NEXT_PUBLIC_AUTH0_API_URL: process.env.NEXT_PUBLIC_AUTH0_API_URL,
      NEXT_PUBLIC_AUTH0_CLIENT_ID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
      NEXT_PUBLIC_AUTH0_CLIENT_SECRET: process.env.NEXT_PUBLIC_AUTH0_CLIENT_SECRET,
      NEXT_PUBLIC_LOG_CHAIN_CONFIG: process.env.NEXT_PUBLIC_LOG_CHAIN_CONFIG,
    };
    
    Object.entries(nextPublicVars).forEach(([key, value]) => {
      console.log(`${key}: ${value || '(not set)'}`);
    });
    console.log('========================================');
  }

  // Create a client
  const queryClient = new QueryClient();

  // useCheckNotificationPermission();

  return (
    <>
      {/* eslint-disable-next-line */}
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <Auth0Provider
        domain={process.env.NEXT_PUBLIC_AUTH0_BASE_URL as string}
        clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID_SOCIAL as string}
        authorizationParams={{
          redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/`,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <Web3AuthContextProvider>
            <ModalProvider>
              <div className={`font-sans`}>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
                <ToastContainer
                  position="bottom-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                  icon={false}
                  style={{ zIndex: 999999999 }}
                />
              </div>
            </ModalProvider>
          </Web3AuthContextProvider>
        </QueryClientProvider>
      </Auth0Provider>
    </>
  );
}

export default wrapper.withRedux(App);
