import {
    FastspotResult,
    FastspotError,
    FastspotAsset,
    FastspotEstimate,
    FastspotPreSwap,
    FastspotContractWithEstimate,
    FastspotSwap,
    FastspotLimits,
    FastspotUserLimits,
    RequestAsset,
    SwapAsset,
    Estimate,
    PreSwap,
    ContractWithEstimate,
    Swap,
    Limits,
    UserLimits,
    AssetList,
    ReferralCodes,
} from './types';

import {
    validateRequestPairs,
    convertFromData,
    convertToData,
    convertContract,
    convertSwap,
    convertLimits,
    convertUserLimits,
    coinsToUnits,
} from './helpers';

let API_URL: string | undefined;
let API_KEY: string | undefined;
let REFERRAL: ReferralCodes | undefined;

export function init(url: string, key: string, referral?: ReferralCodes) {
    if (!url || !key) throw new Error('url and key must be provided');
    API_URL = url;
    API_KEY = key;
    REFERRAL = referral;
}

async function api(
    path: string,
    method: 'POST' | 'GET' | 'DELETE',
    body?: object,
    headers?: Record<string, string>,
): Promise<FastspotResult> {
    if (!API_URL || !API_KEY) throw new Error('API URL and key not set, call init() first');

    const response = await fetch(`${API_URL}${path}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'X-FAST-ApiKey': API_KEY,
            ...headers,
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
        const error = await response.json() as FastspotError;
        throw new Error(error.detail);
    }
    return response.json();
}

export async function getEstimate(from: RequestAsset<SwapAsset>, to: SwapAsset): Promise<Estimate>;
export async function getEstimate(from: SwapAsset, to: RequestAsset<SwapAsset>): Promise<Estimate>;
export async function getEstimate(
    from: SwapAsset | RequestAsset<SwapAsset>,
    to: SwapAsset | RequestAsset<SwapAsset>,
): Promise<Estimate> {
    validateRequestPairs(from, to);

    const result = await api('/estimates', 'POST', {
        from,
        to,
        includedFees: 'required',
    }) as FastspotEstimate[];

    const inputObject = result[0].from[0];
    const outputObject = result[0].to[0];
    if (!inputObject || !outputObject) throw new Error('Insufficient market liquidity');

    const estimate: Estimate = {
        from: convertFromData(inputObject),
        to: convertToData(outputObject),
        serviceFeePercentage: parseFloat(result[0].serviceFeePercentage as string),
        direction: result[0].direction,
    };

    return estimate;
}

export async function createSwap(from: RequestAsset<SwapAsset>, to: SwapAsset): Promise<PreSwap>;
export async function createSwap(from: SwapAsset, to: RequestAsset<SwapAsset>): Promise<PreSwap>;
export async function createSwap(
    from: SwapAsset | RequestAsset<SwapAsset>,
    to: SwapAsset | RequestAsset<SwapAsset>,
): Promise<PreSwap> {
    validateRequestPairs(from, to);

    const headers: Record<string, string> = {};
    if (REFERRAL) {
        headers['X-S3-Partner-Code'] = REFERRAL.partnerCode;
        if (REFERRAL.refCode) headers['X-S3-Ref-Code'] = REFERRAL.refCode;
    }

    const result = await api('/swaps', 'POST', {
        from,
        to,
        includedFees: 'required',
    }, headers) as FastspotPreSwap;

    return convertSwap(result);
}

export async function confirmSwap(
    swap: PreSwap,
    redeem: {
        asset: SwapAsset.NIM | SwapAsset.BTC,
        address: string,
    } | {
        asset: SwapAsset.EUR,
        kty: string,
        crv: string,
        x: string,
        y?: string,
    },
    refund?: {
        asset: SwapAsset.NIM | SwapAsset.BTC,
        address: string,
    } | {
        asset: SwapAsset.EUR,
    },
    uid?: string,
): Promise<Swap> {
    const result = await api(`/swaps/${swap.id}`, 'POST', {
        confirm: true,
        beneficiary: redeem.asset === SwapAsset.EUR
            ? { [redeem.asset]: {
                kty: redeem.kty,
                crv: redeem.crv,
                x: redeem.x,
                ...(redeem.y ? { y: redeem.y } : {}),
            } }
            : { [redeem.asset]: redeem.address },
        ...(refund ? { refund: { [refund.asset]: 'address' in refund ? refund.address : '' } } : {}),
        ...(uid ? { uid } : {}),
    }) as FastspotSwap;

    return convertSwap(result);
}

export async function getSwap(id: string): Promise<PreSwap | Swap> {
    const result = await api(`/swaps/${id}`, 'GET') as FastspotPreSwap | FastspotSwap;
    return convertSwap(result);
}

export async function cancelSwap(swap: PreSwap): Promise<PreSwap> {
    const result = await api(`/swaps/${swap.id}`, 'DELETE') as FastspotPreSwap;
    return convertSwap(result);
}

export async function getContract<T extends SwapAsset>(asset: T, address: string): Promise<ContractWithEstimate<T>> {
    const result = await api(`/contracts/${asset}/${address}`, 'GET') as FastspotContractWithEstimate<T>;
    return {
        contract: convertContract(result.contract),
        from: convertFromData(result.info.from[0]),
        to: convertToData(result.info.to[0]),
        serviceFeePercentage: parseFloat(result.info.serviceFeePercentage as string),
        direction: result.info.direction,
    };
}

export async function getLimits<T extends SwapAsset>(asset: T, address: string): Promise<Limits<T>> {
    const result = await api(`/limits/${asset}/${address}`, 'GET') as FastspotLimits<T>;
    return convertLimits(result);
}

export async function getUserLimits(uid: string): Promise<UserLimits> {
    const result = await api(`/limits/${uid}`, 'GET') as FastspotUserLimits;
    return convertUserLimits(result);
}

export async function getAssets(): Promise<AssetList> {
    const result = await api('/assets', 'GET') as FastspotAsset[];
    const records: Partial<AssetList> = {};
    for (const record of result) {
        try {
            records[record.symbol] = {
                asset: record.symbol,
                name: record.name,
                feePerUnit: coinsToUnits(record.symbol, record.feePerUnit),
                limits: {
                    minimum: record.limits && record.limits.minimum
                        ? coinsToUnits(record.symbol, record.limits.minimum)
                        : 0,
                    maximum: record.limits && record.limits.maximum
                        ? coinsToUnits(record.symbol, record.limits.maximum)
                        : Infinity,
                },
            };
        } catch (error) {
            console.warn(error.message, record); // eslint-disable-line no-console
        }
    }
    return records as AssetList;
}
