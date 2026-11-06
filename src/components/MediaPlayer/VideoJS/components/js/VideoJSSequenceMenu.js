import videojs from 'video.js';
import { svgIconToSymbol, ReorderIcon } from '@Services/svg-icons';
import '../styles/VideoJSSequenceMenu.scss';

// Function to inject SVGs into the DOM
function injectSVGIcons() {
  const reorderSVGSymbol = svgIconToSymbol(ReorderIcon, 'reorder');

  const svgContainer = document.createElement('div');
  svgContainer.style.display = 'none';
  svgContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">${reorderSVGSymbol}</svg>`;
  document.body.appendChild(svgContainer);
}

// Call the function to inject SVG icons
injectSVGIcons();

const MenuButton = videojs.getComponent('MenuButton');
const MenuItem = videojs.getComponent('MenuItem');

// Duration to display the notice for the changed sequence
const NOTICE_TIMEOUT = 2000;

/**
 * Custom control button to select the playback order of Canvases defined by Ranges with
 * 'sequence' behavior in the Manifest. Clicking the menu button brings up a popup menu with
 * one sequence per order, where the Canvas order in Manifest's 'items' is listed last.
 * @param {Object} props
 * @param {Object} props.player VideoJS player instance
 * @param {Object} props.options
 * @param {Array} props.options.sequences sequences parsed from the Ranges
 * @param {Number} props.options.activeIndex index of the selected order
 * @param {Function} props.options.onSelect callback invoked with the index of the clicked sequence
 */
class VideoJSSequenceMenu extends MenuButton {
  constructor(player, options) {
    super(player, options);
    this.addClass('vjs-play-control vjs-control vjs-sequence-menu');
    this.setAttribute('data-testid', 'videojs-sequence-menu');
    this.menuButton_.el().insertAdjacentHTML('afterbegin', `
      <svg class="vjs-reorder-icon" role="presentation">
        <use xlink:href="#reorder"></use>
      </svg>`);

    /* Disappearing notice displayed in the player and read by screen readers
    when the playback sequence is changed */
    this.noticeEl = videojs.dom.createEl('div', { className: 'vjs-sequence-notice' }, {
      'aria-live': 'polite',
      'data-testid': 'videojs-sequence-notice',
    });
    player.el().appendChild(this.noticeEl);

    this.activeIndex = undefined;
    this.setActive(options.activeIndex ?? 0);
  }

  createItems() {
    const { options_, player_ } = this;
    const { sequences = [], onSelect } = options_;

    return sequences.map((sequence, index) => {
      const item = new MenuItem(player_, {
        label: sequence.label, selectable: true, multiSelectable: false,
      });
      item.setAttribute('title', sequence.label);
      item.setAttribute('data-testid', 'videojs-sequence-menu-item');

      item.handleClick = () => {
        if (index !== this.activeIndex && typeof onSelect === 'function') onSelect(index);
        this.unpressButton();
      };
      return item;
    });
  }

  /**
   * Mark the selected order in the menu and update the control text of the button.
   * @param {Number} index index of the selected order
   */
  setActive(index) {
    const sequence = this.options_.sequences?.[index];
    if (!sequence || index === this.activeIndex) return;

    const isChanged = this.activeIndex !== undefined;
    this.activeIndex = index;
    this.items?.forEach((item, i) => item.selected(i === index));
    this.controlText(`Playback order: ${sequence.label}`);

    if (isChanged) this.showNotice(sequence.label);
  }

  /**
   * Show a notice in the player when the selected order is changed.
   * @param {String} text name of the selected sequence
   */
  showNotice(text) {
    this.noticeEl.textContent = `Now playing in: ${text}`;
    this.noticeEl.classList.add('vjs-sequence-notice--visible');
    this.clearTimeout(this.noticeTimer);
    this.noticeTimer = this.setTimeout(() => {
      this.noticeEl.classList.remove('vjs-sequence-notice--visible');
    }, NOTICE_TIMEOUT);
  }
}

videojs.registerComponent('VideoJSSequenceMenu', VideoJSSequenceMenu);

export default VideoJSSequenceMenu;
