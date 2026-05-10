import { Color } from "../entities/Color";
import { Entity } from "../entities/Entity";
import { Board } from "../game/Board";
import { MoveStrategy } from "./MoveStrategy";
import { Position } from "../entities/Position";

export class PawnMoveStrategy extends MoveStrategy {

    private pawn:Entity | null = null;

    generatePositions(rowIndex: number, columnIndex: number, board: Board): Position[] {
        
        this.positions = [];
        this.pawn = board.getBoardEntity(rowIndex, columnIndex)
        if(this.pawn === null) return this.positions;
        const isWhite = this.pawn.getColor() === Color.WHITE;

        // Pawn moves logic
        let nextRowIndex = rowIndex + (isWhite ? 1 : -1);

        // Initial pawn move
        if((isWhite && rowIndex === 1) || (!isWhite && rowIndex === 6)){
            const initialNextRowIndex = rowIndex + (isWhite ? 2 : -2);
            if(board.getBoardEntity(nextRowIndex, columnIndex) === null && board.getBoardEntity(initialNextRowIndex, columnIndex) === null){
                this.positions.push(new Position(initialNextRowIndex, columnIndex));
            }
        }
        // Normal move
        let entityAtNextPosition = board.getBoardEntity(nextRowIndex, columnIndex);
        if(entityAtNextPosition === null){
            this.positions.push(new Position(nextRowIndex, columnIndex));
        }
        // Diagonal move
        const diagonalLeft = columnIndex - 1;
        const diagonalRight = columnIndex + 1;
        if(diagonalLeft >= 0){
            const entityAtDiagonalLeft = board.getBoardEntity(nextRowIndex, diagonalLeft);
            if(entityAtDiagonalLeft !== null && entityAtDiagonalLeft.getColor() !== this.pawn.getColor()){
                this.positions.push(new Position(nextRowIndex, diagonalLeft));
            }
        }
        if(diagonalRight < 8){
            const entityAtDiagonalRight = board.getBoardEntity(nextRowIndex, diagonalRight);
            if(entityAtDiagonalRight !== null && entityAtDiagonalRight.getColor() !== this.pawn.getColor()){
                this.positions.push(new Position(nextRowIndex, diagonalRight));
            }
        }
        
        return this.positions;
    }

}