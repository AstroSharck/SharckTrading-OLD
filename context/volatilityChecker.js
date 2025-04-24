const axios = require('axios');
const limit = require('p-limit')(5);

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

async function getAllUSDTMarkets() {
    try {
        const res = await axios.get('https://api.binance.com/api/v3/exchangeInfo');
        return res.data.symbols
            .filter(s => s.symbol.endsWith('USDT') && s.status === 'TRADING' && s.quoteAsset === 'USDT')
            .map(s => s.symbol);
    } catch (err) {
        console.error('[getAllUSDTMarkets] Erreur :', err.message);
        return [];
    }
}

async function calculateAssetData(symbol) {
    try {
        const klineRes = await axios.get('https://api.binance.com/api/v3/klines', {
            params: { symbol, interval: '1m', limit: 60 }
        });

        const prices = klineRes.data.map(c => parseFloat(c[4]));
        const volumes = klineRes.data.map(c => parseFloat(c[5]));
        const max = Math.max(...prices);
        const min = Math.min(...prices);
        const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
        const volatility = ((max - min) / min) * 100;

        const depthRes = await axios.get('https://api.binance.com/api/v3/depth', {
            params: { symbol, limit: 5 }
        });

        const bestBid = parseFloat(depthRes.data.bids[0][0]);
        const bestAsk = parseFloat(depthRes.data.asks[0][0]);
        const spread = ((bestAsk - bestBid) / bestBid) * 100;

        const scalpable = volatility > 1 && avgVolume > 100000 && spread < 0.2;

        return {
            symbol,
            volatility: parseFloat(volatility.toFixed(2)),
            volume: Math.round(avgVolume),
            spread: parseFloat(spread.toFixed(3)),
            scalpable
        };
    } catch (err) {
        console.warn(`[${symbol}] Erreur : ${err.message}`);
        return null;
    }
}

async function processAll(symbols, batchSize = 20) {
    const results = [];
    for (let i = 0; i < symbols.length; i += batchSize) {
        const batch = symbols.slice(i, i + batchSize);
        console.log(`🔄 Traitement batch ${i / batchSize + 1} / ${Math.ceil(symbols.length / batchSize)}...`);

        const batchResults = await Promise.all(
            batch.map(symbol => limit(() => calculateAssetData(symbol)))
        );

        const success = batchResults.filter(Boolean).length;
        const fail = batch.length - success;
        console.log(`✅ Succès : ${success} | ❌ Erreurs : ${fail}`);
        results.push(...batchResults.filter(Boolean));

        await new Promise(r => setTimeout(r, 500)); // petite pause
    }
    return results;
}

async function checkVolatility({ returnFullList = false } = {}) {
    const markets = shuffle(await getAllUSDTMarkets());

    console.log(`🎯 Cryptos détectées : ${markets.length}`);
    const allResults = await processAll(markets);

    if (returnFullList) return allResults;

    const avgVol = allResults.reduce((sum, r) => sum + r.volatility, 0) / allResults.length;
    return parseFloat(avgVol.toFixed(2));
}

module.exports = checkVolatility;
