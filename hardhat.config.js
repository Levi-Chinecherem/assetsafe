require('@nomiclabs/hardhat-etherscan');
require("@nomiclabs/hardhat-ethers");
require("dotenv").config(); // Load environment variables from .env file

const { REACT_APP_INFURA_PROJECT_ID, REACT_APP_PRIVATE_KEY, REACT_APP_ETHERSCAN_API_KEY } = process.env; // Destructure the environment variables
S
module.exports = {
    solidity: "0.8.27", // or your preferred version
    networks: {
        sepolia: {
            url: `https://sepolia.infura.io/v3/${REACT_APP_INFURA_PROJECT_ID}`, // Use the Infura URL from .env
            accounts: [`0x${REACT_APP_PRIVATE_KEY}`] // Use the wallet's private key from .env
        }
    },
    etherscan: {
        apiKey: {
            sepolia: REACT_APP_ETHERSCAN_API_KEY
        }
    }
};
