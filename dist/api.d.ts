import { AssetList, ContractWithEstimate, Estimate, Limits, PreSwap, ReferralCodes, RequestAsset, Swap, SwapAsset, UserLimits } from './types';
export declare function init(url: string, key: string, options?: Partial<{
    referral?: ReferralCodes;
    customFetch?: typeof fetch;
}>): void;
export declare function getEstimate(from: RequestAsset<SwapAsset>, to: SwapAsset): Promise<Estimate>;
export declare function getEstimate(from: SwapAsset, to: RequestAsset<SwapAsset>): Promise<Estimate>;
export declare function createSwap(from: RequestAsset<SwapAsset>, to: SwapAsset): Promise<PreSwap>;
export declare function createSwap(from: SwapAsset, to: RequestAsset<SwapAsset>): Promise<PreSwap>;
export declare function confirmSwap(swap: PreSwap, redeem: {
    asset: SwapAsset.NIM | SwapAsset.BTC | SwapAsset.USDC | SwapAsset.USDC_MATIC;
    address: string;
} | {
    asset: SwapAsset.EUR | SwapAsset.CRC;
    kty: string;
    crv: string;
    x: string;
    y?: string;
} | {
    asset: SwapAsset.BTC_LN;
}, refund?: {
    asset: SwapAsset.NIM | SwapAsset.BTC | SwapAsset.USDC | SwapAsset.USDC_MATIC;
    address: string;
} | {
    asset: SwapAsset.EUR | SwapAsset.CRC;
}, uid?: string, kycToken?: string, oasisPrepareToken?: string): Promise<Swap>;
export declare function getSwap(id: string): Promise<PreSwap | Swap>;
export declare function cancelSwap(swap: PreSwap): Promise<PreSwap>;
export declare function getContract<T extends SwapAsset>(asset: T, address: string): Promise<ContractWithEstimate<T>>;
export declare function getLimits<T extends SwapAsset>(asset: T, address: string, kycUid?: string): Promise<Limits<T>>;
export declare function getUserLimits(uid: string, kycUid?: string): Promise<UserLimits>;
export declare function getAssets(): Promise<AssetList>;
