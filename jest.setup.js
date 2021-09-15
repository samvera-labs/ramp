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
