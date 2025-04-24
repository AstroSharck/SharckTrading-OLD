const checkVolatility = require('./context/volatilityChecker');

(async () => {
    const results = await checkVolatility({ returnFullList: true });

    const scalpables = results.filter(r => r.scalpable);
    console.table(scalpables);
})();