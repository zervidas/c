const axios = require('axios');
const cheerio = require('cheerio');

const Kanzaki = {
    async list(){
        const res = await axios.get('https://storage.kanzaki.ru/ANIME___/');
        const $ = cheerio.load(res.data);
        let list = [];
        $('a').each((index, element) => {
            const link = 'https://storage.kanzaki.ru/ANIME___/'+$(element).attr('href');
            const title = (""+$(element).text().trim()).replace(/\//.g, '');
            list.push({title,link});
        })
        return list;
    },
    async download(url){
        const res = await axios.get(url);
        const $ = cheerio.load(res.data);
        let list = [];
        $('a').each((index, element) => {
            const link = 'https://storage.kanzaki.ru/ANIME___/'+$(element).attr('href');
            const filename = (""+$(element).text().trim()).replace(/\//.g, '');
            list.push({filename,link});
        })
        return list;
    },
    async listSearch(q){
        const res = await axios.get('https://storage.kanzaki.ru/ANIME___/');
        const $ = cheerio.load(res.data);
        let list = [];
        $('a').each((index, element) => {
            const link = 'https://storage.kanzaki.ru/ANIME___/'+$(element).attr('href');
            const title = (""+$(element).text().trim()).replace(/\//.g, '');
            list.push({title,link});
        })
        return list.filter(_=>new RegExp(`${q}`, 'i').test(_.title));
    },
    async downloadSearch(url, q){
        const res = await axios.get(url);
        const $ = cheerio.load(res.data);
        let list = [];
        $('a').each((index, element) => {
            const link = 'https://storage.kanzaki.ru/ANIME___/'+$(element).attr('href');
            const filename = (""+$(element).text().trim()).replace(/\//.g, '');
            list.push({filename,link});
        })
        return list.filter(_=>new RegExp(`${q}`, 'i').test(_.filename));;
    }
}

Kanzaki.listSearch('girl').then(_=>{
    console.log(_)
})
