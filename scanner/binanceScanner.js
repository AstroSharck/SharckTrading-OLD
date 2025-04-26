const { isMarketScalpable } = require('../context/marketStatus');

async function getScalpableAssets({ verbose = true } = {}) {
    const { marketOk, scalpables } = await isMarketScalpable({ verbose });

    if (verbose) {
        console.log(`📦 ${scalpables.length} actifs trouvés.`);
        console.log(`📈 Marché global : ${marketOk ? 'OK' : 'Limite'}`);
    }

    // Retourner TOUJOURS les scalpables trouvés, même si marketOk est false
    return { marketOk, scalpables };
}

module.exports = { getScalpableAssets };
