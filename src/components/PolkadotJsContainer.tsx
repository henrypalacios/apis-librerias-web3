import React, { useState, useEffect } from 'react'
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { ContractPromise, Abi } from '@polkadot/api-contract'
import { MAX_CALL_WEIGHT, PROOFSIZE } from '../constants'
import CounterCard from './CounterCard'


export default function PolkadotJsContainer({contractAddress, abi, rpcUrl}: {contractAddress: string, abi: Abi, rpcUrl: string}) {
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
      const wsProvider = new WsProvider(rpcUrl)
      const api = await ApiPromise.create({ provider: wsProvider })
      setApi(api)

      console.log('Conectado al proveedor:', rpcUrl)

      // Verificar la existencia del contrato
      const contractInfo = await api.query.contracts.contractInfoOf(contractAddress)
      if (contractInfo.isEmpty) {
        console.error('El contrato no existe en la dirección especificada')
        return
      }
      console.log('Contrato encontrado en la dirección especificada')

      const contract = new ContractPromise(api, abi, contractAddress)
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
        const balance = await api.query.system.account(contractAddress)
        console.dir(balance, {depth: null})
        console.log('Saldo del contrato:', balance.data.free.toHuman())
      } catch (error) {
        console.error('Error al verificar el saldo del contrato:', error)
      }
    }
  }

  return (
    <CounterCard
      isConnected={isConnected}
      account={account}
      counterValue={counterValue}
      isLoading={isLoading}
      onConnect={connectWallet}
      onDisconnect={disconnectWallet}
      onIncrement={() => executeContractMethod('inc')}
      onDecrement={() => executeContractMethod('dec')}
      onReset={() => executeContractMethod('reset')}
    />
  )
}