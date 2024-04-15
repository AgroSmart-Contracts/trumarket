import { Account } from 'viem';

export type Accounts = {
  deployerAccount: Account;
  financialAccount: Account;
  dealsManagerAccount: Account;
  investorAccount: Account;
};
