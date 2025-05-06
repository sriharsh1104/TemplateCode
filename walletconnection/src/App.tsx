'use client'

import { createAppKit } from '@reown/appkit/react';
import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { baseSepolia, mainnet, sepolia } from '@reown/appkit/networks';
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5';
import { Contract } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import type { ExternalProvider } from '@ethersproject/providers';

// Get projectId from Reown Cloud Dashboard
const projectId = 'b37a5ca4927d4d41bc38b9af9fda1dde'; // Replace with your actual project ID from https://cloud.reown.com

// Create metadata object
const metadata = {
  name: 'Reown Wallet Demo',
  description: 'Demo app for Reown wallet connection',
  url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
};

// Create Ethers adapter
const ethersAdapter = new Ethers5Adapter();

// Initialize AppKit outside component render cycle
createAppKit({
  adapters: [ethersAdapter],
  networks: [baseSepolia],
  projectId,
  metadata,
  features: {
    analytics: true
  }
});

// Contract details
// const CONTRACT_ADDRESS = '0x851927cF85C50bD9A02b5E148273a98b20aeD2f8'; // sepolia
const CONTRACT_ADDRESS = '0x503c08A37fF5Ab51Da984668E8C8B14539aB1Fa2'; //base-sepolia

// Replace this with your actual ABI when you have it
const CONTRACT_ABI = 
[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]
;

function ConnectButton() {
  const { open } = useAppKit();

  return (
    <button 
      onClick={() => open()}
      style={{
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        // ':hover': {
        //   backgroundColor: '#45a049'
        // }
      }}
    >
      Connect Wallet
    </button>
  );
}

function MintButton() {
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('eip155');

  const mintWithReown = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first.');
      return;
    }
    if (!CONTRACT_ABI.length) {
      alert('ABI not set!');
      return;
    }
    try {
      const ethersProvider = new Web3Provider(walletProvider as ExternalProvider);
      const signer = await ethersProvider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // TODO: Replace these arguments with your actual mint function parameters
      // Example: await contract.mint(address, 1);
      await contract.mint("0x8FDEb992CD3323d5Db5b2f80769A0C575cE32D1a",10000);

      alert('Mint transaction sent!');
    } catch (err) {
      alert('Mint failed: ' + (err as Error).message);
    }
  };

  return (
    <button
      onClick={mintWithReown}
      style={{
        marginTop: 20,
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      Mint
    </button>
  );
}

export default function App() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column', // Stack vertically
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#f5f5f5',
      }}
    >
      <ConnectButton />
      <MintButton />
    </div>
  );
} 