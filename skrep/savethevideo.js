const axios = require('axios');

async function fetchVideoInfo(videoUrl) {
  const apiEndpoint = 'https://api.v02.savethevideo.com/tasks';
  const requestData = {
    type: 'info',
    url: videoUrl,
  };

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
    Referer: `https://www.savethevideo.com/dailymotion-downloader?url=${encodeURIComponent(videoUrl)}`,
  };

  try {
    const response = await axios.post(apiEndpoint, requestData, { headers });
    return (response.data.state!='completed'?await fetchTask(response.href):response.data); // Respons dari server
  } catch (error) {
    console.error('Error fetching video info:', error.response?.data || error.message);
    throw error;
  }
}

async function fetchTask(task) {
  if (!task) throw 'Mohon ulangi permintaan.';
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
    Referer: `https://www.savethevideo.com${task}`,
  };

  try {
    const response = await axios.post('https://api.v02.savethevideo.com'+task, { headers });
    return (response.data.state!='completed'?await fetchTask(task):response.data); // Respons dari server
  } catch (error) {
    console.error('Error fetching task info:', error.response?.data || error.message);
    throw error;
  }
}


// Contoh Penggunaan
(async () => {
  const videoUrl = 'https://youtu.be/UISUbwB7Iqs?si=w2sh7v52gubTRYO38';
  
  try {
    const result = await fetchVideoInfo(videoUrl);
    console.log('Response:', result);
  } catch (error) {
    console.error('Request failed:', error.message);
  }
})();
