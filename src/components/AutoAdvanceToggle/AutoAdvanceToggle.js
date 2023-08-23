import React from 'react';
import { useManifestState } from '../../context/manifest-context';
import { parseManifest } from 'manifesto.js';
import './AutoAdvanceToggle.scss';

const AutoAdvanceToggle = ({ label = "Autoplay", showLabel = true }) => {
  const { manifest } = useManifestState();

  const [autoAdvance, setAutoAdvance] = React.useState(false);

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
        <span className="ramp--auto-advance-label" data-testid="auto-advance-label" for="auto-advance-toggle">{label}</span>
      )}
      <label className="ramp--auto-advance-toggle">
        <input
          data-testid="auto-advance-toggle"
          name="auto-advance-toggle"
          type="checkbox"
          checked={autoAdvance}
          onChange={e => setAutoAdvance(e.target.checked)}
        />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default AutoAdvanceToggle;
