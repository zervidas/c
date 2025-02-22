
async function GenerateImg(prompt, nprompt='', opt={}){
    const r1 = await fetch('https://image-generation.perchance.org/api/verifyUser?thread=1&__cacheBust='+Math.random())
    const d1 = await r1.json();
    console.log(d1)
    
    const id = Math.random();
    const r2 = await fetch(`https://image-generation.perchance.org/api/generate?prompt=${prompt}&seed=${opt.seed||-1}&resolution=${opt.size || '512x768'}&guidanceScale=${opt.guidance || 7}&negativePrompt=&channel=ai-text-to-image-generator&subChannel=public&userKey=${d1.userKey}&adAccessCode=&requestId=${id}&__cacheBust=${Math.random()}`, {method:'POST'});
    const d2 = await r2.json();
    console.log(d2)
    
    for (let i = 0; i < 3; i++ ){
        const r3 = await fetch(`https://image-generation.perchance.org/api/getUserQueuePosition?userKey=${d1.userKey}&requestId=${id}&__cacheBust=${Math.random()}`);
        const d3 = await r3.json();
        if( d3.status == 'success' && d3.total == 6 ) break;
    }
    
    const url = "https://image-generation.perchance.org/api/downloadTemporaryImage?imageId="+d2.imageId;
    return {
        url,
        ...d2,
        userKey: d1.userKey
    }
}

//GenerateImg('cat in city greenland').then(console.log);
GenerateImg('cat in city greenland', 'blur ugly dull unrealistic', {
    seed: 51792,
    size: '512x768', // atau '512x512' atau '768x512'
    guidance: 5
}).then(async _=>{
    const img = await fetch(_.url);
    console.log(img.status)
    require('fs').writeFileSync('abcd.jpeg', Buffer.from(await img.arrayBuffer(), 'binary'))
});
