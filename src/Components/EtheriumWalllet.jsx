import React, { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";

const WalletButton = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-300 ease-in-out"
  >
    {children}
  </button>
);

export const EthWallet = ({ mnemonic }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);

  const addWallet = async () => {
    const seed = await mnemonicToSeed(mnemonic);
    const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
    const hdNode = HDNodeWallet.fromSeed(seed);
    const child = hdNode.derivePath(derivationPath);
    const privateKey = child.privateKey;
    const wallet = new Wallet(privateKey);
    setCurrentIndex(currentIndex + 1);
    setAddresses([...addresses, wallet.address]);
  };

  return (
    <div className="bg-gray-800 shadow-md rounded-lg p-6 mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-blue-100">Ethereum Wallet</h3>
        <WalletButton onClick={addWallet}>Add Ethereum Wallet</WalletButton>
      </div>
      {addresses.length > 0 && (
        <div className="mt-4">
          <h4 className="text-lg font-medium text-blue-100 mb-2">Generated Public Keys:</h4>
          <ul className="space-y-2">
            {addresses.map((address, index) => (
              <li
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-md p-3 text-sm font-mono break-all animate-fade-in"
              >
                <span className="text-blue-600 font-semibold">ETH - </span>
                {address}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
