import React from 'react';
import { Button } from './ui/Button';

interface Props {
    toggle: () => void; 
    polkadot: boolean
}

export function ToggleLibrary({toggle, polkadot}:Props ) {
  return (
    <div className="flex justify-center mt-4">
    {Array(10).fill(null).map((_, index) => <br key={index} />)}
    <Button onClick={toggle}>
      {polkadot ? '🦑' : '🔌' } {polkadot ? null: 'Cambiar a PolkadotJS'}
    </Button>
  </div>
  );
};

    