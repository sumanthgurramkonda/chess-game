import React, { useState } from 'react';

import './App.css';
import { Entity } from './entities/Entity';
import {Position} from './entities/Position'
import { Color } from './entities/Color';
import { Game } from './game/Game';

function App() {

  const [game] = useState<Game>(new Game());
  const board = game.getBoard();
  const grid: (Entity|null)[][] = board.getGrid();
  const [moves, setMoves] = React.useState<boolean[][]>(Array(8).fill(null).map(() => Array(8).fill(false)));
  const [currentEntity, setCurrentEntity] = React.useState<Entity | null>(null);
  const [isWhiteTurn, setIsWhiteTurn] = React.useState<boolean>(true);
  // const [isCheckMate,setIsCheckMate] = useState(false);
  const lastMovePos= game.getLastMovePos();

  function resetMoves(){
    setCurrentEntity(null);
    setMoves(Array(8).fill(null).map(() => Array(8).fill(false)));
  }

  const onEntityClick = (rowIndex: number, colIndex: number) => {
      const entity = board.getBoardEntity(rowIndex, colIndex);

      // move entity to the new position
      if(currentEntity && moves[rowIndex][colIndex]){
          game.moveEntity(currentEntity.getRowIndex(), currentEntity.getColumnIndex(), rowIndex, colIndex);
          resetMoves();
          setIsWhiteTurn(game.nextTurn());
          return;
      }
      // validates enity turn is valid (if previously selected entity is white, present should be black or vice versa)
      if(entity !== null && entity.getColor() !== (isWhiteTurn ? Color.WHITE : Color.BLACK)){
        resetMoves();
        return;
      }
      const positions:Position[] = game.getMoves(rowIndex, colIndex);
      if(positions.length === 0){
        resetMoves();
        return;
      }
      setCurrentEntity(entity);
      const movesMap = Array(8).fill(null).map(() => Array(8).fill(false));
      positions.forEach(p=>{
        movesMap[p.getRowIndex()][p.getColumnIndex()] = true;
      })
      setMoves(movesMap);
      console.log("Is checkmate : ",game.isCheckMate());
      console.log("Is draw : ",game.isDraw());
  }
  
  return (
    <div className="App">
      {game.isCheckMate() ? <div>{isWhiteTurn ? "WHITE WIN" : "BLACK WIN"}</div> :
        grid.map((row,colIndex)=>
          <div key={colIndex} className='row'>
            {
              row.map((entity, entIndex)=>
                <span key={entIndex} 
                      className='cell' 
                      onClick={() => onEntityClick(colIndex, entIndex)}
                      style={
                      
                        {backgroundColor: (lastMovePos[0][0] === colIndex && lastMovePos[0][1] === entIndex) || 
                                          (lastMovePos[1][0] === colIndex && lastMovePos[1][1] === entIndex)
                                         ? 'yellow' : (colIndex+entIndex) % 2 === 0 ? 'lightgray' : 'gray',
                          opacity : (lastMovePos[0][0] === colIndex && lastMovePos[0][1] === entIndex) || 
                                          (lastMovePos[1][0] === colIndex && lastMovePos[1][1] === entIndex)
                                         ? 0.7 : 1,
                          boxShadow : (lastMovePos[0][0] === colIndex && lastMovePos[0][1] === entIndex) || 
                                          (lastMovePos[1][0] === colIndex && lastMovePos[1][1] === entIndex) ? '0 0 10px yellow' : 'none'
                        }
                        }>
                      {
                        entity!==null ?  
                              (<img src={
                                ((entity.getColor()===Color.WHITE) ? 
                                    require(`..//assets/images/${entity.getName().toLocaleLowerCase()}-white.avif`) : 
                                    require(`..//assets/images/${entity.getName().toLocaleLowerCase()}-black.avif`) ) 
                                } alt={entity ? entity.getName() : ""} 
                                style={
                                       {border: moves && moves[colIndex][entIndex] ? '5px solid red' : '2px solid transparent',
                                        opacity: moves && moves[colIndex][entIndex] ? 0.5 : 1,
                                        boxShadow : moves && moves[colIndex][entIndex] ? '0 0 10px red' : 'none'
                                       }
                                      }
                                 /> )
                              : <span className={moves && moves[colIndex][entIndex] ? 'move' : ''}></span>
                      }
                  {/* {entity ? entity.getName() : " "} */}
                </span>
              )
            }
          </div>
        )
    }
    </div>
  );
}
   
export default App;
