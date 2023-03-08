import React from 'react';
import logo from './logo.svg';
import './App.css';
import { WagmiConfig, configureChains, createClient } from 'wagmi'

import { getDefaultProvider } from 'ethers'
import { publicProvider } from 'wagmi/providers/public'
import { Connect } from './components/Connect';
import { Investment } from './pages/Investment';
import { bscTestnet } from 'wagmi/chains';

const { chains, provider } = configureChains(
  [bscTestnet],
  [publicProvider()],
)

const client = createClient({
  autoConnect: true,
  provider,
})
 
function App() {
  return (
    <WagmiConfig client={client}>
      <Connect />
      <Investment />
    </WagmiConfig>
  );
}

export default App;
