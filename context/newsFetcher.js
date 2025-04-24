const axios = require('axios');
require('dotenv').config(); // pour API_KEY

async function fetchNews() {
    try {
        const res = await axios.get('https://newsdata.io/api/1/news', {
            params: {
                apikey: process.env.NEWSDATA_API_KEY,
                language: 'en',
                category: 'business,top',
                q: 'market OR crypto OR inflation OR fed OR economy',
                country: 'us'
            }
        });

        const headlines = res.data.results.map(article => article.title).slice(0, 10);
        return headlines.join(' | ').toLowerCase();
    } catch (err) {
        console.error('[NewsFetcher] Erreur :', err.message);
        return '';
    }
}

module.exports = fetchNews;
