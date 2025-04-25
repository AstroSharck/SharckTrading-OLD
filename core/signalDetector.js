function analyzeIndicators({ price, ema9, ema21, rsi, vwap }) {
    // 🔁 Sanity check
    if ([price, ema9, ema21, rsi, vwap].some(v => v === undefined || isNaN(v))) {
        return {
            error: true,
            reason: "Données incomplètes ou invalides"
        };
    }

    // 📈 Détection de la tendance via EMA
    const trend =
        ema9 > ema21 ? 'up' :
            ema9 < ema21 ? 'down' :
                'neutral';

    // 📊 Position du prix par rapport au VWAP
    const positionVsVWAP =
        price > vwap ? 'above' :
            price < vwap ? 'below' :
                'on';

    // 💪 Interprétation RSI
    const rsiSignal =
        rsi >= 70 ? 'overbought' :
            rsi <= 30 ? 'oversold' :
                'neutral';

    // 🧠 Détection de setup possible pour un BUY
    const readyToBuy =
        trend === 'up' &&
        positionVsVWAP === 'above' &&
        rsi > 35 && rsi < 70;

    // 🧠 Détection de setup possible pour un SELL
    const readyToSell =
        trend === 'down' &&
        positionVsVWAP === 'below' &&
        rsi < 65 && rsi > 30;

    return {
        price,
        ema9,
        ema21,
        rsi,
        vwap,
        trend,
        positionVsVWAP,
        rsiSignal,
        readyToBuy,
        readyToSell,
        summary: readyToBuy ? '✅ BUY' : readyToSell ? '⚠️ SELL' : '❌ WAIT'
    };
}

module.exports = { analyzeIndicators };
