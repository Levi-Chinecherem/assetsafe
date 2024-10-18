// src/App.js
import React, { useState } from 'react';
import AssetList from './components/AssetList';
import Header from './components/Header';
import AssetTransfer from './components/AssetTransfer';

const App = () => {
    const [assets, setAssets] = useState([]);

    return (
        <div className="App min-h-screen bg-gray-900 text-yellow-200 font-serif">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <AssetTransfer setAssets={setAssets} />
                <AssetList assets={assets} />
            </main>
        </div>
    );
};

export default App;
