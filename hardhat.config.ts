import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const INFURA_ID = process.env.INFURA_ID;
const INFURA_MAINNET_URL = process.env.INFURA_MAINNET_URL;
const INFURA_SEPOLIA_URL = process.env.INFURA_SEPOLIA_URL;
const TESTNET_MNEMONIC = process.env.TESTNET_MNEMONIC;
let ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const accounts = {
    mnemonic: TESTNET_MNEMONIC,
    path: "m/44'/60'/0'/0",
    initialIndex: 0,
    count: 20,
};

if (!TESTNET_MNEMONIC) {
    // Generated with bip39
    accounts.mnemonic =
        "velvet deliver grief train result fortune travel voice over subject subject staff nominee bone name";
}

if (!ETHERSCAN_API_KEY) {
    ETHERSCAN_API_KEY = "";
}

const config: HardhatUserConfig = {
    networks: {
        local: {
            url: "http://localhost:8545",
        },
        hardhat: {
            allowUnlimitedContractSize: true,
        },
        mainnet: {
            url: `${INFURA_MAINNET_URL} + ${INFURA_ID}`,
            accounts: accounts,
            chainId: 1,
        },
        sepolia: {
            url: `${INFURA_SEPOLIA_URL} + ${INFURA_ID}`,
            accounts: accounts,
            chainId: 11155111,
        },
    },
    etherscan: {
        apiKey: {
            mainnet: ETHERSCAN_API_KEY,
            sepolia: ETHERSCAN_API_KEY,
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.27",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 1000000,
                    },
                    evmVersion: "cancun",
                },
            },
        ],
    },
    gasReporter: {
        enabled: false,
    },
};

export default config;
