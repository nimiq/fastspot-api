import {
    Contract,
    FastspotContract,
    FastspotLimits,
    FastspotPreSwap,
    FastspotPrice,
    FastspotSwap,
    FastspotUserLimits,
    HtlcDetails,
    Limits,
    Precision,
    PreSwap,
    PriceData,
    ReferenceAsset,
    RequestAsset,
    Swap,
    SwapAsset,
    UserLimits,
} from './types';

export function coinsToUnits(asset: SwapAsset | ReferenceAsset, value: string | number, options: Partial<{
    roundUp: boolean,
    treatPolygonTokenAsMatic: boolean,
}> = {}): number {
    let decimals = Precision[asset] as number;

    // Some fees for USDC/T are provided in MATIC, and must be converted accordingly
    const isPolygonToken = asset === SwapAsset.USDC || asset === SwapAsset.USDC_MATIC || asset === SwapAsset.USDT;
    if (isPolygonToken && options.treatPolygonTokenAsMatic) decimals = 18;

    if (typeof decimals === 'undefined') throw new Error(`Invalid asset ${asset}`);

    const parts = value.toString().split('.');
    parts[1] = (parts[1] || '').substring(0, decimals + 1).padEnd(decimals + 1, '0');
    const units = parseInt(parts.join(''), 10) / 10;

    if (options.roundUp) {
        return Math.ceil(units);
    }

    return Math.floor(units);
}

export function convertFromData(from: FastspotPrice): PriceData {
    const asset = from.symbol;
    return {
        asset,
        amount: coinsToUnits(asset, from.amount),
        fee: coinsToUnits(asset, from.fundingNetworkFee.total, { roundUp: true }),
        ...(from.fundingNetworkFee.perUnit
            ? {
                feePerUnit: coinsToUnits(asset, from.fundingNetworkFee.perUnit, {
                    roundUp: true,
                    treatPolygonTokenAsMatic: true,
                }),
            }
            : {}),
        serviceNetworkFee: coinsToUnits(asset, from.finalizeNetworkFee.total, { roundUp: true }),
        serviceEscrowFee: coinsToUnits(asset, from.operatingNetworkFee.total, { roundUp: true }),
    };
}

export function convertToData(to: FastspotPrice): PriceData {
    const asset = to.symbol;
    return {
        asset,
        amount: coinsToUnits(asset, to.amount),
        fee: coinsToUnits(asset, to.finalizeNetworkFee.total, { roundUp: true }),
        ...(to.finalizeNetworkFee.perUnit
            ? {
                feePerUnit: coinsToUnits(asset, to.finalizeNetworkFee.perUnit, {
                    roundUp: true,
                    treatPolygonTokenAsMatic: true,
                }),
            }
            : {}),
        serviceNetworkFee: coinsToUnits(asset, to.fundingNetworkFee.total, { roundUp: true }),
        serviceEscrowFee: coinsToUnits(asset, to.operatingNetworkFee.total, { roundUp: true }),
    };
}

export function convertContract<T extends SwapAsset>(contract: FastspotContract<T>): Contract<T> {
    let htlc: HtlcDetails;

    switch (contract.asset) {
        case SwapAsset.NIM:
            htlc = {
                ...(contract as FastspotContract<SwapAsset.NIM>).intermediary,
            };
            break;
        case SwapAsset.BTC:
            htlc = {
                address: (contract as FastspotContract<SwapAsset.BTC>).intermediary.p2wsh,
                script: (contract as FastspotContract<SwapAsset.BTC>).intermediary.scriptBytes,
            };
            break;
        case SwapAsset.BTC_LN:
            htlc = {
                nodeId: (contract as FastspotContract<SwapAsset.BTC_LN>).intermediary.nodeId,
            };
            break;
        case SwapAsset.USDC:
        case SwapAsset.USDC_MATIC:
        case SwapAsset.USDT:
            htlc = {
                address: contract.id.substring(0, 2) === '0x' ? contract.id : `0x${contract.id}`,
                contract:
                    (contract as FastspotContract<SwapAsset.USDC | SwapAsset.USDC_MATIC | SwapAsset.USDT>).intermediary
                        .address,
                data:
                    (contract as FastspotContract<SwapAsset.USDC | SwapAsset.USDC_MATIC | SwapAsset.USDT>).intermediary
                        .data,
            };
            break;
        case SwapAsset.EUR:
            htlc = {
                address: (contract as FastspotContract<SwapAsset.EUR>).intermediary.contractId || contract.id,
                // TODO: Parse clearing instructions if provided
            };
            break;
        default:
            throw new Error(`Invalid asset ${contract.asset}`);
    }

    return {
        id: contract.id,
        asset: contract.asset,
        refundAddress: contract.refund?.address || '',
        redeemAddress: contract.asset === SwapAsset.EUR
            ? JSON.stringify((contract as FastspotContract<SwapAsset.EUR>).recipient)
            : (contract as FastspotContract<
                SwapAsset.NIM | SwapAsset.BTC | SwapAsset.USDC | SwapAsset.USDC_MATIC | SwapAsset.USDT
            >)
                .recipient.address,
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
        direction: swap.info.direction,
    };

    if ('contracts' in swap) {
        const contracts: Partial<Record<SwapAsset, Contract<SwapAsset>>> = {};
        for (const contract of swap.contracts) {
            contracts[contract.asset] = convertContract(contract);
        }

        const fullSwap: Swap = {
            ...preSwap,
            hash: swap.hash,
            ...(swap.secret ? { secret: swap.secret } : {}),
            contracts,
        };

        return fullSwap;
    }

    return preSwap;
}

export function convertLimits<T extends SwapAsset>(limits: FastspotLimits<T>): Limits<T> {
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

export function convertUserLimits(limits: FastspotUserLimits): UserLimits {
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
