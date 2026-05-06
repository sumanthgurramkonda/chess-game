import { Color } from "./Color";
import { Entity } from "./Entity";
import { Type } from "./Type";

export class Queen extends Entity{

    constructor(rowIndex:number, columnIndex:number,color:Color) {
            super(Type.QUEEN, rowIndex, columnIndex, color);
        }
    
    clone():Entity | null{
        return new Queen(this.getRowIndex(),this.getColumnIndex(),this.getColor());
    }

}