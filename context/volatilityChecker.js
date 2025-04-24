const axios = require('axios');

async function getAllUSDTMarkets() {
    try {
        const res = await axios.get('https://api.binance.com/api/v3/exchangeInfo');
        const symbols = res.data.symbols
            .filter(s => s.symbol.endsWith('USDT') && s.status === 'TRADING' && s.quoteAsset === 'USDT')
            .map(s => s.symbol);
        return symbols;
    } catch (err) {
        console.error('[getAllUSDTMarkets] Error:', err.message);
        return [];
    }
}

async function calculateAssetData(symbol) {
    try {
        const klinesRes = await axios.get(`https://api.binance.com/api/v3/klines`, {
            params: { symbol, interval: '1m', limit: 60 }
        });

        const prices = klinesRes.data.map(c => parseFloat(c[4])); // close prices
        const volumes = klinesRes.data.map(c => parseFloat(c[5])); // volume

        const maxPrice = Math.max(...prices);
        const minPrice = Math.min(...prices);
        const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
        const volatility = ((maxPrice - minPrice) / minPrice) * 100;

        const depthRes = await axios.get(`https://api.binance.com/api/v3/depth`, {
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
        return null;
    }
}

async function checkVolatility({ topLimit = 50, returnFullList = false } = {}) {
    const markets = await getAllUSDTMarkets();
    console.log(`[checkVolatility] Found ${markets.length} USDT markets.`);
    const topMarkets = markets.slice(0, topLimit);

    const results = await Promise.all(topMarkets.map(s => calculateAssetData(s)));
    const cleanResults = results.filter(Boolean);

    if (returnFullList) return cleanResults;

    const avgVolatility = cleanResults.reduce((sum, a) => sum + a.volatility, 0) / cleanResults.length;
    return parseFloat(avgVolatility.toFixed(2));
}

module.exports = checkVolatility;