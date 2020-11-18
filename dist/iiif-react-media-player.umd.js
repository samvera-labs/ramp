(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('hls.js'), require('mediaelement'), require('manifesto.js')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react', 'hls.js', 'mediaelement', 'manifesto.js'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.nulibAdminUIComponents = {}, global.React, global.hlsjs, null, global.manifesto));
}(this, (function (exports, React, hlsjs, mediaelement, manifesto_js) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
  var hlsjs__default = /*#__PURE__*/_interopDefaultLegacy(hlsjs);

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  var arrayWithHoles = _arrayWithHoles;

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  var iterableToArrayLimit = _iterableToArrayLimit;

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  var arrayLikeToArray = _arrayLikeToArray;

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
  }

  var unsupportedIterableToArray = _unsupportedIterableToArray;

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var nonIterableRest = _nonIterableRest;

  function _slicedToArray(arr, i) {
    return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
  }

  var slicedToArray = _slicedToArray;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var defineProperty = _defineProperty;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  var ManifestStateContext = /*#__PURE__*/React__default['default'].createContext();
  var ManifestDispatchContext = /*#__PURE__*/React__default['default'].createContext();
  /**
   * Definition of all state variables in this Context
   */

  var defaultState = {
    manifest: null,
    canvasIndex: 0
  };

  function manifestReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
    var action = arguments.length > 1 ? arguments[1] : undefined;

    switch (action.type) {
      case 'updateManifest':
        {
          return _objectSpread(_objectSpread({}, state), {}, {
            manifest: _objectSpread({}, action.manifest)
          });
        }

      case 'switchCanvas':
        {
          return _objectSpread(_objectSpread({}, state), {}, {
            canvasIndex: action.canvasIndex
          });
        }

      default:
        {
          throw new Error("Unhandled action type: ".concat(action.type));
        }
    }
  }

  function ManifestProvider(_ref) {
    var _ref$initialState = _ref.initialState,
        initialState = _ref$initialState === void 0 ? defaultState : _ref$initialState,
        children = _ref.children;

    var _React$useReducer = React__default['default'].useReducer(manifestReducer, initialState),
        _React$useReducer2 = slicedToArray(_React$useReducer, 2),
        state = _React$useReducer2[0],
        dispatch = _React$useReducer2[1];

    return /*#__PURE__*/React__default['default'].createElement(ManifestStateContext.Provider, {
      value: state
    }, /*#__PURE__*/React__default['default'].createElement(ManifestDispatchContext.Provider, {
      value: dispatch
    }, children));
  }

  function useManifestState() {
    var context = React__default['default'].useContext(ManifestStateContext);

    if (context === undefined) {
      throw new Error('useManifestState must be used within a ManifestProvider');
    }

    return context;
  }

  function useManifestDispatch() {
    var context = React__default['default'].useContext(ManifestDispatchContext);

    if (context === undefined) {
      throw new Error('useManifestDispatch must be used within a ManifestProvider');
    }

    return context;
  }

  function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  var PlayerStateContext = /*#__PURE__*/React__default['default'].createContext();
  var PlayerDispatchContext = /*#__PURE__*/React__default['default'].createContext();
  /**
   * Definition of all state variables in this Context
   */

  var defaultState$1 = {
    player: null,
    clickedUrl: '',
    isCaptionOn: false,
    isClicked: false,
    isPlaying: false,
    startTime: null
  };

  function PlayerReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState$1;
    var action = arguments.length > 1 ? arguments[1] : undefined;

    switch (action.type) {
      case 'updatePlayer':
        {
          return _objectSpread$1(_objectSpread$1({}, state), {}, {
            player: action.player
          });
        }

      case 'navClick':
        {
          return _objectSpread$1(_objectSpread$1({}, state), {}, {
            clickedUrl: action.clickedUrl,
            isClicked: true
          });
        }

      case 'resetClick':
        {
          return _objectSpread$1(_objectSpread$1({}, state), {}, {
            isClicked: false
          });
        }

      case 'setStartTime':
        {
          return _objectSpread$1(_objectSpread$1({}, state), {}, {
            startTime: action.startTime
          });
        }

      case 'setPlayingStatus':
        {
          return _objectSpread$1(_objectSpread$1({}, state), {}, {
            isPlaying: action.isPlaying
          });
        }

      case 'setCaptionStatus':
        {
          return _objectSpread$1(_objectSpread$1({}, state), {}, {
            captionOn: action.captionOn
          });
        }

      default:
        {
          throw new Error("Unhandled action type: ".concat(action.type));
        }
    }
  }

  function PlayerProvider(_ref) {
    var _ref$initialState = _ref.initialState,
        initialState = _ref$initialState === void 0 ? defaultState$1 : _ref$initialState,
        children = _ref.children;

    var _React$useReducer = React__default['default'].useReducer(PlayerReducer, initialState),
        _React$useReducer2 = slicedToArray(_React$useReducer, 2),
        state = _React$useReducer2[0],
        dispatch = _React$useReducer2[1];

    return /*#__PURE__*/React__default['default'].createElement(PlayerStateContext.Provider, {
      value: state
    }, /*#__PURE__*/React__default['default'].createElement(PlayerDispatchContext.Provider, {
      value: dispatch
    }, children));
  }

  function usePlayerState() {
    var context = React__default['default'].useContext(PlayerStateContext);

    if (context === undefined) {
      throw new Error("usePlayerState must be used within the PlayerProvider");
    }

    return context;
  }

  function usePlayerDispatch() {
    var context = React__default['default'].useContext(PlayerDispatchContext);

    if (context === undefined) {
      throw new Error("usePlayerDispatch must be used within the PlayerProvider");
    }

    return context;
  }

  function createCommonjsModule(fn, basedir, module) {
  	return module = {
  		path: basedir,
  		exports: {},
  		require: function (path, base) {
  			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
  		}
  	}, fn(module, module.exports), module.exports;
  }

  function commonjsRequire () {
  	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
  }

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

  var ReactPropTypesSecret_1 = ReactPropTypesSecret;

  function emptyFunction() {}
  function emptyFunctionWithReset() {}
  emptyFunctionWithReset.resetWarningCache = emptyFunction;

  var factoryWithThrowingShims = function() {
    function shim(props, propName, componentName, location, propFullName, secret) {
      if (secret === ReactPropTypesSecret_1) {
        // It is still safe when called from React.
        return;
      }
      var err = new Error(
        'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
        'Use PropTypes.checkPropTypes() to call them. ' +
        'Read more at http://fb.me/use-check-prop-types'
      );
      err.name = 'Invariant Violation';
      throw err;
    }  shim.isRequired = shim;
    function getShim() {
      return shim;
    }  // Important!
    // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
    var ReactPropTypes = {
      array: shim,
      bool: shim,
      func: shim,
      number: shim,
      object: shim,
      string: shim,
      symbol: shim,

      any: shim,
      arrayOf: getShim,
      element: shim,
      elementType: shim,
      instanceOf: getShim,
      node: shim,
      objectOf: getShim,
      oneOf: getShim,
      oneOfType: getShim,
      shape: getShim,
      exact: getShim,

      checkPropTypes: emptyFunctionWithReset,
      resetWarningCache: emptyFunction
    };

    ReactPropTypes.PropTypes = ReactPropTypes;

    return ReactPropTypes;
  };

  var propTypes = createCommonjsModule(function (module) {
  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  {
    // By explicitly using `prop-types` you are opting into new production behavior.
    // http://fb.me/prop-types-in-prod
    module.exports = factoryWithThrowingShims();
  }
  });

  /*!
   * MediaElement.js
   * http://www.mediaelementjs.com/
   *
   * Qualities feature
   *
   * This feature allows the generation of a menu with different video/audio qualities, depending of the elements set
   * in the <source> tags, such as `title` and `data-quality`
   *
   * Copyright 2010-2017, John Dyer (http://j.hn/)
   * License: MIT
   *
   */
  (function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof commonjsRequire === 'function' && commonjsRequire;
          if (!u && a) return a(o, !0);
          if (i) return i(o, !0);
          var f = new Error("Cannot find module '" + o + "'");
          throw f.code = 'MODULE_NOT_FOUND', f;
        }

        var l = n[o] = {
          exports: {}
        };
        t[o][0].call(l.exports, function (e) {
          var n = t[o][1][e];
          return s(n ? n : e);
        }, l, l.exports, e, t, n, r);
      }

      return n[o].exports;
    }

    var i = typeof commonjsRequire === 'function' && commonjsRequire;

    for (var o = 0; o < r.length; o++) {
      s(r[o]);
    }

    return s;
  })({
    1: [function (_dereq_, module, exports) {

      mejs.i18n.en['mejs.quality-chooser'] = 'Quality Chooser';
      Object.assign(mejs.MepDefaults, {
        defaultQuality: 'auto',
        qualityText: null
      });
      Object.assign(MediaElementPlayer.prototype, {
        buildquality: function buildquality(player, controls, layers, media) {
          var t = this,
              children = t.mediaFiles ? t.mediaFiles : t.node.children,
              qualityMap = new Map();

          for (var i = 0, total = children.length; i < total; i++) {
            var mediaNode = children[i];
            var quality = mediaNode instanceof HTMLElement ? mediaNode.getAttribute('data-quality') : mediaNode['data-quality'];

            if (t.mediaFiles) {
              var source = document.createElement('source');
              source.src = mediaNode['src'];
              source.type = mediaNode['type'];
              t.addValueToKey(qualityMap, quality, source);
            } else if (mediaNode.nodeName === 'SOURCE') {
              t.addValueToKey(qualityMap, quality, mediaNode);
            }
          }

          if (qualityMap.size <= 1) {
            return;
          }

          t.cleanquality(player);

          var qualityTitle = mejs.Utils.isString(t.options.qualityText) ? t.options.qualityText : mejs.i18n.t('mejs.quality-quality'),
              getQualityNameFromValue = function getQualityNameFromValue(value) {
            var label = void 0;
            var keyExist = t.keyExist(qualityMap, value);

            if (keyExist) {
              label = value;
            } else {
              var keyValue = t.getMapIndex(qualityMap, 0);
              label = keyValue.key;
            }

            return label;
          },
              defaultValue = getQualityNameFromValue(t.options.defaultQuality);

          player.qualitiesButton = document.createElement('div');
          player.qualitiesButton.className = t.options.classPrefix + 'button ' + t.options.classPrefix + 'qualities-button';
          player.qualitiesButton.innerHTML = '<button type="button" data-testid="quality-btn" aria-controls="' + t.id + '" title="' + qualityTitle + '" ' + ('aria-label="' + qualityTitle + '" tabindex="0"></button>') + ('<div class="' + t.options.classPrefix + 'qualities-selector ' + t.options.classPrefix + 'offscreen"' + 'aria-label="' + qualityTitle + '">') + ('<ul class="' + t.options.classPrefix + 'qualities-selector-list"></ul>') + '</div>';
          t.addControlElement(player.qualitiesButton, 'qualities');
          media.setSrc(qualityMap.get(defaultValue)[0].src);
          media.load();
          qualityMap.forEach(function (value, key) {
            if (key !== 'map_keys_1') {
              var src = value[0],
                  _quality = key,
                  inputId = 'label-' + _quality;
              player.qualitiesButton.querySelector('ul').innerHTML += '<li class="' + t.options.classPrefix + 'qualities-selector-list-item">' + ('<input class="' + t.options.classPrefix + 'qualities-selector-input" type="radio" name="' + t.id + '_qualities"') + ('disabled="disabled" value="' + _quality + '" id="' + inputId + '"  ') + ((_quality === defaultValue ? ' checked="checked"' : '') + '/>') + ('<label data-testid="quality-' + inputId + ' " for="' + inputId + '" class="' + t.options.classPrefix + 'qualities-selector-label') + ((_quality === defaultValue ? ' ' + t.options.classPrefix + 'qualities-selected' : '') + '">') + ((src.title || _quality) + '</label>') + '</li>';
            }
          });
          var mobileInEvents = ['touchstart'],
              inEvents = ['mouseenter', 'focusin', 'keydown'],

          /* Note this line is customized from original plugin - 2017-12-18 */
          outEvents = ['mouseleave', 'blur'],
              radios = player.qualitiesButton.querySelectorAll('input[type="radio"]'),
              labels = player.qualitiesButton.querySelectorAll('.' + t.options.classPrefix + 'qualities-selector-label'),
              selector = player.qualitiesButton.querySelector('.' + t.options.classPrefix + 'qualities-selector'); // Change events based on device type (mobile/desktop)

          if (t.isMobile()) {
            inEvents = mobileInEvents;
          } else {
            outEvents.push('focusout');
          }

          for (var _i = 0, _total = inEvents.length; _i < _total; _i++) {
            player.qualitiesButton.addEventListener(inEvents[_i], function () {
              mejs.Utils.removeClass(selector, t.options.classPrefix + 'offscreen');
              selector.style.height = selector.querySelector('ul').offsetHeight + 'px';
              selector.style.top = -1 * parseFloat(selector.offsetHeight) + 'px';
            });
          }

          for (var _i2 = 0, _total2 = outEvents.length; _i2 < _total2; _i2++) {
            player.qualitiesButton.addEventListener(outEvents[_i2], function () {
              mejs.Utils.addClass(selector, t.options.classPrefix + 'offscreen');
            });
          }

          for (var _i3 = 0, _total3 = radios.length; _i3 < _total3; _i3++) {
            var radio = radios[_i3];
            radio.disabled = false;
            radio.addEventListener('change', function () {
              var self = this,
                  newQuality = self.value;
              var selected = player.qualitiesButton.querySelectorAll('.' + t.options.classPrefix + 'qualities-selected');

              for (var _i4 = 0, _total4 = selected.length; _i4 < _total4; _i4++) {
                mejs.Utils.removeClass(selected[_i4], t.options.classPrefix + 'qualities-selected');
              }

              self.checked = true;
              var siblings = mejs.Utils.siblings(self, function (el) {
                return mejs.Utils.hasClass(el, t.options.classPrefix + 'qualities-selector-label');
              });

              for (var j = 0, _total5 = siblings.length; j < _total5; j++) {
                mejs.Utils.addClass(siblings[j], t.options.classPrefix + 'qualities-selected');
              }

              var currentTime = media.currentTime;
              var paused = media.paused;
              player.qualitiesButton.querySelector('button').innerHTML = newQuality;

              if (!paused) {
                media.pause();
              }

              t.updateVideoSource(media, qualityMap, newQuality);
              media.setSrc(qualityMap.get(newQuality)[0].src);
              media.load();
              media.dispatchEvent(mejs.Utils.createEvent('seeking', media));

              if (!paused) {
                media.play();
              }

              media.addEventListener('canplay', function canPlayAfterSourceSwitchHandler() {
                media.setCurrentTime(currentTime);

                if (media.currentTime === currentTime) {
                  media.removeEventListener('canplay', canPlayAfterSourceSwitchHandler);
                }
              });
            });
          }

          for (var _i5 = 0, _total6 = labels.length; _i5 < _total6; _i5++) {
            labels[_i5].addEventListener('click', function () {
              var radio = mejs.Utils.siblings(this, function (el) {
                return el.tagName === 'INPUT';
              })[0],
                  event = mejs.Utils.createEvent('click', radio);
              radio.dispatchEvent(event);
              mejs.Utils.addClass(selector, t.options.classPrefix + 'offscreen');
            });
          }

          selector.addEventListener('keydown', function (e) {
            e.stopPropagation();
          });
          media.setSrc(qualityMap.get(defaultValue)[0].src);
        },
        cleanquality: function cleanquality(player) {
          if (player) {
            if (player.qualitiesButton) {
              player.qualitiesButton.remove();
            }
          }
        },
        addValueToKey: function addValueToKey(map, key, value) {
          if (map.has('map_keys_1')) {
            map.get('map_keys_1').push(key.toLowerCase());
          } else {
            map.set('map_keys_1', []);
          }

          if (map.has(key)) {
            map.get(key).push(value);
          } else {
            map.set(key, []);
            map.get(key).push(value);
          }
        },
        updateVideoSource: function updateVideoSource(media, map, key) {
          this.cleanMediaSource(media);
          var sources = map.get(key);

          var _loop = function _loop(i) {
            var mediaNode = media.children[i];

            if (mediaNode.tagName === 'VIDEO') {
              sources.forEach(function (sourceElement) {
                mediaNode.appendChild(sourceElement);
              });
            }
          };

          for (var i = 0; i < media.children.length; i++) {
            _loop(i);
          }
        },
        cleanMediaSource: function cleanMediaSource(media) {
          for (var i = 0; i < media.children.length; i++) {
            var _mediaNode = media.children[i];

            if (_mediaNode.tagName === 'VIDEO') {
              while (_mediaNode.firstChild) {
                _mediaNode.removeChild(_mediaNode.firstChild);
              }
            }
          }
        },
        getMapIndex: function getMapIndex(map, index) {
          var counter = -1;
          var keyValue = {};
          map.forEach(function (value, key) {
            if (counter === index) {
              keyValue.key = key;
              keyValue.value = value;
            }

            counter++;
          });
          return keyValue;
        },
        keyExist: function keyExist(map, searchKey) {
          return -1 < map.get('map_keys_1').indexOf(searchKey.toLowerCase());
        },
        isMobile: function isMobile() {
          return mejs.Features.isAndroid || mejs.Features.isiOS;
        }
      });
    }, {}]
  }, {}, [1]);

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z = "/*!\n * MediaElement.js\n * http://www.mediaelementjs.com/\n *\n * MEJS CSS styling\n * \n * Copyright 2010-2017, John Dyer (http://j.hn/)\n * License: MIT\n *\n * Accessibility: hide screen reader texts (and prefer \"top\" for RTL languages).\n * Reference: http://blog.rrwd.nl/2015/04/04/the-screen-reader-text-class-why-and-how/\n *\n */\n\n.mejs__offscreen {\n  border: 0;\n  clip: rect(1px, 1px, 1px, 1px);\n  -webkit-clip-path: inset(50%);\n  clip-path: inset(50%);\n  height: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  width: 1px;\n  word-wrap: normal;\n}\n\n.mejs__container {\n  background: #000;\n  box-sizing: border-box;\n  font-family: 'Helvetica', Arial, serif;\n  position: relative;\n  text-align: left;\n  text-indent: 0;\n  vertical-align: top;\n}\n\n.mejs__container * {\n  box-sizing: border-box;\n}\n\n/* Hide native play button and control bar from iOS to favor plugin button */\n.mejs__container video::-webkit-media-controls,\n.mejs__container video::-webkit-media-controls-panel,\n.mejs__container video::-webkit-media-controls-panel-container,\n.mejs__container video::-webkit-media-controls-start-playback-button {\n  -webkit-appearance: none;\n  display: none !important;\n}\n\n.mejs__fill-container,\n.mejs__fill-container .mejs__container {\n  height: 100%;\n  width: 100%;\n}\n\n.mejs__fill-container {\n  background: transparent;\n  margin: 0 auto;\n  overflow: hidden;\n  position: relative;\n}\n\n.mejs__container:focus {\n  outline: none;\n}\n\n.mejs__iframe-overlay {\n  height: 100%;\n  position: absolute;\n  width: 100%;\n}\n\n.mejs__embed,\n.mejs__embed body {\n  background: #000;\n  height: 100%;\n  margin: 0;\n  overflow: hidden;\n  padding: 0;\n  width: 100%;\n}\n\n.mejs__fullscreen {\n  overflow: hidden !important;\n}\n\n.mejs__container-fullscreen {\n  bottom: 0;\n  left: 0;\n  overflow: hidden;\n  position: fixed;\n  right: 0;\n  top: 0;\n  z-index: 1000;\n}\n\n.mejs__container-fullscreen .mejs__mediaelement,\n.mejs__container-fullscreen video {\n  height: 100% !important;\n  width: 100% !important;\n}\n\n/* Start: LAYERS */\n.mejs__background {\n  left: 0;\n  position: absolute;\n  top: 0;\n}\n\n.mejs__mediaelement {\n  height: 100%;\n  left: 0;\n  position: absolute;\n  top: 0;\n  width: 100%;\n  z-index: 0;\n}\n\n.mejs__poster {\n  background-position: 50% 50%;\n  background-repeat: no-repeat;\n  background-size: cover;\n  left: 0;\n  position: absolute;\n  top: 0;\n  z-index: 1;\n}\n\n:root .mejs__poster-img {\n  display: none;\n}\n\n.mejs__poster-img {\n  border: 0;\n  padding: 0;\n}\n\n.mejs__overlay {\n  -webkit-box-align: center;\n  -webkit-align-items: center;\n  -ms-flex-align: center;\n  align-items: center;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n  -webkit-justify-content: center;\n  -ms-flex-pack: center;\n  justify-content: center;\n  left: 0;\n  position: absolute;\n  top: 0;\n}\n\n.mejs__layer {\n  z-index: 1;\n}\n\n.mejs__overlay-play {\n  cursor: pointer;\n}\n\n.mejs__overlay-button {\n  background: url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='120' viewBox='0 0 400 120'%3E%3Cstyle%3E.st0%7Bfill:%23FFFFFF%3Bwidth:16px%3Bheight:16px%7D .st1%7Bfill:none%3Bstroke:%23FFFFFF%3Bstroke-width:1.5%3Bstroke-linecap:round%3B%7D .st2%7Bfill:none%3Bstroke:%23FFFFFF%3Bstroke-width:2%3Bstroke-linecap:round%3B%7D .st3%7Bfill:none%3Bstroke:%23FFFFFF%3B%7D .st4%7Bfill:%23231F20%3B%7D .st5%7Bopacity:0.75%3Bfill:none%3Bstroke:%23FFFFFF%3Bstroke-width:5%3Benable-background:new%3B%7D .st6%7Bfill:none%3Bstroke:%23FFFFFF%3Bstroke-width:5%3B%7D .st7%7Bopacity:0.4%3Bfill:%23FFFFFF%3Benable-background:new%3B%7D .st8%7Bopacity:0.6%3Bfill:%23FFFFFF%3Benable-background:new%3B%7D .st9%7Bopacity:0.8%3Bfill:%23FFFFFF%3Benable-background:new%3B%7D .st10%7Bopacity:0.9%3Bfill:%23FFFFFF%3Benable-background:new%3B%7D .st11%7Bopacity:0.3%3Bfill:%23FFFFFF%3Benable-background:new%3B%7D .st12%7Bopacity:0.5%3Bfill:%23FFFFFF%3Benable-background:new%3B%7D .st13%7Bopacity:0.7%3Bfill:%23FFFFFF%3Benable-background:new%3B%7D%3C/style%3E%3Cpath class='st0' d='M16.5 8.5c.3.1.4.5.2.8-.1.1-.1.2-.2.2l-11.4 7c-.5.3-.8.1-.8-.5V2c0-.5.4-.8.8-.5l11.4 7z'/%3E%3Cpath class='st0' d='M24 1h2.2c.6 0 1 .4 1 1v14c0 .6-.4 1-1 1H24c-.6 0-1-.4-1-1V2c0-.5.4-1 1-1zm9.8 0H36c.6 0 1 .4 1 1v14c0 .6-.4 1-1 1h-2.2c-.6 0-1-.4-1-1V2c0-.5.4-1 1-1z'/%3E%3Cpath class='st0' d='M81 1.4c0-.6.4-1 1-1h5.4c.6 0 .7.3.3.7l-6 6c-.4.4-.7.3-.7-.3V1.4zm0 15.8c0 .6.4 1 1 1h5.4c.6 0 .7-.3.3-.7l-6-6c-.4-.4-.7-.3-.7.3v5.4zM98.8 1.4c0-.6-.4-1-1-1h-5.4c-.6 0-.7.3-.3.7l6 6c.4.4.7.3.7-.3V1.4zm0 15.8c0 .6-.4 1-1 1h-5.4c-.6 0-.7-.3-.3-.7l6-6c.4-.4.7-.3.7.3v5.4z'/%3E%3Cpath class='st0' d='M112.7 5c0 .6.4 1 1 1h4.1c.6 0 .7-.3.3-.7L113.4.6c-.4-.4-.7-.3-.7.3V5zm-7.1 1c.6 0 1-.4 1-1V.9c0-.6-.3-.7-.7-.3l-4.7 4.7c-.4.4-.3.7.3.7h4.1zm1 7.1c0-.6-.4-1-1-1h-4.1c-.6 0-.7.3-.3.7l4.7 4.7c.4.4.7.3.7-.3v-4.1zm7.1-1c-.6 0-1 .4-1 1v4.1c0 .5.3.7.7.3l4.7-4.7c.4-.4.3-.7-.3-.7h-4.1z'/%3E%3Cpath class='st0' d='M67 5.8c-.5.4-1.2.6-1.8.6H62c-.6 0-1 .4-1 1v5.7c0 .6.4 1 1 1h4.2c.3.2.5.4.8.6l3.5 2.6c.4.3.8.1.8-.4V3.5c0-.5-.4-.7-.8-.4L67 5.8z'/%3E%3Cpath class='st1' d='M73.9 2.5s3.9-.8 3.9 7.7-3.9 7.8-3.9 7.8'/%3E%3Cpath class='st1' d='M72.6 6.4s2.6-.4 2.6 3.8-2.6 3.9-2.6 3.9'/%3E%3Cpath class='st0' d='M47 5.8c-.5.4-1.2.6-1.8.6H42c-.6 0-1 .4-1 1v5.7c0 .6.4 1 1 1h4.2c.3.2.5.4.8.6l3.5 2.6c.4.3.8.1.8-.4V3.5c0-.5-.4-.7-.8-.4L47 5.8z'/%3E%3Cpath class='st2' d='M52.8 7l5.4 5.4m-5.4 0L58.2 7'/%3E%3Cpath class='st3' d='M128.7 8.6c-6.2-4.2-6.5 7.8 0 3.9m6.5-3.9c-6.2-4.2-6.5 7.8 0 3.9'/%3E%3Cpath class='st0' d='M122.2 3.4h15.7v13.1h-15.7V3.4zM120.8 2v15.7h18.3V2h-18.3z'/%3E%3Cpath class='st0' d='M143.2 3h14c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2h-14c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2z'/%3E%3Cpath class='st4' d='M146.4 13.8c-.8 0-1.6-.4-2.1-1-1.1-1.4-1-3.4.1-4.8.5-.6 2-1.7 4.6.2l-.6.8c-1.4-1-2.6-1.1-3.3-.3-.8 1-.8 2.4-.1 3.5.7.9 1.9.8 3.4-.1l.5.9c-.7.5-1.6.7-2.5.8zm7.5 0c-.8 0-1.6-.4-2.1-1-1.1-1.4-1-3.4.1-4.8.5-.6 2-1.7 4.6.2l-.5.8c-1.4-1-2.6-1.1-3.3-.3-.8 1-.8 2.4-.1 3.5.7.9 1.9.8 3.4-.1l.5.9c-.8.5-1.7.7-2.6.8z'/%3E%3Cpath class='st0' d='M60.3 77c.6.2.8.8.6 1.4-.1.3-.3.5-.6.6L30 96.5c-1 .6-1.7.1-1.7-1v-35c0-1.1.8-1.5 1.7-1L60.3 77z'/%3E%3Cpath class='st5' d='M2.5 79c0-20.7 16.8-37.5 37.5-37.5S77.5 58.3 77.5 79 60.7 116.5 40 116.5 2.5 99.7 2.5 79z'/%3E%3Cpath class='st0' d='M140.3 77c.6.2.8.8.6 1.4-.1.3-.3.5-.6.6L110 96.5c-1 .6-1.7.1-1.7-1v-35c0-1.1.8-1.5 1.7-1L140.3 77z'/%3E%3Cpath class='st6' d='M82.5 79c0-20.7 16.8-37.5 37.5-37.5s37.5 16.8 37.5 37.5-16.8 37.5-37.5 37.5S82.5 99.7 82.5 79z'/%3E%3Ccircle class='st0' cx='201.9' cy='47.1' r='8.1'/%3E%3Ccircle class='st7' cx='233.9' cy='79' r='5'/%3E%3Ccircle class='st8' cx='201.9' cy='110.9' r='6'/%3E%3Ccircle class='st9' cx='170.1' cy='79' r='7'/%3E%3Ccircle class='st10' cx='178.2' cy='56.3' r='7.5'/%3E%3Ccircle class='st11' cx='226.3' cy='56.1' r='4.5'/%3E%3Ccircle class='st12' cx='225.8' cy='102.8' r='5.5'/%3E%3Ccircle class='st13' cx='178.2' cy='102.8' r='6.5'/%3E%3Cpath class='st0' d='M178 9.4c0 .4-.4.7-.9.7-.1 0-.2 0-.2-.1L172 8.2c-.5-.2-.6-.6-.1-.8l6.2-3.6c.5-.3.8-.1.7.5l-.8 5.1z'/%3E%3Cpath class='st0' d='M169.4 15.9c-1 0-2-.2-2.9-.7-2-1-3.2-3-3.2-5.2.1-3.4 2.9-6 6.3-6 2.5.1 4.8 1.7 5.6 4.1l.1-.1 2.1 1.1c-.6-4.4-4.7-7.5-9.1-6.9-3.9.6-6.9 3.9-7 7.9 0 2.9 1.7 5.6 4.3 7 1.2.6 2.5.9 3.8 1 2.6 0 5-1.2 6.6-3.3l-1.8-.9c-1.2 1.2-3 2-4.8 2z'/%3E%3Cpath class='st0' d='M183.4 3.2c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5c0-.9.7-1.5 1.5-1.5zm5.1 0h8.5c.9 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5h-8.5c-.9 0-1.5-.7-1.5-1.5-.1-.9.6-1.5 1.5-1.5zm-5.1 5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5c0-.9.7-1.5 1.5-1.5zm5.1 0h8.5c.9 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5h-8.5c-.9 0-1.5-.7-1.5-1.5-.1-.9.6-1.5 1.5-1.5zm-5.1 5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5c0-.9.7-1.5 1.5-1.5zm5.1 0h8.5c.9 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5h-8.5c-.9 0-1.5-.7-1.5-1.5-.1-.9.6-1.5 1.5-1.5z'/%3E%3C/svg%3E\") no-repeat;\n  background-position: 0 -39px;\n  height: 80px;\n  width: 80px;\n}\n\n.mejs__overlay:hover > .mejs__overlay-button {\n  background-position: -80px -39px;\n}\n\n.mejs__overlay-loading {\n  height: 80px;\n  width: 80px;\n}\n\n.mejs__overlay-loading-bg-img {\n  -webkit-animation: mejs__loading-spinner 1s linear infinite;\n  animation: mejs__loading-spinner 1s linear infinite;\n  background: transparent url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='120' viewBox='0 0 400 120'%3E%3Cstyle%3E.st0%7Bfill:%23FFFFFF%3Bwidth:16px%3Bheight:16px%7D .st1%7Bfill:none%3Bstroke:%23FFFFFF%3Bstroke-width:1.5%3Bstroke-linecap:round%3B%7D .st2%7Bfill:none%3Bstroke:%23FFFFFF%3Bstroke-width:2%3Bstroke-linecap:round%3B%7D .st3%7Bfill:none%3Bstroke:%23FFFFFF%3B%7D .st4%7Bfill:%23231F20%3B%7D .st5%7Bopacity:0.75%3Bfill:none%3Bstroke:%23FFFFFF%3Bstroke-width:5%3Benable-background:new%3B%7D .st6%7Bfill:none%3Bstroke:%23FFFFFF%3Bstroke-width:5%3B%7D .st7%7Bopacity:0.4%3Bfill:%23FFFFFF%3Benable-background:new%3B%7D .st8%7Bopacity:0.6%3Bfill:%23FFFFFF%3Benable-background:new%3B%7D .st9%7Bopacity:0.8%3Bfill:%23FFFFFF%3Benable-background:new%3B%7D .st10%7Bopacity:0.9%3Bfill:%23FFFFFF%3Benable-background:new%3B%7D .st11%7Bopacity:0.3%3Bfill:%23FFFFFF%3Benable-background:new%3B%7D .st12%7Bopacity:0.5%3Bfill:%23FFFFFF%3Benable-background:new%3B%7D .st13%7Bopacity:0.7%3Bfill:%23FFFFFF%3Benable-background:new%3B%7D%3C/style%3E%3Cpath class='st0' d='M16.5 8.5c.3.1.4.5.2.8-.1.1-.1.2-.2.2l-11.4 7c-.5.3-.8.1-.8-.5V2c0-.5.4-.8.8-.5l11.4 7z'/%3E%3Cpath class='st0' d='M24 1h2.2c.6 0 1 .4 1 1v14c0 .6-.4 1-1 1H24c-.6 0-1-.4-1-1V2c0-.5.4-1 1-1zm9.8 0H36c.6 0 1 .4 1 1v14c0 .6-.4 1-1 1h-2.2c-.6 0-1-.4-1-1V2c0-.5.4-1 1-1z'/%3E%3Cpath class='st0' d='M81 1.4c0-.6.4-1 1-1h5.4c.6 0 .7.3.3.7l-6 6c-.4.4-.7.3-.7-.3V1.4zm0 15.8c0 .6.4 1 1 1h5.4c.6 0 .7-.3.3-.7l-6-6c-.4-.4-.7-.3-.7.3v5.4zM98.8 1.4c0-.6-.4-1-1-1h-5.4c-.6 0-.7.3-.3.7l6 6c.4.4.7.3.7-.3V1.4zm0 15.8c0 .6-.4 1-1 1h-5.4c-.6 0-.7-.3-.3-.7l6-6c.4-.4.7-.3.7.3v5.4z'/%3E%3Cpath class='st0' d='M112.7 5c0 .6.4 1 1 1h4.1c.6 0 .7-.3.3-.7L113.4.6c-.4-.4-.7-.3-.7.3V5zm-7.1 1c.6 0 1-.4 1-1V.9c0-.6-.3-.7-.7-.3l-4.7 4.7c-.4.4-.3.7.3.7h4.1zm1 7.1c0-.6-.4-1-1-1h-4.1c-.6 0-.7.3-.3.7l4.7 4.7c.4.4.7.3.7-.3v-4.1zm7.1-1c-.6 0-1 .4-1 1v4.1c0 .5.3.7.7.3l4.7-4.7c.4-.4.3-.7-.3-.7h-4.1z'/%3E%3Cpath class='st0' d='M67 5.8c-.5.4-1.2.6-1.8.6H62c-.6 0-1 .4-1 1v5.7c0 .6.4 1 1 1h4.2c.3.2.5.4.8.6l3.5 2.6c.4.3.8.1.8-.4V3.5c0-.5-.4-.7-.8-.4L67 5.8z'/%3E%3Cpath class='st1' d='M73.9 2.5s3.9-.8 3.9 7.7-3.9 7.8-3.9 7.8'/%3E%3Cpath class='st1' d='M72.6 6.4s2.6-.4 2.6 3.8-2.6 3.9-2.6 3.9'/%3E%3Cpath class='st0' d='M47 5.8c-.5.4-1.2.6-1.8.6H42c-.6 0-1 .4-1 1v5.7c0 .6.4 1 1 1h4.2c.3.2.5.4.8.6l3.5 2.6c.4.3.8.1.8-.4V3.5c0-.5-.4-.7-.8-.4L47 5.8z'/%3E%3Cpath class='st2' d='M52.8 7l5.4 5.4m-5.4 0L58.2 7'/%3E%3Cpath class='st3' d='M128.7 8.6c-6.2-4.2-6.5 7.8 0 3.9m6.5-3.9c-6.2-4.2-6.5 7.8 0 3.9'/%3E%3Cpath class='st0' d='M122.2 3.4h15.7v13.1h-15.7V3.4zM120.8 2v15.7h18.3V2h-18.3z'/%3E%3Cpath class='st0' d='M143.2 3h14c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2h-14c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2z'/%3E%3Cpath class='st4' d='M146.4 13.8c-.8 0-1.6-.4-2.1-1-1.1-1.4-1-3.4.1-4.8.5-.6 2-1.7 4.6.2l-.6.8c-1.4-1-2.6-1.1-3.3-.3-.8 1-.8 2.4-.1 3.5.7.9 1.9.8 3.4-.1l.5.9c-.7.5-1.6.7-2.5.8zm7.5 0c-.8 0-1.6-.4-2.1-1-1.1-1.4-1-3.4.1-4.8.5-.6 2-1.7 4.6.2l-.5.8c-1.4-1-2.6-1.1-3.3-.3-.8 1-.8 2.4-.1 3.5.7.9 1.9.8 3.4-.1l.5.9c-.8.5-1.7.7-2.6.8z'/%3E%3Cpath class='st0' d='M60.3 77c.6.2.8.8.6 1.4-.1.3-.3.5-.6.6L30 96.5c-1 .6-1.7.1-1.7-1v-35c0-1.1.8-1.5 1.7-1L60.3 77z'/%3E%3Cpath class='st5' d='M2.5 79c0-20.7 16.8-37.5 37.5-37.5S77.5 58.3 77.5 79 60.7 116.5 40 116.5 2.5 99.7 2.5 79z'/%3E%3Cpath class='st0' d='M140.3 77c.6.2.8.8.6 1.4-.1.3-.3.5-.6.6L110 96.5c-1 .6-1.7.1-1.7-1v-35c0-1.1.8-1.5 1.7-1L140.3 77z'/%3E%3Cpath class='st6' d='M82.5 79c0-20.7 16.8-37.5 37.5-37.5s37.5 16.8 37.5 37.5-16.8 37.5-37.5 37.5S82.5 99.7 82.5 79z'/%3E%3Ccircle class='st0' cx='201.9' cy='47.1' r='8.1'/%3E%3Ccircle class='st7' cx='233.9' cy='79' r='5'/%3E%3Ccircle class='st8' cx='201.9' cy='110.9' r='6'/%3E%3Ccircle class='st9' cx='170.1' cy='79' r='7'/%3E%3Ccircle class='st10' cx='178.2' cy='56.3' r='7.5'/%3E%3Ccircle class='st11' cx='226.3' cy='56.1' r='4.5'/%3E%3Ccircle class='st12' cx='225.8' cy='102.8' r='5.5'/%3E%3Ccircle class='st13' cx='178.2' cy='102.8' r='6.5'/%3E%3Cpath class='st0' d='M178 9.4c0 .4-.4.7-.9.7-.1 0-.2 0-.2-.1L172 8.2c-.5-.2-.6-.6-.1-.8l6.2-3.6c.5-.3.8-.1.7.5l-.8 5.1z'/%3E%3Cpath class='st0' d='M169.4 15.9c-1 0-2-.2-2.9-.7-2-1-3.2-3-3.2-5.2.1-3.4 2.9-6 6.3-6 2.5.1 4.8 1.7 5.6 4.1l.1-.1 2.1 1.1c-.6-4.4-4.7-7.5-9.1-6.9-3.9.6-6.9 3.9-7 7.9 0 2.9 1.7 5.6 4.3 7 1.2.6 2.5.9 3.8 1 2.6 0 5-1.2 6.6-3.3l-1.8-.9c-1.2 1.2-3 2-4.8 2z'/%3E%3Cpath class='st0' d='M183.4 3.2c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5c0-.9.7-1.5 1.5-1.5zm5.1 0h8.5c.9 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5h-8.5c-.9 0-1.5-.7-1.5-1.5-.1-.9.6-1.5 1.5-1.5zm-5.1 5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5c0-.9.7-1.5 1.5-1.5zm5.1 0h8.5c.9 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5h-8.5c-.9 0-1.5-.7-1.5-1.5-.1-.9.6-1.5 1.5-1.5zm-5.1 5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5c0-.9.7-1.5 1.5-1.5zm5.1 0h8.5c.9 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5h-8.5c-.9 0-1.5-.7-1.5-1.5-.1-.9.6-1.5 1.5-1.5z'/%3E%3C/svg%3E\") -160px -40px no-repeat;\n  display: block;\n  height: 80px;\n  width: 80px;\n  z-index: 1;\n}\n\n@-webkit-keyframes mejs__loading-spinner {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes mejs__loading-spinner {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n\n/* End: LAYERS */\n\n/* Start: CONTROL BAR */\n.mejs__controls {\n  bottom: 0;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  height: 40px;\n  left: 0;\n  list-style-type: none;\n  margin: 0;\n  padding: 0 10px;\n  position: absolute;\n  width: 100%;\n  z-index: 3;\n}\n\n.mejs__controls:not([style*='display: none']) {\n  background: rgba(255, 0, 0, 0.7);\n  background: -webkit-linear-gradient(transparent, rgba(0, 0, 0, 0.35));\n  background: linear-gradient(transparent, rgba(0, 0, 0, 0.35));\n}\n\n.mejs__button,\n.mejs__time,\n.mejs__time-rail {\n  font-size: 10px;\n  height: 40px;\n  line-height: 10px;\n  margin: 0;\n  width: 32px;\n}\n\n.mejs__button > button {\n  background: transparent url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='120' viewBox='0 0 400 120'%3E%3Cstyle%3E.st0%7Bfill:%23FFFFFF%3Bwidth:16px%3Bheight:16px%7D .st1%7Bfill:none%3Bstroke:%23FFFFFF%3Bstroke-width:1.5%3Bstroke-linecap:round%3B%7D .st2%7Bfill:none%3Bstroke:%23FFFFFF%3Bstroke-width:2%3Bstroke-linecap:round%3B%7D .st3%7Bfill:none%3Bstroke:%23FFFFFF%3B%7D .st4%7Bfill:%23231F20%3B%7D .st5%7Bopacity:0.75%3Bfill:none%3Bstroke:%23FFFFFF%3Bstroke-width:5%3Benable-background:new%3B%7D .st6%7Bfill:none%3Bstroke:%23FFFFFF%3Bstroke-width:5%3B%7D .st7%7Bopacity:0.4%3Bfill:%23FFFFFF%3Benable-background:new%3B%7D .st8%7Bopacity:0.6%3Bfill:%23FFFFFF%3Benable-background:new%3B%7D .st9%7Bopacity:0.8%3Bfill:%23FFFFFF%3Benable-background:new%3B%7D .st10%7Bopacity:0.9%3Bfill:%23FFFFFF%3Benable-background:new%3B%7D .st11%7Bopacity:0.3%3Bfill:%23FFFFFF%3Benable-background:new%3B%7D .st12%7Bopacity:0.5%3Bfill:%23FFFFFF%3Benable-background:new%3B%7D .st13%7Bopacity:0.7%3Bfill:%23FFFFFF%3Benable-background:new%3B%7D%3C/style%3E%3Cpath class='st0' d='M16.5 8.5c.3.1.4.5.2.8-.1.1-.1.2-.2.2l-11.4 7c-.5.3-.8.1-.8-.5V2c0-.5.4-.8.8-.5l11.4 7z'/%3E%3Cpath class='st0' d='M24 1h2.2c.6 0 1 .4 1 1v14c0 .6-.4 1-1 1H24c-.6 0-1-.4-1-1V2c0-.5.4-1 1-1zm9.8 0H36c.6 0 1 .4 1 1v14c0 .6-.4 1-1 1h-2.2c-.6 0-1-.4-1-1V2c0-.5.4-1 1-1z'/%3E%3Cpath class='st0' d='M81 1.4c0-.6.4-1 1-1h5.4c.6 0 .7.3.3.7l-6 6c-.4.4-.7.3-.7-.3V1.4zm0 15.8c0 .6.4 1 1 1h5.4c.6 0 .7-.3.3-.7l-6-6c-.4-.4-.7-.3-.7.3v5.4zM98.8 1.4c0-.6-.4-1-1-1h-5.4c-.6 0-.7.3-.3.7l6 6c.4.4.7.3.7-.3V1.4zm0 15.8c0 .6-.4 1-1 1h-5.4c-.6 0-.7-.3-.3-.7l6-6c.4-.4.7-.3.7.3v5.4z'/%3E%3Cpath class='st0' d='M112.7 5c0 .6.4 1 1 1h4.1c.6 0 .7-.3.3-.7L113.4.6c-.4-.4-.7-.3-.7.3V5zm-7.1 1c.6 0 1-.4 1-1V.9c0-.6-.3-.7-.7-.3l-4.7 4.7c-.4.4-.3.7.3.7h4.1zm1 7.1c0-.6-.4-1-1-1h-4.1c-.6 0-.7.3-.3.7l4.7 4.7c.4.4.7.3.7-.3v-4.1zm7.1-1c-.6 0-1 .4-1 1v4.1c0 .5.3.7.7.3l4.7-4.7c.4-.4.3-.7-.3-.7h-4.1z'/%3E%3Cpath class='st0' d='M67 5.8c-.5.4-1.2.6-1.8.6H62c-.6 0-1 .4-1 1v5.7c0 .6.4 1 1 1h4.2c.3.2.5.4.8.6l3.5 2.6c.4.3.8.1.8-.4V3.5c0-.5-.4-.7-.8-.4L67 5.8z'/%3E%3Cpath class='st1' d='M73.9 2.5s3.9-.8 3.9 7.7-3.9 7.8-3.9 7.8'/%3E%3Cpath class='st1' d='M72.6 6.4s2.6-.4 2.6 3.8-2.6 3.9-2.6 3.9'/%3E%3Cpath class='st0' d='M47 5.8c-.5.4-1.2.6-1.8.6H42c-.6 0-1 .4-1 1v5.7c0 .6.4 1 1 1h4.2c.3.2.5.4.8.6l3.5 2.6c.4.3.8.1.8-.4V3.5c0-.5-.4-.7-.8-.4L47 5.8z'/%3E%3Cpath class='st2' d='M52.8 7l5.4 5.4m-5.4 0L58.2 7'/%3E%3Cpath class='st3' d='M128.7 8.6c-6.2-4.2-6.5 7.8 0 3.9m6.5-3.9c-6.2-4.2-6.5 7.8 0 3.9'/%3E%3Cpath class='st0' d='M122.2 3.4h15.7v13.1h-15.7V3.4zM120.8 2v15.7h18.3V2h-18.3z'/%3E%3Cpath class='st0' d='M143.2 3h14c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2h-14c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2z'/%3E%3Cpath class='st4' d='M146.4 13.8c-.8 0-1.6-.4-2.1-1-1.1-1.4-1-3.4.1-4.8.5-.6 2-1.7 4.6.2l-.6.8c-1.4-1-2.6-1.1-3.3-.3-.8 1-.8 2.4-.1 3.5.7.9 1.9.8 3.4-.1l.5.9c-.7.5-1.6.7-2.5.8zm7.5 0c-.8 0-1.6-.4-2.1-1-1.1-1.4-1-3.4.1-4.8.5-.6 2-1.7 4.6.2l-.5.8c-1.4-1-2.6-1.1-3.3-.3-.8 1-.8 2.4-.1 3.5.7.9 1.9.8 3.4-.1l.5.9c-.8.5-1.7.7-2.6.8z'/%3E%3Cpath class='st0' d='M60.3 77c.6.2.8.8.6 1.4-.1.3-.3.5-.6.6L30 96.5c-1 .6-1.7.1-1.7-1v-35c0-1.1.8-1.5 1.7-1L60.3 77z'/%3E%3Cpath class='st5' d='M2.5 79c0-20.7 16.8-37.5 37.5-37.5S77.5 58.3 77.5 79 60.7 116.5 40 116.5 2.5 99.7 2.5 79z'/%3E%3Cpath class='st0' d='M140.3 77c.6.2.8.8.6 1.4-.1.3-.3.5-.6.6L110 96.5c-1 .6-1.7.1-1.7-1v-35c0-1.1.8-1.5 1.7-1L140.3 77z'/%3E%3Cpath class='st6' d='M82.5 79c0-20.7 16.8-37.5 37.5-37.5s37.5 16.8 37.5 37.5-16.8 37.5-37.5 37.5S82.5 99.7 82.5 79z'/%3E%3Ccircle class='st0' cx='201.9' cy='47.1' r='8.1'/%3E%3Ccircle class='st7' cx='233.9' cy='79' r='5'/%3E%3Ccircle class='st8' cx='201.9' cy='110.9' r='6'/%3E%3Ccircle class='st9' cx='170.1' cy='79' r='7'/%3E%3Ccircle class='st10' cx='178.2' cy='56.3' r='7.5'/%3E%3Ccircle class='st11' cx='226.3' cy='56.1' r='4.5'/%3E%3Ccircle class='st12' cx='225.8' cy='102.8' r='5.5'/%3E%3Ccircle class='st13' cx='178.2' cy='102.8' r='6.5'/%3E%3Cpath class='st0' d='M178 9.4c0 .4-.4.7-.9.7-.1 0-.2 0-.2-.1L172 8.2c-.5-.2-.6-.6-.1-.8l6.2-3.6c.5-.3.8-.1.7.5l-.8 5.1z'/%3E%3Cpath class='st0' d='M169.4 15.9c-1 0-2-.2-2.9-.7-2-1-3.2-3-3.2-5.2.1-3.4 2.9-6 6.3-6 2.5.1 4.8 1.7 5.6 4.1l.1-.1 2.1 1.1c-.6-4.4-4.7-7.5-9.1-6.9-3.9.6-6.9 3.9-7 7.9 0 2.9 1.7 5.6 4.3 7 1.2.6 2.5.9 3.8 1 2.6 0 5-1.2 6.6-3.3l-1.8-.9c-1.2 1.2-3 2-4.8 2z'/%3E%3Cpath class='st0' d='M183.4 3.2c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5c0-.9.7-1.5 1.5-1.5zm5.1 0h8.5c.9 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5h-8.5c-.9 0-1.5-.7-1.5-1.5-.1-.9.6-1.5 1.5-1.5zm-5.1 5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5c0-.9.7-1.5 1.5-1.5zm5.1 0h8.5c.9 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5h-8.5c-.9 0-1.5-.7-1.5-1.5-.1-.9.6-1.5 1.5-1.5zm-5.1 5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5c0-.9.7-1.5 1.5-1.5zm5.1 0h8.5c.9 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5h-8.5c-.9 0-1.5-.7-1.5-1.5-.1-.9.6-1.5 1.5-1.5z'/%3E%3C/svg%3E\");\n  border: 0;\n  cursor: pointer;\n  display: block;\n  font-size: 0;\n  height: 20px;\n  line-height: 0;\n  margin: 10px 6px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  text-decoration: none;\n  width: 20px;\n}\n\n/* :focus for accessibility */\n.mejs__button > button:focus {\n  outline: dotted 1px #999;\n}\n\n.mejs__container-keyboard-inactive a,\n.mejs__container-keyboard-inactive a:focus,\n.mejs__container-keyboard-inactive button,\n.mejs__container-keyboard-inactive button:focus,\n.mejs__container-keyboard-inactive [role='slider'],\n.mejs__container-keyboard-inactive [role='slider']:focus {\n  outline: 0;\n}\n\n/* End: CONTROL BAR */\n\n/* Start: Time (Current / Duration) */\n.mejs__time {\n  box-sizing: content-box;\n  color: #fff;\n  font-size: 11px;\n  font-weight: bold;\n  height: 24px;\n  overflow: hidden;\n  padding: 16px 6px 0;\n  text-align: center;\n  width: auto;\n}\n\n/* End: Time (Current / Duration) */\n\n/* Start: Play/Pause/Stop */\n.mejs__play > button {\n  background-position: 0 0;\n}\n\n.mejs__pause > button {\n  background-position: -20px 0;\n}\n\n.mejs__replay > button {\n  background-position: -160px 0;\n}\n\n/* End: Play/Pause/Stop */\n\n/* Start: Progress Bar */\n.mejs__time-rail {\n  direction: ltr;\n  -webkit-box-flex: 1;\n  -webkit-flex-grow: 1;\n  -ms-flex-positive: 1;\n  flex-grow: 1;\n  height: 40px;\n  margin: 0 10px;\n  padding-top: 10px;\n  position: relative;\n}\n\n.mejs__time-total,\n.mejs__time-buffering,\n.mejs__time-loaded,\n.mejs__time-current,\n.mejs__time-float,\n.mejs__time-hovered,\n.mejs__time-float-current,\n.mejs__time-float-corner,\n.mejs__time-marker {\n  border-radius: 2px;\n  cursor: pointer;\n  display: block;\n  height: 10px;\n  position: absolute;\n}\n\n.mejs__time-total {\n  background: rgba(255, 255, 255, 0.3);\n  margin: 5px 0 0;\n  width: 100%;\n}\n\n.mejs__time-buffering {\n  -webkit-animation: buffering-stripes 2s linear infinite;\n  animation: buffering-stripes 2s linear infinite;\n  background: -webkit-linear-gradient(\n    135deg,\n    rgba(255, 255, 255, 0.4) 25%,\n    transparent 25%,\n    transparent 50%,\n    rgba(255, 255, 255, 0.4) 50%,\n    rgba(255, 255, 255, 0.4) 75%,\n    transparent 75%,\n    transparent\n  );\n  background: linear-gradient(\n    -45deg,\n    rgba(255, 255, 255, 0.4) 25%,\n    transparent 25%,\n    transparent 50%,\n    rgba(255, 255, 255, 0.4) 50%,\n    rgba(255, 255, 255, 0.4) 75%,\n    transparent 75%,\n    transparent\n  );\n  background-size: 15px 15px;\n  width: 100%;\n}\n\n@-webkit-keyframes buffering-stripes {\n  from {\n    background-position: 0 0;\n  }\n  to {\n    background-position: 30px 0;\n  }\n}\n\n@keyframes buffering-stripes {\n  from {\n    background-position: 0 0;\n  }\n  to {\n    background-position: 30px 0;\n  }\n}\n\n.mejs__time-loaded {\n  background: rgba(255, 255, 255, 0.3);\n}\n\n.mejs__time-current,\n.mejs__time-handle-content {\n  background: rgba(255, 255, 255, 0.9);\n}\n\n.mejs__time-hovered {\n  background: rgba(255, 255, 255, 0.5);\n  z-index: 10;\n}\n\n.mejs__time-hovered.negative {\n  background: rgba(0, 0, 0, 0.2);\n}\n\n.mejs__time-current,\n.mejs__time-buffering,\n.mejs__time-loaded,\n.mejs__time-hovered {\n  left: 0;\n  -webkit-transform: scaleX(0);\n  -ms-transform: scaleX(0);\n  transform: scaleX(0);\n  -webkit-transform-origin: 0 0;\n  -ms-transform-origin: 0 0;\n  transform-origin: 0 0;\n  -webkit-transition: 0.15s ease-in all;\n  transition: 0.15s ease-in all;\n  width: 100%;\n}\n\n.mejs__time-buffering {\n  -webkit-transform: scaleX(1);\n  -ms-transform: scaleX(1);\n  transform: scaleX(1);\n}\n\n.mejs__time-hovered {\n  -webkit-transition: height 0.1s cubic-bezier(0.44, 0, 1, 1);\n  transition: height 0.1s cubic-bezier(0.44, 0, 1, 1);\n}\n\n.mejs__time-hovered.no-hover {\n  -webkit-transform: scaleX(0) !important;\n  -ms-transform: scaleX(0) !important;\n  transform: scaleX(0) !important;\n}\n\n.mejs__time-handle,\n.mejs__time-handle-content {\n  border: 4px solid transparent;\n  cursor: pointer;\n  left: 0;\n  position: absolute;\n  -webkit-transform: translateX(0);\n  -ms-transform: translateX(0);\n  transform: translateX(0);\n  z-index: 11;\n}\n\n.mejs__time-handle-content {\n  border: 4px solid rgba(255, 255, 255, 0.9);\n  border-radius: 50%;\n  height: 10px;\n  left: -7px;\n  top: -4px;\n  -webkit-transform: scale(0);\n  -ms-transform: scale(0);\n  transform: scale(0);\n  width: 10px;\n}\n\n.mejs__time-rail:hover .mejs__time-handle-content,\n.mejs__time-rail .mejs__time-handle-content:focus,\n.mejs__time-rail .mejs__time-handle-content:active {\n  -webkit-transform: scale(1);\n  -ms-transform: scale(1);\n  transform: scale(1);\n}\n\n.mejs__time-float {\n  background: #eee;\n  border: solid 1px #333;\n  bottom: 100%;\n  color: #111;\n  display: none;\n  height: 17px;\n  margin-bottom: 9px;\n  position: absolute;\n  text-align: center;\n  -webkit-transform: translateX(-50%);\n  -ms-transform: translateX(-50%);\n  transform: translateX(-50%);\n  width: 36px;\n}\n\n.mejs__time-float-current {\n  display: block;\n  left: 0;\n  margin: 2px;\n  text-align: center;\n  width: 30px;\n}\n\n.mejs__time-float-corner {\n  border: solid 5px #eee;\n  border-color: #eee transparent transparent;\n  border-radius: 0;\n  display: block;\n  height: 0;\n  left: 50%;\n  line-height: 0;\n  position: absolute;\n  top: 100%;\n  -webkit-transform: translateX(-50%);\n  -ms-transform: translateX(-50%);\n  transform: translateX(-50%);\n  width: 0;\n}\n\n.mejs__long-video .mejs__time-float {\n  margin-left: -23px;\n  width: 64px;\n}\n\n.mejs__long-video .mejs__time-float-current {\n  width: 60px;\n}\n\n.mejs__broadcast {\n  color: #fff;\n  height: 10px;\n  position: absolute;\n  top: 15px;\n  width: 100%;\n}\n\n/* End: Progress Bar */\n\n/* Start: Fullscreen */\n.mejs__fullscreen-button > button {\n  background-position: -80px 0;\n}\n\n.mejs__unfullscreen > button {\n  background-position: -100px 0;\n}\n\n/* End: Fullscreen */\n\n/* Start: Mute/Volume */\n.mejs__mute > button {\n  background-position: -60px 0;\n}\n\n.mejs__unmute > button {\n  background-position: -40px 0;\n}\n\n.mejs__volume-button {\n  position: relative;\n}\n\n.mejs__volume-button > .mejs__volume-slider {\n  -webkit-backface-visibility: hidden;\n  background: rgba(50, 50, 50, 0.7);\n  border-radius: 0;\n  bottom: 100%;\n  display: none;\n  height: 115px;\n  left: 50%;\n  margin: 0;\n  position: absolute;\n  -webkit-transform: translateX(-50%);\n  -ms-transform: translateX(-50%);\n  transform: translateX(-50%);\n  width: 25px;\n  z-index: 1;\n}\n\n.mejs__volume-button:hover {\n  border-radius: 0 0 4px 4px;\n}\n\n.mejs__volume-total {\n  background: rgba(255, 255, 255, 0.5);\n  height: 100px;\n  left: 50%;\n  margin: 0;\n  position: absolute;\n  top: 8px;\n  -webkit-transform: translateX(-50%);\n  -ms-transform: translateX(-50%);\n  transform: translateX(-50%);\n  width: 2px;\n}\n\n.mejs__volume-current {\n  background: rgba(255, 255, 255, 0.9);\n  left: 0;\n  margin: 0;\n  position: absolute;\n  width: 100%;\n}\n\n.mejs__volume-handle {\n  background: rgba(255, 255, 255, 0.9);\n  border-radius: 1px;\n  cursor: ns-resize;\n  height: 6px;\n  left: 50%;\n  position: absolute;\n  -webkit-transform: translateX(-50%);\n  -ms-transform: translateX(-50%);\n  transform: translateX(-50%);\n  width: 16px;\n}\n\n.mejs__horizontal-volume-slider {\n  display: block;\n  height: 36px;\n  position: relative;\n  vertical-align: middle;\n  width: 56px;\n}\n\n.mejs__horizontal-volume-total {\n  background: rgba(50, 50, 50, 0.8);\n  border-radius: 2px;\n  font-size: 1px;\n  height: 8px;\n  left: 0;\n  margin: 0;\n  padding: 0;\n  position: absolute;\n  top: 16px;\n  width: 50px;\n}\n\n.mejs__horizontal-volume-current {\n  background: rgba(255, 255, 255, 0.8);\n  border-radius: 2px;\n  font-size: 1px;\n  height: 100%;\n  left: 0;\n  margin: 0;\n  padding: 0;\n  position: absolute;\n  top: 0;\n  width: 100%;\n}\n\n.mejs__horizontal-volume-handle {\n  display: none;\n}\n\n/* End: Mute/Volume */\n\n/* Start: Track (Captions and Chapters) */\n.mejs__captions-button,\n.mejs__chapters-button {\n  position: relative;\n}\n\n.mejs__captions-button > button {\n  background-position: -140px 0;\n}\n\n.mejs__chapters-button > button {\n  background-position: -180px 0;\n}\n\n.mejs__captions-button > .mejs__captions-selector,\n.mejs__chapters-button > .mejs__chapters-selector {\n  background: rgba(50, 50, 50, 0.7);\n  border: solid 1px transparent;\n  border-radius: 0;\n  bottom: 100%;\n  margin-right: -43px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  right: 50%;\n  visibility: visible;\n  width: 86px;\n}\n\n.mejs__chapters-button > .mejs__chapters-selector {\n  margin-right: -55px;\n  width: 110px;\n}\n\n.mejs__captions-selector-list,\n.mejs__chapters-selector-list {\n  list-style-type: none !important;\n  margin: 0;\n  overflow: hidden;\n  padding: 0;\n}\n\n.mejs__captions-selector-list-item,\n.mejs__chapters-selector-list-item {\n  color: #fff;\n  cursor: pointer;\n  display: block;\n  list-style-type: none !important;\n  margin: 0 0 6px;\n  overflow: hidden;\n  padding: 0;\n}\n\n.mejs__captions-selector-list-item:hover,\n.mejs__chapters-selector-list-item:hover {\n  background-color: rgb(200, 200, 200) !important;\n  background-color: rgba(255, 255, 255, 0.4) !important;\n}\n\n.mejs__captions-selector-input,\n.mejs__chapters-selector-input {\n  clear: both;\n  float: left;\n  left: -1000px;\n  margin: 3px 3px 0 5px;\n  position: absolute;\n}\n\n.mejs__captions-selector-label,\n.mejs__chapters-selector-label {\n  cursor: pointer;\n  float: left;\n  font-size: 10px;\n  line-height: 15px;\n  padding: 4px 10px 0;\n  width: 100%;\n}\n\n.mejs__captions-selected,\n.mejs__chapters-selected {\n  color: rgba(33, 248, 248, 1);\n}\n\n.mejs__captions-translations {\n  font-size: 10px;\n  margin: 0 0 5px;\n}\n\n.mejs__captions-layer {\n  bottom: 0;\n  color: #fff;\n  font-size: 16px;\n  left: 0;\n  line-height: 20px;\n  text-align: center;\n}\n\n.mejs__captions-layer a {\n  color: #fff;\n  text-decoration: underline;\n}\n\n.mejs__captions-layer[lang='ar'] {\n  font-size: 20px;\n  font-weight: normal;\n}\n\n.mejs__captions-position {\n  bottom: 15px;\n  left: 0;\n  position: absolute;\n  width: 100%;\n}\n\n.mejs__captions-position-hover {\n  bottom: 35px;\n}\n\n.mejs__captions-text,\n.mejs__captions-text * {\n  background: rgba(20, 20, 20, 0.5);\n  box-shadow: 5px 0 0 rgba(20, 20, 20, 0.5), -5px 0 0 rgba(20, 20, 20, 0.5);\n  padding: 0;\n  white-space: pre-wrap;\n}\n\n.mejs__container.mejs__hide-cues video::-webkit-media-text-track-container {\n  display: none;\n}\n\n/* End: Track (Captions and Chapters) */\n\n/* Start: Error */\n.mejs__overlay-error {\n  position: relative;\n}\n.mejs__overlay-error > img {\n  left: 0;\n  max-width: 100%;\n  position: absolute;\n  top: 0;\n  z-index: -1;\n}\n.mejs__cannotplay,\n.mejs__cannotplay a {\n  color: #fff;\n  font-size: 0.8em;\n}\n\n.mejs__cannotplay {\n  position: relative;\n}\n\n.mejs__cannotplay p,\n.mejs__cannotplay a {\n  display: inline-block;\n  padding: 0 15px;\n  width: 100%;\n}\n/* End: Error */\n";
  styleInject(css_248z);

  var css_248z$1 = "/*!\n * MediaElement.js Plugins\n * http://www.mediaelementjs.com/\n * \n * Qualities feature styling\n *\n * Copyright 2010-2017, John Dyer (http://j.hn/)\n * License: MIT\n *\n */\n.mejs__qualities-button,\n.mejs-qualities-button {\n  position: relative; }\n\n.mejs__qualities-button > button,\n.mejs-qualities-button > button {\n  color: #fff;\n  font-size: 11px;\n  line-height: normal;\n  margin: 11px 0 0;\n  width: 36px; }\n\n.mejs__qualities-selector,\n.mejs-qualities-selector {\n  background: rgba(50, 50, 50, 0.7);\n  border: solid 1px transparent;\n  border-radius: 0;\n  height: 100px;\n  left: -10px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  top: -100px;\n  width: 60px; }\n\n.mejs__qualities-selector ul,\n.mejs-qualities-selector ul {\n  display: block;\n  list-style-type: none !important;\n  margin: 0;\n  overflow: hidden;\n  padding: 0; }\n\n.mejs__qualities-selector li,\n.mejs-qualities-selector li {\n  color: #fff;\n  cursor: pointer;\n  display: block;\n  list-style-type: none !important;\n  margin: 0 0 6px;\n  overflow: hidden;\n  padding: 0 10px; }\n\n.mejs__qualities-selector li:hover,\n.mejs-qualities-selector li:hover {\n  background-color: rgba(255, 255, 255, 0.2);\n  cursor: pointer; }\n\n.mejs__qualities-selector input,\n.mejs-qualities-selector input {\n  clear: both;\n  float: left;\n  left: -1000px;\n  margin: 3px 3px 0 5px;\n  position: absolute; }\n\n.mejs__qualities-selector label,\n.mejs-qualities-selector label {\n  cursor: pointer;\n  float: left;\n  font-size: 10px;\n  line-height: 15px;\n  padding: 4px 0 0;\n  width: 55px; }\n\n.mejs__qualities-selected,\n.mejs-qualities-selected {\n  color: #21f8f8; }\n";
  styleInject(css_248z$1);

  var css_248z$2 = "/*\n * From avalon project: /app/assets/stylesheets/mejs4/mediaelement-common-styles.scss\n *\n * Time rail and button styles\n*/\n.mejs-overlay-loading {\n  border-radius: 50% !important; }\n\n.mejs-time-clip {\n  background: linear-gradient(#ddd, #ddd);\n  opacity: 0.3;\n  height: 14px !important;\n  top: -3px !important; }\n\n.mejs__container {\n  z-index: 1000; }\n\n.mejs-highlight-clip {\n  background: linear-gradient(#84a791, #84a791);\n  opacity: 0.55;\n  height: 24px;\n  top: -7px;\n  display: block;\n  position: relative;\n  z-index: -1; }\n\n.mejs__button {\n  width: 30px; }\n\n.mejs__button > button {\n  background: transparent url(\"data:image/svg+xml;charset=utf-8,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 170 40' style='enable-background:new 0 0 170 40%3B' xml:space='preserve'%3E%3Cstyle type='text/css'%3E.st0%7Bfill:%23FFFFFF%3B%7D%3C/style%3E%3Ctitle%3Emejs4_icons%3C/title%3E%3Cg id='Layer_1-2'%3E%3Cg id='icons'%3E%3Cg id='FullScreen'%3E%3Cpolygon class='st0' points='76.2%2C15.4 73.8%2C12.4 72%2C14.2 74.9%2C16.6 72%2C19.5 79.1%2C19.5 79.1%2C12.4 '/%3E%3Cpolygon class='st0' points='67.3%2C0.7 60.2%2C0.7 60.2%2C7.7 63%2C5 65.6%2C7.7 67.3%2C6 64.6%2C3.4 '/%3E%3Cpolygon class='st0' points='67.3%2C14.2 65.7%2C12.4 63%2C15.4 60.2%2C12.4 60.2%2C19.5 67.3%2C19.5 64.6%2C16.6 '/%3E%3Cpolygon class='st0' points='79.1%2C0.7 72%2C0.7 74.9%2C3.4 72%2C6 73.8%2C7.7 76.2%2C5 79.1%2C7.7 '/%3E%3C/g%3E%3Cg id='Cog'%3E%3Cpath class='st0' d='M59.6%2C11.6V9.2L56.7%2C8c-0.1-0.2-0.2-0.5-0.3-0.7l1.2-2.9l-1.7-1.7L53%2C3.9c-0.2-0.1-0.5-0.2-0.7-0.3l-1.2-2.8 h-2.4l-1.2%2C2.8c-0.2%2C0.1-0.5%2C0.2-0.7%2C0.3L44%2C2.8l-1.7%2C1.8l1.2%2C2.8c-0.1%2C0-0.2%2C0.6-0.2%2C0.6l-2.9%2C1.2v2.4l2.8%2C1.2 c0.1%2C0.2%2C0.2%2C0.5%2C0.3%2C0.7l-1.2%2C2.8l1.6%2C1.6l2.8-1.2c0.2%2C0.1%2C0.5%2C0.2%2C0.7%2C0.3l1.2%2C3H51l1.2-2.9c0.2-0.1%2C0.5-0.2%2C0.7-0.3l2.9%2C1.2 l1.6-1.6l-1.2-2.9c0.1-0.2%2C0.2-0.5%2C0.3-0.7L59.6%2C11.6L59.6%2C11.6z M50%2C14.1c-2%2C0-3.6-1.6-3.6-3.6S48%2C6.9%2C50%2C6.9l0%2C0 c2%2C0%2C3.6%2C1.6%2C3.6%2C3.6S52%2C14.1%2C50%2C14.1L50%2C14.1z'/%3E%3C/g%3E%3Cg id='Camera'%3E%3Cpath id='Camera_Body' class='st0' d='M136.9%2C5.1L135%2C1.3c-0.6-0.5-0.6-0.8-1.1-0.8h-3.4c-0.5%2C0-0.9%2C0.3-1.1%2C0.8l-1.8%2C3.8H123 c-1.2%2C0-2.3%2C1-2.3%2C2.2v0.1v11.5h18.4V7.4c0-1.3-1-2.3-2.3-2.3L136.9%2C5.1z M124.3%2C9.7c-0.6%2C0-1.1-0.5-1.1-1.1s0.5-1.1%2C1.1-1.1 s1.1%2C0.5%2C1.1%2C1.1l0%2C0C125.4%2C9.2%2C124.9%2C9.7%2C124.3%2C9.7z M132.3%2C16.6c-2.5%2C0-4.6-2.1-4.6-4.6s2.1-4.6%2C4.6-4.6s4.6%2C2.1%2C4.6%2C4.6 C136.8%2C14.5%2C134.8%2C16.5%2C132.3%2C16.6z'/%3E%3Cpath id='Lense' class='st0' d='M132.2%2C14.8c-1.5%2C0-2.8-1.3-2.8-2.8s1.3-2.8%2C2.8-2.8s2.8%2C1.3%2C2.8%2C2.8 C134.9%2C13.5%2C133.7%2C14.7%2C132.2%2C14.8z'/%3E%3C/g%3E%3Cpath id='AddToPlaylist' class='st0' d='M64.9%2C26.5H50.3v2.3h14.6V26.5z M64.9%2C21.8H50.3v2.3h14.6V21.8z M69.8%2C31.1v-4.7h-2.4v4.7 h-4.9v2.3h4.9v4.7h2.4v-4.7h4.9v-2.3L69.8%2C31.1z M50.3%2C33.4H60v-2.3h-9.7V33.4z'/%3E%3Cpath id='AddBookmark' class='st0' d='M102.4%2C19.5V2.4c0%2C0%2C0.3-2%2C1.9-2h11.6c0.9%2C0.2%2C1.6%2C1%2C1.5%2C1.9v17.3l-7.5-3.2L102.4%2C19.5 M110.9%2C12.8V9.9l4.2-0.1v-2l-4.2-0.1v-4h-2v3.9H105v2.1h3.9v3.9h2V12.8z'/%3E%3Crect x='22.1' y='-0.1' class='st0' width='5.1' height='19.6'/%3E%3Crect x='32.5' y='-0.1' class='st0' width='5.1' height='19.6'/%3E%3Cpolygon class='st0' points='1.2%2C0.2 18.2%2C9.5 1.2%2C20.2 '/%3E%3Cpolygon class='st0' points='95.4%2C16.7 97.8%2C19.7 99.6%2C17.9 96.6%2C15.5 99.6%2C12.4 92.3%2C12.4 92.3%2C19.7 '/%3E%3Cpolygon class='st0' points='80.2%2C7.6 87.5%2C7.6 87.5%2C0.3 84.7%2C3.1 82%2C0.3 80.3%2C2.1 83%2C4.8 '/%3E%3Cpolygon class='st0' points='80.2%2C17.9 81.9%2C19.7 84.7%2C16.7 87.5%2C19.7 87.5%2C12.4 80.2%2C12.4 83%2C15.5 '/%3E%3Cpolygon class='st0' points='92.3%2C7.6 99.6%2C7.6 96.6%2C4.8 99.6%2C2.1 97.8%2C0.3 95.4%2C3.1 92.3%2C0.3 '/%3E%3Cg id='Volume'%3E%3Cpath class='st0' d='M7%2C35c-2.8%2C0-5-2.2-5-5s2.2-5%2C5-5V35z'/%3E%3Cpolygon class='st0' points='9.5%2C25 14.5%2C22.5 14.5%2C37.5 9.5%2C35 '/%3E%3Cpath class='st0' d='M17%2C35v-2.5c0.2%2C0%2C0.4%2C0%2C0.6-0.1c1.2-0.6%2C1.9-1.2%2C1.9-2.5c0.1-1.2-0.7-2.2-1.9-2.4c-0.2%2C0-0.4-0.1-0.6-0.1 v-2.5c0.4%2C0%2C0.8%2C0.1%2C1.2%2C0.1c2.3%2C0.5%2C3.8%2C2.6%2C3.7%2C4.9c0%2C2.3-1.5%2C4.3-3.7%2C4.9H17V35z'/%3E%3C/g%3E%3Cg id='Pause'%3E%3Cpath class='st0' d='M31.5%2C34.9c-2.8%2C0-5-2.2-5-5c0-2.7%2C2.3-5%2C5-5V34.9z'/%3E%3Cpolygon class='st0' points='34%2C24.9 39%2C22.4 39%2C37.4 34%2C34.9 '/%3E%3Cpath class='st0' d='M48.3%2C34.4l-6.1-5.5c-0.2-0.2-0.3-0.5-0.3-0.8V26c0-0.5%2C0.4-0.8%2C0.7-0.5l6.1%2C5.5c0.2%2C0.2%2C0.3%2C0.5%2C0.3%2C0.8V34 C49%2C34.4%2C48.6%2C34.7%2C48.3%2C34.4z'/%3E%3Cpath class='st0' d='M49%2C28c0%2C0.3-0.1%2C0.5-0.3%2C0.7l-6.1%2C5.7c-0.3%2C0.3-0.7%2C0-0.7-0.5v-2.1c0-0.3%2C0.1-0.5%2C0.3-0.7l6.1-5.7 c0.3-0.3%2C0.7%2C0%2C0.7%2C0.5V28z'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3Cpath id='path3396' class='st0' d='M88.8%2C28.7v0.7c0%2C0.1%2C0%2C0.2-0.1%2C0.2c-0.1%2C0.1-0.1%2C0.1-0.2%2C0.1h-6.1c-0.1%2C0-0.2%2C0-0.2-0.1 c-0.1-0.1-0.1-0.1-0.1-0.2v-0.7c0-0.1%2C0-0.2%2C0.1-0.2c0.1-0.1%2C0.1-0.1%2C0.2-0.1h6.1c0.1%2C0%2C0.2%2C0%2C0.2%2C0.1 C88.7%2C28.5%2C88.8%2C28.6%2C88.8%2C28.7z M90.1%2C29c0-1.3-0.5-2.5-1.4-3.4c-1.8-1.8-4.8-1.9-6.6-0.1c0%2C0%2C0%2C0-0.1%2C0.1c-1.8%2C1.9-1.8%2C4.8%2C0%2C6.7 c1.8%2C1.8%2C4.8%2C1.9%2C6.6%2C0.1c0%2C0%2C0%2C0%2C0.1-0.1C89.6%2C31.5%2C90.1%2C30.3%2C90.1%2C29L90.1%2C29z M95.5%2C37.8c0%2C0.4-0.1%2C0.7-0.4%2C1s-0.6%2C0.4-1%2C0.4 s-0.7-0.1-0.9-0.4l-3.6-3.7c-2.1%2C1.4-4.7%2C1.7-7.1%2C0.7c-3.8-1.6-5.6-6-4-9.8c0.8-1.8%2C2.2-3.2%2C4-4s3.9-0.8%2C5.8%2C0 c2.7%2C1.2%2C4.5%2C3.9%2C4.5%2C6.9c0%2C1.5-0.4%2C3-1.3%2C4.2l3.6%2C3.6C95.4%2C37.1%2C95.5%2C37.5%2C95.5%2C37.8L95.5%2C37.8z'/%3E%3Cpath id='path3406' class='st0' d='M109.7%2C28.7v0.7c0%2C0.2-0.2%2C0.3-0.3%2C0.3H107v2.4c0%2C0.2-0.2%2C0.3-0.3%2C0.3H106 c-0.2%2C0-0.3-0.2-0.3-0.3v-2.4h-2.4c-0.2%2C0-0.3-0.2-0.3-0.3v-0.7c0-0.2%2C0.2-0.3%2C0.3-0.3h2.4V26c0-0.2%2C0.2-0.3%2C0.3-0.3h0.7 c0.2%2C0%2C0.3%2C0.2%2C0.3%2C0.3v2.4h2.4C109.6%2C28.4%2C109.7%2C28.5%2C109.7%2C28.7L109.7%2C28.7z M111%2C29c0-2.6-2.1-4.8-4.7-4.8s-4.8%2C2.1-4.8%2C4.7 s2.1%2C4.8%2C4.7%2C4.8c1.3%2C0%2C2.5-0.5%2C3.4-1.4C110.5%2C31.5%2C111%2C30.3%2C111%2C29z M116.4%2C37.8c0%2C0.8-0.6%2C1.4-1.4%2C1.4l0%2C0c-0.4%2C0-0.7-0.1-1-0.4 l-3.6-3.6c-1.2%2C0.9-2.7%2C1.3-4.2%2C1.3c-1%2C0-2-0.2-2.9-0.6c-1.8-0.7-3.3-2.2-4-4c-0.8-1.9-0.8-3.9%2C0-5.8c0.7-1.8%2C2.2-3.3%2C4-4 c1.9-0.8%2C3.9-0.8%2C5.8%2C0c1.8%2C0.7%2C3.3%2C2.2%2C4%2C4c0.4%2C0.9%2C0.6%2C1.9%2C0.6%2C2.9c0%2C1.5-0.4%2C3-1.3%2C4.2l3.6%2C3.6C116.3%2C37.1%2C116.4%2C37.5%2C116.4%2C37.8 L116.4%2C37.8z'/%3E%3Cg id='Icons'%3E%3Cg id='external'%3E%3Cpolygon id='box' class='st0' points='119.6%2C21.5 126.2%2C21.5 126.2%2C23.7 121.8%2C23.7 121.8%2C37 135.1%2C37 135.1%2C32.6 137.3%2C32.6 137.3%2C39.2 119.6%2C39.2 '/%3E%3Cpolygon id='arrow_13_' class='st0' points='128.9%2C21.5 137.3%2C21.5 137.3%2C29.9 134.1%2C26.7 129.4%2C31.5 127.3%2C29.4 132%2C24.7 '/%3E%3C/g%3E%3C/g%3E%3Cpath class='st0' d='M148%2C31.5h2.2c-0.1%2C1.1-0.5%2C1.9-1.1%2C2.5s-1.3%2C1-2.3%2C1c-1.1%2C0-2-0.4-2.6-1.2s-1-1.9-1-3.2s0.4-2.4%2C1-3.2 c0.6-0.8%2C1.4-1.2%2C2.4-1.2c1.1%2C0%2C1.8%2C0.4%2C2.4%2C1c0.6%2C0.6%2C1%2C1.4%2C1%2C2.5h-2.2c0-0.5-0.1-0.8-0.4-1.1s-0.5-0.4-0.8-0.4 c-0.4%2C0-0.7%2C0.2-1%2C0.6s-0.4%2C1.1-0.4%2C1.8c0%2C0.4%2C0%2C0.6%2C0%2C0.8s0.1%2C0.5%2C0.2%2C0.7c0.1%2C0.2%2C0.2%2C0.4%2C0.4%2C0.5s0.4%2C0.2%2C0.7%2C0.2 C147.5%2C32.9%2C148%2C32.5%2C148%2C31.5z M155.4%2C31.5h2.2c-0.1%2C1.1-0.5%2C1.9-1%2C2.5c-0.6%2C0.6-1.3%2C1-2.2%2C1c-1.1%2C0-2-0.4-2.6-1.2s-1-1.9-1-3.2 s0.4-2.4%2C1-3.2c0.6-0.8%2C1.4-1.2%2C2.4-1.2c1.1%2C0%2C1.8%2C0.4%2C2.4%2C1c0.6%2C0.6%2C1%2C1.4%2C1%2C2.5h-2.2c0-0.5-0.1-0.8-0.4-1.1 c-0.2-0.2-0.5-0.4-0.8-0.4c-0.4%2C0-0.7%2C0.2-1%2C0.6s-0.4%2C1.1-0.4%2C1.8c0%2C0.4%2C0%2C0.6%2C0%2C0.8s0.1%2C0.5%2C0.2%2C0.7c0.1%2C0.2%2C0.2%2C0.4%2C0.4%2C0.5 s0.4%2C0.2%2C0.7%2C0.2c0.4%2C0%2C0.6-0.1%2C0.8-0.4C155.3%2C32.3%2C155.4%2C32%2C155.4%2C31.5z M159.2%2C30.3c0-1.4%2C0-2.5-0.1-3.2s-0.4-1.2-0.6-1.7 l-0.1-0.1c0%2C0-0.1-0.1-0.2-0.1c-0.1-0.1-0.1-0.1-0.1-0.1c-0.6-0.5-3-0.6-7.2-0.6c-4.3%2C0-6.7%2C0.2-7.3%2C0.6c0%2C0-0.1%2C0.1-0.2%2C0.1 c-0.1%2C0-0.1%2C0.1-0.2%2C0.1l-0.1%2C0.1c-0.4%2C0.4-0.5%2C1-0.6%2C1.7s-0.1%2C1.8-0.1%2C3.2c0%2C1.4%2C0%2C2.5%2C0.1%2C3.2s0.4%2C1.2%2C0.6%2C1.7l0.1%2C0.1 c0.1%2C0%2C0.1%2C0.1%2C0.2%2C0.1c0.1%2C0%2C0.1%2C0.1%2C0.2%2C0.1c0.4%2C0.2%2C1.1%2C0.4%2C2.5%2C0.5c1.3%2C0.1%2C3%2C0.1%2C4.9%2C0.1c4.2%2C0%2C6.6-0.2%2C7.2-0.7l0.1-0.1 c0.1%2C0%2C0.1-0.1%2C0.2-0.1s0.1-0.1%2C0.1-0.1c0.4-0.4%2C0.5-1%2C0.6-1.7C159.3%2C32.7%2C159.2%2C31.7%2C159.2%2C30.3z M161.2%2C22.4v16h-21.3v-16 C139.9%2C22.4%2C161.2%2C22.4%2C161.2%2C22.4z'/%3E%3Cg%3E%3Cpath class='st0' d='M144.5%2C5v5h5.5V5h3.6V19H150v-5h-5.5v5h-3.6V5H144.5z'/%3E%3Cpath class='st0' d='M161.1%2C5c4.3%2C0%2C6.4%2C2.3%2C6.4%2C7s-2.1%2C7-6.4%2C7h-6.4V5H161.1z M158.3%2C9v6h2.8c1.9%2C0%2C2.8-1%2C2.8-3s-0.9-3-2.8-3 H158.3z'/%3E%3C/g%3E%3C/svg%3E\");\n  background-repeat: none;\n  background-size: 170px 40px; }\n\n.mejs__play > button {\n  background-position: 0px 0px; }\n\n.mejs__pause > button {\n  background-position: -20px 0px; }\n\n.mejs__fullscreen-button > button {\n  background-position: -60px 0px; }\n\n.mejs__unfullscreen > button {\n  background-position: -80px 0px; }\n\n.mejs__mute,\n.mejs__unmute {\n  width: 36px; }\n\n.mejs__mute > button {\n  background-position: 0px -20px;\n  width: 25px; }\n\n.mejs__unmute > button {\n  background-position: -25px -20px;\n  width: 25px; }\n\n.mejs__qualities-button > button {\n  background-position: -40px 0px;\n  text-indent: 200px;\n  margin: 10px 6px;\n  width: 20px; }\n\n.mejs__captions-button > button {\n  width: 22px;\n  background-position: -140px -20px; }\n\n.mejs__captions-enabled > button {\n  border-bottom: 2px solid red;\n  padding: 11px; }\n\n.mejs__hd-toggle-button {\n  width: 35px; }\n\n.mejs__hd-toggle-button > button {\n  width: 27px;\n  background-position: -141px -2px;\n  filter: brightness(60%);\n  -webkit-filter: brightness(60%); }\n\n.mejs__hdtoggle-on > button {\n  filter: none;\n  -webkit-filter: none; }\n";
  styleInject(css_248z$2);

  var _typeof_1 = createCommonjsModule(function (module) {
  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      module.exports = _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      module.exports = _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  module.exports = _typeof;
  });

  /**
   * Get all the canvases in manifest
   * @function IIIFParser#canvasesInManifest
   * @return {Object} array of canvases in manifest
   **/

  function canvasesInManifest(manifest) {
    var canvases = manifesto_js.parseManifest(manifest).getSequences()[0].getCanvases().map(function (canvas) {
      var sources = canvas.getContent()[0].getBody().map(function (source) {
        return source.id;
      });
      return {
        canvasId: canvas.id,
        canvasSources: sources
      };
    });
    return canvases;
  }
  /**
   * Check if item's behavior is set to a value which should hide it
   * @param {Object} item
   */

  function filterVisibleRangeItem(_ref) {
    var item = _ref.item,
        manifest = _ref.manifest;
    var itemInManifest = manifesto_js.parseManifest(manifest).getRangeById(item.id);

    if (itemInManifest) {
      var behavior = itemInManifest.getBehavior();

      if (behavior && behavior === 'no-nav') {
        return null;
      }

      return item;
    }
  }
  function getChildCanvases(_ref2) {
    var rangeId = _ref2.rangeId,
        manifest = _ref2.manifest;
    var rangeCanvases = [];

    try {
      rangeCanvases = manifesto_js.parseManifest(manifest).getRangeById(rangeId).getCanvasIds();
    } catch (e) {
      console.log('error fetching range canvases');
    }

    return rangeCanvases;
  }
  /**
   * Get sources and media type for a given canvas
   * If there are no items, an error is returned (user facing error)
   * @param {Object} obj
   * @param {Object} obj.manifest IIIF Manifest
   * @param {Number} obj.canvasIndex Index of the current canvas in manifest
   * @returns {Array.<Object>} array of file choice objects
   */

  function getMediaInfo(_ref3) {
    var manifest = _ref3.manifest,
        canvasIndex = _ref3.canvasIndex;
    var choiceItems = [];

    try {
      choiceItems = manifesto_js.parseManifest(manifest).getSequences()[0].getCanvases()[canvasIndex].getContent()[0].getBody();
    } catch (e) {
      console.log('error fetching content', e);
      return {
        error: 'Error fetching content'
      };
    }

    if (choiceItems.length === 0) {
      return {
        error: 'No media sources found'
      };
    } else {
      try {
        var sources = choiceItems.map(function (item) {
          return {
            src: item.id,
            // TODO: make type more generic, possibly use mime-db
            format: item.getFormat() ? item.getFormat() : 'application/x-mpegurl',
            quality: item.getLabel()[0] ? item.getLabel()[0].value : 'auto'
          };
        });
        var allTypes = choiceItems.map(function (item) {
          return item.getType();
        });
        var uniqueTypes = allTypes.filter(function (t, index) {
          return allTypes.indexOf(t) === index;
        }); // Default type if there are different types

        var mediaType = uniqueTypes.length === 1 ? uniqueTypes[0] : 'video';
        return {
          sources: sources,
          mediaType: mediaType,
          error: null
        };
      } catch (e) {
        return {
          error: 'Manifest cannot be parsed.'
        };
      }
    }
  }
  /**
   * Get captions in manifest
   */

  function getTracks(_ref4) {
    var manifest = _ref4.manifest;
    var seeAlso = manifesto_js.parseManifest(manifest).getSeeAlso();

    if (seeAlso !== undefined) {
      return seeAlso;
    }

    return [];
  }
  /**
   * Parse the label value from a manifest item
   * See https://iiif.io/api/presentation/3.0/#label
   * @param {Object} label
   */

  function getLabelValue(label) {
    var decodeHTML = function decodeHTML(labelText) {
      return labelText.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
    };

    if (label && _typeof_1(label) === 'object') {
      var labelKeys = Object.keys(label);

      if (labelKeys && labelKeys.length > 0) {
        // Get the first key's first value
        var firstKey = labelKeys[0];
        return label[firstKey].length > 0 ? decodeHTML(label[firstKey][0]) : '';
      }
    } else if (typeof label === 'string') {
      return decodeHTML(label);
    }

    return 'Label could not be parsed';
  }
  /**
   * Takes a uri with a media fragment that looks like #=120,134 and returns an object
   * with start/stop in seconds and the duration in milliseconds
   * @function IIIFParser#getMediaFragment
   * @param {string} uri - Uri value
   * @return {Object} - Representing the media fragment ie. { start: "3287.0", stop: "3590.0" }, or undefined
   */

  function getMediaFragment(uri) {
    if (uri !== undefined) {
      var fragment = uri.split('#t=')[1];

      if (fragment !== undefined) {
        var splitFragment = fragment.split(',');
        return {
          start: splitFragment[0],
          stop: splitFragment[1]
        };
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }
  /**
   * Get the canvas ID from the URI of the clicked structure item
   * @param {String} uri URI of the item clicked in structure
   */

  function getCanvasId(uri) {
    if (uri !== undefined) {
      return uri.split('#t=')[0].split('/').reverse()[0];
    }
  }
  /**
   *
   * @param { Object } manifest
   */

  function getStartTime(manifest) {
    // https://preview.iiif.io/cookbook/0015-start/recipe/0015-start/ for reference
    var selector = manifest.start.selector;

    if (selector && selector.t) {
      return selector.t;
    }

    return;
  }
  /**
   * Determine there is a next section to play when the current section ends
   * @param { Object } obj
   * @param { Number } obj.canvasIndex index of the canvas in manifest
   * @param { Object } obj.manifest
   * @return {Boolean}
   */
  //TODO: Are we still using this?

  function hasNextSection(_ref5) {
    var canvasIndex = _ref5.canvasIndex,
        manifest = _ref5.manifest;
    var canvasIDs = manifesto_js.parseManifest(manifest).getSequences()[0].getCanvases().map(function (canvas) {
      return canvas.id;
    });
    return canvasIDs.length - 1 > canvasIndex ? true : false;
  }

  /**
   * Switch media player source and track files when previous file ended or
   * a different canvas is selected
   * @param {Object} meJSPlayer MediaElement player wrapper, HTML node, and instance
   * @param {Integer} canvasIndex Current canvas index
   * @param {Boolean} isPlaying Keep playing the new media
   * @param {Boolean} captionOn Captions turned on/off
   * @param {Object} manifest IIIF Manifest
   */

  function switchMedia(meJSPlayer, canvasIndex, isPlaying, captionOn, manifest) {
    var media = meJSPlayer.media,
        node = meJSPlayer.node,
        instance = meJSPlayer.instance;

    var _getMediaInfo = getMediaInfo({
      manifest: manifest,
      canvasIndex: canvasIndex
    }),
        mediaType = _getMediaInfo.mediaType,
        sources = _getMediaInfo.sources,
        error = _getMediaInfo.error;

    if (error) {
      return;
    }

    node.innerHTML = ''; // Build sources and tracks

    var sourceTags = createSourceTags(sources);
    var tracksTags = createTrackTags(getTracks({
      manifest: manifest
    }));
    var newChildren = "".concat(sourceTags.join('\n')).concat(tracksTags.join('\n')); // Attach the new sources and tracks to video element

    node.innerHTML = newChildren;
    instance.setSrc(sources[0].src); // Build features captionOnom new souces and tracks

    node.player.buildquality(instance, null, null, media);
    node.player.buildtracks(instance, null, instance.layers, media); // Set tracks

    handleTracks(instance, media, mediaType, captionOn);
    instance.load();

    if (isPlaying) {
      instance.play();
    }

    return instance;
  }
  function handleTracks(instance, media, mediaType, captionOn) {
    if (mediaType === 'video' && media.options.toggleCaptionsButtonWhenOnlyOne) {
      if (captionOn && instance.tracks && instance.tracks.length == 1) {
        instance.setTrack(instance.tracks[0].trackId, typeof keyboard !== 'undefined');
      }
    }
  }
  function createSourceTags(sources) {
    var sourceTags = [];

    for (var i = 0, total = sources.length; i < total; i++) {
      var source = sources[i];
      sourceTags.push("<source src=\"".concat(source.src, "\" type=\"").concat(source.format, "\" data-quality=\"").concat(source.quality, "\" />"));
    }

    return sourceTags;
  }
  function createTrackTags(tracks) {
    var tracksTags = [];

    for (var i = 0, total = tracks.length; i < total; i++) {
      var track = tracks[i];
      tracksTags.push("<track srclang=\"en\" kind=\"subtitles\" type=\"".concat(track.format, "\" src=\"").concat(track.id, "\"></track>"));
    }

    return tracksTags;
  }

  var MediaElement = function MediaElement(_ref) {
    var controls = _ref.controls,
        height = _ref.height,
        id = _ref.id,
        mediaType = _ref.mediaType,
        options = _ref.options,
        poster = _ref.poster,
        preload = _ref.preload,
        sources = _ref.sources,
        tracks = _ref.tracks,
        width = _ref.width,
        startTime = _ref.startTime;
    var playerDispatch = usePlayerDispatch();

    var _usePlayerState = usePlayerState(),
        isClicked = _usePlayerState.isClicked,
        isPlaying = _usePlayerState.isPlaying,
        captionOn = _usePlayerState.captionOn;

    var manifestDispatch = useManifestDispatch();

    var _useManifestState = useManifestState(),
        manifest = _useManifestState.manifest,
        canvasIndex = _useManifestState.canvasIndex;

    var _useState = React.useState({
      media: null,
      node: null,
      instance: null
    }),
        _useState2 = slicedToArray(_useState, 2),
        meJSPlayer = _useState2[0],
        setMEJSPlayer = _useState2[1];

    var _useState3 = React.useState(canvasIndex),
        _useState4 = slicedToArray(_useState3, 2),
        cIndex = _useState4[0],
        setCIndex = _useState4[1];

    var _success = function success(media, node, instance) {
      console.log('Loaded successfully');
      var player = {
        media: media,
        node: node,
        instance: instance
      }; // Register ended event

      media.addEventListener('ended', function () {
        handleEnded(player);
      }); // Register caption change event

      media.addEventListener('captionschange', function (captions) {
        console.log('captionschange', captions);
      });
      media.addEventListener('play', function () {
        playerDispatch({
          isPlaying: true,
          type: 'setPlayingStatus'
        });
        console.log('play event fires');
      });
      media.addEventListener('pause', function () {
        playerDispatch({
          isPlaying: false,
          type: 'setPlayingStatus'
        });
        console.log('pause event fires');
      });
      media.addEventListener('loadedmetadata', function () {
        playerDispatch({
          startTime: startTime,
          type: 'setStartTime'
        });
        player.node.currentTime = startTime || 0;
      });
      setMEJSPlayer(player);
    };

    var _error = function error(media) {
      console.log('Error loading');
    };

    var handleEnded = function handleEnded(player) {
      if (hasNextSection({
        canvasIndex: canvasIndex,
        manifest: manifest
      })) {
        manifestDispatch({
          canvasIndex: canvasIndex + 1,
          type: 'switchCanvas'
        });
        var newInstance = switchMedia(player, canvasIndex + 1, isPlaying || true, captionOn, manifest);
        playerDispatch({
          player: newInstance,
          type: 'updatePlayer'
        });
        setCIndex(cIndex + 1);
      }
    };

    React.useEffect(function () {
      var _global = global,
          MediaElementPlayer = _global.MediaElementPlayer;

      if (!MediaElementPlayer) {
        return;
      }
      /**
       * Create the configuration object for MediaElement.js player
       */


      var meConfigs = Object.assign({}, JSON.parse(options), {
        pluginPath: './static/media/',
        success: function success(media, node, instance) {
          return _success(media, node, instance);
        },
        error: function error(media, node) {
          return _error();
        },
        features: ['playpause', 'current', 'progress', 'duration', 'volume', 'quality', mediaType === 'video' ? 'tracks' : '', 'fullscreen'],
        qualityText: 'Stream Quality',
        toggleCaptionsButtonWhenOnlyOne: true
      });
      window.Hls = hlsjs__default['default'];
      playerDispatch({
        player: new MediaElementPlayer(id, meConfigs),
        type: 'updatePlayer'
      });
    }, []);
    React.useEffect(function () {
      if (cIndex !== canvasIndex && isClicked) {
        var newInstance = switchMedia(meJSPlayer, canvasIndex, isPlaying || false, captionOn, manifest);
        playerDispatch({
          player: newInstance,
          type: 'updatePlayer'
        });
        setCIndex(canvasIndex);
      }
    }, [canvasIndex]); // Invoke the effect only when canvas changes

    var sourceTags = createSourceTags(JSON.parse(sources));
    var tracksTags = createTrackTags(JSON.parse(tracks));
    var mediaBody = "".concat(sourceTags.join('\n'), " ").concat(tracksTags.join('\n'));
    var mediaHtml = mediaType === 'video' ? "<video data-testid=\"video-element\" id=\"".concat(id, "\" width=\"").concat(width, "\" height=\"").concat(height, "\"").concat(poster ? " poster=".concat(poster) : '', "\n          ").concat(controls ? ' controls' : '').concat(preload ? " preload=\"".concat(preload, "\"") : '', ">\n        ").concat(mediaBody, "\n      </video>") : "<audio data-testid=\"audio-element\" id=\"".concat(id, "\" width=\"").concat(width, "\" ").concat(controls ? ' controls' : '').concat(preload ? " preload=\"".concat(preload, "\"") : '', ">\n        ").concat(mediaBody, "\n      </audio>");
    return /*#__PURE__*/React__default['default'].createElement("div", {
      dangerouslySetInnerHTML: {
        __html: mediaHtml
      }
    });
  };

  MediaElement.propTypes = {
    crossorigin: propTypes.string,
    height: propTypes.number,
    id: propTypes.string,
    mediaType: propTypes.string,
    options: propTypes.string,
    poster: propTypes.string,
    preload: propTypes.string,
    sources: propTypes.string,
    tracks: propTypes.string,
    width: propTypes.number
  };

  var ErrorMessage = function ErrorMessage(_ref) {
    var _ref$message = _ref.message,
        message = _ref$message === void 0 ? 'You forgot to include an error message' : _ref$message;
    return /*#__PURE__*/React__default['default'].createElement("div", {
      className: "rimp__"
    }, "ERROR: ", message);
  };

  ErrorMessage.propTypes = {
    message: propTypes.string.isRequired
  };

  var MediaPlayer = function MediaPlayer() {
    var manifestState = useManifestState();

    var _useState = React.useState(false),
        _useState2 = slicedToArray(_useState, 2),
        ready = _useState2[0],
        setReady = _useState2[1];

    var _useState3 = React.useState([]),
        _useState4 = slicedToArray(_useState3, 2),
        sources = _useState4[0],
        setSources = _useState4[1];

    var _useState5 = React.useState([]),
        _useState6 = slicedToArray(_useState5, 2),
        tracks = _useState6[0],
        setTracks = _useState6[1];

    var _useState7 = React.useState('audio'),
        _useState8 = slicedToArray(_useState7, 2),
        mediaType = _useState8[0],
        setMediaType = _useState8[1];

    var _useState9 = React.useState(),
        _useState10 = slicedToArray(_useState9, 2),
        startTime = _useState10[0],
        setStartTime = _useState10[1];

    var _useState11 = React.useState(null),
        _useState12 = slicedToArray(_useState11, 2),
        error = _useState12[0],
        setError = _useState12[1];

    var canvasIndex = manifestState.canvasIndex,
        manifest = manifestState.manifest;
    React.useEffect(function () {
      if (manifest) {
        var _getMediaInfo = getMediaInfo({
          manifest: manifest,
          canvasIndex: canvasIndex
        }),
            _sources = _getMediaInfo.sources,
            _mediaType = _getMediaInfo.mediaType,
            _error = _getMediaInfo.error;

        setTracks(getTracks({
          manifest: manifest
        }));
        setSources(_sources);
        setMediaType(_mediaType);
        setError(_error);
        setStartTime(manifest.start ? getStartTime(manifest) : null);
        _error ? setReady(false) : setReady(true);
      }
    }, [manifest]); // Re-run the effect when manifest changes

    if (error) {
      return /*#__PURE__*/React__default['default'].createElement(ErrorMessage, {
        message: error
      });
    }

    return ready ? /*#__PURE__*/React__default['default'].createElement("div", {
      "data-testid": "media-player",
      id: "media-player"
    }, /*#__PURE__*/React__default['default'].createElement(MediaElement, {
      controls: true,
      crossorigin: "anonymous",
      height: manifest.height || 360,
      id: "avln-mediaelement-component",
      mediaType: mediaType,
      options: JSON.stringify({}),
      poster: "",
      preload: "auto",
      sources: JSON.stringify(sources),
      tracks: JSON.stringify(tracks),
      width: manifest.width || 480,
      startTime: startTime
    })) : null;
  };

  MediaPlayer.propTypes = {};

  var ListItem = function ListItem(_ref) {
    var item = _ref.item,
        isChild = _ref.isChild;
    var dispatch = usePlayerDispatch();
    var manifestState = useManifestState();
    var childCanvases = getChildCanvases({
      rangeId: item.id,
      manifest: manifestState.manifest
    });
    var subMenu = item.items && item.items.length > 0 && childCanvases.length === 0 ? /*#__PURE__*/React__default['default'].createElement(List, {
      items: item.items,
      isChild: true
    }) : null;

    var handleClick = function handleClick(e) {
      e.stopPropagation();
      e.preventDefault();
      dispatch({
        clickedUrl: e.target.href,
        type: 'navClick'
      });
    };

    var renderListItem = function renderListItem() {
      var label = getLabelValue(item.label);

      if (childCanvases.length > 0) {
        return childCanvases.map(function (canvasId) {
          return /*#__PURE__*/React__default['default'].createElement("a", {
            key: canvasId,
            href: canvasId,
            onClick: handleClick
          }, label);
        });
      }

      if (isChild) {
        return label;
      }

      return null;
    };

    return /*#__PURE__*/React__default['default'].createElement("li", {
      "data-testid": "list-item",
      className: "irmp--structured-nav__list-item"
    }, renderListItem(), subMenu);
  };

  ListItem.propTypes = {
    item: propTypes.object.isRequired,
    isChild: propTypes.bool
  };

  var List = function List(props) {
    var manifestState = useManifestState();

    if (!manifestState.manifest) {
      return /*#__PURE__*/React__default['default'].createElement("p", null, "No manifest in List yet");
    }

    var collapsibleContent = /*#__PURE__*/React__default['default'].createElement("ul", {
      "data-testid": "list",
      className: "irmp--structured-nav__list"
    }, props.items.map(function (item) {
      var filteredItem = filterVisibleRangeItem({
        item: item,
        manifest: manifestState.manifest
      });

      if (filteredItem) {
        return /*#__PURE__*/React__default['default'].createElement(ListItem, {
          key: filteredItem.id,
          item: filteredItem,
          isChild: props.isChild
        });
      } else {
        return /*#__PURE__*/React__default['default'].createElement(List, {
          items: item.items,
          isChild: true
        });
      }
    }));
    return /*#__PURE__*/React__default['default'].createElement(React__default['default'].Fragment, null, collapsibleContent);
  };

  List.propTypes = {
    items: propTypes.array.isRequired,
    isChild: propTypes.bool.isRequired
  };

  var StructuredNavigation = function StructuredNavigation(props) {
    var manifestDispatch = useManifestDispatch();
    var manifestState = useManifestState();
    var playerDispatch = usePlayerDispatch();

    var _usePlayerState = usePlayerState(),
        isClicked = _usePlayerState.isClicked,
        clickedUrl = _usePlayerState.clickedUrl,
        player = _usePlayerState.player;

    var canvasId = manifestState.canvasId,
        manifest = manifestState.manifest;
    React.useEffect(function () {
      if (isClicked) {
        var canvases = canvasesInManifest(manifest);
        var canvasInManifest = canvases.find(function (c) {
          return getCanvasId(clickedUrl) === c.canvasId.split('/').reverse()[0];
        });
        var currentCanvasIndex = canvases.indexOf(canvasInManifest);
        var timeFragment = getMediaFragment(clickedUrl); // Invalid time fragment

        if (!timeFragment) {
          console.error('Error retrieving time fragment object from Canvas URL in structured navigation');
        } // When clicked structure item is not in the current canvas


        if (manifestState.canvasIndex != currentCanvasIndex) {
          manifestDispatch({
            canvasIndex: currentCanvasIndex,
            type: 'switchCanvas'
          });
          playerDispatch({
            startTime: timeFragment.start,
            type: 'setStartTime'
          });
        } else {
          // Set the playhead at the start of the time fragment
          if (player) {
            player.setCurrentTime(timeFragment.start, playerDispatch({
              type: 'resetClick'
            }));
          }
        }
      }
    });

    if (!manifest) {
      return /*#__PURE__*/React__default['default'].createElement("p", null, "No manifest - put a better UI message here");
    }

    if (manifest.structures) {
      return /*#__PURE__*/React__default['default'].createElement("div", {
        "data-testid": "structured-nav",
        className: "structured-nav",
        key: Math.random()
      }, manifest.structures[0] && manifest.structures[0].items ? manifest.structures[0].items.map(function (item, index) {
        return /*#__PURE__*/React__default['default'].createElement(List, {
          items: [item],
          key: index,
          isChild: false
        });
      }) : null);
    }

    return /*#__PURE__*/React__default['default'].createElement("p", null, "There are no structures in the manifest.");
  };

  StructuredNavigation.propTypes = {};

  function IIIFPlayerWrapper(_ref) {
    var manifestUrl = _ref.manifestUrl,
        children = _ref.children,
        manifestValue = _ref.manifest;

    var _useState = React.useState(manifestValue),
        _useState2 = slicedToArray(_useState, 2),
        manifest = _useState2[0],
        setManifest = _useState2[1];

    var dispatch = useManifestDispatch();
    React.useEffect(function () {
      if (manifest) {
        dispatch({
          manifest: manifest,
          type: 'updateManifest'
        });
      } else {
        fetch(manifestUrl).then(function (result) {
          return result.json();
        }).then(function (data) {
          console.log('fetch result manifest', data);
          setManifest(data);
          dispatch({
            manifest: data,
            type: 'updateManifest'
          });
        });
      }
    }, []);
    if (!manifest) return /*#__PURE__*/React__default['default'].createElement("p", null, "...Loading");
    return /*#__PURE__*/React__default['default'].createElement("section", {
      className: "iiif-player"
    }, children);
  }
  IIIFPlayerWrapper.propTypes = {
    manifest: propTypes.object,
    manifestUrl: propTypes.string,
    children: propTypes.node
  };

  function IIIFPlayer(_ref) {
    var manifestUrl = _ref.manifestUrl,
        manifest = _ref.manifest,
        children = _ref.children;
    if (!manifestUrl && !manifest) return /*#__PURE__*/React__default['default'].createElement("p", null, "Please provide a manifest or manifestUrl.");
    return /*#__PURE__*/React__default['default'].createElement(ManifestProvider, null, /*#__PURE__*/React__default['default'].createElement(PlayerProvider, null, /*#__PURE__*/React__default['default'].createElement(IIIFPlayerWrapper, {
      manifestUrl: manifestUrl,
      manifest: manifest
    }, children)));
  }
  IIIFPlayer.propTypes = {
    /** A valid IIIF manifest uri */
    manifestUrl: propTypes.string
  };
  IIIFPlayer.defaultProps = {};

  exports.IIIFPlayer = IIIFPlayer;
  exports.MediaPlayer = MediaPlayer;
  exports.StructuredNavigation = StructuredNavigation;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
