import React, { useState, useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'hls.js';
import ReactDOM from 'react-dom';
import { parseManifest } from 'manifesto.js';

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
var ManifestStateContext = /*#__PURE__*/React.createContext();
var ManifestDispatchContext = /*#__PURE__*/React.createContext();
/**
 * Definition of all state variables in this Context
 */

var defaultState = {
  manifest: null,
  canvasIndex: 0,
  currentNavItem: ''
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

  var _React$useReducer = React.useReducer(manifestReducer, initialState),
      _React$useReducer2 = slicedToArray(_React$useReducer, 2),
      state = _React$useReducer2[0],
      dispatch = _React$useReducer2[1];

  return /*#__PURE__*/React.createElement(ManifestStateContext.Provider, {
    value: state
  }, /*#__PURE__*/React.createElement(ManifestDispatchContext.Provider, {
    value: dispatch
  }, children));
}

function useManifestState() {
  var context = React.useContext(ManifestStateContext);

  if (context === undefined) {
    throw new Error('useManifestState must be used within a ManifestProvider');
  }

  return context;
}

function useManifestDispatch() {
  var context = React.useContext(ManifestDispatchContext);

  if (context === undefined) {
    throw new Error('useManifestDispatch must be used within a ManifestProvider');
  }

  return context;
}

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var PlayerStateContext = /*#__PURE__*/React.createContext();
var PlayerDispatchContext = /*#__PURE__*/React.createContext();
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
  isEnded: false
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

  var _React$useReducer = React.useReducer(PlayerReducer, initialState),
      _React$useReducer2 = slicedToArray(_React$useReducer, 2),
      state = _React$useReducer2[0],
      dispatch = _React$useReducer2[1];

  return /*#__PURE__*/React.createElement(PlayerStateContext.Provider, {
    value: state
  }, /*#__PURE__*/React.createElement(PlayerDispatchContext.Provider, {
    value: dispatch
  }, children));
}

function usePlayerState() {
  var context = React.useContext(PlayerStateContext);

  if (context === undefined) {
    throw new Error("usePlayerState must be used within the PlayerProvider");
  }

  return context;
}

