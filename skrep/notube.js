const axios = require('axios');

async function NoTube(url, format, lang, subscribed) {
    try {
        const response = await axios({
            method: 'post',
            url: 'https://s53.notube.lol/recover_weight.php',
            headers: {
                'Accept': 'text/html, */*; q=0.01',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'Connection': 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Origin': 'https://notube.lol',
                'Referer': 'https://notube.lol/',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-site',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
                'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
                'sec-ch-ua-mobile': '?1',
                'sec-ch-ua-platform': '"Android"'
            },
            data: `url=${encodeURIComponent(url)}&format=${encodeURIComponent(format)}&lang=${encodeURIComponent(lang)}&subscribed=${encodeURIComponent(subscribed)}`,
            responseType: 'json'
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching video data:', error);
        throw error;
    }
}

const Formats = [
    { value: 'mp3hd', text: 'MP3 HD' },
    { value: 'mp4', text: 'MP4' },
    { value: 'mp3', text: 'MP3' },
    { value: 'mp4hd', text: 'MP4 HD' },
    { value: 'mp42k', text: 'MP4 2K' },
    { value: 'm4a', text: 'M4A' },
    { value: 'wav', text: 'WAV' },
    { value: '3gp', text: '3GP' },
    { value: 'flv', text: 'FLV' }
];

(async _=>{
    const videoUrl = 'https://youtube.com/shorts/SeyVV4hNZps?si=C9mqHeArDev57Gd7';
    const format = 'mp4' || Formats[0];
    const lang = 'id';
    const subscribed = 'false';
    
    const res = await NoTube(videoUrl, format, lang, subscribed);
    console.log(res);
})();
