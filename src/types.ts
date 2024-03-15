export enum Asset {
    NIM = 'NIM',
    BTC = 'BTC',
    USD = 'USD',
    EUR = 'EUR',
}

export enum Ticker {
    NIM = 'NIM',
    BTC = 'BTC',
    USDC = 'USDC',
    // USDC_e = 'USDC.e',
    EUR = 'EUR',
}

/** @deprecated */
export enum AssetId {
    NIM = 'NIM',
    BTC = 'BTC',
    BTC_LN = 'BTC_LN',
    USDC_MATIC = 'USDC_MATIC',
    EUR = 'EUR',
}

export enum ReferenceAsset {
    USD = 'USD',
}

// export type ReferralCodes = {
//     partnerCode: string,
//     refCode?: string,
// };

export const Precision = {
    [Ticker.NIM]: 5,
    [Ticker.BTC]: 8,
    [Ticker.USDC]: 6,
    [Ticker.EUR]: 2,
    [ReferenceAsset.USD]: 2,
} as const;

export enum SwapStatus {
    PENDING_CONFIRMATION = 'PENDING_CONFIRMATION',
    PENDING_DEPOSIT = 'PENDING_DEPOSIT',
    FINISHED = 'FINISHED',

    // WAITING_FOR_REDEMPTION = 'waiting-for-redemption',
    // EXPIRED_PENDING_CONFIRMATION = 'expired-pending-confirmation',
    // EXPIRED_PENDING_TRANSACTIONS = 'expired-pending-transactions',
    // CANCELLED = 'cancelled',
    // INVALID = 'invalid',
}

export enum ContractStatus {
    PENDING = 'PENDING',
    // FUNDED = 'funded',
    // TIMEOUT_REACHED = 'timeout-reached',
    // REFUNDED = 'refunded',
    REDEEMED = 'REDEEMED',
}

// Internal Types

type FastspotBaseNetwork = {
    name: string,
}

type FastspotLayer2Network = FastspotBaseNetwork & {
    parent: {
        name: string,
    },
}

type FastspotTokenNetwork = FastspotBaseNetwork & {
    nativeAsset: string,
    chainId: string,
}

type FastspotNetwork = FastspotBaseNetwork | FastspotLayer2Network | FastspotTokenNetwork;

export type FastspotAsset = {
    /** @deprecated */
    id: string,
    ticker: Ticker,
    network: FastspotNetwork,
    decimals: number,
    name: string,
    asset: {
        ticker: Asset,
        name: string,
        decimals: number,
    },
    alternativeIds: string[],
    v1Symbol: string,
} & ({
    // For tokens
    contract: string,
    htlc: string,
} | {});

enum FastspotFeeSource {
    NETWORK = 'NETWORK',
    SERVICE = 'SERVICE',
}

enum FastspotFeeType {
    DEPOSIT_TRANSACTION = 'DEPOSIT_TRANSACTION',
    REDEMPTION_TRANSACTION = 'REDEMPTION_TRANSACTION',
    REFUND_TRANSACTION = 'REFUND_TRANSACTION',
    EXECUTION = 'EXECUTION',
}

export type FastspotFee = {
    asset: Ticker,
    network: string,
    amount: string,
    included: boolean,
    source: FastspotFeeSource,
    type: FastspotFeeType,
    reason?: string,
};

// export type FastspotPrice = {
//     symbol: SwapAsset,
//     name: string,
//     amount: string,
//     fundingNetworkFee: FastspotFee,
//     operatingNetworkFee: FastspotFee,
//     finalizeNetworkFee: FastspotFee,
// };

// export type FastspotEstimate = {
//     from: FastspotPrice[],
//     to: FastspotPrice[],
//     serviceFeePercentage: string | number,
//     direction: 'forward' | 'reverse',
// };

// TODO: Not yet complete
export type FastspotContract<T extends AssetId> = {
    id: string,
    asset: T,
    amount: string,
    status: ContractStatus,
    refundTarget: string | {
        address: string,
    } | null,
    recipient: string | (T extends AssetId.EUR ? {
        kty: string,
        crv: string,
        x: string,
        y?: string,
    } : {
        address: string,
    }) | null,
    expiry: number,
    data: null,
};

// export type FastspotContractWithEstimate<T extends SwapAsset> = {
//     contract: FastspotContract<T>,
//     info: FastspotEstimate,
// };

export type FastspotQuote = {
    id: string,
    status: SwapStatus,
    sell: {
        asset: AssetId,
        amount: string,
    }[],
    buy: {
        asset: AssetId,
        amount: string,
    }[],
    fees: FastspotFee[],
    expiry: number,
};

