import { Entity } from "../entities/Entity";
import { Board } from "../game/Board";
import { MoveStrategy } from "./MoveStrategy";
import { Position } from "../entities/Position";


export class BishopMoveStrategy extends MoveStrategy{

    bishop:Entity | null = null;

    generatePositions(rowIndex: number, columnIndex: number, board: Board): Position[]{

        this.positions = [];
        this.bishop = board.getBoardEntity(rowIndex,columnIndex);
        if(this.bishop===null)return this.positions;
        
        let row = rowIndex-1, col = columnIndex-1;
        while(row>=0 && col>=0){
           if(this.addPosition(row,col,board)){
                break;
            }
            this.positions.push(new Position(row,col));
            row--;
            col--;
        }

        row = rowIndex+1;
        col = columnIndex+1;
        while(row<8 && col<8){
            if(this.addPosition(row,col,board)){
                break;
            }
            this.positions.push(new Position(row,col));
            row++;
            col++;
        }

        row = rowIndex-1;
        col = columnIndex+1;
        while(row>=0 && col<8){
            if(this.addPosition(row,col,board)){
                break;
            }
            this.positions.push(new Position(row,col));
            row--;
            col++;
        }

        row = rowIndex+1;
        col = columnIndex-1;
        while(row<8 && col>=0){
            if(this.addPosition(row,col,board)){
                break;
            }
            this.positions.push(new Position(row,col));
            row++;
            col--;
        }
        return this.positions;
    }

    private addPosition(row: number, col: number, board: Board): boolean {
        const targetEntity = board.getBoardEntity(row, col);
        if (targetEntity === null) {
            return false;
        }
        if (this.bishop && targetEntity.getColor() !== this.bishop.getColor()) {
            this.positions.push(new Position(row, col));
        }
        return true;
    }
}