import { Entity } from "../entities/Entity";
import { Type } from "../entities/Type";
import { MoveStrategy } from "../movestrategy/MoveStrategy";
import { MoveStrategyFactory } from "../movestrategy/MoveStrategyFactory";
import { Position } from "../entities/Position";
import { Board } from "./Board";
import { Color } from "../entities/Color";
import { MoveValidator } from "../utility/MoveValidator";
import { Queen } from "../entities/Queen";
import { Rook } from "../entities/Rook";
import { Bishop } from "../entities/Bishop";
import { Knight } from "../entities/Knight";

export class Game{

    private board: Board;
    private whiteDeadEntities:Entity[];
    private blackDeadEntities:Entity[];
    private moveStrategyMap: Map<Type, MoveStrategy>;
    private isWhiteTurn:boolean = true;
    private lastMovePos: number[][];
    private canPromotePawn:boolean = false;
    
    private isWhiteKingMoved:boolean = false;
    private isLeftWhiteRookMoved:boolean = false;
    private isRightWhiteRookMoved:boolean = false;

    private isBlackKingMoved:boolean = false
    private isLeftBlackRookMoved:boolean = false;
    private isRightBlackRookMoved:boolean = false;

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
        if(toCol === 6){
                this.board.setPosition(toRow, 5, this.board.getBoardEntity(toRow, 7));
                this.board.setPosition(toRow, 7, null);
        }else if(toCol === 2){
            this.board.setPosition(toRow, 3, this.board.getBoardEntity(toRow, 0));
            this.board.setPosition(toRow, 0, null);
        }

        this.lastMovePos[0][0] = fromRow;
        this.lastMovePos[0][1] = fromCol;
        this.lastMovePos[1][0] = toRow;
        this.lastMovePos[1][1] = toCol;

        if(entity.getName() === Type.PAWN && ((!this.isWhiteTurn && toRow === 0) || (this.isWhiteTurn &&toRow === 7))){
            // promote pawn
            this.canPromotePawn = true;
        }

        if(entity.getName() === Type.KING){
            if(this.isWhiteTurn){
                this.isWhiteKingMoved = true;
            } else {
                this.isBlackKingMoved = true;
            }
        }else if(entity.getName() === Type.ROOK){
            if(this.isWhiteTurn){
                if(fromCol === 0){
                    this.isLeftWhiteRookMoved = true;
                } else if(fromCol === 7){
                    this.isRightWhiteRookMoved = true;
                }
            } else {
                if(fromCol === 0){
                    this.isLeftBlackRookMoved = true;
                } else if(fromCol === 7){
                    this.isRightBlackRookMoved = true;
                }
            }
        }

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
        if(entity.getName() === Type.KING){
                if(this.isWhiteTurn && !this.isWhiteKingMoved){
                    if(!this.board.getBoardEntity(rowIndex, columnIndex+1) && !this.board.getBoardEntity(rowIndex, columnIndex+2) && !this.isRightWhiteRookMoved){
                        positions.push(new Position(rowIndex, columnIndex+2));
                    }else if(!this.board.getBoardEntity(rowIndex, columnIndex-1) && !this.board.getBoardEntity(rowIndex, columnIndex-2) && !this.isLeftWhiteRookMoved){
                        positions.push(new Position(rowIndex, columnIndex-2));
                    }
                } else if(!this.isBlackKingMoved){
                    if(!this.board.getBoardEntity(rowIndex, columnIndex+1) && !this.board.getBoardEntity(rowIndex, columnIndex+2) && !this.isRightBlackRookMoved){
                        positions.push(new Position(rowIndex, columnIndex+2));
                    }else if(!this.board.getBoardEntity(rowIndex, columnIndex-1) && !this.board.getBoardEntity(rowIndex, columnIndex-2) && !this.isLeftBlackRookMoved){
                        positions.push(new Position(rowIndex, columnIndex-2));
                    }
                }
        }
        return MoveValidator.filterValidMoves(entity.getColor()===Color.WHITE, rowIndex,columnIndex,positions,this.board);
        // return positions;
    }

    public promotePawn(entity: Entity, promoteTo: Type): void {
        const rowIndex = entity.getRowIndex();
        const columnIndex = entity.getColumnIndex();
        if(entity === null || entity.getName() !== Type.PAWN){
            return;
            // throw new Error("No pawn at the given position to promote");
        }
        const color = entity.getColor();
        let newEntity: Entity | null = null;
        switch(promoteTo){
            case Type.QUEEN:
                newEntity = new Queen(rowIndex, columnIndex, color);
                break;
            case Type.ROOK:
                newEntity = new Rook(rowIndex, columnIndex, color);
                break;
            case Type.BISHOP:
                newEntity = new Bishop(rowIndex, columnIndex, color);
                break;
            case Type.KNIGHT:
                newEntity = new Knight(rowIndex, columnIndex, color);
                break;
        }
        this.board.setPosition(rowIndex, columnIndex, newEntity);
        this.canPromotePawn = false;
    }


    public getEntityAtPosition(rowIndex: number, columnIndex: number): Entity | null {
        return this.board.getBoardEntity(rowIndex, columnIndex);
    }

    public isDraw():boolean{

        return MoveValidator.isDraw(this.isWhiteTurn, this.board);
    }

    public isWin():boolean{

        return MoveValidator.isCheckmate(this.isWhiteTurn, this.board);; 
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

    public nextTurn():boolean{
        return this.isWhiteTurn;
    }

    public getLastMovePos(): number[][]{
        return this.lastMovePos;
    }

    public canPromotePawnFunc(): boolean {
        return this.canPromotePawn;
    }
    

}


