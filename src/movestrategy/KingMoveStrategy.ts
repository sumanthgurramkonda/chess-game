import { Color } from "../entities/Color";
import { Entity } from "../entities/Entity";
import { Board } from "../game/Board";
import { MoveStrategy } from "./MoveStrategy";
import { Position } from "../entities/Position";

export class KingMoveStrategy extends MoveStrategy {

    king:Entity | null = null;

    generatePositions(rowIndex: number, columnIndex: number, board: Board): Position[] {
        this.positions = [];
        this.king = board.getBoardEntity(rowIndex,columnIndex);
        if(this.king === null){
            return this.positions;
        }
        // abjacent moves
        let dir:number[][] = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
        for(let i = 0; i < dir.length; i++){
            const newRow = rowIndex + dir[i][0];
            const newColumn = columnIndex + dir[i][1];
            if(this.validMove(this.king.getColor() === Color.WHITE, newRow, newColumn, board)){
                this.positions.push(new Position(newRow, newColumn));
            }
        }
        return this.positions;
    }

    private validMove(isWhite:boolean,rowIndex: number, colIndex: number, board: Board): boolean{
        if (rowIndex < 0 || rowIndex >= 8 || colIndex < 0 || colIndex >= 8) {
            return false;
        }
        if(board.getBoardEntity(rowIndex, colIndex) === null || 
            board.getBoardEntity(rowIndex, colIndex)?.getColor() !== (isWhite ? Color.WHITE : Color.BLACK)){
                return true;
        }
        return false;
    }

}