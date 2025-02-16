const { v4: uuidv4 } = require('uuid');
const Jimp = require('jimp');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');

const RemoveBG = {
    async request() {
        const clientId = uuidv4();
        const url = 'https://api-int.retoucher.online/api/v4/Request/Create';
        const form = new FormData();
        form.append('clientId', clientId);
        form.append('country', 'ID');
        form.append('timezone', 'GMT+0700');
        const headers = { ...form.getHeaders(), 'accept': 'application/json' };

        const response = await fetch(url, { method: 'POST', headers, body: form });
        if (!response.ok) throw new Error(await response.text());
        return { ...(await response.json()), id: clientId };
    },

    async remove(bufferGambar, session) {
        const url = 'https://api-int.retoucher.online/api/v4/Request/Upload';
        const image = await Jimp.read(bufferGambar);
        const width = image.getWidth();
        const height = image.getHeight();
        const sizeInKB = Math.floor(bufferGambar.length / 1024);

        const form = new FormData();
        form.append('clientId', session.id);
        form.append('country', 'ID');
        form.append('timezone', 'GMT+0700');
        form.append('requestId', session.requestId);
        form.append('size', sizeInKB);
        form.append('width', width.toString());
        form.append('height', height.toString());
        form.append('ratio', (width / height).toFixed(2));
        form.append('processingMethod', 'V1Accelerated');
        form.append('image', bufferGambar, { filename: 'image.jpeg', contentType: 'image/jpeg' });
        const headers = { ...form.getHeaders(), 'accept': 'application/json' };

        const response = await fetch(url, { method: 'POST', headers, body: form });
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();

        return Buffer.from(data.result.split(',')[1], 'base64');
    },

    async render(originalBuffer, maskBuffer) {
        const original = await Jimp.read(originalBuffer);
        const mask = await Jimp.read(maskBuffer);
        mask.resize(original.getWidth(), original.getHeight());
        original.mask(mask, 0, 0);
        return original;
    }
};


// Mau nangis gw garap skrep ini😭
(async () => {
    try {
        const session = await RemoveBG.request();
        const imageBuffer = // Plis deh kau pasti tau caa dapet buffer gambar
        const maskBuffer = await RemoveBG.remove(imageBuffer, session);
        const finalImage = await RemoveBG.render(imageBuffer, maskBuffer);
        await finalImage.writeAsync('output.png');
        console.log('Gambar dengan masking berhasil disimpan sebagai output.png');
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
    }
})();
          
