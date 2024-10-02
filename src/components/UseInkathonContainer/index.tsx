import { Abi } from '@polkadot/api-contract';
import React from 'react';
import { ConnectionSettings } from './ConnectionSettings';
import {
  alephzeroTestnet,
  UseInkathonProvider,
} from '@scio-labs/use-inkathon'

interface Props {
  contractAddress: string; 
  abi: Abi; 
  rpcUrl: string
}

export function UseInkathonContainer({contractAddress, abi, rpcUrl}: Props) {

  return (
    <UseInkathonProvider
        appName="React Example dApp"
        defaultChain={alephzeroTestnet}
        connectOnInit={false}
      >
      <ConnectionSettings />
    </UseInkathonProvider>
  );
}