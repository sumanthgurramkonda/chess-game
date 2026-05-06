import { Color } from "./Color";
import { Entity } from "./Entity";
import { Type } from "./Type";

export class Bishop extends Entity{

    constructor(rowIndex:number, columnIndex:number,color:Color) {
            super(Type.BISHOP, rowIndex, columnIndex, color);
    }

    clone():Entity | null{
        return new Bishop(this.getRowIndex(),this.getColumnIndex(),this.getColor());
    }

}