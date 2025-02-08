const axios = require('axios');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

const co = async (url)=>{
    const vax = await axios.get('https://snapfrom.com/');
    const $ = cheerio.load(vax.data);
    const token = $('#token').val().trim()
    const cookie = vax.headers["set-cookie"]?.join('; ');
    const res = await fetch("https://snapfrom.com/wp-json/aio-dl/video-data/", {
          "headers": {
            "accept": "*/*",
            "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/x-www-form-urlencoded",
            "sec-ch-ua": "\"Not-A.Brand\";v=\"99\", \"Chromium\";v=\"124\"",
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": "\"Android\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "cookie": cookie,
            "Referer": "https://snapfrom.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
          },
          "body": "url="+encodeURIComponent(url)+"&token="+token,
          "method": "POST"
        });
    return await res.json();
}

co("https://youtu.be/JILYXJV22f4?si=Xou2nfLByFBzaRwS").then(_=>{
    console.log(_)
});