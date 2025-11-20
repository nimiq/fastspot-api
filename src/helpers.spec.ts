import { describe, it, expect } from 'vitest';
import { coinsToUnits } from './helpers';
import { Ticker } from './types';

describe('coinsToUnits', () => {
    it('should handle string with decimals for NIM (5 decimals)', () => {
        expect(coinsToUnits(Ticker.NIM, '1.23456')).toBe(123456);
        expect(coinsToUnits(Ticker.NIM, '1.00001')).toBe(100001);
    });

    it('should handle string without decimals for NIM', () => {
        expect(coinsToUnits(Ticker.NIM, '100')).toBe(10000000);
    });

    it('should handle string "0" for NIM', () => {
        expect(coinsToUnits(Ticker.NIM, '0')).toBe(0);
    });

    it('should handle number for NIM', () => {
        expect(coinsToUnits(Ticker.NIM, 1.23456)).toBe(123456);
        expect(coinsToUnits(Ticker.NIM, 100)).toBe(10000000);
    });

    it('should handle string with decimals for BTC (8 decimals)', () => {
        expect(coinsToUnits(Ticker.BTC, '1.12345678')).toBe(112345678);
    });

    it('should handle string without decimals for BTC', () => {
        expect(coinsToUnits(Ticker.BTC, '1')).toBe(100000000);
    });

    it('should handle string "0" for BTC', () => {
        expect(coinsToUnits(Ticker.BTC, '0')).toBe(0);
    });

    it('should handle number for BTC', () => {
        expect(coinsToUnits(Ticker.BTC, 1.12345678)).toBe(112345678);
    });

    it('should handle string with decimals for USDC (6 decimals)', () => {
        expect(coinsToUnits(Ticker.USDC, '1.123456')).toBe(1123456);
    });

    it('should handle string without decimals for USDC', () => {
        expect(coinsToUnits(Ticker.USDC, '1')).toBe(1000000);
    });

    it('should handle string "0" for USDC', () => {
        expect(coinsToUnits(Ticker.USDC, '0')).toBe(0);
    });

    it('should handle number for USDC', () => {
        expect(coinsToUnits(Ticker.USDC, 1.123456)).toBe(1123456);
    });

    it('should handle string with decimals for EUR (2 decimals)', () => {
        expect(coinsToUnits(Ticker.EUR, '1.23')).toBe(123);
    });

    it('should handle string without decimals for EUR', () => {
        expect(coinsToUnits(Ticker.EUR, '1')).toBe(100);
    });

    it('should handle string "0" for EUR', () => {
        expect(coinsToUnits(Ticker.EUR, '0')).toBe(0);
    });

    it('should handle number for EUR', () => {
        expect(coinsToUnits(Ticker.EUR, 1.23)).toBe(123);
    });

    it('should throw error for invalid asset', () => {
        expect(() => coinsToUnits('INVALID' as any, '1')).toThrow('Invalid asset INVALID');
    });
});
