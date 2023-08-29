import React from 'react';
import { useManifestState, useManifestDispatch } from '../../context/manifest-context';
import { parseManifest } from 'manifesto.js';
import './AutoAdvanceToggle.scss';

const AutoAdvanceToggle = ({ label = "Autoplay", showLabel = true }) => {
  const { manifest, autoAdvance } = useManifestState();
  const manifestDispatch = useManifestDispatch();

  React.useEffect(() => {
    if (manifest) {
      //Parse manifest to see if auto_advance behavior present at manifest level then save into state
      const manifestParsed = parseManifest(manifest);
      const autoAdvanceBehavior = manifestParsed.getBehavior() === "auto-advance";
      manifestDispatch({ autoAdvance: autoAdvanceBehavior, type: "setAutoAdvance" });
    }
  }, [manifest]);

  return (
    <div data-testid="auto-advance" className="ramp--auto-advance">
      {showLabel && (
        <span
          className="ramp--auto-advance-label"
          data-testid="auto-advance-label"
          htmlFor="auto-advance-toggle"
          id="auto-advance-toggle-label"
        >
          {label}
        </span>
      )}
      <label className="ramp--auto-advance-toggle"
        aria-labelledby='auto-advance-toggle-label'
      >
        <input
          data-testid="auto-advance-toggle"
          name="auto-advance-toggle"
          type="checkbox"
          checked={autoAdvance}
          onChange={e => manifestDispatch({ autoAdvance: e.target.checked, type: "setAutoAdvance" })}
        />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default AutoAdvanceToggle;
