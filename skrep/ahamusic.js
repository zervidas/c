const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function FindSong(buffer) {
    const form = new FormData();
    
    form.append('file', buffer, {
        filename: 'file1.mp3',
        contentType: 'audio/mp3'
    });

    form.append('sample_size', buffer.length);

    try {
        const response = await fetch('https://api.doreso.com/humming', {
            method: 'POST',
            headers: {
                ...form.getHeaders(),
                "accept": "application/json, text/plain, *\/*",
                "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\"",
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": "\"Android\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                "Referer": "https://aha-music.com/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            body: form
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return error;
    }
}

// Contoh penggunaan
(async _=>{

  const audioFile = 'https://qu.ax/CSMYZ.mp4'; // ini audio sebenernya 
  const arb = await fetch(audioFile);
  const buff = Buffer.from(await arb.arrayBuffer(), 'binary');
  const res = await FindSong(buff);
  console.log(res);
/*
{
  data: {
    acrid: 'a6e3afe6d0c17760c72b3b21c7631fbb',
    artists: 'Virgoun',
    title: 'Surat Cinta Untuk Starla'
  }
}
*/
})();
