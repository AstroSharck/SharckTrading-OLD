const checkVolatility = require('./volatilityChecker');
const fetchNews = require('./newsFetcher');

async function isMarketScalpable({ verbose = true } = {}) {
    // 1. Analyse news
    const news = await fetchNews();
    const marketIsStable = !news.match(/crash|panic|inflation|recession/i);

    // 2. Analyse volatilité + actifs scalpables
    const fullScan = await checkVolatility({ returnFullList: true });
    const scalpables = fullScan.filter(asset => asset.scalpable);
    const avgVolatility = fullScan.reduce((a, b) => a + b.volatility, 0) / fullScan.length;

    if (verbose) {
        console.log("🧠 Vérification du contexte marché...");
        console.log("📰 News ok :", marketIsStable);
        console.log("📈 Volatilité moyenne :", avgVolatility.toFixed(2) + "%");
        console.log("💥 Actifs scalpables :", scalpables.length);
    }

    const marketOk = marketIsStable && avgVolatility >= 1 && scalpables.length >= 10;
    return { marketOk, avgVolatility, scalpables };
}

module.exports = { isMarketScalpable };
