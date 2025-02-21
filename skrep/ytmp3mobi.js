(async _=>{

const url = "https://youtu.be/Yw6u6YkTgQ4?si=VYJW2XFkc-LqiQUN";

const headers = {
    "accept": "*/*",
    "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\"",
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": "\"Android\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "Referer": "https://id.ytmp3.mobi/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  }

const initial = await fetch(`https://d.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=${Math.random()}`, {headers});
let format = 'mp3' ?? 'mp4'; //mp3
const init = await initial.json();
console.log(init)

const id = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^&?/]+)/)?.[1];
let convertURL = init.convertURL + `&v=${id}&f=${format}&_=${Math.random()}`;
console.log(convertURL)

const converts = await fetch(convertURL, {headers});
const convert = await converts.json();
console.log(convert)

let info = {};
for (let i = 0; i < 3; i++ ){
    let j = await fetch(convert.progressURL, {headers});
    info = await j.json();
    console.log(info);
    if (info.progress == 3) break;
}

const result = {
    url: convert.downloadURL,
    title: info.title
}

console.log('Hasil akhir:', result)

})();
