const fs = require('fs');
const path = require('path');

const historyPath = path.join(__dirname, '../data/trade_history.json');

// S'assurer que le fichier existe
if (!fs.existsSync(historyPath)) {
    fs.writeFileSync(historyPath, JSON.stringify([]));
}

// Charger les trades existants
function loadTradeHistory() {
    const data = fs.readFileSync(historyPath);
    return JSON.parse(data);
}

// Sauver l'historique
function saveTradeHistory(trades) {
    fs.writeFileSync(historyPath, JSON.stringify(trades, null, 2));
}

// Ajouter un nouveau trade (à l'ouverture)
function logTradeOpen(trade) {
    const history = loadTradeHistory();
    history.push(trade);
    saveTradeHistory(history);
}

// Mettre à jour un trade à la fermeture
function logTradeClose(symbol, closePrice, pnlPct, result) {
    const history = loadTradeHistory();
    const trade = history.find(t => t.symbol === symbol && !t.closeTime);

    if (trade) {
        trade.closePrice = closePrice;
        trade.closeTime = Date.now();
        trade.pnlPct = pnlPct;
        trade.result = result;
        saveTradeHistory(history);
    } else {
        console.warn(`⚠️ Impossible de trouver la position ouverte pour ${symbol}`);
    }
}

module.exports = {
    logTradeOpen,
    logTradeClose
};
