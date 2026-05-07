import { Color } from "./Color";
import type { Type } from "./Type";

export abstract class Entity{

    private readonly name:Type;
    private rowIndex:number;
    private columnIndex:number;
    private readonly color:Color;

    constructor(name:Type, rowIndex:number, columnIndex:number, color:Color) {
        this.name = name;
        this.rowIndex = rowIndex;
        this.columnIndex = columnIndex;
        this.color = color;
    }

    public getName():Type{return this.name;}
    public getRowIndex():number{return this.rowIndex;}
    public getColumnIndex():number{return this.columnIndex;}
    public getColor():Color{return this.color;}

    // public isWhite():boolean{
    //     return this.color===Color.WHITE;
    // }

    public setPosition(rowIndex:number, columnIndex:number):void{
        this.rowIndex = rowIndex;
        this.columnIndex = columnIndex;
    }

    public toJSON():String{

        return JSON.stringify({
            name:this.name,
            rowIndex:this.rowIndex,
            columnIndex:this.columnIndex,
            color:this.color
        });
    }

    abstract clone():Entity | null;


}