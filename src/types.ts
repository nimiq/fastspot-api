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
    USDC_e_MATIC = 'USDC_e_MATIC',
    EUR = 'EUR',
}

export enum ReferenceAsset {
    USD = 'USD',
}

// export type ReferralCodes = {
//     partnerCode: string,
//     refCode?: string,
// };

export enum SwapStatus {
    PENDING_CONFIRMATION = 'PENDING_CONFIRMATION',
    // WAITING_FOR_CONFIRMATION = 'waiting-for-confirmation',
    // WAITING_FOR_TRANSACTIONS = 'waiting-for-transactions',
    // WAITING_FOR_REDEMPTION = 'waiting-for-redemption',
    // FINISHED = 'finished',
    // EXPIRED_PENDING_CONFIRMATION = 'expired-pending-confirmation',
    // EXPIRED_PENDING_TRANSACTIONS = 'expired-pending-transactions',
    // CANCELLED = 'cancelled',
    // INVALID = 'invalid',
}

// export enum ContractStatus {
//     PENDING = 'pending',
//     FUNDED = 'funded',
//     TIMEOUT_REACHED = 'timeout-reached',
//     REFUNDED = 'refunded',
//     REDEEMED = 'redeemed',
// }

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

// export type FastspotContract<T extends SwapAsset> = {
//     asset: T,
//     refund?: { address: string },
//     recipient: T extends SwapAsset.EUR ? {
//         kty: string,
//         crv: string,
//         x: string,
//         y?: string,
//     } : {
//         address: string,
//     },
//     amount: number,
//     timeout: number,
//     direction: 'send' | 'receive',
//     status: ContractStatus,
//     id: string,
//     intermediary: T extends SwapAsset.NIM ? {
//         address: string,
//         timeoutBlock: number,
//         data: string,
//     } : T extends SwapAsset.BTC ? {
//         p2sh: string,
//         p2wsh: string,
//         scriptBytes: string,
//     } : T extends SwapAsset.USDC_MATIC ? {
//         address: string,
//         data?: string, // Only provided for 'send' direction
//     } : T extends SwapAsset.EUR ? {
//         contractId?: string,
//     } : never,
// };

// export type FastspotContractWithEstimate<T extends SwapAsset> = {
//     contract: FastspotContract<T>,
//     info: FastspotEstimate,
// };

export type FastspotPreSwap = {
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

// export type FastspotSwap = FastspotPreSwap & {
//     hash: string,
//     secret?: string,
//     contracts: FastspotContract<SwapAsset>[],
// };

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
    | FastspotPreSwap;
    // | FastspotSwap
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

// // export type RequestAsset = Partial<Record<SwapAsset, number>>;
// export type RequestAsset<K extends SwapAsset> = {
//     [P in K]: (Record<P, number> &
//         Partial<Record<Exclude<K, P>, never>>) extends infer O
//             ? { [Q in keyof O]: O[Q] }
//             : never
// }[K];

// export type PriceData = {
//     asset: SwapAsset,
//     amount: number,
//     fee: number,
//     feePerUnit?: number,
//     serviceNetworkFee: number,
//     serviceEscrowFee: number,
// };

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

// export type PreSwap = Estimate & {
//     id: string,
//     expires: number,
//     status: SwapStatus,
// };

// export type Swap = PreSwap & {
//     hash: string,
//     secret?: string,
//     contracts: Partial<Record<SwapAsset, Contract<SwapAsset>>>,
// };

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
