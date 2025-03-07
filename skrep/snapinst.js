
const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

const snapinst = {
    async app(url) {
       const { data } = await axios.get('https://snapinst.app/');
       const $ = cheerio.load(data);
       const form = new FormData();
    
       form.append('url', url);
       form.append('action', 'post');
       form.append('lang', '');
       form.append('cf-turnstile-response', '');
       form.append('token', $('input[name=token]').attr('value'));
    
       const headers = {
         ...form.getHeaders(),
         'accept': '*/*',
         'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
         'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
         'sec-ch-ua-mobile': '?1',
         'sec-ch-ua-platform': '"Android"',
         'sec-fetch-dest': 'empty',
         'sec-fetch-mode': 'cors',
         'sec-fetch-site': 'same-origin',
         'Referer': 'https://snapinst.app/',
         'Referrer-Policy': 'strict-origin-when-cross-origin'
       };
    
       const jsbejad = await axios.post('https://snapinst.app/action2.php', form, { headers });
       const ayok = new Function('callbuk', jsbejad.data.replace('eval', 'callbuk'));
       
       const html = await new Promise((resolve, reject) => {
           ayok(t=>{
             const code = t.split(".innerHTML = ")[1].split("; document.")[0];
             resolve(eval(code));
           });
       });
       
       const _ = cheerio.load(html);
       const res = {
           avatar: _('.row img:eq(0)').attr('src'),
           username: _('.row div.left:eq(0)').text().trim(),
           urls: []
       };
       _('.row .download-item').each((i, e)=>{
           res.urls.push(_(e).find('.download-bottom a').attr('href'));
       });
       
       return res;
    },
};

// Contoh penggunaan
(async () => {
  try {
    console.log(await snapinst.app('https://www.instagram.com/p/DGuKhp6vShI/?img_index=1&igsh=enZmaXNjbTl4ZDBm'));
  } catch (error) {
    console.error('Error:', error);
  }
})();

