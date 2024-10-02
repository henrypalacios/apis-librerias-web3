'use client'

import React, { useState, useEffect } from 'react'
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { ContractPromise, Abi } from '@polkadot/api-contract'
import metadata from '../../../contracts/ink/counter/target/ink/counter.json'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { ConnectionStatus } from '../ui/ConnectionStatus'
import { MAX_CALL_WEIGHT, PROOFSIZE, WeightV2 } from '../../constants'
import { formatBalance } from '@polkadot/util'

const CONTRACT_ADDRESS = '5Df5ephQ8XS398Yy87YcUne4PpXcSJZV9PByZ2238iaiuw6R'
const CONTRACT_ABI = new Abi(metadata)
const WS_PROVIDER = import.meta.env.VITE_WS_PROVIDER || 'wss://localhost:9944'

export default function CounterCard() {
  const [api, setApi] = useState<ApiPromise | null>(null)
  const [contract, setContract] = useState<ContractPromise | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [counterValue, setCounterValue] = useState<number | null>()
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    setupConnection()
    return () => {
      // Limpiar la suscripción cuando el componente se desmonte
      if (api) {
        api.disconnect()
      }
    }
  }, [])

  const setupConnection = async () => {
    try {
      const wsProvider = new WsProvider(WS_PROVIDER)
      const api = await ApiPromise.create({ provider: wsProvider })
      setApi(api)

      console.log('Conectado al proveedor:', WS_PROVIDER)

      // Verificar la existencia del contrato
      const contractInfo = await api.query.contracts.contractInfoOf(CONTRACT_ADDRESS)
      if (contractInfo.isEmpty) {
        console.error('El contrato no existe en la dirección especificada')
        return
      }
      console.log('Contrato encontrado en la dirección especificada')

      const contract = new ContractPromise(api, CONTRACT_ABI, CONTRACT_ADDRESS)
      setContract(contract)
      setIsConnected(true)

    } catch (error) {
      console.error('Error al configurar la conexión:', error)
      setIsConnected(false)
    }
  }


  const connectWallet = async () => {
    await web3Enable('Counter DApp')
    const accounts = await web3Accounts()
    if (accounts.length > 0) {
      setAccount(accounts[0].address)
      await updateCounterValue()
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
  }

  const updateCounterValue = async () => {
    if (contract && api && account) {
      try {
        setIsLoading(true)
        const { result, output } = await contract.query.get('', 
          {
            gasLimit: api.registry.createType('WeightV2', {
              refTime: MAX_CALL_WEIGHT, proofSize: PROOFSIZE
            }), 
            storageDepositLimit: null,
          }
        ).finally(() => setIsLoading(false))
        
        if (result.isOk) {
          if (output) {
            const humanOutput = output?.toHuman();
            if (typeof humanOutput === 'object' && 'Ok' in humanOutput) {
              const value = humanOutput.Ok;
              setCounterValue(value);
              console.log('Valor del contador:', value);
            } else {
              console.error('El output no tiene la estructura esperada');
              setCounterValue(null);
            }
          } else {
            console.error('El output es nulo');
            setCounterValue(null)
          }
        } else {
          const error = result.asErr
          if (error.isModule) {
            const decoded = api.registry.findMetaError(error.asModule)
            console.error('Error de módulo:', decoded.name, decoded.docs)
          } else {
            console.error('Error en la consulta:', error.toHuman())
          }
          setCounterValue(null)
        }
      } catch (error) {
        console.error('Error al actualizar el valor del contador:', error)
        setCounterValue(null)
      }
    }
  }

  const executeContractMethod = async (method: 'inc' | 'dec' | 'reset') => {
    if (contract && api && account) {
      setIsLoading(true)
      try {
        const injector = await web3FromAddress(account)
        const {gasRequired} = await contract.query[method](account,
          {
            gasLimit: api.registry.createType('WeightV2', {
              refTime: MAX_CALL_WEIGHT, proofSize: PROOFSIZE
            }), 
            storageDepositLimit: null,
          }
        )
        await contract.tx[method]({
          gasLimit: api?.registry.createType('WeightV2', gasRequired),
          storageDepositLimit: null
        }).signAndSend(account, { signer: injector.signer }, (result) => {
          if (result.status.isInBlock) {
            console.log('Transaction included in block')
            updateCounterValue()
          } else if (result.status.isFinalized) {
            console.log('Transaction finalized')
            setIsLoading(false)
          }
        })
      } catch (error) {
        console.error(`Error executing ${method}:`, error)
        setIsLoading(false)
      }
    }
  }

  const checkContractBalance = async () => {
    if (api) {
      try {
        const balance = await api.query.system.account(CONTRACT_ADDRESS)
        // Configurar el formato de Balance
        formatBalance.setDefaults({
          unit: 'TZERO',
          decimals: 12
        })

        const formattedBalance = formatBalance(balance.data.free, 
          {withUnit: true, forceUnit: '-'})
        console.log('Saldo del contrato:', formattedBalance)
      } catch (error) {
        console.error('Error al verificar el saldo del contrato:', error)
      }
    }
  }

  useEffect(() => {
    setupConnection().then(() => {
      if (api) {
        checkContractBalance()
        updateCounterValue()
      }
    })
  }, [account])

  return (
    <Card>
      <p className="text-sm text-gray-600 mb-4">Interact with the Counter Smart Contract</p>
      <ConnectionStatus isConnected={isConnected} />
      <div className="flex justify-center mb-4">
        <Button onClick={account ? disconnectWallet : connectWallet}>
          {account ? 'Disconnect Wallet' : 'Connect Wallet'}
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
        <Button onClick={() => executeContractMethod('inc')} disabled={isLoading || !account}>
          ➕
        </Button>
        <Button onClick={() => executeContractMethod('dec')} disabled={isLoading || !account}>
          ➖
        </Button>
        <Button onClick={() => executeContractMethod('reset')} disabled={isLoading || !account}>
          🔄
        </Button>
      </div>
    </Card>
  )
}