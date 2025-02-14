const WebSocket = require('ws');
const axios = require('axios');

/**
 * Mengunduh gambar dari URL dan mengembalikannya sebagai buffer.
 * @param {string} imageUrl - URL gambar yang akan diunduh.
 * @returns {Promise<Buffer>} - Buffer gambar.
 */
async function downloadImage(imageUrl) {
	try {
		const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
		return Buffer.from(response.data);
	} catch (error) {
		throw new Error(`Gagal mengunduh gambar: ${error.message}`);
	}
}

/**
 * Mengirim gambar ke WebSocket dan mengembalikan hasilnya.
 * @param {Buffer} imageBuffer - Buffer gambar yang akan dikirim.
 * @returns {Promise<{description: string, code: string}>} - Deskripsi dan kode HTML yang dihasilkan.
 */
async function sendImageToWebSocket(imageBuffer) {
	return new Promise((resolve, reject) => {
		const ws = new WebSocket('wss://screenshot-to-code-xe2d.onrender.com/generate-code');
		let collectedText = '';
		let finalCode = '';

		ws.on('open', () => {
			console.log('Terhubung ke WebSocket');

			// Konversi buffer ke base64
			const base64Image = imageBuffer.toString('base64');

			// Objek yang akan dikirim
			const data = {
				generationType: "create",
				image: `data:image/jpeg;base64,${base64Image}`,
				inputMode: "image",
				openAiApiKey: null,
				openAiBaseURL: null,
				anthropicApiKey: null,
				screenshotOneApiKey: null,
				isImageGenerationEnabled: true,
				editorTheme: "cobalt",
				generatedCodeConfig: "html_tailwind",
				codeGenerationModel: "gpt-4o-2024-05-13",
				isTermOfServiceAccepted: false
			};

			// Kirim objek sebagai JSON
			ws.send(JSON.stringify(data));
		});

		ws.on('message', (message) => {
			const response = JSON.parse(message.toString());

			if (response.type === 'chunk') {
				collectedText += response.value;
			} else if (response.type === 'setCode') {
				finalCode = response.value;
			} else if (response.type === 'status') {
				console.log('Status:', response.value);
			}
		});

		ws.on('close', () => {
			console.log('Koneksi WebSocket ditutup');
			resolve({ description: collectedText.trim(), code: finalCode.trim() });
		});

		ws.on('error', (error) => {
			console.error('Terjadi kesalahan:', error);
			reject(error);
		});
	});
}

// **Eksekusi utama**
(async () => {
	try {
		console.log('Mengunduh gambar...');
		const imageBuffer = await downloadImage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE7w-P_H2GRBmetRpDBeG6FflW02yHsJ-plMp3K5NreVtxn8PByOIWtd8&s=10');

		console.log('Mengirim gambar ke WebSocket...');
		const result = await sendImageToWebSocket(imageBuffer);

		console.log('\nDeskripsi Gambar:');
		console.log(result.description);

		console.log('\nKode HTML Dihasilkan:');
		console.log(result.code);
	} catch (error) {
		console.error('Terjadi kesalahan:', error.message);
	}
})();
