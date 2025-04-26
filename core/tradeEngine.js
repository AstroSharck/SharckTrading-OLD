const { getScalpableAssets } = require('../scanner/binanceScanner');
const { analyzeMultiple } = require('./strategyManager');
const { getKlines } = require('../utils/getKlines');
const { tryEnterTrade } = require('../trading/tradeManager');
const { watchScalpables, handleLiveTick } = require('../scanner/socketManager');
const { getIndicatorsFromKlines } = require('../core/indicators');
const { analyzeIndicators } = require('../core/signalDetector');

const { DEBUG_MODE } = require('../config/config');

let activeSymbols = [];

async function loopTrade() {
    if (DEBUG_MODE) console.log('🔄 Démarrage du loop de trading...');

    const { marketOk, scalpables } = await getScalpableAssets({ verbose: true });

    if (!marketOk || scalpables.length === 0) {
        console.log('❌ Marché pas intéressant ou aucun actif scalpable.');
        return;
    }

    activeSymbols = scalpables.map(a => a.symbol);

    const analysis = await analyzeMultiple(scalpables, marketOk);

    for (const result of analysis) {
        tryEnterTrade(result.symbol, result);
    }

    // Démarrer/mettre à jour les WebSockets avec tick handler
    watchScalpables(activeSymbols, handleTick);
}

/**
 * Tick live WebSocket
 */
const liveBuffers = {}; // stockage en mémoire rapide

async function handleTick(symbol, price, volume, tick) {
    if (!liveBuffers[symbol]) {
        liveBuffers[symbol] = [];
    }

    liveBuffers[symbol].push({
        price: price,
        timestamp: Date.now()
    });

    // Ne garder que les 60 dernières secondes
    const now = Date.now();
    liveBuffers[symbol] = liveBuffers[symbol].filter(p => (now - p.timestamp) < 60000);

    // Détecter mouvement
    detectMovement(symbol);
}

const lastAnalysisTimestamps = {};

async function detectMovement(symbol) {
    const buffer = liveBuffers[symbol];
    if (!buffer || buffer.length < 5) return;

    const now = Date.now();

    // Vérifie cooldown : 2 min = 120000ms
    if (lastAnalysisTimestamps[symbol] && (now - lastAnalysisTimestamps[symbol]) < 120000) {
        if (DEBUG_MODE) /* console.log(`⏳ Cooldown actif pour ${symbol}, pas de réanalyse.`); */
        return;
    }

    const prices = buffer.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const movePercent = ((maxPrice - minPrice) / minPrice) * 100;

    if (movePercent >= 0.3) {
        console.log(`⚡ Mouvement détecté sur ${symbol} (${movePercent.toFixed(2)}%) ➔ Réanalyse immédiate !`);

        // 🔥 Met à jour le dernier refresh
        lastAnalysisTimestamps[symbol] = now;

        const klines = await getKlines(symbol, '1m', 60);
        const indicators = getIndicatorsFromKlines(klines);
        const priceNow = parseFloat(klines[klines.length - 1][4]);
        const signal = analyzeIndicators({ price: priceNow, ...indicators, candles: klines });

        tryEnterTrade(symbol, signal);

        // Reset buffer pour éviter du spam inutile
        liveBuffers[symbol] = [];
    }
}



/**
 * Lancement moteur
 */
function startEngine() {
    loopTrade();
    setInterval(loopTrade, 5 * 60 * 1000); // Redémarre la loop toutes les 5 minutes
}

module.exports = { startEngine };
