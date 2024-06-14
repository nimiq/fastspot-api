import { Contract, FastspotContract, FastspotLimits, FastspotPreSwap, FastspotPrice, FastspotSwap, FastspotUserLimits, Limits, PreSwap, PriceData, ReferenceAsset, RequestAsset, Swap, SwapAsset, UserLimits } from './types';
export declare function coinsToUnits(asset: SwapAsset | ReferenceAsset, value: string | number, options?: Partial<{
    roundUp: boolean;
    treatUsdcAsMatic: boolean;
}>): number;
export declare function convertFromData(from: FastspotPrice): PriceData;
export declare function convertToData(to: FastspotPrice): PriceData;
export declare function convertContract<T extends SwapAsset>(contract: FastspotContract<T>): Contract<T>;
export declare function convertSwap(swap: FastspotSwap): Swap;
export declare function convertSwap(swap: FastspotPreSwap): PreSwap;
export declare function convertLimits<T extends SwapAsset>(limits: FastspotLimits<T>): Limits<T>;
export declare function convertUserLimits(limits: FastspotUserLimits): UserLimits;
export declare function validateRequestPairs(from: SwapAsset | RequestAsset<SwapAsset>, to: SwapAsset | RequestAsset<SwapAsset>): boolean;
