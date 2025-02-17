const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const cheerio = require('cheerio');

const bes = 'https://www.animefillerlist.com';

const FillerList = {
    async search(q){
        const { data } = await axios.get(bes+'/search/node/'+encodeURIComponent(q));
        const $ = cheerio.load(data);
        const result = [];
        
        $('.search-result').each((i, e)=>{
            let item = {};
            item.title = $(e).find('.title').text().trim();
            item.description = $(e).find('.search-snippet').text().trim().replace(/ +/g, ' ');
            item.link = $(e).find('a').attr('href');
            item.isAnime = item.link.split('/').length==5;
            item.isEpisode = !item.isAnime;
            result.push(item);
        });
        return result;
    },
    async list(url){
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const result = { title: url.split('/').pop() };
        
        const list = [];
        $('tbody > tr').each((i, e)=>{
            let item = {};
            item.number = parseInt($(e).find('.Number').text().trim());
            item.title = $(e).find('.Title').text().trim();
            item.link = bes + $(e).find('a').attr('href');
            item.type = $(e).find('.Type').text().trim();
            item.date = $(e).find('.Date').text().trim();
            list.push(item);
        });
        result.list = list;
        result.filler = $('#Condensed > .manga_canon .Episodes').text().trim();
        result.mixed = $('#Condensed > .mixed_canon/filler > .Episodes').text().trim();
        result.canon = $('#Condensed > .filler > .Episodes').text().trim();
        return result;
    },
    async detail(url){
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        return {
            title: url.split('/').pop(),
            number: parseInt($('.field-name-field-number field-items').text().trim()),
            date: $('.field-name-field-japanese-airdate field-items').text().trim(),
            type: $('.field-name-field-type field-items').text().trim(),
            manga: $('.field-name-field-manga-chapters field-items').text().trim(),
        };
    },
};

// Cara use
(async () => {
    const cari = await FillerList.search('conan');
    console.log(cari)
    /* skema
    [
        {
            title: String,
            description: String,
            link: String,
            isAnime: Boolean,
            isEpisode: Boolean
        },
        ....
    ]
    */
    if(cari[0].isAnime){
        const list = await FillerList.list(cari[0].link);
        console.log(list.filler);
        /* skema
        {
            title: String,
            filler: String,
            mixed: String,
            canon: String,
            list: [
                    {
                        number: Number,
                        title String,
                        link: String,
                        type: String,
                        date: String
                    },
                    ... Detective conan udah sampe 1153 eps lebih no bos, senggol dong
                ]
        }
        */
    } else if (cari[0].isEpisode){
        const detail = await FillerList.detail(cari[0].link);
        console.log(detail);
        /* eksempel
        {
            title: String,
            number: Number,
            date: String,
            type: String,
            manga: String // Nilainya bisa kosong
        }
        */
    }
})();
