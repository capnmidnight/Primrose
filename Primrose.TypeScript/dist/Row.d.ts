import type { Cursor } from "./Cursor";
import type { Token } from "./Grammars";
export declare class Row {
    text: string;
    tokens: Token[];
    startStringIndex: number;
    startTokenIndex: number;
    lineNumber: number;
    static emptyRow(startStringIndex: number, startTokenIndex: number, lineNumber: number): Row;
    private readonly leftCorrections;
    private readonly rightCorrections;
    constructor(text: string, tokens: Token[], startStringIndex: number, startTokenIndex: number, lineNumber: number);
    toString(): string;
    substring(x: number, y?: number): string;
    adjust(cursor: Cursor, dir: number): void;
    get stringLength(): number;
    get endStringIndex(): number;
    get numTokens(): number;
    get endTokenIndex(): number;
}
//# sourceMappingURL=Row.d.ts.map