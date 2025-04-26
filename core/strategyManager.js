const { getKlines } = require('../utils/getKlines');
const { getIndicatorsFromKlines } = require('./indicators');
const { analyzeIndicators } = require('./signalDetector');
const { DEBUG_MODE } = require('../config/config');

/**
 * Analyse un seul actif complet
 */
async function analyzeSymbol(symbol, globalMarketIsGood = true) {
    const klines = await getKlines(symbol, '1m', 60);

    if (!klines || klines.length === 0) {
        return { symbol, error: true, reason: 'Klines indisponibles' };
    }

    const price = parseFloat(klines[klines.length - 1][4]);
    const indicators = getIndicatorsFromKlines(klines);

    if (DEBUG_MODE) {
        console.log(`🔍 [${symbol}] EMA9: ${indicators.ema9}, EMA21: ${indicators.ema21}, RSI: ${indicators.rsi}`);
    }

    // 🔁 On formate les bougies
    const candles = klines.map(c => ({
        open: parseFloat(c[1]),
        high: parseFloat(c[2]),
        low: parseFloat(c[3]),
        close: parseFloat(c[4]),
        volume: parseFloat(c[5]),
        timestamp: parseInt(c[0])
    }));

    // 🧠 On passe les candles à la fonction d’analyse
    const signal = analyzeIndicators({ price, ...indicators, candles, globalMarketIsGood });

    return {
        symbol,
        price,
        rsi: indicators.rsi, // <<< ajoute RSI ici
        ...signal
    };
}


/**
 * Analyse une liste de symboles, retourne ceux avec signaux clairs
 */
async function analyzeMultiple(assets, globalMarketIsGood = true) {
    const results = [];

    for (const asset of assets) {
        console.log(`🔍 Tentative analyse de : ${asset.symbol}`);
        const result = await analyzeSymbol(asset.symbol, globalMarketIsGood);

        if (result && !result.error) {
            console.log(`✅ Analyse OK pour : ${asset.symbol}`);
            results.push(result);
        } else {
            console.warn(`⚠️ Erreur ou résultat vide pour : ${asset.symbol}`);
        }
    }

    console.log(`📦 Résultats valides trouvés : ${results.length}`);

    const sorted = results.sort((a, b) => {
        if (a.readyToBuy) return -1;
        if (b.readyToBuy) return 1;
        if (a.readyToSell) return -1;
        if (b.readyToSell) return 1;
        return 0;
    });

    return sorted;
}

module.exports = {
    analyzeSymbol,
    analyzeMultiple
};
