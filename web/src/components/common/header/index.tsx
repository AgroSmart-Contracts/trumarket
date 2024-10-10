import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { Badge, IconButton, badgeClasses } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { useUserInfo } from "src/lib/hooks/useUserInfo";
import NotificationMenu from "src/components/dashboard/notifications/notification-menu";
import { NotificationsService } from "src/controller/NotificationsAPI.service";

import Button, { ButtonVariants } from "../button";
import Container from "../container";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const { userInfo } = useUserInfo();
  const router = useRouter();

  const renderAuthButtons = useCallback(() => {
    if (!userInfo?.jwt) {
      const buttonText = router.asPath === "/sign-in" ? "Create Account" : "Sign in";
      const buttonAction = router.asPath === "/sign-in" ? () => router.push("/") : () => router.push("/sign-in");
      return (
        <Button onClick={buttonAction} variant={ButtonVariants.FILLED_BLUE}>
          <p className="text-[13px] font-bold leading-[1.2em] text-tm-white">{buttonText}</p>
        </Button>
      );
    }
    return null;
  }, [userInfo, router.asPath]);

  const {
    data: notifications,
    isLoading: isNotificationsLoading,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ["get-user-notifications"],
    queryFn: () => NotificationsService.getNotificationsList(),
    select: (data) => {
      const unseenMessageCount = data.filter(
        (notification) => !notification.read && notification.subject !== "Account created",
      );

      return {
        unseenCount: unseenMessageCount.length,
        data,
      };
    },
    enabled: Boolean(userInfo?.jwt),
  });

  return (
    <div className="fixed left-0 z-[999] min-h-[60px] w-full  bg-tm-charcoal-blue  py-[12px] ">
      <Container>
        <div className="flex w-full items-center justify-between px-[30px]">
          <div className="flex items-center">
            <Link href="/dashboard">
              <Image src="/assets/logo.svg" alt="trumarket logo" width={115} height={44} />
            </Link>
            {userInfo?.jwt ? (
              <nav className="pl-[98px]">
                <Link href="/dashboard" passHref>
                  <li className="list-none text-[12px] font-bold capitalize leading-[1em] tracking-[0.02em] text-tm-white">
                    Dashboard
                  </li>
                </Link>
              </nav>
            ) : null}
          </div>

          <div>
            {renderAuthButtons()}
            {userInfo?.jwt && (
              <div className="flex items-center gap-[5px]">
                <NotificationMenu notifications={notifications?.data || []} refetch={refetch}>
                  <Badge
                    badgeContent={notifications?.unseenCount}
                    max={19}
                    sx={{
                      "& .MuiBadge-badge": {
                        color: "#ffffff",
                        backgroundColor: "#D9486E",
                      },
                    }}
                  >
                    <NotificationsIcon className="!h-[24px] !w-[24px] !text-tm-white" />
                  </Badge>
                </NotificationMenu>
                <Link href="/dashboard/account-details">
                  <PersonIcon className="!h-[26px] !w-[26px] !text-tm-white" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Header;
