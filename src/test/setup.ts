// Test setup file for Vitest
import { beforeEach } from 'vitest';

// Mock DOM globals if needed
beforeEach(() => {
  // Reset DOM
  document.body.innerHTML = '';
  
  // Reset localStorage
  localStorage.clear();
  
  // Reset sessionStorage
  sessionStorage.clear();
});