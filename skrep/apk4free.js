
const axios = require('axios');
const cheerio = require('cheerio');

const Apk4Free = {
    async search(q) {
       const { data } = await axios.get('https://apk4free.net/?s='+q);
       const $ = cheerio.load(data);
       const res = [];
       $('.baps > .bav').each((i, e)=>{
           let obj = {};
           obj.title = $(e).find('span.title').text().trim();
           obj.link = $(e).find('a').attr('href');
           obj.developer = $(e).find('span.developer').text().trim();
           obj.version = $(e).find('span.version').text().trim();
           obj.image = $(e).find('img').attr('src').replace('150x150', '300x300');
           obj.rating = parseInt($(e).find('span.stars').attr('style').replace(/\D/g, ''))/20;
           res.push(obj);
       });
       
       return res;
    },
    async detail(url) {
       const { data } = await axios.get(url);
       const $ = cheerio.load(data);
       const _ = $('div.app-s');
       _.find('div#ez-toc-container').remove();
       const res = {
           title: _.find('h1.main-box-title').text().trim(),
           version: _.find('div.version').text().trim(),
           genre: _.find('ul.post-categories').text().trim(),
           icon: _.find('div.image-single').attr('style').match(/\((.*?)\)/)[1].replace('150x150', '300x300'),
           download: _.find('a.downloadAPK').attr('href'),
           rating: _.find('span.rating-average > b').text().trim(),
           votes: _.find('span.rating-text > span').text().trim(),
           developer: _.find('div.app-icb > div.da-s:eq(0)').text().replace('Developer', '').trim(),
           devlink: _.find('div.app-icb > div.da-s:eq(0) > a').attr('href'),
           requirements: _.find('div.app-icb > div.da-s:eq(2)').text().replace('Requirements', '').trim(),
           downloads: _.find('div.app-icb > div.da-s:eq(3)').text().replace('Downloads', '').trim(),
           playstore: _.find('div.app-icb > div.da-s:eq(4) > a').attr('href'),
           description: _.find('div.descripcion').text().trim(),
           details: _.find('div#descripcion').text().trim().replace(/^Description|Screenshots$/g, '').replace(/\n+/g, '\n').trim(),
           whatsnew: _.find('div#novedades > div.box-content').text().trim(),
           video: _.find('div.iframeBoxVideo > iframe').attr('src'),
           images: [],
           related: []
       };
       
       _.find('div#slideimages img').each((i, e)=>{
           res.images.push($(e).attr('src'));
       });
       
       _.find('.baps > .bav').each((i, e)=>{
           let obj = {};
           obj.title = $(e).find('span.title').text().trim();
           obj.link = $(e).find('a').attr('href');
           obj.developer = $(e).find('span.developer').text().trim();
           obj.version = $(e).find('span.version').text().trim();
           obj.image = $(e).find('img').attr('src').replace('150x150', '300x300');
           obj.rating = parseInt($(e).find('span.stars').attr('style').replace(/\D/g, ''))/20;
           res.related.push(obj);
       });
       
       return res;
    },
    async download(url) {
       const { data } = await axios.get(/(download\/?)$/.test(url)?url:url.replace(/\/$/, '')+'/download');
       const $ = cheerio.load(data);
       let obj = {};
       obj.title = $('div.pxtd > h3').text().trim();
       obj.package = $('div.pxtd > table tr:eq(0) td:eq(1)').text().trim();
       obj.version = $('div.pxtd > table tr:eq(1) td:eq(1)').text().trim();
       obj.size = $('div.pxtd > table tr:eq(2) td:eq(1)').text().trim();
       obj.requirements = $('div.pxtd > table tr:eq(3) td:eq(1)').text().trim();
       obj.url = $('div.pxtd #list-downloadlinks > li:eq(1) > a').attr('href');
       
       return obj;
    },
};

// Contoh penggunaan
(async () => {
  try {
    const search = await Apk4Free.search('pou');
    console.log(search);
    const detail = await Apk4Free.detail('https://apk4free.net/pou');
    console.log(detail);
    const download = await Apk4Free.download('https://apk4free.net/pou');
    console.log(download);
  } catch (error) {
    console.error('Error:', error);
  }
})();
