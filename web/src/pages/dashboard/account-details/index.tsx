import React from "react";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Link from "next/link";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";

import Button from "src/components/common/button";
import Container from "src/components/common/container";
import UserInfo from "src/components/dashboard/account-details";
import Notifications from "src/components/dashboard/account-details/notifications";
import { useWeb3AuthContext } from "src/context/web3-auth-context";
import { useUserInfo } from "src/lib/hooks/useUserInfo";
import { IUserRole } from "src/interfaces/auth";
import { APP_NAME } from "src/constants";
import Loading from "src/components/common/loading";
import { AuthService } from "src/controller/AuthAPI.service";
interface AccountDetailsProps {}

const AccountDetails: React.FC<AccountDetailsProps> = () => {
  const { logout } = useWeb3AuthContext();
  const { userInfo } = useUserInfo();
  const isAdmin = userInfo?.user?.role === IUserRole.ADMIN;

  const {
    data: userProfileInfo,
    isLoading: userProfileInfoLoading,
    refetch,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["get-user-profile-info"],
    queryFn: () => AuthService.getUserProfileInfo(),
  });

  if (userProfileInfoLoading && !isError) {
    return (
      <div className="absolute left-1/2 top-1/2 translate-y-1/2">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{APP_NAME} - Account Details</title>
      </Head>
      <div className="flex flex-col gap-[10px] pb-[30px] pt-[30px]">
        <Container>
          <div className="flex items-start justify-between rounded-[4px] border border-tm-black-20 bg-tm-white px-[190px] py-[30px]">
            <div className="flex flex-col gap-[20px]">
              <h1 className="text-[20px] font-bold leading-[1.2em] tracking-normal text-tm-black-80">
                Account details
              </h1>
              <div className="pl-[10px]">
                <UserInfo userProfileInfo={userProfileInfo} />
              </div>
            </div>
            <div className="flex items-center gap-[10px]">
              <div className="w-auto">
                <Button onClick={logout}>
                  <div className="flex items-center gap-[6px]">
                    <p className="text-[13px] font-bold leading-[1.2em]">Sign out</p>
                    <PowerSettingsNewIcon className="!h-[20px] !w-[20px]" />
                  </div>
                </Button>
              </div>
              {isAdmin && (
                <div className="w-auto">
                  <Link href="/admin">
                    <Button>
                      <div className="flex items-center gap-[6px]">
                        <p className="text-[13px] font-bold leading-[1.2em]">Admin Dashboard</p>
                        <AdminPanelSettingsIcon className="!h-[20px] !w-[20px]" />
                      </div>
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Container>
        <Container>
          <div className="flex flex-col  gap-[20px] rounded-[4px] border border-tm-black-20 bg-tm-white px-[190px] py-[30px]">
            <h1 className="text-[20px] font-bold leading-[1.2em] tracking-normal text-tm-black-80">Notifications</h1>
            <div className="pl-[10px]">
              <Notifications userProfileInfo={userProfileInfo} refetch={refetch} />
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default AccountDetails;
