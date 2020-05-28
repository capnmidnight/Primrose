import { Cursor } from "./cursor.js";
import { monospaceFamily } from "./fonts.js"
import { Line } from "./line.js";
import { Dark } from "./themes.js";
import { TimedEvent } from "./timedEvent.js";

import {
    canvas,
    assignAttributes,
    isCanvas,
    offscreenCanvas,
    setContextSize,
    resizeContext
} from "./html.js";

import {
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

//>>>>>>>>>> PRIVATE STATIC FIELDS >>>>>>>>>>
let elementCounter = 0,
    focusedControl = null,
    hoveredControl = null;

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
        language: "JavaScript",
        scaleFactor: devicePixelRatio
    }),
    controls = [],
    elements = new WeakMap(),
    ready = (document.readyState === "complete"
        ? Promise.resolve("already")
        : new Promise((resolve) => {
            document.addEventListener("readystatechange", (evt) => {
                if (document.readyState === "complete") {
                    resolve("had to wait for it");
                }
            }, false);
        }))
        .then(() => {
            for (let element of document.getElementsByTagName("primrose")) {
                new Primrose({
                    element
                });
            }
        });

//<<<<<<<<<< PRIVATE STATIC FIELDS <<<<<<<<<<

export class Primrose extends EventTarget {
    constructor(options) {
        super();

        const debugEvt = (name, callback, debugLocal) => {
            return (evt) => {
                if (isDebug || debugLocal) {
                    console.log(this.toString(), name, evt);
                }

                if (!!callback) {
                    callback(evt);
                }
            };
        };

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


        //>>>>>>>>>> PRIVATE METHODS >>>>>>>>>>
        let render = () => {
            // do nothing, disabling rendering until the object is fully initialized;
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
            // figure out the width of the line count gutter
            lineCountWidth = 0;
            if (showLineNumbers) {
                const lineCount = value.split(/\n/).length;
                lineCountWidth = Math.max(1, Math.ceil(Math.log(lineCount) / Math.LN10)) + 1;
            }

            // measure the grid
            const x = Math.floor(lineCountWidth + padding / character.width),
                y = Math.floor(padding / character.height),
                w = Math.floor((this.width - 2 * padding) / character.width) - x - bottomRightGutter.width,
                h = Math.floor((this.height - 2 * padding) / character.height) - y - bottomRightGutter.height;
            gridBounds.set(x, y, w, h);

            // group the tokens into rows
            textRows.splice(0);
            textRows.push("");
            tokenRows.splice(0);
            tokenRows.push([]);
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

                const end = tokenRows.length - 1;
                if (t.value.length > 0) {
                    tokenRows[end].push(t);
                    textRows[end] += t.value;
                    currentRowWidth += t.value.length;
                }

                if (breakLine) {
                    textRows[end] = new Line(textRows[end]);
                    textRows.push("");
                    tokenRows.push([]);
                    currentRowWidth = 0;
                }
            }

            textRows[textRows.length - 1] = new Line(textRows[textRows.length - 1]);

            maxVerticalScroll = Math.max(0, tokenRows.length - gridBounds.height);

            render();
        };

        const refreshBuffers = () => {
            resized = true;
            setContextSize(fgfx, canv.width, canv.height);
            setContextSize(bgfx, canv.width, canv.height);
            setContextSize(tgfx, canv.width, canv.height);
            refreshGridBounds();
        };

        const minDelta = (v, minV, maxV) => {
            const dvMinV = v - minV,
                dvMaxV = v - maxV + 5;
            let dv = 0;
            if (dvMinV < 0 || dvMaxV >= 0) {
                // compare the absolute values, so we get the smallest change
                // regardless of direction.
                dv = Math.abs(dvMinV) < Math.abs(dvMaxV)
                    ? dvMinV
                    : dvMaxV;
            }

            return dv;
        };

        const clampScroll = () => {
            const toHigh = scroll.y < 0 || maxVerticalScroll === 0,
                toLow = scroll.y > maxVerticalScroll;

            if (toHigh) {
                scroll.y = 0;
            }
            else if (toLow) {
                scroll.y = maxVerticalScroll;
            }
            render();

            return toHigh || toLow;
        };

