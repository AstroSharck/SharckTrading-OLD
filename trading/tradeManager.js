const { openPosition, isPositionOpen } = require('./positionController');
const { DEBUG_MODE } = require('../config/config');

function tryEnterTrade(symbol, signal) {
    const { readyToBuy, readyToSell, totalScore, rsi } = signal;

    const minScoreBuy = 6; // score minimum pour BUY
    const minScoreSell = 5; // score minimum pour SELL

    // 🚫 Score Minimum Check
    if (readyToBuy && totalScore < minScoreBuy) {
        console.log(`⛔ ${symbol} - Score trop faible pour BUY (${totalScore} < ${minScoreBuy})`);
        return;
    }
    if (readyToSell && totalScore < minScoreSell) {
        console.log(`⛔ ${symbol} - Score trop faible pour SELL (${totalScore} < ${minScoreSell})`);
        return;
    }

    // 🚫 RSI Sécurité Check
    if (readyToBuy && rsi !== undefined && rsi > 70) {
        console.log(`⛔ ${symbol} - RSI trop élevé pour BUY (rsi=${rsi})`);
        return;
    }
    if (readyToSell && rsi !== undefined && rsi < 30) {
        console.log(`⛔ ${symbol} - RSI trop faible pour SELL (rsi=${rsi})`);
        return;
    }

    // ✅ Ouverture
    if (readyToBuy) {
        console.log(`🟢 OUVERTURE BUY sur ${symbol} (score: ${totalScore}, rsi: ${rsi})`);
        openPosition(symbol, 'buy', signal.price);
    } else if (readyToSell) {
        console.log(`🔴 OUVERTURE SELL sur ${symbol} (score: ${totalScore}, rsi: ${rsi})`);
        openPosition(symbol, 'sell', signal.price);
    } else {
        console.log(`⏳ Aucune condition valide pour ${symbol}`);
    }
}


module.exports = {
    tryEnterTrade
};