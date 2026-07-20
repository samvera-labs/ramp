import videojs from 'video.js';
import { svgIconToSymbol, SignOutIcon, UserIcon } from '@Services/svg-icons';
import '../styles/VideoJSAuthMenu.scss';

// Function to inject SVGs into the DOM
function injectSVGIcons() {
  const userSVGSymbol = svgIconToSymbol(UserIcon, 'user');
  const logOutSVGSymbol = svgIconToSymbol(SignOutIcon, 'log-out');

  const svgContainer = document.createElement('div');
  svgContainer.style.display = 'none';
  svgContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">${userSVGSymbol}${logOutSVGSymbol}</svg>`;
  document.body.appendChild(svgContainer);
}

// Call the function to inject SVG icons
injectSVGIcons();

const MenuButton = videojs.getComponent('MenuButton');
const MenuItem = videojs.getComponent('MenuItem');

/**
 * Custom control button for the IIIF Auth 2.0 logout UI on audio players. This is hidden until the
 * user is authenticated; once visible, clicking the menu button brings up a popup menu with a default
 * 'Authenticated' title and a 'Log out' action.
 * This control is added only when the auth service defines a logout service with type 'AuthLogoutService2'
 * and the player is in audio-only mode. If the defined logout service has a label then it is displayed as
 * a logout item.
 * @param {Object} props
 * @param {Object} props.player VideoJS player instance
 * @param {Object} props.options
 * @param {String} props.options.label label to display in the menu from log out service
 * @param {Function} props.options.onLogout callback invoked when 'Log out' is clicked
 */
class VideoJSAuthMenu extends MenuButton {
  constructor(player, options) {
    super(player, options);
    this.addClass('vjs-play-control vjs-control vjs-auth-menu');
    this.setAttribute('data-testid', 'videojs-auth-menu');
    this.controlText('Logout menu');
    this.el().firstChild.innerHTML = `
      <svg class="vjs-user-icon" role="presentation">
        <use xlink:href="#user"></use>
      </svg>`;
  }

  createItems() {
    const { options_, player_ } = this;
    const { label, onLogout } = options_;

    const items = [];
    // Add label item if it exists
    if (label) {
      const logoutLabel = new MenuItem(player_, { label, selectable: false });
      logoutLabel.addClass('vjs-auth-label');
      items.push(logoutLabel);
    }

    const logOutBtn = new MenuItem(player_, { label: 'Log out', selectable: false });
    logOutBtn.controlText('Log out');
    logOutBtn.setAttribute('data-testid', 'videojs-auth-logout-button');
    logOutBtn.el().insertAdjacentHTML('afterbegin', `
      <svg class="vjs-logout-icon" role="presentation">
        <use xlink:href="#log-out"></use>
      </svg>`);

    logOutBtn.handleClick = () => {
      if (typeof onLogout === 'function') onLogout();
    };
    items.push(logOutBtn);

    return items;
  }
}

videojs.registerComponent('VideoJSAuthMenu', VideoJSAuthMenu);

export default VideoJSAuthMenu;
