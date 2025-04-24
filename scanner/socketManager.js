const WebSocket = require('ws');

const activeSockets = new Map();

function startWebSocketFor(symbol, onData) {
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_1m`;

    if (activeSockets.has(symbol)) {
        console.log(`🔁 WebSocket déjà actif pour ${symbol}`);
        return;
    }

    const ws = new WebSocket(wsUrl);

    ws.on('open', () => {
        console.log(`🔌 WebSocket ouvert pour ${symbol}`);
    });

    ws.on('message', (data) => {
        const json = JSON.parse(data);
        const price = parseFloat(json.k.c); // close price
        const volume = parseFloat(json.k.v); // volume 1m
        onData(symbol, price, volume, json);
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
        console.log(`🛑 Fermeture WebSocket pour ${symbol}`);
    }
}

function stopAllSockets() {
    for (const symbol of activeSockets.keys()) {
        stopWebSocketFor(symbol);
    }
}

function watchScalpables(symbols, onData) {
    const limit = 50; // sécurité anti-flood
    stopAllSockets();

    const list = symbols.slice(0, limit);
    for (const symbol of list) {
        startWebSocketFor(symbol, onData);
    }
}

module.exports = {
    startWebSocketFor,
    stopWebSocketFor,
    stopAllSockets,
    watchScalpables
};
