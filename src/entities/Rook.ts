import { Color } from "./Color";
import { Entity } from "./Entity";
import { Type } from "./Type";

export class Rook extends Entity{

    constructor(rowIndex:number, columnIndex:number,color:Color) {
            super(Type.ROOK, rowIndex, columnIndex, color);
        }
    
    clone():Entity | null{
        return new Rook(this.getRowIndex(),this.getColumnIndex(),this.getColor());
    }
}