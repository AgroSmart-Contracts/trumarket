import React, { useEffect } from "react";

import Footer from "src/components/common/footer";
import Header from "src/components/common/header";
import { useUserInfo } from "src/lib/hooks/useUserInfo";
import { register } from "src/lib/push-notification-register";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useEffect(() => {
    const initializePushNotifications = async () => {
      try {
        await register();
      } catch (error) {
        console.error("Error during registration:", error);
      }
    };

    initializePushNotifications();
  }, []);
  return (
    <div className=" flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 py-[80px]">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
