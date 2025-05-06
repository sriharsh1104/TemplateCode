'use client'

import { createAppKit } from '@reown/appkit/react';
import { useAppKit } from '@reown/appkit/react';
import { mainnet } from '@reown/appkit/networks';
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5';

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
  networks: [mainnet],
  projectId,
  metadata,
  features: {
    analytics: true
  }
});

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

export default function App() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <ConnectButton />
    </div>
  );
} 