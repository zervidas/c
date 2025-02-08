const axios = require('axios');
const https = require('https');
const cheerio = require('cheerio');

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

async function extractData(data) {
    const $ = cheerio.load(data);

    const items = [];

    $('.package-header').each((index, element) => {
        const image  = $(element).find('img').attr('src');
        const description = $(element).find('.package-summary').text().trim();
        const title = $(element).find('.package-name').text().trim();
        const link = $(element).attr('href');
        items.push({image,description,title,link});
    });
    
    return data;
}

module.exports = async (q)=>{
    const res = await axios.get('https://search.f-droid.org/?q='+encodeURIComponent(q), {
        httpsAgent,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache',
        }
    });
    return res.data;
}