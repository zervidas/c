const axios = require('axios');

function calculateHash(url, salt) {
  return btoa(url) + (url.length + 1_000) + btoa(salt);
}

async function SnapDouyin(url){
  const re1 = await axios.get('https://snapdouyin.app/id');
  const token = re1.data.split('<input id="token" type="hidden" name="token" value="')[1].split('"')[0];
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  const body = new URLSearchParams();
  body.append('url', url);
  body.append('token', token);
  body.append('hash', calculateHash(url, 'aio-dl'));

  const res = await axios.post(`https://snapdouyin.app/wp-json/mx-downloader/video-data/`, body.toString(), { headers });
  
  return res.data;
}

// Cara use
(async () => {
        
    const dl = await SnapDouyin('https://v.douyin.com/iP47QoU3/');
    console.log(dl)
/*
{
  url: 'https://v.douyin.com/iP47QoU3/',
  title: '#videos🎬🎬🎥🎥 \n#😁😁#美女随拍',
  thumbnail: 'https://p26-sign.douyinpic.com/tos-cn-p-0015c000-ce/oYIUQ8He5rYI13B79ySPaALSsSDGfegJAvGMlC~c5_300x400.webp?lk3s=138a59ce&x-expires=1743602400&x-signature=XjrcUIl8ATacR1xyW0Nw7kC1Gi0%3D&from=327834062_large&s=PackSourceEnum_AWEME_DETAIL&se=false&sc=cover&biz_tag=aweme_video&l=20250319224830C13CEE6E27BE7A2728BF',
  duration: '07:37:26',
  source: 'douyin',
  medias: [
    {
      url: 'https://snapdouyin.app/wp-content/plugins/aio-video-downloader/download.php?source=douyin&media=MA==',
      quality: 'hd ⭐',
      extension: 'mp4',
      size: 6077024,
      formattedSize: '5.8 MB',
      videoAvailable: true,
      audioAvailable: true,
      chunked: false,
      cached: false,
      requiresRendering: false
    },
    {
      url: 'https://snapdouyin.app/wp-content/plugins/aio-video-downloader/download.php?source=douyin&media=MQ==',
      quality: 'hd',
      extension: 'mp4',
      size: 4489307,
      formattedSize: '4.28 MB',
      videoAvailable: true,
      audioAvailable: true,
      chunked: false,
      cached: false,
      requiresRendering: false
    },
    {
      url: 'https://snapdouyin.app/wp-content/plugins/aio-video-downloader/download.php?source=douyin&media=Mg==',
      quality: 'sd',
      extension: 'mp4',
      size: 1970322,
      formattedSize: '1.88 MB',
      videoAvailable: true,
      audioAvailable: true,
      chunked: false,
      cached: false,
      requiresRendering: false
    },
    {
      url: 'https://snapdouyin.app/wp-content/plugins/aio-video-downloader/download.php?source=douyin&media=Mw==',
      quality: 'watermark',
      extension: 'mp4',
      size: 6552954,
      formattedSize: '6.25 MB',
      videoAvailable: true,
      audioAvailable: true,
      chunked: false,
      cached: false,
      requiresRendering: false
    },
    {
      url: 'https://snapdouyin.app/wp-content/plugins/aio-video-downloader/download.php?source=douyin&media=NA==',
      quality: '128kbps',
      extension: 'mp3',
      size: 440775,
      formattedSize: '430.44 KB',
      videoAvailable: false,
      audioAvailable: true,
      chunked: false,
      cached: false,
      requiresRendering: false
    }
  ],
  sid: null
}
*/
})();
