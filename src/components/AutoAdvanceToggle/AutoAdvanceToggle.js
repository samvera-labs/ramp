import React from 'react';
import { useManifestState } from '../../context/manifest-context';
import { parseManifest } from 'manifesto.js';
import './AutoAdvanceToggle.scss';

const AutoAdvanceToggle = ({ label = "Autoplay", showLabel = true }) => {
  const { manifest } = useManifestState();

  const [autoAdvance, setAutoAdvance] = React.useState('');

  React.useEffect(() => {
    if (manifest) {
      //Parse manifest to see if auto_advance behavior present at manifest level then save into state
      const manifestParsed = parseManifest(manifest);
      const autoAdvanceBehavior = manifestParsed.getBehavior() === "auto-advance";
      setAutoAdvance(autoAdvanceBehavior);
    }
  }, [manifest]);

  return (
    <div data-testid="auto-advance" className="ramp--auto-advance">
      {showLabel && (
        <span className="ramp--auto-advance-label" data-testid="auto-advance-label">{label}</span>
      )}
      <input type="checkbox" data-testid="auto-advance-toggle" data-toggle="toggle" data-size="mini" name="ramp--auto-advance-toggle" checked={autoAdvance} onChange={e => setAutoAdvance(e.target.checked)} />
    </div>
  );
};

export default AutoAdvanceToggle;
