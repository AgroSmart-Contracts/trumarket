import React, { useCallback, useEffect, useState } from "react";
import { Contract, ethers, formatEther, formatUnits, parseUnits } from "ethers";
import DealVaultAbi from "./DealVault.abi";
import { useWeb3AuthContext } from "src/context/web3-auth-context";
import { useUserInfo } from "src/lib/hooks/useUserInfo";
import ERC20Abi from "./ERC20.abi";
import { DealStatus } from "src/interfaces/shipment";
import { Card } from "@mui/material";
import { Info } from "@phosphor-icons/react";
import Deposit from "./Deposit";
import DealsManagerAbi from "./DealsManager.abi";

const dealsManagerAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as string as "0x";
const erc20Address = process.env.NEXT_PUBLIC_INVESTMENT_TOKEN_CONTRACT_ADDRESS as string as "0x";
const erc20Symbol = process.env.NEXT_PUBLIC_INVESTMENT_TOKEN_SYMBOL || "USDC";
const erc20Decimals = process.env.NEXT_PUBLIC_INVESTMENT_TOKEN_DECIMALS
  ? +process.env.NEXT_PUBLIC_INVESTMENT_TOKEN_DECIMALS
  : 18;

interface ShipmentFinanceProps {
  vaultAddress: string;
  requestFundAmount: number;
  currentMilestone: number;
  nftID?: number;
  handleComplete: () => Promise<void>;
  shipmentStatus: DealStatus;
  borrowerAddress: string;
  completing: boolean;
}

const truncateAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 30)}...${address.slice(-4)}`;
};

const ShipmentFinance: React.FC<ShipmentFinanceProps> = ({
  vaultAddress,
  requestFundAmount,
  currentMilestone,
  nftID,
  handleComplete,
  shipmentStatus,
  borrowerAddress,
  completing,
}) => {
  const { privateKeyProvider } = useWeb3AuthContext();
  const { userInfo } = useUserInfo();
  const [amountFunded, setAmountFunded] = useState<string>("0");
  const [balance, setBalance] = useState<string>("0");
  const [balanceEth, setBalanceEth] = useState<string>("0");
  const [vault, setVault] = useState<Contract | null>(null);
  const [erc20, setErc20] = useState<Contract | null>(null);
  const [repayFunds, setRepayFunds] = useState<number>(Math.floor(requestFundAmount * 1.1));

  useEffect(() => {
    if (!vaultAddress) return;

    const provider = new ethers.BrowserProvider(privateKeyProvider as any);

    setErc20(new ethers.Contract(erc20Address, ERC20Abi, provider));
    setVault(new ethers.Contract(vaultAddress, DealVaultAbi, provider));
  }, [vaultAddress]);

  useEffect(() => {
    setRepayFunds(Math.floor(requestFundAmount * 1.1));
  }, [requestFundAmount]);

  const fetchFinanceData = useCallback(async () => {
    if (!userInfo || !vault || !erc20) return;

    // TODO: as web3auth may not be initialized yet, we need to wait for it
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const amountFunded = await vault.totalAssets();
      const balance = await erc20.balanceOf(userInfo.user.walletAddress);

      const provider = new ethers.BrowserProvider(privateKeyProvider as any);

      const ethBalance = await provider.getBalance(userInfo.user.walletAddress);

      setAmountFunded(formatUnits(amountFunded, erc20Decimals));
      setBalance(formatUnits(balance, erc20Decimals));
      setBalanceEth(formatEther(ethBalance));
    } catch (error) {
      console.error("Error fetching finance data:", error);
    }
  }, [userInfo, vault, erc20]);

  useEffect(() => {
    fetchFinanceData();
  }, [userInfo, vault, erc20]);

  const handleDeposit = async (amount: number) => {
    if (!privateKeyProvider) return;

    const provider = new ethers.BrowserProvider(privateKeyProvider as any);
    const signer = await provider.getSigner();
    const signerErc20 = new ethers.Contract(erc20Address, ERC20Abi, signer);
    const dealsManager = new ethers.Contract(dealsManagerAddress, DealsManagerAbi, signer);

    // First approve the DealsManager to spend the tokens
    const approveTx = await signerErc20.approve(dealsManagerAddress, parseUnits("" + amount, erc20Decimals));
    await approveTx.wait();

    // Then call donateToDeal on the DealsManager
    const donateTx = await dealsManager.donateToDeal(nftID, parseUnits("" + amount, erc20Decimals));
    await donateTx.wait();

    fetchFinanceData();
  };

  const progressPercentage = (+amountFunded / +requestFundAmount) * 100;

  return (
    <Card className="bg-white  w-full p-6">
      <div className="mb-8 space-y-4 border-b pb-4">
        <div className="text-gray-600 flex items-center gap-2">
          <span className="text-sm">Total pool assets</span>
        </div>
        <div className="text-gray-900 text-3xl font-semibold">
          {erc20Symbol} {(+amountFunded).toFixed(2)}
        </div>
        {/* Progress bar */}
        <div>
          <div className="text-gray-600 mb-1 flex justify-between text-sm">
            <span>{progressPercentage.toFixed(1)}% filled</span>
            <span>
              Target: {erc20Symbol} {requestFundAmount.toFixed(2)}
            </span>
          </div>
          <div className="bg-gray-200 h-2 w-full overflow-hidden rounded-full">
            <div
              className="h-full rounded-full bg-[#2D3E57] transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Vault Address */}
      <div className="bg-gray-50 mb-4 flex items-center justify-between rounded-lg p-3">
        <div className="flex items-center gap-2">
          <span className="text-gray-700 font-medium">Vault Address</span>
        </div>
        <a
          href={`${process.env.NEXT_PUBLIC_BLOCKCHAIN_EXPLORER}/token/${vaultAddress}`}
          target="_blank"
          rel="noreferrer"
          className="bg-gray-100 rounded px-3 py-1 font-mono text-sm"
        >
          {truncateAddress(vaultAddress)}
        </a>
      </div>

      {borrowerAddress &&
        userInfo &&
        userInfo.user &&
        userInfo.user.walletAddress &&
        borrowerAddress.toLowerCase() === userInfo.user.walletAddress.toLowerCase() && (
          <>
            {/* User Address */}
            <div className="bg-gray-50 mb-4 flex items-center justify-between rounded-lg p-3">
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">Borrower</span>
              </div>
              <a
                href={`${process.env.NEXT_PUBLIC_BLOCKCHAIN_EXPLORER}/address/${userInfo.user.walletAddress}`}
                target="_blank"
                rel="noreferrer"
                className="bg-gray-100 rounded px-3 py-1 font-mono text-sm"
              >
                {truncateAddress(userInfo.user.walletAddress)}
              </a>
            </div>

            {/* Balance */}
            <div className="bg-gray-50 mb-4 flex items-center justify-between rounded-lg p-3">
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">Borrower Balance</span>
              </div>
              <span className="text-blue-600 font-mono font-medium">
                {balance} {erc20Symbol}
              </span>
            </div>

            {shipmentStatus === DealStatus.Finished && vault !== null && (
              <div className="bg-tm-green-light">
                <div className="bg-blue-100 border-blue-500 text-blue-700 mb-4 border-l-4 p-4" role="alert">
                  <Info size={16} />
                  {+amountFunded < repayFunds && (
                    <p>
                      Shipment is completed. You can repay the funds. {repayFunds.toFixed(2)} {erc20Symbol} should be
                      deposited in the pool before the shipment is completed.
                    </p>
                  )}
                  {+amountFunded >= repayFunds && (
                    <p>
                      Shipment is completed. The required funds have been successfully repaid. Click
                      &quot;Complete&quot; to unlock the funds to be reclaimed by the investors.
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {currentMilestone === 7 && +amountFunded < repayFunds && (
                    <Deposit
                      walletBalance={+balance}
                      walletBalanceEth={+balanceEth}
                      poolCapacity={repayFunds}
                      deposit={handleDeposit}
                    />
                  )}

                  {currentMilestone === 7 && +amountFunded >= repayFunds && (
                    <div className="flex w-full justify-center">
                      <button
                        disabled={completing}
                        onClick={handleComplete}
                        className="my-8 rounded bg-tm-green px-4 py-2 text-tm-white"
                      >
                        {completing ? "Processing..." : "Complete"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
    </Card>
  );
};

export default ShipmentFinance;
