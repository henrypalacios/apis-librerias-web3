import React from 'react'

interface ConnectionStatusProps {
  isConnected: boolean
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => {
  return (
    <div className={`p-4 mb-4 rounded-md ${isConnected ? 'bg-green-100' : 'bg-red-100'}`}>
      <div className="flex items-center">
        {isConnected ? '✅' : '❌'}
        <h2 className="font-semibold ml-2">
          {isConnected ? 'Connected to network' : 'Disconnected from network'}
        </h2>
      </div>
      <p className="text-sm mt-1">
        {isConnected ? "You are connected to the Substrate network." : "Please check your connection and try again."}
      </p>
    </div>
  )
}