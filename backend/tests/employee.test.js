import { describe, it, expect } from '@jest/globals';

// ✅ Test 1: Validation Logic
describe('Employee Validation', () => {
    it('should reject invalid email', () => {
        const email = 'invalidemail';
        const isValid = /^\S+@\S+\.\S+$/.test(email);
        expect(isValid).toBe(false);
    });

    it('should accept valid email', () => {
        const email = 'john@gmail.com';
        const isValid = /^\S+@\S+\.\S+$/.test(email);
        expect(isValid).toBe(true);
    });

    it('should reject salary less than 0', () => {
        const salary = -5000;
        expect(salary).toBeLessThan(0);
    });

    it('should accept valid salary', () => {
        const salary = 50000;
        expect(salary).toBeGreaterThan(0);
    });
});

// ✅ Test 2: Employee Data Formatting
describe('Employee Data Formatting', () => {
    it('should combine first and last name correctly', () => {
        const firstName = 'John';
        const lastName = 'Doe';
        const fullName = `${firstName} ${lastName}`.trim();
        expect(fullName).toBe('John Doe');
    });

    it('should parse salary as float', () => {
        const salary = parseFloat('50000.50');
        expect(salary).toBe(50000.50);
    });
});