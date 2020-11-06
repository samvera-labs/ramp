import { getMediaInfo, getTracks } from './iiif-parser';

/**
 * Switch media player source and track files when previous file ended or
 * a different canvas is selected
 * @param {Object} meJSPlayer MediaElement player wrapper, HTML node, and instance
 * @param {Integer} canvasIndex Current canvas index
 * @param {Object} props Redux state props
 * @param {Boolean} isEnded Flag indicating player advancing from previous media file or not
 */
export function switchMedia(
  meJSPlayer,
  canvasIndex,
  isPlaying,
  captionOn,
  manifest,
  isEnded
) {
  const { media, node, instance } = meJSPlayer;
  const { mediaType, sources, error } = getMediaInfo(manifest, canvasIndex);

  if (error) {
    return;
  }

  node.innerHTML = '';

  // Build sources and tracks
  const sourceTags = createSourceTags(sources);
  const tracksTags = createTrackTags(getTracks({ manifest }));
  const newChildren = `${sourceTags.join('\n')}${tracksTags.join('\n')}`;

  // Attach the new sources and tracks to video element
  node.innerHTML = newChildren;

  instance.setSrc(sources[0].src);

  // Build features from new souces and tracks
  node.player.buildquality(instance, null, null, media);
  node.player.buildtracks(instance, null, instance.layers, media);

  // Set tracks
  handleTracks(instance, media, mediaType, captionOn);

  instance.load();

  if (isPlaying || isEnded) {
    instance.play();
  }
  return instance;
}

export function handleTracks(instance, media, mediaType, captionOn) {
  if (mediaType === 'video' && media.options.toggleCaptionsButtonWhenOnlyOne) {
    if (captionOn && instance.tracks && instance.tracks.length == 1) {
      instance.setTrack(
        instance.tracks[0].trackId,
        typeof keyboard !== 'undefined'
      );
    }
  }
}

export function createSourceTags(sources) {
  const sourceTags = [];
  for (let i = 0, total = sources.length; i < total; i++) {
    const source = sources[i];
    sourceTags.push(
      `<source src="${source.src}" type="${source.format}" data-quality="${source.quality}" />`
    );
  }
  return sourceTags;
}

export function createTrackTags(tracks) {
  const tracksTags = [];
  for (let i = 0, total = tracks.length; i < total; i++) {
    const track = tracks[i];
    tracksTags.push(
      `<track srclang="en" kind="subtitles" type="${track.format}" src="${track.id}"></track>`
    );
  }
  return tracksTags;
}
