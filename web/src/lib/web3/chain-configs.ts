import { CHAIN_NAMESPACES } from "@web3auth/base";

export const chainConfigEth = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: process.env.NEXT_PUBLIC_BLOCKCHAIN_CHAIN_ID || "",
  rpcTarget: process.env.NEXT_PUBLIC_BLOCKCHAIN_RPC_URL || "",
  displayName: process.env.NEXT_PUBLIC_BLOCKCHAIN_NAME,
  blockExplorer: process.env.NEXT_PUBLIC_BLOCKCHAIN_EXPLORER,
  ticker: process.env.NEXT_PUBLIC_BLOCKCHAIN_TICKER,
  tickerName: process.env.NEXT_PUBLIC_BLOCKCHAIN_TICKER_NAME,
};

// Log chain configuration (only in development or when explicitly enabled)
if (typeof window !== "undefined" && (process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_LOG_CHAIN_CONFIG === "true")) {
  console.log("🔗 Chain Configuration in web:", {
    chainNamespace: chainConfigEth.chainNamespace,
    chainId: chainConfigEth.chainId || "(not set)",
    rpcTarget: chainConfigEth.rpcTarget ? `${chainConfigEth.rpcTarget.substring(0, 30)}...` : "(not set)",
    displayName: chainConfigEth.displayName || "(not set)",
    blockExplorer: chainConfigEth.blockExplorer || "(not set)",
    ticker: chainConfigEth.ticker || "(not set)",
    tickerName: chainConfigEth.tickerName || "(not set)",
  });
}
