case 'ytmp3multi: {
    if (!text) return m.reply(`Mohon masukkan URL yang benar\n.ytmp3multi https://www.youtube.com/watch?v=xxxx\nhttps://www.youtube.com/watch?v=yyyy\n...`);
    if (!/http.+youtu/.test(text)) return m.reply('Masukkan URL YouTube yang valid');
    if (!typeof(fs)) const fs = require('fs');
    if (!typeof(promisify)) const { promisify } = require('util');
    const AdmZip = require('adm-zip');
    
    const writeFile = promisify(fs.writeFile);
    
    async function downloadYtAlbum(urls, progressCallback) {
        const zipPath = `audio_collection${Math.floor(Math.random()*9999)}.zip`;
        const zip = new AdmZip();
        
        const urlList = urls.split('\n').filter(url => url.startsWith('http'));
        const total = urlList.length;
        let count = 0;
        
        for (const url of urlList) {
            try {
                const infoRes = await fetch(`https://ytcdn.project-rian.my.id/info?url=${encodeURIComponent(url)}`);
                const info = await infoRes.json();
                
                if (!info.title || !info.audioBitrates[1]) continue;
                
                const title = info.title.replace(/[^a-zA-Z0-9-_]/g, '_');
                const bitrate = info.audioBitrates[1];
                
                const audioRes = await fetch(`https://ytcdn.project-rian.my.id/audio?url=${encodeURIComponent(url)}&bitrate=${bitrate}`);
                const audioBuffer = await audioRes.arrayBuffer(); // Simpan sebagai buffer
                
                zip.addFile(`${title}.mp3`, Buffer.from(audioBuffer));
                count++;
                
                if (progressCallback) progressCallback(`Processed ${count}/${total}: ${title}`);
            } catch (error) {
                console.error(`Error processing ${url}:`, error);
            }
        }
        
        await writeFile(zipPath, zip.toBuffer()); // Simpan ZIP ke file
        if (progressCallback) progressCallback(`ZIP file created: ${zipPath}`);
        return zipPath;
    }

    let teks = 'Memulai...';
    let msg = await conn.sendMessage(m.chat, { text: teks }, { quoted: m });
    
    const makezip = await downloadYtAlbum(text, (process) => {
        teks += '\n' + process;
        conn.sendMessage(m.chat, { text: teks, edit: msg.key });
    });

    m.reply('Mengirim zip...');
    await conn.sendMessage(m.chat, { document: { url: makezip }, fileName: makezip, mimetype: 'application/zip' });
    fs.unlinkSync(makezip);
    console.log(`ZIP file ready at: ${makezip}`);
}
break;
