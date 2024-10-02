import React from 'react';
import CounterCard from './components/CounterCard';
import './styles.css';

function App() {
  return (
      <div className="App">
        <h1 className="text-3xl font-bold text-center my-6">Counter DApp</h1>
          <CounterCard />
        </div>
  
  );
}

export default App;