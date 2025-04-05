const p5 = require('./p5');

new p5((p) => {
  let clouds = [];
  let sunPulse = 0;
  let rippleSize = 0;
  let trees = [];
  let frames = [];
  
  p.setup = function() {
    p.createCanvas(1000, 700);
    p.frameRate(30);
    // Inisialisasi awan
    for (let i = 0; i < 5; i++) {
      clouds.push({
        x: p.random(-200, p.width),
        y: p.random(50, 200),
        size: p.random(30, 50),
        speed: p.random(0.5, 1.5)
      });
    }
    
    // Inisialisasi pohon
    const treePositions = [
      [100, 500, 120], [250, 520, 100], [300, 510, 140],
      [600, 500, 110], [200, 520, 90], [750, 515, 130],
      [850, 525, 80], [900, 500, 100]
    ];
    
    trees = treePositions.map(pos => ({
      x: pos[0],
      y: pos[1],
      height: pos[2],
      sway: p.random(0, p.TWO_PI),
      swaySpeed: p.random(0.02, 0.06),
      swayAmount: p.random(3, 6),
      swayMove: '.'.repeat(10).split('').map(_=>p.random(-1, 1))
    }));
  };

  p.draw = function() {
    // Animasi pulsa matahari
    sunPulse = p.sin(p.frameCount * 0.05) * 5;
    rippleSize += 0.05;
    if (rippleSize > p.TWO_PI) rippleSize = 0;
    
    // Langit gradien
    drawSkyGradient();
    
    // Matahari dengan efek animasi
    drawAnimatedSun();
    
    // Awan bergerak
    drawMovingClouds();
    
    // Gunung statis
    drawMountains();
    
    // Tanah
    p.fill('#7CB342');
    p.noStroke();
    p.rect(0, p.height * 0.6, p.width, p.height * 0.4);
    
    // Danau dengan ripple animasi
    drawAnimatedLake();
    
    // Jalan
    drawPath();
    
    // Pohon dengan animasi goyang
    drawSwayingTrees();
    
    // Signature
    p.fill('#000000');
    p.textSize(20);
    p.text("Animated Landscape with p5.js", 20, p.height - 20);
    frames.push(p.getFrame('image/jpeg'));
    console.log(p.frameCount);
    if (p.frameCount === 120) {
      p.noLoop();
      p.saveVideo('Landscape.mp4', frames, 'jpeg');
      process.exit();
    }
  };

  function drawSkyGradient() {
    // Langit gradien sederhana dengan dua warna
    const skyGradient = p.ctx.createLinearGradient(0, 0, 0, p.height * 0.6);
    skyGradient.addColorStop(0, '#1E88E5');
    skyGradient.addColorStop(1, '#BBDEFB');
    
    p.ctx.fillStyle = skyGradient;
    p.ctx.fillRect(0, 0, p.width, p.height * 0.6);
  }

  function drawAnimatedSun() {
    // Efek glow matahari
    for (let i = 5; i > 0; i--) {
      let alpha = i * 0.1;
      let size = 80 + (5 - i) * 20 + sunPulse;
      p.fill(255, 235, 59, alpha * 255);
      p.noStroke();
      p.circle(200, 150, size);
    }
    
    // Matahari utama
    p.fill('#FFEB3B');
    p.noStroke();
    p.circle(200, 150, 80 + sunPulse);
    
    // Sinar matahari berputar
    p.stroke(255, 235, 59, 100);
    p.strokeWeight(4);
    for (let i = 0; i < 24; i++) {
      let angle = (i / 12) * p.PI + p.frameCount * 0.01;
      let length = i % 2 === 0 ? 120 : 90;
      let x1 = 200 + p.cos(angle) * 85;
      let y1 = 150 + p.sin(angle) * 85;
      let x2 = 200 + p.cos(angle) * length;
      let y2 = 150 + p.sin(angle) * length;
      p.line(x1, y1, x2, y2);
    }
  }

  function drawMovingClouds() {
    p.noStroke();
    clouds.forEach(cloud => {
      cloud.x += cloud.speed;
      if (cloud.x > p.width + 200) cloud.x = -200;
      
      p.fill(255, 255, 255, 200);
      p.circle(cloud.x, cloud.y, cloud.size);
      p.circle(cloud.x + cloud.size * 0.8, cloud.y - cloud.size * 0.2, cloud.size * 0.8);
      p.circle(cloud.x + cloud.size * 1.6, cloud.y, cloud.size * 0.7);
      p.circle(cloud.x + cloud.size * 1.8, cloud.y + cloud.size * 0.4, cloud.size * 0.6);
      p.circle(cloud.x + cloud.size * 1.2, cloud.y + cloud.size * 0.6, cloud.size * 0.7);
      p.circle(cloud.x + cloud.size * 0.4, cloud.y + cloud.size * 0.4, cloud.size * 0.7);
    });
  }

  function drawMountains() {
    // Gunung dengan warna berbeda
    p.fill('#5D4037');
    p.noStroke();
    p.triangle(0, p.height * 0.6, 250, 120, 500, p.height * 0.6);
    
    p.fill('#4E342E');
    p.triangle(300, p.height * 0.6, 550, 180, 800, p.height * 0.6);
    
    p.fill('#3E2723');
    p.triangle(600, p.height * 0.6, 850, 220, p.width, p.height * 0.6);
  }

  function drawAnimatedLake() {
    // Danau utama
    p.fill('#1976D2');
    p.noStroke();
    p.ellipse(p.width * 0.7, p.height * 0.65, p.width * 0.3, p.height * 0.08);
    
    // Efek ripple animasi
    p.stroke(255, 255, 255, 100);
    p.strokeWeight(1.5);
    p.noFill();
    for (let i = 1; i <= 4; i++) {
      let sizeFactor = i * 0.02 + p.sin(rippleSize + i) * 0.05;
      p.ellipse(p.width * 0.7, p.height * 0.65, 
               p.width * (0.2 + sizeFactor), 
               p.height * (0.05 + sizeFactor * 0.25));
    }
  }

  function drawSwayingTrees() {
    trees.forEach(tree => {
      tree.sway += tree.swaySpeed;
      let swayOffset = p.sin(tree.sway) * tree.swayAmount;
      
      // Batang pohon
      p.fill('#8B4513');
      p.noStroke();
      p.rect(tree.x - tree.height * 0.1 + swayOffset * 0.3, 
             tree.y - tree.height * 0.6, 
             tree.height * 0.2, 
             tree.height * 0.6);
      
      // Daun pohon
      let leafSize = tree.height * 0.3;
      p.fill('#2E8B57dd');
      p.circle(tree.x + swayOffset * tree.swayMove[0], tree.y - tree.height * 0.8 + swayOffset * tree.swayMove[1], leafSize);
      p.circle(tree.x + leafSize * 0.8 + swayOffset * tree.swayMove[2], tree.y - tree.height * 0.9 + swayOffset * tree.swayMove[3], leafSize * 0.8);
      p.circle(tree.x + leafSize * 1.2 + swayOffset * tree.swayMove[4], tree.y - tree.height * 0.7 + swayOffset * tree.swayMove[5], leafSize * 0.7);
      p.circle(tree.x + leafSize * 0.3 + swayOffset * tree.swayMove[6], tree.y - tree.height * 1.1 + swayOffset * tree.swayMove[7], leafSize * 0.9);
      p.circle(tree.x - leafSize * 0.5 + swayOffset * tree.swayMove[8], tree.y - tree.height * 0.9 + swayOffset * tree.swayMove[9], leafSize * 0.8);
    });
  }

  function drawPath() {
    // Jalan utama
    p.fill('#6D4C41');
    p.noStroke();
    p.beginShape();
    p.vertex(p.width * 0.3, p.height);
    p.vertex(p.width * 0.4, p.height * 0.6);
    p.vertex(p.width * 0.6, p.height * 0.6);
    p.vertex(p.width * 0.7, p.height);
    p.endShape(p.CLOSE);
    
    // Garis jalan animasi
    p.stroke(255, 255, 255, 150 + p.sin(p.frameCount * 0.1) * 105);
    p.strokeWeight(4);
    p.ctx.setLineDash([25, 20]);
    p.line(p.width * 0.5, p.height * 0.65, p.width * 0.5, p.height * 0.95);
    p.ctx.setLineDash([]);
  }
}).start();
