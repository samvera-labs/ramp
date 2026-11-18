import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { ManifestProvider, useManifestDispatch } from '../../context/manifest-context';
import { useCanvasIndex } from './useCanvasIndex';

const makeWrapper = (state) => ({ children }) => (
    <ManifestProvider initialState={state}>{children}</ManifestProvider>
);

describe('useCanvasIndex', () => {
    it('returns the current canvas index from the manifest state', () => {
        const { result } = renderHook(() => useCanvasIndex(), {
            wrapper: makeWrapper({ canvasIndex: 2 }),
        });
        expect(result.current).toEqual({ canvasIndex: 2 });
    });

    it('returns 0 for the first canvas', () => {
        const { result } = renderHook(() => useCanvasIndex(), {
            wrapper: makeWrapper({ canvasIndex: 0 }),
        });
        expect(result.current.canvasIndex).toBe(0);
    });

    it('returns 1 for the second canvas', () => {
        const { result } = renderHook(() => useCanvasIndex(), {
            wrapper: makeWrapper({ canvasIndex: 1 }),
        });
        expect(result.current.canvasIndex).toBe(1);
    });

    it('throws when used outside of <IIIFPlayer>', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => { });
        expect(() => renderHook(() => useCanvasIndex())).toThrow(
            'useManifestState must be used within a ManifestProvider'
        );
        spy.mockRestore();
    });
});
