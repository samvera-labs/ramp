import '@testing-library/jest-dom/extend-expect';

// Mocking MutationObserver for Transcript component unit tests
global.MutationObserver = class MutationObserver {
  constructor() {}

  disconnect() {
    return null;
  }

  observe() {
    return null;
  }

  takeRecords() {
    return null;
  }

  unobserve() {
    return null;
  }
};

if (typeof window.HTMLElement.prototype.scrollIntoView !== 'function') {
  // jsdom doesn't implement this currently so we'll need to stub it out
  window.HTMLElement.prototype.scrollIntoView = () => { /* noop; */ };
}