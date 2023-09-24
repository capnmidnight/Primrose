import { Theme } from "../themes";
import { Token, TokenType } from "./Token";
export declare class Grammar {
    readonly name: string;
    private readonly grammar;
    constructor(name: string, rules: [TokenType, RegExp][]);
    tokenize(text: string): Token[];
    toHTML(parent: HTMLElement, txt: string, theme: Theme, fontSize: number): void;
}
//# sourceMappingURL=Grammar.d.ts.map