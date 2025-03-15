const cheerio = require('cheerio');

async function mediaFire(url) {
  try {
    const response = await fetch('https://r.jina.ai/' + url, {
      headers: {
        'x-return-format': 'html',
      }
    });
    const text = await response.text();
    const $ = cheerio.load(text);
  
    const Time = $('div.DLExtraInfo-uploadLocation div.DLExtraInfo-sectionDetails').text().match(/This file was uploaded from (.*?) on (.*?) at (.*?)\n/);
    const result = {
      title: $('div.dl-btn-label').text().trim(),
      link: $('div.dl-utility-nav a').attr('href'),
      filename: $('div.dl-btn-label').attr('title'),
      url: $('a#downloadButton').attr('href'),
      size: $('a#downloadButton').text().match(/\((.*?)\)/)[1],
      from: Time[1],
      date: Time[2],
      time: Time[3],
      map: {
        background: "https://static.mediafire.com/images/backgrounds/download/additional_content/world.svg",
        region: "https://static.mediafire.com/images/backgrounds/download/additional_content/"+$('div.DLExtraInfo-uploadLocationRegion').attr('data-lazyclass')+".svg",
      },
      repair: $('a.retry').attr('href'),
    };
    
    return result;
  } catch (error) {
    return { error: error.message };
  }
}

// Cara Penggunaan
(async () => {
    const result = await mediaFire('https://www.mediafire.com/file/wuwj0oq7xzdtpui/ELAINA-AI_BUTTON_FIX_V4_ENC.zip/file');
    console.log(result);
    /*
{
  title: 'ELAINA-AI BUTTON FIX V4 ENC',
  link: 'https://www.mediafire.com/file/wuwj0oq7xzdtpui/ELAINA-AI_BUTTON_FIX_V4_ENC.zip/file',
  filename: 'ELAINA-AI BUTTON FIX V4 ENC.zip',
  url: 'https://download2271.mediafire.com/2f7m91nzhxbgqvaDa4rLAqBO7EBo3cHWejTYokTJE9IOPVASkB0BsqWVkLCP_yycOvKhoijsWd4cBtACy5M3QD87MJGErTiS8zbvwsleRcsXmF4LkiOpZ6iv17Y6PAFgVP4Nxm0yChTGSs1o_aqFCxke-lHRTPOHZR5T7TbeNm7Mqw/wuwj0oq7xzdtpui/ELAINA-AI+BUTTON+FIX+V4+ENC.zip',
  size: '9.9MB',
  from: 'Indonesia',
  date: 'June 15, 2024',
  time: '7:40 PM',
  map: {
    background: 'https://static.mediafire.com/images/backgrounds/download/additional_content/world.svg',
    region: 'https://static.mediafire.com/images/backgrounds/download/additional_content/continent-as.svg'
  },
  repair: 'https://www.mediafire.com/download_repair.php?qkey=wuwj0oq7xzdtpui&dkey=2f7m91nzhxb&template=59&origin=click_button'
}
    */
})();
      
