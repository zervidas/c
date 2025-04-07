## Cara penggunaan
```javascript
const zergitfol = require('./zergitfol.node');

const githubUrl = 'https://github.com/zervidas/c/tree/main/fitur';
const outputZip = './fitur-folder.zip';
const token = ''; // kalau ga perku kosongin

zergitfol.ZErvidaGitHubFolder(githubUrl, outputZip, (error, success) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  if (success) {
    console.log(`Folder berhasil didownload ke ${outputZip}`);
  } else {
    console.log('Download gagal');
  }
}, token);
```

*) code aslinya di tulis dalam c++, semoga work :)

## Catatan
Api dari github melimit hanya dapat melakukan request 60 kali per jam.
artinya hanya dapat mendownload 60 kali per jam.

~ Katanya
