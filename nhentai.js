const axios = require('axios');
const https = require('https');
const cheerio = require('cheerio');

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

async function extractData(data) {
    const $ = cheerio.load(data);

    const items = [];

    $('.gallery').each((index, element) => {
        const title = $(element).find('.caption').first().text();
        const imageUrl = $(element).find('img').attr('data-src');
        const link = 'https://nhentai.net'+$(element).find('a').attr('href');

        const item = {
            title,
            imageUrl,
            link,
        };

        items.push(item);
    });

    return items;
}

module.exports = async (query)=>{
    const res = await axios.get('https://nhentai.net/search/?q='+encodeURIComponent(query), {
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
