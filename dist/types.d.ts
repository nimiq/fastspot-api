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
    PENDING_CONFIRMATION = "PENDING_CONFIRMATION",
    PENDING_DEPOSIT = "PENDING_DEPOSIT",
    FINISHED = "FINISHED",
    EXPIRED = "EXPIRED"
}
export declare enum ContractStatus {
    PENDING = "PENDING",
    REDEEMED = "REDEEMED"
}
type FastspotBaseNetwork = {
    name: string;
};
type FastspotLayer2Network = FastspotBaseNetwork & {
    parent: {
        name: string;
    };
};
type FastspotTokenNetwork = FastspotBaseNetwork & {
    nativeAsset: string;
    chainId: string;
};
type FastspotNetwork = FastspotBaseNetwork | FastspotLayer2Network | FastspotTokenNetwork;
export type FastspotAsset = {
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
export type FastspotFee = {
    asset: Ticker;
    network: string;
    amount: string;
    included: boolean;
    source: FastspotFeeSource;
    type: FastspotFeeType;
    reason?: string;
};
export type FastspotContract<T extends AssetId> = {
    id: string;
    asset: T;
    amount: string;
    status: ContractStatus;
    refundTarget: string | {
        address: string;
    } | null;
    recipient: string | (T extends AssetId.EUR ? {
        kty: string;
        crv: string;
        x: string;
        y?: string;
    } : {
        address: string;
    }) | null;
    expiry: number;
    data: null;
};
export type FastspotQuote = {
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
export type FastspotSwap = Omit<FastspotQuote, 'status'> & {
    status: SwapStatus;
    hash: string;
    preimage?: string;
    contracts: FastspotContract<AssetId>[];
};
export type FastspotResult = FastspotAsset[] | FastspotQuote | FastspotSwap;
export type FastspotError = {
    status: number;
    type: string;
    title: string;
    detail: string;
};
export type RequestAsset<A extends AssetId> = {
    asset: A;
} & (A extends AssetId.BTC_LN ? {
    peer: string;
} : {
    peer?: string;
});
export type RequestAssetWithAmount<A extends AssetId> = RequestAsset<A> & {
    amount: string | number;
};
export type Fee = {
    asset: Ticker;
    network: string;
    amount: number;
    included: boolean;
    source: FastspotFeeSource;
    type: FastspotFeeType;
    reason?: string;
};
export type Quote = {
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
export type Swap = Quote & {
    hash: string;
    preimage?: string;
    contracts: FastspotContract<AssetId>[];
};
export {};
