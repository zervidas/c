const axios = require('axios');
const https = require('https');
const cheerio = require('cheerio');

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

const body = {
    httpsAgent,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
    }
}

const Yahoo = {
    async search(query){
        const res = await axios.get('https://search.yahoo.com/search?p='+encodeURIComponent(query), body);
        let $ = cheerio.load(res.data);
        const items = [];

        $('.searchCenterMiddle li').each((index, element) => {
            const title = ($(element).find('a').text()+"").split('·');
            const icon = $(element).find('img').attr('src');
            const description = $(element).find('.compText').text().trim();
            const link = $(element).find('a').attr('href');
    
            const item = {
                link,
                description,
                icon,
                title: (title[2]||title[1]||title[0]).trim()
            };
    
            items.push(item);
        });
    
        return items;
    },
    async images(query){
        const res = await axios.get('https://images.search.yahoo.com/search/images?p='+encodeURIComponent(query), body);
        let $ = cheerio.load(res.data);
        const items = [];

        $('.sres-cntr li').each((index, element) => {
            const title = $(element).find('.title').text().trim();
            const image = $(element).find('img').attr('data-src')||$(element).find('img').attr('src');
            const ratio = $(element).find('.asp-rat').text().trim();
            const source = $(element).find('.source').text().trim();
    
            const item = {
                source,
                ratio,
                image:(image + "").split('&')[0],
                title
            };
    
            items.push(item);
        });
    
        return items;
    },
    async video(query){
        const res = await axios.get('https://video.search.yahoo.com/search/video?p='+encodeURIComponent(query), body);
        let $ = cheerio.load(res.data);
        const items = [];

        $('.vres').each((index, element) => {
            const title = $(element).find('h3').text().trim();
            const thumbnail = $(element).find('img').attr('data-src')||$(element).find('img').attr('src');
            const duration = $(element).find('.v-time').text().trim();
            const age = $(element).find('.v-age').text().trim();
            const link = $(element).find('a').attr('data-rurl');
            const view = $(element).find('span').last().text().trim();
            const source = $(element).find('cite').text().trim();
    
            const item = {
                title,
                thumbnail,
                duration,
                age,
                link,
                view,
                source
            };
    
            items.push(item);
        });
    
        return items;
    }
}

async function test(){
const s = await Yahoo.images('Detective conan');
console.log(s )
}
test();
