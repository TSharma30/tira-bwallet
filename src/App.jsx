import React, { useState, useEffect } from 'react';
import { generateMnemonic } from 'bip39';
import { SolanaWallet } from './Components/SolanaWallet';
import { EthWallet } from './Components/EtheriumWalllet'

const Notification = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in-up">
      {message}
    </div>
  );
};

const WalletButton = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-300 ease-in-out w-full sm:w-auto"
  >
    {children}
  </button>
);

export default function App() {
  const [mnemonic, setMnemonic] = useState("");
  const [notification, setNotification] = useState(null);
  const [showWallets, setShowWallets] = useState(false);

  const generateMnemonics = async () => {
    const result = await generateMnemonic();
    setMnemonic(result);
    setNotification("Seed phrase generated successfully!");
    setTimeout(() => setShowWallets(true), 500);
  };

  const addWallet = (type) => {
    setNotification(`${type} wallet added successfully!`);
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6 lg:p-8 flex flex-col">
      <div className="flex-grow">
        <div className="max-w-5xl mx-auto">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="lowercase">t</span>ira Wallet
            </h1>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">v1.0</span>
          </header>

          <div className="bg-gray-900 shadow-lg rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-blue-100">
                Generate e-Wallets for Your Crypto
              </h2>
              <WalletButton onClick={generateMnemonics}>
                Generate Seed Phrase
              </WalletButton>
            </div>

            {mnemonic && (
              <div className="mb-4 animate-fade-in">
                <label htmlFor="mnemonic" className="block text-sm font-medium text-blue-100 mb-2">
                  Generated Seed Phrase:
                </label>
                <div
                  id="mnemonic"
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 mb-10"
                  style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                >
                  {mnemonic}
                </div>
              </div>
            )}

            {showWallets && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                <SolanaWallet mnemonic={mnemonic} onAdd={() => addWallet("Solana")} />
                <EthWallet mnemonic={mnemonic} onAdd={() => addWallet("Ethereum")} />
              </div>
            )}
          </div>

          {notification && (
            <Notification message={notification} onClose={closeNotification} />
          )}
        </div>
      </div>

      <footer className="bg-black text-blue-100 text-center ">
        <p className="text-sm">&copy; {new Date().getFullYear()} Designed and developed by Tarun</p>
      </footer>

    </div>
  );
}
