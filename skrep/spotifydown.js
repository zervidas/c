const SpotifyDown = {
    async metadata(url) {
        try {
            // Mengambil metadata dari URL Spotify
            const metadataResponse = await fetch(`https://spotify-down.com/api/metadata?link=${encodeURIComponent(url)}`, {
                method: 'POST',
                headers: {
                    'authority': 'spotify-down.com',
                    'accept': '*/*',
                    'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                    'content-length': '0',
                    'content-type': 'application/json',
                    'origin': 'https://spotify-down.com',
                    'referer': 'https://spotify-down.com/',
                    'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
                    'sec-ch-ua-mobile': '?1',
                    'sec-ch-ua-platform': '"Android"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36'
                }
            });

            if (!metadataResponse.ok) {
                throw new Error('Gagal mengambil metadata');
            }

            return (await metadataResponse.json()).data;
        } catch (error) {
            console.error('Error:', error.message);
            return null;
        }
    },
    async download(url, title, artist){
        try {
            // Mengambil URL download
            const downloadResponse = await fetch(`https://spotify-down.com/api/download?link=${encodeURIComponent(url)}&n=${encodeURIComponent(title)}&a=${encodeURIComponent(artist)}`, {
                headers: {
                    'authority': 'spotify-down.com',
                    'accept': '*/*',
                    'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                    'referer': 'https://spotify-down.com/',
                    'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
                    'sec-ch-ua-mobile': '?1',
                    'sec-ch-ua-platform': '"Android"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36'
                }
            });

            if (!downloadResponse.ok) {
                throw new Error('Gagal mengambil URL download');
            }

            const downloadData = await downloadResponse.json();

            // Menggabungkan metadata dengan URL download
            const result = {
                url: downloadData.data.link
            };

            return result;
        } catch (error) {
            console.error('Error:', error.message);
            return null;
        }
    }
};

// Contoh penggunaan
(async () => {
    
    // Contoh lagu
    const url = 'https://open.spotify.com/track/5kgC18ja2Fcid1tZGuCaq6';
    const metadata = await SpotifyDown.metadata(url);
    console.log(metadata);
    const dl1 = await SpotifyDown.download(metadata.link, metadata.title, metadata.artist);
    console.log(dl1);
    
    // Contoh playlist
    const album = "https://open.spotify.com/intl-id/album/4bJFoJcYXDNsBNt9Z1aO12";
    const playlist = await SpotifyDown.metadata(album);
    console.log(playlist);
    const track = playlist.tracks[0];
    const dl2 = await SpotifyDown.download(track.link, track.title, track.artist);
    console.log(dl2);
})();

