const axios = require('axios');
const https = require('https');
const cheerio = require('cheerio');

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

async function extractData(data) {
    const $ = cheerio.load(data);

    const items = [];

    $('.flexbox2-item').each((index, element) => {
        const title = $(element).find('.flexbox2-title span').first().text();
        const studio = $(element).find('.flexbox2-title span').last().text();
        const imageUrl = $(element).find('.flexbox2-thumb img').attr('src');
        const adult = $(element).find('.adult').text().trim();
        const synopsis = $(element).find('.synops p').text().trim();
        const genres = [];
        
        $(element).find('.genres a').each((i, genre) => {
            genres.push($(genre).text().trim());
        });

        const rating = $(element).find('.score').text().trim();
        const releaseDate = $(element).find('.release-date').text().trim();
        const episodeCount = $(element).find('.episodes').text().trim();
        const link = $(element).find('a').attr('href');

        const item = {
            title,
            studio,
            imageUrl,
            adult,
            synopsis,
            genres,
            rating,
            releaseDate,
            episodeCount,
            link,
        };

        items.push(item);
    });

    return items;
}

module.exports = async (query)=>{
    const res = await axios.get('https://crotpedia.net?s='+encodeURIComponent(query), {
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
