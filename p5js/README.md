# P5.js Node.js Documentation

A guide for using p5.js in Node.js environment to generate images or process graphics without a browser.

## Table of Contents
- [Installation](#installation)
- [Basic Usage](#basic-usage)
  - [Simple Setup](#simple-setup)
  - [With Preload](#with-preload)
  - [Using Instance Mode](#using-instance-mode)
- [Advanced Examples](#advanced-examples)
  - [Animation](#animation)
  - [Multiple Sketches](#multiple-sketches)
- [API Notes](#api-notes)

## Installation

First, install skia for Node.js:

```bash
npm install @napi-rs/canvas-android-arm64
```

Import a local p5.js file:

```javascript
const p5 = require('./p5.js');
```

## Basic Usage

### Simple Setup

The most basic sketch with just setup and draw:

```javascript
const p5 = require('./p5');

function setup() {
  createCanvas(400, 400);
  fill(255, 0, 0);
  ellipse(200, 200, 100, 100);
  saveFrame('simple_circle.png', 'image/png');
  process.exit();
}

function draw() {
  // Not used in this static example
}

global.setup = setup;
global.draw = draw;

new p5().start();
```

### With Preload

Loading assets before the sketch runs:

```javascript
const p5 = require('./p5');

let elaina;

function preload() {
  elaina = loadImage('./images.jpeg');
}

function setup() {
  createCanvas(800, 600);
}

function draw() {
  background(0);
  fill(200, 0, 0);
  rect(20, 200, 200, 100);
  image(elaina, 100, 100, 300, 300);
  saveFrame('output.jpeg', 'image/jpeg');
  noLoop();
  process.exit(0);
}

global.preload = preload;
global.setup = setup;
global.draw = draw;

new p5().start();
```

### Using Instance Mode

Recommended for better code organization and multiple sketches:

```javascript
const p5 = require('./p5');

const sketch = (p) => {
  let img;
  
  p.preload = () => {
    img = p.loadImage('./images.jpeg');
  };

  p.setup = () => {
    p.createCanvas(800, 600);
  };

  p.draw = () => {
    p.background(0);
    p.fill(200, 0, 0);
    p.rect(20, 200, 200, 100);
    p.image(img, 0, 0, 300, 300);
    p.saveCanvas('instance_output', 'jpeg');
    p.noLoop();
    process.exit(0);
  };
};

new p5(sketch);
```

## Advanced Examples

### Animation

Creating an animated sequence saved as frames:

```javascript
const p5 = require('./p5');
const fs = require('fs');
const path = require('path');

const sketch = (p) => {
  let angle = 0;
  let frameCount = 0;
  const outputDir = 'frames';
  
  p.setup = () => {
    p.createCanvas(400, 400);
    p.frameRate(30);
    
    // Create output directory
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
  };

  p.draw = () => {
    p.background(240);
    p.translate(p.width/2, p.height/2);
    p.rotate(angle);
    p.rectMode(p.CENTER);
    p.fill(0, 150, 255);
    p.rect(0, 0, 100, 50);
    
    // Save every frame
    p.saveFrame(path.join(outputDir, `frame_${p.nf(frameCount, 4)}.png`));
    
    angle += 0.1;
    frameCount++;
    
    if (frameCount > 60) { // Stop after 60 frames (~2 seconds)
      p.noLoop();
      console.log('Animation complete!');
      process.exit();
    }
  };
};

new p5(sketch);
```

### Multiple Sketches

Running multiple sketches simultaneously:

```javascript
const p5 = require('./p5');

// First sketch
const sketch1 = (p) => {
  p.setup = () => {
    p.createCanvas(200, 200);
    p.background(255, 0, 0);
    p.saveFrame('red_canvas.png');
    p.noLoop();
  };
};

// Second sketch
const sketch2 = (p) => {
  let img;
  
  p.preload = () => {
    img = p.loadImage('./image.jpg');
  };

  p.setup = () => {
    p.createCanvas(400, 400);
    p.image(img, 0, 0, 400, 400);
    p.saveFrame('image_output.jpeg', 'image/jpeg');
    p.noLoop();
  };
};

// Run both sketches
new p5(sketch1);
new p5(sketch2);
```

## API Notes

1. **Image Saving**:
   - `saveCanvas()` and `saveFrame()` work differently in Node.js than browser
   - Files are saved to your project directory

2. **Exit Handling**:
   - Remember to call `process.exit()` when done or your script won't terminate
   - For animations, exit in the last frame

3. **Performance**:
   - Node.js implementation may be slower than browser for complex graphics
   - Consider using `noLoop()` for static image generation

4. **Limitations**:
   - Some p5.js features that require DOM won't work
   - No interactive events (mouse, keyboard) unless you implement them

For more details, refer to the [p5.js documentation](https://github.com/processing/p5.js/wiki/p5.js-overview#node).

For more reference, refer to the [p5.js reference](https://p5js.org/reference/).
