export declare enum Asset {
    NIM = "NIM",
    BTC = "BTC",
    USD = "USD",
    EUR = "EUR"
}
export declare enum Ticker {
    NIM = "NIM",
    BTC = "BTC",
    USDC = "USDC",
    EUR = "EUR"
}
/** @deprecated */
export declare enum AssetId {
    NIM = "NIM",
    BTC = "BTC",
    BTC_LN = "BTC_LN",
    USDC_MATIC = "USDC_MATIC",
    EUR = "EUR"
}
export declare enum ReferenceAsset {
    USD = "USD"
}
export declare const Precision: {
    readonly NIM: 5;
    readonly BTC: 8;
    readonly USDC: 6;
    readonly EUR: 2;
    readonly USD: 2;
};
export declare enum SwapStatus {
    PENDING_CONFIRMATION = "PENDING_CONFIRMATION"
}
declare type FastspotBaseNetwork = {
    name: string;
};
declare type FastspotLayer2Network = FastspotBaseNetwork & {
    parent: {
        name: string;
    };
};
declare type FastspotTokenNetwork = FastspotBaseNetwork & {
    nativeAsset: string;
    chainId: string;
};
declare type FastspotNetwork = FastspotBaseNetwork | FastspotLayer2Network | FastspotTokenNetwork;
export declare type FastspotAsset = {
    /** @deprecated */
    id: string;
    ticker: Ticker;
    network: FastspotNetwork;
    decimals: number;
    name: string;
    asset: {
        ticker: Asset;
        name: string;
        decimals: number;
    };
    alternativeIds: string[];
    v1Symbol: string;
} & ({
    contract: string;
    htlc: string;
} | {});
declare enum FastspotFeeSource {
    NETWORK = "NETWORK",
    SERVICE = "SERVICE"
}
declare enum FastspotFeeType {
    DEPOSIT_TRANSACTION = "DEPOSIT_TRANSACTION",
    REDEMPTION_TRANSACTION = "REDEMPTION_TRANSACTION",
    REFUND_TRANSACTION = "REFUND_TRANSACTION",
    EXECUTION = "EXECUTION"
}
export declare type FastspotFee = {
    asset: Ticker;
    network: string;
    amount: string;
    included: boolean;
    source: FastspotFeeSource;
    type: FastspotFeeType;
    reason?: string;
};
export declare type FastspotQuote = {
    id: string;
    status: SwapStatus;
    sell: {
        asset: AssetId;
        amount: string;
    }[];
    buy: {
        asset: AssetId;
        amount: string;
    }[];
    fees: FastspotFee[];
    expiry: number;
};
export declare type FastspotResult = FastspotAsset[] | FastspotQuote;
export declare type FastspotError = {
    status: number;
    type: string;
    title: string;
    detail: string;
};
export declare type RequestAsset<A extends AssetId> = {
    asset: A;
} & (A extends AssetId.BTC_LN ? {
    peer: string;
} : {
    peer?: string;
});
export declare type RequestAssetWithAmount<A extends AssetId> = RequestAsset<A> & {
    amount: string | number;
};
export declare type Fee = {
    asset: Ticker;
    network: string;
    amount: number;
    included: boolean;
    source: FastspotFeeSource;
    type: FastspotFeeType;
    reason?: string;
};
export declare type Quote = {
    id: string;
    status: SwapStatus;
    sell: {
        asset: AssetId;
        amount: number;
    };
    buy: {
        asset: AssetId;
        amount: number;
    };
    fees: Fee[];
    expiry: number;
};
export {};
