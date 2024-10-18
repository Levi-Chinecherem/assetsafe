const hre = require("hardhat");

async function main() {
    const AssetTransferContract = await hre.ethers.getContractFactory("AssetTransferContract");
    const assetTransferContract = await AssetTransferContract.deploy();

    await assetTransferContract.deployed();

    console.log("AssetTransferContract deployed to:", assetTransferContract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
