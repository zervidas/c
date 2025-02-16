const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const Upscale = {
  async send(imageBuffer, ratio = 2) {
    const formData = new FormData();
    formData.append('myfile', imageBuffer, { filename: 'image.jpg', contentType: 'image/jpeg' });
    formData.append('scaleRadio', String(ratio));

    const headers = {
      ...formData.getHeaders(), 
      'Accept': 'application/json, text/plain, */*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
      'Connection': 'keep-alive',
      'Host': 'get1.imglarger.com',
      'Origin': 'https://imgupscaler.com',
      'Referer': 'https://imgupscaler.com/',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'cross-site',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
      'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
      'sec-ch-ua-mobile': '?1',
      'sec-ch-ua-platform': '"Android"',
    };

    try {
      const response = await axios.post(
        'https://get1.imglarger.com/api/UpscalerNew/UploadNew',
        formData,
        { headers }
      );

      return { ...response.data, scale: ratio };
    } catch (error) {
      console.error('Error sending image:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  async wait(dat) {
    while (true) {
      const payload = {
        code: dat.data.code,
        scaleRadio: String(dat.scale),
      };

      const headers = {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json',
        'Host': 'get1.imglarger.com',
        'Origin': 'https://imgupscaler.com',
        'Referer': 'https://imgupscaler.com/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
        'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"',
      };

      try {
        const response = await axios.post(
          'https://get1.imglarger.com/api/UpscalerNew/CheckStatusNew',
          payload,
          { headers }
        );
        
        console.log(response.data);
        if (response.data.data.status === 'success') {
          return response.data;
        }
      } catch (error) {
        console.error('Error checking status:', error.response ? error.response.data : error.message);
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 3000)); // pengulangan buat cek apakah udah selesai apa blom
    }
  },
};

// Contoh penggunaan
(async () => {
  try {
      /*
      const res = await fetch('https:///url gambar')
      const buffer = Buffer.from(await res.arrayBuffer(), 'binary')
      */
    const buffer = // await m.download() // await m.quoted.download() 🗿 // fs.readFileSync('images.jpeg');
    const a = await Upscale.send(buffer, 4); // scale bisa 2 atau 4
    console.log(a);
    const b = await Upscale.wait(a); 
    console.log('Hasil akhir:', b);
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
  }
})();
