const fs = require('fs');
const path = require('path');

const data = fs.readFileSync(path.join(__dirname, 'data', 'trade_history.json'), 'utf-8');
const trades = JSON.parse(data);

let capital = 100; // Capital initial
let capitalEvolution = [{ time: 0, capital }];

for (const trade of trades) {
    if (trade.closePrice) {
        const pnl = trade.pnlPct / 100;
        capital *= (1 + pnl);
        capitalEvolution.push({ time: trade.closeTime, capital });
    }
}

console.log(`\n🏦 Résultat simulation trading :`);
console.log('--------------------------------');
console.log(`📈 Capital initial : 100 USDT`);
console.log(`📉 Capital final   : ${capital.toFixed(2)} USDT`);
console.log(`💰 Gain net         : ${(capital - 100).toFixed(2)} USDT (${((capital / 100 - 1) * 100).toFixed(2)} %)`);
console.log('--------------------------------\n');
