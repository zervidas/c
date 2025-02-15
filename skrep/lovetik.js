const LoveTik = {
    async dapatkan(url) {
        const response = await fetch('https://lovetik.com/api/ajax/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body: `query=${encodeURIComponent(url)}`
        });
        
        const data = await response.json();
        if(!data.images) data.images = [];
        const result = {
            video: [],
            audio: []
        };
        
        data.links.forEach(item => {
            if(!item.a) return;
            const formatted = {
                format: item.t.replace(/<.*?>|♪/g, '').trim(), // Menghapus tag HTML dan tanda ♪
                resolution: item.s || 'Audio Only',
                link: item.a
            };
        
            if (item.ft == 1) {
                result.video.push(formatted);
            } else {
                result.audio.push(formatted);
            }
        });
        data.render = async ()=>{
            const rendered = await fetch('https://lovetik.com/api/ajax/convert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                },
                body: `c_data=${encodeURIComponent(data.links.filter(m=>m.c)[0].c)}`
            });
            return rendered.json();
        }
        return {...data, ...result};
    }
};

(async () => {
    try {
        const result = await LoveTik.dapatkan('https://vt.tiktok.com/ZSMF7tpxr/');
        console.log('Video:', result.video);
        console.log('Audeo:', result.audio);
        console.log('Images:', result.images);
        
        if(result.images){
            const slides = await result.render();
            console.log('Slideshow:', slides)
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
    }
})();
