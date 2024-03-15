import {
    RequestAsset,
    RequestAssetWithAmount,
    AssetId,
    Ticker,
    ReferenceAsset,
    Precision,
    // PriceData,
    // FastspotPrice,
    // FastspotContract,
    FastspotQuote,
    FastspotSwap,
    // FastspotLimits,
    // FastspotUserLimits,
    // Contract,
    Quote,
    Swap,
    // Limits,
    // UserLimits,
    // HtlcDetails,
} from './types';

export function coinsToUnits(asset: Ticker | ReferenceAsset, value: string | number): number {
    let decimals: number = Precision[asset];
    if (typeof decimals === 'undefined') throw new Error(`Invalid asset ${asset}`);

    if (typeof value === 'number') {
        return value * Math.pow(10, decimals);
    }

    // Move the decimal point before parsing to number, to reduce inaccuracy due to floating point precision
    const [coins, units] = value.split('.');
    value = `${coins}${units.substring(0, decimals).padEnd(decimals, '0')}.${units.substring(decimals)}`;
    return parseFloat(value);
}

function assetToTicker(asset: AssetId): Ticker {
    switch (asset) {
        case AssetId.NIM: return Ticker.NIM;
        case AssetId.BTC: return Ticker.BTC;
        case AssetId.BTC_LN: return Ticker.BTC;
        case AssetId.USDC_MATIC: return Ticker.USDC;
        case AssetId.EUR: return Ticker.EUR;
    }
}

export function convertSellBuyData(data: { asset: AssetId, amount: string }): { asset: AssetId, amount: number } {
    const asset = data.asset;
    return {
        asset,
        amount: coinsToUnits(assetToTicker(asset), data.amount),
    };
}

// export function convertContract<T extends SwapAsset>(contract: FastspotContract<T>): Contract<T> {
//     let htlc: HtlcDetails;

//     switch (contract.asset) {
//         case SwapAsset.NIM:
//             htlc = {
//                 ...(contract as FastspotContract<SwapAsset.NIM>).intermediary,
//             };
//             break;
//         case SwapAsset.BTC:
//             htlc = {
//                 address: (contract as FastspotContract<SwapAsset.BTC>).intermediary.p2wsh,
//                 script: (contract as FastspotContract<SwapAsset.BTC>).intermediary.scriptBytes,
//             };
//             break;
//         case SwapAsset.USDC:
//         case SwapAsset.USDC_MATIC:
//             htlc = {
//                 address: contract.id.substring(0, 2) === '0x' ? contract.id : `0x${contract.id}`,
//                 contract: (contract as FastspotContract<SwapAsset.USDC | SwapAsset.USDC_MATIC>).intermediary.address,
//                 data: (contract as FastspotContract<SwapAsset.USDC | SwapAsset.USDC_MATIC>).intermediary.data,
//             };
//             break;
//         case SwapAsset.EUR:
//             htlc = {
//                 address: (contract as FastspotContract<SwapAsset.EUR>).intermediary.contractId || contract.id,
//                 // TODO: Parse clearing instructions if provided
//             };
//             break;
//         default: throw new Error(`Invalid asset ${contract.asset}`);
//     }

//     return {
//         asset: contract.asset,
//         refundAddress: contract.refund?.address || '',
//         redeemAddress: contract.asset === SwapAsset.EUR
//             ? JSON.stringify((contract as FastspotContract<SwapAsset.EUR>).recipient)
//             : (contract as FastspotContract<SwapAsset.NIM | SwapAsset.BTC | SwapAsset.USDC | SwapAsset.USDC_MATIC>).recipient.address,
//         amount: coinsToUnits(contract.asset, contract.amount),
//         timeout: contract.timeout,
//         direction: contract.direction,
//         status: contract.status,
//         htlc,
//     } as Contract<T>;
// }

export function convertSwap(swap: FastspotSwap): Swap;
export function convertSwap(swap: FastspotQuote): Quote;
export function convertSwap(swap: FastspotQuote | FastspotSwap): Quote | Swap {
    const inputObject = swap.sell[0];
    const outputObject = swap.buy[0];

    const quote: Quote = {
        id: swap.id,
        sell: convertSellBuyData(inputObject),
        buy: convertSellBuyData(outputObject),
        status: swap.status,
        fees: swap.fees.map((fee) => ({
            ...fee,
            amount: coinsToUnits(fee.asset, fee.amount),
        })),
        expiry: Math.floor(swap.expiry), // `result.expiry` can be a float timestamp
    };

    if ('contracts' in swap) {
        // const contracts: Partial<Record<SwapAsset, Contract<SwapAsset>>> = {};
        // for (const contract of swap.contracts) {
        //     contracts[contract.asset] = convertContract(contract);
        // }

        const fullSwap: Swap = {
            ...quote,
            hash: swap.hash,
            ...(swap.preimage ?  { secret: swap.preimage } : {}),
            contracts: swap.contracts,
        };

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

export function validateRequestPairs(
    sell: RequestAsset<AssetId> | RequestAssetWithAmount<AssetId>,
    buy: RequestAsset<AssetId> | RequestAssetWithAmount<AssetId>,
): boolean {
    if (!Object.values(AssetId).includes(sell.asset)) {
        throw new Error('Unknown SELL asset');
    }

    if (!Object.values(AssetId).includes(buy.asset)) {
        throw new Error('Unknown BUY asset');
    }

    if (sell.asset === buy.asset) {
        throw new Error('SELL and BUY assets must be different');
    }

    if (
        (sell.asset === AssetId.BTC_LN && !sell.peer)
        || (buy.asset === AssetId.BTC_LN && !buy.peer)
    ) {
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
