import type { Token, TokenType } from "./Token";
export declare class Rule {
    readonly name: TokenType;
    readonly test: RegExp;
    constructor(name: TokenType, test: RegExp);
    carveOutMatchedToken(tokens: Token[], j: number): void;
}
//# sourceMappingURL=Rule.d.ts.map