const axios = require('axios');
const { getIndicatorsFromKlines } = require('../core/indicators');

async function analyzeLiveAsset(symbol) {
    try {
        const res = await axios.get('https://api.binance.com/api/v3/klines', {
            params: {
                symbol,
                interval: '1m',
                limit: 60
            }
        });

        const klines = res.data;
        const indicators = getIndicatorsFromKlines(klines);
        const lastPrice = parseFloat(klines[klines.length - 1][4]);

        console.log(`📊 Analyse de ${symbol}`);
        console.log(`Dernier prix : ${lastPrice}`);
        console.log(`EMA9         : ${indicators.ema9}`);
        console.log(`EMA21        : ${indicators.ema21}`);
        console.log(`RSI(7)       : ${indicators.rsi}`);
        console.log(`VWAP         : ${indicators.vwap}`);
        console.log(`Tendance     :`, indicators.ema9 > indicators.ema21 ? '📈 Hausse' : '📉 Baisse');
        console.log(`Prix vs VWAP :`, lastPrice > indicators.vwap ? '⬆️  Au-dessus' : '⬇️  En dessous');
        console.log(`Force RSI    :`, indicators.rsi > 70 ? '🔥 Suracheté' : indicators.rsi < 30 ? '🧊 Survendu' : '✅ Neutre');

    } catch (err) {
        console.error(`❌ Erreur lors de l’analyse de ${symbol} : ${err.message}`);
    }
}

module.exports = { analyzeLiveAsset };
