
export class Position{
    
    private rowIndex: number;
    private columnIndex: number;

    constructor(rowIndex: number, columnIndex: number){
        this.rowIndex = rowIndex;
        this.columnIndex = columnIndex;
    }

    public getRowIndex(): number{
        return this.rowIndex;
    }
    public getColumnIndex(): number{
        return this.columnIndex;
    }
}