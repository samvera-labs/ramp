// Sample mocking of axios methods.  These will be automatically mocked in a test
// when importing axios in a test to check if methods have been called.
export default {
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} }))
};
