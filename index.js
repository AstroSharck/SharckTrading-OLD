const { getScalpableAssets } = require('./scanner/binanceScanner');
const { analyzeMultiple } = require('./core/strategyManager');
const { tryEnterTrade } = require('./trading/tradeManager');
const { watchScalpables } = require('./scanner/socketManager');

let currentSymbols = [];

async function loopTrade() {
    console.log("🔁 [loopTrade] Scan marché + stratégie...");

    const assets = await getScalpableAssets();
    const symbols = assets.map(a => a.symbol);

    // Lancer WebSocket uniquement si les symboles ont changé
    if (symbols.join(',') !== currentSymbols.join(',')) {
        currentSymbols = symbols;
        watchScalpables(symbols, (symbol, price) => {
            const { handleLiveTick } = require('./scanner/socketManager');
            handleLiveTick(symbol, price);
        });
    }

    // Analyser les actifs et tenter d'entrer en position
    const results = await analyzeMultiple(symbols);

    for (const asset of results) {
        tryEnterTrade(asset.symbol, asset);
    }

    console.log(`✅ ${results.length} actifs analysés.`);
}

// Lancer immédiatement
loopTrade();

// Puis toutes les 5 minutes
setInterval(loopTrade, 5 * 60 * 1000);
