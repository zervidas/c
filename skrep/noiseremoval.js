
const axios = require('axios');
const crypto = require('crypto');
const FormData = require('form-data');

function cyphereddata(t, r = "cryptoJS") {
    t = t.toString();
    const e = crypto.randomBytes(32);
    const a = crypto.randomBytes(16);
    const i = crypto.pbkdf2Sync(r, e, 999, 32, 'sha512');
    const cipher = crypto.createCipheriv('aes-256-cbc', i, a);
    let encrypted = cipher.update(t, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return JSON.stringify({
        amtext: encrypted,
        slam_ltol: e.toString('hex'),
        iavmol: a.toString('hex')
    });
}

const NoiseRemover = {
    async run(buffer) {
        const timestamp = Math.floor(Date.now() / 1000);
        const encryptedData = JSON.parse(cyphereddata(timestamp));

        const formData = new FormData();
        formData.append('media', buffer, { filename: crypto.randomBytes(3).toString('hex')+'_halo.mp3' });
        formData.append('fingerprint', crypto.randomBytes(16).toString('hex'));
        formData.append('mode', 'pulse');
        formData.append('amtext', encryptedData.amtext);
        formData.append('iavmol', encryptedData.iavmol);
        formData.append('slam_ltol', encryptedData.slam_ltol);

        const response = await axios.post(
            'https://noiseremoval.net/wp-content/plugins/audioenhancer/requests/noiseremoval/noiseremovallimited.php',
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    "accept": "*/*",
                    "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                    "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\"",
                    "sec-ch-ua-mobile": "?1",
                    "sec-ch-ua-platform": "\"Android\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest",
                    "Referer": "https://noiseremoval.net/",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
            }
        );

        return response.data;
    },
};

// Contoh penggunaan
(async () => {
  try {
    // Contoh buffer audio (ganti dengan buffer asli)
    const buffer = require('fs').readFileSync('./sample-audio.ogg'); // Buffer
    const result = await NoiseRemover.run(buffer);
    console.log('Hasil noise removal:', result);
  } catch (error) {
    console.error('Error:', error);
  }
})();

/*
Hasil noise removal: {
  error: false,
  flag: 'ok',
  media: {
    enhanced: {
      loudness_lufs: null,
      true_peak: null,
      uri: 'https://apinest.dev/filemanager/noiseremoval/audio_c10348069fbf093d_output.mp3'
    },
    original: {
      loudness_lufs: null,
      true_peak: null,
      uri: 'https://apinest.dev/filemanager/noiseremoval/audio_c10348069fbf093d_input.mp3'
    }
  },
  message: 'Success!',
  worker: 'mpse'
}*/
