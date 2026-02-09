import { validatePassword } from '@/lib/auth';

describe('validatePassword', () => {
  describe('accepts passwords with 1-3 characters', () => {
    it('should accept 1 character password', () => {
      const result = validatePassword('a');
      expect(result.valid).toBe(true);
    });

    it('should accept 2 character password', () => {
      const result = validatePassword('ab');
      expect(result.valid).toBe(true);
    });

    it('should accept 3 character password', () => {
      const result = validatePassword('abc');
      expect(result.valid).toBe(true);
    });

    it('should accept password with special characters', () => {
      const result = validatePassword('a!');
      expect(result.valid).toBe(true);
    });

    it('should accept password with numbers', () => {
      const result = validatePassword('a1');
      expect(result.valid).toBe(true);
    });
  });

  describe('trims passwords before validation', () => {
    it('should accept password with leading spaces after trimming', () => {
      const result = validatePassword('  a');
      expect(result.valid).toBe(true);
    });

    it('should accept password with trailing spaces after trimming', () => {
      const result = validatePassword('a  ');
      expect(result.valid).toBe(true);
    });

    it('should accept password with both leading and trailing spaces', () => {
      const result = validatePassword('  ab  ');
      expect(result.valid).toBe(true);
    });
  });

  describe('rejects invalid passwords', () => {
    it('should reject empty password', () => {
      const result = validatePassword('');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Password is required');
    });

    it('should reject password with only spaces', () => {
      const result = validatePassword('   ');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Password is required');
    });

    it('should reject password exceeding 128 characters', () => {
      const longPassword = 'a'.repeat(129);
      const result = validatePassword(longPassword);
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Password must not exceed 128 characters');
    });
  });

  describe('accepts passwords at boundary', () => {
    it('should accept password with exactly 128 characters', () => {
      const password = 'a'.repeat(128);
      const result = validatePassword(password);
      expect(result.valid).toBe(true);
    });

    it('should accept longer password (10+ chars)', () => {
      const result = validatePassword('abcdefghij');
      expect(result.valid).toBe(true);
    });
  });
});
