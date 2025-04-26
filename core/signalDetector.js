function analyzeIndicators({ price, ema9, ema21, rsi, vwap, candles = [], volume, globalMarketIsGood = true }) {
    const result = {
        trend: ema9 > ema21 ? 'up' : 'down',
        positionVsVWAP: price > vwap ? 'above' : 'below',
        rsiSignal: rsi > 70 ? 'overbought' : rsi < 30 ? 'oversold' : 'neutral',
        rsi, // 🔥 ajoute RSI brut au retour pour tryEnterTrade
    };

    let trendScore = 0;
    let momentumScore = 0;
    let timingScore = 0;
    let contextScore = 0;

    // TREND
    if (ema9 > ema21) trendScore++;
    if (Math.abs(ema9 - ema21) / ema21 > 0.002) trendScore++;
    if (price > vwap) trendScore++;

    // MOMENTUM
    if (rsi > 50 && rsi < 65) momentumScore++;
    const lastCandle = candles[candles.length - 1];
    const body = Math.abs(lastCandle.close - lastCandle.open);
    const range = lastCandle.high - lastCandle.low;
    if (body / range > 0.5 && lastCandle.close > lastCandle.open) momentumScore++;
    if (volume && lastCandle.volume > lastCandle.volumeAvg) momentumScore++;

    // TIMING
    if (body / range > 0.3 && range > 0.002 * lastCandle.close) timingScore++;
    if (candles.slice(-3).some(c => c.close > c.open)) timingScore++;

    // CONTEXTE
    if (globalMarketIsGood) contextScore++;
    if (lastCandle.volatilityScore > 0.5) contextScore++;

    const totalScore = trendScore + momentumScore + timingScore + contextScore;

    const summary =
        totalScore >= 7 ? '✅ BUY' :
            totalScore >= 5 ? '❌ WAIT' :
                '⚠️ SELL';

    return {
        ...result,
        trendScore,
        momentumScore,
        timingScore,
        contextScore,
        totalScore,
        summary,
        readyToBuy: summary === '✅ BUY',
        readyToSell: summary === '⚠️ SELL'
    };
}

module.exports = { analyzeIndicators };
