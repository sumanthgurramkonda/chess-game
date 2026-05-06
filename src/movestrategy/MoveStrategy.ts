import { Board } from "../game/Board";
import { Position } from "../entities/Position";
import { Entity } from "../entities/Entity";
import { MoveStrategyFactory } from "./MoveStrategyFactory";
import { Type } from "../entities/Type";

export abstract class MoveStrategy {

    protected positions:Position[] = [];

    abstract generatePositions(rowIndex: number, columnIndex: number, board: Board): Position[];

    

}