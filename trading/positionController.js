const { logTradeOpen } = require('./tradeLogger');
const { logTradeClose } = require('../trading/tradeLogger');

const openPositions = new Map();

function openPosition(symbol, direction, entryPrice, options = {}) {
    if (openPositions.has(symbol)) {
        console.log(`🚫 ${symbol} déjà en position → ouverture bloquée`);
        return;
    }

    const tpPct = options.tp || 2; // future évolution ici : adaptatif
    const slPct = options.sl || 1;

    const tp = direction === 'buy'
        ? entryPrice * (1 + tpPct / 100)
        : entryPrice * (1 - tpPct / 100);

    const sl = direction === 'buy'
        ? entryPrice * (1 - slPct / 100)
        : entryPrice * (1 + slPct / 100);

    openPositions.set(symbol, {
        direction,
        entryPrice,
        tp,
        sl,
        openTime: Date.now()
    });

    logTradeOpen({
        symbol,
        direction,
        entryPrice,
        tp,
        sl,
        openTime: Date.now()
    });

    console.log(`🟢 Position ouverte sur ${symbol} (${direction}) à ${entryPrice} | TP: ${tp.toFixed(8)} | SL: ${sl.toFixed(8)}`);
}



function closePosition(symbol, exitPrice) {
    const position = openPositions.get(symbol);
    if (!position) return;

    const entryPrice = parseFloat(position.entryPrice);
    exitPrice = parseFloat(exitPrice);
    const direction = position.direction;

    const rawPnl = direction === 'buy'
        ? exitPrice - entryPrice
        : entryPrice - exitPrice;

    const pnl = parseFloat(rawPnl.toFixed(8));
    const pnlPct = parseFloat(((pnl / entryPrice) * 100).toFixed(2));

    console.log(`🔴 Position fermée sur ${symbol} à ${exitPrice}`);
    console.log(`📊 PnL ${pnl >= 0 ? '+' : ''}${pnl} (${pnlPct}%)`);

    logTradeClose(symbol, exitPrice, pnlPct, 'TP/SL');

    openPositions.delete(symbol);
}

function isPositionOpen(symbol) {
    return openPositions.has(symbol);
}

function getAllOpenPositions() {
    return Array.from(openPositions.entries()).map(([symbol, pos]) => ({
        symbol,
        ...pos
    }));
}

module.exports = {
    openPosition,
    closePosition,
    isPositionOpen,
    getAllOpenPositions
};
