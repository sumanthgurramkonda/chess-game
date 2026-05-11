import { Board } from "../game/Board";

export default class AIPlayer{

    private readonly URL: string = "http://localhost:8080/api/v1/chat";
    private prompt: string = `
        You are a chess engine playing BLACK pieces.

        You will receive a chess board in JSON format.

        Board Rules:

        * rowIndex 0 = White back rank
        * rowIndex 7 = Black back rank
        * columnIndex 0 = file a
        * columnIndex 7 = file h

        Each board cell contains either:

        * null
        OR
        * a chess piece object:
        {
        "name": "PAWN | KNIGHT | BISHOP | ROOK | QUEEN | KING",
        "rowIndex": number,
        "columnIndex": number,
        "color": "WHITE | BLACK"
        }

        Your task:

        * Analyze the board
        * Find ONE valid move for BLACK
        * Follow real chess rules
        * Never generate illegal moves
        * Never move WHITE pieces
        * Never invent pieces
        * Never explain the move
        * Never output markdown
        * Return ONLY valid JSON

        Required response format:
        {
        "name": "PIECE_NAME",
        "currentRowIndex": number,
        "currentColumnIndex": number,
        "nextRowIndex": number,
        "nextColumnIndex": number,
        "color": "BLACK"
        }

        Example:
        {
        "name": "KNIGHT",
        "currentRowIndex": 7,
        "currentColumnIndex": 6,
        "nextRowIndex": 5,
        "nextColumnIndex": 5,
        "color": "BLACK"
        }

        Chess Board:
        {{BOARD_JSON}}
    `

    public async makeMove(isWhite: boolean, board: Board): Promise<any> {

        const moves: any = {
            currentRowIndex: -1,
            currentColumnIndex: -1,
            nextRowIndex: -1,
            nextColumnIndex: -1
        };
        
        if(!isWhite){

            const boardPos = JSON.stringify(board);
            // const content = `You are a chess player with ${isWhite ? 'white' : 'black'} color. Just give the positions in json format with name positions with no any additional matter. Give the next move with current entity currentRowIndex and currentColumnIndex and nextRowIndex and nextColumnIndex. Just give the json format without any additional matter. Chess Board : ${boardPos}`;
            const content = this.prompt.replace('{{BOARD_JSON}}', boardPos);
            const body = {
              conversationId : null,
              message : content,
              model : "llama3",
              useRag : false
            }
            // console.log(JSON.stringify(body))
            const response = await fetch(this.URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(body)
            })
            if(response.ok){
                const data = await response.json();
                if(data && data.message){
                    console.log("response ",data.message)
                    const move = JSON.parse(data.message);
                    moves.currentRowIndex = move.currentRowIndex;
                    moves.currentColumnIndex = move.currentColumnIndex;
                    moves.nextRowIndex = move.nextRowIndex;
                    moves.nextColumnIndex = move.nextColumnIndex;
                }
            }
        }
        console.log("res moves : ", moves)

        return moves;
      }

}

