const fetch = require('node-fetch');

async function getToken(url) {
  try {
    const response = await (await fetch(url)).text();
    const cookies = response.headers["set-cookie"];
    const joinedCookies = cookies ? cookies.join("; ") : null;
    const token = joinedCookies.match(/XSRF-TOKEN=([^;]+)/)[1];
    const track = response.data.match(/Api.track\('(.*?)'\)/)[1];
    const submit = response.data.match(/App.pages.video\('(.*?)'\)/)[1];

    return { track, submit, token, joinedCookies };
  } catch (error) {
    console.error("❌ Error fetching cookies or CSRF token:", error.message);
    throw error;
  }
}
module.exports = async (q)=>{
    try {
    const { track, submit, token, joinedCookies } = await getToken(q);
    fetch("https://musicza.co.za/api/track", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "sec-ch-ua": "\"Not-A.Brand\";v=\"99\", \"Chromium\";v=\"124\"",
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": "\"Android\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        "x-xsrf-token": token,
        "cookie": joinedCookies,
        "Referer": q,
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": "{\"payload\":\""+track+"\"}",
      "method": "POST"
    });
    const res = await fetch("https://musicza.co.za/api/video/formats", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "sec-ch-ua": "\"Not-A.Brand\";v=\"99\", \"Chromium\";v=\"124\"",
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": "\"Android\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        "x-xsrf-token": token,
        "cookie": joinedCookies,
        "Referer": "https://musicza.co.za/download/salma-salsabil-boleh-juga-official-music-video/video/k0SWWvHoikx",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": "{\"payload\":\""+submit+"\"}",
      "method": "POST"
    });
    const dat = await res.json();
    const hasil = [];
    for(let n of dat.formats){
        let out = {
            label: n.label,
            size: n.size,
            url: (await (await fetch("https://musicza.co.za/api/video/download", {
              "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/json",
                "sec-ch-ua": "\"Not-A.Brand\";v=\"99\", \"Chromium\";v=\"124\"",
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": "\"Android\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                "x-xsrf-token": token,
                "cookie": joinedCookies,
                "Referer": "https://musicza.co.za/download/salma-salsabil-boleh-juga-official-music-video/video/k0SWWvHoikx",
                "Referrer-Policy": "strict-origin-when-cross-origin"
              },
              "body": "{\"payload\":\""+n.payload+"\"}",
              "method": "POST"
            })).json()).link
        };
        hasil.push(out)
    }
    return hasil;
    }catch(e){
        console.log(e.message)
    }
}
