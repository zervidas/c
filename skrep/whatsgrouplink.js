const axios = require('axios');
const cheerio = require('cheerio');

const WGL = {
    async search(q){
        const { data } = await axios.get('https://whatsgrouplink.com/?s='+q);
        const $ = cheerio.load(data);

        const items = [];
    
        $('article').each((index, element) => {
            const image  = $(element).find('img').attr('src');
            const date = $(element).find('time').text().trim();
            const title = $(element).find('.entry-title-link').text().trim();
            const link = $(element).find('a').attr('href');
            items.push({image,date,title,link});
        });
        
        return items;
    },
    async detail(q){
        const { data } = await axios.get(q);
        const $ = cheerio.load(data);

        const items = {};
        
        const str = $('.entry-content').html();
        
        let aha = str.split('<div style="margin-top: 0px; margin-bottom: 0px;" class="sharethis-inline-share-buttons"></div>')[1];
        items.desc = cheerio.load(aha.split('<h3')[0]).text().replace(/\n+/g, '\n').trim();
        let anu = ['rules', 'links', 'how', 'related']
        $('.entry-content ul').each((i, e)=>{
            let iye = [];
            $(e).find('li').each((j, d)=>{
                if(i%2==0)iye.push($(d).text())
                else {
                    let blox = {};
                    blox.title = $(d).text().split('–')[0].trim();
                    blox.link = $(d).find('a').attr('href');
                    iye.push(blox);
                }
            })
            items[anu[i]] = iye;
        })
        
        return items;
    }
}

module.exports = WGL;

(async _=>{
    const ser = await WGL.search('code');
    console.log('Search:', ser)
    
    const det = await WGL.detail(ser[0].link);
    console.log('Detail:', det)
})();
