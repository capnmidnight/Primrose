export function isCanvas(elem) {
    if (elem instanceof HTMLCanvasElement) {
        return true;
    }

    if (window.OffscreenCanvas
        && elem instanceof OffscreenCanvas) {
        return true;
    }

    return false;
}

export function createCanvas() {
    //if (window.OffscreenCanvas) {
    //    return new OffscreenCanvas(512, 512);
    //}

    return document.createElement("canvas");
}

export function setCanvasSize(canv, w, h) {
    if (canv.width != w
        || canv.height != h) {
        canv.width = w;
        canv.height = h;
        return true;
    }
    return false;
}

export function setContextSize(ctx, w, h) {
    const canv = ctx.canvas,
        oldImageSmoothingEnabled = ctx.imageSmoothingEnabled,
        oldTextBaseline = ctx.textBaseline,
        oldTextAlign = ctx.textAlign,
        oldFont = ctx.font,
        resized = setCanvasSize(canv, w, h);

    if (resized) {
        ctx.imageSmoothingEnabled = oldImageSmoothingEnabled;
        ctx.textBaseline = oldTextBaseline;
        ctx.textAlign = oldTextAlign;
        ctx.font = oldFont;
    }

    return resized;
}

export function resizeCanvas(canv) {
    const w = canv.clientWidth * devicePixelRatio,
        h = canv.clientHeight * devicePixelRatio;
    return setCanvasSize(canv, w, h);
}

export function resizeContext(ctx) {
    const canv = ctx.canvas,
        w = canv.clientWidth,
        h = canv.clientHeight;
    return setContextSize(ctx, w, h);
}