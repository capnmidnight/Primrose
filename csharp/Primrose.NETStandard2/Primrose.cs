using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;

namespace Primrose
{

    public class Primrose
    {
        private static readonly Theme DefaultTheme = Themes.Dark;

        public event EventHandler Update;
        private void OnUpdate()
        {
            Update?.Invoke(this, EventArgs.Empty);
        }

        public event EventHandler Change;
        private void OnChange()
        {
            Change?.Invoke(this, EventArgs.Empty);
        }

        public event EventHandler Focus;
        private void OnFocus()
        {
            Focus?.Invoke(this, EventArgs.Empty);
        }

        public event EventHandler Blur;
        private void OnBlur()
        {
            Blur?.Invoke(this, EventArgs.Empty);
        }

        public event EventHandler Over;
        private void OnOver()
        {
            Over?.Invoke(this, EventArgs.Empty);
        }

        public event EventHandler Out;
        private void OnOut()
        {
            Out?.Invoke(this, EventArgs.Empty);
        }

        #region PRIVATE STATIC FIELDS
        private static int elementCounter = 0;

        /// <summary>
        /// The current `Primrose` control that has pointer-focus. It will receive all keyboard and clipboard events. In 2D contexts, you probably don't need to check this value, but in WebGL contexts, this is useful for helping Primrose manage events.
        /// If no control is focused, this returns `null`.
        /// </summary>
        public static Primrose focusedControl { get; private set; }

        /// <summary>
        /// The current `Primrose` control that has the mouse hovered over it. In 2D contexts, you probably don't need to check this value, but in WebGL contexts, this is useful for helping Primrose manage events.
        /// If no control is hovered, this returns `null`.
        /// </summary>
        public static Primrose hoveredControl { get; private set; }

        /// <summary>
        /// An array of all of the `Primrose` editor controls that Primrose currently knows about.
        /// This array is not mutable and is not the array used by the Event Manager. It is a read-only clone that is created whenever the Event Manager registers or removes a new control
        /// </summary.
        public static Primrose[] editors { get; private set; } = Array.Empty<Primrose>();

        private static readonly List<Primrose> controls = new List<Primrose>();

        private const int wheelScrollSpeed = 4;
        private const int vScrollWidth = 2;
        private const int scrollScale = 100;

        private static readonly Dictionary<object, Primrose> elements = new Dictionary<object, Primrose>();
        #endregion PRIVATE STATIC FIELDS

#if DEBUG
        private const bool isDebug = true;
#else
        private const bool isDebug = false;
#endif

        private void debugEvt(string name, object evt, bool localDebug = false)
        {
            if (isDebug || localDebug)
            {
                Console.WriteLine($"Primrose #{elementID}: {name} {evt}");
            }
        }

        private int elementID,
            historyIndex = -1,
            lineCount = 1,
            lineCountWidth = 1,
            maxVerticalScroll;
        private bool resized,
            fontChanged,
            pressed,
            dragging,
            scrolling,
            tabPressed;
        private string tabString;

        private string[] controlType;


        private bool? lastFocused = null;
        private int? lastCharacterHeight = null,
            lastCharacterWidth = null,
            lastFrontCursor = null,
            lastBackCursor = null,
            lastPadding = null,
            lastScrollX = null,
            lastScrollY = null;
        string lastGridBounds = null,
            lastThemeName = null,
            lastText = null;

        private Image fg, bg, tg;

        private Graphics context, fgfx, bgfx, tgfx;

        private readonly List<HistoryFrame> history = new List<HistoryFrame>();
        private readonly List<Token> tokens = new List<Token>();
        private readonly List<Row> rows = new List<Row>(){
            Row.emptyRow(0, 0, 0)
        };

        private readonly Point scroll = new Point(0, 0);
        private readonly Point pointer = new Point(0, 0);
        private readonly Size character = new Size(0, 0);
        private readonly Size bottomRightGutter = new Size(0, 0);
        private readonly Rectangle gridBounds = new Rectangle(0, 0, 0, 0);
        private readonly Cursor tokenBack = new Cursor();
        private readonly Cursor tokenFront = new Cursor();
        private readonly Cursor backCursor = new Cursor();
        private readonly Cursor frontCursor = new Cursor();

        private readonly OperatingSystem os;

