const { getScalpableAssets } = require('./scanner/binanceScanner');
const { watchScalpables } = require('./scanner/socketManager');

let currentSymbols = [];

async function updateScalpablesLive() {
    console.log("🔁 Scan live du marché en cours...");

    const assets = await getScalpableAssets({ verbose: false });

    if (!assets || assets.length === 0) {
        console.log("⚠️ Aucun actif scalpable détecté. Attente avant prochain scan.");
        return;
    }

    // Juste les symboles à suivre en live
    const symbols = assets.map(a => a.symbol);
    console.table(assets.map(a => ({
        symbol: a.symbol,
        volatility: a.volatility,
        volume: a.volume,
        spread: a.spread,
        score: a.score
    })));

    // Appliquer les sockets seulement si la liste a changé
    if (symbols.join(',') !== currentSymbols.join(',')) {
        currentSymbols = symbols;
        watchScalpables(symbols, (symbol, price, volume, raw) => {
            console.log(`📈 ${symbol} | prix: ${price} | volume: ${volume}`);
        });
    } else {
        console.log("⏸️ Pas de changement, sockets inchangés.");
    }
}

// Lancer une première fois immédiatement
updateScalpablesLive();

// Puis toutes les 5 minutes
setInterval(updateScalpablesLive, 5 * 60 * 1000);
