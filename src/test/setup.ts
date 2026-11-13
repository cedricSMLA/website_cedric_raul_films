// Test setup file for Vitest
import { beforeEach } from 'vitest';

// Remise à zéro du DOM entre deux tests, quand le test tourne dans un navigateur simulé.
// Les tests marqués « @vitest-environment node » n'ont pas de DOM : on ne fait rien.
beforeEach(() => {
  if (typeof document === 'undefined') return;
  document.body.innerHTML = '';
  localStorage.clear();
  sessionStorage.clear();
});
