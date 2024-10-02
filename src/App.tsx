import React, { useState } from 'react';
import PolkadotJsContainer from './components/PolkadotJsContainer';
import './styles.css';
import { Abi } from '@polkadot/api-contract';
import metadata from '../contracts/ink/counter/target/ink/counter.json'
import { UseInkathonContainer } from './components/UseInkathonContainer';
import { ToggleLibrary } from './components/ToggleLibrary';

const CONTRACT_ADDRESS = '5Df5ephQ8XS398Yy87YcUne4PpXcSJZV9PByZ2238iaiuw6R'
const CONTRACT_ABI = new Abi(metadata)
const WS_PROVIDER = import.meta.env.VITE_WS_PROVIDER || 'wss://localhost:9944'

function App() {
  const [polkadotJs, setPolkadotJs] = useState(true);

  const toggleContainer = () => {
    setPolkadotJs(!polkadotJs);
  };

  return (
      <div className="App">
        <h1 className="text-3xl font-bold text-center my-6">Counter DApp</h1>
        {polkadotJs ? 
          <PolkadotJsContainer contractAddress={CONTRACT_ADDRESS} abi={CONTRACT_ABI} rpcUrl={WS_PROVIDER} /> :
          <UseInkathonContainer contractAddress={CONTRACT_ADDRESS} abi={CONTRACT_ABI} rpcUrl={WS_PROVIDER}/>
        }

        <ToggleLibrary polkadot={polkadotJs} toggle={toggleContainer}/>
      </div>
  
  );
}

export default App;