import { arrayReplace } from "@juniper-lib/collections/arrays";
import { ID } from "@juniper-lib/dom/attrs";
import { CanvasTypes, Context2D, createUtilityCanvas, isCanvas, isHTMLCanvas, resizeContext, setContextSize } from "@juniper-lib/dom/canvas";
import { border, padding as cssPadding, display, getMonospaceFonts, height, overflow, perc, width } from "@juniper-lib/dom/css";
import { onMouseDown, onMouseMove, onMouseOut, onMouseOver, onMouseUp, onTouchEnd, onTouchMove, onTouchStart } from "@juniper-lib/dom/evts";
import { Canvas, InputText, TextArea, HtmlRender, elementClearChildren, getElement } from "@juniper-lib/dom/tags";
import { TypedEvent, TypedEventBase } from "@juniper-lib/events/TypedEventBase";
import { isApple, isFirefox } from "@juniper-lib/tslib/flags";
import { isDefined, isNullOrUndefined, isString } from "@juniper-lib/tslib/typeChecks";
import { Cursor } from "./Cursor";
import { Delayer } from "./Delayer";
import { Grammar, JavaScript, Token, grammars } from "./Grammars";
import { Point } from "./Point";
import { Rectangle } from "./Rectangle";
import { Row } from "./Row";
import { Size } from "./Size";
import { multiLineInput, multiLineOutput, singleLineInput, singleLineOutput } from "./controlTypes";
import { MacOS, Windows } from "./os";
import { Dark as DefaultTheme } from "./themes";

export interface UVEvent {
    uv?: {
        x: number;
        y: number;
    }
}

export interface PointerControlMap {

    /// <summary>
    /// Read's a THREE Raycast intersection to perform the hover gestures.
    // </summary>
    readOverEventUV: () => void;

    /// <summary>
    /// Read's a THREE Raycast intersection to perform the end of the hover gesture.
    // </summary>
    readOutEventUV: () => void;

    /// <summary>
    /// Read's a THREE Raycast intersection to perform mouse-like behavior for primary-button-down gesture.
    // </summary>
    readDownEventUV: (evt: UVEvent) => void;

    /// <summary>
    /// Read's a THREE Raycast intersection to perform mouse-like behavior for primary-button-up gesture.
    // </summary>
    readUpEventUV: (evt: UVEvent) => void;

    /// <summary>
    /// Read's a THREE Raycast intersection to perform mouse-like behavior for move gesture, whether the primary button is pressed or not.
    // </summary>
    readMoveEventUV: (evt: UVEvent) => void;
}

export interface PrimroseOptions {
    readOnly: boolean;
    multiLine: boolean;
    wordWrap: boolean;
    scrollBars: boolean;
    lineNumbers: boolean;
    padding: number;
    fontSize: number;
    language: string | Grammar;
    scaleFactor: number;
    element: HTMLElement | OffscreenCanvas;
    width: number;
    height: number;
}

interface History {
    value: string;
    frontCursor: number;
    backCursor: number;
}

function minDelta(v: number, minV: number, maxV: number): number {
    const dvMinV = v - minV;
    const dvMaxV = v - maxV + 5;
    let dv = 0;
    if (dvMinV < 0 || dvMaxV >= 0) {
        // compare the absolute values, so we get the smallest change
        // regardless of direction.
        dv = Math.abs(dvMinV) < Math.abs(dvMaxV)
            ? dvMinV
            : dvMaxV;
    }

    return dv;
}

//>>>>>>>>>> PRIVATE STATIC FIELDS >>>>>>>>>>
let focusedControl: Primrose = null,
    hoveredControl: Primrose = null;

const publicControls: Primrose[] = [],
    controls: Primrose[] = [],
    wheelScrollSpeed = 4,
    vScrollWidth = 2,
    scrollScale = isFirefox() ? 3 : 100,
    optionDefaults: Partial<PrimroseOptions> = Object.freeze({
        readOnly: false,
        multiLine: true,
        wordWrap: true,
        scrollBars: true,
        lineNumbers: true,
        padding: 0,
        fontSize: 16,
        language: "JavaScript",
        scaleFactor: devicePixelRatio
    }),
    elements: WeakMap<Element, Primrose> = new WeakMap(),
    ready = (document.readyState === "complete"
        ? Promise.resolve("already")
        : new Promise((resolve) => {
            document.addEventListener("readystatechange", () => {
                if (document.readyState === "complete") {
                    resolve("had to wait for it");
                }
            }, false);
        }))
        .then(() => {
            for (const element of document.getElementsByTagName("primrose")) {
                new Primrose({
                    element: element as HTMLElement
                });
            }
        });

//<<<<<<<<<< PRIVATE STATIC FIELDS <<<<<<<<<<

