import React, { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";

const WalletButton = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-300 ease-in-out"
  >
    {children}
  </button>
);

export function SolanaWallet({ mnemonic }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);

  const addWallet = async () => {
    const seed = await mnemonicToSeed(mnemonic);
    const path = `m/44'/501'/${currentIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret);
    setCurrentIndex(currentIndex + 1);
    setPublicKeys([...publicKeys, keypair.publicKey]);
  };

  return (
    <div className="bg-gray-800 shadow-md rounded-lg p-6 mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-blue-100">Solana Wallet</h3>
        <WalletButton onClick={addWallet}>Add Solana Wallet</WalletButton>
      </div>
      {publicKeys.length > 0 && (
        <div className="mt-4">
          <h4 className="text-lg font-medium text-blue-100 mb-2">Generated Public Keys:</h4>
          <ul className="space-y-2">
            {publicKeys.map((publicKey, index) => (
              <li
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-md p-3 text-sm font-mono break-all animate-fade-in"
              >
                <span className="text-purple-600 font-semibold">SOL - </span>
                {publicKey.toBase58()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