/*
CONTOH LAGU
{
  type: 'track',
  id: '5kgC18ja2Fcid1tZGuCaq6',
  artists: 'Link',
  title: 'I Know',
  album: 'Creepin',
  duration: 288626,
  link: 'https://open.spotify.com/track/5kgC18ja2Fcid1tZGuCaq6',
  cover_url: 'https://i.scdn.co/image/ab67616d00001e025d45e7d22fab40d4ac90c4d2',
  release_date: '2008-01-01',
  track_number: 1,
  isrc: 'usmhy0800001'
}

haisl download()
{ url: 'https://spotidownloader7-1.onrender.com/stream/gzSyAxdebBA' }


//////////////////////////
CONTOH PLAYLIST 
{
  type: 'album',
  id: '4bJFoJcYXDNsBNt9Z1aO12',
  album_type: 'album',
  album: 'Creepin',
  artists: 'Link',
  link: 'https://open.spotify.com/album/4bJFoJcYXDNsBNt9Z1aO12',
  cover_url: 'https://i.scdn.co/image/ab67616d00001e025d45e7d22fab40d4ac90c4d2',
  release_date: '2008-01-01',
  total_tracks: 14,
  tracks: [
    {
      album: 'Creepin',
      release_date: '2008-01-01',
      type: 'track',
      id: '5kgC18ja2Fcid1tZGuCaq6',
      title: 'I Know',
      artists: 'Link',
      link: 'https://open.spotify.com/track/5kgC18ja2Fcid1tZGuCaq6',
      duration: 288626,
      track_number: 1,
      cover_url: 'https://i.scdn.co/image/ab67616d00001e025d45e7d22fab40d4ac90c4d2'
    },
    {
      album: 'Creepin',
      release_date: '2008-01-01',
      type: 'track',
      id: '7qvEcq0IFvigAccK94K1sR',
      title: 'Git U N My Room',
      artists: 'Link',
      link: 'https://open.spotify.com/track/7qvEcq0IFvigAccK94K1sR',
      duration: 262653,
      track_number: 2,
      cover_url: 'https://i.scdn.co/image/ab67616d00001e025d45e7d22fab40d4ac90c4d2'
    },
    {
      album: 'Creepin',
      release_date: '2008-01-01',
      type: 'track',
      id: '3OC0jTnyzl0WYGcOCeW5jT',
      title: 'Git U N My Room (Interlude)',
      artists: 'Link',
      link: 'https://open.spotify.com/track/3OC0jTnyzl0WYGcOCeW5jT',
      duration: 69586,
      track_number: 3,
      cover_url: 'https://i.scdn.co/image/ab67616d00001e025d45e7d22fab40d4ac90c4d2'
    },
    {
      album: 'Creepin',
      release_date: '2008-01-01',
      type: 'track',
      id: '62Fhc12C3M2MS9IT20E79X',
      title: 'How Would You Like It',
      artists: 'Link',
      link: 'https://open.spotify.com/track/62Fhc12C3M2MS9IT20E79X',
      duration: 325746,
      track_number: 4,
      cover_url: 'https://i.scdn.co/image/ab67616d00001e025d45e7d22fab40d4ac90c4d2'
    },
    {
      album: 'Creepin',
      release_date: '2008-01-01',
      type: 'track',
      id: '6HBA2JkYNpIoSRjlqQbELy',
      title: 'Sex Thang',
      artists: 'Link',
      link: 'https://open.spotify.com/track/6HBA2JkYNpIoSRjlqQbELy',
      duration: 360760,
      track_number: 5,
      cover_url: 'https://i.scdn.co/image/ab67616d00001e025d45e7d22fab40d4ac90c4d2'
    },
    {
      album: 'Creepin',
      release_date: '2008-01-01',
      type: 'track',
      id: '5CnLXctpTiB1ptTgE9saS7',
      title: 'Caught Up (Interlude)',
      artists: 'Link',
      link: 'https://open.spotify.com/track/5CnLXctpTiB1ptTgE9saS7',
      duration: 123080,
      track_number: 6,
      cover_url: 'https://i.scdn.co/image/ab67616d00001e025d45e7d22fab40d4ac90c4d2'
    },
    {
      album: 'Creepin',
      release_date: '2008-01-01',
      type: 'track',
      id: '34dn8lXHy90ifIpECjvXao',
      title: 'Hooked',
      artists: 'Link',
      link: 'https://open.spotify.com/track/34dn8lXHy90ifIpECjvXao',
      duration: 290693,
      track_number: 7,
      cover_url: 'https://i.scdn.co/image/ab67616d00001e025d45e7d22fab40d4ac90c4d2'
    },
    {
      album: 'Creepin',
      release_date: '2008-01-01',
      type: 'track',
      id: '3kQmfZZCdVeOvx1XafktMp',
      title: 'Shake For Dat Money',
      artists: 'Link',
      link: 'https://open.spotify.com/track/3kQmfZZCdVeOvx1XafktMp',
      duration: 290933,
      track_number: 8,
      cover_url: 'https://i.scdn.co/image/ab67616d00001e025d45e7d22fab40d4ac90c4d2'
    },
    {
      album: 'Creepin',
      release_date: '2008-01-01',
      type: 'track',
      id: '624brl5CqC49fK87eC0h8S',
      title: 'Am I',
      artists: 'Link',
      link: 'https://open.spotify.com/track/624brl5CqC49fK87eC0h8S',
      duration: 278266,
      track_number: 9,
      cover_url: 'https://i.scdn.co/image/ab67616d00001e025d45e7d22fab40d4ac90c4d2'
    },
    {
      album: 'Creepin',
      release_date: '2008-01-01',
      type: 'track',
      id: '0ffCKq1rlPRqooegJxBEzN',
      title: 'Personality',
      artists: 'Link',
      link: 'https://open.spotify.com/track/0ffCKq1rlPRqooegJxBEzN',
      duration: 331880,
      track_number: 10,
      cover_url: 'https://i.scdn.co/image/ab67616d00001e025d45e7d22fab40d4ac90c4d2'
    },
    {
      album: 'Creepin',
      release_date: '2008-01-01',
      type: 'track',
      id: '41Ks9oDRBUhRXVh2xPqz5Q',
      title: 'Creepin',
      artists: 'Link',
      link: 'https://open.spotify.com/track/41Ks9oDRBUhRXVh2xPqz5Q',
      duration: 333946,
      track_number: 11,
      cover_url: 'https://i.scdn.co/image/ab67616d00001e025d45e7d22fab40d4ac90c4d2'
    },
    {
      album: 'Creepin',
      release_date: '2008-01-01',
      type: 'track',
      id: '2oEYOIVBXm3jY63oyB0235',
      title: 'The Break Up (Interlude)',
      artists: 'Link',
      link: 'https://open.spotify.com/track/2oEYOIVBXm3jY63oyB0235',
      duration: 71213,
      track_number: 12,
      cover_url: 'https://i.scdn.co/image/ab67616d00001e025d45e7d22fab40d4ac90c4d2'
    },
    {
      album: 'Creepin',
      release_date: '2008-01-01',
      type: 'track',
      id: '7k1Ow6IuhPWfBwW5JIEvAm',
      title: "It's Over Now",
      artists: 'Link',
      link: 'https://open.spotify.com/track/7k1Ow6IuhPWfBwW5JIEvAm',
      duration: 283240,
      track_number: 13,
      cover_url: 'https://i.scdn.co/image/ab67616d00001e025d45e7d22fab40d4ac90c4d2'
    },
    {
      album: 'Creepin',
      release_date: '2008-01-01',
      type: 'track',
      id: '3V4ebd66x06S18QoQrFgz1',
      title: 'Baby Back',
      artists: 'Link',
      link: 'https://open.spotify.com/track/3V4ebd66x06S18QoQrFgz1',
      duration: 247040,
      track_number: 14,
      cover_url: 'https://i.scdn.co/image/ab67616d00001e025d45e7d22fab40d4ac90c4d2'
    }
  ]
}

hasil download()
{ url: 'https://spotidownloader7-1.onrender.com/stream/gzSyAxdebBA' }
*/
