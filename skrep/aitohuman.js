const axios = require('axios');

async function convertAiToHumanStream(discussiontopic, options = {}) {
  const params = {
    wpaicg_stream: 'yes',
    discussiontopic: encodeURIComponent(discussiontopic),
    engine: options.engine || 'gpt-4o-mini',
    max_tokens: options.max_tokens || 2600,
    temperature: options.temperature || 0.8,
    top_p: options.top_p || 1,
    best_of: options.best_of || 1,
    frequency_penalty: options.frequency_penalty || 0,
    presence_penalty: options.presence_penalty || 0,
    stop: options.stop || '',
    post_title: options.post_title || 'AI to Human Text Converter (Normal)',
    id: options.id || '1654',
    source_stream: options.source_stream || 'form',
    nonce: options.nonce || 'f03c73b6b9'
  };

  const headers = {
    'authority': 'aitohuman.org',
    'accept': 'text/event-stream',
    'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    'cache-control': 'no-cache',
    'pragma': 'no-cache',
    'referer': 'https://aitohuman.org/ai-to-human-text-converter-ai/',
    'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
    'sec-ch-ua-mobile': '?1',
    'sec-ch-ua-platform': '"Android"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36'
  };

  try {
    const response = await axios({
      method: 'get',
      url: 'https://aitohuman.org/index.php',
      params: params,
      headers: headers,
      responseType: 'stream'
    });
    return response.data;
  } catch (error) {
    throw new Error(`Gagal melakukan request: ${error.message}`);
  }
}

async function main() {
  try {
    const discussionTopic = '*🤖 Karso Botz - AI* JavaScript itu bahasa pemrograman yang digunakan untuk membuat website jadi interaktif. Misalnya, buat animasi, validasi form, atau efek-efek keren lainnya. 🌠✨ Jadi, kalau mau website kamu "hidup", JavaScript solusinya! 😄';
    
    const stream = await convertAiToHumanStream(discussionTopic, {
      temperature: 0.7,
      max_tokens: 1000
    });

    let fullResponse = '';
    
    stream.on('data', (chunk) => {
      const chunkStr = chunk.toString();
      const lines = chunkStr.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.substring(6).trim();
          
          if (data === '[DONE]') {
            console.log('\nStream selesai');
            return;
          }
          
          try {
            const parsed = JSON.parse(data);
            console.log('Chunk diterima:', require('util').inspect(parsed, { depth: 20, colors: true }));
            
            if (parsed.choices && parsed.choices[0].delta?.content) {
              fullResponse += parsed.choices[0].delta.content;
            }
          } catch (e) {
            //console.error('Gagal parsing JSON:', e);
          }
        }
      }
    });
    
    stream.on('end', () => {
      console.log('\n\nFull response:', fullResponse);
    });
    
    stream.on('error', (err) => {
      console.error('Error dalam stream:', err);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
