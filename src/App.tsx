import { useRef } from 'react';

import './App.css';
import { Game } from './game/Game';
import BoardUI from './BoardUI'


function App() {

  const game = useRef<Game>(new Game(true));

  return (
    <>
        <div className="App" >
            <BoardUI game={game.current}/>
        </div>
    </>
  );
}
   
export default App;
