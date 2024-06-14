import { Precision, SwapAsset, } from './types';
export function coinsToUnits(asset, value, options = {}) {
    let decimals = Precision[asset];
    // Some fees for USDC are provided in MATIC, and must be converted accordingly
    if ((asset === SwapAsset.USDC || asset === SwapAsset.USDC_MATIC) && options.treatUsdcAsMatic)
        decimals = 18;
    if (typeof decimals === 'undefined')
        throw new Error(`Invalid asset ${asset}`);
    const parts = value.toString().split('.');
    parts[1] = (parts[1] || '').substring(0, decimals + 1).padEnd(decimals + 1, '0');
    const units = parseInt(parts.join(''), 10) / 10;
    if (options.roundUp) {
        return Math.ceil(units);
    }
    return Math.floor(units);
}
export function convertFromData(from) {
    const asset = from.symbol;
    return Object.assign(Object.assign({ asset, amount: coinsToUnits(asset, from.amount), fee: coinsToUnits(asset, from.fundingNetworkFee.total, { roundUp: true }) }, (from.fundingNetworkFee.perUnit
        ? {
            feePerUnit: coinsToUnits(asset, from.fundingNetworkFee.perUnit, {
                roundUp: true,
                treatUsdcAsMatic: true,
            }),
        }
        : {})), { serviceNetworkFee: coinsToUnits(asset, from.finalizeNetworkFee.total, { roundUp: true }), serviceEscrowFee: coinsToUnits(asset, from.operatingNetworkFee.total, { roundUp: true }) });
}
export function convertToData(to) {
    const asset = to.symbol;
    return Object.assign(Object.assign({ asset, amount: coinsToUnits(asset, to.amount), fee: coinsToUnits(asset, to.finalizeNetworkFee.total, { roundUp: true }) }, (to.finalizeNetworkFee.perUnit
        ? {
            feePerUnit: coinsToUnits(asset, to.finalizeNetworkFee.perUnit, {
                roundUp: true,
                treatUsdcAsMatic: true,
            }),
        }
        : {})), { serviceNetworkFee: coinsToUnits(asset, to.fundingNetworkFee.total, { roundUp: true }), serviceEscrowFee: coinsToUnits(asset, to.operatingNetworkFee.total, { roundUp: true }) });
}
export function convertContract(contract) {
    var _a;
    let htlc;
    switch (contract.asset) {
        case SwapAsset.NIM:
            htlc = Object.assign({}, contract.intermediary);
            break;
        case SwapAsset.BTC:
            htlc = {
                address: contract.intermediary.p2wsh,
                script: contract.intermediary.scriptBytes,
            };
            break;
        case SwapAsset.BTC_LN:
            htlc = {
                nodeId: contract.intermediary.nodeId,
            };
            break;
        case SwapAsset.USDC:
        case SwapAsset.USDC_MATIC:
            htlc = {
                address: contract.id.substring(0, 2) === '0x' ? contract.id : `0x${contract.id}`,
                contract: contract.intermediary.address,
                data: contract.intermediary.data,
            };
            break;
        case SwapAsset.EUR:
            htlc = {
                address: contract.intermediary.contractId || contract.id,
                // TODO: Parse clearing instructions if provided
            };
            break;
        case SwapAsset.CRC:
            htlc = {
                address: contract.intermediary.contractId || contract.id,
                // TODO: Parse clearing instructions if provided
            };
            break;
        default:
            throw new Error(`Invalid asset ${contract.asset}`);
    }
    return {
        id: contract.id,
        asset: contract.asset,
        refundAddress: ((_a = contract.refund) === null || _a === void 0 ? void 0 : _a.address) || '',
        redeemAddress: contract.asset === SwapAsset.EUR
            ? JSON.stringify(contract.recipient)
            : contract
                .recipient.address,
        amount: coinsToUnits(contract.asset, contract.amount),
        timeout: contract.timeout,
        direction: contract.direction,
        status: contract.status,
        htlc,
    };
}
export function convertSwap(swap) {
    const inputObject = swap.info.from[0];
    const outputObject = swap.info.to[0];
    const preSwap = {
        id: swap.id,
        expires: Math.floor(swap.expires), // `result.expires` can be a float timestamp
        from: convertFromData(inputObject),
        to: convertToData(outputObject),
        status: swap.status,
        serviceFeePercentage: parseFloat(swap.info.serviceFeePercentage),
        direction: swap.info.direction,
    };
    if ('contracts' in swap) {
        const contracts = {};
        for (const contract of swap.contracts) {
            contracts[contract.asset] = convertContract(contract);
        }
        const fullSwap = Object.assign(Object.assign(Object.assign(Object.assign({}, preSwap), { hash: swap.hash }), (swap.secret ? { secret: swap.secret } : {})), { contracts });
        return fullSwap;
    }
    return preSwap;
}
export function convertLimits(limits) {
    return {
        asset: limits.asset,
        daily: coinsToUnits(limits.asset, limits.daily),
        dailyRemaining: coinsToUnits(limits.asset, limits.dailyRemaining),
        monthly: coinsToUnits(limits.asset, limits.monthly),
        monthlyRemaining: coinsToUnits(limits.asset, limits.monthlyRemaining),
        perSwap: coinsToUnits(limits.asset, limits.swap),
        current: coinsToUnits(limits.asset, limits.current),
        reference: {
            asset: limits.referenceAsset,
            daily: coinsToUnits(limits.referenceAsset, limits.referenceDaily),
            dailyRemaining: coinsToUnits(limits.referenceAsset, limits.referenceDailyRemaining),
            monthly: coinsToUnits(limits.referenceAsset, limits.referenceMonthly),
            monthlyRemaining: coinsToUnits(limits.referenceAsset, limits.referenceMonthlyRemaining),
            perSwap: coinsToUnits(limits.referenceAsset, limits.referenceSwap),
            current: coinsToUnits(limits.referenceAsset, limits.referenceCurrent),
        },
    };
}
export function convertUserLimits(limits) {
    return {
        asset: limits.asset,
        daily: coinsToUnits(limits.asset, limits.daily),
        dailyRemaining: coinsToUnits(limits.asset, limits.dailyRemaining),
        monthly: coinsToUnits(limits.asset, limits.monthly),
        monthlyRemaining: coinsToUnits(limits.asset, limits.monthlyRemaining),
        perSwap: coinsToUnits(limits.asset, limits.swap),
        current: coinsToUnits(limits.asset, limits.current),
    };
}
export function validateRequestPairs(from, to) {
    let fromAsset;
    let toAsset;
    if (typeof from === 'string') {
        if (!Object.values(SwapAsset).includes(from)) {
            throw new Error('Invalid FROM asset');
        }
        fromAsset = from;
    }
    else {
        if (Object.keys(from).length !== 1) {
            throw new Error('Only one asset allowed for FROM');
        }
        if (!Object.values(SwapAsset).includes(Object.keys(from)[0])) {
            throw new Error('Invalid FROM asset');
        }
        fromAsset = Object.keys(from)[0];
    }
    if (typeof to === 'string') {
        if (!Object.values(SwapAsset).includes(to)) {
            throw new Error('Invalid TO asset');
        }
        toAsset = to;
    }
    else {
        if (Object.keys(to).length !== 1) {
            throw new Error('Only one asset allowed for TO');
        }
        if (!Object.values(SwapAsset).includes(Object.keys(to)[0])) {
            throw new Error('Invalid TO asset');
        }
        toAsset = Object.keys(to)[0];
    }
    if (fromAsset === toAsset) {
        throw new Error('FROM and TO assets must be different');
    }
    return true;
}
