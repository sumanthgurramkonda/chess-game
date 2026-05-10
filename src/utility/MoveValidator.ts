import { Color } from "../entities/Color";
import { Entity } from "../entities/Entity";
import { Position } from "../entities/Position";
import { Type } from "../entities/Type";
import { Board } from "../game/Board";
import { MoveStrategyFactory } from "../movestrategy/MoveStrategyFactory";

export class MoveValidator {

    // =========================================================
    // CHECKMATE
    // =========================================================

    public static isCheckmate(isWhite: boolean, board: Board): boolean {

        // king must be in check
        if (MoveValidator.isKingSafe(isWhite, board)) {
            return false;
        }

        // no legal moves
        return !MoveValidator.hasAnyLegalMove(isWhite, board);
    }

    // =========================================================
    // STALEMATE
    // =========================================================

    public static isStalemate(isWhite: boolean, board: Board): boolean {

        // king should NOT be in check
        if (!MoveValidator.isKingSafe(isWhite, board)) {
            return false;
        }

        // no legal moves
        return !MoveValidator.hasAnyLegalMove(isWhite, board);
    }

    // =========================================================
    // DRAW
    // =========================================================

    public static isDraw(isWhite: boolean, board: Board): boolean {

        return (
            MoveValidator.isStalemate(isWhite, board) ||
            MoveValidator.isInsufficientMaterial(board)
        );
    }

    // =========================================================
    // INSUFFICIENT MATERIAL
    // =========================================================

    public static isInsufficientMaterial(board: Board): boolean {

        const pieces: Entity[] = [];

        const grid = board.getGrid();

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {

                const piece = grid[i][j];

                if (piece) {
                    pieces.push(piece as Entity);
                }
            }
        }

        // remove kings
        const nonKings = pieces.filter(
            piece => piece.getName() !== Type.KING
        );

        // king vs king
        if (nonKings.length === 0) {
            return true;
        }

        // king + bishop vs king
        // king + knight vs king
        if (nonKings.length === 1) {

            const type = nonKings[0].getName();

            return (
                type === Type.BISHOP ||
                type === Type.KNIGHT
            );
        }

