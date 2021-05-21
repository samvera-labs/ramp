'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var videojs = require('video.js');
var manifesto_js = require('manifesto.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var videojs__default = /*#__PURE__*/_interopDefaultLegacy(videojs);

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
  canvasIndex: 0,
  currentNavItem: null
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

    case 'switchItem':
      {
        return _objectSpread(_objectSpread({}, state), {}, {
          currentNavItem: action.item
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
  startTime: null,
  endTime: null,
  isEnded: false,
  currentTime: null
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

    case 'setTimeFragment':
      {
        return _objectSpread$1(_objectSpread$1({}, state), {}, {
          startTime: parseInt(action.startTime),
          endTime: parseInt(action.endTime)
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

    case 'setIsEnded':
      {
        return _objectSpread$1(_objectSpread$1({}, state), {}, {
          isEnded: action.isEnded
        });
      }

    case 'setCurrentTime':
      {
        return _objectSpread$1(_objectSpread$1({}, state), {}, {
          currentTime: action.currentTime
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

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

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

var _extends_1 = createCommonjsModule(function (module) {
function _extends() {
  module.exports = _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

module.exports = _extends;
});

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var objectWithoutPropertiesLoose = _objectWithoutPropertiesLoose;

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = objectWithoutPropertiesLoose(source, excluded);
  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

var objectWithoutProperties = _objectWithoutProperties;

var videojsMarkersPlugin = createCommonjsModule(function (module, exports) {
(function (global, factory) {
  {
    factory(videojs__default['default']);
  }
})(commonjsGlobal, function (_video) {

  var _video2 = _interopRequireDefault(_video);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  // default setting
  var defaultSetting = {
    markerStyle: {
      'width': '7px',
      'border-radius': '30%',
      'background-color': 'red'
    },
    markerTip: {
      display: true,
      text: function text(marker) {
        return "Break: " + marker.text;
      },
      time: function time(marker) {
        return marker.time;
      }
    },
    breakOverlay: {
      display: false,
      displayTime: 3,
      text: function text(marker) {
        return "Break overlay: " + marker.overlayText;
      },
      style: {
        'width': '100%',
        'height': '20%',
        'background-color': 'rgba(0,0,0,0.7)',
        'color': 'white',
        'font-size': '17px'
      }
    },
    onMarkerClick: function onMarkerClick(marker) {},
    onMarkerReached: function onMarkerReached(marker, index) {},
    markers: []
  };

  // create a non-colliding random number
  function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
    });
    return uuid;
  }
  /**
   * Returns the size of an element and its position
   * a default Object with 0 on each of its properties
   * its return in case there's an error
   * @param  {Element} element  el to get the size and position
   * @return {DOMRect|Object}   size and position of an element
   */
  function getElementBounding(element) {
    var elementBounding;
    var defaultBoundingRect = {
      top: 0,
      bottom: 0,
      left: 0,
      width: 0,
      height: 0,
      right: 0
    };

    try {
      elementBounding = element.getBoundingClientRect();
    } catch (e) {
      elementBounding = defaultBoundingRect;
    }

    return elementBounding;
  }

  var NULL_INDEX = -1;

  function registerVideoJsMarkersPlugin(options) {
    // copied from video.js/src/js/utils/merge-options.js since
    // videojs 4 doens't support it by defualt.
    if (!_video2.default.mergeOptions) {
      var isPlain = function isPlain(value) {
        return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && toString.call(value) === '[object Object]' && value.constructor === Object;
      };

      var mergeOptions = function mergeOptions(source1, source2) {

        var result = {};
        var sources = [source1, source2];
        sources.forEach(function (source) {
          if (!source) {
            return;
          }
          Object.keys(source).forEach(function (key) {
            var value = source[key];
            if (!isPlain(value)) {
              result[key] = value;
              return;
            }
            if (!isPlain(result[key])) {
              result[key] = {};
            }
            result[key] = mergeOptions(result[key], value);
          });
        });
        return result;
      };

      _video2.default.mergeOptions = mergeOptions;
    }

    if (!_video2.default.dom.createEl) {
      _video2.default.dom.createEl = function (tagName, props, attrs) {
        var el = _video2.default.Player.prototype.dom.createEl(tagName, props);
        if (!!attrs) {
          Object.keys(attrs).forEach(function (key) {
            el.setAttribute(key, attrs[key]);
          });
        }
        return el;
      };
    }

    /**
     * register the markers plugin (dependent on jquery)
     */
    var setting = _video2.default.mergeOptions(defaultSetting, options),
        markersMap = {},
        markersList = [],
        // list of markers sorted by time
    currentMarkerIndex = NULL_INDEX,
        player = this,
        markerTip = null,
        breakOverlay = null,
        overlayIndex = NULL_INDEX;

    function sortMarkersList() {
      // sort the list by time in asc order
      markersList.sort(function (a, b) {
        return setting.markerTip.time(a) - setting.markerTip.time(b);
      });
    }

    function addMarkers(newMarkers) {
      newMarkers.forEach(function (marker) {
        marker.key = generateUUID();

        player.el().querySelector('.vjs-progress-holder').appendChild(createMarkerDiv(marker));

        // store marker in an internal hash map
        markersMap[marker.key] = marker;
        markersList.push(marker);
      });

      sortMarkersList();
    }

    function getPosition(marker) {
      return setting.markerTip.time(marker) / player.duration() * 100;
    }

    function setMarkderDivStyle(marker, markerDiv) {
      markerDiv.className = 'vjs-marker ' + (marker.class || "");

      Object.keys(setting.markerStyle).forEach(function (key) {
        markerDiv.style[key] = setting.markerStyle[key];
      });

      // hide out-of-bound markers
      var ratio = marker.time / player.duration();
      if (ratio < 0 || ratio > 1) {
        markerDiv.style.display = 'none';
      }

      // set position
      markerDiv.style.left = getPosition(marker) + '%';
      if (marker.duration) {
        markerDiv.style.width = marker.duration / player.duration() * 100 + '%';
        markerDiv.style.marginLeft = '0px';
      } else {
        var markerDivBounding = getElementBounding(markerDiv);
        markerDiv.style.marginLeft = markerDivBounding.width / 2 + 'px';
      }
    }

    function createMarkerDiv(marker) {

      var markerDiv = _video2.default.dom.createEl('div', {}, {
        'data-marker-key': marker.key,
        'data-marker-time': setting.markerTip.time(marker)
      });

      setMarkderDivStyle(marker, markerDiv);

      // bind click event to seek to marker time
      markerDiv.addEventListener('click', function (e) {
        var preventDefault = false;
        if (typeof setting.onMarkerClick === "function") {
          // if return false, prevent default behavior
          preventDefault = setting.onMarkerClick(marker) === false;
        }

        if (!preventDefault) {
          var key = this.getAttribute('data-marker-key');
          player.currentTime(setting.markerTip.time(markersMap[key]));
        }
      });

      if (setting.markerTip.display) {
        registerMarkerTipHandler(markerDiv);
      }

      return markerDiv;
    }

    function updateMarkers(force) {
      // update UI for markers whose time changed
      markersList.forEach(function (marker) {
        var markerDiv = player.el().querySelector(".vjs-marker[data-marker-key='" + marker.key + "']");
        var markerTime = setting.markerTip.time(marker);

        if (force || markerDiv.getAttribute('data-marker-time') !== markerTime) {
          setMarkderDivStyle(marker, markerDiv);
          markerDiv.setAttribute('data-marker-time', markerTime);
        }
      });
      sortMarkersList();
    }

    function removeMarkers(indexArray) {
      // reset overlay
      if (!!breakOverlay) {
        overlayIndex = NULL_INDEX;
        breakOverlay.style.visibility = "hidden";
      }
      currentMarkerIndex = NULL_INDEX;

      var deleteIndexList = [];
      indexArray.forEach(function (index) {
        var marker = markersList[index];
        if (marker) {
          // delete from memory
          delete markersMap[marker.key];
          deleteIndexList.push(index);

          // delete from dom
          var el = player.el().querySelector(".vjs-marker[data-marker-key='" + marker.key + "']");
          el && el.parentNode.removeChild(el);
        }
      });

      // clean up markers array
      deleteIndexList.reverse();
      deleteIndexList.forEach(function (deleteIndex) {
        markersList.splice(deleteIndex, 1);
      });

      // sort again
      sortMarkersList();
    }

    // attach hover event handler
    function registerMarkerTipHandler(markerDiv) {
      markerDiv.addEventListener('mouseover', function () {
        var marker = markersMap[markerDiv.getAttribute('data-marker-key')];
        if (!!markerTip) {
          if (setting.markerTip.html) {
            markerTip.querySelector('.vjs-tip-inner').innerHTML = setting.markerTip.html(marker);
          } else {
            markerTip.querySelector('.vjs-tip-inner').innerText = setting.markerTip.text(marker);
          }
          // margin-left needs to minus the padding length to align correctly with the marker
          markerTip.style.left = getPosition(marker) + '%';
          var markerTipBounding = getElementBounding(markerTip);
          var markerDivBounding = getElementBounding(markerDiv);
          markerTip.style.marginLeft = -parseFloat(markerTipBounding.width / 2) + parseFloat(markerDivBounding.width / 4) + 'px';
          markerTip.style.visibility = 'visible';
        }
      });

      markerDiv.addEventListener('mouseout', function () {
        if (!!markerTip) {
          markerTip.style.visibility = "hidden";
        }
      });
    }

    function initializeMarkerTip() {
      markerTip = _video2.default.dom.createEl('div', {
        className: 'vjs-tip',
        innerHTML: "<div class='vjs-tip-arrow'></div><div class='vjs-tip-inner'></div>"
      });
      player.el().querySelector('.vjs-progress-holder').appendChild(markerTip);
    }

    // show or hide break overlays
    function updateBreakOverlay() {
      if (!setting.breakOverlay.display || currentMarkerIndex < 0) {
        return;
      }

      var currentTime = player.currentTime();
      var marker = markersList[currentMarkerIndex];
      var markerTime = setting.markerTip.time(marker);

      if (currentTime >= markerTime && currentTime <= markerTime + setting.breakOverlay.displayTime) {
        if (overlayIndex !== currentMarkerIndex) {
          overlayIndex = currentMarkerIndex;
          if (breakOverlay) {
            breakOverlay.querySelector('.vjs-break-overlay-text').innerHTML = setting.breakOverlay.text(marker);
          }
        }

        if (breakOverlay) {
          breakOverlay.style.visibility = "visible";
        }
      } else {
        overlayIndex = NULL_INDEX;
        if (breakOverlay) {
          breakOverlay.style.visibility = "hidden";
        }
      }
    }

    // problem when the next marker is within the overlay display time from the previous marker
    function initializeOverlay() {
      breakOverlay = _video2.default.dom.createEl('div', {
        className: 'vjs-break-overlay',
        innerHTML: "<div class='vjs-break-overlay-text'></div>"
      });
      Object.keys(setting.breakOverlay.style).forEach(function (key) {
        if (breakOverlay) {
          breakOverlay.style[key] = setting.breakOverlay.style[key];
        }
      });
      player.el().appendChild(breakOverlay);
      overlayIndex = NULL_INDEX;
    }

    function onTimeUpdate() {
      onUpdateMarker();
      updateBreakOverlay();
      options.onTimeUpdateAfterMarkerUpdate && options.onTimeUpdateAfterMarkerUpdate();
    }

    function onUpdateMarker() {
      /*
        check marker reached in between markers
        the logic here is that it triggers a new marker reached event only if the player
        enters a new marker range (e.g. from marker 1 to marker 2). Thus, if player is on marker 1 and user clicked on marker 1 again, no new reached event is triggered)
      */
      if (!markersList.length) {
        return;
      }

      var getNextMarkerTime = function getNextMarkerTime(index) {
        if (index < markersList.length - 1) {
          return setting.markerTip.time(markersList[index + 1]);
        }
        // next marker time of last marker would be end of video time
        return player.duration();
      };
      var currentTime = player.currentTime();
      var newMarkerIndex = NULL_INDEX;

      if (currentMarkerIndex !== NULL_INDEX) {
        // check if staying at same marker
        var nextMarkerTime = getNextMarkerTime(currentMarkerIndex);
        if (currentTime >= setting.markerTip.time(markersList[currentMarkerIndex]) && currentTime < nextMarkerTime) {
          return;
        }

        // check for ending (at the end current time equals player duration)
        if (currentMarkerIndex === markersList.length - 1 && currentTime === player.duration()) {
          return;
        }
      }

      // check first marker, no marker is selected
      if (currentTime < setting.markerTip.time(markersList[0])) {
        newMarkerIndex = NULL_INDEX;
      } else {
        // look for new index
        for (var i = 0; i < markersList.length; i++) {
          nextMarkerTime = getNextMarkerTime(i);
          if (currentTime >= setting.markerTip.time(markersList[i]) && currentTime < nextMarkerTime) {
            newMarkerIndex = i;
            break;
          }
        }
      }

      // set new marker index
      if (newMarkerIndex !== currentMarkerIndex) {
        // trigger event if index is not null
        if (newMarkerIndex !== NULL_INDEX && options.onMarkerReached) {
          options.onMarkerReached(markersList[newMarkerIndex], newMarkerIndex);
        }
        currentMarkerIndex = newMarkerIndex;
      }
    }

    // setup the whole thing
    function initialize() {
      if (setting.markerTip.display) {
        initializeMarkerTip();
      }

      // remove existing markers if already initialized
      player.markers.removeAll();
      addMarkers(setting.markers);

      if (setting.breakOverlay.display) {
        initializeOverlay();
      }
      onTimeUpdate();
      player.on("timeupdate", onTimeUpdate);
      player.off("loadedmetadata");
    }

    // setup the plugin after we loaded video's meta data
    player.on("loadedmetadata", function () {
      initialize();
    });

    // exposed plugin API
    player.markers = {
      getMarkers: function getMarkers() {
        return markersList;
      },
      next: function next() {
        // go to the next marker from current timestamp
        var currentTime = player.currentTime();
        for (var i = 0; i < markersList.length; i++) {
          var markerTime = setting.markerTip.time(markersList[i]);
          if (markerTime > currentTime) {
            player.currentTime(markerTime);
            break;
          }
        }
      },
      prev: function prev() {
        // go to previous marker
        var currentTime = player.currentTime();
        for (var i = markersList.length - 1; i >= 0; i--) {
          var markerTime = setting.markerTip.time(markersList[i]);
          // add a threshold
          if (markerTime + 0.5 < currentTime) {
            player.currentTime(markerTime);
            return;
          }
        }
      },
      add: function add(newMarkers) {
        // add new markers given an array of index
        addMarkers(newMarkers);
      },
      remove: function remove(indexArray) {
        // remove markers given an array of index
        removeMarkers(indexArray);
      },
      removeAll: function removeAll() {
        var indexArray = [];
        for (var i = 0; i < markersList.length; i++) {
          indexArray.push(i);
        }
        removeMarkers(indexArray);
      },
      // force - force all markers to be updated, regardless of if they have changed or not.
      updateTime: function updateTime(force) {
        // notify the plugin to update the UI for changes in marker times
        updateMarkers(force);
      },
      reset: function reset(newMarkers) {
        // remove all the existing markers and add new ones
        player.markers.removeAll();
        addMarkers(newMarkers);
      },
      destroy: function destroy() {
        // unregister the plugins and clean up even handlers
        player.markers.removeAll();
        breakOverlay && breakOverlay.remove();
        markerTip && markerTip.remove();
        player.off("timeupdate", updateBreakOverlay);
        delete player.markers;
      }
    };
  }

  _video2.default.registerPlugin('markers', registerVideoJsMarkersPlugin);
});

});

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

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
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
  var choiceItems,
      sources = [],
      tracks = [];
  var isSelected = false;

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
      choiceItems.map(function (item) {
        var rType = item.getType();

        if (rType == 'text') {
          var track = {
            src: item.id,
            kind: item.getFormat(),
            label: item.getLabel()[0] ? item.getLabel()[0].value : '',
            srclang: item.getProperty('language')
          };
          tracks.push(track);
        } else {
          var source = {
            src: item.id,
            // TODO: make type more generic, possibly use mime-db
            type: item.getFormat() ? item.getFormat() : 'application/x-mpegurl',
            label: item.getLabel()[0] ? item.getLabel()[0].value : 'auto'
          };
          sources.push(source);
        }
      }); // Mark source with quality label 'auto' as selected source

      var _iterator = _createForOfIteratorHelper(sources),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var s = _step.value;

          if (s.label == 'auto' && !isSelected) {
            isSelected = true;
            s.selected = true;
          }
        } // Mark first source as selected when 'auto' quality is not present

      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (!isSelected) {
        sources[0].selected = true;
      }

      var allTypes = choiceItems.map(function (item) {
        return item.getType();
      });
      var uniqueTypes = allTypes.filter(function (t, index) {
        return allTypes.indexOf(t) === index;
      }); // Default type if there are different types

      var mediaType = uniqueTypes.length === 1 ? uniqueTypes[0] : 'video';
      return {
        sources: sources,
        tracks: tracks,
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
 * Determine there is a next section to play when the current section ends
 * @param { Object } obj
 * @param { Number } obj.canvasIndex index of the canvas in manifest
 * @param { Object } obj.manifest
 * @return {Boolean}
 */

function hasNextSection(_ref4) {
  var canvasIndex = _ref4.canvasIndex,
      manifest = _ref4.manifest;
  var canvasIDs = manifesto_js.parseManifest(manifest).getSequences()[0].getCanvases().map(function (canvas) {
    return canvas.id;
  });
  return canvasIDs.length - 1 > canvasIndex ? true : false;
}
/**
 * Retrieve the next item in the structure to be played when advancing from
 * canvas to next when media ends playing
 * @param {Object} obj
 * @param {Number} obj.canvasIndex index of the current canvas in manifets
 * @param {Object} obj.manifest
 * @return {Object} next item in the structure
 */

function getNextItem(_ref5) {
  var canvasIndex = _ref5.canvasIndex,
      manifest = _ref5.manifest;

  if (hasNextSection({
    canvasIndex: canvasIndex,
    manifest: manifest
  }) && manifest.structures) {
    var nextSection = manifest.structures[0].items[canvasIndex + 1];

    if (nextSection.items) {
      return nextSection.items[0];
    }
  }

  return null;
}
/**
 * Get the id (url with the media fragment) from a given item
 * @param {Object} item an item in the structure
 */

function getItemId(item) {
  if (item['items']) {
    return item['items'][0]['id'];
  }
}
/**
 * Get the all the media fragments in the current canvas's structure
 * @param {Object} obj
 * @param {Object} obj.manifest
 * @param {Number} obj.canvasIndex
 * @returns {Array} array of media fragments in a given section
 */

function getSegmentMap(_ref6) {
  var manifest = _ref6.manifest,
      canvasIndex = _ref6.canvasIndex;

  if (!manifest.structures) {
    return [];
  }

  var section = manifest.structures[0]['items'][canvasIndex];
  var segments = [];

  var getSegments = function getSegments(item) {
    var childCanvases = getChildCanvases({
      rangeId: item.id,
      manifest: manifest
    });

    if (childCanvases.length == 1) {
      segments.push(item);
      return;
    } else {
      var items = item['items'];

      var _iterator2 = _createForOfIteratorHelper(items),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var i = _step2.value;

          if (i['items']) {
            if (i['items'].length == 1 && i['items'][0]['type'] === 'Canvas') {
              segments.push(i);
            } else {
              getSegments(i);
            }
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  };

  getSegments(section);
  return segments;
}

function _createForOfIteratorHelper$1(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$2(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$2(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$2(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen); }

function _arrayLikeToArray$2(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

require('@silvermine/videojs-quality-selector')(videojs__default['default']);

function VideoJSPlayer(_ref) {
  var isVideo = _ref.isVideo,
      switchPlayer = _ref.switchPlayer,
      handleIsEnded = _ref.handleIsEnded,
      videoJSOptions = objectWithoutProperties(_ref, ["isVideo", "switchPlayer", "handleIsEnded"]);

  var playerState = usePlayerState();
  var playerDispatch = usePlayerDispatch();
  var manifestState = useManifestState();
  var manifestDispatch = useManifestDispatch();
  var manifest = manifestState.manifest,
      canvasIndex = manifestState.canvasIndex,
      currentNavItem = manifestState.currentNavItem;
  var isClicked = playerState.isClicked,
      isEnded = playerState.isEnded,
      isPlaying = playerState.isPlaying,
      player = playerState.player,
      startTime = playerState.startTime,
      currentTime = playerState.currentTime;

  var _React$useState = React__default['default'].useState(canvasIndex),
      _React$useState2 = slicedToArray(_React$useState, 2),
      cIndex = _React$useState2[0],
      setCIndex = _React$useState2[1];

  var _React$useState3 = React__default['default'].useState(false),
      _React$useState4 = slicedToArray(_React$useState3, 2),
      isReady = _React$useState4[0],
      setIsReady = _React$useState4[1];

  var _React$useState5 = React__default['default'].useState(null),
      _React$useState6 = slicedToArray(_React$useState5, 2),
      currentPlayer = _React$useState6[0],
      setCurrentPlayer = _React$useState6[1];

  var _React$useState7 = React__default['default'].useState(false),
      _React$useState8 = slicedToArray(_React$useState7, 2),
      mounted = _React$useState8[0],
      setMounted = _React$useState8[1];

  var _React$useState9 = React__default['default'].useState(false),
      _React$useState10 = slicedToArray(_React$useState9, 2),
      isContained = _React$useState10[0],
      setIsContained = _React$useState10[1];

  var _React$useState11 = React__default['default'].useState([]),
      _React$useState12 = slicedToArray(_React$useState11, 2),
      canvasSegments = _React$useState12[0],
      setCanvasSegments = _React$useState12[1];

  var _React$useState13 = React__default['default'].useState(''),
      _React$useState14 = slicedToArray(_React$useState13, 2),
      activeId = _React$useState14[0],
      setActiveId = _React$useState14[1];

  var playerRef = React__default['default'].useRef();
  var activeIdRef = React__default['default'].useRef();
  var isReadyRef = React__default['default'].useRef();
  activeIdRef.current = activeId;
  isReadyRef.current = isReady;
  /**
   * Initialize player when creating for the first time and cleanup
   * when unmounting after the player is being used
   */

  React__default['default'].useEffect(function () {
    var options = _objectSpread$2({}, videoJSOptions);

    setCIndex(canvasIndex);
    var newPlayer = videojs__default['default'](playerRef.current, options);
    /* Another way to add a component to the controlBar */
    // newPlayer.getChild('controlBar').addChild('vjsYo', {});

    setCurrentPlayer(newPlayer);
    setMounted(true);
    playerDispatch({
      player: newPlayer,
      type: 'updatePlayer'
    }); // Clean up player instance on component unmount

    return function () {
      if (newPlayer) {
        newPlayer.dispose();
        setMounted(false);
        setIsReady(false);
      }
    };
  }, []);
  /**
   * Attach markers to the player and bind VideoJS events
   * with player instance
   */

  React__default['default'].useEffect(function () {
    if (player && mounted) {
      player.on('ready', function () {
        console.log('ready'); // Initialize markers

        player.markers({
          markerTip: {
            display: true,
            text: function text(marker) {
              return marker.text;
            }
          },
          markerStyle: {
            opacity: '0.5',
            'background-color': '#80A590',
            'border-radius': 0,
            height: '16px',
            top: '-7px'
          },
          markers: []
        });
      });
      player.on('ended', function () {
        console.log('ended');
        playerDispatch({
          isEnded: true,
          type: 'setIsEnded'
        });
        handleEnded();
      });
      player.on('loadedmetadata', function () {
        console.log('loadedmetadata');

        if (isEnded || isPlaying) {
          player.play();
        }

        player.currentTime(currentTime); // Reset isEnded flag

        playerDispatch({
          isEnded: false,
          type: 'setIsEnded'
        });
        setIsReady(true);
      });
      player.on('pause', function () {
        console.log('pause');
        playerDispatch({
          isPlaying: false,
          type: 'setPlayingStatus'
        });
      });
      player.on('play', function () {
        console.log('play');
        playerDispatch({
          isPlaying: true,
          type: 'setPlayingStatus'
        });
      });
      player.on('seeked', function () {
        handleSeeked();
      });
      player.on('timeupdate', function () {
        handleTimeUpdate();
      });
    }
  }, [player]);
  /**
   * Switch canvas when using structure navigation / the media file ends
   */

  React__default['default'].useEffect(function () {
    if (isClicked && canvasIndex !== cIndex) {
      switchPlayer();
    }

    setCIndex(canvasIndex);
    setCanvasSegments(getSegmentMap({
      manifest: manifest,
      canvasIndex: canvasIndex
    }));
  }, [canvasIndex]);
  /**
   * Update markers whenever player's currentTime is being
   * updated. Time update happens when;
   * 1. using structure navigation
   * 2. seek and scrubbing events are fired
   * 3. timeupdate event fired when playing the media file
   */

  React__default['default'].useEffect(function () {
    if (!player || !currentPlayer) {
      return;
    }

    if (currentNavItem !== null && isReady) {
      // Mark current time fragment
      if (player.markers) {
        player.markers.removeAll(); // Use currentNavItem's start and end time for marker creation

        var _getMediaFragment = getMediaFragment(getItemId(currentNavItem)),
            start = _getMediaFragment.start,
            stop = _getMediaFragment.stop;

        playerDispatch({
          endTime: stop,
          startTime: start,
          type: 'setTimeFragment'
        });
        player.markers.add([{
          time: start,
          duration: stop - start,
          text: currentNavItem.label.en[0]
        }]);
      }
    } else if (startTime === null) {
      // When canvas gets loaded into the player, set the currentNavItem and startTime
      // if there's a media fragment starting from time 0.0.
      // This then triggers the creation of a fragment highlight in the player's timerail
      var firstItem = getSegmentMap({
        manifest: manifest,
        canvasIndex: canvasIndex
      })[0];
      var timeFragment = getMediaFragment(getItemId(firstItem));

      if (timeFragment && timeFragment.start === 0) {
        manifestDispatch({
          item: firstItem,
          type: 'switchItem'
        });
      }
    }
  }, [currentNavItem, isReady]);
  /**
   * Setting the current time of the player when using structure navigation
   */

  React__default['default'].useEffect(function () {
    if (player !== null && isReady) {
      player.currentTime(currentTime, playerDispatch({
        type: 'resetClick'
      }));
    }
  }, [isClicked]);
  /**
   * Remove existing timerail highlight if the player's currentTime
   * doesn't fall within a defined structure item
   */

  React__default['default'].useEffect(function () {
    if (!player || !currentPlayer) {
      return;
    } else if (isContained == false && player.markers) {
      player.markers.removeAll();
    }
  }, [isContained]);
  /**
   * Handle the 'seeked' event when player's scrubber or progress bar is
   * used to change the currentTime.
   */

  var handleSeeked = function handleSeeked() {
    if (player !== null && isReadyRef.current) {
      var seekedTime = player.currentTime();
      playerDispatch({
        currentTime: seekedTime,
        type: 'setCurrentTime'
      }); // Find the relevant media segment from the structure

      var isInStructure = getActiveSegment(seekedTime);

      if (isInStructure) {
        setIsContained(true);
        manifestDispatch({
          item: isInStructure,
          type: 'switchItem'
        });
      } else {
        setIsContained(false);
      }
    }
  };
  /**
   * Handle the 'ended' event fired by the player when a section comes to
   * an end. If there are sections ahead move onto the next canvas and
   * change the player and the state accordingly.
   */


  var handleEnded = function handleEnded() {
    if (hasNextSection({
      canvasIndex: canvasIndex,
      manifest: manifest
    })) {
      manifestDispatch({
        canvasIndex: canvasIndex + 1,
        type: 'switchCanvas'
      }); // Reset startTime and currentTime to zero

      playerDispatch({
        startTime: 0,
        type: 'setTimeFragment'
      });
      playerDispatch({
        currentTime: 0,
        type: 'setCurrentTime'
      }); // Update the current nav item to next item

      var nextItem = getNextItem({
        canvasIndex: canvasIndex,
        manifest: manifest
      });

      var _getMediaFragment2 = getMediaFragment(getItemId(nextItem)),
          start = _getMediaFragment2.start; // If there's a structure item at the start of the next canvas
      // mark it as the currentNavItem. Otherwise empty out the currentNavItem.


      if (start === 0) {
        setIsContained(true);
        manifestDispatch({
          item: nextItem,
          type: 'switchItem'
        });
      } else {
        manifestDispatch({
          item: null,
          type: 'switchItem'
        });
      }

      handleIsEnded();
      setCIndex(cIndex + 1);
    }
  };
  /**
   * Handle the 'timeUpdate' event emitted by VideoJS player.
   * The current time of the playhead used to show structure in the player's
   * time rail as the playhead arrives at a start time of an existing structure
   * item. When the current time is inside an item, that time fragment is highlighted
   * in the player's time rail.
   *  */


  var handleTimeUpdate = function handleTimeUpdate() {
    if (player !== null && isReadyRef.current) {
      var activeSegment = getActiveSegment(player.currentTime());

      if (activeSegment && activeIdRef.current != activeSegment['id']) {
        // Set the active segment id in component's state
        setActiveId(activeSegment['id']);
        setIsContained(true);
        manifestDispatch({
          item: activeSegment,
          type: 'switchItem'
        });
      } else if (activeSegment === null && player.markers) {
        setIsContained(false);
      }
    }
  };
  /**
   * Get the segment, which encapsulates the current time of the playhead,
   * from a list of media fragments in the current canvas.
   * @param {Number} time playhead's current time
   */


  var getActiveSegment = function getActiveSegment(time) {
    // Find the relevant media segment from the structure
    var _iterator = _createForOfIteratorHelper$1(canvasSegments),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var segment = _step.value;

        var _getMediaFragment3 = getMediaFragment(getItemId(segment)),
            start = _getMediaFragment3.start,
            stop = _getMediaFragment3.stop;

        if (time >= start && time < stop) {
          return segment;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return null;
  };

  return /*#__PURE__*/React__default['default'].createElement("div", {
    "data-vjs-player": true
  }, isVideo ? /*#__PURE__*/React__default['default'].createElement("video", {
    "data-testid": "videojs-video-element",
    ref: playerRef,
    className: "video-js"
  }) : /*#__PURE__*/React__default['default'].createElement("audio", {
    "data-testid": "videojs-audio-element",
    ref: playerRef,
    className: "video-js vjs-default-skin"
  }));
}

VideoJSPlayer.propTypes = {
  isVideo: propTypes.bool,
  switchPlayer: propTypes.func,
  handleIsEnded: propTypes.func,
  videoJSOptions: propTypes.object
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

function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var MediaPlayer = function MediaPlayer() {
  var manifestState = useManifestState();
  var playerState = usePlayerState();

  var _useState = React.useState({
    error: '',
    sourceType: '',
    sources: [],
    tracks: [],
    poster: null
  }),
      _useState2 = slicedToArray(_useState, 2),
      playerConfig = _useState2[0],
      setPlayerConfig = _useState2[1];

  var _useState3 = React.useState(false),
      _useState4 = slicedToArray(_useState3, 2),
      ready = _useState4[0],
      setReady = _useState4[1];

  var _useState5 = React.useState(canvasIndex),
      _useState6 = slicedToArray(_useState5, 2),
      cIndex = _useState6[0],
      setCIndex = _useState6[1];

  var canvasIndex = manifestState.canvasIndex,
      manifest = manifestState.manifest;
  var player = playerState.player;
  React.useEffect(function () {
    if (manifest) {
      initCanvas(canvasIndex);
    }
  }, [manifest, canvasIndex]); // Re-run the effect when manifest changes

  if (playerConfig.error) {
    return /*#__PURE__*/React__default['default'].createElement(ErrorMessage, {
      message: playerConfig.error
    });
  }

  var initCanvas = function initCanvas(canvasId) {
    var _getMediaInfo = getMediaInfo({
      manifest: manifest,
      canvasIndex: canvasId
    }),
        sources = _getMediaInfo.sources,
        tracks = _getMediaInfo.tracks,
        mediaType = _getMediaInfo.mediaType,
        error = _getMediaInfo.error;

    setPlayerConfig(_objectSpread$3(_objectSpread$3({}, playerConfig), {}, {
      error: error,
      sourceType: mediaType,
      sources: sources,
      tracks: tracks
    }));
    setCIndex(canvasId);
    error ? setReady(false) : setReady(true);
  }; // Switch player when navigating across canvases


  var switchPlayer = function switchPlayer() {
    initCanvas(canvasIndex);
  }; // Load next canvas in the list when current media ends


  var handleEnded = function handleEnded() {
    initCanvas(canvasIndex + 1);
  };

  var videoJsOptions = {
    aspectRatio: playerConfig.sourceType === 'audio' ? '1:0' : '16:9',
    autoplay: false,
    bigPlayButton: false,
    controls: true,
    fluid: true,
    controlBar: {
      // Define and order control bar controls
      // See https://docs.videojs.com/tutorial-components.html for options of what
      // seem to be supported controls
      children: ['playToggle', 'volumePanel', 'progressControl', 'remainingTimeDisplay', 'subsCapsButton', 'qualitySelector', 'pictureInPictureToggle' // 'vjsYo',             custom component
      ],
      // Options for controls
      volumePanel: {
        inline: false
      },
      fullscreenToggle: playerConfig.sourceType === 'audio' ? false : true
    },
    sources: playerConfig.sources,
    tracks: playerConfig.tracks
  };
  return ready ? /*#__PURE__*/React__default['default'].createElement("div", {
    "data-testid": "media-player",
    key: "media-player-".concat(cIndex)
  }, /*#__PURE__*/React__default['default'].createElement(VideoJSPlayer, _extends_1({
    isVideo: playerConfig.sourceType === 'video',
    switchPlayer: switchPlayer,
    handleIsEnded: handleEnded
  }, videoJsOptions))) : null;
};

MediaPlayer.propTypes = {};

var ListItem = function ListItem(_ref) {
  var item = _ref.item,
      isTitle = _ref.isTitle;
  var playerDispatch = usePlayerDispatch();
  var manifestDispatch = useManifestDispatch();

  var _useManifestState = useManifestState(),
      manifest = _useManifestState.manifest,
      currentNavItem = _useManifestState.currentNavItem;

  var childCanvases = getChildCanvases({
    rangeId: item.id,
    manifest: manifest
  });
  var subMenu = item.items && item.items.length > 0 && childCanvases.length === 0 ? /*#__PURE__*/React__default['default'].createElement(List, {
    items: item.items,
    isChild: true
  }) : null;
  var liRef = React.useRef(null);

  var handleClick = function handleClick(e) {
    e.stopPropagation();
    e.preventDefault();
    playerDispatch({
      clickedUrl: e.target.href,
      type: 'navClick'
    });
    manifestDispatch({
      item: item,
      type: 'switchItem'
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
    } // When an item is a section title, show it as plain text


    if (isTitle) {
      return /*#__PURE__*/React__default['default'].createElement("span", {
        className: "irmp--structured-nav__section-title"
      }, label);
    }

    return null;
  };

  React.useEffect(function () {
    if (currentNavItem == item) {
      liRef.current.className += ' active';
    }
  }, [currentNavItem]);

  if (item.label != '') {
    return /*#__PURE__*/React__default['default'].createElement("li", {
      "data-testid": "list-item",
      ref: liRef,
      className: "irmp--structured-nav__list-item"
    }, renderListItem(), subMenu);
  } else {
    return null;
  }
};

ListItem.propTypes = {
  item: propTypes.object.isRequired,
  isChild: propTypes.bool,
  isTitle: propTypes.bool
};

var List = function List(props) {
  var manifestState = useManifestState();

  if (!manifestState.manifest) {
    return /*#__PURE__*/React__default['default'].createElement("p", {
      "data-testid": "list-error"
    }, "No manifest in List yet");
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
      var childCanvases = getChildCanvases({
        rangeId: filteredItem.id,
        manifest: manifestState.manifest
      }); // Title items doesn't have children

      if (childCanvases.length == 0) {
        return /*#__PURE__*/React__default['default'].createElement(ListItem, {
          key: filteredItem.id,
          item: filteredItem,
          isChild: false,
          isTitle: true,
          titles: props.titles
        });
      }

      return /*#__PURE__*/React__default['default'].createElement(ListItem, {
        key: filteredItem.id,
        item: filteredItem,
        isChild: props.isChild,
        isTitle: false,
        titles: props.titles
      });
    } else {
      return /*#__PURE__*/React__default['default'].createElement(List, {
        items: item.items,
        isChild: true,
        titles: props.titles
      });
    }
  }));
  return /*#__PURE__*/React__default['default'].createElement(React__default['default'].Fragment, null, collapsibleContent);
};

List.propTypes = {
  items: propTypes.array.isRequired,
  isChild: propTypes.bool.isRequired
};

var StructuredNavigation = function StructuredNavigation() {
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

      if (!timeFragment || timeFragment == undefined) {
        console.error('Error retrieving time fragment object from Canvas URL in structured navigation');
        return;
      } // When clicked structure item is not in the current canvas


      if (manifestState.canvasIndex != currentCanvasIndex) {
        manifestDispatch({
          canvasIndex: currentCanvasIndex,
          type: 'switchCanvas'
        });
      }

      playerDispatch({
        startTime: timeFragment.start,
        endTime: timeFragment.stop,
        type: 'setTimeFragment'
      });
      playerDispatch({
        currentTime: timeFragment.start,
        type: 'setCurrentTime'
      });
    }
  }, [isClicked]);

  if (!manifest) {
    return /*#__PURE__*/React__default['default'].createElement("p", null, "No manifest - Please provide a valid manifest.");
  }

  if (manifest.structures) {
    return /*#__PURE__*/React__default['default'].createElement("div", {
      "data-testid": "structured-nav",
      className: "irmp--structured-nav",
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

exports.IIIFPlayer = IIIFPlayer;
exports.MediaPlayer = MediaPlayer;
exports.StructuredNavigation = StructuredNavigation;
