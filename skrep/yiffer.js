const axios = require('axios');
const cheerio = require('cheerio');

async function Search(q){
  const { data } = await axios.get('https://r.jina.ai/https://yiffer.xyz/browse?search='+q, {
    headers: {
      'x-return-format': 'html' 
    }
  });
  const $ = cheerio.load(data);
  const list = [];
  
  $('div.pb-6 > div.flex-row > div.rounded').each((i, e)=>{
    let obj = {};
    obj.link = 'https://yiffer.xyz' + $(e).find('div.text-center > div.leading-5 > p > a').attr('href');
    obj.title = $(e).find('div.text-center > div.leading-5 > p > a').text().trim();
    obj.artist = $(e).find('div.text-center > p.leading-none > a').text().trim();
    obj.sextype = $(e).find('div.rounded-b-none').text().trim();
    obj.cover = $(e).find('a > img').attr('src');
    list.push(obj);
  })
  
  return list;
}

async function Detail(q){
  const { data } = await axios.get('https://r.jina.ai/'+q, {
    headers: {
      'x-return-format': 'html' 
    }
  });
  const $ = cheerio.load(data);
  const out = {
    title: $('div.container > div > h1').text().trim(),
    author: $('div.container > div > p > a').text().trim(),
    rating: $('div.container > div:eq(1)  > div > div:eq(1) > div:eq(0) > p').text().trim(),
    added: $('div.container > div:eq(1)  > div > div:eq(1) > div:eq(1) > p').text().trim(),
    update: $('div.container > div:eq(1)  > div > div:eq(1) > div:eq(2) > p').text().trim(),
    pages: $('div.container > div:eq(1)  > div > div:eq(1) > div:eq(3) > p').text().trim(),
    images: []
  };
  
  $('div.container > div.flex-col > div.relative > img').each((i, e)=>{
    out.images.push($(e).attr('src'));
  })
  
  return out;
}

Search('one').then(console.log);
//Detail('https://yiffer.xyz/c/White%20Stone%20Inn%20-%201').then(console.log);
