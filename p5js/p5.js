/*! p5.min.js v0.2.22 July 21, 2014 */
const skia = require('@napi-rs/canvas-android-arm64');///GoogleSkia.android-arm64.node');
const fs = require('fs');
const { execSync } = require('child_process');

const { Image } = skia;

if (fs.existsSync('./Microsoft Sans Serif.ttf')) skia.GlobalFonts.registerFromPath('./Microsoft Sans Serif.ttf', 'sans-serif');
else if (fs.existsSync('$HOME/.termux/font.ttf')) skia.GlobalFonts.registerFromPath('$HOME/termux/font.ttf', 'sans-serif');

let gCanvas = new skia.CanvasElement(800, 600);
let window = global;
global.addEventListener = () => {};
document = {
 createElement(){
   return new skia.CanvasElement(800, 600);
 },
 getElementById(){ return gCanvas }
};
let screen = {
    width: 500,
    height: 500,
};
var shim = (function (require) {
    window.requestDraw = (function () {
        return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback, element) {
                //window.setTimeout(callback, 1000 / 60);
                process.nextTick(callback);
            }
        );
    })();
})({});
var constants = (function (require) {
    var PI = Math.PI;
    return {
        ARROW: "default",
        CROSS: "crosshair",
        HAND: "pointer",
        MOVE: "move",
        TEXT: "text",
        WAIT: "wait",
        HALF_PI: PI / 2,
        PI: PI,
        QUARTER_PI: PI / 4,
        TAU: PI * 2,
        TWO_PI: PI * 2,
        DEGREES: "degrees",
        RADIANS: "radians",
        CORNER: "corner",
        CORNERS: "corners",
        RADIUS: "radius",
        RIGHT: "right",
        LEFT: "left",
        CENTER: "center",
        POINTS: "points",
        LINES: "lines",
        TRIANGLES: "triangles",
        TRIANGLE_FAN: "triangles_fan",
        TRIANGLE_STRIP: "triangles_strip",
        QUADS: "quads",
        QUAD_STRIP: "quad_strip",
        CLOSE: "close",
        OPEN: "open",
        CHORD: "chord",
        PIE: "pie",
        PROJECT: "square",
        SQUARE: "butt",
        ROUND: "round",
        BEVEL: "bevel",
        MITER: "miter",
        RGB: "rgb",
        HSB: "hsb",
        AUTO: "auto",
        ALT: 18,
        BACKSPACE: 8,
        CONTROL: 17,
        DELETE: 46,
        DOWN_ARROW: 40,
        ENTER: 13,
        ESCAPE: 27,
        LEFT_ARROW: 37,
        OPTION: 18,
        RETURN: 13,
        RIGHT_ARROW: 39,
        SHIFT: 16,
        TAB: 9,
        UP_ARROW: 38,
        BLEND: "normal",
        ADDITIVE: "lighter",
        DARKEST: "darken",
        LIGHTEST: "lighten",
        DIFFERENCE: "difference",
        EXCLUSION: "exclusion",
        MULTIPLY: "multiply",
        SCREEN: "screen",
        REPLACE: "source-over",
        OVERLAY: "overlay",
        HARD_LIGHT: "hard-light",
        SOFT_LIGHT: "soft-light",
        DODGE: "color-dodge",
        BURN: "color-burn",
        NORMAL: "normal",
        ITALIC: "italic",
        BOLD: "bold",
        LINEAR: "linear",
        QUADRATIC: "quadratic",
        BEZIER: "bezier",
        CURVE: "curve",
    };
})({});
var core = (function (require, shim, constants) {
    "use strict";
    var constants = constants;
    var p5 = function (sketch, node) {
        Object.assign(this, constants);
        this._setupDone = false;
        this._pixelDensity = window.devicePixelRatio || 1;
        this._startTime = new Date().getTime();
        this._userNode = node;
        this._curElement = null;
        this._elements = [];
        this._preloadCount = 0;
        this._updateInterval = 0;
        this._isGlobal = false;
        this._loop = true;
        this.styles = [];
        this._defaultCanvasSize = {
            width: 100,
            height: 100,
        };
        this._events = {
            mousemove: null,
            mousedown: null,
            mouseup: null,
            click: null,
            mousewheel: null,
            mouseover: null,
            mouseout: null,
            keydown: null,
            keyup: null,
            keypress: null,
            touchstart: null,
            touchmove: null,
            touchend: null,
        };
        this._start = function () {
            if (this._userNode) {
                if (typeof this._userNode === "string") {
                    this._userNode = document.getElementById(this._userNode);
                }
            }
            this.createCanvas(this._defaultCanvasSize.width, this._defaultCanvasSize.height, true);
            var userPreload = this.preload || window.preload;
            var context = this._isGlobal ? window : this;
            if (userPreload) {
                this._preloadFuncs.forEach(function (f) {
                    context[f] = function (path) {
                        return context._preload(f, path);
                    };
                });
                userPreload();
                if (this._preloadCount === 0) {
                    this._setup();
                    this._runFrames();
                    this._draw();
                }
            } else {
                this._setup();
                this._runFrames();
                this._draw();
            }
        }.bind(this);
        this._preload = function (func, path) {
            var context = this._isGlobal ? window : this;
            context._setProperty("_preloadCount", context._preloadCount + 1);
            return p5.prototype[func].call(context, path, function (resp) {
                context._setProperty("_preloadCount", context._preloadCount - 1);
                if (context._preloadCount === 0) {
                    context._setup();
                    context._runFrames();
                    context._draw();
                }
            });
        }.bind(this);
        this._setup = function () {
            var context = this._isGlobal ? window : this;
            if (typeof context.preload === "function") {
                this._preloadFuncs.forEach(function (f) {
                    context[f] = p5.prototype[f];
                });
            }
            if (typeof context.setup === "function") {
                context.setup();
            }
            var reg = new RegExp(/(^|\s)p5_hidden(?!\S)/g);
            var canvases = [{}];//document.getElementsByClassName("p5_hidden");
            for (var i = 0; i < canvases.length; i++) {
                var k = canvases[i];
                //k.style?.visibility = "";
                k.className = k.className?.replace(reg, "");
            }
            this._setupDone = true;
        }.bind(this);
        this._draw = function () {
            var userSetup = this.setup || window.setup;
            var now = new Date().getTime();
            this._frameRate = 1000 / (now - this._lastFrameTime);
            this._lastFrameTime = now;
            var userDraw = this.draw || window.draw;
            if (this._loop) {
                if (this._drawInterval) {
                    clearInterval(this._drawInterval);
                }
                this._drawInterval = setTimeout(
                    function () {
                        window.requestDraw(this._draw.bind(this));
                    }.bind(this),
                    1000 / this._targetFrameRate
                );
            }
            if (typeof userDraw === "function") {
                this.push();
                if (typeof userSetup === "undefined") {
                    this.scale(this._pixelDensity, this._pixelDensity);
                }
                userDraw();
                this.pop();
            }
        }.bind(this);
        this._runFrames = function () {
            if (this._updateInterval) {
                clearInterval(this._updateInterval);
            }
            this._updateInterval = setInterval(
                function () {
                    this._setProperty("frameCount", this.frameCount + 1);
                }.bind(this),
                1000 / this._targetFrameRate
            );
        }.bind(this);
        this._setProperty = function (prop, value) {
            this[prop] = value;
            if (this._isGlobal) {
                window[prop] = value;
            }
        }.bind(this);
        this.remove = function () {
            if (this._curElement) {
                this._loop = false;
                if (this._drawInterval) {
                    clearTimeout(this._drawInterval);
                }
                if (this._updateInterval) {
                    clearTimeout(this._updateInterval);
                }
                for (var ev in this._events) {
                    window.removeEventListener(ev, this._events[ev]);
                }
                for (var cev in this._curElement._events) {
                    var f = this._curElement._events[cev];
                    this._curElement.elt.removeEventListener(cev, f);
                }
                for (var i = 0; i < this._elements.length; i++) {
                    var e = this._elements[i];
                    e.parentNode.removeChild(e);
                }
                var self = this;
                this._removeFuncs.forEach(function (f) {
                    self[f]();
                });
                if (this._isGlobal) {
                    for (var p in p5.prototype) {
                        delete window[p];
                    }
                    for (var p2 in this) {
                        if (this.hasOwnProperty(p2)) {
                            delete window[p2];
                        }
                    }
                }
            }
        };
        this.start = function (){
            this._start();
        };
        for (var k in constants) {
            p5.prototype[k] = constants[k];
        }
        if (!sketch) {
            this._isGlobal = true;
            for (var p in p5.prototype) {
                if (typeof p5.prototype[p] === "function") {
                    var ev = p.substring(2);
                    if (!this._events.hasOwnProperty(ev)) {
                        window[p] = p5.prototype[p].bind(this);
                    }
                } else {
                    window[p] = p5.prototype[p];
                }
            }
            for (var p2 in this) {
                if (this.hasOwnProperty(p2)) {
                    window[p2] = this[p2];
                }
            }
        } else {
            sketch(this);
        }
        for (var e in this._events) {
            var f = this["on" + e];
            if (f) {
                var m = f.bind(this);
                window.addEventListener(e, m);
                this._events[e] = m;
            }
        }
        var self = this;
        window.addEventListener("focus", function () {
            self._setProperty("focused", true);
        });
        window.addEventListener("blur", function () {
            self._setProperty("focused", false);
        });
        if (document.readyState === "complete") {
            this._start();
        } else {
            window.addEventListener("load", this._start.bind(this), false);
        }
    };
    p5.prototype._preloadFuncs = ["loadJSON", "loadImage", "loadStrings", "loadXML", "loadShape"];
    p5.prototype._removeFuncs = [];
    p5.prototype._registerPreloadFunc = function (func) {
        p5.prototype._preloadFuncs.push(func);
    }.bind(this);
    p5.prototype._registerRemoveFunc = function (func) {
        p5.prototype._removeFuncs.push(func);
    }.bind(this);
    return p5;
})({}, shim, constants);
var p5Element = (function (require, core) {
    var p5 = core;
    p5.Element = function (elt, pInst) {
        this.elt = elt;
        this._pInst = pInst;
        this._events = {};
        this.width = this.elt.width;
        this.height = this.elt.height;
    };
    p5.Element.prototype.parent = function (parent) {
        if (typeof parent === "string") {
            parent = document.getElementById(parent);
        }
        //parent.appendChild(this.elt);
    };
    p5.Element.prototype.id = function (id) {
        this.elt.id = id;
    };
    p5.Element.prototype.class = function (c) {
        this.elt.className += " " + c;
    };
    p5.Element.prototype.mousePressed = function (fxn) {
        attachListener("click", fxn, this);
    };
    p5.Element.prototype.mouseOver = function (fxn) {
        attachListener("mouseover", fxn, this);
    };
    p5.Element.prototype.mouseOut = function (fxn) {
        attachListener("mouseout", fxn, this);
    };
    p5.Element.prototype.mouseMoved = function (fxn) {
        attachListener("mousemove", fxn, this);
    };
    function attachListener(ev, fxn, ctx) {
        var _this = ctx;
        var f = function (e) {
            fxn(e, _this);
        };
        ctx.elt.addEventListener(ev, f, false);
        ctx._events[ev] = f;
    }
    p5.Element.prototype._setProperty = function (prop, value) {
        this[prop] = value;
    };
    return p5.Element;
})({}, core);
var p5Graphics = (function (require, core, constants) {
    var p5 = core;
    var constants = constants;
    p5.Graphics = function (elt, pInst) {
        p5.Element.call(this, elt, pInst);
        this.canvas = elt;
        if (this._pInst) {
            this._pInst._setProperty("_curElement", this);
            this._pInst._setProperty("canvas", elt);
            this._pInst._setProperty("ctx", elt.getContext('2d'));
            this._pInst._setProperty("width", this.width);
            this._pInst._setProperty("height", this.height);
        } else {
            //this.canvas.style?.display = "none";
        }
        this.canvas.getContext("2d").fillStyle = "#FFFFFF";
        this.canvas.getContext("2d").strokeStyle = "#000000";
        this.canvas.getContext("2d").lineCap = constants.ROUND;
    };
    p5.Graphics.prototype = Object.create(p5.Element.prototype);
    return p5.Graphics;
})({}, core, constants);
var filters = (function (require) {
    "use strict";
    var Filters = {};
    Filters._toPixels = function (canvas) {
        if (canvas instanceof ImageData) {
            return canvas.data;
        } else {
            return canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
        }
    };
    Filters._getARGB = function (data, i) {
        var offset = i * 4;
        return ((data[offset + 3] << 24) & 4278190080) | ((data[offset] << 16) & 16711680) | ((data[offset + 1] << 8) & 65280) | (data[offset + 2] & 255);
    };
    Filters._setPixels = function (pixels, data) {
        var offset = 0;
        for (var i = 0, al = pixels.length; i < al; i++) {
            offset = i * 4;
            pixels[offset + 0] = (data[i] & 16711680) >>> 16;
            pixels[offset + 1] = (data[i] & 65280) >>> 8;
            pixels[offset + 2] = data[i] & 255;
            pixels[offset + 3] = (data[i] & 4278190080) >>> 24;
        }
    };
    Filters._toImageData = function (canvas) {
        if (canvas instanceof ImageData) {
            return canvas;
        } else {
            return canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
        }
    };
    Filters._createImageData = function (width, height) {
        Filters._tmpCanvas = document.createElement("canvas");
        Filters._tmpCtx = Filters._tmpCanvas.getContext("2d");
        return this._tmpCtx.createImageData(width, height);
    };
    Filters.apply = function (canvas, func, filterParam) {
        var ctx = canvas.getContext("2d");
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var newImageData = func(imageData, filterParam);
        if (newImageData instanceof ImageData) {
            ctx.putImageData(newImageData, 0, 0, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.putImageData(imageData, 0, 0, 0, 0, canvas.width, canvas.height);
        }
    };
    Filters.threshold = function (canvas, level) {
        var pixels = Filters._toPixels(canvas);
        if (level === undefined) {
            level = 0.5;
        }
        var thresh = Math.floor(level * 255);
        for (var i = 0; i < pixels.length; i += 4) {
            var r = pixels[i];
            var g = pixels[i + 1];
            var b = pixels[i + 2];
            var grey = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            var val;
            if (grey >= thresh) {
                val = 255;
            } else {
                val = 0;
            }
            pixels[i] = pixels[i + 1] = pixels[i + 2] = val;
        }
    };
    Filters.gray = function (canvas) {
        var pixels = Filters._toPixels(canvas);
        for (var i = 0; i < pixels.length; i += 4) {
            var r = pixels[i];
            var g = pixels[i + 1];
            var b = pixels[i + 2];
            var gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            pixels[i] = pixels[i + 1] = pixels[i + 2] = gray;
        }
    };
    Filters.opaque = function (canvas) {
        var pixels = Filters._toPixels(canvas);
        for (var i = 0; i < pixels.length; i += 4) {
            pixels[i + 3] = 255;
        }
        return pixels;
    };
    Filters.invert = function (canvas) {
        var pixels = Filters._toPixels(canvas);
        for (var i = 0; i < pixels.length; i += 4) {
            pixels[i] = 255 - pixels[i];
            pixels[i + 1] = 255 - pixels[i + 1];
            pixels[i + 2] = 255 - pixels[i + 2];
        }
    };
    Filters.posterize = function (canvas, level) {
        var pixels = Filters._toPixels(canvas);
        if (level < 2 || level > 255) {
            throw new Error("Level must be greater than 2 and less than 255 for posterize");
        }
        var levels1 = level - 1;
        for (var i = 0; i < pixels.length; i += 4) {
            var rlevel = pixels[i];
            var glevel = pixels[i + 1];
            var blevel = pixels[i + 2];
            pixels[i] = (((rlevel * level) >> 8) * 255) / levels1;
            pixels[i + 1] = (((glevel * level) >> 8) * 255) / levels1;
            pixels[i + 2] = (((blevel * level) >> 8) * 255) / levels1;
        }
    };
    Filters.dilate = function (canvas) {
        var pixels = Filters._toPixels(canvas);
        var currIdx = 0;
        var maxIdx = pixels.length ? pixels.length / 4 : 0;
        var out = new Int32Array(maxIdx);
        var currRowIdx, maxRowIdx, colOrig, colOut, currLum;
        var idxRight, idxLeft, idxUp, idxDown, colRight, colLeft, colUp, colDown, lumRight, lumLeft, lumUp, lumDown;
        while (currIdx < maxIdx) {
            currRowIdx = currIdx;
            maxRowIdx = currIdx + canvas.width;
            while (currIdx < maxRowIdx) {
                colOrig = colOut = Filters._getARGB(pixels, currIdx);
                idxLeft = currIdx - 1;
                idxRight = currIdx + 1;
                idxUp = currIdx - canvas.width;
                idxDown = currIdx + canvas.width;
                if (idxLeft < currRowIdx) {
                    idxLeft = currIdx;
                }
                if (idxRight >= maxRowIdx) {
                    idxRight = currIdx;
                }
                if (idxUp < 0) {
                    idxUp = 0;
                }
                if (idxDown >= maxIdx) {
                    idxDown = currIdx;
                }
                colUp = Filters._getARGB(pixels, idxUp);
                colLeft = Filters._getARGB(pixels, idxLeft);
                colDown = Filters._getARGB(pixels, idxDown);
                colRight = Filters._getARGB(pixels, idxRight);
                currLum = 77 * ((colOrig >> 16) & 255) + 151 * ((colOrig >> 8) & 255) + 28 * (colOrig & 255);
                lumLeft = 77 * ((colLeft >> 16) & 255) + 151 * ((colLeft >> 8) & 255) + 28 * (colLeft & 255);
                lumRight = 77 * ((colRight >> 16) & 255) + 151 * ((colRight >> 8) & 255) + 28 * (colRight & 255);
                lumUp = 77 * ((colUp >> 16) & 255) + 151 * ((colUp >> 8) & 255) + 28 * (colUp & 255);
                lumDown = 77 * ((colDown >> 16) & 255) + 151 * ((colDown >> 8) & 255) + 28 * (colDown & 255);
                if (lumLeft > currLum) {
                    colOut = colLeft;
                    currLum = lumLeft;
                }
                if (lumRight > currLum) {
                    colOut = colRight;
                    currLum = lumRight;
                }
                if (lumUp > currLum) {
                    colOut = colUp;
                    currLum = lumUp;
                }
                if (lumDown > currLum) {
                    colOut = colDown;
                    currLum = lumDown;
                }
                out[currIdx++] = colOut;
            }
        }
        Filters._setPixels(pixels, out);
    };
    Filters.erode = function (canvas) {
        var pixels = Filters._toPixels(canvas);
        var currIdx = 0;
        var maxIdx = pixels.length ? pixels.length / 4 : 0;
        var out = new Int32Array(maxIdx);
        var currRowIdx, maxRowIdx, colOrig, colOut, currLum;
        var idxRight, idxLeft, idxUp, idxDown, colRight, colLeft, colUp, colDown, lumRight, lumLeft, lumUp, lumDown;
        while (currIdx < maxIdx) {
            currRowIdx = currIdx;
            maxRowIdx = currIdx + canvas.width;
            while (currIdx < maxRowIdx) {
                colOrig = colOut = Filters._getARGB(pixels, currIdx);
                idxLeft = currIdx - 1;
                idxRight = currIdx + 1;
                idxUp = currIdx - canvas.width;
                idxDown = currIdx + canvas.width;
                if (idxLeft < currRowIdx) {
                    idxLeft = currIdx;
                }
                if (idxRight >= maxRowIdx) {
                    idxRight = currIdx;
                }
                if (idxUp < 0) {
                    idxUp = 0;
                }
                if (idxDown >= maxIdx) {
                    idxDown = currIdx;
                }
                colUp = Filters._getARGB(pixels, idxUp);
                colLeft = Filters._getARGB(pixels, idxLeft);
                colDown = Filters._getARGB(pixels, idxDown);
                colRight = Filters._getARGB(pixels, idxRight);
                currLum = 77 * ((colOrig >> 16) & 255) + 151 * ((colOrig >> 8) & 255) + 28 * (colOrig & 255);
                lumLeft = 77 * ((colLeft >> 16) & 255) + 151 * ((colLeft >> 8) & 255) + 28 * (colLeft & 255);
                lumRight = 77 * ((colRight >> 16) & 255) + 151 * ((colRight >> 8) & 255) + 28 * (colRight & 255);
                lumUp = 77 * ((colUp >> 16) & 255) + 151 * ((colUp >> 8) & 255) + 28 * (colUp & 255);
                lumDown = 77 * ((colDown >> 16) & 255) + 151 * ((colDown >> 8) & 255) + 28 * (colDown & 255);
                if (lumLeft < currLum) {
                    colOut = colLeft;
                    currLum = lumLeft;
                }
                if (lumRight < currLum) {
                    colOut = colRight;
                    currLum = lumRight;
                }
                if (lumUp < currLum) {
                    colOut = colUp;
                    currLum = lumUp;
                }
                if (lumDown < currLum) {
                    colOut = colDown;
                    currLum = lumDown;
                }
                out[currIdx++] = colOut;
            }
        }
        Filters._setPixels(pixels, out);
    };
    var blurRadius;
    var blurKernelSize;
    var blurKernel;
    var blurMult;
    function buildBlurKernel(r) {
        var radius = (r * 3.5) | 0;
        radius = radius < 1 ? 1 : radius < 248 ? radius : 248;
        if (blurRadius !== radius) {
            blurRadius = radius;
            blurKernelSize = (1 + blurRadius) << 1;
            blurKernel = new Int32Array(blurKernelSize);
            blurMult = new Array(blurKernelSize);
            for (var l = 0; l < blurKernelSize; l++) {
                blurMult[l] = new Int32Array(256);
            }
            var bk, bki;
            var bm, bmi;
            for (var i = 1, radiusi = radius - 1; i < radius; i++) {
                blurKernel[radius + i] = blurKernel[radiusi] = bki = radiusi * radiusi;
                bm = blurMult[radius + i];
                bmi = blurMult[radiusi--];
                for (var j = 0; j < 256; j++) {
                    bm[j] = bmi[j] = bki * j;
                }
            }
            bk = blurKernel[radius] = radius * radius;
            bm = blurMult[radius];
            for (var k = 0; k < 256; k++) {
                bm[k] = bk * k;
            }
        }
    }
    function blurRGB(canvas, radius) {
        var pixels = Filters._toPixels(canvas);
        var width = canvas.width;
        var height = canvas.height;
        var numPackedPixels = width * height;
        var argb = new Int32Array(numPackedPixels);
        for (var j = 0; j < numPackedPixels; j++) {
            argb[j] = Filters._getARGB(pixels, j);
        }
        var sum, cr, cg, cb;
        var read, ri, ym, ymi, bk0;
        var r2 = new Int32Array(numPackedPixels);
        var g2 = new Int32Array(numPackedPixels);
        var b2 = new Int32Array(numPackedPixels);
        var yi = 0;
        buildBlurKernel(radius);
        var x, y, i;
        var bm;
        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
                cb = cg = cr = sum = 0;
                read = x - blurRadius;
                if (read < 0) {
                    bk0 = -read;
                    read = 0;
                } else {
                    if (read >= width) {
                        break;
                    }
                    bk0 = 0;
                }
                for (i = bk0; i < blurKernelSize; i++) {
                    if (read >= width) {
                        break;
                    }
                    var c = argb[read + yi];
                    bm = blurMult[i];
                    cr += bm[(c & 16711680) >> 16];
                    cg += bm[(c & 65280) >> 8];
                    cb += bm[c & 255];
                    sum += blurKernel[i];
                    read++;
                }
                ri = yi + x;
                r2[ri] = cr / sum;
                g2[ri] = cg / sum;
                b2[ri] = cb / sum;
            }
            yi += width;
        }
        yi = 0;
        ym = -blurRadius;
        ymi = ym * width;
        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
                cb = cg = cr = sum = 0;
                if (ym < 0) {
                    bk0 = ri = -ym;
                    read = x;
                } else {
                    if (ym >= height) {
                        break;
                    }
                    bk0 = 0;
                    ri = ym;
                    read = x + ymi;
                }
                for (i = bk0; i < blurKernelSize; i++) {
                    if (ri >= height) {
                        break;
                    }
                    bm = blurMult[i];
                    cr += bm[r2[read]];
                    cg += bm[g2[read]];
                    cb += bm[b2[read]];
                    sum += blurKernel[i];
                    ri++;
                    read += width;
                }
                argb[x + yi] = 4278190080 | ((cr / sum) << 16) | ((cg / sum) << 8) | (cb / sum);
            }
            yi += width;
            ymi += width;
            ym++;
        }
        Filters._setPixels(pixels, argb);
    }
    Filters.blur = function (canvas, radius) {
        blurRGB(canvas, radius);
    };
    return Filters;
})({});
var p5Image = (function (require, core, filters) {
    "use strict";
    var p5 = core;
    var Filters = filters;
    p5.Image = function (width, height) {
        this.width = width;
        this.height = height;
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d');
        this.pixels = [];
    };
    p5.Image.prototype._setProperty = function (prop, value) {
        this[prop] = value;
    };
    p5.Image.prototype.loadPixels = function () {
        p5.prototype.loadPixels.call(this);
    };
    p5.Image.prototype.updatePixels = function (x, y, w, h) {
        p5.prototype.updatePixels.call(this, x, y, w, h);
    };
    p5.Image.prototype.get = function (x, y, w, h) {
        return p5.prototype.get.call(this, x, y, w, h);
    };
    p5.Image.prototype.set = function (x, y, imgOrCol) {
        p5.prototype.set.call(this, x, y, imgOrCol);
    };
    p5.Image.prototype.resize = function (width, height) {
        var tempCanvas = document.createElement("canvas");
        tempCanvas.width = width;
        tempCanvas.height = height;
        tempCanvas.getContext("2d").drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, 0, 0, tempCanvas.width, tempCanvas.width);
        this.canvas.width = this.width = width;
        this.canvas.height = this.height = height;
        this.canvas.getContext("2d").drawImage(tempCanvas, 0, 0, width, height, 0, 0, width, height);
        if (this.pixels.length > 0) {
            this.loadPixels();
        }
    };
    p5.Image.prototype.copy = function () {
        p5.prototype.copy.apply(this, arguments);
    };
    p5.Image.prototype.mask = function (p5Image) {
        if (p5Image === undefined) {
            p5Image = this;
        }
        var currBlend = this.canvas.getContext("2d").globalCompositeOperation;
        var copyArgs = [p5Image, 0, 0, p5Image.width, p5Image.height, 0, 0, this.width, this.height];
        this.canvas.getContext("2d").globalCompositeOperation = "destination-out";
        this.copy.apply(this, copyArgs);
        this.canvas.getContext("2d").globalCompositeOperation = currBlend;
    };
    p5.Image.prototype.filter = function (operation, value) {
        Filters.apply(this.canvas, Filters[operation.toLowerCase()], value);
    };
    p5.Image.prototype.blend = function () {
        p5.prototype.blend.apply(this, arguments);
    };
    p5.Image.prototype.save = function (extension) {
        var mimeType;
        switch (extension.toLowerCase()) {
            case "png":
                mimeType = "image/png";
                break;
            case "jpeg":
                mimeType = "image/jpeg";
                break;
            case "jpg":
                mimeType = "image/jpeg";
                break;
            default:
                mimeType = "image/png";
                break;
        }
        if (mimeType !== undefined) {
            var downloadMime = "image/octet-stream";
            var imageData = this.canvas.toDataURL(mimeType);
            imageData = imageData.replace(mimeType, downloadMime);
            window.location.href = imageData;
        }
    };
    return p5.Image;
})({}, core, filters);
var polargeometry = (function (require) {
    return {
        degreesToRadians: function (x) {
            return (2 * Math.PI * x) / 360;
        },
        radiansToDegrees: function (x) {
            return (360 * x) / (2 * Math.PI);
        },
    };
})({});
var p5Vector = (function (require, core, polargeometry, constants) {
    "use strict";
    var p5 = core;
    var polarGeometry = polargeometry;
    var constants = constants;
    p5.Vector = function () {
        var x, y, z;
        if (arguments[0] instanceof p5) {
            this.p5 = arguments[0];
            x = arguments[1][0] || 0;
            y = arguments[1][1] || 0;
            z = arguments[1][2] || 0;
        } else {
            x = arguments[0] || 0;
            y = arguments[1] || 0;
            z = arguments[2] || 0;
        }
        this.x = x;
        this.y = y;
        this.z = z;
    };
    p5.Vector.prototype.set = function (x, y, z) {
        if (x instanceof p5.Vector) {
            return this.set(x.x, x.y, x.z);
        }
        if (x instanceof Array) {
            return this.set(x[0], x[1], x[2]);
        }
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        return this;
    };
    p5.Vector.prototype.get = function () {
        if (this.p5) {
            return new p5.Vector(this.p5, [this.x, this.y, this.z]);
        } else {
            return new p5.Vector(this.x, this.y, this.z);
        }
    };
    p5.Vector.prototype.add = function (x, y, z) {
        if (x instanceof p5.Vector) {
            return this.add(x.x, x.y, x.z);
        }
        if (x instanceof Array) {
            return this.add(x[0], x[1], x[2]);
        }
        this.x += x || 0;
        this.y += y || 0;
        this.z += z || 0;
        return this;
    };
    p5.Vector.prototype.sub = function (x, y, z) {
        if (x instanceof p5.Vector) {
            return this.sub(x.x, x.y, x.z);
        }
        if (x instanceof Array) {
            return this.sub(x[0], x[1], x[2]);
        }
        this.x -= x || 0;
        this.y -= y || 0;
        this.z -= z || 0;
        return this;
    };
    p5.Vector.prototype.mult = function (n) {
        this.x *= n || 0;
        this.y *= n || 0;
        this.z *= n || 0;
        return this;
    };
    p5.Vector.prototype.div = function (n) {
        this.x /= n;
        this.y /= n;
        this.z /= n;
        return this;
    };
    p5.Vector.prototype.mag = function () {
        return Math.sqrt(this.magSq());
    };
    p5.Vector.prototype.magSq = function () {
        var x = this.x,
            y = this.y,
            z = this.z;
        return x * x + y * y + z * z;
    };
    p5.Vector.prototype.dot = function (x, y, z) {
        if (x instanceof p5.Vector) {
            return this.dot(x.x, x.y, x.z);
        }
        return this.x * (x || 0) + this.y * (y || 0) + this.z * (z || 0);
    };
    p5.Vector.prototype.cross = function (v) {
        var x = this.y * v.z - this.z * v.y;
        var y = this.z * v.x - this.x * v.z;
        var z = this.x * v.y - this.y * v.x;
        if (this.p5) {
            return new p5.Vector(this.p5, [x, y, z]);
        } else {
            return new p5.Vector(x, y, z);
        }
    };
    p5.Vector.prototype.dist = function (v) {
        var d = v.get().sub(this);
        return d.mag();
    };
    p5.Vector.prototype.normalize = function () {
        return this.div(this.mag());
    };
    p5.Vector.prototype.limit = function (l) {
        var mSq = this.magSq();
        if (mSq > l * l) {
            this.div(Math.sqrt(mSq));
            this.mult(l);
        }
        return this;
    };
    p5.Vector.prototype.setMag = function (n) {
        return this.normalize().mult(n);
    };
    p5.Vector.prototype.heading = function () {
        var h = Math.atan2(this.y, this.x);
        if (this.p5) {
            if (this.p5._angleMode === constants.RADIANS) {
                return h;
            } else {
                return polarGeometry.radiansToDegrees(h);
            }
        } else {
            return h;
        }
    };
    p5.Vector.prototype.rotate = function (a) {
        if (this.p5) {
            if (this.p5._angleMode === constants.DEGREES) {
                a = polarGeometry.degreesToRadians(a);
            }
        }
        var newHeading = this.heading() + a;
        var mag = this.mag();
        this.x = Math.cos(newHeading) * mag;
        this.y = Math.sin(newHeading) * mag;
        return this;
    };
    p5.Vector.prototype.lerp = function (x, y, z, amt) {
        if (x instanceof p5.Vector) {
            return this.lerp(x.x, x.y, x.z, y);
        }
        this.x += (x - this.x) * amt || 0;
        this.y += (y - this.y) * amt || 0;
        this.z += (z - this.z) * amt || 0;
        return this;
    };
    p5.Vector.prototype.array = function () {
        return [this.x || 0, this.y || 0, this.z || 0];
    };
    p5.Vector.fromAngle = function (angle) {
        if (this.p5) {
            if (this.p5._angleMode === constants.DEGREES) {
                angle = polarGeometry.degreesToRadians(angle);
            }
        }
        if (this.p5) {
            return new p5.Vector(this.p5, [Math.cos(angle), Math.sin(angle), 0]);
        } else {
            return new p5.Vector(Math.cos(angle), Math.sin(angle), 0);
        }
    };
    p5.Vector.random2D = function () {
        var angle;
        if (this.p5) {
            if (this.p5._angleMode === constants.DEGREES) {
                angle = this.p5.random(360);
            } else {
                angle = this.p5.random(constants.TWO_PI);
            }
        } else {
            angle = Math.random() * Math.PI * 2;
        }
        return this.fromAngle(angle);
    };
    p5.Vector.random3D = function () {
        var angle, vz;
        if (this.p5) {
            angle = this.p5.random(0, constants.TWO_PI);
            vz = this.p5.random(-1, 1);
        } else {
            angle = Math.random() * Math.PI * 2;
            vz = Math.random() * 2 - 1;
        }
        var vx = Math.sqrt(1 - vz * vz) * Math.cos(angle);
        var vy = Math.sqrt(1 - vz * vz) * Math.sin(angle);
        if (this.p5) {
            return new p5.Vector(this.p5, [vx, vy, vz]);
        } else {
            return new p5.Vector(vx, vy, vz);
        }
    };
    p5.Vector.add = function (v1, v2) {
        return v1.get().add(v2);
    };
    p5.Vector.sub = function (v1, v2) {
        return v1.get().sub(v2);
    };
    p5.Vector.mult = function (v, n) {
        return v.get().mult(n);
    };
    p5.Vector.div = function (v, n) {
        return v.get().div(n);
    };
    p5.Vector.dot = function (v1, v2) {
        return v1.dot(v2);
    };
    p5.Vector.cross = function (v1, v2) {
        return v1.cross(v2);
    };
    p5.Vector.dist = function (v1, v2) {
        return v1.dist(v2);
    };
    p5.Vector.lerp = function (v1, v2, amt) {
        return v1.get().lerp(v2, amt);
    };
    p5.Vector.angleBetween = function (v1, v2) {
        var angle = Math.acos(v1.dot(v2) / (v1.mag() * v2.mag()));
        if (this.p5) {
            if (this.p5._angleMode === constants.DEGREES) {
                angle = polarGeometry.radiansToDegrees(angle);
            }
        }
        return angle;
    };
    return p5.Vector;
})({}, core, polargeometry, constants);
var colorcreating_reading = (function (require, core, constants) {
    "use strict";
    var p5 = core;
    var constants = constants;
    p5.prototype.alpha = function (rgb) {
        if (rgb.length > 3) {
            return rgb[3];
        } else {
            return 255;
        }
    };
    p5.prototype.blue = function (rgb) {
        if (rgb.length > 2) {
            return rgb[2];
        } else {
            return 0;
        }
    };
    p5.prototype.brightness = function (hsv) {
        if (hsv.length > 2) {
            return hsv[2];
        } else {
            return 0;
        }
    };
    p5.prototype.color = function () {
        var args = arguments;
        var isRGB = this._colorMode === constants.RGB;
        var maxArr = isRGB ? this._maxRGB : this._maxHSB;
        var r, g, b, a;
        if (args.length >= 3) {
            r = args[0];
            g = args[1];
            b = args[2];
            a = typeof args[3] === "number" ? args[3] : maxArr[3];
        } else {
            if (isRGB) {
                r = g = b = args[0];
            } else {
                r = b = args[0];
                g = 0;
            }
            a = typeof args[1] === "number" ? args[1] : maxArr[3];
        }
        return [r, g, b, a];
    };
    p5.prototype.green = function (rgb) {
        if (rgb.length > 2) {
            return rgb[1];
        } else {
            return 0;
        }
    };
    p5.prototype.hue = function (hsv) {
        if (hsv.length > 2) {
            return hsv[0];
        } else {
            return 0;
        }
    };
    p5.prototype.lerpColor = function (c1, c2, amt) {
        if (typeof c1 === "object") {
            var c = [];
            for (var i = 0; i < c1.length; i++) {
                c.push(p5.prototype.lerp(c1[i], c2[i], amt));
            }
            return c;
        } else {
            return p5.prototype.lerp(c1, c2, amt);
        }
    };
    p5.prototype.red = function (rgb) {
        if (rgb.length > 2) {
            return rgb[0];
        } else {
            return 0;
        }
    };
    p5.prototype.saturation = function (hsv) {
        if (hsv.length > 2) {
            return hsv[1];
        } else {
            return 0;
        }
    };
    return p5;
})({}, core, constants);
var colorsetting = (function (require, core, constants) {
    "use strict";
    var p5 = core;
    var constants = constants;
    p5.prototype._colorMode = constants.RGB;
    p5.prototype._maxRGB = [255, 255, 255, 255];
    p5.prototype._maxHSB = [255, 255, 255, 255];
    p5.prototype.background = function () {
        var c = this.getNormalizedColor(arguments);
        var curFill = this.canvas.getContext("2d").fillStyle;
        this.canvas.getContext("2d").fillStyle = this.getCSSRGBAColor(c);
        this.canvas.getContext("2d").fillRect(0, 0, this.width, this.height);
        this.canvas.getContext("2d").fillStyle = curFill;
    };
    p5.prototype.clear = function () {
        this.canvas.getContext("2d").clearRect(0, 0, this.width, this.height);
    };
    p5.prototype.colorMode = function () {
        if (arguments[0] === constants.RGB || arguments[0] === constants.HSB) {
            this._colorMode = arguments[0];
            var isRGB = this._colorMode === constants.RGB;
            var maxArr = isRGB ? this._maxRGB : this._maxHSB;
            if (arguments.length === 2) {
                maxArr[0] = arguments[1];
                maxArr[1] = arguments[1];
                maxArr[2] = arguments[1];
            } else if (arguments.length > 2) {
                maxArr[0] = arguments[1];
                maxArr[1] = arguments[2];
                maxArr[2] = arguments[3];
            }
            if (arguments.length === 5) {
                maxArr[3] = arguments[4];
            }
        }
    };
    p5.prototype.fill = function () {
        var c = this.getNormalizedColor(arguments);
        this.canvas.getContext("2d").fillStyle = this.getCSSRGBAColor(c);
    };
    p5.prototype.noFill = function () {
        this.canvas.getContext("2d").fillStyle = "rgba(0,0,0,0)";
    };
    p5.prototype.noStroke = function () {
        this.canvas.getContext("2d").strokeStyle = "rgba(0,0,0,0)";
    };
    p5.prototype.stroke = function () {
        var c = this.getNormalizedColor(arguments);
        this.canvas.getContext("2d").strokeStyle = this.getCSSRGBAColor(c);
    };
    p5.prototype.getNormalizedColor = function (args) {
        var isRGB = this._colorMode === constants.RGB;
        if (typeof args[0] === 'string') return args[0];
        if (args[0] instanceof skia.CanvasGradient) return args[0];
        if (args[0] instanceof Array) {
            args = args[0];
        }
        var r, g, b, a, rgba;
        if (args.length >= 3) {
            r = args[0];
            g = args[1];
            b = args[2];
            a = typeof args[3] === "number" ? args[3] : this._maxA;
        } else {
            if (isRGB) {
                r = g = b = args[0];
            } else {
                r = b = args[0];
                g = 0;
            }
            a = typeof args[1] === "number" ? args[1] : this._maxA;
        }
        var maxArr = isRGB ? this._maxRGB : this._maxHSB;
        r *= 255 / maxArr[0];
        g *= 255 / maxArr[1];
        b *= 255 / maxArr[2];
        a *= 255 / maxArr[3];
        if (this._colorMode === constants.HSB) {
            rgba = hsv2rgb(r, g, b).concat(a);
        } else {
            rgba = [r, g, b, a];
        }
        return rgba;
    };
    function hsv2rgb(h, s, v) {
        h /= 255;
        s /= 255;
        v /= 255;
        var RGB = [];
        if (s === 0) {
            RGB = [Math.round(v * 255), Math.round(v * 255), Math.round(v * 255)];
        } else {
            var var_h = h * 6;
            if (var_h === 6) {
                var_h = 0;
            }
            var var_i = Math.floor(var_h);
            var var_1 = v * (1 - s);
            var var_2 = v * (1 - s * (var_h - var_i));
            var var_3 = v * (1 - s * (1 - (var_h - var_i)));
            var var_r;
            var var_g;
            var var_b;
            if (var_i === 0) {
                var_r = v;
                var_g = var_3;
                var_b = var_1;
            } else if (var_i === 1) {
                var_r = var_2;
                var_g = v;
                var_b = var_1;
            } else if (var_i === 2) {
                var_r = var_1;
                var_g = v;
                var_b = var_3;
            } else if (var_i === 3) {
                var_r = var_1;
                var_g = var_2;
                var_b = v;
            } else if (var_i === 4) {
                var_r = var_3;
                var_g = var_1;
                var_b = v;
            } else {
                var_r = v;
                var_g = var_1;
                var_b = var_2;
            }
            RGB = [Math.round(var_r * 255), Math.round(var_g * 255), Math.round(var_b * 255)];
        }
        return RGB;
    }
    p5.prototype.getCSSRGBAColor = function (arr) {
        if (typeof arr === 'string') return arr;
        if (arr instanceof skia.CanvasGradient) return arr;
        var a = arr.map(function (val) {
            return Math.floor(val);
        });
        var alpha = a[3] ? a[3] / 255 : 1;
        return "rgba(" + a[0] + "," + a[1] + "," + a[2] + "," + alpha + ")";
    };
    return p5;
})({}, core, constants);
var dataarray_functions = (function (require, core) {
    "use strict";
    var p5 = core;
    p5.prototype.append = function (array, value) {
        array.push(value);
        return array;
    };
    p5.prototype.arrayCopy = function (src, srcPosition, dst, dstPosition, length) {
        var start, end;
        if (typeof length !== "undefined") {
            end = Math.min(length, src.length);
            start = dstPosition;
            src = src.slice(srcPosition, end + srcPosition);
        } else {
            if (typeof dst !== "undefined") {
                end = dst;
                end = Math.min(end, src.length);
            } else {
                end = src.length;
            }
            start = 0;
            dst = srcPosition;
            src = src.slice(0, end);
        }
        Array.prototype.splice.apply(dst, [start, end].concat(src));
    };
    p5.prototype.concat = function (list0, list1) {
        return list0.concat(list1);
    };
    p5.prototype.reverse = function (list) {
        return list.reverse();
    };
    p5.prototype.shorten = function (list) {
        list.pop();
        return list;
    };
    p5.prototype.sort = function (list, count) {
        var arr = count ? list.slice(0, Math.min(count, list.length)) : list;
        var rest = count ? list.slice(Math.min(count, list.length)) : [];
        if (typeof arr[0] === "string") {
            arr = arr.sort();
        } else {
            arr = arr.sort(function (a, b) {
                return a - b;
            });
        }
        return arr.concat(rest);
    };
    p5.prototype.splice = function (list, value, index) {
        Array.prototype.splice.apply(list, [index, 0].concat(value));
        return list;
    };
    p5.prototype.subset = function (list, start, count) {
        if (typeof count !== "undefined") {
            return list.slice(start, start + count);
        } else {
            return list.slice(start, list.length);
        }
    };
    return p5;
})({}, core);
var datastring_functions = (function (require, core) {
    "use strict";
    var p5 = core;
    p5.prototype.join = function (list, separator) {
        return list.join(separator);
    };
    p5.prototype.match = function (str, reg) {
        return str.match(reg);
    };
    p5.prototype.matchAll = function (str, reg) {
        var re = new RegExp(reg, "g");
        var match = re.exec(str);
        var matches = [];
        while (match !== null) {
            matches.push(match);
            match = re.exec(str);
        }
        return matches;
    };
    p5.prototype.nf = function () {
        if (arguments[0] instanceof Array) {
            var a = arguments[1];
            var b = arguments[2];
            return arguments[0].map(function (x) {
                return doNf(x, a, b);
            });
        } else {
            return doNf.apply(this, arguments);
        }
    };
    function doNf() {
        var num = arguments[0];
        var neg = num < 0;
        var n = neg ? num.toString().substring(1) : num.toString();
        var decimalInd = n.indexOf(".");
        var intPart = decimalInd !== -1 ? n.substring(0, decimalInd) : n;
        var decPart = decimalInd !== -1 ? n.substring(decimalInd + 1) : "";
        var str = neg ? "-" : "";
        if (arguments.length === 3) {
            for (var i = 0; i < arguments[1] - intPart.length; i++) {
                str += "0";
            }
            str += intPart;
            str += ".";
            str += decPart;
            for (var j = 0; j < arguments[2] - decPart.length; j++) {
                str += "0";
            }
            return str;
        } else {
            for (var k = 0; k < Math.max(arguments[1] - intPart.length, 0); k++) {
                str += "0";
            }
            str += n;
            return str;
        }
    }
    p5.prototype.nfc = function () {
        if (arguments[0] instanceof Array) {
            var a = arguments[1];
            return arguments[0].map(function (x) {
                return doNfc(x, a);
            });
        } else {
            return doNfc.apply(this, arguments);
        }
    };
    function doNfc() {
        var num = arguments[0].toString();
        var dec = num.indexOf(".");
        var rem = dec !== -1 ? num.substring(dec) : "";
        var n = dec !== -1 ? num.substring(0, dec) : num;
        n = n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if (arguments.length > 1) {
            rem = rem.substring(0, arguments[1] + 1);
        }
        return n + rem;
    }
    p5.prototype.nfp = function () {
        var nfRes = this.nf(arguments);
        if (nfRes instanceof Array) {
            return nfRes.map(addNfp);
        } else {
            return addNfp(nfRes);
        }
    };
    function addNfp() {
        return parseFloat(arguments[0]) > 0 ? "+" + arguments[0].toString() : arguments[0].toString();
    }
    p5.prototype.nfs = function () {
        var nfRes = this.nf(arguments);
        if (nfRes instanceof Array) {
            return nfRes.map(addNfs);
        } else {
            return addNfs(nfRes);
        }
    };
    function addNfs() {
        return parseFloat(arguments[0]) > 0 ? " " + arguments[0].toString() : arguments[0].toString();
    }
    p5.prototype.split = function (str, delim) {
        return str.split(delim);
    };
    p5.prototype.splitTokens = function () {
        var d = arguments.length > 0 ? arguments[1] : /\s/g;
        return arguments[0].split(d).filter(function (n) {
            return n;
        });
    };
    p5.prototype.trim = function (str) {
        if (str instanceof Array) {
            return str.map(this.trim);
        } else {
            return str.trim();
        }
    };
    return p5;
})({}, core);
var environment = (function (require, core, constants) {
    "use strict";
    var p5 = core;
    var C = constants;
    var standardCursors = [C.ARROW, C.CROSS, C.HAND, C.MOVE, C.TEXT, C.WAIT];
    p5.prototype._frameRate = 0;
    p5.prototype._lastFrameTime = 0;
    p5.prototype._targetFrameRate = 60;
    p5.prototype.frameCount = 0;
    p5.prototype.focused = true;
    p5.prototype.cursor = function (type, x, y) {
        var cursor = "auto";
        var canvas = this._curElement.elt;
        if (standardCursors.indexOf(type) > -1) {
            cursor = type;
        } else if (typeof type === "string") {
            var coords = "";
            if (x && y && typeof x === "number" && typeof y === "number") {
                coords = x + " " + y;
            }
            if (type.substring(0, 6) !== "http://") {
                cursor = "url(" + type + ") " + coords + ", auto";
            } else if (/\.(cur|jpg|jpeg|gif|png|CUR|JPG|JPEG|GIF|PNG)$/.test(type)) {
                cursor = "url(" + type + ") " + coords + ", auto";
            } else {
                cursor = type;
            }
        }
        //canvas.style?.cursor = cursor;
    };
    p5.prototype.frameRate = function (fps) {
        if (typeof fps === "undefined") {
            return this._frameRate;
        } else {
            this._setProperty("_targetFrameRate", fps);
            this._runFrames();
            return this;
        }
    };
    p5.prototype.getFrameRate = function () {
        return this.frameRate();
    };
    p5.prototype.setFrameRate = function (fps) {
        return this.frameRate(fps);
    };
    p5.prototype.noCursor = function () {
        //this._curElement.elt.style?.cursor = "none";
    };
    p5.prototype.displayWidth = screen.width;
    p5.prototype.displayHeight = screen.height;
    p5.prototype.windowWidth = window.innerWidth;
    window.addEventListener("resize", function (e) {
        this.windowWidth = window.innerWidth;
    });
    p5.prototype.windowHeight = window.innerHeight;
    window.addEventListener("resize", function (e) {
        this.windowHeight = window.windowHeight;
    });
    p5.prototype.width = 0;
    p5.prototype.height = 0;
    p5.prototype.fullscreen = function (val) {
        if (typeof val === "undefined") {
            return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
        } else {
            if (val) {
                launchFullscreen(document.documentElement);
            } else {
                exitFullscreen();
            }
        }
    };
    function launchFullscreen(element) {
        var enabled = document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled;
        if (!enabled) {
            throw new Error("Fullscreen not enabled in this browser.");
        }
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }
    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
    return p5;
})({}, core, constants);
var imageimage = (function (require, core, constants) {
    "use strict";
    var p5 = core;
    var constants = constants;
    p5.prototype._imageMode = constants.CORNER;
    p5.prototype._tint = null;
    p5.prototype.createImage = function (width, height) {
        return new p5.Image(width, height);
    };
    return p5;
})({}, core, constants);
var canvas = (function (require, constants) {
    var constants = constants;
    return {
        modeAdjust: function (a, b, c, d, mode) {
            if (mode === constants.CORNER) {
                return {
                    x: a,
                    y: b,
                    w: c,
                    h: d,
                };
            } else if (mode === constants.CORNERS) {
                return {
                    x: a,
                    y: b,
                    w: c - a,
                    h: d - b,
                };
            } else if (mode === constants.RADIUS) {
                return {
                    x: a - c,
                    y: b - d,
                    w: 2 * c,
                    h: 2 * d,
                };
            } else if (mode === constants.CENTER) {
                return {
                    x: a - c * 0.5,
                    y: b - d * 0.5,
                    w: c,
                    h: d,
                };
            }
        },
        arcModeAdjust: function (a, b, c, d, mode) {
            if (mode === constants.CORNER) {
                return {
                    x: a + c * 0.5,
                    y: b + d * 0.5,
                    w: c,
                    h: d,
                };
            } else if (mode === constants.CORNERS) {
                return {
                    x: a,
                    y: b,
                    w: c + a,
                    h: d + b,
                };
            } else if (mode === constants.RADIUS) {
                return {
                    x: a,
                    y: b,
                    w: 2 * c,
                    h: 2 * d,
                };
            } else if (mode === constants.CENTER) {
                return {
                    x: a,
                    y: b,
                    w: c,
                    h: d,
                };
            }
        },
    };
})({}, constants);
var imageloading_displaying = (function (require, core, filters, canvas, constants) {
    "use strict";
    var p5 = core;
    var Filters = filters;
    var canvas = canvas;
    var constants = constants;
    p5.prototype.loadImage = function (path, callback) {
        let src = Buffer.isBuffer(path) ? path : typeof path === 'string' ? fs.readFileSync(path) : null;
        if (!src) throw "The first parameter of loadImage must be an image path or image buffer.";
        var img = new Image();
        var pImg = new p5.Image(1, 1, this);
        img.onload = function () {
            pImg.width = pImg.canvas.width = img.width;
            pImg.height = pImg.canvas.height = img.height;
            pImg.canvas.getContext("2d").drawImage(img, 0, 0);
            if (typeof callback !== "undefined") {
                callback(pImg);
            }
        };
        img.crossOrigin = "Anonymous";
        img.src = src;;
        return pImg;
    };
    p5.prototype.image = function (img, x, y, width, height) {
        var frame = img.canvas ? img.canvas : img.elt;
        if (width === undefined) {
            width = img.width;
        }
        if (height === undefined) {
            height = img.height;
        }
        var vals = canvas.modeAdjust(x, y, width, height, this._imageMode);
        if (this._tint) {
            this.canvas.getContext("2d").drawImage(this._getTintedImageCanvas(frame), vals.x, vals.y, vals.w, vals.h);
        } else {
            this.canvas.getContext("2d").drawImage(frame, vals.x, vals.y, vals.w, vals.h);
        }
    };
    p5.prototype.tint = function () {
        var c = this.getNormalizedColor(arguments);
        this._tint = c;
    };
    p5.prototype.noTint = function () {
        this._tint = null;
    };
    p5.prototype._getTintedImageCanvas = function (img) {
        if (!img.canvas) {
            return img;
        }
        var pixels = Filters._toPixels(img.canvas);
        var tmpCanvas = document.createElement("canvas");
        tmpCanvas.width = img.canvas.width;
        tmpCanvas.height = img.canvas.height;
        var tmpCtx = tmpCanvas.getContext("2d");
        var id = tmpCtx.createImageData(img.canvas.width, img.canvas.height);
        var newPixels = id.data;
        for (var i = 0; i < pixels.length; i += 4) {
            var r = pixels[i];
            var g = pixels[i + 1];
            var b = pixels[i + 2];
            var a = pixels[i + 3];
            newPixels[i] = (r * this._tint[0]) / 255;
            newPixels[i + 1] = (g * this._tint[1]) / 255;
            newPixels[i + 2] = (b * this._tint[2]) / 255;
            newPixels[i + 3] = (a * this._tint[3]) / 255;
        }
        tmpCtx.putImageData(id, 0, 0);
        return tmpCanvas;
    };
    p5.prototype.imageMode = function (m) {
        if (m === constants.CORNER || m === constants.CORNERS || m === constants.CENTER) {
            this._imageMode = m;
        }
    };
    return p5;
})({}, core, filters, canvas, constants);
var imagepixels = (function (require, core, filters) {
    "use strict";
    var p5 = core;
    var Filters = filters;
    p5.prototype.pixels = [];
    p5.prototype.blend = function () {
        var currBlend = this.canvas.getContext("2d").globalCompositeOperation;
        var blendMode = arguments[arguments.length - 1];
        var copyArgs = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
        this.canvas.getContext("2d").globalCompositeOperation = blendMode;
        this.copy.apply(this, copyArgs);
        this.canvas.getContext("2d").globalCompositeOperation = currBlend;
    };
    p5.prototype.copy = function () {
        var srcImage, sx, sy, sw, sh, dx, dy, dw, dh;
        if (arguments.length === 9) {
            srcImage = arguments[0];
            sx = arguments[1];
            sy = arguments[2];
            sw = arguments[3];
            sh = arguments[4];
            dx = arguments[5];
            dy = arguments[6];
            dw = arguments[7];
            dh = arguments[8];
        } else if (arguments.length === 8) {
            sx = arguments[0];
            sy = arguments[1];
            sw = arguments[2];
            sh = arguments[3];
            dx = arguments[4];
            dy = arguments[5];
            dw = arguments[6];
            dh = arguments[7];
            srcImage = this;
        } else {
            throw new Error("Signature not supported");
        }
        this.canvas.getContext("2d").drawImage(srcImage.canvas, sx, sy, sw, sh, dx, dy, dw, dh);
    };
    p5.prototype.filter = function (operation, value) {
        Filters.apply(this.canvas, Filters[operation.toLowerCase()], value);
    };
    p5.prototype.get = function (x, y, w, h) {
        if (x === undefined && y === undefined && w === undefined && h === undefined) {
            x = 0;
            y = 0;
            w = this.width;
            h = this.height;
        } else if (w === undefined && h === undefined) {
            w = 1;
            h = 1;
        }
        if (x > this.width || y > this.height || x < 0 || y < 0) {
            return [0, 0, 0, 255];
        }
        var imageData = this.canvas.getContext("2d").getImageData(x, y, w, h);
        var data = imageData.data;
        if (w === 1 && h === 1) {
            var pixels = [];
            for (var i = 0; i < data.length; i += 4) {
                pixels.push(data[i], data[i + 1], data[i + 2], data[i + 3]);
            }
            return pixels;
        } else {
            w = Math.min(w, this.width);
            h = Math.min(h, this.height);
            var region = new p5.Image(w, h);
            region.canvas.getContext("2d").putImageData(imageData, 0, 0, 0, 0, w, h);
            return region;
        }
    };
    p5.prototype.loadPixels = function () {
        var width = this.width;
        var height = this.height;
        var data = this.canvas.getContext("2d").getImageData(0, 0, width, height).data;
        var pixels = [];
        for (var i = 0; i < data.length; i += 4) {
            pixels.push([data[i], data[i + 1], data[i + 2], data[i + 3]]);
        }
        this._setProperty("pixels", pixels);
    };
    p5.prototype.set = function (x, y, imgOrCol) {
        var idx = y * this.width + x;
        if (typeof imgOrCol === "number") {
            if (!this.pixels) {
                this.loadPixels.call(this);
            }
            if (idx < this.pixels.length) {
                this.pixels[idx] = [imgOrCol, imgOrCol, imgOrCol, 255];
                this.updatePixels.call(this);
            }
        } else if (imgOrCol instanceof Array) {
            if (imgOrCol.length < 4) {
                imgOrCol[3] = 255;
            }
            if (!this.pixels) {
                this.loadPixels.call(this);
            }
            if (idx < this.pixels.length) {
                this.pixels[idx] = imgOrCol;
                this.updatePixels.call(this);
            }
        } else {
            this.canvas.getContext("2d").drawImage(imgOrCol.canvas, x, y);
            this.loadPixels.call(this);
        }
    };
    p5.prototype.updatePixels = function (x, y, w, h) {
        if (x === undefined && y === undefined && w === undefined && h === undefined) {
            x = 0;
            y = 0;
            w = this.width;
            h = this.height;
        }
        var imageData = this.canvas.getContext("2d").getImageData(x, y, w, h);
        var data = imageData.data;
        for (var i = 0; i < this.pixels.length; i += 1) {
            var j = i * 4;
            data[j] = this.pixels[i][0];
            data[j + 1] = this.pixels[i][1];
            data[j + 2] = this.pixels[i][2];
            data[j + 3] = this.pixels[i][3];
        }
        this.canvas.getContext("2d").putImageData(imageData, x, y, 0, 0, w, h);
    };
    return p5;
})({}, core, filters);
var inputfiles = (function (require, core, reqwest) {
    "use strict";
    var p5 = core;
    var reqwest = reqwest;
    p5.prototype.createInput = function () {
        throw "not yet implemented";
    };
    p5.prototype.createReader = function () {
        throw "not yet implemented";
    };
    p5.prototype.loadBytes = function () {
        throw "not yet implemented";
    };
    p5.prototype.loadJSON = function (path, callback) {
        var ret = [];
        var t = path.indexOf("http") === -1 ? "json" : "jsonp";
        reqwest({
            url: path,
            type: t,
            success: function (resp) {
                for (var k in resp) {
                    ret[k] = resp[k];
                }
                if (typeof callback !== "undefined") {
                    callback(ret);
                }
            },
        });
        return ret;
    };
    p5.prototype.loadStrings = function (path, callback) {
        var ret = [];
        var req = new XMLHttpRequest();
        req.open("GET", path, true);
        req.onreadystatechange = function () {
            if (req.readyState === 4 && (req.status === 200 || req.status === 0)) {
                var arr = req.responseText.match(/[^\r\n]+/g);
                for (var k in arr) {
                    ret[k] = arr[k];
                }
                if (typeof callback !== "undefined") {
                    callback(ret);
                }
            }
        };
        req.send(null);
        return ret;
    };
    p5.prototype.loadTable = function () {
        throw "not yet implemented";
    };
    p5.prototype.loadXML = function (path, callback) {
        var ret = [];
        reqwest({
            url: path,
            type: "xml",
            success: function (resp) {
                ret[0] = resp;
                if (typeof callback !== "undefined") {
                    callback(ret);
                }
            },
        });
        return ret;
    };
    p5.prototype.parseXML = function () {
        throw "not yet implemented";
    };
    p5.prototype.saveTable = function () {
        throw "not yet implemented";
    };
    p5.prototype.selectFolder = function () {
        throw "not yet implemented";
    };
    p5.prototype.selectInput = function () {
        throw "not yet implemented";
    };
    return p5;
})({}, core, () => {});
var inputkeyboard = (function (require, core) {
    "use strict";
    var p5 = core;
    p5.prototype.isKeyPressed = false;
    p5.prototype.keyIsPressed = false;
    p5.prototype.key = "";
    p5.prototype.keyCode = 0;
    p5.prototype.onkeydown = function (e) {
        this._setProperty("isKeyPressed", true);
        this._setProperty("keyIsPressed", true);
        this._setProperty("keyCode", e.which);
        var key = String.fromCharCode(e.which);
        if (!key) {
            key = e.which;
        }
        this._setProperty("key", key);
        var keyPressed = this.keyPressed || window.keyPressed;
        if (typeof keyPressed === "function" && !e.charCode) {
            keyPressed(e);
        }
    };
    p5.prototype.onkeyup = function (e) {
        var keyReleased = this.keyReleased || window.keyReleased;
        this._setProperty("isKeyPressed", false);
        this._setProperty("keyIsPressed", false);
        if (typeof keyReleased === "function") {
            keyReleased(e);
        }
    };
    p5.prototype.onkeypress = function (e) {
        this._setProperty("keyCode", e.which);
        this._setProperty("key", String.fromCharCode(e.which));
        var keyTyped = this.keyTyped || window.keyTyped;
        if (typeof keyTyped === "function") {
            keyTyped(e);
        }
    };
    return p5;
})({}, core);
var inputmouse = (function (require, core, constants) {
    "use strict";
    var p5 = core;
    var constants = constants;
    p5.prototype.mouseX = 0;
    p5.prototype.mouseY = 0;
    p5.prototype.pmouseX = 0;
    p5.prototype.pmouseY = 0;
    p5.prototype.winMouseX = 0;
    p5.prototype.winMouseY = 0;
    p5.prototype.pwinMouseX = 0;
    p5.prototype.pwinMouseY = 0;
    p5.prototype.mouseButton = 0;
    p5.prototype.isMousePressed = false;
    p5.prototype.mouseIsPressed = false;
    p5.prototype.updateMouseCoords = function (e) {
        var mousePos = getMousePos(this._curElement.elt, e);
        this._setProperty("pmouseX", this.mouseX);
        this._setProperty("pmouseY", this.mouseY);
        this._setProperty("mouseX", mousePos.x);
        this._setProperty("mouseY", mousePos.y);
        this._setProperty("pwinMouseX", this.winMouseX);
        this._setProperty("pwinMouseY", this.winMouseY);
        this._setProperty("winMouseX", e.pageX);
        this._setProperty("winMouseY", e.pageY);
    };
    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top,
        };
    }
    p5.prototype.setMouseButton = function (e) {
        if (e.button === 1) {
            this._setProperty("mouseButton", constants.CENTER);
        } else if (e.button === 2) {
            this._setProperty("mouseButton", constants.RIGHT);
        } else {
            this._setProperty("mouseButton", constants.LEFT);
        }
    };
    p5.prototype.onmousemove = function (e) {
        var context = this._isGlobal ? window : this;
        this.updateMouseCoords(e);
        if (!this.isMousePressed) {
            if (typeof context.mouseMoved === "function") {
                e.preventDefault();
                context.mouseMoved(e);
            } else if (typeof context.touchMoved === "function") {
                e.preventDefault();
                context.touchMoved(e);
            }
        } else {
            if (typeof context.mouseDragged === "function") {
                e.preventDefault();
                context.mouseDragged(e);
            } else if (typeof context.touchMoved === "function") {
                e.preventDefault();
                context.touchMoved(e);
            }
        }
    };
    p5.prototype.onmousedown = function (e) {
        var context = this._isGlobal ? window : this;
        this._setProperty("isMousePressed", true);
        this._setProperty("mouseIsPressed", true);
        this.setMouseButton(e);
        if (typeof context.mousePressed === "function") {
            e.preventDefault();
            context.mousePressed(e);
        } else if (typeof context.touchStarted === "function") {
            e.preventDefault();
            context.touchStarted(e);
        }
    };
    p5.prototype.onmouseup = function (e) {
        var context = this._isGlobal ? window : this;
        this._setProperty("isMousePressed", false);
        this._setProperty("mouseIsPressed", false);
        if (typeof context.mouseReleased === "function") {
            e.preventDefault();
            context.mouseReleased(e);
        } else if (typeof context.touchEnded === "function") {
            e.preventDefault();
            context.touchEnded(e);
        }
    };
    p5.prototype.onclick = function (e) {
        var context = this._isGlobal ? window : this;
        if (typeof context.mouseClicked === "function") {
            e.preventDefault();
            context.mouseClicked(e);
        }
    };
    p5.prototype.onmousewheel = function (e) {
        var context = this._isGlobal ? window : this;
        if (typeof context.mouseWheel === "function") {
            e.preventDefault();
            context.mouseWheel(e);
        }
    };
    return p5;
})({}, core, constants);
var inputtime_date = (function (require, core) {
    "use strict";
    var p5 = core;
    p5.prototype.day = function () {
        return new Date().getDate();
    };
    p5.prototype.hour = function () {
        return new Date().getHours();
    };
    p5.prototype.minute = function () {
        return new Date().getMinutes();
    };
    p5.prototype.millis = function () {
        return new Date().getTime() - this._startTime;
    };
    p5.prototype.month = function () {
        return new Date().getMonth() + 1;
    };
    p5.prototype.second = function () {
        return new Date().getSeconds();
    };
    p5.prototype.year = function () {
        return new Date().getFullYear();
    };
    return p5;
})({}, core);
var inputtouch = (function (require, core) {
    "use strict";
    var p5 = core;
    p5.prototype.touchX = 0;
    p5.prototype.touchY = 0;
    p5.prototype.setTouchPoints = function (e) {
        var context = this._isGlobal ? window : this;
        context._setProperty("touchX", e.changedTouches[0].pageX);
        context._setProperty("touchY", e.changedTouches[0].pageY);
        var touches = [];
        for (var i = 0; i < e.changedTouches.length; i++) {
            var ct = e.changedTouches[i];
            touches[i] = {
                x: ct.pageX,
                y: ct.pageY,
            };
        }
        context._setProperty("touches", touches);
    };
    p5.prototype.ontouchstart = function (e) {
        var context = this._isGlobal ? window : this;
        context.setTouchPoints(e);
        if (typeof context.touchStarted === "function") {
            e.preventDefault();
            context.touchStarted(e);
        } else if (typeof context.mousePressed === "function") {
            e.preventDefault();
            context.mousePressed(e);
        }
    };
    p5.prototype.ontouchmove = function (e) {
        var context = this._isGlobal ? window : this;
        context.setTouchPoints(e);
        if (typeof context.touchMoved === "function") {
            e.preventDefault();
            context.touchMoved(e);
        } else if (typeof context.mouseDragged === "function") {
            e.preventDefault();
            context.mouseDragged(e);
        }
    };
    p5.prototype.ontouchend = function (e) {
        var context = this._isGlobal ? window : this;
        context.setTouchPoints(e);
        if (typeof context.touchEnded === "function") {
            e.preventDefault();
            context.touchEnded(e);
        } else if (typeof context.mouseReleased === "function") {
            e.preventDefault();
            context.mouseReleased(e);
        }
    };
    return p5;
})({}, core);
var mathmath = (function (require, core) {
    "use strict";
    var p5 = core;
    p5.prototype.createVector = function () {
        return new p5.Vector(this, arguments);
    };
    return p5;
})({}, core);
var mathcalculation = (function (require, core) {
    "use strict";
    var p5 = core;
    p5.prototype.abs = Math.abs;
    p5.prototype.ceil = Math.ceil;
    p5.prototype.constrain = function (amt, low, high) {
        return this.max(this.min(amt, high), low);
    };
    p5.prototype.dist = function (x1, y1, x2, y2) {
        var xs = x2 - x1;
        var ys = y2 - y1;
        return Math.sqrt(xs * xs + ys * ys);
    };
    p5.prototype.exp = Math.exp;
    p5.prototype.floor = Math.floor;
    p5.prototype.lerp = function (start, stop, amt) {
        return amt * (stop - start) + start;
    };
    p5.prototype.log = Math.log;
    p5.prototype.mag = function (x, y) {
        return Math.sqrt(x * x + y * y);
    };
    p5.prototype.map = function (n, start1, stop1, start2, stop2) {
        return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
    };
    p5.prototype.max = function () {
        if (arguments[0] instanceof Array) {
            return Math.max.apply(null, arguments[0]);
        } else {
            return Math.max.apply(null, arguments);
        }
    };
    p5.prototype.min = function () {
        if (arguments[0] instanceof Array) {
            return Math.min.apply(null, arguments[0]);
        } else {
            return Math.min.apply(null, arguments);
        }
    };
    p5.prototype.norm = function (n, start, stop) {
        return this.map(n, start, stop, 0, 1);
    };
    p5.prototype.pow = Math.pow;
    p5.prototype.round = Math.round;
    p5.prototype.sq = function (n) {
        return n * n;
    };
    p5.prototype.sqrt = Math.sqrt;
    return p5;
})({}, core);
var mathrandom = (function (require, core) {
    "use strict";
    var p5 = core;
    var seeded = false;
    var lcg = (function () {
        var m = 4294967296,
            a = 1664525,
            c = 1013904223,
            seed,
            z;
        return {
            setSeed: function (val) {
                z = seed = val || Math.round(Math.random() * m);
            },
            getSeed: function () {
                return seed;
            },
            rand: function () {
                z = (a * z + c) % m;
                return z / m;
            },
        };
    })();
    p5.prototype.randomSeed = function (seed) {
        lcg.setSeed(seed);
        seeded = true;
    };
    p5.prototype.random = function (min, max) {
        var rand;
        if (seeded) {
            rand = lcg.rand();
        } else {
            rand = Math.random();
        }
        if (arguments.length === 0) {
            return rand;
        } else if (arguments.length === 1) {
            return rand * min;
        } else {
            if (min > max) {
                var tmp = min;
                min = max;
                max = tmp;
            }
            return rand * (max - min) + min;
        }
    };
    var y2;
    var previous = false;
    p5.prototype.randomGaussian = function (mean, sd) {
        var y1, x1, x2, w;
        if (previous) {
            y1 = y2;
            previous = false;
        } else {
            do {
                x1 = this.random(2) - 1;
                x2 = this.random(2) - 1;
                w = x1 * x1 + x2 * x2;
            } while (w >= 1);
            w = Math.sqrt((-2 * Math.log(w)) / w);
            y1 = x1 * w;
            y2 = x2 * w;
            previous = true;
        }
        var m = mean || 0;
        var s = sd || 1;
        return y1 * s + m;
    };
    return p5;
})({}, core);
var mathnoise = (function (require, core) {
    "use strict";
    var p5 = core;
    var PERLIN_YWRAPB = 4;
    var PERLIN_YWRAP = 1 << PERLIN_YWRAPB;
    var PERLIN_ZWRAPB = 8;
    var PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB;
    var PERLIN_SIZE = 4095;
    var perlin_octaves = 4;
    var perlin_amp_falloff = 0.5;
    var SINCOS_PRECISION = 0.5;
    var SINCOS_LENGTH = Math.floor(360 / SINCOS_PRECISION);
    var sinLUT = new Array(SINCOS_LENGTH);
    var cosLUT = new Array(SINCOS_LENGTH);
    var DEG_TO_RAD = Math.PI / 180;
    for (var i = 0; i < SINCOS_LENGTH; i++) {
        sinLUT[i] = Math.sin(i * DEG_TO_RAD * SINCOS_PRECISION);
        cosLUT[i] = Math.cos(i * DEG_TO_RAD * SINCOS_PRECISION);
    }
    var perlin_PI = SINCOS_LENGTH;
    perlin_PI >>= 1;
    var perlin;
    p5.prototype.noise = function (x, y, z) {
        y = y || 0;
        z = z || 0;
        if (perlin == null) {
            perlin = new Array(PERLIN_SIZE + 1);
            for (var i = 0; i < PERLIN_SIZE + 1; i++) {
                perlin[i] = Math.random();
            }
        }
        if (x < 0) {
            x = -x;
        }
        if (y < 0) {
            y = -y;
        }
        if (z < 0) {
            z = -z;
        }
        var xi = Math.floor(x),
            yi = Math.floor(y),
            zi = Math.floor(z);
        var xf = x - xi;
        var yf = y - yi;
        var zf = z - zi;
        var rxf, ryf;
        var r = 0;
        var ampl = 0.5;
        var n1, n2, n3;
        var noise_fsc = function (i) {
            return 0.5 * (1 - cosLUT[Math.floor(i * perlin_PI) % SINCOS_LENGTH]);
        };
        for (var o = 0; o < perlin_octaves; o++) {
            var of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB);
            rxf = noise_fsc(xf);
            ryf = noise_fsc(yf);
            n1 = perlin[of & PERLIN_SIZE];
            n1 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n1);
            n2 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
            n2 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2);
            n1 += ryf * (n2 - n1);
            of += PERLIN_ZWRAP;
            n2 = perlin[of & PERLIN_SIZE];
            n2 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n2);
            n3 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
            n3 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3);
            n2 += ryf * (n3 - n2);
            n1 += noise_fsc(zf) * (n2 - n1);
            r += n1 * ampl;
            ampl *= perlin_amp_falloff;
            xi <<= 1;
            xf *= 2;
            yi <<= 1;
            yf *= 2;
            zi <<= 1;
            zf *= 2;
            if (xf >= 1) {
                xi++;
                xf--;
            }
            if (yf >= 1) {
                yi++;
                yf--;
            }
            if (zf >= 1) {
                zi++;
                zf--;
            }
        }
        return r;
    };
    p5.prototype.noiseDetail = function (lod, falloff) {
        if (lod > 0) {
            perlin_octaves = lod;
        }
        if (falloff > 0) {
            perlin_amp_falloff = falloff;
        }
    };
    p5.prototype.noiseSeed = function (seed) {
        var lcg = (function () {
            var m = 4294967296,
                a = 1664525,
                c = 1013904223,
                seed,
                z;
            return {
                setSeed: function (val) {
                    z = seed = val || Math.round(Math.random() * m);
                },
                getSeed: function () {
                    return seed;
                },
                rand: function () {
                    z = (a * z + c) % m;
                    return z / m;
                },
            };
        })();
        lcg.setSeed(seed);
        perlin = new Array(PERLIN_SIZE + 1);
        for (var i = 0; i < PERLIN_SIZE + 1; i++) {
            perlin[i] = lcg.rand();
        }
    };
    return p5;
})({}, core);
var mathtrigonometry = (function (require, core, polargeometry, constants) {
    "use strict";
    var p5 = core;
    var polarGeometry = polargeometry;
    var constants = constants;
    p5.prototype._angleMode = constants.RADIANS;
    p5.prototype.acos = function (ratio) {
        if (this._angleMode === constants.RADIANS) {
            return Math.acos(ratio);
        } else {
            return polarGeometry.radiansToDegrees(Math.acos(ratio));
        }
    };
    p5.prototype.asin = function (ratio) {
        if (this._angleMode === constants.RADIANS) {
            return Math.asin(ratio);
        } else {
            return polarGeometry.radiansToDegrees(Math.asin(ratio));
        }
    };
    p5.prototype.atan = function (ratio) {
        if (this._angleMode === constants.RADIANS) {
            return Math.atan(ratio);
        } else {
            return polarGeometry.radiansToDegrees(Math.atan(ratio));
        }
    };
    p5.prototype.atan2 = function (y, x) {
        if (this._angleMode === constants.RADIANS) {
            return Math.atan2(y, x);
        } else {
            return polarGeometry.radiansToDegrees(Math.atan2(y, x));
        }
    };
    p5.prototype.cos = function (angle) {
        if (this._angleMode === constants.RADIANS) {
            return Math.cos(angle);
        } else {
            return Math.cos(this.radians(angle));
        }
    };
    p5.prototype.sin = function (angle) {
        if (this._angleMode === constants.RADIANS) {
            return Math.sin(angle);
        } else {
            return Math.sin(this.radians(angle));
        }
    };
    p5.prototype.tan = function (angle) {
        if (this._angleMode === constants.RADIANS) {
            return Math.tan(angle);
        } else {
            return Math.tan(this.radians(angle));
        }
    };
    p5.prototype.degrees = function (angle) {
        return polarGeometry.radiansToDegrees(angle);
    };
    p5.prototype.radians = function (angle) {
        return polarGeometry.degreesToRadians(angle);
    };
    p5.prototype.angleMode = function (mode) {
        if (mode === constants.DEGREES || mode === constants.RADIANS) {
            this._angleMode = mode;
        }
    };
    return p5;
})({}, core, polargeometry, constants);
var outputfiles = (function (require, core) {
    "use strict";
    var p5 = core;
    p5.prototype.pWriters = [];
    p5.prototype.beginRaw = function () {
        throw "not yet implemented";
    };
    p5.prototype.beginRecord = function () {
        throw "not yet implemented";
    };
    p5.prototype.createOutput = function () {
        throw "not yet implemented";
    };
    p5.prototype.createWriter = function (name) {
        if (this.pWriters.indexOf(name) === -1) {
            this.pWriters.name = new this.PrintWriter(name);
        }
    };
    p5.prototype.endRaw = function () {
        throw "not yet implemented";
    };
    p5.prototype.endRecord = function () {
        throw "not yet implemented";
    };
    p5.prototype.escape = function (content) {
        return content;
    };
    p5.prototype.PrintWriter = function (name) {
        this.name = name;
        this.content = "";
        this.print = function (data) {
            this.content += data;
        };
        this.println = function (data) {
            this.content += data + "\n";
        };
        this.flush = function () {
            this.content = "";
        };
        this.close = function () {
            this.writeFile(this.content);
        };
    };
    p5.prototype.saveBytes = function () {
        throw "not yet implemented";
    };
    p5.prototype.getFrame = function (mime = 'image/png', quality) {
        return this.canvas.toBuffer(mime, quality);
    };
    p5.prototype.saveFrame = function (path, mime, quality) {
        if (!path) throw "The path in the first parameter of saveFrame(path, mime, quality) cannot be empty";
        fs.writeFileSync(path, this.getFrame(mime, quality));
    };
    p5.prototype.saveVideo = function (path, frames, format) {
        if (!path) throw "The path in the first parameter of saveVideo cannot be empty";
        if (!frames || !Array.isArray(frames)) throw "Frames in the second parameter of saveVideo must be an array containing image buffers.";
        if (!format) throw "Format of frames in the third parameter of saveVideo cannot be empty.";
        
        // Create unique temp folder
        const tempFolder = 'p5_frames_' + Date.now();
        if (!fs.existsSync(tempFolder)) {
            fs.mkdirSync(tempFolder);
        }
        
        try {
            // Save all frames to temp folder
            frames.forEach((frame, i) => {
                const framePath = `${tempFolder}/frame_${i.toString().padStart(4, '0')}.${format}`;
                fs.writeFileSync(framePath, frame);
            });
            
            // Export to video using ffmpeg
            execSync(`ffmpeg -framerate ${this._targetFrameRate} -i ${tempFolder}/frame_%04d.${format} -c:v libx264 -pix_fmt yuv420p ${path} -y`, { stdio: 'ignore' });
        } catch (error) {
            throw error; // Re-throw error setelah cleanup
        } finally {
            // Clean up temp folder (baik sukses maupun error)
            fs.rmSync(tempFolder, { recursive: true, force: true });
        }
    };
    p5.prototype.saveJSONArray = function () {
        throw "not yet implemented";
    };
    p5.prototype.saveJSONObject = function () {
        throw "not yet implemented";
    };
    p5.prototype.saveStream = function () {
        throw "not yet implemented";
    };
    p5.prototype.saveStrings = function (list) {
        this.writeFile(list.join("\n"));
    };
    p5.prototype.saveXML = function () {
        throw "not yet implemented";
    };
    p5.prototype.selectOutput = function () {
        throw "not yet implemented";
    };
    return p5;
})({}, core);
var outputimage = (function (require, core) {
    "use strict";
    var p5 = core;
    p5.prototype.save = function () {
        window.open(this._curElement.elt.toDataURL("image/png"));
    };
    return p5;
})({}, core);
var outputtext_area = (function (require, core) {
    "use strict";
    var p5 = core;
    if (window.console && console.log) {
        p5.prototype.print = console.log.bind(console);
    } else {
        p5.prototype.print = function () {};
    }
    p5.prototype.println = p5.prototype.print;
    return p5;
})({}, core);
var renderingrendering = (function (require, core, constants) {
    var p5 = core;
    var constants = constants;
    p5.prototype.createCanvas = function (w, h, isDefault) {
        var c;
        if (isDefault) {
            c = document.createElement("canvas");
            c.id = "defaultCanvas";
            this._elements.push(c);
        } else {
            c = document.getElementById("defaultCanvas");
            if (c) {
                c.id = "";
            } else {
                var warn = "Warning: createCanvas more than once NOT recommended.";
                warn += " Very unpredictable behavior may result.";
                console.log(warn);
            }
        }
        c.width = w * this._pixelDensity;
        c.height = h * this._pixelDensity;
        //c.setAttribute("style", "width:" + w + "px !important; height:" + h + "px !important;");
        if (!this._setupDone) {
            c.className += " p5_hidden";
            //c.style?.visibility = "hidden";
        }
        if (this._userNode) {
            //this._userNode.appendChild(c);
        } else {
            //document.body.appendChild(c);
        }
        var elt = new p5.Graphics(c, this);
        this.scale(this._pixelDensity, this._pixelDensity);
        return elt;
    };
    p5.prototype.createGraphics = function (w, h) {
        var c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        //document.body.appendChild(c);
        this._elements.push(c);
        var elt = new p5.Graphics(c);
        for (var p in p5.prototype) {
            if (!elt.hasOwnProperty(p)) {
                if (typeof p5.prototype[p] === "function") {
                    elt[p] = p5.prototype[p].bind(elt);
                } else {
                    elt[p] = p5.prototype[p];
                }
            }
        }
        return elt;
    };
    p5.prototype.blendMode = function (mode) {
        if (
            mode === constants.BLEND ||
            mode === constants.DARKEST ||
            mode === constants.LIGHTEST ||
            mode === constants.DIFFERENCE ||
            mode === constants.MULTIPLY ||
            mode === constants.EXCLUSION ||
            mode === constants.SCREEN ||
            mode === constants.REPLACE ||
            mode === constants.OVERLAY ||
            mode === constants.HARD_LIGHT ||
            mode === constants.SOFT_LIGHT ||
            mode === constants.DODGE ||
            mode === constants.BURN
        ) {
            this.canvas.getContext("2d").globalCompositeOperation = mode;
        } else {
            throw new Error("Mode " + mode + " not recognized.");
        }
    };
    return p5;
})({}, core, constants);
var shape2d_primitives = (function (require, core, canvas, constants) {
    "use strict";
    var p5 = core;
    var canvas = canvas;
    var constants = constants;
    p5.prototype.arc = function (x, y, width, height, start, stop, mode) {
        var ctx = this.canvas.getContext("2d");
        var vals = canvas.arcModeAdjust(x, y, width, height, this._ellipseMode);
        var radius = vals.h > vals.w ? vals.h / 2 : vals.w / 2,
            xScale = vals.h > vals.w ? vals.w / vals.h : 1,
            yScale = vals.h > vals.w ? 1 : vals.h / vals.w;
        ctx.scale(xScale, yScale);
        ctx.beginPath();
        ctx.arc(vals.x, vals.y, radius, start, stop);
        ctx.stroke();
        if (mode === constants.CHORD || mode === constants.OPEN) {
            ctx.closePath();
        } else if (mode === constants.PIE || mode === undefined) {
            ctx.lineTo(vals.x, vals.y);
            ctx.closePath();
        }
        ctx.fill();
        if (mode !== constants.OPEN && mode !== undefined) {
            ctx.stroke();
        }
        return this;
    };
    p5.prototype.circle = function (x, y, r) {
        var ctx = this.canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        return this;
    };
    p5.prototype.ellipse = function (x, y, width, height) {
        var ctx = this.canvas.getContext("2d");
        ctx.beginPath();
        ctx.ellipse(x, y, width/2, (height??width)/2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        return this;
    };
    p5.prototype.line = function (x1, y1, x2, y2) {
        var ctx = this.canvas.getContext("2d");
        if (ctx.strokeStyle === "rgba(0,0,0,0)") {
            return;
        }
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        return this;
    };
    p5.prototype.point = function (x, y) {
        var ctx = this.canvas.getContext("2d");
        var s = ctx.strokeStyle;
        var f = ctx.fillStyle;
        if (s === "rgba(0,0,0,0)") {
            return;
        }
        x = Math.round(x);
        y = Math.round(y);
        ctx.fillStyle = s;
        if (ctx.lineWidth > 1) {
            ctx.beginPath();
            ctx.arc(x, y, ctx.lineWidth / 2, 0, constants.TWO_PI, false);
            ctx.fill();
        } else {
            ctx.fillRect(x, y, 1, 1);
        }
        ctx.fillStyle = f;
        return this;
    };
    p5.prototype.quad = function (x1, y1, x2, y2, x3, y3, x4, y4) {
        var ctx = this.canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.lineTo(x4, y4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        return this;
    };
    p5.prototype.rect = function (a, b, c, d) {
        var vals = canvas.modeAdjust(a, b, c, d, this._rectMode);
        var ctx = this.canvas.getContext("2d");
        ctx.beginPath();
        ctx.rect(vals.x, vals.y, vals.w, vals.h);
        ctx.fill();
        ctx.stroke();
        return this;
    };
    p5.prototype.triangle = function (x1, y1, x2, y2, x3, y3) {
        var ctx = this.canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        return this;
    };
    return p5;
})({}, core, canvas, constants);
var shapeattributes = (function (require, core, constants) {
    "use strict";
    var p5 = core;
    var constants = constants;
    p5.prototype._rectMode = constants.CORNER;
    p5.prototype._ellipseMode = constants.CENTER;
    p5.prototype.ellipseMode = function (m) {
        if (m === constants.CORNER || m === constants.CORNERS || m === constants.RADIUS || m === constants.CENTER) {
            this._ellipseMode = m;
        }
        return this;
    };
    p5.prototype.noSmooth = function () {
        this.canvas.getContext("2d").mozImageSmoothingEnabled = false;
        this.canvas.getContext("2d").webkitImageSmoothingEnabled = false;
        return this;
    };
    p5.prototype.rectMode = function (m) {
        if (m === constants.CORNER || m === constants.CORNERS || m === constants.RADIUS || m === constants.CENTER) {
            this._rectMode = m;
        }
        return this;
    };
    p5.prototype.smooth = function () {
        this.canvas.getContext("2d").mozImageSmoothingEnabled = true;
        this.canvas.getContext("2d").webkitImageSmoothingEnabled = true;
        return this;
    };
    p5.prototype.strokeCap = function (cap) {
        if (cap === constants.ROUND || cap === constants.SQUARE || cap === constants.PROJECT) {
            this.canvas.getContext("2d").lineCap = cap;
        }
        return this;
    };
    p5.prototype.strokeJoin = function (join) {
        if (join === constants.ROUND || join === constants.BEVEL || join === constants.MITER) {
            this.canvas.getContext("2d").lineJoin = join;
        }
        return this;
    };
    p5.prototype.strokeWeight = function (w) {
        if (typeof w === "undefined" || w === 0) {
            this.canvas.getContext("2d").lineWidth = 0.0001;
        } else {
            this.canvas.getContext("2d").lineWidth = w;
        }
        return this;
    };
    return p5;
})({}, core, constants);
var shapecurves = (function (require, core) {
    "use strict";
    var p5 = core;
    p5.prototype._bezierDetail = 20;
    p5.prototype._curveDetail = 20;
    p5.prototype.bezier = function (x1, y1, x2, y2, x3, y3, x4, y4) {
        var ctx = this.canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        for (var i = 0; i <= this._bezierDetail; i++) {
            var t = i / parseFloat(this._bezierDetail);
            var x = p5.prototype.bezierPoint(x1, x2, x3, x4, t);
            var y = p5.prototype.bezierPoint(y1, y2, y3, y4, t);
            ctx.lineTo(x, y);
        }
        ctx.stroke();
        return this;
    };
    p5.prototype.bezierDetail = function (d) {
        this._setProperty("_bezierDetail", d);
        return this;
    };
    p5.prototype.bezierPoint = function (a, b, c, d, t) {
        var adjustedT = 1 - t;
        return Math.pow(adjustedT, 3) * a + 3 * Math.pow(adjustedT, 2) * t * b + 3 * adjustedT * Math.pow(t, 2) * c + Math.pow(t, 3) * d;
    };
    p5.prototype.bezierTangent = function (a, b, c, d, t) {
        var adjustedT = 1 - t;
        return 3 * d * Math.pow(t, 2) - 3 * c * Math.pow(t, 2) + 6 * c * adjustedT * t - 6 * b * adjustedT * t + 3 * b * Math.pow(adjustedT, 2) - 3 * a * Math.pow(adjustedT, 2);
    };
    p5.prototype.curve = function (x1, y1, x2, y2, x3, y3, x4, y4) {
        var ctx = this.canvas.getContext("2d");
        ctx.moveTo(x1, y1);
        ctx.beginPath();
        for (var i = 0; i <= this._curveDetail; i++) {
            var t = parseFloat(i / this._curveDetail);
            var x = p5.prototype.curvePoint(x1, x2, x3, x4, t);
            var y = p5.prototype.curvePoint(y1, y2, y3, y4, t);
            ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.closePath();
        return this;
    };
    p5.prototype.curveDetail = function (d) {
        this._setProperty("_curveDetail", d);
        return this;
    };
    p5.prototype.curvePoint = function (a, b, c, d, t) {
        var t3 = t * t * t,
            t2 = t * t,
            f1 = -0.5 * t3 + t2 - 0.5 * t,
            f2 = 1.5 * t3 - 2.5 * t2 + 1,
            f3 = -1.5 * t3 + 2 * t2 + 0.5 * t,
            f4 = 0.5 * t3 - 0.5 * t2;
        return a * f1 + b * f2 + c * f3 + d * f4;
    };
    p5.prototype.curveTangent = function (a, b, c, d, t) {
        var t2 = t * t,
            f1 = (-3 * t2) / 2 + 2 * t - 0.5,
            f2 = (9 * t2) / 2 - 5 * t,
            f3 = (-9 * t2) / 2 + 4 * t + 0.5,
            f4 = (3 * t2) / 2 - t;
        return a * f1 + b * f2 + c * f3 + d * f4;
    };
    p5.prototype.curveTightness = function () {
        throw "not yet implemented";
    };
    return p5;
})({}, core);
var shapevertex = (function (require, core, constants) {
    "use strict";
    var p5 = core;
    var constants = constants;
    p5.prototype._shapeKind = null;
    p5.prototype._shapeInited = false;
    p5.prototype._contourInited = false;
    p5.prototype._contourVertices = [];
    p5.prototype._curveVertices = [];
    p5.prototype.beginContour = function () {
        this._contourVertices = [];
        this._contourInited = true;
        return this;
    };
    p5.prototype.beginShape = function (kind) {
        if (kind === constants.POINTS || kind === constants.LINES || kind === constants.TRIANGLES || kind === constants.TRIANGLE_FAN || kind === constants.TRIANGLE_STRIP || kind === constants.QUADS || kind === constants.QUAD_STRIP) {
            this._shapeKind = kind;
        } else {
            this._shapeKind = null;
        }
        this._shapeInited = true;
        this.canvas.getContext("2d").beginPath();
        return this;
    };
    p5.prototype.bezierVertex = function (x2, y2, x3, y3, x4, y4) {
        if (this._contourInited) {
            var pt = {};
            pt.x = x2;
            pt.y = y2;
            pt.x3 = x3;
            pt.y3 = y3;
            pt.x4 = x4;
            pt.y4 = y4;
            pt.type = constants.BEZIER;
            this._contourVertices.push(pt);
            return this;
        }
        this.canvas.getContext("2d").bezierCurveTo(x2, y2, x3, y3, x4, y4);
        return this;
    };
    p5.prototype.curveVertex = function (x, y) {
        var pt = {};
        pt.x = x;
        pt.y = y;
        this._curveVertices.push(pt);
        if (this._curveVertices.length >= 4) {
            this.curve(this._curveVertices[0].x, this._curveVertices[0].y, this._curveVertices[1].x, this._curveVertices[1].y, this._curveVertices[2].x, this._curveVertices[2].y, this._curveVertices[3].x, this._curveVertices[3].y);
            this._curveVertices.shift();
        }
        return this;
    };
    p5.prototype.endContour = function () {
        this._contourVertices.reverse();
        this.canvas.getContext("2d").moveTo(this._contourVertices[0].x, this._contourVertices[0].y);
        var ctx = this.canvas.getContext("2d");
        this._contourVertices.slice(1).forEach(function (pt, i) {
            switch (pt.type) {
                case constants.LINEAR:
                    ctx.lineTo(pt.x, pt.y);
                    break;
                case constants.QUADRATIC:
                    ctx.quadraticCurveTo(pt.x, pt.y, pt.x3, pt.y3);
                    break;
                case constants.BEZIER:
                    ctx.bezierCurveTo(pt.x, pt.y, pt.x3, pt.y3, pt.x4, pt.y4);
                    break;
                case constants.CURVE:
                    break;
            }
        });
        this.canvas.getContext("2d").closePath();
        this._contourInited = false;
        return this;
    };
    p5.prototype.endShape = function (mode) {
        if (mode === constants.CLOSE) {
            this.canvas.getContext("2d").closePath();
            this.canvas.getContext("2d").fill();
        }
        if (this._curveVertices.length <= 0) {
            this.canvas.getContext("2d").stroke();
        } else {
            this._curveVertices = [];
        }
        return this;
    };
    p5.prototype.quadraticVertex = function (cx, cy, x3, y3) {
        if (this._contourInited) {
            var pt = {};
            pt.x = cx;
            pt.y = cy;
            pt.x3 = x3;
            pt.y3 = y3;
            pt.type = constants.QUADRATIC;
            this._contourVertices.push(pt);
            return this;
        }
        this.canvas.getContext("2d").quadraticCurveTo(cx, cy, x3, y3);
        return this;
    };
    p5.prototype.vertex = function (x, y) {
        if (this._contourInited) {
            var pt = {};
            pt.x = x;
            pt.y = y;
            pt.type = constants.LINEAR;
            this._contourVertices.push(pt);
            return this;
        }
        if (this._shapeInited) {
            this.canvas.getContext("2d").moveTo(x, y);
        } else {
            this.canvas.getContext("2d").lineTo(x, y);
        }
        this._shapeInited = false;
        return this;
    };
    return p5;
})({}, core, constants);
var structure = (function (require, core) {
    "use strict";
    var p5 = core;
    p5.prototype.exit = function () {
        throw "exit() not implemented, see remove()";
    };
    p5.prototype.noLoop = function () {
        this._loop = false;
        if (this._drawInterval) {
            clearInterval(this._drawInterval);
        }
    };
    p5.prototype.loop = function () {
        this._loop = true;
        this._draw();
    };
    p5.prototype.push = function () {
        var ctx = this.canvas.getContext("2d");
        ctx.save();
        this.styles.push({
            fillStyle: ctx.fillStyle,
            strokeStyle: ctx.strokeStyle,
            lineWidth: ctx.lineWidth,
            lineCap: ctx.lineCap,
            lineJoin: ctx.lineJoin,
            tint: this._tint,
            imageMode: this._imageMode,
            rectMode: this._rectMode,
            ellipseMode: this._ellipseMode,
            colorMode: this._colorMode,
            textAlign: ctx.textAlign,
            textFont: this.textFont,
            textLeading: this.textLeading,
            textSize: this.textSize,
            textStyle: this.textStyle,
        });
    };
    p5.prototype.pop = function () {
        var ctx = this.canvas.getContext("2d");
        ctx.restore();
        var lastS = this.styles.pop();
        ctx.fillStyle = lastS.fillStyle;
        ctx.strokeStyle = lastS.strokeStyle;
        ctx.lineWidth = lastS.lineWidth;
        ctx.lineCap = lastS.lineCap;
        ctx.lineJoin = lastS.lineJoin;
        this._tint = lastS.tint;
        this._imageMode = lastS.imageMode;
        this._rectMode = lastS.rectMode;
        this._ellipseMode = lastS.ellipseMode;
        this._colorMode = lastS.colorMode;
        ctx.textAlign = lastS.textAlign;
        this.textFont = lastS.textFont;
        this.textLeading = lastS.textLeading;
        this.textSize = lastS.textSize;
        this.textStyle = lastS.textStyle;
    };
    p5.prototype.pushStyle = function () {
        throw new Error("pushStyle() not used, see push()");
    };
    p5.prototype.popStyle = function () {
        throw new Error("popStyle() not used, see pop()");
    };
    p5.prototype.redraw = function () {
        var context = this._isGlobal ? window : this;
        if (context.draw) {
            context.draw();
        }
    };
    p5.prototype.size = function () {
        throw "size() not implemented, see createCanvas()";
    };
    return p5;
})({}, core);
var transform = (function (require, core, constants, outputtext_area) {
    "use strict";
    var p5 = core;
    var constants = constants;
    p5.prototype._matrices = [[1, 0, 0, 1, 0, 0]];
    p5.prototype.applyMatrix = function (n00, n01, n02, n10, n11, n12) {
        this.canvas.getContext("2d").transform(n00, n01, n02, n10, n11, n12);
        var m = this._matrices[this._matrices.length - 1];
        m = multiplyMatrix(m, [n00, n01, n02, n10, n11, n12]);
        return this;
    };
    p5.prototype.popMatrix = function () {
        throw new Error("popMatrix() not used, see pop()");
    };
    p5.prototype.printMatrix = function () {
        throw new Error("printMatrix() not implemented");
    };
    p5.prototype.pushMatrix = function () {
        throw new Error("pushMatrix() not used, see push()");
    };
    p5.prototype.resetMatrix = function () {
        this.canvas.getContext("2d").setTransform();
        this._matrices[this._matrices.length - 1] = [1, 0, 0, 1, 0, 0];
        return this;
    };
    p5.prototype.rotate = function (r) {
        if (this._angleMode === constants.DEGREES) {
            r = this.radians(r);
        }
        this.canvas.getContext("2d").rotate(r);
        var m = this._matrices[this._matrices.length - 1];
        var c = Math.cos(r);
        var s = Math.sin(r);
        var m11 = m[0] * c + m[2] * s;
        var m12 = m[1] * c + m[3] * s;
        var m21 = m[0] * -s + m[2] * c;
        var m22 = m[1] * -s + m[3] * c;
        m[0] = m11;
        m[1] = m12;
        m[2] = m21;
        m[3] = m22;
        return this;
    };
    p5.prototype.rotateX = function () {
        throw "not yet implemented";
    };
    p5.prototype.rotateY = function () {
        throw "not yet implemented";
    };
    p5.prototype.scale = function () {
        var x = 1,
            y = 1;
        if (arguments.length === 1) {
            x = y = arguments[0];
        } else {
            x = arguments[0];
            y = arguments[1];
        }
        this.canvas.getContext("2d").scale(x, y);
        var m = this._matrices[this._matrices.length - 1];
        m[0] *= x;
        m[1] *= x;
        m[2] *= y;
        m[3] *= y;
        return this;
    };
    p5.prototype.shearX = function (angle) {
        if (this._angleMode === constants.DEGREES) {
            angle = this.radians(angle);
        }
        this.canvas.getContext("2d").transform(1, 0, this.tan(angle), 1, 0, 0);
        var m = this._matrices[this._matrices.length - 1];
        m = multiplyMatrix(m, [1, 0, this.tan(angle), 1, 0, 0]);
        return this;
    };
    p5.prototype.shearY = function (angle) {
        if (this._angleMode === constants.DEGREES) {
            angle = this.radians(angle);
        }
        this.canvas.getContext("2d").transform(1, this.tan(angle), 0, 1, 0, 0);
        var m = this._matrices[this._matrices.length - 1];
        m = multiplyMatrix(m, [1, this.tan(angle), 0, 1, 0, 0]);
        return this;
    };
    p5.prototype.translate = function (x, y) {
        this.canvas.getContext("2d").translate(x, y);
        var m = this._matrices[this._matrices.length - 1];
        m[4] += m[0] * x + m[2] * y;
        m[5] += m[1] * x + m[3] * y;
        return this;
    };
    function multiplyMatrix(m1, m2) {
        var result = [];
        var m1Length = m1.length;
        var m2Length = m2.length;
        var m10Length = m1[0].length;
        for (var j = 0; j < m2Length; j++) {
            result[j] = [];
            for (var k = 0; k < m10Length; k++) {
                var sum = 0;
                for (var i = 0; i < m1Length; i++) {
                    sum += m1[i][k] * m2[j][i];
                }
                result[j].push(sum);
            }
        }
        return result;
    }
    return p5;
})({}, core, constants, outputtext_area);
var typographyattributes = (function (require, core, constants) {
    "use strict";
    var p5 = core;
    var constants = constants;
    p5.prototype._textLeading = 15;
    p5.prototype._textFont = "sans-serif";
    p5.prototype._textSize = 12;
    p5.prototype._textStyle = constants.NORMAL;
    p5.prototype.textAlign = function (a) {
        if (a === constants.LEFT || a === constants.RIGHT || a === constants.CENTER) {
            this.canvas.getContext("2d").textAlign = a;
        }
    };
    p5.prototype.textHeight = function (s) {
        return this.canvas.getContext("2d").measureText(s).height;
    };
    p5.prototype.textLeading = function (l) {
        this._setProperty("_textLeading", l);
    };
    p5.prototype.textSize = function (s) {
        this._setProperty("_textSize", s);
    };
    p5.prototype.textStyle = function (s) {
        if (s === constants.NORMAL || s === constants.ITALIC || s === constants.BOLD) {
            this._setProperty("_textStyle", s);
        }
    };
    p5.prototype.textWidth = function (s) {
        return this.canvas.getContext("2d").measureText(s).width;
    };
    return p5;
})({}, core, constants);
var typographyloading_displaying = (function (require, core, canvas) {
    "use strict";
    var p5 = core;
    var canvas = canvas;
    p5.prototype.text = function () {
        this.canvas.getContext("2d").font = this._textStyle + " " + this._textSize + "px " + this._textFont;
        if (arguments.length === 3) {
            this.canvas.getContext("2d").fillText(arguments[0], arguments[1], arguments[2]);
            this.canvas.getContext("2d").strokeText(arguments[0], arguments[1], arguments[2]);
        } else if (arguments.length === 5) {
            var words = arguments[0].split(" ");
            var line = "";
            var vals = canvas.modeAdjust(arguments[1], arguments[2], arguments[3], arguments[4], this._rectMode);
            vals.y += this._textLeading;
            for (var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + " ";
                var metrics = this.canvas.getContext("2d").measureText(testLine);
                var testWidth = metrics.width;
                if (vals.y > vals.h) {
                    break;
                } else if (testWidth > vals.w && n > 0) {
                    this.canvas.getContext("2d").fillText(line, vals.x, vals.y);
                    this.canvas.getContext("2d").strokeText(line, vals.x, vals.y);
                    line = words[n] + " ";
                    vals.y += this._textLeading;
                } else {
                    line = testLine;
                }
            }
            if (vals.y <= vals.h) {
                this.canvas.getContext("2d").fillText(line, vals.x, vals.y);
                this.canvas.getContext("2d").strokeText(line, vals.x, vals.y);
            }
        }
    };
    p5.prototype.textFont = function (str) {
        this._setProperty("_textFont", str);
    };
    return p5;
})({}, core, canvas);

module.exports = core;