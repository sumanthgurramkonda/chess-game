import React, { useState } from 'react';

import './App.css';
import { Game } from './game/Game';
import BoardUI from './BoardUI'


function App() {

  const [game] = useState<Game>(new Game(true));

  return (
    <>
        <div className="App" >
            <BoardUI game={game}/>
        </div>
    </>
  );
}
   
export default App;
