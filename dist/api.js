import { validateRequestPairs, 
//     convertFromData,
//     convertToData,
//     convertContract,
convertSwap,
//     convertLimits,
//     convertUserLimits,
//     coinsToUnits,
 } from './helpers';
let API_URL;
let API_KEY;
// let REFERRAL: ReferralCodes | undefined;
export function init(url, key /* , referral?: ReferralCodes */) {
    if (!url || !key)
        throw new Error('url and key must be provided');
    API_URL = url;
    API_KEY = key;
    // REFERRAL = referral;
}
async function api(path, method, options) {
    if (!API_URL || !API_KEY)
        throw new Error('API URL and key not set, call init() first');
    const response = await fetch(`${API_URL}${path}`, Object.assign({ method, headers: Object.assign({ 'Content-Type': 'application/json', 'X-FAST-ApiKey': API_KEY }, options === null || options === void 0 ? void 0 : options.headers) }, ((options === null || options === void 0 ? void 0 : options.body) ? { body: JSON.stringify(options.body) } : {})));
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail);
    }
    return response.json();
}
export async function createSwap(sell, buy) {
    validateRequestPairs(sell, buy);
    const headers = {};
    // if (REFERRAL) {
    //     headers['X-S3-Partner-Code'] = REFERRAL.partnerCode;
    //     if (REFERRAL.refCode) headers['X-S3-Ref-Code'] = REFERRAL.refCode;
    // }
    const result = await api('/swap/create', 'POST', {
        headers,
        body: {
            sell: [sell],
            buy: [buy],
        },
    });
    return convertSwap(result);
}
// export async function confirmSwap(
//     swap: PreSwap,
//     redeem: {
//         asset: SwapAsset.NIM | SwapAsset.BTC | SwapAsset.USDC | SwapAsset.USDC_MATIC,
//         address: string,
//     } | {
//         asset: SwapAsset.EUR,
//         kty: string,
//         crv: string,
//         x: string,
//         y?: string,
//     },
//     refund?: {
//         asset: SwapAsset.NIM | SwapAsset.BTC | SwapAsset.USDC | SwapAsset.USDC_MATIC,
//         address: string,
//     } | {
//         asset: SwapAsset.EUR,
//     },
//     uid?: string,
//     kycToken?: string,
//     oasisPrepareToken?: string,
// ): Promise<Swap> {
//     const headers: Record<string, string> = {};
//     if (kycToken) {
//         if (!uid) throw new Error('UID is required when using kycToken');
//         headers['X-S3-KYC-Token'] = kycToken;
//         headers['X-S3-KYC-UID'] = uid;
//         if (oasisPrepareToken) {
//             headers['X-OASIS-Prepare-Token'] = oasisPrepareToken;
//         }
//     }
//     const result = await api(`/swaps/${swap.id}`, 'POST', {
//         headers,
//         body: {
//             confirm: true,
//             beneficiary: redeem.asset === SwapAsset.EUR
//                 ? { [redeem.asset]: {
//                     kty: redeem.kty,
//                     crv: redeem.crv,
//                     x: redeem.x,
//                     ...(redeem.y ? { y: redeem.y } : {}),
//                 } }
//                 : { [redeem.asset]: redeem.address },
//             ...(refund ? { refund: { [refund.asset]: 'address' in refund ? refund.address : '' } } : {}),
//             ...(uid ? { uid } : {}),
//         },
//     }) as FastspotSwap;
//     return convertSwap(result);
// }
export async function provideFundingProof(swapId, contractId, proof) {
    const result = await api(`/swap/${swapId}`, 'PATCH', {
        body: {
            contracts: [{
                    id: contractId,
                    proof,
                }],
        },
    });
    return convertSwap(result);
}
export async function getSwap(id) {
    const result = await api(`/swap/${id}`, 'GET');
    return convertSwap(result);
}
// export async function cancelSwap(swap: PreSwap): Promise<PreSwap> {
//     const result = await api(`/swaps/${swap.id}`, 'DELETE') as FastspotPreSwap;
//     return convertSwap(result);
// }
// export async function getContract<T extends SwapAsset>(asset: T, address: string): Promise<ContractWithEstimate<T>> {
//     const result = await api(`/contracts/${asset}/${address}`, 'GET') as FastspotContractWithEstimate<T>;
//     return {
//         contract: convertContract(result.contract),
//         from: convertFromData(result.info.from[0]),
//         to: convertToData(result.info.to[0]),
//         serviceFeePercentage: parseFloat(result.info.serviceFeePercentage as string),
//         direction: result.info.direction,
//     };
// }
// export async function getLimits<T extends SwapAsset>(asset: T, address: string, kycUid?: string): Promise<Limits<T>> {
//     const headers: Record<string, string> = {};
//     if (kycUid) {
//         headers['X-S3-KYC-UID'] = kycUid;
//     }
//     const result = await api(`/limits/${asset}/${address}`, 'GET', { headers }) as FastspotLimits<T>;
//     return convertLimits(result);
// }
// export async function getUserLimits(uid: string, kycUid?: string): Promise<UserLimits> {
//     const headers: Record<string, string> = {};
//     if (kycUid) {
//         headers['X-S3-KYC-UID'] = kycUid;
//     }
//     const result = await api(`/limits/${uid}`, 'GET', { headers }) as FastspotUserLimits;
//     return convertUserLimits(result);
// }
// export async function getAssets(): Promise<AssetList> {
//     const result = await api('/assets', 'GET') as FastspotAsset[];
//     const records: Partial<AssetList> = {};
//     for (const record of result) {
//         try {
//             records[record.symbol] = {
//                 asset: record.symbol,
//                 name: record.name,
//                 feePerUnit: coinsToUnits(record.symbol, record.feePerUnit, { treatUsdcAsMatic: true }),
//                 limits: {
//                     minimum: record.limits && record.limits.minimum
//                         ? coinsToUnits(record.symbol, record.limits.minimum)
//                         : undefined,
//                     maximum: record.limits && record.limits.maximum
//                         ? coinsToUnits(record.symbol, record.limits.maximum)
//                         : undefined,
//                 },
//             };
//         } catch (error: any) {
//             console.warn(error.message, record); // eslint-disable-line no-console
//         }
//     }
//     return records as AssetList;
// }
