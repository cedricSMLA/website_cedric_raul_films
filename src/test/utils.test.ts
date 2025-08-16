import { describe, it, expect } from 'vitest';

// Simple utility functions to test
const formatPrice = (price: number, currency: string = '€'): string => {
  return `${price.toLocaleString('fr-FR')}${currency}`;
};

const generateMailtoUrl = (email: string, subject: string, body: string): string => {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  return `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

describe('Utility Functions', () => {
  describe('formatPrice', () => {
    it('should format price correctly', () => {
      expect(formatPrice(2900)).toBe('2 900€');
      expect(formatPrice(1500)).toBe('1 500€');
      expect(formatPrice(500)).toBe('500€');
    });

    it('should handle different currencies', () => {
      expect(formatPrice(2900, ' USD')).toBe('2 900 USD');
      expect(formatPrice(2900, '£')).toBe('2 900£');
    });
  });

  describe('generateMailtoUrl', () => {
    it('should generate correct mailto URL', () => {
      const email = 'contact@example.com';
      const subject = 'Test Subject';
      const body = 'Test Body';
      
      const result = generateMailtoUrl(email, subject, body);
      
      expect(result).toBe('mailto:contact@example.com?subject=Test%20Subject&body=Test%20Body');
    });

    it('should handle special characters', () => {
      const email = 'contact@example.com';
      const subject = 'Demande de devis - Mariage';
      const body = 'Bonjour,\n\nJe souhaite...';
      
      const result = generateMailtoUrl(email, subject, body);
      
      expect(result).toContain('mailto:contact@example.com');
      expect(result).toContain('subject=Demande%20de%20devis%20-%20Mariage');
      expect(result).toContain('body=Bonjour%2C%0A%0AJe%20souhaite...');
    });
  });

  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('contact+newsletter@site.fr')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('test@domain')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });
});