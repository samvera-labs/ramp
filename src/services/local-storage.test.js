import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './local-storage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('initializes with default value', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'defaultValue'));
    const [value] = result.current;
    expect(value).toBe('defaultValue');
  });

  test('initializes with the value in localStorage if it exists', () => {
    // Setup: set value in localStorage => existing value
    localStorage.setItem('key', JSON.stringify('storedValue'));
    const { result } = renderHook(() => useLocalStorage('key', 'defaultValue'));
    const [value] = result.current;
    expect(value).toBe('storedValue');
  });

  test('updates localStorage when value is changed', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'defaultValue'));
    const [defValue] = result.current;
    expect(defValue).toBe('defaultValue');

    // Update value
    act(() => {
      const [, setValue] = result.current;
      setValue('newValue');
    });
    const [newValue] = result.current;
    expect(newValue).toBe('newValue');
    expect(localStorage.getItem('key')).toBe(JSON.stringify('newValue'));
  });
});
