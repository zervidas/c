async function mediaFire(url) {
  try {
    const response = await fetch('https://r.jina.ai/' + url);
    const text = await response.text();

    const result = {
      title: (text.match(/Title: (.+)/) || [])[1]?.trim() || '',
      link: (text.match(/URL Source: (.+)/) || [])[1]?.trim() || '',
      filename: '',
      url: '',
      size: '',
      repair: ''
    };

    if (result.link) {
      const fileMatch = result.link.match(/\/([^\/]+\.zip)/);
      if (fileMatch) result.filename = fileMatch[1];
    }

    const matches = [...text.matchAll(/\[(.*?)\]\((https:\/\/[^\s]+)\)/g)];
    for (const match of matches) {
      const desc = match[1].trim();
      const link = match[2].trim();
      
      if (desc.toLowerCase().includes('download') && desc.match(/\((\d+(\.\d+)?[KMGT]B)\)/)) {
        result.url = link;
        result.size = (desc.match(/\((\d+(\.\d+)?[KMG]?B)\)/) || [])[1] || '';
      }
      if (desc.toLowerCase().includes('repair')) {
        result.repair = link;
      }
    }

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
        filename: 'ELAINA-AI_BUTTON_FIX_V4_ENC.zip',
?       url: 'https://download1591.mediafire.com/82xu72qygvkgWfbSaew4cINl4jQYU3LhMlJquhMdAAWx14gckfYaPgxP3aeKRTnXsHyQldFH8DuGmQWAllSkX9PBXITCuCsRcZQkrziYsUwMjR4lo06Zu9b-0DTI23pIPNU5DZevmo7lBpbuU9iWPHVHIXB9szIeppecqA1KAu8T/wuwj0oq7xzdtpui/ELAINA-AI+BUTTON+FIX+V4+ENC.zip',
        size: '9.9MB',
        repair: 'https://www.mediafire.com/download_repair.php?qkey=wuwj0oq7xzdtpui&dkey=82xu72qygvk&template=61&origin=click_button'
    }
    */
})();
      
