import videojs from 'video.js';
import '../styles/VideoJSAuthMenu.scss';

const userSVGSymbol = `
 <symbol id="user" viewBox="0 0 20 20">
  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
  <g id="SVGRepo_iconCarrier">
    <path d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16
      9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
      stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    </path>
  </g>
 </symbol>`;

const logOutSVGSymbol = `
  <symbol id="log-out" viewBox="0 0 20 20">
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      <path d="M11 4V7L5 7V9H11V12H12L16 8L12 4L11 4Z" fill="#ffffff"></path>
      <path d="M0 1L3.41715e-07 15H8V13H2L2 3H8L8 1L0 1Z" fill="#ffffff"></path>
    </g>
  </symbol>
`;

// Function to inject SVGs into the DOM
function injectSVGIcons() {
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
    this.addClass('vjs-play-control vjs-control vjs-logout-menu');
    this.setAttribute('data-testid', 'videojs-auth-icon');
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
