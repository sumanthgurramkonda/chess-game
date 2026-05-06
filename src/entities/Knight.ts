import { Color } from "./Color";
import { Entity } from "./Entity";
import { Type } from "./Type";

export class Knight extends Entity{

    constructor(rowIndex:number, columnIndex:number,color:Color) {
            super(Type.KNIGHT, rowIndex, columnIndex, color);
        }
    
    clone():Entity | null{
        return new Knight(this.getRowIndex(),this.getColumnIndex(),this.getColor());
    }

}