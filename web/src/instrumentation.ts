import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config');

    // Log all NEXT_PUBLIC_ environment variables to CloudWatch
    console.log('========================================');
    console.log('🌐 NEXT_PUBLIC Environment Variables (Server-side):');
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
      if (value) {
        // Mask sensitive values
        const displayValue = value;
        console.log(`${key}: ${displayValue}`);
      } else {
        console.log(`${key}: (not set)`);
      }
    });
    console.log('========================================');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;
