import { useCallback } from 'react';
import { useManifestDispatch, useManifestState } from '../../context/manifest-context';

export const useStructurePlayback = () => {
  const { structureOnlyPlayback } = useManifestState();
  const manifestDispatch = useManifestDispatch();

  const handleChange = useCallback((e) => {
    e.target.setAttribute('aria-checked', String(!structureOnlyPlayback));
    manifestDispatch({ structureOnlyPlayback: !structureOnlyPlayback, type: 'setStructureOnlyPlayback' });
  });

  return { structureOnlyPlayback, handleChange };
};
