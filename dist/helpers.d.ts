import { RequestAsset, RequestAssetWithAmount, AssetId, Ticker, ReferenceAsset, FastspotQuote, FastspotSwap, Quote, Swap } from './types';
export declare function coinsToUnits(asset: Ticker | ReferenceAsset, value: string | number): number;
export declare function convertSellBuyData(data: {
    asset: AssetId;
    amount: string;
}): {
    asset: AssetId;
    amount: number;
};
export declare function convertSwap(swap: FastspotSwap): Swap;
export declare function convertSwap(swap: FastspotQuote): Quote;
export declare function validateRequestPairs(sell: RequestAsset<AssetId> | RequestAssetWithAmount<AssetId>, buy: RequestAsset<AssetId> | RequestAssetWithAmount<AssetId>): boolean;
