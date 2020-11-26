import {
    RequestAsset,
    SwapAsset,
    PriceData,
    FastspotPrice,
    FastspotContract,
    FastspotPreSwap,
    FastspotSwap,
    FastspotLimits,
    Contract,
    PreSwap,
    Swap,
    Limits,
    HtlcDetails,
} from './types';

export function coinsToUnits(asset: SwapAsset, value: string | number, roundUp = false): number {
    let decimals: number;
    switch (asset) {
        case SwapAsset.NIM: decimals = 5; break;
        case SwapAsset.BTC: decimals = 8; break;
        case SwapAsset.EUR: decimals = 2; break;
        default: throw new Error(`Invalid asset ${asset}`);
    }
    const parts = value.toString().split('.');
    parts[1] = (parts[1] || '').substr(0, decimals + 1).padEnd(decimals + 1, '0');
    const units = parseInt(parts.join(''), 10) / 10;

    if (roundUp) {
        return Math.ceil(units);
    }

    return Math.floor(units);
}

export function convertFromData(from: FastspotPrice): PriceData {
    const asset = SwapAsset[from.symbol];
    return {
        asset,
        amount: coinsToUnits(asset, from.amount),
        fee: coinsToUnits(asset, from.fundingNetworkFee.total, true),
        feePerUnit: coinsToUnits(asset, from.fundingNetworkFee.perUnit, true),
        serviceNetworkFee: coinsToUnits(asset, from.finalizeNetworkFee.total, true),
    };
}

export function convertToData(to: FastspotPrice): PriceData {
    const asset = SwapAsset[to.symbol];
    return {
        asset,
        amount: coinsToUnits(asset, to.amount),
        fee: coinsToUnits(asset, to.finalizeNetworkFee.total, true),
        feePerUnit: coinsToUnits(asset, to.finalizeNetworkFee.perUnit, true),
        serviceNetworkFee: coinsToUnits(asset, to.fundingNetworkFee.total, true),
    };
}

export function convertContract<T extends SwapAsset>(contract: FastspotContract<T>): Contract<T> {
    let htlc: HtlcDetails;

    switch (contract.asset) {
        case SwapAsset.NIM:
            htlc = {
                address: (contract as FastspotContract<SwapAsset.NIM>).intermediary.address,
                timeoutBlock: (contract as FastspotContract<SwapAsset.NIM>).intermediary.timeoutBlock,
                data: (contract as FastspotContract<SwapAsset.NIM>).intermediary.data,
            };
            break;
        case SwapAsset.BTC:
            htlc = {
                address: (contract as FastspotContract<SwapAsset.BTC>).intermediary.p2wsh,
                script: (contract as FastspotContract<SwapAsset.BTC>).intermediary.scriptBytes,
            };
            break;
        case SwapAsset.EUR:
            htlc = {
                address: (contract as FastspotContract<SwapAsset.EUR>).intermediary.contractId || contract.id,
            };
            break;
        default: throw new Error(`Invalid asset ${contract.asset}`);
    }

    return {
        asset: contract.asset,
        refundAddress: contract.refund.address,
        redeemAddress: contract.asset === SwapAsset.EUR
            ? JSON.stringify((contract as FastspotContract<SwapAsset.EUR>).recipient)
            : (contract as FastspotContract<SwapAsset.NIM | SwapAsset.BTC>).recipient.address,
        amount: coinsToUnits(contract.asset, contract.amount),
        timeout: contract.timeout,
        direction: contract.direction,
        status: contract.status,
        htlc,
    } as Contract<T>;
}

export function convertSwap(swap: FastspotSwap): Swap;
export function convertSwap(swap: FastspotPreSwap): PreSwap;
export function convertSwap(swap: FastspotPreSwap | FastspotSwap): PreSwap | Swap {
    const inputObject = swap.info.from[0];
    const outputObject = swap.info.to[0];

    const preSwap: PreSwap = {
        id: swap.id,
        expires: Math.floor(swap.expires), // `result.expires` can be a float timestamp
        from: convertFromData(inputObject),
        to: convertToData(outputObject),
        status: swap.status,
        serviceFeePercentage: parseFloat(swap.info.serviceFeePercentage as string),
    };

    if ('contracts' in swap) {
        const contracts: Partial<Record<SwapAsset, Contract<SwapAsset>>> = {};
        for (const contract of swap.contracts) {
            contracts[contract.asset] = convertContract(contract);
        }

        const fullSwap: Swap = {
            ...preSwap,
            hash: swap.hash,
            ...(swap.secret ?  { secret: swap.secret } : {}),
            contracts,
        };

        return fullSwap;
    }

    return preSwap;
}

export function convertLimits<T extends SwapAsset>(limits: FastspotLimits<T>): Limits<T> {
    return {
        asset: limits.asset,
        current: coinsToUnits(limits.asset, limits.current),
        daily: coinsToUnits(limits.asset, limits.daily),
        monthly: coinsToUnits(limits.asset, limits.monthly),
    };
}

export function validateRequestPairs(
    from: SwapAsset | RequestAsset<SwapAsset>,
    to: SwapAsset | RequestAsset<SwapAsset>,
): boolean {
    let fromAsset: SwapAsset;
    let toAsset: SwapAsset;

    if (typeof from === 'string') {
        if (!Object.values(SwapAsset).includes(from)) {
            throw new Error('Invalid FROM asset');
        }
        fromAsset = from;
    } else {
        if (Object.keys(from).length !== 1) {
            throw new Error('Only one asset allowed for FROM');
        }
        if (!Object.values(SwapAsset).includes(Object.keys(from)[0] as SwapAsset)) {
            throw new Error('Invalid FROM asset');
        }
        fromAsset = Object.keys(from)[0] as SwapAsset;
    }

    if (typeof to === 'string') {
        if (!Object.values(SwapAsset).includes(to)) {
            throw new Error('Invalid TO asset');
        }
        toAsset = to;
    } else {
        if (Object.keys(to).length !== 1) {
            throw new Error('Only one asset allowed for TO');
        }
        if (!Object.values(SwapAsset).includes(Object.keys(to)[0] as SwapAsset)) {
            throw new Error('Invalid TO asset');
        }
        toAsset = Object.keys(to)[0] as SwapAsset;
    }

    if (fromAsset === toAsset) {
        throw new Error('FROM and TO assets must be different');
    }

    return true;
}