function usePlayerDispatch() {
  var context = React.useContext(PlayerDispatchContext);

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

var videojsMarkersPlugin = createCommonjsModule(function (module, exports) {
(function (global, factory) {
  {
    factory(videojs);
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

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var classCallCheck = _classCallCheck;

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var createClass = _createClass;

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

var assertThisInitialized = _assertThisInitialized;

var setPrototypeOf = createCommonjsModule(function (module) {
function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;
});

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

var inherits = _inherits;

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

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof_1(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

var possibleConstructorReturn = _possibleConstructorReturn;

var getPrototypeOf = createCommonjsModule(function (module) {
function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;
});

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function Yo(_ref) {
  var vjsComponent = _ref.vjsComponent,
      handleClick = _ref.handleClick;
  return /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return handleClick('Ima message');
    }
  }, "yo click me");
}

var vjsComponent = videojs.getComponent('Component');

var vjsYo = /*#__PURE__*/function (_vjsComponent) {
  inherits(vjsYo, _vjsComponent);

  var _super = _createSuper(vjsYo);

  function vjsYo(player, options) {
    var _this;

    classCallCheck(this, vjsYo);

    _this = _super.call(this, player, options);
    _this.mount = _this.mount.bind(assertThisInitialized(_this));
    /* When player is ready, call method to mount React component */

    player.ready(function () {
      _this.mount();
    });
    /* Remove React root when component is destroyed */

    _this.on('dispose', function () {
      ReactDOM.unmountComponentAtNode(_this.el());
    });

    return _this;
  }

  createClass(vjsYo, [{
    key: "handleClick",
    value: function handleClick(msg) {
      console.log('handling click', msg);
    }
  }, {
    key: "mount",
    value: function mount() {
      ReactDOM.render( /*#__PURE__*/React.createElement(Yo, {
        vjsComponent: this,
        handleClick: this.handleClick
      }), this.el());
    }
  }]);

  return vjsYo;
}(vjsComponent);

vjsComponent.registerComponent('vjsYo', vjsYo);

/**
 * Get all the canvases in manifest
 * @function IIIFParser#canvasesInManifest
 * @return {Object} array of canvases in manifest
 **/

function canvasesInManifest(manifest) {
  var canvases = parseManifest(manifest).getSequences()[0].getCanvases().map(function (canvas) {
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
  var itemInManifest = parseManifest(manifest).getRangeById(item.id);

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
    rangeCanvases = parseManifest(manifest).getRangeById(rangeId).getCanvasIds();
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
    choiceItems = parseManifest(manifest).getSequences()[0].getCanvases()[canvasIndex].getContent()[0].getBody();
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
  var seeAlso = parseManifest(manifest).getSeeAlso();

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
  var canvasIDs = parseManifest(manifest).getSequences()[0].getCanvases().map(function (canvas) {
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

function getNextItem(_ref6) {
  var canvasIndex = _ref6.canvasIndex,
      manifest = _ref6.manifest;

  if (hasNextSection({
    canvasIndex: canvasIndex,
    manifest: manifest
  }) && manifest.structures) {
    var nextSection = manifest.structures[0].items[canvasIndex + 1];

    if (nextSection.items) {
      return nextSection.items[0];
    }

    return nextSection;
  }
}

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function VideoJSPlayer(_ref) {
  var isVideo = _ref.isVideo,
      switchPlayer = _ref.switchPlayer,
      handleIsEnded = _ref.handleIsEnded,
      videoJSOptions = objectWithoutProperties(_ref, ["isVideo", "switchPlayer", "handleIsEnded"]);

  var playerState = usePlayerState();
  var playerDispatch = usePlayerDispatch();
  var manifestState = useManifestState();
  var manifestDispatch = useManifestDispatch();

  var _React$useState = React.useState(canvasIndex),
      _React$useState2 = slicedToArray(_React$useState, 2),
      cIndex = _React$useState2[0],
      setCIndex = _React$useState2[1];

  var _React$useState3 = React.useState(false),
      _React$useState4 = slicedToArray(_React$useState3, 2),
      isReady = _React$useState4[0],
      setIsReady = _React$useState4[1];

  var _React$useState5 = React.useState(null),
      _React$useState6 = slicedToArray(_React$useState5, 2),
      currentPlayer = _React$useState6[0],
      setCurrentPlayer = _React$useState6[1];

  var playerRef = React.useRef();
  var manifest = manifestState.manifest,
      canvasIndex = manifestState.canvasIndex,
      currentNavItem = manifestState.currentNavItem;
  var isClicked = playerState.isClicked,
      isEnded = playerState.isEnded,
      isPlaying = playerState.isPlaying,
      player = playerState.player,
      startTime = playerState.startTime,
      endTime = playerState.endTime;
  React.useEffect(function () {
    var options = _objectSpread$2({}, videoJSOptions);

    setCIndex(canvasIndex);
    var newPlayer = videojs(playerRef.current, options);
    newPlayer.getChild('controlBar').addChild('vjsYo', {});
    setCurrentPlayer(newPlayer);
    playerDispatch({
      player: newPlayer,
      type: 'updatePlayer'
    }); // Clean up player instance on component unmount

    return function () {
      if (newPlayer) {
        newPlayer.dispose();
      }
    };
  }, []);
  React.useEffect(function () {
    if (player) {
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
        setIsReady(true);
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
        } // Reset isEnded flag


        playerDispatch({
          isEnded: false,
          type: 'setIsEnded'
        });
        setIsReady(false);
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
    }
  }, [player]);
  React.useEffect(function () {
    if (!player || !currentPlayer) {
      return;
    }

    if (startTime != null) {
      player.currentTime(startTime, playerDispatch({
        type: 'resetClick'
      })); // Mark current timefragment

      if (player.markers) {
        player.markers.removeAll();
        player.markers.add([{
          time: startTime,
          duration: endTime - startTime,
          text: currentNavItem.label.en[0]
        }]);
      }
    }
  }, [startTime, endTime, isClicked, isReady]);
  React.useEffect(function () {
    if (isClicked && canvasIndex !== cIndex) {
      switchPlayer();
    }

    setCIndex(canvasIndex);
  }, [canvasIndex]);

  var handleEnded = function handleEnded() {
    if (hasNextSection({
      canvasIndex: canvasIndex,
      manifest: manifest
    })) {
      manifestDispatch({
        canvasIndex: canvasIndex + 1,
        type: 'switchCanvas'
      }); // Reset startTime to zero

      playerDispatch({
        startTime: 0,
        type: 'setTimeFragment'
      }); // Update the current nav item to next item

      manifestDispatch({
        item: getNextItem({
          canvasIndex: canvasIndex,
          manifest: manifest
        }),
        type: 'switchItem'
      });
      handleIsEnded();
      setCIndex(cIndex + 1);
    }
  };

  return /*#__PURE__*/React.createElement("div", {
    "data-vjs-player": true
  }, isVideo ? /*#__PURE__*/React.createElement("video", {
    "data-testid": "video-element",
    ref: playerRef,
    className: "video-js"
  }) : /*#__PURE__*/React.createElement("audio", {
    "data-testid": "audio-element",
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
  return /*#__PURE__*/React.createElement("div", {
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

  var _useState = useState({
    error: '',
    sourceType: '',
    sources: [],
    tracks: []
  }),
      _useState2 = slicedToArray(_useState, 2),
      playerConfig = _useState2[0],
      setPlayerConfig = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = slicedToArray(_useState3, 2),
      ready = _useState4[0],
      setReady = _useState4[1];

  var _useState5 = useState(canvasIndex),
      _useState6 = slicedToArray(_useState5, 2),
      cIndex = _useState6[0],
      setCIndex = _useState6[1];

  var canvasIndex = manifestState.canvasIndex,
      manifest = manifestState.manifest;
  useEffect(function () {
    if (manifest) {
      initCanvas(canvasIndex);
    }
  }, [manifest, canvasIndex]); // Re-run the effect when manifest changes

  if (playerConfig.error) {
    return /*#__PURE__*/React.createElement(ErrorMessage, {
      message: playerConfig.error
    });
  }

  var initCanvas = function initCanvas(canvasId) {
    var _getMediaInfo = getMediaInfo({
      manifest: manifest,
      canvasIndex: canvasId
    }),
        sources = _getMediaInfo.sources,
        mediaType = _getMediaInfo.mediaType,
        error = _getMediaInfo.error;

    setPlayerConfig(_objectSpread$3(_objectSpread$3({}, playerConfig), {}, {
      error: error,
      sourceType: mediaType,
      sources: sources,
      tracks: getTracks({
        manifest: manifest
      })
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
    aspectRatio: playerConfig.sourceType === 'audio' ? '12:1' : '16:9',
    autoplay: false,
    bigPlayButton: false,
    controls: true,
    controlBar: {
      // Define and order control bar controls
      // See https://docs.videojs.com/tutorial-components.html for options of what
      // seem to be supported controls

      /**
       children: [
        'playToggle',
        'volumePanel',
        'progressControl',
        'remainingTimeDisplay',
        'fullscreenToggle',
      ],
      */
      // Options for controls
      volumePanel: {
        inline: false
      }
    },
    sources: playerConfig.sources,
    tracks: playerConfig.tracks.map(function (track) {
      return {
        src: track.id,
        kind: track.format,
        label: track.label
      };
    })
  };
  return ready ? /*#__PURE__*/React.createElement("div", {
    "data-testid": "media-player",
    key: "media-player-".concat(cIndex)
  }, /*#__PURE__*/React.createElement(VideoJSPlayer, _extends_1({
    isVideo: playerConfig.sourceType === 'video',
    switchPlayer: switchPlayer,
    handleIsEnded: handleEnded
  }, videoJsOptions))) : null;
};

MediaPlayer.propTypes = {};

var ListItem = function ListItem(_ref) {
  var item = _ref.item,
      isChild = _ref.isChild;
  var playerDispatch = usePlayerDispatch();
  var manifestDispatch = useManifestDispatch();

  var _useManifestState = useManifestState(),
      manifest = _useManifestState.manifest,
      currentNavItem = _useManifestState.currentNavItem;

  var childCanvases = getChildCanvases({
    rangeId: item.id,
    manifest: manifest
  });
  var subMenu = item.items && item.items.length > 0 && childCanvases.length === 0 ? /*#__PURE__*/React.createElement(List, {
    items: item.items,
    isChild: true
  }) : null;
  var liRef = useRef(null);

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
        return /*#__PURE__*/React.createElement("a", {
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

  useEffect(function () {
    if (currentNavItem == item) {
      liRef.current.className += ' active';
    }
  }, [currentNavItem]);
  return /*#__PURE__*/React.createElement("li", {
    "data-testid": "list-item",
    ref: liRef,
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
    return /*#__PURE__*/React.createElement("p", null, "No manifest in List yet");
  }

  var collapsibleContent = /*#__PURE__*/React.createElement("ul", {
    "data-testid": "list",
    className: "irmp--structured-nav__list"
  }, props.items.map(function (item) {
    var filteredItem = filterVisibleRangeItem({
      item: item,
      manifest: manifestState.manifest
    });

    if (filteredItem) {
      return /*#__PURE__*/React.createElement(ListItem, {
        key: filteredItem.id,
        item: filteredItem,
        isChild: props.isChild
      });
    } else {
      return /*#__PURE__*/React.createElement(List, {
        items: item.items,
        isChild: true
      });
    }
  }));
  return /*#__PURE__*/React.createElement(React.Fragment, null, collapsibleContent);
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
  useEffect(function () {
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
      }

      playerDispatch({
        startTime: timeFragment.start,
        endTime: timeFragment.stop,
        type: 'setTimeFragment'
      });
    }
  }, [isClicked]);

  if (!manifest) {
    return /*#__PURE__*/React.createElement("p", null, "No manifest - put a better UI message here");
  }

  if (manifest.structures) {
    return /*#__PURE__*/React.createElement("div", {
      "data-testid": "structured-nav",
      className: "structured-nav",
      key: Math.random()
    }, manifest.structures[0] && manifest.structures[0].items ? manifest.structures[0].items.map(function (item, index) {
      return /*#__PURE__*/React.createElement(List, {
        items: [item],
        key: index,
        isChild: false
      });
    }) : null);
  }

  return /*#__PURE__*/React.createElement("p", null, "There are no structures in the manifest.");
};

StructuredNavigation.propTypes = {};

function IIIFPlayerWrapper(_ref) {
  var manifestUrl = _ref.manifestUrl,
      children = _ref.children,
      manifestValue = _ref.manifest;

  var _useState = useState(manifestValue),
      _useState2 = slicedToArray(_useState, 2),
      manifest = _useState2[0],
      setManifest = _useState2[1];

  var dispatch = useManifestDispatch();
  useEffect(function () {
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
  if (!manifest) return /*#__PURE__*/React.createElement("p", null, "...Loading");
  return /*#__PURE__*/React.createElement("section", {
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
  if (!manifestUrl && !manifest) return /*#__PURE__*/React.createElement("p", null, "Please provide a manifest or manifestUrl.");
  return /*#__PURE__*/React.createElement(ManifestProvider, null, /*#__PURE__*/React.createElement(PlayerProvider, null, /*#__PURE__*/React.createElement(IIIFPlayerWrapper, {
    manifestUrl: manifestUrl,
    manifest: manifest
  }, children)));
}
IIIFPlayer.propTypes = {
  /** A valid IIIF manifest uri */
  manifestUrl: propTypes.string
};
IIIFPlayer.defaultProps = {};

export { IIIFPlayer, MediaPlayer, StructuredNavigation };
