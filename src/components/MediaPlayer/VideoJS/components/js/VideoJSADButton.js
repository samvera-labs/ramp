import { createRef } from 'react';
import videojs from 'video.js';
import { IS_FIREFOX, IS_IOS } from '@Services/browser';

const Button = videojs.getComponent('Button');

/**
 * Custom VideoJS button component to toggle AD speech synthesis for the current Canvas.
 * When enabled, cues from the AD track are spoken aloud using the Web Speech API during
 * playback.
 * @param {Object} props
 * @param {Object} props.player VideoJS player instance
 * @param {Object} props.options
 * @param {Function} props.options.audioDescTracks audio-description text tracks
 */
class VideoJSADButton extends Button {
  constructor(player, options) {
    super(player, options);
    // Use Video.js' stock SVG for AD
    this.setIcon('audio-description');
    this.setAttribute('data-testid', 'videojs-ad-button');

    // AD functionality is turned OFF by default on page load
    this.setAttribute('aria-pressed', 'false');
    this.controlText('Toggle Audio Description');
    this.options = options;
    this.player = player;
    this.audioDescTracks = this.options.audioDescTracks;
    this.adOnRef = createRef();
    this.adOnRef.current = false;
    this.wasPlayingRef = createRef();
    this.wasPlayingRef.current = !this.player.paused();

    /**
     * Listen for track changes and update the visibility of the AD button
     * in the player's control-bar, mirroring how VideoJS's 'TrackButton' manages
     * its visibility.
     */
    const tracks = this.player.textTracks();
    const updateHandler = () => this.update();
    tracks.addEventListener('addtrack', updateHandler);
    tracks.addEventListener('removetrack', updateHandler);

    // Clear event listeners upon player disposal
    this.player.on('dispose', () => {
      tracks.removeEventListener('addtrack', updateHandler);
      tracks.removeEventListener('removetrack', updateHandler);
    });

    this.update();
    this._setupCueChangeListener();
  }

  update() {
    this._adTrack = null;
    const adTrack = Array.from(this.player.textTracks())
      .find(t => t.kind === 'descriptions');
    if (!adTrack) {
      this.hide();
      return;
    }
    this.show();
  };

  /**
   * Find the AD text-track in the player and attach the 'cuechange' event listener to
   * enable speech synthesis.
   * This is called once on component construction and again via 'refreshTrack()' on
   * Canvas changes.
   */
  _setupCueChangeListener() {
    if (!this.audioDescTracks?.length) return;

    // Remove old listener to avoid stacking
    if (this._adTrack && this._cueChangeHandler) {
      this._adTrack.removeEventListener('cuechange', this._cueChangeHandler);
    }

    const adTrack = Array.from(this.player.textTracks())
      .find(t => t.kind === 'descriptions');

    if (!adTrack) return;

    this._adTrack = adTrack;

    // Set AD track mode to 'hidden' to enable display of captions simultaneously
    adTrack.mode = 'hidden';

    this._cueChangeHandler = () => {
      const activeCues = adTrack.activeCues;
      if (!activeCues || activeCues.length === 0) return;
      // If AD is turned off, do nothing
      if (!this.adOnRef.current) return;

      this.wasPlayingRef.current = !this.player.paused();
      const text = activeCues[0].text;
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.cancel();
      /**
       * If the active AD cue is encountered during playback;
       * 1. pause the player
       * 2. read the active AD cue
       * 3. continue playback once the speech ends
       */
      if (this.wasPlayingRef.current) {
        this.player.pause();
        utterance.onend = () => {
          if (this.player.paused()) this.player.play();
        };
      }
      window.speechSynthesis.speak(utterance);
    };

    adTrack.addEventListener('cuechange', this._cueChangeHandler);
  }

  /**
   * Re-attach the 'cuechange' event listener after a Canvas change from within
   * 'loadedmetadata' event handler for the player in 'VideoJSPlayer' component.
   */
  refreshTrack() {
    this._setupCueChangeListener();
  }

  handleClick() {
    this.handleADClick();

    /**
     * iOS does support 'speechSynthesis' and requires speech synthesis to be triggered
     * directly from a user gesture, not programmatically from within a event handler
     * like 'cuechange'.
     * Since the code inside the event callbacks are considered asynchronous, by the time
     * the code runs, the "user gesture" context has expired, so it silently fails.
     * To overcome this limitation, use this AD button toggle click event from the user
     * to utter a silent speech. This "unlocks" the audio context for the 'speechSynthesis'
     * object, and allows to programmatically invoke speech synthesis later.
     * IMPORTANT: AD button is never turned ON by default, this always needs to be
     * toggled ON by the user.
     */
    if (IS_IOS) {
      const silentUtterance = new SpeechSynthesisUtterance(' ');
      silentUtterance.volume = 0;
      window.speechSynthesis.speak(silentUtterance);
    }
  }

  /**
   * Handle AD button toggle and its side effects
   */
  handleADClick() {
    this.adOnRef.current = !this.adOnRef.current;
    this.setAttribute('aria-pressed', String(this.adOnRef.current));
    if (this.adOnRef.current) {
      this.addClass('ad-active');
    } else {
      this.removeClass('ad-active');
      // Cancel any active speech synthesis when AD is turned OFF
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      /**
       * If the player had been playing when the speech synthesis had started, then the
       * player gets momentarily paused until speech is ended. In this scenario, if the
       * user toggles OFF the AD button the player needs to resume playback like the user
       * had initially intended.
       * Firefox takes care of this automatically without any assistance. However the other
       * 2 major desktop browsers (Safari and Chrome) don't, so this code block handles it.
       * 
       * As for any browser in the iOS platform this action is blocked. Because, in order
       * to access the AD button the user needs to exit the native player.
       * This intentionally pauses the playback because, without 'playsInline' attribute
       * in the <video> element, iOS is forced to use native player for playback.
       * Resuming playback in this instance when AD is toggled OFF, creates a flash effect
       * which is not in line a11y principles.
       */
      if (this.wasPlayingRef.current && !IS_FIREFOX && !IS_IOS) {
        this.player.play();
      }
    }
  }
}

videojs.registerComponent('VideoJSADButton', VideoJSADButton);

export default VideoJSADButton;
