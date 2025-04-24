const { isMarketScalpable } = require('./context/marketStatus');

(async () => {
    const { marketOk, scalpables } = await isMarketScalpable();

    if (marketOk) {
        console.log("✅ Le marché est propice au scalping !");
        console.table(scalpables.map(a => ({
            symbol: a.symbol,
            volatility: a.volatility,
            volume: a.volume,
            spread: a.spread
        })));
    } else {
        console.log("⛔ Marché inadapté au scalping actuellement.");
    }
})();
