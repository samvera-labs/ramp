/** Reference: https://github.com/samueleastdev/videojs-setting-menu */
import videojs from 'video.js';
import '../styles/SettingsMenu.scss';


const Plugin = videojs.getPlugin('plugin');

const Component = videojs.getComponent('Component');

const Button = videojs.getComponent('MenuButton');

// Default options for the plugin.
const defaults = {
  items: [
    "SubsCapsButton",
    "PlaybackRateMenuButton",
    "RatesButton",
  ],
  languages: {
    settings: "Settings",
    loading: "Loading",
    back: "Back",
    captions_off: "Captions Off",
    subtitles: "CC",
    speed: "Speed",
    quality: "Quality",
  },
};

/**
 * An advanced Video.js plugin. For more information on the API
 *
 * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
 */
class SettingsMenu extends Plugin {
  /**
   * Create a SettingsMenu plugin instance.
   *
   * @param  {Player} player
   *         A Video.js Player instance.
   *
   * @param  {Object} [options]
   *         An optional options object.
   *
   *         While not a core part of the Video.js plugin architecture, a
   *         second argument of options is a convenient way to accept inputs
   *         from your plugin's caller.
   */
  constructor(player, options) {
    // the parent class will add player under this.player
    super(player);
    const self = this;
    self.playerId = this.player.id();
    this.options = videojs.mergeOptions(defaults, options);
    this.player.ready(() => {
      this.player.addClass('vjs-settings-menu');
      this.buildUI();
      // if (videojs.browser.IS_IOS || videojs.browser.IS_ANDROID) {
      //   this.mobileBuildUI();
      // }
    });

    // Listen to the event from the bitrate switcher
    this.player.on("playbackRateSwitched", function (e) {
      let rate = e.target.player.playbackRateSwitched;
      this.getChild('controlBar').getChild('settingsMenuButton').controlText(`${rate.height}p, ${self.formatBps(rate.bitrate)}`);
    });

    // close the menu if open on userinactive
    this.player.on('userinactive', function () {
      document.getElementById(self.playerId).querySelectorAll('.vjs-menu').forEach(element => {
        element.classList.remove('vjs-lock-open');
      });

    });

    // close the menu if anywhere in the player is clicked
    this.player.on('click', function (evt) {
      if (evt.target.tagName === 'VIDEO') {
        document.getElementById(self.playerId).querySelectorAll('.vjs-menu').forEach(element => {
          element.classList.remove('vjs-lock-open');
        });
      }

    });

    this.player.on('loadstart', function (_event) {
      this.one('canplaythrough', function (_evt) {
        self.removeElementsByClass('vjs-setting-menu-clear');
        // if (videojs.browser.IS_IOS || videojs.browser.IS_ANDROID) {
        //   self.mobileBuildTopLevelMenu();
        // } else {
        self.buildTopLevelMenu();
        // }
      });
    });

  }

  /**
   * Add the menu ui button to the controlbar
   */
  buildUI() {
    const self = this;
    class SettingsMenuButton extends Button {
      constructor(player, options) {
        super(player, options);
        this.addClass('vjs-settings-menu');
        this.controlText(self.options.languages.loading);
        this.setIcon('cog');
        let that = this;
        self.player.one('canplaythrough', function (_event) {
          that.controlText(self.options.languages.settings);
        });
        this.menu.contentEl_.id = self.playerId + '-vjs-settings-menu-default';
      }
      handleClick() {
        // if (videojs.browser.IS_IOS || videojs.browser.IS_ANDROID) {
        //   self.player.getChild('settingsMenuMobileModal').el().style.display = 'block';
        // } else {
        this.el().classList.toggle('vjs-toogle-btn');
        this.menu.el().classList.toggle('vjs-lock-open');
        // }

      }
    }
    videojs.registerComponent('settingsMenuButton', SettingsMenuButton);

    this.player.getChild('controlBar').addChild('settingsMenuButton');
    if (this.player.getChild("controlBar").getChild("fullscreenToggle")) {
      this.player.getChild('controlBar').el().insertBefore(
        this.player.getChild('controlBar').getChild('settingsMenuButton').el(),
        this.player.getChild('controlBar').getChild('fullscreenToggle').el()
      );
    }
  }

