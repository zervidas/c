const axios = require('axios');
const cheerio = require('cheerio');
const options = {
  method: 'GET',
  headers: {
    'authority': 'gelbooru.com',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    'cache-control': 'max-age=0',
    'referer': 'https://gelbooru.com/',
    'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
    'sec-ch-ua-mobile': '?1',
    'sec-ch-ua-platform': '"Android"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36'
  }
};
const gelbooru = async function (q){
	const { data } = await axios({
		url: 'https://gelbooru.com/index.php?page=post&s=list&tags='+q,
		...options
	});
	const list = [];
	const $ = cheerio.load(data);
	$('.thumbnail-preview').each((i, e)=>{
		let mem = {};
		mem.link = $(e).find('a').attr('href');
		mem.image = $(e).find('img').attr('src');
		mem.title = $(e).find('img').attr('title');
		mem.desc = $(e).find('img').attr('alt');
		list.push(mem);
	});
	return list;
}
gelbooru('red').then(_=>{
	console.log(_)
})
