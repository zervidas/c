const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

const Savevid = async (instagramUrl) => {
  try {
    const formDataUserVerify = new FormData();
    formDataUserVerify.append('url', instagramUrl);

    const userVerifyResponse = await axios.post('https://savevid.net/api/userverify', formDataUserVerify, {
      headers: formDataUserVerify.getHeaders(),
    });

    const token = userVerifyResponse.data.token;

    const formDataAjaxSearch = new FormData();
    formDataAjaxSearch.append('q', instagramUrl);
    formDataAjaxSearch.append('t', 'media');
    formDataAjaxSearch.append('lang', 'id');
    formDataAjaxSearch.append('v', 'v2');
    formDataAjaxSearch.append('cftoken', token);

    const ajaxSearchResponse = await axios.post('https://v3.savevid.net/api/ajaxSearch', formDataAjaxSearch, {
      headers: {
        ...formDataAjaxSearch.getHeaders(),
        'authority': 'v3.savevid.net',
        'accept': '*/*',
        'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'origin': 'https://savevid.net',
        'referer': 'https://savevid.net/',
        'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
      },
    });

    return extractData(ajaxSearchResponse.data.data);
  } catch (error) {
    throw new Error(error.response ? error.response.data : error.message);
  }
};

const extractData = (html) => {
  const $ = cheerio.load(html);
  const results = [];

  $('ul.download-box li').each((index, element) => {
    const thumb = $(element).find('.download-items__thumb img').attr('src');
    const options = [];
    const downloadLink = $(element).find('.download-items__btn a').attr('href');

    $(element).find('.photo-option select option').each((i, opt) => {
      options.push({
        resolution: $(opt).text(),
        url: $(opt).attr('value'),
      });
    });

    results.push({
      thumb,
      options,
      downloadLink,
    });
  });

  return results;
};

(async () => {
  try {
    const data = await Savevid('https://www.instagram.com/p/DHe7V9KBxYO/?img_index=1&igsh=Nmp6bzhmYjk5MHR0');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
