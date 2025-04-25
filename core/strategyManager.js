const { getKlines } = require('../utils/getKlines');
const { getIndicatorsFromKlines } = require('./indicators');
const { analyzeIndicators } = require('./signalDetector');

/**
 * Analyse un seul actif complet
 */
async function analyzeSymbol(symbol) {
    const klines = await getKlines(symbol, '1m', 60);

    if (!klines || klines.length === 0) {
        return { symbol, error: true, reason: 'Klines indisponibles' };
    }

    const price = parseFloat(klines[klines.length - 1][4]);
    const indicators = getIndicatorsFromKlines(klines);
    const signal = analyzeIndicators({ price, ...indicators });

    return {
        symbol,
        price,
        ...signal
    };
}

/**
 * Analyse une liste de symboles, retourne ceux avec signaux clairs
 */
async function analyzeMultiple(symbols) {
    const results = [];

    for (const symbol of symbols) {
        const result = await analyzeSymbol(symbol);
        if (!result.error) results.push(result);
    }

    // Trier avec priorité : BUY > SELL > WAIT
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
