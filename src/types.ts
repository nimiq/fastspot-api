export enum SwapAsset {
    NIM = 'NIM',
    BTC = 'BTC',
    EUR = 'EUR',
}

export enum ReferenceAsset {
    USD = 'USD',
}

export const Precision = {
    [SwapAsset.NIM]: 5,
    [SwapAsset.BTC]: 8,
    [SwapAsset.EUR]: 2,
    [ReferenceAsset.USD]: 2,
} as const;

// Internal Types

export type FastspotAsset = {
    symbol: SwapAsset,
    name: string,
    feePerUnit: string,
    limits?: {
        minimum: string | null,
        maximum: string | null,
    },
    software?: {
        name: string,
        version: string | null,
        network: 'test' | 'main',
        syncBlockHeight: number,
    },
    provider?: {
        url: string,
        company: string | null,
        engine: 'mock',
    },
};

export type FastspotFee = {
    perUnit?: string,
    total: string,
    totalIsIncluded: boolean,
};

export type FastspotPrice = {
    symbol: 'NIM' | 'BTC',
    name: string,
    amount: string,
    fundingNetworkFee: FastspotFee,
    operatingNetworkFee: FastspotFee,
    finalizeNetworkFee: FastspotFee,
};

export type FastspotEstimate = {
    from: FastspotPrice[],
    to: FastspotPrice[],
    serviceFeePercentage: string | number,
    direction: 'forward' | 'reverse',
};

export type FastspotContract<T extends SwapAsset> = {
    asset: T,
    refund?: { address: string },
    recipient: T extends SwapAsset.EUR ? {
        kty: string,
        crv: string,
        x: string,
        y?: string,
    } : {
        address: string,
    },
    amount: number,
    timeout: number,
    direction: 'send' | 'receive',
    status: string,
    id: string,
    intermediary: T extends SwapAsset.NIM ? {
        address: string,
        timeoutBlock: number,
        data: string,
    } : T extends SwapAsset.BTC ? {
        p2sh: string,
        p2wsh: string,
        scriptBytes: string,
    } : T extends SwapAsset.EUR ? {
        contractId?: string,
    } : never,
};

export type FastspotContractWithEstimate<T extends SwapAsset> = {
    contract: FastspotContract<T>,
    info: FastspotEstimate,
};

export type FastspotPreSwap = {
    id: string,
    status: string,
    expires: number,
    info: FastspotEstimate,
};

export type FastspotSwap = FastspotPreSwap & {
    hash: string,
    secret?: string,
    contracts: FastspotContract<SwapAsset>[],
};

export type FastspotLimits<T extends SwapAsset> = {
    asset: T,
    daily: string,
    dailyRemaining: string,
    monthly: string,
    monthlyRemaining: string,
    swap: string,
    current: string,
    referenceAsset: ReferenceAsset,
    referenceDaily: string,
    referenceDailyRemaining: string,
    referenceMonthly: string,
    referenceMonthlyRemaining: string,
    referenceSwap: string,
    referenceCurrent: string,
};

export type FastspotUserLimits = {
    asset: ReferenceAsset,
    daily: string,
    dailyRemaining: string,
    monthly: string,
    monthlyRemaining: string,
    swap: string,
    current: string,
}

export type FastspotResult
    = FastspotAsset[]
    | FastspotEstimate[]
    | FastspotSwap
    | FastspotContractWithEstimate<SwapAsset>
    | FastspotLimits<SwapAsset>
    | FastspotUserLimits;

export type FastspotError = {
    status: number,
    type: string,
    title: string,
    detail: string,
};

// Public Types

export type Asset = {
    asset: SwapAsset,
    name: string,
    feePerUnit: number,
    limits: {
        minimum: number,
        maximum: number,
    },
};

export type AssetList = {[asset in SwapAsset]: Asset};

// export type RequestAsset = Partial<Record<SwapAsset, number>>;
export type RequestAsset<K extends SwapAsset> = {
    [P in K]: (Record<P, number> &
        Partial<Record<Exclude<K, P>, never>>) extends infer O
            ? { [Q in keyof O]: O[Q] }
            : never
}[K];

export type PriceData = {
    asset: SwapAsset,
    amount: number,
    fee: number,
    feePerUnit?: number,
    serviceNetworkFee: number,
    serviceEscrowFee: number,
};

export type Estimate = {
    from: PriceData,
    to: PriceData,
    serviceFeePercentage: number,
};

export type NimHtlcDetails = {
    address: string,
    timeoutBlock: number,
    data: string,
};

export type BtcHtlcDetails = {
    address: string,
    script: string,
};

export type EurHtlcDetails = {
    address: string,
};

export type HtlcDetails = NimHtlcDetails | BtcHtlcDetails | EurHtlcDetails;

export type Contract<T extends SwapAsset> = {
    asset: T,
    refundAddress: string,
    redeemAddress: string,
    amount: number,
    timeout: number,
    direction: 'send' | 'receive',
    status: string,
    htlc: T extends SwapAsset.NIM ? NimHtlcDetails
        : T extends SwapAsset.BTC ? BtcHtlcDetails
        : T extends SwapAsset.EUR ? EurHtlcDetails
        : never,
};

export type ContractWithEstimate<T extends SwapAsset> = Estimate & {
    contract: Contract<T>,
};

export type PreSwap = Estimate & {
    id: string,
    expires: number,
    status: string,
};

export type Swap = PreSwap & {
    hash: string,
    secret?: string,
    contracts: Partial<Record<SwapAsset, Contract<SwapAsset>>>,
};

export type Limits<T extends SwapAsset> = {
    asset: T,
    daily: number,
    dailyRemaining: number,
    monthly: number,
    monthlyRemaining: number,
    perSwap: number,
    current: number,
    reference: {
        asset: ReferenceAsset,
        daily: number,
        dailyRemaining: number,
        monthly: number,
        monthlyRemaining: number,
        perSwap: number,
        current: number,
    },
};

export type UserLimits = {
    asset: ReferenceAsset,
    daily: number,
    dailyRemaining: number,
    monthly: number,
    monthlyRemaining: number,
    perSwap: number,
    current: number,
};
