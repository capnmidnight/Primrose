import type { Row } from "./Row";
export declare class Cursor {
    static min(a: Cursor, b: Cursor): Cursor;
    static max(a: Cursor, b: Cursor): Cursor;
    i: number;
    x: number;
    y: number;
    constructor(i?: number, x?: number, y?: number);
    clone(): Cursor;
    toString(): string;
    copy(cursor: Cursor): void;
    fullHome(): void;
    fullEnd(rows: Row[]): void;
    left(rows: Row[], skipAdjust?: boolean): void;
    skipLeft(rows: Row[]): void;
    right(rows: Row[], skipAdjust?: boolean): void;
    skipRight(rows: Row[]): void;
    home(): void;
    end(rows: Row[]): void;
    up(rows: Row[], skipAdjust?: boolean): void;
    down(rows: Row[], skipAdjust?: boolean): void;
    incX(rows: Row[], dx: number): void;
    incY(rows: Row[], dy: number): void;
    setXY(rows: Row[], x: number, y: number): void;
    setI(rows: Row[], i: number): void;
}
//# sourceMappingURL=Cursor.d.ts.map