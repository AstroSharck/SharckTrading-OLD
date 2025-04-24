async function fetchNews() {
    // Version simulée pour l’instant
    const fakeNews = [
        "US inflation report today",
        "Binance facing minor outage",
        "Market showing stability",
        "Crypto crash expected",
        "High risk of volatility",
    ];

    return fakeNews.join(' | ').toLowerCase(); // On retourne tout en string
}

module.exports = fetchNews;