export type FastspotSwap = Omit<FastspotQuote, 'status'> & {
    status: SwapStatus,
    hash: string,
    preimage?: string,
    contracts: FastspotContract<AssetId>[],
};

// export type FastspotLimits<T extends SwapAsset> = {
//     asset: T,
//     daily: string,
//     dailyRemaining: string,
//     monthly: string,
//     monthlyRemaining: string,
//     swap: string,
//     current: string,
//     referenceAsset: ReferenceAsset,
//     referenceDaily: string,
//     referenceDailyRemaining: string,
//     referenceMonthly: string,
//     referenceMonthlyRemaining: string,
//     referenceSwap: string,
//     referenceCurrent: string,
// };

// export type FastspotUserLimits = {
//     asset: ReferenceAsset,
//     daily: string,
//     dailyRemaining: string,
//     monthly: string,
//     monthlyRemaining: string,
//     swap: string,
//     current: string,
// }

export type FastspotResult
    = FastspotAsset[]
    // | FastspotEstimate[]
    | FastspotQuote
    | FastspotSwap;
    // | FastspotContractWithEstimate<SwapAsset>
    // | FastspotLimits<SwapAsset>
    // | FastspotUserLimits;

export type FastspotError = {
    status: number,
    type: string,
    title: string,
    detail: string,
};

// Public Types

// export type AssetDetails = {
//     asset: SwapAsset,
//     name: string,
//     feePerUnit: number,
//     limits: {
//         minimum?: number,
//         maximum?: number,
//     },
// };

// export type AssetList = {[asset in SwapAsset]: Asset};

export type RequestAsset<A extends AssetId> = {
    asset: A,
} & (A extends AssetId.BTC_LN ? {
    peer: string, // For BTC_LN, peer is required
} : {
    peer?: string,
});

export type RequestAssetWithAmount<A extends AssetId> = RequestAsset<A> & {
    amount: string | number,
};

export type Fee = {
    asset: Ticker,
    network: string,
    amount: number,
    included: boolean,
    source: FastspotFeeSource,
    type: FastspotFeeType,
    reason?: string,
};

// export type Estimate = {
//     from: PriceData,
//     to: PriceData,
//     serviceFeePercentage: number,
//     direction: 'forward' | 'reverse',
// };

// export type NimHtlcDetails = {
//     address: string,
//     timeoutBlock: number,
//     data: string,
// };

// export type BtcHtlcDetails = {
//     address: string,
//     script: string,
// };

// export type EurHtlcDetails = {
//     address: string,
// };

// export type UsdcHtlcDetails = {
//     address: string,
//     contract: string,
//     data?: string,
// };

// export type HtlcDetails = NimHtlcDetails | BtcHtlcDetails | UsdcHtlcDetails | EurHtlcDetails;

// export type Contract<T extends SwapAsset> = {
//     asset: T,
//     refundAddress: string,
//     redeemAddress: string,
//     amount: number,
//     timeout: number,
//     direction: 'send' | 'receive',
//     status: ContractStatus,
//     htlc: T extends SwapAsset.NIM ? NimHtlcDetails
//         : T extends SwapAsset.BTC ? BtcHtlcDetails
//         : T extends SwapAsset.USDC_MATIC ? UsdcHtlcDetails
//         : T extends SwapAsset.EUR ? EurHtlcDetails
//         : never,
// };

// export type ContractWithEstimate<T extends SwapAsset> = Estimate & {
//     contract: Contract<T>,
// };

export type Quote = {
    id: string,
    status: SwapStatus,
    sell: {
        asset: AssetId,
        amount: number,
    },
    buy: {
        asset: AssetId,
        amount: number,
    },
    fees: Fee[],
    expiry: number,
};

export type Swap = Quote & {
    hash: string,
    preimage?: string,
    contracts: FastspotContract<AssetId>[],
};

// export type Limits<T extends SwapAsset> = {
//     asset: T,
//     daily: number,
//     dailyRemaining: number,
//     monthly: number,
//     monthlyRemaining: number,
//     perSwap: number,
//     current: number,
//     reference: {
//         asset: ReferenceAsset,
//         daily: number,
//         dailyRemaining: number,
//         monthly: number,
//         monthlyRemaining: number,
//         perSwap: number,
//         current: number,
//     },
// };

// export type UserLimits = {
//     asset: ReferenceAsset,
//     daily: number,
//     dailyRemaining: number,
//     monthly: number,
//     monthlyRemaining: number,
//     perSwap: number,
//     current: number,
// };
