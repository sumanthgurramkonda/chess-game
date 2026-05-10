import { Bishop } from "../entities/Bishop";
import { Color } from "../entities/Color";
import { Entity } from "../entities/Entity";
import { King } from "../entities/King";
import { Knight } from "../entities/Knight";
import { Pawn } from "../entities/Pawn";
import { Queen } from "../entities/Queen";
import { Rook } from "../entities/Rook";

export class Board {

    private grid: (Entity|null)[][];
    private whiteKing: Entity;
    private blackKing: Entity;

    constructor() {
        this.grid = Array(8).fill(null).map(() => Array(8).fill(null));
        this.whiteKing = new King(0, 4, Color.WHITE);
        this.blackKing = new King(7, 4, Color.BLACK);
        // this.initializeBoard();
    }

    initializeBoard(): void{

        this.grid[0][4] = this.whiteKing;
        this.grid[7][4] = this.blackKing;
        this.grid[0][3] = new Queen(0, 3, Color.WHITE);
        this.grid[7][3] = new Queen(7, 3, Color.BLACK);

        this.grid[0][2] = new Bishop(0, 2, Color.WHITE);
        this.grid[0][5] = new Bishop(0, 5, Color.WHITE);
        this.grid[7][2] = new Bishop(7, 2, Color.BLACK);
        this.grid[7][5] = new Bishop(7, 5, Color.BLACK);

        this.grid[0][0] = new Rook(0, 0, Color.WHITE);
        this.grid[0][7] = new Rook(0, 7, Color.WHITE);
        this.grid[7][0] = new Rook(7, 0, Color.BLACK);
        this.grid[7][7] = new Rook(7, 7, Color.BLACK);

        this.grid[0][1] = new Knight(0, 1, Color.WHITE);
        this.grid[0][6] = new Knight(0, 6, Color.WHITE);
        this.grid[7][1] = new Knight(7, 1, Color.BLACK);
        this.grid[7][6] = new Knight(7, 6, Color.BLACK);

        for(let i = 0; i < 8; i++){
            this.grid[1][i] = new Pawn(1, i, Color.WHITE);
            this.grid[6][i] = new Pawn(6, i, Color.BLACK);
        }
    }

    getBoardEntity(rowIndex: number, columnIndex: number): Entity | null {
        if (rowIndex < 0 || rowIndex >= 8 || columnIndex < 0 || columnIndex >= 8) {
            throw new Error("Invalid board position");
        }
        return this.grid[rowIndex][columnIndex];
    }

    setPosition(rowIndex: number, columnIndex: number, entity: Entity | null): void {
        if (rowIndex < 0 || rowIndex >= 8 || columnIndex < 0 || columnIndex >= 8) {
            throw new Error("Invalid board position");
        }
        this.grid[rowIndex][columnIndex] = entity;
        if(entity !== null){
            entity.setPosition(rowIndex, columnIndex);
        }
    }

    getGrid(): (Entity|null)[][] {
        return this.grid;
    }
    getWhiteKing(): Entity | null{
        return this.whiteKing;
    }

    getBlackKing(): Entity | null{
        return this.blackKing;
    }

    clone():Board{
        const board = new Board();
        for(let row=0;row<8;row++){
            for(let col=0;col<8;col++){
                const entity = this.grid[row][col];
                board.setPosition(row,col,entity ? entity.clone() : null);
            }
        }
        return board;
    }

    public toJSON(): string {
        const boardState = this.grid.map(row => row.map(entity => entity ? entity.toJSON() : null));
        return JSON.stringify(boardState);
    }

}