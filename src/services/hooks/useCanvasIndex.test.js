import React from 'react';
import { renderHook } from '@testing-library/react';
import { ManifestStateContext } from '../../context/manifest-context';
import { useCanvasIndex } from './useCanvasIndex';

const makeWrapper = (state) => ({ children }) => (
    <ManifestStateContext.Provider value={state}>
        {children}
    </ManifestStateContext.Provider>
)

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

    it('updates when the canvas index in the manifest state changes', () => {
        let state = { canvasIndex: 0 };
        const Wrapper = ({ children }) => (
            <ManifestStateContext.Provider value={state}>
                {children}
            </ManifestStateContext.Provider>
        );

        const { result, rerender } = renderHook(() => useCanvasIndex(), {
            wrapper: Wrapper,
        });
        expect(result.current.canvasIndex).toBe(0);

        state = { canvasIndex: 1 };
        rerender();
        expect(result.current.canvasIndex).toBe(1);
    });
});