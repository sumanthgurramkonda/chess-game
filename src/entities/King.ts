import { Color } from "./Color";
import { Entity } from "./Entity";
import { Type } from "./Type";

export class King extends Entity{

    constructor(rowIndex:number, columnIndex:number,color:Color) {
        super(Type.KING, rowIndex, columnIndex, color);
    }

    clone():Entity | null{
        return new King(this.getRowIndex(),this.getColumnIndex(),this.getColor());
    }

}