        public Primrose(PrimroseOptions options)
        {
            elementID = ++elementCounter;

            #region VALIDATE PARAMETERS
            options.readOnly ??= PrimroseOptions.Default.readOnly;
            options.multiLine ??= PrimroseOptions.Default.multiLine;
            options.wordWrap ??= PrimroseOptions.Default.wordWrap;
            options.scrollBars ??= PrimroseOptions.Default.scrollBars;
            options.lineNumbers ??= PrimroseOptions.Default.lineNumbers;
            options.padding ??= PrimroseOptions.Default.padding;
            options.fontSize ??= PrimroseOptions.Default.fontSize;
            options.language ??= PrimroseOptions.Default.language;
            options.scaleFactor ??= PrimroseOptions.Default.scaleFactor;
            options.width ??= PrimroseOptions.Default.width;
            options.height ??= PrimroseOptions.Default.height;

            #endregion VALIDATE PARAMETERS

            #region KEY COMMANDS
            keyDownCommands = new Dictionary<string, Action>() {
                { "CursorUp", () =>
                {
                    Cursor minCursor = Cursor.min(frontCursor, backCursor),
                        maxCursor = Cursor.max(frontCursor, backCursor);
                    minCursor.up(rows);
                    maxCursor.copy(minCursor);
                    scrollIntoView(frontCursor);
                } },

                { "CursorDown", () =>
                {
                    Cursor minCursor = Cursor.min(frontCursor, backCursor),
                        maxCursor = Cursor.max(frontCursor, backCursor);
                    maxCursor.down(rows);
                    minCursor.copy(maxCursor);
                    scrollIntoView(frontCursor);
                } },

                { "CursorLeft", () =>
                {
                    Cursor minCursor = Cursor.min(frontCursor, backCursor),
                        maxCursor = Cursor.max(frontCursor, backCursor);
                    if (minCursor.i == maxCursor.i)
                    {
                        minCursor.left(rows);
                    }
                    maxCursor.copy(minCursor);
                    scrollIntoView(frontCursor);
                } },

                { "CursorRight", () =>
                {
                    Cursor minCursor = Cursor.min(frontCursor, backCursor),
                        maxCursor = Cursor.max(frontCursor, backCursor);
                    if (minCursor.i == maxCursor.i)
                    {
                        maxCursor.right(rows);
                    }
                    minCursor.copy(maxCursor);
                    scrollIntoView(frontCursor);
                } },

                { "CursorPageUp", () =>
                {
                    Cursor minCursor = Cursor.min(frontCursor, backCursor),
                        maxCursor = Cursor.max(frontCursor, backCursor);
                    minCursor.incY(rows, -gridBounds.height);
                    maxCursor.copy(minCursor);
                    scrollIntoView(frontCursor);
                } },

                { "CursorPageDown", () =>
                {
                    Cursor minCursor = Cursor.min(frontCursor, backCursor),
                        maxCursor = Cursor.max(frontCursor, backCursor);
                    maxCursor.incY(rows, gridBounds.height);
                    minCursor.copy(maxCursor);
                    scrollIntoView(frontCursor);
                } },

                { "CursorSkipLeft", () =>
                {
                    Cursor minCursor = Cursor.min(frontCursor, backCursor),
                        maxCursor = Cursor.max(frontCursor, backCursor);
                    if (minCursor.i == maxCursor.i)
                    {
                        minCursor.skipLeft(rows);
                    }
                    maxCursor.copy(minCursor);
                    scrollIntoView(frontCursor);
                } },

                { "CursorSkipRight", () =>
                {
                    Cursor minCursor = Cursor.min(frontCursor, backCursor),
                        maxCursor = Cursor.max(frontCursor, backCursor);
                    if (minCursor.i == maxCursor.i)
                    {
                        maxCursor.skipRight(rows);
                    }
                    minCursor.copy(maxCursor);
                    scrollIntoView(frontCursor);
                } },

                { "CursorHome", () =>
                {
                    frontCursor.home();
                    backCursor.copy(frontCursor);
                    scrollIntoView(frontCursor);
                } },

                { "CursorEnd", () =>
                {
                    frontCursor.end(rows);
                    backCursor.copy(frontCursor);
                    scrollIntoView(frontCursor);
                } },

                { "CursorFullHome", () =>
                {
                    frontCursor.fullHome();
                    backCursor.copy(frontCursor);
                    scrollIntoView(frontCursor);
                } },

                { "CursorFullEnd", () =>
                {
                    frontCursor.fullEnd(rows);
                    backCursor.copy(frontCursor);
                    scrollIntoView(frontCursor);
                } },

                { "SelectDown", () =>
                {
                    backCursor.down(rows);
                    scrollIntoView(frontCursor);
                } },

                { "SelectLeft", () =>
                {
                    backCursor.left(rows);
                    scrollIntoView(backCursor);
                } },

                { "SelectRight", () =>
                {
                    backCursor.right(rows);
                    scrollIntoView(backCursor);
                } },

                { "SelectUp", () =>
                {
                    backCursor.up(rows);
                    scrollIntoView(backCursor);
                } },

                { "SelectPageDown", () =>
                {
                    backCursor.incY(rows, gridBounds.height);
                    scrollIntoView(backCursor);
                } },

                { "SelectPageUp", () =>
                {
                    backCursor.incY(rows, -gridBounds.height);
                    scrollIntoView(backCursor);
                } },

                { "SelectSkipLeft", () =>
                {
                    backCursor.skipLeft(rows);
                    scrollIntoView(backCursor);
                } },

                { "SelectSkipRight", () =>
                {
                    backCursor.skipRight(rows);
                    scrollIntoView(backCursor);
                } },

                { "SelectHome", () =>
                {
                    backCursor.home();
                    scrollIntoView(backCursor);
                } },

                { "SelectEnd", () =>
                {
                    backCursor.end(rows);
                    scrollIntoView(backCursor);
                } },

                { "SelectFullHome", () =>
                {
                    backCursor.fullHome();
                    scrollIntoView(backCursor);
                } },

                { "SelectFullEnd", () =>
                {
                    backCursor.fullEnd(rows);
                    scrollIntoView(backCursor);
                } },

                { "SelectAll", () =>
                {
                    frontCursor.fullHome();
                    backCursor.fullEnd(rows);
                    render();
                } },

                { "ScrollDown", () =>
                {
                    if (scroll.y < rows.Count - gridBounds.height)
                    {
                        scrollBy(0, 1);
                    }
                } },

                { "ScrollUp", () =>
                {
                    if (scroll.y > 0)
                    {
                        scrollBy(0, -1);
                    }
                } },

                { "DeleteLetterLeft", () =>
                {
                    if (frontCursor.i == backCursor.i)
                    {
                        backCursor.left(rows);
                    }
                    setSelectedText("");
                } },

                { "DeleteLetterRight", () =>
                {
                    if (frontCursor.i == backCursor.i)
                    {
                        backCursor.right(rows);
                    }
                    setSelectedText("");
                } },

                { "DeleteWordLeft", () =>
                {
                    if (frontCursor.i == backCursor.i)
                    {
                        frontCursor.skipLeft(rows);
                    }
                    setSelectedText("");
                } },

                { "DeleteWordRight", () =>
                {
                    if (frontCursor.i == backCursor.i)
                    {
                        backCursor.skipRight(rows);
                    }
                    setSelectedText("");
                } },

                { "DeleteLine", () =>
                {
                    if (frontCursor.i == backCursor.i)
                    {
                        frontCursor.home();
                        backCursor.end(rows);
                        backCursor.right(rows);
                    }
                    setSelectedText("");
                } },

                { "Undo", () =>
                {
                    moveInHistory(-1);
                } },

                { "Redo", () =>
                {
                    moveInHistory(1);
                } },

                { "InsertTab", () =>
                {
                    tabPressed = true;
                    setSelectedText(tabString);
                } },

                { "RemoveTab", () =>
                {
                    var row = rows[frontCursor.y];
                        var toDelete = Math.Min(frontCursor.x, tabWidth);
                    for (var i = 0; i < frontCursor.x; ++i) {
                        if (row.text[i] != ' ') {
                            // can only remove tabs at the beginning of a row
                            return;
                        }
                    }

                    backCursor.copy(frontCursor);
                    backCursor.incX(rows, -toDelete);
                    setSelectedText("");
                } }
            };

            keyPressCommands = new Dictionary<string, Action>() {
                { "AppendNewline", () =>
                {
                    if (multiLine)
                    {
                        var indent = "";
                        var rowTokens = rows[frontCursor.y].tokens;
                        if (rowTokens.Length > 0
                            && rowTokens[0].type == "whitespace")
                        {
                            indent = rowTokens[0].value;
                        }
                        setSelectedText("\n" + indent);
                    }
                    else
                    {
                        OnChange();
                    }
                } },

                { "PrependNewline", () =>
                {
                    if (multiLine)
                    {
                        var indent = "";
                        var rowTokens = rows[frontCursor.y].tokens;
                        if (rowTokens.Length > 0
                            && rowTokens[0].type == "whitespace")
                        {
                            indent = rowTokens[0].value;
                        }
                        frontCursor.home();
                        backCursor.copy(frontCursor);
                        setSelectedText(indent + "\n");
                    }
                    else
                    {
                        OnChange();
                    }
                } },

                { "Undo", () =>
                {
                    moveInHistory(-1);
                } }
            };
            #endregion

            longPress.Tick += (obj, evt) =>
            {
                startSelecting();
                backCursor.copy(frontCursor);
                frontCursor.skipLeft(rows);
                backCursor.skipRight(rows);
                render();
                if (isDebug)
                {
                    vibrate(320);
                }
            };

            //>>>>>>>>>> SETUP CANVASES >>>>>>>>>>
            canvas = new Bitmap(options.width.Value, options.height.Value);
            refreshBuffers();
            //<<<<<<<<<< SETUP CANVASES <<<<<<<<<<

            //>>>>>>>>>> INITIALIZE STATE >>>>>>>>>>

            options.language = options.language.ToLowerInvariant();
            if (Grammar.grammars.ContainsKey(options.language))
            {
                language = Grammar.grammars[options.language];
            }
            else
            {
                language = Grammar.PlainText;
            }

            readOnly = options.readOnly == true;
            wordWrap = options.wordWrap == true;
            multiLine = options.multiLine == true;
            showScrollBars = options.scrollBars == true;
            showLineNumbers = options.lineNumbers == true;
            padding = options.padding.Value;
            fontSize = options.fontSize.Value;
            scaleFactor = options.scaleFactor.Value;

            tabString = "  ";
            tabWidth = 2;

            controlType = ControlTypes.singleLineOutput;


            os = Flags.isApple ? OperatingSystem.MacOS : OperatingSystem.Windows;
            value = "";
            //<<<<<<<<<< INITIALIZE STATE <<<<<<<<<<

            // This is done last so that controls that have errored 
            // out during their setup don't get added to the control
            // manager.
            Primrose.add(element, this);
        }

