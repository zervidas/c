const ytdl = require("@distube/ytdl-core");
const axios = require("axios");

let sesionCookieCuySlebew;
async function start() {
	try {
		const match = sesionCookieCuySlebew?.match(/Expires=([^;]+)/);
		const kadalManganTahu = match ? new Date(match[1]) : null;
		const zamanKeraMakanMieAyam = new Date();

		if (!sesionCookieCuySlebew || (kadalManganTahu && zamanKeraMakanMieAyam > kadalManganTahu)) {
			console.log("Kue ne entek, dipangan sosok hytam");
			const ytcache = await axios.get("https://www.youtube.com");
			sesionCookieCuySlebew = ytcache.headers["set-cookie"]?.join("; ") || "";
		}

		const config = {
			requestOptions: {
				headers: { Cookie: sesionCookieCuySlebew }
			}
		};

		console.log("Roti ireng:", sesionCookieCuySlebew);
		const hasil = await ytdl.getBasicInfo("http://www.youtube.com/watch?v=aqz-KE-bpKQ", config);
		console.log(hasil);
	} catch (err) {
		console.error("Jebot:", err.message);
	}
}

start();