  /**
   *
   * This is just build the top level menu no sub menus
   *
   * @param {*} menu
   * @param {*} main
   */
  buildTopLevelMenu() {
    const self = this;
    const settingsButton = self.player.getChild('controlBar').getChild('settingsMenuButton');
    //settingsButton.addClass('vjs-settings-menu-is-loaded');
    const menu = settingsButton.menu;
    const main = settingsButton.menu.contentEl_;
    // Empty the main menu div to repopulate
    main.innerHTML = "";
    main.classList.add('vjs-sm-top-level');
    // Start building new list items
    let menuTitle = document.createElement('li');
    menuTitle.className = 'vjs-sm-top-level-header';
    let menuTitleInner = document.createElement("span");
    menuTitleInner.innerHTML = self.options.languages.settings;
    menuTitle.appendChild(menuTitleInner);
    main.appendChild(menuTitle);

    // Filter buttons that dont have tracks
    let comps = [];
    let chapter = false;
    let subtitles = false;
    if (self.player.textTracks().tracks_) {
      self.player.textTracks().tracks_.forEach((ele) => {
        if (ele.kind === 'chapters') {
          chapter = true;
        }
        if (ele.kind === 'subtitles' || ele.kind === 'captions') {
          subtitles = true;
        }
      });
    }
    if (!chapter) {
      comps.push('ChaptersButton');
    }
    if (!subtitles) {
      comps.push('SubsCapsButton');
    }

    // Loop through the settings menu items
    self.options.items.filter(item => !comps.includes(item)).forEach(component => {
      // First check if component exists
      if (self.player.getChild('controlBar').getChild(component)) {
        let textContent = self.setInitialStates(component);
        self.player.getChild('controlBar').getChild(component).addClass('vjs-hide-settings-menu-item');
        let settingItem = document.createElement('li');
        settingItem.innerHTML = textContent.language;
        settingItem.setAttribute('data-component', component.toLowerCase());
        settingItem.className = 'vjs-sm-list-item';
        let settingItemArrow = document.createElement('i');
        settingItemArrow.className = 'setting-menu-list-arrow setting-menu-list-arrow-right';
        settingItem.appendChild(settingItemArrow);
        let settingItemSpan = document.createElement('span');
        settingItemSpan.id = self.playerId + '-setting-menu-child-span-' + component.toLowerCase();
        settingItemSpan.innerHTML = textContent.default;
        settingItem.appendChild(settingItemSpan);
        main.appendChild(settingItem);
        // Nasty little hack for chapters buttons as it seems to load after the canplay event
        setTimeout(function () {
          self.buildMenuList(component);
        }, (component === 'ChaptersButton') ? 1000 : 0);

      }

    });

    let settingMenuItems = document.querySelectorAll('.vjs-sm-list-item');
    Array.from(settingMenuItems).forEach(link => {
      // touchend needs to be added
      link.addEventListener('click', function (event) {
        document.querySelectorAll('.vjs-sm-top-level').forEach(element => {
          element.classList.add('vjs-hidden');
        });
        let active = document.getElementById(self.playerId + '-setting-menu-child-menu-' + this.getAttribute('data-component'));
        active.classList.remove('vjs-hidden');
        active.classList.add('vjs-lock');
        event.preventDefault();
      });
    });

  }

  /**
   * Add the menu ui button to the controlbar
   */
  mobileBuildUI() {
    const self = this;
    class SettingsMenuMobileModal extends Component {
      constructor(player, options) {
        super(player, options);
      }
      createEl() {
        return videojs.createEl('div', {
          className: 'vjs-settings-menu-mobile'
        });
      }
    }
    videojs.registerComponent('settingsMenuMobileModal', SettingsMenuMobileModal);
    videojs.dom.prependTo(self.player.addChild('settingsMenuMobileModal').el(), document.body);

  }

