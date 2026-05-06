import { Entity } from "../entities/Entity";
import { Board } from "../game/Board";
import { MoveStrategy } from "./MoveStrategy";
import { Position } from "../entities/Position";
import { Color } from "../entities/Color";

export class RookMoveStrategy extends MoveStrategy{

    rook:Entity | null = null;

    generatePositions(rowIndex: number, columnIndex: number, board: Board): Position[]{

        this.positions = [];
        this.rook = board.getBoardEntity(rowIndex,columnIndex);

        if(this.rook===null)return this.positions;

        // move right(white) vice versa(black)
        for(let col= columnIndex+1;col<8;col++){
            if(this.addPosition(rowIndex,col,board)){
                break;
            }
            this.positions.push(new Position(rowIndex,col));
        }

        // move left(white) vice versa(black)
        for(let col= columnIndex-1;col>=0;col--){
            if(this.addPosition(rowIndex,col,board)){
                break;
            }
            this.positions.push(new Position(rowIndex,col));
        }

        // move forward(white) vice versa(black)
        for(let row= rowIndex+1;row<8;row++){
            if(this.addPosition(row,columnIndex,board)){
                break;
            }
            this.positions.push(new Position(row,columnIndex));
        }
        
        // move backward(white) vice versa(black)
        for(let row= rowIndex-1;row>=0;row--){
            if(this.addPosition(row,columnIndex,board)){
                break;
            }
            this.positions.push(new Position(row,columnIndex));
        }
        return this.positions;
    }

    private addPosition(row: number, col: number, board: Board): boolean {
        const targetEntity = board.getBoardEntity(row, col);
        if (targetEntity === null) {
            return false;
        }
        if (this.rook && targetEntity.getColor() !== this.rook.getColor()) {
            this.positions.push(new Position(row, col));
        }
        return true;
    }

}