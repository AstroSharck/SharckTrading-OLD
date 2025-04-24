// marketStatus.js
const checkVolatility = require('./volatilityChecker');
const fetchNews = require('./newsFetcher');

async function isMarketScalpable() {
    const volatility = await checkVolatility();
    const news = await fetchNews();

    // Logique simple de décision (à affiner plus tard)
    const marketIsStable = !news.includes('crash') && !news.includes('high risk');
    const marketHasVolatility = volatility >= 0.5; // À ajuster selon ton échelle

    return marketHasVolatility && marketIsStable;
}

module.exports = { isMarketScalpable };
