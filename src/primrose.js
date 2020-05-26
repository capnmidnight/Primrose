import { Manager } from "./manager.js";
import { Cursor } from "./cursor.js";

import { monospaceFamily } from "./fonts.js"

import {
    isCanvas,
    createCanvas,
    setContextSize,
    resizeContext
} from "./canvas.js";

import {
    isChrome,
    isFirefox,
    isMacOS,
    isDebug
} from "./flags.js";

import {
    Point,
    Size,
    Rectangle
} from "./geom.js";

import {
    Windows,
    MacOS
} from "./os.js";

import {
    JavaScript,
    grammars
} from "./grammars.js";

import {
    singleLineOutput,
    multiLineOutput,
    singleLineInput,
    multiLineInput
} from "./controlTypes.js";

import { Dark } from "./themes.js";

//>>>>>>>>>> PRIVATE STATIC FIELDS >>>>>>>>>>
let elementCounter = 0;

const wheelScrollSpeed = 4,
    vScrollWidth = 2,
    scrollScale = isFirefox ? 3 : 100,
    optionDefaults = Object.freeze({
        readOnly: false,
        multiLine: true,
        wordWrap: true,
        scrollBars: true,
        lineNumbers: true,
        padding: 0,
        fontSize: 16,
        language: "JavaScript"
    });
//<<<<<<<<<< PRIVATE STATIC FIELDS <<<<<<<<<<

