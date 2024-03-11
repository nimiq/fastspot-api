import { RequestAsset, RequestAssetWithAmount, AssetId, Quote } from './types';
export declare function init(url: string, key: string): void;
export declare function createSwap(sell: RequestAsset<AssetId>, buy: RequestAssetWithAmount<AssetId>): Promise<Quote>;
export declare function createSwap(sell: RequestAssetWithAmount<AssetId>, buy: RequestAsset<AssetId>): Promise<Quote>;
