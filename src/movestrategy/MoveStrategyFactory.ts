import { Type } from "../entities/Type";
import { BishopMoveStrategy } from "./BishopMoveStrategy";
import { KingMoveStrategy } from "./KingMoveStrategy";
import { KnightMoveStrategy } from "./KnightMoveStrategy";
import { MoveStrategy } from "./MoveStrategy";
import { PawnMoveStrategy } from "./PawnMoveStrategy";
import { QueenMoveStrategy } from "./QueenMoveStrategy";
import { RookMoveStrategy } from "./RookMoveStrategy";

export class MoveStrategyFactory{
    

    public static getMoveStrategy(type: Type): MoveStrategy{

        switch(type){
            case Type.KING:
                return new KingMoveStrategy();
            case Type.PAWN:
                return new PawnMoveStrategy();
            case Type.ROOK:
                return new RookMoveStrategy();
            case Type.BISHOP:
                return new BishopMoveStrategy();
            case Type.KNIGHT:
                return new KnightMoveStrategy();
            case Type.QUEEN:
                return new QueenMoveStrategy();
            default:
                throw new Error("Move strategy not implemented for type: "+type);
        }

    }

}