export class Primrose extends EventTarget {
    constructor(parentElement, options) {
        super();

        const debugEvt = (name, callback) => {
            return (evt) => {
                if (isDebug) {
                    console.log(this.toString(), name, evt);
                }

                if (!!callback) {
                    callback(evt);
                }
            };
        };

        //>>>>>>>>>> VALIDATE PARAMETERS >>>>>>>>>>
        if (parentElement === undefined) {
            parentElement = null;
        }

        if (parentElement !== null
            && !(parentElement instanceof HTMLElement)) {
            throw new Error("parentElement must be null or an instance of HTMLElement");
        }

        options = Object.assign({}, optionDefaults, options);
        //<<<<<<<<<< VALIDATE PARAMETERS <<<<<<<<<<


        //>>>>>>>>>> PRIVATE METHODS >>>>>>>>>>
        let render = () => {
            // do nothing, disabling rendering until the object is fully initialized;
        };

        const performLayout = () => {
            // group the tokens into rows
            tokenRows.splice(0);
            tokenRows.push([]);
            lines.splice(0);
            lines.push("");
            let currentRowWidth = 0;
            const tokenQueue = tokens.slice();
            for (let i = 0; i < tokenQueue.length; ++i) {
                const t = tokenQueue[i].clone(),
                    widthLeft = gridBounds.width - currentRowWidth,
                    wrap = wordWrap && t.type !== "newlines" && t.value.length > widthLeft,
                    breakLine = t.type === "newlines" || wrap;
                if (wrap) {
                    const split = t.value.length > gridBounds.width ? widthLeft : 0;
                    tokenQueue.splice(i + 1, 0, t.splitAt(split));
                }

                if (t.value.length > 0) {
                    tokenRows[tokenRows.length - 1].push(t);
                    lines[lines.length - 1] += t.value;
                    currentRowWidth += t.value.length;
                }

                if (breakLine) {
                    tokenRows.push([]);
                    lines.push("");
                    currentRowWidth = 0;
                }
            }
        };

        const setValue = (txt, setUndo) => {
            txt = txt || "";
            txt = txt.replace(/\r\n/g, "\n");
            if (txt !== value) {
                value = txt;
                if (setUndo) {
                    pushUndo();
                }
                refreshTokens();
                refreshGridBounds();
                performLayout();
                render();
                this.dispatchEvent(changeEvt);
            }
        };

        const refreshControlType = () => {
            const lastControlType = controlType;

            if (readOnly && multiLine) {
                controlType = multiLineOutput;
            }
            else if (readOnly && !multiLine) {
                controlType = singleLineOutput;
            }
            else if (!readOnly && multiLine) {
                controlType = multiLineInput;
            }
            else {
                controlType = singleLineInput;
            }

            if (controlType !== lastControlType) {
                render();
            }
        };

        const refreshTokens = () => {
            tokens = language.tokenize(value);
        };

        const refreshGutter = () => {
            if (showLineNumbers) {
                topLeftGutter.width = 1;
            }
            else {
                topLeftGutter.width = 0;
            }

            if (!showScrollBars) {
                bottomRightGutter.set(0, 0);
            }
            else if (wordWrap) {
                bottomRightGutter.set(vScrollWidth, 0);
            }
            else {
                bottomRightGutter.set(vScrollWidth, 1);
            }
        };

        const refreshGridBounds = () => {
            lineCountWidth = 0;
            if (showLineNumbers) {
                lineCountWidth = Math.max(1, Math.ceil(Math.log(lines.length) / Math.LN10));
            }

            const x = Math.floor(topLeftGutter.width + lineCountWidth + padding / character.width),
                y = Math.floor(padding / character.height),
                w = Math.floor((this.width - 2 * padding) / character.width) - x - bottomRightGutter.width,
                h = Math.floor((this.height - 2 * padding) / character.height) - y - bottomRightGutter.height;
            gridBounds.set(x, y, w, h);
        };

        const refreshBuffers = () => {
            resized = true;
            setContextSize(fgfx, this.width, this.height);
            setContextSize(bgfx, this.width, this.height);
            setContextSize(tgfx, this.width, this.height);
            render();
        };

        const minDelta = (v, minV, maxV) => {
            const dvMinV = v - minV,
                dvMaxV = v - maxV + 5;
            let dv = 0;
            if (dvMinV < 0 || dvMaxV >= 0) {
                // compare the absolute values, so we get the smallest change
                // regardless of direction.
                dv = Math.abs(dvMinV) < Math.abs(dvMaxV) ? dvMinV : dvMaxV;
            }

            return dv;
        };

        const clampScroll = () => {
            const maxY = Math.max(0, lines.length - gridBounds.height);
            if (scroll.y < 0 || maxY === 0) {
                scroll.y = 0;
            }
            else {
                while (scroll.y > maxY) {
                    --scroll.y;
                }
            }
            render();
        };

        const scrollIntoView = (currentCursor) => {
            scroll.y += minDelta(currentCursor.y, scroll.y, scroll.y + gridBounds.height);
            if (!wordWrap) {
                scroll.x += minDelta(currentCursor.x, scroll.x, scroll.x + gridBounds.width);
            }
            clampScroll();
        };

        const pushUndo = () => {
            if (historyIndex < history.length - 1) {
                history.splice(historyIndex + 1);
            }
            history.push({
                value,
                frontCursor: frontCursor.i,
                backCursor: backCursor.i
            });
            historyIndex = history.length - 1;
        };

        const moveInHistory = (dh) => {
            const nextHistoryIndex = historyIndex + dh;
            if (0 <= nextHistoryIndex && nextHistoryIndex < history.length) {
                const curFrame = history[historyIndex];
                historyIndex = nextHistoryIndex;
                const nextFrame = history[historyIndex];
                setValue(nextFrame.value, false);
                frontCursor.setI(lines, curFrame.frontCursor);
                backCursor.setI(lines, curFrame.backCursor);
            }
        }
        //<<<<<<<<<< PRIVATE METHODS <<<<<<<<<<


        //>>>>>>>>>> PUBLIC METHODS >>>>>>>>>>
        this.toString = () => `Primrose #${elementID}`;

        this.blur = () => {
            if (focused) {
                focused = false;
                this.dispatchEvent(new Event("blur"));
                render();
            }
        };

        this.focus = () => {
            if (!focused) {
                focused = true;
                this.dispatchEvent(new Event("focus"));
                render();
            }
        };

        this.resize = () => {
            if (resizeContext(context)) {
                refreshBuffers();
            }
        };

        this.setSize = (w, h) => {
            if (setContextSize(context, w, h)) {
                refreshBuffers();
            }
        };
        //<<<<<<<<<< PUBLIC METHODS <<<<<<<<<<


        //>>>>>>>>>> KEY EVENT HANDLERS >>>>>>>>>>
        const keyDownCommands = Object.freeze(new Map([
            ["CursorUp", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                minCursor.up(lines);
                maxCursor.copy(minCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorDown", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                maxCursor.down(lines);
                minCursor.copy(maxCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorLeft", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                if (minCursor.i === maxCursor.i) {
                    minCursor.left(lines);
                }
                maxCursor.copy(minCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorRight", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                if (minCursor.i === maxCursor.i) {
                    maxCursor.right(lines);
                }
                minCursor.copy(maxCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorPageUp", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                minCursor.incY(lines, -gridBounds.height);
                maxCursor.copy(minCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorPageDown", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                maxCursor.incY(lines, gridBounds.height);
                minCursor.copy(maxCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorSkipLeft", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                if (minCursor.i === maxCursor.i) {
                    minCursor.skipLeft(lines);
                }
                maxCursor.copy(minCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorSkipRight", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                if (minCursor.i === maxCursor.i) {
                    maxCursor.skipRight(lines);
                }
                minCursor.copy(maxCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorHome", () => {
                frontCursor.home();
                backCursor.copy(frontCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorEnd", () => {
                frontCursor.end(lines);
                backCursor.copy(frontCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorFullHome", () => {
                frontCursor.fullHome(lines);
                backCursor.copy(frontCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorFullEnd", () => {
                frontCursor.fullEnd(lines);
                backCursor.copy(frontCursor);
                scrollIntoView(frontCursor);
            }],

            ["SelectDown", () => {
                backCursor.down(lines);
                scrollIntoView(frontCursor);
            }],

            ["SelectLeft", () => {
                backCursor.left(lines);
                scrollIntoView(backCursor);
            }],

            ["SelectRight", () => {
                backCursor.right(lines);
                scrollIntoView(backCursor);
            }],

            ["SelectUp", () => {
                backCursor.up(lines);
                scrollIntoView(backCursor);
            }],

            ["SelectPageDown", () => {
                backCursor.incY(lines, gridBounds.height);
                scrollIntoView(backCursor);
            }],

            ["SelectPageUp", () => {
                backCursor.incY(lines, -gridBounds.height);
                scrollIntoView(backCursor);
            }],

            ["SelectSkipLeft", () => {
                backCursor.skipLeft(lines);
                scrollIntoView(backCursor);
            }],

            ["SelectSkipRight", () => {
                backCursor.skipRight(lines);
                scrollIntoView(backCursor);
            }],

            ["SelectHome", () => {
                backCursor.home();
                scrollIntoView(backCursor);
            }],

            ["SelectEnd", () => {
                backCursor.end(lines);
                scrollIntoView(backCursor);
            }],

            ["SelectFullHome", () => {
                backCursor.fullHome(lines);
                scrollIntoView(backCursor);
            }],

            ["SelectFullEnd", () => {
                backCursor.fullEnd(lines);
                scrollIntoView(backCursor);
            }],

            ["SelectAll", () => {
                frontCursor.fullHome();
                backCursor.fullEnd(lines);
                render();
            }],

            ["ScrollDown", () => {
                if (scroll.y < lines.length - gridBounds.height) {
                    ++scroll.y;
                    render();
                }
            }],

            ["ScrollUp", () => {
                if (scroll.y > 0) {
                    --scroll.y;
                    render();
                }
            }],

            ["DeleteLetterLeft", () => {
                if (frontCursor.i === backCursor.i) {
                    backCursor.left(lines);
                }
                this.selectedText = "";
            }],

            ["DeleteLetterRight", () => {
                if (frontCursor.i === backCursor.i) {
                    backCursor.right(lines);
                }
                this.selectedText = "";
            }],

            ["DeleteWordLeft", () => {
                if (frontCursor.i === backCursor.i) {
                    frontCursor.skipLeft(lines);
                }
                this.selectedText = "";
            }],

            ["DeleteWordRight", () => {
                if (frontCursor.i === backCursor.i) {
                    backCursor.skipRight(lines);
                }
                this.selectedText = "";
            }],

            ["DeleteLine", () => {
                if (frontCursor.i === backCursor.i) {
                    frontCursor.home();
                    backCursor.end(lines);
                    backCursor.right(lines);
                }
                this.selectedText = "";
            }],

            ["Undo", () => {
                moveInHistory(-1);
            }],

            ["Redo", () => {
                moveInHistory(1);
            }],

            ["InsertTab", () => {
                tabPressed = true;
                this.selectedText = tabString;
                frontCursor.incX(lines, tabString.length);
                backCursor.copy(frontCursor);
            }],

            ["RemoveTab", () => {
                const line = lines[frontCursor.y],
                    toDelete = Math.min(frontCursor.x, tabWidth);
                for (let i = 0; i < frontCursor.x; ++i) {
                    if (line[i] !== ' ') {
                        // can only remove tabs at the beginning of a line
                        return;
                    }
                }

                frontCursor.incX(lines, -toDelete);
                this.selectedText = "";
                frontCursor.left(lines);
                frontCursor.right(lines);
            }]
        ]));
        this.readKeyDownEvent = debugEvt("keydown", (evt) => {
            const command = os.makeCommand(evt);
            console.log("keydown command", this.toString(), command);
            if (keyDownCommands.has(command.command)) {
                evt.preventDefault();
                keyDownCommands.get(command.command)(evt);
            }
        });


        const keyPressCommands = Object.freeze(new Map([
            ["AppendNewline", () => {
                if (multiLine) {
                    let indent = "";
                    const tokenRow = tokenRows[frontCursor.y];
                    if (tokenRow.length > 0
                        && tokenRow[0].type === "whitespace") {
                        indent = tokenRow[0].value;
                    }
                    this.selectedText = "\n" + indent;
                    frontCursor.incX(lines, indent.length + 1);
                    backCursor.copy(frontCursor);
                    render();
                }
                else {
                    this.dispatchEvent(new Event("change"));
                }
            }],

            ["PrependNewline", () => {
                if (multiLine) {
                    let indent = "";
                    const tokenRow = tokenRows[frontCursor.y];
                    if (tokenRow.length > 0
                        && tokenRow[0].type === "whitespace") {
                        indent = tokenRow[0].value;
                    }
                    frontCursor.home();
                    backCursor.copy(frontCursor);
                    this.selectedText = indent + "\n";
                    frontCursor.incX(lines, indent.length);
                    backCursor.copy(frontCursor);
                    render();
                }
                else {
                    this.dispatchEvent(new Event("change"));
                }
            }],

            ["Undo", () => {
                moveInHistory(-1);
            }]
        ]));
        this.readKeyPressEvent = debugEvt("keypress", (evt) => {
            const command = os.makeCommand(evt);
            console.log("keypress command", this.toString(), command);
            if (!this.readOnly) {
                evt.preventDefault();

                if (keyPressCommands.has(command.command)) {
                    keyPressCommands.get(command.command)();
                }
                else if (command.type === "printable"
                    || command.type === "whitespace") {
                    this.selectedText = command.text;
                    frontCursor.right(lines);
                    backCursor.copy(frontCursor);
                }

                clampScroll();
                render();
            }
        });

        this.readKeyUpEvent = debugEvt("keyup");
        //<<<<<<<<<< KEY EVENT HANDLERS <<<<<<<<<<


        //>>>>>>>>>> CLIPBOARD EVENT HANDLERS >>>>>>>>>>
        function setFalse(evt) {
            evt.returnValue = false;
        }

        this.readBeforeCopyEvent = setFalse;
        this.readBeforeCutEvent = setFalse;
        this.readBeforePasteEvent = setFalse;

        const copySelectedText = (evt) => {
            if (focused && frontCursor.i !== backCursor.i) {
                const clipboard = evt.clipboardData || window.clipboardData;
                clipboard.setData(
                    window.clipboardData ? "Text" : "text/plain", this.selectedText);
                evt.returnValue = false;
                return true;
            }

            return false;
        };

        this.readCopyEvent = debugEvt("copy", (evt) => {
            copySelectedText(evt);
        });

        this.readCutEvent = debugEvt("cut", (evt) => {
            if (copySelectedText(evt)
                && !this.readOnly) {
                this.selectedText = "";
            }
        });

        this.readPasteEvent = debugEvt("paste", (evt) => {
            if (focused && !this.readOnly) {
                evt.returnValue = false;
                const clipboard = evt.clipboardData || window.clipboardData,
                    str = clipboard.getData(window.clipboardData ? "Text" : "text/plain");
                if (str) {
                    this.selectedText = str;
                    frontCursor.incX(str.length);
                    backCursor.copy(frontCursor);
                }
            }
        });
        //<<<<<<<<<< CLIPBOARD EVENT HANDLERS <<<<<<<<<<


        //>>>>>>>>>> POINTER EVENT HANDLERS >>>>>>>>>>
        const pointerOver = () => {
            hovered = true;
            this.dispatchEvent(overEvt);
        };

        const pointerOut = () => {
            hovered = false;
            this.dispatchEvent(outEvt);
        };

        const pointerDown = () => {
            this.focus();
            dragging = true;
            lastPointer.copy(pointer);
            lastPointer.toCell(character, scroll, gridBounds);
            moveCursor(frontCursor);
        };

        const pointerUp = () => {
            dragging = false;
            scrolling = false;
        };

        const pointerMove = () => {
            if (dragging) {
                moveCursor(backCursor);
            }
        };

        const moveCursor = (cursor) => {
            pointer.toCell(character, scroll, gridBounds);
            const gx = pointer.x - scroll.x,
                gy = pointer.y - scroll.y,
                onBottom = gy >= gridBounds.height,
                onLeft = gx < 0,
                onRight = pointer.x >= gridBounds.width;

            if (!scrolling && !onBottom && !onLeft && !onRight) {
                cursor.setXY(lines, pointer.x, pointer.y);
                backCursor.copy(cursor);
            }
            else if (scrolling || onRight && !onBottom) {
                scrolling = true;
                const scrollHeight = lines.length - gridBounds.height;
                if (gy >= 0 && scrollHeight >= 0) {
                    const sy = gy * scrollHeight / gridBounds.height;
                    scroll.y = Math.floor(sy);
                }
            }
            else if (onBottom && !onLeft) {
                let maxWidth = 0;
                for (let dy = 0; dy < lines.length; ++dy) {
                    maxWidth = Math.max(maxWidth, lines[dy].length);
                }
                const scrollWidth = maxWidth - gridBounds.width;
                if (gx >= 0 && scrollWidth >= 0) {
                    const sx = gx * scrollWidth / gridBounds.width;
                    scroll.x = Math.floor(sx);
                }
            }
            else if (onLeft && !onBottom) {
                // clicked in number-line gutter
            }
            else {
                // clicked in the lower-left corner
            }

            lastPointer.copy(pointer);
            render();
        }

        //>>>>>>>>>> UV POINTER EVENT HANDLERS >>>>>>>>>>
        const setUVPointer = (evt) => {
            pointer.set(evt.uv.x, evt.uv.y);
            pointer.map(this.width, this.height);
        }
        this.readUVOverEvent = debugEvt("uvover", pointerOver);
        this.readUVOutEvent = debugEvt("uvout", pointerOut);
        this.readUVDownEvent = debugEvt("uvdown", (evt) => {
            setUVPointer(evt);
            pointerDown();
        });
        this.readUVUpEvent = debugEvt("uvup", pointerUp);
        this.readUVMoveEvent = debugEvt("uvmove", (evt) => {
            setUVPointer(evt);
            pointerMove();
        });
        //<<<<<<<<<< UV POINTER EVENT HANDLERS <<<<<<<<<<


        //>>>>>>>>>> POINTER EVENT HANDLERS >>>>>>>>>>
        const withPrimaryPointer = (callback) => {
            return (evt) => {
                if (evt.isPrimary) {
                    callback(evt);
                }
            };
        };
        const setOffsetPointer = (evt) => {
            pointer.set(
                evt.offsetX * this.width / canvas.clientWidth,
                evt.offsetY * this.height / canvas.clientHeight);
        };
        this.readPointerOverEvent = debugEvt("pointerover", withPrimaryPointer(pointerOver));
        this.readPointerOutEvent = debugEvt("pointerout", withPrimaryPointer(pointerOut));
        this.readPointerDownEvent = debugEvt("pointerdown", withPrimaryPointer((evt) => {
            setOffsetPointer(evt);
            pointerDown();
        }));
        this.readPointerUpEvent = debugEvt("pointerup", withPrimaryPointer(pointerUp));
        this.readPointerMoveEvent = debugEvt("pointermove", withPrimaryPointer((evt) => {
            setOffsetPointer(evt);
            pointerMove();
        }));
        //<<<<<<<<<< POINTER EVENT HANDLERS <<<<<<<<<<


        //>>>>>>>>>> MOUSE EVENT HANDLERS >>>>>>>>>>
        this.readMouseOverEvent = debugEvt("mouseover", pointerOver);
        this.readMouseOutEvent = debugEvt("mouseout", pointerOut);
        this.readMouseDownEvent = debugEvt("mousedown", (evt) => {
            setOffsetPointer(evt);
            pointerDown();
        });
        this.readMouseUpEvent = debugEvt("mouseup", pointerUp);
        this.readMouseMoveEvent = debugEvt("mousemove", (evt) => {
            setOffsetPointer(evt);
            pointerMove();
        });

        this.readWheelEvent = debugEvt("wheel", (evt) => {
            if (hovered || focused) {
                if (evt.shiftKey) {
                    this.fontSize += -evt.deltaY / scrollScale;
                }
                else {
                    scroll.y += Math.floor(evt.deltaY * wheelScrollSpeed / scrollScale);
                    clampScroll();
                }
                render();
                evt.preventDefault();
            }
        });
        //<<<<<<<<<< MOUSE EVENT HANDLERS <<<<<<<<<<


        //>>>>>>>>>> TOUCH EVENT HANDLERS >>>>>>>>>>
        let currentTouchID = null;
        const findTouch = (touches) => {
            for (let touch in touches) {
                if (currentTouchID === null
                    || touch.identifier === currentTouchID) {
                    return touch;
                }
            }
            return null;
        }
        const withPrimaryTouch = (callback) => {
            return (evt) => {
                callback(findTouch(evt.touches)
                    || findTouch(evt.changedTouches))
            };
        };
        const setTouchPointer = (evt) => {
            pointer.set(
                (evt.pageX - canvas.offsetLeft) * this.width / canvas.clientWidth,
                (evt.pageY - canvas.offsetTop) * this.height / canvas.clientHeight);
        };
        this.readTouchStartEvent = debugEvt("touchstart", withPrimaryTouch((evt) => {
            setTouchPointer(evt);
            pointerDown();
        }));
        this.readTouchEndEvent = debugEvt("touchend", withPrimaryTouch(pointerUp));
        this.readTouchMoveEvent = debugEvt("touchmove", withPrimaryTouch((evt) => {
            setTouchPointer(evt);
            pointerMove();
        }));
        //<<<<<<<<<< TOUCH EVENT HANDLERS <<<<<<<<<<
        //<<<<<<<<<< POINTER EVENT HANDLERS <<<<<<<<<<


        //>>>>>>>>>> PUBLIC PROPERTIES >>>>>>>>>>
        Object.defineProperties(this, {

            parentElement: {
                get: () => parentElement
            },

            isInDocument: {
                get: () => !isOffScreen
                    && document.body.contains(canvas)
            },

            canvas: {
                get: () => canvas
            },

            hovered: {
                get: () => hovered
            },

            focused: {
                get: () => focused,
                set: (f) => {
                    if (f !== focused) {
                        if (f) {
                            this.focus();
                        }
                        else {
                            this.blur();
                        }
                    }
                }
            },

            readOnly: {
                get: () => readOnly,
                set: (r) => {
                    r = !!r;
                    if (r !== readOnly) {
                        readOnly = r;
                        refreshControlType();
                    }
                }
            },

            multiLine: {
                get: () => multiLine,
                set: (m) => {
                    m = !!m;
                    if (m !== multiLine) {
                        if (!m && wordWrap) {
                            this.wordWrap = false;
                        }
                        multiLine = m;
                        refreshControlType();
                        refreshGutter();
                    }
                }
            },

            wordWrap: {
                get: () => wordWrap,
                set: (w) => {
                    w = !!w;
                    if (w !== wordWrap
                        && (multiLine
                            || !w)) {
                        wordWrap = w;
                        refreshGutter();
                        render();
                    }
                }
            },

            value: {
                get: () => value,
                set: (txt) => setValue(txt, true)
            },

            selectedText: {
                get: () => {
                    const minCursor = Cursor.min(frontCursor, backCursor),
                        maxCursor = Cursor.max(frontCursor, backCursor);
                    return value.substring(minCursor.i, maxCursor.i);
                },
                set: (txt) => {
                    txt = txt || "";
                    txt = txt.replace(/\r\n/g, "\n");

                    if (frontCursor.i !== backCursor.i || txt.length > 0) {
                        const minCursor = Cursor.min(frontCursor, backCursor),
                            maxCursor = Cursor.max(frontCursor, backCursor),
                            left = value.substring(0, minCursor.i),
                            right = value.substring(maxCursor.i);
                        setValue(left + txt + right, true);
                        maxCursor.copy(minCursor);
                        render();
                    }
                }
            },

            selectionStart: {
                get: () => frontCursor.i,
                set: (i) => {
                    i = i | 0;
                    if (i !== frontCursor.i) {
                        frontCursor.setI(lines, i);
                        render();
                    }
                }
            },

            selectionEnd: {
                get: () => backCursor.i,
                set: (i) => {
                    i = i | 0;
                    if (i !== backCursor.i) {
                        backCursor.setI(lines, i);
                        render();
                    }
                }
            },

            selectionDirection: {
                get: () => frontCursor.i <= backCursor.i
                    ? "forward"
                    : "backward"
            },

            tabWidth: {
                get: () => tabWidth,
                set: (tw) => {
                    tabWidth = tw || 2;
                    tabString = "";
                    for (let i = 0; i < tabWidth; ++i) {
                        tabString += " ";
                    }
                }
            },

            theme: {
                get: () => theme,
                set: (t) => {
                    if (t !== theme) {
                        theme = t;
                        render();
                    }
                }
            },

            language: {
                get: () => language,
                set: (l) => {
                    if (l !== language) {
                        language = l;
                        refreshTokens();
                        render();
                    }
                }
            },

            padding: {
                get: () => padding,
                set: (p) => {
                    p = p | 0;
                    if (p !== padding) {
                        padding = p;
                        render();
                    }
                }
            },

            showLineNumbers: {
                get: () => showLineNumbers,
                set: (s) => {
                    s = s || false;
                    if (s !== showLineNumbers) {
                        showLineNumbers = s;
                        refreshGutter();
                    }
                }
            },

            showScrollBars: {
                get: () => showScrollBars,
                set: (s) => {
                    s = s || false;
                    if (s !== showScrollBars) {
                        showScrollBars = s;
                        refreshGutter();
                    }
                }
            },

            fontSize: {
                get: () => fontSize,
                set: (s) => {
                    s = Math.max(1, s || 0);
                    if (s !== fontSize) {
                        fontSize = s;
                        context.font = `${fontSize}px ${monospaceFamily}`;
                        character.height = fontSize;
                        // measure 100 letter M's, then divide by 100, to get the width of an M
                        // to two decimal places on systems that return integer values from
                        // measureText.
                        character.width = context.measureText(
                            "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM")
                            .width /
                            100;
                        render();
                    }
                }
            },

            width: {
                get: () => canvas.width,
                set: (w) => setCanvasSize(canvas, w, this.height)
            },

            height: {
                get: () => canvas.height,
                set: (h) => setCanvasSize(canvas, this.width, h)
            }
        });
        //<<<<<<<<<< PUBLIC PROPERTIES <<<<<<<<<<


        //>>>>>>>>>> PRIVATE MUTABLE FIELDS >>>>>>>>>>
        let value = "",
            padding = 0,
            theme = Dark,
            tabWidth = 2,
            canvas = null,
            tokens = null,
            resized = false,
            hovered = false,
            focused = false,
            fontSize = null,
            tabString = "  ",
            readOnly = false,
            dragging = false,
            wordWrap = false,
            historyIndex = -1,
            scrolling = false,
            multiLine = false,
            tabPressed = false,
            lineCountWidth = 0,
            isOffScreen = false,
            language = JavaScript,
            showScrollBars = false,
            showLineNumbers = false,
            elementID = ++elementCounter,
            controlType = singleLineOutput,

            lastCharacterHeight = null,
            lastCharacterWidth = null,
            lastFrontCursor = null,
            lastGridBounds = null,
            lastBackCursor = null,
            lastThemeName = null,
            lastPadding = null,
            lastFocused = null,
            lastScrollX = null,
            lastScrollY = null,
            lastFont = null,
            lastText = null;

        const lines = [""],
            history = [],
            tokenRows = [],
            scroll = new Point(),
            pointer = new Point(),
            character = new Size(),
            lastPointer = new Point(),
            backCursor = new Cursor(),
            outEvt = new Event("out"),
            topLeftGutter = new Size(),
            frontCursor = new Cursor(),
            overEvt = new Event("over"),
            gridBounds = new Rectangle(),
            bottomRightGutter = new Size(),
            os = isMacOS ? MacOS : Windows,
            changeEvt = new Event("change");
        //<<<<<<<<<< PRIVATE MUTABLE FIELDS <<<<<<<<<<


        //>>>>>>>>>> SETUP CANVAS >>>>>>>>>>
        let currentValue = "",
            currentTabIndex = -1;

        function readOptions(elem) {
            currentTabIndex = elem.tabIndex;

            const optionsStr = elem.dataset.options || "",
                entries = optionsStr.trim().split(','),
                optionUser = {};
            for (let entry of entries) {
                entry = entry.trim();
                if (entry.length > 0) {
                    const pairs = entry.split('=');
                    if (pairs.length > 1) {
                        optionUser[pairs[0].trim()] = pairs[1].trim();
                    }
                }
            }

            options = Object.assign(options, optionUser);
        }

        if (parentElement === null) {
            canvas = createCanvas();
            isOffScreen = !(canvas instanceof HTMLCanvasElement);
        }
        else if (isCanvas(parentElement)) {
            canvas = parentElement;
            parentElement = canvas.parentElement;
            readOptions(canvas);
        }
        else {
            canvas = document.createElement("canvas");
            currentValue = parentElement.textContent;
            readOptions(parentElement);

            parentElement.innerHTML = "";
            parentElement.appendChild(canvas);
            parentElement.removeAttribute("tabindex");

            Object.assign(parentElement.style, {
                display: "block",
                padding: "none",
                border: "2px inset #c0c0c0",
                whiteSpace: "pre-wrap",
                overflow: "unset",
                fontFamily: monospaceFamily
            });

            Object.assign(canvas.style, {
                width: "100%",
                height: "100%"
            });
        }

        if (parentElement !== null
            && currentTabIndex === -1) {
            const tabbableElements = document.querySelectorAll("[tabindex]");
            for (let tabbableElement of tabbableElements) {
                currentTabIndex = Math.max(currentTabIndex, tabbableElement.tabIndex);
            }
        }

        if (canvas instanceof HTMLCanvasElement
            && this.isInDocument) {
            canvas.tabIndex = currentTabIndex;
            canvas.style.imageRendering = isChrome ? "pixelated" : "optimizespeed";
            canvas.style.touchAction = "none";
            canvas.addEventListener("focus", () => this.focus());
            canvas.addEventListener("blur", () => this.blur());

            if (canvas.onpointerdown === undefined) {
                canvas.addEventListener("mouseover", this.readMouseOverEvent);
                canvas.addEventListener("mouseout", this.readMouseOutEvent);
                canvas.addEventListener("mousedown", this.readMouseDownEvent);
                canvas.addEventListener("mouseup", this.readMouseUpEvent);
                canvas.addEventListener("mousemove", this.readMouseMoveEvent);

                canvas.addEventListener("touchstart", this.readTouchStartEvent);
                canvas.addEventListener("touchend", this.readTouchEndEvent);
                canvas.addEventListener("touchmove", this.readTouchMoveEvent);
            }
            else {
                canvas.addEventListener("pointerover", this.readPointerOverEvent);
                canvas.addEventListener("pointerout", this.readPointerOutEvent);
                canvas.addEventListener("pointerdown", this.readPointerDownEvent);
                canvas.addEventListener("pointerup", this.readPointerUpEvent);
                canvas.addEventListener("pointermove", this.readPointerMoveEvent);
            }
        }
        //<<<<<<<<<< SETUP CANVAS <<<<<<<<<<


        //>>>>>>>>>> SETUP BUFFERS >>>>>>>>>>
        const context = canvas.getContext("2d"),
            fg = createCanvas(),
            fgfx = fg.getContext("2d"),
            bg = createCanvas(),
            bgfx = bg.getContext("2d"),
            tg = createCanvas(),
            tgfx = tg.getContext("2d");

        context.imageSmoothingEnabled
            = fgfx.imageSmoothingEnabled
            = bgfx.imageSmoothingEnabled
            = tgfx.imageSmoothingEnabled
            = true;
        context.textBaseline
            = fgfx.textBaseline
            = bgfx.textBaseline
            = tgfx.textBaseline
            = "top";
        //<<<<<<<<<< SETUP BUFFERS <<<<<<<<<<


        //>>>>>>>>>> INITIALIZE STATE >>>>>>>>>>
        this.addEventListener("blur", (evt) => {
            if (tabPressed) {
                tabPressed = false;
                this.focus();
            }
        });

        options.language = options.language.toLocaleLowerCase();
        if (grammars.has(options.language)) {
            options.language = grammars.get(options.language);
        }
        else {
            options.language = null;
        }
        Object.freeze(options);

        Object.seal(this);
        this.readOnly = options.readOnly;
        this.multiLine = options.multiLine;
        this.wordWrap = options.wordWrap;
        this.padding = options.padding;
        this.showLineNumbers = options.lineNumbers;
        this.showScrollBars = options.scrollBars;
        this.fontSize = options.fontSize;
        this.language = options.language;
        this.value = currentValue;
        Manager.add(this);
        //<<<<<<<<<< INITIALIZE STATE <<<<<<<<<<


        //>>>>>>>>>> RENDERING >>>>>>>>>>

        const fillRect = (gfx, fill, x, y, w, h) => {
            gfx.fillStyle = fill;
            gfx.fillRect(
                x * character.width,
                y * character.height,
                w * character.width + 1,
                h * character.height + 1);
        };

        const strokeRect = (gfx, stroke, x, y, w, h) => {
            gfx.strokeStyle = stroke;
            gfx.strokeRect(
                x * character.width,
                y * character.height,
                w * character.width + 1,
                h * character.height + 1);
        };

        const renderCanvasBackground = () => {
            const minCursor = Cursor.min(frontCursor, backCursor),
                maxCursor = Cursor.max(frontCursor, backCursor),
                tokenFront = new Cursor(),
                tokenBack = new Cursor(),
                clearFunc = theme.regular.backColor ? "fillRect" : "clearRect";

            if (theme.regular.backColor) {
                bgfx.fillStyle = theme.regular.backColor;
            }

            bgfx[clearFunc](0, 0, this.width, this.height);
            bgfx.save();
            bgfx.translate(
                (gridBounds.x - scroll.x) * character.width + padding,
                -scroll.y * character.height + padding);


            // draw the current row highlighter
            if (focused) {
                fillRect(bgfx, theme.regular.currentRowBackColor ||
                    DefaultTheme.regular.currentRowBackColor,
                    0, minCursor.y,
                    gridBounds.width,
                    maxCursor.y - minCursor.y + 1);
            }

            for (let y = 0; y < tokenRows.length; ++y) {
                // draw the tokens on this row
                const row = tokenRows[y];

                for (let i = 0; i < row.length; ++i) {
                    const t = row[i];
                    tokenBack.x += t.value.length;
                    tokenBack.i += t.value.length;

                    // skip drawing tokens that aren't in view
                    if (scroll.y <= y && y < scroll.y + gridBounds.height &&
                        scroll.x <= tokenBack.x && tokenFront.x < scroll.x +
                        gridBounds.width) {
                        // draw the selection box
                        const inSelection = minCursor.i <= tokenBack.i
                            && tokenFront.i < maxCursor.i;
                        if (inSelection) {
                            const selectionFront = Cursor.max(minCursor, tokenFront),
                                selectionBack = Cursor.min(maxCursor, tokenBack),
                                cw = selectionBack.i - selectionFront.i;
                            fillRect(bgfx, theme.regular.selectedBackColor ||
                                DefaultTheme.regular.selectedBackColor,
                                selectionFront.x, selectionFront.y,
                                cw, 1);
                        }
                    }

                    tokenFront.copy(tokenBack);
                }

                tokenFront.x = 0;
                ++tokenFront.y;
                tokenBack.copy(tokenFront);
            }

            // draw the cursor caret
            if (focused) {
                const cc = theme.cursorColor || "black",
                    w = 1 / character.width;
                fillRect(bgfx, cc, minCursor.x, minCursor.y, w, 1);
                fillRect(bgfx, cc, maxCursor.x, maxCursor.y, w, 1);
            }
            bgfx.restore();
        };

        const renderCanvasForeground = () => {
            const tokenFront = new Cursor(),
                tokenBack = new Cursor();

            fgfx.clearRect(0, 0, this.width, this.height);
            fgfx.save();
            fgfx.translate(
                (gridBounds.x - scroll.x) * character.width + padding,
                padding);
            for (let y = 0; y < tokenRows.length; ++y) {
                // draw the tokens on this row
                const line = lines[y] + padding,
                    row = tokenRows[y],
                    textY = (y - scroll.y) * character.height;

                let drawn = false;

                for (let i = 0; i < row.length; ++i) {
                    const t = row[i];
                    tokenBack.x += t.value.length;
                    tokenBack.i += t.value.length;

                    // skip drawing tokens that aren't in view
                    if (scroll.y <= y
                        && y < scroll.y + gridBounds.height
                        && scroll.x <= tokenBack.x
                        && tokenFront.x < scroll.x + gridBounds.width) {

                        // draw the text
                        const style = theme[t.type] || {},
                            font = (style.fontWeight || theme.regular.fontWeight || "") +
                                " " + (style.fontStyle || theme.regular.fontStyle || "") +
                                " " + context.font;
                        fgfx.font = font.trim();
                        fgfx.fillStyle = style.foreColor || theme.regular.foreColor;
                        fgfx.fillText(
                            t.value,
                            tokenFront.x * character.width,
                            textY);

                        drawn = true;
                    }

                    tokenFront.copy(tokenBack);
                }

                tokenFront.x = 0;
                ++tokenFront.y;
                tokenBack.copy(tokenFront);
            }

            fgfx.restore();
        };

        const renderCanvasTrim = () => {
            const tokenFront = new Cursor(),
                tokenBack = new Cursor();

            let maxLineWidth = 0;

            tgfx.clearRect(0, 0, this.width, this.height);
            tgfx.save();
            tgfx.translate(padding, padding);

            if (showLineNumbers) {
                fillRect(tgfx,
                    theme.regular.selectedBackColor ||
                    DefaultTheme.regular.selectedBackColor,
                    0, 0,
                    gridBounds.x, gridBounds.height);
            }

            tgfx.save();
            tgfx.translate(0, -scroll.y * character.height);
            maxLineWidth = 2;
            for (let y = 0, lastLine = -1; y < tokenRows.length; ++y) {
                const row = tokenRows[y];

                for (let i = 0; i < row.length; ++i) {
                    const t = row[i];
                    tokenBack.x += t.value.length;
                    tokenBack.i += t.value.length;
                    tokenFront.copy(tokenBack);
                }

                maxLineWidth = Math.max(maxLineWidth, tokenBack.x - 1);
                tokenFront.x = 0;
                ++tokenFront.y;
                tokenBack.copy(tokenFront);

                if (showLineNumbers && scroll.y <= y && y < scroll.y + gridBounds.height) {
                    // draw the left gutter
                    const currentLine = row.length > 0 ? row[0].line : lastLine + 1;
                    let lineNumber = currentLine.toString();
                    while (lineNumber.length < lineCountWidth) {
                        lineNumber = " " + lineNumber;
                    }
                    tgfx.font = "bold " + context.font;

                    if (currentLine > lastLine) {
                        tgfx.fillStyle = theme.regular.foreColor;
                        tgfx.fillText(
                            lineNumber,
                            character.width / 2, y * character.height);
                    }
                    lastLine = currentLine;
                }
            }

            tgfx.restore();

            if (showLineNumbers) {
                strokeRect(tgfx,
                    theme.regular.foreColor ||
                    DefaultTheme.regular.foreColor,
                    0, 0,
                    gridBounds.x, gridBounds.height);
            }

            // draw the scrollbars
            if (showScrollBars) {
                const drawWidth = gridBounds.width * character.width - padding,
                    drawHeight = gridBounds.height * character.height,
                    scrollX = (scroll.x * drawWidth) / maxLineWidth + gridBounds.x * character.width,
                    scrollY = (scroll.y * drawHeight) / tokenRows.length;

                tgfx.fillStyle = theme.regular.selectedBackColor ||
                    DefaultTheme.regular.selectedBackColor;
                // horizontal
                let bw = null;
                if (!wordWrap && maxLineWidth > gridBounds.width) {
                    const scrollBarWidth = drawWidth * (gridBounds.width / maxLineWidth),
                        by = gridBounds.height * character.height;
                    bw = Math.max(character.width, scrollBarWidth);
                    tgfx.fillRect(scrollX, by, bw, character.height);
                    tgfx.strokeRect(scrollX, by, bw, character.height);
                }

                //vertical
                if (tokenRows.length > gridBounds.height) {
                    const scrollBarHeight = drawHeight * (gridBounds.height / tokenRows.length),
                        bx = this.width - vScrollWidth * character.width - 2 * padding,
                        bh = Math.max(character.height, scrollBarHeight);
                    bw = vScrollWidth * character.width;
                    tgfx.fillRect(bx, scrollY, bw, bh);
                    tgfx.strokeRect(bx, scrollY, bw, bh);
                }
            }

            tgfx.lineWidth = 2;
            tgfx.restore();
            tgfx.strokeRect(1, 1, this.width - 2, this.height - 2);
            if (!focused) {
                tgfx.fillStyle = theme.regular.unfocused || DefaultTheme.regular.unfocused;
                tgfx.fillRect(0, 0, this.width, this.height);
            }
        };

        const doRender = () => {
            if (tokens && theme) {
                refreshGridBounds();
                const textChanged = lastText !== value,
                    focusChanged = focused !== lastFocused,
                    fontChanged = context.font !== lastFont,
                    paddingChanged = padding !== lastPadding,
                    themeChanged = theme.name !== lastThemeName,
                    boundsChanged = gridBounds.toString() !== lastGridBounds,
                    characterWidthChanged = character.width !== lastCharacterWidth,
                    characterHeightChanged = character.height !== lastCharacterHeight,

                    cursorChanged = frontCursor.i !== lastFrontCursor
                        || backCursor.i !== lastBackCursor,

                    scrollChanged = scroll.x !== lastScrollX
                        || scroll.y !== lastScrollY,

                    layoutChanged = resized
                        || boundsChanged
                        || textChanged
                        || characterWidthChanged
                        || characterHeightChanged
                        || paddingChanged,

                    backgroundChanged = layoutChanged
                        || cursorChanged
                        || scrollChanged
                        || themeChanged,

                    foregroundChanged = backgroundChanged
                        || textChanged
                        || fontChanged,

                    trimChanged = backgroundChanged
                        || focusChanged,

                    imageChanged = foregroundChanged
                        || backgroundChanged
                        || trimChanged;

                if (layoutChanged) {
                    performLayout(gridBounds);
                }

                if (imageChanged) {
                    if (backgroundChanged) {
                        renderCanvasBackground();
                    }
                    if (foregroundChanged) {
                        renderCanvasForeground();
                    }
                    if (trimChanged) {
                        renderCanvasTrim();
                    }

                    context.clearRect(0, 0, this.width, this.height);
                    context.drawImage(bg, 0, 0);
                    context.drawImage(fg, 0, 0);
                    context.drawImage(tg, 0, 0);
                }

                lastGridBounds = gridBounds.toString();
                lastText = value;
                lastCharacterWidth = character.width;
                lastCharacterHeight = character.height;
                lastPadding = padding;
                lastFrontCursor = frontCursor.i;
                lastBackCursor = backCursor.i;
                lastFocused = focused;
                lastFont = context.font;
                lastThemeName = theme.name;
                lastScrollX = scroll.x;
                lastScrollY = scroll.y;
            }
        };

        render = () => {
            requestAnimationFrame(doRender);
        };
        //<<<<<<<<<< RENDERING <<<<<<<<<<


        render();
    }
}