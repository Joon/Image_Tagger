import React from 'react';
import './App.css';
import FabricControl from './features/image/FabricCtrl';
import ControlPanel from './features/image/ControlPanel';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>ImgTgr - Classify your ML training data here!</p>
        <div>
          <FabricControl />
          <ControlPanel />
        </div>      
        </header>
    </div>
  );
}

export default App;