  mobileBuildTopLevelMenu() {
    const self = this;
    const settingsButton = this.player.getChild('settingsMenuMobileModal');
    let menuTopLevel = document.createElement('ul');
    menuTopLevel.className = 'vjs-sm-mob-top-level vjs-setting-menu-clear';
    settingsButton.el().appendChild(menuTopLevel);
    // Empty the main menu div to repopulate
    let menuTitle = document.createElement('li');
    menuTitle.className = 'vjs-setting-menu-mobile-top-header';
    menuTitle.innerHTML = this.options.languages.settings;
    menuTopLevel.appendChild(menuTitle);

    // Filter buttons that dont have tracks
    let comps = [];
    let chapter = false;
    let subtitles = false;
    if (self.player.textTracks().tracks_) {
      self.player.textTracks().tracks_.forEach((ele) => {
        if (ele.kind === 'chapters') {
          chapter = true;
        }
        if (ele.kind === 'subtitles' || ele.kind === 'captions') {
          subtitles = true;
        }
      });
    }
    if (!chapter) {
      comps.push('ChaptersButton');
    }
    if (!subtitles) {
      comps.push('SubsCapsButton');
    }

    // Loop through the settings menu items
    self.options.items.filter(item => !comps.includes(item)).forEach(component => {
      // First check if component exists
      if (self.player.getChild('controlBar').getChild(component)) {
        self.player.getChild('controlBar').getChild(component).addClass('vjs-hide-settings-menu-item');
        let textContent = self.setInitialStates(component);
        let settingItem = document.createElement('li');
        settingItem.setAttribute('data-component', component.toLowerCase());
        settingItem.innerHTML = textContent.language;
        settingItem.className = 'vjs-sm-top-level-item';
        let settingItemSpan = document.createElement('span');
        settingItemSpan.id = self.playerId + '-setting-menu-child-span-' + component.toLowerCase();
        settingItemSpan.innerHTML = textContent.default;
        settingItem.appendChild(settingItemSpan);
        menuTopLevel.appendChild(settingItem);
        // Nasty little hack for chapters buttons as it seems to load after the canplay event
        setTimeout(() => {
          self.mobileBuildSecondLevelMenu(component, settingsButton.el());
        }, (component === 'ChaptersButton') ? 1000 : 0);
      }

    });

    let settingMenuItems = document.querySelectorAll('.vjs-sm-top-level-item');
    Array.from(settingMenuItems).forEach(link => {
      // touchend needs to be added
      link.addEventListener('click', function (event) {
        event.preventDefault();
        let clickComponent = this.getAttribute('data-component');
        document.querySelectorAll('.vjs-sm-mob-top-level').forEach(element => {
          element.classList.add('vjs-hidden');
        });

        document.getElementById(self.playerId + '-mb-comp-' + clickComponent).classList.remove('vjs-hidden');

      });
    });

    let menuClose = document.createElement('li');
    menuClose.innerHTML = 'Close';
    menuClose.onclick = (e) => {
      this.player.getChild('settingsMenuMobileModal').el().style.display = 'none';
    };
    menuClose.className = 'setting-menu-footer-default';
    menuTopLevel.appendChild(menuClose);
  }

  /**
   *
   * This adds the component menus to the ui
   *
   * @param {*} component
   */
  mobileBuildSecondLevelMenu(component, item) {
    const self = this;
    let settingsButton = this.player.getChild('controlBar').getChild('settingsMenuButton');
    // First check if component exists
    if (this.player.getChild('controlBar').getChild(component)) {
      let componentMenu = this.player.getChild('controlBar').getChild(component).menu.contentEl_;
      // Need some logic here to prevent back button showing multiple times
      for (let i = 0; i < componentMenu.children.length; i++) {
        let classCheck = componentMenu.children[i].getAttribute('class');
        if (classCheck === 'setting-menu-header' || classCheck === 'vjs-menu-title') {
          componentMenu.children[i].remove();
        }
      }
      componentMenu.id = self.playerId + '-mb-comp-' + component.toLowerCase();
      componentMenu.classList.add('vjs-hidden');
      componentMenu.classList.add('vjs-sm-mob-second-level');
      componentMenu.classList.add('vjs-setting-menu-clear');
      let backBtn = document.createElement('li');
      backBtn.className = 'setting-menu-header';
      backBtn.setAttribute('data-component', component.toLowerCase());
      let backBtnArrow = document.createElement('i');
      backBtnArrow.className = 'setting-menu-list-arrow setting-menu-list-arrow-left';
      backBtn.appendChild(backBtnArrow);
      backBtn.onclick = function (_evt) {
        document.querySelectorAll('.vjs-sm-mob-top-level').forEach(element => {
          element.classList.remove('vjs-hidden');
        });

        document.querySelectorAll('.vjs-menu-content').forEach(element => {
          element.classList.add('vjs-hidden');
        });

        let set_state = document.getElementById(self.playerId + '-mb-comp-' + this.getAttribute('data-component')).querySelectorAll('.vjs-selected');
        if (set_state !== undefined && set_state.length > 0) {
          if (set_state[0].textContent) {
            document.getElementById(self.playerId + '-setting-menu-child-span-' + this.getAttribute('data-component')).innerText = self.cleanDefault(set_state[0].textContent);
          }
        }

        document.querySelectorAll('.vjs-sm-list-item').forEach(element => {
          element.classList.remove('vjs-hidden');
        });

        document.querySelectorAll('.vjs-menu-content').forEach(element => {
          if (element.classList.value.includes('vjs-lock')) {
            element.classList.remove('vjs-lock');
            element.classList.add('vjs-hidden');
          }
        });

      };

      let backBtnInner = document.createElement('span');
      backBtnInner.innerHTML = self.options.languages.back;
      backBtn.appendChild(backBtnInner);
      componentMenu.insertBefore(backBtn, componentMenu.firstChild);
      item.appendChild(componentMenu);
    }

  }

