import "react-toastify/dist/ReactToastify.css";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

import { Inter } from "next/font/google";
import "src/styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Auth0Provider } from "@auth0/auth0-react";
import { useEffect, useLayoutEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

import { Web3AuthContextProvider } from "src/context/web3-auth-context";
import Header from "src/components/common/header";
import { wrapper } from "src/lib/store";
import { ModalProvider } from "src/context/modal-context";
import Footer from "src/components/common/footer";
import { NotificationsService } from "src/controller/NotificationsAPI.service";
import { register } from "src/lib/push-notification-register";

import Layout from "./layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
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
