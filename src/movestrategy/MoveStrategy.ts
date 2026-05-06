import { Board } from "../game/Board";
import { Position } from "../entities/Position";

export abstract class MoveStrategy {

    protected positions:Position[] = [];

    abstract generatePositions(rowIndex: number, columnIndex: number, board: Board): Position[];

    

}