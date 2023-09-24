import { TokenType } from "./Grammars";
export interface FontStyle {
    readonly backColor: CssColorValue;
    readonly foreColor: CssColorValue;
    readonly fontStyle: string;
    readonly fontWeight: string;
}
export interface Theme extends Partial<Record<TokenType, Partial<FontStyle>>> {
    readonly name: string;
    readonly cursorColor?: CssColorValue;
    readonly unfocused?: CssColorValue;
    readonly currentRowBackColor?: CssColorValue;
    readonly selectedBackColor?: CssColorValue;
    readonly lineNumbers?: Partial<FontStyle>;
    readonly regular?: Partial<FontStyle>;
    readonly strings?: Partial<FontStyle>;
    readonly regexes?: Partial<FontStyle>;
    readonly numbers?: Partial<FontStyle>;
    readonly comments?: Partial<FontStyle>;
    readonly keywords?: Partial<FontStyle>;
    readonly functions?: Partial<FontStyle>;
    readonly members?: Partial<FontStyle>;
    readonly error?: Partial<FontStyle>;
}
export declare const Dark: Theme;
export declare const Light: Theme;
export declare const themes: Readonly<Map<string, Theme>>;
//# sourceMappingURL=themes.d.ts.map