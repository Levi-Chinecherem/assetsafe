// src/components/AssetList.js
import React from 'react';

const AssetList = ({ assets }) => {
    return (
        <div className="p-6 bg-gray-700 text-yellow-200 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4 border-b-2 border-yellow-500 pb-2">Assets in Contract</h2>
            {assets && assets.length > 0 ? (
                assets.map((asset, index) => (
                    <div key={index} className="mb-4 p-4 border border-yellow-500 rounded-md bg-gray-800">
                        <p className="mb-1"><strong>Type:</strong> {asset.type}</p>
                        <p className="mb-1"><strong>Contract Address:</strong> {asset.contractAddress}</p>
                        <p className="mb-1"><strong>Balance:</strong> {asset.balance}</p>
                        <p className="mb-1"><strong>Token IDs (for NFTs):</strong> {asset.tokenIds?.join(', ') || 'N/A'}</p>
                        <hr className="border-yellow-500 mt-2"/>
                    </div>
                ))
            ) : (
                <p className="text-yellow-300 italic">No assets found.</p>
            )}
        </div>
    );
};

export default AssetList;
