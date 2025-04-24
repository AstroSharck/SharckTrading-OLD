const { isMarketScalpable } = require('../context/marketStatus');

async function getScalpableAssets({ verbose = true } = {}) {
    const { marketOk, scalpables } = await isMarketScalpable({ verbose });

    if (!marketOk) {
        if (verbose) console.log('⛔ Marché inadapté au scalping. Aucun actif sélectionné.');
        return [];
    }

    const symbols = scalpables.map(a => a.symbol);

    if (verbose) {
        /* console.log(`✅ ${symbols.length} actifs sélectionnés pour le scalping :`);
        console.log(symbols.join(', ')); */
    }

    return scalpables;
}

module.exports = { getScalpableAssets };
