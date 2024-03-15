import { AssetId, Ticker, Precision,
// Limits,
// UserLimits,
// HtlcDetails,
 } from './types';
export function coinsToUnits(asset, value) {
    let decimals = Precision[asset];
    if (typeof decimals === 'undefined')
        throw new Error(`Invalid asset ${asset}`);
    if (typeof value === 'number') {
        return value * Math.pow(10, decimals);
    }
    // Move the decimal point before parsing to number, to reduce inaccuracy due to floating point precision
    const [coins, units] = value.split('.');
    value = `${coins}${units.substring(0, decimals).padEnd(decimals, '0')}.${units.substring(decimals)}`;
    return parseFloat(value);
}
function assetToTicker(asset) {
    switch (asset) {
        case AssetId.NIM: return Ticker.NIM;
        case AssetId.BTC: return Ticker.BTC;
        case AssetId.BTC_LN: return Ticker.BTC;
        case AssetId.USDC_MATIC: return Ticker.USDC;
        case AssetId.EUR: return Ticker.EUR;
    }
}
export function convertSellBuyData(data) {
    const asset = data.asset;
    return {
        asset,
        amount: coinsToUnits(assetToTicker(asset), data.amount),
    };
}
export function convertSwap(swap) {
    const inputObject = swap.sell[0];
    const outputObject = swap.buy[0];
    const quote = {
        id: swap.id,
        sell: convertSellBuyData(inputObject),
        buy: convertSellBuyData(outputObject),
        status: swap.status,
        fees: swap.fees.map((fee) => (Object.assign(Object.assign({}, fee), { amount: coinsToUnits(fee.asset, fee.amount) }))),
        expiry: Math.floor(swap.expiry), // `result.expiry` can be a float timestamp
    };
    if ('contracts' in swap) {
        // const contracts: Partial<Record<SwapAsset, Contract<SwapAsset>>> = {};
        // for (const contract of swap.contracts) {
        //     contracts[contract.asset] = convertContract(contract);
        // }
        const fullSwap = Object.assign(Object.assign(Object.assign(Object.assign({}, quote), { hash: swap.hash }), (swap.preimage ? { preimage: swap.preimage } : {})), { contracts: swap.contracts });
        return fullSwap;
    }
    return quote;
}
// export function convertLimits<T extends SwapAsset>(limits: FastspotLimits<T>): Limits<T> {
//     return {
//         asset: limits.asset,
//         daily: coinsToUnits(limits.asset, limits.daily),
//         dailyRemaining: coinsToUnits(limits.asset, limits.dailyRemaining),
//         monthly: coinsToUnits(limits.asset, limits.monthly),
//         monthlyRemaining: coinsToUnits(limits.asset, limits.monthlyRemaining),
//         perSwap: coinsToUnits(limits.asset, limits.swap),
//         current: coinsToUnits(limits.asset, limits.current),
//         reference: {
//             asset: limits.referenceAsset,
//             daily: coinsToUnits(limits.referenceAsset, limits.referenceDaily),
//             dailyRemaining: coinsToUnits(limits.referenceAsset, limits.referenceDailyRemaining),
//             monthly: coinsToUnits(limits.referenceAsset, limits.referenceMonthly),
//             monthlyRemaining: coinsToUnits(limits.referenceAsset, limits.referenceMonthlyRemaining),
//             perSwap: coinsToUnits(limits.referenceAsset, limits.referenceSwap),
//             current: coinsToUnits(limits.referenceAsset, limits.referenceCurrent),
//         },
//     };
// }
// export function convertUserLimits(limits: FastspotUserLimits): UserLimits {
//     return {
//         asset: limits.asset,
//         daily: coinsToUnits(limits.asset, limits.daily),
//         dailyRemaining: coinsToUnits(limits.asset, limits.dailyRemaining),
//         monthly: coinsToUnits(limits.asset, limits.monthly),
//         monthlyRemaining: coinsToUnits(limits.asset, limits.monthlyRemaining),
//         perSwap: coinsToUnits(limits.asset, limits.swap),
//         current: coinsToUnits(limits.asset, limits.current),
//     };
// }
export function validateRequestPairs(sell, buy) {
    if (!Object.values(AssetId).includes(sell.asset)) {
        throw new Error('Unknown SELL asset');
    }
    if (!Object.values(AssetId).includes(buy.asset)) {
        throw new Error('Unknown BUY asset');
    }
    if (sell.asset === buy.asset) {
        throw new Error('SELL and BUY assets must be different');
    }
    if ((sell.asset === AssetId.BTC_LN && !sell.peer)
        || (buy.asset === AssetId.BTC_LN && !buy.peer)) {
        throw new Error('For BTC_LN, peer is required');
    }
    if ('amount' in sell && 'amount' in buy) {
        throw new Error('Only one side, either SELL or BUY, can have an amount');
    }
    if (!('amount' in sell) && !('amount' in buy)) {
        throw new Error('One side, either SELL or BUY, must have an amount');
    }
    return true;
}
