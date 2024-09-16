import React, { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import axios from "axios";
import nacl from "tweetnacl";
import { WalletButton } from "./WalletButton";



export function SolanaWallet({ mnemonic }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);
  const [balances, setBalances] = useState({}); // Store balances in an object

  // Function to add a new Solana wallet
  const addWallet = async () => {
    const seed = await mnemonicToSeed(mnemonic);
    const path = `m/44'/501'/${currentIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret);
    setCurrentIndex(currentIndex + 1);
    setPublicKeys([...publicKeys, keypair.publicKey.toBase58()]); // Save public key as string
  };

  // Function to fetch the balance of a Solana wallet
  const ShowBalance = async (publicKey) => {
    const data = {
      jsonrpc: "2.0",
      id: 1,
      method: "getBalance",
      params: [publicKey]
    };

    try {
      const response = await axios.post(
        "https://solana-mainnet.g.alchemy.com/v2/D8zUpQeoifRTBIZ7DrY6ZbXCDLmxMjZC",
        data
      );
      const balanceInLamports = response.data.result.value;
      const balanceInSol = balanceInLamports / 1e9; // Convert Lamports to SOL
      setBalances({ ...balances, [publicKey]: balanceInSol }); // Update balance state
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
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
                {publicKey}
                
                {/* Show Balance Button */}
                <button
                  onClick={() => ShowBalance(publicKey)}
                  className="text-pink-700 font-semibold py-0 px-0 bg-transparent"
                >
                  Show Balance
                </button>
                
                {/* Display Balance if available */}
                {balances[publicKey] !== undefined && (
                  <div className="mt-0 font-bold text-purple-700">
                    Balance: {balances[publicKey]} SOL
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
