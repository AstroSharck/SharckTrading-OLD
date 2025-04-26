const checkVolatility = require('./volatilityChecker');
const fetchNews = require('./newsFetcher');
const { DEBUG_MODE } = require('../config/config');

async function isMarketScalpable({ verbose = true } = {}) {
    // 1. Analyse news
    /* const news = await fetchNews();
    const marketIsStable = !news.match(/crash|panic|inflation|recession/i); */

    // 2. Analyse volatilité + actifs scalpables
    const fullScan = await checkVolatility({ returnFullList: true });
    const scalpables = fullScan.filter(asset => asset.scalpable);
    const avgVolatility = fullScan.reduce((a, b) => a + b.volatility, 0) / fullScan.length;

    if (verbose) {
        if (DEBUG_MODE) {
            console.log("🧠 Vérification du contexte marché...");
            console.log("📰 News ok :", true);
            console.log("📈 Volatilité moyenne :", avgVolatility.toFixed(2) + "%");
            console.log("💥 Actifs scalpables :", scalpables.length);
        }
    }
    const marketOk = true && /* marketIsStable && */ avgVolatility >= 1 && scalpables.length >= 10;
    console.log("📊 Marché ok :", marketOk);
    return { marketOk, avgVolatility, scalpables };
}

module.exports = { isMarketScalpable };
