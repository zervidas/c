const axios = require('axios');

async function fetchBlackboxAI(prompt, callback) {
    const url = 'https://www.blackbox.ai/api/chat';
    const headers = {
        'authority': 'www.blackbox.ai',
        'accept': '*/*',
        'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'content-type': 'application/json',
        'origin': 'https://www.blackbox.ai',
        'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36'
    };

    const data = {
        "messages": [{ "role": "user", "content": prompt, "id": "54lcaEJ" }],
        "agentMode": {},
        "id": "RDyqb0u",
        "previewToken": null,
        "userId": null,
        "codeModelMode": true,
        "trendingAgentMode": {},
        "isMicMode": false,
        "userSystemPrompt": null,
        "maxTokens": 1024,
        "playgroundTopP": null,
        "playgroundTemperature": null,
        "isChromeExt": false,
        "githubToken": "",
        "clickedAnswer2": false,
        "clickedAnswer3": false,
        "clickedForceWebSearch": false,
        "visitFromDelta": false,
        "isMemoryEnabled": false,
        "mobileClient": false,
        "userSelectedModel": null,
        "validated": "00f37b34-a166-4efb-bce5-1312d87f2f94",
        "imageGenerationMode": false,
        "webSearchModePrompt": true,
        "deepSearchMode": false,
        "domains": null,
        "vscodeClient": false,
        "codeInterpreterMode": false,
        "customProfile": {
            "name": "",
            "occupation": "",
            "traits": [],
            "additionalInfo": "",
            "enableNewChats": false
        },
        "session": null,
        "isPremium": false,
        "subscriptionCache": null,
        "beastMode": false
    };

    try {
        const response = await axios({
            method: 'post',
            url: url,
            headers: headers,
            data: data,
            responseType: 'stream'
        });

        let output = '';
        let search = [];
        
        response.data.on('data', chunk => {
            const chunkStr = chunk.toString();
            output += chunkStr;
            
            const match = output.match(/\$~~~\$(.*?)\$~~~\$/);
            if (match) {
                search = JSON.parse(match[1]);
                const text = output.replace(match[0], '');
                output = text.split('\n\n\n\n')[1];
                callback({ search });
                callback({ text: output })
            } else {
                if (search.length) callback({ text: chunkStr });
            }
        });
        
        return new Promise((resolve) => {
            response.data.on('end', () => {
                resolve({ search, text: output.replace('**', '*').trim() });
            });
        });
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Contoh penggunaan
(async () => {
    try {
        let mess = null;
        let teks = '';
        if (typeof conn !== 'undefined' && typeof m !== 'undefined') 
            mess = await conn.sendMessage(m.chat, { text: 'Ha' }, { quoted: m });
        
        const result = await fetchBlackboxAI("Episode Detective Conan terbaru, jelaskan lengkap panjang", _ => {
            if (_.text) {
                teks += _.text;
                if (mess) {
                    conn.sendMessage(m.chat, { text: teks, edit: mess.key });
                } else {
                    process.stdout.write(_.text);
                }
            } else if (_.search) {
                console.log('Search result:', _.search);
            }
        });
        
        console.log('\nHasil akhir:', result);
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
    }
})();