        return false;
    }

    // =========================================================
    // LEGAL MOVES EXIST
    // =========================================================

    private static hasAnyLegalMove(
        isWhite: boolean,
        board: Board
    ): boolean {

        const grid = board.getGrid();

        for (let i = 0; i < 8; i++) {

            for (let j = 0; j < 8; j++) {

                const entity = grid[i][j];

                if (!entity) continue;

                const entityIsWhite =
                    entity.getColor() === Color.WHITE;

                if (entityIsWhite !== isWhite) continue;

                const strategy =
                    MoveStrategyFactory.getMoveStrategy(
                        entity.getName()
                    );

                const rawMoves =
                    strategy.generatePositions(i, j, board);

                const validMoves =
                    MoveValidator.filterValidMoves(
                        isWhite,
                        i,
                        j,
                        rawMoves,
                        board
                    );

                if (validMoves.length > 0) {
                    return true;
                }
            }
        }

        return false;
    }

    // =========================================================
    // FILTER VALID MOVES
    // =========================================================

    public static filterValidMoves(
        isWhite: boolean,
        fromRow: number,
        fromColumn: number,
        positions: Position[],
        board: Board
    ): Position[] {

        return positions.filter((position) => {

            const entity =
                board.getBoardEntity(fromRow, fromColumn);

            if (!entity) return false;

            const toRow = position.getRowIndex();
            const toColumn = position.getColumnIndex();

            const captured =
                board.getBoardEntity(toRow, toColumn);

            // backup original position
            const originalRow = entity.getRowIndex();
            const originalColumn = entity.getColumnIndex();

            let capturedRow = -1;
            let capturedColumn = -1;

            if (captured) {
                capturedRow = captured.getRowIndex();
                capturedColumn = captured.getColumnIndex();
            }

            // =================================================
            // SIMULATE MOVE
            // =================================================

            board.setPosition(fromRow, fromColumn, null);

            board.setPosition(toRow, toColumn, entity);

            entity.setPosition(toRow, toColumn);

            // =================================================
            // CHECK KING SAFETY
            // =================================================

            const safe =
                MoveValidator.isKingSafe(isWhite, board);

            // =================================================
            // UNDO MOVE
            // =================================================

            board.setPosition(fromRow, fromColumn, entity);

            board.setPosition(toRow, toColumn, captured);

            entity.setPosition(
                originalRow,
                originalColumn
            );

            if (captured) {
                captured.setPosition(
                    capturedRow,
                    capturedColumn
                );
            }

            return safe;
        });
    }

    // =========================================================
    // KING SAFETY
    // =========================================================

    public static isKingSafe(
        isWhite: boolean,
        board: Board
    ): boolean {

        const king =
            isWhite
                ? board.getWhiteKing()
                : board.getBlackKing();

        if (!king) {
            throw new Error("King not found");
        }

        return !MoveValidator.isSquareAttacked(
            king.getRowIndex(),
            king.getColumnIndex(),
            !isWhite,
            board
        );
    }

    // =========================================================
    // SQUARE ATTACK DETECTION
    // =========================================================

    public static isSquareAttacked(
        row: number,
        col: number,
        byWhite: boolean,
        board: Board
    ): boolean {

        const grid = board.getGrid();

        for (let i = 0; i < 8; i++) {

            for (let j = 0; j < 8; j++) {

                const entity = grid[i][j];

                if (!entity) continue;

                const entityIsWhite =
                    entity.getColor() === Color.WHITE;

                if (entityIsWhite !== byWhite) continue;

                const type = entity.getName();

                // =================================================
                // PAWN ATTACKS
                // =================================================

                if (type === Type.PAWN) {

                    const dir =
                        entity.getColor() === Color.WHITE
                            ? 1
                            : -1;

                    if (
                        (i + dir === row && j - 1 === col) ||
                        (i + dir === row && j + 1 === col)
                    ) {
                        return true;
                    }
                }

                // =================================================
                // KNIGHT ATTACKS
                // =================================================

                if (type === Type.KNIGHT) {

                    const knightMoves = [
                        [2, 1],
                        [2, -1],
                        [-2, 1],
                        [-2, -1],
                        [1, 2],
                        [1, -2],
                        [-1, 2],
                        [-1, -2]
                    ];

                    for (const [dx, dy] of knightMoves) {

                        if (
                            i + dx === row &&
                            j + dy === col
                        ) {
                            return true;
                        }
                    }
                }

                // =================================================
                // KING ATTACKS
                // =================================================

                if (type === Type.KING) {

                    if (
                        Math.abs(i - row) <= 1 &&
                        Math.abs(j - col) <= 1
                    ) {
                        return true;
                    }
                }

                // =================================================
                // ROOK / QUEEN STRAIGHT
                // =================================================

                if (
                    type === Type.ROOK ||
                    type === Type.QUEEN
                ) {

                    const directions = [
                        [1, 0],
                        [-1, 0],
                        [0, 1],
                        [0, -1]
                    ];

                    for (const [dx, dy] of directions) {

                        let x = i + dx;
                        let y = j + dy;

                        while (
                            x >= 0 &&
                            x < 8 &&
                            y >= 0 &&
                            y < 8
                        ) {

                            if (x === row && y === col) {
                                return true;
                            }

                            if (
                                board.getBoardEntity(x, y)
                                !== null
                            ) {
                                break;
                            }

                            x += dx;
                            y += dy;
                        }
                    }
                }

                // =================================================
                // BISHOP / QUEEN DIAGONAL
                // =================================================

                if (
                    type === Type.BISHOP ||
                    type === Type.QUEEN
                ) {

                    const directions = [
                        [1, 1],
                        [1, -1],
                        [-1, 1],
                        [-1, -1]
                    ];

                    for (const [dx, dy] of directions) {

                        let x = i + dx;
                        let y = j + dy;

                        while (
                            x >= 0 &&
                            x < 8 &&
                            y >= 0 &&
                            y < 8
                        ) {

                            if (x === row && y === col) {
                                return true;
                            }

                            if (
                                board.getBoardEntity(x, y)
                                !== null
                            ) {
                                break;
                            }

                            x += dx;
                            y += dy;
                        }
                    }
                }
            }
        }

        return false;
    }
}