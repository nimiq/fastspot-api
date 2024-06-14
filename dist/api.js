var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SwapAsset, } from './types';
import { coinsToUnits, convertContract, convertFromData, convertLimits, convertSwap, convertToData, convertUserLimits, validateRequestPairs, } from './helpers';
let API_URL;
let API_KEY;
let REFERRAL;
let FETCH;
export function init(url, key, options) {
    if (!url || !key)
        throw new Error('url and key must be provided');
    API_URL = url;
    API_KEY = key;
    REFERRAL = options === null || options === void 0 ? void 0 : options.referral;
    FETCH = (options === null || options === void 0 ? void 0 : options.customFetch) || fetch;
}
function api(path, method, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!API_URL || !API_KEY)
            throw new Error('API URL and key not set, call init() first');
        const response = yield FETCH(`${API_URL}${path}`, Object.assign({ method, headers: Object.assign({ 'Content-Type': 'application/json', 'X-FAST-ApiKey': API_KEY }, options === null || options === void 0 ? void 0 : options.headers) }, ((options === null || options === void 0 ? void 0 : options.body) ? { body: JSON.stringify(options.body) } : {})));
        if (!response.ok) {
            const error = yield response.json();
            throw new Error(error.detail);
        }
        return response.json();
    });
}
export function getEstimate(from, to) {
    return __awaiter(this, void 0, void 0, function* () {
        validateRequestPairs(from, to);
        const result = yield api('/estimates', 'POST', {
            body: {
                from,
                to,
                includedFees: 'required',
            },
        });
        const inputObject = result[0].from[0];
        const outputObject = result[0].to[0];
        if (!inputObject || !outputObject)
            throw new Error('Insufficient market liquidity');
        const estimate = {
            from: convertFromData(inputObject),
            to: convertToData(outputObject),
            serviceFeePercentage: parseFloat(result[0].serviceFeePercentage),
            direction: result[0].direction,
        };
        return estimate;
    });
}
export function createSwap(from, to) {
    return __awaiter(this, void 0, void 0, function* () {
        validateRequestPairs(from, to);
        const headers = {};
        if (REFERRAL) {
            headers['X-S3-Partner-Code'] = REFERRAL.partnerCode;
            if (REFERRAL.refCode)
                headers['X-S3-Ref-Code'] = REFERRAL.refCode;
        }
        const result = yield api('/swaps', 'POST', {
            headers,
            body: {
                from,
                to,
                includedFees: 'required',
            },
        });
        return convertSwap(result);
    });
}
export function confirmSwap(swap, redeem, refund, uid, kycToken, oasisPrepareToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const headers = {};
        if (kycToken) {
            if (!uid)
                throw new Error('UID is required when using kycToken');
            headers['X-S3-KYC-Token'] = kycToken;
            headers['X-S3-KYC-UID'] = uid;
            if (oasisPrepareToken) {
                headers['X-OASIS-Prepare-Token'] = oasisPrepareToken;
            }
        }
        // Using a switch statement for TS safety
        let beneficiary;
        switch (redeem.asset) {
            case SwapAsset.EUR:
            case SwapAsset.CRC:
                beneficiary = {
                    [redeem.asset]: Object.assign({ kty: redeem.kty, crv: redeem.crv, x: redeem.x }, (redeem.y ? { y: redeem.y } : {})),
                };
                break;
            case SwapAsset.BTC_LN:
                beneficiary = {};
                break;
            case SwapAsset.NIM:
            case SwapAsset.BTC:
            case SwapAsset.USDC:
            case SwapAsset.USDC_MATIC:
                beneficiary = { [redeem.asset]: redeem.address };
                break;
        }
        const result = yield api(`/swaps/${swap.id}`, 'POST', {
            headers,
            body: Object.assign(Object.assign({ confirm: true, beneficiary }, (refund ? { refund: { [refund.asset]: 'address' in refund ? refund.address : '' } } : {})), (uid ? { uid } : {})),
        });
        return convertSwap(result);
    });
}
export function getSwap(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield api(`/swaps/${id}`, 'GET');
        return convertSwap(result);
    });
}
export function cancelSwap(swap) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield api(`/swaps/${swap.id}`, 'DELETE');
        return convertSwap(result);
    });
}
export function getContract(asset, address) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield api(`/contracts/${asset}/${address}`, 'GET');
        return {
            contract: convertContract(result.contract),
            from: convertFromData(result.info.from[0]),
            to: convertToData(result.info.to[0]),
            serviceFeePercentage: parseFloat(result.info.serviceFeePercentage),
            direction: result.info.direction,
        };
    });
}
export function getLimits(asset, address, kycUid) {
    return __awaiter(this, void 0, void 0, function* () {
        const headers = {};
        if (kycUid) {
            headers['X-S3-KYC-UID'] = kycUid;
        }
        const result = yield api(`/limits/${asset}/${address}`, 'GET', { headers });
        return convertLimits(result);
    });
}
export function getUserLimits(uid, kycUid) {
    return __awaiter(this, void 0, void 0, function* () {
        const headers = {};
        if (kycUid) {
            headers['X-S3-KYC-UID'] = kycUid;
        }
        const result = yield api(`/limits/${uid}`, 'GET', { headers });
        return convertUserLimits(result);
    });
}
export function getAssets() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield api('/assets', 'GET');
        const records = {};
        for (const record of result) {
            try {
                records[record.symbol] = {
                    asset: record.symbol,
                    name: record.name,
                    feePerUnit: coinsToUnits(record.symbol, record.feePerUnit, { treatUsdcAsMatic: true }),
                    limits: {
                        minimum: record.limits && record.limits.minimum
                            ? coinsToUnits(record.symbol, record.limits.minimum)
                            : undefined,
                        maximum: record.limits && record.limits.maximum
                            ? coinsToUnits(record.symbol, record.limits.maximum)
                            : undefined,
                    },
                };
            }
            catch (error) {
                console.warn(error.message, record); // eslint-disable-line no-console
            }
        }
        return records;
    });
}
