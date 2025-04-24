function isScalpable({ volatility, volume, spread }) {
    const minVolatility = 1.0;     // % sur 1h
    const minVolume = 100_000;     // moyen sur 1h
    const maxSpread = 0.2;         // % écart bid/ask

    return volatility >= minVolatility &&
        volume >= minVolume &&
        spread <= maxSpread;
}

function getScalpScore({ volatility, volume, spread }) {
    let score = 0;

    if (volatility >= 1) score += 1;
    if (volatility >= 2) score += 1;

    if (volume >= 100_000) score += 1;
    if (volume >= 1_000_000) score += 1;

    if (spread < 0.2) score += 1;
    if (spread < 0.1) score += 1;

    return score; // sur 6
}

module.exports = {
    isScalpable,
    getScalpScore
};
