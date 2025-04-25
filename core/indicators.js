const ti = require('technicalindicators');

function getEMA(values, period = 9) {
    return ti.EMA.calculate({ period, values });
}

function getRSI(values, period = 7) {
    return ti.RSI.calculate({ values, period });
}

function getVWAP(highs, lows, closes, volumes) {
    return ti.VWAP.calculate({
        close: closes,
        high: highs,
        low: lows,
        volume: volumes
    });
}

function getIndicatorsFromKlines(klines) {
    const closes = klines.map(c => parseFloat(c[4]));
    const highs = klines.map(c => parseFloat(c[2]));
    const lows = klines.map(c => parseFloat(c[3]));
    const volumes = klines.map(c => parseFloat(c[5]));

    const ema9 = getEMA(closes, 9);
    const ema21 = getEMA(closes, 21);
    const rsi = getRSI(closes, 7);
    const vwap = getVWAP(highs, lows, closes, volumes);

    return {
        ema9: ema9[ema9.length - 1],
        ema21: ema21[ema21.length - 1],
        rsi: rsi[rsi.length - 1],
        vwap: vwap[vwap.length - 1]
    };
}

module.exports = {
    getEMA,
    getRSI,
    getVWAP,
    getIndicatorsFromKlines
};
