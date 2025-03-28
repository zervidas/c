
const axios = require('axios');
const cheerio = require('cheerio');


async function extractData(data) {
    const $ = cheerio.load(data);
    
    const tags = {
      info: {},
      cover: $('.fotoanime > img').attr('src'),
      lainnya: [],
      list: []
    };
    
    $('.sinopc > p:eq(1) > a').each((i, e)=>{
      tags.lainnya.push({
        title: $(e).text().trim(),
        link: $(e).attr('href')
      })
    })
    
    $('.infozingle > p').each((i, e)=>{
      let [ key, value ] = $(e).text().trim().split(':');
      tags.info[key.trim()] = value.trim();
    })
    
    $('.episodelist > ul > li').each((i, e)=>{
      tags.list.push({
        title: $(e).find('a').text().trim(),
        link: $(e).find('a').attr('href'),
        date: $(e).find('.zeebr').text().trim()
      })
    })

    return tags;
}

const OtakudesuInfo = async (url)=>{
    const res = await axios.get('https://r.jina.ai/'+url, {
        headers: {
          'x-return-format': 'html'
        }
    });
    return extractData(res.data);
};

(async _=>{
  
  const res = await OtakudesuInfo('https://otakudesu.cloud/anime/takagi-san-season-3-sub-indo/');
  console.log(res)
  
})();
