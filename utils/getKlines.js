const axios = require('axios');

/**
 * Récupère les bougies pour un symbole donné
 * @param {string} symbol - Exemple : 'MAGICUSDT'
 * @param {string} interval - Exemple : '1m', '5m', '15m', etc.
 * @param {number} limit - Nombre de bougies (max 1000 selon Binance)
 * @returns {Promise<Array>} - Tableau de bougies [openTime, open, high, low, close, volume, ...]
 */
async function getKlines(symbol, interval = '1m', limit = 60) {
    try {
        const res = await axios.get('https://api.binance.com/api/v3/klines', {
            params: {
                symbol,
                interval,
                limit
            }
        });

        return res.data;
    } catch (err) {
        console.error(`❌ Erreur getKlines pour ${symbol} :`, err.message);
        return [];
    }
}

module.exports = { getKlines };
