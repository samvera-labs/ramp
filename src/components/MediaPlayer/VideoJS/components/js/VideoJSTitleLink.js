import videojs from 'video.js';
import '../styles/VideoJSTitleLink.scss';

const vjsComponent = videojs.getComponent('Component');

/**
 * Custom component to display title of the current item in the player
 * in an overlay.
 * @param {Object} props
 * @param {Object} props.player VideoJS player instance
 * @param {Object} props.options
 */
class VideoJSTitleLink extends vjsComponent {
  constructor(player, options) {
    super(player, options);
    this.setAttribute('data-testid', 'videojs-title-link');
    this.addClass('vjs-title-bar');
    this.options = options;
    this.player = player;

    // Handle player reload or source change events
    this.player.on('loadstart', () => {
      this.updateComponent();
    });
  }

  updateComponent() {
    const { player } = this;
    if (player && player != undefined && player.canvasLink) {
      const { label, id } = player.canvasLink;
      let title = label;
      let href = null;
      /**
       * Avalon canvas ids are of the form 'http://host.edu/media_objects/#mo_id/manifest/canvas/#section_id`.
       * Accessible url is 'http://host.edu/media_objects/#mo_id/section/#section_id' so we convert the canvas
       * id for avalon manifest, but must assume other implementers will have the id as an actionable link.
       */
      if (id.includes('manifest/canvas')) {
        href = id.replace('manifest/canvas', 'section');
      } else {
        href = id;
      }
      const link = videojs.dom.createEl('a', {
        className: 'vjs-title-link',
        href: href,
        target: '_blank',
        rel: 'noreferrer noopener',
        innerHTML: title
      });
      if (this.el().hasChildNodes()) {
        this.el().replaceChildren(link);
      } else {
        this.el().appendChild(link);
      }
    }
  }
}

vjsComponent.registerComponent('VideoJSTitleLink', VideoJSTitleLink);

export default VideoJSTitleLink;
