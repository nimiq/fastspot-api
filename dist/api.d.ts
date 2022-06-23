import { RequestAsset, SwapAsset, Estimate, PreSwap, ContractWithEstimate, Swap, Limits, UserLimits, AssetList, ReferralCodes } from './types';
export declare function init(url: string, key: string, referral?: ReferralCodes): void;
export declare function getEstimate(from: RequestAsset<SwapAsset>, to: SwapAsset): Promise<Estimate>;
export declare function getEstimate(from: SwapAsset, to: RequestAsset<SwapAsset>): Promise<Estimate>;
export declare function createSwap(from: RequestAsset<SwapAsset>, to: SwapAsset): Promise<PreSwap>;
export declare function createSwap(from: SwapAsset, to: RequestAsset<SwapAsset>): Promise<PreSwap>;
export declare function confirmSwap(swap: PreSwap, redeem: {
    asset: SwapAsset.NIM | SwapAsset.BTC;
    address: string;
} | {
    asset: SwapAsset.EUR;
    kty: string;
    crv: string;
    x: string;
    y?: string;
}, refund?: {
    asset: SwapAsset.NIM | SwapAsset.BTC;
    address: string;
} | {
    asset: SwapAsset.EUR;
}, uid?: string, kycToken?: string): Promise<Swap>;
export declare function getSwap(id: string): Promise<PreSwap | Swap>;
export declare function cancelSwap(swap: PreSwap): Promise<PreSwap>;
export declare function getContract<T extends SwapAsset>(asset: T, address: string): Promise<ContractWithEstimate<T>>;
export declare function getLimits<T extends SwapAsset>(asset: T, address: string, kycUid?: string): Promise<Limits<T>>;
export declare function getUserLimits(uid: string, kycUid?: string): Promise<UserLimits>;
export declare function getAssets(): Promise<AssetList>;