/*  OUTPUT
{
    avatar: 'https://d.rapidcdn.app/snapinst?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJodHRwczovL3Njb250ZW50LXN5ZDItMS5jZG5pbnN0YWdyYW0uY29tL3YvdDUxLjI4ODUtMTkvNDUzNDY3NzU3XzExNTAwNzYxNTk1NTk5NjlfNDAwMzE5NzYzMjMxOTUxMzU1MV9uLmpwZz9zdHA9ZHN0LWpwZ19zMTUweDE1MF90dDYmX25jX2h0PXNjb250ZW50LXN5ZDItMS5jZG5pbnN0YWdyYW0uY29tJl9uY19jYXQ9MTA5Jl9uY19vYz1RNmNaMkFHMlNzMF91S21ZTkt1RHhGTDNKZHpISElyYWhRN2ZhQ1JDS0ZseGd5eXZpbUhvdVJNMC1Ha0EzR0NVcWpSNjhYSSZfbmNfb2hjPTNuSVRBTmllT3JrUTdrTnZnSEJ2YWJVJl9uY19naWQ9MjJiMzZhMmZjYjhmNGRiZTg1OGRkOWI2MzA0MmU5ZTUmZWRtPUFQczE3Q1VCQUFBQSZjY2I9Ny01Jm9oPTAwX0FZRU1oQTJQakRxbWdRSlhCZmNOY0htQl95cTdEQkYyckNqOXFWN0VicTJKUlEmb2U9NjdEMDNFNEUmX25jX3NpZD0xMGQxM2IiLCJmaWxlbmFtZSI6IlNuYXBpbnN0LmFwcF80NTM0Njc3NTdfMTE1MDA3NjE1OTU1OTk2OV80MDAzMTk3NjMyMzE5NTEzNTUxX24uanBnIn0.S4wlTZUBrigpo0FF_FbzO_XhZYtu0lu7w9K2_7_VrQc',
    username: 'harrypotter_jp_official',
    urls: ['https://d.rapidcdn.app/snapinst?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJodHRwczovL3Njb250ZW50LXN5ZDItMS5jZG5pbnN0YWdyYW0uY29tL3YvdDUxLjI4ODUtMTUvNDgyNjg4MzY2XzE4MzAwMDc2OTEyMjEyNTYzXzM2OTA4MTQ5NzY5OTE2OTU4NzVfbi5qcGc_c3RwPWRzdC1qcGdfZTE1X2ZyX3MxMDgweDEwODBfdHQ2JmVmZz1leUoyWlc1amIyUmxYM1JoWnlJNkltbHRZV2RsWDNWeWJHZGxiaTR4TURnd2VERXdPREF1YzJSeUxtWTNOVGMyTVM1a1pXWmhkV3gwWDJsdFlXZGxJbjAmX25jX2h0PXNjb250ZW50LXN5ZDItMS5jZG5pbnN0YWdyYW0uY29tJl9uY19jYXQ9MTExJl9uY19vYz1RNmNaMkFHMlNzMF91S21ZTkt1RHhGTDNKZHpISElyYWhRN2ZhQ1JDS0ZseGd5eXZpbUhvdVJNMC1Ha0EzR0NVcWpSNjhYSSZfbmNfb2hjPVM0eFdzb2JoRkxBUTdrTnZnRU5LdUgzJl9uY19naWQ9MjJiMzZhMmZjYjhmNGRiZTg1OGRkOWI2MzA0MmU5ZTUmZWRtPUFQczE3Q1VCQUFBQSZjY2I9Ny01Jm9oPTAwX0FZSGF1ZVFrTEc5dVZfaFZLeFo1eUpIeVRqZXBneGtoTElTVElBZ1ByMV91NHcmb2U9NjdEMDI1NTkmX25jX3NpZD0xMGQxM2IiLCJmaWxlbmFtZSI6IlNuYXBpbnN0LmFwcF80ODI2ODgzNjZfMTgzMDAwNzY5MTIyMTI1NjNfMzY5MDgxNDk3Njk5MTY5NTg3NV9uXzEwODAuanBnIn0.hcN_4cmraRdRMvRYwB0ZEyXv1uEelXUapLYOq99zjDg&dl=1',
        'https://d.rapidcdn.app/snapinst?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJodHRwczovL3Njb250ZW50LXN5ZDItMS5jZG5pbnN0YWdyYW0uY29tL3YvdDUxLjI4ODUtMTUvNDgyMzM3MjI0XzE4MzAwMDc2ODkxMjEyNTYzXzQ2MDY3ODA2MDA2NTMyMDEyMDVfbi5qcGc_c3RwPWRzdC1qcGdfZTE1X2ZyX3MxMDgweDEwODBfdHQ2JmVmZz1leUoyWlc1amIyUmxYM1JoWnlJNkltbHRZV2RsWDNWeWJHZGxiaTR4TURnd2VERXdPREF1YzJSeUxtWTNOVGMyTVM1a1pXWmhkV3gwWDJsdFlXZGxJbjAmX25jX2h0PXNjb250ZW50LXN5ZDItMS5jZG5pbnN0YWdyYW0uY29tJl9uY19jYXQ9MTExJl9uY19vYz1RNmNaMkFHMlNzMF91S21ZTkt1RHhGTDNKZHpISElyYWhRN2ZhQ1JDS0ZseGd5eXZpbUhvdVJNMC1Ha0EzR0NVcWpSNjhYSSZfbmNfb2hjPTVjMzV0djNjS0FrUTdrTnZnSE84d1YxJl9uY19naWQ9MjJiMzZhMmZjYjhmNGRiZTg1OGRkOWI2MzA0MmU5ZTUmZWRtPUFQczE3Q1VCQUFBQSZjY2I9Ny01Jm9oPTAwX0FZRy1NRXIwelRHa1hxYWVobldTT1JMZ3d1cmpmaUNnWEZUNHhpZ0tqaENxMEEmb2U9NjdEMDMxQjYmX25jX3NpZD0xMGQxM2IiLCJmaWxlbmFtZSI6IlNuYXBpbnN0LmFwcF80ODIzMzcyMjRfMTgzMDAwNzY4OTEyMTI1NjNfNDYwNjc4MDYwMDY1MzIwMTIwNV9uXzEwODAuanBnIn0.Ym4_SPTaadC5UpHRLau_pgJagPEd2zyisF9K9IT3aG0&dl=1',
        'https://d.rapidcdn.app/snapinst?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJodHRwczovL3Njb250ZW50LXN5ZDItMS5jZG5pbnN0YWdyYW0uY29tL3YvdDUxLjI4ODUtMTUvNDgyMzY3MTE3XzE4MzAwMDc2ODk0MjEyNTYzXzc2NjQzNTk4MDE2NzE3MTc3NDlfbi5qcGc_c3RwPWRzdC1qcGdfZTE1X3R0NiZlZmc9ZXlKMlpXNWpiMlJsWDNSaFp5STZJbWx0WVdkbFgzVnliR2RsYmk0NE1EQjRPREF3TG5Oa2NpNW1OelUzTmpFdVpHVm1ZWFZzZEY5cGJXRm5aU0o5Jl9uY19odD1zY29udGVudC1zeWQyLTEuY2RuaW5zdGFncmFtLmNvbSZfbmNfY2F0PTExMSZfbmNfb2M9UTZjWjJBRzJTczBfdUttWU5LdUR4RkwzSmR6SEhJcmFoUTdmYUNSQ0tGbHhneXl2aW1Ib3VSTTAtR2tBM0dDVXFqUjY4WEkmX25jX29oYz1aQ0h1V2ZjTVRaZ1E3a052Z0VEWkZ2cCZfbmNfZ2lkPTIyYjM2YTJmY2I4ZjRkYmU4NThkZDliNjMwNDJlOWU1JmVkbT1BUHMxN0NVQkFBQUEmY2NiPTctNSZvaD0wMF9BWUhaMmMwT2ltaDh4RnpPa1B3cXFlaHlSTzVWdExDRnF0V0x3R3diMnRzVHl3Jm9lPTY3RDAyQjk0Jl9uY19zaWQ9MTBkMTNiIiwiZmlsZW5hbWUiOiJTbmFwaW5zdC5hcHBfNDgyMzY3MTE3XzE4MzAwMDc2ODk0MjEyNTYzXzc2NjQzNTk4MDE2NzE3MTc3NDlfbl8xMDgwLmpwZyJ9.LsP3-tKqsSoTsysqUq1DYO5JGVUtmvay2B8vgLLespI&dl=1',
        'https://d.rapidcdn.app/snapinst?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJodHRwczovL3Njb250ZW50LXN5ZDItMS5jZG5pbnN0YWdyYW0uY29tL3YvdDUxLjI4ODUtMTUvNDgyNjY2NzE0XzE4MzAwMDc2OTAzMjEyNTYzXzcyMjMwNjc2NTk5Mjk4NTk0OTZfbi5qcGc_c3RwPWRzdC1qcGdfZTE1X2ZyX3MxMDgweDEwODBfdHQ2JmVmZz1leUoyWlc1amIyUmxYM1JoWnlJNkltbHRZV2RsWDNWeWJHZGxiaTR4TURnd2VERXdPREF1YzJSeUxtWTNOVGMyTVM1a1pXWmhkV3gwWDJsdFlXZGxJbjAmX25jX2h0PXNjb250ZW50LXN5ZDItMS5jZG5pbnN0YWdyYW0uY29tJl9uY19jYXQ9MTExJl9uY19vYz1RNmNaMkFHMlNzMF91S21ZTkt1RHhGTDNKZHpISElyYWhRN2ZhQ1JDS0ZseGd5eXZpbUhvdVJNMC1Ha0EzR0NVcWpSNjhYSSZfbmNfb2hjPXNNU0tIT3RzUU80UTdrTnZnSFVLdGIxJl9uY19naWQ9MjJiMzZhMmZjYjhmNGRiZTg1OGRkOWI2MzA0MmU5ZTUmZWRtPUFQczE3Q1VCQUFBQSZjY2I9Ny01Jm9oPTAwX0FZRWlmSlJ0YnZkZzB6b254c0RaeUttaGplSVd5RHhFWUM5dWlpVmpZZDdiZFEmb2U9NjdEMDE1RkQmX25jX3NpZD0xMGQxM2IiLCJmaWxlbmFtZSI6IlNuYXBpbnN0LmFwcF80ODI2NjY3MTRfMTgzMDAwNzY5MDMyMTI1NjNfNzIyMzA2NzY1OTkyOTg1OTQ5Nl9uXzEwODAuanBnIn0.vqDxOL21xgtB_tvVa29g9UPfY3TnWY6o2_hg0IaUYIg&dl=1'
    ]
}
*/
