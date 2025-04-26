const WebSocket = require('ws');
const { getAllOpenPositions, closePosition, isPositionOpen } = require('../trading/positionController');
const { DEBUG_MODE } = require('../config/config');

const activeSockets = new Map();

function startWebSocketFor(symbol, onData) {
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_1m`;

    if (activeSockets.has(symbol)) {
        console.log(`🔁 WebSocket déjà actif pour ${symbol}`);
        return;
    }

    const ws = new WebSocket(wsUrl);

    ws.on('open', () => {
        if (DEBUG_MODE) {
            console.log(`✅ WebSocket ouvert pour ${symbol}`);
        }
    });

    ws.on('message', (data) => {
        const json = JSON.parse(data);
        const price = parseFloat(json.k.c); // prix de clôture live
        const volume = parseFloat(json.k.v);

        onData(symbol, price, volume, json);
        handleLiveTick(symbol, price); // <== intégration ici
    });

    ws.on('close', () => {
        console.log(`❌ WebSocket fermé pour ${symbol}`);
        activeSockets.delete(symbol);
    });

    ws.on('error', (err) => {
        console.error(`⚠️ WebSocket erreur ${symbol} : ${err.message}`);
    });

    activeSockets.set(symbol, ws);
}

function stopWebSocketFor(symbol) {
    const ws = activeSockets.get(symbol);
    if (ws) {
        ws.close();
        activeSockets.delete(symbol);
        if (DEBUG_MODE) {
            console.log(`🛑 Fermeture WebSocket pour ${symbol}`);
        }
    }
}

function stopAllSockets() {
    for (const symbol of activeSockets.keys()) {
        stopWebSocketFor(symbol);
    }
}

function watchScalpables(symbols, onData) {
    if (!Array.isArray(symbols) || symbols.length === 0) return;

    const limit = 50;
    const scalpList = symbols.slice(0, limit);

    // 🔒 Récupérer les positions ouvertes
    const locked = getAllOpenPositions().map(p => p.symbol);

    // 👇 Ne pas fermer les WebSockets des actifs verrouillés
    const keepAlive = new Set(locked);

    // Fermer uniquement ceux qui ne sont plus scalpables ET pas en trade
    for (const [symbol, socket] of activeSockets.entries()) {
        if (!scalpList.includes(symbol) && !keepAlive.has(symbol)) {
            stopWebSocketFor(symbol);
        }
    }

    // Ouvrir tous ceux qui sont nouveaux ou manquants
    const toWatch = [...new Set([...scalpList, ...locked])];
    for (const symbol of toWatch) {
        startWebSocketFor(symbol, onData);
    }
}


function handleLiveTick(symbol, price) {
    const pos = getAllOpenPositions().find(p => p.symbol === symbol);
    if (!pos) return;

    const hitTP = pos.direction === 'buy' && price >= pos.tp;
    const hitSL = pos.direction === 'buy' && price <= pos.sl;
    const hitTPShort = pos.direction === 'sell' && price <= pos.tp;
    const hitSLShort = pos.direction === 'sell' && price >= pos.sl;

    if (hitTP || hitSL || hitTPShort || hitSLShort) {
        console.log(`⚡️ TP/SL atteint pour ${symbol} → Fermeture à ${price}`);
        closePosition(symbol, price);
    }
}

module.exports = {
    startWebSocketFor,
    stopWebSocketFor,
    stopAllSockets,
    watchScalpables,
    handleLiveTick
};
