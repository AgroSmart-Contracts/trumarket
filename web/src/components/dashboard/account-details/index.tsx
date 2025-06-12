import { ADAPTER_STATUS } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import React, { useCallback, useEffect, useState } from "react";

import Loading from "src/components/common/loading";
import { useWeb3AuthContext } from "src/context/web3-auth-context";
import { UserProfileInfo } from "src/interfaces/auth";

interface UserInfoProps {
  userProfileInfo?: UserProfileInfo;
}

const UserInfo: React.FC<UserInfoProps> = ({ userProfileInfo }) => {
  const { web3authPnPInstance } = useWeb3AuthContext();
  const [balance, setBalance] = useState<string>("");
  const [tokenBalance, setTokenBalance] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
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


  const fetchBalances = useCallback(async () => {
    try {
      setIsLoading(true);
      if (web3authPnPInstance.status !== ADAPTER_STATUS.READY && web3authPnPInstance.status !== ADAPTER_STATUS.CONNECTED) {
        return;
      }

      if (!web3authPnPInstance.provider) {
        return;
      }

      const provider = web3authPnPInstance.provider as EthereumPrivateKeyProvider;
      const accounts = await provider.request({ method: "eth_requestAccounts", params: [] });

      const balance = await provider.request({
        method: "eth_getBalance",
        params: [(accounts as string[])[0], "latest"]
      });
      const balanceInEth = parseInt(balance as string, 16) / Math.pow(10, 18);
      setBalance(balanceInEth.toFixed(6).toString());

      // Get ERC20 token balance
      const tokenAddress = process.env.NEXT_PUBLIC_INVESTMENT_TOKEN_CONTRACT_ADDRESS;
      if (tokenAddress) {
        const data = `0x70a08231000000000000000000000000${(accounts as string[])[0].slice(2)}`;
        console.log("Call data:", data);
        const result = await provider.request({
          method: "eth_call",
          params: [
            {
              to: tokenAddress,
              data: data,
            },
            "latest",
          ],
        });
        const tokenBalanceInWei = parseInt(result as string, 16);
        const tokenBalanceFormatted = (tokenBalanceInWei / Math.pow(10, 18)).toFixed(6);
        setTokenBalance(tokenBalanceFormatted);
      }
    } catch (error) {
      console.error("Error fetching balances:", error);
    } finally {
      setIsLoading(false);
    }
  }, [web3authPnPInstance.status, web3authPnPInstance.provider]);

  useEffect(() => {
    fetchBalances();
  }, [web3authPnPInstance.status, web3authPnPInstance.provider]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full max-w-[400px]">
      <div className="flex flex-col gap-[10px]">
        {userDetails.map((detail, i) => (
          <div key={i} className="flex items-center justify-between text-[13px] leading-[1.2em]">
            <p className="w-[40%]  flex-shrink-0  font-normal text-tm-black-80">{detail.label}:</p>
            <p className="flex-1 font-bold  text-tm-black-80">{detail.value}</p>
          </div>
        ))}
        {
          balance && (
            <div className="flex items-center justify-between text-[13px] leading-[1.2em]">
              <p className="w-[40%]  flex-shrink-0  font-normal text-tm-black-80">Balance:</p>
              <p className="flex-1 font-bold  text-tm-black-80">{balance} ETH</p>
            </div>
          )
        }
        {
          tokenBalance && (
            <div className="flex items-center justify-between text-[13px] leading-[1.2em]">
              <p className="w-[40%]  flex-shrink-0  font-normal text-tm-black-80">Token Balance:</p>
              <p className="flex-1 font-bold  text-tm-black-80">{tokenBalance} {process.env.NEXT_PUBLIC_INVESTMENT_TOKEN_SYMBOL || "TRU"}</p>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default UserInfo;
