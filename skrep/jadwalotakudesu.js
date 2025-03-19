const axios = require('axios');
const cheerio = require('cheerio');

async function Jadwal(){
  const re1 = await axios.get('https://otakudesu.cloud/jadwal-rilis/');
  const $ = cheerio.load(re1.data);
  const out = {};
  $('.kglist321').each((i, e)=>{
    let obj = $(e).find('h2').text().trim().toLowerCase();
    out[obj] = [];
    $(e).find('a').each((i, e)=>{
      out[obj].push({
        title: $(e).text().trim(),
        link: $(e).attr('href')
      })
    })
  });
  return out;
}

// Cara use
(async () => {
        
    const dl = await Jadwal();
    console.log(dl)

})();