        #region PRIVATE METHODS

        #region RENDERING
        private void render()
        {
            if (theme != null)
            {
                bool textChanged = lastText != value,
                    focusChanged = focused != lastFocused,
                    paddingChanged = padding != lastPadding,
                    themeChanged = theme.name != lastThemeName,
                    boundsChanged = gridBounds.ToString() != lastGridBounds,
                    characterWidthChanged = character.width != lastCharacterWidth,
                    characterHeightChanged = character.height != lastCharacterHeight,

                    cursorChanged = frontCursor.i != lastFrontCursor
                        || backCursor.i != lastBackCursor,

                    scrollChanged = scroll.x != lastScrollX
                        || scroll.y != lastScrollY,

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

                if (backgroundChanged)
                {
                    renderCanvasBackground();
                }
                if (foregroundChanged)
                {
                    renderCanvasForeground();
                }
                if (trimChanged)
                {
                    renderCanvasTrim();
                }

                context.Clear(Color.Transparent);
                using (context.Push())
                {
                    context.TranslateTransform(vibX, vibY);
                    context.DrawImage(bg, 0, 0);
                    context.DrawImage(fg, 0, 0);
                    context.DrawImage(tg, 0, 0);
                }

                lastGridBounds = gridBounds.ToString();
                lastText = value;
                lastCharacterWidth = character.width;
                lastCharacterHeight = character.height;
                lastPadding = padding;
                lastFrontCursor = frontCursor.i;
                lastBackCursor = backCursor.i;
                lastFocused = focused;
                lastThemeName = theme.name;
                lastScrollX = scroll.x;
                lastScrollY = scroll.y;
                resized = false;
                fontChanged = false;
                OnUpdate();
            }
        }

        private void fillRect(Graphics gfx, Color color, int x, int y, int w, int h)
        {
            gfx.FillRectangle(
                brushes[color],
                x * character.width,
                y * character.height,
                w * character.width + 1,
                h * character.height + 1);
        }

        private void strokeRect(Graphics gfx, Color color, int x, int y, int w, int h)
        {
            gfx.DrawRectangle(
                pens[color],
                x * character.width,
                y * character.height,
                w * character.width + 1,
                h * character.height + 1);
        }

