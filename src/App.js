import React from 'react';
import './App.css';
import FabricControl from './features/image/FabricCtrl';
import NewObjects from './features/image/NewObjects';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <FabricControl />
          <NewObjects />
        </div>
      </header>
    </div>
  );
}

export default App;
