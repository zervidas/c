const axios = require('axios');
const https = require('https');
const cheerio = require('cheerio');

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

async function extractData(data) {
    const $ = cheerio.load(data);

    const items = [];

    $('article').each((index, element) => {
        const image  = $(element).find('img').attr('data-src');
        const duration = $(element).find('.duration span').text().trim();
        const title = $(element).find('.title').text().trim();
        const link = $(element).find('.me-3').attr('href');
        items.push({image,duration,title,link});
    });
    
    return items;
}

module.exports = async (q)=>{
    const res = await axios.get('https://musicza.co.za/search?q='+encodeURIComponent(q), {
        httpsAgent,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache',
        }
    });
    return extractData(res.data);
}
