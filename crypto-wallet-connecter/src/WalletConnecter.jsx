import React, { useState } from 'react';
import { ethers } from 'ethers';

function WalletConnector() {
    const [balance, setBalance] = useState(null);
    const [address, setAddress] = useState(null);
    const [chain, setChain] = useState('ethereum');
    const [errorMessage, setErrorMessage] = useState('');

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await provider.send('eth_requestAccounts', []);
                const account = accounts[0];
                setAddress(account);

                const balance = await provider.getBalance(account);
                setBalance(ethers.formatEther(balance));
                setErrorMessage('');
            } catch (error) {
                if (error.code === -32002) {
                    setErrorMessage('A request is already pending. Please check MetaMask and try again.');
                } else {
                    console.error("Error connecting to wallet:", error);
                    setErrorMessage(`Failed to connect to the wallet. Error: ${error.message}`);
                }
            }
        } else {
            setErrorMessage('MetaMask is not installed. Please install MetaMask to continue.');
        }
    };

    const handleChainChange = (e) => {
        setChain(e.target.value);
    };

    return (
        <div className="wallet-connector p-6 max-w-sm mx-auto bg-gradient-to-br from-blue-500 to-indigo-700 rounded-xl shadow-lg text-white space-y-6">
            <h2 className="text-2xl font-bold flex items-center justify-center">
                <svg className="h-8 w-8 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.5 5.5a7.5 7.5 0 0110.92 0l.16.16A7.5 7.5 0 0120.5 12a7.5 7.5 0 01-7.5 7.5A7.5 7.5 0 015.5 12a7.5 7.5 0 010-10.5z" />
                </svg>
                Connect Your Wallet
            </h2>
            <div className="flex items-center justify-between bg-white rounded-md p-2 text-gray-700">
                <select onChange={handleChainChange} value={chain} className="block w-full px-3 py-2 border-none rounded-md focus:outline-none">
                    <option value="ethereum">Ethereum</option>
                    <option value="solana">Solana</option>
                    {/* Add more chains here */}
                </select>
                <svg className="ml-2 h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {chain === 'ethereum' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                    )}
                </svg>
            </div>
            <button onClick={connectWallet} className="w-full py-3 px-6 bg-green-500 rounded-md text-white font-semibold hover:bg-green-600 transition-colors flex items-center justify-center">
                <svg className="inline h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v9l6 3" />
                </svg>
                Connect Wallet
            </button>
            {errorMessage && (
                <div className="mt-4 bg-red-100 text-red-800 p-3 rounded-md flex items-center">
                    <svg className="mr-2 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01m-6.364-4.636a9 9 0 0112.728 0M5.636 12a9 9 0 0012.728 0" />
                    </svg>
                    {errorMessage}
                </div>
            )}
            {address && !errorMessage && (
                <div className="mt-4 bg-gray-800 p-4 rounded-md">
                    <p className="text-lg font-semibold mb-2"><strong>Address:</strong></p>
                    <p className="text-sm break-all">{address}</p>
                    {balance && (
                        <p className="text-lg font-semibold mt-2">
                            <strong>Balance:</strong> {balance} {chain === 'ethereum' ? 'ETH' : 'SOL'}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default WalletConnector;