  /**
   *
   * This adds the component menus to the ui
   *
   * @param {*} component
   */
  buildMenuList(component) {
    const self = this;
    let settingsButton = this.player.getChild('controlBar').getChild('settingsMenuButton');
    // First check if component exists
    if (this.player.getChild('controlBar').getChild(component)) {
      let componentMenu = this.player.getChild('controlBar').getChild(component).menu.contentEl_;
      // Need some logic here to prevent back button showing multiple times
      for (let i = 0; i < componentMenu.children.length; i++) {
        let classCheck = componentMenu.children[i].getAttribute('class');
        if (classCheck === 'setting-menu-header' || classCheck === 'vjs-menu-title') {
          componentMenu.children[i].remove();
        }
      }

      componentMenu.id = self.playerId + '-setting-menu-child-menu-' + component.toLowerCase();
      componentMenu.classList.add('vjs-hidden');
      componentMenu.classList.add('vjs-setting-menu-clear');
      let backBtn = document.createElement('li');
      backBtn.className = 'setting-menu-header';
      backBtn.setAttribute('data-component', component.toLowerCase());
      let backBtnArrow = document.createElement('i');
      backBtnArrow.className = 'setting-menu-list-arrow setting-menu-list-arrow-left';
      backBtn.appendChild(backBtnArrow);
      backBtn.onclick = function (_evt) {
        let set_state = document.getElementById(self.playerId + '-setting-menu-child-menu-' + this.getAttribute('data-component')).querySelectorAll('.vjs-selected');
        if (set_state !== undefined && set_state.length > 0) {
          if (set_state[0].textContent) {
            document.getElementById(self.playerId + '-setting-menu-child-span-' + this.getAttribute('data-component')).innerText = self.cleanDefault(set_state[0].textContent);
          }
        }

        document.querySelectorAll('.vjs-sm-top-level').forEach(element => {
          element.classList.remove('vjs-hidden');
        });

        document.querySelectorAll('.vjs-menu-content').forEach(element => {
          if (element.classList.value.includes('vjs-lock')) {
            element.classList.remove('vjs-lock');
            element.classList.add('vjs-hidden');
          }
        });

      };

      let backBtnInner = document.createElement('span');

      backBtnInner.innerHTML = self.options.languages.back;

      backBtn.appendChild(backBtnInner);

      componentMenu.insertBefore(backBtn, componentMenu.firstChild);

      settingsButton.menu.el().appendChild(componentMenu);

    }

  }

  /**
   *
   * Set the text for the menu ui top level menu
   *
   * @param {*} component
   * @returns
   */
  setInitialStates(component) {
    switch (component) {
      case 'RatesButton':
        return {
          default: 'auto',
          language: this.options.languages.quality
        };
      case 'PlaybackRateMenuButton':
        return {
          default: '1x',
          language: this.options.languages.speed
        };
      case 'SubsCapsButton':
        let captionTracks = this.player.textTracks();
        let defaultCaptions = this.options.languages.captions_off;
        let z = captionTracks.length;
        while (z--) {
          if (captionTracks[z].kind === 'subtitles' && captionTracks[z].mode === 'showing') {
            defaultCaptions = captionTracks[z].label;
          }
        }
        return {
          default: defaultCaptions,
          language: this.options.languages.subtitles
        };
      case 'VideoJSFileDownload':
        return {
          default: '',
          language: 'File Download'
        };
      case 'QualitySelector':
        return {
          default: '',
          language: this.options.languages.quality
        };
      default:
        return {
          default: '',
          language: 'Menu'
        };
    }
  }


  /**
   *
   * Helper class to clear menu items before rebuild
   *
   * @param {*} className
   */
  removeElementsByClass(className) {

    // Need to prevent the menu from not showing sometimes
    document.querySelectorAll('.vjs-sm-top-level').forEach(element => {
      element.classList.remove('vjs-hidden');
    });

    const elements = document.getElementsByClassName(className);
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }

  }

  /**
   *
   * Cleans the state click button
   *
   * @param {*} state
   * @returns
   */
  cleanDefault(state) {

    state = state.replace(/\s\s+/g, ' ');

    let stateComma = state.indexOf(',');

    state = state.substring(0, stateComma != -1 ? stateComma : state.length);

    state = state.replace(/(<([^>]+)>)/ig, "");

    return state;

  }

  /**
   *
   * @param {*} bits
   * @returns
   */
  formatBps(bits) {

    let i = -1;

    const byteUnits = [' kbps', ' Mbps', ' Gbps', ' Tbps', 'Pbps', 'Ebps', 'Zbps', 'Ybps'];

    do {
      bits = bits / 1024;
      i++;
    } while (bits > 1024);

    return Math.max(bits, 0.1).toFixed(1) + byteUnits[i];

  }
}

// Define default values for the plugin's `state` object here.
SettingsMenu.defaultState = {};

// Include the version number.

// Register the plugin with video.js.
videojs.registerPlugin('settingsMenu', SettingsMenu);

export default SettingsMenu;
