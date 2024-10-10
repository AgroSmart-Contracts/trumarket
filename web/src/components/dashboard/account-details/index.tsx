import { useQuery } from "@tanstack/react-query";
import React from "react";

import Loading from "src/components/common/loading";
import { AuthService } from "src/controller/AuthAPI.service";
import { UserProfileInfo } from "src/interfaces/auth";
import { useUserInfo } from "src/lib/hooks/useUserInfo";

interface UserInfoProps {
  userProfileInfo?: UserProfileInfo;
}

const UserInfo: React.FC<UserInfoProps> = ({ userProfileInfo }) => {
  const userDetails = [
    {
      label: "Account Type",
      value: `${userProfileInfo?.accountType}`,
    },
    {
      label: "E-mail address",
      value: `${userProfileInfo?.email}`,
    },
    {
      label: "Web3 wallet address",
      value: `${userProfileInfo?.walletAddress}`,
    },
  ];

  return (
    <div className="w-full max-w-[400px]">
      <div className="flex flex-col gap-[10px]">
        {userDetails.map((detail, i) => (
          <div key={i} className="flex items-center justify-between text-[13px] leading-[1.2em]">
            <p className="w-[40%]  flex-shrink-0  font-normal text-tm-black-80">{detail.label}:</p>
            <p className="flex-1 font-bold  text-tm-black-80">{detail.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserInfo;
