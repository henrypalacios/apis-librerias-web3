import React from 'react'

interface CardProps {
  children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      {children}
    </div>
  )
}