import { Entity } from "../entities/Entity";
import { Board } from "../game/Board";
import { MoveStrategy } from "./MoveStrategy";
import { Position } from "../entities/Position";
import { Color } from "../entities/Color";

export class KnightMoveStrategy extends MoveStrategy{

    knight:Entity | null = null;

    generatePositions(rowIndex: number, columnIndex: number, board: Board): Position[]{
        this.positions= [];
        this.knight = board.getBoardEntity(rowIndex,columnIndex);
        if(this.knight===null)return this.positions;

        this.addPosition(rowIndex-1, columnIndex-2,board);
        this.addPosition(rowIndex+1, columnIndex-2,board);

        this.addPosition(rowIndex-2, columnIndex-1,board);
        this.addPosition(rowIndex+2, columnIndex-1,board);

        this.addPosition(rowIndex-2, columnIndex+1,board);
        this.addPosition(rowIndex+2, columnIndex+1,board);

        this.addPosition(rowIndex-1, columnIndex+2,board);
        this.addPosition(rowIndex+1, columnIndex+2,board);
        
        return this.positions;
    }

    private addPosition(row: number, col: number, board: Board) {
        if(row<0 || row>=8 || col<0 || col>=8) return;
        const targetEntity = board.getBoardEntity(row, col);
        if ((targetEntity===null) || (this.knight && targetEntity.getColor() !== this.knight.getColor())) {
            this.positions.push(new Position(row, col));
        }
    }


}