        const scrollIntoView = (currentCursor) => {
            const dx = minDelta(currentCursor.x, scroll.x, scroll.x + gridBounds.width),
                dy = minDelta(currentCursor.y, scroll.y, scroll.y + gridBounds.height);
            this.scrollBy(dx, dy);
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
                frontCursor.setI(textRows, curFrame.frontCursor);
                backCursor.setI(textRows, curFrame.backCursor);
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
            if (!this.isInDocument) {
                console.warn("Can't automatically resize a canvas that is not in the DOM tree");
            }
            else if (resizeContext(context, scaleFactor)) {
                refreshBuffers();
            }
        };

        this.setSize = (w, h) => {
            if (setContextSize(context, w, h, scaleFactor)) {
                refreshBuffers();
            }
        };

        this.scrollTo = (x, y) => {
            if (!wordWrap) {
                scroll.x = x;
            }
            scroll.y = y;
            return clampScroll();
        };

        this.scrollBy = (dx, dy) => {
            this.scrollTo(scroll.x + dx, scroll.y + dy);
        };
        //<<<<<<<<<< PUBLIC METHODS <<<<<<<<<<


        //>>>>>>>>>> KEY EVENT HANDLERS >>>>>>>>>>
        const keyDownCommands = Object.freeze(new Map([
            ["CursorUp", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                minCursor.up(textRows);
                maxCursor.copy(minCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorDown", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                maxCursor.down(textRows);
                minCursor.copy(maxCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorLeft", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                if (minCursor.i === maxCursor.i) {
                    minCursor.left(textRows);
                }
                maxCursor.copy(minCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorRight", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                if (minCursor.i === maxCursor.i) {
                    maxCursor.right(textRows);
                }
                minCursor.copy(maxCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorPageUp", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                minCursor.incY(textRows, -gridBounds.height);
                maxCursor.copy(minCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorPageDown", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                maxCursor.incY(textRows, gridBounds.height);
                minCursor.copy(maxCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorSkipLeft", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                if (minCursor.i === maxCursor.i) {
                    minCursor.skipLeft(textRows);
                }
                maxCursor.copy(minCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorSkipRight", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                if (minCursor.i === maxCursor.i) {
                    maxCursor.skipRight(textRows);
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
                frontCursor.end(textRows);
                backCursor.copy(frontCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorFullHome", () => {
                frontCursor.fullHome(textRows);
                backCursor.copy(frontCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorFullEnd", () => {
                frontCursor.fullEnd(textRows);
                backCursor.copy(frontCursor);
                scrollIntoView(frontCursor);
            }],

            ["SelectDown", () => {
                backCursor.down(textRows);
                scrollIntoView(frontCursor);
            }],

            ["SelectLeft", () => {
                backCursor.left(textRows);
                scrollIntoView(backCursor);
            }],

            ["SelectRight", () => {
                backCursor.right(textRows);
                scrollIntoView(backCursor);
            }],

            ["SelectUp", () => {
                backCursor.up(textRows);
                scrollIntoView(backCursor);
            }],

            ["SelectPageDown", () => {
                backCursor.incY(textRows, gridBounds.height);
                scrollIntoView(backCursor);
            }],

            ["SelectPageUp", () => {
                backCursor.incY(textRows, -gridBounds.height);
                scrollIntoView(backCursor);
            }],

            ["SelectSkipLeft", () => {
                backCursor.skipLeft(textRows);
                scrollIntoView(backCursor);
            }],

            ["SelectSkipRight", () => {
                backCursor.skipRight(textRows);
                scrollIntoView(backCursor);
            }],

            ["SelectHome", () => {
                backCursor.home();
                scrollIntoView(backCursor);
            }],

            ["SelectEnd", () => {
                backCursor.end(textRows);
                scrollIntoView(backCursor);
            }],

            ["SelectFullHome", () => {
                backCursor.fullHome(textRows);
                scrollIntoView(backCursor);
            }],

            ["SelectFullEnd", () => {
                backCursor.fullEnd(textRows);
                scrollIntoView(backCursor);
            }],

            ["SelectAll", () => {
                frontCursor.fullHome();
                backCursor.fullEnd(textRows);
                render();
            }],

            ["ScrollDown", () => {
                if (scroll.y < textRows.length - gridBounds.height) {
                    this.scrollBy(0, 1);
                }
            }],

            ["ScrollUp", () => {
                if (scroll.y > 0) {
                    this.scrollBy(0, -1);
                }
            }],

            ["DeleteLetterLeft", () => {
                if (frontCursor.i === backCursor.i) {
                    backCursor.left(textRows);
                }
                this.selectedText = "";
            }],

            ["DeleteLetterRight", () => {
                if (frontCursor.i === backCursor.i) {
                    backCursor.right(textRows);
                }
                this.selectedText = "";
            }],

            ["DeleteWordLeft", () => {
                if (frontCursor.i === backCursor.i) {
                    frontCursor.skipLeft(textRows);
                }
                this.selectedText = "";
            }],

            ["DeleteWordRight", () => {
                if (frontCursor.i === backCursor.i) {
                    backCursor.skipRight(textRows);
                }
                this.selectedText = "";
            }],

            ["DeleteLine", () => {
                if (frontCursor.i === backCursor.i) {
                    frontCursor.home();
                    backCursor.end(textRows);
                    backCursor.right(textRows);
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
                frontCursor.incX(textRows, tabString.length);
                backCursor.copy(frontCursor);
            }],

            ["RemoveTab", () => {
                const line = textRows[frontCursor.y],
                    toDelete = Math.min(frontCursor.x, tabWidth);
                for (let i = 0; i < frontCursor.x; ++i) {
                    if (line[i] !== ' ') {
                        // can only remove tabs at the beginning of a line
                        return;
                    }
                }

                frontCursor.incX(textRows, -toDelete);
                this.selectedText = "";
                frontCursor.left(textRows);
                frontCursor.right(textRows);
            }]
        ]));
        this.readKeyDownEvent = debugEvt("keydown", (evt) => {
            const command = os.makeCommand(evt);
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
                    frontCursor.incX(textRows, indent.length + 1);
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
                    frontCursor.incX(textRows, indent.length);
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
            if (!this.readOnly) {
                evt.preventDefault();

                if (keyPressCommands.has(command.command)) {
                    keyPressCommands.get(command.command)();
                }
                else if (command.type === "printable"
                    || command.type === "whitespace") {
                    this.selectedText = command.text;
                    frontCursor.right(textRows);
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
            pressed = true;
        };

        const startSelecting = () => {
            dragging = true;
            moveCursor(frontCursor);
        };

        const mouseLikePointerUp = () => {
            pressed = false;
            dragging = false;
            scrolling = false;
        };

        const pointerMove = () => {
            if (dragging) {
                moveCursor(backCursor);
            }
            else if (pressed) {
                dragScroll();
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
                cursor.setXY(textRows, pointer.x, pointer.y);
                backCursor.copy(cursor);
            }
            else if (scrolling || onRight && !onBottom) {
                scrolling = true;
                const scrollHeight = textRows.length - gridBounds.height;
                if (gy >= 0 && scrollHeight >= 0) {
                    const sy = gy * scrollHeight / gridBounds.height;
                    this.scrollTo(scroll.x, sy);
                }
            }
            else if (onBottom && !onLeft) {
                let maxWidth = 0;
                for (let dy = 0; dy < textRows.length; ++dy) {
                    maxWidth = Math.max(maxWidth, textRows[dy].length);
                }
                const scrollWidth = maxWidth - gridBounds.width;
                if (gx >= 0 && scrollWidth >= 0) {
                    const sx = gx * scrollWidth / gridBounds.width;
                    this.scrollTo(sx, scroll.y);
                }
            }
            else if (onLeft && !onBottom) {
                // clicked in number-line gutter
            }
            else {
                // clicked in the lower-left corner
            }

            render();
        }

        let lastScrollDX = null,
            lastScrollDY = null;
        const dragScroll = () => {
            if (lastScrollDX !== null
                && lastScrollDY !== null) {
                let dx = (lastScrollDX - pointer.x) / character.width,
                    dy = (lastScrollDY - pointer.y) / character.height;
                this.scrollBy(dx, dy);
            }
            lastScrollDX = pointer.x;
            lastScrollDY = pointer.y;
        };

        const mouseLikePointerDown = (setPointer) => {
            return (evt) => {
                setPointer(evt);
                pointerDown();
                startSelecting();
            }
        };

        const mouseLikePointerMove = (setPointer) => {
            return (evt) => {
                setPointer(evt);
                pointerMove();
            };
        };

        const touchLikePointerDown = (setPointer) => {
            return (evt) => {
                setPointer(evt);
                tx = pointer.x;
                ty = pointer.y;
                pointerDown();
                longPress.start();
            };
        };

        const touchLikePointerUp = () => {
            if (longPress.cancel() && !dragging) {
                startSelecting();
            }
            mouseLikePointerUp();
            lastScrollDX = null;
            lastScrollDY = null;
        };

        const touchLikePointerMove = (setPointer) => {
            return (evt) => {
                setPointer(evt);
                if (longPress.isRunning) {
                    const dx = pointer.x - tx,
                        dy = pointer.y - ty,
                        lenSq = dx * dx + dy * dy;
                    if (lenSq > 25) {
                        longPress.cancel();
                    }
                }

                if (!longPress.isRunning) {
                    pointerMove();
                }
            };
        };


        //>>>>>>>>>> MOUSE EVENT HANDLERS >>>>>>>>>> 
        const setOffsetPointer = (evt) => {
            pointer.set(
                evt.offsetX,
                evt.offsetY);
        };
        this.readMouseOverEvent = debugEvt("mouseover", pointerOver);
        this.readMouseOutEvent = debugEvt("mouseout", pointerOut);
        this.readMouseDownEvent = debugEvt("mousedown", mouseLikePointerDown(setOffsetPointer));
        this.readMouseUpEvent = debugEvt("mouseup", mouseLikePointerUp);
        this.readMouseMoveEvent = debugEvt("mousemove", mouseLikePointerMove(setOffsetPointer));

        this.readWheelEvent = debugEvt("wheel", (evt) => {
            if (hovered || focused) {
                if (!evt.ctrlKey
                    && !evt.altKey
                    && !evt.shiftKey
                    && !evt.metaKey) {
                    const dy = Math.floor(evt.deltaY * wheelScrollSpeed / scrollScale);
                    if (!this.scrollBy(0, dy) || focused) {
                        evt.preventDefault();
                    }
                }
                else if (!evt.ctrlKey
                    && !evt.altKey
                    && !evt.metaKey) {
                    evt.preventDefault();
                    this.fontSize += -evt.deltaY / scrollScale;
                }
                render();
            }
        });
        //<<<<<<<<<< MOUSE EVENT HANDLERS <<<<<<<<<<


        //>>>>>>>>>> TOUCH EVENT HANDLERS >>>>>>>>>>
        let currentTouchID = null;
        const findTouch = (touches) => {
            for (let touch of touches) {
                if (currentTouchID === null
                    || touch.identifier === currentTouchID) {
                    return touch;
                }
            }
            return null;
        }

        const withPrimaryTouch = (callback) => {
            return (evt) => {
                evt.preventDefault();
                callback(findTouch(evt.touches)
                    || findTouch(evt.changedTouches))
            };
        };

        const setTouchPointer = (touch) => {
            const cb = canv.getBoundingClientRect();
            pointer.set(
                touch.clientX - cb.left,
                touch.clientY - cb.top);
        };

        const vibrate = (len) => {
            longPress.cancel();
            if (len > 0) {
                vibX = (Math.random() - 0.5) * 10;
                vibY = (Math.random() - 0.5) * 10;
                setTimeout(() => vibrate(len - 10), 10);
            }
            else {
                vibX = 0;
                vibY = 0;
            }
            render();
        };

        const longPress = new TimedEvent(1000);

        longPress.addEventListener("tick", () => {
            startSelecting();
            backCursor.copy(frontCursor);
            frontCursor.skipLeft(textRows);
            backCursor.skipRight(textRows);
            render();
            navigator.vibrate(20);
            if (isDebug) {
                vibrate(320);
            }
        });

        let vibX = 0,
            vibY = 0,
            tx = 0,
            ty = 0;
        this.readTouchStartEvent = debugEvt("touchstart", withPrimaryTouch(touchLikePointerDown(setTouchPointer)));
        this.readTouchMoveEvent = debugEvt("touchmove", withPrimaryTouch(touchLikePointerMove(setTouchPointer)));
        this.readTouchEndEvent = debugEvt("touchend", withPrimaryTouch(touchLikePointerUp));
        //<<<<<<<<<< TOUCH EVENT HANDLERS <<<<<<<<<<


        //>>>>>>>>>> UV POINTER EVENT HANDLERS >>>>>>>>>>
        const setUVPointer = (evt) => {
            pointer.set(
                evt.uv.x * this.width,
                (1 - evt.uv.y) * this.height);
        }

        this.mouse = Object.freeze({
            readOverEventUV: debugEvt("mouseuvover", pointerOver),
            readOutEventUV: debugEvt("mouseuvout", pointerOut),
            readDownEventUV: debugEvt("mouseuvdown", mouseLikePointerDown(setUVPointer)),
            readMoveEventUV: debugEvt("mouseuvmove", mouseLikePointerMove(setUVPointer)),
            readUpEventUV: debugEvt("mouseuvup", mouseLikePointerUp)
        });

        this.touch = Object.freeze({
            readOverEventUV: debugEvt("touchuvover", pointerOver),
            readOutEventUV: debugEvt("touchuvout", pointerOut),
            readDownEventUV: debugEvt("touchuvdown", touchLikePointerDown(setUVPointer)),
            readMoveEventUV: debugEvt("touchuvmove", touchLikePointerMove(setUVPointer)),
            readUpEventUV: debugEvt("touchuvup", touchLikePointerUp)
        });

        this.readUVOverEvent = this.mouse.readOverEventUV;
        this.readUVOutEvent = this.mouse.readOutEventUV;
        this.readUVDownEvent = this.mouse.readDownEventUV;
        this.readUVUpEvent = this.mouse.readUpEventUV;
        this.readUVMoveEvent = this.mouse.readMoveEventUV;
        //<<<<<<<<<< UV POINTER EVENT HANDLERS <<<<<<<<<<
        //<<<<<<<<<< POINTER EVENT HANDLERS <<<<<<<<<<


        //>>>>>>>>>> PUBLIC PROPERTIES >>>>>>>>>>
        Object.defineProperties(this, {

            id: {
                get: () => id
            },

            element: {
                get: () => element
            },

            isInDocument: {
                get: () => !isOffScreen
                    && document.body.contains(canv)
            },

            canvas: {
                get: () => canv
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

            text: {
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
                        frontCursor.setI(textRows, i);
                        render();
                    }
                }
            },

            selectionEnd: {
                get: () => backCursor.i,
                set: (i) => {
                    i = i | 0;
                    if (i !== backCursor.i) {
                        backCursor.setI(textRows, i);
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
                        refreshGridBounds();
                    }
                }
            },

            scaleFactor: {
                get: () => scaleFactor,
                set: (s) => {
                    s = Math.max(0.25, Math.min(4, s || 0));
                    if (s !== scaleFactor) {
                        const lastWidth = this.width,
                            lastHeight = this.height
                        scaleFactor = s;
                        this.setSize(lastWidth, lastHeight);
                    }
                }
            },

            width: {
                get: () => canv.width / scaleFactor,
                set: (w) => this.setSize(w, this.height)
            },

            height: {
                get: () => canv.height / scaleFactor,
                set: (h) => this.setSize(this.width, h)
            }
        });
        //<<<<<<<<<< PUBLIC PROPERTIES <<<<<<<<<<


        //>>>>>>>>>> PRIVATE MUTABLE FIELDS >>>>>>>>>>
        let id = null,
            value = "",
            padding = 0,
            theme = Dark,
            tabWidth = 2,
            canv = null,
            tokens = [],
            resized = false,
            hovered = false,
            focused = false,
            fontSize = null,
            scaleFactor = 2,
            textRows = [""],
            pressed = false,
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
            element = null,
            language = JavaScript,
            showScrollBars = false,
            showLineNumbers = false,
            elementID = ++elementCounter,
            controlType = singleLineOutput,
            maxVerticalScroll = 0,

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

        const history = [],
            tokenRows = [],
            scroll = new Point(),
            pointer = new Point(),
            character = new Size(),
            tokenBack = new Cursor(),
            tokenFront = new Cursor(),
            backCursor = new Cursor(),
            outEvt = new Event("out"),
            frontCursor = new Cursor(),
            overEvt = new Event("over"),
            gridBounds = new Rectangle(),
            bottomRightGutter = new Size(),
            os = isMacOS ? MacOS : Windows,
            changeEvt = new Event("change"),
            updateEvt = new Event("update");
        //<<<<<<<<<< PRIVATE MUTABLE FIELDS <<<<<<<<<<

        //>>>>>>>>>> SETUP CANVAS >>>>>>>>>>
        let currentValue = "",
            currentTabIndex = -1;

        if (options.element !== null) {
            const elem = options.element,
                width = elem.width,
                height = elem.height;
            currentTabIndex = elem.tabIndex;

            const optionsStr = elem.dataset.options || "",
                entries = optionsStr.trim().split(','),
                optionUser = {};
            for (let entry of entries) {
                entry = entry.trim();
                if (entry.length > 0) {
                    const pairs = entry.split('=');
                    if (pairs.length > 1) {
                        const key = pairs[0].trim(),
                            value = pairs[1].trim(),
                            boolTest = value.toLocaleLowerCase();
                        if (boolTest === "true"
                            || boolTest === "false") {
                            optionUser[key] = boolTest === "true";
                        }
                        else {
                            optionUser[key] = value;
                        }
                    }
                }
            }

            currentValue = elem.textContent;
            options = Object.assign(
                options,
                { width, height },
                optionUser);
        }


        if (options.element === null) {
            canv = offscreenCanvas(options);
            isOffScreen = !(canv instanceof HTMLCanvasElement);
        }
        else if (isCanvas(options.element)) {
            element = canv = options.element;
            canv.innerHTML = "";
        }
        else {
            element = options.element;
            element.innerHTML = "";

            canv = canvas({
                style: {
                    width: "100%",
                    height: "100%"
                }
            });
            element.appendChild(canv);
            element.removeAttribute("tabindex");

            assignAttributes(element, {
                style: {
                    display: "block",
                    padding: "none",
                    border: "2px inset #c0c0c0",
                    overflow: "unset"
                }
            });
        }

        if (canv.parentElement !== null
            && currentTabIndex === -1) {
            const tabbableElements = document.querySelectorAll("[tabindex]");
            for (let tabbableElement of tabbableElements) {
                currentTabIndex = Math.max(currentTabIndex, tabbableElement.tabIndex);
            }
            ++currentTabIndex;
        }

        if (canv instanceof HTMLCanvasElement
            && this.isInDocument) {
            canv.tabIndex = currentTabIndex;
            canv.style.touchAction = "none";
            canv.addEventListener("focus", () => this.focus());
            canv.addEventListener("blur", () => this.blur());

            canv.addEventListener("mouseover", this.readMouseOverEvent);
            canv.addEventListener("mouseout", this.readMouseOutEvent);
            canv.addEventListener("mousedown", this.readMouseDownEvent);
            canv.addEventListener("mouseup", this.readMouseUpEvent);
            canv.addEventListener("mousemove", this.readMouseMoveEvent);

            canv.addEventListener("touchstart", this.readTouchStartEvent);
            canv.addEventListener("touchend", this.readTouchEndEvent);
            canv.addEventListener("touchmove", this.readTouchMoveEvent);
        }
        //<<<<<<<<<< SETUP CANVAS <<<<<<<<<<

        //>>>>>>>>>> SETUP BUFFERS >>>>>>>>>>
        const context = canv.getContext("2d"),
            fg = offscreenCanvas(),
            fgfx = fg.getContext("2d"),
            bg = offscreenCanvas(),
            bgfx = bg.getContext("2d"),
            tg = offscreenCanvas(),
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

        tgfx.textAlign = "right";
        fgfx.textAlign = "left";
        //<<<<<<<<<< SETUP BUFFERS <<<<<<<<<<

        //>>>>>>>>>> INITIALIZE STATE >>>>>>>>>>
        this.addEventListener("blur", () => {
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
        id = options.id;
        this.readOnly = options.readOnly;
        this.multiLine = options.multiLine;
        this.wordWrap = options.wordWrap;
        this.showScrollBars = options.scrollBars;
        this.showLineNumbers = options.lineNumbers;
        this.padding = options.padding;
        this.fontSize = options.fontSize;
        this.language = options.language;
        this.scaleFactor = options.scaleFactor;
        this.value = currentValue;
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
                clearFunc = theme.regular.backColor ? "fillRect" : "clearRect";

            if (clearFunc === "fillRect") {
                bgfx.fillStyle = theme.regular.backColor;
            }
            bgfx[clearFunc](0, 0, canv.width, canv.height);
            bgfx.save();
            bgfx.scale(scaleFactor, scaleFactor);
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

            const minY = scroll.y | 0,
                maxY = minY + gridBounds.height,
                minX = scroll.x | 0,
                maxX = minX + gridBounds.width;
            tokenFront.setXY(textRows, 0, minY);
            tokenBack.copy(tokenFront);
            for (let y = minY; y <= maxY && y < tokenRows.length; ++y) {
                // draw the tokens on this row
                const row = tokenRows[y];
                for (let i = 0; i < row.length; ++i) {
                    const t = row[i];
                    tokenBack.x += t.value.length;
                    tokenBack.i += t.value.length;

                    // skip drawing tokens that aren't in view
                    if (minX <= tokenBack.x && tokenFront.x <= maxX) {
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
                const cc = theme.cursorColor || DefaultTheme.cursorColor,
                    w = 1 / character.width;
                fillRect(bgfx, cc, minCursor.x, minCursor.y, w, 1);
                fillRect(bgfx, cc, maxCursor.x, maxCursor.y, w, 1);
            }
            bgfx.restore();
        };

        const renderCanvasForeground = () => {
            fgfx.clearRect(0, 0, canv.width, canv.height);
            fgfx.save();
            fgfx.scale(scaleFactor, scaleFactor);
            fgfx.translate(
                (gridBounds.x - scroll.x) * character.width + padding,
                padding);

            const minY = scroll.y | 0,
                maxY = minY + gridBounds.height,
                minX = scroll.x | 0,
                maxX = minX + gridBounds.width;
            tokenFront.setXY(textRows, 0, minY);
            tokenBack.copy(tokenFront);
            for (let y = minY; y <= maxY && y < tokenRows.length; ++y) {
                // draw the tokens on this row
                const row = tokenRows[y],
                    textY = (y - scroll.y) * character.height;

                for (let i = 0; i < row.length; ++i) {
                    const t = row[i];
                    tokenBack.x += t.value.length;
                    tokenBack.i += t.value.length;

                    // skip drawing tokens that aren't in view
                    if (minX <= tokenBack.x && tokenFront.x <= maxX) {

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
            tgfx.clearRect(0, 0, canv.width, canv.height);
            tgfx.save();
            tgfx.scale(scaleFactor, scaleFactor);
            tgfx.translate(padding, padding);

            if (showLineNumbers) {
                fillRect(tgfx,
                    theme.regular.selectedBackColor ||
                    DefaultTheme.regular.selectedBackColor,
                    0, 0,
                    gridBounds.x, this.width - padding * 2);
                strokeRect(tgfx,
                    theme.regular.foreColor ||
                    DefaultTheme.regular.foreColor,
                    0, 0,
                    gridBounds.x, this.height - padding * 2);
            }

            let maxLineWidth = 2;
            tgfx.save();
            {
                tgfx.translate((lineCountWidth - 0.5) * character.width, -scroll.y * character.height);
                let lastLine = -1;
                const minY = scroll.y | 0,
                    maxY = minY + gridBounds.height,
                    minX = scroll.x | 0,
                    maxX = minX + gridBounds.width;
                tokenFront.setXY(textRows, 0, minY);
                tokenBack.copy(tokenFront);
                for (let y = minY; y <= maxY && y < tokenRows.length; ++y) {
                    const row = tokenRows[y];

                    for (let i = 0; i < row.length; ++i) {
                        const t = row[i];
                        tokenBack.x += t.value.length;
                        tokenBack.i += t.value.length;
                    }
                    tokenFront.copy(tokenBack);

                    maxLineWidth = Math.max(maxLineWidth, tokenBack.x - 1);
                    tokenFront.x = 0;
                    ++tokenFront.y;
                    tokenBack.copy(tokenFront);

                    if (showLineNumbers) {
                        // draw the left gutter
                        const currentLine = row.length > 0
                            ? row[0].line
                            : lastLine + 1,
                            lineNumber = currentLine.toString();

                        if (currentLine > lastLine) {
                            lastLine = currentLine;
                            tgfx.font = "bold " + context.font;
                            tgfx.fillStyle = theme.regular.foreColor;
                            tgfx.fillText(
                                lineNumber,
                                0, y * character.height);
                        }
                    }
                }
            }
            tgfx.restore();

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

            tgfx.restore();
            if (!focused) {
                tgfx.fillStyle = theme.regular.unfocused || DefaultTheme.regular.unfocused;
                tgfx.fillRect(0, 0, canv.width, canv.height);
            }
        };

        const doRender = () => {
            if (tokens && theme) {
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
                    renderCanvasBackground();
                }
                if (foregroundChanged) {
                    renderCanvasForeground();
                }
                if (trimChanged) {
                    renderCanvasTrim();
                }

                context.clearRect(0, 0, canv.width, canv.height);
                context.save();
                context.translate(vibX, vibY);
                context.drawImage(bg, 0, 0);
                context.drawImage(fg, 0, 0);
                context.drawImage(tg, 0, 0);
                context.restore();

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
                resized = false;
                this.dispatchEvent(updateEvt);
            }
        };

        render = () => {
            requestAnimationFrame(doRender);
        };
        //<<<<<<<<<< RENDERING <<<<<<<<<<


        doRender();

        // This is done last so that controls that have errored 
        // out during their setup don't get added to the control
        // manager.
        Primrose.add(element, this);
    }
}



Primrose.add = (key, control) => {
    if (key !== null) {
        elements.set(key, control);
    }

    if (controls.indexOf(control) === -1) {
        controls.push(control);

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
};

Primrose.has = (key) => {
    return elements.has(key);
};

Primrose.get = (key) => {
    return elements.has(key)
        ? elements.get(key)
        : null;
};

Object.defineProperties(Primrose, {
    focusedControl: {
        get: () => focusedControl
    },

    hoveredControl: {
        get: () => hoveredControl
    },

    editors: {
        get: () => controls.slice()
    },

    ready: {
        get: () => ready
    }
});

Object.freeze(Primrose);

requestAnimationFrame(function update() {
    requestAnimationFrame(update);
    for (let i = controls.length - 1; i >= 0; --i) {
        const control = controls[i];
        if (control.isInDocument) {
            if (elements.has(control.element)) {
                control.resize();
            }
            else {
                controls.splice(i, 1);
            }
        }
    }
});

const withCurrentControl = (name) => {
    const evtName = name.toLocaleLowerCase(),
        funcName = `read${name}Event`;

    window.addEventListener(evtName, (evt) => {
        if (focusedControl !== null) {
            focusedControl[funcName](evt);
        }
    }, { passive: false });
};

withCurrentControl("KeyDown");
withCurrentControl("KeyPress");
withCurrentControl("KeyUp");
withCurrentControl("BeforeCopy");
withCurrentControl("BeforeCut");
withCurrentControl("BeforePase");
withCurrentControl("Copy");
withCurrentControl("Cut");
withCurrentControl("Paste");

window.addEventListener("wheel", (evt) => {
    const control = focusedControl || hoveredControl;
    if (control !== null) {
        control.readWheelEvent(evt);
    }
}, { passive: false });