        private void renderCanvasBackground()
        {
            var minCursor = Cursor.min(frontCursor, backCursor);
            var maxCursor = Cursor.max(frontCursor, backCursor);
            bgfx.FillRectangle(
                brushes[theme.regular.backColor], 
                0, 0, 
                canvas.Width, canvas.Height);

            using (bgfx.Push())
            {
                bgfx.ScaleTransform(scaleFactor, scaleFactor);
                bgfx.TranslateTransform(
                    (gridBounds.x - scroll.x) * character.width + padding,
                    -scroll.y * character.height + padding);


                // draw the current row highlighter
                if (focused)
                {
                    fillRect(bgfx,
                        theme.currentRowBackColor,
                        0, minCursor.y,
                        gridBounds.width,
                        maxCursor.y - minCursor.y + 1);
                }

                int minY = scroll.y,
                    maxY = minY + gridBounds.height,
                    minX = scroll.x,
                    maxX = minX + gridBounds.width;
                tokenFront.setXY(rows, 0, minY);
                tokenBack.copy(tokenFront);
                for (var y = minY; y <= maxY && y < rows.Count; ++y)
                {
                    // draw the tokens on this row
                    var row = rows[y].tokens;
                    for (var i = 0; i < row.Length; ++i)
                    {
                        var t = row[i];
                        tokenBack.x += t.length;
                        tokenBack.i += t.length;

                        // skip drawing tokens that aren't in view
                        if (minX <= tokenBack.x && tokenFront.x <= maxX)
                        {
                            // draw the selection box
                            var inSelection = minCursor.i <= tokenBack.i
                                && tokenFront.i < maxCursor.i;
                            if (inSelection)
                            {
                                var selectionFront = Cursor.max(minCursor, tokenFront);
                                var selectionBack = Cursor.min(maxCursor, tokenBack);
                                var cw = selectionBack.i - selectionFront.i;
                                fillRect(bgfx,
                                    theme.selectedBackColor,
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
                if (focused)
                {
                    var cc = theme.cursorColor;
                    var w = 1 / character.width;
                    fillRect(bgfx, cc, minCursor.x, minCursor.y, w, 1);
                    fillRect(bgfx, cc, maxCursor.x, maxCursor.y, w, 1);
                }
            }
        }

        private void renderCanvasForeground()
        {
            fgfx.Clear(Color.Transparent);
            using (fgfx.Push())
            {
                fgfx.ScaleTransform(scaleFactor, scaleFactor);
                fgfx.TranslateTransform(
                    (gridBounds.x - scroll.x) * character.width + padding,
                    padding);

                int minY = scroll.y,
                    maxY = minY + gridBounds.height,
                    minX = scroll.x,
                    maxX = minX + gridBounds.width;
                tokenFront.setXY(rows, 0, minY);
                tokenBack.copy(tokenFront);
                for (var y = minY; y <= maxY && y < rows.Count; ++y)
                {
                    // draw the tokens on this row
                    var rowTokens = rows[y].tokens;
                    var textY = (y - scroll.y) * character.height;

                    for (var i = 0; i < rowTokens.Length; ++i)
                    {
                        var t = rowTokens[i];
                        tokenBack.x += t.length;
                        tokenBack.i += t.length;

                        // skip drawing tokens that aren't in view
                        if (minX <= tokenBack.x && tokenFront.x <= maxX)
                        {

                            // draw the text
                            var style = theme[t.type];
                            fgfx.DrawString(
                                t.value,
                                fonts[style.fontStyle],
                                brushes[style.foreColor],
                                tokenFront.x * character.width,
                                textY);
                        }

                        tokenFront.copy(tokenBack);
                    }

                    tokenFront.x = 0;
                    ++tokenFront.y;
                    tokenBack.copy(tokenFront);
                }
            }
        }

        private void renderCanvasTrim()
        {
            tgfx.Clear(Color.Transparent);
            using (tgfx.Push())
            {
                tgfx.ScaleTransform(scaleFactor, scaleFactor);
                tgfx.TranslateTransform(padding, padding);

                if (showLineNumbers)
                {
                    fillRect(tgfx,
                        theme.selectedBackColor,
                        0, 0,
                        gridBounds.x, width - padding * 2);
                    //strokeRect(tgfx,
                    //    theme.regular.foreColor ?? DefaultTheme.regular.foreColor,
                    //    0, 0,
                    //    gridBounds.x, height - padding * 2);
                }

                var maxRowWidth = 2;
                using (tgfx.Push())
                {
                    tgfx.TranslateTransform((lineCountWidth - 0.5f) * character.width, -scroll.y * character.height);
                    int lastLineNumber = -1,
                        minY = scroll.y,
                        maxY = minY + gridBounds.height,
                        minX = scroll.x,
                        maxX = minX + gridBounds.width;
                    tokenFront.setXY(rows, 0, minY);
                    tokenBack.copy(tokenFront);
                    for (var y = minY; y <= maxY && y < rows.Count; ++y)
                    {
                        var row = rows[y];
                        maxRowWidth = Math.Max(maxRowWidth, row.stringLength);
                        if (showLineNumbers)
                        {
                            // draw the left gutter
                            if (row.lineNumber > lastLineNumber)
                            {
                                lastLineNumber = row.lineNumber;
                                var fillStyle = theme.regular.foreColor;
                                tgfx.DrawString(
                                    row.lineNumber.ToString(),
                                    fonts[FontStyle.Bold],
                                    brushes[fillStyle],
                                    0, y * character.height);
                            }
                        }
                    }
                }

                // draw the scrollbars
                if (showScrollBars)
                {
                    var brush = brushes[theme.selectedBackColor];

                    // horizontal
                    if (!wordWrap && maxRowWidth > gridBounds.width)
                    {
                        int drawWidth = gridBounds.width * character.width - padding,
                            scrollX = (scroll.x * drawWidth) / maxRowWidth + gridBounds.x * character.width,
                            scrollBarWidth = drawWidth * (gridBounds.width / maxRowWidth),
                            by = height - character.height - padding,
                            bw = Math.Max(character.width, scrollBarWidth);
                        tgfx.FillRectangle(brush, scrollX, by, bw, character.height);
                        //tgfx.strokeRect(scrollX, by, bw, character.height);
                    }

                    //vertical
                    if (rows.Count > gridBounds.height)
                    {
                        int drawHeight = gridBounds.height * character.height,
                            scrollY = (scroll.y * drawHeight) / rows.Count,
                            scrollBarHeight = drawHeight * (gridBounds.height / rows.Count),
                            bx = width - vScrollWidth * character.width - 2 * padding,
                            bw = vScrollWidth * character.width,
                            bh = Math.Max(character.height, scrollBarHeight);
                        tgfx.FillRectangle(brush, bx, scrollY, bw, bh);
                        //tgfx.strokeRect(bx, scrollY, bw, bh);
                    }
                }

            }
            if (!focused)
            {
                var fillStyle = brushes[theme.unfocused];
                tgfx.FillRectangle(fillStyle, 0, 0, canvas.Width, canvas.Height);
            }
        }
        #endregion RENDERING

        private readonly Dictionary<FontStyle, Font> fonts = new Dictionary<FontStyle, Font>();
        private void refreshFont()
        {
            fontChanged = true;
            foreach(var font in fonts.Values)
            {
                font.Dispose();
            }
            fonts.Clear();

            var styles = theme.Styles
                .Union(DefaultTheme.Styles)
                .Append(FontStyle.Bold)
                .Distinct();

            foreach(var style in styles)
            {
                fonts.Add(style, new Font(fontFamily, fontSize, style, GraphicsUnit.Pixel));
            }

            character.height = fontSize;
            // measure 100 letter M's, then divide by 100, to get the width of an M
            // to two decimal places on systems that return integer values from
            // measureText.
            character.width = (int)Math.Round(context.MeasureString(
                "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM",
                fonts[FontStyle.Regular])
                .Width /
                100);
            refreshAllTokens();
        }

        private void refreshControlType()
        {
            var lastControlType = controlType;

            if (readOnly && multiLine)
            {
                controlType = ControlTypes.multiLineOutput;
            }
            else if (readOnly && !multiLine)
            {
                controlType = ControlTypes.singleLineOutput;
            }
            else if (!readOnly && multiLine)
            {
                controlType = ControlTypes.multiLineInput;
            }
            else
            {
                controlType = ControlTypes.singleLineInput;
            }

            if (controlType != lastControlType)
            {
                refreshAllTokens();
            }
        }

        private void refreshGutter()
        {
            if (!showScrollBars)
            {
                bottomRightGutter.set(0, 0);
            }
            else if (wordWrap)
            {
                bottomRightGutter.set(vScrollWidth, 0);
            }
            else
            {
                bottomRightGutter.set(vScrollWidth, 1);
            }
        }

        private void setValue(string txt, bool setUndo)
        {
            txt = txt ?? string.Empty;
            txt = txt.Replace("\r\n", "\n");
            if (txt != value)
            {
                value = txt;
                if (setUndo)
                {
                    pushUndo();
                }
                refreshAllTokens();
                OnChange();
            }
        }

        private void setSelectedText(string txt)
        {
            txt = txt ?? string.Empty;
            txt = txt.Replace("\r\n", "\n");

            if (frontCursor.i != backCursor.i || txt.Length > 0)
            {
                var minCursor = Cursor.min(frontCursor, backCursor);
                var maxCursor = Cursor.max(frontCursor, backCursor);
                var startRow = rows[minCursor.y];
                var endRow = rows[maxCursor.y];

                var unchangedLeft = value.Substring(0, startRow.startStringIndex);
                var unchangedRight = value.Substring(endRow.endStringIndex);

                var changedStartSubStringIndex = minCursor.i - startRow.startStringIndex;
                var changedLeft = startRow.substring(0, changedStartSubStringIndex);

                var changedEndSubStringIndex = maxCursor.i - endRow.startStringIndex;
                var changedRight = endRow.substring(changedEndSubStringIndex);

                var changedText = changedLeft + txt + changedRight;

                value = unchangedLeft + changedText + unchangedRight;

                pushUndo();

                refreshTokens(minCursor.y, maxCursor.y, changedText);
                frontCursor.setI(rows, minCursor.i + txt.Length);
                backCursor.copy(frontCursor);
                scrollIntoView(frontCursor);
                OnChange();
            }
        }

        private void refreshAllTokens()
        {
            refreshTokens(0, rows.Count - 1, value);
        }

        private void refreshTokens(int startY, int endY, string txt)
        {
            while (startY > 0
                && rows[startY].lineNumber == rows[startY - 1].lineNumber)
            {
                --startY;
                txt = rows[startY].text + txt;
            }

            while (endY < rows.Count - 1 && rows[endY].lineNumber == rows[endY + 1].lineNumber)
            {
                ++endY;
                txt += rows[endY].text;
            }


            var newTokens = language.tokenize(txt);
            var startRow = rows[startY];
            var startTokenIndex = startRow.startTokenIndex;
            var startLineNumber = startRow.lineNumber;
            var startStringIndex = startRow.startStringIndex;
            var endRow = rows[endY];
            var endLineNumber = endRow.lineNumber;
            var endStringIndex = endRow.endStringIndex;
            var endTokenIndex = endRow.endTokenIndex;
            var tokenRemoveCount = endTokenIndex - startTokenIndex;
            var oldTokens = tokens.Splice(startTokenIndex, tokenRemoveCount, newTokens);
            var oldLineCount = lineCount;

            // figure out the width of the line count gutter
            lineCountWidth = 0;
            if (showLineNumbers)
            {
                foreach (var token in oldTokens)
                {
                    if (token.type == "newlines")
                    {
                        --lineCount;
                    }
                }

                foreach (var token in newTokens)
                {
                    if (token.type == "newlines")
                    {
                        ++lineCount;
                    }
                }

                lineCountWidth = Math.Max(1, (int)Math.Ceiling(Math.Log10(lineCount))) + 1;
            }

            // measure the grid
            var fPadding = (float)padding;
            int x = (int)Math.Floor(lineCountWidth + fPadding / character.width),
                y = (int)Math.Floor(fPadding / character.height),
                w = (int)Math.Floor((width - 2 * fPadding) / character.width) - x - bottomRightGutter.width,
                h = (int)Math.Floor((height - 2 * fPadding) / character.height) - y - bottomRightGutter.height;
            gridBounds.set(x, y, w, h);

            // Perform the layout
            var tokenQueue = newTokens.Select(t => t.clone()).ToList();
            var rowRemoveCount = endY - startY + 1;
            var newRows = new List<Row>();

            var currentString = "";
            var currentTokens = new List<Token>();
            var currentStringIndex = startStringIndex;
            var currentTokenIndex = startTokenIndex;
            var currentLineNumber = startLineNumber;

            for (var i = 0; i < tokenQueue.Count; ++i)
            {
                var t = tokenQueue[i];
                var widthLeft = gridBounds.width - currentString.Length;
                var wrap = wordWrap && t.type != "newlines" && t.length > widthLeft;
                var breakLine = t.type == "newlines" || wrap;

                if (wrap)
                {
                    var split = t.length > gridBounds.width
                        ? widthLeft
                        : 0;
                    tokenQueue.Splice(i + 1, 0, t.splitAt(split));
                }

                currentTokens.Add(t);
                currentString += t.value;

                if (breakLine
                    || i == tokenQueue.Count - 1)
                {
                    newRows.Add(new Row(currentString, currentTokens.ToArray(), currentStringIndex, currentTokenIndex, currentLineNumber));
                    currentStringIndex += currentString.Length;
                    currentTokenIndex += currentTokens.Count;

                    currentTokens.Clear();
                    currentString = "";

                    if (t.type == "newlines")
                    {
                        ++currentLineNumber;
                    }
                }
            }

            rows.Splice(startY, rowRemoveCount, newRows);

            // renumber rows
            int deltaLines = endLineNumber - 2 * startLineNumber + currentLineNumber - 1,
                deltaStringIndex = currentStringIndex - endStringIndex,
                deltaTokenIndex = currentTokenIndex - endTokenIndex;
            for (var i = startY + newRows.Count; i < rows.Count; ++i)
            {
                var row = rows[i];
                row.lineNumber += deltaLines;
                row.startStringIndex += deltaStringIndex;
                row.startTokenIndex += deltaTokenIndex;
            }

            // provide editing room at the end of the buffer
            if (rows.Count == 0)
            {
                rows.Add(Row.emptyRow(0, 0, 0));
            }
            else
            {
                var lastRow = rows[rows.Count - 1];
                if (lastRow.text.EndsWith("\n"))
                {
                    rows.Add(Row.emptyRow(lastRow.endStringIndex, lastRow.endTokenIndex, lastRow.lineNumber + 1));
                }
            }

            maxVerticalScroll = Math.Max(0, rows.Count - gridBounds.height);

            render();
        }

        private bool setContextSize(ref Image img, ref Graphics gfx, int width, int height, float scaleFactor = 1)
        {
            width = (int)Math.Round(width * scaleFactor);
            height = (int)Math.Round(height * scaleFactor);
            if (img != null
                && img.Width == width
                && img.Height == height)
            {
                return false;
            }

            if (gfx != null)
            {
                gfx.Dispose();
            }

            if (img != null)
            {
                img.Dispose();
            }

            img = new Bitmap(width, height);
            gfx = Graphics.FromImage(img);

            return true;
        }

        private void refreshBuffers()
        {
            resized = true;
            setContextSize(ref fg, ref fgfx, canvas.Width, canvas.Height);
            setContextSize(ref bg, ref bgfx, canvas.Width, canvas.Height);
            setContextSize(ref tg, ref fgfx, canvas.Width, canvas.Height);

            context.SmoothingMode
                = fgfx.SmoothingMode
                = bgfx.SmoothingMode
                = tgfx.SmoothingMode
                = System.Drawing.Drawing2D.SmoothingMode.HighQuality;

            refreshAllTokens();
        }

        private int minDelta(int v, int minV, int maxV)
        {
            int dvMinV = v - minV,
                dvMaxV = v - maxV + 5,
                dv = 0;
            if (dvMinV < 0 || dvMaxV >= 0)
            {
                // compare the absolute values, so we get the smallest change
                // regardless of direction.
                dv = Math.Abs(dvMinV) < Math.Abs(dvMaxV)
                    ? dvMinV
                    : dvMaxV;
            }

            return dv;
        }

        private bool clampScroll()
        {
            bool toHigh = scroll.y < 0 || maxVerticalScroll == 0,
                toLow = scroll.y > maxVerticalScroll;

            if (toHigh)
            {
                scroll.y = 0;
            }
            else if (toLow)
            {
                scroll.y = maxVerticalScroll;
            }
            render();

            return toHigh || toLow;
        }

        private void scrollIntoView(Cursor cursor)
        {
            int dx = minDelta(cursor.x, scroll.x, scroll.x + gridBounds.width),
                dy = minDelta(cursor.y, scroll.y, scroll.y + gridBounds.height);
            scrollBy(dx, dy);
        }

        private void pushUndo()
        {
            if (historyIndex < history.Count - 1)
            {
                history.RemoveAt(historyIndex + 1);
            }
            history.Add(new HistoryFrame
            {
                value = value,
                frontCursor = frontCursor.i,
                backCursor = backCursor.i
            });
            historyIndex = history.Count - 1;
        }

        private void moveInHistory(int dh)
        {
            var nextHistoryIndex = historyIndex + dh;
            if (0 <= nextHistoryIndex && nextHistoryIndex < history.Count)
            {
                var curFrame = history[historyIndex];
                historyIndex = nextHistoryIndex;
                var nextFrame = history[historyIndex];
                setValue(nextFrame.value, false);
                frontCursor.setI(rows, curFrame.frontCursor);
                backCursor.setI(rows, curFrame.backCursor);
            }
        }
        #endregion PRIVATE METHODS


        #region PUBLIC METHODS
        /// <summary>
        /// Removes focus from the control.
        /// </summary>
        public void blur()
        {
            if (focused)
            {
                focused = false;
                render();
                OnBlur();
            }
        }

        /// <summary>
        /// Sets the control to be the focused control. If all controls in the app have been properly registered with the Event Manager, then any other, currently focused control will first get `blur`red.
        /// </summary>
        public void focus()
        {
            if (!focused)
            {
                focused = true;
                render();
                OnFocus();
            }
        }

        /// <summary>
        /// Sets the scale-independent width and height of the editor control.
        /// </summary>
        public void setSize(int w, int h)
        {
            if (setContextSize(ref canvas, ref context, w, h, scaleFactor))
            {
                refreshBuffers();
            }
        }

        /// <summary>
        /// Move the scroll window to a new location. Values get clamped to the text contents of the editor.
        /// </summary>
        public bool scrollTo(int x, int y)
        {
            if (!wordWrap)
            {
                scroll.x = x;
            }
            scroll.y = y;
            return clampScroll();
        }

        /// <summary>
        /// Move the scroll window by a given amount to a new location. The final location of the scroll window gets clamped to the text contents of the editor.
        /// </summary>
        public bool scrollBy(int dx, int dy)
        {
            return scrollTo(scroll.x + dx, scroll.y + dy);
        }
        #endregion PUBLIC METHODS


        #region KEY EVENT HANDLERS
        private readonly Dictionary<string, Action> keyDownCommands;

        public void readKeyDownEvent(KeyEvent evt)
        {
            debugEvt("keydown", evt);
            var command = os.makeCommand(evt);
            if (keyDownCommands.ContainsKey(command.command))
            {
                evt.preventDefault();
                keyDownCommands[command.command]();
            }
        }


        private readonly Dictionary<string, Action> keyPressCommands;

        public void readKeyPressEvent(KeyEvent evt)
        {
            debugEvt("keypress", evt);
            if (!readOnly)
            {
                var command = os.makeCommand(evt);
                evt.preventDefault();

                if (keyPressCommands.ContainsKey(command.command))
                {
                    keyPressCommands[command.command]();
                }
                else if (command.type == "printable"
                    || command.type == "whitespace")
                {
                    setSelectedText(command.text);
                }

                clampScroll();
                render();
            }
        }

        public void readKeyUpEvent(object evt)
        {
            debugEvt("keyup", evt);
        }
        #endregion KEY EVENT HANDLERS


        #region CLIPBOARD EVENT HANDLERS
        private bool copySelectedText(object evt)
        {
            if (focused && frontCursor.i != backCursor.i)
            {
                evt.clipboardData.setData("text/plain", this.selectedText);
                evt.returnValue = false;
                return true;
            }

            return false;
        }

        public void readCopyEvent(object evt)
        {
            debugEvt("copy", evt);
            copySelectedText(evt);
        }

        public void readCutEvent(object evt)
        {
            debugEvt("cut", evt);
            if (copySelectedText(evt)
                && readOnly)
            {
                setSelectedText("");
            }
        }

        public void readPasteEvent(object evt)
        {
            debugEvt("paste", evt);
            if (focused && !readOnly)
            {
                evt.returnValue = false;
                var clipboard = evt.clipboardData,
                    str = clipboard.getData("text/plain");
                if (str)
                {
                    setSelectedText(str);
                }
            }
        }
        #endregion CLIPBOARD EVENT HANDLERS


        #region POINTER EVENT HANDLERS 
        private void pointerOver(object evt)
        {
            hovered = true;
            OnOver();
        }

        private void pointerOut(object evt)
        {
            hovered = false;
            OnOut();
        }

        private void pointerDown(object evt)
        {
            focus();
            pressed = true;
        }

        private void startSelecting()
        {
            dragging = true;
            moveCursor(frontCursor);
        }

        private void pointerMove(object evt)
        {
            if (dragging)
            {
                moveCursor(backCursor);
            }
            else if (pressed)
            {
                dragScroll();
            }
        }

        private void moveCursor(Cursor cursor)
        {
            pointer.toCell(character, scroll, gridBounds);
            int gx = pointer.x - scroll.x,
                gy = pointer.y - scroll.y;
            bool onBottom = gy >= gridBounds.height,
                onLeft = gx < 0,
                onRight = pointer.x >= gridBounds.width;

            if (!scrolling && !onBottom && !onLeft && !onRight)
            {
                cursor.setXY(rows, pointer.x, pointer.y);
                backCursor.copy(cursor);
            }
            else if (scrolling || onRight && !onBottom)
            {
                scrolling = true;
                var scrollHeight = rows.Count - gridBounds.height;
                if (gy >= 0 && scrollHeight >= 0)
                {
                    var sy = gy * scrollHeight / gridBounds.height;
                    scrollTo(scroll.x, sy);
                }
            }
            else if (onBottom && !onLeft)
            {
                var maxWidth = 0;
                for (var dy = 0; dy < rows.Count; ++dy)
                {
                    maxWidth = Math.Max(maxWidth, rows[dy].stringLength);
                }
                var scrollWidth = maxWidth - gridBounds.width;
                if (gx >= 0 && scrollWidth >= 0)
                {
                    var sx = gx * scrollWidth / gridBounds.width;
                    scrollTo(sx, scroll.y);
                }
            }
            else if (onLeft && !onBottom)
            {
                // clicked in number-line gutter
            }
            else
            {
                // clicked in the lower-left corner
            }

            render();
        }

        private int? lastScrollDX = null,
            lastScrollDY = null;
        private void dragScroll()
        {
            if (lastScrollDX != null
                && lastScrollDY != null)
            {
                int dx = (lastScrollDX.Value - pointer.x) / character.width,
                    dy = (lastScrollDY.Value - pointer.y) / character.height;
                scrollBy(dx, dy);
            }
            lastScrollDX = pointer.x;
            lastScrollDY = pointer.y;
        }

        private Action<object> mouseLikePointerDown(Action<object> setPointer)
        {
            return (evt) =>
            {
                setPointer(evt);
                pointerDown(evt);
                startSelecting();
            };
        }

        private void mouseLikePointerUp(object evt)
        {
            pressed = false;
            dragging = false;
            scrolling = false;
        }

        private Action<object> mouseLikePointerMove(Action<object> setPointer)
        {
            return (evt) =>
            {
                setPointer(evt);
                pointerMove(evt);
            };
        }

        private Action<object> touchLikePointerDown(Action<object> setPointer)
        {
            return (evt) =>
            {
                setPointer(evt);
                tx = pointer.x;
                ty = pointer.y;
                pointerDown(evt);
                longPress.start();
            };
        }

        private void touchLikePointerUp(object evt)
        {
            if (longPress.cancel() && !dragging)
            {
                startSelecting();
            }
            mouseLikePointerUp(evt);
            lastScrollDX = null;
            lastScrollDY = null;
        }

        private Action<object> touchLikePointerMove(Action<object> setPointer)
        {
            return (evt) =>
            {
                setPointer(evt);
                if (longPress.isRunning)
                {
                    int dx = pointer.x - tx,
                        dy = pointer.y - ty,
                        lenSq = dx * dx + dy * dy;
                    if (lenSq > 25)
                    {
                        longPress.cancel();
                    }
                }

                if (!longPress.isRunning)
                {
                    pointerMove(evt);
                }
            };
        }


        #region MOUSE EVENT HANDLERS
        private void setMousePointer(object evt)
        {
            pointer.set(
                evt.offsetX,
                evt.offsetY);
        }

        public void readMouseOverEvent(object evt)
        {
            debugEvt("mouseover", evt);
            pointerOver(evt);
        }

        public void readMouseOutEvent(object evt)
        {
            debugEvt("mouseout", evt);
            pointerOut(evt);
        }

        public void readMouseDownEvent(object evt)
        {
            debugEvt("mousedown", evt);
            mouseLikePointerDown(setMousePointer)(evt);
        }

        public void readMouseUpEvent(object evt)
        {
            debugEvt("mouseup", evt);
            mouseLikePointerUp(evt);
        }

        public void readMouseMoveEvent(object evt)
        {
            debugEvt("mousemove", evt);
            mouseLikePointerMove(setMousePointer)(evt);
        }

        public void readWheelEvent(object evt)
        {
            debugEvt("wheel", evt);
            if (hovered || focused)
            {
                if (!evt.ctrlKey
                    && !evt.altKey
                    && !evt.shiftKey
                    && !evt.metaKey)
                {
                    var dy = Math.Floor(evt.deltaY * wheelScrollSpeed / scrollScale);
                    if (!this.scrollBy(0, dy) || focused)
                    {
                        evt.preventDefault();
                    }
                }
                else if (!evt.ctrlKey
                    && !evt.altKey
                    && !evt.metaKey)
                {
                    evt.preventDefault();
                    fontSize += -evt.deltaY / scrollScale;
                }
                render();
            }
        }
        #endregion MOUSE EVENT HANDLERS


        #region TOUCH EVENT HANDLERS
        private int vibX = 0,
            vibY = 0;
        private Random rand = new Random();

        private void vibrate(int len)
        {
            longPress.cancel();
            if (len > 0)
            {
                vibX = rand.Next(-5, 5);
                vibY = rand.Next(-5, 5);
                setTimeout(() => vibrate(len - 10), 10);
            }
            else
            {
                vibX = 0;
                vibY = 0;
            }
            render();
        }

        private TimedEvent longPress = new TimedEvent(1000);

        int tx = 0,
            ty = 0;
        int? currentTouchID = null;

        private object findTouch(object[] touches)
        {
            foreach (var touch in touches)
            {
                if (currentTouchID == null
                    || touch.identifier == currentTouchID)
                {
                    return touch;
                }
            }

            return null;
        }

        private Action<object> withPrimaryTouch(Action<object> callback)
        {
            return (evt) =>
            {
                evt.preventDefault();
                callback(findTouch(evt.touches)
                    || findTouch(evt.changedTouches));
            };
        }

        private void setTouchPointer(object touch)
        {
            var cb = canvas.getBoundingClientRect();
            pointer.set(
                touch.clientX - cb.left,
                touch.clientY - cb.top);
        }

        public void readTouchStartEvent(object evt)
        {
            debugEvt("touchstart", evt);
            withPrimaryTouch(touchLikePointerDown(setTouchPointer))(evt);
        }

        public void readTouchMoveEvent(object evt)
        {
            debugEvt("touchmove", evt);
            withPrimaryTouch(touchLikePointerMove(setTouchPointer))(evt);
        }

        public void readTouchEndEvent(object evt)
        {
            debugEvt("touchend", evt);
            withPrimaryTouch(touchLikePointerUp)(evt);
        }
        #endregion TOUCH EVENT HANDLERS


        #region UV POINTER EVENT HANDLERS 
        private void setUVPointer(object evt)
        {
            pointer.set(
                evt.uv.x * this.width,
                (1 - evt.uv.y) * this.height);
        }

        /// <summary>
        /// Read's a THREE.js Raycast intersection to perform the hover gestures.
        // </summary>
        public void readMouseOverEventUV(object evt)
        {
            debugEvt("mouseuvover", evt);
            pointerOver(evt);
        }

        /// <summary>
        /// Read's a THREE.js Raycast intersection to perform the end of the hover gesture.
        // </summary>
        public void readMouseOutEventUV(object evt)
        {
            debugEvt("mouseuvout", evt);
            pointerOut(evt);
        }

        /// <summary>
        /// Read's a THREE.js Raycast intersection to perform mouse-like behavior for primary-button-down gesture.
        // </summary>
        public void readMouseDownEventUV(object evt)
        {
            debugEvt("mouseuvdown", evt);
            mouseLikePointerDown(setUVPointer)(evt);
        }

        /// <summary>
        /// Read's a THREE.js Raycast intersection to perform mouse-like behavior for primary-button-up gesture.
        // </summary>
        public void readMouseUpEventUV(object evt)
        {
            debugEvt("mouseuvup", evt);
            mouseLikePointerUp(evt);
        }

        /// <summary>
        /// Read's a THREE.js Raycast intersection to perform mouse-like behavior for move gesture, whether the primary button is pressed or not.
        // </summary>
        public void readMouseMoveEventUV(object evt)
        {
            debugEvt("mouseuvmove", evt);
            mouseLikePointerMove(setUVPointer)(evt);
        }

        /// <summary>
        /// Read's a THREE.js Raycast intersection to perform the end of the hover gesture. This is the same as mouse.readOverEventUV, included for completeness.
        // </summary>
        public void readTouchOverEventUV(object evt)
        {
            debugEvt("touchuvover", evt);
            pointerOver(evt);
        }

        /// <summary>
        /// Read's a THREE.js Raycast intersection to perform the end of the hover gesture. This is the same as mouse.readOutEventUV, included for completeness.
        // </summary>
        public void readTouchOutEventUV(object evt)
        {
            debugEvt("touchuvout", evt);
            pointerOut(evt);
        }

        /// <summary>
        /// Read's a THREE.js Raycast intersection to perform touch-like behavior for the first finger touching down gesture.
        // </summary>
        public void readTouchDownEventUV(object evt)
        {
            debugEvt("touchuvdown", evt);
            touchLikePointerDown(setUVPointer)(evt);
        }

        /// <summary>
        /// Read's a THREE.js Raycast intersection to perform touch-like behavior for the first finger raising up gesture.
        // </summary>
        public void readTouchMoveEventUV(object evt)
        {
            debugEvt("touchuvmove", evt);
            touchLikePointerMove(setUVPointer)(evt);
        }

        /// <summary>
        /// Read's a THREE.js Raycast intersection to perform touch-like behavior for the first finger moving gesture.
        // </summary>
        public void readTouchUpEventUV(object evt)
        {
            debugEvt("touchuvup", evt);
            touchLikePointerUp(evt);
        }
        #endregion UV POINTER EVENT HANDLERS

        #endregion POINTER EVENT HANDLERS

        #region PUBLIC PROPERTIES

        private Image canvas;
        /// <summary>
        /// The canvas to which the editor is rendering text. If the `options.element` value was set to a canvas, that canvas will be returned. Otherwise, the canvas will be the canvas that Primrose created for the control. If `OffscreenCanvas` is not available, the canvas will be an `HTMLCanvasElement`.
        /// </summary>
        public Image Canvas => canvas;

        /// <summary>
        /// Returns `true` when the control has a pointer hovering over it.
        /// </summary>
        public bool hovered
        {
            get; private set;
        }


        private bool isFocused;
        /// <summary>
        /// Returns `true` when the control has been selected.Writing to this value will change the focus state of the control.
        /// If the control is already focused and`focused` is set to`true`, or the control is not focused and`focus` is set to`false`, nothing happens.
        /// If the control is focused and`focused` is set to`false`, the control is blurred, just as if `blur()` was called.
        /// If the control is not focused and`focused` is set to`true`, the control is blurred, just as if `focus()` was called.
        /// </summary>
        public bool focused
        {
            get => isFocused;
            set
            {
                if (value != focused)
                {
                    if (value)
                    {
                        focus();
                    }
                    else
                    {
                        blur();
                    }
                }
            }
        }

        private bool isReadOnly;
        /// <summary>
        /// Indicates whether or not the text in the editor control can be modified.
        /// </summary>
        public bool readOnly
        {
            get => isReadOnly;
            set
            {
                if (value != readOnly)
                {
                    isReadOnly = value;
                    refreshControlType();
                }
            }
        }

        private bool isMultiLine;

        public bool multiLine
        {
            get => isMultiLine;
            set
            {
                if (value != multiLine)
                {
                    if (!value && wordWrap)
                    {
                        wordWrap = false;
                    }
                    multiLine = value;
                    refreshControlType();
                    refreshGutter();
                }
            }
        }

        public bool isWordWrap;
        /// <summary>
        /// Indicates whether or not the text in the editor control will be broken across lines when it reaches the right edge of the editor control.
        /// </summary>
        public bool wordWrap
        {
            get => isWordWrap;
            set
            {
                if (value != wordWrap
                    && (multiLine
                        || !value))
                {
                    wordWrap = value;
                    refreshGutter();
                    render();
                }
            }
        }

        private string internalValue;
        /// <summary>
        /// The text value contained in the control. NOTE: if the text value was set with Windows-style newline characters (`\r\n`), the newline characters will be normalized to Unix-style newline characters (`\n`).
        /// </summary>
        public string value
        {
            get => internalValue;
            set => setValue(value, true);
        }


        /// <summary>
        /// A synonymn for `value`
        /// </summary>
        public string text
        {
            get => internalValue;
            set => setValue(value, true);
        }

        /// <summary>
        /// The range of text that is currently selected by the cursor. If no text is selected, reading `selectedText` returns the empty string (`""`) and writing to it inserts text at the current cursor location. 
        /// If text is selected, reading `selectedText` returns the text between the front and back cursors, writing to it overwrites the selected text, inserting the provided value.
        /// </summary>
        public string selectedText
        {
            get
            {
                Cursor minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                return value.Substring(minCursor.i, maxCursor.i);
            }

            set => setSelectedText(value);
        }

        /// <summary>
        /// The string index at which the front cursor is located. NOTE: the "front cursor" is the main cursor, but does not necessarily represent the beginning of the selction range. The selection range runs from the minimum of front and back cursors, to the maximum.
        /// </summary>
        public int selectionStart
        {
            get => frontCursor.i;

            set
            {
                if (value != frontCursor.i)
                {
                    frontCursor.setI(rows, value);
                    render();
                }
            }
        }

        /// <summary>
        /// The string index at which the back cursor is located. NOTE: the "back cursor" is the selection range cursor, but does not necessarily represent the end of the selction range. The selection range runs from the minimum of front and back cursors, to the maximum.
        /// </summary>
        public int selectionEnd
        {
            get => backCursor.i;
            set
            {
                if (value != backCursor.i)
                {
                    backCursor.setI(rows, value);
                    render();
                }
            }
        }

        /// <summary>
        /// If the back cursor is behind the front cursor, this value returns `"backward"`. Otherwise, `"forward"` is returned.
        /// </summary>
        public string selectionDirection => frontCursor.i <= backCursor.i
            ? "forward"
            : "backward";

        private int tabStringWidth;
        /// <summary>
        /// The number of spaces to insert when the <kbd>Tab</kbd> key is pressed. Changing this value does not convert existing tabs, it only changes future tabs that get inserted.
        /// </summary>
        public int tabWidth
        {
            get => tabStringWidth;
            set
            {
                tabWidth = value;
                tabString = "";
                for (var i = 0; i < tabWidth; ++i)
                {
                    tabString += " ";
                }
            }
        }

        private readonly Dictionary<Color, Brush> brushes = new Dictionary<Color, Brush>();
        private readonly Dictionary<Color, Pen> pens = new Dictionary<Color, Pen>();
        private Theme renderTheme = DefaultTheme;
        /// <summary>
        /// A JavaScript object that defines the color and style values for rendering different UI and text elements.
        /// </summary>
        public Theme theme
        {
            get => renderTheme;
            set
            {
                if (value != theme)
                {
                    var allColors = value.Colors.ToArray();
                    var oldColors = brushes.Keys.Where(c => !allColors.Contains(c)).ToArray();
                    var newColors = allColors.Where(c => !brushes.ContainsKey(c));
                    foreach(var color in oldColors)
                    {
                        pens[color].Dispose();
                        pens.Remove(color);

                        brushes[color].Dispose();
                        brushes.Remove(color);
                    }

                    foreach (var color in newColors)
                    {
                        pens[color] = new Pen(color);
                        brushes[color] = new SolidBrush(color);
                    }

                    renderTheme = value;

                    render();
                }
            }
        }

        private Grammar grammar;
        /// <summary>
        /// Set or get the language pack used to tokenize the control text for syntax highlighting.
        /// </summary>
        public Grammar language
        {
            get => grammar;
            set
            {
                value ??= Grammar.PlainText;
                if (value != language)
                {
                    language = value;
                    refreshAllTokens();
                }
            }
        }

        private int renderPadding;
        /// <summary>
        /// The `Number` of pixels to inset the control rendering from the edge of the canvas. This is useful for texturing objects where the texture edge cannot be precisely controlled. This value is scale-independent.
        /// </summary>
        public int padding
        {
            get => renderPadding;
            set
            {
                if (value != padding)
                {
                    padding = value;
                    render();
                }
            }
        }

        private bool isShowLineNumbers;
        /// <summary>
        /// Indicates whether or not line numbers should be rendered on the left side of the control.
        /// </summary>
        public bool showLineNumbers
        {
            get => isShowLineNumbers;
            set
            {
                if (value != showLineNumbers)
                {
                    showLineNumbers = value;
                    refreshGutter();
                }
            }
        }

        private bool isShowScrollBars;
        /// <summary>
        /// Indicates whether or not scroll bars should be rendered at the right and bottom in the control. If wordWrap is enabled, the bottom, horizontal scrollbar will not be rendered.
        /// </summary>
        public bool showScrollBars
        {
            get => isShowScrollBars;
            set
            {
                if (value != showScrollBars)
                {
                    showScrollBars = value;
                    refreshGutter();
                }
            }
        }

        private FontFamily DefaultFontFamily = new FontFamily(System.Drawing.Text.GenericFontFamilies.Monospace);
        private FontFamily renderFontFamily;
        public FontFamily fontFamily
        {
            get => renderFontFamily;
            set
            {
                value ??= DefaultFontFamily;
                if (value != renderFontFamily)
                {
                    if(renderFontFamily != null
                        && renderFontFamily != DefaultFontFamily)
                    {
                        renderFontFamily?.Dispose();
                    }

                    renderFontFamily = value;
                    refreshFont();
                }
            }
        }

        private int renderFontSize;
        /// <summary>
        /// The `Number` of pixels tall to draw characters. This value is scale-independent.
        /// </summary>
        public int fontSize
        {
            get => renderFontSize;
            set
            {
                value = Math.Max(1, value);
                if (value != fontSize)
                {
                    renderFontSize = value;
                    refreshFont();
                }
            }
        }

        private float renderScaleFactor;
        /// <summary>
        /// The value by which pixel values are scaled before being used by the editor control.
        /// With THREE.js, it's best to set this value to 1 and change the width, height, and fontSize manually.
        /// </summary>
        public float scaleFactor
        {
            get => renderScaleFactor;
            set
            {
                value = Math.Max(0.25f, Math.Min(4, value));
                if (value != scaleFactor)
                {
                    int lastWidth = width,
                        lastHeight = height;
                    renderScaleFactor = value;
                    setSize(lastWidth, lastHeight);
                }
            }
        }

        /// <summary>
        /// The scale-independent width of the editor control.
        /// </summary>
        public int width
        {
            get => (int)(canvas.Width / scaleFactor);
            set => setSize(value, height);
        }

        /// <summary>
        /// The scale-independent height of the editor control.
        /// </summary>
        public int height
        {
            get => (int)(canvas.Height / scaleFactor);
            set => setSize(width, value);
        }
        #endregion PUBLIC PROPERTIES 



        /// <summary>
        /// Registers a new Primrose editor control with the Event Manager, to wire-up key, clipboard, and mouse wheel events, and to manage the currently focused element.
        /// The Event Manager maintains the references in a WeakMap, so when the JS Garbage Collector collects the objects, they will be gone.
        /// Multiple objects may be used to register a single control with the Event Manager without causing issue.This is useful for associating the control with closed objects from other systems, such as Three.js Mesh objects being targeted for pointer picking.
        /// If you are working with Three.js, it's recommended to use the Mesh on which you are texturing the canvas as the key when adding the editor to the Event Manager.
        /// </summary>
        public static void add(object key, Primrose control)
        {
            if (key != null)
            {
                elements.Add(key, control);
            }

            if (controls.IndexOf(control) == -1)
            {
                controls.Add(control);
                editors = controls.ToArray();

                control.Blur += (obj, evt) =>
                {
                    focusedControl = null;
                };

                control.Focus += (obj, evt) =>
                {
                    // make sure the previous control knows it has 
                    // gotten unselected.
                    focusedControl?.blur();
                    focusedControl = control;
                };

                control.Over += (obj, evt) =>
                {
                    hoveredControl = control;
                };

                control.Out += (obj, evt) =>
                {
                    hoveredControl = null;
                };
            }
        }
        /// <summary>
        /// Checks for the existence of a control, by the key that the user supplied when calling `Primrose.add()`
        /// </summary>
        public static bool has(object key)
        {
            return elements.ContainsKey(key);
        }

        /// <summary>
        /// Gets the control associated with the given key.
        /// </summary>
        public static Primrose get(object key)
        {
            return elements.ContainsKey(key)
                ? elements[key]
                : null;
        }
    }
}