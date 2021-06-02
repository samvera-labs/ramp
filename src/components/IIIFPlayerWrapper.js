import React, { useEffect, useState } from 'react';
import { useManifestDispatch } from '../context/manifest-context';
import PropTypes from 'prop-types';

import {
  parseManifestTranscript,
  parseTranscriptData,
} from '@Services/transcript-parser';

// Sample manifest with transcript annotations
import transcriptAnnotation from '../json/transcripts/transcript-annotation';
import transcriptCanvasRendering from '../json/transcripts/transcript-canvas-rendering';
import transcriptManifestRendering from '../json/transcripts/transcript-manifest-rendering';
import transcriptExternal from '../json/transcripts/external-transcript';

export default function IIIFPlayerWrapper({
  manifestUrl,
  children,
  manifest: manifestValue,
}) {
  const [manifest, setManifest] = useState(manifestValue);
  const dispatch = useManifestDispatch();

  useEffect(() => {
    parseManifestTranscript({
      manifest: transcriptAnnotation,
      canvasIndex: 0,
    });

    parseTranscriptData(
      transcriptExternal,
      'https://dlib.indiana.edu/iiif_av/lunchroom_manners/canvas'
    );

    parseManifestTranscript({
      manifest: transcriptManifestRendering,
      canvasIndex: 0,
    });

    parseManifestTranscript({
      manifest: transcriptCanvasRendering,
      canvasIndex: 0,
    });

    if (manifest) {
      dispatch({ manifest: manifest, type: 'updateManifest' });
    } else {
      fetch(manifestUrl)
        .then((result) => result.json())
        .then((data) => {
          setManifest(data);
          dispatch({ manifest: data, type: 'updateManifest' });
        });
    }
  }, []);

  if (!manifest) return <p>...Loading</p>;

  return <section className="iiif-player">{children}</section>;
}

IIIFPlayerWrapper.propTypes = {
  manifest: PropTypes.object,
  manifestUrl: PropTypes.string,
  children: PropTypes.node,
};
