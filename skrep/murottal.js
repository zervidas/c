
const axios = require('axios');
const cheerio = require('cheerio');

const Murottal = {
    async list(){
        return (await axios.get('https://www.assabile.com/ajax/loadplayer-12-9')).data.Recitation;
    },
    async search(q){
        let list = await Murottal.list();
        return (typeof(q)=='number')?[list[q-1]]:list.filter(_=>{
            return _.span_name.toLowerCase().replace(/\W/g, '').includes(q.replace(/\W/g, ''));
        });
    },
    async audio(d){
        const mp3 = await axios.get('https://www.assabile.com/ajax/getrcita-link-'+d.href.slice(1), {
          headers: {
            'authority': 'www.assabile.com',
            'accept': '*/*',
            'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'referer': 'https://www.assabile.com/abdul-rahman-al-sudais-12/abdul-rahman-al-sudais.htm',
            'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
            'sec-ch-ua-mobile': '?1',
            'sec-ch-ua-platform': '"Android"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
            'x-requested-with': 'XMLHttpRequest'
          },
          decompress: true
        });
        return mp3.data;
    }
};

// Contoh penggunaan
(async () => {
  try {
    //const list = await Murottal.list();
      
    const search = await Murottal.search('alfatiha'); //atau
    //const annas = await Murottal.search(114); //surah ke 1 - 114
    console.log(search);
    /*
[
  {
    mix: '0',
    class1: 'Makiya',
    class2: 'Makiyacol9',
    sura_id: '1',
    href: '#3218',
    'data-verset': '7',
    'data-chronological': '5',
    'data-riwaya': "Hafs A'n Assem",
    'data-default': '1',
    'data-type': 'Makiya',
    'data-sort': '4804029',
    'data-collection': '9',
    name: '#1 - ',
    span_name: 'Al-Fatiha',
    duration: '00:36',
    class_sura: 's1',
    'stats-verset': '7 verses',
    'stats-kind': 'Makiya',
    class_sura_bg: 'soura',
    'stats-riwaya': "Al-Mus'haf Al-Murattal (Hafs A'n Assem)...",
    link_comment: '/abdul-rahman-al-sudais-12/quran/al-fatiha-3218#comments-pos',
    'stats-comment': '3 comments',
    link_person: '/abdul-rahman-al-sudais-12/quran/al-fatiha-3218',
    read: true
  }
]
*/
    const mp3 = await Murottal.audio(search[0]);
    console.log(mp3);
// https://media.sd.ma/assabile/recitations_7892537823/mp3/abdul-rahman-al-sudais-001-al-fatiha-3218-8020.mp3
  } catch (error) {
    console.error('Error:', error);
  }
})();
