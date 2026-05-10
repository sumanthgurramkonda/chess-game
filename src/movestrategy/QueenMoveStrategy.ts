import { Entity } from "../entities/Entity";
import { Type } from "../entities/Type";
import { Board } from "../game/Board";
import { MoveStrategy } from "./MoveStrategy";
import { MoveStrategyFactory } from "./MoveStrategyFactory";
import { Position } from "../entities/Position";

export class QueenMoveStrategy extends MoveStrategy{

    
    private queen:Entity | null = null;

    generatePositions(rowIndex: number, columnIndex: number, board: Board): Position[]{
        this.positions = [];
        this.queen = board.getBoardEntity(rowIndex,columnIndex);
        if(this.queen===null)return this.positions;
        const rookPositions:Position[] = MoveStrategyFactory.getMoveStrategy(Type.ROOK)
                                                            .generatePositions(rowIndex,columnIndex,board);
        const bishopPositions:Position[] = MoveStrategyFactory.getMoveStrategy(Type.BISHOP)
                                                              .generatePositions(rowIndex,columnIndex,board);
        this.positions.push(...rookPositions);
        this.positions.push(...bishopPositions);
        return this.positions;
    }
}