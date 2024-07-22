import React, { useState, useEffect, useRef, useMemo, useContext, useCallback } from 'react';
import { parseManifest, AnnotationPage, Annotation, PropertyValue } from 'manifesto.js';
import mimeDb from 'mime-db';
import sanitizeHtml from 'sanitize-html';
import { useErrorBoundary, ErrorBoundary } from 'react-error-boundary';
import videojs from 'video.js';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import mammoth from 'mammoth';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
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

var arrayWithHoles = createCommonjsModule(function (module) {
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
module.exports = _arrayWithHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var iterableToArrayLimit = createCommonjsModule(function (module) {
function _iterableToArrayLimit(arr, i) {
  var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
  if (null != _i) {
    var _s,
      _e,
      _x,
      _r,
      _arr = [],
      _n = !0,
      _d = !1;
    try {
      if (_x = (_i = _i.call(arr)).next, 0 === i) {
        if (Object(_i) !== _i) return;
        _n = !1;
      } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
    } catch (err) {
      _d = !0, _e = err;
    } finally {
      try {
        if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return;
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
}
module.exports = _iterableToArrayLimit, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var arrayLikeToArray = createCommonjsModule(function (module) {
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var unsupportedIterableToArray = createCommonjsModule(function (module) {
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}
module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var nonIterableRest = createCommonjsModule(function (module) {
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableRest, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var slicedToArray = createCommonjsModule(function (module) {
function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}
module.exports = _slicedToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _slicedToArray = /*@__PURE__*/getDefaultExportFromCjs(slicedToArray);

var _typeof_1 = createCommonjsModule(function (module) {
function _typeof(obj) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(obj);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _typeof = /*@__PURE__*/getDefaultExportFromCjs(_typeof_1);

var toPrimitive = createCommonjsModule(function (module) {
var _typeof = _typeof_1["default"];
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
module.exports = _toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var toPropertyKey = createCommonjsModule(function (module) {
var _typeof = _typeof_1["default"];

function _toPropertyKey(arg) {
  var key = toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
module.exports = _toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var defineProperty = createCommonjsModule(function (module) {
function _defineProperty(obj, key, value) {
  key = toPropertyKey(key);
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
module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _defineProperty = /*@__PURE__*/getDefaultExportFromCjs(defineProperty);

function ownKeys$8(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$8(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$8(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$8(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var ManifestStateContext = /*#__PURE__*/React.createContext();
var ManifestDispatchContext = /*#__PURE__*/React.createContext();

/**
 * Definition of all state variables in this Context
 */
var defaultState$1 = {
  manifest: null,
  canvasIndex: 0,
  // index for active canvas
  currentNavItem: null,
  canvasDuration: 0,
  canvasLink: null,
  canvasIsEmpty: false,
  targets: [],
  hasMultiItems: false,
  // multiple resources in a single canvas
  srcIndex: 0,
  // index for multiple resources in a single canvas
  startTime: 0,
  autoAdvance: false,
  playlist: {
    markers: [],
    // [{ canvasIndex: Number, canvasMarkers: Array, error: String }]
    isEditing: false,
    isPlaylist: false,
    hasAnnotationService: false,
    annotationServiceId: ''
  },
  structures: [],
  canvasSegments: [],
  hasStructure: false // current Canvas has structure timespans
};

function manifestReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState$1;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case 'updateManifest':
      {
        return _objectSpread$8(_objectSpread$8({}, state), {}, {
          manifest: _objectSpread$8({}, action.manifest)
        });
      }
    case 'switchCanvas':
      {
        var _state$canvasSegments;
        // Update hasStructure flag when canvas changes
        var canvasStructures = ((_state$canvasSegments = state.canvasSegments) === null || _state$canvasSegments === void 0 ? void 0 : _state$canvasSegments.length) > 0 ? state.canvasSegments.filter(function (c) {
          return c.canvasIndex == action.canvasIndex + 1 && !c.isCanvas;
        }) : false;
        return _objectSpread$8(_objectSpread$8({}, state), {}, {
          canvasIndex: action.canvasIndex,
          hasStructure: canvasStructures.length > 0
        });
      }
    case 'switchItem':
      {
        return _objectSpread$8(_objectSpread$8({}, state), {}, {
          currentNavItem: action.item
        });
      }
    case 'canvasDuration':
      {
        return _objectSpread$8(_objectSpread$8({}, state), {}, {
          canvasDuration: action.canvasDuration
        });
      }
    case 'canvasLink':
      {
        return _objectSpread$8(_objectSpread$8({}, state), {}, {
          canvasLink: action.canvasLink
        });
      }
    case 'canvasTargets':
      {
        return _objectSpread$8(_objectSpread$8({}, state), {}, {
          targets: action.canvasTargets
        });
      }
    case 'hasMultipleItems':
      {
        return _objectSpread$8(_objectSpread$8({}, state), {}, {
          hasMultiItems: action.isMultiSource
        });
      }
    case 'setSrcIndex':
      {
        return _objectSpread$8(_objectSpread$8({}, state), {}, {
          srcIndex: action.srcIndex
        });
      }
    case 'setItemStartTime':
      {
        return _objectSpread$8(_objectSpread$8({}, state), {}, {
          startTime: action.startTime
        });
      }
    case 'setAutoAdvance':
      {
        return _objectSpread$8(_objectSpread$8({}, state), {}, {
          autoAdvance: action.autoAdvance
        });
      }
    case 'setPlaylistMarkers':
      {
        // Set a new set of markers for the canvases in the Manifest
        if (action.markers) {
          return _objectSpread$8(_objectSpread$8({}, state), {}, {
            playlist: _objectSpread$8(_objectSpread$8({}, state.playlist), {}, {
              markers: action.markers
            })
          });
        }
        // Update the existing markers for the current canvas on CRUD ops
        if (action.updatedMarkers) {
          return _objectSpread$8(_objectSpread$8({}, state), {}, {
            playlist: _objectSpread$8(_objectSpread$8({}, state.playlist), {}, {
              markers: state.playlist.markers.map(function (m) {
                if (m.canvasIndex === state.canvasIndex) {
                  m.canvasMarkers = action.updatedMarkers;
                }
                return m;
              })
            })
          });
        }
      }
    case 'setIsEditing':
      {
        return _objectSpread$8(_objectSpread$8({}, state), {}, {
          playlist: _objectSpread$8(_objectSpread$8({}, state.playlist), {}, {
            isEditing: action.isEditing
          })
        });
      }
    case 'setIsPlaylist':
      {
        return _objectSpread$8(_objectSpread$8({}, state), {}, {
          playlist: _objectSpread$8(_objectSpread$8({}, state.playlist), {}, {
            isPlaylist: action.isPlaylist
          })
        });
      }
    case 'setCanvasIsEmpty':
      {
        return _objectSpread$8(_objectSpread$8({}, state), {}, {
          canvasIsEmpty: action.isEmpty
        });
      }
    case 'setAnnotationService':
      {
        return _objectSpread$8(_objectSpread$8({}, state), {}, {
          playlist: _objectSpread$8(_objectSpread$8({}, state.playlist), {}, {
            annotationServiceId: action.annotationService,
            hasAnnotationService: action.annotationService ? true : false
          })
        });
      }
    case 'setStructures':
      {
        return _objectSpread$8(_objectSpread$8({}, state), {}, {
          structures: action.structures
        });
      }
    case 'setCanvasSegments':
      {
        // Update hasStructure flag when canvasSegments are calculated
        var _canvasStructures = action.timespans.filter(function (c) {
          return c.canvasIndex == state.canvasIndex + 1 && !c.isCanvas;
        });
        return _objectSpread$8(_objectSpread$8({}, state), {}, {
          canvasSegments: action.timespans,
          hasStructure: _canvasStructures.length > 0
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
    initialState = _ref$initialState === void 0 ? defaultState$1 : _ref$initialState,
    children = _ref.children;
  var _React$useReducer = React.useReducer(manifestReducer, initialState),
    _React$useReducer2 = _slicedToArray(_React$useReducer, 2),
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

function ownKeys$7(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$7(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$7(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$7(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var PlayerStateContext = /*#__PURE__*/React.createContext();
var PlayerDispatchContext = /*#__PURE__*/React.createContext();

/**
 * Definition of all state variables in this Context
 */
var defaultState = {
  player: null,
  clickedUrl: '',
  isClicked: false,
  isPlaying: false,
  startTime: null,
  endTime: null,
  isEnded: false,
  currentTime: null,
  searchMarkers: [],
  playerFocusElement: ''
};
function PlayerReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case 'updatePlayer':
      {
        return _objectSpread$7(_objectSpread$7({}, state), {}, {
          player: action.player
        });
      }
    case 'navClick':
      {
        return _objectSpread$7(_objectSpread$7({}, state), {}, {
          clickedUrl: action.clickedUrl,
          isClicked: true
        });
      }
    case 'resetClick':
      {
        return _objectSpread$7(_objectSpread$7({}, state), {}, {
          isClicked: false
        });
      }
    case 'setTimeFragment':
      {
        return _objectSpread$7(_objectSpread$7({}, state), {}, {
          startTime: action.startTime,
          endTime: action.endTime
        });
      }
    case 'setSearchMarkers':
      {
        return _objectSpread$7(_objectSpread$7({}, state), {}, {
          searchMarkers: action.payload
        });
      }
    case 'setPlayingStatus':
      {
        return _objectSpread$7(_objectSpread$7({}, state), {}, {
          isPlaying: action.isPlaying
        });
      }
    case 'setCaptionStatus':
      {
        return _objectSpread$7(_objectSpread$7({}, state), {}, {
          captionOn: action.captionOn
        });
      }
    case 'setIsEnded':
      {
        return _objectSpread$7(_objectSpread$7({}, state), {}, {
          isEnded: action.isEnded
        });
      }
    case 'setCurrentTime':
      {
        return _objectSpread$7(_objectSpread$7({}, state), {}, {
          currentTime: action.currentTime
        });
      }
    case 'setPlayerFocusElement':
      {
        return _objectSpread$7(_objectSpread$7({}, state), {}, {
          playerFocusElement: action.element ? action.element : ''
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
    initialState = _ref$initialState === void 0 ? defaultState : _ref$initialState,
    children = _ref.children;
  var _React$useReducer = React.useReducer(PlayerReducer, initialState),
    _React$useReducer2 = _slicedToArray(_React$useReducer, 2),
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

var asyncToGenerator = createCommonjsModule(function (module) {
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
module.exports = _asyncToGenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _asyncToGenerator = /*@__PURE__*/getDefaultExportFromCjs(asyncToGenerator);

var regeneratorRuntime$1 = createCommonjsModule(function (module) {
var _typeof = _typeof_1["default"];
function _regeneratorRuntime() {
  module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
    return exports;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  var exports = {},
    Op = Object.prototype,
    hasOwn = Op.hasOwnProperty,
    defineProperty = Object.defineProperty || function (obj, key, desc) {
      obj[key] = desc.value;
    },
    $Symbol = "function" == typeof Symbol ? Symbol : {},
    iteratorSymbol = $Symbol.iterator || "@@iterator",
    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }
  try {
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
      generator = Object.create(protoGenerator.prototype),
      context = new Context(tryLocsList || []);
    return defineProperty(generator, "_invoke", {
      value: makeInvokeMethod(innerFn, self, context)
    }), generator;
  }
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg,
          value = result.value;
        return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }
      reject(record.arg);
    }
    var previousPromise;
    defineProperty(this, "_invoke", {
      value: function value(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }
        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(innerFn, self, context) {
    var state = "suspendedStart";
    return function (method, arg) {
      if ("executing" === state) throw new Error("Generator is already running");
      if ("completed" === state) {
        if ("throw" === method) throw arg;
        return doneResult();
      }
      for (context.method = method, context.arg = arg;;) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
          if ("suspendedStart" === state) throw state = "completed", context.arg;
          context.dispatchException(context.arg);
        } else "return" === context.method && context.abrupt("return", context.arg);
        state = "executing";
        var record = tryCatch(innerFn, self, context);
        if ("normal" === record.type) {
          if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
          return {
            value: record.arg,
            done: context.done
          };
        }
        "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
      }
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method,
      method = delegate.iterator[methodName];
    if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
            return next.value = undefined, next.done = !0, next;
          };
        return next.next = next;
      }
    }
    return {
      next: doneResult
    };
  }
  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), defineProperty(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (val) {
    var object = Object(val),
      keys = [];
    for (var key in object) keys.push(key);
    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function stop() {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) throw exception;
      var context = this;
      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
          record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
            hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}
module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

// TODO(Babel 8): Remove this file.

var runtime = regeneratorRuntime$1();
var regenerator = runtime;

// Copied from https://github.com/facebook/regenerator/blob/main/packages/runtime/runtime.js#L736=
try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret$1 = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

var ReactPropTypesSecret_1 = ReactPropTypesSecret$1;

var ReactPropTypesSecret = ReactPropTypesSecret_1;

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

var factoryWithThrowingShims = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
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
    bigint: shim,
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

var require$$0 = factoryWithThrowingShims;

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
  module.exports = require$$0();
}
});

var PropTypes = propTypes;

var arrayWithoutHoles = createCommonjsModule(function (module) {
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}
module.exports = _arrayWithoutHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var iterableToArray = createCommonjsModule(function (module) {
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
module.exports = _iterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var nonIterableSpread = createCommonjsModule(function (module) {
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableSpread, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var toConsumableArray = createCommonjsModule(function (module) {
function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}
module.exports = _toConsumableArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _toConsumableArray = /*@__PURE__*/getDefaultExportFromCjs(toConsumableArray);

var namedReferences = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:true});exports.bodyRegExps={xml:/&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g,html4:/&(?:nbsp|iexcl|cent|pound|curren|yen|brvbar|sect|uml|copy|ordf|laquo|not|shy|reg|macr|deg|plusmn|sup2|sup3|acute|micro|para|middot|cedil|sup1|ordm|raquo|frac14|frac12|frac34|iquest|Agrave|Aacute|Acirc|Atilde|Auml|Aring|AElig|Ccedil|Egrave|Eacute|Ecirc|Euml|Igrave|Iacute|Icirc|Iuml|ETH|Ntilde|Ograve|Oacute|Ocirc|Otilde|Ouml|times|Oslash|Ugrave|Uacute|Ucirc|Uuml|Yacute|THORN|szlig|agrave|aacute|acirc|atilde|auml|aring|aelig|ccedil|egrave|eacute|ecirc|euml|igrave|iacute|icirc|iuml|eth|ntilde|ograve|oacute|ocirc|otilde|ouml|divide|oslash|ugrave|uacute|ucirc|uuml|yacute|thorn|yuml|quot|amp|lt|gt|#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g,html5:/&(?:AElig|AMP|Aacute|Acirc|Agrave|Aring|Atilde|Auml|COPY|Ccedil|ETH|Eacute|Ecirc|Egrave|Euml|GT|Iacute|Icirc|Igrave|Iuml|LT|Ntilde|Oacute|Ocirc|Ograve|Oslash|Otilde|Ouml|QUOT|REG|THORN|Uacute|Ucirc|Ugrave|Uuml|Yacute|aacute|acirc|acute|aelig|agrave|amp|aring|atilde|auml|brvbar|ccedil|cedil|cent|copy|curren|deg|divide|eacute|ecirc|egrave|eth|euml|frac12|frac14|frac34|gt|iacute|icirc|iexcl|igrave|iquest|iuml|laquo|lt|macr|micro|middot|nbsp|not|ntilde|oacute|ocirc|ograve|ordf|ordm|oslash|otilde|ouml|para|plusmn|pound|quot|raquo|reg|sect|shy|sup1|sup2|sup3|szlig|thorn|times|uacute|ucirc|ugrave|uml|uuml|yacute|yen|yuml|#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g};exports.namedReferences={xml:{entities:{"&lt;":"<","&gt;":">","&quot;":'"',"&apos;":"'","&amp;":"&"},characters:{"<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;","&":"&amp;"}},html4:{entities:{"&apos;":"'","&nbsp":" ","&nbsp;":" ","&iexcl":"¡","&iexcl;":"¡","&cent":"¢","&cent;":"¢","&pound":"£","&pound;":"£","&curren":"¤","&curren;":"¤","&yen":"¥","&yen;":"¥","&brvbar":"¦","&brvbar;":"¦","&sect":"§","&sect;":"§","&uml":"¨","&uml;":"¨","&copy":"©","&copy;":"©","&ordf":"ª","&ordf;":"ª","&laquo":"«","&laquo;":"«","&not":"¬","&not;":"¬","&shy":"­","&shy;":"­","&reg":"®","&reg;":"®","&macr":"¯","&macr;":"¯","&deg":"°","&deg;":"°","&plusmn":"±","&plusmn;":"±","&sup2":"²","&sup2;":"²","&sup3":"³","&sup3;":"³","&acute":"´","&acute;":"´","&micro":"µ","&micro;":"µ","&para":"¶","&para;":"¶","&middot":"·","&middot;":"·","&cedil":"¸","&cedil;":"¸","&sup1":"¹","&sup1;":"¹","&ordm":"º","&ordm;":"º","&raquo":"»","&raquo;":"»","&frac14":"¼","&frac14;":"¼","&frac12":"½","&frac12;":"½","&frac34":"¾","&frac34;":"¾","&iquest":"¿","&iquest;":"¿","&Agrave":"À","&Agrave;":"À","&Aacute":"Á","&Aacute;":"Á","&Acirc":"Â","&Acirc;":"Â","&Atilde":"Ã","&Atilde;":"Ã","&Auml":"Ä","&Auml;":"Ä","&Aring":"Å","&Aring;":"Å","&AElig":"Æ","&AElig;":"Æ","&Ccedil":"Ç","&Ccedil;":"Ç","&Egrave":"È","&Egrave;":"È","&Eacute":"É","&Eacute;":"É","&Ecirc":"Ê","&Ecirc;":"Ê","&Euml":"Ë","&Euml;":"Ë","&Igrave":"Ì","&Igrave;":"Ì","&Iacute":"Í","&Iacute;":"Í","&Icirc":"Î","&Icirc;":"Î","&Iuml":"Ï","&Iuml;":"Ï","&ETH":"Ð","&ETH;":"Ð","&Ntilde":"Ñ","&Ntilde;":"Ñ","&Ograve":"Ò","&Ograve;":"Ò","&Oacute":"Ó","&Oacute;":"Ó","&Ocirc":"Ô","&Ocirc;":"Ô","&Otilde":"Õ","&Otilde;":"Õ","&Ouml":"Ö","&Ouml;":"Ö","&times":"×","&times;":"×","&Oslash":"Ø","&Oslash;":"Ø","&Ugrave":"Ù","&Ugrave;":"Ù","&Uacute":"Ú","&Uacute;":"Ú","&Ucirc":"Û","&Ucirc;":"Û","&Uuml":"Ü","&Uuml;":"Ü","&Yacute":"Ý","&Yacute;":"Ý","&THORN":"Þ","&THORN;":"Þ","&szlig":"ß","&szlig;":"ß","&agrave":"à","&agrave;":"à","&aacute":"á","&aacute;":"á","&acirc":"â","&acirc;":"â","&atilde":"ã","&atilde;":"ã","&auml":"ä","&auml;":"ä","&aring":"å","&aring;":"å","&aelig":"æ","&aelig;":"æ","&ccedil":"ç","&ccedil;":"ç","&egrave":"è","&egrave;":"è","&eacute":"é","&eacute;":"é","&ecirc":"ê","&ecirc;":"ê","&euml":"ë","&euml;":"ë","&igrave":"ì","&igrave;":"ì","&iacute":"í","&iacute;":"í","&icirc":"î","&icirc;":"î","&iuml":"ï","&iuml;":"ï","&eth":"ð","&eth;":"ð","&ntilde":"ñ","&ntilde;":"ñ","&ograve":"ò","&ograve;":"ò","&oacute":"ó","&oacute;":"ó","&ocirc":"ô","&ocirc;":"ô","&otilde":"õ","&otilde;":"õ","&ouml":"ö","&ouml;":"ö","&divide":"÷","&divide;":"÷","&oslash":"ø","&oslash;":"ø","&ugrave":"ù","&ugrave;":"ù","&uacute":"ú","&uacute;":"ú","&ucirc":"û","&ucirc;":"û","&uuml":"ü","&uuml;":"ü","&yacute":"ý","&yacute;":"ý","&thorn":"þ","&thorn;":"þ","&yuml":"ÿ","&yuml;":"ÿ","&quot":'"',"&quot;":'"',"&amp":"&","&amp;":"&","&lt":"<","&lt;":"<","&gt":">","&gt;":">","&OElig;":"Œ","&oelig;":"œ","&Scaron;":"Š","&scaron;":"š","&Yuml;":"Ÿ","&circ;":"ˆ","&tilde;":"˜","&ensp;":" ","&emsp;":" ","&thinsp;":" ","&zwnj;":"‌","&zwj;":"‍","&lrm;":"‎","&rlm;":"‏","&ndash;":"–","&mdash;":"—","&lsquo;":"‘","&rsquo;":"’","&sbquo;":"‚","&ldquo;":"“","&rdquo;":"”","&bdquo;":"„","&dagger;":"†","&Dagger;":"‡","&permil;":"‰","&lsaquo;":"‹","&rsaquo;":"›","&euro;":"€","&fnof;":"ƒ","&Alpha;":"Α","&Beta;":"Β","&Gamma;":"Γ","&Delta;":"Δ","&Epsilon;":"Ε","&Zeta;":"Ζ","&Eta;":"Η","&Theta;":"Θ","&Iota;":"Ι","&Kappa;":"Κ","&Lambda;":"Λ","&Mu;":"Μ","&Nu;":"Ν","&Xi;":"Ξ","&Omicron;":"Ο","&Pi;":"Π","&Rho;":"Ρ","&Sigma;":"Σ","&Tau;":"Τ","&Upsilon;":"Υ","&Phi;":"Φ","&Chi;":"Χ","&Psi;":"Ψ","&Omega;":"Ω","&alpha;":"α","&beta;":"β","&gamma;":"γ","&delta;":"δ","&epsilon;":"ε","&zeta;":"ζ","&eta;":"η","&theta;":"θ","&iota;":"ι","&kappa;":"κ","&lambda;":"λ","&mu;":"μ","&nu;":"ν","&xi;":"ξ","&omicron;":"ο","&pi;":"π","&rho;":"ρ","&sigmaf;":"ς","&sigma;":"σ","&tau;":"τ","&upsilon;":"υ","&phi;":"φ","&chi;":"χ","&psi;":"ψ","&omega;":"ω","&thetasym;":"ϑ","&upsih;":"ϒ","&piv;":"ϖ","&bull;":"•","&hellip;":"…","&prime;":"′","&Prime;":"″","&oline;":"‾","&frasl;":"⁄","&weierp;":"℘","&image;":"ℑ","&real;":"ℜ","&trade;":"™","&alefsym;":"ℵ","&larr;":"←","&uarr;":"↑","&rarr;":"→","&darr;":"↓","&harr;":"↔","&crarr;":"↵","&lArr;":"⇐","&uArr;":"⇑","&rArr;":"⇒","&dArr;":"⇓","&hArr;":"⇔","&forall;":"∀","&part;":"∂","&exist;":"∃","&empty;":"∅","&nabla;":"∇","&isin;":"∈","&notin;":"∉","&ni;":"∋","&prod;":"∏","&sum;":"∑","&minus;":"−","&lowast;":"∗","&radic;":"√","&prop;":"∝","&infin;":"∞","&ang;":"∠","&and;":"∧","&or;":"∨","&cap;":"∩","&cup;":"∪","&int;":"∫","&there4;":"∴","&sim;":"∼","&cong;":"≅","&asymp;":"≈","&ne;":"≠","&equiv;":"≡","&le;":"≤","&ge;":"≥","&sub;":"⊂","&sup;":"⊃","&nsub;":"⊄","&sube;":"⊆","&supe;":"⊇","&oplus;":"⊕","&otimes;":"⊗","&perp;":"⊥","&sdot;":"⋅","&lceil;":"⌈","&rceil;":"⌉","&lfloor;":"⌊","&rfloor;":"⌋","&lang;":"〈","&rang;":"〉","&loz;":"◊","&spades;":"♠","&clubs;":"♣","&hearts;":"♥","&diams;":"♦"},characters:{"'":"&apos;"," ":"&nbsp;","¡":"&iexcl;","¢":"&cent;","£":"&pound;","¤":"&curren;","¥":"&yen;","¦":"&brvbar;","§":"&sect;","¨":"&uml;","©":"&copy;","ª":"&ordf;","«":"&laquo;","¬":"&not;","­":"&shy;","®":"&reg;","¯":"&macr;","°":"&deg;","±":"&plusmn;","²":"&sup2;","³":"&sup3;","´":"&acute;","µ":"&micro;","¶":"&para;","·":"&middot;","¸":"&cedil;","¹":"&sup1;","º":"&ordm;","»":"&raquo;","¼":"&frac14;","½":"&frac12;","¾":"&frac34;","¿":"&iquest;","À":"&Agrave;","Á":"&Aacute;","Â":"&Acirc;","Ã":"&Atilde;","Ä":"&Auml;","Å":"&Aring;","Æ":"&AElig;","Ç":"&Ccedil;","È":"&Egrave;","É":"&Eacute;","Ê":"&Ecirc;","Ë":"&Euml;","Ì":"&Igrave;","Í":"&Iacute;","Î":"&Icirc;","Ï":"&Iuml;","Ð":"&ETH;","Ñ":"&Ntilde;","Ò":"&Ograve;","Ó":"&Oacute;","Ô":"&Ocirc;","Õ":"&Otilde;","Ö":"&Ouml;","×":"&times;","Ø":"&Oslash;","Ù":"&Ugrave;","Ú":"&Uacute;","Û":"&Ucirc;","Ü":"&Uuml;","Ý":"&Yacute;","Þ":"&THORN;","ß":"&szlig;","à":"&agrave;","á":"&aacute;","â":"&acirc;","ã":"&atilde;","ä":"&auml;","å":"&aring;","æ":"&aelig;","ç":"&ccedil;","è":"&egrave;","é":"&eacute;","ê":"&ecirc;","ë":"&euml;","ì":"&igrave;","í":"&iacute;","î":"&icirc;","ï":"&iuml;","ð":"&eth;","ñ":"&ntilde;","ò":"&ograve;","ó":"&oacute;","ô":"&ocirc;","õ":"&otilde;","ö":"&ouml;","÷":"&divide;","ø":"&oslash;","ù":"&ugrave;","ú":"&uacute;","û":"&ucirc;","ü":"&uuml;","ý":"&yacute;","þ":"&thorn;","ÿ":"&yuml;",'"':"&quot;","&":"&amp;","<":"&lt;",">":"&gt;","Œ":"&OElig;","œ":"&oelig;","Š":"&Scaron;","š":"&scaron;","Ÿ":"&Yuml;","ˆ":"&circ;","˜":"&tilde;"," ":"&ensp;"," ":"&emsp;"," ":"&thinsp;","‌":"&zwnj;","‍":"&zwj;","‎":"&lrm;","‏":"&rlm;","–":"&ndash;","—":"&mdash;","‘":"&lsquo;","’":"&rsquo;","‚":"&sbquo;","“":"&ldquo;","”":"&rdquo;","„":"&bdquo;","†":"&dagger;","‡":"&Dagger;","‰":"&permil;","‹":"&lsaquo;","›":"&rsaquo;","€":"&euro;","ƒ":"&fnof;","Α":"&Alpha;","Β":"&Beta;","Γ":"&Gamma;","Δ":"&Delta;","Ε":"&Epsilon;","Ζ":"&Zeta;","Η":"&Eta;","Θ":"&Theta;","Ι":"&Iota;","Κ":"&Kappa;","Λ":"&Lambda;","Μ":"&Mu;","Ν":"&Nu;","Ξ":"&Xi;","Ο":"&Omicron;","Π":"&Pi;","Ρ":"&Rho;","Σ":"&Sigma;","Τ":"&Tau;","Υ":"&Upsilon;","Φ":"&Phi;","Χ":"&Chi;","Ψ":"&Psi;","Ω":"&Omega;","α":"&alpha;","β":"&beta;","γ":"&gamma;","δ":"&delta;","ε":"&epsilon;","ζ":"&zeta;","η":"&eta;","θ":"&theta;","ι":"&iota;","κ":"&kappa;","λ":"&lambda;","μ":"&mu;","ν":"&nu;","ξ":"&xi;","ο":"&omicron;","π":"&pi;","ρ":"&rho;","ς":"&sigmaf;","σ":"&sigma;","τ":"&tau;","υ":"&upsilon;","φ":"&phi;","χ":"&chi;","ψ":"&psi;","ω":"&omega;","ϑ":"&thetasym;","ϒ":"&upsih;","ϖ":"&piv;","•":"&bull;","…":"&hellip;","′":"&prime;","″":"&Prime;","‾":"&oline;","⁄":"&frasl;","℘":"&weierp;","ℑ":"&image;","ℜ":"&real;","™":"&trade;","ℵ":"&alefsym;","←":"&larr;","↑":"&uarr;","→":"&rarr;","↓":"&darr;","↔":"&harr;","↵":"&crarr;","⇐":"&lArr;","⇑":"&uArr;","⇒":"&rArr;","⇓":"&dArr;","⇔":"&hArr;","∀":"&forall;","∂":"&part;","∃":"&exist;","∅":"&empty;","∇":"&nabla;","∈":"&isin;","∉":"&notin;","∋":"&ni;","∏":"&prod;","∑":"&sum;","−":"&minus;","∗":"&lowast;","√":"&radic;","∝":"&prop;","∞":"&infin;","∠":"&ang;","∧":"&and;","∨":"&or;","∩":"&cap;","∪":"&cup;","∫":"&int;","∴":"&there4;","∼":"&sim;","≅":"&cong;","≈":"&asymp;","≠":"&ne;","≡":"&equiv;","≤":"&le;","≥":"&ge;","⊂":"&sub;","⊃":"&sup;","⊄":"&nsub;","⊆":"&sube;","⊇":"&supe;","⊕":"&oplus;","⊗":"&otimes;","⊥":"&perp;","⋅":"&sdot;","⌈":"&lceil;","⌉":"&rceil;","⌊":"&lfloor;","⌋":"&rfloor;","〈":"&lang;","〉":"&rang;","◊":"&loz;","♠":"&spades;","♣":"&clubs;","♥":"&hearts;","♦":"&diams;"}},html5:{entities:{"&AElig":"Æ","&AElig;":"Æ","&AMP":"&","&AMP;":"&","&Aacute":"Á","&Aacute;":"Á","&Abreve;":"Ă","&Acirc":"Â","&Acirc;":"Â","&Acy;":"А","&Afr;":"𝔄","&Agrave":"À","&Agrave;":"À","&Alpha;":"Α","&Amacr;":"Ā","&And;":"⩓","&Aogon;":"Ą","&Aopf;":"𝔸","&ApplyFunction;":"⁡","&Aring":"Å","&Aring;":"Å","&Ascr;":"𝒜","&Assign;":"≔","&Atilde":"Ã","&Atilde;":"Ã","&Auml":"Ä","&Auml;":"Ä","&Backslash;":"∖","&Barv;":"⫧","&Barwed;":"⌆","&Bcy;":"Б","&Because;":"∵","&Bernoullis;":"ℬ","&Beta;":"Β","&Bfr;":"𝔅","&Bopf;":"𝔹","&Breve;":"˘","&Bscr;":"ℬ","&Bumpeq;":"≎","&CHcy;":"Ч","&COPY":"©","&COPY;":"©","&Cacute;":"Ć","&Cap;":"⋒","&CapitalDifferentialD;":"ⅅ","&Cayleys;":"ℭ","&Ccaron;":"Č","&Ccedil":"Ç","&Ccedil;":"Ç","&Ccirc;":"Ĉ","&Cconint;":"∰","&Cdot;":"Ċ","&Cedilla;":"¸","&CenterDot;":"·","&Cfr;":"ℭ","&Chi;":"Χ","&CircleDot;":"⊙","&CircleMinus;":"⊖","&CirclePlus;":"⊕","&CircleTimes;":"⊗","&ClockwiseContourIntegral;":"∲","&CloseCurlyDoubleQuote;":"”","&CloseCurlyQuote;":"’","&Colon;":"∷","&Colone;":"⩴","&Congruent;":"≡","&Conint;":"∯","&ContourIntegral;":"∮","&Copf;":"ℂ","&Coproduct;":"∐","&CounterClockwiseContourIntegral;":"∳","&Cross;":"⨯","&Cscr;":"𝒞","&Cup;":"⋓","&CupCap;":"≍","&DD;":"ⅅ","&DDotrahd;":"⤑","&DJcy;":"Ђ","&DScy;":"Ѕ","&DZcy;":"Џ","&Dagger;":"‡","&Darr;":"↡","&Dashv;":"⫤","&Dcaron;":"Ď","&Dcy;":"Д","&Del;":"∇","&Delta;":"Δ","&Dfr;":"𝔇","&DiacriticalAcute;":"´","&DiacriticalDot;":"˙","&DiacriticalDoubleAcute;":"˝","&DiacriticalGrave;":"`","&DiacriticalTilde;":"˜","&Diamond;":"⋄","&DifferentialD;":"ⅆ","&Dopf;":"𝔻","&Dot;":"¨","&DotDot;":"⃜","&DotEqual;":"≐","&DoubleContourIntegral;":"∯","&DoubleDot;":"¨","&DoubleDownArrow;":"⇓","&DoubleLeftArrow;":"⇐","&DoubleLeftRightArrow;":"⇔","&DoubleLeftTee;":"⫤","&DoubleLongLeftArrow;":"⟸","&DoubleLongLeftRightArrow;":"⟺","&DoubleLongRightArrow;":"⟹","&DoubleRightArrow;":"⇒","&DoubleRightTee;":"⊨","&DoubleUpArrow;":"⇑","&DoubleUpDownArrow;":"⇕","&DoubleVerticalBar;":"∥","&DownArrow;":"↓","&DownArrowBar;":"⤓","&DownArrowUpArrow;":"⇵","&DownBreve;":"̑","&DownLeftRightVector;":"⥐","&DownLeftTeeVector;":"⥞","&DownLeftVector;":"↽","&DownLeftVectorBar;":"⥖","&DownRightTeeVector;":"⥟","&DownRightVector;":"⇁","&DownRightVectorBar;":"⥗","&DownTee;":"⊤","&DownTeeArrow;":"↧","&Downarrow;":"⇓","&Dscr;":"𝒟","&Dstrok;":"Đ","&ENG;":"Ŋ","&ETH":"Ð","&ETH;":"Ð","&Eacute":"É","&Eacute;":"É","&Ecaron;":"Ě","&Ecirc":"Ê","&Ecirc;":"Ê","&Ecy;":"Э","&Edot;":"Ė","&Efr;":"𝔈","&Egrave":"È","&Egrave;":"È","&Element;":"∈","&Emacr;":"Ē","&EmptySmallSquare;":"◻","&EmptyVerySmallSquare;":"▫","&Eogon;":"Ę","&Eopf;":"𝔼","&Epsilon;":"Ε","&Equal;":"⩵","&EqualTilde;":"≂","&Equilibrium;":"⇌","&Escr;":"ℰ","&Esim;":"⩳","&Eta;":"Η","&Euml":"Ë","&Euml;":"Ë","&Exists;":"∃","&ExponentialE;":"ⅇ","&Fcy;":"Ф","&Ffr;":"𝔉","&FilledSmallSquare;":"◼","&FilledVerySmallSquare;":"▪","&Fopf;":"𝔽","&ForAll;":"∀","&Fouriertrf;":"ℱ","&Fscr;":"ℱ","&GJcy;":"Ѓ","&GT":">","&GT;":">","&Gamma;":"Γ","&Gammad;":"Ϝ","&Gbreve;":"Ğ","&Gcedil;":"Ģ","&Gcirc;":"Ĝ","&Gcy;":"Г","&Gdot;":"Ġ","&Gfr;":"𝔊","&Gg;":"⋙","&Gopf;":"𝔾","&GreaterEqual;":"≥","&GreaterEqualLess;":"⋛","&GreaterFullEqual;":"≧","&GreaterGreater;":"⪢","&GreaterLess;":"≷","&GreaterSlantEqual;":"⩾","&GreaterTilde;":"≳","&Gscr;":"𝒢","&Gt;":"≫","&HARDcy;":"Ъ","&Hacek;":"ˇ","&Hat;":"^","&Hcirc;":"Ĥ","&Hfr;":"ℌ","&HilbertSpace;":"ℋ","&Hopf;":"ℍ","&HorizontalLine;":"─","&Hscr;":"ℋ","&Hstrok;":"Ħ","&HumpDownHump;":"≎","&HumpEqual;":"≏","&IEcy;":"Е","&IJlig;":"Ĳ","&IOcy;":"Ё","&Iacute":"Í","&Iacute;":"Í","&Icirc":"Î","&Icirc;":"Î","&Icy;":"И","&Idot;":"İ","&Ifr;":"ℑ","&Igrave":"Ì","&Igrave;":"Ì","&Im;":"ℑ","&Imacr;":"Ī","&ImaginaryI;":"ⅈ","&Implies;":"⇒","&Int;":"∬","&Integral;":"∫","&Intersection;":"⋂","&InvisibleComma;":"⁣","&InvisibleTimes;":"⁢","&Iogon;":"Į","&Iopf;":"𝕀","&Iota;":"Ι","&Iscr;":"ℐ","&Itilde;":"Ĩ","&Iukcy;":"І","&Iuml":"Ï","&Iuml;":"Ï","&Jcirc;":"Ĵ","&Jcy;":"Й","&Jfr;":"𝔍","&Jopf;":"𝕁","&Jscr;":"𝒥","&Jsercy;":"Ј","&Jukcy;":"Є","&KHcy;":"Х","&KJcy;":"Ќ","&Kappa;":"Κ","&Kcedil;":"Ķ","&Kcy;":"К","&Kfr;":"𝔎","&Kopf;":"𝕂","&Kscr;":"𝒦","&LJcy;":"Љ","&LT":"<","&LT;":"<","&Lacute;":"Ĺ","&Lambda;":"Λ","&Lang;":"⟪","&Laplacetrf;":"ℒ","&Larr;":"↞","&Lcaron;":"Ľ","&Lcedil;":"Ļ","&Lcy;":"Л","&LeftAngleBracket;":"⟨","&LeftArrow;":"←","&LeftArrowBar;":"⇤","&LeftArrowRightArrow;":"⇆","&LeftCeiling;":"⌈","&LeftDoubleBracket;":"⟦","&LeftDownTeeVector;":"⥡","&LeftDownVector;":"⇃","&LeftDownVectorBar;":"⥙","&LeftFloor;":"⌊","&LeftRightArrow;":"↔","&LeftRightVector;":"⥎","&LeftTee;":"⊣","&LeftTeeArrow;":"↤","&LeftTeeVector;":"⥚","&LeftTriangle;":"⊲","&LeftTriangleBar;":"⧏","&LeftTriangleEqual;":"⊴","&LeftUpDownVector;":"⥑","&LeftUpTeeVector;":"⥠","&LeftUpVector;":"↿","&LeftUpVectorBar;":"⥘","&LeftVector;":"↼","&LeftVectorBar;":"⥒","&Leftarrow;":"⇐","&Leftrightarrow;":"⇔","&LessEqualGreater;":"⋚","&LessFullEqual;":"≦","&LessGreater;":"≶","&LessLess;":"⪡","&LessSlantEqual;":"⩽","&LessTilde;":"≲","&Lfr;":"𝔏","&Ll;":"⋘","&Lleftarrow;":"⇚","&Lmidot;":"Ŀ","&LongLeftArrow;":"⟵","&LongLeftRightArrow;":"⟷","&LongRightArrow;":"⟶","&Longleftarrow;":"⟸","&Longleftrightarrow;":"⟺","&Longrightarrow;":"⟹","&Lopf;":"𝕃","&LowerLeftArrow;":"↙","&LowerRightArrow;":"↘","&Lscr;":"ℒ","&Lsh;":"↰","&Lstrok;":"Ł","&Lt;":"≪","&Map;":"⤅","&Mcy;":"М","&MediumSpace;":" ","&Mellintrf;":"ℳ","&Mfr;":"𝔐","&MinusPlus;":"∓","&Mopf;":"𝕄","&Mscr;":"ℳ","&Mu;":"Μ","&NJcy;":"Њ","&Nacute;":"Ń","&Ncaron;":"Ň","&Ncedil;":"Ņ","&Ncy;":"Н","&NegativeMediumSpace;":"​","&NegativeThickSpace;":"​","&NegativeThinSpace;":"​","&NegativeVeryThinSpace;":"​","&NestedGreaterGreater;":"≫","&NestedLessLess;":"≪","&NewLine;":"\n","&Nfr;":"𝔑","&NoBreak;":"⁠","&NonBreakingSpace;":" ","&Nopf;":"ℕ","&Not;":"⫬","&NotCongruent;":"≢","&NotCupCap;":"≭","&NotDoubleVerticalBar;":"∦","&NotElement;":"∉","&NotEqual;":"≠","&NotEqualTilde;":"≂̸","&NotExists;":"∄","&NotGreater;":"≯","&NotGreaterEqual;":"≱","&NotGreaterFullEqual;":"≧̸","&NotGreaterGreater;":"≫̸","&NotGreaterLess;":"≹","&NotGreaterSlantEqual;":"⩾̸","&NotGreaterTilde;":"≵","&NotHumpDownHump;":"≎̸","&NotHumpEqual;":"≏̸","&NotLeftTriangle;":"⋪","&NotLeftTriangleBar;":"⧏̸","&NotLeftTriangleEqual;":"⋬","&NotLess;":"≮","&NotLessEqual;":"≰","&NotLessGreater;":"≸","&NotLessLess;":"≪̸","&NotLessSlantEqual;":"⩽̸","&NotLessTilde;":"≴","&NotNestedGreaterGreater;":"⪢̸","&NotNestedLessLess;":"⪡̸","&NotPrecedes;":"⊀","&NotPrecedesEqual;":"⪯̸","&NotPrecedesSlantEqual;":"⋠","&NotReverseElement;":"∌","&NotRightTriangle;":"⋫","&NotRightTriangleBar;":"⧐̸","&NotRightTriangleEqual;":"⋭","&NotSquareSubset;":"⊏̸","&NotSquareSubsetEqual;":"⋢","&NotSquareSuperset;":"⊐̸","&NotSquareSupersetEqual;":"⋣","&NotSubset;":"⊂⃒","&NotSubsetEqual;":"⊈","&NotSucceeds;":"⊁","&NotSucceedsEqual;":"⪰̸","&NotSucceedsSlantEqual;":"⋡","&NotSucceedsTilde;":"≿̸","&NotSuperset;":"⊃⃒","&NotSupersetEqual;":"⊉","&NotTilde;":"≁","&NotTildeEqual;":"≄","&NotTildeFullEqual;":"≇","&NotTildeTilde;":"≉","&NotVerticalBar;":"∤","&Nscr;":"𝒩","&Ntilde":"Ñ","&Ntilde;":"Ñ","&Nu;":"Ν","&OElig;":"Œ","&Oacute":"Ó","&Oacute;":"Ó","&Ocirc":"Ô","&Ocirc;":"Ô","&Ocy;":"О","&Odblac;":"Ő","&Ofr;":"𝔒","&Ograve":"Ò","&Ograve;":"Ò","&Omacr;":"Ō","&Omega;":"Ω","&Omicron;":"Ο","&Oopf;":"𝕆","&OpenCurlyDoubleQuote;":"“","&OpenCurlyQuote;":"‘","&Or;":"⩔","&Oscr;":"𝒪","&Oslash":"Ø","&Oslash;":"Ø","&Otilde":"Õ","&Otilde;":"Õ","&Otimes;":"⨷","&Ouml":"Ö","&Ouml;":"Ö","&OverBar;":"‾","&OverBrace;":"⏞","&OverBracket;":"⎴","&OverParenthesis;":"⏜","&PartialD;":"∂","&Pcy;":"П","&Pfr;":"𝔓","&Phi;":"Φ","&Pi;":"Π","&PlusMinus;":"±","&Poincareplane;":"ℌ","&Popf;":"ℙ","&Pr;":"⪻","&Precedes;":"≺","&PrecedesEqual;":"⪯","&PrecedesSlantEqual;":"≼","&PrecedesTilde;":"≾","&Prime;":"″","&Product;":"∏","&Proportion;":"∷","&Proportional;":"∝","&Pscr;":"𝒫","&Psi;":"Ψ","&QUOT":'"',"&QUOT;":'"',"&Qfr;":"𝔔","&Qopf;":"ℚ","&Qscr;":"𝒬","&RBarr;":"⤐","&REG":"®","&REG;":"®","&Racute;":"Ŕ","&Rang;":"⟫","&Rarr;":"↠","&Rarrtl;":"⤖","&Rcaron;":"Ř","&Rcedil;":"Ŗ","&Rcy;":"Р","&Re;":"ℜ","&ReverseElement;":"∋","&ReverseEquilibrium;":"⇋","&ReverseUpEquilibrium;":"⥯","&Rfr;":"ℜ","&Rho;":"Ρ","&RightAngleBracket;":"⟩","&RightArrow;":"→","&RightArrowBar;":"⇥","&RightArrowLeftArrow;":"⇄","&RightCeiling;":"⌉","&RightDoubleBracket;":"⟧","&RightDownTeeVector;":"⥝","&RightDownVector;":"⇂","&RightDownVectorBar;":"⥕","&RightFloor;":"⌋","&RightTee;":"⊢","&RightTeeArrow;":"↦","&RightTeeVector;":"⥛","&RightTriangle;":"⊳","&RightTriangleBar;":"⧐","&RightTriangleEqual;":"⊵","&RightUpDownVector;":"⥏","&RightUpTeeVector;":"⥜","&RightUpVector;":"↾","&RightUpVectorBar;":"⥔","&RightVector;":"⇀","&RightVectorBar;":"⥓","&Rightarrow;":"⇒","&Ropf;":"ℝ","&RoundImplies;":"⥰","&Rrightarrow;":"⇛","&Rscr;":"ℛ","&Rsh;":"↱","&RuleDelayed;":"⧴","&SHCHcy;":"Щ","&SHcy;":"Ш","&SOFTcy;":"Ь","&Sacute;":"Ś","&Sc;":"⪼","&Scaron;":"Š","&Scedil;":"Ş","&Scirc;":"Ŝ","&Scy;":"С","&Sfr;":"𝔖","&ShortDownArrow;":"↓","&ShortLeftArrow;":"←","&ShortRightArrow;":"→","&ShortUpArrow;":"↑","&Sigma;":"Σ","&SmallCircle;":"∘","&Sopf;":"𝕊","&Sqrt;":"√","&Square;":"□","&SquareIntersection;":"⊓","&SquareSubset;":"⊏","&SquareSubsetEqual;":"⊑","&SquareSuperset;":"⊐","&SquareSupersetEqual;":"⊒","&SquareUnion;":"⊔","&Sscr;":"𝒮","&Star;":"⋆","&Sub;":"⋐","&Subset;":"⋐","&SubsetEqual;":"⊆","&Succeeds;":"≻","&SucceedsEqual;":"⪰","&SucceedsSlantEqual;":"≽","&SucceedsTilde;":"≿","&SuchThat;":"∋","&Sum;":"∑","&Sup;":"⋑","&Superset;":"⊃","&SupersetEqual;":"⊇","&Supset;":"⋑","&THORN":"Þ","&THORN;":"Þ","&TRADE;":"™","&TSHcy;":"Ћ","&TScy;":"Ц","&Tab;":"\t","&Tau;":"Τ","&Tcaron;":"Ť","&Tcedil;":"Ţ","&Tcy;":"Т","&Tfr;":"𝔗","&Therefore;":"∴","&Theta;":"Θ","&ThickSpace;":"  ","&ThinSpace;":" ","&Tilde;":"∼","&TildeEqual;":"≃","&TildeFullEqual;":"≅","&TildeTilde;":"≈","&Topf;":"𝕋","&TripleDot;":"⃛","&Tscr;":"𝒯","&Tstrok;":"Ŧ","&Uacute":"Ú","&Uacute;":"Ú","&Uarr;":"↟","&Uarrocir;":"⥉","&Ubrcy;":"Ў","&Ubreve;":"Ŭ","&Ucirc":"Û","&Ucirc;":"Û","&Ucy;":"У","&Udblac;":"Ű","&Ufr;":"𝔘","&Ugrave":"Ù","&Ugrave;":"Ù","&Umacr;":"Ū","&UnderBar;":"_","&UnderBrace;":"⏟","&UnderBracket;":"⎵","&UnderParenthesis;":"⏝","&Union;":"⋃","&UnionPlus;":"⊎","&Uogon;":"Ų","&Uopf;":"𝕌","&UpArrow;":"↑","&UpArrowBar;":"⤒","&UpArrowDownArrow;":"⇅","&UpDownArrow;":"↕","&UpEquilibrium;":"⥮","&UpTee;":"⊥","&UpTeeArrow;":"↥","&Uparrow;":"⇑","&Updownarrow;":"⇕","&UpperLeftArrow;":"↖","&UpperRightArrow;":"↗","&Upsi;":"ϒ","&Upsilon;":"Υ","&Uring;":"Ů","&Uscr;":"𝒰","&Utilde;":"Ũ","&Uuml":"Ü","&Uuml;":"Ü","&VDash;":"⊫","&Vbar;":"⫫","&Vcy;":"В","&Vdash;":"⊩","&Vdashl;":"⫦","&Vee;":"⋁","&Verbar;":"‖","&Vert;":"‖","&VerticalBar;":"∣","&VerticalLine;":"|","&VerticalSeparator;":"❘","&VerticalTilde;":"≀","&VeryThinSpace;":" ","&Vfr;":"𝔙","&Vopf;":"𝕍","&Vscr;":"𝒱","&Vvdash;":"⊪","&Wcirc;":"Ŵ","&Wedge;":"⋀","&Wfr;":"𝔚","&Wopf;":"𝕎","&Wscr;":"𝒲","&Xfr;":"𝔛","&Xi;":"Ξ","&Xopf;":"𝕏","&Xscr;":"𝒳","&YAcy;":"Я","&YIcy;":"Ї","&YUcy;":"Ю","&Yacute":"Ý","&Yacute;":"Ý","&Ycirc;":"Ŷ","&Ycy;":"Ы","&Yfr;":"𝔜","&Yopf;":"𝕐","&Yscr;":"𝒴","&Yuml;":"Ÿ","&ZHcy;":"Ж","&Zacute;":"Ź","&Zcaron;":"Ž","&Zcy;":"З","&Zdot;":"Ż","&ZeroWidthSpace;":"​","&Zeta;":"Ζ","&Zfr;":"ℨ","&Zopf;":"ℤ","&Zscr;":"𝒵","&aacute":"á","&aacute;":"á","&abreve;":"ă","&ac;":"∾","&acE;":"∾̳","&acd;":"∿","&acirc":"â","&acirc;":"â","&acute":"´","&acute;":"´","&acy;":"а","&aelig":"æ","&aelig;":"æ","&af;":"⁡","&afr;":"𝔞","&agrave":"à","&agrave;":"à","&alefsym;":"ℵ","&aleph;":"ℵ","&alpha;":"α","&amacr;":"ā","&amalg;":"⨿","&amp":"&","&amp;":"&","&and;":"∧","&andand;":"⩕","&andd;":"⩜","&andslope;":"⩘","&andv;":"⩚","&ang;":"∠","&ange;":"⦤","&angle;":"∠","&angmsd;":"∡","&angmsdaa;":"⦨","&angmsdab;":"⦩","&angmsdac;":"⦪","&angmsdad;":"⦫","&angmsdae;":"⦬","&angmsdaf;":"⦭","&angmsdag;":"⦮","&angmsdah;":"⦯","&angrt;":"∟","&angrtvb;":"⊾","&angrtvbd;":"⦝","&angsph;":"∢","&angst;":"Å","&angzarr;":"⍼","&aogon;":"ą","&aopf;":"𝕒","&ap;":"≈","&apE;":"⩰","&apacir;":"⩯","&ape;":"≊","&apid;":"≋","&apos;":"'","&approx;":"≈","&approxeq;":"≊","&aring":"å","&aring;":"å","&ascr;":"𝒶","&ast;":"*","&asymp;":"≈","&asympeq;":"≍","&atilde":"ã","&atilde;":"ã","&auml":"ä","&auml;":"ä","&awconint;":"∳","&awint;":"⨑","&bNot;":"⫭","&backcong;":"≌","&backepsilon;":"϶","&backprime;":"‵","&backsim;":"∽","&backsimeq;":"⋍","&barvee;":"⊽","&barwed;":"⌅","&barwedge;":"⌅","&bbrk;":"⎵","&bbrktbrk;":"⎶","&bcong;":"≌","&bcy;":"б","&bdquo;":"„","&becaus;":"∵","&because;":"∵","&bemptyv;":"⦰","&bepsi;":"϶","&bernou;":"ℬ","&beta;":"β","&beth;":"ℶ","&between;":"≬","&bfr;":"𝔟","&bigcap;":"⋂","&bigcirc;":"◯","&bigcup;":"⋃","&bigodot;":"⨀","&bigoplus;":"⨁","&bigotimes;":"⨂","&bigsqcup;":"⨆","&bigstar;":"★","&bigtriangledown;":"▽","&bigtriangleup;":"△","&biguplus;":"⨄","&bigvee;":"⋁","&bigwedge;":"⋀","&bkarow;":"⤍","&blacklozenge;":"⧫","&blacksquare;":"▪","&blacktriangle;":"▴","&blacktriangledown;":"▾","&blacktriangleleft;":"◂","&blacktriangleright;":"▸","&blank;":"␣","&blk12;":"▒","&blk14;":"░","&blk34;":"▓","&block;":"█","&bne;":"=⃥","&bnequiv;":"≡⃥","&bnot;":"⌐","&bopf;":"𝕓","&bot;":"⊥","&bottom;":"⊥","&bowtie;":"⋈","&boxDL;":"╗","&boxDR;":"╔","&boxDl;":"╖","&boxDr;":"╓","&boxH;":"═","&boxHD;":"╦","&boxHU;":"╩","&boxHd;":"╤","&boxHu;":"╧","&boxUL;":"╝","&boxUR;":"╚","&boxUl;":"╜","&boxUr;":"╙","&boxV;":"║","&boxVH;":"╬","&boxVL;":"╣","&boxVR;":"╠","&boxVh;":"╫","&boxVl;":"╢","&boxVr;":"╟","&boxbox;":"⧉","&boxdL;":"╕","&boxdR;":"╒","&boxdl;":"┐","&boxdr;":"┌","&boxh;":"─","&boxhD;":"╥","&boxhU;":"╨","&boxhd;":"┬","&boxhu;":"┴","&boxminus;":"⊟","&boxplus;":"⊞","&boxtimes;":"⊠","&boxuL;":"╛","&boxuR;":"╘","&boxul;":"┘","&boxur;":"└","&boxv;":"│","&boxvH;":"╪","&boxvL;":"╡","&boxvR;":"╞","&boxvh;":"┼","&boxvl;":"┤","&boxvr;":"├","&bprime;":"‵","&breve;":"˘","&brvbar":"¦","&brvbar;":"¦","&bscr;":"𝒷","&bsemi;":"⁏","&bsim;":"∽","&bsime;":"⋍","&bsol;":"\\","&bsolb;":"⧅","&bsolhsub;":"⟈","&bull;":"•","&bullet;":"•","&bump;":"≎","&bumpE;":"⪮","&bumpe;":"≏","&bumpeq;":"≏","&cacute;":"ć","&cap;":"∩","&capand;":"⩄","&capbrcup;":"⩉","&capcap;":"⩋","&capcup;":"⩇","&capdot;":"⩀","&caps;":"∩︀","&caret;":"⁁","&caron;":"ˇ","&ccaps;":"⩍","&ccaron;":"č","&ccedil":"ç","&ccedil;":"ç","&ccirc;":"ĉ","&ccups;":"⩌","&ccupssm;":"⩐","&cdot;":"ċ","&cedil":"¸","&cedil;":"¸","&cemptyv;":"⦲","&cent":"¢","&cent;":"¢","&centerdot;":"·","&cfr;":"𝔠","&chcy;":"ч","&check;":"✓","&checkmark;":"✓","&chi;":"χ","&cir;":"○","&cirE;":"⧃","&circ;":"ˆ","&circeq;":"≗","&circlearrowleft;":"↺","&circlearrowright;":"↻","&circledR;":"®","&circledS;":"Ⓢ","&circledast;":"⊛","&circledcirc;":"⊚","&circleddash;":"⊝","&cire;":"≗","&cirfnint;":"⨐","&cirmid;":"⫯","&cirscir;":"⧂","&clubs;":"♣","&clubsuit;":"♣","&colon;":":","&colone;":"≔","&coloneq;":"≔","&comma;":",","&commat;":"@","&comp;":"∁","&compfn;":"∘","&complement;":"∁","&complexes;":"ℂ","&cong;":"≅","&congdot;":"⩭","&conint;":"∮","&copf;":"𝕔","&coprod;":"∐","&copy":"©","&copy;":"©","&copysr;":"℗","&crarr;":"↵","&cross;":"✗","&cscr;":"𝒸","&csub;":"⫏","&csube;":"⫑","&csup;":"⫐","&csupe;":"⫒","&ctdot;":"⋯","&cudarrl;":"⤸","&cudarrr;":"⤵","&cuepr;":"⋞","&cuesc;":"⋟","&cularr;":"↶","&cularrp;":"⤽","&cup;":"∪","&cupbrcap;":"⩈","&cupcap;":"⩆","&cupcup;":"⩊","&cupdot;":"⊍","&cupor;":"⩅","&cups;":"∪︀","&curarr;":"↷","&curarrm;":"⤼","&curlyeqprec;":"⋞","&curlyeqsucc;":"⋟","&curlyvee;":"⋎","&curlywedge;":"⋏","&curren":"¤","&curren;":"¤","&curvearrowleft;":"↶","&curvearrowright;":"↷","&cuvee;":"⋎","&cuwed;":"⋏","&cwconint;":"∲","&cwint;":"∱","&cylcty;":"⌭","&dArr;":"⇓","&dHar;":"⥥","&dagger;":"†","&daleth;":"ℸ","&darr;":"↓","&dash;":"‐","&dashv;":"⊣","&dbkarow;":"⤏","&dblac;":"˝","&dcaron;":"ď","&dcy;":"д","&dd;":"ⅆ","&ddagger;":"‡","&ddarr;":"⇊","&ddotseq;":"⩷","&deg":"°","&deg;":"°","&delta;":"δ","&demptyv;":"⦱","&dfisht;":"⥿","&dfr;":"𝔡","&dharl;":"⇃","&dharr;":"⇂","&diam;":"⋄","&diamond;":"⋄","&diamondsuit;":"♦","&diams;":"♦","&die;":"¨","&digamma;":"ϝ","&disin;":"⋲","&div;":"÷","&divide":"÷","&divide;":"÷","&divideontimes;":"⋇","&divonx;":"⋇","&djcy;":"ђ","&dlcorn;":"⌞","&dlcrop;":"⌍","&dollar;":"$","&dopf;":"𝕕","&dot;":"˙","&doteq;":"≐","&doteqdot;":"≑","&dotminus;":"∸","&dotplus;":"∔","&dotsquare;":"⊡","&doublebarwedge;":"⌆","&downarrow;":"↓","&downdownarrows;":"⇊","&downharpoonleft;":"⇃","&downharpoonright;":"⇂","&drbkarow;":"⤐","&drcorn;":"⌟","&drcrop;":"⌌","&dscr;":"𝒹","&dscy;":"ѕ","&dsol;":"⧶","&dstrok;":"đ","&dtdot;":"⋱","&dtri;":"▿","&dtrif;":"▾","&duarr;":"⇵","&duhar;":"⥯","&dwangle;":"⦦","&dzcy;":"џ","&dzigrarr;":"⟿","&eDDot;":"⩷","&eDot;":"≑","&eacute":"é","&eacute;":"é","&easter;":"⩮","&ecaron;":"ě","&ecir;":"≖","&ecirc":"ê","&ecirc;":"ê","&ecolon;":"≕","&ecy;":"э","&edot;":"ė","&ee;":"ⅇ","&efDot;":"≒","&efr;":"𝔢","&eg;":"⪚","&egrave":"è","&egrave;":"è","&egs;":"⪖","&egsdot;":"⪘","&el;":"⪙","&elinters;":"⏧","&ell;":"ℓ","&els;":"⪕","&elsdot;":"⪗","&emacr;":"ē","&empty;":"∅","&emptyset;":"∅","&emptyv;":"∅","&emsp13;":" ","&emsp14;":" ","&emsp;":" ","&eng;":"ŋ","&ensp;":" ","&eogon;":"ę","&eopf;":"𝕖","&epar;":"⋕","&eparsl;":"⧣","&eplus;":"⩱","&epsi;":"ε","&epsilon;":"ε","&epsiv;":"ϵ","&eqcirc;":"≖","&eqcolon;":"≕","&eqsim;":"≂","&eqslantgtr;":"⪖","&eqslantless;":"⪕","&equals;":"=","&equest;":"≟","&equiv;":"≡","&equivDD;":"⩸","&eqvparsl;":"⧥","&erDot;":"≓","&erarr;":"⥱","&escr;":"ℯ","&esdot;":"≐","&esim;":"≂","&eta;":"η","&eth":"ð","&eth;":"ð","&euml":"ë","&euml;":"ë","&euro;":"€","&excl;":"!","&exist;":"∃","&expectation;":"ℰ","&exponentiale;":"ⅇ","&fallingdotseq;":"≒","&fcy;":"ф","&female;":"♀","&ffilig;":"ﬃ","&fflig;":"ﬀ","&ffllig;":"ﬄ","&ffr;":"𝔣","&filig;":"ﬁ","&fjlig;":"fj","&flat;":"♭","&fllig;":"ﬂ","&fltns;":"▱","&fnof;":"ƒ","&fopf;":"𝕗","&forall;":"∀","&fork;":"⋔","&forkv;":"⫙","&fpartint;":"⨍","&frac12":"½","&frac12;":"½","&frac13;":"⅓","&frac14":"¼","&frac14;":"¼","&frac15;":"⅕","&frac16;":"⅙","&frac18;":"⅛","&frac23;":"⅔","&frac25;":"⅖","&frac34":"¾","&frac34;":"¾","&frac35;":"⅗","&frac38;":"⅜","&frac45;":"⅘","&frac56;":"⅚","&frac58;":"⅝","&frac78;":"⅞","&frasl;":"⁄","&frown;":"⌢","&fscr;":"𝒻","&gE;":"≧","&gEl;":"⪌","&gacute;":"ǵ","&gamma;":"γ","&gammad;":"ϝ","&gap;":"⪆","&gbreve;":"ğ","&gcirc;":"ĝ","&gcy;":"г","&gdot;":"ġ","&ge;":"≥","&gel;":"⋛","&geq;":"≥","&geqq;":"≧","&geqslant;":"⩾","&ges;":"⩾","&gescc;":"⪩","&gesdot;":"⪀","&gesdoto;":"⪂","&gesdotol;":"⪄","&gesl;":"⋛︀","&gesles;":"⪔","&gfr;":"𝔤","&gg;":"≫","&ggg;":"⋙","&gimel;":"ℷ","&gjcy;":"ѓ","&gl;":"≷","&glE;":"⪒","&gla;":"⪥","&glj;":"⪤","&gnE;":"≩","&gnap;":"⪊","&gnapprox;":"⪊","&gne;":"⪈","&gneq;":"⪈","&gneqq;":"≩","&gnsim;":"⋧","&gopf;":"𝕘","&grave;":"`","&gscr;":"ℊ","&gsim;":"≳","&gsime;":"⪎","&gsiml;":"⪐","&gt":">","&gt;":">","&gtcc;":"⪧","&gtcir;":"⩺","&gtdot;":"⋗","&gtlPar;":"⦕","&gtquest;":"⩼","&gtrapprox;":"⪆","&gtrarr;":"⥸","&gtrdot;":"⋗","&gtreqless;":"⋛","&gtreqqless;":"⪌","&gtrless;":"≷","&gtrsim;":"≳","&gvertneqq;":"≩︀","&gvnE;":"≩︀","&hArr;":"⇔","&hairsp;":" ","&half;":"½","&hamilt;":"ℋ","&hardcy;":"ъ","&harr;":"↔","&harrcir;":"⥈","&harrw;":"↭","&hbar;":"ℏ","&hcirc;":"ĥ","&hearts;":"♥","&heartsuit;":"♥","&hellip;":"…","&hercon;":"⊹","&hfr;":"𝔥","&hksearow;":"⤥","&hkswarow;":"⤦","&hoarr;":"⇿","&homtht;":"∻","&hookleftarrow;":"↩","&hookrightarrow;":"↪","&hopf;":"𝕙","&horbar;":"―","&hscr;":"𝒽","&hslash;":"ℏ","&hstrok;":"ħ","&hybull;":"⁃","&hyphen;":"‐","&iacute":"í","&iacute;":"í","&ic;":"⁣","&icirc":"î","&icirc;":"î","&icy;":"и","&iecy;":"е","&iexcl":"¡","&iexcl;":"¡","&iff;":"⇔","&ifr;":"𝔦","&igrave":"ì","&igrave;":"ì","&ii;":"ⅈ","&iiiint;":"⨌","&iiint;":"∭","&iinfin;":"⧜","&iiota;":"℩","&ijlig;":"ĳ","&imacr;":"ī","&image;":"ℑ","&imagline;":"ℐ","&imagpart;":"ℑ","&imath;":"ı","&imof;":"⊷","&imped;":"Ƶ","&in;":"∈","&incare;":"℅","&infin;":"∞","&infintie;":"⧝","&inodot;":"ı","&int;":"∫","&intcal;":"⊺","&integers;":"ℤ","&intercal;":"⊺","&intlarhk;":"⨗","&intprod;":"⨼","&iocy;":"ё","&iogon;":"į","&iopf;":"𝕚","&iota;":"ι","&iprod;":"⨼","&iquest":"¿","&iquest;":"¿","&iscr;":"𝒾","&isin;":"∈","&isinE;":"⋹","&isindot;":"⋵","&isins;":"⋴","&isinsv;":"⋳","&isinv;":"∈","&it;":"⁢","&itilde;":"ĩ","&iukcy;":"і","&iuml":"ï","&iuml;":"ï","&jcirc;":"ĵ","&jcy;":"й","&jfr;":"𝔧","&jmath;":"ȷ","&jopf;":"𝕛","&jscr;":"𝒿","&jsercy;":"ј","&jukcy;":"є","&kappa;":"κ","&kappav;":"ϰ","&kcedil;":"ķ","&kcy;":"к","&kfr;":"𝔨","&kgreen;":"ĸ","&khcy;":"х","&kjcy;":"ќ","&kopf;":"𝕜","&kscr;":"𝓀","&lAarr;":"⇚","&lArr;":"⇐","&lAtail;":"⤛","&lBarr;":"⤎","&lE;":"≦","&lEg;":"⪋","&lHar;":"⥢","&lacute;":"ĺ","&laemptyv;":"⦴","&lagran;":"ℒ","&lambda;":"λ","&lang;":"⟨","&langd;":"⦑","&langle;":"⟨","&lap;":"⪅","&laquo":"«","&laquo;":"«","&larr;":"←","&larrb;":"⇤","&larrbfs;":"⤟","&larrfs;":"⤝","&larrhk;":"↩","&larrlp;":"↫","&larrpl;":"⤹","&larrsim;":"⥳","&larrtl;":"↢","&lat;":"⪫","&latail;":"⤙","&late;":"⪭","&lates;":"⪭︀","&lbarr;":"⤌","&lbbrk;":"❲","&lbrace;":"{","&lbrack;":"[","&lbrke;":"⦋","&lbrksld;":"⦏","&lbrkslu;":"⦍","&lcaron;":"ľ","&lcedil;":"ļ","&lceil;":"⌈","&lcub;":"{","&lcy;":"л","&ldca;":"⤶","&ldquo;":"“","&ldquor;":"„","&ldrdhar;":"⥧","&ldrushar;":"⥋","&ldsh;":"↲","&le;":"≤","&leftarrow;":"←","&leftarrowtail;":"↢","&leftharpoondown;":"↽","&leftharpoonup;":"↼","&leftleftarrows;":"⇇","&leftrightarrow;":"↔","&leftrightarrows;":"⇆","&leftrightharpoons;":"⇋","&leftrightsquigarrow;":"↭","&leftthreetimes;":"⋋","&leg;":"⋚","&leq;":"≤","&leqq;":"≦","&leqslant;":"⩽","&les;":"⩽","&lescc;":"⪨","&lesdot;":"⩿","&lesdoto;":"⪁","&lesdotor;":"⪃","&lesg;":"⋚︀","&lesges;":"⪓","&lessapprox;":"⪅","&lessdot;":"⋖","&lesseqgtr;":"⋚","&lesseqqgtr;":"⪋","&lessgtr;":"≶","&lesssim;":"≲","&lfisht;":"⥼","&lfloor;":"⌊","&lfr;":"𝔩","&lg;":"≶","&lgE;":"⪑","&lhard;":"↽","&lharu;":"↼","&lharul;":"⥪","&lhblk;":"▄","&ljcy;":"љ","&ll;":"≪","&llarr;":"⇇","&llcorner;":"⌞","&llhard;":"⥫","&lltri;":"◺","&lmidot;":"ŀ","&lmoust;":"⎰","&lmoustache;":"⎰","&lnE;":"≨","&lnap;":"⪉","&lnapprox;":"⪉","&lne;":"⪇","&lneq;":"⪇","&lneqq;":"≨","&lnsim;":"⋦","&loang;":"⟬","&loarr;":"⇽","&lobrk;":"⟦","&longleftarrow;":"⟵","&longleftrightarrow;":"⟷","&longmapsto;":"⟼","&longrightarrow;":"⟶","&looparrowleft;":"↫","&looparrowright;":"↬","&lopar;":"⦅","&lopf;":"𝕝","&loplus;":"⨭","&lotimes;":"⨴","&lowast;":"∗","&lowbar;":"_","&loz;":"◊","&lozenge;":"◊","&lozf;":"⧫","&lpar;":"(","&lparlt;":"⦓","&lrarr;":"⇆","&lrcorner;":"⌟","&lrhar;":"⇋","&lrhard;":"⥭","&lrm;":"‎","&lrtri;":"⊿","&lsaquo;":"‹","&lscr;":"𝓁","&lsh;":"↰","&lsim;":"≲","&lsime;":"⪍","&lsimg;":"⪏","&lsqb;":"[","&lsquo;":"‘","&lsquor;":"‚","&lstrok;":"ł","&lt":"<","&lt;":"<","&ltcc;":"⪦","&ltcir;":"⩹","&ltdot;":"⋖","&lthree;":"⋋","&ltimes;":"⋉","&ltlarr;":"⥶","&ltquest;":"⩻","&ltrPar;":"⦖","&ltri;":"◃","&ltrie;":"⊴","&ltrif;":"◂","&lurdshar;":"⥊","&luruhar;":"⥦","&lvertneqq;":"≨︀","&lvnE;":"≨︀","&mDDot;":"∺","&macr":"¯","&macr;":"¯","&male;":"♂","&malt;":"✠","&maltese;":"✠","&map;":"↦","&mapsto;":"↦","&mapstodown;":"↧","&mapstoleft;":"↤","&mapstoup;":"↥","&marker;":"▮","&mcomma;":"⨩","&mcy;":"м","&mdash;":"—","&measuredangle;":"∡","&mfr;":"𝔪","&mho;":"℧","&micro":"µ","&micro;":"µ","&mid;":"∣","&midast;":"*","&midcir;":"⫰","&middot":"·","&middot;":"·","&minus;":"−","&minusb;":"⊟","&minusd;":"∸","&minusdu;":"⨪","&mlcp;":"⫛","&mldr;":"…","&mnplus;":"∓","&models;":"⊧","&mopf;":"𝕞","&mp;":"∓","&mscr;":"𝓂","&mstpos;":"∾","&mu;":"μ","&multimap;":"⊸","&mumap;":"⊸","&nGg;":"⋙̸","&nGt;":"≫⃒","&nGtv;":"≫̸","&nLeftarrow;":"⇍","&nLeftrightarrow;":"⇎","&nLl;":"⋘̸","&nLt;":"≪⃒","&nLtv;":"≪̸","&nRightarrow;":"⇏","&nVDash;":"⊯","&nVdash;":"⊮","&nabla;":"∇","&nacute;":"ń","&nang;":"∠⃒","&nap;":"≉","&napE;":"⩰̸","&napid;":"≋̸","&napos;":"ŉ","&napprox;":"≉","&natur;":"♮","&natural;":"♮","&naturals;":"ℕ","&nbsp":" ","&nbsp;":" ","&nbump;":"≎̸","&nbumpe;":"≏̸","&ncap;":"⩃","&ncaron;":"ň","&ncedil;":"ņ","&ncong;":"≇","&ncongdot;":"⩭̸","&ncup;":"⩂","&ncy;":"н","&ndash;":"–","&ne;":"≠","&neArr;":"⇗","&nearhk;":"⤤","&nearr;":"↗","&nearrow;":"↗","&nedot;":"≐̸","&nequiv;":"≢","&nesear;":"⤨","&nesim;":"≂̸","&nexist;":"∄","&nexists;":"∄","&nfr;":"𝔫","&ngE;":"≧̸","&nge;":"≱","&ngeq;":"≱","&ngeqq;":"≧̸","&ngeqslant;":"⩾̸","&nges;":"⩾̸","&ngsim;":"≵","&ngt;":"≯","&ngtr;":"≯","&nhArr;":"⇎","&nharr;":"↮","&nhpar;":"⫲","&ni;":"∋","&nis;":"⋼","&nisd;":"⋺","&niv;":"∋","&njcy;":"њ","&nlArr;":"⇍","&nlE;":"≦̸","&nlarr;":"↚","&nldr;":"‥","&nle;":"≰","&nleftarrow;":"↚","&nleftrightarrow;":"↮","&nleq;":"≰","&nleqq;":"≦̸","&nleqslant;":"⩽̸","&nles;":"⩽̸","&nless;":"≮","&nlsim;":"≴","&nlt;":"≮","&nltri;":"⋪","&nltrie;":"⋬","&nmid;":"∤","&nopf;":"𝕟","&not":"¬","&not;":"¬","&notin;":"∉","&notinE;":"⋹̸","&notindot;":"⋵̸","&notinva;":"∉","&notinvb;":"⋷","&notinvc;":"⋶","&notni;":"∌","&notniva;":"∌","&notnivb;":"⋾","&notnivc;":"⋽","&npar;":"∦","&nparallel;":"∦","&nparsl;":"⫽⃥","&npart;":"∂̸","&npolint;":"⨔","&npr;":"⊀","&nprcue;":"⋠","&npre;":"⪯̸","&nprec;":"⊀","&npreceq;":"⪯̸","&nrArr;":"⇏","&nrarr;":"↛","&nrarrc;":"⤳̸","&nrarrw;":"↝̸","&nrightarrow;":"↛","&nrtri;":"⋫","&nrtrie;":"⋭","&nsc;":"⊁","&nsccue;":"⋡","&nsce;":"⪰̸","&nscr;":"𝓃","&nshortmid;":"∤","&nshortparallel;":"∦","&nsim;":"≁","&nsime;":"≄","&nsimeq;":"≄","&nsmid;":"∤","&nspar;":"∦","&nsqsube;":"⋢","&nsqsupe;":"⋣","&nsub;":"⊄","&nsubE;":"⫅̸","&nsube;":"⊈","&nsubset;":"⊂⃒","&nsubseteq;":"⊈","&nsubseteqq;":"⫅̸","&nsucc;":"⊁","&nsucceq;":"⪰̸","&nsup;":"⊅","&nsupE;":"⫆̸","&nsupe;":"⊉","&nsupset;":"⊃⃒","&nsupseteq;":"⊉","&nsupseteqq;":"⫆̸","&ntgl;":"≹","&ntilde":"ñ","&ntilde;":"ñ","&ntlg;":"≸","&ntriangleleft;":"⋪","&ntrianglelefteq;":"⋬","&ntriangleright;":"⋫","&ntrianglerighteq;":"⋭","&nu;":"ν","&num;":"#","&numero;":"№","&numsp;":" ","&nvDash;":"⊭","&nvHarr;":"⤄","&nvap;":"≍⃒","&nvdash;":"⊬","&nvge;":"≥⃒","&nvgt;":">⃒","&nvinfin;":"⧞","&nvlArr;":"⤂","&nvle;":"≤⃒","&nvlt;":"<⃒","&nvltrie;":"⊴⃒","&nvrArr;":"⤃","&nvrtrie;":"⊵⃒","&nvsim;":"∼⃒","&nwArr;":"⇖","&nwarhk;":"⤣","&nwarr;":"↖","&nwarrow;":"↖","&nwnear;":"⤧","&oS;":"Ⓢ","&oacute":"ó","&oacute;":"ó","&oast;":"⊛","&ocir;":"⊚","&ocirc":"ô","&ocirc;":"ô","&ocy;":"о","&odash;":"⊝","&odblac;":"ő","&odiv;":"⨸","&odot;":"⊙","&odsold;":"⦼","&oelig;":"œ","&ofcir;":"⦿","&ofr;":"𝔬","&ogon;":"˛","&ograve":"ò","&ograve;":"ò","&ogt;":"⧁","&ohbar;":"⦵","&ohm;":"Ω","&oint;":"∮","&olarr;":"↺","&olcir;":"⦾","&olcross;":"⦻","&oline;":"‾","&olt;":"⧀","&omacr;":"ō","&omega;":"ω","&omicron;":"ο","&omid;":"⦶","&ominus;":"⊖","&oopf;":"𝕠","&opar;":"⦷","&operp;":"⦹","&oplus;":"⊕","&or;":"∨","&orarr;":"↻","&ord;":"⩝","&order;":"ℴ","&orderof;":"ℴ","&ordf":"ª","&ordf;":"ª","&ordm":"º","&ordm;":"º","&origof;":"⊶","&oror;":"⩖","&orslope;":"⩗","&orv;":"⩛","&oscr;":"ℴ","&oslash":"ø","&oslash;":"ø","&osol;":"⊘","&otilde":"õ","&otilde;":"õ","&otimes;":"⊗","&otimesas;":"⨶","&ouml":"ö","&ouml;":"ö","&ovbar;":"⌽","&par;":"∥","&para":"¶","&para;":"¶","&parallel;":"∥","&parsim;":"⫳","&parsl;":"⫽","&part;":"∂","&pcy;":"п","&percnt;":"%","&period;":".","&permil;":"‰","&perp;":"⊥","&pertenk;":"‱","&pfr;":"𝔭","&phi;":"φ","&phiv;":"ϕ","&phmmat;":"ℳ","&phone;":"☎","&pi;":"π","&pitchfork;":"⋔","&piv;":"ϖ","&planck;":"ℏ","&planckh;":"ℎ","&plankv;":"ℏ","&plus;":"+","&plusacir;":"⨣","&plusb;":"⊞","&pluscir;":"⨢","&plusdo;":"∔","&plusdu;":"⨥","&pluse;":"⩲","&plusmn":"±","&plusmn;":"±","&plussim;":"⨦","&plustwo;":"⨧","&pm;":"±","&pointint;":"⨕","&popf;":"𝕡","&pound":"£","&pound;":"£","&pr;":"≺","&prE;":"⪳","&prap;":"⪷","&prcue;":"≼","&pre;":"⪯","&prec;":"≺","&precapprox;":"⪷","&preccurlyeq;":"≼","&preceq;":"⪯","&precnapprox;":"⪹","&precneqq;":"⪵","&precnsim;":"⋨","&precsim;":"≾","&prime;":"′","&primes;":"ℙ","&prnE;":"⪵","&prnap;":"⪹","&prnsim;":"⋨","&prod;":"∏","&profalar;":"⌮","&profline;":"⌒","&profsurf;":"⌓","&prop;":"∝","&propto;":"∝","&prsim;":"≾","&prurel;":"⊰","&pscr;":"𝓅","&psi;":"ψ","&puncsp;":" ","&qfr;":"𝔮","&qint;":"⨌","&qopf;":"𝕢","&qprime;":"⁗","&qscr;":"𝓆","&quaternions;":"ℍ","&quatint;":"⨖","&quest;":"?","&questeq;":"≟","&quot":'"',"&quot;":'"',"&rAarr;":"⇛","&rArr;":"⇒","&rAtail;":"⤜","&rBarr;":"⤏","&rHar;":"⥤","&race;":"∽̱","&racute;":"ŕ","&radic;":"√","&raemptyv;":"⦳","&rang;":"⟩","&rangd;":"⦒","&range;":"⦥","&rangle;":"⟩","&raquo":"»","&raquo;":"»","&rarr;":"→","&rarrap;":"⥵","&rarrb;":"⇥","&rarrbfs;":"⤠","&rarrc;":"⤳","&rarrfs;":"⤞","&rarrhk;":"↪","&rarrlp;":"↬","&rarrpl;":"⥅","&rarrsim;":"⥴","&rarrtl;":"↣","&rarrw;":"↝","&ratail;":"⤚","&ratio;":"∶","&rationals;":"ℚ","&rbarr;":"⤍","&rbbrk;":"❳","&rbrace;":"}","&rbrack;":"]","&rbrke;":"⦌","&rbrksld;":"⦎","&rbrkslu;":"⦐","&rcaron;":"ř","&rcedil;":"ŗ","&rceil;":"⌉","&rcub;":"}","&rcy;":"р","&rdca;":"⤷","&rdldhar;":"⥩","&rdquo;":"”","&rdquor;":"”","&rdsh;":"↳","&real;":"ℜ","&realine;":"ℛ","&realpart;":"ℜ","&reals;":"ℝ","&rect;":"▭","&reg":"®","&reg;":"®","&rfisht;":"⥽","&rfloor;":"⌋","&rfr;":"𝔯","&rhard;":"⇁","&rharu;":"⇀","&rharul;":"⥬","&rho;":"ρ","&rhov;":"ϱ","&rightarrow;":"→","&rightarrowtail;":"↣","&rightharpoondown;":"⇁","&rightharpoonup;":"⇀","&rightleftarrows;":"⇄","&rightleftharpoons;":"⇌","&rightrightarrows;":"⇉","&rightsquigarrow;":"↝","&rightthreetimes;":"⋌","&ring;":"˚","&risingdotseq;":"≓","&rlarr;":"⇄","&rlhar;":"⇌","&rlm;":"‏","&rmoust;":"⎱","&rmoustache;":"⎱","&rnmid;":"⫮","&roang;":"⟭","&roarr;":"⇾","&robrk;":"⟧","&ropar;":"⦆","&ropf;":"𝕣","&roplus;":"⨮","&rotimes;":"⨵","&rpar;":")","&rpargt;":"⦔","&rppolint;":"⨒","&rrarr;":"⇉","&rsaquo;":"›","&rscr;":"𝓇","&rsh;":"↱","&rsqb;":"]","&rsquo;":"’","&rsquor;":"’","&rthree;":"⋌","&rtimes;":"⋊","&rtri;":"▹","&rtrie;":"⊵","&rtrif;":"▸","&rtriltri;":"⧎","&ruluhar;":"⥨","&rx;":"℞","&sacute;":"ś","&sbquo;":"‚","&sc;":"≻","&scE;":"⪴","&scap;":"⪸","&scaron;":"š","&sccue;":"≽","&sce;":"⪰","&scedil;":"ş","&scirc;":"ŝ","&scnE;":"⪶","&scnap;":"⪺","&scnsim;":"⋩","&scpolint;":"⨓","&scsim;":"≿","&scy;":"с","&sdot;":"⋅","&sdotb;":"⊡","&sdote;":"⩦","&seArr;":"⇘","&searhk;":"⤥","&searr;":"↘","&searrow;":"↘","&sect":"§","&sect;":"§","&semi;":";","&seswar;":"⤩","&setminus;":"∖","&setmn;":"∖","&sext;":"✶","&sfr;":"𝔰","&sfrown;":"⌢","&sharp;":"♯","&shchcy;":"щ","&shcy;":"ш","&shortmid;":"∣","&shortparallel;":"∥","&shy":"­","&shy;":"­","&sigma;":"σ","&sigmaf;":"ς","&sigmav;":"ς","&sim;":"∼","&simdot;":"⩪","&sime;":"≃","&simeq;":"≃","&simg;":"⪞","&simgE;":"⪠","&siml;":"⪝","&simlE;":"⪟","&simne;":"≆","&simplus;":"⨤","&simrarr;":"⥲","&slarr;":"←","&smallsetminus;":"∖","&smashp;":"⨳","&smeparsl;":"⧤","&smid;":"∣","&smile;":"⌣","&smt;":"⪪","&smte;":"⪬","&smtes;":"⪬︀","&softcy;":"ь","&sol;":"/","&solb;":"⧄","&solbar;":"⌿","&sopf;":"𝕤","&spades;":"♠","&spadesuit;":"♠","&spar;":"∥","&sqcap;":"⊓","&sqcaps;":"⊓︀","&sqcup;":"⊔","&sqcups;":"⊔︀","&sqsub;":"⊏","&sqsube;":"⊑","&sqsubset;":"⊏","&sqsubseteq;":"⊑","&sqsup;":"⊐","&sqsupe;":"⊒","&sqsupset;":"⊐","&sqsupseteq;":"⊒","&squ;":"□","&square;":"□","&squarf;":"▪","&squf;":"▪","&srarr;":"→","&sscr;":"𝓈","&ssetmn;":"∖","&ssmile;":"⌣","&sstarf;":"⋆","&star;":"☆","&starf;":"★","&straightepsilon;":"ϵ","&straightphi;":"ϕ","&strns;":"¯","&sub;":"⊂","&subE;":"⫅","&subdot;":"⪽","&sube;":"⊆","&subedot;":"⫃","&submult;":"⫁","&subnE;":"⫋","&subne;":"⊊","&subplus;":"⪿","&subrarr;":"⥹","&subset;":"⊂","&subseteq;":"⊆","&subseteqq;":"⫅","&subsetneq;":"⊊","&subsetneqq;":"⫋","&subsim;":"⫇","&subsub;":"⫕","&subsup;":"⫓","&succ;":"≻","&succapprox;":"⪸","&succcurlyeq;":"≽","&succeq;":"⪰","&succnapprox;":"⪺","&succneqq;":"⪶","&succnsim;":"⋩","&succsim;":"≿","&sum;":"∑","&sung;":"♪","&sup1":"¹","&sup1;":"¹","&sup2":"²","&sup2;":"²","&sup3":"³","&sup3;":"³","&sup;":"⊃","&supE;":"⫆","&supdot;":"⪾","&supdsub;":"⫘","&supe;":"⊇","&supedot;":"⫄","&suphsol;":"⟉","&suphsub;":"⫗","&suplarr;":"⥻","&supmult;":"⫂","&supnE;":"⫌","&supne;":"⊋","&supplus;":"⫀","&supset;":"⊃","&supseteq;":"⊇","&supseteqq;":"⫆","&supsetneq;":"⊋","&supsetneqq;":"⫌","&supsim;":"⫈","&supsub;":"⫔","&supsup;":"⫖","&swArr;":"⇙","&swarhk;":"⤦","&swarr;":"↙","&swarrow;":"↙","&swnwar;":"⤪","&szlig":"ß","&szlig;":"ß","&target;":"⌖","&tau;":"τ","&tbrk;":"⎴","&tcaron;":"ť","&tcedil;":"ţ","&tcy;":"т","&tdot;":"⃛","&telrec;":"⌕","&tfr;":"𝔱","&there4;":"∴","&therefore;":"∴","&theta;":"θ","&thetasym;":"ϑ","&thetav;":"ϑ","&thickapprox;":"≈","&thicksim;":"∼","&thinsp;":" ","&thkap;":"≈","&thksim;":"∼","&thorn":"þ","&thorn;":"þ","&tilde;":"˜","&times":"×","&times;":"×","&timesb;":"⊠","&timesbar;":"⨱","&timesd;":"⨰","&tint;":"∭","&toea;":"⤨","&top;":"⊤","&topbot;":"⌶","&topcir;":"⫱","&topf;":"𝕥","&topfork;":"⫚","&tosa;":"⤩","&tprime;":"‴","&trade;":"™","&triangle;":"▵","&triangledown;":"▿","&triangleleft;":"◃","&trianglelefteq;":"⊴","&triangleq;":"≜","&triangleright;":"▹","&trianglerighteq;":"⊵","&tridot;":"◬","&trie;":"≜","&triminus;":"⨺","&triplus;":"⨹","&trisb;":"⧍","&tritime;":"⨻","&trpezium;":"⏢","&tscr;":"𝓉","&tscy;":"ц","&tshcy;":"ћ","&tstrok;":"ŧ","&twixt;":"≬","&twoheadleftarrow;":"↞","&twoheadrightarrow;":"↠","&uArr;":"⇑","&uHar;":"⥣","&uacute":"ú","&uacute;":"ú","&uarr;":"↑","&ubrcy;":"ў","&ubreve;":"ŭ","&ucirc":"û","&ucirc;":"û","&ucy;":"у","&udarr;":"⇅","&udblac;":"ű","&udhar;":"⥮","&ufisht;":"⥾","&ufr;":"𝔲","&ugrave":"ù","&ugrave;":"ù","&uharl;":"↿","&uharr;":"↾","&uhblk;":"▀","&ulcorn;":"⌜","&ulcorner;":"⌜","&ulcrop;":"⌏","&ultri;":"◸","&umacr;":"ū","&uml":"¨","&uml;":"¨","&uogon;":"ų","&uopf;":"𝕦","&uparrow;":"↑","&updownarrow;":"↕","&upharpoonleft;":"↿","&upharpoonright;":"↾","&uplus;":"⊎","&upsi;":"υ","&upsih;":"ϒ","&upsilon;":"υ","&upuparrows;":"⇈","&urcorn;":"⌝","&urcorner;":"⌝","&urcrop;":"⌎","&uring;":"ů","&urtri;":"◹","&uscr;":"𝓊","&utdot;":"⋰","&utilde;":"ũ","&utri;":"▵","&utrif;":"▴","&uuarr;":"⇈","&uuml":"ü","&uuml;":"ü","&uwangle;":"⦧","&vArr;":"⇕","&vBar;":"⫨","&vBarv;":"⫩","&vDash;":"⊨","&vangrt;":"⦜","&varepsilon;":"ϵ","&varkappa;":"ϰ","&varnothing;":"∅","&varphi;":"ϕ","&varpi;":"ϖ","&varpropto;":"∝","&varr;":"↕","&varrho;":"ϱ","&varsigma;":"ς","&varsubsetneq;":"⊊︀","&varsubsetneqq;":"⫋︀","&varsupsetneq;":"⊋︀","&varsupsetneqq;":"⫌︀","&vartheta;":"ϑ","&vartriangleleft;":"⊲","&vartriangleright;":"⊳","&vcy;":"в","&vdash;":"⊢","&vee;":"∨","&veebar;":"⊻","&veeeq;":"≚","&vellip;":"⋮","&verbar;":"|","&vert;":"|","&vfr;":"𝔳","&vltri;":"⊲","&vnsub;":"⊂⃒","&vnsup;":"⊃⃒","&vopf;":"𝕧","&vprop;":"∝","&vrtri;":"⊳","&vscr;":"𝓋","&vsubnE;":"⫋︀","&vsubne;":"⊊︀","&vsupnE;":"⫌︀","&vsupne;":"⊋︀","&vzigzag;":"⦚","&wcirc;":"ŵ","&wedbar;":"⩟","&wedge;":"∧","&wedgeq;":"≙","&weierp;":"℘","&wfr;":"𝔴","&wopf;":"𝕨","&wp;":"℘","&wr;":"≀","&wreath;":"≀","&wscr;":"𝓌","&xcap;":"⋂","&xcirc;":"◯","&xcup;":"⋃","&xdtri;":"▽","&xfr;":"𝔵","&xhArr;":"⟺","&xharr;":"⟷","&xi;":"ξ","&xlArr;":"⟸","&xlarr;":"⟵","&xmap;":"⟼","&xnis;":"⋻","&xodot;":"⨀","&xopf;":"𝕩","&xoplus;":"⨁","&xotime;":"⨂","&xrArr;":"⟹","&xrarr;":"⟶","&xscr;":"𝓍","&xsqcup;":"⨆","&xuplus;":"⨄","&xutri;":"△","&xvee;":"⋁","&xwedge;":"⋀","&yacute":"ý","&yacute;":"ý","&yacy;":"я","&ycirc;":"ŷ","&ycy;":"ы","&yen":"¥","&yen;":"¥","&yfr;":"𝔶","&yicy;":"ї","&yopf;":"𝕪","&yscr;":"𝓎","&yucy;":"ю","&yuml":"ÿ","&yuml;":"ÿ","&zacute;":"ź","&zcaron;":"ž","&zcy;":"з","&zdot;":"ż","&zeetrf;":"ℨ","&zeta;":"ζ","&zfr;":"𝔷","&zhcy;":"ж","&zigrarr;":"⇝","&zopf;":"𝕫","&zscr;":"𝓏","&zwj;":"‍","&zwnj;":"‌"},characters:{"Æ":"&AElig;","&":"&amp;","Á":"&Aacute;","Ă":"&Abreve;","Â":"&Acirc;","А":"&Acy;","𝔄":"&Afr;","À":"&Agrave;","Α":"&Alpha;","Ā":"&Amacr;","⩓":"&And;","Ą":"&Aogon;","𝔸":"&Aopf;","⁡":"&af;","Å":"&angst;","𝒜":"&Ascr;","≔":"&coloneq;","Ã":"&Atilde;","Ä":"&Auml;","∖":"&ssetmn;","⫧":"&Barv;","⌆":"&doublebarwedge;","Б":"&Bcy;","∵":"&because;","ℬ":"&bernou;","Β":"&Beta;","𝔅":"&Bfr;","𝔹":"&Bopf;","˘":"&breve;","≎":"&bump;","Ч":"&CHcy;","©":"&copy;","Ć":"&Cacute;","⋒":"&Cap;","ⅅ":"&DD;","ℭ":"&Cfr;","Č":"&Ccaron;","Ç":"&Ccedil;","Ĉ":"&Ccirc;","∰":"&Cconint;","Ċ":"&Cdot;","¸":"&cedil;","·":"&middot;","Χ":"&Chi;","⊙":"&odot;","⊖":"&ominus;","⊕":"&oplus;","⊗":"&otimes;","∲":"&cwconint;","”":"&rdquor;","’":"&rsquor;","∷":"&Proportion;","⩴":"&Colone;","≡":"&equiv;","∯":"&DoubleContourIntegral;","∮":"&oint;","ℂ":"&complexes;","∐":"&coprod;","∳":"&awconint;","⨯":"&Cross;","𝒞":"&Cscr;","⋓":"&Cup;","≍":"&asympeq;","⤑":"&DDotrahd;","Ђ":"&DJcy;","Ѕ":"&DScy;","Џ":"&DZcy;","‡":"&ddagger;","↡":"&Darr;","⫤":"&DoubleLeftTee;","Ď":"&Dcaron;","Д":"&Dcy;","∇":"&nabla;","Δ":"&Delta;","𝔇":"&Dfr;","´":"&acute;","˙":"&dot;","˝":"&dblac;","`":"&grave;","˜":"&tilde;","⋄":"&diamond;","ⅆ":"&dd;","𝔻":"&Dopf;","¨":"&uml;","⃜":"&DotDot;","≐":"&esdot;","⇓":"&dArr;","⇐":"&lArr;","⇔":"&iff;","⟸":"&xlArr;","⟺":"&xhArr;","⟹":"&xrArr;","⇒":"&rArr;","⊨":"&vDash;","⇑":"&uArr;","⇕":"&vArr;","∥":"&spar;","↓":"&downarrow;","⤓":"&DownArrowBar;","⇵":"&duarr;","̑":"&DownBreve;","⥐":"&DownLeftRightVector;","⥞":"&DownLeftTeeVector;","↽":"&lhard;","⥖":"&DownLeftVectorBar;","⥟":"&DownRightTeeVector;","⇁":"&rightharpoondown;","⥗":"&DownRightVectorBar;","⊤":"&top;","↧":"&mapstodown;","𝒟":"&Dscr;","Đ":"&Dstrok;","Ŋ":"&ENG;","Ð":"&ETH;","É":"&Eacute;","Ě":"&Ecaron;","Ê":"&Ecirc;","Э":"&Ecy;","Ė":"&Edot;","𝔈":"&Efr;","È":"&Egrave;","∈":"&isinv;","Ē":"&Emacr;","◻":"&EmptySmallSquare;","▫":"&EmptyVerySmallSquare;","Ę":"&Eogon;","𝔼":"&Eopf;","Ε":"&Epsilon;","⩵":"&Equal;","≂":"&esim;","⇌":"&rlhar;","ℰ":"&expectation;","⩳":"&Esim;","Η":"&Eta;","Ë":"&Euml;","∃":"&exist;","ⅇ":"&exponentiale;","Ф":"&Fcy;","𝔉":"&Ffr;","◼":"&FilledSmallSquare;","▪":"&squf;","𝔽":"&Fopf;","∀":"&forall;","ℱ":"&Fscr;","Ѓ":"&GJcy;",">":"&gt;","Γ":"&Gamma;","Ϝ":"&Gammad;","Ğ":"&Gbreve;","Ģ":"&Gcedil;","Ĝ":"&Gcirc;","Г":"&Gcy;","Ġ":"&Gdot;","𝔊":"&Gfr;","⋙":"&ggg;","𝔾":"&Gopf;","≥":"&geq;","⋛":"&gtreqless;","≧":"&geqq;","⪢":"&GreaterGreater;","≷":"&gtrless;","⩾":"&ges;","≳":"&gtrsim;","𝒢":"&Gscr;","≫":"&gg;","Ъ":"&HARDcy;","ˇ":"&caron;","^":"&Hat;","Ĥ":"&Hcirc;","ℌ":"&Poincareplane;","ℋ":"&hamilt;","ℍ":"&quaternions;","─":"&boxh;","Ħ":"&Hstrok;","≏":"&bumpeq;","Е":"&IEcy;","Ĳ":"&IJlig;","Ё":"&IOcy;","Í":"&Iacute;","Î":"&Icirc;","И":"&Icy;","İ":"&Idot;","ℑ":"&imagpart;","Ì":"&Igrave;","Ī":"&Imacr;","ⅈ":"&ii;","∬":"&Int;","∫":"&int;","⋂":"&xcap;","⁣":"&ic;","⁢":"&it;","Į":"&Iogon;","𝕀":"&Iopf;","Ι":"&Iota;","ℐ":"&imagline;","Ĩ":"&Itilde;","І":"&Iukcy;","Ï":"&Iuml;","Ĵ":"&Jcirc;","Й":"&Jcy;","𝔍":"&Jfr;","𝕁":"&Jopf;","𝒥":"&Jscr;","Ј":"&Jsercy;","Є":"&Jukcy;","Х":"&KHcy;","Ќ":"&KJcy;","Κ":"&Kappa;","Ķ":"&Kcedil;","К":"&Kcy;","𝔎":"&Kfr;","𝕂":"&Kopf;","𝒦":"&Kscr;","Љ":"&LJcy;","<":"&lt;","Ĺ":"&Lacute;","Λ":"&Lambda;","⟪":"&Lang;","ℒ":"&lagran;","↞":"&twoheadleftarrow;","Ľ":"&Lcaron;","Ļ":"&Lcedil;","Л":"&Lcy;","⟨":"&langle;","←":"&slarr;","⇤":"&larrb;","⇆":"&lrarr;","⌈":"&lceil;","⟦":"&lobrk;","⥡":"&LeftDownTeeVector;","⇃":"&downharpoonleft;","⥙":"&LeftDownVectorBar;","⌊":"&lfloor;","↔":"&leftrightarrow;","⥎":"&LeftRightVector;","⊣":"&dashv;","↤":"&mapstoleft;","⥚":"&LeftTeeVector;","⊲":"&vltri;","⧏":"&LeftTriangleBar;","⊴":"&trianglelefteq;","⥑":"&LeftUpDownVector;","⥠":"&LeftUpTeeVector;","↿":"&upharpoonleft;","⥘":"&LeftUpVectorBar;","↼":"&lharu;","⥒":"&LeftVectorBar;","⋚":"&lesseqgtr;","≦":"&leqq;","≶":"&lg;","⪡":"&LessLess;","⩽":"&les;","≲":"&lsim;","𝔏":"&Lfr;","⋘":"&Ll;","⇚":"&lAarr;","Ŀ":"&Lmidot;","⟵":"&xlarr;","⟷":"&xharr;","⟶":"&xrarr;","𝕃":"&Lopf;","↙":"&swarrow;","↘":"&searrow;","↰":"&lsh;","Ł":"&Lstrok;","≪":"&ll;","⤅":"&Map;","М":"&Mcy;"," ":"&MediumSpace;","ℳ":"&phmmat;","𝔐":"&Mfr;","∓":"&mp;","𝕄":"&Mopf;","Μ":"&Mu;","Њ":"&NJcy;","Ń":"&Nacute;","Ň":"&Ncaron;","Ņ":"&Ncedil;","Н":"&Ncy;","​":"&ZeroWidthSpace;","\n":"&NewLine;","𝔑":"&Nfr;","⁠":"&NoBreak;"," ":"&nbsp;","ℕ":"&naturals;","⫬":"&Not;","≢":"&nequiv;","≭":"&NotCupCap;","∦":"&nspar;","∉":"&notinva;","≠":"&ne;","≂̸":"&nesim;","∄":"&nexists;","≯":"&ngtr;","≱":"&ngeq;","≧̸":"&ngeqq;","≫̸":"&nGtv;","≹":"&ntgl;","⩾̸":"&nges;","≵":"&ngsim;","≎̸":"&nbump;","≏̸":"&nbumpe;","⋪":"&ntriangleleft;","⧏̸":"&NotLeftTriangleBar;","⋬":"&ntrianglelefteq;","≮":"&nlt;","≰":"&nleq;","≸":"&ntlg;","≪̸":"&nLtv;","⩽̸":"&nles;","≴":"&nlsim;","⪢̸":"&NotNestedGreaterGreater;","⪡̸":"&NotNestedLessLess;","⊀":"&nprec;","⪯̸":"&npreceq;","⋠":"&nprcue;","∌":"&notniva;","⋫":"&ntriangleright;","⧐̸":"&NotRightTriangleBar;","⋭":"&ntrianglerighteq;","⊏̸":"&NotSquareSubset;","⋢":"&nsqsube;","⊐̸":"&NotSquareSuperset;","⋣":"&nsqsupe;","⊂⃒":"&vnsub;","⊈":"&nsubseteq;","⊁":"&nsucc;","⪰̸":"&nsucceq;","⋡":"&nsccue;","≿̸":"&NotSucceedsTilde;","⊃⃒":"&vnsup;","⊉":"&nsupseteq;","≁":"&nsim;","≄":"&nsimeq;","≇":"&ncong;","≉":"&napprox;","∤":"&nsmid;","𝒩":"&Nscr;","Ñ":"&Ntilde;","Ν":"&Nu;","Œ":"&OElig;","Ó":"&Oacute;","Ô":"&Ocirc;","О":"&Ocy;","Ő":"&Odblac;","𝔒":"&Ofr;","Ò":"&Ograve;","Ō":"&Omacr;","Ω":"&ohm;","Ο":"&Omicron;","𝕆":"&Oopf;","“":"&ldquo;","‘":"&lsquo;","⩔":"&Or;","𝒪":"&Oscr;","Ø":"&Oslash;","Õ":"&Otilde;","⨷":"&Otimes;","Ö":"&Ouml;","‾":"&oline;","⏞":"&OverBrace;","⎴":"&tbrk;","⏜":"&OverParenthesis;","∂":"&part;","П":"&Pcy;","𝔓":"&Pfr;","Φ":"&Phi;","Π":"&Pi;","±":"&pm;","ℙ":"&primes;","⪻":"&Pr;","≺":"&prec;","⪯":"&preceq;","≼":"&preccurlyeq;","≾":"&prsim;","″":"&Prime;","∏":"&prod;","∝":"&vprop;","𝒫":"&Pscr;","Ψ":"&Psi;",'"':"&quot;","𝔔":"&Qfr;","ℚ":"&rationals;","𝒬":"&Qscr;","⤐":"&drbkarow;","®":"&reg;","Ŕ":"&Racute;","⟫":"&Rang;","↠":"&twoheadrightarrow;","⤖":"&Rarrtl;","Ř":"&Rcaron;","Ŗ":"&Rcedil;","Р":"&Rcy;","ℜ":"&realpart;","∋":"&niv;","⇋":"&lrhar;","⥯":"&duhar;","Ρ":"&Rho;","⟩":"&rangle;","→":"&srarr;","⇥":"&rarrb;","⇄":"&rlarr;","⌉":"&rceil;","⟧":"&robrk;","⥝":"&RightDownTeeVector;","⇂":"&downharpoonright;","⥕":"&RightDownVectorBar;","⌋":"&rfloor;","⊢":"&vdash;","↦":"&mapsto;","⥛":"&RightTeeVector;","⊳":"&vrtri;","⧐":"&RightTriangleBar;","⊵":"&trianglerighteq;","⥏":"&RightUpDownVector;","⥜":"&RightUpTeeVector;","↾":"&upharpoonright;","⥔":"&RightUpVectorBar;","⇀":"&rightharpoonup;","⥓":"&RightVectorBar;","ℝ":"&reals;","⥰":"&RoundImplies;","⇛":"&rAarr;","ℛ":"&realine;","↱":"&rsh;","⧴":"&RuleDelayed;","Щ":"&SHCHcy;","Ш":"&SHcy;","Ь":"&SOFTcy;","Ś":"&Sacute;","⪼":"&Sc;","Š":"&Scaron;","Ş":"&Scedil;","Ŝ":"&Scirc;","С":"&Scy;","𝔖":"&Sfr;","↑":"&uparrow;","Σ":"&Sigma;","∘":"&compfn;","𝕊":"&Sopf;","√":"&radic;","□":"&square;","⊓":"&sqcap;","⊏":"&sqsubset;","⊑":"&sqsubseteq;","⊐":"&sqsupset;","⊒":"&sqsupseteq;","⊔":"&sqcup;","𝒮":"&Sscr;","⋆":"&sstarf;","⋐":"&Subset;","⊆":"&subseteq;","≻":"&succ;","⪰":"&succeq;","≽":"&succcurlyeq;","≿":"&succsim;","∑":"&sum;","⋑":"&Supset;","⊃":"&supset;","⊇":"&supseteq;","Þ":"&THORN;","™":"&trade;","Ћ":"&TSHcy;","Ц":"&TScy;","\t":"&Tab;","Τ":"&Tau;","Ť":"&Tcaron;","Ţ":"&Tcedil;","Т":"&Tcy;","𝔗":"&Tfr;","∴":"&therefore;","Θ":"&Theta;","  ":"&ThickSpace;"," ":"&thinsp;","∼":"&thksim;","≃":"&simeq;","≅":"&cong;","≈":"&thkap;","𝕋":"&Topf;","⃛":"&tdot;","𝒯":"&Tscr;","Ŧ":"&Tstrok;","Ú":"&Uacute;","↟":"&Uarr;","⥉":"&Uarrocir;","Ў":"&Ubrcy;","Ŭ":"&Ubreve;","Û":"&Ucirc;","У":"&Ucy;","Ű":"&Udblac;","𝔘":"&Ufr;","Ù":"&Ugrave;","Ū":"&Umacr;",_:"&lowbar;","⏟":"&UnderBrace;","⎵":"&bbrk;","⏝":"&UnderParenthesis;","⋃":"&xcup;","⊎":"&uplus;","Ų":"&Uogon;","𝕌":"&Uopf;","⤒":"&UpArrowBar;","⇅":"&udarr;","↕":"&varr;","⥮":"&udhar;","⊥":"&perp;","↥":"&mapstoup;","↖":"&nwarrow;","↗":"&nearrow;","ϒ":"&upsih;","Υ":"&Upsilon;","Ů":"&Uring;","𝒰":"&Uscr;","Ũ":"&Utilde;","Ü":"&Uuml;","⊫":"&VDash;","⫫":"&Vbar;","В":"&Vcy;","⊩":"&Vdash;","⫦":"&Vdashl;","⋁":"&xvee;","‖":"&Vert;","∣":"&smid;","|":"&vert;","❘":"&VerticalSeparator;","≀":"&wreath;"," ":"&hairsp;","𝔙":"&Vfr;","𝕍":"&Vopf;","𝒱":"&Vscr;","⊪":"&Vvdash;","Ŵ":"&Wcirc;","⋀":"&xwedge;","𝔚":"&Wfr;","𝕎":"&Wopf;","𝒲":"&Wscr;","𝔛":"&Xfr;","Ξ":"&Xi;","𝕏":"&Xopf;","𝒳":"&Xscr;","Я":"&YAcy;","Ї":"&YIcy;","Ю":"&YUcy;","Ý":"&Yacute;","Ŷ":"&Ycirc;","Ы":"&Ycy;","𝔜":"&Yfr;","𝕐":"&Yopf;","𝒴":"&Yscr;","Ÿ":"&Yuml;","Ж":"&ZHcy;","Ź":"&Zacute;","Ž":"&Zcaron;","З":"&Zcy;","Ż":"&Zdot;","Ζ":"&Zeta;","ℨ":"&zeetrf;","ℤ":"&integers;","𝒵":"&Zscr;","á":"&aacute;","ă":"&abreve;","∾":"&mstpos;","∾̳":"&acE;","∿":"&acd;","â":"&acirc;","а":"&acy;","æ":"&aelig;","𝔞":"&afr;","à":"&agrave;","ℵ":"&aleph;","α":"&alpha;","ā":"&amacr;","⨿":"&amalg;","∧":"&wedge;","⩕":"&andand;","⩜":"&andd;","⩘":"&andslope;","⩚":"&andv;","∠":"&angle;","⦤":"&ange;","∡":"&measuredangle;","⦨":"&angmsdaa;","⦩":"&angmsdab;","⦪":"&angmsdac;","⦫":"&angmsdad;","⦬":"&angmsdae;","⦭":"&angmsdaf;","⦮":"&angmsdag;","⦯":"&angmsdah;","∟":"&angrt;","⊾":"&angrtvb;","⦝":"&angrtvbd;","∢":"&angsph;","⍼":"&angzarr;","ą":"&aogon;","𝕒":"&aopf;","⩰":"&apE;","⩯":"&apacir;","≊":"&approxeq;","≋":"&apid;","'":"&apos;","å":"&aring;","𝒶":"&ascr;","*":"&midast;","ã":"&atilde;","ä":"&auml;","⨑":"&awint;","⫭":"&bNot;","≌":"&bcong;","϶":"&bepsi;","‵":"&bprime;","∽":"&bsim;","⋍":"&bsime;","⊽":"&barvee;","⌅":"&barwedge;","⎶":"&bbrktbrk;","б":"&bcy;","„":"&ldquor;","⦰":"&bemptyv;","β":"&beta;","ℶ":"&beth;","≬":"&twixt;","𝔟":"&bfr;","◯":"&xcirc;","⨀":"&xodot;","⨁":"&xoplus;","⨂":"&xotime;","⨆":"&xsqcup;","★":"&starf;","▽":"&xdtri;","△":"&xutri;","⨄":"&xuplus;","⤍":"&rbarr;","⧫":"&lozf;","▴":"&utrif;","▾":"&dtrif;","◂":"&ltrif;","▸":"&rtrif;","␣":"&blank;","▒":"&blk12;","░":"&blk14;","▓":"&blk34;","█":"&block;","=⃥":"&bne;","≡⃥":"&bnequiv;","⌐":"&bnot;","𝕓":"&bopf;","⋈":"&bowtie;","╗":"&boxDL;","╔":"&boxDR;","╖":"&boxDl;","╓":"&boxDr;","═":"&boxH;","╦":"&boxHD;","╩":"&boxHU;","╤":"&boxHd;","╧":"&boxHu;","╝":"&boxUL;","╚":"&boxUR;","╜":"&boxUl;","╙":"&boxUr;","║":"&boxV;","╬":"&boxVH;","╣":"&boxVL;","╠":"&boxVR;","╫":"&boxVh;","╢":"&boxVl;","╟":"&boxVr;","⧉":"&boxbox;","╕":"&boxdL;","╒":"&boxdR;","┐":"&boxdl;","┌":"&boxdr;","╥":"&boxhD;","╨":"&boxhU;","┬":"&boxhd;","┴":"&boxhu;","⊟":"&minusb;","⊞":"&plusb;","⊠":"&timesb;","╛":"&boxuL;","╘":"&boxuR;","┘":"&boxul;","└":"&boxur;","│":"&boxv;","╪":"&boxvH;","╡":"&boxvL;","╞":"&boxvR;","┼":"&boxvh;","┤":"&boxvl;","├":"&boxvr;","¦":"&brvbar;","𝒷":"&bscr;","⁏":"&bsemi;","\\":"&bsol;","⧅":"&bsolb;","⟈":"&bsolhsub;","•":"&bullet;","⪮":"&bumpE;","ć":"&cacute;","∩":"&cap;","⩄":"&capand;","⩉":"&capbrcup;","⩋":"&capcap;","⩇":"&capcup;","⩀":"&capdot;","∩︀":"&caps;","⁁":"&caret;","⩍":"&ccaps;","č":"&ccaron;","ç":"&ccedil;","ĉ":"&ccirc;","⩌":"&ccups;","⩐":"&ccupssm;","ċ":"&cdot;","⦲":"&cemptyv;","¢":"&cent;","𝔠":"&cfr;","ч":"&chcy;","✓":"&checkmark;","χ":"&chi;","○":"&cir;","⧃":"&cirE;","ˆ":"&circ;","≗":"&cire;","↺":"&olarr;","↻":"&orarr;","Ⓢ":"&oS;","⊛":"&oast;","⊚":"&ocir;","⊝":"&odash;","⨐":"&cirfnint;","⫯":"&cirmid;","⧂":"&cirscir;","♣":"&clubsuit;",":":"&colon;",",":"&comma;","@":"&commat;","∁":"&complement;","⩭":"&congdot;","𝕔":"&copf;","℗":"&copysr;","↵":"&crarr;","✗":"&cross;","𝒸":"&cscr;","⫏":"&csub;","⫑":"&csube;","⫐":"&csup;","⫒":"&csupe;","⋯":"&ctdot;","⤸":"&cudarrl;","⤵":"&cudarrr;","⋞":"&curlyeqprec;","⋟":"&curlyeqsucc;","↶":"&curvearrowleft;","⤽":"&cularrp;","∪":"&cup;","⩈":"&cupbrcap;","⩆":"&cupcap;","⩊":"&cupcup;","⊍":"&cupdot;","⩅":"&cupor;","∪︀":"&cups;","↷":"&curvearrowright;","⤼":"&curarrm;","⋎":"&cuvee;","⋏":"&cuwed;","¤":"&curren;","∱":"&cwint;","⌭":"&cylcty;","⥥":"&dHar;","†":"&dagger;","ℸ":"&daleth;","‐":"&hyphen;","⤏":"&rBarr;","ď":"&dcaron;","д":"&dcy;","⇊":"&downdownarrows;","⩷":"&eDDot;","°":"&deg;","δ":"&delta;","⦱":"&demptyv;","⥿":"&dfisht;","𝔡":"&dfr;","♦":"&diams;","ϝ":"&gammad;","⋲":"&disin;","÷":"&divide;","⋇":"&divonx;","ђ":"&djcy;","⌞":"&llcorner;","⌍":"&dlcrop;",$:"&dollar;","𝕕":"&dopf;","≑":"&eDot;","∸":"&minusd;","∔":"&plusdo;","⊡":"&sdotb;","⌟":"&lrcorner;","⌌":"&drcrop;","𝒹":"&dscr;","ѕ":"&dscy;","⧶":"&dsol;","đ":"&dstrok;","⋱":"&dtdot;","▿":"&triangledown;","⦦":"&dwangle;","џ":"&dzcy;","⟿":"&dzigrarr;","é":"&eacute;","⩮":"&easter;","ě":"&ecaron;","≖":"&eqcirc;","ê":"&ecirc;","≕":"&eqcolon;","э":"&ecy;","ė":"&edot;","≒":"&fallingdotseq;","𝔢":"&efr;","⪚":"&eg;","è":"&egrave;","⪖":"&eqslantgtr;","⪘":"&egsdot;","⪙":"&el;","⏧":"&elinters;","ℓ":"&ell;","⪕":"&eqslantless;","⪗":"&elsdot;","ē":"&emacr;","∅":"&varnothing;"," ":"&emsp13;"," ":"&emsp14;"," ":"&emsp;","ŋ":"&eng;"," ":"&ensp;","ę":"&eogon;","𝕖":"&eopf;","⋕":"&epar;","⧣":"&eparsl;","⩱":"&eplus;","ε":"&epsilon;","ϵ":"&varepsilon;","=":"&equals;","≟":"&questeq;","⩸":"&equivDD;","⧥":"&eqvparsl;","≓":"&risingdotseq;","⥱":"&erarr;","ℯ":"&escr;","η":"&eta;","ð":"&eth;","ë":"&euml;","€":"&euro;","!":"&excl;","ф":"&fcy;","♀":"&female;","ﬃ":"&ffilig;","ﬀ":"&fflig;","ﬄ":"&ffllig;","𝔣":"&ffr;","ﬁ":"&filig;",fj:"&fjlig;","♭":"&flat;","ﬂ":"&fllig;","▱":"&fltns;","ƒ":"&fnof;","𝕗":"&fopf;","⋔":"&pitchfork;","⫙":"&forkv;","⨍":"&fpartint;","½":"&half;","⅓":"&frac13;","¼":"&frac14;","⅕":"&frac15;","⅙":"&frac16;","⅛":"&frac18;","⅔":"&frac23;","⅖":"&frac25;","¾":"&frac34;","⅗":"&frac35;","⅜":"&frac38;","⅘":"&frac45;","⅚":"&frac56;","⅝":"&frac58;","⅞":"&frac78;","⁄":"&frasl;","⌢":"&sfrown;","𝒻":"&fscr;","⪌":"&gtreqqless;","ǵ":"&gacute;","γ":"&gamma;","⪆":"&gtrapprox;","ğ":"&gbreve;","ĝ":"&gcirc;","г":"&gcy;","ġ":"&gdot;","⪩":"&gescc;","⪀":"&gesdot;","⪂":"&gesdoto;","⪄":"&gesdotol;","⋛︀":"&gesl;","⪔":"&gesles;","𝔤":"&gfr;","ℷ":"&gimel;","ѓ":"&gjcy;","⪒":"&glE;","⪥":"&gla;","⪤":"&glj;","≩":"&gneqq;","⪊":"&gnapprox;","⪈":"&gneq;","⋧":"&gnsim;","𝕘":"&gopf;","ℊ":"&gscr;","⪎":"&gsime;","⪐":"&gsiml;","⪧":"&gtcc;","⩺":"&gtcir;","⋗":"&gtrdot;","⦕":"&gtlPar;","⩼":"&gtquest;","⥸":"&gtrarr;","≩︀":"&gvnE;","ъ":"&hardcy;","⥈":"&harrcir;","↭":"&leftrightsquigarrow;","ℏ":"&plankv;","ĥ":"&hcirc;","♥":"&heartsuit;","…":"&mldr;","⊹":"&hercon;","𝔥":"&hfr;","⤥":"&searhk;","⤦":"&swarhk;","⇿":"&hoarr;","∻":"&homtht;","↩":"&larrhk;","↪":"&rarrhk;","𝕙":"&hopf;","―":"&horbar;","𝒽":"&hscr;","ħ":"&hstrok;","⁃":"&hybull;","í":"&iacute;","î":"&icirc;","и":"&icy;","е":"&iecy;","¡":"&iexcl;","𝔦":"&ifr;","ì":"&igrave;","⨌":"&qint;","∭":"&tint;","⧜":"&iinfin;","℩":"&iiota;","ĳ":"&ijlig;","ī":"&imacr;","ı":"&inodot;","⊷":"&imof;","Ƶ":"&imped;","℅":"&incare;","∞":"&infin;","⧝":"&infintie;","⊺":"&intercal;","⨗":"&intlarhk;","⨼":"&iprod;","ё":"&iocy;","į":"&iogon;","𝕚":"&iopf;","ι":"&iota;","¿":"&iquest;","𝒾":"&iscr;","⋹":"&isinE;","⋵":"&isindot;","⋴":"&isins;","⋳":"&isinsv;","ĩ":"&itilde;","і":"&iukcy;","ï":"&iuml;","ĵ":"&jcirc;","й":"&jcy;","𝔧":"&jfr;","ȷ":"&jmath;","𝕛":"&jopf;","𝒿":"&jscr;","ј":"&jsercy;","є":"&jukcy;","κ":"&kappa;","ϰ":"&varkappa;","ķ":"&kcedil;","к":"&kcy;","𝔨":"&kfr;","ĸ":"&kgreen;","х":"&khcy;","ќ":"&kjcy;","𝕜":"&kopf;","𝓀":"&kscr;","⤛":"&lAtail;","⤎":"&lBarr;","⪋":"&lesseqqgtr;","⥢":"&lHar;","ĺ":"&lacute;","⦴":"&laemptyv;","λ":"&lambda;","⦑":"&langd;","⪅":"&lessapprox;","«":"&laquo;","⤟":"&larrbfs;","⤝":"&larrfs;","↫":"&looparrowleft;","⤹":"&larrpl;","⥳":"&larrsim;","↢":"&leftarrowtail;","⪫":"&lat;","⤙":"&latail;","⪭":"&late;","⪭︀":"&lates;","⤌":"&lbarr;","❲":"&lbbrk;","{":"&lcub;","[":"&lsqb;","⦋":"&lbrke;","⦏":"&lbrksld;","⦍":"&lbrkslu;","ľ":"&lcaron;","ļ":"&lcedil;","л":"&lcy;","⤶":"&ldca;","⥧":"&ldrdhar;","⥋":"&ldrushar;","↲":"&ldsh;","≤":"&leq;","⇇":"&llarr;","⋋":"&lthree;","⪨":"&lescc;","⩿":"&lesdot;","⪁":"&lesdoto;","⪃":"&lesdotor;","⋚︀":"&lesg;","⪓":"&lesges;","⋖":"&ltdot;","⥼":"&lfisht;","𝔩":"&lfr;","⪑":"&lgE;","⥪":"&lharul;","▄":"&lhblk;","љ":"&ljcy;","⥫":"&llhard;","◺":"&lltri;","ŀ":"&lmidot;","⎰":"&lmoustache;","≨":"&lneqq;","⪉":"&lnapprox;","⪇":"&lneq;","⋦":"&lnsim;","⟬":"&loang;","⇽":"&loarr;","⟼":"&xmap;","↬":"&rarrlp;","⦅":"&lopar;","𝕝":"&lopf;","⨭":"&loplus;","⨴":"&lotimes;","∗":"&lowast;","◊":"&lozenge;","(":"&lpar;","⦓":"&lparlt;","⥭":"&lrhard;","‎":"&lrm;","⊿":"&lrtri;","‹":"&lsaquo;","𝓁":"&lscr;","⪍":"&lsime;","⪏":"&lsimg;","‚":"&sbquo;","ł":"&lstrok;","⪦":"&ltcc;","⩹":"&ltcir;","⋉":"&ltimes;","⥶":"&ltlarr;","⩻":"&ltquest;","⦖":"&ltrPar;","◃":"&triangleleft;","⥊":"&lurdshar;","⥦":"&luruhar;","≨︀":"&lvnE;","∺":"&mDDot;","¯":"&strns;","♂":"&male;","✠":"&maltese;","▮":"&marker;","⨩":"&mcomma;","м":"&mcy;","—":"&mdash;","𝔪":"&mfr;","℧":"&mho;","µ":"&micro;","⫰":"&midcir;","−":"&minus;","⨪":"&minusdu;","⫛":"&mlcp;","⊧":"&models;","𝕞":"&mopf;","𝓂":"&mscr;","μ":"&mu;","⊸":"&mumap;","⋙̸":"&nGg;","≫⃒":"&nGt;","⇍":"&nlArr;","⇎":"&nhArr;","⋘̸":"&nLl;","≪⃒":"&nLt;","⇏":"&nrArr;","⊯":"&nVDash;","⊮":"&nVdash;","ń":"&nacute;","∠⃒":"&nang;","⩰̸":"&napE;","≋̸":"&napid;","ŉ":"&napos;","♮":"&natural;","⩃":"&ncap;","ň":"&ncaron;","ņ":"&ncedil;","⩭̸":"&ncongdot;","⩂":"&ncup;","н":"&ncy;","–":"&ndash;","⇗":"&neArr;","⤤":"&nearhk;","≐̸":"&nedot;","⤨":"&toea;","𝔫":"&nfr;","↮":"&nleftrightarrow;","⫲":"&nhpar;","⋼":"&nis;","⋺":"&nisd;","њ":"&njcy;","≦̸":"&nleqq;","↚":"&nleftarrow;","‥":"&nldr;","𝕟":"&nopf;","¬":"&not;","⋹̸":"&notinE;","⋵̸":"&notindot;","⋷":"&notinvb;","⋶":"&notinvc;","⋾":"&notnivb;","⋽":"&notnivc;","⫽⃥":"&nparsl;","∂̸":"&npart;","⨔":"&npolint;","↛":"&nrightarrow;","⤳̸":"&nrarrc;","↝̸":"&nrarrw;","𝓃":"&nscr;","⊄":"&nsub;","⫅̸":"&nsubseteqq;","⊅":"&nsup;","⫆̸":"&nsupseteqq;","ñ":"&ntilde;","ν":"&nu;","#":"&num;","№":"&numero;"," ":"&numsp;","⊭":"&nvDash;","⤄":"&nvHarr;","≍⃒":"&nvap;","⊬":"&nvdash;","≥⃒":"&nvge;",">⃒":"&nvgt;","⧞":"&nvinfin;","⤂":"&nvlArr;","≤⃒":"&nvle;","<⃒":"&nvlt;","⊴⃒":"&nvltrie;","⤃":"&nvrArr;","⊵⃒":"&nvrtrie;","∼⃒":"&nvsim;","⇖":"&nwArr;","⤣":"&nwarhk;","⤧":"&nwnear;","ó":"&oacute;","ô":"&ocirc;","о":"&ocy;","ő":"&odblac;","⨸":"&odiv;","⦼":"&odsold;","œ":"&oelig;","⦿":"&ofcir;","𝔬":"&ofr;","˛":"&ogon;","ò":"&ograve;","⧁":"&ogt;","⦵":"&ohbar;","⦾":"&olcir;","⦻":"&olcross;","⧀":"&olt;","ō":"&omacr;","ω":"&omega;","ο":"&omicron;","⦶":"&omid;","𝕠":"&oopf;","⦷":"&opar;","⦹":"&operp;","∨":"&vee;","⩝":"&ord;","ℴ":"&oscr;","ª":"&ordf;","º":"&ordm;","⊶":"&origof;","⩖":"&oror;","⩗":"&orslope;","⩛":"&orv;","ø":"&oslash;","⊘":"&osol;","õ":"&otilde;","⨶":"&otimesas;","ö":"&ouml;","⌽":"&ovbar;","¶":"&para;","⫳":"&parsim;","⫽":"&parsl;","п":"&pcy;","%":"&percnt;",".":"&period;","‰":"&permil;","‱":"&pertenk;","𝔭":"&pfr;","φ":"&phi;","ϕ":"&varphi;","☎":"&phone;","π":"&pi;","ϖ":"&varpi;","ℎ":"&planckh;","+":"&plus;","⨣":"&plusacir;","⨢":"&pluscir;","⨥":"&plusdu;","⩲":"&pluse;","⨦":"&plussim;","⨧":"&plustwo;","⨕":"&pointint;","𝕡":"&popf;","£":"&pound;","⪳":"&prE;","⪷":"&precapprox;","⪹":"&prnap;","⪵":"&prnE;","⋨":"&prnsim;","′":"&prime;","⌮":"&profalar;","⌒":"&profline;","⌓":"&profsurf;","⊰":"&prurel;","𝓅":"&pscr;","ψ":"&psi;"," ":"&puncsp;","𝔮":"&qfr;","𝕢":"&qopf;","⁗":"&qprime;","𝓆":"&qscr;","⨖":"&quatint;","?":"&quest;","⤜":"&rAtail;","⥤":"&rHar;","∽̱":"&race;","ŕ":"&racute;","⦳":"&raemptyv;","⦒":"&rangd;","⦥":"&range;","»":"&raquo;","⥵":"&rarrap;","⤠":"&rarrbfs;","⤳":"&rarrc;","⤞":"&rarrfs;","⥅":"&rarrpl;","⥴":"&rarrsim;","↣":"&rightarrowtail;","↝":"&rightsquigarrow;","⤚":"&ratail;","∶":"&ratio;","❳":"&rbbrk;","}":"&rcub;","]":"&rsqb;","⦌":"&rbrke;","⦎":"&rbrksld;","⦐":"&rbrkslu;","ř":"&rcaron;","ŗ":"&rcedil;","р":"&rcy;","⤷":"&rdca;","⥩":"&rdldhar;","↳":"&rdsh;","▭":"&rect;","⥽":"&rfisht;","𝔯":"&rfr;","⥬":"&rharul;","ρ":"&rho;","ϱ":"&varrho;","⇉":"&rrarr;","⋌":"&rthree;","˚":"&ring;","‏":"&rlm;","⎱":"&rmoustache;","⫮":"&rnmid;","⟭":"&roang;","⇾":"&roarr;","⦆":"&ropar;","𝕣":"&ropf;","⨮":"&roplus;","⨵":"&rotimes;",")":"&rpar;","⦔":"&rpargt;","⨒":"&rppolint;","›":"&rsaquo;","𝓇":"&rscr;","⋊":"&rtimes;","▹":"&triangleright;","⧎":"&rtriltri;","⥨":"&ruluhar;","℞":"&rx;","ś":"&sacute;","⪴":"&scE;","⪸":"&succapprox;","š":"&scaron;","ş":"&scedil;","ŝ":"&scirc;","⪶":"&succneqq;","⪺":"&succnapprox;","⋩":"&succnsim;","⨓":"&scpolint;","с":"&scy;","⋅":"&sdot;","⩦":"&sdote;","⇘":"&seArr;","§":"&sect;",";":"&semi;","⤩":"&tosa;","✶":"&sext;","𝔰":"&sfr;","♯":"&sharp;","щ":"&shchcy;","ш":"&shcy;","­":"&shy;","σ":"&sigma;","ς":"&varsigma;","⩪":"&simdot;","⪞":"&simg;","⪠":"&simgE;","⪝":"&siml;","⪟":"&simlE;","≆":"&simne;","⨤":"&simplus;","⥲":"&simrarr;","⨳":"&smashp;","⧤":"&smeparsl;","⌣":"&ssmile;","⪪":"&smt;","⪬":"&smte;","⪬︀":"&smtes;","ь":"&softcy;","/":"&sol;","⧄":"&solb;","⌿":"&solbar;","𝕤":"&sopf;","♠":"&spadesuit;","⊓︀":"&sqcaps;","⊔︀":"&sqcups;","𝓈":"&sscr;","☆":"&star;","⊂":"&subset;","⫅":"&subseteqq;","⪽":"&subdot;","⫃":"&subedot;","⫁":"&submult;","⫋":"&subsetneqq;","⊊":"&subsetneq;","⪿":"&subplus;","⥹":"&subrarr;","⫇":"&subsim;","⫕":"&subsub;","⫓":"&subsup;","♪":"&sung;","¹":"&sup1;","²":"&sup2;","³":"&sup3;","⫆":"&supseteqq;","⪾":"&supdot;","⫘":"&supdsub;","⫄":"&supedot;","⟉":"&suphsol;","⫗":"&suphsub;","⥻":"&suplarr;","⫂":"&supmult;","⫌":"&supsetneqq;","⊋":"&supsetneq;","⫀":"&supplus;","⫈":"&supsim;","⫔":"&supsub;","⫖":"&supsup;","⇙":"&swArr;","⤪":"&swnwar;","ß":"&szlig;","⌖":"&target;","τ":"&tau;","ť":"&tcaron;","ţ":"&tcedil;","т":"&tcy;","⌕":"&telrec;","𝔱":"&tfr;","θ":"&theta;","ϑ":"&vartheta;","þ":"&thorn;","×":"&times;","⨱":"&timesbar;","⨰":"&timesd;","⌶":"&topbot;","⫱":"&topcir;","𝕥":"&topf;","⫚":"&topfork;","‴":"&tprime;","▵":"&utri;","≜":"&trie;","◬":"&tridot;","⨺":"&triminus;","⨹":"&triplus;","⧍":"&trisb;","⨻":"&tritime;","⏢":"&trpezium;","𝓉":"&tscr;","ц":"&tscy;","ћ":"&tshcy;","ŧ":"&tstrok;","⥣":"&uHar;","ú":"&uacute;","ў":"&ubrcy;","ŭ":"&ubreve;","û":"&ucirc;","у":"&ucy;","ű":"&udblac;","⥾":"&ufisht;","𝔲":"&ufr;","ù":"&ugrave;","▀":"&uhblk;","⌜":"&ulcorner;","⌏":"&ulcrop;","◸":"&ultri;","ū":"&umacr;","ų":"&uogon;","𝕦":"&uopf;","υ":"&upsilon;","⇈":"&uuarr;","⌝":"&urcorner;","⌎":"&urcrop;","ů":"&uring;","◹":"&urtri;","𝓊":"&uscr;","⋰":"&utdot;","ũ":"&utilde;","ü":"&uuml;","⦧":"&uwangle;","⫨":"&vBar;","⫩":"&vBarv;","⦜":"&vangrt;","⊊︀":"&vsubne;","⫋︀":"&vsubnE;","⊋︀":"&vsupne;","⫌︀":"&vsupnE;","в":"&vcy;","⊻":"&veebar;","≚":"&veeeq;","⋮":"&vellip;","𝔳":"&vfr;","𝕧":"&vopf;","𝓋":"&vscr;","⦚":"&vzigzag;","ŵ":"&wcirc;","⩟":"&wedbar;","≙":"&wedgeq;","℘":"&wp;","𝔴":"&wfr;","𝕨":"&wopf;","𝓌":"&wscr;","𝔵":"&xfr;","ξ":"&xi;","⋻":"&xnis;","𝕩":"&xopf;","𝓍":"&xscr;","ý":"&yacute;","я":"&yacy;","ŷ":"&ycirc;","ы":"&ycy;","¥":"&yen;","𝔶":"&yfr;","ї":"&yicy;","𝕪":"&yopf;","𝓎":"&yscr;","ю":"&yucy;","ÿ":"&yuml;","ź":"&zacute;","ž":"&zcaron;","з":"&zcy;","ż":"&zdot;","ζ":"&zeta;","𝔷":"&zfr;","ж":"&zhcy;","⇝":"&zigrarr;","𝕫":"&zopf;","𝓏":"&zscr;","‍":"&zwj;","‌":"&zwnj;"}}};
});

var numericUnicodeMap = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:true});exports.numericUnicodeMap={0:65533,128:8364,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,142:381,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,158:382,159:376};
});

var surrogatePairs = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports,"__esModule",{value:true});exports.fromCodePoint=String.fromCodePoint||function(astralCodePoint){return String.fromCharCode(Math.floor((astralCodePoint-65536)/1024)+55296,(astralCodePoint-65536)%1024+56320)};exports.getCodePoint=String.prototype.codePointAt?function(input,position){return input.codePointAt(position)}:function(input,position){return (input.charCodeAt(position)-55296)*1024+input.charCodeAt(position+1)-56320+65536};exports.highSurrogateFrom=55296;exports.highSurrogateTo=56319;
});

var named_references_1 = namedReferences;

var numeric_unicode_map_1 = numericUnicodeMap;

var surrogate_pairs_1 = surrogatePairs;

var lib = createCommonjsModule(function (module, exports) {
var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });



var allNamedReferences = __assign(__assign({}, named_references_1.namedReferences), { all: named_references_1.namedReferences.html5 });
var encodeRegExps = {
    specialChars: /[<>'"&]/g,
    nonAscii: /(?:[<>'"&\u0080-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g,
    nonAsciiPrintable: /(?:[<>'"&\x01-\x08\x11-\x15\x17-\x1F\x7f-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g,
    extensive: /(?:[\x01-\x0c\x0e-\x1f\x21-\x2c\x2e-\x2f\x3a-\x40\x5b-\x60\x7b-\x7d\x7f-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g
};
var defaultEncodeOptions = {
    mode: 'specialChars',
    level: 'all',
    numeric: 'decimal'
};
/** Encodes all the necessary (specified by `level`) characters in the text */
function encode(text, _a) {
    var _b = _a === void 0 ? defaultEncodeOptions : _a, _c = _b.mode, mode = _c === void 0 ? 'specialChars' : _c, _d = _b.numeric, numeric = _d === void 0 ? 'decimal' : _d, _e = _b.level, level = _e === void 0 ? 'all' : _e;
    if (!text) {
        return '';
    }
    var encodeRegExp = encodeRegExps[mode];
    var references = allNamedReferences[level].characters;
    var isHex = numeric === 'hexadecimal';
    encodeRegExp.lastIndex = 0;
    var _b = encodeRegExp.exec(text);
    var _c;
    if (_b) {
        _c = '';
        var _d = 0;
        do {
            if (_d !== _b.index) {
                _c += text.substring(_d, _b.index);
            }
            var _e = _b[0];
            var result_1 = references[_e];
            if (!result_1) {
                var code_1 = _e.length > 1 ? surrogate_pairs_1.getCodePoint(_e, 0) : _e.charCodeAt(0);
                result_1 = (isHex ? '&#x' + code_1.toString(16) : '&#' + code_1) + ';';
            }
            _c += result_1;
            _d = _b.index + _e.length;
        } while ((_b = encodeRegExp.exec(text)));
        if (_d !== text.length) {
            _c += text.substring(_d);
        }
    }
    else {
        _c =
            text;
    }
    return _c;
}
exports.encode = encode;
var defaultDecodeOptions = {
    scope: 'body',
    level: 'all'
};
var strict = /&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);/g;
var attribute = /&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+)[;=]?/g;
var baseDecodeRegExps = {
    xml: {
        strict: strict,
        attribute: attribute,
        body: named_references_1.bodyRegExps.xml
    },
    html4: {
        strict: strict,
        attribute: attribute,
        body: named_references_1.bodyRegExps.html4
    },
    html5: {
        strict: strict,
        attribute: attribute,
        body: named_references_1.bodyRegExps.html5
    }
};
var decodeRegExps = __assign(__assign({}, baseDecodeRegExps), { all: baseDecodeRegExps.html5 });
var fromCharCode = String.fromCharCode;
var outOfBoundsChar = fromCharCode(65533);
var defaultDecodeEntityOptions = {
    level: 'all'
};
/** Decodes a single entity */
function decodeEntity(entity, _a) {
    var _b = (_a === void 0 ? defaultDecodeEntityOptions : _a).level, level = _b === void 0 ? 'all' : _b;
    if (!entity) {
        return '';
    }
    var _b = entity;
    entity[entity.length - 1];
    {
        var decodeResultByReference_1 = allNamedReferences[level].entities[entity];
        if (decodeResultByReference_1) {
            _b = decodeResultByReference_1;
        }
        else if (entity[0] === '&' && entity[1] === '#') {
            var decodeSecondChar_1 = entity[2];
            var decodeCode_1 = decodeSecondChar_1 == 'x' || decodeSecondChar_1 == 'X'
                ? parseInt(entity.substr(3), 16)
                : parseInt(entity.substr(2));
            _b =
                decodeCode_1 >= 0x10ffff
                    ? outOfBoundsChar
                    : decodeCode_1 > 65535
                        ? surrogate_pairs_1.fromCodePoint(decodeCode_1)
                        : fromCharCode(numeric_unicode_map_1.numericUnicodeMap[decodeCode_1] || decodeCode_1);
        }
    }
    return _b;
}
exports.decodeEntity = decodeEntity;
/** Decodes all entities in the text */
function decode(text, _a) {
    var decodeSecondChar_1 = _a === void 0 ? defaultDecodeOptions : _a, decodeCode_1 = decodeSecondChar_1.level, level = decodeCode_1 === void 0 ? 'all' : decodeCode_1, _b = decodeSecondChar_1.scope, scope = _b === void 0 ? level === 'xml' ? 'strict' : 'body' : _b;
    if (!text) {
        return '';
    }
    var decodeRegExp = decodeRegExps[level][scope];
    var references = allNamedReferences[level].entities;
    var isAttribute = scope === 'attribute';
    var isStrict = scope === 'strict';
    decodeRegExp.lastIndex = 0;
    var replaceMatch_1 = decodeRegExp.exec(text);
    var replaceResult_1;
    if (replaceMatch_1) {
        replaceResult_1 = '';
        var replaceLastIndex_1 = 0;
        do {
            if (replaceLastIndex_1 !== replaceMatch_1.index) {
                replaceResult_1 += text.substring(replaceLastIndex_1, replaceMatch_1.index);
            }
            var replaceInput_1 = replaceMatch_1[0];
            var decodeResult_1 = replaceInput_1;
            var decodeEntityLastChar_2 = replaceInput_1[replaceInput_1.length - 1];
            if (isAttribute
                && decodeEntityLastChar_2 === '=') {
                decodeResult_1 = replaceInput_1;
            }
            else if (isStrict
                && decodeEntityLastChar_2 !== ';') {
                decodeResult_1 = replaceInput_1;
            }
            else {
                var decodeResultByReference_2 = references[replaceInput_1];
                if (decodeResultByReference_2) {
                    decodeResult_1 = decodeResultByReference_2;
                }
                else if (replaceInput_1[0] === '&' && replaceInput_1[1] === '#') {
                    var decodeSecondChar_2 = replaceInput_1[2];
                    var decodeCode_2 = decodeSecondChar_2 == 'x' || decodeSecondChar_2 == 'X'
                        ? parseInt(replaceInput_1.substr(3), 16)
                        : parseInt(replaceInput_1.substr(2));
                    decodeResult_1 =
                        decodeCode_2 >= 0x10ffff
                            ? outOfBoundsChar
                            : decodeCode_2 > 65535
                                ? surrogate_pairs_1.fromCodePoint(decodeCode_2)
                                : fromCharCode(numeric_unicode_map_1.numericUnicodeMap[decodeCode_2] || decodeCode_2);
                }
            }
            replaceResult_1 += decodeResult_1;
            replaceLastIndex_1 = replaceMatch_1.index + replaceInput_1.length;
        } while ((replaceMatch_1 = decodeRegExp.exec(text)));
        if (replaceLastIndex_1 !== text.length) {
            replaceResult_1 += text.substring(replaceLastIndex_1);
        }
    }
    else {
        replaceResult_1 =
            text;
    }
    return replaceResult_1;
}
exports.decode = decode;
});

var S_ANNOTATION_TYPE = {
  transcript: 1,
  caption: 2,
  both: 3
};
var DEFAULT_ERROR_MESSAGE = "Error encountered. Please check your Manifest.";
var GENERIC_ERROR_MESSAGE = DEFAULT_ERROR_MESSAGE;
var DEFAULT_EMPTY_MANIFEST_MESSAGE = "No media resource(s). Please check your Manifest.";
var GENERIC_EMPTY_MANIFEST_MESSAGE = DEFAULT_EMPTY_MANIFEST_MESSAGE;

// Timer for displaying placeholderCanvas text when a Canvas is empty
var DEFAULT_TIMEOUT = 10000;
var CANVAS_MESSAGE_TIMEOUT = DEFAULT_TIMEOUT;

/**
 * Sets the timer for displaying the placeholderCanvas text in the player
 * for an empty Canvas. This value defaults to 3 seconds, if the `duration`
 * property of the placeholderCanvas is undefined
 * @param {Number} timeout duration of the placeholderCanvas if given
 */
function setCanvasMessageTimeout(timeout) {
  CANVAS_MESSAGE_TIMEOUT = timeout || DEFAULT_TIMEOUT;
}

/**
 * Sets the generic error message in the ErrorBoundary when the
 * components fail with critical error. This defaults to the given
 * value when a custom message is not specified in the `customErrorMessage`
 * prop of the IIIFPlayer component
 * @param {String} message custom error message from props
 */
function setAppErrorMessage(message) {
  GENERIC_ERROR_MESSAGE = message || DEFAULT_ERROR_MESSAGE;
}

/**
 * Sets a generic error message when the given IIIF Manifest has not
 * items in it yet. Example scenario: empty playlist. This defaults to the given
 * value when a custom message is not specified in the `emptyManifestMessage`
 * prop of the IIIFPlayer component
 * @param {String} message custom error message from props
 */
function setAppEmptyManifestMessage(message) {
  GENERIC_EMPTY_MANIFEST_MESSAGE = message || DEFAULT_EMPTY_MANIFEST_MESSAGE;
}
function parseSequences(manifest) {
  var sequences = parseManifest(manifest).getSequences();
  if (sequences != undefined && sequences[0] != undefined) {
    return sequences;
  } else {
    throw new Error(GENERIC_ERROR_MESSAGE);
  }
}

/**
 * Convert the time in seconds to hh:mm:ss.ms format.
 * Ex: timeToHHmmss(2.836, showHrs=true, showMs=true) => 00:00:02.836
 * timeToHHmmss(362.836, showHrs=true, showMs=true) => 01:00:02.836
 * timeToHHmmss(362.836, showHrs=true) => 01:00:02
 * @param {Number} secTime time in seconds
 * @param {Boolean} showHrs to/not to display hours
 * @param {Boolean} showMs to/not to display .ms
 * @returns {String} time as a string
 */
function timeToHHmmss(secTime) {
  var showHrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var showMs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  if (isNaN(secTime)) {
    return '';
  }
  var hours = Math.floor(secTime / 3600);
  var minutes = Math.floor(secTime % 3600 / 60);
  var seconds = secTime - minutes * 60 - hours * 3600;
  var timeStr = '';
  var hourStr = hours < 10 ? "0".concat(hours) : "".concat(hours);
  timeStr = showHrs || hours > 0 ? timeStr + "".concat(hourStr, ":") : timeStr;
  var minStr = minutes < 10 ? "0".concat(minutes) : "".concat(minutes);
  timeStr = timeStr + "".concat(minStr, ":");
  var secStr = showMs ? seconds.toFixed(3) : parseInt(seconds);
  secStr = seconds < 10 ? "0".concat(secStr) : "".concat(secStr);
  timeStr = timeStr + "".concat(secStr);
  return timeStr;
}

/**
 * Convert time from hh:mm:ss.ms/mm:ss.ms string format to int
 * @param {String} time convert time from string to int
 */
function timeToS(time) {
  var _time$split$reverse = time.split(':').reverse(),
    _time$split$reverse2 = _slicedToArray(_time$split$reverse, 3),
    seconds = _time$split$reverse2[0],
    minutes = _time$split$reverse2[1],
    hours = _time$split$reverse2[2];
  var hoursInS = hours != undefined ? parseInt(hours) * 3600 : 0;
  var minutesInS = minutes != undefined ? parseInt(minutes) * 60 : 0;
  // Replace decimal separator if it is a comma
  var secondsNum = seconds === '' ? 0.0 : parseFloat(seconds.replace(',', '.'));
  var timeSeconds = hoursInS + minutesInS + secondsNum;
  return timeSeconds;
}
function handleFetchErrors(response) {
  if (!response.ok) {
    throw new Error(GENERIC_ERROR_MESSAGE);
  }
  return response;
}

/**
 * Identify a segment is within the given playable range. 
 * If BOTH start and end times of the segment is outside of the given range => false
 * @param {Object} segmentRange JSON with start, end times of segment
 * @param {Object} range JSON with end time of media/media-fragment in player
 * @returns 
 */
function checkSrcRange(segmentRange, range) {
  if (segmentRange === undefined) {
    return false;
  } else if (range === undefined) {
    return true;
  } else if (segmentRange.start > range.end && segmentRange.end > range.end) {
    return false;
  } else {
    return true;
  }
}

/**
 * Get the target range when multiple items are rendered from a
 * single canvas.
 * @param {Array} targets set of ranges painted on the canvas as items
 * @param {Object} timeFragment current time fragment displayed in player
 * @param {Number} duration duration of the current item
 * @returns {Object}
 */
function getCanvasTarget(targets, timeFragment, duration) {
  var srcIndex, fragmentStart;
  targets.map(function (t, i) {
    // Get the previous item endtime for multi-item canvases
    var previousEnd = i > 0 ? targets[i].altStart : 0;
    // Fill in missing end time
    if (isNaN(end)) end = duration;
    var start = t.start,
      end = t.end;
    // Adjust times for multi-item canvases
    var startTime = previousEnd + start;
    var endTime = previousEnd + end;
    if (timeFragment.start >= startTime && timeFragment.start < endTime) {
      srcIndex = i;
      // Adjust time fragment start time for multi-item canvases
      fragmentStart = timeFragment.start - previousEnd;
    }
  });
  return {
    srcIndex: srcIndex,
    fragmentStart: fragmentStart
  };
}

/**
 * Facilitate file download
 * @param {String} fileUrl url of file
 * @param {String} fileName name of the file to download
 * @param {String} fileExt file extension
 * @param {Boolean} machineGenerated flag to indicate file is machine generated/not
 */
function fileDownload(fileUrl, fileName) {
  var fileExt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var machineGenerated = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  // Check input filename for extension
  var extension = fileExt === '' ? fileName.split('.').reverse()[0] : fileExt;

  // If no extension present in fileName, check for the extension in the fileUrl
  if (extension.length > 4 || extension.length < 3 || extension === fileName) {
    extension = fileUrl.split('.').reverse()[0];
  }

  // Final validation that extension is in the right form
  // We assume that file extension will be 3 or 4 characters long. Extensions are
  // allowed to be longer or shorter but the most common ones we would expect to
  // encounter should be within these limits.
  var fileExtension = extension.length > 4 || extension.length < 3 ? '' : extension;

  // Remove file extension from filename if it contains it
  var fileNameNoExt = fileName.endsWith(fileExtension) ? fileName.split(".".concat(fileExtension))[0] : fileName;
  if (machineGenerated) {
    //  Add "machine-generated" to filename of the file getting downloaded
    fileNameNoExt = "".concat(fileNameNoExt, " (machine generated)");
  }

  // Rely on browser to generate proper file extension in cases where
  // extension is undetermined.
  var downloadName = fileExtension != '' ? "".concat(fileNameNoExt, ".").concat(fileExtension) : fileNameNoExt;

  // Handle download based on the URL format
  // TODO:: research for a better way to handle this
  if (fileUrl.endsWith('transcripts') || fileUrl.endsWith('captions')) {
    // For URLs of format: http://.../<filename>.<file_extension>
    fetch(fileUrl).then(function (response) {
      response.blob().then(function (blob) {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = "".concat(downloadName);
        a.click();
      });
    })["catch"](function (error) {
      console.log(error);
    });
  } else {
    // For URLs of format: http://.../<filename>
    var link = document.createElement('a');
    link.setAttribute('href', fileUrl);
    link.setAttribute('download', "".concat(downloadName));
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Takes a uri with a media fragment that looks like #=120,134 and returns an object
 * with start/end in seconds and the duration in milliseconds
 * @param {string} uri - Uri value
 * @param {number} duration - duration of the current canvas
 * @return {Object} - Representing the media fragment ie. { start: 3287.0, end: 3590.0 }, or undefined
 */
function getMediaFragment(uri) {
  var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  if (uri !== undefined) {
    var fragment = uri.split('#t=')[1];
    if (fragment !== undefined) {
      var _ref;
      var start, end;
      /**
       * If the times are in a string format (hh:mm:ss) check for comma seperated decimals.
       * Some SRT captions use comma to seperate milliseconds.
       */
      var timestampRegex = /([0-9]*:){1,2}([0-9]{2})(?:((\.|\,)[0-9]{2,3})?)/g;
      if (fragment.includes(':') && ((_ref = _toConsumableArray(fragment.matchAll(/\,/g))) === null || _ref === void 0 ? void 0 : _ref.length) > 1) {
        var times = _toConsumableArray(fragment.matchAll(timestampRegex));
        var _ref2 = (times === null || times === void 0 ? void 0 : times.length) == 2 ? [times[0][0], times[1][0]] : [0, 0];
        var _ref3 = _slicedToArray(_ref2, 2);
        start = _ref3[0];
        end = _ref3[1];
      } else {
        var _fragment$split = fragment.split(',');
        var _fragment$split2 = _slicedToArray(_fragment$split, 2);
        start = _fragment$split2[0];
        end = _fragment$split2[1];
      }
      if (end === undefined) {
        end = duration.toString();
      }
      return {
        start: start.match(timestampRegex) ? timeToS(start) : Number(start),
        end: end.match(timestampRegex) ? timeToS(end) : Number(end)
      };
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

/**
 * Parse json objects in the manifest into Annotations
 * @param {Array<Object>} annotations array of json objects from manifest
 * @param {String} motivation of the resources need to be parsed
 * @returns {Array<Object>} Array of Annotations
 */
function parseAnnotations(annotations, motivation) {
  var content = [];
  if (!annotations) return content;
  // should be contained in an AnnotationPage
  var annotationPage = null;
  if (annotations.length) {
    annotationPage = new AnnotationPage(annotations[0], {});
  }
  if (!annotationPage) {
    return content;
  }
  var items = annotationPage.getItems();
  if (items === undefined) return content;
  for (var i = 0; i < items.length; i++) {
    var a = items[i];
    var annotation = new Annotation(a, {});
    var annoMotivation = annotation.getMotivation();
    if (annoMotivation == motivation) {
      content.push(annotation);
    }
  }
  return content;
}

/**
 * Extract list of Annotations from `annotations`/`items`
 * under the canvas with the given motivation
 * @param {Object} obj
 * @param {Object} obj.manifest IIIF manifest
 * @param {Number} obj.canvasIndex curent canvas's index
 * @param {String} obj.key property key to pick
 * @param {String} obj.motivation
 * @returns {Array} array of AnnotationPage
 */
function getAnnotations(_ref4) {
  var manifest = _ref4.manifest,
    canvasIndex = _ref4.canvasIndex,
    key = _ref4.key,
    motivation = _ref4.motivation;
  var annotations = [];
  // When annotations are at canvas level
  try {
    var annotationPage = parseSequences(manifest)[0].getCanvases()[canvasIndex];
    if (annotationPage) {
      annotations = parseAnnotations(annotationPage.__jsonld[key], motivation);
    }
    return annotations;
  } catch (error) {
    throw error;
  }
}

/**
 * Parse a list of annotations or a single annotation to extract details of a
 * given a Canvas. Assumes the annotation type as either painting or supplementing
 * @param {Array} annotations list of painting/supplementing annotations to be parsed
 * @param {Number} duration duration of the current canvas
 * @param {String} motivation motivation type
 * @returns {Object} containing source, canvas targets
 */
function getResourceItems(annotations, duration, motivation) {
  var _annotations$0$getBod;
  var resources = [],
    canvasTargets = [],
    isMultiSource = false;
  if (!annotations || annotations.length === 0) {
    return {
      error: 'No resources found in Manifest',
      canvasTargets: canvasTargets,
      resources: resources,
      isMultiSource: isMultiSource
    };
  }
  // Multiple resource files on a single canvas
  else if (annotations.length > 1) {
    isMultiSource = true;
    annotations.map(function (a, index) {
      var source = getResourceInfo(a.getBody()[0], motivation);
      if (motivation === 'painting') {
        var target = parseCanvasTarget(a, duration, index);
        canvasTargets.push(target);
      }
      /**
       * TODO::
       * Is this pattern safe if only one of `source.length` or `track.length` is > 0?
       * For example, if `source.length` > 0 is true and `track.length` > 0 is false,
       * then sources and tracks would end up with different numbers of entries.
       * Is that okay or would that mess things up?
       * Maybe this is an impossible edge case that doesn't need to be worried about?
       */
      source.length > 0 && source[0].src && resources.push(source[0]);
    });
  }
  // Multiple Choices avalibale
  else if (((_annotations$0$getBod = annotations[0].getBody()) === null || _annotations$0$getBod === void 0 ? void 0 : _annotations$0$getBod.length) > 0) {
    var annoQuals = annotations[0].getBody();
    annoQuals.map(function (a) {
      var source = getResourceInfo(a, motivation);
      // Check if the parsed sources has a resource URL
      source.length > 0 && source[0].src && resources.push(source[0]);
    });
  }
  // No resources
  else {
    return {
      resources: resources,
      error: 'No resources found'
    };
  }
  return {
    canvasTargets: canvasTargets,
    isMultiSource: isMultiSource,
    resources: resources
  };
}
function parseCanvasTarget(annotation, duration, i) {
  var target = getMediaFragment(annotation.getTarget(), duration);
  if (target != undefined || !target) {
    target.id = annotation.id;
    if (isNaN(target.end)) target.end = duration;
    target.end = Number((target.end - target.start).toFixed(2));
    target.duration = target.end;
    // Start time for continuous playback
    target.altStart = target.start;
    target.start = 0;
    target.sIndex = i;
    return target;
  }
}

/**
 * Parse source and track information related to media
 * resources in a Canvas
 * @param {Object} item AnnotationBody object from Canvas
 * @param {String} motivation
 * @returns parsed source and track information
 */
function getResourceInfo(item, motivation) {
  var source = [];
  var aType = S_ANNOTATION_TYPE.both;
  var label = undefined;
  if (item.getLabel().length === 1) {
    label = item.getLabel().getValue();
  } else if (item.getLabel().length > 1) {
    // If there are multiple labels, assume the first one
    // is the one intended for default display
    label = getLabelValue(item.getLabel()[0]._value);
  }
  if (motivation === 'supplementing') {
    aType = identifySupplementingAnnotation(item.id);
  }
  if (aType != S_ANNOTATION_TYPE.transcript) {
    var s = {
      src: item.id,
      key: item.id,
      type: item.getProperty('format'),
      kind: item.getProperty('type'),
      label: label || 'auto',
      value: item.getProperty('value') ? item.getProperty('value') : ''
    };
    if (motivation === 'supplementing') {
      // Set language for captions/subtitles
      s.srclang = item.getProperty('language') || 'en';
      // Specify kind to subtitles for VTT annotations. Without this VideoJS
      // resolves the kind to metadata for subtitles file, resulting in empty
      // subtitles lists in iOS devices' native palyers
      s.kind = item.getProperty('format').toLowerCase().includes('text/vtt') ? 'subtitles' : 'metadata';
    }
    source.push(s);
  }
  return source;
}

/**
 * Identify a string contains "machine-generated" text in different
 * variations using a regular expression
 * @param {String} label
 * @returns {Object} with the keys indicating label contains
 * "machine-generated" text and label with "machine-generated"
 * text removed
 * { isMachineGen, labelText }
 */
function identifyMachineGen(label) {
  var regex = /(\(machine(\s|\-)generated\))/gi;
  var isMachineGen = regex.test(label);
  var labelStripped = label.replace(regex, '').trim();
  return {
    isMachineGen: isMachineGen,
    labelText: labelStripped
  };
}

/**
 * Resolve captions and transcripts in supplementing annotations.
 * This is specific for Avalon's usecase, where Avalon generates
 * adds 'transcripts' and 'captions' to the URI to distinguish them.
 * In other cases supplementing annotations are displayed as both
 * captions and transcripts in Ramp.
 * @param {String} uri id from supplementing annotation
 * @returns
 */
function identifySupplementingAnnotation(uri) {
  var identifier = uri.split('/').reverse()[0];
  if (identifier === 'transcripts') {
    return S_ANNOTATION_TYPE.transcript;
  } else if (identifier === 'captions') {
    return S_ANNOTATION_TYPE.caption;
  } else {
    return S_ANNOTATION_TYPE.both;
  }
}

/**
 * Parse the label value from a manifest item
 * See https://iiif.io/api/presentation/3.0/#label
 * @param {Object} label
 */
function getLabelValue(label) {
  if (label && _typeof(label) === 'object') {
    var labelKeys = Object.keys(label);
    if (labelKeys && labelKeys.length > 0) {
      // Get the first key's first value
      var firstKey = labelKeys[0];
      return label[firstKey].length > 0 ? lib.decode(label[firstKey][0]) : '';
    }
  } else if (typeof label === 'string') {
    return lib.decode(label);
  }
  return 'Label could not be parsed';
}

/**
 * Validate time input from user against the hh:mm:ss.ms format
 * @param {String} time user input time string
 * @returns {Boolean}
 */
function validateTimeInput(time) {
  var timeRegex = /^(([0-1][0-9])|([2][0-3])):([0-5][0-9])(:[0-5][0-9](?:[.]\d{1,3})?)?$/;
  var isValid = timeRegex.test(time);
  return isValid;
}

/**
 * Scroll an active element into the view within its parent element
 * @param {Object} currentItem React ref to the active element
 * @param {Object} containerRef React ref to the parent container
 * @param {Boolean} toTop boolean flag to scroll active item to the top
 */
function autoScroll(currentItem, containerRef) {
  var toTop = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  /*
    Get the difference of distances between the outer border of the active
    element and its container(parent) element to the top padding edge of
    their offsetParent element(body)
  */
  var scrollHeight = currentItem.offsetTop - containerRef.current.offsetTop;
  /*
    Scroll the current active item to into view within the parent container.
    For transcript active cues => toTop is set to `true`
    For structure active items => toTop has the default `false` value
  */
  if (toTop) {
    containerRef.current.scrollTop = scrollHeight;
  } else {
    // Height of the content in view within the parent container
    var inViewHeight = containerRef.current.clientHeight - currentItem.clientHeight;
    // Only scroll current item when it is further down from the 
    // mid-height point of the container
    if (scrollHeight > inViewHeight) {
      containerRef.current.scrollTop = scrollHeight - containerRef.current.clientHeight / 2;
    } else if (inViewHeight / 2 > scrollHeight) {
      containerRef.current.scrollTop = 0;
    } else {
      containerRef.current.scrollTop = scrollHeight / 2;
    }
  }
}

/**
 * Bind default hotkeys for VideoJS player
 * @param {Object} event keydown event
 * @param {String} id player instance ID in VideoJS
 * @param {Boolean} canvasIsEmpty flag to indicate empty Canvas
 * @returns 
 */
function playerHotKeys(event, player, canvasIsEmpty) {
  var playerInst = player === null || player === void 0 ? void 0 : player.player();
  var inputs = ['input', 'textarea'];
  var activeElement = document.activeElement;
  // Check if the active element is within the player
  var focusedWithinPlayer = activeElement.className.includes('vjs') || activeElement.className.includes('videojs');
  var pressedKey = event.which;

  // Check if ctrl/cmd/alt/shift keys are pressed when using key combinations
  var isCombKeyPress = event.ctrlKey || event.metaKey || event.altKey || event.shiftKey;

  /*
   Trigger player hotkeys when;
   - focus is not on an input, textarea field on the page
   - focus is on a navigation tab AND the key pressed is one of left/right arrow keys
      this specific combination of keys with a focused navigation tab is avoided to allow
      keyboard navigation between tabbed UI components, instead of triggering player hotkeys
   - key combinations are not in use with a key associated with hotkeys
   - current Canvas is empty
  */
  if (activeElement && (inputs.indexOf(activeElement.tagName.toLowerCase()) !== -1 || activeElement.role === "tab" && (pressedKey === 37 || pressedKey === 39)) && !focusedWithinPlayer || isCombKeyPress || canvasIsEmpty) {
    return;
  } else if (playerInst === null || playerInst === undefined) {
    return;
  } else {
    // event.which key code values found at: https://css-tricks.com/snippets/javascript/javascript-keycodes/
    switch (pressedKey) {
      // Space and k toggle play/pause
      case 32:
      case 75:
        // Prevent default browser actions so that page does not react when hotkeys are used.
        // e.g. pressing space will pause/play without scrolling the page down.
        event.preventDefault();
        if (playerInst.paused()) {
          playerInst.play();
        } else {
          playerInst.pause();
        }
        break;
      // f toggles fullscreen
      case 70:
        event.preventDefault();
        // Fullscreen should only be available for videos
        if (!playerInst.isAudio()) {
          if (!playerInst.isFullscreen()) {
            playerInst.requestFullscreen();
          } else {
            playerInst.exitFullscreen();
          }
        }
        break;
      // Adapted from https://github.com/videojs/video.js/blob/bad086dad68d3ff16dbe12e434c15e1ee7ac2875/src/js/control-bar/mute-toggle.js#L56
      // m toggles mute
      case 77:
        event.preventDefault();
        var vol = playerInst.volume();
        var lastVolume = playerInst.lastVolume_();
        if (vol === 0) {
          var volumeToSet = lastVolume < 0.1 ? 0.1 : lastVolume;
          playerInst.volume(volumeToSet);
          playerInst.muted(false);
        } else {
          playerInst.muted(playerInst.muted() ? false : true);
        }
        break;
      // Left arrow seeks 5 seconds back
      case 37:
        event.preventDefault();
        playerInst.currentTime(playerInst.currentTime() - 5);
        break;
      // Right arrow seeks 5 seconds ahead
      case 39:
        event.preventDefault();
        playerInst.currentTime(playerInst.currentTime() + 5);
        break;
      // Up arrow raises volume by 0.1
      case 38:
        event.preventDefault();
        if (playerInst.muted()) {
          playerInst.muted(false);
        }
        playerInst.volume(playerInst.volume() + 0.1);
        break;
      // Down arrow lowers volume by 0.1
      case 40:
        event.preventDefault();
        playerInst.volume(playerInst.volume() - 0.1);
        break;
      default:
        return;
    }
    /*
      This function gets invoked by 2 different 'keydown' event listeners;
      Document's 'keydown' event listener => when player is out of focus on 
        first load and when user is interacting with other elements on the page
      Video.js' native controls' 'keydown' event listeners => when a native player control is in focus
        when using the pointer
      Therefore, once a 'keydown' event is passed throught this function to invoke a hotkey function, 
      event propogation needs to be stopped. Otherwise the hotkeys functionality gets called twice,
      undoing the action performed in the initial call.
    */
    event.stopPropagation();
  }
}

/**
 * Group a JSON object array by a given property
 * @param {Array} arry array of JSON objects to be grouped
 * @param {String} key property name used for grouping
 * @returns a map of grouped JSON objects
 */
var groupBy = function groupBy(arry, key) {
  return arry.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

function _createForOfIteratorHelper$4(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$4(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$4(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$4(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$4(o, minLen); }
function _arrayLikeToArray$4(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys$6(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$6(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$6(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$6(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

// HTML tags and attributes allowed in IIIF
var HTML_SANITIZE_CONFIG = {
  allowedTags: ['a', 'b', 'br', 'i', 'img', 'p', 'small', 'span', 'sub', 'sup'],
  allowedAttributes: {
    'a': ['href'],
    'img': ['src', 'alt']
  },
  allowedSchemesByTag: {
    'a': ['http', 'https', 'mailto']
  }
};

/**
 * Get all the canvases in manifest
 * @function IIIFParser#canvasesInManifest
 * @return {Array} array of canvas IDs in manifest
 **/
function canvasesInManifest(manifest) {
  var canvasesInfo = [];
  try {
    var canvases = parseSequences(manifest)[0].getCanvases();
    if (canvases === undefined) {
      console.error('iiif-parser -> canvasesInManifest() -> no canvases were found in Manifest');
      throw new Error(GENERIC_ERROR_MESSAGE);
    } else {
      canvases.map(function (canvas) {
        var summary = undefined;
        var summaryProperty = canvas.getProperty('summary');
        if (summaryProperty) {
          summary = PropertyValue.parse(summaryProperty).getValue();
        }
        var homepage = undefined;
        var homepageProperty = canvas.getProperty('homepage');
        if (homepageProperty && (homepageProperty === null || homepageProperty === void 0 ? void 0 : homepageProperty.length) > 0) {
          homepage = homepageProperty[0].id;
        }
        try {
          var sources = canvas.getContent()[0].getBody().map(function (source) {
            return source.id;
          });
          var canvasDuration = Number(canvas.getDuration());
          var timeFragment;
          if ((sources === null || sources === void 0 ? void 0 : sources.length) > 0) {
            timeFragment = getMediaFragment(sources[0], canvasDuration);
          }
          canvasesInfo.push({
            canvasId: canvas.id,
            range: timeFragment === undefined ? {
              start: 0,
              end: canvasDuration
            } : timeFragment,
            isEmpty: sources.length === 0 ? true : false,
            summary: summary,
            homepage: homepage || ''
          });
        } catch (error) {
          canvasesInfo.push({
            canvasId: canvas.id,
            range: undefined,
            // set range to undefined, use this check to set duration in UI
            isEmpty: true,
            summary: summary,
            homepage: homepage || ''
          });
        }
      });
      return canvasesInfo;
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Get isMultiCanvas and last canvas index information from the
 * given Manifest
 * @param {Object} manifest
 * @returns {Object} { isMultiCanvas: Boolean, lastIndex: Number }
 */
function manifestCanvasesInfo(manifest) {
  try {
    var sequences = parseSequences(manifest);
    var isMultiCanvas = false;
    var lastPageIndex = 0;
    if (sequences.length > 0) {
      isMultiCanvas = sequences[0].isMultiCanvas();
      lastPageIndex = sequences[0].getLastPageIndex();
    }
    return {
      isMultiCanvas: isMultiCanvas,
      lastIndex: lastPageIndex > -1 ? lastPageIndex : 0
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Get canvas index by using the canvas id
 * @param {Object} manifest
 * @param {String} canvasId
 * @returns {Number} canvasindex
 */
function getCanvasIndex(manifest, canvasId) {
  try {
    var sequences = parseSequences(manifest);
    var canvasindex = sequences[0].getCanvasIndexById(canvasId);
    if (canvasindex || canvasindex === 0) {
      return canvasindex;
    } else {
      console.log('Canvas not found in Manifest, ', canvasId);
      return 0;
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Get sources and media type for a given canvas
 * If there are no items, an error is returned (user facing error)
 * @param {Object} obj
 * @param {Object} obj.manifest IIIF Manifest
 * @param {Number} obj.canvasIndex Index of the current canvas in manifest
 * @param {Number} obj.srcIndex Index of the resource in active canvas
 * @returns {Object} { soures, tracks, targets, isMultiSource, error, canvas, mediaType }
 */
function getMediaInfo(_ref) {
  var manifest = _ref.manifest,
    canvasIndex = _ref.canvasIndex,
    _ref$srcIndex = _ref.srcIndex,
    srcIndex = _ref$srcIndex === void 0 ? 0 : _ref$srcIndex;
  var canvas = [];
  var sources,
    tracks = [];

  // return empty object when canvasIndex is undefined
  if (canvasIndex === undefined || canvasIndex < 0) {
    return {
      error: 'Error fetching content',
      canvas: null,
      sources: [],
      tracks: [],
      canvasTargets: []
    };
  }

  // return an error when the given Manifest doesn't have any Canvas(es)
  var canvases = canvasesInManifest(manifest);
  if ((canvases === null || canvases === void 0 ? void 0 : canvases.length) == 0) {
    return {
      sources: [],
      tracks: tracks,
      error: GENERIC_EMPTY_MANIFEST_MESSAGE,
      canvas: null,
      canvasTargets: []
    };
  }

  // Get the canvas with the given canvasIndex
  try {
    canvas = parseSequences(manifest)[0].getCanvasByIndex(canvasIndex);
    if (canvas === undefined) {
      console.error('iiif-parser -> getMediaInfo() -> canvas undefined  -> ', canvasIndex);
      throw new Error(GENERIC_ERROR_MESSAGE);
    }
    var duration = Number(canvas.getDuration());

    // Read painting resources from annotations
    var _readAnnotations = readAnnotations({
        manifest: manifest,
        canvasIndex: canvasIndex,
        key: 'items',
        motivation: 'painting',
        duration: duration
      }),
      resources = _readAnnotations.resources,
      canvasTargets = _readAnnotations.canvasTargets,
      isMultiSource = _readAnnotations.isMultiSource,
      error = _readAnnotations.error;
    // Set default src to auto
    sources = setDefaultSrc(resources, isMultiSource, srcIndex);

    // Read supplementing resources fom annotations
    var supplementingRes = readAnnotations({
      manifest: manifest,
      canvasIndex: canvasIndex,
      key: 'annotations',
      motivation: 'supplementing',
      duration: duration
    });
    tracks = supplementingRes ? supplementingRes.resources : [];
    var mediaInfo = {
      sources: sources,
      tracks: tracks,
      canvasTargets: canvasTargets,
      isMultiSource: isMultiSource,
      error: error,
      canvas: {
        duration: duration,
        height: canvas.getHeight(),
        width: canvas.getWidth(),
        id: canvas.id,
        label: canvas.getLabel().getValue()
      }
    };
    if (mediaInfo.error) {
      return _objectSpread$6({}, mediaInfo);
    } else {
      // Get media type
      var allTypes = mediaInfo.sources.map(function (q) {
        return q.kind;
      });
      var mediaType = setMediaType(allTypes);
      return _objectSpread$6(_objectSpread$6({}, mediaInfo), {}, {
        error: null,
        mediaType: mediaType
      });
    }
  } catch (error) {
    throw error;
  }
}
function readAnnotations(_ref2) {
  var manifest = _ref2.manifest,
    canvasIndex = _ref2.canvasIndex,
    key = _ref2.key,
    motivation = _ref2.motivation,
    duration = _ref2.duration;
  var annotations = getAnnotations({
    manifest: manifest,
    canvasIndex: canvasIndex,
    key: key,
    motivation: motivation
  });
  return getResourceItems(annotations, duration, motivation);
}

/**
 * Mark the default src file when multiple src files are present
 * @param {Array} sources source file information in canvas
 * @returns source file information with one marked as default
 */
function setDefaultSrc(sources, isMultiSource, srcIndex) {
  var isSelected = false;
  if (sources.length === 0) {
    return [];
  }
  // Mark source with quality label 'auto' as selected source
  if (!isMultiSource) {
    var _iterator = _createForOfIteratorHelper$4(sources),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var s = _step.value;
        if (s.label == 'auto' && !isSelected) {
          isSelected = true;
          s.selected = true;
        }
      }
      // Mark first source as selected when 'auto' quality is not present
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (!isSelected) {
      sources[0].selected = true;
    }
  } else {
    sources[srcIndex].selected = true;
  }
  return sources;
}
function setMediaType(types) {
  var uniqueTypes = types.filter(function (t, index) {
    return types.indexOf(t) === index;
  });
  // Default type if there are different types
  var mediaType = uniqueTypes.length === 1 ? uniqueTypes[0].toLowerCase() : 'video';
  return mediaType;
}

/**
 * Get the canvas ID from the URI of the clicked structure item
 * @param {String} uri URI of the item clicked in structure
 */
function getCanvasId(uri) {
  if (uri !== undefined) {
    return uri.split('#t=')[0];
  }
}

/**
 * Get placeholderCanvas value for images and text messages
 * @param {Object} manifest
 * @param {Number} canvasIndex
 * @param {Boolean} isPoster
 */
function getPlaceholderCanvas(manifest, canvasIndex) {
  var isPoster = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var placeholder;
  try {
    var canvases = parseSequences(manifest);
    if ((canvases === null || canvases === void 0 ? void 0 : canvases.length) > 0) {
      var canvas = canvases[0].getCanvasByIndex(canvasIndex);
      var placeholderCanvas = canvas.__jsonld['placeholderCanvas'];
      if (placeholderCanvas) {
        var annotations = placeholderCanvas['items'];
        var items = parseAnnotations(annotations, 'painting');
        if (items.length > 0) {
          var item = items[0].getBody()[0];
          if (isPoster) {
            placeholder = item.getType() == 'image' ? item.id : null;
          } else {
            placeholder = item.getLabel().getValue() ? getLabelValue(item.getLabel().getValue()) : 'This item cannot be played.';
            setCanvasMessageTimeout(placeholderCanvas['duration']);
          }
          return placeholder;
        }
      } else if (!isPoster) {
        console.error('iiif-parser -> getPlaceholderCanvas() -> placeholderCanvas property not defined');
        return 'This item cannot be played.';
      } else {
        return null;
      }
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Parse 'start' property in manifest if it is given, or use
 * startCanvasId and startCanvasTime props in IIIFPlayer component
 * to set the starting Canvas and time in Ramp on initialization
 * In the spec there are 2 ways to specify 'start' property:
 * https://iiif.io/api/presentation/3.0/#start
 * Cookbook recipe for reference: https://iiif.io/api/cookbook/recipe/0015-start/
 * @param {Object} manifest
 * @param {String} startCanvasId from IIIFPlayer props
 * @param {Number} startCanvasTime from IIIFPlayer props
 * @returns {Object}
 */
function getCustomStart(manifest, startCanvasId, startCanvasTime) {
  var manifestStartProp = parseManifest(manifest).getProperty('start');
  var startProp = {};
  var currentCanvasIndex = 0;
  // When none of the variable are set, return default values all set to zero
  if (!manifestStartProp && startCanvasId === undefined && startCanvasTime === undefined) {
    return {
      type: 'C',
      canvas: currentCanvasIndex,
      time: 0
    };
  } else if (startCanvasId != undefined || startCanvasTime != undefined) {
    // Read user specified props from IIIFPlayer component
    startProp = {
      id: startCanvasId,
      selector: {
        type: 'PointSelector',
        t: startCanvasTime === undefined ? 0 : startCanvasTime
      },
      type: startCanvasTime === undefined ? 'Canvas' : 'SpecificResource'
    };
    // Set source property in the object for SpecificResource type
    if (startCanvasTime != undefined) startProp.source = startCanvasId;
  } else if (manifestStartProp) {
    // Read 'start' property in Manifest when it exitsts
    startProp = parseManifest(manifest).getProperty('start');
  }
  var canvases = canvasesInManifest(manifest);
  // Map given information in start property or user props to
  // Canvas information in the given Manifest
  var getCanvasInfo = function getCanvasInfo(canvasId, type, time) {
    var startTime = time;
    var currentIndex;
    if (canvases != undefined && (canvases === null || canvases === void 0 ? void 0 : canvases.length) > 0) {
      if (canvasId === undefined) {
        currentIndex = 0;
      } else {
        currentIndex = canvases.findIndex(function (c) {
          return c.canvasId === canvasId;
        });
      }
      if (currentIndex === undefined || currentIndex < 0) {
        console.error('iiif-parser -> getCustomStart() -> given canvas ID was not in Manifest, ', startCanvasId);
        return {
          currentIndex: 0,
          startTime: 0
        };
      } else {
        var currentCanvas = canvases[currentIndex];
        if (currentCanvas.range != undefined && type === 'SpecificResource') {
          var _currentCanvas$range = currentCanvas.range,
            start = _currentCanvas$range.start,
            end = _currentCanvas$range.end;
          if (!(time >= start && time <= end)) {
            console.error('iiif-parser -> getCustomStart() -> given canvas start time is not within Canvas duration, ', startCanvasTime);
            startTime = 0;
          }
        }
        return {
          currentIndex: currentIndex,
          startTime: startTime
        };
      }
    } else {
      console.error('iiif-parser -> getCustomStart() -> no Canvases in given Manifest');
      return {
        currentIndex: 0,
        startTime: 0
      };
    }
  };
  if (startProp != undefined) {
    switch (startProp.type) {
      case 'Canvas':
        var canvasInfo = getCanvasInfo(startProp.id, startProp.type, 0);
        return {
          type: 'C',
          canvas: canvasInfo.currentIndex,
          time: canvasInfo.startTime
        };
      case 'SpecificResource':
        var customStart = startProp.selector.t;
        canvasInfo = getCanvasInfo(startProp.source, startProp.type, customStart);
        return {
          type: 'SR',
          canvas: canvasInfo.currentIndex,
          time: canvasInfo.startTime
        };
    }
  }
}
function buildFileInfo(format, labelInput, id) {
  var mime = mimeDb[format];
  var extension = mime ? mime.extensions[0] : format;
  var label = '';
  var filename = '';
  if (Object.keys(labelInput).length > 1) {
    label = labelInput[Object.keys(labelInput)[0]][0];
    filename = labelInput['none'][0];
  } else {
    label = getLabelValue(labelInput);
    filename = label;
  }
  var isMachineGen = label.includes('(machine generated)');
  var file = {
    id: id,
    label: "".concat(label, " (.").concat(extension, ")"),
    filename: filename,
    fileExt: extension,
    isMachineGen: isMachineGen
  };
  return file;
}

/**
 * Retrieve the list of alternative representation files in manifest or canvas
 * level to make available to download
 * @param {Object} manifest
 * @returns {Object} List of files under `rendering` property in manifest and canvases
 */
function getRenderingFiles(manifest) {
  try {
    var manifestFiles = [];
    var canvasFiles = [];
    var manifestParsed = parseManifest(manifest);
    var manifestRendering = manifestParsed.getRenderings();
    var canvases = parseSequences(manifest)[0].getCanvases();
    if (manifestRendering != undefined && manifestRendering != null) {
      manifestRendering.map(function (r) {
        var file = buildFileInfo(r.getFormat(), r.getProperty('label'), r.id);
        manifestFiles.push(file);
      });
    }
    if (canvases != undefined && canvases != null) {
      canvases.map(function (canvas, index) {
        var canvasRendering = canvas.__jsonld.rendering;
        var files = [];
        if (canvasRendering) {
          canvasRendering.map(function (r) {
            var file = buildFileInfo(r.format, r.label, r.id);
            files.push(file);
          });
        }
        // Use label of canvas or fallback to canvas id
        var canvasLabel = canvas.getLabel().getValue() || "Section " + (index + 1);
        canvasFiles.push({
          label: getLabelValue(canvasLabel),
          files: files
        });
      });
    }
    return {
      manifest: manifestFiles,
      canvas: canvasFiles
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Read metadata from both Manifest and Canvas levels as needed
 * @param {Object} manifest
 * @param {Boolean} readCanvasMetadata read metadata from Canvas level
 * @return {Array} list of key value pairs for each metadata item in the manifest
 */
function getMetadata(manifest, readCanvasMetadata) {
  try {
    var canvasMetadata = [];
    var allMetadata = {
      canvasMetadata: canvasMetadata,
      manifestMetadata: []
    };
    var parsedManifest = parseManifest(manifest);
    // Parse Canvas-level metadata blocks for each Canvas
    if (readCanvasMetadata) {
      var canvases = parseSequences(manifest)[0].getCanvases();
      for (var i in canvases) {
        var canvasindex = parseInt(i);
        var _rightsMetadata = parseRightsAsMetadata(canvases[canvasindex], 'Canvas');
        canvasMetadata.push({
          canvasindex: canvasindex,
          metadata: parseMetadata(canvases[canvasindex].getMetadata(), 'Canvas'),
          rights: _rightsMetadata
        });
      }
      ;
      allMetadata.canvasMetadata = canvasMetadata;
    }
    // Parse Manifest-level metadata block
    var manifestMetadata = parsedManifest.getMetadata();
    var parsedManifestMetadata = parseMetadata(manifestMetadata, 'Manifest');
    var rightsMetadata = parseRightsAsMetadata(parsedManifest, 'Manifest');
    allMetadata.manifestMetadata = parsedManifestMetadata;
    allMetadata.rights = rightsMetadata;
    return allMetadata;
  } catch (e) {
    console.error('iiif-parser -> getMetadata() -> cannot parse manifest, ', e);
    throw new Error(GENERIC_ERROR_MESSAGE);
  }
}

/**
 * Parse metadata in the Manifest/Canvas into an array of key value pairs
 * @param {Array} metadata list of metadata in Manifest
 * @param {String} resourceType resource type which the metadata belongs to
 * @returns {Array} an array with key value pairs for the metadata 
 */
function parseMetadata(metadata, resourceType) {
  var parsedMetadata = [];
  if ((metadata === null || metadata === void 0 ? void 0 : metadata.length) > 0) {
    metadata.map(function (md) {
      var _md$getValue;
      // get value and replace /n characters with <br/> to display new lines in UI
      var value = (_md$getValue = md.getValue()) === null || _md$getValue === void 0 ? void 0 : _md$getValue.replace(/\n/g, "<br />");
      var sanitizedValue = sanitizeHtml(value, _objectSpread$6({}, HTML_SANITIZE_CONFIG));
      parsedMetadata.push({
        label: md.getLabel(),
        value: sanitizedValue
      });
    });
    return parsedMetadata;
  } else {
    console.log('iiif-parser -> parseMetadata() -> no metadata in ', resourceType);
    return parsedMetadata;
  }
}

/**
 * Parse requiredStatement and rights information as metadata
 * @param {Object} resource Canvas or Manifest JSON-ld
 * @param {String} resourceType resource type (Manifest/Canvas) for metadata
 * @returns {Array<JSON Object>}
 */
function parseRightsAsMetadata(resource, resourceType) {
  var _requiredStatement$va;
  var otherMetadata = [];
  var requiredStatement = resource.getRequiredStatement();
  if (requiredStatement != undefined && ((_requiredStatement$va = requiredStatement.value) === null || _requiredStatement$va === void 0 ? void 0 : _requiredStatement$va.length) > 0) {
    otherMetadata = parseMetadata([requiredStatement], resourceType);
  }
  var rights = resource.getProperty('rights') || undefined;
  if (rights != undefined) {
    var isURL = /^(https?:\/\/[^\s]+)|(www\.[^\s]+)/.test(rights);
    otherMetadata.push({
      label: 'License',
      value: isURL ? "<a href=".concat(rights, ">").concat(rights, "</a>") : rights
    });
  }
  return otherMetadata;
}

/**
 * Parse manifest to see if auto-advance behavior present at manifest level
 * @param {Object} manifest
 * @return {Boolean}
 */
function parseAutoAdvance(manifest) {
  var _parseManifest$getPro;
  var autoAdvanceBehavior = (_parseManifest$getPro = parseManifest(manifest).getProperty("behavior")) === null || _parseManifest$getPro === void 0 ? void 0 : _parseManifest$getPro.includes("auto-advance");
  return autoAdvanceBehavior === undefined ? false : autoAdvanceBehavior;
}

/**
 * Parse 'structures' into an array of nested JSON objects with
 * required information for structured navigation UI rendering
 * @param {Object} manifest
 * @param {Boolean} isPlaylist
 * @returns {Object}
 *  obj.structures: a nested json object structure derived from
 *    'structures' property in the given Manifest
 *  obj.timespans: timespan items linking to Canvas
 *  obj.markRoot: display root Range in the UI
 */
function getStructureRanges(manifest) {
  var isPlaylist = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var canvasesInfo = canvasesInManifest(manifest);
  var timespans = [];
  var manifestDuration = 0;
  var hasRoot = false;
  var cIndex = 0;
  // Initialize the subIndex for tracking indices for timespans in structure
  var subIndex = 0;
  var parseItem = function parseItem(range, rootNode) {
    var behavior = range.getBehavior();
    if (behavior != 'no-nav') {
      var _range$getRanges;
      var label = getLabelValue(range.getLabel().getValue());
      var canvases = range.getCanvasIds();
      var duration = manifestDuration;
      var canvasDuration = manifestDuration;
      var isRoot = rootNode == range && cIndex == 0;
      var isCanvas;
      var isClickable = false;
      var isEmpty = false;
      var summary = undefined;
      var homepage = undefined;
      if (hasRoot) {
        // When parsing the root Range in structures, treat it as a Canvas
        isCanvas = isRoot || canvasesInfo.length > 1 && rootNode == range.parentRange;
        if (canvasesInfo.length > 1 && rootNode == range.parentRange) {
          cIndex = cIndex + 1;
        } else if (canvasesInfo.length == 1) {
          // When only one Canvas is in the items list
          cIndex = 1;
        }
      } else {
        isCanvas = rootNode == range.parentRange && canvasesInfo[cIndex - 1] != undefined;
      }
      var rangeDuration = range.getDuration();
      if (rangeDuration != undefined && !isRoot) {
        var start = rangeDuration.start,
          end = rangeDuration.end;
        duration = end - start;
        if (isCanvas) {
          canvasDuration = duration;
        }
      }
      if (canvases.length > 0 && (canvasesInfo === null || canvasesInfo === void 0 ? void 0 : canvasesInfo.length) > 0) {
        var canvasInfo = canvasesInfo.filter(function (c) {
          return c.canvasId === getCanvasId(canvases[0]);
        })[0];
        isEmpty = canvasInfo.isEmpty;
        summary = canvasInfo.summary;
        homepage = canvasInfo.homepage;
        // Mark all timespans as clickable, and provide desired behavior in ListItem component
        isClickable = true;
        if (canvasInfo.range != undefined) {
          var _canvasInfo$range = canvasInfo.range,
            _start = _canvasInfo$range.start,
            _end = _canvasInfo$range.end;
          canvasDuration = _end - _start;
          if (isCanvas) {
            duration = _end - _start;
          }
        }
      }
      var item = {
        label: label,
        summary: summary,
        isRoot: isRoot,
        isTitle: canvases.length === 0 ? true : false,
        rangeId: range.id,
        id: canvases.length > 0 ? isCanvas ? "".concat(canvases[0].split(',')[0], ",") : canvases[0] : undefined,
        isEmpty: isEmpty,
        isCanvas: isCanvas,
        itemIndex: isCanvas ? cIndex : undefined,
        canvasIndex: cIndex,
        items: ((_range$getRanges = range.getRanges()) === null || _range$getRanges === void 0 ? void 0 : _range$getRanges.length) > 0 ? range.getRanges().map(function (r) {
          return parseItem(r, rootNode);
        }) : [],
        duration: timeToHHmmss(duration),
        isClickable: isClickable,
        homepage: homepage,
        canvasDuration: canvasDuration
      };
      if (canvases.length > 0) {
        // Increment the index for each timespan
        subIndex++;
        if (!isCanvas) {
          item.itemIndex = subIndex;
        }
        timespans.push(item);
      }
      return item;
    }
  };
  var allRanges = parseManifest(manifest).getAllRanges();
  if ((allRanges === null || allRanges === void 0 ? void 0 : allRanges.length) === 0) {
    return {
      structures: [],
      timespans: [],
      markRoot: false
    };
  } else {
    var rootNode = allRanges[0];
    var structures = [];
    var rootBehavior = rootNode.getBehavior();
    if (rootBehavior && rootBehavior == 'no-nav') {
      return {
        structures: [],
        timespans: []
      };
    } else {
      if (isPlaylist || rootBehavior === 'top') {
        var canvasRanges = rootNode.getRanges();
        if ((canvasRanges === null || canvasRanges === void 0 ? void 0 : canvasRanges.length) > 0) {
          canvasRanges.map(function (range, index) {
            var behavior = range.getBehavior();
            if (behavior != 'no-nav') {
              // Reset the index for timespans in structure for each Canvas
              subIndex = 0;
              cIndex = index + 1;
              structures.push(parseItem(range, rootNode));
            }
          });
        }
      } else {
        hasRoot = true;
        // Total duration for all resources in the Manifest
        manifestDuration = canvasesInfo.reduce(function (duration, canvas) {
          return duration + canvas.range.end;
        }, 0);
        structures.push(parseItem(rootNode, rootNode));
      }
    }
    // Mark root Range for a single-canvased Manifest
    var markRoot = hasRoot && (canvasesInfo === null || canvasesInfo === void 0 ? void 0 : canvasesInfo.length) > 1;
    return {
      structures: structures,
      timespans: timespans,
      markRoot: markRoot
    };
  }
}

/**
 * Read 'services' block in the Manifest or in relevant Canvas. Services listed
 * at the manifest-level takes precedence.
 * Returns the id of the service typed 'SearchService2' to enable content 
 * search 
 * @param {Object} manifest 
 * @param {Number} canvasIndex index of the current Canvas
 * @returns 
 */
function getSearchService(manifest, canvasIndex) {
  var searchService = null;
  var manifestServices = parseManifest(manifest).getServices();
  if (manifestServices && (manifestServices === null || manifestServices === void 0 ? void 0 : manifestServices.length) > 0) {
    var searchServices = manifestServices.filter(function (s) {
      return s.getProperty('type') === 'SearchService2';
    });
    searchService = (searchServices === null || searchServices === void 0 ? void 0 : searchServices.length) > 0 ? searchServices[0].id : null;
  } else {
    var canvases = parseSequences(manifest)[0].getCanvases();
    if (canvases === undefined || canvases[canvasIndex] === undefined) return null;
    var canvas = canvases[canvasIndex];
    var services = canvas.getServices();
    if (services && services.length > 0) {
      var _searchServices = services.filter(function (s) {
        return s.getProperty('type') === 'SearchService2';
      });
      searchService = (_searchServices === null || _searchServices === void 0 ? void 0 : _searchServices.length) > 0 ? _searchServices[0].id : null;
    }
  }
  return searchService;
}

function getAnnotationService(manifest) {
  var service = parseManifest(manifest).getService();
  if (service && service.getProperty('type') === 'AnnotationService0') {
    return service.id;
  } else {
    return null;
  }
}

/**
 * Parses the manifest to identify whether it is a playlist manifest
 * or not
 * @param {Object} manifest
 * @returns {Boolean}
 */
function getIsPlaylist(manifest) {
  try {
    var manifestTitle = manifest.label;
    var isPlaylist = getLabelValue(manifestTitle).includes('[Playlist]');
    return isPlaylist;
  } catch (err) {
    console.error('Cannot parse manfiest, ', err);
    return false;
  }
}

/**
 * Parse `highlighting` annotations with TextualBody type as markers
 * for all the Canvases in the given Manifest
 * @param {Object} manifest
 * @returns {Array<Object>} JSON object array with markers information for each
 * Canvas in the given Manifest.
 * [{ canvasIndex: Number,
 *    canvasMarkers: [{
 *      id: String,
 *      time: Number,
 *      timeStr: String,
 *      canvasId: String,
 *      value: String
 *    }]
 * }]
 *
 */
function parsePlaylistAnnotations(manifest) {
  try {
    var canvases = parseSequences(manifest)[0].getCanvases();
    var allMarkers = [];
    if (canvases) {
      canvases.map(function (canvas, index) {
        var annotations = parseAnnotations(canvas.__jsonld['annotations'], 'highlighting');
        if (!annotations || annotations.length === 0) {
          allMarkers.push({
            canvasMarkers: [],
            canvasIndex: index
          });
        } else if (annotations.length > 0) {
          var canvasMarkers = [];
          annotations.map(function (a) {
            var marker = parseMarkerAnnotation(a);
            if (marker) {
              canvasMarkers.push(marker);
            }
          });
          allMarkers.push({
            canvasMarkers: canvasMarkers,
            canvasIndex: index
          });
        }
      });
    }
    return allMarkers;
  } catch (error) {
    throw error;
  }
}

/**
 * Parse a manifesto.js Annotation object for a marker annotation into
 * a JSON object with information required to display the annotation in
 * the UI
 * @param {Object} a manifesto.js Annotation object
 * @returns {Object} a json object for a marker
 * { id: String, time: Number, timeStr: String, canvasId: String, value: String}
 */
function parseMarkerAnnotation(a) {
  if (!a) {
    return null;
  }
  var _a$getTarget$split = a.getTarget().split('#t='),
    _a$getTarget$split2 = _slicedToArray(_a$getTarget$split, 2),
    canvasId = _a$getTarget$split2[0],
    time = _a$getTarget$split2[1];
  var markerBody = a.getBody();
  if ((markerBody === null || markerBody === void 0 ? void 0 : markerBody.length) > 0 && markerBody[0].getProperty('type') === 'TextualBody') {
    var marker = {
      id: a.id,
      time: parseFloat(time),
      timeStr: timeToHHmmss(parseFloat(time), true, true),
      canvasId: canvasId,
      value: markerBody[0].getProperty('value') ? markerBody[0].getProperty('value') : ''
    };
    return marker;
  } else {
    return null;
  }
}

/**
 * Wrapper for manifesto.js Annotation constructor
 * @param {Object} annotationInfo JSON object with annotation information
 * @returns {Annotation}
 */
function createNewAnnotation(annotationInfo) {
  var annotation = new Annotation(annotationInfo);
  return annotation;
}

function IIIFPlayerWrapper(_ref) {
  var manifestUrl = _ref.manifestUrl,
    customErrorMessage = _ref.customErrorMessage,
    emptyManifestMessage = _ref.emptyManifestMessage,
    startCanvasId = _ref.startCanvasId,
    startCanvasTime = _ref.startCanvasTime,
    children = _ref.children,
    manifestValue = _ref.manifest;
  var _React$useState = React.useState(manifestValue),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    manifest = _React$useState2[0],
    setManifest = _React$useState2[1];
  var manifestDispatch = useManifestDispatch();
  var playerDispatch = usePlayerDispatch();
  var _useErrorBoundary = useErrorBoundary(),
    showBoundary = _useErrorBoundary.showBoundary;
  React.useEffect( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
    var requestOptions;
    return regenerator.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          setAppErrorMessage(customErrorMessage);
          setAppEmptyManifestMessage(emptyManifestMessage);
          if (!manifest) {
            _context.next = 6;
            break;
          }
          manifestDispatch({
            manifest: manifest,
            type: 'updateManifest'
          });
          _context.next = 15;
          break;
        case 6:
          requestOptions = {
            // NOTE: try thin in Avalon
            //credentials: 'include',
            // headers: { 'Avalon-Api-Key': '' },
          };
          _context.prev = 7;
          _context.next = 10;
          return fetch(manifestUrl, requestOptions).then(function (result) {
            if (result.status != 200 && result.status != 201) {
              throw new Error('Failed to fetch Manifest. Please check again.');
            } else {
              return result.json();
            }
          }).then(function (data) {
            setManifest(data);
            manifestDispatch({
              manifest: data,
              type: 'updateManifest'
            });
          })["catch"](function (error) {
            console.log('Error fetching manifest, ', error);
            throw new Error('Failed to fetch Manifest. Please check again.');
          });
        case 10:
          _context.next = 15;
          break;
        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](7);
          showBoundary(_context.t0);
        case 15:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[7, 12]]);
  })), []);
  React.useEffect(function () {
    if (manifest) {
      manifestDispatch({
        autoAdvance: parseAutoAdvance(manifest),
        type: "setAutoAdvance"
      });
      var isPlaylist = getIsPlaylist(manifest);
      manifestDispatch({
        isPlaylist: isPlaylist,
        type: 'setIsPlaylist'
      });
      var annotationService = getAnnotationService(manifest);
      manifestDispatch({
        annotationService: annotationService,
        type: 'setAnnotationService'
      });
      var customStart = getCustomStart(manifest, startCanvasId, startCanvasTime);
      if (customStart.type == 'SR') {
        playerDispatch({
          currentTime: customStart.time,
          type: 'setCurrentTime'
        });
      }
      manifestDispatch({
        canvasIndex: customStart.canvas,
        type: 'switchCanvas'
      });
    }
  }, [manifest]);
  if (!manifest) {
    return /*#__PURE__*/React.createElement("p", null, "...Loading");
  } else {
    return /*#__PURE__*/React.createElement(React.Fragment, null, children);
  }
}
IIIFPlayerWrapper.propTypes = {
  manifest: PropTypes.object,
  customErrorMessage: PropTypes.string,
  emptyManifestMessage: PropTypes.string,
  manifestUrl: PropTypes.string,
  startCanvasId: PropTypes.string,
  startCanvasTime: PropTypes.number,
  children: PropTypes.node
};

function Fallback(_ref) {
  var error = _ref.error,
    resetErrorBoundary = _ref.resetErrorBoundary;
  return /*#__PURE__*/React.createElement("div", {
    role: "alert",
    className: "ramp--error-message__alert"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ramp--error-message__message",
    dangerouslySetInnerHTML: {
      __html: error.message
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "ramp--error-message__reset-button",
    onClick: resetErrorBoundary
  }, "Try again"));
}
var ErrorMessage = function ErrorMessage(_ref2) {
  _ref2.message;
    var children = _ref2.children;
  return /*#__PURE__*/React.createElement(ErrorBoundary, {
    FallbackComponent: Fallback,
    onReset: function onReset(details) {
      // Reset the state of your app so the error doesn't happen again
    }
  }, children);
};
ErrorMessage.propTypes = {
  message: PropTypes.string,
  children: PropTypes.object
};

function IIIFPlayer(_ref) {
  var manifestUrl = _ref.manifestUrl,
    manifest = _ref.manifest,
    customErrorMessage = _ref.customErrorMessage,
    emptyManifestMessage = _ref.emptyManifestMessage,
    startCanvasId = _ref.startCanvasId,
    startCanvasTime = _ref.startCanvasTime,
    children = _ref.children;
  if (!manifestUrl && !manifest) return /*#__PURE__*/React.createElement("p", null, "Please provide a valid manifest.");
  return /*#__PURE__*/React.createElement(ManifestProvider, null, /*#__PURE__*/React.createElement(PlayerProvider, null, /*#__PURE__*/React.createElement(ErrorMessage, null, /*#__PURE__*/React.createElement(IIIFPlayerWrapper, {
    manifestUrl: manifestUrl,
    manifest: manifest,
    customErrorMessage: customErrorMessage,
    emptyManifestMessage: emptyManifestMessage,
    startCanvasId: startCanvasId,
    startCanvasTime: startCanvasTime
  }, children))));
}
IIIFPlayer.propTypes = {
  /** A valid IIIF manifest uri */
  manifestUrl: PropTypes.string,
  manifest: PropTypes.object,
  customErrorMessage: PropTypes.string,
  emptyManifestMessage: PropTypes.string,
  startCanvasId: PropTypes.string,
  startCanvasTime: PropTypes.number
};
IIIFPlayer.defaultProps = {};

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

var _root = root;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return _root.Date.now();
};

var now_1 = now;

/** Used to match a single whitespace character. */
var reWhitespace = /\s/;

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
 * character of `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the index of the last non-whitespace character.
 */
function trimmedEndIndex(string) {
  var index = string.length;

  while (index-- && reWhitespace.test(string.charAt(index))) {}
  return index;
}

var _trimmedEndIndex = trimmedEndIndex;

/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;

/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */
function baseTrim(string) {
  return string
    ? string.slice(0, _trimmedEndIndex(string) + 1).replace(reTrimStart, '')
    : string;
}

var _baseTrim = baseTrim;

/** Built-in value references. */
var Symbol$1 = _root.Symbol;

var _Symbol = Symbol$1;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto$1.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag);
}

var isSymbol_1 = isSymbol;

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol_1(value)) {
    return NAN;
  }
  if (isObject_1(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject_1(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = _baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

var toNumber_1 = toNumber;

/** Error message constants. */
var FUNC_ERROR_TEXT$1 = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  wait = toNumber_1(wait) || 0;
  if (isObject_1(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber_1(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now_1();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now_1());
  }

  function debounced() {
    var time = now_1(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

var debounce_1 = debounce;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject_1(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce_1(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

var throttle_1 = throttle;

createCommonjsModule(function (module, exports) {
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

/** Copied from: https://github.com/videojs/video.js/blob/main/src/js/utils/browser.js */

/**
 * Whether or not this device is an iPod.
 *
 * @static
 * @type {Boolean}
 */
var IS_IPOD = false;

/**
 * Whether or not this is an Android device.
 *
 * @static
 * @type {Boolean}
 */
var IS_ANDROID = false;

/**
 * Whether or not this is Microsoft Edge.
 *
 * @static
 * @type {Boolean}
 */
var IS_EDGE = false;

/**
 * Whether or not this is any Chromium Browser
 *
 * @static
 * @type {Boolean}
 */
var IS_CHROMIUM = false;

/**
 * Whether or not this is any Chromium browser that is not Edge.
 *
 * This will also be `true` for Chrome on iOS, which will have different support
 * as it is actually Safari under the hood.
 *
 * Deprecated, as the behaviour to not match Edge was to prevent Legacy Edge's UA matching.
 * IS_CHROMIUM should be used instead.
 * "Chromium but not Edge" could be explicitly tested with IS_CHROMIUM && !IS_EDGE
 *
 * @static
 * @deprecated
 * @type {Boolean}
 */
var IS_CHROME = false;

/**
 * Whether or not this is desktop Safari.
 *
 * @static
 * @type {Boolean}
 */
var IS_SAFARI = false;

/**
 * Whether or not this device is an iPad.
 *
 * @static
 * @type {Boolean}
 */
var IS_IPAD = false;

/**
 * Whether or not this is a mobile device.
 *
 * @static
 * @type {Boolean}
 */
var IS_MOBILE = false;

/**
 * Whether or not this is a touch only device.
 * 
 * @static
 * @type {Boolean}
 */
var IS_TOUCH_ONLY = false;

/**
 * Whether or not this device is an iPhone.
 *
 * @static
 * @type {Boolean}
 */
// The Facebook app's UIWebView identifies as both an iPhone and iPad, so
// to identify iPhones, we need to exclude iPads.
// http://artsy.github.io/blog/2012/10/18/the-perils-of-ios-user-agent-sniffing/
var IS_IPHONE = false;

/**
 * Whether or not this is an iOS device.
 *
 * @static
 * @const
 * @type {Boolean}
 */
var IS_IOS = false;

/**
 * Whether or not this is a Tizen device.
 *
 * @static
 * @type {Boolean}
 */
var IS_TIZEN = false;

/**
 * Whether or not this is a WebOS device.
 *
 * @static
 * @type {Boolean}
 */
var IS_WEBOS = false;
var UAD = window.navigator && window.navigator.userAgentData;
if (UAD && UAD.platform && UAD.brands) {
  // If userAgentData is present, use it instead of userAgent to avoid warnings
  // Currently only implemented on Chromium
  // userAgentData does not expose Android version, so ANDROID_VERSION remains `null`

  IS_ANDROID = UAD.platform === 'Android';
  IS_EDGE = Boolean(UAD.brands.find(function (b) {
    return b.brand === 'Microsoft Edge';
  }));
  IS_CHROMIUM = Boolean(UAD.brands.find(function (b) {
    return b.brand === 'Chromium';
  }));
  IS_CHROME = !IS_EDGE && IS_CHROMIUM;
  (UAD.brands.find(function (b) {
    return b.brand === 'Chromium';
  }) || {}).version || null;
  UAD.platform === 'Windows';
  // Assume that any device with touch functionality and no mouse/touchpad is a tablet or phone.
  // This check is needed because tablets were encountered in testing that did not include "Android"
  // or "Mobile" in their useragent and lacked any other info that could be used to distinguish them.
  IS_TOUCH_ONLY = navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && !window.matchMedia("(pointer: fine").matches;
  IS_MOBILE = UAD.mobile || IS_ANDROID || IS_TOUCH_ONLY;
}

// If the browser is not Chromium, either userAgentData is not present which could be an old Chromium browser,
//  or it's a browser that has added userAgentData since that we don't have tests for yet. In either case,
// the checks need to be made agiainst the regular userAgent string.
if (!IS_CHROMIUM) {
  var USER_AGENT = window.navigator && window.navigator.userAgent || '';
  IS_IPOD = /iPod/i.test(USER_AGENT);
  (function () {
    var match = USER_AGENT.match(/OS (\d+)_/i);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  })();
  IS_ANDROID = /Android/i.test(USER_AGENT);
  (function () {
    // This matches Android Major.Minor.Patch versions
    // ANDROID_VERSION is Major.Minor as a Number, if Minor isn't available, then only Major is returned
    var match = USER_AGENT.match(/Android (\d+)(?:\.(\d+))?(?:\.(\d+))*/i);
    if (!match) {
      return null;
    }
    var major = match[1] && parseFloat(match[1]);
    var minor = match[2] && parseFloat(match[2]);
    if (major && minor) {
      return parseFloat(match[1] + '.' + match[2]);
    } else if (major) {
      return major;
    }
    return null;
  })();
  /Firefox/i.test(USER_AGENT);
  IS_EDGE = /Edg/i.test(USER_AGENT);
  IS_CHROMIUM = /Chrome/i.test(USER_AGENT) || /CriOS/i.test(USER_AGENT);
  IS_CHROME = !IS_EDGE && IS_CHROMIUM;
  (function () {
    var match = USER_AGENT.match(/(Chrome|CriOS)\/(\d+)/);
    if (match && match[2]) {
      return parseFloat(match[2]);
    }
    return null;
  })();
  (function () {
    var result = /MSIE\s(\d+)\.\d/.exec(USER_AGENT);
    var version = result && parseFloat(result[1]);
    if (!version && /Trident\/7.0/i.test(USER_AGENT) && /rv:11.0/.test(USER_AGENT)) {
      // IE 11 has a different user agent string than other IE versions
      version = 11.0;
    }
    return version;
  })();
  IS_TIZEN = /Tizen/i.test(USER_AGENT);
  IS_WEBOS = /Web0S/i.test(USER_AGENT);
  IS_SAFARI = /Safari/i.test(USER_AGENT) && !IS_CHROME && !IS_ANDROID && !IS_EDGE && !IS_TIZEN && !IS_WEBOS;
  /Windows/i.test(USER_AGENT);
  IS_IPHONE = /iPhone/i.test(USER_AGENT) && !IS_IPAD;
  IS_IOS = IS_IPHONE || IS_IPAD || IS_IPOD;
  IS_TOUCH_ONLY = navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && !window.matchMedia("(pointer: fine").matches;
  IS_IPAD = IS_TOUCH_ONLY && !IS_ANDROID && !IS_IPHONE;
  IS_MOBILE = IS_ANDROID || IS_IOS || IS_IPHONE || IS_TOUCH_ONLY || /Mobi/i.test(USER_AGENT);
}

function getValue(key, defaultValue) {
  try {
    return JSON.parse(localStorage.getItem(key)) || defaultValue;
  } catch (e) {
    return defaultValue;
  }
}
var useLocalStorage = function useLocalStorage(key, defaultValue) {
  var _useState = useState(function () {
      return getValue(key, defaultValue);
    }),
    _useState2 = _slicedToArray(_useState, 2),
    value = _useState2[0],
    setValue = _useState2[1];
  useEffect(function () {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
    }
  }, [key, value]);
  return [value, setValue];
};

/** SVG icons for the edit buttons in MarkersDisplay component */
var EditIcon = function EditIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
    style: {
      fill: 'white',
      height: '1rem',
      width: '1rem',
      scale: 0.8
    }
  }, /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989  4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986  16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176  18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071  16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929  2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071  4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622  6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888  15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772  6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523  4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315  21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477  18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17  19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z",
    fill: "#fffff"
  }));
};
var DeleteIcon = function DeleteIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    stroke: "#ffffff",
    style: {
      height: '1rem',
      width: '1rem',
      scale: 0.8
    }
  }, /*#__PURE__*/React.createElement("g", {
    strokeWidth: "0",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 12V17",
    stroke: "#ffffff",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 12V17",
    stroke: "#ffffff",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 7H20",
    stroke: "#ffffff",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10",
    stroke: "#ffffff",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z",
    stroke: "#ffffff",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })));
};
var SaveIcon = function SaveIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    style: {
      height: '1rem',
      width: '1rem',
      scale: 0.8
    }
  }, /*#__PURE__*/React.createElement("g", {
    strokeWidth: "0",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    id: "Vector",
    d: "M6 12L10.2426 16.2426L18.727 7.75732",
    stroke: "#ffffff",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })));
};
var CancelIcon = function CancelIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    fill: "#ffffff",
    viewBox: "0 0 32 32",
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    style: {
      height: '1rem',
      width: '1rem',
      scale: 0.8
    }
  }, /*#__PURE__*/React.createElement("g", {
    strokeWidth: "0",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396  0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038  0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038  0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396  1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396  0.396 0.396 1.038 0 1.435l-6.096 6.096z"
  })));
};

/** SVG icon for previous/next buttons in player control bar */
var SectionButtonIcon = function SectionButtonIcon(_ref) {
  var _ref$flip = _ref.flip,
    flip = _ref$flip === void 0 ? false : _ref$flip;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    style: {
      fill: 'white',
      height: '1.25rem',
      width: '1.25rem',
      transform: flip ? 'rotate(180deg)' : 'rotate(0)'
    }
  }, /*#__PURE__*/React.createElement("g", {
    strokeWidth: "0",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 20L15.3333 12L4 4V20Z",
    fill: "#ffffff"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20 4H17.3333V20H20V4Z",
    fill: "#ffffff"
  })));
};

/** SVG icons for track scrubber button in player control bar */
var TrackScrubberZoomInIcon = function TrackScrubberZoomInIcon(_ref2) {
  var scale = _ref2.scale;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 20 20",
    xmlns: "http://www.w3.org/2000/svg",
    style: {
      fill: 'white',
      height: '1.25rem',
      width: '1.25rem',
      scale: scale
    }
  }, /*#__PURE__*/React.createElement("g", {
    strokeWidth: "0",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#ffffff",
    fillRule: "evenodd",
    d: "M4 9a5 5 0 1110 0A5 5 0 014 9zm5-7a7 7 0 104.2 12.6.999.999  0 00.093.107l3 3a1 1 0 001.414-1.414l-3-3a.999.999 0 00-.107-.093A7 7 0 009 2zM8 6.5a1 1 0 112 0V8h1.5a1  1 0 110 2H10v1.5a1 1 0 11-2 0V10H6.5a1 1 0 010-2H8V6.5z"
  })));
};
var TrackScrubberZoomOutIcon = function TrackScrubberZoomOutIcon(_ref3) {
  var scale = _ref3.scale;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    style: {
      fill: 'white',
      height: '1.25rem',
      width: '1.25rem',
      scale: scale
    }
  }, /*#__PURE__*/React.createElement("g", {
    strokeWidth: "0",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M4 11C4 7.13401 7.13401 4 11 4C14.866 4 18 7.13401 18 11C18 14.866  14.866 18 11 18C7.13401 18 4 14.866 4 11ZM11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C13.125 20 15.078  19.2635 16.6177 18.0319L20.2929 21.7071C20.6834 22.0976 21.3166 22.0976 21.7071 21.7071C22.0976 21.3166 22.0976  20.6834 21.7071 20.2929L18.0319 16.6177C19.2635 15.078 20 13.125 20 11C20 6.02944 15.9706 2 11 2Z",
    fill: "#ffffff"
  }), /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M7 11C7 10.4477 7.44772 10 8 10H14C14.5523 10 15 10.4477 15 11C15  11.5523 14.5523 12 14 12H8C7.44772 12 7 11.5523 7 11Z",
    fill: "#ffffff"
  })));
};

/** SVG icon for inaccessible items in StructuredNavigation component */
var LockedSVGIcon = function LockedSVGIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
    style: {
      height: '0.75rem',
      width: '0.75rem'
    },
    className: "structure-item-locked"
  }, /*#__PURE__*/React.createElement("g", {
    strokeWidth: "0",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M5.25 10.0546V8C5.25 4.27208 8.27208  1.25 12 1.25C15.7279 1.25 18.75 4.27208 18.75 8V10.0546C19.8648 10.1379 20.5907  10.348 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213  21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2  20.2426 2 18.8284 2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.40931 10.348 4.13525  10.1379 5.25 10.0546ZM6.75 8C6.75 5.10051 9.10051 2.75 12 2.75C14.8995 2.75 17.25  5.10051 17.25 8V10.0036C16.867 10 16.4515 10 16 10H8C7.54849 10 7.13301 10 6.75  10.0036V8Z",
    fill: "#000000"
  })));
};

/** SVG icon for previous/next search result in TranscriptSearch */
var SearchArrow = function SearchArrow(_ref4) {
  var _ref4$flip = _ref4.flip,
    flip = _ref4$flip === void 0 ? false : _ref4$flip;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 1024 1024",
    fill: "#ffffff",
    xmlns: "http://www.w3.org/2000/svg",
    style: {
      height: '1rem',
      width: '1rem',
      scale: 0.8,
      transform: flip ? 'rotate(180deg)' : 'rotate(0)'
    }
  }, /*#__PURE__*/React.createElement("g", {
    id: "SVGRepo_bgCarrier",
    strokeWidth: "0"
  }), /*#__PURE__*/React.createElement("g", {
    id: "SVGRepo_tracerCarrier",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("g", {
    id: "SVGRepo_iconCarrier"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M256 120.768L306.432 64 768 512l-461.568 448L256 903.232 659.072 512z",
    fill: "#ffffff"
  })));
};

/** SVG icon for download button TranscriptDownloader */
var FileDownloadIcon = function FileDownloadIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "#fffff",
    xmlns: "http://www.w3.org/2000/svg",
    style: {
      fill: 'none',
      height: '1.25rem',
      width: '1.25rem'
    }
  }, /*#__PURE__*/React.createElement("g", {
    id: "SVGRepo_bgCarrier",
    strokeWidth: "0"
  }), /*#__PURE__*/React.createElement("g", {
    id: "SVGRepo_tracerCarrier",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("g", {
    id: "SVGRepo_iconCarrier"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "24",
    height: "24",
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 12V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V12",
    stroke: "#ffffff",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 3L12 15M12 15L16 11M12 15L8 11",
    stroke: "#ffffff",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })));
};

var classCallCheck = createCommonjsModule(function (module) {
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _classCallCheck = /*@__PURE__*/getDefaultExportFromCjs(classCallCheck);

var createClass = createCommonjsModule(function (module) {
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
module.exports = _createClass, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _createClass = /*@__PURE__*/getDefaultExportFromCjs(createClass);

var assertThisInitialized = createCommonjsModule(function (module) {
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
module.exports = _assertThisInitialized, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _assertThisInitialized = /*@__PURE__*/getDefaultExportFromCjs(assertThisInitialized);

var setPrototypeOf = createCommonjsModule(function (module) {
function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _setPrototypeOf(o, p);
}
module.exports = _setPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var inherits = createCommonjsModule(function (module) {
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
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}
module.exports = _inherits, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _inherits = /*@__PURE__*/getDefaultExportFromCjs(inherits);

var possibleConstructorReturn = createCommonjsModule(function (module) {
var _typeof = _typeof_1["default"];

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return assertThisInitialized(self);
}
module.exports = _possibleConstructorReturn, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _possibleConstructorReturn = /*@__PURE__*/getDefaultExportFromCjs(possibleConstructorReturn);

var getPrototypeOf = createCommonjsModule(function (module) {
function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _getPrototypeOf(o);
}
module.exports = _getPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _getPrototypeOf = /*@__PURE__*/getDefaultExportFromCjs(getPrototypeOf);

function _createForOfIteratorHelper$3(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$3(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$3(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$3(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$3(o, minLen); }
function _arrayLikeToArray$3(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _createSuper$6(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$6(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct$6() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var vjsComponent$5 = videojs.getComponent('Component');

/**
 * Custom component to show progress bar in the player, modified
 * to display multiple items in a single canvas
 * @param {Object} props
 * @param {Number} props.duration canvas duration
 * @param {Array} props.targets set of start and end times for
 * items in the current canvas
 * @param {Function} nextItemClicked callback func to trigger state
 * changes in the parent component
 */
var VideoJSProgress = /*#__PURE__*/function (_vjsComponent) {
  _inherits(VideoJSProgress, _vjsComponent);
  var _super = _createSuper$6(VideoJSProgress);
  function VideoJSProgress(player, options) {
    var _this;
    _classCallCheck(this, VideoJSProgress);
    _this = _super.call(this, player, options);
    _this.addClass('vjs-custom-progress-bar');
    _this.setAttribute('data-testid', 'videojs-custom-progressbar');
    _this.setAttribute('tabindex', 0);
    _this.mount = _this.mount.bind(_assertThisInitialized(_this));
    _this.handleTimeUpdate = _this.handleTimeUpdate.bind(_assertThisInitialized(_this));
    _this.initProgressBar = _this.initProgressBar.bind(_assertThisInitialized(_this));
    _this.player = player;
    _this.options = options;
    _this.currentTime = options.currentTime;
    _this.times = options.targets[options.srcIndex];
    player.on('loadstart', function () {
      var _this$player$targets;
      _this.options.currentTime = _this.player.currentTime();
      _this.options.srcIndex = _this.player.srcIndex || 0;
      _this.options.targets = ((_this$player$targets = _this.player.targets) === null || _this$player$targets === void 0 ? void 0 : _this$player$targets.length) > 0 ? _this.player.targets : _this.options.targets;
      _this.mount();
      _this.initProgressBar();
    });
    return _this;
  }

  /** Build progress bar elements from the options */
  _createClass(VideoJSProgress, [{
    key: "initProgressBar",
    value: function initProgressBar() {
      var _this$options = this.options,
        targets = _this$options.targets,
        srcIndex = _this$options.srcIndex;
      var _targets$srcIndex = targets[srcIndex],
        start = _targets$srcIndex.start,
        end = _targets$srcIndex.end;
      var duration = this.player.canvasDuration;
      var startTime = start,
        endTime = end;
      var isMultiSourced = targets.length > 1 ? true : false;
      var toPlay;
      if (isMultiSourced) {
        var totalDuration = targets.reduce(function (acc, t) {
          return acc + t.duration;
        }, 0);
        // Calculate the width of the playable range as a percentage of total
        // Canvas duration
        toPlay = Math.min(100, Math.max(0, 100 * ((end - start) / totalDuration)));
      } else {
        var leftBlock = startTime * 100 / duration;
        var rightBlock = (duration - endTime) * 100 / duration;
        toPlay = 100 - leftBlock - rightBlock;
        var leftDiv = document.getElementById('left-block');
        var rightDiv = document.getElementById('right-block');
        var dummySliders = document.getElementsByClassName('vjs-custom-progress-inactive');
        if (leftDiv) {
          leftDiv.style.width = leftBlock + '%';
        }
        if (rightDiv) {
          rightDiv.style.width = rightBlock + '%';
        }
        // Set the width of dummy slider ranges based on duration of each item
        var _iterator = _createForOfIteratorHelper$3(dummySliders),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var ds = _step.value;
            var dsIndex = ds.dataset.srcindex;
            var styleWidth = targets[dsIndex].duration * 100 / duration;
            ds.style.width = styleWidth + '%';
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
      if (document.getElementById('slider-range')) {
        document.getElementById('slider-range').style.width = toPlay + '%';
      }
    }

    /**
     * Update CSS for the input range's track while the media
     * is playing
     * @param {Number} curTime current time of the player
     */
  }, {
    key: "handleTimeUpdate",
    value: function handleTimeUpdate(curTime) {
      var player = this.player,
        options = this.options,
        el_ = this.el_;
      var srcIndex = options.srcIndex,
        targets = options.targets;
      var _targets$srcIndex2 = targets[srcIndex],
        start = _targets$srcIndex2.start,
        end = _targets$srcIndex2.end;

      // Avoid null player instance when Video.js is getting initialized
      if (!el_ || !player) {
        return;
      }
      var nextItems = targets.filter(function (_, index) {
        return index > srcIndex;
      });
      // Restrict access to the intended range in the media file
      if (curTime < start) {
        player.currentTime(start);
      }
      // Some items, particularly in playlists, were not having `player.ended()` properly
      // set by the 'ended' event. Providing a fallback check that the player is already
      // paused prevents undesirable behavior from excess state changes after play ending.
      if (curTime >= end && !player.paused() && !player.isDisposed()) {
        if (nextItems.length == 0) {
          options.nextItemClicked(0, targets[0].start);
        }
        player.pause();
        player.trigger('ended');

        // On the next play event set the time to start or a seeked time
        // in between the 'ended' event and 'play' event
        // Reference: https://github.com/videojs/video.js/blob/main/src/js/control-bar/play-toggle.js#L128
        player.one('play', function () {
          var time = player.currentTime();
          if (time < end) {
            player.currentTime(time);
          } else {
            player.currentTime(start);
          }
        });
      }

      // Mark the preceding dummy slider ranges as 'played'
      var dummySliders = document.getElementsByClassName('vjs-custom-progress-inactive');
      var _iterator2 = _createForOfIteratorHelper$3(dummySliders),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var slider = _step2.value;
          var sliderIndex = slider.dataset.srcindex;
          if (sliderIndex < srcIndex) {
            slider.style.setProperty('background', '#2A5459');
          }
        }

        // Calculate the played percentage of the media file's duration
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      var trackoffset = curTime - start;
      var played = Math.min(100, Math.max(0, 100 * trackoffset / (end - start)));
      document.documentElement.style.setProperty('--range-progress', "calc(".concat(played, "%)"));
    }
  }, {
    key: "mount",
    value: function mount() {
      ReactDOM.render( /*#__PURE__*/React.createElement(ProgressBar, {
        player: this.player,
        handleTimeUpdate: this.handleTimeUpdate,
        initCurrentTime: this.options.currentTime,
        times: this.times,
        srcIndex: this.options.srcIndex,
        targets: this.options.targets,
        nextItemClicked: this.options.nextItemClicked
      }), this.el());
    }
  }]);
  return VideoJSProgress;
}(vjsComponent$5);
/**
 *
 * @param {Object} obj
 * @param {obj.player} - current VideoJS player instance
 * @param {obj.handleTimeUpdate} - callback function to update time
 * @param {obj.initCurrentTime} - initial current time of the player
 * @param {obj.times} - start and end times for the current source
 * @param {obj.srcIndex} - src index when multiple files are in a single Canvas
 * @param {obj.targets} - list target media in the Canvas
 * @param {obj.nextItemClicked} - callback function to update state when source changes
 * @returns
 */
function ProgressBar(_ref) {
  var player = _ref.player,
    handleTimeUpdate = _ref.handleTimeUpdate,
    initCurrentTime = _ref.initCurrentTime,
    times = _ref.times,
    srcIndex = _ref.srcIndex,
    targets = _ref.targets,
    nextItemClicked = _ref.nextItemClicked;
  var _React$useState = React.useState(initCurrentTime),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    progress = _React$useState2[0],
    _setProgress = _React$useState2[1];
  var _React$useState3 = React.useState(player.currentTime()),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    currentTime = _React$useState4[0],
    setCurrentTime = _React$useState4[1];
  var timeToolRef = React.useRef();
  var leftBlockRef = React.useRef();
  var sliderRangeRef = React.useRef();
  var _React$useState5 = React.useState([]),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    tLeft = _React$useState6[0],
    setTLeft = _React$useState6[1];
  var _React$useState7 = React.useState([]),
    _React$useState8 = _slicedToArray(_React$useState7, 2),
    tRight = _React$useState8[0],
    setTRight = _React$useState8[1];
  var _React$useState9 = React.useState(times),
    _React$useState10 = _slicedToArray(_React$useState9, 2),
    canvasTimes = _React$useState10[0],
    setCanvasTimes = _React$useState10[1];
  var _React$useState11 = React.useState(0),
    _React$useState12 = _slicedToArray(_React$useState11, 2),
    activeSrcIndex = _React$useState12[0],
    setActiveSrcIndex = _React$useState12[1];
  var _React$useState13 = React.useState(targets),
    _React$useState14 = _slicedToArray(_React$useState13, 2),
    canvasTargets = _React$useState14[0],
    setCanvasTargets = _React$useState14[1];
  var isMultiSourced = targets.length > 1 ? true : false;
  var initTimeRef = React.useRef(initCurrentTime);
  var setInitTime = function setInitTime(t) {
    initTimeRef.current = t;
  };
  var progressRef = React.useRef(progress);
  var setProgress = function setProgress(p) {
    progressRef.current = p;
    _setProgress(p);
  };
  var playerEventListener;
  React.useEffect(function () {
    var _player$targets;
    if (((_player$targets = player.targets) === null || _player$targets === void 0 ? void 0 : _player$targets.length) > 0) {
      setCanvasTargets(player.targets);
    }

    // Position the timetool tip at the first load
    if (timeToolRef.current && sliderRangeRef.current) {
      timeToolRef.current.style.top = -timeToolRef.current.offsetHeight - sliderRangeRef.current.offsetHeight * 6 +
      // deduct 6 x height of progress bar element
      'px';
    }
    var right = canvasTargets.filter(function (_, index) {
      return index > srcIndex;
    });
    var left = canvasTargets.filter(function (_, index) {
      return index < srcIndex;
    });
    setTRight(right);
    setTLeft(left);

    /**
     * By listening to parent container's events the update becomes smoother,
     * since currentTime in state is already updated through these event handlers.
     */
    var progressContainer = document.getElementsByClassName('vjs-custom-progress');
    if ((progressContainer === null || progressContainer === void 0 ? void 0 : progressContainer.length) > 0) {
      progressContainer[0].addEventListener('mouseenter', function (e) {
        handleMouseMove(e, false);
      });
      progressContainer[0].addEventListener('mouseleave', function (e) {
        handleMouseMove(e, false);
      });
    }

    // Clear event listeners
    return function () {
      var progressContainer = document.getElementsByClassName('vjs-custom-progress');
      if ((progressContainer === null || progressContainer === void 0 ? void 0 : progressContainer.length) > 0) {
        progressContainer[0].removeEventListener('mouseenter', function (e) {
          handleMouseMove(e, false);
        });
        progressContainer[0].removeEventListener('mouseleave', function (e) {
          handleMouseMove(e, false);
        });
      }
    };
  }, []);
  React.useEffect(function () {
    setCanvasTargets(targets);
    setCanvasTimes(targets[srcIndex]);
    setActiveSrcIndex(srcIndex);
    var right = canvasTargets.filter(function (_, index) {
      return index > srcIndex;
    });
    var left = canvasTargets.filter(function (_, index) {
      return index < srcIndex;
    });
    setTRight(right);
    setTLeft(left);
    var curTime = player.currentTime();
    setProgress(curTime);
    setCurrentTime(curTime + canvasTimes.altStart);

    /**
     * Using a time interval instead of 'timeupdate event in VideoJS, because Safari
     * and other browsers in MacOS stops firing the 'timeupdate' event consistently 
     * after a while
     */
    playerEventListener = setInterval(function () {
      /**
       * Abortable inerval for Safari desktop browsers, for a smoother scrubbing 
       * experience.
       * Mobile devices are excluded since they use native iOS player.
       */
      if (IS_SAFARI && !IS_IPHONE) {
        abortableTimeupdateHandler();
      } else {
        timeUpdateHandler();
      }
    }, 100);

    // Get the pixel ratio for the range
    var ratio = sliderRangeRef.current.offsetWidth / (canvasTimes.end - canvasTimes.start);

    // Convert current progress to pixel values
    var leftWidth = progressRef.current * ratio;

    // Add the length of the preceding dummy ranges
    var sliderRanges = document.getElementsByClassName('vjs-custom-progress-inactive');
    var _iterator3 = _createForOfIteratorHelper$3(sliderRanges),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var slider = _step3.value;
        var sliderIndex = slider.dataset.srcindex;
        if (sliderIndex < srcIndex) leftWidth += slider.offsetWidth;
      }

      // Hide the timetooltip on mobile/tablet devices
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    if (IS_IPAD || IS_MOBILE) {
      timeToolRef.current.style.display = 'none';
    }
    timeToolRef.current.style.left = leftWidth - timeToolRef.current.offsetWidth / 2 + 'px';
    timeToolRef.current.innerHTML = formatTooltipTime(currentTime);
    handleTimeUpdate(initTimeRef.current);
  }, [player.src(), targets]);

  /**
   * A wrapper function around the time update interval, to cancel
   * intermediate updates via the time interval when player is 
   * waiting to fetch stream
   */
  var abortableTimeupdateHandler = function abortableTimeupdateHandler() {
    player.on('waiting', function () {
      // Set the player's current time to scrubbed time
      player.currentTime(progressRef.current);
      cancelInterval();
    });
    var cancelInterval = function cancelInterval() {
      if (internalInterval) {
        clearInterval(internalInterval);
      }
    };
    var internalInterval = setInterval(function () {
      timeUpdateHandler();
    }, 100);
  };

  // Update progress bar with timeupdate in the player
  var timeUpdateHandler = function timeUpdateHandler() {
    if (player.isDisposed() || player.ended() || player == null) {
      return;
    }
    var iOS = player.hasClass("vjs-ios-native-fs");
    var curTime;
    // Initially update progress from the prop passed from Ramp,
    // this accounts for structured navigation when switching canvases
    if (initTimeRef.current > 0 && player.currentTime() == 0) {
      curTime = initTimeRef.current;
      player.currentTime(initTimeRef.current);
    } else {
      curTime = player.currentTime();
    }
    // This state update caused weird lagging behaviors when using the iOS native
    // player. iOS player handles its own progress bar, so we can skip the
    // update here.
    if (!iOS) {
      setProgress(curTime);
    }
    handleTimeUpdate(curTime);
    setInitTime(0);
  };

  /* 
    In Safari browser, when player is paused selecting and clicking on a
    timepoint on the progress-bar doesn't update the UI immediately. This event
    handler fixes this issue.
  */
  player.on('seeked', function () {
    if (IS_SAFARI) {
      handleTimeUpdate(progressRef.current);
    }
  });
  player.on('dispose', function () {
    clearInterval(playerEventListener);
  });

  // Update our progress bar after the user leaves full screen
  player.on("fullscreenchange", function (e) {
    if (!player.isFullscreen()) {
      setProgress(player.currentTime());
    }
  });

  /**
   * Convert mouseover event to respective time in seconds
   * @param {Object} e mouseover event for input range
   * @param {Number} index src index of the input range
   * @returns time equvalent of the hovered position
   */
  var convertToTime = function convertToTime(e, offsetx, index) {
    if (offsetx && offsetx != undefined) {
      var time = offsetx / e.target.clientWidth * (e.target.max - e.target.min);
      if (index != undefined) time += canvasTargets[index].altStart;
      return time;
    }
  };

  /**
   * Set progress and player time when using the input range
   * (progress bar) to seek to a particular time point
   * @param {Object} e onChange event for input range
   */
  var updateProgress = function updateProgress(e) {
    var time = currentTime;
    if (activeSrcIndex > 0) time -= targets[activeSrcIndex].altStart;
    var start = canvasTimes.start,
      end = canvasTimes.end;
    if (time >= start && time <= end) {
      player.currentTime(time);
      setProgress(time);
    }
  };

  /**
   * Handle onMouseMove event for the progress bar, using the event
   * data to update the value of the time tooltip
   * @param {Object} e onMouseMove event over progress bar (input range)
   * @param {Boolean} isDummy flag indicating whether the hovered over range
   * is active or not
   */
  var handleMouseMove = function handleMouseMove(e, isDummy) {
    var currentSrcIndex = srcIndex;
    if (isDummy) {
      currentSrcIndex = e.target.dataset.srcindex;
    }
    var offsetx = e.nativeEvent != undefined ? e.nativeEvent.offsetX : e.layerX;
    var time = convertToTime(e, offsetx, currentSrcIndex);
    setActiveSrcIndex(currentSrcIndex);
    setCurrentTime(time);

    // Set text in the tooltip as the time relevant to the pointer event's position
    timeToolRef.current.innerHTML = formatTooltipTime(time);

    // Calculate the horizontal position of the time tooltip
    // using the event's offsetX property
    var leftWidth = offsetx - timeToolRef.current.offsetWidth / 2; // deduct 0.5 x width of tooltip element
    if (leftBlockRef.current) leftWidth += leftBlockRef.current.offsetWidth; // add the blocked off area width

    // Add the width of preceding dummy ranges
    var sliderRanges = document.querySelectorAll('input[type=range][class^="vjs-custom-progress"]');
    var _iterator4 = _createForOfIteratorHelper$3(sliderRanges),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var slider = _step4.value;
        var sliderIndex = slider.dataset.srcindex;
        if (sliderIndex < currentSrcIndex) leftWidth += slider.offsetWidth;
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    if (e.pointerType != 'touch') {
      timeToolRef.current.style.left = leftWidth + 'px';
    }
  };

  /**
   * Initiate the switch of the src when clicked on an inactive
   * range. Update srcIndex in the parent components.
   * @param {Object} e onClick event on the dummy range
   */
  var handleClick = function handleClick(e) {
    var clickedSrcIndex = parseInt(e.target.dataset.srcindex);
    var time = currentTime;

    // Deduct the duration of the preceding ranges
    if (clickedSrcIndex > 0) {
      time -= canvasTargets[clickedSrcIndex - 1].duration;
    }
    nextItemClicked(clickedSrcIndex, time);
  };
  var calculateTotalDuration = function calculateTotalDuration() {
    // You could fetch real durations via the metadata of each video if needed
    var duration = canvasTargets.reduce(function (acc, t) {
      return acc + t.duration;
    }, 0);
    if (isNaN(duration)) {
      duration = canvasTargets[0].end;
    }
    return duration;
  };
  var formatTooltipTime = function formatTooltipTime(time) {
    var start = canvasTimes.start,
      end = canvasTimes.end;
    if (isMultiSourced) {
      return timeToHHmmss(time);
    } else {
      if (time >= start && time <= end) {
        return timeToHHmmss(time);
      } else if (time >= end) {
        return timeToHHmmss(end);
      } else if (time <= start) {
        return timeToHHmmss(start);
      }
    }
  };

  /**
   * Handle touch events on the progress bar
   * @param {Object} e touch event 
   */
  var handleTouchEvent = function handleTouchEvent(e) {
    handleMouseMove(e, false);
  };

  /**
   * Build input ranges for the inactive source segments
   * in the manifest
   * @param {Object} tInRange relevant time ranges
   * @returns list of inactive input ranges
   */
  var createRange = function createRange(tInRange) {
    var elements = [];
    tInRange.map(function (t) {
      var widthPercent = Math.min(100, Math.max(0, 100 * (t.duration / calculateTotalDuration())));
      elements.push( /*#__PURE__*/React.createElement("input", {
        type: "range",
        "aria-label": "Progress bar",
        "aria-valuemax": t.end,
        "aria-valuemin": t.start,
        min: t.start,
        max: t.end,
        role: "slider",
        "data-srcindex": t.sIndex,
        className: "vjs-custom-progress-inactive",
        onMouseMove: function onMouseMove(e) {
          return handleMouseMove(e, true);
        },
        onClick: handleClick,
        key: t.sIndex,
        tabIndex: 0,
        style: {
          width: "".concat(widthPercent, "%")
        }
      }));
    });
    return elements;
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "vjs-progress-holder vjs-slider vjs-slider-horizontal"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tooltiptext",
    ref: timeToolRef,
    "aria-hidden": true
  }), /*#__PURE__*/React.createElement("div", {
    className: "vjs-custom-progress-container"
  }, (tLeft === null || tLeft === void 0 ? void 0 : tLeft.length) > 0 ? createRange(tLeft) : /*#__PURE__*/React.createElement("div", {
    className: "block-stripes",
    role: "presentation",
    ref: leftBlockRef,
    id: "left-block",
    style: {
      width: '0%'
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "range",
    "aria-label": "Progress bar",
    "aria-valuemax": canvasTimes.end,
    "aria-valuemin": canvasTimes.start,
    "aria-valuenow": progress,
    max: canvasTimes.end,
    min: canvasTimes.start,
    value: progress,
    role: "slider",
    "data-srcindex": srcIndex,
    className: "vjs-custom-progress",
    onChange: updateProgress,
    onClick: updateProgress,
    onTouchEnd: handleTouchEvent,
    onTouchStart: handleTouchEvent,
    onMouseDown: function onMouseDown(e) {
      return handleMouseMove(e, false);
    },
    onPointerMove: function onPointerMove(e) {
      return handleMouseMove(e, false);
    },
    id: "slider-range",
    ref: sliderRangeRef
  }), (tRight === null || tRight === void 0 ? void 0 : tRight.length) > 0 ? createRange(tRight) : /*#__PURE__*/React.createElement("div", {
    className: "block-stripes",
    role: "presentation",
    id: "right-block",
    style: {
      width: '0%'
    }
  })));
}
vjsComponent$5.registerComponent('VideoJSProgress', VideoJSProgress);

function _createSuper$5(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$5(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct$5() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var vjsComponent$4 = videojs.getComponent('Component');

/**
 * Custom component to display the current time of the player
 * @param {Object} props
 * @param {Object} props.player VideoJS player instance
 * @param {Object} props.options options passed into component
 * options: { srcIndex, targets }
 */
var VideoJSCurrentTime = /*#__PURE__*/function (_vjsComponent) {
  _inherits(VideoJSCurrentTime, _vjsComponent);
  var _super = _createSuper$5(VideoJSCurrentTime);
  function VideoJSCurrentTime(player, options) {
    var _this;
    _classCallCheck(this, VideoJSCurrentTime);
    _this = _super.call(this, player, options);
    _this.addClass('vjs-time-control');
    _this.setAttribute('role', 'presentation');
    _this.mount = _this.mount.bind(_assertThisInitialized(_this));
    _this.player = player;
    _this.options = options;

    /* When player src is changed, call method to mount and update the component */
    player.on('loadstart', function () {
      _this.mount();
    });

    /* Remove React root when component is destroyed */
    _this.on('dispose', function () {
      ReactDOM.unmountComponentAtNode(_this.el());
    });
    return _this;
  }
  _createClass(VideoJSCurrentTime, [{
    key: "mount",
    value: function mount() {
      ReactDOM.render( /*#__PURE__*/React.createElement(CurrentTimeDisplay, {
        player: this.player,
        options: this.options
      }), this.el());
    }
  }]);
  return VideoJSCurrentTime;
}(vjsComponent$4);
function CurrentTimeDisplay(_ref) {
  var player = _ref.player,
    options = _ref.options;
  var targets = options.targets;
  var _React$useState = React.useState(player.currentTime()),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    currTime = _React$useState2[0],
    setCurrTime = _React$useState2[1];
  var initTimeRef = React.useRef(options.currentTime);
  var setInitTime = function setInitTime(t) {
    initTimeRef.current = t;
  };
  var playerEventListener;

  // Clean up time interval on component unmount
  React.useEffect(function () {
    playerEventListener = setInterval(function () {
      handleTimeUpdate();
    }, 100);
    return function () {
      clearInterval(playerEventListener);
    };
  }, []);
  var handleTimeUpdate = function handleTimeUpdate() {
    if (player.isDisposed()) {
      return;
    }
    var iOS = player.hasClass("vjs-ios-native-fs");
    var time;
    // Update time from the given initial time if it is not zero
    if (initTimeRef.current > 0 && player.currentTime() == 0) {
      time = initTimeRef.current;
    } else {
      time = player.currentTime();
    }
    var _targets$player$srcIn = targets[player.srcIndex],
      start = _targets$player$srcIn.start,
      altStart = _targets$player$srcIn.altStart;
    if (altStart != start && player.srcIndex > 0) {
      time = time + altStart;
    }
    // This state update caused weird lagging behaviors when using the iOS native
    // player. iOS player handles its own time, so we can skip the update here.
    if (!iOS) {
      setCurrTime(time);
    }
    setInitTime(0);
  };

  // Update our timer after the user leaves full screen
  player.on("fullscreenchange", function (e) {
    if (!player.isFullscreen()) {
      setCurrTime(player.currentTime());
    }
  });
  return /*#__PURE__*/React.createElement("span", {
    className: "vjs-current-time-display",
    role: "presentation"
  }, timeToHHmmss(currTime));
}
vjsComponent$4.registerComponent('VideoJSCurrentTime', VideoJSCurrentTime);

function _createSuper$4(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$4(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct$4() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var MenuButton = videojs.getComponent('MenuButton');
var MenuItem = videojs.getComponent('MenuItem');
var VideoJSFileDownload = /*#__PURE__*/function (_MenuButton) {
  _inherits(VideoJSFileDownload, _MenuButton);
  var _super = _createSuper$4(VideoJSFileDownload);
  function VideoJSFileDownload(player, options) {
    var _this;
    _classCallCheck(this, VideoJSFileDownload);
    _this = _super.call(this, player, options);
    // Add SVG icon through CSS class
    _this.addClass("vjs-file-download-icon");
    _this.setAttribute('data-testid', 'videojs-file-download');
    // Use Video.js' stock SVG instead of setting it using CSS
    _this.setIcon('file-download');
    return _this;
  }
  _createClass(VideoJSFileDownload, [{
    key: "createItems",
    value: function createItems() {
      var options_ = this.options_,
        player_ = this.player_;
      var files = options_.files;
      if ((files === null || files === void 0 ? void 0 : files.length) > 0) {
        return files.map(function (file) {
          var item = new MenuItem(player_, {
            label: file.label
          });
          item.handleClick = function () {
            fileDownload(file.id, file.filename, file.fileExt);
          };
          return item;
        });
      } else {
        return [];
      }
    }
  }]);
  return VideoJSFileDownload;
}(MenuButton);
videojs.registerComponent('VideoJSFileDownload', VideoJSFileDownload);

var _extends_1 = createCommonjsModule(function (module) {
function _extends() {
  module.exports = _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _extends.apply(this, arguments);
}
module.exports = _extends, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _extends = /*@__PURE__*/getDefaultExportFromCjs(_extends_1);

function _createSuper$3(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$3(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct$3() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var vjsComponent$3 = videojs.getComponent('Component');

/**
 * Custom VideoJS component for skipping to the next canvas
 * when multiple canvases are present in the manifest
 * @param {Object} options
 * @param {Number} options.canvasIndex current canvas's index
 * @param {Number} options.lastCanvasIndex last canvas's index
 * @param {Function} options.switchPlayer callback function switch to next canvas
 */
var VideoJSNextButton = /*#__PURE__*/function (_vjsComponent) {
  _inherits(VideoJSNextButton, _vjsComponent);
  var _super = _createSuper$3(VideoJSNextButton);
  function VideoJSNextButton(player, options) {
    var _this;
    _classCallCheck(this, VideoJSNextButton);
    _this = _super.call(this, player, options);
    _this.setAttribute('data-testid', 'videojs-next-button');
    _this.mount = _this.mount.bind(_assertThisInitialized(_this));
    _this.options = options;
    _this.player = player;

    /* When player src is changed, call method to mount and update next button */
    player.on('loadstart', function () {
      _this.mount();
    });

    /* Remove React root when component is destroyed */
    _this.on('dispose', function () {
      ReactDOM.unmountComponentAtNode(_this.el());
    });
    return _this;
  }
  _createClass(VideoJSNextButton, [{
    key: "mount",
    value: function mount() {
      ReactDOM.render( /*#__PURE__*/React.createElement(NextButton, _extends({}, this.options, {
        player: this.player
      })), this.el());
    }
  }]);
  return VideoJSNextButton;
}(vjsComponent$3);
function NextButton(_ref) {
  var lastCanvasIndex = _ref.lastCanvasIndex,
    switchPlayer = _ref.switchPlayer,
    playerFocusElement = _ref.playerFocusElement,
    player = _ref.player;
  var nextRef = React.useRef();
  var _React$useState = React.useState(player.canvasIndex || 0),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    cIndex = _React$useState2[0],
    setCIndex = _React$useState2[1];

  /**
   * Use both canvasIndex and player.src() as dependecies, since the same
   * resource can appear in 2 consecutive canvases in a multi-canvas manifest.
   * E.g. 2 playlist items created from the same resource in an Avalon playlist
   * manifest.
   */
  React.useEffect(function () {
    if (player && player != undefined) {
      var _player$children;
      // When canvasIndex property is not set in the player instance use dataset.
      // This happens rarely, but when it does next button cannot be used.
      if (player.canvasIndex === undefined && ((_player$children = player.children()) === null || _player$children === void 0 ? void 0 : _player$children.length) > 0) {
        setCIndex(Number(player.children()[0].dataset.canvasindex));
      } else {
        setCIndex(player.canvasIndex);
      }
    }
  }, [player.src(), player.canvasIndex]);
  React.useEffect(function () {
    if (playerFocusElement == 'nextBtn') {
      nextRef.current.focus();
    }
  }, []);
  var handleNextClick = function handleNextClick(isKeyDown) {
    if (cIndex != lastCanvasIndex) {
      switchPlayer(cIndex + 1, true, isKeyDown ? 'nextBtn' : '');
    }
  };
  var handleNextKeyDown = function handleNextKeyDown(e) {
    if (e.which === 32 || e.which === 13) {
      e.stopPropagation();
      handleNextClick(true);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "vjs-button vjs-control"
  }, /*#__PURE__*/React.createElement("button", {
    className: "vjs-button vjs-next-button",
    role: "button",
    ref: nextRef,
    tabIndex: 0,
    title: "Next",
    onClick: function onClick() {
      return handleNextClick(false);
    },
    onKeyDown: handleNextKeyDown
  }, /*#__PURE__*/React.createElement(SectionButtonIcon, null)));
}
videojs.registerComponent('VideoJSNextButton', VideoJSNextButton);

function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$2(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var vjsComponent$2 = videojs.getComponent('Component');

/**
 * Custom VideoJS component for skipping to the previous canvas
 * when multiple canvases are present in the manifest
 * @param {Object} options
 * @param {Number} options.canvasIndex current canvas's index
 * @param {Function} options.switchPlayer callback function to switch to previous canvas
 */
var VideoJSPreviousButton = /*#__PURE__*/function (_vjsComponent) {
  _inherits(VideoJSPreviousButton, _vjsComponent);
  var _super = _createSuper$2(VideoJSPreviousButton);
  function VideoJSPreviousButton(player, options) {
    var _this;
    _classCallCheck(this, VideoJSPreviousButton);
    _this = _super.call(this, player, options);
    _this.setAttribute('data-testid', 'videojs-previous-button');
    _this.mount = _this.mount.bind(_assertThisInitialized(_this));
    _this.options = options;
    _this.player = player;

    /* When player src is changed, call method to mount and update previous button */
    player.on('loadstart', function () {
      _this.mount();
    });

    /* Remove React root when component is destroyed */
    _this.on('dispose', function () {
      ReactDOM.unmountComponentAtNode(_this.el());
    });
    return _this;
  }
  _createClass(VideoJSPreviousButton, [{
    key: "mount",
    value: function mount() {
      ReactDOM.render( /*#__PURE__*/React.createElement(PreviousButton, _extends({}, this.options, {
        player: this.player
      })), this.el());
    }
  }]);
  return VideoJSPreviousButton;
}(vjsComponent$2);
function PreviousButton(_ref) {
  var switchPlayer = _ref.switchPlayer,
    playerFocusElement = _ref.playerFocusElement,
    player = _ref.player;
  var previousRef = React.useRef();
  var _React$useState = React.useState(player.canvasIndex || 0),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    cIndex = _React$useState2[0],
    setCIndex = _React$useState2[1];

  /**
   * Use both canvasIndex and player.src() as dependecies, since the same
   * resource can appear in 2 consecutive canvases in a multi-canvas manifest.
   * E.g. 2 playlist items created from the same resource in an Avalon playlist
   * manifest.
   */
  React.useEffect(function () {
    if (player && player != undefined) {
      var _player$children;
      // When canvasIndex property is not set in the player instance use dataset.
      // This happens rarely, but when it does previous button cannot be used.
      if (player.canvasIndex === undefined && ((_player$children = player.children()) === null || _player$children === void 0 ? void 0 : _player$children.length) > 0) {
        setCIndex(Number(player.children()[0].dataset.canvasindex));
      } else {
        setCIndex(player.canvasIndex);
      }
    }
  }, [player.src(), player.canvasIndex]);
  React.useEffect(function () {
    if (playerFocusElement == 'previousBtn') {
      previousRef.current.focus();
    }
  }, []);
  var handlePreviousClick = function handlePreviousClick(isKeyDown) {
    if (cIndex > -1 && cIndex != 0) {
      switchPlayer(cIndex - 1, true, isKeyDown ? 'previousBtn' : '');
    } else if (cIndex == 0) {
      player.currentTime(0);
    }
  };
  var handlePreviousKeyDown = function handlePreviousKeyDown(e) {
    if (e.which === 32 || e.which === 13) {
      e.stopPropagation();
      handlePreviousClick(true);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "vjs-button vjs-control"
  }, /*#__PURE__*/React.createElement("button", {
    className: "vjs-button vjs-previous-button",
    role: "button",
    ref: previousRef,
    tabIndex: 0,
    title: cIndex == 0 ? "Replay" : "Previous",
    onClick: function onClick() {
      return handlePreviousClick(false);
    },
    onKeyDown: handlePreviousKeyDown
  }, /*#__PURE__*/React.createElement(SectionButtonIcon, {
    flip: true
  })));
}
vjsComponent$2.registerComponent('VideoJSPreviousButton', VideoJSPreviousButton);

function ownKeys$5(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$5(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$5(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$5(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var vjsComponent$1 = videojs.getComponent('Component');
var VideoJSTitleLink = /*#__PURE__*/function (_vjsComponent) {
  _inherits(VideoJSTitleLink, _vjsComponent);
  var _super = _createSuper$1(VideoJSTitleLink);
  function VideoJSTitleLink(player, options) {
    var _this;
    _classCallCheck(this, VideoJSTitleLink);
    _this = _super.call(this, player, options);
    _this.setAttribute('data-testid', 'videojs-title-link');
    _this.mount = _this.mount.bind(_assertThisInitialized(_this));
    _this.options = options;
    _this.player = player;

    /* When player src is changed, call method to mount and update title link */
    player.on('loadstart', function () {
      _this.options = _objectSpread$5(_objectSpread$5({}, _this.options), {}, {
        title: player.canvasLink['label'],
        link: player.canvasLink['id']
      });
      _this.mount();
    });

    /* Remove React root when component is destroyed */
    _this.on('dispose', function () {
      ReactDOM.unmountComponentAtNode(_this.el());
    });
    return _this;
  }
  _createClass(VideoJSTitleLink, [{
    key: "mount",
    value: function mount() {
      ReactDOM.render( /*#__PURE__*/React.createElement(TitleLink, _extends({}, this.options, {
        player: this.player
      })), this.el());
    }
  }]);
  return VideoJSTitleLink;
}(vjsComponent$1);
function TitleLink(_ref) {
  var title = _ref.title,
    link = _ref.link;
    _ref.player;
  var href = null;
  /**
   * Avalon canvas ids are of the form 'http://host.edu/media_objects/#mo_id/manifest/canvas/#section_id`.
   * Accessible url is 'http://host.edu/media_objects/#mo_id/section/#section_id' so we convert the canvas
   * id for avalon manifest, but must assume other implementers will have the id as an actionable link.
   */
  if (link.includes('manifest/canvas')) {
    href = link.replace('manifest/canvas', 'section');
  } else {
    href = link;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "vjs-title-bar"
  }, /*#__PURE__*/React.createElement("a", {
    className: "vjs-title-link",
    href: href,
    target: "_blank",
    rel: "noreferrer noopener"
  }, title));
}
vjsComponent$1.registerComponent('VideoJSTitleLink', VideoJSTitleLink);

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var vjsComponent = videojs.getComponent('Component');

/**
 * Custom VideoJS component for displaying track view when
 * there are tracks/structure timespans in the current Canvas
 * @param {Object} options
 * @param {Number} options.trackScrubberRef React ref to track scrubber element
 * @param {Number} options.timeToolRef React ref to time tooltip element
 * @param {Boolean} options.isPlaylist flag to indicate a playlist Manifest or not
 */
var VideoJSTrackScrubber = /*#__PURE__*/function (_vjsComponent) {
  _inherits(VideoJSTrackScrubber, _vjsComponent);
  var _super = _createSuper(VideoJSTrackScrubber);
  function VideoJSTrackScrubber(player, options) {
    var _this;
    _classCallCheck(this, VideoJSTrackScrubber);
    _this = _super.call(this, player, options);
    _this.setAttribute('data-testid', 'videojs-track-scrubber-button');
    _this.mount = _this.mount.bind(_assertThisInitialized(_this));
    _this.options = options;
    _this.player = player;

    /* 
      When player is fully built and the trackScrubber element is initialized,
      call method to mount React component.
    */
    if (_this.options.trackScrubberRef.current && _this.el_) {
      player.on('loadstart', function () {
        _this.mount();
      });

      /* Remove React root when component is destroyed */
      _this.on('dispose', function () {
        ReactDOM.unmountComponentAtNode(_this.el());
      });
    }
    return _this;
  }
  _createClass(VideoJSTrackScrubber, [{
    key: "mount",
    value: function mount() {
      ReactDOM.render( /*#__PURE__*/React.createElement(TrackScrubberButton, {
        player: this.player,
        trackScrubberRef: this.options.trackScrubberRef,
        timeToolRef: this.options.timeToolRef,
        isPlaylist: this.options.isPlaylist
      }), this.el());
    }
  }]);
  return VideoJSTrackScrubber;
}(vjsComponent);
/**
 * Build the track scrubber component UI and its user interactions.
 * Some of the calculations and code are extracted from the MediaElement lil' scrubber
 * plugin implementation in the Avalon code:
 * https://github.com/avalonmediasystem/avalon/blob/4040e7e61a5d648a500096e80fe2883beef5c46b/app/assets/javascripts/media_player_wrapper/mejs4_plugin_track_scrubber.es6
 * @param {Object} param0 props from the component
 * @param {obj.player} player current VideoJS player instance
 * @param {obj.trackScrubberRef} trackScrubberRef React ref to track scrubber element
 * @param {obj.timeToolRef} timeToolRef React ref to time tooltip element
 * @param {obj.isPlaylist} isPlaylist flag to indicate a playlist Manifest or not
 * @returns 
 */
function TrackScrubberButton(_ref) {
  var player = _ref.player,
    trackScrubberRef = _ref.trackScrubberRef,
    timeToolRef = _ref.timeToolRef,
    isPlaylist = _ref.isPlaylist;
  var _React$useState = React.useState(true),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    zoomedOut = _React$useState2[0],
    setZoomedOut = _React$useState2[1];
  var _React$useState3 = React.useState({}),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    currentTrack = _React$useState4[0],
    _setCurrentTrack = _React$useState4[1];
  var currentTrackRef = React.useRef();
  var setCurrentTrack = function setCurrentTrack(t) {
    currentTrackRef.current = t;
    _setCurrentTrack(t);
  };
  var playerEventListener;
  React.useEffect(function () {
    // Hide the timetooltip on mobile/tablet devices
    if ((IS_IPAD || IS_MOBILE) && timeToolRef.current) {
      timeToolRef.current.style.display = 'none';
    }
    playerEventListener = setInterval(function () {
      timeUpdateHandler();
    }, 100);
    if (player.canvasIsEmpty) {
      setZoomedOut(true);
    }
  }, [player.src(), player.srcIndex, player.canvasIsEmpty]);

  /**
   * Keydown event handler for the track button on the player controls,
   * when using keyboard navigation
   * @param {Event} e keydown event
   */
  var handleTrackScrubberKeyDown = function handleTrackScrubberKeyDown(e) {
    if (e.which === 32 || e.which === 13) {
      e.preventDefault();
      handleTrackScrubberClick();
      e.stopPropagation();
    }
  };

  /**
   * Click event handler for the track button on the player controls
   */
  var handleTrackScrubberClick = function handleTrackScrubberClick() {
    // When player is not fully loaded on the page don't show the track scrubber
    if (!trackScrubberRef.current || !currentTrackRef.current) return;

    // If player is fullscreen exit before displaying track scrubber
    if (player.isFullscreen()) {
      player.exitFullscreen();
    }
    setZoomedOut(function (zoomedOut) {
      return !zoomedOut;
    });
  };

  /**
   * Listen to zoomedOut state variable changes to show/hide track scrubber
   */
  React.useEffect(function () {
    if (trackScrubberRef.current) {
      if (zoomedOut) {
        trackScrubberRef.current.classList.add('hidden');
      } else {
        // Initialize the track scrubber's current time and duration
        populateTrackScrubber();
        trackScrubberRef.current.classList.remove('hidden');
        var pointerDragged = false;
        // Attach mouse pointer events to track scrubber progress bar
        var _trackScrubberRef$cur = _slicedToArray(trackScrubberRef.current.children, 3);
          _trackScrubberRef$cur[0];
          var progressBar = _trackScrubberRef$cur[1];
          _trackScrubberRef$cur[2];
        progressBar.addEventListener('mouseenter', function (e) {
          handleMouseMove(e);
        });
        /*
          Using pointerup, pointermove, pointerdown events instead of
          mouseup, mousemove, mousedown events to make it work with both
          mouse pointer and touch events 
        */
        progressBar.addEventListener('pointerup', function (e) {
          if (pointerDragged) {
            handleSetProgress(e);
          }
        });
        progressBar.addEventListener('pointermove', function (e) {
          handleMouseMove(e);
          pointerDragged = true;
        });
        progressBar.addEventListener('pointerdown', function (e) {
          // Only handle left click event
          if (e.which === 1) {
            handleSetProgress(e);
            pointerDragged = false;
          }
        });
      }
    }
  }, [zoomedOut]);

  // Hide track scrubber if it is displayed when player is going fullscreen
  player.on("fullscreenchange", function () {
    if (player.isFullscreen() && !zoomedOut) {
      setZoomedOut(function (zoomedOut) {
        return !zoomedOut;
      });
    }
  });

  // Clean up interval when player is disposed
  player.on('dispose', function () {
    clearInterval(playerEventListener);
  });
  /**
   * Event handler for VideoJS player instance's 'timeupdate' event, which
   * updates the track scrubber from player state.
   */
  var timeUpdateHandler = function timeUpdateHandler() {
    var _player$markers$getMa;
    if (player.isDisposed() || player.ended()) return;
    /* 
      Get the current track from the player.markers created from the structure timespans.
      In playlists, markers are timepoint information representing highlighting annotations, 
      therefore omit reading markers information for track scrubber in playlist contexts. 
    */
    if (player.markers && typeof player.markers !== 'function' && typeof player.markers.getMarkers === 'function' && ((_player$markers$getMa = player.markers.getMarkers()) === null || _player$markers$getMa === void 0 ? void 0 : _player$markers$getMa.length) > 0 && !isPlaylist) {
      readPlayerMarkers();
    }
    /*
      When playhead is outside a time range marker (track) or in playlist contexts, display 
      the entire playable duration of the media in the track scrubber
    */else if (currentTrack.key === undefined) {
      setCurrentTrack({
        duration: player.playableDuration,
        time: player.altStart,
        key: '',
        text: 'Complete media file'
      });
    }
    var playerCurrentTime = player.currentTime();
    playerCurrentTime = player.srcIndex && player.srcIndex > 0 ? playerCurrentTime + player.altStart : playerCurrentTime;
    updateTrackScrubberProgressBar(playerCurrentTime, player);
  };

  /**
   * Update the track scrubber's current time, duration and played percentage
   * when it is visible in UI. 
   * @param {Number} currentTime current time corresponding to the track
   * @param {Number} playedPercentage elapsed time percentage of the track duration
   */
  var populateTrackScrubber = function populateTrackScrubber() {
    var currentTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var playedPercentage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    if (!trackScrubberRef.current) {
      return;
    }
    var _trackScrubberRef$cur2 = _slicedToArray(trackScrubberRef.current.children, 3),
      currentTimeDisplay = _trackScrubberRef$cur2[0];
      _trackScrubberRef$cur2[1];
      var durationDisplay = _trackScrubberRef$cur2[2];

    // Set the elapsed time percentage in the progress bar of track scrubber
    document.documentElement.style.setProperty('--range-scrubber', "calc(".concat(playedPercentage, "%)"));

    // Update the track duration
    durationDisplay.innerHTML = timeToHHmmss(currentTrackRef.current.duration);
    // Update current time elapsed within the current track
    var cleanTime = !isNaN(currentTime) && currentTime > 0 ? currentTime : 0;
    currentTimeDisplay.innerHTML = timeToHHmmss(cleanTime);
  };

  /**
   * Calculate the progress and current time within the track and
   * update them accordingly when the player's 'timeupdate' event fires.
   * @param {Number} currentTime player's current time
   * @param {Object} player VideoJS player instance
   */
  var updateTrackScrubberProgressBar = function updateTrackScrubberProgressBar(currentTime, player) {
    // Handle Safari which emits the timeupdate event really quickly
    if (!currentTrackRef.current || currentTrackRef.current === undefined) {
      if (player.markers && typeof player.markers.getMarkers === 'function') {
        readPlayerMarkers();
      }
    }
    var altStart = player.altStart,
      srcIndex = player.srcIndex;
    // Calculate corresponding time and played percentage values within track
    var trackoffset = srcIndex > 0 ? currentTime - currentTrackRef.current.time + altStart : currentTime - currentTrackRef.current.time;
    var trackpercent = Math.min(100, Math.max(0, 100 * trackoffset / currentTrackRef.current.duration));
    populateTrackScrubber(trackoffset, trackpercent);
  };
  var readPlayerMarkers = function readPlayerMarkers() {
    var tracks = player.markers.getMarkers().filter(function (m) {
      return m["class"] == 'ramp--track-marker--fragment';
    });
    if ((tracks === null || tracks === void 0 ? void 0 : tracks.length) > 0 && tracks[0].key != (currentTrack === null || currentTrack === void 0 ? void 0 : currentTrack.key)) {
      setCurrentTrack(tracks[0]);
    }
  };

  /**
   * Event handler for mouseenter and mousemove pointer events on the
   * the track scrubber. This sets the time tooltip value and its offset
   * position in the UI.
   * @param {Event} e pointer event for user interaction
   */
  var handleMouseMove = function handleMouseMove(e) {
    if (!timeToolRef.current) {
      return;
    }
    var time = getTrackTime(e);

    // When hovering over the border of the track scrubber, convertTime() returns infinity,
    // since e.target.clientWidth is zero. Use this value to not show the tooltip when this
    // occurs.
    if (isFinite(time)) {
      // Calculate the horizontal position of the time tooltip using the event's offsetX property
      var offset = e.offsetX - timeToolRef.current.offsetWidth / 2; // deduct 0.5 x width of tooltip element
      timeToolRef.current.style.left = offset + 'px';

      // Set text in the tooltip as the time relevant to the pointer event's position
      timeToolRef.current.innerHTML = timeToHHmmss(time);
    }
  };

  /**
   * Event handler for mousedown event on the track scrubber. This sets the
   * progress percentage within track scrubber and update the player's current time
   * when user clicks on a point within the track scrubber.
   * @param {Event} e pointer event for user interaction
   */
  var handleSetProgress = function handleSetProgress(e) {
    if (!currentTrackRef.current) {
      return;
    }
    var trackoffset = getTrackTime(e);
    if (trackoffset != undefined) {
      // Calculate percentage of the progress based on the pointer position's
      // time and duration of the track
      var trackpercent = Math.min(100, Math.max(0, 100 * (trackoffset / currentTrackRef.current.duration)));

      // Set the elapsed time in the scrubber progress bar
      document.documentElement.style.setProperty('--range-scrubber', "calc(".concat(trackpercent, "%)"));

      // Set player's current time with respective to the alt start time of the track and offset
      var playerCurrentTime = player.srcIndex && player.srcIndex > 0 ? trackoffset - currentTrackRef.current.time : trackoffset + currentTrackRef.current.time;
      player.currentTime(playerCurrentTime);
    }
  };

  /**
   * Convert pointer position on track scrubber to a time value
   * @param {Event} e pointer event for user interaction
   * @returns {Number} time corresponding to the pointer position
   */
  var getTrackTime = function getTrackTime(e) {
    if (!currentTrackRef.current) {
      return;
    }
    var offsetx = e.offsetX;
    if (offsetx && offsetx != undefined) {
      var time = offsetx / e.target.clientWidth * currentTrackRef.current.duration;
      return time;
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "vjs-button vjs-control"
  }, /*#__PURE__*/React.createElement("button", {
    className: "vjs-button vjs-track-scrubber-button",
    role: "button",
    tabIndex: 0,
    title: "Toggle track scrubber",
    onClick: handleTrackScrubberClick,
    onKeyDown: handleTrackScrubberKeyDown
  }, zoomedOut && /*#__PURE__*/React.createElement(TrackScrubberZoomInIcon, {
    scale: "0.9"
  }), !zoomedOut && /*#__PURE__*/React.createElement(TrackScrubberZoomOutIcon, {
    scale: "0.9"
  })));
}
vjsComponent.registerComponent('VideoJSTrackScrubber', VideoJSTrackScrubber);

function _createForOfIteratorHelper$2(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$2(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$2(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$2(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen); }
function _arrayLikeToArray$2(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$4(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$4(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
require('@silvermine/videojs-quality-selector')(videojs);
// import vjsYo from './vjsYo';

function VideoJSPlayer(_ref) {
  var isVideo = _ref.isVideo,
    hasMultipleCanvases = _ref.hasMultipleCanvases,
    isPlaylist = _ref.isPlaylist,
    trackScrubberRef = _ref.trackScrubberRef,
    scrubberTooltipRef = _ref.scrubberTooltipRef,
    tracks = _ref.tracks,
    placeholderText = _ref.placeholderText,
    renderingFiles = _ref.renderingFiles,
    enableFileDownload = _ref.enableFileDownload,
    loadPrevOrNext = _ref.loadPrevOrNext,
    lastCanvasIndex = _ref.lastCanvasIndex,
    enableTitleLink = _ref.enableTitleLink,
    options = _ref.options;
  var playerState = usePlayerState();
  var playerDispatch = usePlayerDispatch();
  var manifestState = useManifestState();
  var manifestDispatch = useManifestDispatch();
  var canvasDuration = manifestState.canvasDuration,
    canvasIndex = manifestState.canvasIndex,
    canvasLink = manifestState.canvasLink,
    currentNavItem = manifestState.currentNavItem,
    hasMultiItems = manifestState.hasMultiItems,
    srcIndex = manifestState.srcIndex,
    targets = manifestState.targets,
    autoAdvance = manifestState.autoAdvance,
    playlist = manifestState.playlist,
    structures = manifestState.structures,
    canvasSegments = manifestState.canvasSegments,
    hasStructure = manifestState.hasStructure,
    canvasIsEmpty = manifestState.canvasIsEmpty;
  var isClicked = playerState.isClicked,
    isEnded = playerState.isEnded,
    isPlaying = playerState.isPlaying,
    player = playerState.player,
    searchMarkers = playerState.searchMarkers,
    currentTime = playerState.currentTime;
  var _React$useState = React.useState(canvasIndex),
    _React$useState2 = _slicedToArray(_React$useState, 2);
    _React$useState2[0];
    var _setCIndex = _React$useState2[1];
  var _React$useState3 = React.useState(false),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    isReady = _React$useState4[0],
    _setIsReady = _React$useState4[1];
  var _React$useState5 = React.useState(''),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    activeId = _React$useState6[0],
    _setActiveId = _React$useState6[1];
  var _useLocalStorage = useLocalStorage('startVolume', 1),
    _useLocalStorage2 = _slicedToArray(_useLocalStorage, 2),
    startVolume = _useLocalStorage2[0],
    setStartVolume = _useLocalStorage2[1];
  var _useLocalStorage3 = useLocalStorage('startQuality', null),
    _useLocalStorage4 = _slicedToArray(_useLocalStorage3, 2),
    startQuality = _useLocalStorage4[0],
    setStartQuality = _useLocalStorage4[1];
  var _useLocalStorage5 = useLocalStorage('startMuted', false),
    _useLocalStorage6 = _slicedToArray(_useLocalStorage5, 2),
    startMuted = _useLocalStorage6[0],
    setStartMuted = _useLocalStorage6[1];
  var _React$useState7 = React.useState(null),
    _React$useState8 = _slicedToArray(_React$useState7, 2),
    fragmentMarker = _React$useState8[0],
    setFragmentMarker = _React$useState8[1];
  var _React$useState9 = React.useState(CANVAS_MESSAGE_TIMEOUT / 1000),
    _React$useState10 = _slicedToArray(_React$useState9, 2),
    messageTime = _React$useState10[0],
    setMessageTime = _React$useState10[1];
  var videoJSRef = React.useRef(null);
  var playerRef = React.useRef(null);
  var autoAdvanceRef = React.useRef();
  autoAdvanceRef.current = autoAdvance;
  var srcIndexRef = React.useRef();
  srcIndexRef.current = srcIndex;
  var activeIdRef = React.useRef();
  activeIdRef.current = activeId;
  var setActiveId = function setActiveId(id) {
    _setActiveId(id);
    activeIdRef.current = id;
  };
  var currentTimeRef = React.useRef();
  currentTimeRef.current = currentTime;
  var isReadyRef = React.useRef();
  isReadyRef.current = isReady;
  var setIsReady = function setIsReady(r) {
    _setIsReady(r);
    isReadyRef.current = r;
  };
  var currentNavItemRef = React.useRef();
  currentNavItemRef.current = currentNavItem;
  var canvasIsEmptyRef = React.useRef();
  canvasIsEmptyRef.current = canvasIsEmpty;
  var canvasDurationRef = React.useRef();
  canvasDurationRef.current = canvasDuration;
  var canvasLinkRef = React.useRef();
  canvasLinkRef.current = canvasLink;
  var isPlayingRef = React.useRef();
  isPlayingRef.current = isPlaying;
  var isEndedRef = React.useRef();
  isEndedRef.current = isEnded;
  var cIndexRef = React.useRef();
  cIndexRef.current = canvasIndex;
  var setCIndex = function setCIndex(i) {
    _setCIndex(i);
    cIndexRef.current = i;
  };
  var captionsOnRef = React.useRef();
  var activeTrackRef = React.useRef();
  var canvasSegmentsRef = React.useRef();
  canvasSegmentsRef.current = canvasSegments;
  var structuresRef = React.useRef();
  structuresRef.current = structures;
  var messageIntervalRef = React.useRef(null);

  // FIXME:: Dynamic language imports break with rollup configuration when
  // packaging
  // Using dynamic imports to enforce code-splitting in webpack
  // https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import
  var loadResources = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(langKey) {
      var resources, _resources;
      return regenerator.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return import("../../../../node_modules/video.js/dist/lang/".concat(langKey, ".json"));
          case 3:
            resources = _context.sent;
            return _context.abrupt("return", resources);
          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            console.error("".concat(langKey, " is not available, defaulting to English"));
            _context.next = 12;
            return Promise.resolve().then(function () { return en$1; });
          case 12:
            _resources = _context.sent;
            return _context.abrupt("return", _resources);
          case 14:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[0, 7]]);
    }));
    return function loadResources(_x) {
      return _ref2.apply(this, arguments);
    };
  }();

  // Dispose Video.js instance when VideoJSPlayer component is removed
  React.useEffect(function () {
    return function () {
      if (playerRef.current != null) {
        playerRef.current.dispose();
        document.removeEventListener('keydown', playerHotKeys);
        setIsReady(false);
      }
    };
  }, []);

  /**
   * Initialize Video.js when for the first page load or update
   * src and other properties of the existing Video.js instance
   * on Canvas change
   */
  React.useEffect( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {
    var _options$sources, _options$sources2;
    var selectedLang, languageJSON, _player, _player2;
    return regenerator.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          setCIndex(canvasIndex);

          // Set selected quality from localStorage in Video.js options
          setSelectedQuality(options.sources);

          // Video.js player is only initialized on initial page load
          if (!(!playerRef.current && ((_options$sources = options.sources) === null || _options$sources === void 0 ? void 0 : _options$sources.length) > 0)) {
            _context2.next = 13;
            break;
          }
          _context2.next = 5;
          return loadResources(options.language).then(function (res) {
            selectedLang = JSON.stringify(res);
          });
        case 5:
          languageJSON = JSON.parse(selectedLang);
          buildTracksHTML();
          videojs.addLanguage(options.language, languageJSON);

          // Turn Video.js logging off and handle errors in this code, to avoid
          // cluttering the console when loading inaccessible items.
          videojs.log.level('off');
          _player = playerRef.current = videojs(videoJSRef.current, options, function () {
            playerInitSetup(playerRef.current);
          });
          /* Another way to add a component to the controlBar */
          // player.getChild('controlBar').addChild('vjsYo', {});
          playerDispatch({
            player: _player,
            type: 'updatePlayer'
          });
          _context2.next = 14;
          break;
        case 13:
          if (playerRef.current && ((_options$sources2 = options.sources) === null || _options$sources2 === void 0 ? void 0 : _options$sources2.length) > 0) {
            // Update the existing Video.js player on consecutive Canvas changes
            _player2 = playerRef.current; // Block player while metadata is loaded when canvas is not empty
            if (!canvasIsEmptyRef.current) _player2.addClass('vjs-disabled');
            setIsReady(false);
            updatePlayer(_player2);
            playerLoadedMetadata(_player2);
            playerDispatch({
              player: _player2,
              type: 'updatePlayer'
            });
          }
        case 14:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  })), [options.sources, videoJSRef]);
  React.useEffect(function () {
    // Clear existing interval for inaccessible message display
    clearDisplayTimeInterval();
    if (playerRef.current) {
      // Show/hide control bar for valid/inaccessible items respectively
      if (canvasIsEmptyRef.current) {
        var _currentNavItemRef$cu;
        // Set the player's aspect ratio to video
        playerRef.current.audioOnlyMode(false);
        playerRef.current.canvasIsEmpty = true;
        playerRef.current.aspectRatio('16:9');
        playerRef.current.controlBar.addClass('vjs-hidden');
        playerRef.current.removeClass('vjs-disabled');
        playerRef.current.pause();
        /**
         * Update the activeId to update the active item in the structured navigation.
         * For playable items this is updated in the timeupdate handler.
         */
        setActiveId((_currentNavItemRef$cu = currentNavItemRef.current) === null || _currentNavItemRef$cu === void 0 ? void 0 : _currentNavItemRef$cu.id);
      } else {
        // Reveal control bar; needed when loading a Canvas after an inaccessible item
        playerRef.current.controlBar.removeClass('vjs-hidden');
      }
    }

    // Start interval for inaccessible message display
    if (canvasIsEmptyRef.current && !messageIntervalRef.current) {
      setMessageTime(CANVAS_MESSAGE_TIMEOUT / 1000);
      createDisplayTimeInterval();
    }
  }, [cIndexRef.current, canvasIsEmptyRef.current, currentNavItemRef.current]);

  /**
   * Clear/create display timer interval when auto-advance is turned
   * off/on respectively
   */
  React.useEffect(function () {
    if (!autoAdvance) {
      clearDisplayTimeInterval();
    } else if (autoAdvance && !messageIntervalRef.current && canvasIsEmpty) {
      setMessageTime(CANVAS_MESSAGE_TIMEOUT / 1000);
      createDisplayTimeInterval();
    }
  }, [autoAdvance]);

  // update markers in player
  React.useEffect(function () {
    if (playerRef.current && playerRef.current.markers && isReadyRef.current) {
      var _playlist$markers;
      // markers plugin not yet initialized
      if (typeof playerRef.current.markers === 'function') {
        player.markers({
          markerTip: {
            display: false,
            // true,
            text: function text(marker) {
              return marker.text;
            }
          },
          markerStyle: {},
          markers: []
        });
      }
      var playlistMarkers = [];
      if (playlist !== null && playlist !== void 0 && (_playlist$markers = playlist.markers) !== null && _playlist$markers !== void 0 && _playlist$markers.length) {
        var canvasMarkers = playlist.markers.filter(function (m) {
          return m.canvasIndex === canvasIndex;
        })[0].canvasMarkers;
        playlistMarkers = canvasMarkers.map(function (m) {
          return {
            time: parseFloat(m.time),
            text: m.value,
            "class": 'ramp--track-marker--playlist'
          };
        });
      }
      playerRef.current.markers.removeAll();
      playerRef.current.markers.add([].concat(_toConsumableArray(fragmentMarker ? [fragmentMarker] : []), _toConsumableArray(searchMarkers), _toConsumableArray(playlistMarkers)));
    }
  }, [fragmentMarker, searchMarkers, canvasDuration, canvasIndex, playerRef.current, isReadyRef.current]);

  /**
   * Build track HTML for Video.js player on initial page load
   */
  var buildTracksHTML = function buildTracksHTML() {
    if ((tracks === null || tracks === void 0 ? void 0 : tracks.length) > 0 && videoJSRef.current) {
      tracks.map(function (t) {
        var trackEl = document.createElement('track');
        trackEl.setAttribute('key', t.key);
        trackEl.setAttribute('src', t.src);
        trackEl.setAttribute('kind', t.kind);
        trackEl.setAttribute('label', t.label);
        trackEl.setAttribute('srclang', t.srclang);
        videoJSRef.current.appendChild(trackEl);
      });
    }
  };
  var updatePlayer = function updatePlayer(player) {
    player.duration(canvasDurationRef.current);
    player.canvasDuration = canvasDurationRef.current;
    player.src(options.sources);
    player.poster(options.poster);
    player.canvasIndex = cIndexRef.current;
    player.srcIndex = srcIndex;
    player.targets = targets;
    player.canvasIsEmpty = canvasIsEmptyRef.current;
    if (enableTitleLink) {
      player.canvasLink = canvasLinkRef.current;
    }

    // Update textTracks in the player
    var oldTracks = player.remoteTextTracks();
    var i = oldTracks.length;
    while (i--) {
      player.removeRemoteTextTrack(oldTracks[i]);
    }
    if ((tracks === null || tracks === void 0 ? void 0 : tracks.length) > 0 && isVideo) {
      tracks.forEach(function (track) {
        player.addRemoteTextTrack(track, false);
      });
    }

    /*
      Update player control bar for;
       - track scrubber button
       - appearance of the player: big play button and aspect ratio of the player 
        based on media type
       - volume panel based on media type
       - file download menu
    */
    if (player.getChild('controlBar') != null && !canvasIsEmpty) {
      var controlBar = player.getChild('controlBar');
      // Index of the duration display in the player's control bar
      var durationIndex = controlBar.children().findIndex(function (c) {
        return c.name_ == 'DurationDisplay';
      }) || (hasMultipleCanvases ? 6 : 4);
      /*
        Track-scrubber button: remove if the Manifest is not a playlist manifest
        or the current Canvas doesn't have structure items. Or add back in if it's
        not present otherwise.
       */
      if (!(hasStructure || playlist.isPlaylist)) {
        controlBar.removeChild('videoJSTrackScrubber');
      } else if (!controlBar.getChild('videoJSTrackScrubber')) {
        // Add track-scrubber button after duration display if it is not available
        controlBar.addChild('videoJSTrackScrubber', {
          trackScrubberRef: trackScrubberRef,
          timeToolRef: scrubberTooltipRef
        }, durationIndex + 1);
      }
      if ((tracks === null || tracks === void 0 ? void 0 : tracks.length) > 0 && isVideo && !controlBar.getChild('subsCapsButton')) {
        var subsCapBtn = controlBar.addChild('subsCapsButton', {}, durationIndex + 1);
        // Add CSS to mark captions-on
        subsCapBtn.children_[0].addClass('captions-on');
      }

      /*
        Change player's appearance when switching between audio and video canvases.
        For audio: player height is reduced and big play button is removed
        For video: player aspect ratio is set to 16:9 and has the centered big play button
      */
      if (!isVideo) {
        player.audioOnlyMode(true);
        player.addClass('vjs-audio');
        player.height(player.controlBar.height());
        player.removeChild('bigPlayButton');
      } else {
        player.audioOnlyMode(false);
        player.removeClass('vjs-audio');
        player.aspectRatio('16:9');
        player.addChild('bigPlayButton');
      }

      /*
        Volume panel display on desktop browsers:
        For audio: volume panel is inline with a sticky volume slider
        For video: volume panel is not inline.
        On mobile device browsers, the volume panel is replaced by muteToggle
        for both audio and video.
      */
      if (!IS_MOBILE) {
        var volumeIndex = controlBar.children().findIndex(function (c) {
          return c.name_ == 'VolumePanel';
        });
        controlBar.removeChild('volumePanel');
        if (!isVideo) {
          controlBar.addChild('volumePanel', {
            inline: true
          }, volumeIndex);
        } else {
          controlBar.addChild('volumePanel', {
            inline: false
          }, volumeIndex);
        }
        /* 
          Trigger ready event to reset the volume slider in the refreshed 
          volume panel. This is needed on player reload, since volume slider 
          is set on either 'ready' or 'volumechange' events.
        */
        player.trigger('volumechange');
      }
      if (enableFileDownload) {
        controlBar.removeChild('videoJSFileDownload');
        if ((renderingFiles === null || renderingFiles === void 0 ? void 0 : renderingFiles.length) > 0) {
          var fileOptions = {
            title: 'Download Files',
            controlText: 'Alternate resource download',
            files: renderingFiles
          };
          // For video add icon before last icon, for audio add it to the end
          isVideo ? controlBar.addChild('videoJSFileDownload', _objectSpread$4({}, fileOptions), controlBar.children().length - 1) : controlBar.addChild('videoJSFileDownload', _objectSpread$4({}, fileOptions));
        }
      }
    }
  };

  /**
   * Setup on loadedmetadata event is broken out of initial setup function,
   * since this needs to be called when reloading the player on Canvas change
   * @param {Object} player Video.js player instance
   */
  var playerLoadedMetadata = function playerLoadedMetadata(player) {
    player.one('loadedmetadata', function () {
      console.log('Player loadedmetadata');
      player.duration(canvasDurationRef.current);
      /**
       * Set property canvasDuration in the player to use in videoJSProgress component.
       * This updates the property when player.src() is updates.
       */
      player.canvasDuration = canvasDurationRef.current;

      // Reveal player once metadata is loaded
      player.removeClass('vjs-disabled');
      isEndedRef.current ? player.currentTime(0) : player.currentTime(currentTime);
      if (isEndedRef.current || isPlayingRef.current) {
        /*
          iOS devices lockdown the ability for unmuted audio and video media to autoplay.
          They accomplish this by capturing any programmatic play events and returning
          a rejected Promise. In certain versions of iOS, this rejected promise would
          cause a runtime error within Ramp. This error would cause the error boundary
          handling to trigger, forcing a user to reload the player/page. By silently 
          catching the rejected Promise we are able to provide a more seamless user
          experience, where the user can manually play the media or change to a different
          section.
         */
        var promise = player.play();
        if (promise !== undefined) {
          promise.then(function (_) {
            // Autoplay
          })["catch"](function (error) {
            // Prevent error from triggering error boundary
          });
        }
      }
      if (isVideo) {
        setUpCaptions(player);
      }

      /*
        Set playable duration within the given media file and alternate start time as
        player properties. These values are read by track-scrubber component to build
        and update the track-scrubber progress and time in the UI.
      */
      var mediaRange = getMediaFragment(options.sources[0].src, canvasDurationRef.current);
      if (mediaRange != undefined) {
        player.playableDuration = mediaRange.end - mediaRange.start;
        player.altStart = mediaRange.start;
      } else {
        player.playableDuration = canvasDurationRef.current;
        player.altStart = targets[srcIndex].altStart;
      }
      player.canvasIndex = cIndexRef.current;
      setIsReady(true);

      /**
       * Update currentNavItem on loadedmetadata event in Safari, as it doesn't 
       * trigger the 'timeupdate' event intermittently on load.
       */
      if (IS_SAFARI) {
        handleTimeUpdate();
      }
    });
  };

  /**
   * Setup player with player-related information parsed from the IIIF
   * Manifest Canvas. This gets called on both initial page load and each
   * Canvas switch to setup and update player respectively.
   * @param {Object} player current player instance from Video.js
   */
  var playerInitSetup = function playerInitSetup(player) {
    player.on('ready', function () {
      console.log('Player ready');

      // Add this class in mobile/tablet devices to always show the control bar,
      // since the inactivityTimeout is flaky in some browsers
      if (IS_MOBILE || IS_IPAD) {
        player.controlBar.addClass('vjs-mobile-visible');
      }
      player.muted(startMuted);
      player.volume(startVolume);
      player.srcIndex = srcIndex;

      /**
       * Set property canvasDuration in the player to use in videoJSProgress component.
       * Video.js' in-built duration function doesn't seem to update as fast as
       * we expect to be used in videoJSProgress component.
       * Setting this in the ready callback makes sure this is updated to the
       * correct value before 'loadstart' event is fired in videoJSProgress component.
       */
      player.canvasDuration = canvasDurationRef.current;
      if (enableTitleLink) {
        player.canvasLink = canvasLinkRef.current;
      }
      // Need to set this once experimentalSvgIcons option in Video.js options was enabled
      player.getChild('controlBar').qualitySelector.setIcon('cog');
    });
    playerLoadedMetadata(player);
    player.on('pause', function () {
      // When canvas is empty the pause event is temporary to keep the player
      // instance on page without playing for inaccessible items. The state
      // update is blocked on these events, since it is expected to autoplay
      // the next time player is loaded with playable media.
      if (!canvasIsEmptyRef.current) {
        playerDispatch({
          isPlaying: false,
          type: 'setPlayingStatus'
        });
      }
    });
    player.on('canplay', function () {
      // Reset isEnded flag
      playerDispatch({
        isEnded: false,
        type: 'setIsEnded'
      });
    });
    player.on('play', function () {
      playerDispatch({
        isPlaying: true,
        type: 'setPlayingStatus'
      });
    });
    player.on('timeupdate', function () {
      handleTimeUpdate();
    });
    player.on('ended', function () {
      playerDispatch({
        isEnded: true,
        type: 'setIsEnded'
      });
      handleEnded();
    });
    player.on('volumechange', function () {
      setStartMuted(player.muted());
      setStartVolume(player.volume());
    });
    player.on('qualityRequested', function (e, quality) {
      setStartQuality(quality.label);
    });
    // Use error event listener for inaccessible item display
    player.on('error', function (e) {
      var error = player.error();
      // Handle different error codes
      // TODO::In the future, this can be further improved to give proper feedback to the user when playback is not working
      switch (error.code) {
        case 1:
          console.error('MEDIA_ERR_ABORTED: The fetching process for the media resource was aborted by the user agent\
             at the user’s request.');
          break;
        case 2:
          console.error('MEDIA_ERR_NETWORK: A network error caused the user agent to stop fetching the media resource,\
             after the resource was established to be usable.');
          break;
        case 3:
          console.error('MEDIA_ERR_DECODE: An error occurred while decoding the media resource, after\
             the resource was established to be usable.');
          break;
        case 4:
          console.error('MEDIA_ERR_SRC_NOT_SUPPORTED: The media resource indicated by the src attribute was not suitable.');
          break;
        default:
          console.error('An unknown error occurred.');
          break;
      }
      e.stopPropagation();
    });
    /*
      This event handler helps to execute hotkeys functions related to 'keydown' events
      before any user interactions with the player or when focused on other non-input 
      elements on the page
    */
    document.addEventListener('keydown', function (event) {
      playerHotKeys(event, player, canvasIsEmptyRef.current);
    });
  };

  /**
   * Setup captions for the player based on context
   * @param {Object} player Video.js player instance
   */
  var setUpCaptions = function setUpCaptions(player) {
    var _textTracks$tracks_;
    var textTracks = player.textTracks();
    /* 
      Filter the text track Video.js adds with an empty label and language 
      when nativeTextTracks are enabled for iPhones and iPads.
      Related links, Video.js => https://github.com/videojs/video.js/issues/2808 and
      in Apple => https://developer.apple.com/library/archive/qa/qa1801/_index.html
    */
    if (IS_MOBILE && !IS_ANDROID) {
      textTracks.on('addtrack', function () {
        for (var i = 0; i < textTracks.length; i++) {
          if (textTracks[i].language === '' && textTracks[i].label === '') {
            player.textTracks().removeTrack(textTracks[i]);
          }
          /**
           * This enables the caption in the native iOS player first playback.
           * Only enable caption when captions are turned on.
           * First caption is already turned on in the code block below, so read it
           * from activeTrackRef
           */
          if (captionsOnRef.current && activeTrackRef.current) {
            textTracks.tracks_.filter(function (t) {
              return t.label === activeTrackRef.current.label && t.language === activeTrackRef.current.language;
            })[0].mode = 'showing';
          }
        }
      });
    }

    // Turn first caption/subtitle ON and turn captions ON indicator via CSS on first load
    if (((_textTracks$tracks_ = textTracks.tracks_) === null || _textTracks$tracks_ === void 0 ? void 0 : _textTracks$tracks_.length) > 0) {
      var firstSubCap = null;
      // Flag to identify first valid caption for resource
      var onFirstCap = false;
      // Disable all text tracks to avoid multiple selections and pick the first one as default
      for (var i = 0; i < textTracks.tracks_.length; i++) {
        var t = textTracks.tracks_[i];
        if ((t.kind === 'subtitles' || t.kind === 'captions') && t.language != '' && t.label != '') {
          t.mode = 'disabled';
          if (!onFirstCap) firstSubCap = t;
          onFirstCap = true;
        }
      }

      // Enable the first caption
      if (firstSubCap) {
        firstSubCap.mode = 'showing';
        activeTrackRef.current = firstSubCap;
        handleCaptionChange(true);
      }
    }

    // Add/remove CSS to indicate captions/subtitles is turned on
    textTracks.on('change', function () {
      var trackModes = [];
      for (var _i = 0; _i < textTracks.tracks_.length; _i++) {
        var _textTracks$_i = textTracks[_i],
          mode = _textTracks$_i.mode,
          label = _textTracks$_i.label,
          kind = _textTracks$_i.kind;
        trackModes.push(textTracks[_i].mode);
        if (mode === 'showing' && label != '' && (kind === 'subtitles' || kind === 'captions')) {
          activeTrackRef.current = textTracks[_i];
        }
      }
      var subsOn = trackModes.includes('showing') ? true : false;
      handleCaptionChange(subsOn);
    });
  };

  /**
   * Setting the current time of the player when using structure navigation
   */
  React.useEffect(function () {
    if (playerRef.current !== null && isReadyRef.current) {
      playerRef.current.currentTime(currentTimeRef.current, playerDispatch({
        type: 'resetClick'
      }));
    }
  }, [isClicked, isReady]);
  var setSelectedQuality = function setSelectedQuality(sources) {
    //iterate through sources and find source that matches startQuality and source currently marked selected
    //if found set selected attribute on matching source then remove from currently marked one
    var originalQuality = sources === null || sources === void 0 ? void 0 : sources.find(function (source) {
      return source.selected == true;
    });
    var selectedQuality = sources === null || sources === void 0 ? void 0 : sources.find(function (source) {
      return source.label == startQuality;
    });
    if (selectedQuality) {
      originalQuality.selected = false;
      selectedQuality.selected = true;
    }
  };

  /**
   * Add CSS class to icon to indicate captions are on/off in player control bar
   * @param {Boolean} subsOn flag to indicate captions are on/off
   */
  var handleCaptionChange = function handleCaptionChange(subsOn) {
    var _player$controlBar$su;
    var player = playerRef.current;
    /* 
      For audio instances Video.js is setup to not to build the CC button 
      in Ramp's player control bar.
    */
    if (!player.controlBar.subsCapsButton || !((_player$controlBar$su = player.controlBar.subsCapsButton) !== null && _player$controlBar$su !== void 0 && _player$controlBar$su.children_)) {
      return;
    }
    if (subsOn) {
      player.controlBar.subsCapsButton.children_[0].addClass('captions-on');
      captionsOnRef.current = true;
    } else {
      player.controlBar.subsCapsButton.children_[0].removeClass('captions-on');
      captionsOnRef.current = false;
    }
  };

  /**
   * Handle the 'ended' event fired by the player when a section comes to
   * an end. If there are sections ahead move onto the next canvas and
   * change the player and the state accordingly.
   * Throttle helps to cancel the delayed function call triggered by ended event and
   * load the correct item into the player, when the user clicks on a different item 
   * (not the next item in list) when the current item is coming to its end.
   */
  var handleEnded = React.useMemo(function () {
    return throttle_1(function () {
      var _structuresRef$curren;
      if (!autoAdvanceRef.current && !hasMultiItems || canvasIsEmptyRef.current) {
        return;
      }

      // Remove all the existing structure related markers in the player
      if (playerRef.current && playerRef.current.markers) {
        playerRef.current.markers.removeAll();
      }
      if (hasMultiItems) {
        // When there are multiple sources in a single canvas
        // advance to next source
        if (srcIndex + 1 < targets.length) {
          manifestDispatch({
            srcIndex: srcIndex + 1,
            type: 'setSrcIndex'
          });
          playerDispatch({
            currentTime: 0,
            type: 'setCurrentTime'
          });
        }
      } else if (((_structuresRef$curren = structuresRef.current) === null || _structuresRef$curren === void 0 ? void 0 : _structuresRef$curren.length) > 0) {
        var nextItem = structuresRef.current[cIndexRef.current + 1];
        if (nextItem && nextItem != undefined) {
          manifestDispatch({
            canvasIndex: cIndexRef.current + 1,
            type: 'switchCanvas'
          });

          // Reset startTime and currentTime to zero
          playerDispatch({
            startTime: 0,
            type: 'setTimeFragment'
          });
          playerDispatch({
            currentTime: 0,
            type: 'setCurrentTime'
          });

          // Get first timespan in the next canvas
          var firstTimespanInNextCanvas = canvasSegmentsRef.current.filter(function (t) {
            return t.canvasIndex === nextItem.canvasIndex && t.itemIndex === 1;
          });
          // If the nextItem doesn't have an ID (a Canvas media fragment) pick the first timespan
          // in the next Canvas
          var nextFirstItem = nextItem.id != undefined ? nextItem : firstTimespanInNextCanvas[0];
          var start = 0;
          if (nextFirstItem != undefined && nextFirstItem.id != undefined) {
            start = getMediaFragment(nextFirstItem.id, canvasDurationRef.current).start;
          }

          // If there's a timespan item at the start of the next canvas
          // mark it as the currentNavItem. Otherwise empty out the currentNavItem.
          if (start === 0) {
            manifestDispatch({
              item: nextFirstItem,
              type: 'switchItem'
            });
          } else if (nextFirstItem.isEmpty) {
            // Switch the currentNavItem and clear isEnded flag
            manifestDispatch({
              item: nextFirstItem,
              type: 'switchItem'
            });
            playerRef.current.currentTime(start);
          }
        }
      }
    });
  }, [cIndexRef.current]);

  /**
   * Handle the 'timeUpdate' event emitted by VideoJS player.
   * The current time of the playhead used to show structure in the player's
   * time rail as the playhead arrives at a start time of an existing structure
   * item. When the current time is inside an item, that time fragment is highlighted
   * in the player's time rail.
   * Using throttle helps for smooth updates by cancelling and cleaning up intermediate
   * delayed function calls.
   */
  var handleTimeUpdate = React.useMemo(function () {
    return throttle_1(function () {
      var player = playerRef.current;
      if (player !== null && isReadyRef.current) {
        var _player$currentTime;
        var playerTime = (_player$currentTime = player.currentTime()) !== null && _player$currentTime !== void 0 ? _player$currentTime : currentTimeRef.current;
        if (hasMultiItems && srcIndexRef.current > 0) {
          playerTime = playerTime + targets[srcIndexRef.current].altStart;
        }
        var activeSegment = getActiveSegment(playerTime);
        // the active segment has changed
        if (activeIdRef.current !== (activeSegment === null || activeSegment === void 0 ? void 0 : activeSegment.id)) {
          if (activeSegment === null) {
            /**
             * Clear currentNavItem and other related state variables to update the tracker
             * in structure navigation and highlights within the player.
             */
            manifestDispatch({
              item: null,
              type: 'switchItem'
            });
            setActiveId(null);
            setFragmentMarker(null);
          } else {
            // Set the active segment in state
            manifestDispatch({
              item: activeSegment,
              type: 'switchItem'
            });
            setActiveId(activeSegment.id);
            if (!isPlaylist && player.markers) {
              var _getMediaFragment = getMediaFragment(activeSegment.id, canvasDurationRef.current),
                start = _getMediaFragment.start,
                end = _getMediaFragment.end;
              playerDispatch({
                endTime: end,
                startTime: start,
                type: 'setTimeFragment'
              });
              if (start !== end) {
                // don't let marker extend past the end of the canvas
                var markerEnd = end > canvasDurationRef.current ? canvasDurationRef.current : end;
                setFragmentMarker({
                  time: start,
                  duration: markerEnd - start,
                  text: start,
                  "class": 'ramp--track-marker--fragment'
                });
              } else {
                // to prevent zero duration fragments I suppose
                setFragmentMarker(null);
              }
            } else if (fragmentMarker !== null) {
              setFragmentMarker(null);
            }
          }
        }
      }
    }, 10);
  }, []);

  /**
   * Toggle play/pause on video touch for mobile browsers
   * @param {Object} e onTouchEnd event
   */
  var mobilePlayToggle = function mobilePlayToggle(e) {
    if (e.changedTouches[0].clientX == touchX && e.changedTouches[0].clientY == touchY) {
      if (player.paused()) {
        player.play();
      } else {
        player.pause();
      }
    }
  };

  /**
   * Save coordinates of touch start for comparison to touch end to prevent play/pause
   * when user is scrolling.
   * @param {Object} e onTouchStart event
   */
  var touchX = null;
  var touchY = null;
  var saveTouchStartCoords = function saveTouchStartCoords(e) {
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
  };

  /**
   * Get the segment, which encapsulates the current time of the playhead,
   * from a list of media fragments in the current canvas.
   * @param {Number} time playhead's current time
   */
  var getActiveSegment = function getActiveSegment(time) {
    // Adjust time for multi-item canvases
    var currentTime = time;
    if (hasMultiItems) {
      currentTime = currentTime + targets[srcIndex].altStart;
    }
    if (playlist.isPlaylist) {
      // For playlists timespans and canvasIdex are mapped one-to-one
      return canvasSegmentsRef.current[cIndexRef.current];
    } else {
      // Find the relevant media segment from the structure
      var _iterator = _createForOfIteratorHelper$2(canvasSegmentsRef.current),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var segment = _step.value;
          var id = segment.id,
            isCanvas = segment.isCanvas,
            _canvasIndex = segment.canvasIndex;
          if (_canvasIndex == cIndexRef.current + 1) {
            // Canvases without structure has the Canvas information
            // in Canvas-level item as a navigable link
            if (isCanvas) {
              return segment;
            }
            var segmentRange = getMediaFragment(id, canvasDuration);
            var isInRange = checkSrcRange(segmentRange, canvasDuration);
            var isInSegment = currentTime >= segmentRange.start && currentTime < segmentRange.end;
            if (isInSegment && isInRange) {
              return segment;
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return null;
    }
  };

  /**
   * Create an interval to run every second to update display for the timer
   * for inaccessible canvas message display. Using useCallback to cache the
   * function as this doesn't need to change with component re-renders
   */
  var createDisplayTimeInterval = React.useCallback(function () {
    if (!autoAdvanceRef.current) return;
    var createTime = new Date().getTime();
    messageIntervalRef.current = setInterval(function () {
      var now = new Date().getTime();
      var timeRemaining = (CANVAS_MESSAGE_TIMEOUT - (now - createTime)) / 1000;
      if (timeRemaining > 0) {
        setMessageTime(Math.ceil(timeRemaining));
      } else {
        clearDisplayTimeInterval();
      }
    }, 1000);
  }, []);

  /**
   * Cleanup interval created for timer display for inaccessible message
   */
  var clearDisplayTimeInterval = React.useCallback(function () {
    clearInterval(messageIntervalRef.current);
    messageIntervalRef.current = null;
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    "data-vjs-player": true,
    "data-canvasindex": cIndexRef.current
  }, canvasIsEmptyRef.current && /*#__PURE__*/React.createElement("div", {
    "data-testid": "inaccessible-message-display"
    // These styles needs to be inline for the poster to display within the Video boundaries
    ,
    style: {
      position: !playerRef.current ? 'relative' : 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 'medium',
      color: '#fff',
      backgroundColor: 'black',
      zIndex: 101,
      aspectRatio: !playerRef.current ? '16/9' : '',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "ramp--media-player_inaccessible-message-content",
    "data-testid": "inaccessible-message-content",
    dangerouslySetInnerHTML: {
      __html: placeholderText
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "ramp--media-player_inaccessible-message-buttons"
  }, canvasIndex >= 1 && /*#__PURE__*/React.createElement("button", {
    "aria-label": "Go back to previous item",
    onClick: function onClick() {
      return loadPrevOrNext(canvasIndex - 1, true);
    },
    "data-testid": "inaccessible-previous-button"
  }, /*#__PURE__*/React.createElement(SectionButtonIcon, {
    flip: true
  }), " Previous"), canvasIndex != lastCanvasIndex && /*#__PURE__*/React.createElement("button", {
    "aria-label": "Go to next item",
    onClick: function onClick() {
      return loadPrevOrNext(canvasIndex + 1, true);
    },
    "data-testid": "inaccessible-next-button"
  }, "Next ", /*#__PURE__*/React.createElement(SectionButtonIcon, null))), canvasIndex != lastCanvasIndex && /*#__PURE__*/React.createElement("p", {
    "data-testid": "inaccessible-message-timer",
    className: "ramp--media-player_inaccessible-message-timer ".concat(autoAdvanceRef.current ? '' : 'hidden')
  }, "Next item in ".concat(messageTime, " second").concat(messageTime === 1 ? '' : 's'))), /*#__PURE__*/React.createElement("video", {
    "data-testid": "videojs-".concat(isVideo ? 'video' : 'audio', "-element"),
    "data-canvasindex": cIndexRef.current,
    ref: videoJSRef,
    className: "video-js vjs-big-play-centered vjs-disabled ".concat(IS_ANDROID ? 'is-mobile' : ''),
    onTouchStart: saveTouchStartCoords,
    onTouchEnd: mobilePlayToggle,
    style: {
      display: "".concat(canvasIsEmptyRef.current ? 'none' : '')
    }
  })), (hasStructure || playlist.isPlaylist) && /*#__PURE__*/React.createElement("div", {
    className: "vjs-track-scrubber-container hidden",
    ref: trackScrubberRef,
    id: "track_scrubber"
  }, /*#__PURE__*/React.createElement("p", {
    className: "vjs-time track-currenttime",
    role: "presentation"
  }), /*#__PURE__*/React.createElement("span", {
    type: "range",
    "aria-label": "Track scrubber",
    role: "slider",
    tabIndex: 0,
    className: "vjs-track-scrubber",
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tooltiptext",
    ref: scrubberTooltipRef,
    "aria-hidden": true,
    role: "presentation"
  })), /*#__PURE__*/React.createElement("p", {
    className: "vjs-time track-duration",
    role: "presentation"
  })));
}
VideoJSPlayer.propTypes = {
  isVideo: PropTypes.bool,
  hasMultipleCanvases: PropTypes.bool,
  isPlaylist: PropTypes.bool,
  trackScrubberRef: PropTypes.object,
  scrubberTooltipRef: PropTypes.object,
  tracks: PropTypes.array,
  placeholderText: PropTypes.string,
  renderingFiles: PropTypes.array,
  enableFileDownload: PropTypes.bool,
  cancelAutoAdvance: PropTypes.func,
  loadPrevOrNext: PropTypes.func,
  lastCanvasIndex: PropTypes.number,
  videoJSOptions: PropTypes.object
};

function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$3(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var PLAYER_ID = "iiif-media-player";
var MediaPlayer = function MediaPlayer(_ref) {
  var _ref$enableFileDownlo = _ref.enableFileDownload,
    enableFileDownload = _ref$enableFileDownlo === void 0 ? false : _ref$enableFileDownlo,
    _ref$enablePIP = _ref.enablePIP,
    enablePIP = _ref$enablePIP === void 0 ? false : _ref$enablePIP,
    _ref$enablePlaybackRa = _ref.enablePlaybackRate,
    enablePlaybackRate = _ref$enablePlaybackRa === void 0 ? false : _ref$enablePlaybackRa,
    _ref$enableTitleLink = _ref.enableTitleLink,
    enableTitleLink = _ref$enableTitleLink === void 0 ? false : _ref$enableTitleLink,
    _ref$withCredentials = _ref.withCredentials,
    withCredentials = _ref$withCredentials === void 0 ? false : _ref$withCredentials;
  var manifestState = useManifestState();
  var playerState = usePlayerState();
  var playerDispatch = usePlayerDispatch();
  var manifestDispatch = useManifestDispatch();
  var _useErrorBoundary = useErrorBoundary(),
    showBoundary = _useErrorBoundary.showBoundary;
  var _React$useState = React.useState({
      error: '',
      sources: [],
      tracks: [],
      poster: null
    }),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    playerConfig = _React$useState2[0],
    setPlayerConfig = _React$useState2[1];
  var _React$useState3 = React.useState(true),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    firstLoad = _React$useState4[0],
    setFirstLoad = _React$useState4[1];
  var _React$useState5 = React.useState(false),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    ready = _React$useState6[0],
    setReady = _React$useState6[1];
  var _React$useState7 = React.useState(canvasIndex),
    _React$useState8 = _slicedToArray(_React$useState7, 2),
    cIndex = _React$useState8[0],
    setCIndex = _React$useState8[1];
  var _React$useState9 = React.useState(),
    _React$useState10 = _slicedToArray(_React$useState9, 2),
    isMultiSourced = _React$useState10[0],
    setIsMultiSourced = _React$useState10[1];
  var _React$useState11 = React.useState(false),
    _React$useState12 = _slicedToArray(_React$useState11, 2),
    isMultiCanvased = _React$useState12[0],
    setIsMultiCanvased = _React$useState12[1];
  var _React$useState13 = React.useState(0),
    _React$useState14 = _slicedToArray(_React$useState13, 2),
    lastCanvasIndex = _React$useState14[0],
    setLastCanvasIndex = _React$useState14[1];
  var _React$useState15 = React.useState(),
    _React$useState16 = _slicedToArray(_React$useState15, 2),
    isVideo = _React$useState16[0],
    setIsVideo = _React$useState16[1];
  var _React$useState17 = React.useState(),
    _React$useState18 = _slicedToArray(_React$useState17, 2),
    options = _React$useState18[0],
    setOptions = _React$useState18[1];
  var _React$useState19 = React.useState(),
    _React$useState20 = _slicedToArray(_React$useState19, 2),
    renderingFiles = _React$useState20[0],
    setRenderingFiles = _React$useState20[1];
  var canvasIndex = manifestState.canvasIndex,
    manifest = manifestState.manifest;
    manifestState.canvasDuration;
    var canvasIsEmpty = manifestState.canvasIsEmpty,
    srcIndex = manifestState.srcIndex,
    targets = manifestState.targets,
    playlist = manifestState.playlist,
    autoAdvance = manifestState.autoAdvance,
    hasStructure = manifestState.hasStructure;
  var playerFocusElement = playerState.playerFocusElement,
    currentTime = playerState.currentTime;
    playerState.player;
  var currentTimeRef = React.useRef();
  currentTimeRef.current = currentTime;
  var canvasIndexRef = React.useRef();
  canvasIndexRef.current = canvasIndex;
  var autoAdvanceRef = React.useRef();
  autoAdvanceRef.current = autoAdvance;
  var lastCanvasIndexRef = React.useRef();
  lastCanvasIndexRef.current = lastCanvasIndex;
  var trackScrubberRef = React.useRef();
  var timeToolRef = React.useRef();
  var canvasMessageTimerRef = React.useRef(null);
  React.useEffect(function () {
    if (manifest) {
      try {
        /*
          Always start from the start time relevant to the Canvas only in playlist contexts,
          because canvases related to playlist items always start from the given start.
          With regular manifests, the start time could be different when using structured 
          navigation to switch between canvases.
        */
        initCanvas(canvasIndex, playlist.isPlaylist);

        // flag to identify multiple canvases in the manifest
        // to render previous/next buttons
        var _manifestCanvasesInfo = manifestCanvasesInfo(manifest),
          isMultiCanvas = _manifestCanvasesInfo.isMultiCanvas,
          lastIndex = _manifestCanvasesInfo.lastIndex;
        setIsMultiCanvased(isMultiCanvas);
        setLastCanvasIndex(lastIndex);
      } catch (e) {
        showBoundary(e);
      }
    }
    return function () {
      setReady(false);
      setCIndex(0);
      playerDispatch({
        player: null,
        type: 'updatePlayer'
      });
    };
  }, [manifest, canvasIndex, srcIndex]); // Re-run the effect when manifest changes

  /**
   * Handle the display timer for the inaccessbile message when autoplay is turned
   * on/off while the current item is a restricted item
   */
  React.useEffect(function () {
    if (canvasIsEmpty) {
      // Clear the existing timer when the autoplay is turned off when displaying
      // inaccessible message
      if (!autoAdvance && canvasMessageTimerRef.current) {
        clearCanvasMessageTimer();
      } else {
        // Create a timer to advance to the next Canvas when autoplay is turned
        // on when inaccessible message is been displayed
        createCanvasMessageTimer();
      }
    }
  }, [autoAdvanceRef.current]);

  /**
   * Initialize the next Canvas to be viewed in the player instance
   * @param {Number} canvasId index of the Canvas to be loaded into the player
   * @param {Boolean} fromStart flag to indicate how to start new player instance
   */
  var initCanvas = function initCanvas(canvasId, fromStart) {
    clearCanvasMessageTimer();
    try {
      var _getMediaInfo = getMediaInfo({
          manifest: manifest,
          canvasIndex: canvasId,
          srcIndex: srcIndex
        }),
        isMultiSource = _getMediaInfo.isMultiSource,
        sources = _getMediaInfo.sources,
        tracks = _getMediaInfo.tracks,
        canvasTargets = _getMediaInfo.canvasTargets,
        mediaType = _getMediaInfo.mediaType,
        canvas = _getMediaInfo.canvas,
        error = _getMediaInfo.error;
      setIsVideo(mediaType === 'video');
      manifestDispatch({
        canvasTargets: canvasTargets,
        type: 'canvasTargets'
      });
      manifestDispatch({
        isMultiSource: isMultiSource,
        type: 'hasMultipleItems'
      });
      // Set the current time in player from the canvas details
      if (fromStart) {
        if ((canvasTargets === null || canvasTargets === void 0 ? void 0 : canvasTargets.length) > 0) {
          playerDispatch({
            currentTime: canvasTargets[0].altStart,
            type: 'setCurrentTime'
          });
        } else {
          playerDispatch({
            currentTime: 0,
            type: 'setCurrentTime'
          });
        }
      }
      setPlayerConfig(_objectSpread$3(_objectSpread$3({}, playerConfig), {}, {
        error: error,
        sources: sources,
        tracks: tracks
      }));

      // For empty manifests, canvas property is null.
      if (canvas) {
        // Manifest is taken from manifest state, and is a basic object at this point
        // lacking the getLabel() function so we manually retrieve the first label.
        var manifestLabel = Object.values(manifest.label)[0][0];
        // Filter out falsy items in case canvas.label is null or an empty string
        var titleText = [manifestLabel, canvas.label].filter(Boolean).join(' - ');
        manifestDispatch({
          canvasDuration: canvas.duration,
          type: 'canvasDuration'
        });
        manifestDispatch({
          canvasLink: {
            label: titleText,
            id: canvas.id
          },
          type: 'canvasLink'
        });
        updatePlayerSrcDetails(canvas.duration, sources, canvasId, isMultiSource);
      } else {
        manifestDispatch({
          type: 'setCanvasIsEmpty',
          isEmpty: true
        });
        setPlayerConfig(_objectSpread$3(_objectSpread$3({}, playerConfig), {}, {
          error: error
        }));
      }
      setIsMultiSourced(isMultiSource || false);
      setCIndex(canvasId);
      if (enableFileDownload) {
        var _rendering$canvas$can;
        var rendering = getRenderingFiles(manifest, canvasId);
        setRenderingFiles(rendering.manifest.concat((_rendering$canvas$can = rendering.canvas[canvasId]) === null || _rendering$canvas$can === void 0 ? void 0 : _rendering$canvas$can.files));
      }
      error ? setReady(false) : setReady(true);
    } catch (e) {
      showBoundary(e);
    }
  };

  /**
   * Switch src in the player when seeked to a time range within a
   * different item in the same canvas
   * @param {Number} srcindex new srcIndex
   * @param {Number} value current time of the player
   */
  var nextItemClicked = function nextItemClicked(srcindex, value) {
    playerDispatch({
      currentTime: value,
      type: 'setCurrentTime'
    });
    manifestDispatch({
      srcIndex: srcindex,
      type: 'setSrcIndex'
    });
  };

  /**
   * Update contexts based on the items in the canvas(es) in manifest
   * @param {Number} duration canvas duration
   * @param {Array} sources array of sources passed into player
   * @param {Number} cIndex latest canvas index
   * @param {Boolean} isMultiSource flag indicating whether there are
   * multiple items in the canvas
   */
  var updatePlayerSrcDetails = function updatePlayerSrcDetails(duration, sources, cIndex, isMultiSource) {
    var timeFragment = {};
    if (isMultiSource) {
      manifestDispatch({
        type: 'setCanvasIsEmpty',
        isEmpty: false
      });
    } else if (sources.length === 0) {
      playerDispatch({
        type: 'updatePlayer'
      });
      var itemMessage = getPlaceholderCanvas(manifest, cIndex);
      setPlayerConfig(_objectSpread$3(_objectSpread$3({}, playerConfig), {}, {
        error: itemMessage
      }));
      /*
        Create a timer to display the placeholderCanvas message when,
        autoplay is turned on
      */
      if (autoAdvanceRef.current) {
        createCanvasMessageTimer();
      }
      manifestDispatch({
        type: 'setCanvasIsEmpty',
        isEmpty: true
      });
    } else {
      var playerSrc = (sources === null || sources === void 0 ? void 0 : sources.length) > 0 ? sources.filter(function (s) {
        return s.selected;
      })[0] : null;
      if (playerSrc) {
        timeFragment = getMediaFragment(playerSrc.src, duration);
        if (timeFragment == undefined) {
          timeFragment = {
            start: 0,
            end: duration
          };
        }
        timeFragment.altStart = timeFragment.start;
        manifestDispatch({
          canvasTargets: [timeFragment],
          type: 'canvasTargets'
        });
        manifestDispatch({
          type: 'setCanvasIsEmpty',
          isEmpty: false
        });
      }
    }
  };

  /**
   * Create timer to display the inaccessible Canvas message
   */
  var createCanvasMessageTimer = function createCanvasMessageTimer() {
    canvasMessageTimerRef.current = setTimeout(function () {
      if (canvasIndexRef.current < lastCanvasIndexRef.current && autoAdvanceRef.current) {
        manifestDispatch({
          canvasIndex: canvasIndexRef.current + 1,
          type: 'switchCanvas'
        });
      }
    }, CANVAS_MESSAGE_TIMEOUT);
  };

  /**
   * Clear existing timer to display the inaccessible Canvas message
   */
  var clearCanvasMessageTimer = function clearCanvasMessageTimer() {
    if (canvasMessageTimerRef.current) {
      clearTimeout(canvasMessageTimerRef.current);
      canvasMessageTimerRef.current = null;
    }
  };

  /**
   * Switch player when navigating across canvases
   * @param {Number} index canvas index to be loaded into the player
   * @param {Boolean} fromStart flag to indicate set player start time to zero or not
   * @param {String} focusElement element to be focused within the player when using
   * next or previous buttons with keyboard
   */
  var switchPlayer = function switchPlayer(index, fromStart) {
    var focusElement = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    if (canvasIndexRef.current != index && index <= lastCanvasIndexRef.current) {
      manifestDispatch({
        canvasIndex: index,
        type: 'switchCanvas'
      });
      initCanvas(index, fromStart);
      playerDispatch({
        element: focusElement,
        type: 'setPlayerFocusElement'
      });
    }
  };
  React.useEffect(function () {
    var hlsOptions = withCredentials ? {
      hls: {
        withCredentials: true
      }
    } : {};
    var videoJsOptions;
    // Only build the full set of option for the first playable Canvas since
    // these options are only used on the initia Video.js instance creation
    if (firstLoad && ready && !canvasIsEmpty) {
      // Configuration options for Video.js instantiation
      videoJsOptions = !canvasIsEmpty ? {
        aspectRatio: isVideo ? '16:9' : '1:0',
        audioOnlyMode: !isVideo,
        autoplay: false,
        bigPlayButton: isVideo,
        id: PLAYER_ID,
        playbackRates: enablePlaybackRate ? [0.5, 0.75, 1, 1.5, 2] : [],
        experimentalSvgIcons: true,
        // Setting inactivity timeout to zero in mobile and tablet devices translates to
        // user is always active. And the control bar is not hidden when user is active.
        // With this user can always use the controls when the media is playing.
        inactivityTimeout: IS_MOBILE || IS_TOUCH_ONLY ? 0 : 2000,
        poster: isVideo ? getPlaceholderCanvas(manifest, canvasIndex, true) : null,
        controls: true,
        fluid: true,
        language: "en",
        // TODO:: fill this information from props
        controlBar: {
          // Define and order control bar controls
          // See https://docs.videojs.com/tutorial-components.html for options of what
          // seem to be supported controls
          children: [isMultiCanvased ? 'videoJSPreviousButton' : '', 'playToggle', isMultiCanvased ? 'videoJSNextButton' : '', 'videoJSProgress', 'videoJSCurrentTime', 'timeDivider', 'durationDisplay', hasStructure || playlist.isPlaylist ? 'videoJSTrackScrubber' : '', playerConfig.tracks.length > 0 && isVideo ? 'subsCapsButton' : '', IS_MOBILE ? 'muteToggle' : 'volumePanel', 'qualitySelector', enablePlaybackRate ? 'playbackRateMenuButton' : '', enablePIP ? 'pictureInPictureToggle' : '', enableFileDownload ? 'videoJSFileDownload' : '', 'fullscreenToggle'
          // 'vjsYo',             custom component
          ],

          videoJSProgress: {
            srcIndex: srcIndex,
            targets: targets,
            currentTime: currentTime || 0,
            nextItemClicked: nextItemClicked
          },
          videoJSCurrentTime: {
            srcIndex: srcIndex,
            targets: targets,
            currentTime: currentTime || 0
          }
        },
        sources: isMultiSourced ? [playerConfig.sources[srcIndex]] : playerConfig.sources,
        // Enable native text track functionality in iPhones and iPads
        html5: _objectSpread$3(_objectSpread$3({}, hlsOptions), {}, {
          nativeTextTracks: IS_MOBILE && !IS_ANDROID
        }),
        /* 
          Setting this option helps to override VideoJS's default 'keydown' event handler, whenever
          the focus is on a native VideoJS control icon (e.g. play toggle).
          E.g. click event on 'playtoggle' sets the focus on the play/pause button,
          which has VideoJS's 'handleKeydown' event handler attached to it. Therefore, as long as the
          focus is on the play/pause button the 'keydown' event will pass through VideoJS's default
          'keydown' event handler, without ever reaching the 'keydown' handler setup on the document
          in Ramp code.
          When this option is setup VideoJS's 'handleKeydown' event handler passes the event to the
          function setup under the 'hotkeys' option when the native player controls are focused.
          In Safari, this works without using 'hotkeys' option, therefore only set this in other browsers.
        */
        userActions: {
          hotkeys: !IS_SAFARI ? function (e) {
            playerHotKeys(e, this);
          } : undefined
        },
        videoJSTitleLink: enableTitleLink
      } : {
        sources: []
      }; // Empty configurations for empty canvases

      // Make the volume slider horizontal for audio in non-mobile browsers
      if (!IS_MOBILE && !canvasIsEmpty) {
        videoJsOptions.controlBar.volumePanel = {
          inline: isVideo ? false : true
        };
      }

      // Add file download to toolbar when it is enabled via props
      if (enableFileDownload && !canvasIsEmpty) {
        videoJsOptions.controlBar.videoJSFileDownload = {
          title: 'Download Files',
          controlText: 'Alternate resource download',
          files: renderingFiles
        };
      }
      if (isMultiCanvased && !canvasIsEmpty) {
        videoJsOptions.controlBar.videoJSPreviousButton = {
          canvasIndex: canvasIndex,
          switchPlayer: switchPlayer,
          playerFocusElement: playerFocusElement
        };
        videoJsOptions.controlBar.videoJSNextButton = {
          canvasIndex: canvasIndex,
          lastCanvasIndex: lastCanvasIndexRef.current,
          switchPlayer: switchPlayer,
          playerFocusElement: playerFocusElement
        };
      }
      // Iniitialize track scrubber button when the current Canvas has 
      // structure timespans or the given Manifest is a playlist Manifest
      if ((hasStructure || playlist.isPlaylist) && !canvasIsEmpty) {
        videoJsOptions.controlBar.videoJSTrackScrubber = {
          trackScrubberRef: trackScrubberRef,
          timeToolRef: timeToolRef,
          isPlaylist: playlist.isPlaylist
        };
      }
      setFirstLoad(false);
    } else {
      videoJsOptions = {
        sources: isMultiSourced ? [playerConfig.sources[srcIndex]] : playerConfig.sources,
        poster: isVideo ? getPlaceholderCanvas(manifest, canvasIndex, true) : null
      };
    }
    setOptions(videoJsOptions);
  }, [ready, cIndex, srcIndex, canvasIsEmpty, currentTime]);
  if (ready && options != undefined || canvasIsEmpty) {
    return /*#__PURE__*/React.createElement("div", {
      "data-testid": "media-player",
      className: "ramp--media_player",
      role: "presentation"
    }, /*#__PURE__*/React.createElement(VideoJSPlayer, {
      isVideo: isVideo,
      hasMultipleCanvases: isMultiCanvased,
      isPlaylist: playlist.isPlaylist,
      trackScrubberRef: trackScrubberRef,
      scrubberTooltipRef: timeToolRef,
      tracks: playerConfig.tracks,
      placeholderText: playerConfig.error,
      renderingFiles: renderingFiles,
      enableFileDownload: enableFileDownload,
      loadPrevOrNext: switchPlayer,
      lastCanvasIndex: lastCanvasIndex,
      enableTitleLink: enableTitleLink,
      options: options
    }));
  } else {
    return null;
  }
};
MediaPlayer.propTypes = {
  enableFileDownload: PropTypes.bool,
  enablePIP: PropTypes.bool,
  enablePlaybackRate: PropTypes.bool
};

var SectionHeading = function SectionHeading(_ref) {
  var duration = _ref.duration,
    label = _ref.label,
    itemIndex = _ref.itemIndex,
    canvasIndex = _ref.canvasIndex,
    sectionRef = _ref.sectionRef,
    itemId = _ref.itemId,
    isRoot = _ref.isRoot,
    handleClick = _ref.handleClick,
    structureContainerRef = _ref.structureContainerRef;
  var itemLabelRef = React.useRef();
  itemLabelRef.current = label;

  /*
    Auto-scroll active section into view only when user is not
    actively interacting with structured navigation
  */
  React.useEffect(function () {
    if (canvasIndex + 1 === itemIndex && sectionRef.current && sectionRef.current.isClicked != undefined && !sectionRef.current.isClicked && structureContainerRef.current.isScrolling != undefined && !structureContainerRef.current.isScrolling) {
      autoScroll(sectionRef.current, structureContainerRef);
    }
    sectionRef.current.isClicked = false;
  }, [canvasIndex]);
  var sectionClassName = "ramp--structured-nav__section".concat(canvasIndex + 1 === itemIndex ? ' active' : '');
  if (itemId != undefined) {
    return /*#__PURE__*/React.createElement("div", {
      className: sectionClassName,
      role: "listitem",
      "data-testid": "listitem-section",
      ref: sectionRef,
      "data-mediafrag": itemId,
      "data-label": itemLabelRef.current
    }, /*#__PURE__*/React.createElement("button", {
      "data-testid": "listitem-section-button",
      ref: sectionRef,
      onClick: handleClick
    }, /*#__PURE__*/React.createElement("span", {
      className: "ramp--structured-nav__title",
      "aria-label": itemLabelRef.current
    }, "".concat(itemIndex, ". "), itemLabelRef.current, duration != '' && /*#__PURE__*/React.createElement("span", {
      className: "ramp--structured-nav__section-duration"
    }, duration))));
  } else {
    return /*#__PURE__*/React.createElement("div", {
      className: sectionClassName,
      "data-testid": "listitem-section",
      ref: sectionRef,
      "data-label": itemLabelRef.current
    }, /*#__PURE__*/React.createElement("span", {
      className: "ramp--structured-nav__section-title",
      role: "listitem",
      "data-testid": "listitem-section-span",
      "aria-label": itemLabelRef.current
    }, isRoot ? '' : "".concat(itemIndex, ". "), itemLabelRef.current, duration != '' && /*#__PURE__*/React.createElement("span", {
      className: "ramp--structured-nav__section-duration"
    }, duration)));
  }
};
SectionHeading.propTypes = {
  itemIndex: PropTypes.number.isRequired,
  canvasIndex: PropTypes.number,
  duration: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  sectionRef: PropTypes.object.isRequired,
  itemId: PropTypes.string,
  isRoot: PropTypes.bool,
  handleClick: PropTypes.func.isRequired,
  structureContainerRef: PropTypes.object.isRequired
};

var ListItem = function ListItem(_ref) {
  var duration = _ref.duration,
    id = _ref.id,
    isTitle = _ref.isTitle,
    isCanvas = _ref.isCanvas,
    isClickable = _ref.isClickable,
    isEmpty = _ref.isEmpty,
    label = _ref.label,
    summary = _ref.summary,
    homepage = _ref.homepage,
    isRoot = _ref.isRoot,
    items = _ref.items,
    itemIndex = _ref.itemIndex,
    rangeId = _ref.rangeId,
    canvasDuration = _ref.canvasDuration,
    sectionRef = _ref.sectionRef,
    structureContainerRef = _ref.structureContainerRef;
  var playerDispatch = usePlayerDispatch();
  var _useManifestState = useManifestState(),
    canvasIndex = _useManifestState.canvasIndex,
    currentNavItem = _useManifestState.currentNavItem,
    playlist = _useManifestState.playlist;
  var isPlaylist = playlist.isPlaylist;
  var itemIdRef = React.useRef();
  itemIdRef.current = id;
  var itemLabelRef = React.useRef();
  itemLabelRef.current = label;
  var itemSummaryRef = React.useRef();
  itemSummaryRef.current = summary;
  var subMenu = items && items.length > 0 ? /*#__PURE__*/React.createElement(List, {
    items: items,
    sectionRef: sectionRef,
    structureContainerRef: structureContainerRef
  }) : null;
  var liRef = React.useRef(null);
  var handleClick = React.useCallback(function (e) {
    e.preventDefault();
    e.stopPropagation();
    var _getMediaFragment = getMediaFragment(itemIdRef.current, canvasDuration),
      start = _getMediaFragment.start,
      end = _getMediaFragment.end;
    var inRange = checkSrcRange({
      start: start,
      end: end
    }, {
      end: canvasDuration
    });
    /* 
      Only continue the click action if not both start and end times of 
      the timespan are not outside Canvas' duration
    */
    if (inRange) {
      playerDispatch({
        clickedUrl: itemIdRef.current,
        type: 'navClick'
      });
      liRef.current.isClicked = true;
      if (sectionRef.current) {
        sectionRef.current.isClicked = true;
      }
    }
  });
  React.useEffect(function () {
    /*
      Auto-scroll active structure item into view only when user is not actively
      interacting with structured navigation
    */
    if (liRef.current && (currentNavItem === null || currentNavItem === void 0 ? void 0 : currentNavItem.id) == itemIdRef.current && liRef.current.isClicked != undefined && !liRef.current.isClicked && structureContainerRef.current.isScrolling != undefined && !structureContainerRef.current.isScrolling) {
      autoScroll(liRef.current, structureContainerRef);
    }
    liRef.current.isClicked = false;
  }, [currentNavItem]);
  var renderListItem = function renderListItem() {
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: rangeId
    }, isCanvas && !isPlaylist ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionHeading, {
      itemIndex: itemIndex,
      canvasIndex: canvasIndex,
      duration: duration,
      label: label,
      sectionRef: sectionRef,
      itemId: itemIdRef.current,
      isRoot: isRoot,
      handleClick: handleClick,
      structureContainerRef: structureContainerRef
    })) : /*#__PURE__*/React.createElement(React.Fragment, null, isTitle ? /*#__PURE__*/React.createElement("span", {
      className: "ramp--structured-nav__item-title",
      role: "listitem",
      "aria-label": itemLabelRef.current
    }, itemLabelRef.current) : /*#__PURE__*/React.createElement(React.Fragment, {
      key: id
    }, /*#__PURE__*/React.createElement("div", {
      className: "tracker"
    }), isClickable ? /*#__PURE__*/React.createElement(React.Fragment, null, isEmpty && /*#__PURE__*/React.createElement(LockedSVGIcon, null), /*#__PURE__*/React.createElement("a", {
      role: "listitem",
      href: homepage && homepage != '' ? homepage : itemIdRef.current,
      onClick: handleClick
    }, "".concat(itemIndex, ". "), itemLabelRef.current, " ", duration.length > 0 ? " (".concat(duration, ")") : '')) : /*#__PURE__*/React.createElement("span", {
      role: "listitem",
      "aria-label": itemLabelRef.current
    }, itemLabelRef.current))));
  };
  if (label != '') {
    return /*#__PURE__*/React.createElement("li", {
      "data-testid": "list-item",
      ref: liRef,
      className: 'ramp--structured-nav__list-item' + "".concat(itemIdRef.current != undefined && (currentNavItem === null || currentNavItem === void 0 ? void 0 : currentNavItem.id) === itemIdRef.current && (isPlaylist || !isCanvas) && (currentNavItem === null || currentNavItem === void 0 ? void 0 : currentNavItem.canvasIndex) === canvasIndex + 1 ? ' active' : ''),
      "data-label": itemLabelRef.current,
      "data-summary": itemSummaryRef.current
    }, renderListItem(), subMenu);
  } else {
    return null;
  }
};
ListItem.propTypes = {
  duration: PropTypes.string.isRequired,
  id: PropTypes.string,
  isTitle: PropTypes.bool.isRequired,
  isCanvas: PropTypes.bool.isRequired,
  isClickable: PropTypes.bool.isRequired,
  isEmpty: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  summary: PropTypes.string,
  homepage: PropTypes.string,
  isRoot: PropTypes.bool,
  items: PropTypes.array.isRequired,
  itemIndex: PropTypes.number,
  rangeId: PropTypes.string.isRequired,
  canvasDuration: PropTypes.number.isRequired,
  sectionRef: PropTypes.object.isRequired,
  structureContainerRef: PropTypes.object.isRequired
};

var List = function List(_ref) {
  var items = _ref.items,
    sectionRef = _ref.sectionRef,
    structureContainerRef = _ref.structureContainerRef;
  var collapsibleContent = /*#__PURE__*/React.createElement("ul", {
    "data-testid": "list",
    className: "ramp--structured-nav__list",
    role: "presentation"
  }, items.map(function (item, index) {
    if (item) {
      return /*#__PURE__*/React.createElement(ListItem, _extends({}, item, {
        sectionRef: sectionRef,
        key: index,
        structureContainerRef: structureContainerRef
      }));
    }
  }));
  return /*#__PURE__*/React.createElement(React.Fragment, null, collapsibleContent);
};
List.propTypes = {
  items: PropTypes.array.isRequired,
  sectionRef: PropTypes.object.isRequired,
  structureContainerRef: PropTypes.object.isRequired
};

function _createForOfIteratorHelper$1(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }
function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var StructuredNavigation = function StructuredNavigation() {
  var _structureItemsRef$cu;
  var manifestDispatch = useManifestDispatch();
  var playerDispatch = usePlayerDispatch();
  var _usePlayerState = usePlayerState(),
    clickedUrl = _usePlayerState.clickedUrl,
    isClicked = _usePlayerState.isClicked,
    isPlaying = _usePlayerState.isPlaying,
    player = _usePlayerState.player;
  var _useManifestState = useManifestState(),
    canvasDuration = _useManifestState.canvasDuration,
    canvasIndex = _useManifestState.canvasIndex,
    hasMultiItems = _useManifestState.hasMultiItems,
    targets = _useManifestState.targets,
    manifest = _useManifestState.manifest,
    playlist = _useManifestState.playlist,
    canvasIsEmpty = _useManifestState.canvasIsEmpty,
    canvasSegments = _useManifestState.canvasSegments,
    autoAdvance = _useManifestState.autoAdvance;
  var _useErrorBoundary = useErrorBoundary(),
    showBoundary = _useErrorBoundary.showBoundary;
  var canvasStructRef = React.useRef();
  var structureItemsRef = React.useRef();
  var canvasIsEmptyRef = React.useRef(canvasIsEmpty);
  var hasRootRangeRef = React.useRef(false);
  var structureContainerRef = React.useRef();
  var scrollableStructure = React.useRef();
  React.useEffect(function () {
    // Update currentTime and canvasIndex in state if a
    // custom start time and(or) canvas is given in manifest
    if (manifest) {
      try {
        var _getStructureRanges = getStructureRanges(manifest, playlist.isPlaylist),
          structures = _getStructureRanges.structures,
          timespans = _getStructureRanges.timespans,
          markRoot = _getStructureRanges.markRoot;
        structureItemsRef.current = structures;
        canvasStructRef.current = structures;
        hasRootRangeRef.current = markRoot;
        // Remove root-level structure item from navigation calculations
        if ((structures === null || structures === void 0 ? void 0 : structures.length) > 0 && structures[0].isRoot) {
          canvasStructRef.current = structures[0].items;
        }
        manifestDispatch({
          structures: canvasStructRef.current,
          type: 'setStructures'
        });
        manifestDispatch({
          timespans: timespans,
          type: 'setCanvasSegments'
        });
        structureContainerRef.current.isScrolling = false;
      } catch (error) {
        showBoundary(error);
      }
    }
  }, [manifest]);

  // Set currentNavItem when current Canvas is an inaccessible/empty item
  React.useEffect(function () {
    if (canvasIsEmpty && playlist.isPlaylist) {
      manifestDispatch({
        item: canvasSegments[canvasIndex],
        type: 'switchItem'
      });
    }
  }, [canvasIsEmpty, canvasIndex]);
  React.useEffect(function () {
    if (isClicked) {
      var clickedItem = canvasSegments.filter(function (c) {
        return c.id === clickedUrl;
      });
      if ((clickedItem === null || clickedItem === void 0 ? void 0 : clickedItem.length) > 0) {
        // Only update the current nav item for timespans
        // Eliminate Canvas level items unless the structure is empty
        var _clickedItem$ = clickedItem[0],
          isCanvas = _clickedItem$.isCanvas,
          items = _clickedItem$.items;
        if (!isCanvas || items.length == 0 && isCanvas) {
          manifestDispatch({
            item: clickedItem[0],
            type: 'switchItem'
          });
        }
      }
      var currentCanvasIndex = getCanvasIndex(manifest, getCanvasId(clickedUrl));
      var timeFragment = getMediaFragment(clickedUrl, canvasDuration);

      // Invalid time fragment
      if (!timeFragment || timeFragment == undefined) {
        console.error('StructuredNavigation -> invalid media fragment in structure item -> ', timeFragment);
        return;
      }
      var timeFragmentStart = timeFragment.start;
      if (hasMultiItems) {
        var _getCanvasTarget = getCanvasTarget(targets, timeFragment, canvasDuration),
          srcIndex = _getCanvasTarget.srcIndex,
          fragmentStart = _getCanvasTarget.fragmentStart;
        timeFragmentStart = fragmentStart;
        manifestDispatch({
          srcIndex: srcIndex,
          type: 'setSrcIndex'
        });
      } else {
        // When clicked structure item is not in the current canvas
        if (canvasIndex != currentCanvasIndex && currentCanvasIndex > -1) {
          manifestDispatch({
            canvasIndex: currentCanvasIndex,
            type: 'switchCanvas'
          });
          canvasIsEmptyRef.current = canvasStructRef.current[currentCanvasIndex].isEmpty;
        }
      }
      if (player && !canvasIsEmptyRef.current) {
        player.currentTime(timeFragmentStart);
        playerDispatch({
          startTime: timeFragment.start,
          endTime: timeFragment.end,
          type: 'setTimeFragment'
        });
        playerDispatch({
          currentTime: timeFragmentStart,
          type: 'setCurrentTime'
        });
        // Setting userActive to true shows timerail breifly, helps
        // to visualize the structure in player while playing
        if (isPlaying) player.userActive(true);
      } else if (canvasIsEmptyRef.current) {
        // Reset isClicked in state for
        // inaccessible items (empty canvases)
        playerDispatch({
          type: 'resetClick'
        });
        // Ensure autoplay from inaccessible items in playlists
        if (playlist) {
          playerDispatch({
            isPlaying: autoAdvance,
            type: 'setPlayingStatus'
          });
        }
      }
    }
  }, [isClicked, player]);

  // Structured nav is populated by the time the player hook fires so we listen for
  // that to run the check on whether the structured nav is scrollable.
  React.useEffect(function () {
    if (structureContainerRef.current) {
      var elem = structureContainerRef.current;
      var structureBorder = structureContainerRef.current.parentElement;
      var structureEnd = Math.abs(elem.scrollHeight - (elem.scrollTop + elem.clientHeight)) <= 1;
      scrollableStructure.current = !structureEnd;
      if (structureBorder) {
        resizeObserver.observe(structureBorder);
      }
    }
  }, [player]);

  // Update scrolling indicators when end of scrolling has been reached
  var handleScrollable = function handleScrollable(e) {
    var elem = e.target;
    if (elem.classList.contains('ramp--structured-nav__border')) {
      elem = elem.firstChild;
    }
    var scrollMsg = elem.nextSibling;
    var structureEnd = Math.abs(elem.scrollHeight - (elem.scrollTop + elem.clientHeight)) <= 1;
    if (elem && structureEnd && elem.classList.contains('scrollable')) {
      elem.classList.remove('scrollable');
    } else if (elem && !structureEnd && !elem.classList.contains('scrollable')) {
      elem.classList.add('scrollable');
    }
    if (scrollMsg && structureEnd && scrollMsg.classList.contains('scrollable')) {
      scrollMsg.classList.remove('scrollable');
    } else if (scrollMsg && !structureEnd && !scrollMsg.classList.contains('scrollable')) {
      scrollMsg.classList.add('scrollable');
    }
  };

  // Update scrolling indicators when structured nav is resized
  var resizeObserver = new ResizeObserver(function (entries) {
    var _iterator = _createForOfIteratorHelper$1(entries),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        handleScrollable(entry);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  });
  if (!manifest) {
    return /*#__PURE__*/React.createElement("p", null, "No manifest - Please provide a valid manifest.");
  }

  // Check for scrolling on initial render and build appropriate element class
  var divClass = '';
  var spanClass = '';
  if (scrollableStructure.current) {
    divClass = "ramp--structured-nav scrollable";
    spanClass = "scrollable";
  } else {
    divClass = "ramp--structured-nav";
  }
  if (playlist !== null && playlist !== void 0 && playlist.isPlaylist) {
    divClass += " playlist-items";
  }
  divClass += hasRootRangeRef.current ? " ramp--structured-nav-with_root" : "";

  /**
   * Update isScrolling flag within structure container ref, which is
   * used by ListItem and SectionHeading components to decide to/not to
   * auto scroll the content
   * @param {Boolean} state 
   */
  var handleMouseOver = function handleMouseOver(state) {
    structureContainerRef.current.isScrolling = state;
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "ramp--structured-nav__border"
  }, /*#__PURE__*/React.createElement("div", {
    "data-testid": "structured-nav",
    className: divClass,
    ref: structureContainerRef,
    role: "list",
    "aria-label": "Structural content",
    onScroll: handleScrollable,
    onMouseLeave: function onMouseLeave() {
      return handleMouseOver(false);
    },
    onMouseOver: function onMouseOver() {
      return handleMouseOver(true);
    }
  }, ((_structureItemsRef$cu = structureItemsRef.current) === null || _structureItemsRef$cu === void 0 ? void 0 : _structureItemsRef$cu.length) > 0 ? structureItemsRef.current.map(function (item, index) {
    return /*#__PURE__*/React.createElement(List, {
      items: [item],
      sectionRef: /*#__PURE__*/React.createRef(),
      key: index,
      structureContainerRef: structureContainerRef
    });
  }) : /*#__PURE__*/React.createElement("p", {
    className: "ramp--no-structure"
  }, "There are no structures in the manifest")), /*#__PURE__*/React.createElement("span", {
    className: spanClass
  }, "Scroll to see more"));
};
StructuredNavigation.propTypes = {};

var objectWithoutPropertiesLoose = createCommonjsModule(function (module) {
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
module.exports = _objectWithoutPropertiesLoose, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var objectWithoutProperties = createCommonjsModule(function (module) {
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
module.exports = _objectWithoutProperties, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _objectWithoutProperties = /*@__PURE__*/getDefaultExportFromCjs(objectWithoutProperties);

var taggedTemplateLiteral = createCommonjsModule(function (module) {
function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }
  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}
module.exports = _taggedTemplateLiteral, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _taggedTemplateLiteral = /*@__PURE__*/getDefaultExportFromCjs(taggedTemplateLiteral);

var _templateObject$1, _templateObject2, _templateObject3, _templateObject4;
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

// ENum for supported transcript MIME types
var TRANSCRIPT_MIME_TYPES = {
  webvtt: ['text/vtt'],
  srt: ['application/x-subrip', 'text/srt'],
  text: ['text/plain'],
  json: ['application/json'],
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};
var VTT_TIMESTAMP_REGEX = /^(?:\d{2}:)?\d{2}:\d{2}(?:\.\d+)/g;
// SRT allows using comma for milliseconds while WebVTT does not
var SRT_TIMESTAMP_REGEX = /^(?:\d{2}:)?\d{2}:\d{2}(?:[.,]\d+)/g;
var TRANSCRIPT_MIME_EXTENSIONS = [{
  type: TRANSCRIPT_MIME_TYPES.json,
  ext: 'json'
}, {
  type: TRANSCRIPT_MIME_TYPES.webvtt,
  ext: 'vtt'
}, {
  type: TRANSCRIPT_MIME_TYPES.text,
  ext: 'txt'
}, {
  type: TRANSCRIPT_MIME_TYPES.docx,
  ext: 'docx'
}, {
  type: TRANSCRIPT_MIME_TYPES.srt,
  ext: 'srt'
}];

// ENum for describing transcript types include invalid and no transcript info
var TRANSCRIPT_TYPES = {
  invalidTimestamp: -4,
  invalidVTT: -3,
  noSupport: -2,
  invalid: -1,
  noTranscript: 0,
  timedText: 1,
  plainText: 2,
  docx: 3
};

// ENum for types transcript text lines in a time-synced transcript
var TRANSCRIPT_CUE_TYPES = {
  note: 'NOTE',
  timedCue: 'TIMED_CUE',
  nonTimedLine: 'NON_TIMED_LINE'
};

/**
 * Parse the transcript information in the Manifest presented as supplementing annotations
 * @param {String} manifestURL IIIF Presentation 3.0 manifest URL
 * @param {String} title optional title given in the transcripts list in props
 * @returns {Array<Object>} array of supplementing annotations for transcripts for all
 * canvases in the Manifest
 */
function readSupplementingAnnotations(_x) {
  return _readSupplementingAnnotations.apply(this, arguments);
}

/**
 * Refine and sanitize the user provided transcripts list in the props. If there are manifests
 * in the given array process them to find supplementing annotations in the manifest and
 * them to the transcripts array to be displayed in the component.
 * @param {Array} transcripts list of transcripts from Transcript component's props
 * @returns {Array} a refined transcripts array for each canvas with the following json
 * structure;
 * { canvasId: <canvas index>, items: [{ title, filename, url, isMachineGen, id }]}
 */
function _readSupplementingAnnotations() {
  _readSupplementingAnnotations = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(manifestURL) {
    var title,
      data,
      _args = arguments;
    return regenerator.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          title = _args.length > 1 && _args[1] !== undefined ? _args[1] : '';
          _context.next = 3;
          return fetch(manifestURL).then(function (response) {
            var fileType = response.headers.get('Content-Type');
            if (fileType.includes('application/json')) {
              var jsonData = response.json();
              return jsonData;
            }
          }).then(function (data) {
            var canvases = parseSequences(data)[0].getCanvases();
            var newTranscriptsList = [];
            if ((canvases === null || canvases === void 0 ? void 0 : canvases.length) > 0) {
              canvases.map(function (canvas, index) {
                var annotations = parseAnnotations(canvas.__jsonld['annotations'], 'supplementing');
                var canvasTranscripts = [];
                if (annotations.length > 0) {
                  var annotBody = annotations[0].getBody()[0];
                  if (annotBody.getProperty('type') === 'TextualBody') {
                    var label = title.length > 0 ? title : annotBody.getLabel().getValue() ? getLabelValue(annotBody.getLabel().getValue()) : "Canvas-".concat(index);
                    var _identifyMachineGen = identifyMachineGen(label),
                      isMachineGen = _identifyMachineGen.isMachineGen,
                      labelText = _identifyMachineGen.labelText;
                    canvasTranscripts.push({
                      url: annotBody.id === undefined ? manifestURL : annotBody.id,
                      title: labelText,
                      isMachineGen: isMachineGen,
                      id: "".concat(labelText, "-").concat(index),
                      format: ''
                    });
                  } else {
                    annotations.forEach(function (annotation, i) {
                      var annotBody = annotation.getBody()[0];
                      var label = '';
                      var filename = '';
                      if (annotBody.getLabel() != undefined && annotBody.getLabel().length > 1) {
                        // If there are multiple labels for an annotation assume the first
                        // is the one intended for default display.
                        label = getLabelValue(annotBody.getLabel()[0]._value);
                        // Assume that an unassigned language is meant to be the downloadable filename
                        filename = getLabelValue(annotBody.getLabel().getValue('none'));
                      } else if (annotBody.getLabel() != undefined && annotBody.getLabel().length === 1) {
                        // If there is a single label, use for both label and downloadable filename
                        label = getLabelValue(annotBody.getLabel().getValue());
                      } else {
                        label = "".concat(i);
                      }
                      var id = annotBody.id;
                      var sType = identifySupplementingAnnotation(id);
                      var _identifyMachineGen2 = identifyMachineGen(label),
                        isMachineGen = _identifyMachineGen2.isMachineGen,
                        labelText = _identifyMachineGen2.labelText;
                      if (filename === '') {
                        filename = labelText;
                      }
                      if (sType === 1 || sType === 3) {
                        canvasTranscripts.push({
                          title: labelText,
                          filename: filename,
                          url: id,
                          isMachineGen: isMachineGen,
                          id: "".concat(labelText, "-").concat(index, "-").concat(i),
                          format: annotBody.getFormat() || ''
                        });
                      }
                    });
                  }
                }
                newTranscriptsList.push({
                  canvasId: index,
                  items: canvasTranscripts
                });
              });
            }
            return newTranscriptsList;
          })["catch"](function (error) {
            console.error('transcript-parser -> readSupplementingAnnotations() -> error fetching transcript resource at, ', manifestURL);
            return [];
          });
        case 3:
          data = _context.sent;
          return _context.abrupt("return", data);
        case 5:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _readSupplementingAnnotations.apply(this, arguments);
}
function sanitizeTranscripts(_x2) {
  return _sanitizeTranscripts.apply(this, arguments);
}

/**
 * Group a nested JSON object array by a given property name
 * @param {Array} objectArray nested array to reduced
 * @param {String} indexKey property name to be used to group elements in the array
 * @param {String} selectKey property to be selected from the objects to accumulated
 * @returns {Array}
 */
function _sanitizeTranscripts() {
  _sanitizeTranscripts = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(transcripts) {
    var allTranscripts, sanitizedTrs, newTranscripts;
    return regenerator.wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          if (!(!transcripts || transcripts == undefined || transcripts.length == 0)) {
            _context4.next = 5;
            break;
          }
          console.error('No transcripts given as input');
          return _context4.abrupt("return", []);
        case 5:
          allTranscripts = []; // Build an empty list for each canvasId from the given transcripts prop
          transcripts.map(function (trs) {
            return allTranscripts.push({
              canvasId: trs.canvasId,
              items: []
            });
          });

          // Process the async function to resolve manifest URLs in the given transcripts array
          // parallely to extract supplementing annotations in the manifests
          _context4.next = 9;
          return Promise.all(transcripts.map( /*#__PURE__*/function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(transcript) {
              var canvasId, items, sanitizedItems;
              return regenerator.wrap(function _callee3$(_context3) {
                while (1) switch (_context3.prev = _context3.next) {
                  case 0:
                    canvasId = transcript.canvasId, items = transcript.items;
                    _context3.next = 3;
                    return Promise.all(items.map( /*#__PURE__*/function () {
                      var _ref6 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(item, index) {
                        var title, url, manifestTranscripts, _identifyMachineGen3, isMachineGen, labelText, manifestItems, groupedTrs;
                        return regenerator.wrap(function _callee2$(_context2) {
                          while (1) switch (_context2.prev = _context2.next) {
                            case 0:
                              title = item.title, url = item.url; // For each item in the list check if it is a manifest and parse
                              // the it to identify any supplementing annotations in the
                              // manifest for each canvas
                              _context2.next = 3;
                              return readSupplementingAnnotations(url, title);
                            case 3:
                              manifestTranscripts = _context2.sent;
                              _identifyMachineGen3 = identifyMachineGen(title), isMachineGen = _identifyMachineGen3.isMachineGen, labelText = _identifyMachineGen3.labelText;
                              manifestItems = [];
                              if ((manifestTranscripts === null || manifestTranscripts === void 0 ? void 0 : manifestTranscripts.length) > 0) {
                                manifestItems = manifestTranscripts.map(function (mt) {
                                  return mt.items;
                                }).flat();

                                // Concat the existing transcripts list and transcripts from the manifest and
                                // group them by canvasId
                                groupedTrs = groupByIndex(allTranscripts.concat(manifestTranscripts), 'canvasId', 'items');
                                allTranscripts = groupedTrs;
                              }

                              // if manifest doesn't have canvases or
                              // supplementing annotations add original transcript from props
                              if (!(manifestTranscripts.length === 0 || manifestItems.length === 0)) {
                                _context2.next = 11;
                                break;
                              }
                              return _context2.abrupt("return", {
                                title: labelText,
                                filename: labelText,
                                url: url,
                                isMachineGen: isMachineGen,
                                id: "".concat(labelText, "-").concat(canvasId, "-").concat(index),
                                format: ''
                              });
                            case 11:
                              return _context2.abrupt("return", null);
                            case 12:
                            case "end":
                              return _context2.stop();
                          }
                        }, _callee2);
                      }));
                      return function (_x9, _x10) {
                        return _ref6.apply(this, arguments);
                      };
                    }()));
                  case 3:
                    sanitizedItems = _context3.sent;
                    return _context3.abrupt("return", {
                      canvasId: canvasId,
                      items: sanitizedItems.filter(function (i) {
                        return i != null;
                      })
                    });
                  case 5:
                  case "end":
                    return _context3.stop();
                }
              }, _callee3);
            }));
            return function (_x8) {
              return _ref5.apply(this, arguments);
            };
          }()));
        case 9:
          sanitizedTrs = _context4.sent;
          // Group all the transcripts by canvasId one last time to eliminate duplicate canvasIds
          newTranscripts = groupByIndex(allTranscripts.concat(sanitizedTrs), 'canvasId', 'items');
          return _context4.abrupt("return", newTranscripts);
        case 12:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _sanitizeTranscripts.apply(this, arguments);
}
function groupByIndex(objectArray, indexKey, selectKey) {
  return objectArray.reduce(function (acc, obj) {
    var existing = acc.filter(function (a) {
      return a[indexKey] == obj[indexKey];
    });
    if ((existing === null || existing === void 0 ? void 0 : existing.length) > 0) {
      var current = existing[0];
      current[selectKey] = current[selectKey].concat(obj[selectKey]);
    } else {
      acc.push(obj);
    }
    return acc;
  }, []);
}

/**
 * Parse a given transcript file into a format the Transcript component
 * can render on the UI. E.g.: text file -> returns null, so that the Google
 * doc viewer is rendered, IIIF manifest -> extract and parse transcript data
 * within the manifest.
 * @param {String} url URL of the transcript file selected
 * @param {Number} canvasIndex Current canvas rendered in the player
 * @param {String} format transcript file format read from Annotation
 * @returns {Object}  Array of trancript data objects with download URL
 */
function parseTranscriptData(_x3, _x4, _x5) {
  return _parseTranscriptData.apply(this, arguments);
}

/**
 * Parse MS word documents into HTML markdown using mammoth.js
 * https://www.npmjs.com/package/mammoth
 * @param {Object} response response from the fetch request
 * @returns {Array} html markdown for the word document contents
 */
function _parseTranscriptData() {
  _parseTranscriptData = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5(url, canvasIndex, format) {
    var tData, tUrl, contentType, fileData, fromContentType, fromAnnotFormat, fileType, urlExt, filteredExt, textData, textLines, jsonData, manifest, json, parsedText, _parseTimedText, _tData, tType;
    return regenerator.wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          tData = [];
          tUrl = url; // Validate given URL
          if (!(url === undefined)) {
            _context5.next = 4;
            break;
          }
          return _context5.abrupt("return", {
            tData: tData,
            tUrl: tUrl,
            tType: TRANSCRIPT_TYPES.invalid
          });
        case 4:
          contentType = null;
          fileData = null; // get file type
          _context5.next = 8;
          return fetch(url).then(handleFetchErrors).then(function (response) {
            contentType = response.headers.get('Content-Type');
            fileData = response;
          })["catch"](function (error) {
            console.error('transcript-parser -> parseTranscriptData() -> fetching transcript -> ', error);
          });
        case 8:
          if (!(contentType == null)) {
            _context5.next = 10;
            break;
          }
          return _context5.abrupt("return", {
            tData: [],
            tUrl: tUrl,
            tType: TRANSCRIPT_TYPES.invalid
          });
        case 10:
          /* 
            Use the Annotation format in the IIIF Manifest, file extension, and the 
            Content-Type in headers of the fetch request to determine the file type.
            These are checked with priority descending in the order of Annotation format,
            Content-Type in headers, and file extension in the resource URI.
          */
          fromContentType = TRANSCRIPT_MIME_EXTENSIONS.filter(function (tm) {
            return tm.type.includes(contentType.split(';')[0]);
          });
          fromAnnotFormat = TRANSCRIPT_MIME_EXTENSIONS.filter(function (tm) {
            return tm.type.includes(format);
          });
          fileType = '';
          if ((fromAnnotFormat === null || fromAnnotFormat === void 0 ? void 0 : fromAnnotFormat.length) > 0) {
            fileType = fromAnnotFormat[0].ext;
          } else if (fromContentType.length > 0) {
            fileType = fromContentType[0].ext;
          } else {
            urlExt = url.split('.').reverse()[0]; // Only use this if it exists in the supported list of file types for the component
            filteredExt = TRANSCRIPT_MIME_EXTENSIONS.filter(function (tm) {
              return tm.ext === urlExt;
            });
            fileType = filteredExt.length > 0 ? urlExt : '';
          }

          // Return empty array to display an error message
          if (!(canvasIndex === undefined)) {
            _context5.next = 16;
            break;
          }
          return _context5.abrupt("return", {
            tData: tData,
            tUrl: tUrl,
            tType: TRANSCRIPT_TYPES.noTranscript
          });
        case 16:
          _context5.t0 = fileType;
          _context5.next = _context5.t0 === 'json' ? 19 : _context5.t0 === 'txt' ? 29 : _context5.t0 === 'srt' ? 40 : _context5.t0 === 'vtt' ? 40 : _context5.t0 === 'docx' ? 50 : 54;
          break;
        case 19:
          _context5.next = 21;
          return fileData.json();
        case 21:
          jsonData = _context5.sent;
          manifest = parseManifest(jsonData);
          if (!manifest) {
            _context5.next = 27;
            break;
          }
          return _context5.abrupt("return", parseManifestTranscript(jsonData, url, canvasIndex));
        case 27:
          json = parseJSONData(jsonData);
          return _context5.abrupt("return", {
            tData: json.tData,
            tUrl: tUrl,
            tType: json.tType,
            tFileExt: fileType
          });
        case 29:
          _context5.next = 31;
          return fileData.text();
        case 31:
          textData = _context5.sent;
          textLines = textData.split('\n');
          if (!(textLines.length == 0)) {
            _context5.next = 37;
            break;
          }
          return _context5.abrupt("return", {
            tData: [],
            tUrl: url,
            tType: TRANSCRIPT_TYPES.noTranscript
          });
        case 37:
          parsedText = buildNonTimedText(textLines); // let parsedText = textData.replace(/\n/g, "<br />");
          return _context5.abrupt("return", {
            tData: parsedText,
            tUrl: url,
            tType: TRANSCRIPT_TYPES.plainText,
            tFileExt: fileType
          });
        case 39:
        case 40:
          _context5.next = 42;
          return fileData.text();
        case 42:
          textData = _context5.sent;
          textLines = textData.split('\n');
          if (!(textLines.length == 0)) {
            _context5.next = 48;
            break;
          }
          return _context5.abrupt("return", {
            tData: [],
            tUrl: url,
            tType: TRANSCRIPT_TYPES.noTranscript
          });
        case 48:
          _parseTimedText = parseTimedText(textData, fileType === 'srt'), _tData = _parseTimedText.tData, tType = _parseTimedText.tType;
          return _context5.abrupt("return", {
            tData: _tData,
            tUrl: url,
            tType: tType,
            tFileExt: fileType
          });
        case 50:
          _context5.next = 52;
          return parseWordFile(fileData);
        case 52:
          tData = _context5.sent;
          return _context5.abrupt("return", {
            tData: splitIntoElements(tData),
            tUrl: url,
            tType: TRANSCRIPT_TYPES.docx,
            tFileExt: fileType
          });
        case 54:
          return _context5.abrupt("return", {
            tData: [],
            tUrl: url,
            tType: TRANSCRIPT_TYPES.noSupport
          });
        case 55:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return _parseTranscriptData.apply(this, arguments);
}
function parseWordFile(_x6) {
  return _parseWordFile.apply(this, arguments);
}
/**
 * Parse json data into Transcript component friendly
 * format
 * @param {Object} jsonData array of JSON objects
 * @returns {Object}
 */
function _parseWordFile() {
  _parseWordFile = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee6(response) {
    var tData, data, arrayBuffer;
    return regenerator.wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          tData = null;
          _context6.next = 3;
          return response.blob();
        case 3:
          data = _context6.sent;
          arrayBuffer = new File([data], name, {
            type: response.headers.get('content-type')
          });
          _context6.next = 7;
          return mammoth.convertToHtml({
            arrayBuffer: arrayBuffer
          }).then(function (result) {
            tData = result.value;
          })["catch"](function (err) {
            console.error(err);
          });
        case 7:
          return _context6.abrupt("return", tData);
        case 8:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return _parseWordFile.apply(this, arguments);
}
function parseJSONData(jsonData) {
  if (jsonData.length == 0) {
    return {
      tData: [],
      tType: TRANSCRIPT_TYPES.noTranscript
    };
  }
  var tData = [];
  var _iterator = _createForOfIteratorHelper(jsonData),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var jd = _step.value;
      if (jd.speaker) {
        var speaker = jd.speaker,
          spans = jd.spans;
        var _iterator2 = _createForOfIteratorHelper(spans),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var span = _step2.value;
            span.speaker = speaker;
            tData.push(span);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      } else {
        var _iterator3 = _createForOfIteratorHelper(jd.spans),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var _span = _step3.value;
            tData.push(_span);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return {
    tData: tData,
    tType: TRANSCRIPT_TYPES.timedText
  };
}

/* Parsing annotations when transcript data is fed from a IIIF manifest */
/**
 * Parse a IIIF manifest and extracts the transcript data.
 * IIIF manifests can present transcript data in a couple of different ways.
 *  1. Using 'rendering' prop to link to an external file
 *      a. when the external file contains only text
 *      b. when the external file contains annotations
 *  2. Using IIIF 'annotations' within the manifest
 * @param {Object} manifest IIIF manifest data
 * @param {String} manifestURL IIIF manifest URL
 * @param {Number} canvasIndex Current canvas index
 * @returns {Object} object with the structure;
 * { tData: transcript data, tUrl: file url }
 */
function parseManifestTranscript(manifest, manifestURL, canvasIndex) {
  var tData = [];
  var tUrl = manifestURL;
  var isExternalAnnotation = false;
  var annotations = [];
  if (manifest.annotations) {
    annotations = parseAnnotations(manifest.annotations, 'supplementing');
  } else {
    annotations = getAnnotations({
      manifest: manifest,
      canvasIndex: canvasIndex,
      key: 'annotations',
      motivation: 'supplementing'
    });
  }

  // determine whether annotations point to an external resource or
  // a list of transcript fragments
  if (annotations.length > 0) {
    var annotation = annotations[0];
    var tType = annotation.getBody()[0].getProperty('type');
    if (tType == 'TextualBody') {
      isExternalAnnotation = false;
    } else {
      isExternalAnnotation = true;
    }
  } else {
    return {
      tData: [],
      tUrl: tUrl,
      tType: TRANSCRIPT_TYPES.noTranscript
    };
  }
  if (isExternalAnnotation) {
    var _annotation = annotations[0];
    return parseExternalAnnotations(_annotation);
  } else {
    tData = createTData(annotations);
    return {
      tData: tData,
      tUrl: tUrl,
      tType: TRANSCRIPT_TYPES.timedText,
      tFileExt: 'json'
    };
  }
}

/**
 * Parse annotation linking to external resources like WebVTT, SRT, Text, and
 * AnnotationPage .json files
 * @param {Annotation} annotation Annotation from the manifest
 * @returns {Object} object with the structure { tData: [], tUrl: '', tType: '' }
 */
function parseExternalAnnotations(_x7) {
  return _parseExternalAnnotations.apply(this, arguments);
}
/**
 * Converts Annotation to the common format that the
 * transcripts component expects
 * @param {Array<Object>} annotations array of Annotations
 * @returns {Array<Object>} array of JSON objects
 * Structure of the JSON object is as follows;
 * {
 *    begin: 0,
 *    end: 60,
 *    text: 'Transcript text',
 *    format: 'text/plain',
 * }
 */
function _parseExternalAnnotations() {
  _parseExternalAnnotations = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee7(annotation) {
    var tData, type, tBody, tUrl, tType, tFormat, tFileExt;
    return regenerator.wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          tData = [];
          type = '';
          tBody = annotation.getBody()[0];
          tUrl = tBody.getProperty('id');
          tType = tBody.getProperty('type');
          tFormat = tBody.getFormat();
          tFileExt = '';
          /** When external file contains text data */
          if (!(tType === 'Text')) {
            _context7.next = 12;
            break;
          }
          _context7.next = 10;
          return fetch(tUrl).then(handleFetchErrors).then(function (response) {
            return response.text();
          }).then(function (data) {
            if (TRANSCRIPT_MIME_TYPES.webvtt.includes(tFormat) || TRANSCRIPT_MIME_TYPES.srt.includes(tFormat)) {
              var parsed = parseTimedText(data, TRANSCRIPT_MIME_TYPES.srt.includes(tFormat));
              tData = parsed.tData;
              type = parsed.tType;
              tFileExt = TRANSCRIPT_MIME_EXTENSIONS.filter(function (tm) {
                return tm.type.includes(tFormat);
              })[0].ext;
            } else {
              var textLines = data.split('\n');
              tData = buildNonTimedText(textLines);
              type = TRANSCRIPT_TYPES.plainText;
              tFileExt = 'txt';
            }
          })["catch"](function (error) {
            console.error('transcript-parser -> parseExternalAnnotations() -> fetching external transcript -> ', error);
            throw error;
          });
        case 10:
          _context7.next = 15;
          break;
        case 12:
          if (!(tType === 'AnnotationPage')) {
            _context7.next = 15;
            break;
          }
          _context7.next = 15;
          return fetch(tUrl).then(handleFetchErrors).then(function (response) {
            return response.json();
          }).then(function (data) {
            var annotations = parseAnnotations([data], 'supplementing');
            tData = createTData(annotations);
            type = TRANSCRIPT_TYPES.timedText;
            tFileExt = 'json';
          })["catch"](function (error) {
            console.error('transcript-parser -> parseExternalAnnotations() -> fetching annotations -> ', error);
            throw error;
          });
        case 15:
          return _context7.abrupt("return", {
            tData: tData,
            tUrl: tUrl,
            tType: type,
            tFileExt: tFileExt
          });
        case 16:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return _parseExternalAnnotations.apply(this, arguments);
}
function createTData(annotations) {
  var tData = [];
  annotations.map(function (a) {
    if (a.id != null) {
      var tBody = a.getBody()[0];
      var _getMediaFragment = getMediaFragment(a.getProperty('target')),
        start = _getMediaFragment.start,
        end = _getMediaFragment.end;
      tData.push({
        text: tBody.getProperty('value'),
        format: tBody.getFormat(),
        begin: parseFloat(start),
        end: parseFloat(end),
        tag: TRANSCRIPT_CUE_TYPES.timedCue
      });
    }
  });
  return tData;
}

/**
 * Parsing transcript data from a given file with timed text
 * @param {Object} fileData content in the transcript file
 * @param {Boolean} isSRT given transcript file is an SRT
 * @returns {Array<Object>} array of JSON objects of the following
 * structure;
 * {
 *    begin: '00:00:00.000',
 *    end: '00:01:00.000',
 *    text: 'Transcript text sample'
 *    tag: NOTE || TIMED_CUE
 * }
 */
function parseTimedText(fileData) {
  var isSRT = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var tData = [];
  var noteLines = [];

  // split file content into lines
  var lines = fileData.split('\n');

  // For SRT files all of the file content is considered as cues
  var cueLines = lines;
  if (!isSRT) {
    var _validateWebVTT = validateWebVTT(lines),
      valid = _validateWebVTT.valid,
      cue_lines = _validateWebVTT.cue_lines,
      notes = _validateWebVTT.notes;
    if (!valid) {
      console.error('Invalid WebVTT file');
      return {
        tData: [],
        tType: TRANSCRIPT_TYPES.invalidVTT
      };
    }
    cueLines = cue_lines;
    noteLines = notes;
  }
  var groups = groupTimedTextLines(cueLines);

  // Add back the NOTE(s) in the header block
  groups.unshift.apply(groups, _toConsumableArray(noteLines));
  var hasInvalidTimestamp = false;
  for (var i = 0; i < groups.length;) {
    var line = parseTimedTextLine(groups[i], isSRT);
    if (!line) {
      hasInvalidTimestamp || (hasInvalidTimestamp = true);
      break;
    } else {
      tData.push(line);
      i++;
    }
  }
  return {
    tData: hasInvalidTimestamp ? null : tData,
    tType: hasInvalidTimestamp ? TRANSCRIPT_TYPES.invalidTimestamp : TRANSCRIPT_TYPES.timedText
  };
}

/**
 * Validate WebVTT file with its header content
 * @param {Array<String>} lines  WebVTT file content split into lines
 * @returns {Boolean}
 */
function validateWebVTT(lines) {
  var firstLine = lines.shift().trim();
  if ((firstLine === null || firstLine === void 0 ? void 0 : firstLine.length) == 6 && firstLine === 'WEBVTT') {
    var _validateWebVTTHeader = validateWebVTTHeaders(lines),
      valid = _validateWebVTTHeader.valid,
      cue_lines = _validateWebVTTHeader.cue_lines,
      notes = _validateWebVTTHeader.notes;
    return {
      valid: valid,
      cue_lines: cue_lines,
      notes: notes
    };
  } else {
    return {
      valid: false,
      cue_lines: [],
      notes: []
    };
  }
}

/**
 * Validate the text between 'WEBVTT' at the start and start of
 * VTT cues. It looks for REGION and STYLE blocks and skips over these
 * blocks. This doesn't validate the content within these blocks.
 * When there's text in the header not followed by the keywords REGION and
 * STYLE the WebVTT file is marked invalid.
 * @param {Array<String>} lines WebVTT file content split into lines
 * @returns 
 */
function validateWebVTTHeaders(lines) {
  var endOfHeadersIndex = 0;
  var firstCueIndex = 0;
  var hasTextBeforeCues = false;
  var notesInHeader = [];

  // Remove line numbers for vtt cues
  lines = lines.filter(function (l) {
    return Number(l) ? false : true;
  });
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    // Skip REGION and STYLE blocks as these are related to displaying cues as overlays
    if (/^REGION$/.test(line.toUpperCase()) || /^STYLE$/.test(line.toUpperCase())) {
      // Increment until an empty line is encountered within the header block
      i++;
      while (i < lines.length && (!lines[i] == '\r' || !lines[i] == '\n' || !lines[i] == '\r\n')) {
        i++;
      }
      endOfHeadersIndex = i;
    }
    // Gather comments presented as NOTE(s) in the header block to be displayed as transcript
    else if (/^NOTE$/.test(line.toUpperCase())) {
      var noteText = line;
      i++;
      // Increment until an empty line is encountered within the NOTE block
      while (i < lines.length && (!lines[i] == '\r' || !lines[i] == '\n' || !lines[i] == '\r\n')) {
        noteText = "".concat(noteText, "<br />").concat(lines[i].trim());
        i++;
      }
      notesInHeader.push({
        times: '',
        line: noteText,
        tag: TRANSCRIPT_CUE_TYPES.note
      });
    }
    // Terminate validation once the first cue is reached
    else if (line.includes('-->')) {
      // Break the loop when it reaches the first vtt cue
      firstCueIndex = i;
      break;
    }
    // Flag to check for invalid text before cue lines
    else if (typeof line === 'string' && line.trim().length != 0) {
      hasTextBeforeCues = true;
    }
  }

  // Return the cues and comments in the header block when the given WebVTT is valid
  if (firstCueIndex > endOfHeadersIndex && !hasTextBeforeCues) {
    return {
      valid: true,
      cue_lines: lines.slice(firstCueIndex),
      notes: notesInHeader
    };
  } else {
    return {
      valid: false
    };
  }
}

/**
 * Group multi line transcript text values alongside the relevant
 * timestamp values. E.g. converts,
 * [ 
 *  "00:00:00.000 --> 00:01:00.000", "Transcript", " from multiple lines",
 *  "00:03:00.000 --> 00:04:00.000", "Next transcript text",
 *  "NOTE This is a comment" 
 * ]
 * into
 * [
 *  { times: "00:00:00.000 --> 00:01:00.000", line: "Transcript from multiple lines", tag: "TIMED_CUE" },
 *  { times: "00:03:00.000 --> 00:04:00.000", line: "Next transcript text", tag: "TIMED_CUE" },
 *  { times: "", line: "NOTE This is a comment", tag: "NOTE" }
 * ]
 * @param {Array<String>} lines array of lines in the WebVTT file
 * @returns {Array<Object>}
 */
function groupTimedTextLines(lines) {
  var groups = [];
  var i;
  for (i = 0; i < lines.length; i++) {
    var line = lines[i];
    var t = {};
    if (line.includes('-->') || /^NOTE/.test(line)) {
      var isNote = /^NOTE/.test(line);
      t.times = isNote ? "" : line;
      t.tag = isNote ? TRANSCRIPT_CUE_TYPES.note : TRANSCRIPT_CUE_TYPES.timedCue;
      // Make sure there is a single space separating NOTE from the comment for single or multi-line comments
      t.line = isNote ? line.replace(/^NOTE\s*/, 'NOTE ') : '';
      i++;

      // Increment until an empty line is encountered marking the end of the block
      while (i < lines.length && !(lines[i] == '\r' || lines[i] == '\n' || lines[i] == '\r\n' || lines[i] == '')) {
        t.line += lines[i].endsWith('-') ? lines[i] : lines[i].replace(/\s*$/, ' ');
        i++;
      }
      t.line = t.line.trimEnd();
      groups.push(t);
    }
  }
  return groups;
}

/**
 * Create a JSON object from the transcript data
 * @param {Object} obj
 * @param {String} obj.times string with time information
 * @param {String} obj.line string with transcript text
 * @returns {Object} of the format;
 * {
 *    begin: 0,
 *    end: 60,
 *    text: 'Transcript text sample',
 *    tag: NOTE || TIMED_CUE
 * }
 */
function parseTimedTextLine(_ref, isSRT) {
  var times = _ref.times,
    line = _ref.line,
    tag = _ref.tag;
  var timestampRegex;
  if (isSRT) {
    // SRT allows using comma for milliseconds while WebVTT does not
    timestampRegex = SRT_TIMESTAMP_REGEX;
  } else {
    timestampRegex = VTT_TIMESTAMP_REGEX;
  }
  switch (tag) {
    case TRANSCRIPT_CUE_TYPES.note:
      return {
        begin: 0,
        end: 0,
        text: line,
        tag: tag
      };
    case TRANSCRIPT_CUE_TYPES.timedCue:
      var _times$split = times.split(' --> '),
        _times$split2 = _slicedToArray(_times$split, 2),
        start = _times$split2[0],
        end = _times$split2[1];
      // FIXME:: remove any styles for now, refine this
      end = end.split(' ')[0];
      if (!start.match(timestampRegex) || !end.match(timestampRegex)) {
        console.error('Invalid timestamp in line with text; ', line);
        return null;
      }
      return {
        begin: timeToS(start),
        end: timeToS(end),
        text: line,
        tag: tag
      };
    default:
      return null;
  }
}

/**
 * Parse the content search response from the search service, and then use it to calculate
 * number of search hits for each transcripts, and create a list of matched transcript
 * lines for the search in the current transcript
 * @param {Object} response JSON response from content search API
 * @param {String} query search query from transcript search
 * @param {Array} trancripts content of the displayed transcript with ids
 * @param {String} selectedTranscript url of the selected transcript
 * @returns a list of matched transcript lines for the current search
 */
var parseContentSearchResponse = function parseContentSearchResponse(response, query, trancripts, selectedTranscript) {
  var _response$items;
  if (!response || response === undefined) return [];
  var hitCounts = [];
  var searchHits = [];
  if (((_response$items = response.items) === null || _response$items === void 0 ? void 0 : _response$items.length) > 0) {
    var items = response.items;
    items.map(function (item) {
      var anno = new Annotation(item);
      // Exclude annotations without supplementing motivation
      if (anno.getMotivation() != 'supplementing') return;
      var target = anno.getTarget();
      var targetURI = getCanvasId(target);
      var value = anno.getBody()[0].getProperty('value');
      var hitCount = getHitCountForCue(value, query, true);
      searchHits.push({
        target: target,
        targetURI: targetURI,
        value: value,
        hitCount: hitCount
      });
    });
  }
  // Group search responses by transcript
  var allSearchHits = groupBy(searchHits, 'targetURI');

  // Calculate search hit count for each transcript in the Canvas
  for (var _i = 0, _Object$entries = Object.entries(allSearchHits); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
      key = _Object$entries$_i[0],
      value = _Object$entries$_i[1];
    hitCounts.push({
      transcriptURL: key,
      numberOfHits: value.reduce(function (acc, a) {
        return acc + a.hitCount;
      }, 0)
    });
  }

  // Get all the matching transcript lines with the query in the current transcript
  var matchedTranscriptLines = getMatchedTranscriptLines(allSearchHits[selectedTranscript], query, trancripts);
  return {
    matchedTranscriptLines: matchedTranscriptLines,
    hitCounts: hitCounts,
    allSearchHits: allSearchHits
  };
};

/**
 * Create a list matched transcript lines for the current search for the displayed transcript
 * @param {Array} searchHits a list of matched transcript lines with ids from the current transcript
 * @param {String} query search query
 * @param {Array} transcripts list of all the transcript lines from the current transcript
 * @returns a list of matched transcrip lines in the current transcript
 */
var getMatchedTranscriptLines = function getMatchedTranscriptLines(searchHits, query, transcripts) {
  var qStr = query.trim().toLocaleLowerCase();
  var transcriptLines = [];
  if (searchHits === undefined) return;
  var traversedIds = [];
  searchHits.map(function (item, index) {
    var target = item.target,
      value = item.value;
    // Read time offsets and text of the search hit
    var timeRange = getMediaFragment(target);

    // Replace all HTML tags
    var mappedText = value.replace(/<\/?[^>]+>/gi, '');
    var start = 0,
      end = 0;
    var transcriptId = undefined;
    if (timeRange != undefined) {
      // For timed-text
      start = timeRange.start;
      end = timeRange.end;
      transcriptId = transcripts.findIndex(function (t) {
        return t.begin == start && t.end == end;
      });
      var queryText = qStr.match(/[a-zA-Z]+/gi) ? qStr.match(/[a-zA-Z]+/gi)[0] : qStr;
      var matchOffset = mappedText.toLocaleLowerCase().indexOf(queryText);
      if (matchOffset !== -1 && transcriptId != undefined) {
        var match = markMatchedParts(value, qStr, item.hitCount, true);
        transcriptLines.push({
          tag: TRANSCRIPT_CUE_TYPES.timedCue,
          begin: start,
          end: end,
          id: transcriptId,
          match: match,
          matchCount: item.hitCount,
          text: value
        });
      }
    } else {
      /**
       * For non timed text, there's no unique id to match the search response to the transcript
       * lines in the UI. So use filter() method instead of findIndex() method to get all matching
       * transcript lines in the display.
       * Use traversedIds array to remember the ids of already processed transcript lines in the list
       * to avoid duplication in the matches.
       */
      var hitsInfo = matchPartsInUntimedText(transcripts, mappedText, qStr, traversedIds);
      traversedIds = hitsInfo.traversedIds;
      transcriptLines = [].concat(_toConsumableArray(transcriptLines), _toConsumableArray(hitsInfo.hits));

      /**
       * When backend has a single block of text which is chuncked in the UI this helps to
       * traverse all transcript cues. 
       */
      while (index === searchHits.length - 1 && ((_traversedIds = traversedIds) === null || _traversedIds === void 0 ? void 0 : _traversedIds.length) < transcripts.length) {
        var _traversedIds;
        var _hitsInfo = matchPartsInUntimedText(transcripts, mappedText, qStr, traversedIds);
        traversedIds = _hitsInfo.traversedIds;
        transcriptLines = [].concat(_toConsumableArray(transcriptLines), _toConsumableArray(_hitsInfo.hits));
      }
    }
  });
  return transcriptLines;
};

/**
 * Build a list of matched indexed transcript lines from content search response.
 * In Avalon, docx and plain text files are chunked by paragraphs seperated by 2 or
 * more new line characters. So, depending on the way the file is formatted the search
 * response could include chunks of the text or the full text.
 * In the library (mammoth) used in Transcript component to display docx files; the text is chunked
 * into paragraphs seperated by one or more new line characters.
 * And the search response doesn't include any text styling in the docx files. Therefore the 
 * text with style information is reformatted to include text highlights from the search response.
 * This function uses the search response to calculate the hit counts and mark them for each indexed transcript
 * line in the front-end to get the correct counts.
 * @param {Array} transcripts indexed transcript text in UI
 * @param {String} mappedText matched text from content search
 * @param {String} query search query entered by the user
 * @param {Array} traversedIds already included transcript indices
 * @returns a list of matched transcript lines
 */
var matchPartsInUntimedText = function matchPartsInUntimedText(transcripts, mappedText, query, traversedIds) {
  var escapedQ = buildRegexReadyText(query, true, false);
  // Get hit counts for the current text, ignore matches with query preceded by - or '
  var qRegex = new RegExp(String.raw(_templateObject$1 || (_templateObject$1 = _taggedTemplateLiteral(["\b", "\b"], ["\\b", "\\b"])), escapedQ), 'gi');
  var matched = [];
  // Start from the next cue after the last traveresed cue in the transcript
  var lastTraversedId = traversedIds[traversedIds.length - 1] + 1 || 0;

  /**
   * For untimed text the search response text could be either,
   * - mapped one to one with the cue text in Transcript component
   * - include a part of the cue text in Transcript component
   * When none of these work check if the cue text contains the search query
   */
  for (var i = lastTraversedId; i < transcripts.length; i++) {
    var t = transcripts[i];
    var cleanedText = t.text.replace(/<\/?[^>]+>/gi, '').trim();
    var matches = _toConsumableArray(cleanedText.matchAll(qRegex));
    var mappedTextCleaned = mappedText.trim();
    if (mappedTextCleaned == cleanedText || mappedTextCleaned.includes(cleanedText) && (matches === null || matches === void 0 ? void 0 : matches.length) > 0) {
      t.matchCount = matches === null || matches === void 0 ? void 0 : matches.length;
      matched.push(t);
      traversedIds.push(t.id);
      break;
    } else if ((matches === null || matches === void 0 ? void 0 : matches.length) > 0) {
      var _ref2;
      t.matchCount = (_ref2 = _toConsumableArray(mappedTextCleaned.matchAll(qRegex))) === null || _ref2 === void 0 ? void 0 : _ref2.length;
      matched.push(t);
      traversedIds.push(t.id);
      break;
    } else {
      traversedIds.push(t.id);
    }
  }
  var hits = [];
  matched.map(function (m) {
    var value = addStyledHighlights(m.textDisplayed, query);
    var match = markMatchedParts(value, query, m.matchCount, true);
    hits.push({
      tag: TRANSCRIPT_CUE_TYPES.nonTimedLine,
      begin: undefined,
      end: undefined,
      id: m.id,
      match: match,
      matchCount: m.matchCount,
      text: value
    });
  });
  return {
    hits: hits,
    traversedIds: traversedIds
  };
};

/**
 * Generic function to mark the matched transcript text in the cue where the output has
 * <span class="ramp--transcript_highlight"></span> surrounding the matched parts
 * within the cue.
 * @param {String} text matched transcript text/cue
 * @param {String} query current search query
 * @param {Numner} hitCount number of hits returned in the search response
 * @param {Boolean} hasHighlight boolean flag to indicate text has <em> tags
 * @returns matched cue with HTML tags added for marking the hightlight 
 */
var markMatchedParts = function markMatchedParts(text, query, hitCount) {
  var hasHighlight = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (text === undefined || !text) return;
  var count = 0;
  var replacerFn = function replacerFn(match) {
    var cleanedMatch = match.replace(/<\/?[^>]+>/gi, '');
    // Only add highlights to search hits in the search response
    if (count < hitCount) {
      count++;
      return "<span class=\"ramp--transcript_highlight\">".concat(cleanedMatch, "</span>");
    } else {
      return cleanedMatch;
    }
  };
  var queryFormatted = query;
  /**
   * Content search response for a phrase search like 'Mr. Bungle' gives the response
   * with highlights in the matched text as <em>Mr</em>. <em>Bungle</em>.
   * So reconstruct the search query in the UI to match this phrase in the response.
   */
  if (hasHighlight) {
    queryFormatted = buildRegexReadyText(query);
  }

  /**
   * Content search API returns cues including "Mr. Bungle" as matches for both search queries
   * "mr bungle" and "mr. bungle".
   * When "mr bungle" is searched this function handles highlighting since the regex fails to
   * identify the matches in the cues.
   */
  var altReplace = function altReplace() {
    var matches = _toConsumableArray(text.matchAll(/<\/?[^>]+>/gi));
    if ((matches === null || matches === void 0 ? void 0 : matches.length) === 0) return;
    var startIndex = 0;
    var newStr = '';
    for (var j = 0; j < matches.length && count < hitCount;) {
      // Set offset to count matches based on the # of words in the phrase search query
      var splitQ = query.split(/[\s-,\?]/);
      var offset = (splitQ === null || splitQ === void 0 ? void 0 : splitQ.length) > 0 ? (splitQ === null || splitQ === void 0 ? void 0 : splitQ.length) * 2 - 1 : 1;
      if (matches[j] === undefined && matches[j + offset] === undefined) return;

      // Indices of start and end of the highlighted text including <em> tags
      var firstIndex = matches[j].index;
      var lastIndex = matches[j + offset].index + matches[j + offset][0].length;
      var prefix = text.slice(startIndex, firstIndex);
      var cleanedMatch = text.slice(firstIndex, lastIndex).replace(/<\/?[^>]+>/gi, '');
      newStr = "".concat(newStr).concat(prefix, "<span class=\"ramp--transcript_highlight\">").concat(cleanedMatch, "</span>");
      startIndex = lastIndex;
      j = +(offset + 1);
      count++;
      if (j == matches.length) {
        newStr = "".concat(newStr).concat(text.slice(startIndex));
      }
    }
    return newStr;
  };
  try {
    var _ref3;
    var queryRegex = new RegExp(String.raw(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["", ""])), queryFormatted), 'gi');
    if (((_ref3 = _toConsumableArray(text.matchAll(queryRegex))) === null || _ref3 === void 0 ? void 0 : _ref3.length) === 0) {
      var highlighted = altReplace();
      return highlighted;
    } else {
      return text.replace(queryRegex, replacerFn);
    }
  } catch (e) {
    console.log('Error building RegExp for query: ', query);
  }
};

/**
 * For docx files the content search response text doesn't have the formatted
 * styles in the Word document (e.g. bold text wrapped in <strong> tags). So,
 * use the styled text formatted with mammoth in the UI to add highlights from
 * the content search response.
 * @param {String} text string to be formatted
 * @param {String} query string to find and replace with <em> tags
 * @returns a string formatted with highlights
 */
var addStyledHighlights = function addStyledHighlights(text, query) {
  if (text === undefined || !text) return;
  var replacerFn = function replacerFn(match) {
    var cleanedMatch = buildRegexReadyText(match, false, true);
    return cleanedMatch;
  };

  // Regex to get matches in the text while ignoring matches with query preceded by - or '
  var queryregex = new RegExp(String.raw(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\b", "\b"], ["\\b", "\\b"])), buildRegexReadyText(query, true, false)), 'gi');
  var styled = text.replace(queryregex, replacerFn);
  return styled;
};

/**
 * Format a given string by escaping punctuations characters and grouping 
 * punctuations and text, to make it feasible to be used to build a regular
 * expression accurately.
 * @param {String} text string to be formatted with hightlights
 * @param {Boolean} regExpReady flag to indicate the usage of the output as a regular exp
 * @param {Boolean} addHightlight flag to indicate to/not to add <em> tags
 * @returns string with <em> tags
 */
var buildRegexReadyText = function buildRegexReadyText(text) {
  var regExpReady = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var addHightlight = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  // Text matches in the string
  var matches = _toConsumableArray(text.matchAll(/[a-zA-Z']+/gi));
  // Punctuation matches in the string
  var punctuationMatches = _toConsumableArray(text.matchAll(/([.+?"^${}\-|[\]\\])/g));

  /**
   * If no punctuations are found within the text return text with highlights
   * For RegExp ready strings: ignore matches followed by - or '
   * e.g. omit matches as "Bungle's" when search query is "bungle"
   */
  if ((punctuationMatches === null || punctuationMatches === void 0 ? void 0 : punctuationMatches.length) === 0) {
    var textFormatted = addHightlight ? text.split(' ').map(function (t) {
      return "<em>".concat(t, "</em>");
    }).join(' ') : text;
    var textRegex = regExpReady ? "".concat(textFormatted, "(?!['w*])") : textFormatted;
    return textRegex;
  }
  var highlighted = '';
  var startIndex = 0;
  var i = 0;
  while (i < matches.length) {
    var match = matches[i];
    var textMatch = addHightlight ? "<em>".concat(match[0], "</em>") : match[0];
    /**
     * When build RegExp ready string with punctuation blocks in the given string;
     * - use * quantifier for blocks either at the start/end of the string to match zero or more times
     * - use + quantifier for blocks in the middle of the string to match one or more times
     * This pattern is build according the response from the content search API results.
     */
    var punctMatch = startIndex === 0 ? "(".concat(text.slice(startIndex, match.index), ")*") : "(".concat(text.slice(startIndex, match.index), ")+");
    highlighted = regExpReady ? "".concat(highlighted).concat(punctMatch, "(").concat(textMatch, ")") : "".concat(highlighted).concat(text.slice(startIndex, match.index)).concat(textMatch);
    startIndex = match.index + match[0].length;
    if (i === (matches === null || matches === void 0 ? void 0 : matches.length) - 1) {
      highlighted = regExpReady ? "".concat(highlighted, "(").concat(text.slice(startIndex), ")*") : "".concat(highlighted).concat(text.slice(startIndex));
    }
    i++;
  }

  // Escape punctuation characters in string for RegExp ready strings
  var escapePunctuation = function escapePunctuation(str) {
    var punctuationRegex = /([.?^${}|[\]\\])/g;
    return str.replace(punctuationRegex, '\\$1');
  };
  return regExpReady ? escapePunctuation(highlighted) : highlighted;
};

/**
 * Calculate hit counts for each matched transcript cue
 * @param {String} text matched transcript cue text
 * @param {String} query search query from UI
 * @param {Boolean} hasHighlight flag indicating has <em> tags or not
 * @returns 
 */
var getHitCountForCue = function getHitCountForCue(text, query) {
  var _ref4;
  var hasHighlight = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  /*
    Content search API highlights each word in the given phrase in the response.
    Threfore, use first word in the query seperated by a white space to get the hit
    counts for each cue.
    Use regex with any punctuation followed by a white space to split the query.
    e.g. query: Mr. bungle => search response: <em>Mr</em>. <em>Bungle</em>
  */
  var partialQ = query.split(/[\s.,!?;:]/)[0];
  var cleanedPartialQ = partialQ.replace(/[\[\]\-]/gi, '');
  var hitTerm = hasHighlight ? buildRegexReadyText(partialQ) : cleanedPartialQ;
  var highlightedTerm = new RegExp(String.raw(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["", ""])), hitTerm), 'gi');
  var hitCount = (_ref4 = _toConsumableArray(text.matchAll(highlightedTerm))) === null || _ref4 === void 0 ? void 0 : _ref4.length;
  return hitCount;
};

// TODO:: Could be used for marking search hits in Word Doc transcripts?
var splitIntoElements = function splitIntoElements(htmlContent) {
  // Create a temporary DOM element to parse the HTML
  var tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  // Convert child nodes into an array
  var elements = buildNonTimedText(Array.from(tempDiv.childNodes), true);
  return elements;
};

/**
 * Build non-timed transcript text content chunks into a JSON array
 * with relevant information for display. These are then used by
 * search module to convert the transcript content into an index.
 * @param {Array} cues a list of trascript cues
 * @param {Boolean} isHTML flag to detect inlined HTML in cues
 * @returns a list of JSON objects for each cue
 */
var buildNonTimedText = function buildNonTimedText(cues) {
  var isHTML = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var indexedCues = [];
  cues.map(function (c) {
    indexedCues.push({
      text: isHTML ? c.innerText : c,
      tag: TRANSCRIPT_CUE_TYPES.nonTimedLine,
      textDisplayed: isHTML ? lib.decode(c.innerHTML) : c
    });
  });
  return indexedCues;
};

var TranscriptDownloader = function TranscriptDownloader(_ref) {
  var fileUrl = _ref.fileUrl,
    fileName = _ref.fileName,
    machineGenerated = _ref.machineGenerated,
    fileExt = _ref.fileExt;
  var handleDownload = function handleDownload(e) {
    e.preventDefault();
    fileDownload(fileUrl, fileName, fileExt, machineGenerated);
  };
  return /*#__PURE__*/React.createElement("button", {
    className: "ramp--transcript_menu_button ramp--transcript_downloader",
    "data-testid": "transcript-downloader",
    onClick: handleDownload,
    href: "#",
    "aria-label": "Transcript download button"
  }, /*#__PURE__*/React.createElement(FileDownloadIcon, null));
};
TranscriptDownloader.propTypes = {
  fileUrl: PropTypes.string,
  fileName: PropTypes.string,
  machineGenerated: PropTypes.bool,
  fileExt: PropTypes.string
};

var TranscriptSelector = function TranscriptSelector(_ref) {
  var selectTranscript = _ref.selectTranscript,
    transcriptData = _ref.transcriptData,
    transcriptInfo = _ref.transcriptInfo,
    noTranscript = _ref.noTranscript;
  var filename = transcriptInfo.filename,
    id = transcriptInfo.id,
    tUrl = transcriptInfo.tUrl,
    tFileExt = transcriptInfo.tFileExt,
    isMachineGen = transcriptInfo.isMachineGen;
  var selectItem = function selectItem(event) {
    selectTranscript(event.target.value);
  };
  if (transcriptData) {
    var result = [/*#__PURE__*/React.createElement("div", {
      key: "transcript-selector",
      "data-testid": "transcript-selector",
      className: "ramp--transcript_selector"
    }, /*#__PURE__*/React.createElement("select", {
      "data-testid": "transcript-select-option",
      value: id || '' // value prop cannot be null, which happens for a split second on initial load
      ,
      onChange: selectItem,
      "aria-label": "Select transcripts",
      "aria-expanded": false,
      "aria-haspopup": "true"
    }, transcriptData.map(function (t, i) {
      return /*#__PURE__*/React.createElement("option", {
        value: t.id,
        label: "".concat(t.title).concat(t.numberOfHits ? ' (' + t.numberOfHits + ')' : ''),
        key: i
      }, "".concat(t.title).concat(t.numberOfHits ? ' (' + t.numberOfHits + ')' : ''));
    })), !noTranscript && /*#__PURE__*/React.createElement(TranscriptDownloader, {
      key: "transcript-downloader",
      fileUrl: tUrl,
      fileName: filename,
      fileExt: tFileExt,
      machineGenerated: isMachineGen
    }))];
    return result;
  } else {
    return null;
  }
};
TranscriptSelector.propTypes = {
  selectTranscript: PropTypes.func.isRequired,
  transcriptData: PropTypes.array.isRequired,
  transcriptInfo: PropTypes.shape({
    title: PropTypes.string,
    id: PropTypes.string,
    tUrl: PropTypes.string,
    tFileExt: PropTypes.string,
    isMachineGen: PropTypes.bool
  }).isRequired,
  noTranscript: PropTypes.bool.isRequired
};
var TranscriptSelector$1 = /*#__PURE__*/React.memo(TranscriptSelector);

var TranscriptSearch = function TranscriptSearch(_ref) {
  var searchResults = _ref.searchResults,
    _ref$searchQuery = _ref.searchQuery,
    searchQuery = _ref$searchQuery === void 0 ? null : _ref$searchQuery,
    focusedMatchIndex = _ref.focusedMatchIndex,
    setFocusedMatchIndex = _ref.setFocusedMatchIndex,
    setSearchQuery = _ref.setSearchQuery;
  var searchInputRef = useRef(null);
  useEffect(function () {
    if (!searchInputRef.current) return;
    if (searchQuery) searchInputRef.current.value = searchQuery;
  }, [!!searchInputRef.current]);
  var handleOnChange = useMemo(function () {
    return debounce_1(function (event) {
      setSearchQuery(event.target.value);
    }, 100);
  }, []);
  var searchQueryEmpty = searchQuery === null || searchQuery.replace(/\s/g, '') === '';
  var resultNavigation = null;
  if (!searchQueryEmpty) {
    if (searchResults.matchingIds.length === 0) {
      resultNavigation = /*#__PURE__*/React.createElement("div", {
        className: "ramp--transcript_search_navigator"
      }, /*#__PURE__*/React.createElement("span", {
        "data-testid": "transcript-search-count",
        className: "ramp--transcript_search_count"
      }, "no results found in this transcript"));
    } else if (focusedMatchIndex !== null) {
      resultNavigation = /*#__PURE__*/React.createElement("div", {
        className: "ramp--transcript_search_navigator"
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        "data-testid": "transcript-search-prev",
        className: "ramp--transcript_menu_button ramp--transcript_search_prev",
        disabled: focusedMatchIndex === 0,
        title: "Previous Search Result",
        onClick: function onClick(e) {
          e.preventDefault();
          e.stopPropagation();
          if (focusedMatchIndex > 0) {
            setFocusedMatchIndex(focusedMatchIndex - 1);
          }
        }
      }, /*#__PURE__*/React.createElement(SearchArrow, {
        flip: true
      })), /*#__PURE__*/React.createElement("span", {
        className: "ramp--transcript_search_count",
        "data-testid": "transcript-search-count"
      }, focusedMatchIndex + 1, " of ", searchResults.matchingIds.length, " results"), /*#__PURE__*/React.createElement("button", {
        className: "ramp--transcript_menu_button ramp--transcript_search_next",
        type: "button",
        "data-testid": "transcript-search-next",
        disabled: focusedMatchIndex >= searchResults.matchingIds.length - 1,
        title: "Next Search Result",
        onClick: function onClick(e) {
          e.preventDefault();
          e.stopPropagation();
          if (focusedMatchIndex < searchResults.matchingIds.length - 1) {
            setFocusedMatchIndex(focusedMatchIndex + 1);
          }
        }
      }, /*#__PURE__*/React.createElement(SearchArrow, null)));
    }
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ramp--transcript_search_input"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    ref: searchInputRef,
    "data-testid": "transcript-search-input",
    "aria-label": "Search the transcript",
    placeholder: "Search Transcript...",
    onChange: function onChange(event) {
      if (event.target.value.trim() == '') {
        setSearchQuery(null);
      } else {
        handleOnChange(event);
      }
    }
  }), !searchQueryEmpty && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Clear search query!",
    "data-testid": "transcript-search-clear",
    className: "ramp--transcript_menu_button ramp--transcript_search_clear",
    onClick: function onClick() {
      setSearchQuery(null);
      if (searchInputRef.current) searchInputRef.current.value = '';
      // Set focus to the search input field
      searchInputRef.current.focus();
    }
  }, /*#__PURE__*/React.createElement("span", null))), resultNavigation);
};
TranscriptSearch.propTypes = {
  setSearchQuery: PropTypes.func.isRequired,
  focusedMatchIndex: PropTypes.number,
  setFocusedMatchIndex: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
  searchResults: PropTypes.any
};

var _excluded$1 = ["showSearch", "setAutoScrollEnabled", "autoScrollEnabled", "searchQuery", "setSearchQuery", "searchResults", "focusedMatchIndex", "setFocusedMatchIndex"];
function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$2(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var MACHINE_GEN_MESSAGE = 'Machine-generated transcript may contain errors.';
var TranscriptMenu = function TranscriptMenu(_ref) {
  var showSearch = _ref.showSearch,
    setAutoScrollEnabled = _ref.setAutoScrollEnabled,
    autoScrollEnabled = _ref.autoScrollEnabled,
    _ref$searchQuery = _ref.searchQuery,
    searchQuery = _ref$searchQuery === void 0 ? null : _ref$searchQuery,
    setSearchQuery = _ref.setSearchQuery,
    searchResults = _ref.searchResults,
    focusedMatchIndex = _ref.focusedMatchIndex,
    setFocusedMatchIndex = _ref.setFocusedMatchIndex,
    selectorProps = _objectWithoutProperties(_ref, _excluded$1);
  var transcriptInfo = selectorProps.transcriptInfo;
  var tType = transcriptInfo.tType,
    isMachineGen = transcriptInfo.isMachineGen;
  return /*#__PURE__*/React.createElement("div", {
    className: "ramp--transcript_menu"
  }, showSearch && /*#__PURE__*/React.createElement(TranscriptSearch, {
    searchResults: searchResults,
    searchQuery: searchQuery,
    setSearchQuery: setSearchQuery,
    focusedMatchIndex: focusedMatchIndex,
    setFocusedMatchIndex: setFocusedMatchIndex
  }), /*#__PURE__*/React.createElement(TranscriptSelector$1, selectorProps), /*#__PURE__*/React.createElement("div", {
    className: "ramp--transcript_menu-info"
  }, isMachineGen && /*#__PURE__*/React.createElement("p", {
    key: "machine-gen-msg",
    className: "ramp--transcript_machine_generated",
    "data-testid": "transcript-machinegen-msg"
  }, MACHINE_GEN_MESSAGE), tType === TRANSCRIPT_TYPES.timedText && /*#__PURE__*/React.createElement("div", {
    className: "ramp--transcript_auto_scroll_check",
    "data-testid": "transcript-auto-scroll-check"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    id: "auto-scroll-check",
    name: "autoscrollcheck",
    "aria-checked": autoScrollEnabled,
    title: searchQuery !== null ? 'Auto-scroll is disabled when searching' : '',
    checked: autoScrollEnabled,
    disabled: searchQuery !== null,
    onChange: function onChange() {
      setAutoScrollEnabled(!autoScrollEnabled);
    }
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "auto-scroll-check",
    title: searchQuery !== null ? 'Auto-scroll is disabled when searching' : ''
  }, "Auto-scroll with media"))));
};
TranscriptMenu.propTypes = _objectSpread$2(_objectSpread$2({
  showSearch: PropTypes.bool,
  autoScrollEnabled: PropTypes.bool.isRequired,
  setAutoScrollEnabled: PropTypes.func.isRequired
}, TranscriptSelector$1.propTypes), TranscriptMenu.propTypes);

var _templateObject;
function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$1(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var defaultMatcherFactory = function defaultMatcherFactory(items) {
  var mappedItems = items.map(function (item) {
    return item.text.toLocaleLowerCase();
  });
  return function (query, abortController) {
    var queryRegex = new RegExp(String.raw(_templateObject || (_templateObject = _taggedTemplateLiteral(["", ""])), query), 'i');
    var qStr = query.trim().toLocaleLowerCase();
    var matchedItems = mappedItems.reduce(function (results, mappedText, idx) {
      var matchOffset = mappedText.search(queryRegex);
      if (matchOffset !== -1) {
        var matchedItem = items[idx];
        // Always takes only the first search hit
        var matchCount = 1;
        var _ref = [matchedItem.text.slice(0, matchOffset), matchedItem.text.slice(matchOffset, matchOffset + qStr.length), matchedItem.text.slice(matchOffset + qStr.length)],
          prefix = _ref[0],
          hit = _ref[1],
          suffix = _ref[2];
        // Add highlight to the search match
        var match = "".concat(prefix, "<span class=\"ramp--transcript_highlight\">").concat(hit, "</span>").concat(suffix);
        return [].concat(_toConsumableArray(results), [_objectSpread$1(_objectSpread$1({}, matchedItem), {}, {
          score: idx,
          match: match,
          matchCount: matchCount
        })]);
      } else {
        return results;
      }
    }, []);
    return {
      matchedTranscriptLines: matchedItems,
      hitCounts: [],
      allSearchHits: null
    };
  };
};
var contentSearchFactory = function contentSearchFactory(searchService, items, selectedTranscript) {
  return /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(query, abortController) {
      var _json$items, fetchHeaders, res, json, parsed;
      return regenerator.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            /**
             * Prevent caching the response as this slows down the search within function by
             * giving the ability to race the cache with the network when the cache is slow.
             * pragma: HTTP/1.0 implementation for older clients
             * cache-control: HTTP/1.1 implementation
             */
            fetchHeaders = new Headers();
            fetchHeaders.append('pragma', 'no-cache');
            fetchHeaders.append('cache-control', 'no-cache');
            _context.next = 6;
            return fetch("".concat(searchService, "?q=").concat(query), {
              signal: abortController.signal,
              headers: fetchHeaders
            });
          case 6:
            res = _context.sent;
            _context.next = 9;
            return res.json();
          case 9:
            json = _context.sent;
            if (!(((_json$items = json.items) === null || _json$items === void 0 ? void 0 : _json$items.length) > 0)) {
              _context.next = 13;
              break;
            }
            parsed = parseContentSearchResponse(json, query, items, selectedTranscript);
            return _context.abrupt("return", parsed);
          case 13:
            return _context.abrupt("return", {
              matchedTranscriptLines: [],
              hitCounts: [],
              allSearchHits: null
            });
          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](0);
            if (_context.t0.name !== 'AbortError') {
              console.error(_context.t0);
            }
            return _context.abrupt("return", {
              matchedTranscriptLines: [],
              hitCounts: [],
              allSearchHits: null
            });
          case 20:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[0, 16]]);
    }));
    return function (_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }();
};
var defaultSorter = function defaultSorter(items) {
  return items.sort(function (a, b) {
    return a.id - b.id;
  });
};
var defaultSearchOpts = {
  initialSearchQuery: null,
  showMarkers: true,
  matcherFactory: defaultMatcherFactory,
  sorter: defaultSorter,
  matchesOnly: false
};
var useSearchOpts = function useSearchOpts(opts) {
  return opts && opts.isSearchable ? _objectSpread$1(_objectSpread$1(_objectSpread$1({}, defaultSearchOpts), opts), {}, {
    enabled: true
  }) : _objectSpread$1(_objectSpread$1({}, defaultSearchOpts), {}, {
    enabled: false
  });
};
function useFilteredTranscripts(_ref3) {
  var query = _ref3.query,
    _ref3$sorter = _ref3.sorter,
    sorter = _ref3$sorter === void 0 ? defaultSearchOpts.sorter : _ref3$sorter,
    _ref3$enabled = _ref3.enabled,
    enabled = _ref3$enabled === void 0 ? true : _ref3$enabled,
    transcripts = _ref3.transcripts,
    canvasIndex = _ref3.canvasIndex,
    selectedTranscript = _ref3.selectedTranscript,
    _ref3$showMarkers = _ref3.showMarkers,
    showMarkers = _ref3$showMarkers === void 0 ? defaultSearchOpts.showMarkers : _ref3$showMarkers,
    _ref3$matchesOnly = _ref3.matchesOnly,
    matchesOnly = _ref3$matchesOnly === void 0 ? defaultSearchOpts.matchesOnly : _ref3$matchesOnly,
    _ref3$matcherFactory = _ref3.matcherFactory,
    matcherFactory = _ref3$matcherFactory === void 0 ? defaultSearchOpts.matcherFactory : _ref3$matcherFactory;
  var _useState = useState({
      results: {},
      ids: [],
      matchingIds: [],
      counts: []
    }),
    _useState2 = _slicedToArray(_useState, 2),
    searchResults = _useState2[0],
    setSearchResults = _useState2[1];
  var _useState3 = useState(),
    _useState4 = _slicedToArray(_useState3, 2),
    searchService = _useState4[0],
    setSearchService = _useState4[1];
  var _useState5 = useState(null),
    _useState6 = _slicedToArray(_useState5, 2),
    allSearchResults = _useState6[0],
    setAllSearchResults = _useState6[1];
  var abortControllerRef = useRef(null);
  var debounceTimerRef = useRef(0);
  var _useMemo = useMemo(function () {
      var itemsWithIds = (transcripts || []).map(function (item, idx) {
        return typeof item === 'string' ? {
          text: item,
          id: idx
        } : _objectSpread$1({
          id: idx
        }, item);
      });
      var itemsIndexed = itemsWithIds.reduce(function (acc, item) {
        return _objectSpread$1(_objectSpread$1({}, acc), {}, _defineProperty({}, item.id, item));
      }, {});
      var matcher = matcherFactory(itemsWithIds);
      if (searchService != null && searchService != undefined) {
        matcher = contentSearchFactory(searchService, itemsWithIds, selectedTranscript);
      }
      return {
        matcher: matcher,
        itemsWithIds: itemsWithIds,
        itemsIndexed: itemsIndexed
      };
    }, [transcripts, matcherFactory, selectedTranscript]),
    matcher = _useMemo.matcher,
    itemsWithIds = _useMemo.itemsWithIds,
    itemsIndexed = _useMemo.itemsIndexed;
  var playerDispatch = useContext(PlayerDispatchContext);
  var manifestState = useContext(ManifestStateContext);

  // Parse searchService from the Canvas/Manifest
  useEffect(function () {
    if (manifestState) {
      var manifest = manifestState.manifest;
      if (manifest) {
        var serviceId = getSearchService(manifest, canvasIndex);
        setSearchService(serviceId);
      }
    }
    // Reset cached search hits on Canvas change
    setAllSearchResults(null);
  }, [canvasIndex]);
  useEffect(function () {
    // abort any existing search operations
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    // Invoke the search factory when query is changed
    if (query) {
      callSearchFactory();
    }
  }, [query]);
  useEffect(function () {
    if (!itemsWithIds.length) {
      if (playerDispatch) playerDispatch({
        type: 'setSearchMarkers',
        payload: []
      });
      // Update searchResult instead of replacing to preserve the hit count
      setSearchResults(_objectSpread$1(_objectSpread$1({}, searchResults), {}, {
        results: {},
        matchingIds: [],
        ids: []
      }));
      return;
    } else if (!enabled || !query) {
      if (playerDispatch) playerDispatch({
        type: 'setSearchMarkers',
        payload: []
      });
      var sortedIds = sorter(_toConsumableArray(itemsWithIds)).map(function (item) {
        return item.id;
      });
      setSearchResults(_objectSpread$1(_objectSpread$1({}, searchResults), {}, {
        results: itemsIndexed,
        matchingIds: [],
        ids: sortedIds
      }));
      // When query is cleared; clear cached search results
      if (!query) {
        setAllSearchResults(null);
      }
      return;
    }

    // Use cached search results to find matches when switching between transcripts with same query
    if (allSearchResults != null) {
      var transcriptSearchResults = allSearchResults[selectedTranscript];
      var searchHits = getMatchedTranscriptLines(transcriptSearchResults, query, itemsWithIds);
      markMatchedItems(searchHits, searchResults === null || searchResults === void 0 ? void 0 : searchResults.counts, allSearchResults);
    } else {
      // Invoke search factory call when there are no cached search results
      callSearchFactory();
    }
  }, [matcher, query, enabled, sorter, matchesOnly, showMarkers, playerDispatch, selectedTranscript]);
  var callSearchFactory = function callSearchFactory() {
    if (!debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    var abortController = new AbortController();
    abortControllerRef.current = abortController;

    /**
     * Use setTimeout without a delay to defer the code block execution and schedule it to
     * run when the call stack is clear. This helps to prevent unnecessary intermediate UI
     * updates with the search results.
     */
    debounceTimerRef.current = setTimeout(function () {
      Promise.resolve(matcher(query, abortControllerRef.current)).then(function (_ref4) {
        var matchedTranscriptLines = _ref4.matchedTranscriptLines,
          hitCounts = _ref4.hitCounts,
          allSearchHits = _ref4.allSearchHits;
        if (abortController.signal.aborted) return;
        markMatchedItems(matchedTranscriptLines, hitCounts, allSearchHits);
      })["catch"](function (e) {
        console.error('Search failed: ', query);
      });
    });
  };
  /**
   * Generic function to prepare a list of search hits to be displayed in the transcript 
   * component either from a reponse from a content search API call (using content search factory)
   * across multiple transcripts or a single JS search using the default matcher factory.
   * @param {Array} matchedTranscriptLines an array of matched transcript lines with ids
   * @param {Array} hitCounts search hit counts for each transcript in the selected canvas
   * @param {Object} allSearchHits a map of search hits grouped by transcript
   * @returns 
   */
  var markMatchedItems = function markMatchedItems(matchedTranscriptLines) {
    var hitCounts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var allSearchHits = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    /**
     * Set all search results and hit counts for each transcript before compiling the
     * matching search hit list for transcript lines. When there are no matches for the
     * current transcript, but there are for others this needs to be set here to avoid
     * duplicate API requests for content search when switching between transcripts.
     */
    setAllSearchResults(allSearchHits);
    var searchResults = {
      results: itemsWithIds,
      matchingIds: [],
      ids: sorter(_toConsumableArray(itemsWithIds)).map(function (item) {
        return item.id;
      }),
      counts: (hitCounts === null || hitCounts === void 0 ? void 0 : hitCounts.length) > 0 ? hitCounts : []
    };
    if (matchedTranscriptLines === undefined) {
      setSearchResults(_objectSpread$1({}, searchResults));
      return;
    }
    var matchingItemsIndexed = matchedTranscriptLines.reduce(function (acc, match) {
      return _objectSpread$1(_objectSpread$1({}, acc), {}, _defineProperty({}, match.id, match));
    }, {});
    var sortedMatchedLines = sorter(_toConsumableArray(matchedTranscriptLines), true);

    // Use matchCount for each cue to get the results count correct in UI
    var sortedMatchIds = [];
    sortedMatchedLines.map(function (item) {
      if (item.matchCount != undefined) {
        var count = 0;
        while (count < item.matchCount) {
          sortedMatchIds.push(item.id);
          count++;
        }
      }
    });
    if (matchesOnly) {
      setSearchResults(_objectSpread$1(_objectSpread$1({}, searchResults), {}, {
        results: matchingItemsIndexed,
        ids: sortedMatchIds,
        matchingIds: sortedMatchIds
      }));
    } else {
      var joinedIndexed = _objectSpread$1(_objectSpread$1({}, itemsIndexed), matchingItemsIndexed);
      var sortedItemIds = sorter(Object.values(joinedIndexed), false).map(function (item) {
        return item.id;
      });
      searchResults = _objectSpread$1(_objectSpread$1({}, searchResults), {}, {
        results: joinedIndexed,
        ids: sortedItemIds,
        matchingIds: sortedMatchIds
      });
      setSearchResults(searchResults);
      if (playerDispatch) {
        if (showMarkers) {
          var nextMarkers = [];
          if (searchResults.matchingIds.length < 25 || (query === null || query === void 0 ? void 0 : query.length) >= 4 && searchResults.matchingIds.length < 45) {
            // ^^ don't show a bazillion markers if we're searching for a short string ^^
            nextMarkers = searchResults.matchingIds.map(function (id) {
              var result = searchResults.results[id];
              return {
                time: result.begin,
                text: '',
                "class": 'ramp--track-marker--search'
              };
            });
          }
          playerDispatch({
            type: 'setSearchMarkers',
            payload: nextMarkers
          });
        } else {
          playerDispatch({
            type: 'setSearchMarkers',
            payload: []
          });
        }
      }
    }
  };
  return searchResults;
}

/**
 * Calculate the search hit count for each transcript in the canvas, when use type-in a search
 * query. Hit counts are cleared when search query is reset.
 * @param {Object.searchResults} searchResults search result object from useFilteredTranscripts hook
 * @param {Object.canvasTranscripts} canvasTranscripts a list of all the transcripts in the canvas 
 * @returns a list of all transcripts in the canvas with number of search hits for each transcript
 */
var useSearchCounts = function useSearchCounts(_ref5) {
  var searchResults = _ref5.searchResults,
    canvasTranscripts = _ref5.canvasTranscripts,
    searchQuery = _ref5.searchQuery;
  if (!(searchResults !== null && searchResults !== void 0 && searchResults.counts) || (canvasTranscripts === null || canvasTranscripts === void 0 ? void 0 : canvasTranscripts.length) === 0 || searchQuery === null) {
    return canvasTranscripts;
  }
  var hitCounts = searchResults.counts;
  var canvasTranscriptsWithCount = [];
  canvasTranscripts.map(function (ct) {
    var _hitCounts$find;
    var numberOfHits = ((_hitCounts$find = hitCounts.find(function (h) {
      return h.transcriptURL === ct.url;
    })) === null || _hitCounts$find === void 0 ? void 0 : _hitCounts$find.numberOfHits) || 0;
    canvasTranscriptsWithCount.push(_objectSpread$1(_objectSpread$1({}, ct), {}, {
      numberOfHits: numberOfHits
    }));
  });
  return canvasTranscriptsWithCount;
};
var useFocusedMatch = function useFocusedMatch(_ref6) {
  var searchResults = _ref6.searchResults;
  var _useState7 = useState(null),
    _useState8 = _slicedToArray(_useState7, 2),
    focusedMatchIndex = _useState8[0],
    setFocusedMatchIndex = _useState8[1];
  var focusedMatchId = focusedMatchIndex === null ? null : searchResults.matchingIds[focusedMatchIndex];
  var setFocusedMatchId = useCallback(function (id) {
    var index = searchResults.matchingIds.indexOf(id);
    if (index !== -1) {
      setFocusedMatchIndex(index);
    } else {
      setFocusedMatchIndex(null);
    }
  }, [searchResults.matchingIds]);
  useEffect(function () {
    if (!searchResults.matchingIds.length && focusedMatchIndex !== null) {
      setFocusedMatchIndex(null);
    } else if (searchResults.matchingIds.length && focusedMatchIndex === null) {
      setFocusedMatchIndex(0); // focus the first match
    } else if (focusedMatchIndex !== null && focusedMatchIndex >= searchResults.matchingIds.length) {
      // as the list of results gets shorter, make sure we don't show "10 of 3" in the search navigator
      setFocusedMatchIndex(searchResults.matchingIds.length - 1);
    }
  }, [searchResults.matchingIds, focusedMatchIndex]);
  useEffect(function () {
    if (searchResults.matchingIds.length && focusedMatchIndex > 0) {
      setFocusedMatchIndex(null);
    }
  }, [searchResults.matchingIds]);
  return {
    focusedMatchId: focusedMatchId,
    setFocusedMatchId: setFocusedMatchId,
    focusedMatchIndex: focusedMatchIndex,
    setFocusedMatchIndex: setFocusedMatchIndex
  };
};

var _excluded = ["initialSearchQuery"];
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var NO_TRANSCRIPTS_MSG = 'No valid Transcript(s) found, please check again.';
var INVALID_URL_MSG = 'Invalid URL for transcript, please check again.';
var INVALID_VTT = 'Invalid WebVTT file, please check again.';
var INVALID_TIMESTAMP = 'Invalid timestamp format in cue(s), please check again.';
var NO_SUPPORT = 'Transcript format is not supported, please check again.';
var buildSpeakerText = function buildSpeakerText(item) {
  var isDocx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var text = isDocx ? item.textDisplayed : item.text;
  if (item.match) {
    text = item.match;
  }
  if (item.speaker) {
    return "<u>".concat(item.speaker, ":</u> ").concat(text);
  } else {
    return text;
  }
};
var TranscriptLine = /*#__PURE__*/React.memo(function (_ref) {
  var item = _ref.item,
    goToItem = _ref.goToItem,
    isActive = _ref.isActive,
    focusedMatchId = _ref.focusedMatchId,
    setFocusedMatchId = _ref.setFocusedMatchId,
    autoScrollEnabled = _ref.autoScrollEnabled,
    showNotes = _ref.showNotes,
    transcriptContainerRef = _ref.transcriptContainerRef,
    isNonTimedText = _ref.isNonTimedText,
    focusedMatchIndex = _ref.focusedMatchIndex;
  var itemRef = React.useRef(null);
  var isFocused = item.id === focusedMatchId;
  var wasFocusedRef = React.useRef(isFocused);
  var wasActiveRef = React.useRef(isActive);
  // React ref to store previous focusedMatchIndex
  var prevFocusedIndexRef = React.useRef(-1);
  // React ref to store previous focusedMatchId
  var prevFocusedIdRef = React.useRef(-1);
  // React ref to iterate through multiple hits within a focused cue
  var activeRelativeCountRef = React.useRef(0);
  React.useEffect(function () {
    var doScroll = false;
    var prevFocused = prevFocusedIdRef.current;
    if (isActive && !wasActiveRef.current) {
      if (autoScrollEnabled) {
        wasActiveRef.current = true;
        doScroll = true;
      }
    } else {
      wasActiveRef.current = false;
    }
    if (isFocused && !wasFocusedRef.current) {
      wasFocusedRef.current = true;
      doScroll = true;
    } else {
      wasFocusedRef.current = false;
    }
    if (doScroll && itemRef.current) {
      autoScroll(itemRef.current, transcriptContainerRef, true);
    }

    // Update relative count and match id refs within the component when navigating results
    if (prevFocused < focusedMatchId || prevFocused < 0 || !prevFocused) {
      activeRelativeCountRef.current = -1;
    } else {
      activeRelativeCountRef.current = item.matchCount;
    }
    prevFocusedIdRef.current = focusedMatchId;
  }, [autoScrollEnabled, isActive, isFocused, itemRef.current]);

  /**
   * Add a border highlight to the current focused search hit when using search
   * result navigation, when there are multiple hits within a focused cue
   */
  React.useEffect(function () {
    if (itemRef.current && isFocused) {
      // Find all highlights within the focused cue
      var highlights = itemRef.current.querySelectorAll('.ramp--transcript_highlight');
      // Clean classList from previous navigations
      highlights.forEach(function (h) {
        return h.classList.remove('current-hit');
      });

      // Read previously focused match index
      var prevFocusedIndex = prevFocusedIndexRef.current;
      // Adjust the relative focus index within the focused cue
      activeRelativeCountRef.current = focusedMatchIndex > prevFocusedIndex ? activeRelativeCountRef.current + 1 : activeRelativeCountRef.current <= 0 ? 0 : activeRelativeCountRef.current - 1;

      // If exists add a border to the current focused hit within the cue
      if (activeRelativeCountRef.current > -1) {
        var currentHighlight = highlights[activeRelativeCountRef.current];
        if (currentHighlight != undefined) {
          currentHighlight.classList.add('current-hit');
          autoScroll(currentHighlight, transcriptContainerRef, true);
        }
      }
      // Update the ref for focused match index in the component
      prevFocusedIndexRef.current = focusedMatchIndex;
    }
  }, [focusedMatchIndex]);
  var onClick = function onClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (item.match && focusedMatchId !== item.id) {
      setFocusedMatchId(item.id);
    } else if (focusedMatchId !== null && item.tag === TRANSCRIPT_CUE_TYPES.timedCue) {
      autoScroll(itemRef.current, transcriptContainerRef, true);
    }
    goToItem(item);
  };
  if (item.tag === TRANSCRIPT_CUE_TYPES.note && showNotes) {
    return /*#__PURE__*/React.createElement("a", {
      href: "#",
      ref: itemRef,
      role: "listitem",
      onClick: onClick,
      className: cx('ramp--transcript_item', isActive && 'active', isFocused && 'focused'),
      "data-testid": "transcript_text",
      dangerouslySetInnerHTML: {
        __html: buildSpeakerText(item)
      }
    });
  } else if (item.tag === TRANSCRIPT_CUE_TYPES.timedCue) {
    return /*#__PURE__*/React.createElement("a", {
      href: "#",
      ref: itemRef,
      role: "listitem",
      onClick: onClick,
      "data-testid": "transcript_item",
      className: cx('ramp--transcript_item', isActive && 'active', isFocused && 'focused')
    }, typeof item.begin === 'number' && /*#__PURE__*/React.createElement("span", {
      className: "ramp--transcript_time",
      "data-testid": "transcript_time"
    }, "[", timeToHHmmss(item.begin, true), "]"), /*#__PURE__*/React.createElement("span", {
      className: "ramp--transcript_text",
      "data-testid": "transcript_text",
      dangerouslySetInnerHTML: {
        __html: buildSpeakerText(item)
      }
    }));
  } else if (item.tag === TRANSCRIPT_CUE_TYPES.nonTimedLine) {
    return /*#__PURE__*/React.createElement("a", {
      href: "#",
      ref: itemRef,
      role: "listitem",
      onClick: onClick,
      className: cx('ramp--transcript_item', isActive && 'active', isFocused && 'focused'),
      "data-testid": "transcript_untimed_text"
    }, /*#__PURE__*/React.createElement("p", {
      className: "ramp--transcript_untimed_item",
      dangerouslySetInnerHTML: {
        __html: buildSpeakerText(item, isNonTimedText)
      }
    }));
  } else {
    return null;
  }
});
var Spinner = function Spinner() {
  return /*#__PURE__*/React.createElement("div", {
    className: "lds-spinner"
  }, /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null));
};
var TranscriptList = /*#__PURE__*/React.memo(function (_ref2) {
  var seekPlayer = _ref2.seekPlayer,
    currentTime = _ref2.currentTime,
    searchResults = _ref2.searchResults,
    focusedMatchId = _ref2.focusedMatchId,
    transcriptInfo = _ref2.transcriptInfo,
    setFocusedMatchId = _ref2.setFocusedMatchId,
    autoScrollEnabled = _ref2.autoScrollEnabled,
    showNotes = _ref2.showNotes,
    transcriptContainerRef = _ref2.transcriptContainerRef,
    focusedMatchIndex = _ref2.focusedMatchIndex;
  var _React$useState = React.useState(null),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    manuallyActivatedItemId = _React$useState2[0],
    setManuallyActivatedItem = _React$useState2[1];
  var goToItem = React.useCallback(function (item) {
    if (typeof item.begin === 'number') {
      seekPlayer(item.begin);
      setManuallyActivatedItem(null);
    } else {
      setManuallyActivatedItem(item.id);
    }
  }, [seekPlayer]);
  var testid;
  switch (transcriptInfo.tType) {
    case TRANSCRIPT_TYPES.plainText:
      testid = 'plain-text';
      break;
    case TRANSCRIPT_TYPES.docx:
      testid = 'docs';
      break;
    case TRANSCRIPT_TYPES.timedText:
      testid = 'timed-text';
    default:
      testid = '';
      break;
  }
  if (transcriptInfo.tError) {
    return /*#__PURE__*/React.createElement("p", {
      key: "no-transcript",
      id: "no-transcript",
      "data-testid": "no-transcript",
      role: "note"
    }, transcriptInfo.tError);
  } else if (!searchResults.results || searchResults.results.length === 0) {
    return /*#__PURE__*/React.createElement(Spinner, null);
  } else {
    return /*#__PURE__*/React.createElement("div", {
      "data-testid": "transcript_".concat(testid)
    }, searchResults.ids.map(function (itemId) {
      return /*#__PURE__*/React.createElement(TranscriptLine, {
        key: itemId,
        goToItem: goToItem,
        focusedMatchId: focusedMatchId,
        isActive: manuallyActivatedItemId === itemId || typeof searchResults.results[itemId].begin === 'number' && searchResults.results[itemId].begin <= currentTime && currentTime <= searchResults.results[itemId].end,
        item: searchResults.results[itemId],
        autoScrollEnabled: autoScrollEnabled,
        setFocusedMatchId: setFocusedMatchId,
        showNotes: showNotes,
        transcriptContainerRef: transcriptContainerRef,
        isNonTimedText: true,
        focusedMatchIndex: focusedMatchIndex
      });
    }));
  }
});

/**
 *
 * @param {String} param0 ID of the HTML element for the player on page
 * @param {String} param1 manifest URL to read transcripts from
 * @param {Object} param2 transcripts resource
 * @returns
 */
var Transcript = function Transcript(_ref3) {
  var playerID = _ref3.playerID,
    manifestUrl = _ref3.manifestUrl,
    _ref3$showNotes = _ref3.showNotes,
    showNotes = _ref3$showNotes === void 0 ? false : _ref3$showNotes,
    _ref3$search = _ref3.search,
    search = _ref3$search === void 0 ? {} : _ref3$search,
    _ref3$transcripts = _ref3.transcripts,
    transcripts = _ref3$transcripts === void 0 ? [] : _ref3$transcripts;
  var _React$useState3 = React.useState([]),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    transcriptsList = _React$useState4[0],
    setTranscriptsList = _React$useState4[1];
  var _React$useState5 = React.useState([]),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    canvasTranscripts = _React$useState6[0],
    setCanvasTranscripts = _React$useState6[1];
  var _React$useState7 = React.useState([]),
    _React$useState8 = _slicedToArray(_React$useState7, 2),
    transcript = _React$useState8[0],
    setTranscript = _React$useState8[1];
  var _React$useState9 = React.useState({
      title: null,
      filename: null,
      id: null,
      tUrl: null,
      tType: null,
      tFileExt: null,
      isMachineGen: false,
      tError: null
    }),
    _React$useState10 = _slicedToArray(_React$useState9, 2),
    transcriptInfo = _React$useState10[0],
    setTranscriptInfo = _React$useState10[1];
  var _React$useState11 = React.useState(),
    _React$useState12 = _slicedToArray(_React$useState11, 2),
    selectedTranscript = _React$useState12[0],
    setSelectedTranscript = _React$useState12[1];
  var _React$useState13 = React.useState(true),
    _React$useState14 = _slicedToArray(_React$useState13, 2),
    isLoading = _React$useState14[0],
    setIsLoading = _React$useState14[1];
  // Store transcript data in state to avoid re-requesting file contents
  var _React$useState15 = React.useState([]),
    _React$useState16 = _slicedToArray(_React$useState15, 2),
    cachedTranscripts = _React$useState16[0],
    setCachedTranscripts = _React$useState16[1];

  /* 
    Enable search only for timed text as it is only working for these transcripts
    TODO:: remove 'isSearchable' if/when search is supported for other formats
   */
  var _useSearchOpts = useSearchOpts(_objectSpread(_objectSpread({}, search), {}, {
      isSearchable: transcriptInfo.tType === TRANSCRIPT_TYPES.timedText || transcriptInfo.tType === TRANSCRIPT_TYPES.docx || transcriptInfo.tType === TRANSCRIPT_TYPES.plainText,
      showMarkers: transcriptInfo.tType === TRANSCRIPT_TYPES.timedText
    })),
    initialSearchQuery = _useSearchOpts.initialSearchQuery,
    searchOpts = _objectWithoutProperties(_useSearchOpts, _excluded);
  var _React$useState17 = React.useState(initialSearchQuery),
    _React$useState18 = _slicedToArray(_React$useState17, 2),
    searchQuery = _React$useState18[0],
    setSearchQuery = _React$useState18[1];
  var _React$useState19 = React.useState(-1),
    _React$useState20 = _slicedToArray(_React$useState19, 2),
    _canvasIndex = _React$useState20[0],
    _setCanvasIndex = _React$useState20[1];
  var canvasIndexRef = React.useRef(_canvasIndex);
  var setCanvasIndex = function setCanvasIndex(c) {
    abortController.abort();
    canvasIndexRef.current = c;
    _setCanvasIndex(c); // force re-render
  };

  var searchResults = useFilteredTranscripts(_objectSpread(_objectSpread({}, searchOpts), {}, {
    query: searchQuery,
    transcripts: transcript,
    canvasIndex: canvasIndexRef.current,
    selectedTranscript: selectedTranscript
  }));
  var _useFocusedMatch = useFocusedMatch({
      searchResults: searchResults
    }),
    focusedMatchId = _useFocusedMatch.focusedMatchId,
    setFocusedMatchId = _useFocusedMatch.setFocusedMatchId,
    focusedMatchIndex = _useFocusedMatch.focusedMatchIndex,
    setFocusedMatchIndex = _useFocusedMatch.setFocusedMatchIndex;
  var tanscriptHitCounts = useSearchCounts({
    searchResults: searchResults,
    canvasTranscripts: canvasTranscripts,
    searchQuery: searchQuery
  });
  var _React$useState21 = React.useState(true),
    _React$useState22 = _slicedToArray(_React$useState21, 2),
    isEmpty = _React$useState22[0],
    setIsEmpty = _React$useState22[1];
  var _React$useState23 = React.useState(true),
    _React$useState24 = _slicedToArray(_React$useState23, 2),
    _autoScrollEnabled = _React$useState24[0],
    _setAutoScrollEnabled = _React$useState24[1];
  var autoScrollEnabledRef = React.useRef(_autoScrollEnabled);
  var setAutoScrollEnabled = function setAutoScrollEnabled(a) {
    autoScrollEnabledRef.current = a;
    _setAutoScrollEnabled(a); // force re-render
  };

  var abortController = new AbortController();
  var playerIntervalRef = React.useRef(null);
  var playerRef = React.useRef(null);
  var transcriptContainerRef = React.useRef();
  var _React$useState25 = React.useState(-1),
    _React$useState26 = _slicedToArray(_React$useState25, 2),
    currentTime = _React$useState26[0],
    _setCurrentTime = _React$useState26[1];
  var setCurrentTime = React.useMemo(function () {
    return throttle_1(_setCurrentTime, 50);
  }, []);
  var seekPlayer = React.useCallback(function (time) {
    setCurrentTime(time); // so selecting an item works in tests
    if (playerRef.current) playerRef.current.currentTime = time;
  }, []);

  /**
   * Start an interval at the start of the component to poll the
   * canvasindex attribute changes in the player on the page
   */
  React.useEffect(function () {
    playerIntervalRef.current = setInterval(function () {
      var domPlayer = document.getElementById(playerID);
      if (!domPlayer) {
        console.error("Cannot find player, '" + playerID + "' on page. Transcript synchronization is disabled.");
        // Inaccessible canvas => stop loading spinner
        setIsLoading(false);
      } else {
        if (domPlayer.children[0]) playerRef.current = domPlayer.children[0];else playerRef.current = domPlayer;
      }
      if (playerRef.current) {
        var cIndex = parseInt(playerRef.current.dataset['canvasindex']);
        if (Number.isNaN(cIndex)) cIndex = 0;
        if (cIndex !== canvasIndexRef.current) {
          // Clear the transcript text in the component
          setTranscript([]);
          setCanvasIndex(cIndex);
          setCurrentTime(playerRef.current.currentTime);
          playerRef.current.addEventListener('timeupdate', function () {
            setCurrentTime(playerRef.current.currentTime);
          });
        }
      }
    }, 500);
  }, []);
  React.useEffect(function () {
    // Clean up state when the component unmounts
    return function () {
      clearInterval(playerIntervalRef.current);
    };
  }, []);
  React.useEffect( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
    var allTranscripts;
    return regenerator.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          allTranscripts = [];
          if (!((transcripts === null || transcripts === void 0 ? void 0 : transcripts.length) === 0 && !manifestUrl)) {
            _context.next = 7;
            break;
          }
          // When both required props are invalid
          setIsLoading(false);
          setTranscript([]);
          setTranscriptInfo({
            tType: TRANSCRIPT_TYPES.noTranscript,
            id: '',
            tError: NO_TRANSCRIPTS_MSG
          });
          _context.next = 19;
          break;
        case 7:
          if (!((transcripts === null || transcripts === void 0 ? void 0 : transcripts.length) > 0
          // transcripts prop is processed first if given
          )) {
            _context.next = 13;
            break;
          }
          _context.next = 10;
          return sanitizeTranscripts(transcripts);
        case 10:
          _context.t0 = _context.sent;
          _context.next = 16;
          break;
        case 13:
          _context.next = 15;
          return readSupplementingAnnotations(manifestUrl);
        case 15:
          _context.t0 = _context.sent;
        case 16:
          allTranscripts = _context.t0;
          setTranscriptsList(allTranscripts);
          initTranscriptData(allTranscripts);
        case 19:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })), [canvasIndexRef.current]); // helps to load initial transcript with async req

  React.useEffect(function () {
    if ((transcriptsList === null || transcriptsList === void 0 ? void 0 : transcriptsList.length) > 0 && canvasIndexRef.current != undefined) {
      var cTranscripts = transcriptsList.filter(function (tr) {
        return tr.canvasId == canvasIndexRef.current;
      })[0];
      setCanvasTranscripts(cTranscripts.items);
      setStateVar(cTranscripts.items[0]);
    }
  }, [canvasIndexRef.current]);
  var initTranscriptData = function initTranscriptData(allTranscripts) {
    var _getCanvasT, _getTItems;
    // When canvasIndex updates -> return
    if (abortController.signal.aborted) return;
    var getCanvasT = function getCanvasT(tr) {
      return tr.filter(function (t) {
        return t.canvasId == _canvasIndex;
      });
    };
    var getTItems = function getTItems(tr) {
      return getCanvasT(tr)[0].items;
    };
    /**
     * When transcripts prop is empty
     * OR the respective canvas doesn't have transcript data
     * OR canvas' transcript items list is empty
     */
    if (!(allTranscripts !== null && allTranscripts !== void 0 && allTranscripts.length) > 0 || !((_getCanvasT = getCanvasT(allTranscripts)) !== null && _getCanvasT !== void 0 && _getCanvasT.length) > 0 || !((_getTItems = getTItems(allTranscripts)) !== null && _getTItems !== void 0 && _getTItems.length) > 0) {
      setIsEmpty(true);
      setTranscript([]);
      setStateVar(undefined);
    } else {
      setIsEmpty(false);
      var cTranscripts = getCanvasT(allTranscripts)[0];
      setCanvasTranscripts(cTranscripts.items);
      setStateVar(cTranscripts.items[0]);
    }
  };
  var selectTranscript = React.useCallback(function (selectedId) {
    var selectedTranscript = canvasTranscripts.filter(function (tr) {
      return tr.id === selectedId;
    });
    setStateVar(selectedTranscript[0]);
  }, [canvasTranscripts]);
  var setStateVar = /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(transcript) {
      var _transcript, id, title, filename, url, isMachineGen, format, cached, _cached$, tData, tFileExt, tType, tError;
      return regenerator.wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            if (!(!transcript || transcript == undefined)) {
              _context2.next = 5;
              break;
            }
            setIsEmpty(true);
            setIsLoading(false);
            setTranscriptInfo({
              tType: TRANSCRIPT_TYPES.noTranscript,
              id: '',
              tError: NO_TRANSCRIPTS_MSG
            });
            return _context2.abrupt("return");
          case 5:
            // set isEmpty flag to render transcripts UI
            setIsEmpty(false);
            _transcript = transcript, id = _transcript.id, title = _transcript.title, filename = _transcript.filename, url = _transcript.url, isMachineGen = _transcript.isMachineGen, format = _transcript.format; // Check cached transcript data
            cached = cachedTranscripts.filter(function (ct) {
              return ct.id == id && ct.canvasId == canvasIndexRef.current;
            });
            if (!((cached === null || cached === void 0 ? void 0 : cached.length) > 0)) {
              _context2.next = 15;
              break;
            }
            // Load cached transcript data into the component
            _cached$ = cached[0], tData = _cached$.tData, tFileExt = _cached$.tFileExt, tType = _cached$.tType, tError = _cached$.tError;
            setTranscript(tData);
            setTranscriptInfo({
              title: title,
              filename: filename,
              id: id,
              isMachineGen: isMachineGen,
              tType: tType,
              tUrl: url,
              tFileExt: tFileExt,
              tError: tError
            });
            setSelectedTranscript(url);
            _context2.next = 17;
            break;
          case 15:
            _context2.next = 17;
            return Promise.resolve(parseTranscriptData(url, canvasIndexRef.current, format)).then(function (value) {
              if (value != null) {
                var _tData = value.tData,
                  tUrl = value.tUrl,
                  _tType = value.tType,
                  _tFileExt = value.tFileExt;
                var newError = '';
                switch (_tType) {
                  case TRANSCRIPT_TYPES.invalid:
                    newError = INVALID_URL_MSG;
                    break;
                  case TRANSCRIPT_TYPES.noTranscript:
                    newError = NO_TRANSCRIPTS_MSG;
                    break;
                  case TRANSCRIPT_TYPES.noSupport:
                    newError = NO_SUPPORT;
                    break;
                  case TRANSCRIPT_TYPES.invalidVTT:
                    newError = INVALID_VTT;
                    break;
                  case TRANSCRIPT_TYPES.invalidTimestamp:
                    newError = INVALID_TIMESTAMP;
                    break;
                }
                setTranscript(_tData);
                setTranscriptInfo({
                  title: title,
                  filename: filename,
                  id: id,
                  isMachineGen: isMachineGen,
                  tType: _tType,
                  tUrl: tUrl,
                  tFileExt: _tFileExt,
                  tError: newError
                });
                setSelectedTranscript(tUrl);
                transcript = _objectSpread(_objectSpread({}, transcript), {}, {
                  tType: _tType,
                  tData: _tData,
                  tFileExt: _tFileExt,
                  canvasId: canvasIndexRef.current,
                  tError: newError
                });
                // Cache the transcript info 
                setCachedTranscripts([].concat(_toConsumableArray(cachedTranscripts), [transcript]));
              }
            });
          case 17:
            setIsLoading(false);
          case 18:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function setStateVar(_x) {
      return _ref5.apply(this, arguments);
    };
  }();
  if (!isLoading) {
    var _transcriptInfo$tErro;
    return /*#__PURE__*/React.createElement("div", {
      className: "ramp--transcript_nav",
      "data-testid": "transcript_nav",
      key: transcriptInfo.title
    }, !isEmpty && /*#__PURE__*/React.createElement(TranscriptMenu, {
      showSearch: searchOpts.enabled,
      selectTranscript: selectTranscript,
      transcriptData: tanscriptHitCounts,
      transcriptInfo: transcriptInfo,
      noTranscript: ((_transcriptInfo$tErro = transcriptInfo.tError) === null || _transcriptInfo$tErro === void 0 ? void 0 : _transcriptInfo$tErro.length) > 0 && transcriptInfo.tError != NO_SUPPORT,
      setAutoScrollEnabled: setAutoScrollEnabled,
      setFocusedMatchIndex: setFocusedMatchIndex,
      focusedMatchIndex: focusedMatchIndex,
      autoScrollEnabled: autoScrollEnabledRef.current,
      searchResults: searchResults,
      searchQuery: searchQuery,
      setSearchQuery: setSearchQuery
    }), /*#__PURE__*/React.createElement("div", {
      className: "transcript_content ".concat(transcript ? '' : 'static'),
      "data-testid": "transcript_content_".concat(transcriptInfo.tType),
      role: "list",
      "aria-label": "Attached Transcript content",
      ref: transcriptContainerRef
    }, /*#__PURE__*/React.createElement(TranscriptList, {
      currentTime: currentTime,
      seekPlayer: seekPlayer,
      searchResults: searchResults,
      focusedMatchId: focusedMatchId,
      transcriptInfo: transcriptInfo,
      setFocusedMatchId: setFocusedMatchId,
      autoScrollEnabled: autoScrollEnabledRef.current && searchQuery === null,
      showNotes: showNotes,
      transcriptContainerRef: transcriptContainerRef,
      focusedMatchIndex: focusedMatchIndex
    })));
  } else {
    return /*#__PURE__*/React.createElement(Spinner, null);
  }
};
Transcript.propTypes = {
  /** `id` attribute of the media player in the DOM */
  playerID: PropTypes.string.isRequired,
  /** URL of the manifest */
  manifestUrl: PropTypes.string,
  showSearch: PropTypes.bool,
  showNotes: PropTypes.bool,
  search: PropTypes.oneOf([PropTypes.bool, PropTypes.shape({
    initialSearchQuery: PropTypes.string,
    showMarkers: PropTypes.bool,
    matcherFactory: PropTypes.func,
    sorter: PropTypes.func,
    matchesOnly: PropTypes.bool
  })]),
  /** A list of transcripts for respective canvases in the manifest */
  transcripts: PropTypes.arrayOf(PropTypes.shape({
    /** Index of the canvas in manifest, starts with zero */
    canvasId: PropTypes.number.isRequired,
    /** List of title and URI key value pairs for each individual transcript resource */
    items: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string
    }))
  }))
};

/** 
 * @param {Boolean} param0 display only Canvas metadata when set to true with other props are default
 * @param {Boolean} param1 display both Manifest and Canvas metadata when set to true
 * @param {Boolean} param2 hide the title in the metadata when set to false, defaults to true 
 * @param {Boolean} param3 hide the heading UI component when set to false, defaults to true
 * @returns 
 */
var MetadataDisplay = function MetadataDisplay(_ref) {
  var _ref$displayOnlyCanva = _ref.displayOnlyCanvasMetadata,
    displayOnlyCanvasMetadata = _ref$displayOnlyCanva === void 0 ? false : _ref$displayOnlyCanva,
    _ref$displayAllMetada = _ref.displayAllMetadata,
    displayAllMetadata = _ref$displayAllMetada === void 0 ? false : _ref$displayAllMetada,
    _ref$displayTitle = _ref.displayTitle,
    displayTitle = _ref$displayTitle === void 0 ? true : _ref$displayTitle,
    _ref$showHeading = _ref.showHeading,
    showHeading = _ref$showHeading === void 0 ? true : _ref$showHeading,
    _ref$itemHeading = _ref.itemHeading,
    itemHeading = _ref$itemHeading === void 0 ? 'Item Details' : _ref$itemHeading,
    _ref$sectionHeaading = _ref.sectionHeaading,
    sectionHeaading = _ref$sectionHeaading === void 0 ? 'Section Details' : _ref$sectionHeaading;
  var _useManifestState = useManifestState(),
    manifest = _useManifestState.manifest,
    canvasIndex = _useManifestState.canvasIndex;
  var _React$useState = React.useState(),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    manifestMetadata = _React$useState2[0],
    setManifestMetadata = _React$useState2[1];
  // Metadata for all Canavases in state
  var _React$useState3 = React.useState(),
    _React$useState4 = _slicedToArray(_React$useState3, 2);
    _React$useState4[0];
    var _setCanvasesMetadata = _React$useState4[1];
  // Current Canvas metadata in state
  var _React$useState5 = React.useState(),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    canvasMetadata = _React$useState6[0],
    setCanvasMetadata = _React$useState6[1];
  // Boolean flags set according to user props to hide/show metadata
  var _React$useState7 = React.useState(),
    _React$useState8 = _slicedToArray(_React$useState7, 2),
    showManifestMetadata = _React$useState8[0],
    setShowManifestMetadata = _React$useState8[1];
  var _React$useState9 = React.useState(),
    _React$useState10 = _slicedToArray(_React$useState9, 2),
    showCanvasMetadata = _React$useState10[0],
    setShowCanvasMetadata = _React$useState10[1];
  var _React$useState11 = React.useState(),
    _React$useState12 = _slicedToArray(_React$useState11, 2),
    manifestRights = _React$useState12[0],
    setManifestRights = _React$useState12[1];
  var _React$useState13 = React.useState(),
    _React$useState14 = _slicedToArray(_React$useState13, 2),
    canvasRights = _React$useState14[0],
    setCanvasRights = _React$useState14[1];
  var canvasesMetadataRef = React.useRef();
  var setCanvasesMetadata = function setCanvasesMetadata(m) {
    _setCanvasesMetadata(m);
    canvasesMetadataRef.current = m;
  };
  /**
   * On the initialization of the component read metadata from the Manifest
   * and/or Canvases based on the input props and set the initial set(s) of
   * metadata in the component's state
   */
  React.useEffect(function () {
    if (manifest) {
      var _parsedMetadata$right;
      // Display Canvas metadata only when specified in the props
      var showCanvas = displayOnlyCanvasMetadata || displayAllMetadata;
      setShowCanvasMetadata(showCanvas);
      var showManifest = !displayOnlyCanvasMetadata || displayAllMetadata;
      setShowManifestMetadata(showManifest);

      // Parse metadata from Manifest
      var parsedMetadata = getMetadata(manifest, showCanvas);

      // Set Manifest and Canvas metadata in the state variables according to props
      if (showCanvas) {
        setCanvasesMetadata(parsedMetadata.canvasMetadata);
        setCanvasMetadataInState();
      }
      if (showManifest) {
        var manifestMeta = parsedMetadata.manifestMetadata;
        if (!displayTitle) {
          manifestMeta = manifestMeta.filter(function (md) {
            return md.label.toLowerCase() != 'title';
          });
        }
        setManifestMetadata(manifestMeta);
      }
      if (((_parsedMetadata$right = parsedMetadata.rights) === null || _parsedMetadata$right === void 0 ? void 0 : _parsedMetadata$right.length) > 0) {
        setManifestRights(parsedMetadata.rights);
      }
    }
  }, [manifest]);

  /**
   * When displaying current Canvas's metadata in the component, update the metadata
   * in the component's state listening to the canvasIndex changes in the central
   * state
   */
  React.useEffect(function () {
    if (canvasIndex >= 0 && showCanvasMetadata) {
      setCanvasMetadataInState();
    }
  }, [canvasIndex]);

  /**
   * Set canvas metadata in state
   */
  var setCanvasMetadataInState = function setCanvasMetadataInState() {
    var canvasData = canvasesMetadataRef.current.filter(function (m) {
      return m.canvasindex === canvasIndex;
    })[0];
    if (canvasData != undefined) {
      var metadata = canvasData.metadata,
        rights = canvasData.rights;
      if (!displayTitle && metadata != undefined) {
        metadata = metadata.filter(function (md) {
          return md.label.toLowerCase() != 'title';
        });
      }
      setCanvasMetadata(metadata);
      if (rights != undefined && (rights === null || rights === void 0 ? void 0 : rights.length) > 0) {
        setCanvasRights(rights);
      }
    }
  };
  /**
   * Distinguish whether there is any metadata to be displayed
   * @returns {Boolean}
   */
  var hasMetadata = function hasMetadata() {
    return (canvasMetadata === null || canvasMetadata === void 0 ? void 0 : canvasMetadata.length) > 0 || (manifestMetadata === null || manifestMetadata === void 0 ? void 0 : manifestMetadata.length) > 0;
  };
  var buildMetadata = function buildMetadata(metadata) {
    var metadataPairs = [];
    if ((metadata === null || metadata === void 0 ? void 0 : metadata.length) > 0) {
      metadata.map(function (md, index) {
        metadataPairs.push( /*#__PURE__*/React.createElement(React.Fragment, {
          key: index
        }, /*#__PURE__*/React.createElement("dt", null, md.label), /*#__PURE__*/React.createElement("dd", {
          dangerouslySetInnerHTML: {
            __html: md.value
          }
        })));
      });
    }
    return /*#__PURE__*/React.createElement("dl", null, metadataPairs);
  };
  return /*#__PURE__*/React.createElement("div", {
    "data-testid": "metadata-display",
    className: "ramp--metadata-display"
  }, showHeading && /*#__PURE__*/React.createElement("div", {
    className: "ramp--metadata-display-title",
    "data-testid": "metadata-display-title"
  }, /*#__PURE__*/React.createElement("h4", null, "Details")), hasMetadata() && /*#__PURE__*/React.createElement("div", {
    className: "ramp--metadata-display-content"
  }, showManifestMetadata && (manifestMetadata === null || manifestMetadata === void 0 ? void 0 : manifestMetadata.length) > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, displayAllMetadata && /*#__PURE__*/React.createElement("span", null, itemHeading), buildMetadata(manifestMetadata), (manifestRights === null || manifestRights === void 0 ? void 0 : manifestRights.length) > 0 && /*#__PURE__*/React.createElement("span", {
    className: "ramp--metadata-rights-heading",
    "data-testid": "manifest-rights"
  }, "Rights"), buildMetadata(manifestRights)), showCanvasMetadata && (canvasMetadata === null || canvasMetadata === void 0 ? void 0 : canvasMetadata.length) > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, displayAllMetadata && /*#__PURE__*/React.createElement("span", null, sectionHeaading), buildMetadata(canvasMetadata), (canvasRights === null || canvasRights === void 0 ? void 0 : canvasRights.length) > 0 && /*#__PURE__*/React.createElement("span", {
    className: "ramp--metadata-rights-heading",
    "data-testid": "canvas-rights"
  }, "Rights"), buildMetadata(canvasRights))), !hasMetadata() && /*#__PURE__*/React.createElement("div", {
    "data-testid": "metadata-display-message",
    className: "ramp--metadata-display-message"
  }, /*#__PURE__*/React.createElement("p", null, "No valid Metadata is in the Manifest/Canvas(es)")));
};
MetadataDisplay.propTypes = {
  displayOnlyCanvasMetadata: PropTypes.bool,
  displayAllMetadata: PropTypes.bool,
  displayTitle: PropTypes.bool,
  showHeading: PropTypes.bool,
  itemHeading: PropTypes.string,
  sectionHeaading: PropTypes.string
};

var SupplementalFiles = function SupplementalFiles(_ref) {
  var _ref$itemHeading = _ref.itemHeading,
    itemHeading = _ref$itemHeading === void 0 ? "Item files" : _ref$itemHeading,
    _ref$sectionHeading = _ref.sectionHeading,
    sectionHeading = _ref$sectionHeading === void 0 ? "Section files" : _ref$sectionHeading,
    _ref$showHeading = _ref.showHeading,
    showHeading = _ref$showHeading === void 0 ? true : _ref$showHeading;
  var _useManifestState = useManifestState(),
    manifest = _useManifestState.manifest;
  var _React$useState = React.useState(),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    manifestSupplementalFiles = _React$useState2[0],
    setManifestSupplementalFiles = _React$useState2[1];
  var _React$useState3 = React.useState(),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    canvasSupplementalFiles = _React$useState4[0],
    setCanvasSupplementalFiles = _React$useState4[1];
  var _React$useState5 = React.useState(false),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    hasSectionFiles = _React$useState6[0],
    setHasSectionFiles = _React$useState6[1];
  var _useErrorBoundary = useErrorBoundary(),
    showBoundary = _useErrorBoundary.showBoundary;
  React.useEffect(function () {
    if (manifest) {
      try {
        var renderings = getRenderingFiles(manifest);
        setManifestSupplementalFiles(renderings.manifest);
        var canvasFiles = renderings.canvas;
        setCanvasSupplementalFiles(canvasFiles);

        // Calculate number of total files for all the canvases
        var canvasFilesSize = canvasFiles.reduce(function (acc, f) {
          return acc + f.files.length;
        }, 0);
        setHasSectionFiles(canvasFilesSize > 0 ? true : false);
      } catch (error) {
        showBoundary(error);
      }
    }
  }, [manifest]);
  var hasFiles = function hasFiles() {
    if (hasSectionFiles || (manifestSupplementalFiles === null || manifestSupplementalFiles === void 0 ? void 0 : manifestSupplementalFiles.length) > 0) {
      return true;
    }
    return false;
  };
  var handleDownload = function handleDownload(event, file) {
    event.preventDefault();
    fileDownload(file.id, file.filename, file.fileExt, file.isMachineGen);
  };
  return /*#__PURE__*/React.createElement("div", {
    "data-testid": "supplemental-files",
    className: "ramp--supplemental-files"
  }, showHeading && /*#__PURE__*/React.createElement("div", {
    className: "ramp--supplemental-files-heading",
    "data-testid": "supplemental-files-heading"
  }, /*#__PURE__*/React.createElement("h4", null, "Files")), hasFiles() && /*#__PURE__*/React.createElement("div", {
    className: "ramp--supplemental-files-display-content",
    "data-testid": "supplemental-files-display-content"
  }, Array.isArray(manifestSupplementalFiles) && manifestSupplementalFiles.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h4", null, itemHeading), /*#__PURE__*/React.createElement("dl", {
    key: "item-files"
  }, manifestSupplementalFiles.map(function (file, index) {
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: index
    }, /*#__PURE__*/React.createElement("dd", {
      key: "item-file-".concat(index)
    }, /*#__PURE__*/React.createElement("a", {
      href: file.id,
      key: index,
      onClick: function onClick(e) {
        return handleDownload(e, file);
      }
    }, file.label)));
  }))), Array.isArray(canvasSupplementalFiles) && hasSectionFiles && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h4", null, sectionHeading), canvasSupplementalFiles.map(function (canvasFiles, idx) {
    var files = canvasFiles.files;
    return files.length > 0 && /*#__PURE__*/React.createElement("dl", {
      key: "section-".concat(idx, "-label")
    }, /*#__PURE__*/React.createElement("dt", {
      key: canvasFiles.label
    }, canvasFiles.label), files.map(function (file, index) {
      return /*#__PURE__*/React.createElement("dd", {
        key: "section-".concat(idx, "-file-").concat(index)
      }, /*#__PURE__*/React.createElement("a", {
        href: file.id,
        key: index,
        onClick: function onClick(e) {
          return handleDownload(e, file);
        }
      }, file.label));
    }));
  }))), !hasFiles() && /*#__PURE__*/React.createElement("div", {
    "data-testid": "supplemental-files-empty",
    className: "ramp--supplemental-files-empty"
  }, /*#__PURE__*/React.createElement("p", null, "No Supplemental file(s) in Manifest")));
};

var AutoAdvanceToggle = function AutoAdvanceToggle(_ref) {
  var _ref$label = _ref.label,
    label = _ref$label === void 0 ? "Autoplay" : _ref$label,
    _ref$showLabel = _ref.showLabel,
    showLabel = _ref$showLabel === void 0 ? true : _ref$showLabel;
  var _useManifestState = useManifestState(),
    autoAdvance = _useManifestState.autoAdvance;
  var manifestDispatch = useManifestDispatch();
  return /*#__PURE__*/React.createElement("div", {
    "data-testid": "auto-advance",
    className: "ramp--auto-advance"
  }, showLabel && /*#__PURE__*/React.createElement("span", {
    className: "ramp--auto-advance-label",
    "data-testid": "auto-advance-label",
    htmlFor: "auto-advance-toggle",
    id: "auto-advance-toggle-label"
  }, label), /*#__PURE__*/React.createElement("label", {
    className: "ramp--auto-advance-toggle",
    "aria-labelledby": "auto-advance-toggle-label"
  }, /*#__PURE__*/React.createElement("input", {
    "data-testid": "auto-advance-toggle",
    name: "auto-advance-toggle",
    type: "checkbox",
    checked: autoAdvance,
    "aria-label": label,
    onChange: function onChange(e) {
      return manifestDispatch({
        autoAdvance: e.target.checked,
        type: "setAutoAdvance"
      });
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "slider round"
  })));
};
AutoAdvanceToggle.propTypes = {
  label: PropTypes.string,
  showLabel: PropTypes.bool
};

var CreateMarker = function CreateMarker(_ref) {
  var newMarkerEndpoint = _ref.newMarkerEndpoint,
    canvasId = _ref.canvasId,
    handleCreate = _ref.handleCreate,
    getCurrentTime = _ref.getCurrentTime,
    csrfToken = _ref.csrfToken;
  var _React$useState = React.useState(false),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    isOpen = _React$useState2[0],
    setIsOpen = _React$useState2[1];
  var _React$useState3 = React.useState(false),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    isValid = _React$useState4[0],
    setIsValid = _React$useState4[1];
  var _React$useState5 = React.useState(false),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    saveError = _React$useState6[0],
    setSaveError = _React$useState6[1];
  var _React$useState7 = React.useState(''),
    _React$useState8 = _slicedToArray(_React$useState7, 2),
    errorMessage = _React$useState8[0],
    setErrorMessage = _React$useState8[1];
  var _React$useState9 = React.useState(),
    _React$useState10 = _slicedToArray(_React$useState9, 2),
    markerTime = _React$useState10[0],
    setMarkerTime = _React$useState10[1];
  var handleAddMarker = function handleAddMarker() {
    var currentTime = timeToHHmmss(getCurrentTime(), true, true);
    validateTime(currentTime);
    setIsOpen(true);
  };
  var handleCreateSubmit = function handleCreateSubmit(e) {
    e.preventDefault();
    var form = e.target;
    var formData = new FormData(form);
    var _Object$fromEntries = Object.fromEntries(formData.entries()),
      label = _Object$fromEntries.label,
      time = _Object$fromEntries.time;
    var annotation = {
      type: "Annotation",
      motivation: "highlighting",
      body: {
        type: "TextualBody",
        format: "text/html",
        value: label
      },
      target: "".concat(canvasId, "#t=").concat(timeToS(time))
    };
    var requestOptions = {
      method: 'POST',
      /** NOTE: In avalon try this option */
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json'
        // 'Avalon-Api-Key': '',
      },

      body: JSON.stringify(annotation)
    };
    if (csrfToken !== undefined) {
      requestOptions.headers['X-CSRF-Token'] = csrfToken;
    }
    fetch(newMarkerEndpoint, requestOptions).then(function (response) {
      if (response.status != 201) {
        throw new Error();
      } else {
        return response.json();
      }
    }).then(function (json) {
      var anno = createNewAnnotation(json);
      var newMarker = parseMarkerAnnotation(anno);
      if (newMarker) {
        handleCreate(newMarker);
      }
      setIsOpen(false);
    })["catch"](function (e) {
      console.error('CreateMarker -> handleCreateMarker() -> failed to create annotation; ', e);
      setSaveError(true);
      setErrorMessage('Marker creation failed.');
    });
  };
  var handleCreateCancel = function handleCreateCancel() {
    setIsOpen(false);
    setIsValid(false);
    setErrorMessage('');
    setSaveError(false);
  };
  var validateTime = function validateTime(value) {
    setMarkerTime(value);
    var isValid = validateTimeInput(value);
    setIsValid(isValid);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "ramp-markers-display__new-marker"
  }, /*#__PURE__*/React.createElement("button", {
    type: "submit",
    onClick: handleAddMarker,
    className: "ramp--markers-display__edit-button",
    "data-testid": "create-new-marker-button"
  }, "Add New Marker"), isOpen && /*#__PURE__*/React.createElement("form", {
    className: "ramp--markers-display__new-marker-form",
    method: "post",
    onSubmit: handleCreateSubmit,
    "data-testid": "create-new-marker-form"
  }, /*#__PURE__*/React.createElement("table", {
    className: "create-marker-form-table"
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "new-marker-title"
  }, "Title:"), /*#__PURE__*/React.createElement("input", {
    id: "new-marker-title",
    "data-testid": "create-marker-title",
    type: "text",
    className: "ramp--markers-display__create-marker",
    name: "label"
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "new-marker-time"
  }, "Time:"), /*#__PURE__*/React.createElement("input", {
    id: "new-marker-time",
    "data-testid": "create-marker-timestamp",
    type: "text",
    className: "ramp--markers-display__create-marker ".concat(isValid ? 'time-valid' : 'time-invalid'),
    name: "time",
    value: markerTime,
    onChange: function onChange(e) {
      return validateTime(e.target.value);
    }
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "marker-actions"
  }, saveError && /*#__PURE__*/React.createElement("p", {
    className: "ramp--markers-display__error-message"
  }, errorMessage), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "ramp--markers-display__edit-button",
    "data-testid": "edit-save-button",
    disabled: !isValid
  }, /*#__PURE__*/React.createElement(SaveIcon, null), " Save"), /*#__PURE__*/React.createElement("button", {
    className: "ramp--markers-display__edit-button-danger",
    "data-testid": "edit-cancel-button",
    onClick: handleCreateCancel
  }, /*#__PURE__*/React.createElement(CancelIcon, null), " Cancel"))))))));
};
CreateMarker.propTypes = {
  newMarkerEndpoint: PropTypes.string.isRequired,
  canvasId: PropTypes.string,
  handleCreate: PropTypes.func.isRequired,
  getCurrentTime: PropTypes.func.isRequired
};

var MarkerRow = function MarkerRow(_ref) {
  var marker = _ref.marker,
    handleSubmit = _ref.handleSubmit,
    handleMarkerClick = _ref.handleMarkerClick,
    handleDelete = _ref.handleDelete,
    hasAnnotationService = _ref.hasAnnotationService,
    isEditing = _ref.isEditing,
    toggleIsEditing = _ref.toggleIsEditing,
    csrfToken = _ref.csrfToken;
  var _React$useState = React.useState(false),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    editing = _React$useState2[0],
    setEditing = _React$useState2[1];
  var _React$useState3 = React.useState(true),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    isValid = _React$useState4[0],
    setIsValid = _React$useState4[1];
  var _React$useState5 = React.useState(),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    tempMarker = _React$useState6[0],
    setTempMarker = _React$useState6[1];
  var _React$useState7 = React.useState(false),
    _React$useState8 = _slicedToArray(_React$useState7, 2),
    deleting = _React$useState8[0],
    setDeleting = _React$useState8[1];
  var _React$useState9 = React.useState(false),
    _React$useState10 = _slicedToArray(_React$useState9, 2),
    saveError = _React$useState10[0],
    setSaveError = _React$useState10[1];
  var _React$useState11 = React.useState(''),
    _React$useState12 = _slicedToArray(_React$useState11, 2),
    errorMessage = _React$useState12[0],
    setErrorMessage = _React$useState12[1];

  // Remove all subscriptions on unmount
  React.useEffect(function () {
    return {};
  }, []);
  React.useEffect(function () {
    setMarkerLabel(marker.value);
    setMarkerTime(marker.timeStr);
  }, [marker]);
  var markerLabelRef = React.useRef(marker.value);
  var setMarkerLabel = function setMarkerLabel(label) {
    markerLabelRef.current = label;
  };
  var markerOffsetRef = React.useRef(timeToS(marker.timeStr));
  var markerTimeRef = React.useRef(marker.timeStr);
  var setMarkerTime = function setMarkerTime(time) {
    markerTimeRef.current = time;
    markerOffsetRef.current = timeToS(time);
  };
  var handleEdit = function handleEdit() {
    setTempMarker({
      time: markerTimeRef.current,
      label: markerLabelRef.current
    });
    setEditing(true);
    toggleIsEditing(true);
  };

  // Reset old information of the marker when edit action is cancelled
  var handleCancel = function handleCancel() {
    setMarkerTime(tempMarker.time);
    setMarkerLabel(tempMarker.label);
    setTempMarker({});
    resetError();
    cancelAction();
  };

  // Submit edited information of the current marker
  var handleEditSubmit = function handleEditSubmit() {
    var annotation = {
      type: "Annotation",
      motivation: "highlighting",
      body: {
        type: "TextualBody",
        format: "text/html",
        value: markerLabelRef.current
      },
      id: marker.id,
      target: "".concat(marker.canvasId, "#t=").concat(timeToS(markerTimeRef.current))
    };
    var requestOptions = {
      method: 'PUT',
      /** NOTE: In avalon try this option */
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json'
        // 'Avalon-Api-Key': '',
      },

      body: JSON.stringify(annotation)
    };
    if (csrfToken !== undefined) {
      requestOptions.headers['X-CSRF-Token'] = csrfToken;
    }
    fetch(marker.id, requestOptions).then(function (response) {
      if (response.status != 201) {
        throw new Error();
      } else {
        handleSubmit(markerLabelRef.current, markerTimeRef.current, marker.id);
        resetError();
        cancelAction();
      }
    })["catch"](function (e) {
      console.error('MarkerRow -> handleEditSubmit -> failed to update annotation; ', e);
      setSaveError(true);
      setErrorMessage('Marker update failed');
    });
  };

  // Validate timestamps when typing
  var validateTime = function validateTime(value) {
    var isValid = validateTimeInput(value);
    setIsValid(isValid);
    setMarkerTime(value);
  };

  // Toggle delete confirmation
  var toggleDelete = function toggleDelete() {
    setDeleting(true);
    toggleIsEditing(true);
  };

  // Submit delete action
  var submitDelete = function submitDelete() {
    var requestOptions = {
      method: 'DELETE',
      /** NOTE: In avalon try this option */
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json'
        // 'Avalon-Api-Key': '',
      }
    };

    if (csrfToken !== undefined) {
      requestOptions.headers['X-CSRF-Token'] = csrfToken;
    }
    // API call for DELETE
    fetch(marker.id, requestOptions).then(function (response) {
      if (response.status != 200) {
        throw new Error();
      } else {
        handleDelete(marker.id);
        resetError();
        cancelAction();
      }
    })["catch"](function (e) {
      console.error('MarkerRow -> submitDelete() -> failed to delete annotation; ', e);
      cancelAction();
      setSaveError(true);
      setErrorMessage('Marker delete failed.');
      setTimeout(function () {
        resetError();
      }, 1500);
    });
  };
  var resetError = function resetError() {
    setSaveError(false);
    setErrorMessage('');
  };

  // Reset edit state when edit/delete actions are finished
  var cancelAction = function cancelAction() {
    setDeleting(false);
    setEditing(false);
    toggleIsEditing(false);
  };
  if (editing) {
    return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
      id: "label",
      "data-testid": "edit-label",
      defaultValue: markerLabelRef.current,
      type: "text",
      className: "ramp--markers-display__edit-marker",
      onChange: function onChange(e) {
        return setMarkerLabel(e.target.value);
      },
      name: "label"
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
      className: "ramp--markers-display__edit-marker ".concat(isValid ? 'time-valid' : 'time-invalid'),
      id: "time",
      "data-testid": "edit-timestamp",
      defaultValue: markerTimeRef.current,
      type: "text",
      onChange: function onChange(e) {
        return validateTime(e.target.value);
      },
      name: "time"
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "marker-actions"
    }, saveError && /*#__PURE__*/React.createElement("p", {
      className: "ramp--markers-display__error-message"
    }, errorMessage), /*#__PURE__*/React.createElement("button", {
      type: "submit",
      onClick: handleEditSubmit,
      disabled: !isValid,
      className: "ramp--markers-display__edit-button",
      "data-testid": "edit-save-button"
    }, /*#__PURE__*/React.createElement(SaveIcon, null), " Save"), /*#__PURE__*/React.createElement("button", {
      className: "ramp--markers-display__edit-button-danger",
      "data-testid": "edit-cancel-button",
      onClick: handleCancel
    }, /*#__PURE__*/React.createElement(CancelIcon, null), " Cancel"))));
  } else if (deleting) {
    return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("a", {
      href: "".concat(marker.canvasId, "#t=").concat(markerOffsetRef.current, ","),
      onClick: function onClick(e) {
        return handleMarkerClick(e);
      },
      "data-offset": markerOffsetRef.current
    }, markerLabelRef.current)), /*#__PURE__*/React.createElement("td", null, markerTimeRef.current), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "marker-actions"
    }, /*#__PURE__*/React.createElement("p", null, "Are you sure?"), /*#__PURE__*/React.createElement("button", {
      type: "submit",
      className: "ramp--markers-display__edit-button-danger",
      "data-testid": "delete-confirm-button",
      onClick: submitDelete
    }, /*#__PURE__*/React.createElement(SaveIcon, null), " Yes"), /*#__PURE__*/React.createElement("button", {
      className: "ramp--markers-display__edit-button",
      "data-testid": "delete-cancel-button",
      onClick: cancelAction
    }, /*#__PURE__*/React.createElement(CancelIcon, null), " Cancel"))));
  } else {
    return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("a", {
      href: "".concat(marker.canvasId, "#t=").concat(markerOffsetRef.current, ","),
      onClick: function onClick(e) {
        return handleMarkerClick(e);
      },
      "data-offset": markerOffsetRef.current
    }, markerLabelRef.current)), /*#__PURE__*/React.createElement("td", null, markerTimeRef.current), hasAnnotationService && /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "marker-actions"
    }, saveError && /*#__PURE__*/React.createElement("p", {
      className: "ramp--markers-display__error-message"
    }, errorMessage), /*#__PURE__*/React.createElement("button", {
      onClick: handleEdit,
      className: "ramp--markers-display__edit-button",
      "data-testid": "edit-button",
      disabled: isEditing
    }, /*#__PURE__*/React.createElement(EditIcon, null), " Edit"), /*#__PURE__*/React.createElement("button", {
      className: "ramp--markers-display__edit-button-danger",
      "data-testid": "delete-button",
      disabled: isEditing,
      onClick: toggleDelete
    }, /*#__PURE__*/React.createElement(DeleteIcon, null), " Delete"))));
  }
};
MarkerRow.propTypes = {
  marker: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleMarkerClick: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  hasAnnotationService: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  toggleIsEditing: PropTypes.func.isRequired
};

var MarkersDisplay = function MarkersDisplay(_ref) {
  var _document$getElements;
  var _ref$showHeading = _ref.showHeading,
    showHeading = _ref$showHeading === void 0 ? true : _ref$showHeading,
    _ref$headingText = _ref.headingText,
    headingText = _ref$headingText === void 0 ? 'Markers' : _ref$headingText;
  var _useManifestState = useManifestState(),
    manifest = _useManifestState.manifest,
    canvasIndex = _useManifestState.canvasIndex,
    playlist = _useManifestState.playlist;
  var _usePlayerState = usePlayerState(),
    player = _usePlayerState.player;
  var manifestDispatch = useManifestDispatch();
  var isEditing = playlist.isEditing,
    hasAnnotationService = playlist.hasAnnotationService,
    annotationServiceId = playlist.annotationServiceId;
  var _React$useState = React.useState([]),
    _React$useState2 = _slicedToArray(_React$useState, 2);
    _React$useState2[0];
    var setCanvasPlaylistsMarkers = _React$useState2[1];
  var _useErrorBoundary = useErrorBoundary(),
    showBoundary = _useErrorBoundary.showBoundary;
  var canvasIdRef = React.useRef();
  var canvasPlaylistsMarkersRef = React.useRef([]);
  var setCanvasMarkers = function setCanvasMarkers(list) {
    setCanvasPlaylistsMarkers.apply(void 0, _toConsumableArray(list));
    canvasPlaylistsMarkersRef.current = list;
  };

  // Retrieves the CRSF authenticity token when component is embedded in a Rails app.
  var csrfToken = (_document$getElements = document.getElementsByName('csrf-token')[0]) === null || _document$getElements === void 0 ? void 0 : _document$getElements.content;
  React.useEffect(function () {
    if (manifest) {
      try {
        var playlistMarkers = parsePlaylistAnnotations(manifest);
        manifestDispatch({
          markers: playlistMarkers,
          type: 'setPlaylistMarkers'
        });
        var canvases = canvasesInManifest(manifest);
        if (canvases != undefined && (canvases === null || canvases === void 0 ? void 0 : canvases.length) > 0) {
          canvasIdRef.current = canvases[canvasIndex].canvasId;
        }
      } catch (error) {
        showBoundary(error);
      }
    }
  }, [manifest]);
  React.useEffect(function () {
    var _playlist$markers;
    if (((_playlist$markers = playlist.markers) === null || _playlist$markers === void 0 ? void 0 : _playlist$markers.length) > 0) {
      var canvasMarkers = playlist.markers.filter(function (m) {
        return m.canvasIndex === canvasIndex;
      })[0].canvasMarkers;
      setCanvasMarkers(canvasMarkers);
    }
    if (manifest) {
      try {
        var canvases = canvasesInManifest(manifest);
        if (canvases != undefined && (canvases === null || canvases === void 0 ? void 0 : canvases.length) > 0) {
          canvasIdRef.current = canvases[canvasIndex].canvasId;
        }
      } catch (error) {
        showBoundary(error);
      }
    }
  }, [canvasIndex, playlist.markers]);
  var handleSubmit = function handleSubmit(label, time, id) {
    // Re-construct markers list for displaying in the player UI
    var editedMarkers = canvasPlaylistsMarkersRef.current.map(function (m) {
      if (m.id === id) {
        m.value = label;
        m.timeStr = time;
        m.time = timeToS(time);
      }
      return m;
    });
    setCanvasMarkers(editedMarkers);
    manifestDispatch({
      updatedMarkers: editedMarkers,
      type: 'setPlaylistMarkers'
    });
  };
  var handleDelete = function handleDelete(id) {
    var remainingMarkers = canvasPlaylistsMarkersRef.current.filter(function (m) {
      return m.id != id;
    });
    // Update markers in state for displaying in the player UI
    setCanvasMarkers(remainingMarkers);
    manifestDispatch({
      updatedMarkers: remainingMarkers,
      type: 'setPlaylistMarkers'
    });
  };
  var handleMarkerClick = function handleMarkerClick(e) {
    e.preventDefault();
    var currentTime = parseFloat(e.target.dataset['offset']);
    player.currentTime(currentTime);
  };
  var handleCreate = function handleCreate(newMarker) {
    setCanvasMarkers([].concat(_toConsumableArray(canvasPlaylistsMarkersRef.current), [newMarker]));
    manifestDispatch({
      updatedMarkers: canvasPlaylistsMarkersRef.current,
      type: 'setPlaylistMarkers'
    });
  };
  var toggleIsEditing = function toggleIsEditing(flag) {
    manifestDispatch({
      isEditing: flag,
      type: 'setIsEditing'
    });
  };

  /** Get the current time of the playhead */
  var getCurrentTime = function getCurrentTime() {
    if (player) {
      return player.currentTime();
    } else {
      return 0;
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "ramp--markers-display",
    "data-testid": "markers-display"
  }, showHeading && /*#__PURE__*/React.createElement("div", {
    className: "ramp--markers-display__title",
    "data-testid": "markers-display-title"
  }, /*#__PURE__*/React.createElement("h4", null, headingText)), hasAnnotationService && /*#__PURE__*/React.createElement(CreateMarker, {
    newMarkerEndpoint: annotationServiceId,
    canvasId: canvasIdRef.current,
    handleCreate: handleCreate,
    getCurrentTime: getCurrentTime,
    csrfToken: csrfToken
  }), canvasPlaylistsMarkersRef.current.length > 0 && /*#__PURE__*/React.createElement("table", {
    className: "ramp--markers-display_table",
    "data-testid": "markers-display-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Time"), hasAnnotationService && /*#__PURE__*/React.createElement("th", null, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, canvasPlaylistsMarkersRef.current.map(function (marker, index) {
    return /*#__PURE__*/React.createElement(MarkerRow, {
      key: index,
      marker: marker,
      handleSubmit: handleSubmit,
      handleMarkerClick: handleMarkerClick,
      handleDelete: handleDelete,
      hasAnnotationService: hasAnnotationService,
      isEditing: isEditing,
      toggleIsEditing: toggleIsEditing,
      csrfToken: csrfToken
    });
  }))));
};
MarkersDisplay.propTypes = {
  showHeading: PropTypes.bool,
  headingText: PropTypes.string
};

var Play = "Play";
var Pause = "Pause";
var Replay = "Replay";
var Duration = "Duration";
var LIVE = "LIVE";
var Loaded = "Loaded";
var Progress = "Progress";
var Fullscreen = "Fullscreen";
var Mute = "Mute";
var Unmute = "Unmute";
var Subtitles = "Subtitles";
var Captions = "Captions";
var Chapters = "Chapters";
var Descriptions = "Descriptions";
var Close = "Close";
var Text = "Text";
var White = "White";
var Black = "Black";
var Red = "Red";
var Green = "Green";
var Blue = "Blue";
var Yellow = "Yellow";
var Magenta = "Magenta";
var Cyan = "Cyan";
var Background = "Background";
var Window = "Window";
var Transparent = "Transparent";
var Opaque = "Opaque";
var None = "None";
var Raised = "Raised";
var Depressed = "Depressed";
var Uniform = "Uniform";
var Casual = "Casual";
var Script = "Script";
var Reset = "Reset";
var Done = "Done";
var Color = "Color";
var Opacity = "Opacity";
var en = {
	"Audio Player": "Audio Player",
	"Video Player": "Video Player",
	Play: Play,
	Pause: Pause,
	Replay: Replay,
	"Current Time": "Current Time",
	Duration: Duration,
	"Remaining Time": "Remaining Time",
	"Stream Type": "Stream Type",
	LIVE: LIVE,
	"Seek to live, currently behind live": "Seek to live, currently behind live",
	"Seek to live, currently playing live": "Seek to live, currently playing live",
	Loaded: Loaded,
	Progress: Progress,
	"Progress Bar": "Progress Bar",
	"progress bar timing: currentTime={1} duration={2}": "{1} of {2}",
	Fullscreen: Fullscreen,
	"Exit Fullscreen": "Exit Fullscreen",
	Mute: Mute,
	Unmute: Unmute,
	"Playback Rate": "Playback Rate",
	Subtitles: Subtitles,
	"subtitles off": "subtitles off",
	Captions: Captions,
	"captions off": "captions off",
	Chapters: Chapters,
	Descriptions: Descriptions,
	"descriptions off": "descriptions off",
	"Audio Track": "Audio Track",
	"Volume Level": "Volume Level",
	"You aborted the media playback": "You aborted the media playback",
	"A network error caused the media download to fail part-way.": "A network error caused the media download to fail part-way.",
	"The media could not be loaded, either because the server or network failed or because the format is not supported.": "The media could not be loaded, either because the server or network failed or because the format is not supported.",
	"The media playback was aborted due to a corruption problem or because the media used features your browser did not support.": "The media playback was aborted due to a corruption problem or because the media used features your browser did not support.",
	"No compatible source was found for this media.": "No compatible source was found for this media.",
	"The media is encrypted and we do not have the keys to decrypt it.": "The media is encrypted and we do not have the keys to decrypt it.",
	"Play Video": "Play Video",
	Close: Close,
	"Close Modal Dialog": "Close Modal Dialog",
	"Modal Window": "Modal Window",
	"This is a modal window": "This is a modal window",
	"This modal can be closed by pressing the Escape key or activating the close button.": "This modal can be closed by pressing the Escape key or activating the close button.",
	", opens captions settings dialog": ", opens captions settings dialog",
	", opens subtitles settings dialog": ", opens subtitles settings dialog",
	", opens descriptions settings dialog": ", opens descriptions settings dialog",
	", selected": ", selected",
	"captions settings": "captions settings",
	"subtitles settings": "subtitles settings",
	"descriptions settings": "descriptions settings",
	Text: Text,
	White: White,
	Black: Black,
	Red: Red,
	Green: Green,
	Blue: Blue,
	Yellow: Yellow,
	Magenta: Magenta,
	Cyan: Cyan,
	Background: Background,
	Window: Window,
	Transparent: Transparent,
	"Semi-Transparent": "Semi-Transparent",
	Opaque: Opaque,
	"Font Size": "Font Size",
	"Text Edge Style": "Text Edge Style",
	None: None,
	Raised: Raised,
	Depressed: Depressed,
	Uniform: Uniform,
	"Drop shadow": "Drop shadow",
	"Font Family": "Font Family",
	"Proportional Sans-Serif": "Proportional Sans-Serif",
	"Monospace Sans-Serif": "Monospace Sans-Serif",
	"Proportional Serif": "Proportional Serif",
	"Monospace Serif": "Monospace Serif",
	Casual: Casual,
	Script: Script,
	"Small Caps": "Small Caps",
	Reset: Reset,
	"restore all settings to the default values": "restore all settings to the default values",
	Done: Done,
	"Caption Settings Dialog": "Caption Settings Dialog",
	"Beginning of dialog window. Escape will cancel and close the window.": "Beginning of dialog window. Escape will cancel and close the window.",
	"End of dialog window.": "End of dialog window.",
	"{1} is loading.": "{1} is loading.",
	"Exit Picture-in-Picture": "Exit Picture-in-Picture",
	"Picture-in-Picture": "Picture-in-Picture",
	"No content": "No content",
	Color: Color,
	Opacity: Opacity,
	"Text Background": "Text Background",
	"Caption Area Background": "Caption Area Background",
	"Playing in Picture-in-Picture": "Playing in Picture-in-Picture",
	"Skip backward {1} seconds": "Skip backward {1} seconds",
	"Skip forward {1} seconds": "Skip forward {1} seconds"
};

var en$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	Play: Play,
	Pause: Pause,
	Replay: Replay,
	Duration: Duration,
	LIVE: LIVE,
	Loaded: Loaded,
	Progress: Progress,
	Fullscreen: Fullscreen,
	Mute: Mute,
	Unmute: Unmute,
	Subtitles: Subtitles,
	Captions: Captions,
	Chapters: Chapters,
	Descriptions: Descriptions,
	Close: Close,
	Text: Text,
	White: White,
	Black: Black,
	Red: Red,
	Green: Green,
	Blue: Blue,
	Yellow: Yellow,
	Magenta: Magenta,
	Cyan: Cyan,
	Background: Background,
	Window: Window,
	Transparent: Transparent,
	Opaque: Opaque,
	None: None,
	Raised: Raised,
	Depressed: Depressed,
	Uniform: Uniform,
	Casual: Casual,
	Script: Script,
	Reset: Reset,
	Done: Done,
	Color: Color,
	Opacity: Opacity,
	'default': en
});

export { AutoAdvanceToggle, IIIFPlayer, MarkersDisplay, MediaPlayer, MetadataDisplay, StructuredNavigation, SupplementalFiles, Transcript };
