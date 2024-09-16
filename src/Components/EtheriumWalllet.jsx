import React, { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";
import axios from "axios";
import { WalletButton } from "./WalletButton";

export const EthWallet = ({ mnemonic }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [balances, setBalances] = useState({}); // Store balances in an object

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

  const ShowBalance = async (address) => {
    const data = {
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getBalance",
      params: [address, "latest"]
    };
    try {
      const response = await axios.post(
        "https://eth-mainnet.g.alchemy.com/v2/D8zUpQeoifRTBIZ7DrY6ZbXCDLmxMjZC",
        data
      );
      const balanceInWei = response.data.result;
      const balanceInEth = parseFloat(balanceInWei) / 1e18; // Convert balance from Wei to ETH
      setBalances({ ...balances, [address]: balanceInEth }); // Update balance state
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
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
                <button
                  onClick={() => ShowBalance(address)} // Correct onClick handling
                  className="text-green-700 font-semibold py-0 px-0 bg-transparent"
                >
                  Show Balance
                </button>
               
                {balances[address] !== undefined && (
                  <div className="mt-0 font-bold text-blue-700">
                    Balance: {balances[address]} ETH
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
