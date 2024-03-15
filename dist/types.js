export var Asset;
(function (Asset) {
    Asset["NIM"] = "NIM";
    Asset["BTC"] = "BTC";
    Asset["USD"] = "USD";
    Asset["EUR"] = "EUR";
})(Asset || (Asset = {}));
export var Ticker;
(function (Ticker) {
    Ticker["NIM"] = "NIM";
    Ticker["BTC"] = "BTC";
    Ticker["USDC"] = "USDC";
    // USDC_e = 'USDC.e',
    Ticker["EUR"] = "EUR";
})(Ticker || (Ticker = {}));
/** @deprecated */
export var AssetId;
(function (AssetId) {
    AssetId["NIM"] = "NIM";
    AssetId["BTC"] = "BTC";
    AssetId["BTC_LN"] = "BTC_LN";
    AssetId["USDC_MATIC"] = "USDC_MATIC";
    AssetId["EUR"] = "EUR";
})(AssetId || (AssetId = {}));
export var ReferenceAsset;
(function (ReferenceAsset) {
    ReferenceAsset["USD"] = "USD";
})(ReferenceAsset || (ReferenceAsset = {}));
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
};
export var SwapStatus;
(function (SwapStatus) {
    SwapStatus["PENDING_CONFIRMATION"] = "PENDING_CONFIRMATION";
    SwapStatus["PENDING_DEPOSIT"] = "PENDING_DEPOSIT";
    SwapStatus["FINISHED"] = "FINISHED";
    // WAITING_FOR_REDEMPTION = 'waiting-for-redemption',
    // EXPIRED_PENDING_CONFIRMATION = 'expired-pending-confirmation',
    // EXPIRED_PENDING_TRANSACTIONS = 'expired-pending-transactions',
    // CANCELLED = 'cancelled',
    // INVALID = 'invalid',
})(SwapStatus || (SwapStatus = {}));
export var ContractStatus;
(function (ContractStatus) {
    ContractStatus["PENDING"] = "PENDING";
    // FUNDED = 'funded',
    // TIMEOUT_REACHED = 'timeout-reached',
    // REFUNDED = 'refunded',
    ContractStatus["REDEEMED"] = "REDEEMED";
})(ContractStatus || (ContractStatus = {}));
var FastspotFeeSource;
(function (FastspotFeeSource) {
    FastspotFeeSource["NETWORK"] = "NETWORK";
    FastspotFeeSource["SERVICE"] = "SERVICE";
})(FastspotFeeSource || (FastspotFeeSource = {}));
var FastspotFeeType;
(function (FastspotFeeType) {
    FastspotFeeType["DEPOSIT_TRANSACTION"] = "DEPOSIT_TRANSACTION";
    FastspotFeeType["REDEMPTION_TRANSACTION"] = "REDEMPTION_TRANSACTION";
    FastspotFeeType["REFUND_TRANSACTION"] = "REFUND_TRANSACTION";
    FastspotFeeType["EXECUTION"] = "EXECUTION";
})(FastspotFeeType || (FastspotFeeType = {}));
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
