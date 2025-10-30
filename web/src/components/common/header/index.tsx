import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Bell, User, SignOut } from "@phosphor-icons/react";

import NotificationMenu from "src/components/dashboard/notifications/notification-menu";
import { useUserInfo } from "src/lib/hooks/useUserInfo";
import { useWeb3AuthContext } from "src/context/web3-auth-context";
import { useQuery } from "@tanstack/react-query";
import { NotificationsService } from "src/controller/NotificationsAPI.service";
import { INotification } from "src/interfaces/notifications";

const Header: React.FC = () => {
    const router = useRouter();
    const { logout } = useWeb3AuthContext();
    const { userInfo } = useUserInfo();

    const { data: notifications, refetch: refetchNotifications } = useQuery({
        queryKey: ["notifications"],
        queryFn: () => NotificationsService.getNotificationsList(),
        enabled: !!userInfo?.user?.email,
        initialData: [],
    });

    const unreadCount = notifications?.filter((n: INotification) => !n.read).length || 0;

    return (
        <header className="sticky top-0 z-50 bg-gradient-to-r from-tm-primary to-tm-primary-dark shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between py-4">
                    {/* Logo */}
                    <Link href="/dashboard">
                        <Image src="/assets/logo.svg" alt="trumarket logo" width={160}
                            height={60} />
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            href="/dashboard"
                            className={`text-tm-white hover:text-white/80 transition-colors font-medium ${router.pathname === "/dashboard" ? "text-white font-bold" : ""
                                }`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/dashboard/account-details"
                            className={`text-tm-white hover:text-white/80 transition-colors font-medium ${router.pathname === "/dashboard/account-details" ? "text-white font-bold" : ""
                                }`}
                        >
                            Account
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        {userInfo?.user?.email && (
                            <NotificationMenu notifications={notifications || []} refetch={refetchNotifications}>
                                <button className="relative p-2 text-tm-white hover:bg-white/20 rounded-full transition-colors">
                                    <Bell size={24} weight="bold" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 bg-tm-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                            {unreadCount > 9 ? "9+" : unreadCount}
                                        </span>
                                    )}
                                </button>
                            </NotificationMenu>
                        )}

                        {/* User Menu */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="/dashboard/account-details"
                                className="flex items-center gap-2 text-tm-white hover:bg-white/20 rounded-full px-3 py-2 transition-colors"
                            >
                                <User size={24} weight="bold" />
                                {userInfo?.user?.email && (
                                    <span className="hidden lg:block text-sm font-medium max-w-[150px] truncate">
                                        {userInfo.user.email}
                                    </span>
                                )}
                            </Link>

                            {/* Logout */}
                            <button
                                onClick={logout}
                                className="p-2 text-tm-white hover:bg-tm-danger hover:text-white rounded-full transition-colors"
                                title="Logout"
                            >
                                <SignOut size={24} weight="bold" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

