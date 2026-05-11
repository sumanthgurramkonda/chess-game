import React, { useEffect, useState } from 'react';

import './App.css';
import { Entity } from './entities/Entity';
import {Position} from './entities/Position'
import { Color } from './entities/Color';
import { Game } from './game/Game';
import { Type } from './entities/Type';
import { PromotionEntities } from './components/PromotionEntities';
import AIPlayer from './aiplayer/AIPlayer';

function App() {

  const [game] = useState<Game>(new Game());
  const [aiPlayer] = useState<any>(new AIPlayer());
  const board = game.getBoard();
  const grid: (Entity|null)[][] = board.getGrid();
  const [moves, setMoves] = React.useState<boolean[][]>(Array(8).fill(null).map(() => Array(8).fill(false)));
  const [currentEntity, setCurrentEntity] = React.useState<Entity | null>(null);
  const [isWhiteTurn, setIsWhiteTurn] = React.useState<boolean>(true);
  const [canPromotePawn, setCanPromotePawn] = React.useState<boolean>(false);
  const lastMovePos= game.getLastMovePos();

  function resetMoves(){
    setCurrentEntity(null);
    setMoves(Array(8).fill(null).map(() => Array(8).fill(false)));
  }

  // console.log(board.toJSON());

  const onEntityClick = (rowIndex: number, colIndex: number) => {
      const entity = board.getBoardEntity(rowIndex, colIndex);

      // move entity to the new position
      if(currentEntity && moves[rowIndex][colIndex]){
          game.moveEntity(currentEntity.getRowIndex(), currentEntity.getColumnIndex(), rowIndex, colIndex);
          setIsWhiteTurn(game.nextTurn());
          setCanPromotePawn(game.canPromotePawnFunc());
          resetMoves();
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
    
  }

  // useEffect(()=>{
  //   const makeAIMove = async () => {
  //     if(game && !isWhiteTurn && aiPlayer){
  //         await game.makeAIMove();
  //         setIsWhiteTurn(game.nextTurn());
  //     }
  //   };
  //   makeAIMove();
  // }, [isWhiteTurn, game, board]);

  const onClickPromotionEntity = (promoteTo: Type) =>{
      const pawn = board.getBoardEntity(lastMovePos[1][0], lastMovePos[1][1]);
      if(pawn){
        game.promotePawn(pawn, promoteTo);
        setCanPromotePawn(false);
      }
  }
  
  return (
    <>
        <div className="App" >
          {game.isDraw() || game.isWin() ? <div className='win'>{game.isDraw() ? "DRAW" : !isWhiteTurn ? "WHITE WIN" : "BLACK WIN"}</div> :
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
                                            ? 0.6 : 1,
                              boxShadow : (lastMovePos[0][0] === colIndex && lastMovePos[0][1] === entIndex) || 
                                              (lastMovePos[1][0] === colIndex && lastMovePos[1][1] === entIndex) ? '0 0 10px yellow' : 'none'
                            }
                            }>
                          {
                            entity!==null ?  
                                  (<img src={
                                    ((entity.getColor()===Color.WHITE) ? 
                                        require(`..//assets/images/white-${entity.getName().toLocaleLowerCase()}.png`) : 
                                        require(`..//assets/images/black-${entity.getName().toLocaleLowerCase()}.png`) ) 
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
       {canPromotePawn && <PromotionEntities isWhite={isWhiteTurn} onClickPromotionEntity={onClickPromotionEntity}/>}
    </>
  );
}
   
export default App;
