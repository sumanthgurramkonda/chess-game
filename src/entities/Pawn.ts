import { Color } from "./Color";
import { Entity } from "./Entity";
import { Type } from "./Type";

export class Pawn extends Entity{

    constructor(rowIndex:number, columnIndex:number,color:Color) {
            super(Type.PAWN, rowIndex, columnIndex, color);
        }

    clone():Entity | null{
        return new Pawn(this.getRowIndex(),this.getColumnIndex(),this.getColor());
    }

}