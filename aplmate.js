const axios = require('axios');
const https = require('https');
const cheerio = require('cheerio');

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

const FormData = require('form-data');

/**
 * Mengambil data dari HTML form secara dinamis dan mengirimkan permintaan POST
 * @param {string} htmlString - String HTML form
 * @param {string} url - URL input dari pengguna
 * @param {string} cookie - Cookie yang diperlukan untuk otentikasi
 * @returns {Promise<object>} - Respon dari server
 */
async function GetData(htmlString, url, cookie) {
  // Parse HTML form dynamically
  const $ = cheerio.load(htmlString);

  // Extract all input fields
  const form = new FormData();
  $('input').each((i, el) => {
    const name = $(el).attr('name');
    const value = $(el).attr('value') || '';
    if (name!='url') form.append(name, value);
  });

  // Tambahkan URL input dari pengguna
  form.append('url', url);

  // Tentukan URL action dari form
  const actionUrl = 'https://aplmate.com/action'; // Ubah jika URL action berubah

  // Kirim permintaan POST menggunakan Axios
  try {
    const response = await axios.post(actionUrl, form, {
      headers: {
        ...form.getHeaders(),
        accept: '*/*',
        'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'sec-ch-ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        cookie: cookie, // Tambahkan cookie untuk otentikasi jika diperlukan
        Referer: 'https://aplmate.com/',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    });

    // Kembalikan data respons dari server
    const $ = cheerio.load(response.data);
    let out = {};
    out.title = $('h3 div').text().trim()
    out.artist = $('p span').text().trim()
    out.thumbnail = $('img').attr('src');
    let i = 1;
    $('a').each((index, element) => {
        if(i==1) out.audio = 'https://aplmate.com/'+$(element).attr('href');
        if(i==2) out.cover = 'https://aplmate.com/'+$(element).attr('href');
        i++;
    });
    return out;
  } catch (error) {
    console.error('Error occurred:', error.message);
    throw error;
  }
}


const Aplmate = async (url)=>{
    const res = await axios.get('https://aplmate.com', {
        httpsAgent,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache',
        }
    });
    let $ = cheerio.load(res.data)
    return await GetData($('form').prop('outerHTML'), url, res.headers["set-cookie"]?.join('; '));
}

Aplmate('https://music.apple.com/us/song/hey-tunggu-dulu/1763280772').then(_=>{
    console.log(_)
})
