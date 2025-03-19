const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const cheerio = require('cheerio');

const bes = 'https://komiku.id';
const bep = "https://api.komiku.id"

const Komiku = {
    async search(q){
        const { data } = await axios.get(bep+'/?post_type=manga&s='+encodeURIComponent(q));
        const $ = cheerio.load(data);
        const result = [];
        
        $('.bge').each((i, e)=>{
            let item = {};
            item.title = $(e).find('h3').text().trim();
            item.subtitle = $(e).find('.kan > span').text().trim();
            item.description = $(e).find('.kan p').text().split('.').filter((_,i)=>i!=0).join('.').trim();
            item.update = $(e).find('.kan p').text().split('.').shift().trim();
            item.link = bes + $(e).find('a').attr('href');
            item.thumb = $(e).find('img').attr('src');
            item.type = $(e).find('.tpe1_inf').text().trim();
            result.push(item);
        });
        return result;
    },
    async info(url){
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const result = {};
        
        const list = [];
        $('table#Daftar_Chapter > tbody > tr').each((i, e)=>{
            if (i == 0) return;
            let item = {};
            item.chapter = $(e).find('span').text().trim();
            item.link = bes + $(e).find('a').attr('href');
            item.view = $(e).find('.pembaca').text().trim();
            item.date = $(e).find('.tanggalseries').text().trim();
            list.push(item);
        });
        result.list = list;
        
        let syno = $('#Sinopsis p').text().trim();
        result.sinopsis = {
          images: [],
          short: syno.split('\n')[0],
          long: syno.split('\n')[1]
        }
        $('#Sinopsis img').each((i, _)=>result.sinopsis.images.push($(_).attr('src')));
        result.genre = $('ul.genre').text().trim().split('\n');
        result.info = {};
        $('table.inftable tr').each((i, e)=>{
          result.info[$(e).find('td:eq(0)').text().trim()] = $(e).find('td:eq(1)').text().trim();
        })
        return result;
    },
    async detail(url){
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        let out = [];
        $('div#Baca_Komik img').each((i, e)=>{
          out.push($(e).attr('src'))
        })
        return out;
    },
};

// Cara use
(async () => {
        
    const search = await Komiku.search('one');
    console.log(search)
    
    const info = await Komiku.info('https://komiku.id/manga/tonari-no-nobukuni-san-wa-ore-no-koto-ga-sukina-ki-ga-suru/');
    console.log(info)
    
    const detail = await Komiku.detail('https://komiku.id/tonari-no-nobukuni-san-wa-ore-no-koto-ga-sukina-ki-ga-suru-chapter-06/');
    console.log(detail)

})();
