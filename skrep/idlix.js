const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const cheerio = require('cheerio');

const bes = 'https://vip2.idlixvip.asia';

const Komiku = {
    async search(q){
        const { data } = await axios.get(bes+'/?s='+encodeURIComponent(q));
        const $ = cheerio.load(data);
        const out = [];
        
        $('.result-item').each((i, e)=>{
            let result = {};    
            result.title = $(e).find('.title a').text().trim();
            result.link = $(e).find('.title a').attr('href');
            result.image = $(e).find('.image img').attr('src');
            result.alt = $(e).find('.image img').attr('alt');
            result.category = $(e).find('.image .movies').text().trim();
            result.rating = $(e).find('.meta .rating').text().trim();
            result.year = $(e).find('.meta .year').text().trim();
            result.description = $(e).find('.contenido p').text().trim();
            out.push(result);
        });
        return out;
    },
    async detail(url){
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const result = {};
        
        const list = [];
        $('ul.episodios > li').each((i, e)=>{
            let item = {};
            item.cover = $(e).find('img').attr('src');
            item.link = $(e).find('a').attr('href');
            item.title = $(e).find('a').text().trim();
            item.date = $(e).find('.date').text().trim();
            list.push(item);
        });
        result.episodes = list;
        
        result.info = {
          images: [],
          sinopsis: $('.content center:contains("Synopsis") p').text().trim(),
        }
        $('.g-item').each((i, _)=>result.info.images.push($(_).find('img').attr('src')));
        result.genre = []; $('div.sgeneros a').each((i, e)=>result.genre.push($(e).text().trim()));
        result.cast = [];
        $('.persons .person').each((i, e)=>{
          let obj = {};
          obj.name = $(e).find('.name').text().trim();
          obj.char = $(e).find('.character').text().trim();
          obj.link = $(e).find('a').attr('href');
          obj.photo = $(e).find('img').attr('src');
          result.cast.push(obj);
        })
        result.title = $('.data > h1').text().trim();
        result.release = $('.data > .extra > .date').text().trim();
        result.studio = $('.data > .extra a').text().trim();
        result.rating = $('.data').find('.dt_rating_vgs').text().trim();
        result.cover = $('.poster img').attr('src');
        return result;
    }
};

// Cara use
(async () => {
        
    const search = await Komiku.search('one');
    console.log(search)
    
    const detail = await Komiku.detail('https://vip2.idlixvip.asia/tvseries/loner-life-in-another-world-2024/');
    console.log(detail);

})();