export class Primrose extends TypedEventBase<{
    blur: TypedEvent<"blur">;
    focus: TypedEvent<"focus">;
    over: TypedEvent<"over">;
    out: TypedEvent<"out">;
    update: TypedEvent<"update">;
    change: TypedEvent<"change">;
}>{

    /// <summary>
    /// Registers a new Primrose editor control with the Event Manager, to wire-up key, clipboard, and mouse wheel events, and to manage the currently focused element.
    /// The Event Manager maintains the references in a WeakMap, so when the JS Garbage Collector collects the objects, they will be gone.
    /// Multiple objects may be used to register a single control with the Event Manager without causing issue.This is useful for associating the control with closed objects from other systems, such as Three Mesh objects being targeted for pointer picking.
    /// If you are working with Three, it's recommended to use the Mesh on which you are texturing the canvas as the key when adding the editor to the Event Manager.
    /// </summary>
    static add(key: Element, control: Primrose) {
        if (key !== null) {
            elements.set(key, control);
        }

        if (controls.indexOf(control) === -1) {
            controls.push(control);
            arrayReplace(publicControls, ...controls.slice());

            control.addEventListener("blur", () => {
                focusedControl = null;
            });

            control.addEventListener("focus", () => {
                // make sure the previous control knows it has 
                // gotten unselected.
                if (focusedControl !== null
                    && (!focusedControl.isInDocument
                        || !control.isInDocument)) {
                    focusedControl.blur();
                }
                focusedControl = control;
            });

            control.addEventListener("over", () => {
                hoveredControl = control;
            });

            control.addEventListener("out", () => {
                hoveredControl = null;
            });
        }
    }

    /// <summary>
    /// Checks for the existence of a control, by the key that the user supplied when calling `Primrose.add()`
    /// </summary>
    static has(key: Element) {
        return elements.has(key);
    }

    /// <summary>
    /// Gets the control associated with the given key.
    /// </summary>
    static get(key: Element) {
        return elements.has(key)
            ? elements.get(key)
            : null;
    }

    /// <summary>
    /// The current `Primrose` control that has the mouse hovered over it. In 2D contexts, you probably don't need to check this value, but in WebGL contexts, this is useful for helping Primrose manage events.
    /// If no control is hovered, this returns `null`.
    /// </summary>
    static get hoveredControl() {
        return hoveredControl;
    }


    /// <summary>
    /// The current `Primrose` control that has pointer-focus. It will receive all keyboard and clipboard events. In 2D contexts, you probably don't need to check this value, but in WebGL contexts, this is useful for helping Primrose manage events.
    /// If no control is focused, this returns `null`.
    /// </summary>
    static get focusedControl() {
        return focusedControl;
    }

    /// <summary>
    /// An array of all of the `Primrose` editor controls that Primrose currently knows about.
    /// This array is not mutable and is not the array used by the Event Manager. It is a read-only clone that is created whenever the Event Manager registers or removes a new control
    /// </summary.
    static get editors() {
        return publicControls;
    }

    /// <summary>
    /// A `Promise` that resolves when the document is ready and the Event Manager has finished its initial setup.
    /// </summary>
    static get ready() {
        return ready;
    }

    private _unlocked = false;
    private _value = "";
    private _padding = 0;
    private _fontSize: number = null;
    private _scaleFactor = 2;
    private _readOnly = false;
    private _wordWrap = false;
    private _multiLine = false;
    private _language = JavaScript;
    private _showScrollBars = false;
    private _showLineNumbers = false;
    private _hovered = false;
    private _focused = false;
    private _element: HTMLElement = null;
    private _theme = DefaultTheme;
    private _tabWidth = 2;

    private currentTouchID: number = null;
    private vibX = 0;
    private vibY = 0;
    private tx = 0;
    private ty = 0;
    private canv: CanvasTypes = null;
    private resized = false;
    private pressed = false;
    private tabString = "  ";
    private dragging = false;
    private historyIndex = -1;
    private scrolling = false;
    private tabPressed = false;
    private lineCount = 1;
    private lineCountWidth = 0;
    private controlType = singleLineOutput;
    private maxVerticalScroll = 0;
    private currentValue = "";
    private currentTabIndex = -1;

    private lastCharacterHeight: number = null;
    private lastCharacterWidth: number = null;
    private lastFrontCursor: number = null;
    private lastGridBounds: string = null;
    private lastBackCursor: number = null;
    private lastThemeName: string = null;
    private lastPadding: number = null;
    private lastFocused: boolean = null;
    private lastScrollX: number = null;
    private lastScrollY: number = null;
    private lastScrollDX: number = null;
    private lastScrollDY: number = null;
    private lastFont: string = null;
    private lastText: string = null;

    private readonly history: History[] = [];
    private readonly tokens = new Array<Token>();
    private readonly rows = [Row.emptyRow(0, 0, 0)];
    private readonly scroll = new Point();
    private readonly pointer = new Point();
    private readonly character = new Size();
    private readonly bottomRightGutter = new Size();
    private readonly gridBounds = new Rectangle();
    private readonly tokenBack = new Cursor();
    private readonly tokenFront = new Cursor();
    private readonly backCursor = new Cursor();
    private readonly frontCursor = new Cursor();
    private readonly outEvt = new TypedEvent("out");
    private readonly overEvt = new TypedEvent("over");
    private readonly blurEvt = new TypedEvent("blur");
    private readonly focusEvt = new TypedEvent("focus");
    private readonly changeEvt = new TypedEvent("change");
    private readonly updateEvt = new TypedEvent("update");
    private readonly os = isApple() ? MacOS : Windows;
    private readonly longPress = new Delayer(1000);

    private readonly keyPressCommands: Readonly<Map<string, () => void>>;
    private readonly keyDownCommands: Readonly<Map<string, (evt: KeyboardEvent) => void>>;
    private readonly _mouse: PointerControlMap;
    private readonly _touch: PointerControlMap;

    private readonly surrogate: HTMLTextAreaElement;
    private readonly context: Context2D;
    private readonly fg: CanvasTypes;
    private readonly fgfx: Context2D;
    private readonly bg: CanvasTypes;
    private readonly bgfx: Context2D;
    private readonly tg: CanvasTypes;
    private readonly tgfx: Context2D;

    constructor(options: Partial<PrimroseOptions>) {
        super();

        this.surrogate = getElement<HTMLTextAreaElement>("#primroseSurrogate");
        if (isNullOrUndefined(this.surrogate)) {
            HtmlRender(document.body,
                this.surrogate = TextArea(
                    ID("primroseSurrogate"),
                    display("none")
                )
            );
        }

        //>>>>>>>>>> VALIDATE PARAMETERS >>>>>>>>>>
        options = options || {};

        if (options.element === undefined) {
            options.element = null;
        }

        if (options.element !== null
            && !(options.element instanceof HTMLElement)) {
            throw new Error("element must be null, an instance of HTMLElement, an instance of HTMLCanvaseElement, or an instance of OffscreenCanvas");
        }

        options = Object.assign({}, optionDefaults, options);
        //<<<<<<<<<< VALIDATE PARAMETERS <<<<<<<<<<


        //>>>>>>>>>> KEY EVENT HANDLERS >>>>>>>>>>
        this.keyDownCommands = Object.freeze(new Map<string, (evt: KeyboardEvent) => void>([
            ["CursorUp", () => {
                const minCursor = Cursor.min(this.frontCursor, this.backCursor);
                const maxCursor = Cursor.max(this.frontCursor, this.backCursor);
                minCursor.up(this.rows);
                maxCursor.copy(minCursor);
                this.scrollIntoView(this.frontCursor);
            }],

            ["CursorDown", () => {
                const minCursor = Cursor.min(this.frontCursor, this.backCursor);
                const maxCursor = Cursor.max(this.frontCursor, this.backCursor);
                maxCursor.down(this.rows);
                minCursor.copy(maxCursor);
                this.scrollIntoView(this.frontCursor);
            }],

            ["CursorLeft", () => {
                const minCursor = Cursor.min(this.frontCursor, this.backCursor);
                const maxCursor = Cursor.max(this.frontCursor, this.backCursor);
                if (minCursor.i === maxCursor.i) {
                    minCursor.left(this.rows);
                }
                maxCursor.copy(minCursor);
                this.scrollIntoView(this.frontCursor);
            }],

            ["CursorRight", () => {
                const minCursor = Cursor.min(this.frontCursor, this.backCursor);
                const maxCursor = Cursor.max(this.frontCursor, this.backCursor);
                if (minCursor.i === maxCursor.i) {
                    maxCursor.right(this.rows);
                }
                minCursor.copy(maxCursor);
                this.scrollIntoView(this.frontCursor);
            }],

            ["CursorPageUp", () => {
                const minCursor = Cursor.min(this.frontCursor, this.backCursor);
                const maxCursor = Cursor.max(this.frontCursor, this.backCursor);
                minCursor.incY(this.rows, -this.gridBounds.height);
                maxCursor.copy(minCursor);
                this.scrollIntoView(this.frontCursor);
            }],

            ["CursorPageDown", () => {
                const minCursor = Cursor.min(this.frontCursor, this.backCursor);
                const maxCursor = Cursor.max(this.frontCursor, this.backCursor);
                maxCursor.incY(this.rows, this.gridBounds.height);
                minCursor.copy(maxCursor);
                this.scrollIntoView(this.frontCursor);
            }],

            ["CursorSkipLeft", () => {
                const minCursor = Cursor.min(this.frontCursor, this.backCursor);
                const maxCursor = Cursor.max(this.frontCursor, this.backCursor);
                if (minCursor.i === maxCursor.i) {
                    minCursor.skipLeft(this.rows);
                }
                maxCursor.copy(minCursor);
                this.scrollIntoView(this.frontCursor);
            }],

            ["CursorSkipRight", () => {
                const minCursor = Cursor.min(this.frontCursor, this.backCursor);
                const maxCursor = Cursor.max(this.frontCursor, this.backCursor);
                if (minCursor.i === maxCursor.i) {
                    maxCursor.skipRight(this.rows);
                }
                minCursor.copy(maxCursor);
                this.scrollIntoView(this.frontCursor);
            }],

            ["CursorHome", () => {
                this.frontCursor.home();
                this.backCursor.copy(this.frontCursor);
                this.scrollIntoView(this.frontCursor);
            }],

            ["CursorEnd", () => {
                this.frontCursor.end(this.rows);
                this.backCursor.copy(this.frontCursor);
                this.scrollIntoView(this.frontCursor);
            }],

            ["CursorFullHome", () => {
                this.frontCursor.fullHome();
                this.backCursor.copy(this.frontCursor);
                this.scrollIntoView(this.frontCursor);
            }],

            ["CursorFullEnd", () => {
                this.frontCursor.fullEnd(this.rows);
                this.backCursor.copy(this.frontCursor);
                this.scrollIntoView(this.frontCursor);
            }],

            ["SelectDown", () => {
                this.backCursor.down(this.rows);
                this.scrollIntoView(this.frontCursor);
            }],

            ["SelectLeft", () => {
                this.backCursor.left(this.rows);
                this.scrollIntoView(this.backCursor);
            }],

            ["SelectRight", () => {
                this.backCursor.right(this.rows);
                this.scrollIntoView(this.backCursor);
            }],

            ["SelectUp", () => {
                this.backCursor.up(this.rows);
                this.scrollIntoView(this.backCursor);
            }],

            ["SelectPageDown", () => {
                this.backCursor.incY(this.rows, this.gridBounds.height);
                this.scrollIntoView(this.backCursor);
            }],

            ["SelectPageUp", () => {
                this.backCursor.incY(this.rows, -this.gridBounds.height);
                this.scrollIntoView(this.backCursor);
            }],

            ["SelectSkipLeft", () => {
                this.backCursor.skipLeft(this.rows);
                this.scrollIntoView(this.backCursor);
            }],

            ["SelectSkipRight", () => {
                this.backCursor.skipRight(this.rows);
                this.scrollIntoView(this.backCursor);
            }],

            ["SelectHome", () => {
                this.backCursor.home();
                this.scrollIntoView(this.backCursor);
            }],

            ["SelectEnd", () => {
                this.backCursor.end(this.rows);
                this.scrollIntoView(this.backCursor);
            }],

            ["SelectFullHome", () => {
                this.backCursor.fullHome();
                this.scrollIntoView(this.backCursor);
            }],

            ["SelectFullEnd", () => {
                this.backCursor.fullEnd(this.rows);
                this.scrollIntoView(this.backCursor);
            }],

            ["SelectAll", () => {
                this.frontCursor.fullHome();
                this.backCursor.fullEnd(this.rows);
                this.render();
            }],

            ["ScrollDown", () => {
                if (this.scroll.y < this.rows.length - this.gridBounds.height) {
                    this.scrollBy(0, 1);
                }
            }],

            ["ScrollUp", () => {
                if (this.scroll.y > 0) {
                    this.scrollBy(0, -1);
                }
            }],

            ["DeleteLetterLeft", () => {
                if (this.frontCursor.i === this.backCursor.i) {
                    this.backCursor.left(this.rows);
                }
                this.setSelectedText("");
            }],

            ["DeleteLetterRight", () => {
                if (this.frontCursor.i === this.backCursor.i) {
                    this.backCursor.right(this.rows);
                }
                this.setSelectedText("");
            }],

            ["DeleteWordLeft", () => {
                if (this.frontCursor.i === this.backCursor.i) {
                    this.frontCursor.skipLeft(this.rows);
                }
                this.setSelectedText("");
            }],

            ["DeleteWordRight", () => {
                if (this.frontCursor.i === this.backCursor.i) {
                    this.backCursor.skipRight(this.rows);
                }
                this.setSelectedText("");
            }],

            ["DeleteLine", () => {
                if (this.frontCursor.i === this.backCursor.i) {
                    this.frontCursor.home();
                    this.backCursor.end(this.rows);
                    this.backCursor.right(this.rows);
                }
                this.setSelectedText("");
            }],

            ["Undo", () => {
                this.moveInHistory(-1);
            }],

            ["Redo", () => {
                this.moveInHistory(1);
            }],

            ["InsertTab", () => {
                this.tabPressed = true;
                this.setSelectedText(this.tabString);
            }],

            ["RemoveTab", () => {
                const row = this.rows[this.frontCursor.y];
                const toDelete = Math.min(this.frontCursor.x, this.tabWidth);
                for (let i = 0; i < this.frontCursor.x; ++i) {
                    if (row.text[i] !== " ") {
                        // can only remove tabs at the beginning of a row
                        return;
                    }
                }

                this.backCursor.copy(this.frontCursor);
                this.backCursor.incX(this.rows, -toDelete);
                this.setSelectedText("");
            }]
        ]));


        this.keyPressCommands = Object.freeze(new Map([
            ["AppendNewline", () => {
                if (this.multiLine) {
                    let indent = "";
                    const row = this.rows[this.frontCursor.y].tokens;
                    if (row.length > 0
                        && row[0].type === "whitespace") {
                        indent = row[0].value;
                    }
                    this.setSelectedText("\n" + indent);
                }
                else {
                    this.dispatchEvent(this.changeEvt);
                }
            }],

            ["PrependNewline", () => {
                if (this.multiLine) {
                    let indent = "";
                    const row = this.rows[this.frontCursor.y].tokens;
                    if (row.length > 0
                        && row[0].type === "whitespace") {
                        indent = row[0].value;
                    }
                    this.frontCursor.home();
                    this.backCursor.copy(this.frontCursor);
                    this.setSelectedText(indent + "\n");
                }
                else {
                    this.dispatchEvent(this.changeEvt);
                }
            }],

            ["Undo", () => {
                this.moveInHistory(-1);
            }]
        ]));

        //<<<<<<<<<< KEY EVENT HANDLERS <<<<<<<<<<


        //>>>>>>>>>> UV POINTER EVENT HANDLERS >>>>>>>>>>
        this._mouse = Object.freeze({

            /// <summary>
            /// Read's a THREE Raycast intersection to perform the hover gestures.
            // </summary>
            readOverEventUV: () => this.pointerOver(),

            /// <summary>
            /// Read's a THREE Raycast intersection to perform the end of the hover gesture.
            // </summary>
            readOutEventUV: () => this.pointerOut(),

            /// <summary>
            /// Read's a THREE Raycast intersection to perform mouse-like behavior for primary-button-up gesture.
            // </summary>
            readUpEventUV: () => this.mouseLikePointerUp(),

            /// <summary>
            /// Read's a THREE Raycast intersection to perform mouse-like behavior for primary-button-down gesture.
            // </summary>
            readDownEventUV: this.mouseLikePointerDown(this.setUVPointer),

            /// <summary>
            /// Read's a THREE Raycast intersection to perform mouse-like behavior for move gesture, whether the primary button is pressed or not.
            // </summary>
            readMoveEventUV: this.mouseLikePointerMove(this.setUVPointer)
        });

        this._touch = Object.freeze({

            /// <summary>
            /// Read's a THREE Raycast intersection to perform the end of the hover gesture. This is the same as mouse.readOverEventUV, included for completeness.
            // </summary>
            readOverEventUV: () => this.pointerOver(),

            /// <summary>
            /// Read's a THREE Raycast intersection to perform the end of the hover gesture. This is the same as mouse.readOutEventUV, included for completeness.
            // </summary>
            readOutEventUV: () => this.pointerOut(),

            /// <summary>
            /// Read's a THREE Raycast intersection to perform touch-like behavior for the first finger moving gesture.
            // </summary>
            readUpEventUV: () => this.touchLikePointerUp(),

            /// <summary>
            /// Read's a THREE Raycast intersection to perform touch-like behavior for the first finger touching down gesture.
            // </summary>
            readDownEventUV: this.touchLikePointerDown(this.setUVPointer),

            /// <summary>
            /// Read's a THREE Raycast intersection to perform touch-like behavior for the first finger raising up gesture.
            // </summary>
            readMoveEventUV: this.touchLikePointerMove(this.setUVPointer)
        });

        //<<<<<<<<<< UV POINTER EVENT HANDLERS <<<<<<<<<<
        //<<<<<<<<<< POINTER EVENT HANDLERS <<<<<<<<<<

        //>>>>>>>>>> SETUP CANVAS >>>>>>>>>>

        if (isHTMLCanvas(options.element)) {
            const elem = options.element;
            const width = elem.width;
            const height = elem.height;
            this.currentTabIndex = elem.tabIndex;

            const optionsStr = elem.dataset.options || "";
            const entries = optionsStr.trim().split(",");
            const optionUser: Partial<PrimroseOptions> = {};
            for (let entry of entries) {
                entry = entry.trim();
                if (entry.length > 0) {
                    const pairs = entry.split("=");
                    if (pairs.length > 1) {
                        const key = pairs[0].trim();
                        const value = pairs[1].trim();
                        const boolTest = value.toLocaleLowerCase();
                        if (boolTest === "true"
                            || boolTest === "false") {
                            (optionUser as any)[key] = boolTest === "true";
                        }
                        else {
                            (optionUser as any)[key] = value;
                        }
                    }
                }
            }

            this.currentValue = elem.textContent;
            options = Object.assign(
                options,
                { width, height },
                optionUser);
        }


        if (isNullOrUndefined(options.element)
            || isCanvas(options.element)) {
            this.canv = isCanvas(options.element)
                ? options.element
                : createUtilityCanvas(options.width, options.height);
            if (isHTMLCanvas(this.canv)) {
                this._element = this.canv;
            }
            else if ("window" in globalThis) {
                this._element = InputText();
                //document.body.appendChild(this._element);
            }
        }
        else {
            this._element = options.element;
            elementClearChildren(this.element);

            this.canv = Canvas(
                width(perc(100)),
                height(perc(100))
            );
            this.element.appendChild(this.canv);
            this.element.removeAttribute("tabindex");

            HtmlRender(this.element,
                display("block"),
                cssPadding(0),
                border("2px inset #c0c0c0"),
                overflow("unset")
            );
        }

        if (this.canv instanceof HTMLCanvasElement
            && this.isInDocument) {

            if (this.currentTabIndex === -1) {
                const tabbableElements = document.querySelectorAll<HTMLElement>("[tabindex]");
                for (const tabbableElement of tabbableElements) {
                    this.currentTabIndex = Math.max(this.currentTabIndex, tabbableElement.tabIndex);
                }
                ++this.currentTabIndex;
            }

            this.canv.tabIndex = this.currentTabIndex;
            this.canv.style.touchAction = "none";
            this.canv.addEventListener("focus", () => this.focus());
            this.canv.addEventListener("blur", () => this.blur());

            this.set2DMouseEvents(this.canv);
            this.set2DTouchEvents(this.canv);

            new ResizeObserver(() => this.resize()).observe(this.canv);
        }
        //<<<<<<<<<< SETUP CANVAS <<<<<<<<<<

        //>>>>>>>>>> SETUP BUFFERS >>>>>>>>>>

        this.context = this.canv.getContext("2d") as Context2D;
        this.fg = createUtilityCanvas(this.canv.width, this.canv.height);
        this.fgfx = this.fg.getContext("2d") as Context2D;
        this.bg = createUtilityCanvas(this.canv.width, this.canv.height);
        this.bgfx = this.bg.getContext("2d") as Context2D;
        this.tg = createUtilityCanvas(this.canv.width, this.canv.height);
        this.tgfx = this.tg.getContext("2d") as Context2D;

        this.context.imageSmoothingEnabled
            = this.fgfx.imageSmoothingEnabled
            = this.bgfx.imageSmoothingEnabled
            = this.tgfx.imageSmoothingEnabled
            = true;
        this.context.textBaseline
            = this.fgfx.textBaseline
            = this.bgfx.textBaseline
            = this.tgfx.textBaseline
            = "top";

        this.tgfx.textAlign = "right";
        this.fgfx.textAlign = "left";
        //<<<<<<<<<< SETUP BUFFERS <<<<<<<<<<

        //>>>>>>>>>> INITIALIZE STATE >>>>>>>>>>

        this.longPress.addEventListener("tick", () => {
            this.startSelecting();
            this.backCursor.copy(this.frontCursor);
            this.frontCursor.skipLeft(this.rows);
            this.backCursor.skipRight(this.rows);
            this.render();
            navigator.vibrate(20);
        });

        this.addEventListener("blur", () => {
            if (this.tabPressed) {
                this.tabPressed = false;
                this.focus();
            }
        });

        let language: Grammar = null;
        if (options.language instanceof Grammar) {
            language = options.language;
        }
        else if (isString(options.language)) {
            options.language = options.language.toLocaleLowerCase();
            if (grammars.has(options.language)) {
                language = grammars.get(options.language);
            }
        }

        Object.freeze(options);

        Object.seal(this);
        this.readOnly = options.readOnly;
        this.multiLine = options.multiLine;
        this.wordWrap = options.wordWrap;
        this.showScrollBars = options.scrollBars;
        this.showLineNumbers = options.lineNumbers;
        this.padding = options.padding;
        this.fontSize = options.fontSize;
        this.language = language;
        this.scaleFactor = options.scaleFactor;
        this.value = this.currentValue;
        //<<<<<<<<<< INITIALIZE STATE <<<<<<<<<<

        this._unlocked = true;

        // This is done last so that controls that have errored 
        // out during their setup don't get added to the control
        // manager.
        Primrose.add(this.element, this);
    }


    private _renderTimer: number = null;
    render() {
        if (isDefined(this._renderTimer)) {
            clearTimeout(this._renderTimer);
            this._renderTimer = null;
        }

        setTimeout(() => {
            this._renderTimer = null;
            if (this._unlocked) {
                this.doRender();
            }
        }, 0);
    }



    /// <summary>
    /// The DOM element that was used to construct the `Primrose` control out of the document tree.If the Control was not constructed from the document tree, this value will be`null`.
    /// </summary>
    get element() {
        return this._element;
    }

    /// <summary>
    /// Returns `false` if `element` is null. Returns `true` otherwise.
    /// </summary>
    get isInDocument() {
        return isHTMLCanvas(this.canv)
            && document.body.contains(this.canv);
    }

    /// <summary>
    /// The canvas to which the editor is rendering text. If the `options.element` value was set to a canvas, that canvas will be returned. Otherwise, the canvas will be the canvas that Primrose created for the control. If `OffscreenCanvas` is not available, the canvas will be an `HTMLCanvasElement`.
    /// </summary>
    get canvas() {
        return this.canv;
    }


    /// <summary>
    /// Returns `true` when the control has a pointer hovering over it.
    /// </summary>
    get hovered() {
        return this._hovered;
    }


    /// <summary>
    /// Returns `true` when the control has been selected.Writing to this value will change the focus state of the control.
    /// If the control is already focused and`focused` is set to`true`, or the control is not focused and`focus` is set to`false`, nothing happens.
    /// If the control is focused and`focused` is set to`false`, the control is blurred, just as if `blur()` was called.
    /// If the control is not focused and`focused` is set to`true`, the control is blurred, just as if `focus()` was called.
    /// </summary>
    get focused() {
        return this._focused;
    }

    set focused(f) {
        if (f !== this.focused) {
            if (f) {
                this.focus();
            }
            else {
                this.blur();
            }
        }
    }

    /// <summary>
    /// Indicates whether or not the text in the editor control can be modified.
    /// </summary>
    get readOnly() {
        return this._readOnly;
    }

    set readOnly(r) {
        r = !!r;
        if (r !== this.readOnly) {
            this._readOnly = r;
            this.refreshControlType();
        }
    }


    get multiLine() {
        return this._multiLine;
    }

    set multiLine(m) {
        m = !!m;
        if (m !== this.multiLine) {
            if (!m && this.wordWrap) {
                this.wordWrap = false;
            }
            this._multiLine = m;
            this.refreshControlType();
            this.refreshGutter();
        }
    }


    /// <summary>
    /// Indicates whether or not the text in the editor control will be broken across lines when it reaches the right edge of the editor control.
    /// </summary>
    get wordWrap() {
        return this._wordWrap;
    }

    set wordWrap(w) {
        w = !!w;
        if (w !== this.wordWrap
            && (this.multiLine
                || !w)) {
            this._wordWrap = w;
            this.refreshGutter();
            this.render();
        }
    }


    /// <summary>
    /// The text value contained in the control. NOTE: if the text value was set with Windows-style newline characters (`\r\n`), the newline characters will be normalized to Unix-style newline characters (`\n`).
    /// </summary>
    get value() {
        return this._value;
    }

    set value(txt) {
        this.setValue(txt, true);
    }


    /// <summary>
    /// A synonymn for `value`
    /// </summary>
    get text() {
        return this.value;
    }

    set text(txt) {
        this.setValue(txt, true);
    }


    /// <summary>
    /// The range of text that is currently selected by the cursor. If no text is selected, reading `selectedText` returns the empty string (`""`) and writing to it inserts text at the current cursor location. 
    /// If text is selected, reading `selectedText` returns the text between the front and back cursors, writing to it overwrites the selected text, inserting the provided value.
    /// </summary>
    get selectedText() {
        const minCursor = Cursor.min(this.frontCursor, this.backCursor);
        const maxCursor = Cursor.max(this.frontCursor, this.backCursor);
        return this.value.substring(minCursor.i, maxCursor.i);
    }

    set selectedText(txt) {
        this.setSelectedText(txt);
    }

    /// <summary>
    /// The string index at which the front cursor is located. NOTE: the "front cursor" is the main cursor, but does not necessarily represent the beginning of the selction range. The selection range runs from the minimum of front and back cursors, to the maximum.
    /// </summary>
    get selectionStart() {
        return this.frontCursor.i;
    }

    set selectionStart(i) {
        i = i | 0;
        if (i !== this.frontCursor.i) {
            this.frontCursor.setI(this.rows, i);
            this.render();
        }
    }


    /// <summary>
    /// The string index at which the back cursor is located. NOTE: the "back cursor" is the selection range cursor, but does not necessarily represent the end of the selction range. The selection range runs from the minimum of front and back cursors, to the maximum.
    /// </summary>
    get selectionEnd() {
        return this.backCursor.i;
    }

    set selectionEnd(i) {
        i = i | 0;
        if (i !== this.backCursor.i) {
            this.backCursor.setI(this.rows, i);
            this.render();
        }
    }


    /// <summary>
    /// If the back cursor is behind the front cursor, this value returns `"backward"`. Otherwise, `"forward"` is returned.
    /// </summary>
    get selectionDirection() {
        return this.frontCursor.i <= this.backCursor.i
            ? "forward"
            : "backward";
    }

    /// <summary>
    /// The number of spaces to insert when the <kbd>Tab</kbd> key is pressed. Changing this value does not convert existing tabs, it only changes future tabs that get inserted.
    /// </summary>
    get tabWidth() {
        return this._tabWidth;
    }

    set tabWidth(tw) {
        this._tabWidth = tw || 2;
        this.tabString = "";
        for (let i = 0; i < this.tabWidth; ++i) {
            this.tabString += " ";
        }
    }


    /// <summary>
    /// A JavaScript object that defines the color and style values for rendering different UI and text elements.
    /// </summary>
    get theme() {
        return this._theme;
    }

    set theme(t) {
        if (t !== this.theme) {
            this._theme = t;
            this.render();
        }
    }


    /// <summary>
    /// Set or get the language pack used to tokenize the control text for syntax highlighting.
    /// </summary>
    get language() {
        return this._language;
    }

    set language(l) {
        if (l !== this.language) {
            this._language = l;
            this.refreshAllTokens();
        }
    }


    /// <summary>
    /// The `Number` of pixels to inset the control rendering from the edge of the canvas. This is useful for texturing objects where the texture edge cannot be precisely controlled. This value is scale-independent.
    /// </summary>
    get padding() {
        return this._padding;
    }

    set padding(p) {
        p = p | 0;
        if (p !== this.padding) {
            this._padding = p;
            this.render();
        }
    }


    /// <summary>
    /// Indicates whether or not line numbers should be rendered on the left side of the control.
    /// </summary>
    get showLineNumbers() {
        return this._showLineNumbers;
    }

    set showLineNumbers(s) {
        s = s || false;
        if (s !== this.showLineNumbers) {
            this._showLineNumbers = s;
            this.refreshGutter();
        }
    }


    /// <summary>
    /// Indicates whether or not scroll bars should be rendered at the right and bottom in the control. If wordWrap is enabled, the bottom, horizontal scrollbar will not be rendered.
    /// </summary>
    get showScrollBars() {
        return this._showScrollBars;
    }

    set showScrollBars(s) {
        s = s || false;
        if (s !== this.showScrollBars) {
            this._showScrollBars = s;
            this.refreshGutter();
        }
    }


    /// <summary>
    /// The `Number` of pixels tall to draw characters. This value is scale-independent.
    /// </summary>
    get fontSize() {
        return this._fontSize;
    }

    set fontSize(s) {
        s = Math.max(1, s || 0);
        if (s !== this.fontSize) {
            this._fontSize = s;
            this.context.font = `${this.fontSize}px ${getMonospaceFonts()}`;
            this.character.height = this.fontSize;
            // measure 100 letter M's, then divide by 100, to get the width of an M
            // to two decimal places on systems that return integer values from
            // measureText.
            this.character.width = this.context.measureText(
                "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM")
                .width /
                100;
            this.refreshAllTokens();
        }
    }


    /// <summary>
    /// The value by which pixel values are scaled before being used by the editor control.
    /// With THREE, it's best to set this value to 1 and change the width, height, and fontSize manually.
    /// </summary>
    get scaleFactor() {
        return this._scaleFactor;
    }

    set scaleFactor(s) {
        s = Math.max(0.25, Math.min(4, s || 0));
        if (s !== this.scaleFactor) {
            const lastWidth = this.width;
            const lastHeight = this.height;
            this._scaleFactor = s;
            this.setSize(lastWidth, lastHeight);
        }
    }


    /// <summary>
    /// The scale-independent width of the editor control.
    /// </summary>
    get width() {
        return this.canv.width / this.scaleFactor;
    }

    set width(w) {
        this.setSize(w, this.height);
    }


    /// <summary>
    /// The scale-independent height of the editor control.
    /// </summary>
    get height() {
        return this.canv.height / this.scaleFactor;
    }

    set height(h) {
        this.setSize(this.width, h);
    }

    get mouse() {
        return this._mouse;
    }

    get touch() {
        return this._touch;
    }


    //>>>>>>>>>> PRIVATE METHODS >>>>>>>>>>
    //>>>>>>>>>> RENDERING >>>>>>>>>>

    private fillRect(gfx: Context2D, fill: CssColorValue, x: number, y: number, w: number, h: number) {
        gfx.fillStyle = fill;
        gfx.fillRect(
            x * this.character.width,
            y * this.character.height,
            w * this.character.width + 1,
            h * this.character.height + 1);
    }

    private strokeRect(gfx: Context2D, stroke: CssColorValue, x: number, y: number, w: number, h: number) {
        gfx.strokeStyle = stroke;
        gfx.strokeRect(
            x * this.character.width,
            y * this.character.height,
            w * this.character.width + 1,
            h * this.character.height + 1);
    }

    private renderCanvasBackground() {
        const minCursor = Cursor.min(this.frontCursor, this.backCursor);
        const maxCursor = Cursor.max(this.frontCursor, this.backCursor);

        this.bgfx.clearRect(0, 0, this.canv.width, this.canv.height);
        if (this.theme.regular.backColor) {
            this.bgfx.fillStyle = this.theme.regular.backColor;
            this.bgfx.fillRect(0, 0, this.canv.width, this.canv.height);
        }

        this.bgfx.save();
        this.bgfx.scale(this.scaleFactor, this.scaleFactor);
        this.bgfx.translate(
            (this.gridBounds.x - this.scroll.x) * this.character.width + this.padding,
            -this.scroll.y * this.character.height + this.padding);


        // draw the current row highlighter
        if (this.focused) {
            this.fillRect(this.bgfx, this.theme.currentRowBackColor ||
                DefaultTheme.currentRowBackColor,
            0, minCursor.y,
            this.gridBounds.width,
            maxCursor.y - minCursor.y + 1);
        }

        const minY = this.scroll.y | 0;
        const maxY = minY + this.gridBounds.height;
        const minX = this.scroll.x | 0;
        const maxX = minX + this.gridBounds.width;
        this.tokenFront.setXY(this.rows, 0, minY);
        this.tokenBack.copy(this.tokenFront);
        for (let y = minY; y <= maxY && y < this.rows.length; ++y) {
            // draw the tokens on this row
            const row = this.rows[y].tokens;
            for (let i = 0; i < row.length; ++i) {
                const t = row[i];
                this.tokenBack.x += t.length;
                this.tokenBack.i += t.length;

                // skip drawing tokens that aren't in view
                if (minX <= this.tokenBack.x && this.tokenFront.x <= maxX) {
                    // draw the selection box
                    const inSelection = minCursor.i <= this.tokenBack.i
                        && this.tokenFront.i < maxCursor.i;
                    if (inSelection) {
                        const selectionFront = Cursor.max(minCursor, this.tokenFront);
                        const selectionBack = Cursor.min(maxCursor, this.tokenBack);
                        const cw = selectionBack.i - selectionFront.i;
                        this.fillRect(this.bgfx, this.theme.selectedBackColor ||
                            DefaultTheme.selectedBackColor,
                        selectionFront.x, selectionFront.y,
                        cw, 1);
                    }
                }

                this.tokenFront.copy(this.tokenBack);
            }

            this.tokenFront.x = 0;
            ++this.tokenFront.y;
            this.tokenBack.copy(this.tokenFront);
        }

        // draw the cursor caret
        if (this.focused) {
            const cc = this.theme.cursorColor || DefaultTheme.cursorColor;
            const w = 1 / this.character.width;
            this.fillRect(this.bgfx, cc, minCursor.x, minCursor.y, w, 1);
            this.fillRect(this.bgfx, cc, maxCursor.x, maxCursor.y, w, 1);
        }
        this.bgfx.restore();
    }

    private renderCanvasForeground() {
        this.fgfx.clearRect(0, 0, this.canv.width, this.canv.height);
        this.fgfx.save();
        this.fgfx.scale(this.scaleFactor, this.scaleFactor);
        this.fgfx.translate(
            (this.gridBounds.x - this.scroll.x) * this.character.width + this.padding,
            this.padding);

        const minY = this.scroll.y | 0;
        const maxY = minY + this.gridBounds.height;
        const minX = this.scroll.x | 0;
        const maxX = minX + this.gridBounds.width;
        this.tokenFront.setXY(this.rows, 0, minY);
        this.tokenBack.copy(this.tokenFront);
        for (let y = minY; y <= maxY && y < this.rows.length; ++y) {
            // draw the tokens on this row
            const row = this.rows[y].tokens;
            const textY = (y - this.scroll.y) * this.character.height;

            for (let i = 0; i < row.length; ++i) {
                const t = row[i];
                this.tokenBack.x += t.length;
                this.tokenBack.i += t.length;

                // skip drawing tokens that aren't in view
                if (minX <= this.tokenBack.x && this.tokenFront.x <= maxX) {

                    // draw the text
                    const style = this.theme[t.type] || {};
                    const fontWeight = style.fontWeight
                        || this.theme.regular.fontWeight
                        || DefaultTheme.regular.fontWeight
                        || "",
                        fontStyle = style.fontStyle
                            || this.theme.regular.fontStyle
                            || DefaultTheme.regular.fontStyle
                            || "",
                        font = `${fontWeight} ${fontStyle} ${this.context.font}`;
                    this.fgfx.font = font.trim();
                    this.fgfx.fillStyle = style.foreColor || this.theme.regular.foreColor;
                    this.fgfx.fillText(
                        t.value,
                        this.tokenFront.x * this.character.width,
                        textY);
                }

                this.tokenFront.copy(this.tokenBack);
            }

            this.tokenFront.x = 0;
            ++this.tokenFront.y;
            this.tokenBack.copy(this.tokenFront);
        }

        this.fgfx.restore();
    }

    private renderCanvasTrim() {
        this.tgfx.clearRect(0, 0, this.canv.width, this.canv.height);
        this.tgfx.save();
        this.tgfx.scale(this.scaleFactor, this.scaleFactor);
        this.tgfx.translate(this.padding, this.padding);

        if (this.showLineNumbers) {
            this.fillRect(this.tgfx,
                this.theme.selectedBackColor ||
                DefaultTheme.selectedBackColor,
                0, 0,
                this.gridBounds.x, this.width - this.padding * 2);
            this.strokeRect(this.tgfx,
                this.theme.regular.foreColor ||
                DefaultTheme.regular.foreColor,
                0, 0,
                this.gridBounds.x, this.height - this.padding * 2);
        }

        let maxRowWidth = 2;
        this.tgfx.save();
        {
            this.tgfx.translate((this.lineCountWidth - 0.5) * this.character.width, -this.scroll.y * this.character.height);
            let lastLineNumber = -1;
            const minY = this.scroll.y | 0;
            const maxY = minY + this.gridBounds.height;
            this.tokenFront.setXY(this.rows, 0, minY);
            this.tokenBack.copy(this.tokenFront);
            for (let y = minY; y <= maxY && y < this.rows.length; ++y) {
                const row = this.rows[y];
                maxRowWidth = Math.max(maxRowWidth, row.stringLength);
                if (this.showLineNumbers) {
                    // draw the left gutter
                    if (row.lineNumber > lastLineNumber) {
                        lastLineNumber = row.lineNumber;
                        this.tgfx.font = "bold " + this.context.font;
                        this.tgfx.fillStyle = this.theme.regular.foreColor;
                        this.tgfx.fillText(
                            row.lineNumber.toFixed(0),
                            0, y * this.character.height);
                    }
                }
            }
        }
        this.tgfx.restore();

        // draw the scrollbars
        if (this.showScrollBars) {
            this.tgfx.fillStyle = this.theme.selectedBackColor ||
                DefaultTheme.selectedBackColor;

            // horizontal
            if (!this.wordWrap && maxRowWidth > this.gridBounds.width) {
                const drawWidth = this.gridBounds.width * this.character.width - this.padding;
                const scrollX = (this.scroll.x * drawWidth) / maxRowWidth + this.gridBounds.x * this.character.width;
                const scrollBarWidth = drawWidth * (this.gridBounds.width / maxRowWidth);
                const by = this.height - this.character.height - this.padding;
                const bw = Math.max(this.character.width, scrollBarWidth);
                this.tgfx.fillRect(scrollX, by, bw, this.character.height);
                this.tgfx.strokeRect(scrollX, by, bw, this.character.height);
            }

            //vertical
            if (this.rows.length > this.gridBounds.height) {
                const drawHeight = this.gridBounds.height * this.character.height;
                const scrollY = (this.scroll.y * drawHeight) / this.rows.length;
                const scrollBarHeight = drawHeight * (this.gridBounds.height / this.rows.length);
                const bx = this.width - vScrollWidth * this.character.width - 2 * this.padding;
                const bw = vScrollWidth * this.character.width;
                const bh = Math.max(this.character.height, scrollBarHeight);
                this.tgfx.fillRect(bx, scrollY, bw, bh);
                this.tgfx.strokeRect(bx, scrollY, bw, bh);
            }
        }

        this.tgfx.restore();
        if (!this.focused) {
            this.tgfx.fillStyle = this.theme.unfocused || DefaultTheme.unfocused;
            this.tgfx.fillRect(0, 0, this.canv.width, this.canv.height);
        }
    }

    private doRender() {
        if (this.theme) {
            const textChanged = this.lastText !== this.value;
            const focusChanged = this.focused !== this.lastFocused;
            const fontChanged = this.context.font !== this.lastFont;
            const paddingChanged = this.padding !== this.lastPadding;
            const themeChanged = this.theme.name !== this.lastThemeName;
            const boundsChanged = this.gridBounds.toString() !== this.lastGridBounds;
            const characterWidthChanged = this.character.width !== this.lastCharacterWidth;
            const characterHeightChanged = this.character.height !== this.lastCharacterHeight;

            const cursorChanged = this.frontCursor.i !== this.lastFrontCursor
                || this.backCursor.i !== this.lastBackCursor,

                scrollChanged = this.scroll.x !== this.lastScrollX
                    || this.scroll.y !== this.lastScrollY,

                layoutChanged = this.resized
                    || boundsChanged
                    || textChanged
                    || characterWidthChanged
                    || characterHeightChanged
                    || paddingChanged
                    || scrollChanged
                    || themeChanged,

                backgroundChanged = layoutChanged
                    || cursorChanged,

                foregroundChanged = layoutChanged
                    || fontChanged,

                trimChanged = layoutChanged
                    || focusChanged;

            if (backgroundChanged) {
                this.renderCanvasBackground();
            }
            if (foregroundChanged) {
                this.renderCanvasForeground();
            }
            if (trimChanged) {
                this.renderCanvasTrim();
            }

            this.context.clearRect(0, 0, this.canv.width, this.canv.height);
            this.context.save();
            this.context.translate(this.vibX, this.vibY);
            this.context.drawImage(this.bg, 0, 0);
            this.context.drawImage(this.fg, 0, 0);
            this.context.drawImage(this.tg, 0, 0);
            this.context.restore();

            this.lastGridBounds = this.gridBounds.toString();
            this.lastText = this.value;
            this.lastCharacterWidth = this.character.width;
            this.lastCharacterHeight = this.character.height;
            this.lastPadding = this.padding;
            this.lastFrontCursor = this.frontCursor.i;
            this.lastBackCursor = this.backCursor.i;
            this.lastFocused = this.focused;
            this.lastFont = this.context.font;
            this.lastThemeName = this.theme.name;
            this.lastScrollX = this.scroll.x;
            this.lastScrollY = this.scroll.y;
            this.resized = false;
            this.dispatchEvent(this.updateEvt);
        }
    }
    //<<<<<<<<<< RENDERING <<<<<<<<<<

    private refreshControlType() {
        const lastControlType = this.controlType;

        if (this.readOnly && this.multiLine) {
            this.controlType = multiLineOutput;
        }
        else if (this.readOnly && !this.multiLine) {
            this.controlType = singleLineOutput;
        }
        else if (!this.readOnly && this.multiLine) {
            this.controlType = multiLineInput;
        }
        else {
            this.controlType = singleLineInput;
        }

        if (this.controlType !== lastControlType) {
            this.refreshAllTokens();
        }
    }

    private refreshGutter() {
        if (!this.showScrollBars) {
            this.bottomRightGutter.set(0, 0);
        }
        else if (this.wordWrap) {
            this.bottomRightGutter.set(vScrollWidth, 0);
        }
        else {
            this.bottomRightGutter.set(vScrollWidth, 1);
        }
    }

    private setValue(txt: string, setUndo: boolean) {
        txt = txt || "";
        txt = txt.replace(/\r\n/g, "\n");
        if (txt !== this.value) {
            this._value = txt;
            if (setUndo) {
                this.pushUndo();
            }
            this.refreshAllTokens();
            this.dispatchEvent(this.changeEvt);
        }
    }

    private setSelectedText(txt: string) {
        txt = txt || "";
        txt = txt.replace(/\r\n/g, "\n");

        if (this.frontCursor.i !== this.backCursor.i || txt.length > 0) {
            const minCursor = Cursor.min(this.frontCursor, this.backCursor);
            const maxCursor = Cursor.max(this.frontCursor, this.backCursor);
            const startRow = this.rows[minCursor.y];
            const endRow = this.rows[maxCursor.y];

            const unchangedLeft = this.value.substring(0, startRow.startStringIndex);
            const unchangedRight = this.value.substring(endRow.endStringIndex);

            const changedStartSubStringIndex = minCursor.i - startRow.startStringIndex;
            const changedLeft = startRow.substring(0, changedStartSubStringIndex);

            const changedEndSubStringIndex = maxCursor.i - endRow.startStringIndex;
            const changedRight = endRow.substring(changedEndSubStringIndex);

            const changedText = changedLeft + txt + changedRight;

            this._value = unchangedLeft + changedText + unchangedRight;
            this.pushUndo();

            this.refreshTokens(minCursor.y, maxCursor.y, changedText);
            this.frontCursor.setI(this.rows, minCursor.i + txt.length);
            this.backCursor.copy(this.frontCursor);
            this.scrollIntoView(this.frontCursor);
            this.dispatchEvent(this.changeEvt);
        }
    }

    private refreshAllTokens() {
        this.refreshTokens(0, this.rows.length - 1, this.value);
    }

    private refreshTokens(startY: number, endY: number, txt: string) {
        if (this._unlocked) {
            while (startY > 0
                && this.rows[startY].lineNumber === this.rows[startY - 1].lineNumber) {
                --startY;
                txt = this.rows[startY].text + txt;
            }

            while (endY < this.rows.length - 1
                && this.rows[endY].lineNumber === this.rows[endY + 1].lineNumber
                && this.rows[endY + 1].tokens.length > 0) {
                ++endY;
                txt += this.rows[endY].text;
            }


            const newTokens = this.language.tokenize(txt);
            const startRow = this.rows[startY];
            const startTokenIndex = startRow.startTokenIndex;
            const startLineNumber = startRow.lineNumber;
            const startStringIndex = startRow.startStringIndex;
            const endRow = this.rows[endY];
            const endTokenIndex = endRow.endTokenIndex;
            const tokenRemoveCount = endTokenIndex - startTokenIndex;
            const oldTokens = this.tokens.splice(startTokenIndex, tokenRemoveCount, ...newTokens);

            // figure out the width of the line count gutter
            this.lineCountWidth = 0;
            if (this.showLineNumbers) {
                for (const token of oldTokens) {
                    if (token.type === "newlines") {
                        --this.lineCount;
                    }
                }

                for (const token of newTokens) {
                    if (token.type === "newlines") {
                        ++this.lineCount;
                    }
                }

                this.lineCountWidth = Math.max(1, Math.ceil(Math.log(this.lineCount) / Math.LN10)) + 1;
            }

            // measure the grid
            const x = Math.floor(this.lineCountWidth + this.padding / this.character.width);
            const y = Math.floor(this.padding / this.character.height);
            const w = Math.floor((this.width - 2 * this.padding) / this.character.width) - x - this.bottomRightGutter.width;
            const h = Math.floor((this.height - 2 * this.padding) / this.character.height) - y - this.bottomRightGutter.height;
            this.gridBounds.set(x, y, w, h);

            // Perform the layout
            const tokenQueue = newTokens.map(t => t.clone());
            const rowRemoveCount = endY - startY + 1;
            const newRows = [];

            let currentString = "";
            let currentTokens = [];
            let currentStringIndex = startStringIndex;
            let currentTokenIndex = startTokenIndex;
            let currentLineNumber = startLineNumber;

            for (let i = 0; i < tokenQueue.length; ++i) {
                const t = tokenQueue[i];
                const widthLeft = this.gridBounds.width - currentString.length;
                const wrap = this.wordWrap && t.type !== "newlines" && t.length > widthLeft;
                const breakLine = t.type === "newlines" || wrap;

                if (wrap) {
                    const split = t.length > this.gridBounds.width
                        ? widthLeft
                        : 0;
                    tokenQueue.splice(i + 1, 0, t.splitAt(split));
                }

                currentTokens.push(t);
                currentString += t.value;

                if (breakLine
                    || i === tokenQueue.length - 1) {
                    newRows.push(new Row(currentString, currentTokens, currentStringIndex, currentTokenIndex, currentLineNumber));
                    currentStringIndex += currentString.length;
                    currentTokenIndex += currentTokens.length;

                    currentTokens = [];
                    currentString = "";

                    if (t.type === "newlines") {
                        ++currentLineNumber;
                    }
                }
            }

            this.rows.splice(startY, rowRemoveCount, ...newRows);

            // renumber rows
            for (let y = startY + newRows.length; y < this.rows.length; ++y) {
                const row = this.rows[y];
                row.lineNumber = currentLineNumber;
                row.startStringIndex = currentStringIndex;
                row.startTokenIndex += currentTokenIndex;

                currentStringIndex += row.stringLength;
                currentTokenIndex += row.numTokens;

                if (row.tokens.length > 0
                    && row.tokens[row.tokens.length - 1].type === "newlines") {
                    ++currentLineNumber;
                }
            }

            // provide editing room at the end of the buffer
            if (this.rows.length === 0) {
                this.rows.push(Row.emptyRow(0, 0, 0));
            }
            else {
                const lastRow = this.rows[this.rows.length - 1];
                if (lastRow.text.endsWith("\n")) {
                    this.rows.push(Row.emptyRow(lastRow.endStringIndex, lastRow.endTokenIndex, lastRow.lineNumber + 1));
                }
            }

            this.maxVerticalScroll = Math.max(0, this.rows.length - this.gridBounds.height);

            this.render();
        }
    }

    private refreshBuffers() {
        this.resized = true;
        setContextSize(this.fgfx, this.canv.width, this.canv.height);
        setContextSize(this.bgfx, this.canv.width, this.canv.height);
        setContextSize(this.tgfx, this.canv.width, this.canv.height);
        this.refreshAllTokens();
    }

    private clampScroll() {
        const toHigh = this.scroll.y < 0 || this.maxVerticalScroll === 0;
        const toLow = this.scroll.y > this.maxVerticalScroll;

        if (toHigh) {
            this.scroll.y = 0;
        }
        else if (toLow) {
            this.scroll.y = this.maxVerticalScroll;
        }
        this.render();

        return toHigh || toLow;
    }

    private scrollIntoView(currentCursor: Cursor) {
        const dx = minDelta(currentCursor.x, this.scroll.x, this.scroll.x + this.gridBounds.width);
        const dy = minDelta(currentCursor.y, this.scroll.y, this.scroll.y + this.gridBounds.height);
        this.scrollBy(dx, dy);
    }

    private pushUndo() {
        if (this.historyIndex < this.history.length - 1) {
            this.history.splice(this.historyIndex + 1);
        }
        this.history.push({
            value: this.value,
            frontCursor: this.frontCursor.i,
            backCursor: this.backCursor.i
        });
        this.historyIndex = this.history.length - 1;
    }

    private moveInHistory(dh: number) {
        const nextHistoryIndex = this.historyIndex + dh;
        if (0 <= nextHistoryIndex && nextHistoryIndex < this.history.length) {
            const curFrame = this.history[this.historyIndex];
            this.historyIndex = nextHistoryIndex;
            const nextFrame = this.history[this.historyIndex];
            this.setValue(nextFrame.value, false);
            this.frontCursor.setI(this.rows, curFrame.frontCursor);
            this.backCursor.setI(this.rows, curFrame.backCursor);
        }
    }

    /// <summary>
    /// Removes focus from the control.
    /// </summary>
    blur() {
        if (this.focused) {
            this._focused = false;
            this.surrogate.blur();
            this.dispatchEvent(this.blurEvt);
            this.render();
        }
    }

    /// <summary>
    /// Sets the control to be the focused control. If all controls in the app have been properly registered with the Event Manager, then any other, currently focused control will first get `blur`red.
    /// </summary>
    focus() {
        if (!this.focused) {
            this._focused = true;
            this.surrogate.focus();
            this.dispatchEvent(this.focusEvt);
            this.render();
        }
    }

    /// <summary>
    /// </summary>
    resize() {
        if (!isHTMLCanvas(this.canv)) {
            console.warn("Can't automatically resize a canvas that is not in the DOM tree");
        }

        else if (resizeContext(this.context as CanvasRenderingContext2D, this.scaleFactor)) {
            this.refreshBuffers();
        }
    }

    /// <summary>
    /// Sets the scale-independent width and height of the editor control.
    /// </summary>
    setSize(w: number, h: number) {
        if (setContextSize(this.context, w, h, this.scaleFactor)) {
            this.refreshBuffers();
        }
    }

    /// <summary>
    /// Move the scroll window to a new location. Values get clamped to the text contents of the editor.
    /// </summary>
    scrollTo(x: number, y: number) {
        if (!this.wordWrap) {
            this.scroll.x = x;
        }
        this.scroll.y = y;
        return this.clampScroll();
    }

    /// <summary>
    /// Move the scroll window by a given amount to a new location. The final location of the scroll window gets clamped to the text contents of the editor.
    /// </summary>
    scrollBy(dx: number, dy: number) {
        return this.scrollTo(this.scroll.x + dx, this.scroll.y + dy);
    }



    readKeyDownEvent(evt: KeyboardEvent) {
        const command = this.os.makeCommand(evt);
        if (this.keyDownCommands.has(command.command)) {
            evt.preventDefault();
            this.keyDownCommands.get(command.command)(evt);
        }
        else if (evt.key === "Tab") {
            evt.preventDefault();
        }
    }

    readKeyPressEvent(evt: KeyboardEvent) {
        const command = this.os.makeCommand(evt);
        if (!this.readOnly) {
            evt.preventDefault();

            if (this.keyPressCommands.has(command.command)) {
                this.keyPressCommands.get(command.command)();
            }
            else if (command.type === "printable"
                || command.type === "whitespace") {
                this.setSelectedText(command.text);
            }

            this.clampScroll();
            this.render();
        }
    }

    private copySelectedText(evt: ClipboardEvent) {
        if (this.focused && this.frontCursor.i !== this.backCursor.i) {
            evt.clipboardData.setData("text/plain", this.selectedText);
            return true;
        }

        return false;
    }

    readCopyEvent(evt: ClipboardEvent) {
        this.copySelectedText(evt);
    }

    readCutEvent(evt: ClipboardEvent) {
        if (this.copySelectedText(evt)
            && !this.readOnly) {
            this.setSelectedText("");
        }
    }

    readPasteEvent(evt: ClipboardEvent) {
        if (this.focused && !this.readOnly) {
            const clipboard = evt.clipboardData;
            const str = clipboard.getData("text/plain");
            if (str) {
                this.setSelectedText(str);
            }
        }
    }


    readWheelEvent(evt: WheelEvent) {
        if (this.hovered || this.focused) {
            if (!evt.ctrlKey
                && !evt.altKey
                && !evt.shiftKey
                && !evt.metaKey) {
                const dy = Math.floor(evt.deltaY * wheelScrollSpeed / scrollScale);
                if (!this.scrollBy(0, dy) || this.focused) {
                    evt.preventDefault();
                }
            }
            else if (!evt.ctrlKey
                && !evt.altKey
                && !evt.metaKey) {
                evt.preventDefault();
                this.fontSize += -evt.deltaY / scrollScale;
            }
            this.render();
        }
    }

    private vibrate(len: number) {
        this.longPress.cancel();
        if (len > 0) {
            this.vibX = (Math.random() - 0.5) * 10;
            this.vibY = (Math.random() - 0.5) * 10;
            setTimeout(() => this.vibrate(len - 10), 10);
        }
        else {
            this.vibX = 0;
            this.vibY = 0;
        }
        this.render();
    }

    private setUVPointer(evt: UVEvent) {
        this.pointer.set(
            evt.uv.x * this.width,
            (1 - evt.uv.y) * this.height);
    }




    //>>>>>>>>>> POINTER EVENT HANDLERS >>>>>>>>>>

    private startSelecting() {
        this.dragging = true;
        this.moveCursor(this.frontCursor);
    }

    private moveCursor(cursor: Cursor) {
        this.pointer.toCell(this.character, this.scroll, this.gridBounds);
        const gx = this.pointer.x - this.scroll.x;
        const gy = this.pointer.y - this.scroll.y;
        const onBottom = gy >= this.gridBounds.height;
        const onLeft = gx < 0;
        const onRight = this.pointer.x >= this.gridBounds.width;

        if (!this.scrolling && !onBottom && !onLeft && !onRight) {
            cursor.setXY(this.rows, this.pointer.x, this.pointer.y);
            this.backCursor.copy(cursor);
        }
        else if (this.scrolling || onRight && !onBottom) {
            this.scrolling = true;
            const scrollHeight = this.rows.length - this.gridBounds.height;
            if (gy >= 0 && scrollHeight >= 0) {
                const sy = gy * scrollHeight / this.gridBounds.height;
                this.scrollTo(this.scroll.x, sy);
            }
        }
        else if (onBottom && !onLeft) {
            let maxWidth = 0;
            for (let dy = 0; dy < this.rows.length; ++dy) {
                maxWidth = Math.max(maxWidth, this.rows[dy].stringLength);
            }
            const scrollWidth = maxWidth - this.gridBounds.width;
            if (gx >= 0 && scrollWidth >= 0) {
                const sx = gx * scrollWidth / this.gridBounds.width;
                this.scrollTo(sx, this.scroll.y);
            }
        }
        else if (onLeft && !onBottom) {
            // clicked in number-line gutter
        }
        else {
            // clicked in the lower-left corner
        }

        this.render();
    }

    private dragScroll() {
        if (this.lastScrollDX !== null
            && this.lastScrollDY !== null) {
            const dx = (this.lastScrollDX - this.pointer.x) / this.character.width;
            const dy = (this.lastScrollDY - this.pointer.y) / this.character.height;
            this.scrollBy(dx, dy);
        }
        this.lastScrollDX = this.pointer.x;
        this.lastScrollDY = this.pointer.y;
    }

    private pointerOver() {
        this._hovered = true;
        this.dispatchEvent(this.overEvt);
    }

    private pointerOut() {
        this._hovered = false;
        this.dispatchEvent(this.outEvt);
    }

    private pointerDown() {
        this.focus();
        this.pressed = true;
    }

    private pointerMove = () => {
        if (this.dragging) {
            this.moveCursor(this.backCursor);
        }
        else if (this.pressed) {
            this.dragScroll();
        }
    };

    private mouseLikePointerDown<T>(setPointer: (evt: T) => void) {
        return (evt: T) => {
            setPointer.call(this, evt);
            this.pointerDown();
            this.startSelecting();
        };
    }

    private mouseLikePointerUp() {
        this.pressed = false;
        this.dragging = false;
        this.scrolling = false;
    }

    private mouseLikePointerMove<T>(setPointer: (evt: T) => void) {
        return (evt: T) => {
            setPointer.call(this, evt);
            this.pointerMove();
        };
    }

    private touchLikePointerDown<T>(setPointer: (evt: T) => void) {
        return (evt: T) => {
            setPointer.call(this, evt);
            this.tx = this.pointer.x;
            this.ty = this.pointer.y;
            this.pointerDown();
            this.longPress.start();
        };
    }

    private touchLikePointerUp() {
        if (this.longPress.cancel() && !this.dragging) {
            this.startSelecting();
        }
        this.mouseLikePointerUp();
        this.lastScrollDX = null;
        this.lastScrollDY = null;
    }

    private touchLikePointerMove<T>(setPointer: (evt: T) => void) {
        return (evt: T) => {
            setPointer.call(this, evt);
            if (this.longPress.isRunning) {
                const dx = this.pointer.x - this.tx;
                const dy = this.pointer.y - this.ty;
                const lenSq = dx * dx + dy * dy;
                if (lenSq > 25) {
                    this.longPress.cancel();
                }
            }

            if (!this.longPress.isRunning) {
                this.pointerMove();
            }
        };
    }


    //>>>>>>>>>> MOUSE EVENT HANDLERS >>>>>>>>>> 
    private setMousePointer(evt: MouseEvent) {
        this.pointer.set(
            evt.offsetX,
            evt.offsetY);
    }

    private readMouseOverEvent() {
        this.pointerOver();
    }

    private readMouseOutEvent() {
        this.pointerOut();
    }


    private readMouseDownEvent(evt: MouseEvent) {
        this.mouseLikePointerDown(this.setMousePointer)(evt);
    }

    private readMouseUpEvent() {
        this.mouseLikePointerUp();
    }

    private readMouseMoveEvent(evt: MouseEvent) {
        this.mouseLikePointerMove(this.setMousePointer)(evt);
    }

    set2DMouseEvents(canv: HTMLElement) {
        HtmlRender(canv,
            onMouseOver(() => this.readMouseOverEvent()),
            onMouseOut(() => this.readMouseOutEvent()),
            onMouseDown((evt) => this.readMouseDownEvent(evt)),
            onMouseMove((evt) => this.readMouseMoveEvent(evt)),
            onMouseUp(() => this.readMouseUpEvent())
        );
    }
    //<<<<<<<<<< MOUSE EVENT HANDLERS <<<<<<<<<<


    //>>>>>>>>>> TOUCH EVENT HANDLERS >>>>>>>>>>

    private findTouch(touches: TouchList) {
        for (const touch of touches) {
            if (this.currentTouchID === null
                || touch.identifier === this.currentTouchID) {
                return touch;
            }
        }
        return null;
    }

    private withPrimaryTouch(callback: (touch: Touch) => void) {
        return (evt: TouchEvent) => {
            evt.preventDefault();
            callback(this.findTouch(evt.touches)
                || this.findTouch(evt.changedTouches));
        };
    }

    private setTouchPointer(touch: Touch) {
        if (isHTMLCanvas(this.canv)) {
            const cb = this.canv.getBoundingClientRect();
            this.pointer.set(
                touch.clientX - cb.left,
                touch.clientY - cb.top);
        }
    }

    private readTouchStartEvent(evt: TouchEvent) {
        this.withPrimaryTouch(this.touchLikePointerDown(this.setTouchPointer))(evt);
    }

    private readTouchMoveEvent(evt: TouchEvent) {
        this.withPrimaryTouch(this.touchLikePointerMove(this.setTouchPointer))(evt);
    }

    private readTouchEndEvent(evt: TouchEvent) {
        this.withPrimaryTouch(this.touchLikePointerUp)(evt);
    }

    set2DTouchEvents(canv: HTMLElement) {
        HtmlRender(canv,
            onTouchStart((evt) => this.readTouchStartEvent(evt)),
            onTouchMove((evt) => this.readTouchMoveEvent(evt)),
            onTouchEnd((evt) => this.readTouchEndEvent(evt))
        );
    }
    //<<<<<<<<<< TOUCH EVENT HANDLERS <<<<<<<<<<
}

Object.freeze(Primrose);

type EventName =
    | "KeyDown"
    | "KeyPress"
    | "Copy"
    | "Cut"
    | "Paste";

const withCurrentControl = (name: EventName) => {
    const evtName = name.toLocaleLowerCase();
    const funcName: keyof Primrose = `read${name}Event`;

    window.addEventListener(evtName, (evt) => {
        if (focusedControl !== null) {
            focusedControl[funcName](evt as any);
        }
    }, { passive: false });
};

withCurrentControl("KeyDown");
withCurrentControl("KeyPress");
withCurrentControl("Copy");
withCurrentControl("Cut");
withCurrentControl("Paste");

window.addEventListener("wheel", (evt) => {
    const control = focusedControl || hoveredControl;
    if (control !== null) {
        control.readWheelEvent(evt);
    }
}, { passive: false });