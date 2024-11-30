import { AlchemyProvider, ethers } from 'ethers';
import { DealsManagerContract } from './contract';

require('dotenv').config();

async function main() {
  // Define provider and wallet
  const provider = new AlchemyProvider('sepolia', process.env.ALCHEMY_API_KEY);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || '', provider);

  // Create a ContractFactory
  const factory = new ethers.ContractFactory(
    DealsManagerContract.abi,
    DealsManagerContract.bytecode,
    wallet
  );

  // Deploy the contract
  const contract = await factory.deploy(
    wallet.address,
    '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0'
  );

  // Wait for the contract to be mined
  const deployedContract = await contract.waitForDeployment();

  console.log(
    'Contract deployed to address:',
    await deployedContract.getAddress()
  );
}

main().catch((error) => {
  console.error('Error deploying contract:', error);
  process.exit(1);
});
