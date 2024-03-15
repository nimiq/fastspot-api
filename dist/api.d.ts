import { RequestAsset, RequestAssetWithAmount, AssetId, Quote, Swap } from './types';
export declare function init(url: string, key: string): void;
export declare function createSwap(sell: RequestAsset<AssetId>, buy: RequestAssetWithAmount<AssetId>): Promise<Quote>;
export declare function createSwap(sell: RequestAssetWithAmount<AssetId>, buy: RequestAsset<AssetId>): Promise<Quote>;
export declare function provideFundingProof(swapId: string, contractId: string, proof: string): Promise<Swap>;
export declare function getSwap(id: string): Promise<Quote | Swap>;
