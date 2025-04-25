const { openPosition, isPositionOpen } = require('./positionController');

function tryEnterTrade(symbol, signal) {
    if (isPositionOpen(symbol)) return false;

    if (signal.readyToBuy) {
        openPosition(symbol, 'buy', signal.price);
        return true;
    }

    if (signal.readyToSell) {
        openPosition(symbol, 'sell', signal.price);
        return true;
    }

    return false;
}

module.exports = {
    tryEnterTrade
};