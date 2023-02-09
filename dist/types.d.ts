export declare enum SwapAsset {
    NIM = "NIM",
    BTC = "BTC",
    USDC = "USDC",
    EUR = "EUR"
}
export declare enum ReferenceAsset {
    USD = "USD"
}
export declare type ReferralCodes = {
    partnerCode: string;
    refCode?: string;
};
export declare const Precision: {
    readonly NIM: 5;
    readonly BTC: 8;
    readonly USDC: 6;
    readonly EUR: 2;
    readonly USD: 2;
};
export declare enum SwapStatus {
    WAITING_FOR_CONFIRMATION = "waiting-for-confirmation",
    WAITING_FOR_TRANSACTIONS = "waiting-for-transactions",
    WAITING_FOR_REDEMPTION = "waiting-for-redemption",
    FINISHED = "finished",
    /** @deprecated */
    EXPIRED_PENDING_CONFIRMATIONS = "expired-pending-confirmation",
    EXPIRED_PENDING_CONFIRMATION = "expired-pending-confirmation",
    EXPIRED_PENDING_TRANSACTIONS = "expired-pending-transactions",
    CANCELLED = "cancelled",
    INVALID = "invalid"
}
export declare enum ContractStatus {
    PENDING = "pending",
    FUNDED = "funded",
    TIMEOUT_REACHED = "timeout-reached",
    REFUNDED = "refunded",
    REDEEMED = "redeemed"
}
export declare type FastspotAsset = {
    symbol: SwapAsset;
    name: string;
    feePerUnit: string;
    limits?: {
        minimum: string | null;
        maximum: string | null;
    };
    software?: {
        name: string;
        version: string | null;
        network: 'test' | 'main';
        syncBlockHeight: number;
    };
    provider?: {
        url: string;
        company: string | null;
        engine: 'mock';
    };
};
export declare type FastspotFee = {
    perUnit?: string;
    total: string;
    totalIsIncluded: boolean;
};
export declare type FastspotPrice = {
    symbol: SwapAsset;
    name: string;
    amount: string;
    fundingNetworkFee: FastspotFee;
    operatingNetworkFee: FastspotFee;
    finalizeNetworkFee: FastspotFee;
};
export declare type FastspotEstimate = {
    from: FastspotPrice[];
    to: FastspotPrice[];
    serviceFeePercentage: string | number;
    direction: 'forward' | 'reverse';
};
export declare type FastspotContract<T extends SwapAsset> = {
    asset: T;
    refund?: {
        address: string;
    };
    recipient: T extends SwapAsset.EUR ? {
        kty: string;
        crv: string;
        x: string;
        y?: string;
    } : {
        address: string;
    };
    amount: number;
    timeout: number;
    direction: 'send' | 'receive';
    status: ContractStatus;
    id: string;
    intermediary: T extends SwapAsset.NIM ? {
        address: string;
        timeoutBlock: number;
        data: string;
    } : T extends SwapAsset.BTC ? {
        p2sh: string;
        p2wsh: string;
        scriptBytes: string;
    } : T extends SwapAsset.USDC ? {
        address: string;
        data?: string;
    } : T extends SwapAsset.EUR ? {
        contractId?: string;
    } : never;
};
export declare type FastspotContractWithEstimate<T extends SwapAsset> = {
    contract: FastspotContract<T>;
    info: FastspotEstimate;
};
export declare type FastspotPreSwap = {
    id: string;
    status: SwapStatus;
    expires: number;
    info: FastspotEstimate;
};
export declare type FastspotSwap = FastspotPreSwap & {
    hash: string;
    secret?: string;
    contracts: FastspotContract<SwapAsset>[];
};
export declare type FastspotLimits<T extends SwapAsset> = {
    asset: T;
    daily: string;
    dailyRemaining: string;
    monthly: string;
    monthlyRemaining: string;
    swap: string;
    current: string;
    referenceAsset: ReferenceAsset;
    referenceDaily: string;
    referenceDailyRemaining: string;
    referenceMonthly: string;
    referenceMonthlyRemaining: string;
    referenceSwap: string;
    referenceCurrent: string;
};
export declare type FastspotUserLimits = {
    asset: ReferenceAsset;
    daily: string;
    dailyRemaining: string;
    monthly: string;
    monthlyRemaining: string;
    swap: string;
    current: string;
};
export declare type FastspotResult = FastspotAsset[] | FastspotEstimate[] | FastspotSwap | FastspotContractWithEstimate<SwapAsset> | FastspotLimits<SwapAsset> | FastspotUserLimits;
export declare type FastspotError = {
    status: number;
    type: string;
    title: string;
    detail: string;
};
export declare type Asset = {
    asset: SwapAsset;
    name: string;
    feePerUnit: number;
    limits: {
        minimum?: number;
        maximum?: number;
    };
};
export declare type AssetList = {
    [asset in SwapAsset]: Asset;
};
export declare type RequestAsset<K extends SwapAsset> = {
    [P in K]: (Record<P, number> & Partial<Record<Exclude<K, P>, never>>) extends infer O ? {
        [Q in keyof O]: O[Q];
    } : never;
}[K];
export declare type PriceData = {
    asset: SwapAsset;
    amount: number;
    fee: number;
    feePerUnit?: number;
    serviceNetworkFee: number;
    serviceEscrowFee: number;
};
export declare type Estimate = {
    from: PriceData;
    to: PriceData;
    serviceFeePercentage: number;
    direction: 'forward' | 'reverse';
};
export declare type NimHtlcDetails = {
    address: string;
    timeoutBlock: number;
    data: string;
};
export declare type BtcHtlcDetails = {
    address: string;
    script: string;
};
export declare type EurHtlcDetails = {
    address: string;
};
export declare type UsdcHtlcDetails = {
    address: string;
    contract: string;
    data?: string;
};
export declare type HtlcDetails = NimHtlcDetails | BtcHtlcDetails | UsdcHtlcDetails | EurHtlcDetails;
export declare type Contract<T extends SwapAsset> = {
    asset: T;
    refundAddress: string;
    redeemAddress: string;
    amount: number;
    timeout: number;
    direction: 'send' | 'receive';
    status: ContractStatus;
    htlc: T extends SwapAsset.NIM ? NimHtlcDetails : T extends SwapAsset.BTC ? BtcHtlcDetails : T extends SwapAsset.USDC ? UsdcHtlcDetails : T extends SwapAsset.EUR ? EurHtlcDetails : never;
};
export declare type ContractWithEstimate<T extends SwapAsset> = Estimate & {
    contract: Contract<T>;
};
export declare type PreSwap = Estimate & {
    id: string;
    expires: number;
    status: SwapStatus;
};
export declare type Swap = PreSwap & {
    hash: string;
    secret?: string;
    contracts: Partial<Record<SwapAsset, Contract<SwapAsset>>>;
};
export declare type Limits<T extends SwapAsset> = {
    asset: T;
    daily: number;
    dailyRemaining: number;
    monthly: number;
    monthlyRemaining: number;
    perSwap: number;
    current: number;
    reference: {
        asset: ReferenceAsset;
        daily: number;
        dailyRemaining: number;
        monthly: number;
        monthlyRemaining: number;
        perSwap: number;
        current: number;
    };
};
export declare type UserLimits = {
    asset: ReferenceAsset;
    daily: number;
    dailyRemaining: number;
    monthly: number;
    monthlyRemaining: number;
    perSwap: number;
    current: number;
};
