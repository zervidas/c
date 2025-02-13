const axios = require("axios");
const { CookieJar } = require("tough-cookie");

class GenreSearch {
  constructor() {
    this.baseURL = "https://www.chosic.com/api/tools";
    this.headers = {
      "authority": "www.chosic.com",
      "accept": "application/json, text/javascript, */*; q=0.01",
      "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
      "app": "genre_finder",
      "referer": "https://www.chosic.com/music-genre-finder/",
      "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\"",
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": "\"Android\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
      "x-requested-with": "XMLHttpRequest",
    };
    this.cookieJar = new CookieJar();
  }

  async getCookies() {
    try {
      const res = await axios.get("https://www.chosic.com/music-genre-finder/", {
        headers: this.headers,
        withCredentials: true,
      });

      const setCookieHeader = res.headers["set-cookie"];
      if (setCookieHeader) {
        const cookieString = setCookieHeader.join("; ");
        await this.cookieJar.setCookie(cookieString, "https://www.chosic.com");
      }
    } catch (error) {
      console.error("Failed to get cookies:", error.message);
    }
  }

  async searchTrack(query, limit = 10) {
    try {
      const url = `${this.baseURL}/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`;
      const cookieString = await this.cookieJar.getCookieString("https://www.chosic.com");

      const res = await axios.get(url, {
        headers: { ...this.headers, "cookie": cookieString },
        withCredentials: true,
      });

      return res.data;
    } catch (error) {
      console.error("Search failed:", error.response?.status, error.message);
    }
  }

  async getTrackDetails(trackId) {
    try {
      const url = `${this.baseURL}/tracks/${trackId}`;
      const cookieString = await this.cookieJar.getCookieString("https://www.chosic.com");

      const res = await axios.get(url, {
        headers: { ...this.headers, "cookie": cookieString },
        withCredentials: true,
      });

      return res.data;
    } catch (error) {
      console.error("Track details failed:", error.response?.status, error.message);
    }
  }

  async getArtistDetails(artistIds) {
    try {
      const url = `${this.baseURL}/artists?ids=${artistIds}`;
      const cookieString = await this.cookieJar.getCookieString("https://www.chosic.com");

      const res = await axios.get(url, {
        headers: { ...this.headers, "cookie": cookieString },
        withCredentials: true,
      });

      return res.data;
    } catch (error) {
      console.error("Artist details failed:", error.response?.status, error.message);
    }
  }

  async getTrackAnalysis(trackId) {
    try {
      const url = `${this.baseURL}/audio-features/${trackId}`;
      const cookieString = await this.cookieJar.getCookieString("https://www.chosic.com");

      const res = await axios.get(url, {
        headers: { ...this.headers, "cookie": cookieString },
        withCredentials: true,
      });

      return res.data;
    } catch (error) {
      console.error("Track analysis failed:", error.response?.status, error.message);
    }
  }
}

// **Contoh Penggunaan**
(async () => {
  const genreFinder = new GenreSearch();
  
  await genreFinder.getCookies();

  const searchResult = await genreFinder.searchTrack("Hey tunggu dulu");
  console.log('Hasil pencarian👉', searchResult)

  if (searchResult && searchResult.tracks.items.length > 0) {
    const firstTrack = searchResult.tracks.items[0];
    const trackId = firstTrack.id;
    const trackDetail = await genreFinder.getTrackDetails(trackId);
    console.log('Detail lagu👉', trackDetail);
    const artistIds = trackDetail.artists.map(a => a.id).join(",");

    console.log('Detail artist👉', await genreFinder.getArtistDetails(artistIds));

    console.log('Detail analisis👉', await genreFinder.getTrackAnalysis(trackId));
  }
})();
