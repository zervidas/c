const axios = require('axios');
const https = require('https');
const cheerio = require('cheerio');

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

async function extractData(data) {
    const $ = cheerio.load(data);

    const items = [];

    $('.thumb-container').each((index, element) => {
        const imageUrl = $(element).find('img').attr('data-src');
        items.push(imageUrl);
    });
    
    const tags = {
      parodies: [],
      characters: [],
      tags: [],
      artists: [],
      languages: [],
      categories: [],
      pages: [],
      uploaded: ""
    };
    
    function extractTags(selector) {
      const tagsArray = [];
      $(selector).each((i, el) => {
        const name = $(el).find('.name').text().trim();
        const count = $(el).find('.count').text().trim();
        tagsArray.push({ name, count });
      });
      return tagsArray;
    }
    
    tags.images = items;
    tags.parodies = extractTags('.tag-container:contains("Parodies") .tags a');
    tags.characters = extractTags('.tag-container:contains("Characters") .tags a');
    tags.tags = extractTags('.tag-container:contains("Tags") .tags a');
    tags.artists = extractTags('.tag-container:contains("Artists") .tags a');
    tags.languages = extractTags('.tag-container:contains("Languages") .tags a');
    tags.categories = extractTags('.tag-container:contains("Categories") .tags a');
    
    tags.pages = $(".tag-container:contains('Pages') .tags .name").text().trim();
    tags.uploaded = $(".tag-container:contains('Uploaded') time").text().trim();

    return tags;
}

module.exports = async (url)=>{
    const res = await axios.get(url, {
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