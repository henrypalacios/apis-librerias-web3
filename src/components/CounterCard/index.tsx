import React from 'react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { ConnectionStatus } from '../ui/ConnectionStatus'

interface CounterCardProps {
  isConnected: boolean
  account: string | null
  counterValue: number | null | undefined
  isLoading: boolean
  onConnect: () => void
  onDisconnect: () => void
  onIncrement: () => void
  onDecrement: () => void
  onReset: () => void
}

export default function CounterCard({
  isConnected,
  account,
  counterValue,
  isLoading,
  onConnect,
  onDisconnect,
  onIncrement,
  onDecrement,
  onReset
}: CounterCardProps) {
  return (
    <Card>
      <p className="text-sm text-gray-600 mb-4">Interactúa con el Contrato Inteligente del Contador</p>
      <ConnectionStatus isConnected={isConnected} />
      <div className="flex justify-center mb-4">
        <Button onClick={account ? onDisconnect : onConnect}>
          {account ? 'Desconectar Wallet' : 'Conectar Wallet'}
        </Button>
      </div>
      {account && (
        <>
          <p className="text-sm text-gray-500 mb-2">Cuenta conectada: {account}</p>
          <p className="text-2xl font-bold text-center mb-4">
            Valor del contador: {
              counterValue !== null 
                ? counterValue 
                : 'Error al cargar el valor'
            }
          </p>
        </>
      )}
      <div className="flex justify-center space-x-2">
        <Button onClick={onIncrement} disabled={isLoading || !account}>
          ➕
        </Button>
        <Button onClick={onDecrement} disabled={isLoading || !account}>
          ➖
        </Button>
        <Button onClick={onReset} disabled={isLoading || !account}>
          🔄
        </Button>
      </div>
    </Card>
  )
}