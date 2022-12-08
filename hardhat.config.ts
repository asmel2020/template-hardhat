import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";

import "@nomicfoundation/hardhat-toolbox";
import "hardhat-abi-exporter";
import "hardhat-openzeppelin-defender";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import  "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-etherscan";

dotenv.config();

const config: HardhatUserConfig = {
  
  solidity:{
    version:"0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    mainnet: {
      url: process.env.MAINNET_RPC_URL || "",
      accounts:
        process.env.DEPLOYER_PRIVATE_KEY !== undefined
          ? [process.env.DEPLOYER_PRIVATE_KEY]
          : [],
    },
    goerli: {
      url: process.env.GOERLI_TESTNET_RPC_URL || "",
      accounts:
        process.env.DEPLOYER_PRIVATE_KEY !== undefined
          ? [process.env.DEPLOYER_PRIVATE_KEY]
          : [],
    },
    ropsten: {
      url: process.env.ROPSTEN_RPC_URL || "",
      accounts:
        process.env.DEPLOYER_PRIVATE_KEY !== undefined
          ? [process.env.DEPLOYER_PRIVATE_KEY]
          : [],
    },
    bsc: {
      url: process.env.BSC_RPC_URL || "",
      accounts:
        process.env.DEPLOYER_PRIVATE_KEY !== undefined
          ? [process.env.DEPLOYER_PRIVATE_KEY]
          : [],
    },
    bscTestnet: {
      url: process.env.BSC_TESTNET_RPC_URL || "",
      accounts:
        process.env.DEPLOYER_PRIVATE_KEY_TESTNET !== undefined
          ? [process.env.DEPLOYER_PRIVATE_KEY_TESTNET]
          : [],
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL || "",
      accounts:
        process.env.DEPLOYER_PRIVATE_KEY !== undefined
          ? [process.env.DEPLOYER_PRIVATE_KEY]
          : [],
    },
    polygonMumbai: {
      url: process.env.MUMBAI_RPC_URL || "",
      accounts:
        process.env.DEPLOYER_PRIVATE_KEY_TESTNET !== undefined
          ? [process.env.DEPLOYER_PRIVATE_KEY_TESTNET]
          : [],
    },
    avalanche: {
      url: process.env.AVALANCHE_RPC_URL || "",
      accounts:
        process.env.DEPLOYER_PRIVATE_KEY !== undefined
          ? [process.env.DEPLOYER_PRIVATE_KEY]
          : [],
    },
    avalancheTestnet: {
      url: process.env.AVALANCHE_TESTNET_RPC_URL || "",
      accounts:
        process.env.DEPLOYER_PRIVATE_KEY_TESTNET !== undefined
          ? [process.env.DEPLOYER_PRIVATE_KEY_TESTNET]
          : [],
    },
    
    Testnet: {
      url: process.env.TESTNET_RPC_URL || "",
      accounts:
        process.env.DEPLOYER_PRIVATE_KEY_TESTNET !== undefined
          ? [process.env.DEPLOYER_PRIVATE_KEY_TESTNET]
          : [],
    },
    /*localhost:{
      url:'http://127.0.0.1:7545',
      chainId:97,
      forking:{
        url:'http://127.0.0.1:7545',
        enabled:true,
      },
      mining:{
        auto:true,
        interval:3000,
      }
    },*/
    hardhat:{
      chainId:43113,//blockchain_1:80001,blockchain_2:43113,blockchain_3:97,blockchain_4:5,blockchain_5:420,
      mining:{
        auto:true,
        interval:3000,
      },
      
    }
  },
  etherscan: {
  apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      goerli: process.env.ETHERSCAN_API_KEY || "",
      bsc: process.env.BSCSCAN_API_KEY || "" ,
      bscTestnet:process.env.BSCSCAN_API_KEY || "" ,
      avalanche: process.env.AVALANCHE_API_KEY || "" ,
      avalancheTestnet: process.env.AVALANCHE_API_KEY || "" ,
      polygon: process.env.POLYGONSCAN_API_KEY || "" ,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || "" ,
    },
  },
  /*abiExporter: {
    path: './abis',
    runOnCompile: true,
    clear: true,
    flat: true,
    only: [],
    spacing: 2,
    //pretty: true,
    format: "json",
  },*/
  OpenzeppelinDefenderCredential: {
    apiKey: process.env.API_KEY || "",
    apiSecret:process.env.API_SECRET || "",
  },
  gasReporter: {
    enabled:false,
    coinmarketcap:"430f2a86-2588-49e2-be39-0bef66418ddc",
  }
};

export default config;
