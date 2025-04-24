const { isMarketScalpable } = require('../context/marketStatus');

async function getScalpableAssets({ verbose = true } = {}) {
    const { marketOk, scalpables } = await isMarketScalpable({ verbose });

    if (!marketOk) {
        if (verbose) console.log('⛔ Marché inadapté au scalping. Aucun actif sélectionné.');
        return [];
    }

    console.table(
        scalpables.map(a => ({
            symbol: a.symbol,
            volatility: a.volatility,
            volume: a.volume,
            spread: a.spread,
            score: a.score
        }))
    );


    if (verbose) {
        /* console.log(`✅ ${symbols.length} actifs sélectionnés pour le scalping :`);
        console.log(symbols.join(', ')); */
    }

    /* return symbols; */
}

module.exports = { getScalpableAssets };
