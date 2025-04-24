const { getScalpableAssets } = require('./scanner/binanceScanner');

(async () => {
    console.log("🔍 Vérification des actifs scalpables sur Binance...");
    const scalpables = await getScalpableAssets();
})();
