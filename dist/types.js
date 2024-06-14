export var SwapAsset;
(function (SwapAsset) {
    SwapAsset["NIM"] = "NIM";
    SwapAsset["BTC"] = "BTC";
    SwapAsset["BTC_LN"] = "BTC_LN";
    SwapAsset["USDC"] = "USDC";
    SwapAsset["USDC_MATIC"] = "USDC_MATIC";
    SwapAsset["EUR"] = "EUR";
    SwapAsset["CRC"] = "CRC";
})(SwapAsset || (SwapAsset = {}));
export var ReferenceAsset;
(function (ReferenceAsset) {
    ReferenceAsset["USD"] = "USD";
})(ReferenceAsset || (ReferenceAsset = {}));
export const Precision = {
    [SwapAsset.NIM]: 5,
    [SwapAsset.BTC]: 8,
    [SwapAsset.BTC_LN]: 8,
    [SwapAsset.USDC]: 6,
    [SwapAsset.USDC_MATIC]: 6,
    [SwapAsset.EUR]: 2,
    [ReferenceAsset.USD]: 2,
    [SwapAsset.CRC]: 2,
};
export var SwapStatus;
(function (SwapStatus) {
    SwapStatus["WAITING_FOR_CONFIRMATION"] = "waiting-for-confirmation";
    SwapStatus["WAITING_FOR_TRANSACTIONS"] = "waiting-for-transactions";
    SwapStatus["WAITING_FOR_REDEMPTION"] = "waiting-for-redemption";
    SwapStatus["FINISHED"] = "finished";
    /** @deprecated */
    SwapStatus["EXPIRED_PENDING_CONFIRMATIONS"] = "expired-pending-confirmation";
    SwapStatus["EXPIRED_PENDING_CONFIRMATION"] = "expired-pending-confirmation";
    SwapStatus["EXPIRED_PENDING_TRANSACTIONS"] = "expired-pending-transactions";
    SwapStatus["CANCELLED"] = "cancelled";
    SwapStatus["INVALID"] = "invalid";
})(SwapStatus || (SwapStatus = {}));
export var ContractStatus;
(function (ContractStatus) {
    ContractStatus["PENDING"] = "pending";
    ContractStatus["FUNDED"] = "funded";
    ContractStatus["TIMEOUT_REACHED"] = "timeout-reached";
    ContractStatus["REFUNDED"] = "refunded";
    ContractStatus["REDEEMED"] = "redeemed";
})(ContractStatus || (ContractStatus = {}));
