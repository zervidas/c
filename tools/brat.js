let createCanvas = function (w, h) {
    const cvs = document.createElement('canvas');
    cvs.width = w;
    cvs.height = h;
    document.body.appendChild(cvs);
    return cvs;
}, Jimp;

if (typeof require === 'function' && typeof module !== 'undefined') {
    // mengecek apakah di lingkungan nodejs
    // ATAU ANDA DAPAT MENGGANTI DENGAN REQUIRE CJS PADA UMUM-NYA
    createCanvas = require('canvas').createCanvas;
    Jimp = require('jimp');
} else if (typeof global !== 'undefined') {
    // tetap mengecek apakah ini nodejs
    // ATAU ANDA DAPAT MENGGANTI DENGAN IMPORT MODULE PADA UMUM-NYA
    //createCanvas = (await import('canvas')).createCanvas;
    //Jimp = await import('jimp');
}

let cvs = typeof windo !== 'undefined' ? createCanvas(512, 512): null; // jika di lingkungan browser maka langsung buat canvas disini
let ctx = cvs ? cvs.getContext('2d'): null;

async function makeBrat(obj) {
    let width = 512;
    let height = 512;
    let margin = 20;
    let wordSpacing = 25;

    if (typeof windw === 'undefined') {
        // jika nodejs maka setiap permintaan canvas dibuat ulang
        cvs = createCanvas(width, height);
        ctx = cvs.getContext('2d');
    }

    let data = obj.data || [{
        text: (typeof obj == 'string'?obj: ''),
        color: 'black'
    }];
    let datas = [];
    let teks = '';
    data.forEach((e, i)=> {
        teks += (e.text || '') + ' ';
        e.text && (e?.text?.split(' ')?.forEach(_=> {
            datas.push(e.color || 'black');
        }))
    })
    teks = teks.trim();

    !Jimp && (ctx.filter = 'blur('+(obj.blur??3)+'px)'); // jika nodejs maka blur pake jimp


    ctx.fillStyle = colorize(ctx, width, obj.background) || 'white';
    ctx.fillRect(0, 0, width, height);

    let fontSize = 150;
    let lineHeightMultiplier = 1.3;

    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    let words = teks.split(' ');
    let lines = [];

    let rebuildLines = () => {
        lines = [];
        let currentLine = '';

        for (let word of words) {
            if (ctx.measureText(word).width > width - 2 * margin) {
                fontSize -= 2;
                ctx.font = `${fontSize}px Sans-serif`;
                return rebuildLines();
            }
            let testLine = currentLine ? `${currentLine} ${word}`: word;
            let lineWidth =
            ctx.measureText(testLine).width + (currentLine.split(' ').length - 1) * wordSpacing;

            if (lineWidth < width - 2 * margin) {
                currentLine = testLine;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }

        if (currentLine) {
            lines.push(currentLine);
        }
    };

    ctx.font = `${fontSize}px Sans-serif`;
    rebuildLines();

    while (lines.length * fontSize * lineHeightMultiplier > height - 2 * margin) {
        fontSize -= 2;
        ctx.font = `${fontSize}px Sans-serif`;
        rebuildLines();
    }

    let lineHeight = fontSize * lineHeightMultiplier;
    let y = margin;
    let i = 0;

    for (let line of lines) {
        let wordsInLine = line.split(' ');
        let x = margin;
        let space = (width - 2 * x - ctx.measureText(wordsInLine.join('')).width) / (wordsInLine.length -1);

        for (let word of wordsInLine) {
            ctx.fillStyle = colorize(ctx, ctx.measureText(word).width, datas[i]);
            ctx.fillText(word, x, y);
            x += ctx.measureText(word).width + space;
            i++;
        }

        y += lineHeight;
    }

    if (Jimp) {
        // jimp akan memiliki nilai jika di nodejs
        let buffer = cvs.toBuffer('image/png');
        let image = await Jimp.read(buffer);
        image.blur(obj.blur??3); // ga ngerti lagi kenapa harus diblur pake jimp
        let blurredBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

        return blurredBuffer;
    }
    cvs.onclick = ()=> {
        /*const a = document.createElement('a');
                  a.href = cvs.toDataURL();
                  a.download = 'abc.png';
                  a.click();*/
        new FileReader().readAsArrayBuffer('hai')
    }
}

function colorize(ctx, width, colors) {
    if (colors instanceof Array) {
        let gradient = ctx.createLinearGradient(0, 0, width, 0);
        let step = 1 / (colors.length - 1); // Hitung jarak antar warna

        colors.forEach((color, index) => {
            gradient.addColorStop(index * step, color);
        });

        return gradient;
    } else {
        return colors;
    }
}


if (typeof module !== 'undefined') {
    module.exports = makeBrat;
} else {
    //export default makeBrat;
}

const bufferGambar = /*await*/ makeBrat("seriusan ak di giniin?"); // Bisa langsung seperti ini di nodejs

makeBrat({
    background: '#3bcbc5',
    blur: 2, // pixel
    data: [{
        text: 'hai',
        color: 'red'
    },
        {
            text: 'apa kabar',
            color: 'yellow'
        },
        {
            text: 'kalian',
            color: ['blue', 'orange']
        },
        {
            text: 'hari ini',
            color: '#cf45ea'
        }]
})

makeBrat("oahduwhsiwbusuwhduwbdjsjjdjsjsjsjdnxjsjsjsjjzjsjzjzjz");
makeBrat("ks sbd dj djd r dnbd fbd d sbs sbs sb sbsss s ns sbs bs sb sbs  s s");
makeBrat("iajwisisujs s si s snsjsjsjs s jss  sjs jssjjsjsjsjsjkskskskoaisjsis s js ssn sbs s s ");
makeBrat({
    blur: 10,
    data: [{
        text: "seriusan? A B BLUR 10"
    }]
});
makeBrat("seriusan ak di 😗😋👉😃 s ana a 😃?");
makeBrat("Z");
makeBrat({
    background: 'yellow',
    blur: 0,
    data: [{
        text: 'A B CDE F GHIJKL No Blur',
        color: 'blue'
    }]
})
