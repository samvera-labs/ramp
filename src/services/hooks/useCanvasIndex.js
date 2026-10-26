import { useContext } from 'react';
import { useManifestState } from '../../context/manifest-context';


/**
 * Returns index of the Canvas currently loaded in Ramp.
 * Reads from the manifest context so only re-renders when manifest state changes. 
 * Must be used inside a component rendered within <IIIFPlayer>. 
 * 
 * @returns {{ canvasIndex: number }} index of the current Canvas (zero-based)
 */
export const useCanvasIndex = () => {
    const { canvasIndex } = useManifestState();
    return { canvasIndex };
};