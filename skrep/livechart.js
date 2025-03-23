const axios = require('axios');
const cheerio = require('cheerio');

async function fetchAnimeData() {
    try {
        const url = 'https://www.livechart.me/spring-2025/all';
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const animeList = [];

        $('article.anime').each((index, element) => {
            const anime = {
                id: $(element).attr('data-anime-id'),
                romaji: $(element).attr('data-romaji'),
                english: $(element).attr('data-english'),
                native: $(element).attr('data-native'),
                alternate: JSON.parse($(element).attr('data-alternate') || '[]'),
                premiere: $(element).attr('data-premiere'),
                premierePrecision: $(element).attr('data-premiere-precision'),
                libraryStatus: $(element).attr('data-library-status'),
                controller: $(element).attr('data-controller'),
                action: $(element).attr('data-action'),
                target: $(element).attr('data-anime-card-list-target'),

                markMenu: {
                    items: []
                },
                mainTitle: $(element).find('h3.main-title a').text().trim(),
                tags: [],
                poster: {
                    srcset: $(element).find('.poster-container img').attr('srcset'),
                    src: $(element).find('.poster-container img').attr('src'),
                    alt: $(element).find('.poster-container img').attr('alt'),
                    width: $(element).find('.poster-container img').attr('width'),
                    height: $(element).find('.poster-container img').attr('height'),
                    loading: $(element).find('.poster-container img').attr('loading'),
                    decoding: $(element).find('.poster-container img').attr('decoding')
                },
                episodeCountdown: {
                    scheduleId: $(element).find('.episode-countdown').attr('data-schedule-id'),
                    releaseInfo: $(element).find('.release-schedule-info').text().trim(),
                    countdown: $(element).find('time.text-bold').text().trim(),
                    timestamp: $(element).find('time.text-bold').attr('data-timestamp')
                },
                avgUserRating: $(element).find('.anime-avg-user-rating').text().trim(),
                studios: [],
                animeDate: $(element).find('.anime-date').text().trim(),
                metadata: {
                    source: $(element).find('.anime-source').text().trim(),
                    episodes: $(element).find('.anime-episodes').text().trim()
                },
                synopsis: $(element).find('.anime-synopsis p').text().trim(),
                relatedLinks: {}
            };

            $(element).find('.anime-card--mark-menu--item').each((i, el) => {
                anime.markMenu.items.push({
                    status: $(el).attr('data-library-status'),
                    text: $(el).text().trim()
                });
            });

            $(element).find('.anime-tags a').each((i, el) => {
                anime.tags.push($(el).text().trim());
            });

            $(element).find('.anime-studios a').each((i, el) => {
                anime.studios.push({
                    name: $(el).text().trim(),
                    link: $(el).attr('href')
                });
            });

            $(element).find('.related-links .icon-buttons-set a').each((i, el) => {
                const className = $(el).attr('class').replace('-icon', '');
                anime.relatedLinks[className] = $(el).attr('href');
            });

            animeList.push(anime);
        });

        console.log(animeList);
        return animeList;
    } catch (error) {
        console.error('Error fetching anime data:', error);
    }
}

fetchAnimeData();
