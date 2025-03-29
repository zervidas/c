const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const cheerio = require('cheerio');

const bes = 'https://www.lagu123.biz';

const Lagu123 = {
    async search(q){
        const { data } = await axios.get(bes+(q?'/?searching='+encodeURIComponent(q):''), {
          maxRedirects: 5,
          validateStatus: function (status) {
            return status >= 200 && status < 400;
          }
        });
        const $ = cheerio.load(data);
        const result = [];
        
        $('div[itemprop=itemListElement]').each((i, e)=>{
            let item = {};
            item.title = $(e).find('span[itemprop=name]').text();
            item.image = $(e).find('img').attr('src');
            item.link = $(e).find('a').attr('href');
            item.url = 'https://youtu.be/' + item.link.match(/detail\/(.*?)\//)[1];
            result.push(item);
        });
        return result;
    },
    
};

// Cara use
(async () => {
    const search = await Lagu123.search('hey tunggu dulu');
    console.log(search)

})();
