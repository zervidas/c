
const Spotify = {
	async search(q){
		const r = await fetch('https://spotifydown.app/api/metadata?link='+q, {method: 'POST'})
		return r.json();
	},
	async details(q){
		const r = await fetch('https://spotifydown.app/api/metadata?link='+q, {method: 'POST'})
		return r.json();
	},
	async download(q){
		const r = await fetch('https://spotifydown.app/api/download?link='+q, {headers:{Referer:'https://spotifydown.app/'}})
		return r.json();
	}
}

// cara openggunaannya 
async function start() {
	const cari = await Spotify.search('Hey tunggu dulu ');
	console.log('PENCARIAN:', cari)
	const detail = await Spotify.details(cari.data.tracks[0].link)
	console.log('DETAIL:', detail)
	const download = await Spotify.download(cari.data.tracks[0].link)
	console.log('DOWNLOAD:', download)
}

start();
