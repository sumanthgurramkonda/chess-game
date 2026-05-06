import { Entity } from "../entities/Entity";
import { Type } from "../entities/Type";
import { MoveStrategy } from "../movestrategy/MoveStrategy";
import { MoveStrategyFactory } from "../movestrategy/MoveStrategyFactory";
import { Position } from "../entities/Position";
import { Board } from "./Board";
import { Color } from "../entities/Color";
import { MoveValidator } from "../utility/MoveValidator";

export class Game{

    private board: Board;
    private whiteDeadEntities:Entity[];
    private blackDeadEntities:Entity[];
    private moveStrategyMap: Map<Type, MoveStrategy>;
    private isWhiteTurn:boolean = true;
    private lastMovePos: number[][];

    constructor(){
        this.whiteDeadEntities = [];
        this.blackDeadEntities = [];
        this.board = new Board();
        this.board.initializeBoard();
        this.lastMovePos = [[-1,-1],[-1,-1]]
        this.moveStrategyMap = new Map<Type, MoveStrategy>();
    }

    public moveEntity(fromRow: number, fromCol: number, toRow: number, toCol: number): void {
        const entity:Entity | null = this.board.getBoardEntity(fromRow, fromCol);
        if(entity === null){
            return;
            // throw new Error("No entity at the source position");
        }

        if ((entity.getColor() === Color.WHITE) !== this.isWhiteTurn) {
            return;
            // throw new Error("Wrong turn");
        }

        const validMoves = this.getMoves(fromRow, fromCol);

        const isValid = validMoves.some(pos => pos.getRowIndex() === toRow && pos.getColumnIndex() === toCol);

        if (!isValid) {
            return;
            // throw new Error("Illegal move");
        }

        const targetEntity:Entity | null = this.board.getBoardEntity(toRow, toCol);
        if(targetEntity){
            this.killEntity(toRow, toCol);
        }

        this.board.setPosition(toRow, toCol, entity);
        this.board.setPosition(fromRow, fromCol, null);

        this.lastMovePos[0][0] = fromRow;
        this.lastMovePos[0][1] = fromCol;
        this.lastMovePos[1][0] = toRow;
        this.lastMovePos[1][1] = toCol;

        this.changeTurn();
    }

    private changeTurn():void{
        this.isWhiteTurn = !this.isWhiteTurn;
    }

    public killEntity(rowIndex: number, columnIndex: number): void {
        const entity:Entity | null = this.board.getBoardEntity(rowIndex, columnIndex);
        if(entity === null){
            throw new Error("No entity at the given position");
        }
        // Implementation for killing an entity
        if(entity.getColor() === Color.WHITE){
            this.whiteDeadEntities.push(entity);
        } else {
            this.blackDeadEntities.push(entity);
        }
        this.board.setPosition(rowIndex, columnIndex, null);
        
    }

    public getMoves(rowIndex: number, columnIndex: number): Position[]{
        const entity:Entity | null = this.board.getBoardEntity(rowIndex, columnIndex);
        if(entity === null){
            return [];
            // throw new Error("No entity at the given position");
        }
        if(!this.moveStrategyMap.has(entity.getName())){
            const moveStrategy = MoveStrategyFactory.getMoveStrategy(entity.getName());
            if(moveStrategy === null){
                throw new Error("No move strategy found for entity type: "+entity.getName());
            }
            this.moveStrategyMap.set(entity.getName(), moveStrategy);
        }
        const moveStrategy: MoveStrategy = this.moveStrategyMap.get(entity.getName())!;

        const positions:Position[] = moveStrategy.generatePositions(rowIndex, columnIndex, this.board);
        return MoveValidator.filterValidMoves(entity.getColor()===Color.WHITE, rowIndex,columnIndex,positions,this.board);
        // return positions;
    }


    public getEntityAtPosition(rowIndex: number, columnIndex: number): Entity | null {
        return this.board.getBoardEntity(rowIndex, columnIndex);
    }

    public isDraw():boolean{

        return MoveValidator.isDraw(this.isWhiteTurn, this.board);
    }

    public isWin():boolean{

        return true;
    }


    public getBoard(): Board {
        return this.board;
    }

    public getWhiteDeadEntities(): Entity[] {
        return this.whiteDeadEntities;
    }

    public getBlackDeadEntities(): Entity[] {
        return this.blackDeadEntities;
    }

    public isCheckMate():boolean{
        return MoveValidator.isCheckmate(this.isWhiteTurn, this.board);
    }

    public nextTurn():boolean{
        return this.isWhiteTurn;
    }

    public getLastMovePos(): number[][]{
        return this.lastMovePos;
    }

}


