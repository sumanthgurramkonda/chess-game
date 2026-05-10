import { Color } from "../entities/Color";
import { Entity } from "../entities/Entity";
import { Position } from "../entities/Position";
import { Type } from "../entities/Type";
import { Board } from "../game/Board";
import { MoveStrategyFactory } from "../movestrategy/MoveStrategyFactory";

export class MoveValidator{


    public static isCheckmate(isWhite: boolean, board: Board): boolean {
        if (MoveValidator.isKingSafe(isWhite, board)) return false;

        return !MoveValidator.hasAnyLegalMove(isWhite, board);
    }

    public static isStalemate(isWhite: boolean, board: Board): boolean {

        if (!MoveValidator.isKingSafe(isWhite, board)) return false;

        return !MoveValidator.hasAnyLegalMove(isWhite, board);
    }

    public static isDraw(isWhite: boolean, board: Board): boolean {
        return (
            MoveValidator.isStalemate(isWhite, board) ||
            MoveValidator.isInsufficientMaterial(board)
        );
    }

    public static isInsufficientMaterial(board: Board): boolean {

        const pieces: Entity[] = [];

        const grid = board.getGrid();
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (grid[i][j]) pieces.push(grid[i][j] as Entity);
            }
        }

        // Remove kings
        const nonKings = pieces.filter(p => p.getName() !== Type.KING);

        // King vs King
        if (nonKings.length === 0) return true;

        // King + minor vs King
        if (nonKings.length === 1) {
            const type = nonKings[0].getName();
            return type === Type.BISHOP || type === Type.KNIGHT;
        }

        return false;
    }

    private static hasAnyLegalMove(isWhite: boolean, board: Board): boolean {

        const grid = board.getGrid();

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {

                const entity = grid[i][j];
                if (!entity) continue;

                if ((entity.getColor() === Color.WHITE) !== isWhite) continue;

                const strategy = MoveStrategyFactory.getMoveStrategy(entity.getName());
                const rawMoves = strategy.generatePositions(i, j, board);

                const validMoves = MoveValidator.filterValidMoves(
                    isWhite,
                    i,
                    j,
                    rawMoves,
                    board
                );

                if (validMoves.length > 0) return true;
            }
        }

        return false;
    }


    static filterValidMoves(isWhite: boolean,fromRow: number,fromColumn: number,positions: Position[],board: Board): Position[] {

        return positions.filter((pos) => {

            const entity = board.getBoardEntity(fromRow, fromColumn);
            if (!entity) return false;

            const captured = board.getBoardEntity(pos.getRowIndex(), pos.getColumnIndex());

            const originalRow = entity.getRowIndex();
            const originalCol = entity.getColumnIndex();

            let capturedRow = -1, capturedCol = -1;
            if (captured) {
                capturedRow = captured.getRowIndex();
                capturedCol = captured.getColumnIndex();
            }

            // simulate move
            board.setPosition(fromRow, fromColumn, null);
            board.setPosition(pos.getRowIndex(), pos.getColumnIndex(), entity);
            entity.setPosition(pos.getRowIndex(), pos.getColumnIndex());

            const safe = MoveValidator.isKingSafe(isWhite, board);
            // const safe = MoveValidator.isValidMove(isWhite , board);
            
            // undo move
            board.setPosition(fromRow, fromColumn, entity);
            board.setPosition(pos.getRowIndex(), pos.getColumnIndex(), captured);
            entity.setPosition(originalRow, originalCol);

            if (captured) {
                captured.setPosition(capturedRow, capturedCol);
            }

            return safe;
        });
    }

    static isKingSafe(isWhite: boolean, board: Board): boolean {
        const king = isWhite ? board.getWhiteKing() : board.getBlackKing();
        if(!king){
            throw new Error("king not found")
        }
        return !MoveValidator.isSquareAttacked(
            king.getRowIndex(),
            king.getColumnIndex(),
            !isWhite,
            board
        );
    }


    static isSquareAttacked(row: number, col: number, byWhite: boolean, board: Board): boolean {

        const grid = board.getGrid();

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {

                const entity = grid[i][j];
                if (!entity) continue;

                if ((entity.getColor() === Color.WHITE) !== byWhite) continue;

                const type = entity.getName();

                // 🟡 PAWN
                if (type === Type.PAWN) {
                    const dir = entity.getColor() === Color.WHITE ? 1 : -1;
                    if (
                        (i + dir === row && j - 1 === col) ||
                        (i + dir === row && j + 1 === col)
                    ) return true;
                }

                // 🟡 KNIGHT
                if (type === Type.KNIGHT) {
                    const moves = [
                        [2,1],[2,-1],[-2,1],[-2,-1],
                        [1,2],[1,-2],[-1,2],[-1,-2]
                    ];
                    for (const [dx, dy] of moves) {
                        if (i + dx === row && j + dy === col) return true;
                    }
                }

                // 🟡 KING
                if (type === Type.KING) {
                    if (Math.abs(i - row) <= 1 && Math.abs(j - col) <= 1) return true;
                }

                // 🟡 ROOK / QUEEN (STRAIGHT)
                if (type === Type.ROOK || type === Type.QUEEN) {
                    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
                    for (const [dx, dy] of dirs) {
                        let x = i + dx, y = j + dy;
                        while (x >= 0 && x < 8 && y >= 0 && y < 8) {
                            if (x === row && y === col) return true;
                            if (board.getBoardEntity(x, y) !== null) break;
                            x += dx; y += dy;
                        }
                    }
                }

                // 🟡 BISHOP / QUEEN (DIAGONAL)
                if (type === Type.BISHOP || type === Type.QUEEN) {
                    const dirs = [[1,1],[1,-1],[-1,1],[-1,-1]];
                    for (const [dx, dy] of dirs) {
                        let x = i + dx, y = j + dy;
                        while (x >= 0 && x < 8 && y >= 0 && y < 8) {
                            if (x === row && y === col) return true;
                            if (board.getBoardEntity(x, y) !== null) break;
                            x += dx; y += dy;
                        }
                    }
                }
            }
        }

        return false;
    }

    // private static isKingSafe(isWhite: boolean, board: Board): boolean {

    //     const king = isWhite ? board.getWhiteKing() : board.getBlackKing();
    //     if (!king) throw new Error("King missing");

    //     const kingRow = king.getRowIndex();
    //     const kingCol = king.getColumnIndex();

    //     const grid = board.getGrid();

    //     for (let i = 0; i < 8; i++) {
    //         for (let j = 0; j < 8; j++) {

    //             const entity = grid[i][j];
    //             if (!entity) continue;

    //             if (entity.getColor() === king.getColor()) continue;

    //             // pawn special handling
    //             if (entity.getName() === Type.PAWN) {
    //                 const dir = entity.getColor()===Color.WHITE ? -1 : 1;

    //                 if (
    //                     (i + dir === kingRow && j - 1 === kingCol) ||
    //                     (i + dir === kingRow && j + 1 === kingCol)
    //                     ) {
    //                         return false;
    //                 }
    //                 continue;
    //             }

    //             const strategy = MoveStrategyFactory.getMoveStrategy(entity.getName());
    //             const moves = strategy.generatePositions(i, j, board);

    //             for (const move of moves) {
    //                 if (move.getRowIndex() === kingRow && move.getColumnIndex() === kingCol) {
    //                     return false;
    //                 }
    //             }
    //         }
    //     }

    //     return true;
    // }

    // private static isValidMove(isWhite:boolean,board:Board):boolean{

    //         const king = isWhite ? board.getWhiteKing() : board.getBlackKing();
    //         if (!king) throw new Error("King missing");
    //         const rowIndex = king.getRowIndex(), columnIndex = king.getColumnIndex();
    //         let newPos:Position[];
    //         newPos = MoveStrategyFactory.getMoveStrategy(Type.BISHOP).generatePositions(rowIndex,columnIndex,board);
    //         if(newPos.length>0)return false;
    //         newPos = MoveStrategyFactory.getMoveStrategy(Type.KING).generatePositions(rowIndex,columnIndex,board);
    //         if(newPos.length>0)return false;
    //         newPos = MoveStrategyFactory.getMoveStrategy(Type.KNIGHT).generatePositions(rowIndex,columnIndex,board);
    //         if(newPos.length>0)return false;
    //         newPos = MoveStrategyFactory.getMoveStrategy(Type.PAWN).generatePositions(rowIndex,columnIndex,board);
    //         if(newPos.length>0)return false;
    //         newPos = MoveStrategyFactory.getMoveStrategy(Type.QUEEN).generatePositions(rowIndex,columnIndex,board);
    //         if(newPos.length>0)return false;
    //         newPos = MoveStrategyFactory.getMoveStrategy(Type.ROOK).generatePositions(rowIndex,columnIndex,board);
    //         if(newPos.length>0)return false;
    //         return true;
    // }

}