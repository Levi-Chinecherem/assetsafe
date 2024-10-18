# AssetSafe

AssetSafe is a decentralized application (dApp) that automates the process of asset approval and transfer on the Ethereum blockchain. It allows users to batch transfer ERC-20 tokens and NFTs from their wallet to a specified smart contract address, without needing to manually approve each transaction. This streamlines asset management by allowing users to transfer multiple assets in one go.

## Table of Contents

- [AssetSafe](#assetsafe)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Usage](#usage)
  - [Project Structure](#project-structure)
  - [Security Considerations](#security-considerations)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- **Automatic ERC-20 Approval:** Automatically approves ERC-20 token transfers to a specified contract without manual intervention.
- **Batch Transfer:** Transfer multiple ERC-20 tokens and NFTs in a single transaction.
- **Wallet Integration:** Connects to MetaMask for seamless user authentication and transaction signing.
- **Gas Optimization:** Approves and transfers assets with optimized gas usage.
- **Real-time Status:** Provides live updates on the asset transfer and approval process.

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js (if applicable)
- **Blockchain:** Ethereum (Smart contract interaction)
- **Libraries:** 
  - `ethers.js` for blockchain interaction
  - `axios` for making API requests
  - `Tailwind CSS` for styling

## Prerequisites

Before running AssetSafe, ensure you have the following:

1. **Node.js and npm:** [Install Node.js](https://nodejs.org/) if you haven’t already.
2. **MetaMask:** [Install MetaMask](https://metamask.io/) browser extension.
3. **Infura Account:** Sign up for an Infura account and get a project ID for connecting to the Ethereum network.
4. **Etherscan API Key:** Obtain an API key from [Etherscan](https://etherscan.io/apis) for querying token balances.

## Installation

To install AssetSafe, follow these steps:

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/Levi-Chinecherem/AssetSafe.git
    cd AssetSafe
    ```

2. **Install Dependencies:**
    ```bash
    npm install
    ```

## Configuration

1. **Create a `.env` File:**
   Create a `.env` file in the root directory and configure the following environment variables:

   ```plaintext
   REACT_APP_INFURA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
   REACT_APP_ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
   REACT_APP_CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS
   REACT_APP_PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY
   ```

   - **`REACT_APP_INFURA_URL`**: Your Infura project URL (replace `YOUR_INFURA_PROJECT_ID` with your Infura project ID).
   - **`REACT_APP_ETHERSCAN_API_KEY`**: Your Etherscan API key for fetching token data.
   - **`REACT_APP_CONTRACT_ADDRESS`**: The address of the smart contract to interact with.
   - **`REACT_APP_PRIVATE_KEY`**: The private key of the wallet for automated transaction signing (ensure this is managed securely).

## Usage

1. **Start the Development Server:**
   ```bash
   npm start
   ```

2. **Open the Application:**
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

3. **Connect Your Wallet:**
   - Click the **Connect Wallet** button.
   - Approve the connection request in MetaMask.

4. **Transfer Assets:**
   - Once connected, the system will automatically approve and transfer all eligible ERC-20 tokens and NFTs to the specified smart contract.

## Project Structure

```
AssetSafe/
├── public/                     # Public assets
├── src/
│   ├── components/
│   │   └── AssetTransfer.js    # Main component for asset transfer
│   ├── App.js                  # Root component
│   ├── index.js                # Application entry point
│   ├── styles/                 # Styling (Tailwind CSS)
│   └── utils/                  # Utility functions (e.g., API integrations)
├── .env                        # Environment variables (not included in Git)
├── package.json                # Project dependencies
└── README.md                   # Project documentation
```

## Security Considerations

- **Keep Your Private Key Secure:** Do not expose your private key in the source code. Ensure that it is managed securely through environment variables or other secure methods.
- **Avoid Hardcoding Sensitive Information:** Never hardcode sensitive information like private keys or Infura project secrets in the codebase.
- **Use a Test Network:** While developing, use a test network like Sepolia or Ropsten to avoid losing real funds.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
