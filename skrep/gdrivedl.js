const axios = require('axios');

function getDriveFileId(url) {
  const match = url.match(/\/d\/([^\/]+)/);
  return match ? match[1] : null;
}

async function downloadDriveFile(url) {
  const fileId = getDriveFileId(url);
  if (!fileId) throw new Error('Invalid Google Drive URL');

  const response = await axios({
    method: 'GET',
    url: `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=AIzaSyAA9ERw-9LZVEohRYtCWka_TQc6oXmvcVU`,
    responseType: 'arraybuffer'
  });

  return Buffer.from(response.data, 'binary');
}

(async () => {
  try {
    const url = 'https://drive.google.com/file/d/159Mrn1VHDuNrxLknW-R7y32ScJNzmxOk/view';
    const fileBuffer = await downloadDriveFile(url);
    
    console.log('File downloaded successfully!');
    console.log('Buffer size:', fileBuffer.length, 'bytes');
    
    // Untuk menyimpan ke file (opsional)
    // const fs = require('fs');
    // fs.writeFileSync('downloaded_file.csv', fileBuffer);
  } catch (error) {
    console.error('Download failed:', error.message);
  }
})();
