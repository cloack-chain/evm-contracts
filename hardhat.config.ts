import '@nomicfoundation/hardhat-foundry';
import '@nomicfoundation/hardhat-toolbox';
import { config as dotEnvConfig } from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import { NetworksUserConfig } from 'hardhat/types';
import "./tasks/deploy-cloackchain"
import "./tasks/verify-cloackchain"
import "./tasks/deploy-cloackchain-semaphore"
import "./tasks/verify-cloackchain-semaphore"

dotEnvConfig();

function getNetworks(): NetworksUserConfig {
  if (!process.env.BACKEND_PRIVATE_KEY) {
    return {};
  }

  const infuraApiKey = process.env.INFURA_API_KEY;
  const accounts = [`0x${process.env.BACKEND_PRIVATE_KEY}`];

  return {
    local: {
      url: 'http://localhost:8545',
      chainId: 1337,
      accounts,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${infuraApiKey}`,
      chainId: 5,
      accounts,
    },
  };
}

const hardhatConfig: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.23',
      },
      {
        version: '0.8.19',
      },
      {
        version: '0.8.4',
      },
    ],
  },
  networks: {
    hardhat: {
      chainId: 1337,
      allowUnlimitedContractSize: true,
    },
    ...getNetworks(),
  },
  // dependencyCompiler: {
  //   paths: [
  //       "node_modules/@semaphore-protocol/contracts/base/Pairing.sol",
  //       "node_modules/@semaphore-protocol/contracts/base/SemaphoreVerifier.sol",
  //   ]
  // },
  gasReporter: {
    currency: 'USD',
    enabled: process.env.REPORT_GAS === 'true',
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  typechain: {
    target: 'ethers-v6',
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default hardhatConfig;
