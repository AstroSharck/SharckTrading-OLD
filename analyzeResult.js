const fs = require('fs');
const path = require('path');

function formatDate(timestamp) {
    if (!timestamp) return '—';
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

// Charger les trades
function loadTrades() {
    const filepath = path.join(__dirname, 'data', 'trade_history.json');
    if (!fs.existsSync(filepath)) {
        console.error('❌ Fichier trade_history.json introuvable.');
        process.exit(1);
    }
    const raw = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(raw);
}

// Analyse principale
function analyzeTrades(trades) {
    const closed = trades.filter(t => t.closePrice !== undefined);
    const open = trades.filter(t => t.closePrice === undefined);

    const winners = closed.filter(t => t.pnlPct > 0);
    const losers = closed.filter(t => t.pnlPct <= 0);

    const winrate = closed.length ? (winners.length / closed.length) * 100 : 0;

    return { winners, losers, open, winrate, closed };
}

// Afficher sous forme de table
function printTable(trades, title) {
    if (trades.length === 0) {
        console.log(`\n${title} : Aucun trade\n`);
        return;
    }
    console.log(`\n📋 ${title} (${trades.length}) :`);
    console.table(trades.map(t => ({
        Symbol: t.symbol,
        Direction: t.direction,
        'Entry Price': t.entryPrice,
        'Close Price': t.closePrice || 'Ouvert',
        'Open Time': formatDate(t.openTime),
        'Close Time': t.closeTime ? formatDate(t.closeTime) : 'En cours',
        'PnL (%)': t.pnlPct !== undefined ? t.pnlPct.toFixed(2) : 'En cours'
    })));
}

// MAIN
function main() {
    const args = process.argv.slice(2);
    const showTable = args.includes('--table');

    const trades = loadTrades();
    const { winners, losers, open, winrate, closed } = analyzeTrades(trades);

    console.log('\n📊 Résumé général :');
    console.log('---------------------------');
    console.log(`✅ Trades gagnés : ${winners.length}`);
    console.log(`❌ Trades perdus : ${losers.length}`);
    console.log(`⏳ Trades encore ouverts : ${open.length}`);
    console.log(`🏆 Winrate : ${winrate.toFixed(2)} %`);
    console.log('---------------------------\n');

    if (showTable) {
        printTable(winners, 'Trades Gagnants');
        printTable(losers, 'Trades Perdants');
        printTable(open, 'Trades Encore Ouverts');
    }
}

main();
