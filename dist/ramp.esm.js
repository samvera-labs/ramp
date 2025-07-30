import React, { useReducer, useContext, createContext, useState, useEffect, useMemo, useRef, useCallback, createRef, Fragment, memo } from 'react';
import { PropertyValue, parseManifest, Annotation } from 'manifesto.js';
import mimeDb from 'mime-db';
import sanitizeHtml from 'sanitize-html';
import mammoth from 'mammoth';
import { useErrorBoundary, ErrorBoundary } from 'react-error-boundary';
import cx from 'classnames';
import videojs from 'video.js';

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
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
module.exports = _arrayWithHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var iterableToArrayLimit = createCommonjsModule(function (module) {
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
module.exports = _iterableToArrayLimit, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var arrayLikeToArray = createCommonjsModule(function (module) {
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var unsupportedIterableToArray = createCommonjsModule(function (module) {
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? arrayLikeToArray(r, a) : void 0;
  }
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
function _slicedToArray(r, e) {
  return arrayWithHoles(r) || iterableToArrayLimit(r, e) || unsupportedIterableToArray(r, e) || nonIterableRest();
}
module.exports = _slicedToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _slicedToArray = /*@__PURE__*/getDefaultExportFromCjs(slicedToArray);

var arrayWithoutHoles = createCommonjsModule(function (module) {
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return arrayLikeToArray(r);
}
module.exports = _arrayWithoutHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var iterableToArray = createCommonjsModule(function (module) {
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
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
function _toConsumableArray(r) {
  return arrayWithoutHoles(r) || iterableToArray(r) || unsupportedIterableToArray(r) || nonIterableSpread();
}
module.exports = _toConsumableArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _toConsumableArray = /*@__PURE__*/getDefaultExportFromCjs(toConsumableArray);

var _typeof_1 = createCommonjsModule(function (module) {
function _typeof(o) {
  "@babel/helpers - typeof";

  return module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports, _typeof(o);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _typeof = /*@__PURE__*/getDefaultExportFromCjs(_typeof_1);

var toPrimitive_1 = createCommonjsModule(function (module) {
var _typeof = _typeof_1["default"];
function toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
module.exports = toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var toPropertyKey_1 = createCommonjsModule(function (module) {
var _typeof = _typeof_1["default"];

function toPropertyKey(t) {
  var i = toPrimitive_1(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
module.exports = toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var defineProperty = createCommonjsModule(function (module) {
function _defineProperty(e, r, t) {
  return (r = toPropertyKey_1(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _defineProperty = /*@__PURE__*/getDefaultExportFromCjs(defineProperty);

var asyncToGenerator = createCommonjsModule(function (module) {
function asyncGeneratorStep(n, t, e, r, o, a, c) {
  try {
    var i = n[a](c),
      u = i.value;
  } catch (n) {
    return void e(n);
  }
  i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
  return function () {
    var t = this,
      e = arguments;
    return new Promise(function (r, o) {
      var a = n.apply(t, e);
      function _next(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
      }
      function _throw(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
      }
      _next(void 0);
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
    return e;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  var t,
    e = {},
    r = Object.prototype,
    n = r.hasOwnProperty,
    o = Object.defineProperty || function (t, e, r) {
      t[e] = r.value;
    },
    i = "function" == typeof Symbol ? Symbol : {},
    a = i.iterator || "@@iterator",
    c = i.asyncIterator || "@@asyncIterator",
    u = i.toStringTag || "@@toStringTag";
  function define(t, e, r) {
    return Object.defineProperty(t, e, {
      value: r,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), t[e];
  }
  try {
    define({}, "");
  } catch (t) {
    define = function define(t, e, r) {
      return t[e] = r;
    };
  }
  function wrap(t, e, r, n) {
    var i = e && e.prototype instanceof Generator ? e : Generator,
      a = Object.create(i.prototype),
      c = new Context(n || []);
    return o(a, "_invoke", {
      value: makeInvokeMethod(t, r, c)
    }), a;
  }
  function tryCatch(t, e, r) {
    try {
      return {
        type: "normal",
        arg: t.call(e, r)
      };
    } catch (t) {
      return {
        type: "throw",
        arg: t
      };
    }
  }
  e.wrap = wrap;
  var h = "suspendedStart",
    l = "suspendedYield",
    f = "executing",
    s = "completed",
    y = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var p = {};
  define(p, a, function () {
    return this;
  });
  var d = Object.getPrototypeOf,
    v = d && d(d(values([])));
  v && v !== r && n.call(v, a) && (p = v);
  var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
  function defineIteratorMethods(t) {
    ["next", "throw", "return"].forEach(function (e) {
      define(t, e, function (t) {
        return this._invoke(e, t);
      });
    });
  }
  function AsyncIterator(t, e) {
    function invoke(r, o, i, a) {
      var c = tryCatch(t[r], t, o);
      if ("throw" !== c.type) {
        var u = c.arg,
          h = u.value;
        return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
          invoke("next", t, i, a);
        }, function (t) {
          invoke("throw", t, i, a);
        }) : e.resolve(h).then(function (t) {
          u.value = t, i(u);
        }, function (t) {
          return invoke("throw", t, i, a);
        });
      }
      a(c.arg);
    }
    var r;
    o(this, "_invoke", {
      value: function value(t, n) {
        function callInvokeWithMethodAndArg() {
          return new e(function (e, r) {
            invoke(t, n, e, r);
          });
        }
        return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(e, r, n) {
    var o = h;
    return function (i, a) {
      if (o === f) throw Error("Generator is already running");
      if (o === s) {
        if ("throw" === i) throw a;
        return {
          value: t,
          done: !0
        };
      }
      for (n.method = i, n.arg = a;;) {
        var c = n.delegate;
        if (c) {
          var u = maybeInvokeDelegate(c, n);
          if (u) {
            if (u === y) continue;
            return u;
          }
        }
        if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
          if (o === h) throw o = s, n.arg;
          n.dispatchException(n.arg);
        } else "return" === n.method && n.abrupt("return", n.arg);
        o = f;
        var p = tryCatch(e, r, n);
        if ("normal" === p.type) {
          if (o = n.done ? s : l, p.arg === y) continue;
          return {
            value: p.arg,
            done: n.done
          };
        }
        "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
      }
    };
  }
  function maybeInvokeDelegate(e, r) {
    var n = r.method,
      o = e.iterator[n];
    if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
    var i = tryCatch(o, e.iterator, r.arg);
    if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
    var a = i.arg;
    return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
  }
  function pushTryEntry(t) {
    var e = {
      tryLoc: t[0]
    };
    1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
  }
  function resetTryEntry(t) {
    var e = t.completion || {};
    e.type = "normal", delete e.arg, t.completion = e;
  }
  function Context(t) {
    this.tryEntries = [{
      tryLoc: "root"
    }], t.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(e) {
    if (e || "" === e) {
      var r = e[a];
      if (r) return r.call(e);
      if ("function" == typeof e.next) return e;
      if (!isNaN(e.length)) {
        var o = -1,
          i = function next() {
            for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
            return next.value = t, next.done = !0, next;
          };
        return i.next = i;
      }
    }
    throw new TypeError(_typeof(e) + " is not iterable");
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), o(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
    var e = "function" == typeof t && t.constructor;
    return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
  }, e.mark = function (t) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
  }, e.awrap = function (t) {
    return {
      __await: t
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
    return this;
  }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
    void 0 === i && (i = Promise);
    var a = new AsyncIterator(wrap(t, r, n, o), i);
    return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
      return t.done ? t.value : a.next();
    });
  }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
    return this;
  }), define(g, "toString", function () {
    return "[object Generator]";
  }), e.keys = function (t) {
    var e = Object(t),
      r = [];
    for (var n in e) r.push(n);
    return r.reverse(), function next() {
      for (; r.length;) {
        var t = r.pop();
        if (t in e) return next.value = t, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, e.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(e) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
    },
    stop: function stop() {
      this.done = !0;
      var t = this.tryEntries[0].completion;
      if ("throw" === t.type) throw t.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(e) {
      if (this.done) throw e;
      var r = this;
      function handle(n, o) {
        return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
      }
      for (var o = this.tryEntries.length - 1; o >= 0; --o) {
        var i = this.tryEntries[o],
          a = i.completion;
        if ("root" === i.tryLoc) return handle("end");
        if (i.tryLoc <= this.prev) {
          var c = n.call(i, "catchLoc"),
            u = n.call(i, "finallyLoc");
          if (c && u) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          } else if (c) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
          } else {
            if (!u) throw Error("try statement without catch or finally");
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(t, e) {
      for (var r = this.tryEntries.length - 1; r >= 0; --r) {
        var o = this.tryEntries[r];
        if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
          var i = o;
          break;
        }
      }
      i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
      var a = i ? i.completion : {};
      return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
    },
    complete: function complete(t, e) {
      if ("throw" === t.type) throw t.arg;
      return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
    },
    finish: function finish(t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
      }
    },
    "catch": function _catch(t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.tryLoc === t) {
          var n = r.completion;
          if ("throw" === n.type) {
            var o = n.arg;
            resetTryEntry(r);
          }
          return o;
        }
      }
      throw Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(e, r, n) {
      return this.delegate = {
        iterator: values(e),
        resultName: r,
        nextLoc: n
      }, "next" === this.method && (this.arg = t), y;
    }
  }, e;
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

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$6;

  return value === proto;
}

var _isPrototype = isPrototype;

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var _overArg = overArg;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = _overArg(Object.keys, Object);

var _nativeKeys = nativeKeys;

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!_isPrototype(object)) {
    return _nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$4.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

var _baseKeys = baseKeys;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

var _root = root;

/** Built-in value references. */
var Symbol$1 = _root.Symbol;

var _Symbol = Symbol$1;

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$4.toString;

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
  var isOwn = hasOwnProperty$3.call(value, symToStringTag$1),
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
var objectProto$3 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto$3.toString;

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

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag$1 = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject_1(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = _baseGetTag(value);
  return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
}

var isFunction_1 = isFunction;

/** Used to detect overreaching core-js shims. */
var coreJsData = _root['__core-js_shared__'];

var _coreJsData = coreJsData;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

var _isMasked = isMasked;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString$1.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

var _toSource = toSource;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto$2 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty$2).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject_1(value) || _isMasked(value)) {
    return false;
  }
  var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(_toSource(value));
}

var _baseIsNative = baseIsNative;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue$1(object, key) {
  return object == null ? undefined : object[key];
}

var _getValue = getValue$1;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = _getValue(object, key);
  return _baseIsNative(value) ? value : undefined;
}

var _getNative = getNative;

/* Built-in method references that are verified to be native. */
var DataView = _getNative(_root, 'DataView');

var _DataView = DataView;

/* Built-in method references that are verified to be native. */
var Map = _getNative(_root, 'Map');

var _Map = Map;

/* Built-in method references that are verified to be native. */
var Promise$1 = _getNative(_root, 'Promise');

var _Promise = Promise$1;

/* Built-in method references that are verified to be native. */
var Set = _getNative(_root, 'Set');

var _Set = Set;

/* Built-in method references that are verified to be native. */
var WeakMap = _getNative(_root, 'WeakMap');

var _WeakMap = WeakMap;

/** `Object#toString` result references. */
var mapTag$2 = '[object Map]',
    objectTag$1 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$2 = '[object Set]',
    weakMapTag$1 = '[object WeakMap]';

var dataViewTag$1 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = _toSource(_DataView),
    mapCtorString = _toSource(_Map),
    promiseCtorString = _toSource(_Promise),
    setCtorString = _toSource(_Set),
    weakMapCtorString = _toSource(_WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = _baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$1) ||
    (_Map && getTag(new _Map) != mapTag$2) ||
    (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
    (_Set && getTag(new _Set) != setTag$2) ||
    (_WeakMap && getTag(new _WeakMap) != weakMapTag$1)) {
  getTag = function(value) {
    var result = _baseGetTag(value),
        Ctor = result == objectTag$1 ? value.constructor : undefined,
        ctorString = Ctor ? _toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$1;
        case mapCtorString: return mapTag$2;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$2;
        case weakMapCtorString: return weakMapTag$1;
      }
    }
    return result;
  };
}

var _getTag = getTag;

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
var argsTag$1 = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike_1(value) && _baseGetTag(value) == argsTag$1;
}

var _baseIsArguments = baseIsArguments;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$1.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
  return isObjectLike_1(value) && hasOwnProperty$1.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

var isArguments_1 = isArguments;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

var isArray_1 = isArray;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

var isLength_1 = isLength;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength_1(value.length) && !isFunction_1(value);
}

var isArrayLike_1 = isArrayLike;

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

var stubFalse_1 = stubFalse;

var isBuffer_1 = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse_1;

module.exports = isBuffer;
});

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag$1 = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag$1 = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag$1] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag$1] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike_1(value) &&
    isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
}

var _baseIsTypedArray = baseIsTypedArray;

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

var _baseUnary = baseUnary;

var _nodeUtil = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && _freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;
});

/* Node.js helper references. */
var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

var isTypedArray_1 = isTypedArray;

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    setTag = '[object Set]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if `value` is an empty object, collection, map, or set.
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike_1(value) &&
      (isArray_1(value) || typeof value == 'string' || typeof value.splice == 'function' ||
        isBuffer_1(value) || isTypedArray_1(value) || isArguments_1(value))) {
    return !value.length;
  }
  var tag = _getTag(value);
  if (tag == mapTag || tag == setTag) {
    return !value.size;
  }
  if (_isPrototype(value)) {
    return !_baseKeys(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
}

var isEmpty_1 = isEmpty;

function _createForOfIteratorHelper$6(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$6(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$6(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$6(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$6(o, minLen); }
function _arrayLikeToArray$6(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys$b(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$b(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$b(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$b(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var S_ANNOTATION_TYPE = {
  transcript: 1,
  caption: 2,
  both: 3
};
// Number of decimal places for milliseconds used in time calculations. 
// This is used to ensure there are no mis-calculations around times that has a long decimal for milliseconds.
var MILLISECOND_PRECISION = 1000;

// ENum for player status resulted in each hotkey action
var HOTKEY_ACTION_OUTPUT = {
  pause: 'paused',
  play: 'playing',
  enterFullscreen: 'isFullscreen',
  exitFullscreen: 'notFullscreen',
  upArrow: 'volumeUp',
  downArrow: 'volumeDown',
  mute: 'muted',
  unmute: 'unmuted',
  leftArrow: 'jumpBackward',
  rightArrow: 'jumpForward'
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
 * @function Utils#setCanvasMessageTimeout
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
 * @function Utils#setAppErrorMessage
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
 * @function Utils#setAppEmptyManifestMessage
 * @param {String} message custom error message from props
 */
function setAppEmptyManifestMessage(message) {
  GENERIC_EMPTY_MANIFEST_MESSAGE = message || DEFAULT_EMPTY_MANIFEST_MESSAGE;
}

/**
 * Convert the time in seconds to hh:mm:ss.ms format.
 * Ex: timeToHHmmss(2.836, showHrs=true, showMs=true) => 00:00:02.836
 * timeToHHmmss(362.836, showHrs=true, showMs=true) => 01:00:02.836
 * timeToHHmmss(362.836, showHrs=true) => 01:00:02
 * @function Utils#timeToHHmmss
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
 * Convert a given time in seconds to a string read as a human, these
 * are used in structure navigation to convey timestamps associated with
 * media-fragments in a more presentable way for assistive technology tools.
 * @function Utils#screenReaderFriendlyTime
 * @param {Number} time time in seconds
 * @returns {String} time string read as a human
 */
function screenReaderFriendlyTime(time) {
  var hhmmssTime = timeToHHmmss(time, true, true);
  var pluralize = function pluralize(n, singular) {
    return n === 1 ? "".concat(n, " ").concat(singular) : "".concat(n, " ").concat(singular, "s");
  };
  if (hhmmssTime != '') {
    var _hhmmssTime$split$map = hhmmssTime.split(':').map(function (t) {
        return parseFloat(t);
      }),
      _hhmmssTime$split$map2 = _slicedToArray(_hhmmssTime$split$map, 3),
      hours = _hhmmssTime$split$map2[0],
      minutes = _hhmmssTime$split$map2[1],
      seconds = _hhmmssTime$split$map2[2];
    var screenReaderTime = hours > 0 ? "".concat(pluralize(hours, 'hour'), " ") : '';
    screenReaderTime += hours > 0 || minutes > 0 ? "".concat(pluralize(minutes, 'minute'), " ") : '';
    screenReaderTime += pluralize(parseInt(seconds), 'second');
    return screenReaderTime;
  } else {
    return '';
  }
}

/**
 * Convert a given text with HTML tags to a string read as a human
 * @param {String} html text with HTML tags
 * @returns {String} text without HTML tags
 */
function screenReaderFriendlyText(html) {
  var tempElement = document.createElement('div');
  tempElement.innerHTML = html;
  return tempElement.textContent || tempElement.innerText || "";
}

/**
 * Convert time from hh:mm:ss.ms/mm:ss.ms string format to int
 * @function Utils#timeToS
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
  // Ensure the time is always a number with a set MILLISECOND_PRECISION
  secondsNum = roundToPrecision(secondsNum);
  var timeSeconds = hoursInS + minutesInS + secondsNum;
  return timeSeconds;
}

/**
 * Set error message when an error is encountered in a fetch request
 * @function Utils#handleFetchErrors
 * @param {Object} response response from fetch request
 * @returns {Object}
 */
function handleFetchErrors(response) {
  if (response.status == 404) {
    throw new Error('Cannot find the linked resource.');
  } else if (!response.ok) {
    throw new Error(GENERIC_ERROR_MESSAGE);
  }
  return response;
}

/**
 * Identify a segment is within the given playable range. 
 * If BOTH start and end times of the segment is outside of the given range => false
 * @function Utils#checkSrcRange
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
 * @function Utils#getCanvasTarget
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
 * @function Utils#fileDownload
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
  if (fileUrl.endsWith(extension)) {
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
 * @function Utils#getMediaFragment
 * @param {string} uri - Uri value
 * @param {number} duration - duration of the current canvas
 * @return {Object} - Representing the media fragment ie. { start: 3287.0, end: 3590.0 }, or undefined
 */
function getMediaFragment(uri) {
  var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  if (uri !== undefined) {
    var fragment = uri.split('#t=')[1];
    return parseTimeStrings(fragment, duration);
  } else {
    return undefined;
  }
}

/**
 * Parse comma seperated media-fragment
 * @function Utils#parseTimeStrings
 * @param {String} fragment media fragment
 * @param {Number} duration Canvas duration
 * @returns {Object} {start: Number, end: Number }
 */
function parseTimeStrings(fragment) {
  var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
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
      start: start.match(timestampRegex) ? timeToS(start) : roundToPrecision(Number(start)),
      end: end.match(timestampRegex) ? timeToS(end) : roundToPrecision(Number(end))
    };
  } else {
    return undefined;
  }
}

/**
 * Extract list of resources from given annotation with a given motivation
 * @function Utils#getAnnotations
 * @param {Object/Array} annotation
 * @param {String} motivation
 * @returns {Array} array of AnnotationPage
 */
function getAnnotations(annotation) {
  var motivation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var content = [];
  if (!annotation) return content;
  if (annotation.type === 'Canvas') {
    content = annotation.items[0].items;
  } else if (Array.isArray(annotation) && (annotation === null || annotation === void 0 ? void 0 : annotation.length) > 0) {
    content = annotation[0].items;
  }
  // Filter the annotations if a motivation is given
  if (content && motivation != '') {
    var relevantAnnotations = content.filter(function (a) {
      return a.motivation === motivation;
    });
    content = relevantAnnotations;
  }
  return content;
}

/**
 * Parse a list of annotations or a single annotation to extract information related to
 * a given Canvas. Assumes the annotation type as either 'painting' or 'supplementing'.
 * @function Utils#parseResourceAnnotations
 * @param {Array} annotation list of painting/supplementing annotations to be parsed
 * @param {Number} duration duration of the current canvas
 * @param {String} motivation motivation type
 * @param {Number} start custom start time from props or Manifest's start property
 * @param {Boolean} isPlaylist
 * @returns {Object} { resources, canvasTargets, isMultiSource, poster, error }
 */
function parseResourceAnnotations(annotation, duration, motivation) {
  var start = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var isPlaylist = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var resources = [],
    canvasTargets = [],
    isMultiSource = false,
    poster = '',
    error = 'No resources found in Canvas';
  var parseAnnotation = function parseAnnotation(annotationItems) {
    var _annotationItems;
    /**
     * Convert annotation items to an array, because 'body' property 
     * can sometimes contain an array instead of an object.
     * Ex: Aviary annotations: https://weareavp.aviaryplatform.com/iiif/hm52f7jz70/manifest
     */
    annotationItems = ((_annotationItems = annotationItems) === null || _annotationItems === void 0 ? void 0 : _annotationItems.length) > 0 ? annotationItems : [annotationItems];
    annotationItems.map(function (a) {
      var source = getResourceInfo(a, start, duration, motivation);
      // Check if the parsed sources has a resource URL
      source && source.src && resources.push(source);
    });
  };
  if (annotation && annotation != undefined) {
    var _items$0$body$items, _items$, _items$0$body, _items$2;
    var items = getAnnotations(annotation);
    if (!items) {
      return {
        resources: resources,
        canvasTargets: canvasTargets,
        error: error
      };
    }
    if (items.length === 0) {
      return {
        resources: resources,
        canvasTargets: canvasTargets,
        isMultiSource: isMultiSource,
        poster: getPlaceholderCanvas(annotation)
      };
    }
    // When multiple resources/annotations are in a single Canvas
    else if ((items === null || items === void 0 ? void 0 : items.length) > 1) {
      items.map(function (p, index) {
        if (p.motivation === motivation) {
          parseAnnotation(p.body);
          if (motivation === 'painting') {
            isMultiSource = true;
            var target = parseCanvasTarget(p, duration, index);
            canvasTargets.push(target);
          }
        }
      });
    }
    // When multiple qualities/sources are given for the resource in the Canvas => choice
    else if (((_items$0$body$items = items[0].body.items) === null || _items$0$body$items === void 0 ? void 0 : _items$0$body$items.length) > 0 && ((_items$ = items[0]) === null || _items$ === void 0 ? void 0 : _items$.motivation) === motivation) {
      items[0].body.items.map(function (p) {
        parseAnnotation(p);
      });
    }
    // When a singe source is given for the resource in the Canvas
    else if (!isEmpty_1(items[0].body) && ((_items$0$body = items[0].body) === null || _items$0$body === void 0 ? void 0 : _items$0$body.id) != '' && ((_items$2 = items[0]) === null || _items$2 === void 0 ? void 0 : _items$2.motivation) === motivation) {
      parseAnnotation(items[0].body);
    } else if (motivation === 'painting') {
      return {
        resources: resources,
        error: error,
        poster: getPlaceholderCanvas(annotation),
        canvasTargets: canvasTargets
      };
    }

    // Set canvasTargets for non-multisource Canvases to use when building progressbar
    if (!isMultiSource && (resources === null || resources === void 0 ? void 0 : resources.length) > 0 && motivation === 'painting') {
      var target = getMediaFragment(resources[0].src, duration);
      if (target === undefined) {
        target = {
          start: 0,
          end: duration
        };
      }
      target.altStart = target.start;
      target.duration = duration;
      /*
       * This is necessary to ensure expected progress bar behavior when
       * there is a start defined at the manifest level
       */
      if (!isPlaylist) {
        target = _objectSpread$b(_objectSpread$b({}, target), {}, {
          customStart: target.start,
          start: 0,
          altStart: 0
        });
      }
      canvasTargets.push(target);
    }

    // Read image placeholder
    poster = getPlaceholderCanvas(annotation, true);
    return {
      canvasTargets: canvasTargets,
      isMultiSource: isMultiSource,
      resources: resources,
      poster: poster
    };
  } else {
    return {
      canvasTargets: canvasTargets,
      isMultiSource: isMultiSource,
      resources: resources,
      poster: poster,
      error: error
    };
  }
}

/**
 * Parse source/track information related to given resource
 * in a Canvas
 * @param {Object} item AnnotationBody object from Canvas
 * @param {Number} start custom start either from user props/Manifest start prop
 * @param {Number} duration duration of the media file
 * @param {String} motivation Annotation motivation
 * @returns parsed source/track information
 */
function getResourceInfo(item, start, duration, motivation) {
  var source = null;
  var aType = S_ANNOTATION_TYPE.both;
  // If there are multiple labels, assume the first one
  // is the one intended for default display
  var label = getLabelValue(item.label);
  if (motivation === 'supplementing') {
    aType = identifySupplementingAnnotation(item.id);
  }
  if (aType != S_ANNOTATION_TYPE.transcript) {
    source = {
      src: start > 0 ? "".concat(item.id, "#t=").concat(start, ",").concat(duration) : item.id,
      key: item.id,
      type: item.format,
      kind: item.type,
      label: label || 'auto'
    };
    if (motivation === 'supplementing') {
      var _item$language;
      // Set language for captions/subtitles
      source.srclang = (_item$language = item.language) !== null && _item$language !== void 0 ? _item$language : 'en';
      // Specify kind to subtitles for VTT annotations. Without this VideoJS
      // resolves the kind to metadata for subtitles file, resulting in empty
      // subtitles lists in iOS devices' native palyers
      source.kind = item.format.toLowerCase().includes('text/vtt') ? 'subtitles' : 'metadata';
    }
  }
  return source;
}
function parseCanvasTarget(annotation, duration, i) {
  var target = getMediaFragment(annotation.target, duration);
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
 * Identify a string contains "machine-generated" text in different
 * variations using a regular expression
 * @function Utils#identifyMachineGen
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
 * @function Utils#identifySupplementingAnnotation
 * @param {String} uri id from supplementing annotation
 * @returns {Number} a value from S_ANNOTATION_TYPE ENum
 */
function identifySupplementingAnnotation(uri) {
  if (!uri) {
    return;
  }
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
 * @function Utils#getLabelValue
 * @param {Object} label
 * @param {Boolean} readAll read all values in the selected language
 */
function getLabelValue(label) {
  var readAll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (label && _typeof(label) === 'object') {
    var labelKeys = Object.keys(label);
    if (labelKeys && labelKeys.length > 0) {
      var _label$firstKey$;
      // FIXME: select application language when implementing i18n
      // Get the first key's first value
      var firstKey = labelKeys[0];
      var value = readAll ? label[firstKey].join('\n') : (_label$firstKey$ = label[firstKey][0]) !== null && _label$firstKey$ !== void 0 ? _label$firstKey$ : '';
      return lib.decode(value);
    }
  } else if (typeof label === 'string') {
    return lib.decode(label);
  }
  return '';
}

/**
 * Validate time input from user against the hh:mm:ss.ms format
 * @function Utils#validateTimeInput
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
 * @function Utils#autoScroll
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
  if (currentItem) {
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
}

/**
 * Bind default hotkeys for VideoJS player
 * @function Utils#playerHotKeys
 * @param {Object} event keydown event
 * @param {String} id player instance ID in VideoJS
 * @param {Boolean} canvasIsEmpty flag to indicate empty Canvas
 * @returns {String} result of the triggered hotkey action
 */
function playerHotKeys(event, player) {
  var _activeElement$classL2, _activeElement$classL3, _activeElement$classL4, _activeElement$classL5, _activeElement$classL6, _activeElement$classL7;
  var canvasIsEmpty = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var playerInst = player === null || player === void 0 ? void 0 : player.player();
  var output = '';
  var inputs = ['input', 'textarea', 'select'];
  var activeElement = document.activeElement;
  // Check if the active element is within the player
  var focusedWithinPlayer = activeElement.className.includes('vjs') || activeElement.className.includes('videojs');
  var pressedKey = event.which;

  // Check if ctrl/cmd/alt/shift keys are pressed when using key combinations
  var isCombKeyPress = event.ctrlKey || event.metaKey || event.altKey || event.shiftKey;

  // CSS classes of active buttons to skip
  var buttonClassesToCheck = ['ramp--transcript_time', 'ramp--structured-nav__section-title', 'ramp--structured-nav__item-link', 'ramp--structured-nav__collapse-all-btn', 'ramp--annotations__multi-select-header', 'ramp--annotations__show-more-tags', 'ramp--annotations__show-more-less', 'ramp--annotations__annotation-row-time-tags'];

  // Determine the focused element and pressed key combination needs to be skipped
  var skipActionWithButtonFocus = (activeElement === null || activeElement === void 0 ? void 0 : activeElement.role) === 'button' && (buttonClassesToCheck.some(function (c) {
    var _activeElement$classL;
    return activeElement === null || activeElement === void 0 ? void 0 : (_activeElement$classL = activeElement.classList) === null || _activeElement$classL === void 0 ? void 0 : _activeElement$classL.contains(c);
  }) && (pressedKey === 38 || pressedKey === 40 || pressedKey === 32 || pressedKey === 13)
  // Skip hot-keys when focused on transcript item/structure item/annotation row for ArrowUp/ArrowDown/Space/Enter keys
  || ((activeElement === null || activeElement === void 0 ? void 0 : (_activeElement$classL2 = activeElement.classList) === null || _activeElement$classL2 === void 0 ? void 0 : _activeElement$classL2.contains('ramp--structured-nav__section-title')) || (activeElement === null || activeElement === void 0 ? void 0 : (_activeElement$classL3 = activeElement.classList) === null || _activeElement$classL3 === void 0 ? void 0 : _activeElement$classL3.contains('ramp--structured-nav__collapse-all-btn'))) && (pressedKey === 37 || pressedKey === 39)
  // Skip hot-keys when focused on a section or close/expand button for ArrowLeft/ArrowRight keys 
  ) || (activeElement === null || activeElement === void 0 ? void 0 : activeElement.role) === 'button' && (activeElement === null || activeElement === void 0 ? void 0 : (_activeElement$classL4 = activeElement.classList) === null || _activeElement$classL4 === void 0 ? void 0 : _activeElement$classL4.contains('ramp--annotations__multi-select-header')) || (activeElement === null || activeElement === void 0 ? void 0 : activeElement.role) === 'option' && (activeElement === null || activeElement === void 0 ? void 0 : (_activeElement$classL5 = activeElement.classList) === null || _activeElement$classL5 === void 0 ? void 0 : _activeElement$classL5.contains('annotations-dropdown-item'))
  // Skip hot-keys when focused on annotation set dropdown/item, since it allows printable characters for keyboard navigation
  ;

  /*
    Avoid player hotkey activation when;
    - keyboard focus in on some element on the page
      - AND it is an input, textarea field, or a select element on the page
          - OR a tab element AND the key pressed is left/right arrow keys as
            this specific combination is avoided to allow keyboard navigation between 
            tabbed UI components
          - OR a switch element AND the key pressed is enter/space as this combination is avoided
            to allow keyboard activation of a switch (toggle)
          - OR a transcript cue element or a clickable structure item
      - AND is not focused within the player, to avoid activation of player toolbar buttons
    - OR key combinations are not in use with a key associated with hotkeys
    - OR current Canvas is empty
  */
  if (activeElement && (inputs.indexOf(activeElement.tagName.toLowerCase()) !== -1 || activeElement.role === 'tab' && (pressedKey === 37 || pressedKey === 39) || activeElement.role === 'switch' && (pressedKey === 13 || pressedKey === 32) || activeElement !== null && activeElement !== void 0 && (_activeElement$classL6 = activeElement.classList) !== null && _activeElement$classL6 !== void 0 && _activeElement$classL6.contains('transcript_content') && (pressedKey === 38 || pressedKey === 40) || activeElement !== null && activeElement !== void 0 && (_activeElement$classL7 = activeElement.classList) !== null && _activeElement$classL7 !== void 0 && _activeElement$classL7.contains('ramp--transcript_item') && (pressedKey === 38 || pressedKey === 40) || skipActionWithButtonFocus) && !focusedWithinPlayer || isCombKeyPress || canvasIsEmpty) {
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
          output = HOTKEY_ACTION_OUTPUT.play;
          playerInst.play();
        } else {
          output = HOTKEY_ACTION_OUTPUT.pause;
          playerInst.pause();
        }
        break;
      // f toggles fullscreen
      case 70:
        event.preventDefault();
        // Fullscreen should only be available for videos
        if (!playerInst.audioOnlyMode()) {
          if (!playerInst.isFullscreen()) {
            output = HOTKEY_ACTION_OUTPUT.enterFullscreen;
            playerInst.requestFullscreen();
          } else {
            output = HOTKEY_ACTION_OUTPUT.exitFullscreen;
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
          output = HOTKEY_ACTION_OUTPUT.unmute;
          playerInst.muted(false);
        } else {
          output = HOTKEY_ACTION_OUTPUT.mute;
          playerInst.muted(playerInst.muted() ? false : true);
        }
        break;
      // Left arrow seeks 5 seconds back
      case 37:
        event.preventDefault();
        output = HOTKEY_ACTION_OUTPUT.leftArrow;
        playerInst.currentTime(playerInst.currentTime() - 5);
        break;
      // Right arrow seeks 5 seconds ahead
      case 39:
        event.preventDefault();
        output = HOTKEY_ACTION_OUTPUT.rightArrow;
        playerInst.currentTime(playerInst.currentTime() + 5);
        break;
      // Up arrow raises volume by 0.1
      case 38:
        event.preventDefault();
        if (playerInst.muted()) {
          playerInst.muted(false);
        }
        output = HOTKEY_ACTION_OUTPUT.upArrow;
        playerInst.volume(playerInst.volume() + 0.1);
        break;
      // Down arrow lowers volume by 0.1
      case 40:
        event.preventDefault();
        output = HOTKEY_ACTION_OUTPUT.downArrow;
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
    return output;
  }
}

/**
 * Group a JSON object array by a given property
 * @function Utils#groupBy
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

/**
 * Round time to a given precision value
 * @param {Number} time time in seconds to be rounded
 * @param {Number} precision precision to round to, default is 1000 (milli-seconds)
 * @returns {Number} rounded time
 */
var roundToPrecision = function roundToPrecision(time) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : MILLISECOND_PRECISION;
  if (typeof time !== 'number' || isNaN(time)) {
    return time;
  }
  return Math.round(time * precision) / precision;
};

/**
 * Sort an array of annotations by start time
 * @param {Array} annotations a list of annotations
 * @returns {Array}
 */
var sortAnnotations = function sortAnnotations(annotations) {
  return annotations.sort(function (a, b) {
    var _a$time, _b$time;
    return ((_a$time = a.time) === null || _a$time === void 0 ? void 0 : _a$time.start) - ((_b$time = b.time) === null || _b$time === void 0 ? void 0 : _b$time.start);
  });
};

/**
 * Truncates text that may contain HTML to a given maximum character length
 * while preserving the HTML structure
 * 
 * @param {String} htmlString string to truncate which might contain HTML markup
 * @param {Number} maxLength allowed max character length
 * @returns {Object} { truncated: String, isTruncated: Boolean }
 */
var truncateText = function truncateText(htmlString, maxLength) {
  var ellipsis = '...';
  if (htmlString.length <= maxLength) {
    return {
      truncated: htmlString,
      isTruncated: false
    };
  }

  // Create a temporary div to work with the HTML
  var tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;
  var textLength = getTextLength(tempDiv);

  // Add length of ellipsis (3) towards maxLength when truncating
  if (textLength <= maxLength + ellipsis.length) {
    // If the text content within HTML is shorter than maxLength return the original
    return {
      truncated: htmlString,
      isTruncated: false
    };
  } else {
    // Truncate text only nodes
    if (maxLength > 0) {
      truncateNode(tempDiv, maxLength);
    }
    // Add ellipsis to the last text node
    var lastTextNode = findLastTextNode(tempDiv);
    if (lastTextNode) {
      lastTextNode.textContent += ellipsis;
    }
    return {
      truncated: tempDiv.innerHTML,
      isTruncated: true
    };
  }
};

/**
 * Get the length of text within the given string that might contain HTML
 * @param {Node} node node with text content
 * @returns {Number} length of text content
 */
var getTextLength = function getTextLength(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent.length;
  }
  var length = 0;
  var _iterator = _createForOfIteratorHelper$6(node.childNodes),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var childNode = _step.value;
      length += getTextLength(childNode);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return length;
};

/**
 * Truncate text content avoiding the HTML tags
 * @param {Node} node node to truncate
 * @param {Number} maxLength 
 * @returns {Number} number of used characters by the current node
 */
var truncateNode = function truncateNode(node, maxLength) {
  // Truncate text nodes
  if (node.nodeType === Node.TEXT_NODE) {
    if (node.textContent.trim() === '') return 0;
    if (node.textContent.length <= maxLength) {
      return node.textContent.length;
    } else {
      // Get the index of the last space character in the truncated text with maxLength
      var lastSpaceIndex = node.textContent.substring(0, maxLength).lastIndexOf(' ');
      // If text doesn't have spaces, truncated at maxLength (this is probably an edge case?)
      // FIXME:: Maybe there's a better way to handle this than breaking the word?
      var truncateIndex = lastSpaceIndex === -1 ? maxLength : lastSpaceIndex;
      // Truncate the word at calculated truncateIndex
      node.textContent = node.textContent.substring(0, truncateIndex);
      // Count maxLength towards the used character count, since text cannot be truncated
      // anymore without truncating mid-word
      return maxLength;
    }
  }
  var currentRemaining = maxLength;
  var childNodes = Array.from(node.childNodes);

  // Iterate through child nodes and truncate them
  for (var i = 0; i < childNodes.length; i++) {
    var usedChars = truncateNode(childNodes[i], currentRemaining);
    currentRemaining -= usedChars;

    // Remove remaining nodes when when reached/exceeded maxLength
    if (currentRemaining <= 0) {
      for (var j = childNodes.length - 1; j > i; j--) {
        if (childNodes[j].parentNode) {
          childNodes[j].parentNode.removeChild(childNodes[j]);
        }
      }
      break;
    }
  }
  return maxLength - currentRemaining;
};

/**
 * Find the last text node in a DOM tree
 * @param {Node} node root node to search within
 * @return {Node} last text node in the tree
 */
var findLastTextNode = function findLastTextNode(node) {
  if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
    return node;
  }
  for (var i = node.childNodes.length - 1; i >= 0; i--) {
    var lastNode = findLastTextNode(node.childNodes[i]);
    if (lastNode) {
      return lastNode;
    }
  }
  return null;
};

function _createForOfIteratorHelper$5(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$5(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$5(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$5(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$5(o, minLen); }
function _arrayLikeToArray$5(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys$a(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$a(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$a(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$a(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

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

// Do not build structures for the following 'Range' behaviors:
// Reference: https://iiif.io/api/presentation/3.0/#behavior
var NO_DISPLAY_STRUCTURE_BEHAVIORS = ['no-nav', 'thumbnail-nav'];

/**
 * Get all the canvases in manifest with related information
 * @function IIIFParser#canvasesInManifest
 * @return {Array} array of canvas IDs in manifest
 **/
function canvasesInManifest(manifest) {
  var canvasesInfo = [];
  try {
    if (!(manifest !== null && manifest !== void 0 && manifest.items)) {
      console.error('iiif-parser -> canvasesInManifest() -> no canvases were found in Manifest');
      throw new Error(GENERIC_ERROR_MESSAGE);
    } else {
      var canvases = manifest.items;
      canvases.map(function (canvas, index) {
        var summary = undefined;
        if (canvas.summary && canvas.summary != undefined) {
          summary = PropertyValue.parse(canvas.summary).getValue();
        }
        var homepage = undefined;
        if (canvas.homepage && canvas.homepage.length > 0) {
          homepage = canvas.homepage[0].id;
        }
        try {
          var _canvas$items$;
          var isEmpty = true;
          var canvasItems = (_canvas$items$ = canvas.items[0]) === null || _canvas$items$ === void 0 ? void 0 : _canvas$items$.items;
          var source = '';
          if ((canvasItems === null || canvasItems === void 0 ? void 0 : canvasItems.length) > 0) {
            var _body$items, _Object$keys;
            var body = canvasItems[0].body;
            if (((_body$items = body.items) === null || _body$items === void 0 ? void 0 : _body$items.length) > 0) {
              source = body.items[0].id;
            } else if (((_Object$keys = Object.keys(body)) === null || _Object$keys === void 0 ? void 0 : _Object$keys.length) != 0 && body.id) {
              source = body.id;
            }
          }
          var canvasDuration = Number(canvas.duration);
          var timeFragment;
          if (source != '') {
            timeFragment = getMediaFragment(source, canvasDuration);
            isEmpty = false;
          }
          var canvasLabel = getLabelValue(canvas.label) || "Section ".concat(index + 1);
          canvasesInfo.push({
            canvasIndex: index,
            canvasId: canvas.id,
            canvasURL: canvas.id.split('#t=')[0],
            duration: canvasDuration,
            range: timeFragment === undefined ? {
              start: 0,
              end: canvasDuration
            } : timeFragment,
            isEmpty: isEmpty,
            summary: summary,
            homepage: homepage || '',
            label: canvasLabel,
            searchService: getSearchService(canvas)
          });
        } catch (error) {
          canvasesInfo.push({
            canvasIndex: index,
            canvasId: canvas.id,
            canvasURL: canvas.id.split('#t=')[0],
            duration: canvas.duration || 0,
            range: undefined,
            // set range to undefined, use this check to set duration in UI
            isEmpty: true,
            summary: summary,
            homepage: homepage || '',
            label: getLabelValue(canvas.label) || "Section ".concat(index + 1),
            searchService: getSearchService(canvas)
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
 * Get sources and media type for a given canvas
 * If there are no items, an error is returned (user facing error)
 * @function IIIFParser#getMediaInfo
 * @param {Object} obj
 * @param {Object} obj.manifest IIIF Manifest
 * @param {Number} obj.canvasIndex Index of the current canvas in manifest
 * @param {Number} obj.startTime Custom start time if exists, defaulted to 0
 * @param {Number} obj.srcIndex Index of the resource in active canvas
 * @param {Boolean} obj.isPlaylist 
 * @returns {Object} { sources, tracks, targets, isMultiSource, error, mediaType }
 */
function getMediaInfo(_ref) {
  var manifest = _ref.manifest,
    canvasIndex = _ref.canvasIndex,
    startTime = _ref.startTime,
    _ref$srcIndex = _ref.srcIndex,
    srcIndex = _ref$srcIndex === void 0 ? 0 : _ref$srcIndex,
    _ref$isPlaylist = _ref.isPlaylist,
    isPlaylist = _ref$isPlaylist === void 0 ? false : _ref$isPlaylist;
  var canvas = null;
  var sources,
    tracks = [];
  var info = {
    sources: [],
    tracks: [],
    canvasTargets: []
  };

  // return empty object when canvasIndex is undefined
  if (canvasIndex === undefined || canvasIndex < 0) {
    return _objectSpread$a(_objectSpread$a({}, info), {}, {
      error: 'Error fetching content'
    });
  }

  // return an error when the given Manifest doesn't have any Canvas(es)
  var canvases = manifest.items;
  if ((canvases === null || canvases === void 0 ? void 0 : canvases.length) == 0) {
    return _objectSpread$a(_objectSpread$a({}, info), {}, {
      poster: GENERIC_EMPTY_MANIFEST_MESSAGE
    });
  }

  // Get the canvas with the given canvasIndex
  try {
    canvas = canvases[canvasIndex];
    var annotations = canvas.annotations;
    if (canvas === undefined) {
      console.error('iiif-parser -> getMediaInfo() -> canvas undefined  -> ', canvasIndex);
      throw new Error(GENERIC_ERROR_MESSAGE);
    }
    var duration = Number(canvas.duration);

    // Read painting resources from annotations
    var _parseResourceAnnotat = parseResourceAnnotations(canvas, duration, 'painting', startTime, isPlaylist),
      resources = _parseResourceAnnotat.resources,
      canvasTargets = _parseResourceAnnotat.canvasTargets,
      isMultiSource = _parseResourceAnnotat.isMultiSource,
      error = _parseResourceAnnotat.error,
      poster = _parseResourceAnnotat.poster;

    // Set default src to auto
    sources = setDefaultSrc(resources, isMultiSource, srcIndex);

    // Read supplementing resources fom annotations
    var supplementingRes = parseResourceAnnotations(annotations, duration, 'supplementing');
    tracks = supplementingRes ? supplementingRes.resources : [];
    var mediaInfo = {
      sources: sources,
      tracks: tracks,
      canvasTargets: canvasTargets,
      isMultiSource: isMultiSource,
      error: error,
      poster: poster
    };
    if (mediaInfo.error) {
      return _objectSpread$a({}, mediaInfo);
    } else {
      // Get media type
      var allTypes = mediaInfo.sources.map(function (q) {
        return q.kind;
      });
      var mediaType = setMediaType(allTypes);
      return _objectSpread$a(_objectSpread$a({}, mediaInfo), {}, {
        error: null,
        mediaType: mediaType
      });
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Mark the default src file when multiple src files are present
 * @function IIIFParser#setDefaultSrc
 * @param {Array} sources source file information in canvas
 * @returns {Array} source information with one src marked as default
 */
function setDefaultSrc(sources, isMultiSource, srcIndex) {
  var isSelected = false;
  if (sources.length === 0) {
    return [];
  }
  // Mark source with quality label 'auto' as selected source
  if (!isMultiSource) {
    var _iterator = _createForOfIteratorHelper$5(sources),
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
 * Get the canvas ID from the URI by stripping away the timefragment
 * information
 * @function IIIFParser#getCanvasId
 * @param {String} uri URI of the item clicked in structure
 * @return {String}
 */
function getCanvasId(uri) {
  if (uri) {
    return uri.split('#t=')[0];
  }
}

/**
 * Get placeholderCanvas value for images and text messages
 * @function IIIFParser#getPlaceholderCanvas
 * @param {Object} annotation
 * @param {Boolean} isPoster
 * @return {String} 
 */
function getPlaceholderCanvas(annotation) {
  var isPoster = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var placeholder;
  try {
    var placeholderCanvas = annotation.placeholderCanvas;
    if (placeholderCanvas && placeholderCanvas != undefined) {
      var items = placeholderCanvas.items[0].items;
      if ((items === null || items === void 0 ? void 0 : items.length) > 0 && items[0].body != undefined && items[0].motivation === 'painting') {
        var body = items[0].body;
        if (isPoster) {
          placeholder = body.id;
        } else {
          placeholder = getLabelValue(body.label) || 'This item cannot be played.';
          setCanvasMessageTimeout(placeholderCanvas.duration);
        }
        return placeholder;
      }
    } else if (!isPoster) {
      console.error('iiif-parser -> getPlaceholderCanvas() -> placeholderCanvas property not defined');
      return 'This item cannot be played.';
    } else {
      return null;
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
 * @function IIIFParser#getCustomStart
 * @param {Object} manifest
 * @param {String} startCanvasId from IIIFPlayer props
 * @param {Number} startCanvasTime from IIIFPlayer props
 * @returns {Object}
 */
function getCustomStart(manifest, startCanvasId, startCanvasTime) {
  var manifestStartProp = manifest.start;
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
    startProp = manifestStartProp;
  }
  var canvases = canvasesInManifest(manifest);
  // Map given information in start property or user props to
  // Canvas information in the given Manifest
  var getCanvasInfo = function getCanvasInfo(canvasId, type, time) {
    var startTime = time;
    var currentIndex = 0;
    if (canvases && (canvases === null || canvases === void 0 ? void 0 : canvases.length) > 0) {
      if (canvasId) {
        currentIndex = canvases.findIndex(function (c) {
          return c.canvasId === canvasId;
        });
        if (currentIndex === undefined || currentIndex < 0) {
          console.warn('Given Canvas was not found in Manifest, ', startCanvasId);
          startTime = 0;
          currentIndex = 0;
        } else {
          var currentCanvas = canvases[currentIndex];
          if (currentCanvas.range != undefined && type === 'SpecificResource') {
            var _currentCanvas$range = currentCanvas.range,
              start = _currentCanvas$range.start,
              end = _currentCanvas$range.end;
            if (!(time >= start && time <= end)) {
              console.warn('Given start time is not within Canvas duration, ', startCanvasTime);
              startTime = 0;
            }
          }
        }
      }
    } else {
      console.warn('No Canvases in given Manifest');
      startTime = 0;
    }
    return {
      currentIndex: currentIndex,
      startTime: startTime
    };
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

/**
 * Build a JSON object with file information parsed from Manifest
 * @param {String} format file format
 * @param {Object} labelInput language map from Manifest for file label
 * @param {String} id 
 * @returns {Object} { id, label, filename, fileExt, isMachineGen }
 */
function buildFileInfo(format, labelInput, id) {
  /**
   * Convert 'text/srt' => 'application/x-subrip' for mime-db lookup for
   * valid extension, as mime-db doesn't support 'text/srt'
   */
  format = format === 'text/srt' ? 'application/x-subrip' : format;
  var mime = mimeDb[format];
  var extension = mime ? mime.extensions[0] : format;
  var label = getLabelValue(labelInput) || 'Untitled';
  var filename = label;
  if (Object.keys(labelInput).length > 1) {
    label = labelInput[Object.keys(labelInput)[0]][0];
    filename = labelInput['none'][0];
  }
  var _identifyMachineGen = identifyMachineGen(label),
    isMachineGen = _identifyMachineGen.isMachineGen;
    _identifyMachineGen._;
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
 * @function IIIFParser#getRenderingFiles
 * @param {Object} manifest
 * @returns {Object} List of files under `rendering` property in manifest and canvases
 */
function getRenderingFiles(manifest) {
  var manifestFiles = [];
  var canvasFiles = [];
  var manifestRendering = manifest.rendering;
  var canvases = manifest.items;
  if (manifestRendering) {
    manifestRendering.map(function (r) {
      var file = buildFileInfo(r.format, r.label, r.id);
      manifestFiles.push(file);
    });
  }
  if (canvases) {
    canvases.map(function (canvas, index) {
      var canvasRendering = canvas.rendering;
      var files = [];
      if (canvasRendering) {
        canvasRendering.map(function (r) {
          var file = buildFileInfo(r.format, r.label, r.id);
          files.push(file);
        });
      }
      // Use label of canvas or fallback to canvas id
      canvasFiles.push({
        label: getLabelValue(canvas.label) || "Section ".concat(index + 1),
        files: files
      });
    });
  }
  return {
    manifest: manifestFiles,
    canvas: canvasFiles
  };
}

/**
 * Read metadata from both Manifest and Canvas levels as needed
 * @function IIIFParser#getMetadata
 * @param {Object} manifest
 * @param {Boolean} readCanvasMetadata read metadata from Canvas level
 * @return {Array} list of key value pairs for each metadata item in the manifest
 */
function getMetadata(manifest, readCanvasMetadata) {
  var canvasMetadata = [];
  var allMetadata = {
    canvasMetadata: canvasMetadata,
    manifestMetadata: [],
    rights: []
  };

  // Parse Canvas-level metadata blocks for each Canvas
  var canvases = manifest.items;
  if (readCanvasMetadata && canvases) {
    for (var i in canvases) {
      var canvasindex = parseInt(i);
      var _rightsMetadata = parseRightsAndReqStatement(canvases[canvasindex], 'Canvas');
      canvasMetadata.push({
        canvasindex: canvasindex,
        metadata: parseMetadata(canvases[canvasindex].metadata, 'Canvas'),
        rights: _rightsMetadata
      });
    }
    allMetadata.canvasMetadata = canvasMetadata;
  }
  // Parse Manifest-level metadata block
  var manifestMetadata = manifest.metadata;
  var parsedManifestMetadata = parseMetadata(manifestMetadata, 'Manifest');
  allMetadata.manifestMetadata = parsedManifestMetadata;
  var rightsMetadata = parseRightsAndReqStatement(manifest, 'Manifest');
  allMetadata.rights = rightsMetadata;
  return allMetadata;
}

/**
 * Parse metadata in the Manifest/Canvas into an array of key value pairs
 * @function IIIFParser#parseMetadata
 * @param {Array} metadata list of metadata in Manifest
 * @param {String} resourceType resource type which the metadata belongs to
 * @returns {Array} an array with key value pairs for the metadata 
 */
function parseMetadata(metadata, resourceType) {
  var parsedMetadata = [];
  if (metadata && (metadata === null || metadata === void 0 ? void 0 : metadata.length) > 0) {
    metadata.map(function (md) {
      var _getLabelValue;
      // get value and replace \n characters with <br/> to display new lines in UI
      var value = (_getLabelValue = getLabelValue(md.value, true)) === null || _getLabelValue === void 0 ? void 0 : _getLabelValue.replace(/\n/g, "<br />");
      var sanitizedValue = sanitizeHtml(value, _objectSpread$a({}, HTML_SANITIZE_CONFIG));
      parsedMetadata.push({
        label: getLabelValue(md.label),
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
 * @function IIIFParser#parseRightsAndReqStatement
 * @param {Object} resource Canvas or Manifest JSON-ld
 * @param {String} resourceType resource type (Manifest/Canvas) for metadata
 * @returns {Array<JSON Object>}
 */
function parseRightsAndReqStatement(resource, resourceType) {
  var otherMetadata = [];
  var requiredStatement = resource.requiredStatement;
  if (requiredStatement) {
    otherMetadata = parseMetadata([requiredStatement], resourceType);
  }
  var rights = resource.rights;
  if (rights) {
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
 * @function IIIFParser#parseAutoAdvance
 * @param {Array} behavior behavior array from Manifest
 * @return {Boolean}
 */
function parseAutoAdvance(behavior) {
  return !behavior ? false : behavior === null || behavior === void 0 ? void 0 : behavior.includes("auto-advance");
}

/**
 * Parse 'structures' into an array of nested JSON objects with
 * required information for structured navigation UI rendering
 * @param {Object} manifest
 * @param {Array} canvasesInfo info relevant to each Canvas in the Manifest
 * @param {Boolean} isPlaylist
 * @returns {Object}
 *  obj.structures: a nested json object structure derived from
 *    'structures' property in the given Manifest
 *  obj.timespans: timespan items linking to Canvas
 *  obj.markRoot: display root Range in the UI
 *  obj.hasCollapsibleStructure: has timespans/children in at least one Canvas
 */
function getStructureRanges(manifest, canvasesInfo) {
  var isPlaylist = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var timespans = [];
  var manifestDuration = 0;
  var hasRoot = false;
  var cIndex = 0;
  var hasCollapsibleStructure = false;
  // Initialize the subIndex for tracking indices for timespans in structure
  var subIndex = 0;
  var parseItem = function parseItem(range, rootNode) {
    var behavior = range.getBehavior();
    if (!NO_DISPLAY_STRUCTURE_BEHAVIORS.includes(behavior)) {
      var _range$getRanges, _range$getRanges2;
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
      var id = undefined;
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

      // Consider collapsible structure only for ranges non-equivalent to root-level items
      if (((_range$getRanges = range.getRanges()) === null || _range$getRanges === void 0 ? void 0 : _range$getRanges.length) > 0 && !isRoot && isCanvas) hasCollapsibleStructure = true;
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
        // Mark all timespans as clickable, and provide desired behavior in TreeNode component
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

      // Increment index for children timespans within a Canvas
      if (!isCanvas && canvases.length > 0) subIndex++;

      // Set 'id' in the form of a mediafragment
      if (canvases.length > 0) {
        if (isCanvas) {
          id = "".concat(canvases[0].split(',')[0], ",");
        } else {
          id = canvases[0];
        }
      }

      // Parse start and end times from media-fragment URI
      // For Canvas-level timespans returns { start: 0, end: 0 }: to avoid full time-rail highligting
      var times = id ? getMediaFragment(id, canvasDuration) : {
        start: 0,
        end: 0
      };
      var item = _defineProperty({
        label: label,
        summary: summary,
        isRoot: isRoot,
        homepage: homepage,
        canvasDuration: canvasDuration,
        id: id,
        times: times,
        isTitle: canvases.length === 0 ? true : false,
        rangeId: range.id,
        isEmpty: isEmpty,
        isCanvas: isCanvas,
        itemIndex: isCanvas ? cIndex : subIndex,
        canvasIndex: cIndex,
        items: ((_range$getRanges2 = range.getRanges()) === null || _range$getRanges2 === void 0 ? void 0 : _range$getRanges2.length) > 0 ? range.getRanges().map(function (r) {
          return parseItem(r, rootNode);
        }) : [],
        duration: timeToHHmmss(duration),
        isClickable: isClickable
      }, "homepage", homepage);
      // Collect timespans in a separate array
      if (canvases.length > 0) {
        timespans.push(item);
      }
      return item;
    }
  };
  try {
    var allRanges = parseManifest(manifest).getAllRanges();
    if ((allRanges === null || allRanges === void 0 ? void 0 : allRanges.length) === 0) {
      return {
        structures: [],
        timespans: [],
        markRoot: false,
        hasCollapsibleStructure: hasCollapsibleStructure
      };
    } else {
      var rootNode = allRanges[0];
      var structures = [];
      var rootBehavior = rootNode.getBehavior();
      if (rootBehavior && NO_DISPLAY_STRUCTURE_BEHAVIORS.includes(rootBehavior)) {
        return {
          structures: [],
          timespans: [],
          hasCollapsibleStructure: hasCollapsibleStructure
        };
      } else {
        if (isPlaylist || rootBehavior === 'top') {
          var canvasRanges = rootNode.getRanges();
          if ((canvasRanges === null || canvasRanges === void 0 ? void 0 : canvasRanges.length) > 0) {
            canvasRanges.map(function (range, index) {
              var behavior = range.getBehavior();
              if (!NO_DISPLAY_STRUCTURE_BEHAVIORS.includes(behavior)) {
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
          structures.push(parseItem(rootNode, rootNode, cIndex));
        }
      }
      // Mark root Range for a single-canvased Manifest
      var markRoot = hasRoot && (canvasesInfo === null || canvasesInfo === void 0 ? void 0 : canvasesInfo.length) > 1;
      return {
        structures: structures,
        timespans: timespans,
        markRoot: markRoot,
        hasCollapsibleStructure: hasCollapsibleStructure
      };
    }
  } catch (e) {
    console.error('iiif-parser -> getStructureRanges() -> error parsing structures');
    throw new Error(GENERIC_ERROR_MESSAGE);
  }
}

/**
 * Read 'services' block in the Manifest or in relevant Canvas. Services listed
 * at the manifest-level takes precedence.
 * Returns the id of the service typed 'SearchService2' to enable content 
 * search 
 * @function IIIFParser#getSearchService
 * @param {Object} resource a Manifest/Canvas to read searchService endpoint
 * @returns 
 */
function getSearchService(resource) {
  var searchService = null;
  if (resource) {
    var services = resource.service;
    if (services && services.length > 0) {
      var searchServices = services.filter(function (s) {
        return s.type === 'SearchService2';
      });
      searchService = (searchServices === null || searchServices === void 0 ? void 0 : searchServices.length) > 0 ? searchServices[0].id : null;
    }
  }
  return searchService;
}

function _createForOfIteratorHelper$4(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$4(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$4(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$4(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$4(o, minLen); }
function _arrayLikeToArray$4(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

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
  nonTimedLine: 'NON_TIMED_LINE',
  metadata: 'METADATA'
};

/**
 * Parse the transcript information in the Manifest presented as supplementing annotations
 * @param {String} manifestURL IIIF Presentation 3.0 manifest URL
 * @param {String} title optional title given in the transcripts list in props
 * @param {AbortSignal} signal AbortSignal to cancel the fetch request
 * @returns {Array<Object>} array of supplementing annotations for transcripts for all
 * canvases in the Manifest
 */
function readSupplementingAnnotations(_x) {
  return _readSupplementingAnnotations.apply(this, arguments);
}
function _readSupplementingAnnotations() {
  _readSupplementingAnnotations = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(manifestURL) {
    var title,
      signal,
      data,
      _args = arguments;
    return regenerator.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          title = _args.length > 1 && _args[1] !== undefined ? _args[1] : '';
          signal = _args.length > 2 ? _args[2] : undefined;
          if (!(manifestURL === undefined)) {
            _context.next = 4;
            break;
          }
          return _context.abrupt("return", []);
        case 4:
          _context.next = 6;
          return fetch(manifestURL, {
            signal: signal
          }).then(function (response) {
            var fileType = response.headers.get('Content-Type');
            if (fileType.includes('application/json')) {
              var jsonData = response.json();
              return jsonData;
            } else {
              // Avoid throwing an error when fetched file is not a JSON
              return {};
            }
          }).then(function (manifest) {
            var _getAnnotations, _manifest$items;
            // Parse supplementing annotations at Manifest level and display for each Canvas
            var manifestAnnotations = (_getAnnotations = getAnnotations(manifest.annotations, 'supplementing')) !== null && _getAnnotations !== void 0 ? _getAnnotations : [];
            var manifestTranscripts = buildTranscriptAnnotation(manifestAnnotations, 0, manifestURL, manifest, title);
            var newTranscriptsList = [];
            if (((_manifest$items = manifest.items) === null || _manifest$items === void 0 ? void 0 : _manifest$items.length) > 0) {
              manifest.items.map(function (canvas, index) {
                var annotations = getAnnotations(canvas.annotations, 'supplementing');
                var canvasTranscripts = buildTranscriptAnnotation(annotations, index, manifestURL, canvas, title);
                newTranscriptsList.push({
                  canvasId: index,
                  // Merge canvas and manifest transcripts
                  items: [].concat(_toConsumableArray(canvasTranscripts), _toConsumableArray(manifestTranscripts))
                });
              });
            }
            return newTranscriptsList;
          })["catch"](function (error) {
            if (error.name === 'AbortError') {
              console.warn('transcript-parser -> readSupplementingAnnotations() -> fetch aborted');
            } else {
              console.error('transcript-parser -> readSupplementingAnnotations() -> error fetching transcript resource at, ', manifestURL);
            }
            return [];
          });
        case 6:
          data = _context.sent;
          return _context.abrupt("return", data);
        case 8:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _readSupplementingAnnotations.apply(this, arguments);
}
function buildTranscriptAnnotation(annotations, index, manifestURL, resource, title) {
  var _resource$annotations;
  // Get AnnotationPage label if it is available
  var annotationLabel = ((_resource$annotations = resource.annotations) === null || _resource$annotations === void 0 ? void 0 : _resource$annotations.length) > 0 && resource.annotations[0].label ? getLabelValue(resource.annotations[0].label) : title;
  var canvasTranscripts = [];
  if (annotations.length > 0) {
    var _annotations$0$body;
    // Check if 'body' property is an array
    var annotBody = ((_annotations$0$body = annotations[0].body) === null || _annotations$0$body === void 0 ? void 0 : _annotations$0$body.length) > 0 ? annotations[0].body[0] : annotations[0].body;
    if (annotBody.type === 'TextualBody') {
      var label = title.length > 0 ? title : annotationLabel ? annotationLabel : "".concat(resource.type, "-").concat(index);
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
        var annotBody = annotation.body;
        var label = '';
        var filename = '';
        if (annotBody.label && Object.keys(annotBody.label).length > 0) {
          var languages = Object.keys(annotBody.label);
          if ((languages === null || languages === void 0 ? void 0 : languages.length) > 1) {
            // If there are multiple labels for an annotation assume the first
            // is the one intended for default display.
            label = getLabelValue(annotBody.label);
            // Assume that an unassigned language is meant to be the downloadable filename
            filename = annotBody.label.hasOwnProperty('none') ? getLabelValue(annotBody.label.none[0]) : label;
          } else {
            // If there is a single label, use for both label and downloadable filename
            label = getLabelValue(annotBody.label);
          }
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
            format: annotBody.format || ''
          });
        }
      });
    }
  }
  return canvasTranscripts;
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
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(transcript) {
              var canvasId, items, sanitizedItems;
              return regenerator.wrap(function _callee3$(_context3) {
                while (1) switch (_context3.prev = _context3.next) {
                  case 0:
                    canvasId = transcript.canvasId, items = transcript.items;
                    _context3.next = 3;
                    return Promise.all(items.map( /*#__PURE__*/function () {
                      var _ref3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(item, index) {
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
                      return function (_x8, _x9) {
                        return _ref3.apply(this, arguments);
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
            return function (_x7) {
              return _ref2.apply(this, arguments);
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
 * @param {String} format transcript file format read from Annotation
 * @param {Number} canvasIndex Current canvas rendered in the player
 * @param {Boolean} parseMetadata parse metadata in the transcript
 * @param {Boolean} parseNotes parse notes in the transcript
 * @returns {Object}  Array of trancript data objects with download URL
 */
function parseTranscriptData(_x3, _x4, _x5) {
  return _parseTranscriptData.apply(this, arguments);
}
function _parseTranscriptData() {
  _parseTranscriptData = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5(url, format, canvasIndex) {
    var _textData$split, _textData;
    var parseMetadata,
      parseNotes,
      tData,
      tUrl,
      contentType,
      fileData,
      fromContentType,
      fromAnnotFormat,
      fileType,
      urlExt,
      filteredExt,
      textData,
      textLines,
      jsonData,
      _parseAnnotationSets,
      annotationSets,
      _annotationSets$,
      items,
      json,
      parsedText,
      _parseTimedText,
      _tData,
      tType,
      _args5 = arguments;
    return regenerator.wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          parseMetadata = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : false;
          parseNotes = _args5.length > 4 && _args5[4] !== undefined ? _args5[4] : false;
          tData = [];
          tUrl = url; // Validate given URL
          if (!(url === undefined)) {
            _context5.next = 6;
            break;
          }
          return _context5.abrupt("return", {
            tData: tData,
            tUrl: tUrl,
            tType: TRANSCRIPT_TYPES.invalid
          });
        case 6:
          contentType = null;
          fileData = null; // get file type
          _context5.next = 10;
          return fetch(url).then(handleFetchErrors).then(function (response) {
            contentType = response.headers.get('Content-Type');
            fileData = response;
          })["catch"](function (error) {
            console.error('transcript-parser -> parseTranscriptData() -> fetching transcript -> ', error);
          });
        case 10:
          if (!(contentType == null)) {
            _context5.next = 12;
            break;
          }
          return _context5.abrupt("return", {
            tData: [],
            tUrl: tUrl,
            tType: TRANSCRIPT_TYPES.invalid
          });
        case 12:
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
          _context5.t0 = fileType;
          _context5.next = _context5.t0 === 'json' ? 19 : _context5.t0 === 'txt' ? 35 : _context5.t0 === 'srt' ? 46 : _context5.t0 === 'vtt' ? 46 : _context5.t0 === 'docx' ? 56 : 64;
          break;
        case 19:
          _context5.next = 21;
          return fileData.json();
        case 21:
          jsonData = _context5.sent;
          if (!((jsonData === null || jsonData === void 0 ? void 0 : jsonData.type) === 'Manifest')) {
            _context5.next = 33;
            break;
          }
          _parseAnnotationSets = parseAnnotationSets(jsonData, canvasIndex), _parseAnnotationSets._, annotationSets = _parseAnnotationSets.annotationSets;
          if (!(annotationSets !== null && annotationSets !== void 0 && annotationSets.length)) {
            _context5.next = 30;
            break;
          }
          _annotationSets$ = annotationSets[0], _annotationSets$._, items = _annotationSets$.items;
          tData = createTData(items);
          return _context5.abrupt("return", {
            tData: tData,
            tUrl: tUrl,
            tType: TRANSCRIPT_TYPES.timedText,
            tFileExt: fileType
          });
        case 30:
          return _context5.abrupt("return", {
            tData: tData,
            tUrl: tUrl,
            tType: TRANSCRIPT_TYPES.noTranscript
          });
        case 31:
          _context5.next = 35;
          break;
        case 33:
          json = parseJSONData(jsonData);
          return _context5.abrupt("return", {
            tData: json.tData,
            tUrl: tUrl,
            tType: json.tType,
            tFileExt: fileType
          });
        case 35:
          _context5.next = 37;
          return fileData.text();
        case 37:
          textData = _context5.sent;
          textLines = (_textData$split = (_textData = textData) === null || _textData === void 0 ? void 0 : _textData.split('\n')) !== null && _textData$split !== void 0 ? _textData$split : [];
          if (!(textData == null || textData == '' || textLines.length == 0)) {
            _context5.next = 43;
            break;
          }
          return _context5.abrupt("return", {
            tData: [],
            tUrl: url,
            tType: TRANSCRIPT_TYPES.noTranscript
          });
        case 43:
          parsedText = buildNonTimedText(textLines);
          return _context5.abrupt("return", {
            tData: parsedText,
            tUrl: url,
            tType: TRANSCRIPT_TYPES.plainText,
            tFileExt: fileType
          });
        case 45:
        case 46:
          _context5.next = 48;
          return fileData.text();
        case 48:
          textData = _context5.sent;
          textLines = textData.split(/\r\n|\r|\n/);
          if (!(textData == null || textData == '' || textLines.length == 0)) {
            _context5.next = 54;
            break;
          }
          return _context5.abrupt("return", {
            tData: [],
            tUrl: url,
            tType: TRANSCRIPT_TYPES.noTranscript
          });
        case 54:
          _parseTimedText = parseTimedText(textData, parseMetadata, parseNotes, fileType === 'srt'), _tData = _parseTimedText.tData, tType = _parseTimedText.tType;
          return _context5.abrupt("return", {
            tData: _tData,
            tUrl: url,
            tType: tType,
            tFileExt: fileType
          });
        case 56:
          _context5.next = 58;
          return parseWordFile(fileData);
        case 58:
          tData = _context5.sent;
          if (!(tData == null)) {
            _context5.next = 63;
            break;
          }
          return _context5.abrupt("return", {
            tData: [],
            tUrl: url,
            tType: TRANSCRIPT_TYPES.invalid
          });
        case 63:
          return _context5.abrupt("return", {
            tData: splitIntoElements(tData),
            tUrl: url,
            tType: TRANSCRIPT_TYPES.docx,
            tFileExt: fileType
          });
        case 64:
          return _context5.abrupt("return", {
            tData: [],
            tUrl: url,
            tType: TRANSCRIPT_TYPES.noSupport
          });
        case 65:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return _parseTranscriptData.apply(this, arguments);
}
function createTData(annotations) {
  if ((annotations === null || annotations === void 0 ? void 0 : annotations.length) === 0) return [];
  var tData = [];
  annotations.map(function (a) {
    if (a.motivation.includes('supplementing')) {
      var _time$start, _time$end;
      var time = a.time,
        value = a.value;
      var text = (value === null || value === void 0 ? void 0 : value.length) > 0 ? value.map(function (v) {
        return v.value;
      }).join('<br>') : '';
      var format = (value === null || value === void 0 ? void 0 : value.length) > 0 ? value[0].format : 'text/plain';
      tData.push({
        text: text,
        format: format,
        begin: parseFloat((_time$start = time === null || time === void 0 ? void 0 : time.start) !== null && _time$start !== void 0 ? _time$start : 0),
        end: parseFloat((_time$end = time === null || time === void 0 ? void 0 : time.end) !== null && _time$end !== void 0 ? _time$end : 0),
        tag: TRANSCRIPT_CUE_TYPES.timedCue
      });
    }
  });
  return tData;
}

/**
 * Parse MS word documents into HTML markdown using mammoth.js
 * https://www.npmjs.com/package/mammoth
 * @param {Object} response response from the fetch request
 * @returns {Array} html markdown for the word document contents
 */
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
  var _iterator = _createForOfIteratorHelper$4(jsonData),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var jd = _step.value;
      if (jd.speaker) {
        var speaker = jd.speaker,
          spans = jd.spans;
        var _iterator2 = _createForOfIteratorHelper$4(spans),
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
        var _iterator3 = _createForOfIteratorHelper$4(jd.spans),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var _span = _step3.value;
            _span.format = 'text/plain';
            _span.tag = TRANSCRIPT_CUE_TYPES.timedCue;
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

/**
 * Parsing transcript data from a given file with timed text
 * @param {Object} fileData content in the transcript file
 * @param {Boolean} parseMetadata parse metadata in the transcript
 * @param {Boolean} parseNotes parse notes in the transcript
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
function parseTimedText(fileData, parseMetadata, parseNotes) {
  var isSRT = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var tData = [];
  var noteLines = [];
  var metadataLines = [];
  // split file content into lines
  var lines = fileData.split('\n');

  // For SRT files all of the file content is considered as cues
  var cueLines = lines;
  if (!isSRT) {
    var _validateWebVTT = validateWebVTT(lines, parseMetadata, parseNotes),
      valid = _validateWebVTT.valid,
      cue_lines = _validateWebVTT.cue_lines,
      notes = _validateWebVTT.notes,
      metadata = _validateWebVTT.metadata;
    if (!valid) {
      console.error('Invalid WebVTT file');
      return {
        tData: [],
        tType: TRANSCRIPT_TYPES.invalidVTT
      };
    }
    cueLines = cue_lines;
    noteLines = notes;
    metadataLines = metadata;
  }
  var groups = groupTimedTextLines(cueLines, parseNotes);

  // Add back the NOTE(s) and metadata in the header block
  groups.unshift.apply(groups, _toConsumableArray(noteLines));
  groups.unshift.apply(groups, _toConsumableArray(metadataLines));
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
 * @param {Boolean} parseMetadata parse metadata in the transcript
 * @param {Boolean} parseNotes parse notes in the transcript
 * @returns {Object}
 */
function validateWebVTT(lines, parseMetadata, parseNotes) {
  var linePointer = 0;

  // Trim whitespace from the start and end of the signature
  var signature = lines[0].trim();
  // Validate the signature
  if (signature.length === 6 && signature === 'WEBVTT') {
    linePointer++;
    var _validateWebVTTHeader = validateWebVTTHeaders(lines, linePointer, parseMetadata, parseNotes),
      valid = _validateWebVTTHeader.valid,
      cue_lines = _validateWebVTTHeader.cue_lines,
      notes = _validateWebVTTHeader.notes,
      metadata = _validateWebVTTHeader.metadata;
    return {
      valid: valid,
      cue_lines: cue_lines,
      notes: notes,
      metadata: metadata
    };
  } else {
    return {
      valid: false,
      cue_lines: [],
      notes: [],
      metadata: []
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
 * @param {Number} linePointer pointer to the line number in the WebVTT file
 * @param {Boolean} parseMetadata parse metadata in the transcript
 * @param {Boolean} parseNotes parse notes in the transcript
 * @returns 
 */
function validateWebVTTHeaders(lines, linePointer, parseMetadata, parseNotes) {
  var endOfHeadersIndex = 0;
  var firstCueIndex = 0;
  var notesInHeader = [];
  var metadataInHeader = [];

  // Remove line numbers for vtt cues
  lines = lines.filter(function (l) {
    return Number(l) ? false : true;
  });
  // Check if the line is an empty line
  var notAnEmptyLine = function notAnEmptyLine(line) {
    return !line == '\r' || !line == '\n' || !line == '\r\n';
  };

  /**
   * Logic for validating and identifying different blocks in the header is that,
   * each block is separated by zero or more empty lines according to the WebVTT specification.
   * https://www.w3.org/TR/webvtt1/#file-structure
   */
  for (var i = linePointer; i < lines.length; i++) {
    var line = lines[i].trim();
    // Skip REGION and STYLE blocks as these are related to displaying cues as overlays
    if (/^REGION$/.test(line.toUpperCase()) || /^STYLE$/.test(line.toUpperCase())) {
      // Increment until an empty line is encountered within the header block
      i++;
      while (i < lines.length && notAnEmptyLine(lines[i])) {
        i++;
      }
      endOfHeadersIndex = i;
    }
    // Gather comments presented as NOTE(s) in the header block to be displayed as transcript
    else if (/^NOTE$/.test(line.toUpperCase())) {
      var noteText = line;
      // Increment until an empty line is encountered within the NOTE block
      while (i < lines.length && notAnEmptyLine(lines[i])) {
        i++;
        noteText = "".concat(noteText, "<br />").concat(lines[i].trim());
      }
      if (parseNotes) {
        notesInHeader.push({
          times: '',
          line: noteText,
          tag: TRANSCRIPT_CUE_TYPES.note
        });
      }
      endOfHeadersIndex = i;
    }
    // Terminate validation once the first cue is reached, need to check this before checking for metadata
    else if (line.includes('-->')) {
      // Break the loop when it reaches the first vtt cue
      firstCueIndex = i;
      break;
    }
    // Check for metadata in the header block without block prefix
    else if (typeof line === 'string' && line.trim().length != 0) {
      var metadataText = line.trim();
      while (i < lines.length && notAnEmptyLine(lines[i])) {
        i++;
        metadataText = "".concat(metadataText, "<br />").concat(lines[i].trim());
      }
      if (parseMetadata && metadataText.length > 0) {
        metadataInHeader.push({
          times: '',
          line: metadataText,
          tag: TRANSCRIPT_CUE_TYPES.metadata
        });
      }
      endOfHeadersIndex = i;
    }
  }

  // Return the cues and comments in the header block when the given WebVTT is valid
  if (firstCueIndex > endOfHeadersIndex) {
    return {
      valid: true,
      cue_lines: lines.slice(firstCueIndex),
      notes: notesInHeader,
      metadata: metadataInHeader
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
 * @param {Boolean} parseNotes
 * @returns {Array<Object>}
 */
function groupTimedTextLines(lines) {
  var parseNotes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
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

      // Counter to keep track of lines within a cue
      var cueLineCount = 0;
      // Increment until an empty line is encountered marking the end of the block
      while (i < lines.length && !(lines[i] == '\r' || lines[i] == '\n' || lines[i] == '\r\n' || lines[i] == '')) {
        // Add a line break only between lines within a cue, omit start and end of cue
        if (cueLineCount > 0) t.line += '<br>';
        t.line += lines[i].endsWith('-') ? lines[i] : lines[i].replace(/\s*$/, ' ');
        cueLineCount++;
        i++;
      }
      t.line = t.line.trimEnd();
      // If the cue text is a note and notes are not displayed in the UI, skip it
      if (!isNote || parseNotes) {
        groups.push(t);
      }
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
    case TRANSCRIPT_CUE_TYPES.metadata:
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

function ownKeys$9(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$9(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$9(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$9(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

// Global variable to store random tag colors for the current tags
var TAG_COLORS = [];

/**
 * Linked annotation file types with possible time synced annotations.
 * Assume application/json file types point to an external AnnotationPage resource.
 */
var TIME_SYNCED_FORMATS = ['text/vtt', 'text/srt', 'application/json'];

// Supported motivations for annotations
// Remove 'transcribing' once testing for Aviary manifests are completed.
var SUPPORTED_MOTIVATIONS = ['commenting', 'supplementing', 'transcribing'];

/**
 * Parse annotation sets relevant to the current Canvas in a
 * given Manifest.
 * If the AnnotationPage contains linked resources as annotations,
 * returns information related to the linked resource.
 * If the AnnotationPage contains TextualBody type annotations,
 * returns information related to each text annotation.
 * @param {Object} manifest
 * @param {Number} canvasIndex 
 * @returns {Array}
 */
function parseAnnotationSets(manifest, canvasIndex) {
  var canvas = null;
  var annotationSets = [];

  // return empty object when canvasIndex is undefined
  if (canvasIndex === undefined || canvasIndex < 0) {
    return null;
  }
  var canvases = manifest.items;
  if ((canvases === null || canvases === void 0 ? void 0 : canvases.length) != 0 && canvases[canvasIndex] != undefined) {
    canvas = canvases[canvasIndex];
    var annotations = canvas.annotations;
    var duration = Number(canvas.duration);
    annotationSets = parseAnnotationPages(annotations, duration);
    return {
      canvasIndex: canvasIndex,
      annotationSets: annotationSets
    };
  } else {
    return null;
  }
}

/**
 * Fetch and parse linked AnnotationPage json file
 * @function parseExternalAnnotationPage
 * @param {String} url URL of the linked AnnotationPage .json
 * @param {Number} duration Canvas duration
 * @returns {Object} JSON object for the annotations
 * 
 */
function parseExternalAnnotationPage(_x, _x2) {
  return _parseExternalAnnotationPage.apply(this, arguments);
}

/**
 * Parse a annotations in a given list of AnnotationPage objects.
 * @function parseAnnotationPage
 * @param {Array} annotationPages AnnotationPage from either Canvas or linked .json
 * @param {Number} duration Canvas duration
 * @returns {Array<Object>} a parsed list of annotations in the AnnotationPage
 * [{ label: String, items: Array<Object> }]
 */
function _parseExternalAnnotationPage() {
  _parseExternalAnnotationPage = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url, duration) {
    var urlRegex, fileData, annotationPage, annotations;
    return regenerator.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-._~:\/?#[\]@!$&'()*+,;=]*)?\.json$/; // Validate given URL
          if (!(url == undefined || url.match(urlRegex) == null)) {
            _context.next = 5;
            break;
          }
          return _context.abrupt("return", []);
        case 5:
          fileData = null; // get file type
          _context.next = 8;
          return fetch(url).then(handleFetchErrors).then(function (response) {
            fileData = response;
          })["catch"](function (error) {
            console.error('annotations-parser -> parseExternalAnnotationPage() -> fetching transcript -> ', error);
            return [];
          });
        case 8:
          if (!(fileData == null)) {
            _context.next = 12;
            break;
          }
          return _context.abrupt("return", []);
        case 12:
          _context.prev = 12;
          _context.next = 15;
          return fileData.json();
        case 15:
          annotationPage = _context.sent;
          annotations = parseAnnotationPages([annotationPage], duration);
          return _context.abrupt("return", annotations);
        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](12);
          console.error('annotations-parser -> parseExternalAnnotationPage() -> Error: parsing AnnotationPage at, ', url);
          return _context.abrupt("return", []);
        case 24:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[12, 20]]);
  }));
  return _parseExternalAnnotationPage.apply(this, arguments);
}
function parseAnnotationPages(annotationPages, duration) {
  var annotationSets = [];
  if ((annotationPages === null || annotationPages === void 0 ? void 0 : annotationPages.length) > 0 && annotationPages[0].type === 'AnnotationPage') {
    annotationPages.map(function (annotationPage) {
      if (annotationPage.type === 'AnnotationPage') {
        var _annotationPage$items;
        var annotationSet = {
          label: getLabelValue(annotationPage.label)
        };
        if (((_annotationPage$items = annotationPage.items) === null || _annotationPage$items === void 0 ? void 0 : _annotationPage$items.length) > 0) {
          var items = [];
          var markers = [];
          // Parse each item in AnnotationPage
          annotationPage.items.map(function (item) {
            // Parse linked resources as a single annotation set
            if (isExternalAnnotation(item.body)) {
              var body = item.body,
                id = item.id,
                motivation = item.motivation,
                target = item.target;
              var annotationMotivation = Array.isArray(motivation) ? motivation : [motivation];
              // Only add WebVTT, SRT, and JSON files as annotations
              var timeSynced = TIME_SYNCED_FORMATS.includes(body.format);
              var annotationInfo = parseAnnotationBody(body, annotationMotivation)[0];
              if (annotationInfo != undefined) {
                annotationSets.push(_objectSpread$9(_objectSpread$9({}, annotationInfo), {}, {
                  canvasId: target,
                  id: id,
                  motivation: annotationMotivation,
                  timed: timeSynced
                }));
              }
            } else {
              // Parse individual TextualBody annotation as an item/a marker in an annotation set
              if (item.motivation === 'highlighting') {
                var marker = parseAnnotationItem(item, duration);
                markers.push(convertAnnotationToMarker(marker));
              } else {
                items.push(parseAnnotationItem(item, duration));
              }
            }
          });
          if (items.length > 0 || markers.length > 0) {
            // Sort and group annotations by start time before setting in annotationSet
            var sortedItems = sortAnnotations(items);
            var groupedItems = groupAnnotationsByTime(sortedItems);
            annotationSets.push(_objectSpread$9(_objectSpread$9({}, annotationSet), {}, {
              items: groupedItems,
              markers: markers,
              timed: true
            }));
          }
        } else {
          // Assumes AnnotationPage linked as JSON has timed annotation fragments
          annotationSets.push(_objectSpread$9(_objectSpread$9({}, annotationSet), {}, {
            url: annotationPage.id,
            format: 'application/json',
            timed: true
          }));
        }
      }
    });
  }
  return annotationSets;
}

/**
 * Determine whether a given Annotation has a linked resource or
 * a TextualBody with text values in its 'body' property.
 * @function isExternalAnnotaion
 * @param {Array} annotationBody array of 'body' in Annotation
 * @returns {Boolean}
 */
function isExternalAnnotation(annotationBody) {
  if (!Array.isArray(annotationBody)) annotationBody = [annotationBody];
  return annotationBody.map(function (body) {
    return body.type != 'TextualBody';
  }).reduce(function (acc, current) {
    return acc && current;
  }, true);
}

/**
 * Parse each Annotation in a given AnnotationPage resource
 * @function parseAnnotationItem
 * @param {Array} annotation list of annotations from AnnotationPage
 * @param {Number} duration Canvas duration
 * @returns {Object} parsed JSON object for each Annotation
 * { 
 *  motivation: Array<String>, 
 *  id: String, 
 *  times: { start: Number, end: Number || undefined }, 
 *  canvasId: URI, 
 *  value: [ return type of parseTextualBody() ]
 * }
 */
function parseAnnotationItem(annotation, duration) {
  if (annotation == undefined || annotation == null) {
    return;
  }
  var canvasId, times;
  if (typeof (annotation === null || annotation === void 0 ? void 0 : annotation.target) === 'string') {
    canvasId = getCanvasId(annotation.target);
    times = getMediaFragment(annotation.target, duration);
  } else {
    // Might want to re-visit based on the implementation changes in AVAnnotate manifests
    var _annotation$target = annotation === null || annotation === void 0 ? void 0 : annotation.target,
      source = _annotation$target.source,
      selector = _annotation$target.selector;
    canvasId = source.id;
    times = parseSelector(selector, duration);
  }
  var motivations = Array.isArray(annotation.motivation) ? annotation.motivation : [annotation.motivation];
  var item = {
    motivation: motivations,
    id: annotation.id,
    time: times,
    canvasId: canvasId,
    value: parseAnnotationBody(annotation.body, motivations)
  };
  return item;
}

/**
 * Parse different types of temporal selectors given in an Annotation
 * @function parseSelector
 * @param {Object} selector Selector object from an Annotation
 * @param {Number} duration Canvas duration
 * @returns {Object} start, end times of an Annotation
 */
function parseSelector(selector, duration) {
  var selectorType = selector.type;
  var times = {};
  switch (selectorType) {
    case 'FragmentSelector':
      times = parseTimeStrings(selector.value.split('t=')[1], duration);
      break;
    case 'PointSelector':
      times = {
        start: Number(selector.t),
        end: undefined
      };
      break;
    // FIXME:: Remove this, as this is an invalid format from previous AVAnnotate
    case 'RangeSelector':
      times = parseTimeStrings(selector.t);
      break;
  }
  return times;
}

/**
 * Parse value of a TextualBody into a JSON object
 * @function parseTextualBody
 * @param {Object} textualBody TextualBody type object
 * @param {Array} motivations motivation(s) of Annotation/AnnotationPage
 * @returns {Object} JSON object for TextualBody value
 * { format: String, purpose: Array<String>, value: String, tagColor: undefined || String }
 */
function parseTextualBody(textualBody, motivations) {
  var annotationBody = {};
  var tagColor;
  if (textualBody) {
    var format = textualBody.format,
      label = textualBody.label,
      motivation = textualBody.motivation,
      purpose = textualBody.purpose,
      value = textualBody.value;
    var annotationPurpose = purpose != undefined ? purpose : motivation;
    if (annotationPurpose == undefined && SUPPORTED_MOTIVATIONS.some(function (m) {
      return motivations.includes(m);
    })) {
      // Filter only the motivations that are displayed as texts
      annotationPurpose = motivations.filter(function (m) {
        return SUPPORTED_MOTIVATIONS.includes(m);
      });
    }

    // If a label is given; combine label/value pairs to display
    var bodyValue = label != undefined ? "<strong>".concat(getLabelValue(label), "</strong>: ").concat(value) : value;
    annotationBody = {
      format: format,
      /**
       * Use purpose instead of motivation, as it is specific to 'TextualBody' type.
       * 'purpose'/'motivation' can have 0 or more values.
       * Reference: https://www.w3.org/TR/annotation-model/#motivation-and-purpose
       */
      purpose: Array.isArray(annotationPurpose) ? annotationPurpose : [annotationPurpose],
      value: bodyValue
    };
    if (annotationPurpose == ['tagging']) {
      var hasColor = TAG_COLORS.filter(function (c) {
        return c.tag == value;
      });
      if ((hasColor === null || hasColor === void 0 ? void 0 : hasColor.length) > 0) {
        tagColor = hasColor[0].color;
      } else {
        tagColor = generateColor((TAG_COLORS === null || TAG_COLORS === void 0 ? void 0 : TAG_COLORS.length) > 0 ? TAG_COLORS.map(function (c) {
          return c.color;
        }) : []);
        TAG_COLORS.push({
          tag: value,
          color: tagColor
        });
      }
      annotationBody.tagColor = tagColor;
    }
  }
  return annotationBody;
}

/**
 * Parse 'body' of an Annotation into a JSON object.
 * @function parseAnnotationBody
 * @param {Array || Object} annotationBody body property of an Annotation
 * @param {Array} motivations motivation(s) of Annotation/AnnotationPage
 */
function parseAnnotationBody(annotationBody, motivations) {
  if (!Array.isArray(annotationBody)) {
    annotationBody = [annotationBody];
  }
  var values = [];
  annotationBody.map(function (body) {
    var type = body.type;
    switch (type) {
      case 'TextualBody':
        values.push(parseTextualBody(body, motivations));
        break;
      case 'Text':
        var format = body.format,
          id = body.id,
          label = body.label;
        // Skip linked annotations that are captions in Avalon manifests
        var sType = identifySupplementingAnnotation(id);
        var parsedLabel = getLabelValue(label);
        if (sType !== 2) {
          values.push({
            format: format,
            label: parsedLabel,
            url: id,
            // Assume that an unassigned language is meant to be the downloadable filename
            filename: label.hasOwnProperty('none') ? getLabelValue(label.none[0]) : parsedLabel,
            /**
             * 'linkedResource' property helps to make parsing the choice in 
             * 'fetchAndParseLinkedAnnotations()' in AnnotationSetSelect.
             */
            linkedResource: format != 'application/json'
          });
        }
        break;
    }
  });
  return values;
}

/**
 * A wrapper function around 'parseTranscriptData()' from 'transcript-parser' module.
 * Converts the data from linked resources in annotations in a Manifest/Canvas 
 * into a format expected in the 'Annotations' component for displaying.
 * Parse linked resources (WebVTT, SRT, MS Doc, etc.) in a given Annotation
 * into a list of JSON objects to a format similar to annotations with
 * 'TextualBody' type in an AnnotationPage.
 * @function parseExternalAnnotationResource
 * @param {Object} annotation Annotation for the linked resource
 * @returns {Array} parsed data from a linked resource in the same format as
 * the return type of parseAnnotationItems() function.
 */
function parseExternalAnnotationResource(_x3) {
  return _parseExternalAnnotationResource.apply(this, arguments);
}

/**
 * Generate a random color for annotation sets compliant with WCAG
 * 2.0 level AA for normat text
 * Reference: https://stackoverflow.com/q/43193341/4878529
 * @returns {String} HSL color code
 */
function _parseExternalAnnotationResource() {
  _parseExternalAnnotationResource = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(annotation) {
    var canvasId, format, id, motivation, url, _yield$parseTranscrip, tData, tType;
    return regenerator.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          canvasId = annotation.canvasId, format = annotation.format, id = annotation.id, motivation = annotation.motivation, url = annotation.url;
          _context2.next = 3;
          return parseTranscriptData(url, format);
        case 3:
          _yield$parseTranscrip = _context2.sent;
          tData = _yield$parseTranscrip.tData;
          tType = _yield$parseTranscrip.tType;
          if (!(tData && tType != TRANSCRIPT_TYPES.invalidTimestamp && tType != TRANSCRIPT_TYPES.invalidVTT)) {
            _context2.next = 8;
            break;
          }
          return _context2.abrupt("return", tData.map(function (data, index) {
            var begin = data.begin,
              end = data.end,
              text = data.text;
            return {
              canvasId: canvasId,
              id: "".concat(id, "-").concat(index),
              // Add unique ids for each cue based on annotation id
              motivation: motivation,
              time: {
                start: begin,
                end: end
              },
              value: [{
                format: 'text/plain',
                purpose: motivation,
                value: text
              }]
            };
          }));
        case 8:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _parseExternalAnnotationResource.apply(this, arguments);
}
function generateColor(existingColors) {
  var newColor;
  var getNewColor = function getNewColor() {
    var hue = Math.floor(Math.random() * 360);
    /**
     * saturation and lightness are set fixed values to acheive 
     * WCAG compliant contrast ratio of 4.5 for normal texts
     */
    var saturation = 80;
    var lightness = 90;
    newColor = "hsl(".concat(hue, ", ").concat(saturation, "%, ").concat(lightness, "%)");
  };
  getNewColor();

  // If the generated color is already used generate another color
  if (existingColors.length > 0 && existingColors.includes(newColor)) {
    getNewColor();
  } else {
    return newColor;
  }
}

/**
 * Group a given set of annotations by their start times.
 * Some manifest producers create separate annotations for same timestamp,
 * and these annotations are then need to be merged into one to accurately 
 * display them in the UI.
 * @param {Array} annotations a list of timed annotations
 * @returns {Array}
 */
function groupAnnotationsByTime(annotations) {
  var groupedAnnotations = annotations.reduce(function (grouped, annotation) {
    if (annotation.time != undefined) {
      var start = annotation.time.start;
      // Create an element in the map for a new start time
      if (!grouped[start]) {
        grouped[start] = [];
        grouped[start].push(annotation);
      } else {
        // Insert current annotation's value into existing annotations
        var current = grouped[start][0];
        current.value.push(annotation.value[0]);
      }
    }
    return grouped;
  }, {});

  // Get only the annotations from the map
  var annotationArray = Object.values(groupedAnnotations).flat();
  return annotationArray;
}

/**
 * Convert parsed highlighting annotations into markers for the 
 * MarkerDisplay component.
 * @param {Object} annotation highlighting annotation object
 * @returns {Object} marker object with time and value
 * {
 *  id: String,
 *  time: Number,
 *  timeStr: String,
 *  canvasId: String,
 *  value: String
 * }
 */
function convertAnnotationToMarker(annotation) {
  var canvasId = annotation.canvasId,
    id = annotation.id,
    time = annotation.time,
    value = annotation.value;
  return {
    id: id,
    time: time.start || 0,
    timeStr: time.start ? timeToHHmmss(time.start, true, true) : '00:00:00',
    canvasId: canvasId,
    value: (value === null || value === void 0 ? void 0 : value.length) > 0 ? value[0].value : ''
  };
}

/**
 * Parse annotation service endpoint
 * @function PlaylistParser#getAnnotationService
 * @param {Object} service service property of Manifest
 * @returns {URL} Annotation service endpoint
 */
function getAnnotationService(service) {
  var _service$;
  if ((service === null || service === void 0 ? void 0 : service.length) > 0 && ((_service$ = service[0]) === null || _service$ === void 0 ? void 0 : _service$.type) === 'AnnotationService0') {
    return service[0].id;
  } else {
    return null;
  }
}

/**
 * Parses the manifest to identify whether it is a playlist manifest
 * or not
 * @function PlaylistParser#getIsPlaylist
 * @param {String} manifestTitle
 * @returns {Boolean}
 */
function getIsPlaylist(manifestTitle) {
  if (manifestTitle) {
    var isPlaylist = getLabelValue(manifestTitle).includes('[Playlist]');
    return isPlaylist;
  } else {
    console.warn('playlist-parser -> getIsPlaylist() -> manifest.label not found');
    return false;
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
  var _a$target$split = a.target.split('#t='),
    _a$target$split2 = _slicedToArray(_a$target$split, 2),
    canvasId = _a$target$split2[0],
    time = _a$target$split2[1];
  var markerBody = a.body;
  if (Object.keys(markerBody).length === 0) {
    return null;
  } else if ((markerBody === null || markerBody === void 0 ? void 0 : markerBody.type) === 'TextualBody') {
    var _markerBody$value;
    var marker = {
      id: a.id,
      time: parseFloat(time),
      timeStr: timeToHHmmss(parseFloat(time), true, true),
      canvasId: canvasId,
      value: (_markerBody$value = markerBody === null || markerBody === void 0 ? void 0 : markerBody.value) !== null && _markerBody$value !== void 0 ? _markerBody$value : ''
    };
    return marker;
  } else {
    return null;
  }
}

function ownKeys$8(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$8(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$8(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$8(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var ManifestStateContext = /*#__PURE__*/createContext();
var ManifestDispatchContext = /*#__PURE__*/createContext();

/**
 * Definition of all state variables in this Context
 */
var defaultState$1 = {
  manifest: null,
  allCanvases: [],
  canvasIndex: 0,
  // index for active canvas
  currentNavItem: null,
  canvasDuration: 0,
  canvasLink: null,
  canvasIsEmpty: false,
  customStart: {
    startIndex: 0,
    startTime: 0
  },
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
  renderings: {},
  canvasSegments: [],
  structures: {
    hasStructure: false,
    // current Canvas has structure timespans
    isCollapsed: false,
    // all sections are expanded by default
    structItems: []
  },
  annotations: [],
  // [{ canvasIndex: Number, annotationSets: Array }]
  clickedAnnotation: null // clicked annotation in the Canvas
};

function getHasStructure(canvasSegments, canvasIndex) {
  // Update hasStructure flag when canvas changes
  var canvasStructures = (canvasSegments === null || canvasSegments === void 0 ? void 0 : canvasSegments.length) > 0 ? canvasSegments.filter(function (c) {
    return c.canvasIndex == canvasIndex + 1 && !c.isCanvas;
  }) : [];
  return canvasStructures.length > 0;
}
function hasParsedCanvasAnnotations(annotations, canvasIndex) {
  var parsedAnnotations = annotations.filter(function (a) {
    return a.canvasIndex == canvasIndex;
  });
  return (parsedAnnotations === null || parsedAnnotations === void 0 ? void 0 : parsedAnnotations.length) > 0;
}
function manifestReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState$1;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case 'updateManifest':
      {
        var manifest = action.manifest;
        var canvases = canvasesInManifest(manifest);
        var manifestBehavior = parseAutoAdvance(manifest.behavior);
        var isPlaylist = getIsPlaylist(manifest.label);
        var annotationService = getAnnotationService(manifest.service);
        return _objectSpread$8(_objectSpread$8({}, state), {}, {
          manifest: manifest,
          allCanvases: canvases,
          autoAdvance: manifestBehavior,
          playlist: _objectSpread$8(_objectSpread$8({}, state.playlist), {}, {
            isPlaylist: isPlaylist,
            annotationServiceId: annotationService,
            hasAnnotationService: annotationService ? true : false
          })
        });
      }
    case 'switchCanvas':
      {
        var hasAnnotations = hasParsedCanvasAnnotations(state.annotations, action.canvasIndex);
        return _objectSpread$8(_objectSpread$8({}, state), {}, {
          canvasIndex: action.canvasIndex,
          structures: _objectSpread$8(_objectSpread$8({}, state.structures), {}, {
            hasStructure: getHasStructure(state.canvasSegments, action.canvasIndex)
          }),
          annotations: hasAnnotations ? _toConsumableArray(state.annotations) : [].concat(_toConsumableArray(state.annotations), [parseAnnotationSets(state.manifest, action.canvasIndex)])
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
        // Set a new set of markers for a Canvas in the Manifest
        if (action.markers) {
          return _objectSpread$8(_objectSpread$8({}, state), {}, {
            playlist: _objectSpread$8(_objectSpread$8({}, state.playlist), {}, {
              markers: [].concat(_toConsumableArray(state.playlist.markers), [action.markers])
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
    case 'setCanvasIsEmpty':
      {
        return _objectSpread$8(_objectSpread$8({}, state), {}, {
          canvasIsEmpty: action.isEmpty
        });
      }
    case 'setStructures':
      {
        return _objectSpread$8(_objectSpread$8({}, state), {}, {
          structures: _objectSpread$8(_objectSpread$8({}, state.structures), {}, {
            structItems: action.structures
          })
        });
      }
    case 'setCanvasSegments':
      {
        // Update hasStructure flag when canvasSegments are calculated
        var canvasStructures = action.timespans.filter(function (c) {
          return c.canvasIndex == state.canvasIndex + 1 && !c.isCanvas;
        });
        return _objectSpread$8(_objectSpread$8({}, state), {}, {
          canvasSegments: action.timespans,
          structures: _objectSpread$8(_objectSpread$8({}, state.structures), {}, {
            hasStructure: canvasStructures.length > 0
          })
        });
      }
    case 'setCustomStart':
      {
        var _action$customStart = action.customStart,
          canvas = _action$customStart.canvas,
          time = _action$customStart.time;
        return _objectSpread$8(_objectSpread$8({}, state), {}, {
          customStart: {
            startIndex: canvas,
            startTime: time
          },
          canvasIndex: canvas,
          structures: _objectSpread$8(_objectSpread$8({}, state.structures), {}, {
            hasStructure: getHasStructure(state.canvasSegments, canvas)
          })
        });
      }
    case 'setRenderingFiles':
      {
        return _objectSpread$8(_objectSpread$8({}, state), {}, {
          renderings: _objectSpread$8({}, action.renderings)
        });
      }
    case 'setIsCollapsed':
      {
        return _objectSpread$8(_objectSpread$8({}, state), {}, {
          structures: _objectSpread$8(_objectSpread$8({}, state.structures), {}, {
            isCollapsed: action.isCollapsed
          })
        });
      }
    case 'setAnnotations':
      {
        return _objectSpread$8(_objectSpread$8({}, state), {}, {
          annotations: [].concat(_toConsumableArray(state.annotations), [action.annotations])
        });
      }
    case 'setClickedAnnotation':
      {
        return _objectSpread$8(_objectSpread$8({}, state), {}, {
          clickedAnnotation: action.clickedAnnotation
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
  var _useReducer = useReducer(manifestReducer, initialState),
    _useReducer2 = _slicedToArray(_useReducer, 2),
    state = _useReducer2[0],
    dispatch = _useReducer2[1];
  return /*#__PURE__*/React.createElement(ManifestStateContext.Provider, {
    value: state
  }, /*#__PURE__*/React.createElement(ManifestDispatchContext.Provider, {
    value: dispatch
  }, children));
}
function useManifestState() {
  var context = useContext(ManifestStateContext);
  if (context === undefined) {
    throw new Error('useManifestState must be used within a ManifestProvider');
  }
  return context;
}
function useManifestDispatch() {
  var context = useContext(ManifestDispatchContext);
  if (context === undefined) {
    throw new Error('useManifestDispatch must be used within a ManifestProvider');
  }
  return context;
}

function ownKeys$7(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$7(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$7(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$7(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var PlayerStateContext = /*#__PURE__*/createContext();
var PlayerDispatchContext = /*#__PURE__*/createContext();

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
  searchMarkers: []
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
    case 'clearClickedUrl':
      {
        return _objectSpread$7(_objectSpread$7({}, state), {}, {
          clickedUrl: ''
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
  var _useReducer = useReducer(PlayerReducer, initialState),
    _useReducer2 = _slicedToArray(_useReducer, 2),
    state = _useReducer2[0],
    dispatch = _useReducer2[1];
  return /*#__PURE__*/React.createElement(PlayerStateContext.Provider, {
    value: state
  }, /*#__PURE__*/React.createElement(PlayerDispatchContext.Provider, {
    value: dispatch
  }, children));
}
function usePlayerState() {
  var context = useContext(PlayerStateContext);
  if (context === undefined) {
    throw new Error("usePlayerState must be used within the PlayerProvider");
  }
  return context;
}
function usePlayerDispatch() {
  var context = useContext(PlayerDispatchContext);
  if (context === undefined) {
    throw new Error("usePlayerDispatch must be used within the PlayerProvider");
  }
  return context;
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

var Spinner = function Spinner() {
  return /*#__PURE__*/React.createElement("div", {
    className: "lds-spinner"
  }, /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null));
};

function IIIFPlayerWrapper(_ref) {
  var manifestUrl = _ref.manifestUrl,
    customErrorMessage = _ref.customErrorMessage,
    emptyManifestMessage = _ref.emptyManifestMessage,
    startCanvasId = _ref.startCanvasId,
    startCanvasTime = _ref.startCanvasTime,
    children = _ref.children,
    manifestValue = _ref.manifest;
  var _useState = useState(manifestValue),
    _useState2 = _slicedToArray(_useState, 2),
    manifest = _useState2[0],
    setManifest = _useState2[1];
  var manifestDispatch = useManifestDispatch();
  var playerDispatch = usePlayerDispatch();
  var _useErrorBoundary = useErrorBoundary(),
    showBoundary = _useErrorBoundary.showBoundary;

  // AbortController for Manifest fetch request
  var controller;
  var fetchManifest = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url) {
      var requestOptions, sanitizedUrl;
      return regenerator.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            controller = new AbortController();
            requestOptions = {
              // NOTE: try this in Avalon
              //credentials: 'include',
              // headers: { 'Avalon-Api-Key': '' },
            };
            /**
             * Sanitize manifest urls of query or anchor fragments included in the
             * middle of the url: hhtp://example.com/endpoint?params/manifest
             */
            sanitizedUrl = url.replace(/[\?#].*(?=\/)/i, '');
            _context.prev = 3;
            _context.next = 6;
            return fetch(sanitizedUrl, requestOptions, {
              signal: controller.signal
            }).then(function (result) {
              if (result.status != 200 && result.status != 201) {
                throw new Error('Failed to fetch Manifest. Please check again.');
              } else {
                return result.json();
              }
            }).then(function (data) {
              if (!data) {
                throw new Error(GENERIC_ERROR_MESSAGE);
              }
              setManifest(data);
            })["catch"](function (error) {
              console.log('Error fetching manifest, ', error);
              throw new Error('Failed to fetch Manifest. Please check again.');
            });
          case 6:
            _context.next = 11;
            break;
          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](3);
            showBoundary(_context.t0);
          case 11:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[3, 8]]);
    }));
    return function fetchManifest(_x) {
      return _ref2.apply(this, arguments);
    };
  }();
  useEffect(function () {
    setAppErrorMessage(customErrorMessage);
    setAppEmptyManifestMessage(emptyManifestMessage);
    if (!manifest && manifestUrl) {
      fetchManifest(manifestUrl);
    }

    // Cleanup Manifest fetch request on component unmount
    return function () {
      if (controller) controller.abort();
    };
  }, []);
  useEffect(function () {
    if (manifest) {
      // Set customStart and rendering files in state before setting Manifest
      var renderingFiles = getRenderingFiles(manifest);
      manifestDispatch({
        renderings: renderingFiles,
        type: 'setRenderingFiles'
      });
      var customStart = getCustomStart(manifest, startCanvasId, startCanvasTime);
      manifestDispatch({
        customStart: customStart,
        type: 'setCustomStart'
      });
      if (customStart.type == 'SR') {
        playerDispatch({
          currentTime: customStart.time,
          type: 'setCurrentTime'
        });
      }
      manifestDispatch({
        manifest: manifest,
        type: 'updateManifest'
      });
    }
  }, [manifest]);
  if (!manifest) {
    return /*#__PURE__*/React.createElement(Spinner, null);
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

/**
 * Component with wrapped in React Contexts to provide access
 * to global state across its children
 * @param {Object} props
 * @param {String} props.manifestUrl
 * @param {Object} props.manifest
 * @param {String} props.customErrorMessage
 * @param {String} props.emptyManifestMessage
 * @param {String} props.startCanvasId
 * @param {String} props.startCanvasTime 
 */
function IIIFPlayer(_ref) {
  var manifestUrl = _ref.manifestUrl,
    manifest = _ref.manifest,
    customErrorMessage = _ref.customErrorMessage,
    emptyManifestMessage = _ref.emptyManifestMessage,
    startCanvasId = _ref.startCanvasId,
    startCanvasTime = _ref.startCanvasTime,
    children = _ref.children;
  if (!manifestUrl && !manifest) return /*#__PURE__*/React.createElement("p", null, "Please provide a valid manifest.");
  return /*#__PURE__*/React.createElement(ErrorMessage, null, /*#__PURE__*/React.createElement(ManifestProvider, null, /*#__PURE__*/React.createElement(PlayerProvider, null, /*#__PURE__*/React.createElement(IIIFPlayerWrapper, {
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
    var _JSON$parse;
    return (_JSON$parse = JSON.parse(localStorage.getItem(key))) !== null && _JSON$parse !== void 0 ? _JSON$parse : defaultValue;
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

/** SVG icons for the edit buttons in Annotations component */
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

function _createForOfIteratorHelper$3(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$3(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$3(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$3(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$3(o, minLen); }
function _arrayLikeToArray$3(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys$6(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$6(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$6(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$6(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

/**
 * Disable each marker when one of the markers in the table
 * is being edited reading isEditing value from global
 * state and read presence of annotation service in the Manifest.
 * @returns { 
 * isDisabled: Boolean,
 * hasAnnotationService: Boolean
 * }
 */
var useMarkers = function useMarkers() {
  var manifestState = useContext(ManifestStateContext);
  var _manifestState$playli = manifestState.playlist,
    isEditing = _manifestState$playli.isEditing,
    hasAnnotationService = _manifestState$playli.hasAnnotationService;
  var isDisabled = useMemo(function () {
    return isEditing;
  }, [isEditing]);
  return {
    isDisabled: isDisabled,
    hasAnnotationService: hasAnnotationService
  };
};

/**
 * Read player and related updates as player is changed in
 * global state
 * @returns { 
 * canvasIndex: number,
 * canvasIsEmpty: bool,
 * isMultiCanvased: bool,
 * lastCanvasIndex: number,
 * player: object 
 * getCurrentTime: func, 
 * }
 */
var useMediaPlayer = function useMediaPlayer() {
  var manifestState = useContext(ManifestStateContext);
  var playerState = useContext(PlayerStateContext);
  var player = playerState.player;
  var allCanvases = manifestState.allCanvases,
    canvasIndex = manifestState.canvasIndex,
    canvasIsEmpty = manifestState.canvasIsEmpty;
  var _useState = useState(-1),
    _useState2 = _slicedToArray(_useState, 2),
    currentTime = _useState2[0],
    _setCurrentTime = _useState2[1];
  var setCurrentTime = useMemo(function () {
    return throttle_1(_setCurrentTime, 50);
  }, []);
  var playerRef = useRef(null);

  // Deduct 1 from length to compare against canvasIndex, which starts from 0
  var lastCanvasIndex = useMemo(function () {
    var _ref;
    return (_ref = (allCanvases === null || allCanvases === void 0 ? void 0 : allCanvases.length) - 1) !== null && _ref !== void 0 ? _ref : 0;
  }, [allCanvases]);
  var isMultiCanvased = useMemo(function () {
    return (allCanvases === null || allCanvases === void 0 ? void 0 : allCanvases.length) - 1 > 0 ? true : false;
  }, [allCanvases]);

  // Wrapper function to get player's time for creating a new playlist marker
  var getCurrentTime = useCallback(function () {
    if (player) {
      return player.currentTime();
    } else {
      return 0;
    }
  }, [player]);

  /**
   * Listen to player's timeupdate event to update currentTime.
   * 'currentTime' value is used in AnnotationRow component to update active
   * annotation-row.
   */
  useEffect(function () {
    if (manifestState && playerState) {
      playerRef.current = playerState.player;
    }
    if (playerRef.current) {
      playerRef.current.on('timeupdate', function () {
        setCurrentTime(playerRef.current.currentTime());
      });
    }
  }, [manifestState]);
  return {
    canvasIndex: canvasIndex,
    canvasIsEmpty: canvasIsEmpty,
    currentTime: currentTime,
    isMultiCanvased: isMultiCanvased,
    lastCanvasIndex: lastCanvasIndex,
    player: player,
    getCurrentTime: getCurrentTime
  };
};

/**
 * Read Canvas information and update state to reload player on
 * Canvas changes
 * @param {Object} obj
 * @param {Boolean} obj.enableFileDownload
 * @param {Boolean} obj.withCredentials
 * @param {Number} obj.lastCanvasIndex
 * @returns  {
 * isMultiSourced: bool,
 * isPlaylist: bool,
 * isVideo: bool,
 * nextItemClicked: func,
 * playerConfig: obj,
 * ready: bool,
 * renderingFiles: array,
 * srcIndex: number,
 * switchPlayer: func
 * }
 */
var useSetupPlayer = function useSetupPlayer(_ref2) {
  var _ref2$enableFileDownl = _ref2.enableFileDownload,
    enableFileDownload = _ref2$enableFileDownl === void 0 ? false : _ref2$enableFileDownl,
    lastCanvasIndex = _ref2.lastCanvasIndex,
    _ref2$withCredentials = _ref2.withCredentials,
    withCredentials = _ref2$withCredentials === void 0 ? false : _ref2$withCredentials;
  var manifestDispatch = useContext(ManifestDispatchContext);
  var playerDispatch = useContext(PlayerDispatchContext);
  var manifestState = useContext(ManifestStateContext);
  var allCanvases = manifestState.allCanvases,
    canvasIndex = manifestState.canvasIndex,
    customStart = manifestState.customStart,
    manifest = manifestState.manifest,
    playlist = manifestState.playlist,
    renderings = manifestState.renderings,
    srcIndex = manifestState.srcIndex;
  var isPlaylist = playlist.isPlaylist;
  var _useState3 = useState(),
    _useState4 = _slicedToArray(_useState3, 2),
    isVideo = _useState4[0],
    setIsVideo = _useState4[1];
  var _useState5 = useState({
      error: '',
      sources: [],
      tracks: [],
      poster: null,
      targets: []
    }),
    _useState6 = _slicedToArray(_useState5, 2),
    playerConfig = _useState6[0],
    setPlayerConfig = _useState6[1];
  var _useState7 = useState(),
    _useState8 = _slicedToArray(_useState7, 2),
    isMultiSourced = _useState8[0],
    setIsMultiSourced = _useState8[1];
  var _useState9 = useState(true),
    _useState10 = _slicedToArray(_useState9, 2),
    firstLoad = _useState10[0],
    setFirstLoad = _useState10[1];
  var _useState11 = useState(false),
    _useState12 = _slicedToArray(_useState11, 2),
    ready = _useState12[0],
    setReady = _useState12[1];
  var renderingFiles = useMemo(function () {
    if (enableFileDownload && renderings != {}) {
      var _renderings$manifest, _renderings$canvas$ca;
      return renderings === null || renderings === void 0 ? void 0 : (_renderings$manifest = renderings.manifest) === null || _renderings$manifest === void 0 ? void 0 : _renderings$manifest.concat(renderings === null || renderings === void 0 ? void 0 : (_renderings$canvas$ca = renderings.canvas[canvasIndex]) === null || _renderings$canvas$ca === void 0 ? void 0 : _renderings$canvas$ca.files);
    } else {
      return [];
    }
  }, [renderings, canvasIndex]);
  useEffect(function () {
    if (manifest) {
      /*
        Always start from the start time relevant to the Canvas only in playlist contexts,
        because canvases related to playlist items always start from the given start.
        With regular manifests, the start time could be different when using structured 
        navigation to switch between canvases.
      */
      if (canvasIndex == undefined || canvasIndex < 0) {
        throw new Error('Invalid canvas index. Please check your Manifest.');
      }
      initCanvas(canvasIndex, isPlaylist);
    }
    return function () {
      setReady(false);
      playerDispatch({
        player: null,
        type: 'updatePlayer'
      });
    };
  }, [manifest, canvasIndex]);

  /**
   * Initialize the next Canvas to be viewed in the player instance
   * @param {Number} canvasId index of the Canvas to be loaded into the player
   * @param {Boolean} fromStart flag to indicate how to start new player instance
   */
  var initCanvas = function initCanvas(canvasId, fromStart) {
    var _getMediaInfo = getMediaInfo({
        manifest: manifest,
        canvasIndex: canvasId,
        startTime: canvasId === customStart.startIndex && firstLoad ? customStart.startTime : 0,
        srcIndex: srcIndex,
        isPlaylist: isPlaylist
      }),
      isMultiSource = _getMediaInfo.isMultiSource,
      sources = _getMediaInfo.sources,
      tracks = _getMediaInfo.tracks,
      canvasTargets = _getMediaInfo.canvasTargets,
      mediaType = _getMediaInfo.mediaType,
      error = _getMediaInfo.error,
      poster = _getMediaInfo.poster;
    if (withCredentials) {
      sources.map(function (source) {
        return source.withCredentials = true;
      });
    }
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
    setPlayerConfig(_objectSpread$6(_objectSpread$6({}, playerConfig), {}, {
      error: error,
      sources: sources,
      tracks: tracks,
      poster: poster,
      targets: canvasTargets
    }));
    var currentCanvas = allCanvases.find(function (c) {
      return c.canvasIndex === canvasId;
    });
    // When Manifest is empty currentCanvas is null
    if (currentCanvas && !currentCanvas.isEmpty) {
      // Manifest is taken from manifest state, and is a basic object at this point
      // lacking the getLabel() function so we manually retrieve the first label.
      var manifestLabel = manifest.label ? Object.values(manifest.label)[0][0] : '';
      // Filter out falsy items in case canvas.label is null or an empty string
      var titleText = [manifestLabel, currentCanvas.label].filter(Boolean).join(' - ');
      manifestDispatch({
        canvasDuration: currentCanvas.duration,
        type: 'canvasDuration'
      });
      manifestDispatch({
        canvasLink: {
          label: titleText,
          id: currentCanvas.canvasId
        },
        type: 'canvasLink'
      });
      manifestDispatch({
        type: 'setCanvasIsEmpty',
        isEmpty: false
      });
    } else {
      playerDispatch({
        type: 'updatePlayer'
      });
      manifestDispatch({
        type: 'setCanvasIsEmpty',
        isEmpty: true
      });
      // Set poster as playerConfig.error to be used for empty Canvas message in VideoJSPlayer
      setPlayerConfig(_objectSpread$6(_objectSpread$6({}, playerConfig), {}, {
        error: poster
      }));
    }
    setIsMultiSourced(isMultiSource || false);
    error ? setReady(false) : setReady(true);
    // Reset firstLoad flag after customStart is used on initial load
    setFirstLoad(false);
  };

  /**
   * Switch player when navigating across canvases
   * @param {Number} index canvas index to be loaded into the player
   * @param {Boolean} fromStart flag to indicate set player start time to zero or not
   * @param {String} focusElement element to be focused within the player when using
   * next or previous buttons with keyboard
   */
  var switchPlayer = function switchPlayer(index, fromStart) {
    if (index != undefined && index > -1 && index <= lastCanvasIndex) {
      manifestDispatch({
        canvasIndex: index,
        type: 'switchCanvas'
      });
      initCanvas(index, fromStart);
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
  return {
    isMultiSourced: isMultiSourced,
    isPlaylist: isPlaylist,
    isVideo: isVideo,
    nextItemClicked: nextItemClicked,
    playerConfig: playerConfig,
    ready: ready,
    renderingFiles: renderingFiles,
    srcIndex: srcIndex,
    switchPlayer: switchPlayer
  };
};

/**
 * Initialize and update VideoJS instance on global state changes when
 * Canvas changes
 * @param {Object} obj
 * @param {Object} obj.options VideoJS options
 * @param {Function} obj.playerInitSetup VideoJS initialize setup func
 * @param {String} obj.startQuality selected quality stored in local storage
 * @param {Array} obj.tracks text tracks for the selected Canvas
 * @param {Function} obj.updatePlayer VideoJS update func on Canvas change
 * @param {Object} obj.videoJSRef React ref for video tag on page
 * @param {String} obj.videoJSLangMap VideoJS language for set language
 * @returns {
 * activeId: string,
 * fragmentMarker: obj,
 * isReadyRef: obj,
 * playerRef: obj,
 * setActiveId: func,
 * setFragmentMarker: func,
 * setIsReady: func,
 * }
 */
var useVideoJSPlayer = function useVideoJSPlayer(_ref3) {
  var options = _ref3.options,
    playerInitSetup = _ref3.playerInitSetup,
    startQuality = _ref3.startQuality,
    tracks = _ref3.tracks,
    updatePlayer = _ref3.updatePlayer,
    videoJSRef = _ref3.videoJSRef,
    videoJSLangMap = _ref3.videoJSLangMap;
  var manifestState = useContext(ManifestStateContext);
  var playerState = useContext(PlayerStateContext);
  var playerDispatch = useContext(PlayerDispatchContext);
  var canvasDuration = manifestState.canvasDuration,
    canvasIndex = manifestState.canvasIndex,
    canvasIsEmpty = manifestState.canvasIsEmpty,
    currentNavItem = manifestState.currentNavItem,
    playlist = manifestState.playlist;
  var currentTime = playerState.currentTime,
    isClicked = playerState.isClicked,
    player = playerState.player,
    searchMarkers = playerState.searchMarkers;
  var _useState13 = useState(''),
    _useState14 = _slicedToArray(_useState13, 2),
    activeId = _useState14[0],
    setActiveId = _useState14[1];
  var _useState15 = useState(null),
    _useState16 = _slicedToArray(_useState15, 2),
    fragmentMarker = _useState16[0],
    setFragmentMarker = _useState16[1];
  // Needs to maintain this in a state variable for useEffect for marker updates
  var _useState17 = useState(false),
    _useState18 = _slicedToArray(_useState17, 2),
    isReady = _useState18[0],
    _setIsReady = _useState18[1];
  var isReadyRef = useRef(isReady);
  var setIsReady = function setIsReady(r) {
    _setIsReady(r);
    isReadyRef.current = r;
  };
  var playerRef = useRef(null);
  var setPlayer = function setPlayer(p) {
    /**
     * When player is set to null, dispose player using Video.js' dispose()
     * method. This ensures player is reset when changing the manifest w/o a
     * page reload. e.g. changing Manifest in demo site using `Set Manifest`.
     */
    p ? playerRef.current = p : playerRef.current.dispose();
  };
  useEffect(function () {
    // Dispose Video.js instance when VideoJSPlayer component is removed
    return function () {
      if (playerRef.current) {
        setPlayer(null);
        document.removeEventListener('keydown', playerHotKeys);
        setIsReady(false);
      }
    };
  }, []);

  // Update VideoJS instance on Canvas change
  useEffect(function () {
    var _options$sources, _options$sources2;
    // Set selected quality from localStorage in Video.js options
    setSelectedQuality(options.sources);

    // Video.js player is only initialized on initial page load
    if (!playerRef.current && ((_options$sources = options.sources) === null || _options$sources === void 0 ? void 0 : _options$sources.length) > 0) {
      videojs.addLanguage(options.language, JSON.parse(videoJSLangMap));
      buildTracksHTML();

      // Turn Video.js logging off and handle errors in this code, to avoid
      // cluttering the console when loading inaccessible items.
      videojs.log.level('off');
      var _player = videojs(videoJSRef.current, options, function () {
        playerInitSetup(_player);
      });
      setPlayer(_player);

      /* Another way to add a component to the controlBar */
      // player.getChild('controlBar').addChild('vjsYo', {});

      playerDispatch({
        player: _player,
        type: 'updatePlayer'
      });
      initializeEventHandlers(_player);
    } else if (playerRef.current && ((_options$sources2 = options.sources) === null || _options$sources2 === void 0 ? void 0 : _options$sources2.length) > 0) {
      var _player2$markers;
      // Update the existing Video.js player on consecutive Canvas changes
      var _player2 = playerRef.current;

      // Reset markers
      if (activeId) (_player2$markers = _player2.markers) === null || _player2$markers === void 0 ? void 0 : _player2$markers.removeAll();
      setActiveId(null);

      // Block player while metadata is loaded when canvas is not empty
      if (!canvasIsEmpty) {
        _player2.addClass('vjs-disabled');
        setIsReady(false);
        updatePlayer(_player2);
        playerDispatch({
          player: _player2,
          type: 'updatePlayer'
        });
      } else {
        // Mark as ready to for inaccessible canvas (empty)
        setIsReady(true);
      }
    }
  }, [options.sources, videoJSRef]);
  useEffect(function () {
    if (playerRef.current) {
      var _player3 = playerRef.current;
      // Show/hide control bar for valid/inaccessible items respectively
      if (canvasIsEmpty) {
        // Set the player's aspect ratio to video
        _player3.audioOnlyMode(false);
        _player3.canvasIsEmpty = true;
        _player3.aspectRatio('16:9');
        _player3.controlBar.addClass('vjs-hidden');
        _player3.removeClass('vjs-disabled');
        _player3.pause();
        /**
         * Update the activeId to update the active item in the structured navigation.
         * For playable items this is updated in the timeupdate handler.
         */
        setActiveId(currentNavItem === null || currentNavItem === void 0 ? void 0 : currentNavItem.id);
      } else {
        // Reveal control bar; needed when loading a Canvas after an inaccessible item
        _player3.controlBar.removeClass('vjs-hidden');
      }
    }
  }, [canvasIndex, canvasIsEmpty, currentNavItem]);

  // Setting the current time of the player when using structure navigation
  useEffect(function () {
    if (playerRef.current) {
      playerRef.current.currentTime(currentTime, playerDispatch({
        type: 'resetClick'
      }));
    }
  }, [isClicked, player]);
  var markers = useMemo(function () {
    var _playlist$markers;
    if ((playlist === null || playlist === void 0 ? void 0 : (_playlist$markers = playlist.markers) === null || _playlist$markers === void 0 ? void 0 : _playlist$markers.length) > 0) {
      var canvasMarkers = playlist.markers.filter(function (m) {
        return m.canvasIndex === canvasIndex;
      });
      if ((canvasMarkers === null || canvasMarkers === void 0 ? void 0 : canvasMarkers.length) > 0) {
        return canvasMarkers[0].canvasMarkers.map(function (m) {
          return {
            time: parseFloat(m.time),
            text: m.value,
            "class": 'ramp--track-marker--playlist'
          };
        });
      }
    }
  }, [playlist.markers]);

  // Update VideoJS player's markers for search hits/playlist markers/structure navigation
  useEffect(function () {
    if (playerRef.current && playerRef.current.markers && isReady) {
      var _playerRef$current$ma;
      // markers plugin not yet initialized
      if (typeof playerRef.current.markers === 'function') {
        playerRef.current.markers({
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
      if ((markers === null || markers === void 0 ? void 0 : markers.length) > 0) {
        playlistMarkers = markers.map(function (m) {
          return {
            time: parseFloat(m.time),
            text: m.value,
            "class": 'ramp--track-marker--playlist'
          };
        });
      }
      (_playerRef$current$ma = playerRef.current.markers) === null || _playerRef$current$ma === void 0 ? void 0 : _playerRef$current$ma.removeAll();
      playerRef.current.markers.add([].concat(_toConsumableArray(fragmentMarker ? [fragmentMarker] : []), _toConsumableArray(searchMarkers), _toConsumableArray(playlistMarkers)));
    }
  }, [fragmentMarker, searchMarkers, canvasDuration, canvasIndex, playerRef.current, isReady, markers]);

  /**
   * Attach events related to player on initial setup of the VideoJS
   * instance
   * @param {Object} player 
   */
  var initializeEventHandlers = function initializeEventHandlers(player) {
    // Update player status in state only when pause is initiate by the user
    player.controlBar.getChild('PlayToggle').on('pointerdown', function () {
      handlePause();
    });
    player.on('pointerdown', function (e) {
      var elementTag = e.target.nodeName.toLowerCase();
      if (elementTag == 'video') {
        handlePause();
      }
    });
    /*
      This event handler helps to execute hotkeys functions related to 'keydown' events
      before any user interactions with the player or when focused on other non-input 
      elements on the page
    */
    document.addEventListener('keydown', function (event) {
      var result = playerHotKeys(event, playerRef.current, canvasIsEmpty);
      // Update player status in global state
      switch (result) {
        case HOTKEY_ACTION_OUTPUT.pause:
          handlePause();
          break;
      }
    });

    // Listen for resize events on desktop browsers and trigger player.resize event
    window.addEventListener('resize', function () {
      // Check if player is initialized before triggering resize event, especially helpful
      // when switching the Manifest in the demo site without a page reload
      if (player !== null && player !== void 0 && player.player_) player.trigger('resize');
    });

    /**
     * The 'resize' event on window doesn't catch zoom in/out in iOS Safari.
     * Therefore, use window.visualViewport to detect zoom in/out in mobile browsers when
     * zoomed in/out using OS/browser settings.
     */
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', function () {
        // Check if player is initialized before triggering resize event, especially helpful
        // when switching the Manifest in the demo site without a page reload
        if (player !== null && player !== void 0 && player.player_) player.trigger('resize');
      });
    }
  };

  /**
   * Update global state only when a user pause the player by using the
   * player interface or keyboard shortcuts
   */
  var handlePause = function handlePause() {
    playerDispatch({
      isPlaying: false,
      type: 'setPlayingStatus'
    });
  };
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
  return {
    activeId: activeId,
    fragmentMarker: fragmentMarker,
    isReadyRef: isReadyRef,
    playerRef: playerRef,
    setActiveId: setActiveId,
    setFragmentMarker: setFragmentMarker,
    setIsReady: setIsReady
  };
};

/**
 * Handle display of inaccessible message timer and interval for
 * countdown
 * @param {Object} obj
 * @param {Number} obj.lastCanvasIndex
 * @returns {
 * messageTime: number,
 * clearCanvasMessageTimer: func,
 * createCanvasMessageTimer: func
 * }
 */
var useShowInaccessibleMessage = function useShowInaccessibleMessage(_ref4) {
  var lastCanvasIndex = _ref4.lastCanvasIndex;
  var manifestDispatch = useContext(ManifestDispatchContext);
  var manifestState = useContext(ManifestStateContext);
  var autoAdvance = manifestState.autoAdvance,
    canvasIndex = manifestState.canvasIndex,
    canvasIsEmpty = manifestState.canvasIsEmpty;
  var _useState19 = useState(CANVAS_MESSAGE_TIMEOUT / 1000),
    _useState20 = _slicedToArray(_useState19, 2),
    messageTime = _useState20[0],
    setMessageTime = _useState20[1];
  var messageIntervalRef = useRef(null);
  useEffect(function () {
    // Clear existing interval for inaccessible message display
    clearDisplayTimeInterval();
    if (canvasIsEmpty && !messageIntervalRef.current && autoAdvance) {
      setMessageTime(CANVAS_MESSAGE_TIMEOUT / 1000);
      createDisplayTimeInterval();
    }
  }, [canvasIndex, autoAdvance, canvasIsEmpty]);

  /**
   * Create an interval to run every second to update display for the timer
   * for inaccessible canvas message display. Using useCallback to cache the
   * function as this doesn't need to change with component re-renders
   */
  var createDisplayTimeInterval = useCallback(function () {
    var createTime = new Date().getTime();
    messageIntervalRef.current = setInterval(function () {
      var now = new Date().getTime();
      var timeRemaining = (CANVAS_MESSAGE_TIMEOUT - (now - createTime)) / 1000;
      if (timeRemaining > 0) {
        setMessageTime(Math.ceil(timeRemaining));
      } else {
        // Advance to next Canvas when timer ends
        if (canvasIndex < lastCanvasIndex && autoAdvance) {
          manifestDispatch({
            canvasIndex: canvasIndex + 1,
            type: 'switchCanvas'
          });
        }
        clearDisplayTimeInterval();
      }
    }, 1000);
  });

  // Cleanup interval created for timer display for inaccessible message
  var clearDisplayTimeInterval = useCallback(function () {
    clearInterval(messageIntervalRef.current);
    messageIntervalRef.current = null;
  });
  return {
    messageTime: messageTime,
    clearDisplayTimeInterval: clearDisplayTimeInterval,
    createDisplayTimeInterval: createDisplayTimeInterval
  };
};

/**
 * Handle global state updates and local state updates for structured
 * navigation related components based on the user interactions and
 * player status updates
 * @param {Object} obj
 * @param {Number} obj.itemIndex
 * @param {Boolean} obj.isRoot 
 * @param {String} obj.itemId URL of the struct item
 * @param {Object} obj.liRef React ref for li element for struct item
 * @param {Object} obj.sectionRef React ref for collapsible ul element
 * @param {Object} obj.structureContainerRef React ref for the structure container
 * @param {Boolean} obj.isCanvas
 * @param {Boolean} obj.isEmpty is a restricted item
 * @param {Number} obj.canvasDuration
 * @param {Function} obj.setSectionIsCollapsed
 * @param {Object} obj.times start and end times of the structure timespan
 * @returns { 
 * canvasIndex,
 * currentNavItem,
 * handleClick,
 * isActiveLi,
 * isActiveSection,
 * isPlaylist,
 * screenReaderTime
 * }
 */
var useActiveStructure = function useActiveStructure(_ref5) {
  var itemIndex = _ref5.itemIndex,
    isRoot = _ref5.isRoot,
    itemId = _ref5.itemId,
    liRef = _ref5.liRef,
    sectionRef = _ref5.sectionRef,
    structureContainerRef = _ref5.structureContainerRef,
    isCanvas = _ref5.isCanvas,
    isEmpty = _ref5.isEmpty,
    canvasDuration = _ref5.canvasDuration,
    setSectionIsCollapsed = _ref5.setSectionIsCollapsed,
    times = _ref5.times;
  var playerDispatch = useContext(PlayerDispatchContext);
  var manifestState = useContext(ManifestStateContext);
  var canvasIndex = manifestState.canvasIndex,
    currentNavItem = manifestState.currentNavItem,
    playlist = manifestState.playlist;
  var isPlaylist = playlist.isPlaylist;
  var playerState = useContext(PlayerStateContext);
  var isPlaying = playerState.isPlaying;
  var isActiveLi = useMemo(function () {
    return itemId != undefined && (currentNavItem === null || currentNavItem === void 0 ? void 0 : currentNavItem.id) === itemId && (isPlaylist || !isCanvas) && (currentNavItem === null || currentNavItem === void 0 ? void 0 : currentNavItem.canvasIndex) === canvasIndex + 1 ? true : false;
  }, [currentNavItem, canvasIndex]);
  var isActiveSection = useMemo(function () {
    var isCurrentSection = canvasIndex + 1 === itemIndex;
    // Do not mark root range as active
    // Expand section when current section is played
    if (isCurrentSection && (!isRoot || isPlaying)) {
      // Expand the section by setting sectionIsCollapsed=false in TreeNode
      setSectionIsCollapsed(false);
      return true;
    } else {
      return false;
    }
  }, [canvasIndex, isPlaying]);

  // Convert timestamp to a text read as a human
  var screenReaderTime = useMemo(function () {
    if (times != undefined) {
      return screenReaderFriendlyTime(times.start);
    } else {
      return '';
    }
  }, [itemId, canvasDuration]);
  var handleClick = useCallback(function (e) {
    e.preventDefault();
    e.stopPropagation();
    var start = times.start,
      end = times.end;
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
        clickedUrl: itemId,
        type: 'navClick'
      });
      liRef.current.isClicked = true;
      if (sectionRef.current) {
        sectionRef.current.isClicked = true;
      }
      // Update content of aria-live to notify the player update to user via assistive technologies
      // for non-restricted items.
      var screenReaderElement = structureContainerRef.current.querySelector('[aria-live="assertive"]');
      if (screenReaderElement) {
        if (isCanvas) {
          // Section click, navigates to a new Canvas
          screenReaderElement.textContent = "Player seeked to ".concat(screenReaderTime, " in Canvas ").concat(itemIndex);
        } else if (!isEmpty) {
          // Non-empty timespan click, seeks the player
          screenReaderElement.textContent = "Player seeked to ".concat(screenReaderTime);
        }
      }
    }
  });
  return {
    canvasIndex: canvasIndex,
    currentNavItem: currentNavItem,
    handleClick: handleClick,
    isActiveLi: isActiveLi,
    isActiveSection: isActiveSection,
    isPlaylist: isPlaylist,
    screenReaderTime: screenReaderTime
  };
};

/**
 * Enable collapse/expand all sections when collapse/expand all
 * section button is enabled in StructuredNavigation component
 * @returns {
 * collapseExpandAll,
 * isCollapsed,
 * updateSectionStatus,
 * }
 */
var useCollapseExpandAll = function useCollapseExpandAll() {
  var manifestDispatch = useContext(ManifestDispatchContext);
  var manifestState = useContext(ManifestStateContext);
  var canvasIndex = manifestState.canvasIndex;
  var _manifestState$struct = manifestState.structures,
    isCollapsed = _manifestState$struct.isCollapsed,
    structItems = _manifestState$struct.structItems;
  var playerState = useContext(PlayerStateContext);
  var isPlaying = playerState.isPlaying;

  // Mark collapsible structure sections on inital load
  var collapsibleStructure = useMemo(function () {
    return (structItems === null || structItems === void 0 ? void 0 : structItems.length) > 0 && structItems.map(function (s) {
      var _s$items;
      // s.collapseStatus == undefined stops changing these values on subsequent updates
      if (((_s$items = s.items) === null || _s$items === void 0 ? void 0 : _s$items.length) > 0 && s.collapseStatus == undefined) {
        // Using Strings instead of Boolean for easier understanding of code
        s.collapseStatus = isCollapsed ? 'isCollapsed' : 'isExpanded';
      }
      return s;
    });
  }, []);

  /**
   * Update section's 'collapseStatus' on playback status 
   * or Canvas change
   */
  useEffect(function () {
    if (isPlaying) {
      updateSectionStatus(canvasIndex, false);
    }
  }, [isPlaying, canvasIndex]);

  /**
   * Update 'isCollapsed' status for all sections in global state and
   * for each section in 'collapsibleStructure' local variable.
   */
  var collapseExpandAll = useCallback(function () {
    var updated = !isCollapsed;
    manifestDispatch({
      type: 'setIsCollapsed',
      isCollapsed: updated
    });

    // Update each section's 'collapseStatus' property
    for (var i = collapsibleStructure.length - 1; i > -1; i--) {
      updateSection(i, updated);
    }
  });

  /**
   * Update each section's collapse status when interacting with a section's
   * collapse/expand button or playback.
   * When all sections are changed manually update the global state to reflect
   * the changed status in the 'CollapseExpandButton' for all sections.
   * @param {Number} index section's respective canvas index in Manifest
   * @param {Boolean} status updated status for collapsible structure for the section
   */
  var updateSectionStatus = function updateSectionStatus(index, status) {
    updateSection(index, status);

    // Convert global status into a string value
    var allSectionStatus = isCollapsed ? 'isCollapsed' : 'isExpanded';

    // Get all sections' statuses
    var eachSectionStatus = collapsibleStructure.map(function (s) {
      return s.collapseStatus;
    }).filter(function (c) {
      return c != undefined;
    });
    if ((eachSectionStatus === null || eachSectionStatus === void 0 ? void 0 : eachSectionStatus.length) > 0) {
      // Check all sections have the same status
      var allSectionsHaveChanged = eachSectionStatus.every(function (s) {
        return s === eachSectionStatus[0];
      });

      // Update global state when all sections have been updated manually
      if (allSectionsHaveChanged && eachSectionStatus[0] != allSectionStatus) {
        collapseExpandAll();
      }
    }
  };

  /**
   * Wrapper function to update 'collapseStatus' property in 'collapsibleStructure' 
   * array for a given section
   * @param {Number} index 
   * @param {Boolean} status 
   */
  var updateSection = function updateSection(index, status) {
    var _collapsibleStructure, _collapsibleStructure2;
    // Only update 'collapseStatus' property for sections with children
    if (((_collapsibleStructure = collapsibleStructure[index]) === null || _collapsibleStructure === void 0 ? void 0 : (_collapsibleStructure2 = _collapsibleStructure.items) === null || _collapsibleStructure2 === void 0 ? void 0 : _collapsibleStructure2.length) > 0) {
      collapsibleStructure[index].collapseStatus = status ? 'isCollapsed' : 'isExpanded';
    }
  };
  return {
    collapseExpandAll: collapseExpandAll,
    isCollapsed: isCollapsed,
    updateSectionStatus: updateSectionStatus
  };
};

/**
 * State handling and setup for transcripts
 * @param {Object} obj
 * @param {String} obj.manifestUrl
 * @param {String} obj.playerID
 * @param {Function} obj.setCurrentTime 
 * @param {Boolean} obj.showMetadata
 * @param {Boolean} obj.showNotes
 * @param {Array} obj.transcripts
 * @returns {
 * canvasIndexRef,
 * canvasTranscripts,
 * isEmpty,
 * isLoading,
 * NO_SUPPORT_MSG,
 * playerRef,
 * selectedTranscript,
 * selectTranscript,
 * transcript,
 * transcriptInfo
 * }
 */
var useTranscripts = function useTranscripts(_ref6) {
  var manifestUrl = _ref6.manifestUrl,
    playerID = _ref6.playerID,
    setCurrentTime = _ref6.setCurrentTime,
    showMetadata = _ref6.showMetadata,
    showNotes = _ref6.showNotes,
    transcripts = _ref6.transcripts;
  var manifestState = useContext(ManifestStateContext);
  var playerState = useContext(PlayerStateContext);
  var NO_TRANSCRIPTS_MSG = 'No valid Transcript(s) found, please check again.';
  var INVALID_URL_MSG = 'Invalid URL for transcript, please check again.';
  var INVALID_VTT = 'Invalid WebVTT file, please check again.';
  var INVALID_TIMESTAMP = 'Invalid timestamp format in cue(s), please check again.';
  var NO_SUPPORT_MSG = 'Transcript format is not supported, please check again.';
  var abortController = new AbortController();
  var canvasIndexRef = useRef();
  var setCanvasIndex = function setCanvasIndex(c) {
    abortController.abort();
    canvasIndexRef.current = c;
  };
  var playerRef = useRef(null);
  var playerIntervalRef = useRef(null);
  var _useState21 = useState(true),
    _useState22 = _slicedToArray(_useState21, 2),
    isEmpty = _useState22[0],
    setIsEmpty = _useState22[1];
  var _useState23 = useState(true),
    _useState24 = _slicedToArray(_useState23, 2),
    isLoading = _useState24[0],
    setIsLoading = _useState24[1];
  var _useState25 = useState([]),
    _useState26 = _slicedToArray(_useState25, 2),
    transcript = _useState26[0],
    setTranscript = _useState26[1];
  var _useState27 = useState([]),
    _useState28 = _slicedToArray(_useState27, 2),
    transcriptsList = _useState28[0],
    setTranscriptsList = _useState28[1];
  var _useState29 = useState({
      title: null,
      filename: null,
      id: null,
      tUrl: null,
      tType: null,
      tFileExt: null,
      isMachineGen: false,
      tError: null
    }),
    _useState30 = _slicedToArray(_useState29, 2),
    transcriptInfo = _useState30[0],
    setTranscriptInfo = _useState30[1];
  var _useState31 = useState([]),
    _useState32 = _slicedToArray(_useState31, 2),
    canvasTranscripts = _useState32[0],
    setCanvasTranscripts = _useState32[1];
  // Store transcript data in state to avoid re-requesting file contents
  var _useState33 = useState([]),
    _useState34 = _slicedToArray(_useState33, 2),
    cachedTranscripts = _useState34[0],
    setCachedTranscripts = _useState34[1];
  var _useState35 = useState({
      url: '',
      isTimed: false
    }),
    _useState36 = _slicedToArray(_useState35, 2),
    selectedTranscript = _useState36[0],
    setSelectedTranscript = _useState36[1];

  // Read annotations from ManifestState if it exists
  var annotations = useMemo(function () {
    return manifestState === undefined ? [] : manifestState.annotations;
  }, [manifestState]);
  var transcriptParseAbort = useRef(null);

  /**
   * Start an interval at the start of the component to poll the
   * canvasindex attribute changes in the player on the page
   */
  useEffect(function () {
    if (manifestState && playerState) {
      canvasIndexRef.current = manifestState.canvasIndex;
      playerRef.current = playerState.player;
    } else {
      playerIntervalRef.current = setInterval(function () {
        var domPlayer = document.getElementById(playerID);
        if (!domPlayer) {
          console.warn("Cannot find player, ".concat(playerID, " on page. Transcript synchronization is disabled"));
          // Inaccessible canvas => stop loading spinner
          setIsLoading(false);
        } else {
          if (domPlayer.player) playerRef.current = domPlayer.player;else playerRef.current = domPlayer;
        }
        if (playerRef.current) {
          var cIndex = parseInt(playerRef.current.canvasIndex);
          if (Number.isNaN(cIndex)) cIndex = 0;
          if (cIndex !== canvasIndexRef.current) {
            // Clear the transcript text in the component
            setTranscript([]);
            setCanvasIndex(cIndex);
            setCurrentTime(playerRef.current.currentTime());
          }
        }
      }, 500);
    }
    if (playerRef.current) {
      playerRef.current.on('timeupdate', function () {
        setCurrentTime(playerRef.current.currentTime());
      });
    }
  }, [manifestState]);
  useEffect(function () {
    if ((transcripts === null || transcripts === void 0 ? void 0 : transcripts.length) === 0 && !manifestUrl) {
      // When both required props are invalid
      setIsLoading(false);
      setTranscript([]);
      setTranscriptInfo({
        tType: TRANSCRIPT_TYPES.noTranscript,
        id: '',
        tError: NO_TRANSCRIPTS_MSG
      });
    } else if ((annotations === null || annotations === void 0 ? void 0 : annotations.length) > 0 && (transcripts === null || transcripts === void 0 ? void 0 : transcripts.length) === 0) {
      var _transcriptParseAbort, _canvasAnnotations$0$;
      /* 
      When annotations are present in global state and transcripts prop is not set
      use the parsed annotations to load transcripts instead of fetching and
      parsing the Manifest content again
       */
      transcriptParseAbort === null || transcriptParseAbort === void 0 ? void 0 : (_transcriptParseAbort = transcriptParseAbort.current) === null || _transcriptParseAbort === void 0 ? void 0 : _transcriptParseAbort.abort();
      var canvasAnnotations = annotations.filter(function (a) {
        return a.canvasIndex == canvasIndexRef.current;
      });
      if ((canvasAnnotations === null || canvasAnnotations === void 0 ? void 0 : canvasAnnotations.length) > 0 && ((_canvasAnnotations$0$ = canvasAnnotations[0].annotationSets) === null || _canvasAnnotations$0$ === void 0 ? void 0 : _canvasAnnotations$0$.length) > 0) {
        // Filter supplementing annotations from all annotations in the Canvas
        var transcriptAnnotations = canvasAnnotations[0].annotationSets.filter(function (as) {
          var _as$motivation;
          return (_as$motivation = as.motivation) === null || _as$motivation === void 0 ? void 0 : _as$motivation.includes('supplementing');
        });
        // Convert annotations into Transcript component friendly format
        var transcriptItems = (transcriptAnnotations === null || transcriptAnnotations === void 0 ? void 0 : transcriptAnnotations.length) > 0 ? transcriptAnnotations.map(function (t, index) {
          var filename = t.filename,
            format = t.format,
            label = t.label,
            url = t.url;
          var _identifyMachineGen = identifyMachineGen(label),
            isMachineGen = _identifyMachineGen.isMachineGen,
            labelText = _identifyMachineGen.labelText;
          return {
            id: "".concat(labelText, "-").concat(canvasIndexRef.current, "-").concat(index),
            filename: filename,
            format: format,
            isMachineGen: isMachineGen,
            title: labelText,
            url: url
          };
        }) : [];
        var allTranscripts = [].concat(_toConsumableArray(transcriptsList), [{
          canvasId: canvasIndexRef.current,
          items: transcriptItems
        }]);
        setTranscriptsList(allTranscripts !== null && allTranscripts !== void 0 ? allTranscripts : []);
        initTranscriptData(allTranscripts !== null && allTranscripts !== void 0 ? allTranscripts : []);
      }
    } else {
      transcriptParseAbort.current = new AbortController();
      loadTranscripts(transcripts);
    }
  }, [annotations]);
  useEffect(function () {
    // Clean up when the component unmounts
    return function () {
      var _transcriptParseAbort2;
      clearInterval(playerIntervalRef.current);
      (_transcriptParseAbort2 = transcriptParseAbort.current) === null || _transcriptParseAbort2 === void 0 ? void 0 : _transcriptParseAbort2.abort();
      abortController === null || abortController === void 0 ? void 0 : abortController.abort();
    };
  }, []);

  /**
   * If a list of transcripts is given in the props, then sanitize them
   * to match the expected format in the component.
   * If not fallback to reading transcripts from a given manifest URL.
   * @param {Array} transcripts list of transcripts from props
   */
  var loadTranscripts = /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(transcripts) {
      var allTranscripts;
      return regenerator.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (!((transcripts === null || transcripts === void 0 ? void 0 : transcripts.length) > 0
            // transcripts prop is processed first if given
            )) {
              _context.next = 6;
              break;
            }
            _context.next = 3;
            return sanitizeTranscripts(transcripts);
          case 3:
            _context.t0 = _context.sent;
            _context.next = 9;
            break;
          case 6:
            _context.next = 8;
            return readSupplementingAnnotations(manifestUrl, '', transcriptParseAbort.current.signal);
          case 8:
            _context.t0 = _context.sent;
          case 9:
            allTranscripts = _context.t0;
            if (!transcriptParseAbort.current.signal.aborted) {
              _context.next = 14;
              break;
            }
            return _context.abrupt("return");
          case 14:
            setTranscriptsList(allTranscripts !== null && allTranscripts !== void 0 ? allTranscripts : []);
            initTranscriptData(allTranscripts !== null && allTranscripts !== void 0 ? allTranscripts : []);
          case 16:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function loadTranscripts(_x) {
      return _ref7.apply(this, arguments);
    };
  }();
  var initTranscriptData = function initTranscriptData(allTranscripts) {
    var _getCanvasT, _getTItems;
    // When canvasIndex updates -> return
    if (abortController.signal.aborted) return;
    var getCanvasT = function getCanvasT(tr) {
      return tr.filter(function (t) {
        return t.canvasId == canvasIndexRef.current;
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
  useEffect(function () {
    if ((transcriptsList === null || transcriptsList === void 0 ? void 0 : transcriptsList.length) > 0 && canvasIndexRef.current != undefined) {
      var cTranscripts = transcriptsList.filter(function (tr) {
        return tr.canvasId == canvasIndexRef.current;
      })[0];
      setCanvasTranscripts(cTranscripts === null || cTranscripts === void 0 ? void 0 : cTranscripts.items);
      setStateVar(cTranscripts === null || cTranscripts === void 0 ? void 0 : cTranscripts.items[0]);
    }
  }, [canvasIndexRef.current]); // helps to load initial transcript with async req

  var setStateVar = /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(transcript) {
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
            setSelectedTranscript({
              url: url,
              isTimed: tType == TRANSCRIPT_TYPES.timedText
            });
            _context2.next = 17;
            break;
          case 15:
            _context2.next = 17;
            return Promise.resolve(parseTranscriptData(url, format, canvasIndexRef.current, showMetadata, showNotes)).then(function (value) {
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
                    newError = NO_SUPPORT_MSG;
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
                setSelectedTranscript({
                  url: tUrl,
                  isTimed: _tType == TRANSCRIPT_TYPES.timedText
                });
                transcript = _objectSpread$6(_objectSpread$6({}, transcript), {}, {
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
    return function setStateVar(_x2) {
      return _ref8.apply(this, arguments);
    };
  }();
  var selectTranscript = useCallback(function (selectedId) {
    var selectedTranscript = canvasTranscripts.filter(function (tr) {
      return tr.id === selectedId;
    });
    setStateVar(selectedTranscript[0]);
  }, [canvasTranscripts]);
  return {
    canvasIndexRef: canvasIndexRef,
    canvasTranscripts: canvasTranscripts,
    isEmpty: isEmpty,
    isLoading: isLoading,
    NO_SUPPORT_MSG: NO_SUPPORT_MSG,
    playerRef: playerRef,
    selectedTranscript: selectedTranscript,
    selectTranscript: selectTranscript,
    transcript: transcript,
    transcriptInfo: transcriptInfo
  };
};

/**
 * Global state handling related to annotations row display
 * @param {Object} obj
 * @param {Number} obj.annotationId
 * @param {String} obj.canvasId
 * @param {Number} obj.startTime
 * @param {Number} obj.endTime
 * @param {Number} obj.currentTime
 * @param {Array} obj.displayedAnnotations
 * @returns {
 *  checkCanvas,
 *  inPlayerRange,
 * }
 */
var useAnnotationRow = function useAnnotationRow(_ref9) {
  var annotationId = _ref9.annotationId,
    canvasId = _ref9.canvasId,
    startTime = _ref9.startTime,
    endTime = _ref9.endTime,
    currentTime = _ref9.currentTime,
    _ref9$displayedAnnota = _ref9.displayedAnnotations,
    displayedAnnotations = _ref9$displayedAnnota === void 0 ? [] : _ref9$displayedAnnota;
  var manifestState = useContext(ManifestStateContext);
  var manifestDispatch = useContext(ManifestDispatchContext);
  var allCanvases = manifestState.allCanvases,
    canvasIndex = manifestState.canvasIndex,
    clickedAnnotation = manifestState.clickedAnnotation;
  var isCurrentCanvas = useMemo(function () {
    return allCanvases[canvasIndex].canvasId == canvasId;
  }, [canvasId, canvasIndex]);

  /**
   * Update current Canvas in state if the clicked Annotation is pointing
   * to a different Canvas within the given Manifest
   */
  var checkCanvas = useCallback(function (a) {
    if (!isCurrentCanvas) {
      var clickedCanvas = allCanvases.filter(function (c) {
        return c.canvasId === canvasId;
      });
      if ((clickedCanvas === null || clickedCanvas === void 0 ? void 0 : clickedCanvas.length) > 0) {
        var currentCanvas = clickedCanvas[0];
        manifestDispatch({
          canvasIndex: currentCanvas.canvasIndex,
          type: 'switchCanvas'
        });
      }
    }
    // Set the clicked annotation in global state
    manifestDispatch({
      clickedAnnotation: a,
      type: 'setClickedAnnotation'
    });
  }, [isCurrentCanvas]);

  /**
   * Use the current annotation's startTime and endTime in comparison with the startTime
   * of the next annotation in the list to mark an annotation as active.
   * When auto-scrolling is enabled, this is used by the AnnotationRow component to
   * highlight and scroll the active annotation to the top of the container.
   */
  var inPlayerRange = useMemo(function () {
    var _nextAnnotation$time;
    // Index of the current annotation
    var currentAnnotationIndex = displayedAnnotations.findIndex(function (a) {
      var _a$time;
      return ((_a$time = a.time) === null || _a$time === void 0 ? void 0 : _a$time.start) === startTime;
    });
    // Retrieve the next annotation in the list if it exists
    var nextAnnotation = currentAnnotationIndex < (displayedAnnotations === null || displayedAnnotations === void 0 ? void 0 : displayedAnnotations.length) && currentAnnotationIndex > -1 ? displayedAnnotations[currentAnnotationIndex + 1] : undefined;
    // If there's a next annotation, retrieve its start time
    var nextAnnotationStartTime = nextAnnotation != undefined ? (_nextAnnotation$time = nextAnnotation.time) === null || _nextAnnotation$time === void 0 ? void 0 : _nextAnnotation$time.start : undefined;

    // Filter annotations that has a start time less than or equal to the currentTime
    var activeAnnotations = displayedAnnotations.filter(function (a) {
      var _a$time2;
      return ((_a$time2 = a.time) === null || _a$time2 === void 0 ? void 0 : _a$time2.start) <= currentTime;
    });

    /**
     * IF there's a clicked annotation stored in global state, return the clicked annotation
     * if it matches the current annotation. Once the player's currentTime is out of the range
     * of the clicked annotation, clear it in global state.
     * 
     * ELSE IF there are possible active annotations with a start time less than or equal to the currentTime,
     * get the last annotation on that list. 
     * 
     * If the last active annotation is the current annotation mark it as active. Uses start times of
     * possible lastAnnotation and current annotation as they are unique to each annotation;
     *  - for time-point annotations, compare only the start times. Assumption:: the annotation has an implicit
     *    time range from its start time till the start time of the next annotation on the list
     *  - for time-range annotations, consider endTime to check whether currentTime is in the current
     *    annotation's time range
     * OR 
     * if the currentTime is within the range of the current annotation's startTime and endTime
     * without exceeding the next annotation's start time, mark the current annotation as active.
     * 
     * Here current annotation is referring to the AnnotationRow instance calling this function.
     */
    if (clickedAnnotation != null) {
      // Return annotation that matches the clicked annotation
      if (clickedAnnotation.id === annotationId) {
        return true;
      }
      /**
       * Once the player's current time is either,
       * - out of range of a clicked time-range annotation OR
       * - greater than the start time of a clicked time-point annotation
       * clear the value of clickedAnnotation in global state
       */
      if (clickedAnnotation.time.end === undefined && clickedAnnotation.time.start != currentTime || clickedAnnotation.time.start > currentTime || clickedAnnotation.time.end < currentTime) {
        // Use setTimeout to add this into event queue instead calling it immediately resulting a bad state
        setTimeout(function () {
          manifestDispatch({
            clickedAnnotation: null,
            type: 'setClickedAnnotation'
          });
        }, 0);
      }
    } else if ((activeAnnotations === null || activeAnnotations === void 0 ? void 0 : activeAnnotations.length) > 0) {
      var _lastAnnotation$time;
      var lastAnnotation = activeAnnotations[activeAnnotations.length - 1];
      if (lastAnnotation.time.start === startTime && endTime === undefined || ((_lastAnnotation$time = lastAnnotation.time) === null || _lastAnnotation$time === void 0 ? void 0 : _lastAnnotation$time.start) === startTime && currentTime <= endTime || nextAnnotationStartTime != undefined && currentTime < nextAnnotationStartTime && startTime <= currentTime && currentTime <= endTime) {
        return true;
      } else {
        return false;
      }
    }
  }, [currentTime, displayedAnnotations]);
  return {
    checkCanvas: checkCanvas,
    inPlayerRange: inPlayerRange
  };
};

/**
 * Handle global state updates related to annotations and markers;
 * - Parse and store annotations in global state from Manifest on inital load.
 * - Update markers in global state in playlist context when Canvas changes.
*/
var useAnnotations = function useAnnotations() {
  var manifestState = useContext(ManifestStateContext);
  var manifestDispatch = useContext(ManifestDispatchContext);
  var annotations = manifestState.annotations,
    canvasIndex = manifestState.canvasIndex,
    manifest = manifestState.manifest,
    playlist = manifestState.playlist;
  var isPlaylist = playlist.isPlaylist;

  // Parse annotations once Manifest is loaded initially
  useEffect(function () {
    if (((annotations === null || annotations === void 0 ? void 0 : annotations.length) > 0 || (annotations === null || annotations === void 0 ? void 0 : annotations.filter(function (a) {
      return a.canvasIndex === canvasIndex;
    }).length) === 0) && manifest !== null) {
      var annotationSet = parseAnnotationSets(manifest, canvasIndex);
      manifestDispatch({
        annotations: annotationSet,
        type: 'setAnnotations'
      });
    }
  }, [manifest]);

  /**
   * Update markers array in playlist context in the global state when
   * Canvas changes.
   */
  useEffect(function () {
    if (isPlaylist && (annotations === null || annotations === void 0 ? void 0 : annotations.length) > 0) {
      // Check if annotations are available for the current Canvas
      var markers = annotations.filter(function (a) {
        return a.canvasIndex === canvasIndex;
      });
      var canvasMarkers = [];
      // Filter all markers from annotationSets for the current Canvas
      if ((markers === null || markers === void 0 ? void 0 : markers.length) > 0) {
        var _markers$ = markers[0];
          _markers$._;
          var annotationSets = _markers$.annotationSets;
        canvasMarkers = annotationSets.map(function (a) {
          return a.markers;
        }).filter(function (m) {
          return m != undefined;
        }).flat();
      }
      // Update markers in global state
      manifestDispatch({
        markers: {
          canvasIndex: canvasIndex,
          canvasMarkers: canvasMarkers
        },
        type: 'setPlaylistMarkers'
      });
    }
  }, [isPlaylist, canvasIndex, annotations]);
};

/**
 * 
 * @param {Object} obj
 * @param {Boolean} obj.autoScrollEnabled
 * @param {Boolean} obj.enableShowMore
 * @param {Boolean} obj.inPlayerRange
 * @param {Number} obj.MAX_LINES
 * @param {Object} obj.refs
 * @param {Function} obj.setIsShowMoreRef
 * @param {Function} obj.setIsActive
 * @param {Array} obj.tags
 * @param {Array} obj.texts 
 * @returns {
 *  hasLongerTags,
 *  hasLongerText,
 *  setShowMoreTags,
 *  showMoreTags,
 *  setTextToShow,
 *  textToShow,
 *  toggleTagsView,
 *  truncatedText
 * }
 */
var useShowMoreOrLess = function useShowMoreOrLess(_ref10) {
  var autoScrollEnabled = _ref10.autoScrollEnabled,
    enableShowMore = _ref10.enableShowMore,
    inPlayerRange = _ref10.inPlayerRange,
    MAX_LINES = _ref10.MAX_LINES,
    refs = _ref10.refs,
    setIsShowMoreRef = _ref10.setIsShowMoreRef,
    setIsActive = _ref10.setIsActive,
    tags = _ref10.tags,
    texts = _ref10.texts;
  var annotationRef = refs.annotationRef,
    annotationTagsRef = refs.annotationTagsRef,
    annotationTextsRef = refs.annotationTextsRef,
    annotationTimesRef = refs.annotationTimesRef,
    containerRef = refs.containerRef,
    moreTagsButtonRef = refs.moreTagsButtonRef;
  // Text displayed for the annotation
  var _useState37 = useState(0),
    _useState38 = _slicedToArray(_useState37, 2),
    textToShow = _useState38[0],
    setTextToShow = _useState38[1];
  // If annotation has a longer text; truncated text to fit number of MAX_LINES in the display
  var _useState39 = useState(''),
    _useState40 = _slicedToArray(_useState39, 2),
    truncatedText = _useState40[0],
    setTruncatedText = _useState40[1];
  var _useState41 = useState(false),
    _useState42 = _slicedToArray(_useState41, 2),
    hasLongerText = _useState42[0],
    setHasLongerText = _useState42[1];
  // State variables to store information related to overflowing tags in the annotation
  var _useState43 = useState(false),
    _useState44 = _slicedToArray(_useState43, 2),
    hasLongerTags = _useState44[0],
    setLongerTags = _useState44[1];
  var _useState45 = useState(false),
    _useState46 = _slicedToArray(_useState45, 2),
    showMoreTags = _useState46[0],
    setShowMoreTags = _useState46[1];

  /**
   * When there multiple annotations in the same time range, auto-scroll to
   * the annotation with the start time that is closest to the current time
   * of the player.
   * This allows a better user experience when auto-scroll is enabled during playback, 
   * and there are multiple annotations that falls within the same time range.
   */
  useEffect(function () {
    inPlayerRange ? setIsActive(true) : setIsActive(false);
    if (autoScrollEnabled && inPlayerRange) {
      autoScroll(annotationRef.current, containerRef, true);
    }
  }, [inPlayerRange]);

  /**
   * Truncate annotation text based on the width of the element on the page.
   * Use a ResizeObserver to re-calculate truncated texts based on Annotations
   * container re-size events
   */
  useEffect(function () {
    var textBlock = annotationTextsRef.current;
    var canvas, observer;
    var calcTruncatedText = function calcTruncatedText() {
      if (textBlock && (texts === null || texts === void 0 ? void 0 : texts.length) > 0) {
        var textBlockWidth = textBlock.clientWidth;
        var fontSize = parseFloat(getComputedStyle(textBlock).fontSize);
        if (!isNaN(fontSize)) {
          // Create a temporary canvas element to measure average character width
          canvas = document.createElement('canvas');
          var context = canvas.getContext('2d');
          context.font = getComputedStyle(textBlock).font;

          // Calculate average character width based on the specified font in CSS
          var textWidth = context.measureText(texts).width;
          var avgCharWidth = textWidth / texts.length;

          // Calculate maximum number of characters that can be shown on avg character width
          var charsPerLine = textBlockWidth / avgCharWidth;

          /**
           * To account for spaces at the end of line breaks, calculate max character for
           * half a line width less than given MAX_LINES count
           */
          var maxCharactersToShow = charsPerLine * (MAX_LINES - 1) + Math.floor(charsPerLine / 2);
          var elementText = texts;

          /**
           * When texts has line breaks with shorter text in each line, pad each shorter line 
           * until the length of it reaches the calculated charsPerLine number
           */
          if (texts.includes('<br>')) {
            var lines = texts.split('<br>');
            var paddedText = [];
            for (var i = 0; i < lines.length; i++) {
              var line = lines[i];
              if (line.length < charsPerLine) {
                // Account for the space for <br> for line breaks
                var maxLineLength = charsPerLine > 4 ? charsPerLine - 4 : 0;
                paddedText.push(line.padEnd(maxLineLength));
              } else {
                // Do nothing if text length is longer than charsPerLine
                paddedText.push(line);
              }
            }
            elementText = paddedText.join('<br>');
          }

          // Truncate text if the annotation text is longer than max character count
          var _truncateText = truncateText(elementText, maxCharactersToShow),
            truncated = _truncateText.truncated,
            isTruncated = _truncateText.isTruncated;
          if (isTruncated) {
            setTextToShow(truncated);
            setTruncatedText(truncated);
            setIsShowMoreRef(true);
            setHasLongerText(true);
          } else {
            setTextToShow(elementText);
            setHasLongerText(false);
          }
        }
      }
    };

    // Only truncate text if `enableShowMore` is turned ON
    if (enableShowMore) {
      /* Create a ResizeObserver to truncate the text as the 
      Annotations container re-sizes */
      observer = new ResizeObserver(function (entries) {
        requestAnimationFrame(function () {
          var _iterator = _createForOfIteratorHelper$3(entries),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var entry = _step.value;
              calcTruncatedText();
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        });
      });
      if (containerRef.current) observer.observe(containerRef.current);

      // Truncate text on load
      calcTruncatedText();
    } else {
      setTextToShow(texts);
    }

    // Cleanup observer and temp canvas element on component un-mount
    return function () {
      var _canvas, _observer;
      (_canvas = canvas) === null || _canvas === void 0 ? void 0 : _canvas.remove();
      (_observer = observer) === null || _observer === void 0 ? void 0 : _observer.disconnect();
    };
  }, [texts]);

  /**
   * Hide annotation tags when they overflow the width of the annotation 
   * container on the page
   */
  useEffect(function () {
    /**
     * Use ResizeObserver to hide/show tags as the annotations component re-sizes. 
     * Using it along with 'requestAnimationFrame' optimizes the animation
     * when container is contunuously being re-sized.
     */
    var observer = new ResizeObserver(function (entries) {
      requestAnimationFrame(function () {
        var _iterator2 = _createForOfIteratorHelper$3(entries),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var entry = _step2.value;
            updateTagView(true);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      });
    });
    if (containerRef.current) observer.observe(containerRef.current);
    var updateTagView = function updateTagView(s) {
      var hasOverflowingTags = toggleTagsView(s);
      // Update state
      setLongerTags(hasOverflowingTags);
      setShowMoreTags(hasOverflowingTags);
    };

    // Hide/show tags on load
    updateTagView(true);

    // Cleanup observer on component un-mount
    return function () {
      observer === null || observer === void 0 ? void 0 : observer.disconnect();
    };
  }, [tags]);

  /**
   * Hide/show tags in the Annotation when the tags overflow the annotation
   * component's width.
   * This function is called in the ResizeObserver, as well as a callback function
   * within the click event handler of the show more/less tags button to re-render 
   * tags as needed.
   * @param {Boolean} hideTags 
   * @returns {Boolean}
   */
  var toggleTagsView = function toggleTagsView(hideTags) {
    var hasOverflowingTags = false;
    // Tags and times UI elements on the page
    var tagsBlock = annotationTagsRef.current;
    var timesBlock = annotationTimesRef.current;
    if (tagsBlock && timesBlock && (tags === null || tags === void 0 ? void 0 : tags.length) > 0) {
      var _tagsBlock$children;
      /* Reset the grid-column to its default if it was previously set */
      tagsBlock.style.gridColumn = '';
      var timesBlockWidth = (timesBlock === null || timesBlock === void 0 ? void 0 : timesBlock.clientWidth) || 0;
      // Available space to render tags for the current annotation
      var availableTagsWidth = tagsBlock.parentElement.clientWidth - timesBlockWidth;
      if (((_tagsBlock$children = tagsBlock.children) === null || _tagsBlock$children === void 0 ? void 0 : _tagsBlock$children.length) > 0) {
        var _moreTagsButtonRef$cu;
        // 20 is an approximate width of the button, since this element gets rendered later
        var moreTagsButtonWidth = ((_moreTagsButtonRef$cu = moreTagsButtonRef.current) === null || _moreTagsButtonRef$cu === void 0 ? void 0 : _moreTagsButtonRef$cu.clientWidth) || 20;
        // Reserve space for show more tags button
        var spaceForTags = Math.abs(availableTagsWidth - moreTagsButtonWidth);
        var hasLongerChild = false;
        for (var i = 0; i < tagsBlock.children.length; i++) {
          var child = tagsBlock.children[i];
          // Reset 'hidden' class in each tag
          if (child.classList.contains('hidden')) child.classList.remove('hidden');
          // Check if at least one tag has longer text than the available space
          if (child.clientWidth > availableTagsWidth) hasLongerChild = true;
          if (hideTags && child != moreTagsButtonRef.current) {
            spaceForTags = spaceForTags - child.clientWidth;
            // If the space left is shorter than the width of more tags button, 
            // hide the rest of the tags
            if (spaceForTags < moreTagsButtonWidth) {
              hasOverflowingTags = true;
              child.classList.add('hidden');
            }
          }
        }
        /* Make the tags block span the full width of the time and tags container if 
        there are tags with longer text */
        if (hasLongerChild) {
          tagsBlock.style.gridColumn = '1 / -1';
        }
      }
    }
    return hasOverflowingTags;
  };
  return {
    hasLongerTags: hasLongerTags,
    hasLongerText: hasLongerText,
    setShowMoreTags: setShowMoreTags,
    showMoreTags: showMoreTags,
    setTextToShow: setTextToShow,
    textToShow: textToShow,
    toggleTagsView: toggleTagsView,
    truncatedText: truncatedText
  };
};

var classCallCheck = createCommonjsModule(function (module) {
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _classCallCheck = /*@__PURE__*/getDefaultExportFromCjs(classCallCheck);

var createClass = createCommonjsModule(function (module) {
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, toPropertyKey_1(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
module.exports = _createClass, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _createClass = /*@__PURE__*/getDefaultExportFromCjs(createClass);

var assertThisInitialized = createCommonjsModule(function (module) {
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
module.exports = _assertThisInitialized, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _assertThisInitialized = /*@__PURE__*/getDefaultExportFromCjs(assertThisInitialized);

var getPrototypeOf = createCommonjsModule(function (module) {
function _getPrototypeOf(t) {
  return module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, module.exports.__esModule = true, module.exports["default"] = module.exports, _getPrototypeOf(t);
}
module.exports = _getPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _getPrototypeOf = /*@__PURE__*/getDefaultExportFromCjs(getPrototypeOf);

var superPropBase = createCommonjsModule(function (module) {
function _superPropBase(t, o) {
  for (; !{}.hasOwnProperty.call(t, o) && null !== (t = getPrototypeOf(t)););
  return t;
}
module.exports = _superPropBase, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var get = createCommonjsModule(function (module) {
function _get() {
  return module.exports = _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) {
    var p = superPropBase(e, t);
    if (p) {
      var n = Object.getOwnPropertyDescriptor(p, t);
      return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value;
    }
  }, module.exports.__esModule = true, module.exports["default"] = module.exports, _get.apply(null, arguments);
}
module.exports = _get, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _get = /*@__PURE__*/getDefaultExportFromCjs(get);

var setPrototypeOf = createCommonjsModule(function (module) {
function _setPrototypeOf(t, e) {
  return module.exports = _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports, _setPrototypeOf(t, e);
}
module.exports = _setPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var inherits = createCommonjsModule(function (module) {
function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: !0,
      configurable: !0
    }
  }), Object.defineProperty(t, "prototype", {
    writable: !1
  }), e && setPrototypeOf(t, e);
}
module.exports = _inherits, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _inherits = /*@__PURE__*/getDefaultExportFromCjs(inherits);

var possibleConstructorReturn = createCommonjsModule(function (module) {
var _typeof = _typeof_1["default"];

function _possibleConstructorReturn(t, e) {
  if (e && ("object" == _typeof(e) || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return assertThisInitialized(t);
}
module.exports = _possibleConstructorReturn, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _possibleConstructorReturn = /*@__PURE__*/getDefaultExportFromCjs(possibleConstructorReturn);

function _createSuper$6(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$6(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct$6() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var SeekBar = videojs.getComponent('SeekBar');

/**
 * Custom component to show progress of playback built on top of
 * Video.js' SeekBar component. This customization allows to display
 * multiple-sources in a single Canvas as a contiguous time-block for
 * the sum of durations of each source and clipped playlist items with
 * blocked ranges.
 * @param {Object} props
 * @param {Object} props.player VideoJS player instance
 * @param {Object} props.options
 * @param {Number} props.options.nextItemClicked callback func to switch current source
 * when displaying multiple sources in a single instance
 */
var CustomSeekBar = /*#__PURE__*/function (_SeekBar) {
  _inherits(CustomSeekBar, _SeekBar);
  var _super = _createSuper$6(CustomSeekBar);
  function CustomSeekBar(player, options) {
    var _this;
    _classCallCheck(this, CustomSeekBar);
    _this = _super.call(this, player, options);
    /**
     * Set start values for progress bar
     * @param {Number} start canvas start time
     */
    _defineProperty(_assertThisInitialized(_this), "initializeProgress", function (start) {
      _this.setProgress(start);
      _this.setInitTime(start);
      _this.player.currentTime(start);
    });
    _this.addClass('vjs-custom-progress-bar');
    _this.setAttribute('data-testid', 'videojs-custom-seekbar');
    _this.setAttribute('tabindex', 0);
    _this.player = player;
    _this.options = options;
    _this.selectSource = _this.options.nextItemClicked;
    _this.playerEventListener;
    _this.initTimeRef = /*#__PURE__*/createRef();
    _this.progressRef = /*#__PURE__*/createRef();
    _this.canvasTargetsRef = /*#__PURE__*/createRef();
    _this.srcIndexRef = /*#__PURE__*/createRef();
    _this.isMultiSourceRef = /*#__PURE__*/createRef();
    _this.currentTimeRef = /*#__PURE__*/createRef();
    _this.pointerDragged = false;
    _this.totalDuration;

    // Retreive child elements in SeekBar to use for custom updates
    _this.playProgress = _this.getChild('PlayProgressBar');
    _this.loadProgress = _this.getChild('LoadProgressBar');
    _this.player.on('ready', function () {
      _this.initializeEl();
      _this.updateComponent();
    });
    _this.player.on('loadstart', function () {
      _this.updateComponent();
      _this.buildProgressBar();
    });
    _this.player.on('loadeddata', function () {
      _this.setInitTime(_this.player.currentTime());
    });

    // Update our progress bar after the user leaves full screen
    _this.player.on('fullscreenchange', function () {
      if (!_this.player.isFullscreen()) {
        var currentTime = _this.player.currentTime();
        // Update CSS for played range in VideoJS player's progress-bar
        var played = Math.min(100, Math.max(0, 100 * (currentTime / _this.totalDuration)));
        document.documentElement.style.setProperty('--range-progress', "calc(".concat(played, "%)"));
        _this.setProgress(currentTime);
      }
    });

    // Clear interval upon player disposal
    _this.player.on('dispose', function () {
      clearInterval(_this.playerEventListener);
    });
    return _this;
  }
  _createClass(CustomSeekBar, [{
    key: "setInitTime",
    value: function setInitTime(t) {
      this.initTimeRef.current = t;
    }
  }, {
    key: "setSrcIndex",
    value: function setSrcIndex(i) {
      this.srcIndexRef.current = i;
    }
  }, {
    key: "setProgress",
    value: function setProgress(p) {
      this.progressRef.current = p;
    }
  }, {
    key: "setCanvasTargets",
    value: function setCanvasTargets(t) {
      this.canvasTargetsRef.current = t;
      this.totalDuration = t.reduce(function (acc, c) {
        return acc + c.duration;
      }, 0);
    }
  }, {
    key: "setIsMultiSource",
    value: function setIsMultiSource(m) {
      this.isMultiSourceRef.current = m;
    }
  }, {
    key: "setCurrentTime",
    value: function setCurrentTime(t) {
      this.currentTimeRef.current = t;
    }
  }, {
    key: "updateComponent",
    value:
    // Update component's variables on Canvas changes
    function updateComponent() {
      var _this2 = this;
      var _this$player = this.player,
        srcIndex = _this$player.srcIndex,
        targets = _this$player.targets;
      this.setSrcIndex(srcIndex);
      this.setCanvasTargets(targets);
      var cTimes = targets[srcIndex];
      if (cTimes.customStart > cTimes.start) {
        this.initializeProgress(cTimes.customStart);
      } else {
        this.initializeProgress(cTimes.start);
      }
      this.setIsMultiSource((targets === null || targets === void 0 ? void 0 : targets.length) > 1 ? true : false);
      if (!this.playerEventListener) {
        /**
         * Using a time interval instead of 'timeupdate event in VideoJS, because Safari
         * and other browsers in MacOS stops firing the 'timeupdate' event consistently 
         * after a while
         */
        this.playerEventListener = setInterval(function () {
          _this2.timeUpdateHandler();
        }, 100);
      }
    }

    /**
     * Use Video.js' update function to update time in on both mobile
     * and desktop devices when changing Canvases.
     */
  }, {
    key: "update",
    value: function update() {
      var _this$player$structSt;
      // Need this to make the other updates work
      _get(_getPrototypeOf(CustomSeekBar.prototype), "update", this).call(this);
      // Explicitly update played range variable on reload for touch devices
      if (IS_TOUCH_ONLY && this.player.currentTime() === 0) {
        this.removeClass('played-range');
        document.documentElement.style.setProperty('--range-progress', "calc(".concat(0, "%)"));
      }
      var structStart = (_this$player$structSt = this.player.structStart) !== null && _this$player$structSt !== void 0 ? _this$player$structSt : 0;
      if (structStart != 0 && this.player.currentTime() === 0) {
        this.player.currentTime(structStart);
        var played = Math.min(100, Math.max(0, 100 * (structStart / this.totalDuration)));
        this.addClass('played-range');
        document.documentElement.style.setProperty('--range-progress', "calc(".concat(played, "%)"));
        // Reset player.structStart once the value is being used up
        this.player.structStart = 0;
      }
    }
  }, {
    key: "initializeEl",
    value:
    // Create progress bar using Video.js' SeekBar component
    function initializeEl() {
      var _this3 = this;
      /**
       * Build and append placeholder elements to show blocked ranges, 
       * especially used in playlist context to present clipped items.
       */
      var leftBlock = videojs.dom.createEl('div', {
        className: 'block-stripes',
        role: 'presentation',
        id: 'left-block'
      });
      var rightBlock = videojs.dom.createEl('div', {
        className: 'block-stripes',
        role: 'presentation',
        id: 'right-block'
      });
      this.el().appendChild(leftBlock);
      this.el().appendChild(rightBlock);

      /**
       * Add eventlisteners to handle time tool-tip display and progress updates.
       * Using pointerup, pointermove, pointerdown events instead of mouseup, 
       * mousemove, mousedown events to make it work with both mouse pointer 
       * and touch events.
       */
      this.el().addEventListener('mouseenter', function (e) {
        _this3.handleMouseMove(e);
      });
      this.el().addEventListener('pointerup', function (e) {
        if (_this3.pointerDragged) {
          _this3.handleMouseUp(e);
        }
      });
      this.el().addEventListener('pointermove', function (e) {
        _this3.handleMouseMove(e);
        _this3.pointerDragged = true;
      });
      this.el().addEventListener('pointerdown', function (e) {
        _this3.handleMouseDown(e);
        _this3.pointerDragged = false;
      });
    }
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove(e) {
      var _this$convertToTime = this.convertToTime(e),
        currentTime = _this$convertToTime.currentTime,
        offsetx = _this$convertToTime.offsetx;
      if (currentTime != undefined) this.setCurrentTime(currentTime);
      var mouseTimeDisplay = this.getChild('MouseTimeDisplay');
      if (mouseTimeDisplay) {
        var timeTooltip = mouseTimeDisplay.getChild('TimeTooltip');
        var toolTipEl = timeTooltip.el_;
        if (currentTime) {
          toolTipEl.innerHTML = timeToHHmmss(currentTime);
        }
        var pullTooltip = toolTipEl.clientWidth / 2;
        toolTipEl.style.left = "".concat(offsetx - pullTooltip, "px");
      }
    }
  }, {
    key: "handleMouseDown",
    value: function handleMouseDown(e) {
      // Do nothing when right-click is pressed
      if (!IS_TOUCH_ONLY && e.buttons === 2) return;
      var _this$convertToTime2 = this.convertToTime(e),
        currentTime = _this$convertToTime2.currentTime;
        _this$convertToTime2._;
      if (Number.isNaN(currentTime)) return;
      var clickedSrc;
      if (this.isMultiSourceRef.current) {
        clickedSrc = this.canvasTargetsRef.current.find(function (t) {
          var virtualEnd = t.altStart + t.duration;
          if (currentTime >= t.altStart && currentTime <= virtualEnd) {
            return t;
          }
        });
      }
      if (clickedSrc) {
        var _clickedSrc$sIndex, _clickedSrc;
        var clickedIndex = (_clickedSrc$sIndex = (_clickedSrc = clickedSrc) === null || _clickedSrc === void 0 ? void 0 : _clickedSrc.sIndex) !== null && _clickedSrc$sIndex !== void 0 ? _clickedSrc$sIndex : 0;
        if (clickedIndex != this.srcIndexRef.current) {
          this.selectSource(clickedSrc.sIndex, currentTime - clickedSrc.altStart);
          this.setSrcIndex(clickedIndex);
        } else {
          this.player.currentTime(currentTime - clickedSrc.altStart);
        }
      } else {
        this.player.currentTime(currentTime);
      }

      /**
       * For touch devices, player.currentTime() update doesn't show the 
       * played range, even though the player's currentTime is properly set.
       * Therefore, update the CSS here explicitly.
       */
      if (IS_TOUCH_ONLY) {
        var played = Math.min(100, Math.max(0, 100 * (currentTime / this.totalDuration)));
        this.player.currentTime(currentTime);
        this.addClass('played-range');
        document.documentElement.style.setProperty('--range-progress', "calc(".concat(played, "%)"));
      }
    }
  }, {
    key: "handleMouseUp",
    value: function handleMouseUp(e) {
      this.handleMouseDown(e);
    }
  }, {
    key: "buildProgressBar",
    value: function buildProgressBar() {
      var _canvasTargetsRef$cur;
      // Reset progress-bar for played range on player reload
      this.removeClass('played-range');
      var canvasTargetsRef = this.canvasTargetsRef,
        isMultiSourceRef = this.isMultiSourceRef,
        player = this.player,
        srcIndexRef = this.srcIndexRef,
        totalDuration = this.totalDuration;
      if (((_canvasTargetsRef$cur = canvasTargetsRef.current) === null || _canvasTargetsRef$cur === void 0 ? void 0 : _canvasTargetsRef$cur.length) > 0) {
        var _canvasTargetsRef$cur2 = canvasTargetsRef.current[srcIndexRef.current],
          altStart = _canvasTargetsRef$cur2.altStart,
          start = _canvasTargetsRef$cur2.start,
          end = _canvasTargetsRef$cur2.end,
          duration = _canvasTargetsRef$cur2.duration;
        var leftBlockEl = document.getElementById('left-block');
        var rightBlockEl = document.getElementById('right-block');
        if (!isMultiSourceRef.current) {
          var leftBlock = start * 100 / duration;
          var rightBlock = (duration - end) * 100 / duration;

          // player.isClipped is used in VideoJSTrackScrbber to display accurate
          // times for clipped items
          rightBlock > 0 ? player.isClipped = true : player.isClipped = false;
          if (leftBlockEl) leftBlockEl.style.width = "".concat(leftBlock, "%");
          if (rightBlockEl) {
            rightBlockEl.style.width = rightBlock + '%';
            rightBlockEl.style.left = "".concat(100 - rightBlock, "%");
          }
        } else {
          // Offset of the duration of the current source for multi-source canvases
          var leftOffset = Math.min(100, Math.max(0, 100 * (altStart / totalDuration)));
          this.playProgress.el_.style.left = "".concat(leftOffset, "%");
          this.loadProgress.el_.style.left = "".concat(leftOffset, "%");
          // Add CSS class to mark the range from zero as played
          this.addClass('played-range');
          document.documentElement.style.setProperty('--range-progress', "calc(".concat(leftOffset, "%)"));
        }
      }
    }

    /**
     * Convert mouse event's offset to timepoint value in the progressbar,
     * taking into account blocked ranges, and multi-source canvases.
     * @param {Event} e mouse event
     * @returns {currentTime: Number, offsetx: Number}
     */
  }, {
    key: "convertToTime",
    value: function convertToTime(e) {
      var _e$nativeEvent$target, _this$totalDuration;
      var eSrcElement = e.srcElement;
      // When clicked on blocked time point
      if (eSrcElement.classList.contains('block-stripes')) {
        var _this$canvasTargetsRe = this.canvasTargetsRef.current[0],
          altStart = _this$canvasTargetsRe.altStart,
          end = _this$canvasTargetsRe.end,
          _duration = _this$canvasTargetsRe.duration;
        if (eSrcElement.id === 'right-block') {
          // For right-block: place time tool-tip at the end of playable range
          return {
            currentTime: end,
            offsetx: end / _duration * this.el().clientWidth
          };
        } else {
          // For left-block: place time tool-tip at the start of playable range
          return {
            currentTime: altStart,
            offsetx: altStart / _duration * this.el().clientWidth
          };
        }
      }
      var targetX = e.target.getBoundingClientRect().x;
      var offsetx = e.nativeEvent != undefined ? e.nativeEvent.offsetX != undefined ? e.nativeEvent.offsetX // iOS and desktop events
      : ((_e$nativeEvent$target = e.nativeEvent.targetTouches[0]) === null || _e$nativeEvent$target === void 0 ? void 0 : _e$nativeEvent$target.clientX) - targetX // Android event
      : e.offsetX; // fallback in desktop browsers when nativeEvent is undefined
      var currentTime;
      var duration = (_this$totalDuration = this.totalDuration) !== null && _this$totalDuration !== void 0 ? _this$totalDuration : this.player.duration();
      // When pointer is on top of a search marker on the progress bar
      if (eSrcElement.classList.contains('ramp--track-marker--search')) {
        var _e$target$dataset$mar;
        var markerTime = (_e$target$dataset$mar = e.target.dataset.markerTime) !== null && _e$target$dataset$mar !== void 0 ? _e$target$dataset$mar : 0;
        return {
          currentTime: markerTime,
          offsetx: e.target.offsetLeft
        };
      }
      if (offsetx && offsetx != undefined) {
        if (this.isMultiSourceRef.current) {
          /**
           * Check if the mouse event occurred on the same src range. 
           * If so, adjust the offset to support altStart for the current src.
           */
          var leftOffset = parseFloat(this.playProgress.el_.style.left) / 100 * this.el().clientWidth;
          var elClassList = eSrcElement.classList;
          var sameSrc = (elClassList === null || elClassList === void 0 ? void 0 : elClassList.length) > 0 ? elClassList.contains('vjs-play-progress') || elClassList.contains('vjs-load-progress') : true;
          if (leftOffset > offsetx && sameSrc) {
            offsetx = offsetx + leftOffset;
          }
        }
        currentTime = offsetx / this.el().clientWidth * duration;
      }
      /**
       * Parts of LoadProgress element is broken into segments as media loads, and displayed
       * as separate div elements with `data-start` and `data-end` attributes respectively.
       * When mouse event occurs on top of such element, add the segment start time to calculated
       * current time from event.
       */
      if (e.target.hasAttribute('data-start')) {
        var _e$target$dataset = e.target.dataset,
          start = _e$target$dataset.start;
          _e$target$dataset._;
        currentTime = currentTime + parseFloat(start);
        offsetx = currentTime * this.el().clientWidth / this.totalDuration;
      }
      return {
        currentTime: currentTime,
        offsetx: offsetx
      };
    }
  }, {
    key: "timeUpdateHandler",
    value:
    // Update progress bar with timeupdate in the player
    function timeUpdateHandler() {
      var _this4 = this;
      var initTimeRef = this.initTimeRef,
        player = this.player;
      if (player.isDisposed() || player.ended() || player == null) {
        return;
      }
      var curTime;
      // Initially update progress from the prop passed from Ramp,
      // this accounts for structured navigation when switching canvases
      if (initTimeRef.current > 0 && player.currentTime() == 0) {
        curTime = initTimeRef.current;
        player.currentTime(initTimeRef.current);
      } else {
        curTime = player.currentTime();
      }
      // Use debounced updates since, Safari desktop browsers need the extra 
      // update on 'seeked' event to timely update the progress bar.
      if (IS_SAFARI && !IS_MOBILE && player.paused()) {
        debounce_1(function () {
          _this4.onTimeUpdate(curTime);
        });
      } else {
        this.onTimeUpdate(curTime);
      }
      this.setInitTime(0);
    }
  }, {
    key: "onTimeUpdate",
    value: function onTimeUpdate(curTime) {
      // This state update caused weird lagging behaviors when using the iOS native
      // video player. iOS player handles its own progress bar, so we can skip the
      // update here only for video.
      var iOS = this.player.hasClass("vjs-ios-native-fs");
      if (!(iOS && !this.player.audioOnlyMode_)) {
        this.setProgress(curTime);
      }
      this.handleTimeUpdate(curTime);
    }
  }, {
    key: "handleTimeUpdate",
    value:
    /**
     * Update CSS for the input range's track while the media
     * is playing
     * @param {Number} curTime current time of the player
     */
    function handleTimeUpdate(curTime) {
      var _srcIndexRef$current;
      var player = this.player,
        el_ = this.el_,
        canvasTargetsRef = this.canvasTargetsRef,
        srcIndexRef = this.srcIndexRef;

      // Avoid null player instance when Video.js is getting initialized
      if (!el_ || !player || !canvasTargetsRef.current) {
        return;
      }
      var _canvasTargetsRef$cur3 = canvasTargetsRef.current[(_srcIndexRef$current = srcIndexRef.current) !== null && _srcIndexRef$current !== void 0 ? _srcIndexRef$current : 0],
        start = _canvasTargetsRef$cur3.start,
        end = _canvasTargetsRef$cur3.end;

      /**
       * Explicitly set the played range in the progress-bar for mobile 
       * devices. This is especially helpful in updating progress-bar track 
       * highlights when using structured navigation.
       */
      if (IS_TOUCH_ONLY) {
        var played = Math.min(100, Math.max(0, 100 * (curTime / this.totalDuration)));
        document.documentElement.style.setProperty('--range-progress', "calc(".concat(played, "%)"));
      }

      // Restrict access to the intended range in the media file
      if (curTime < start) {
        player.currentTime(start);
      }
      if (curTime >= end && !player.paused() && !player.isDisposed()) {
        // Trigger ended event when playable range < duration of the 
        // full media. e.g. clipped playlist items
        if (end < player.duration()) {
          player.trigger('ended');
        }
        // Reset progress-bar played range
        document.documentElement.style.setProperty('--range-progress', "calc(".concat(0, "%)"));
        this.removeClass('played-range');

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
    }
  }]);
  return CustomSeekBar;
}(SeekBar);
videojs.registerComponent('CustomSeekBar', CustomSeekBar);
var ProgressControl = videojs.getComponent('ProgressControl');
var VideoJSProgress = /*#__PURE__*/function (_ProgressControl) {
  _inherits(VideoJSProgress, _ProgressControl);
  var _super2 = _createSuper$6(VideoJSProgress);
  function VideoJSProgress(player, options) {
    var _this5;
    _classCallCheck(this, VideoJSProgress);
    _this5 = _super2.call(this, player, options);
    _this5.addClass('vjs-custom-progress-bar');

    // Hide the native seekBar
    var seekBar = _this5.getChild('seekBar');
    seekBar.el_.style.display = 'none';
    seekBar.removeClass('vjs-progress-holder');
    // Add the custom seekBar
    _this5.addChild('CustomSeekBar', {
      nextItemClicked: options.nextItemClicked
    });
    return _this5;
  }
  _createClass(VideoJSProgress, [{
    key: "handleMouseSeek",
    value: function handleMouseSeek(event) {
      var seekBar = this.getChild('customSeekBar');
      if (seekBar) {
        seekBar.handleMouseMove(event);
      }
    }

    /**
     * Override native component's handleMouseDown event to use custom
     * seekbar's handleMouseDown event handler
     * @param {Event} event 
     */
  }, {
    key: "handleMouseDown",
    value: function handleMouseDown(event) {
      var doc = this.el_.ownerDocument;
      var seekBar = this.getChild('customSeekBar');
      if (seekBar) {
        seekBar.handleMouseDown(event);
      }
      this.on(doc, 'mousemove', this.throttledHandleMouseSeek);
      this.on(doc, 'touchmove', this.throttledHandleMouseSeek);
      this.on(doc, 'mouseup', this.handleMouseUpHandler_);
      this.on(doc, 'touchend', this.handleMouseUpHandler_);
    }
  }]);
  return VideoJSProgress;
}(ProgressControl);
videojs.registerComponent('VideoJSProgress', VideoJSProgress);

function _createSuper$5(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$5(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct$5() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var TimeDisplay = videojs.getComponent('TimeDisplay');

/**
 * Custom component to display the current time of the player
 * @param {Object} props
 * @param {Object} props.player VideoJS player instance
 * @param {Object} options
 * @param {Number} options.currentTime
 */
var VideoJSCurrentTime = /*#__PURE__*/function (_TimeDisplay) {
  _inherits(VideoJSCurrentTime, _TimeDisplay);
  var _super = _createSuper$5(VideoJSCurrentTime);
  function VideoJSCurrentTime(player, options) {
    var _this;
    _classCallCheck(this, VideoJSCurrentTime);
    _this = _super.call(this, player, options);
    _this.addClass('vjs-time-control vjs-current-time-display');
    _this.setAttribute('role', 'presentation');
    _this.player = player;
    _this.options = options;
    _this.initTimeRef = /*#__PURE__*/createRef();
    _this.initTimeRef.current = options.currentTime;
    _this.playerInterval;
    _this.player.on('loadstart', function () {
      _this.playerInterval = setInterval(function () {
        _this.handleTimeUpdate();
      }, 100);
    });
    _this.player.on('seeked', function () {
      if (IS_SAFARI && !IS_MOBILE) {
        _this.updateTextNode_(player.currentTime());
      }
    });

    // Update our timer after the user leaves full screen
    _this.player.on('fullscreenchange', function () {
      if (!player.isFullscreen()) {
        _this.updateTextNode_(player.currentTime());
      }
    });

    // Clean interval upon player dispose
    _this.player.on('dispose', function () {
      clearInterval(_this.playerInterval);
    });
    return _this;
  }
  _createClass(VideoJSCurrentTime, [{
    key: "buildCSSClass",
    value: function buildCSSClass() {
      return 'current-time';
    }
  }, {
    key: "setInitTime",
    value: function setInitTime(t) {
      this.initTimeRef.current = t;
    }
  }, {
    key: "handleTimeUpdate",
    value: function handleTimeUpdate() {
      var player = this.player,
        initTimeRef = this.initTimeRef;
      var targets = player.targets,
        srcIndex = player.srcIndex;
      if (!player || player.isDisposed() || !targets) {
        return;
      }
      var iOS = player.hasClass('vjs-ios-native-fs');
      var time;
      // Update time from the given initial time if it is not zero
      if (initTimeRef.current > 0 && player.currentTime() == 0) {
        time = initTimeRef.current;
      } else {
        time = player.currentTime();
      }
      var _targets = targets[srcIndex !== null && srcIndex !== void 0 ? srcIndex : 0],
        start = _targets.start,
        altStart = _targets.altStart;
      if (altStart != start && srcIndex > 0) {
        time = time + altStart;
      }
      // This state update caused weird lagging behaviors when using the iOS native
      // video player. iOS player handles its own time, so we can skip the update here
      // video items.
      if (!(iOS && !player.audioOnlyMode_)) {
        this.updateTextNode_(time);
      }
      this.setInitTime(0);
    }
  }]);
  return VideoJSCurrentTime;
}(TimeDisplay);
videojs.registerComponent('VideoJSCurrentTime', VideoJSCurrentTime);

function _createSuper$4(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$4(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct$4() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var MenuButton = videojs.getComponent('MenuButton');
var MenuItem = videojs.getComponent('MenuItem');

/**
 * Custom component to display rendering files as downloadable 
 * associated with the current Canvas. This control is enabled
 * in the player's control-bar via 'enableFileDownload' prop in
 * MediaPlayer component.
 * @param {Object} props
 * @param {Object} props.player VideoJS player instance
 * @param {Object} props.options
 * @param {Number} props.options.files list of rendering files
 */
var VideoJSFileDownload = /*#__PURE__*/function (_MenuButton) {
  _inherits(VideoJSFileDownload, _MenuButton);
  var _super = _createSuper$4(VideoJSFileDownload);
  function VideoJSFileDownload(player, options) {
    var _this;
    _classCallCheck(this, VideoJSFileDownload);
    _this = _super.call(this, player, options);
    // Add SVG icon through CSS class
    _this.addClass("vjs-file-download");
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

function _createSuper$3(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$3(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct$3() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var Button$2 = videojs.getComponent('Button');

/**
 * Custom VideoJS button component for navigating to the next Canvas when there
 * are multiple canvases in a given Manifest
 * @param {Object} props
 * @param {Object} props.player VideoJS player instance
 * @param {Object} props.options
 * @param {Number} props.options.canvasIndex current Canvas index
 * @param {Number} props.options.lastCanvasIndex index of the last Canvas in the Manifest
 * @param {Function} props.options.switchPlayer callback func to update Canvas change in state
 */
var VideoJSNextButton = /*#__PURE__*/function (_Button) {
  _inherits(VideoJSNextButton, _Button);
  var _super = _createSuper$3(VideoJSNextButton);
  function VideoJSNextButton(player, options) {
    var _this;
    _classCallCheck(this, VideoJSNextButton);
    _this = _super.call(this, player, options);
    // Use Video.js' stock SVG instead of setting it using CSS
    _this.setIcon('next-item');
    _this.addClass('vjs-play-control vjs-control');
    _this.setAttribute('data-testid', 'videojs-next-button');
    _this.controlText('Next');
    _this.options = options;
    _this.player = player;
    _this.cIndex = options.canvasIndex;

    // Handle player reload or source change events
    _this.player.on('loadstart', function () {
      _this.updateComponent();
    });
    return _this;
  }
  _createClass(VideoJSNextButton, [{
    key: "updateComponent",
    value: function updateComponent() {
      var player = this.player;
      if (player && player != undefined) {
        var _player$children;
        // When canvasIndex property is not set in the player instance use dataset.
        // This happens rarely, but when it does previous button cannot be used.
        if (player.canvasIndex === undefined && ((_player$children = player.children()) === null || _player$children === void 0 ? void 0 : _player$children.length) > 0) {
          this.cIndex = Number(player.children()[0].dataset.canvasindex);
        } else {
          this.cIndex = player.canvasIndex;
        }
      }
    }
  }, {
    key: "handleClick",
    value: function handleClick() {
      this.handleNextClick();
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(e) {
      if (e.which === 32 || e.which === 13) {
        e.stopPropagation();
        this.handleNextClick();
      }
    }
  }, {
    key: "handleNextClick",
    value: function handleNextClick() {
      if (this.cIndex != this.options.lastCanvasIndex) {
        this.options.switchPlayer(this.cIndex + 1, true);
      }
    }
  }]);
  return VideoJSNextButton;
}(Button$2);
videojs.registerComponent('VideoJSNextButton', VideoJSNextButton);

function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$2(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var Button$1 = videojs.getComponent('Button');

/**
 * Custom VideoJS button component for navigating to the previous Canvas when there
 * are multiple canvases in a given Manifest
 * @param {Object} props
 * @param {Object} props.player VideoJS player instance
 * @param {Object} props.options
 * @param {Number} props.options.canvasIndex current Canvas index
 * @param {Function} props.options.switchPlayer callback func to update Canvas change in state
 */
var VideoJSPreviousButton = /*#__PURE__*/function (_Button) {
  _inherits(VideoJSPreviousButton, _Button);
  var _super = _createSuper$2(VideoJSPreviousButton);
  function VideoJSPreviousButton(player, options) {
    var _this;
    _classCallCheck(this, VideoJSPreviousButton);
    _this = _super.call(this, player, options);
    // Use Video.js' stock SVG instead of setting it using CSS
    _this.setIcon('previous-item');
    _this.addClass('vjs-play-control vjs-control');
    _this.setAttribute('data-testid', 'videojs-previous-button');
    _this.options = options;
    _this.player = player;
    _this.cIndex = options.canvasIndex;

    // Handle player reload or source change events
    _this.player.on('loadstart', function () {
      _this.updateComponent();
    });
    return _this;
  }
  _createClass(VideoJSPreviousButton, [{
    key: "updateComponent",
    value: function updateComponent() {
      var player = this.player;
      if (player && player != undefined) {
        var _player$children;
        // When canvasIndex property is not set in the player instance use dataset.
        // This happens rarely, but when it does previous button cannot be used.
        if (player.canvasIndex === undefined && ((_player$children = player.children()) === null || _player$children === void 0 ? void 0 : _player$children.length) > 0) {
          this.cIndex = Number(player.children()[0].dataset.canvasindex);
        } else {
          this.cIndex = player.canvasIndex;
        }
      }
      this.controlText(this.cIndex == 0 ? 'Replay' : 'Previous');
    }
  }, {
    key: "handleClick",
    value: function handleClick() {
      this.handlePreviousClick();
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(e) {
      if (e.which === 32 || e.which === 13) {
        e.stopPropagation();
        this.handlePreviousClick();
      }
    }
  }, {
    key: "handlePreviousClick",
    value: function handlePreviousClick() {
      if (this.cIndex > -1 && this.cIndex != 0) {
        this.options.switchPlayer(this.cIndex - 1, true);
      } else if (this.cIndex == 0) {
        this.player.currentTime(0);
      }
    }
  }]);
  return VideoJSPreviousButton;
}(Button$1);
videojs.registerComponent('VideoJSPreviousButton', VideoJSPreviousButton);

function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var vjsComponent = videojs.getComponent('Component');

/**
 * Custom component to display title of the current item in the player
 * in an overlay.
 * @param {Object} props
 * @param {Object} props.player VideoJS player instance
 * @param {Object} props.options
 */
var VideoJSTitleLink = /*#__PURE__*/function (_vjsComponent) {
  _inherits(VideoJSTitleLink, _vjsComponent);
  var _super = _createSuper$1(VideoJSTitleLink);
  function VideoJSTitleLink(player, options) {
    var _this;
    _classCallCheck(this, VideoJSTitleLink);
    _this = _super.call(this, player, options);
    _this.setAttribute('data-testid', 'videojs-title-link');
    _this.addClass('vjs-title-bar');
    _this.options = options;
    _this.player = player;

    // Handle player reload or source change events
    _this.player.on('loadstart', function () {
      _this.updateComponent();
    });
    return _this;
  }
  _createClass(VideoJSTitleLink, [{
    key: "updateComponent",
    value: function updateComponent() {
      var player = this.player;
      if (player && player != undefined && player.canvasLink) {
        var _player$canvasLink = player.canvasLink,
          label = _player$canvasLink.label,
          id = _player$canvasLink.id;
        var title = label;
        var href = null;
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
        var link = videojs.dom.createEl('a', {
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
  }]);
  return VideoJSTitleLink;
}(vjsComponent);
vjsComponent.registerComponent('VideoJSTitleLink', VideoJSTitleLink);

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

// SVG icons for zoom-in and zoom-out icons as strings
var zoomOutIconSVG = "\n<symbol id=\"zoomed-out\" viewBox=\"0 0 20 20\">\n  <g id=\"SVGRepo_bgCarrier\" stroke-width=\"0\"></g>\n  <g id=\"SVGRepo_tracerCarrier\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></g>\n  <g id=\"SVGRepo_iconCarrier\">\n    <path fill=\"#ffffff\" fill-rule=\"evenodd\" d=\"M4 9a5 5 0 1110 0A5 5 0 014 9zm5-7a7 7 \n      0 104.2 12.6.999.999 0 00.093.107l3 3a1 1 0 001.414-1.414l-3-3a.999.999 0 00-.107-.093A7 \n      7 0 009 2zM8 6.5a1 1 0 112 0V8h1.5a1 1 0 110 2H10v1.5a1 1 0 11-2 0V10H6.5a1 1 0 010-2H8V6.5z\">\n    </path>\n  </g>\n</symbol>";
var zoomInIconSVG = "\n<symbol id=\"zoomed-in\" viewBox=\"0 0 20 20\">\n  <g id=\"SVGRepo_bgCarrier\" stroke-width=\"0\"></g>\n  <g id=\"SVGRepo_tracerCarrier\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></g>\n  <g id=\"SVGRepo_iconCarrier\">\n    <path fill=\"#ffffff\" fill-rule=\"evenodd\" d=\"M9 4a5 5 0 100 10A5 5 0 009 4zM2 9a7 \n      7 0 1112.6 4.2.999.999 0 01.107.093l3 3a1 1 0 01-1.414 1.414l-3-3a.999.999 0 \n      01-.093-.107A7 7 0 012 9zm10.5 0a1 1 0 00-1-1h-5a1 1 0 100 2h5a1 1 0 001-1z\">\n    </path>\n  </g>\n</symbol>";

// Function to inject SVGs into the DOM
function injectSVGIcons() {
  var svgContainer = document.createElement('div');
  svgContainer.style.display = 'none';
  svgContainer.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\">".concat(zoomOutIconSVG).concat(zoomInIconSVG, "</svg>");
  document.body.appendChild(svgContainer);
}

// Call the function to inject SVG icons
injectSVGIcons();
var Button = videojs.getComponent('Button');

/**
 * Custom VideoJS component for displaying track view when there are 
 * tracks/structure timespans in the current Canvas.
 * @param {Object} props
 * @param {Object} props.player VideoJS player instance
 * @param {Object} props.options
 * @param {Number} props.options.trackScrubberRef React ref to track scrubber element
 * @param {Number} props.options.timeToolRef React ref to time tooltip element
 * @param {Boolean} props.options.isPlaylist flag to indicate a playlist Manifest or not
 */
var VideoJSTrackScrubber = /*#__PURE__*/function (_Button) {
  _inherits(VideoJSTrackScrubber, _Button);
  var _super = _createSuper(VideoJSTrackScrubber);
  function VideoJSTrackScrubber(player, options) {
    var _this;
    _classCallCheck(this, VideoJSTrackScrubber);
    _this = _super.call(this, player, options);
    /**
     * Set the elapsed time percentage and time as aria-now in the 
     * progress bar of track scrubber
     * @param {Number} trackpercent 
     * @param {Number} trackoffset 
     */
    _defineProperty(_assertThisInitialized(_this), "setTrackScrubberValue", function (trackpercent, trackoffset) {
      document.documentElement.style.setProperty('--range-scrubber', "calc(".concat(trackpercent, "%)"));
      var trackScrubberRef = _this.options.trackScrubberRef;
      if (trackScrubberRef.current && trackScrubberRef.current.children) {
        // Attach mouse pointer events to track scrubber progress bar
        var _trackScrubberRef$cur = _slicedToArray(trackScrubberRef.current.children, 3);
          _trackScrubberRef$cur[0];
          var progressBar = _trackScrubberRef$cur[1];
          _trackScrubberRef$cur[2];
        progressBar.setAttribute('aria-valuenow', trackoffset);
      }
    });
    _this.setAttribute('data-testid', 'videojs-track-scrubber-button');
    _this.addClass('vjs-button vjs-track-scrubber');
    _this.controlText('Toggle track scrubber');
    _this.el().innerHTML = "\n      <svg class=\"vjs-icon-zoom\" role=\"presentation\">\n        <use xlink:href=\"#zoomed-out\"></use>\n      </svg>";
    _this.options = options;
    _this.player = player;
    _this.playerInterval;
    _this.zoomedOutRef = /*#__PURE__*/createRef();
    _this.currentTrackRef = /*#__PURE__*/createRef();

    // Attach interval on first load for time updates
    _this.player.on('ready', function () {
      if (_this.options.trackScrubberRef.current) {
        _this.playerInterval = setInterval(function () {
          _this.handleTimeUpdate();
        }, 100);
      }
    });

    /* 
      When player is fully built and the trackScrubber element is initialized,
      call method to mount React component.
    */
    _this.player.on('loadstart', function () {
      if (_this.options.trackScrubberRef.current) {
        _this.updateComponent();
        if (!_this.playerInterval) {
          _this.playerInterval = setInterval(function () {
            _this.handleTimeUpdate();
          }, 100);
        }
      }
    });

    // Hide track scrubber if it is displayed when player is going fullscreen
    _this.player.on('fullscreenchange', function () {
      if (_this.player.isFullscreen() && !_this.zoomedOutRef.current) {
        var tempZoom = _this.zoomedOutRef.current;
        _this.setZoomedOut(!tempZoom);
      }
    });

    // Clean up interval when player is disposed
    _this.player.on('dispose', function () {
      clearInterval(_this.playerInterval);
    });
    return _this;
  }
  _createClass(VideoJSTrackScrubber, [{
    key: "setCurrentTrack",
    value: function setCurrentTrack(t) {
      this.currentTrackRef.current = t;
    }
  }, {
    key: "setZoomedOut",
    value: function setZoomedOut(z) {
      this.zoomedOutRef.current = z;
      if (z) {
        this.options.trackScrubberRef.current.classList.add('hidden');
        this.el().innerHTML = "\n        <svg class=\"vjs-icon-zoom\" role=\"presentation\">\n          <use xlink:href=\"#zoomed-out\"></use>\n        </svg>";
      } else {
        this.options.trackScrubberRef.current.classList.remove('hidden');
        this.el().innerHTML = "\n        <svg class=\"vjs-icon-zoom\" role=\"presentation\">\n          <use xlink:href=\"#zoomed-in\"></use>\n        </svg>";
      }
    }
  }, {
    key: "attachListeners",
    value: function attachListeners() {
      var _this2 = this;
      var trackScrubberRef = this.options.trackScrubberRef;
      if (trackScrubberRef.current) {
        // Initialize the track scrubber's current time and duration
        this.populateTrackScrubber();
        this.updateTrackScrubberProgressBar();
        var pointerDragged = false;
        // Attach mouse pointer events to track scrubber progress bar
        var _trackScrubberRef$cur2 = _slicedToArray(trackScrubberRef.current.children, 3);
          _trackScrubberRef$cur2[0];
          var progressBar = _trackScrubberRef$cur2[1];
          _trackScrubberRef$cur2[2];
        progressBar.addEventListener('mouseenter', function (e) {
          _this2.handleMouseMove(e);
        });
        /*
          Using pointerup, pointermove, pointerdown events instead of
          mouseup, mousemove, mousedown events to make it work with both
          mouse pointer and touch events 
        */
        progressBar.addEventListener('pointerup', function (e) {
          if (pointerDragged) {
            _this2.handleSetProgress(e);
          }
        });
        progressBar.addEventListener('pointermove', function (e) {
          _this2.handleMouseMove(e);
          pointerDragged = true;
        });
        progressBar.addEventListener('pointerdown', function (e) {
          // Only handle left click event
          if (e.which === 1) {
            _this2.handleSetProgress(e);
            pointerDragged = false;
          }
        });
      }
    }
  }, {
    key: "updateComponent",
    value: function updateComponent() {
      // Reset refs to initial value
      this.zoomedOutRef.current = true;
      this.currentTrackRef.current = {};
      this.attachListeners();
    }

    /**
     * Keydown event handler for the track button on the player controls,
     * when using keyboard navigation
     * @param {Event} e keydown event
     */
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(e) {
      if (e.which === 32 || e.which === 13) {
        e.preventDefault();
        this.handleTrackScrubberClick();
        e.stopPropagation();
      }
    }
  }, {
    key: "handleClick",
    value: function handleClick() {
      this.handleTrackScrubberClick();
    }

    /**
     * Click event handler for the track button on the player controls
     */
  }, {
    key: "handleTrackScrubberClick",
    value: function handleTrackScrubberClick() {
      var currentTrackRef = this.currentTrackRef,
        player = this.player,
        options = this.options;
      // When player is not fully loaded on the page don't show the track scrubber
      if (!options.trackScrubberRef.current || !currentTrackRef.current) return;

      // If player is fullscreen exit before displaying track scrubber
      if (player.isFullscreen()) {
        player.exitFullscreen();
      }
      var tempZoom = this.zoomedOutRef.current;
      this.setZoomedOut(!tempZoom);
    }

    /**
     * Event handler for VideoJS player instance's 'timeupdate' event, which
     * updates the track scrubber from player state.
     */
  }, {
    key: "handleTimeUpdate",
    value: function handleTimeUpdate() {
      var _player$markers$getMa;
      var player = this.player,
        options = this.options,
        zoomedOutRef = this.zoomedOutRef;
      // Hide track-scrubber for inaccessible item if it is open
      if (player.canvasIsEmpty && !zoomedOutRef.current) {
        this.setZoomedOut(true);
      }
      if (player.isDisposed() || player.ended()) return;
      /* 
        Get the current track from the player.markers created from the structure timespans.
        In playlists, markers are timepoint information representing highlighting annotations, 
        therefore omit reading markers information for track scrubber in playlist contexts. 
      */
      var playerCurrentTime = player.currentTime();
      if (player.markers && typeof player.markers !== 'function' && typeof player.markers.getMarkers === 'function' && ((_player$markers$getMa = player.markers.getMarkers()) === null || _player$markers$getMa === void 0 ? void 0 : _player$markers$getMa.length) > 0 && !options.isPlaylist) {
        this.readPlayerMarkers();
      } else {
        var _player$playableDurat, _player$altStart;
        this.setCurrentTrack({
          duration: (_player$playableDurat = player.playableDuration) !== null && _player$playableDurat !== void 0 ? _player$playableDurat : player.duration(),
          time: (_player$altStart = player.altStart) !== null && _player$altStart !== void 0 ? _player$altStart : 0,
          key: '',
          text: 'Complete media file'
        });
        playerCurrentTime = player.srcIndex && player.srcIndex > 0 ? playerCurrentTime + player.altStart : playerCurrentTime;
      }
      this.updateTrackScrubberProgressBar(playerCurrentTime);
    }
    /**
     * Calculate the progress and current time within the track and
     * update them accordingly when the player's 'timeupdate' event fires.
     * @param {Number} currentTime player's current time
     */
  }, {
    key: "updateTrackScrubberProgressBar",
    value: function updateTrackScrubberProgressBar() {
      var currentTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var player = this.player,
        currentTrackRef = this.currentTrackRef;
      // Handle Safari which emits the timeupdate event really quickly
      if (!currentTrackRef.current) {
        if (player.markers && typeof player.markers.getMarkers === 'function') {
          this.readPlayerMarkers();
        }
      }
      var altStart = player.altStart,
        srcIndex = player.srcIndex;
      // Calculate corresponding time and played percentage values within track
      var trackoffset = srcIndex > 0 ? currentTime - currentTrackRef.current.time + altStart : currentTime - currentTrackRef.current.time;
      var trackpercent = Math.min(100, Math.max(0, 100 * trackoffset / currentTrackRef.current.duration));
      this.populateTrackScrubber(trackoffset, trackpercent);
    }
  }, {
    key: "populateTrackScrubber",
    value:
    /**
     * Update the track scrubber's current time, duration and played percentage
     * when it is visible in UI. 
     * @param {Number} currentTime current time corresponding to the track
     * @param {Number} playedPercentage elapsed time percentage of the track duration
     */
    function populateTrackScrubber() {
      var currentTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var playedPercentage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var trackScrubberRef = this.options.trackScrubberRef;
      if (!trackScrubberRef.current) {
        return;
      }
      var _trackScrubberRef$cur3 = _slicedToArray(trackScrubberRef.current.children, 3),
        currentTimeDisplay = _trackScrubberRef$cur3[0];
        _trackScrubberRef$cur3[1];
        var durationDisplay = _trackScrubberRef$cur3[2];

      // Set the elapsed time percentage in the progress bar of track scrubber
      this.setTrackScrubberValue(playedPercentage, currentTime);

      // Update the track duration
      durationDisplay.innerHTML = timeToHHmmss(this.currentTrackRef.current.duration);
      // Update current time elapsed within the current track
      var cleanTime = !isNaN(currentTime) && currentTime > 0 ? currentTime : 0;
      currentTimeDisplay.innerHTML = timeToHHmmss(cleanTime);
    }
  }, {
    key: "readPlayerMarkers",
    value: function readPlayerMarkers() {
      var tracks = this.player.markers.getMarkers().filter(function (m) {
        return m["class"] == 'ramp--track-marker--fragment';
      });
      if ((tracks === null || tracks === void 0 ? void 0 : tracks.length) > 0) {
        this.setCurrentTrack(tracks[0]);
      }
    }
  }, {
    key: "handleMouseMove",
    value:
    /**
     * Event handler for mouseenter and mousemove pointer events on the
     * the track scrubber. This sets the time tooltip value and its offset
     * position in the UI.
     * @param {Event} e pointer event for user interaction
     */
    function handleMouseMove(e) {
      var timeToolRef = this.options.timeToolRef;
      if (!timeToolRef.current) {
        return;
      }
      var time = this.getTrackTime(e);

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
    }
  }, {
    key: "handleSetProgress",
    value:
    /**
     * Event handler for mousedown event on the track scrubber. This sets the
     * progress percentage within track scrubber and update the player's current time
     * when user clicks on a point within the track scrubber.
     * @param {Event} e pointer event for user interaction
     */
    function handleSetProgress(e) {
      var currentTrackRef = this.currentTrackRef,
        player = this.player;
      if (!currentTrackRef.current) {
        return;
      }
      var trackoffset = this.getTrackTime(e);
      if (trackoffset != undefined) {
        // Calculate percentage of the progress based on the pointer position's
        // time and duration of the track
        var trackpercent = Math.min(100, Math.max(0, 100 * (trackoffset / currentTrackRef.current.duration)));
        this.setTrackScrubberValue(trackpercent, trackoffset);

        /**
         * Only add the currentTrack's start time for a single source items as this is
         * the offset of the time displayed in the track scrubber.
         * For multi-source items; the start time for the currentTrack is the offset of
         * the duration displayed in the main progress-bar, which translates to 0 in the
         * track-scrubber display
         */
        var playerCurrentTime = (player === null || player === void 0 ? void 0 : player.srcIndex) > 0 ? trackoffset : trackoffset + currentTrackRef.current.time;
        player.currentTime(playerCurrentTime);
      }
    }
  }, {
    key: "getTrackTime",
    value:
    /**
     * Convert pointer position on track scrubber to a time value
     * @param {Event} e pointer event for user interaction
     * @returns {Number} time corresponding to the pointer position
     */
    function getTrackTime(e) {
      var currentTrackRef = this.currentTrackRef;
      if (!currentTrackRef.current) {
        return;
      }
      var offsetx = e.offsetX;
      if (offsetx && offsetx != undefined) {
        var time = offsetx / e.target.clientWidth * currentTrackRef.current.duration;
        return time;
      }
    }
  }]);
  return VideoJSTrackScrubber;
}(Button);
videojs.registerComponent('VideoJSTrackScrubber', VideoJSTrackScrubber);

function _createForOfIteratorHelper$2(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$2(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$2(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$2(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen); }
function _arrayLikeToArray$2(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys$5(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$5(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$5(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$5(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
require('@silvermine/videojs-quality-selector')(videojs);
// import vjsYo from './vjsYo';

/**
 * Module to setup VideoJS instance on initial page load and update
 * on successive player reloads on Canvas changes.
 * @param {Object} props
 * @param {Boolean} props.isVideo
 * @param {Boolean} props.isPlaylist
 * @param {Object} props.trackScrubberRef
 * @param {Object} props.scrubberTooltipRef
 * @param {Array} props.tracks
 * @param {String} props.placeholderText
 * @param {Array} props.renderingFiles
 * @param {Boolean} props.enableFileDownload
 * @param {Function} props.loadPrevOrNext
 * @param {Number} props.lastCanvasIndex
 * @param {Boolean} props.enableTitleLink
 * @param {String} props.videoJSLangMap
 * @param {Object} props.options
 */
function VideoJSPlayer(_ref) {
  var enableFileDownload = _ref.enableFileDownload,
    enableTitleLink = _ref.enableTitleLink,
    isVideo = _ref.isVideo,
    options = _ref.options,
    placeholderText = _ref.placeholderText,
    scrubberTooltipRef = _ref.scrubberTooltipRef,
    tracks = _ref.tracks,
    trackScrubberRef = _ref.trackScrubberRef,
    videoJSLangMap = _ref.videoJSLangMap,
    withCredentials = _ref.withCredentials;
  var playerState = usePlayerState();
  var playerDispatch = usePlayerDispatch();
  var manifestState = useManifestState();
  var manifestDispatch = useManifestDispatch();
  var canvasDuration = manifestState.canvasDuration,
    canvasLink = manifestState.canvasLink,
    hasMultiItems = manifestState.hasMultiItems,
    targets = manifestState.targets,
    autoAdvance = manifestState.autoAdvance,
    structures = manifestState.structures,
    canvasSegments = manifestState.canvasSegments;
  var hasStructure = structures.hasStructure,
    structItems = structures.structItems;
  var clickedUrl = playerState.clickedUrl,
    isEnded = playerState.isEnded,
    isPlaying = playerState.isPlaying,
    currentTime = playerState.currentTime;
  var _useLocalStorage = useLocalStorage('startVolume', 1),
    _useLocalStorage2 = _slicedToArray(_useLocalStorage, 2),
    startVolume = _useLocalStorage2[0],
    setStartVolume = _useLocalStorage2[1];
  var _useLocalStorage3 = useLocalStorage('startMuted', false),
    _useLocalStorage4 = _slicedToArray(_useLocalStorage3, 2),
    startMuted = _useLocalStorage4[0],
    setStartMuted = _useLocalStorage4[1];
  var _useLocalStorage5 = useLocalStorage('startCaptioned', true),
    _useLocalStorage6 = _slicedToArray(_useLocalStorage5, 2),
    startCaptioned = _useLocalStorage6[0],
    setStartCaptioned = _useLocalStorage6[1];
  var _useLocalStorage7 = useLocalStorage('startQuality', null),
    _useLocalStorage8 = _slicedToArray(_useLocalStorage7, 2),
    startQuality = _useLocalStorage8[0],
    setStartQuality = _useLocalStorage8[1];
  var videoJSRef = useRef(null);
  var captionsOnRef = useRef();
  var activeTextTrackRef = useRef();
  var _useMediaPlayer = useMediaPlayer(),
    canvasIndex = _useMediaPlayer.canvasIndex,
    canvasIsEmpty = _useMediaPlayer.canvasIsEmpty,
    lastCanvasIndex = _useMediaPlayer.lastCanvasIndex;
  var _useSetupPlayer = useSetupPlayer({
      enableFileDownload: enableFileDownload,
      withCredentials: withCredentials,
      lastCanvasIndex: lastCanvasIndex
    }),
    isPlaylist = _useSetupPlayer.isPlaylist,
    renderingFiles = _useSetupPlayer.renderingFiles,
    srcIndex = _useSetupPlayer.srcIndex,
    switchPlayer = _useSetupPlayer.switchPlayer;
  var _useShowInaccessibleM = useShowInaccessibleMessage({
      lastCanvasIndex: lastCanvasIndex
    }),
    messageTime = _useShowInaccessibleM.messageTime;
  var canvasIsEmptyRef = useRef();
  canvasIsEmptyRef.current = useMemo(function () {
    return canvasIsEmpty;
  }, [canvasIsEmpty]);
  var isEndedRef = useRef();
  isEndedRef.current = useMemo(function () {
    return isEnded;
  }, [isEnded]);
  var isPlayingRef = useRef();
  isPlayingRef.current = useMemo(function () {
    return isPlaying;
  }, [isPlaying]);
  var autoAdvanceRef = useRef();
  autoAdvanceRef.current = useMemo(function () {
    return autoAdvance;
  }, [autoAdvance]);
  var srcIndexRef = useRef();
  srcIndexRef.current = useMemo(function () {
    return srcIndex;
  }, [srcIndex]);
  var currentTimeRef = useRef();
  currentTimeRef.current = useMemo(function () {
    return currentTime;
  }, [currentTime]);
  var tracksRef = useRef();
  tracksRef.current = useMemo(function () {
    return tracks;
  }, [tracks]);
  var clickedUrlRef = useRef();
  clickedUrlRef.current = useMemo(function () {
    return clickedUrl;
  }, [clickedUrl]);

  /**
   * Setup player with player-related information parsed from the IIIF
   * Manifest Canvas. This gets called on both initial page load and each
   * Canvas switch to setup and update player respectively.
   * @param {Object} player current player instance from Video.js
   */
  var playerInitSetup = function playerInitSetup(player) {
    player.on('ready', function () {
      console.log('Player ready');
      setControlBar(player);

      // Add this class in mobile/tablet devices to always show the control bar,
      // since the inactivityTimeout is flaky in some browsers
      if (IS_MOBILE || IS_IPAD) {
        player.controlBar.addClass('vjs-mobile-visible');
      }

      /**
       * When source is not supported in VideoJS handle re-direct the error to the
       * custom function in the 'error' event handler in this code.
       */
      if (player.error()) {
        player.trigger('error');
      } else {
        player.muted(startMuted);
        player.volume(startVolume);
        player.canvasIndex = cIndexRef.current;
        player.duration(canvasDuration);
        player.srcIndex = srcIndex;
        player.targets = targets;
        if (enableTitleLink) player.canvasLink = canvasLink;

        // Need to set this once experimentalSvgIcons option in Video.js options was enabled
        player.getChild('controlBar').qualitySelector.setIcon('cog');
      }
    });
    player.on('emptied', function () {
      var _tracksRef$current, _player$textTracks, _tracksRef$current2;
      /**
       * In the quality-selector plugin used in Ramp, when the player is using remote 
       * text tracks they get cleared upon quality selection.
       * This is a known issue with @silvermine/videojs-quality-selector plugin.
       * When a new source is selected this event is invoked. So, we are using this event
       * to check whether the current video player has tracks when tracks are available as
       * annotations in the Manifest and adding them back in.
       */
      if (((_tracksRef$current = tracksRef.current) === null || _tracksRef$current === void 0 ? void 0 : _tracksRef$current.length) > 0 && isVideo && ((_player$textTracks = player.textTracks()) === null || _player$textTracks === void 0 ? void 0 : _player$textTracks.length) <= ((_tracksRef$current2 = tracksRef.current) === null || _tracksRef$current2 === void 0 ? void 0 : _tracksRef$current2.length)) {
        // Remove any existing text tracks in Safari, as it handles tracks differently
        if (IS_SAFARI) {
          var oldTracks = player.remoteTextTracks();
          var i = oldTracks.length;
          while (i--) {
            player.removeRemoteTextTrack(oldTracks[i]);
          }
        }
        tracksRef.current.forEach(function (track) {
          var _activeTextTrackRef$c;
          // Enable the previously selected track and disable others (default)
          if (track.label == ((_activeTextTrackRef$c = activeTextTrackRef.current) === null || _activeTextTrackRef$c === void 0 ? void 0 : _activeTextTrackRef$c.label)) {
            track.mode = 'showing';
          } else {
            track.mode = 'disabled';
          }
          player.addRemoteTextTrack(track, false);
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
    player.on('resize', function () {
      setControlBar(player);
    });
    player.on('ended', function () {
      /**
       * Checking against isReadyRef.current stops from delayed events being executed
       * when transitioning from a Canvas to the next.
       * Checking against isPlayingRef.current to distinguish whether this event
       * triggered intentionally, because Video.js seem to trigger this event when
       * switching to a media file with a shorter duration in Safari browsers.
       */
      setTimeout(function () {
        if (isReadyRef.current && isPlayingRef.current) {
          playerDispatch({
            isEnded: true,
            type: 'setIsEnded'
          });
          player.pause();
          if (!canvasIsEmptyRef.current) handleEnded();
        }
      }, 100);
    });
    player.on('volumechange', function () {
      setStartMuted(player.muted());
      setStartVolume(player.volume());
    });
    /**
     * Setting 'isReady' to true triggers the 'videojs-markers' plugin to add track/playlist/search 
     * markers to the progress-bar.
     * When 'isReady' is set to true in the same event (loadedmetadata) where, player.load() is called for
     * Safari and iOS browsers, causes the player to reload after the markers are added.
     * This resets the player, causing the added markers to disppear. This is a known issue
     * of the 'videojs-markers' plugin.
     * Therefor, set 'isReady' to true in loadeddata event, which emits after player.load() is invoked.
     */
    player.on('loadeddata', function () {
      setIsReady(true);
      // Invoke timeupdate handler to update fragmentMarkers in the progress-bar
      handleTimeUpdate();
    });
    player.on('qualityRequested', function (e, quality) {
      setStartQuality(quality.label);
    });
    player.on('seeked', function (e) {
      /**
       * Once the player is fully loaded this event is triggered automatically by VideoJS, because
       * the initial load process can be interpreted as a seek operation to the begining of the
       * media. 
       * If the player is revealed before this initial event and the user scrubs the time-rail,
       * the user action will get reset by the initial seek event by VideoJS.
       * Therefore, we should allow the user to interact with the player only after
       * this, thus revealing the player at this stage and not in any of the events
       * that happen prior to this, such as loadedmetadata/progress/ready.
       */
      if (player.hasClass('vjs-disabled')) {
        player.removeClass('vjs-disabled');
      }
      /**
       * In Safari browsers, player.load() is called on 'loadeddata' event, because the player doesn't 
       * automatically reach a state where a user can scrub/seek before starting playback. This is not
       * an issue with other browsers.
       * When player.load() is called, the player gets reset undoing any seek/scrub activities performed
       * within that brief window of time. This can happen due to fast user reactions, slowed performance
       * of the browser, or network latency.
       * This code helps to store the seeked time in these scenarios and re-seek the player to the initial
       * seeked time-point on player.load() call.
       * Additional check for player.readyState() != 4 is to avoid this code block from executing when using
       * seek action to navigate to a timepoint in Annotations.
       */
      if (player.readyState() != 4 && player.currentTime() == 0 && player.currentTime() != currentTimeRef.current) {
        player.currentTime(currentTimeRef.current);
      }
      /**
       * Use setTimeout to add dispatch action to update global state with the current time from 'seek' action,
       * to the event queue to be called when the current call stack is empty. 
       * This is needed to avoid the dispatch action from executing before the player's currentTime is updated.
       */
      setTimeout(function () {
        playerDispatch({
          type: 'setCurrentTime',
          currentTime: player.currentTime()
        });
      }, 0);
    });
    // Use error event listener for inaccessible item display
    player.on('error', function (e) {
      var error = player.error();
      var errorMessage = 'Something went wrong. Please try again later or contact support for help.';
      // Handle different error codes
      switch (error.code) {
        case 1:
          console.error('MEDIA_ERR_ABORTED: The fetching process for the media resource was aborted by the user agent\
             at the user’s request.');
          break;
        case 2:
          errorMessage = 'The media could not be loaded due to a network error. Please try again later.';
          console.error('MEDIA_ERR_NETWORK: A network error caused the user agent to stop fetching the media resource,\
             after the resource was established to be usable.');
          break;
        case 3:
          errorMessage = 'Media is corrupt or has features not supported by the browser. \
          Please try a different media or contact support for help.';
          console.error('MEDIA_ERR_DECODE: An error occurred while decoding the media resource, after\
             the resource was established to be usable.');
          break;
        case 4:
          errorMessage = 'Media could not be loaded.  Network error or media format is not supported.';
          console.error('MEDIA_ERR_SRC_NOT_SUPPORTED: The media resource indicated by the src attribute was not suitable.');
          break;
        default:
          console.error('An unknown error occurred.');
          break;
      }
      // Show dismissable error display modal from Video.js
      var errorDisplay = player.getChild('ErrorDisplay');
      if (errorDisplay) {
        errorDisplay.contentEl().innerText = errorMessage;
        errorDisplay.removeClass('vjs-hidden');
        player.removeClass('vjs-error');
        player.removeClass('vjs-disabled');
      }
      e.stopPropagation();
    });
    playerLoadedMetadata(player);
  };

  /**
   * Set control bar width to offset 12px from left/right edges of player.
   * This is set on player.ready and player.resize events.
   * @param {Object} player 
   */
  var setControlBar = function setControlBar(player) {
    var playerWidth = player.currentWidth();
    var controlBarWidth = playerWidth - 24;
    player.controlBar.width("".concat(controlBarWidth, "px"));
  };

  /**
   * Update player properties and data when player is reloaded with
   * source change, i.e. Canvas change
   * @param {Object} player 
   */
  var updatePlayer = function updatePlayer(player) {
    player.duration(canvasDuration);
    player.src(options.sources);
    player.poster(options.poster);
    player.canvasIndex = cIndexRef.current;
    player.canvasIsEmpty = canvasIsEmptyRef.current;
    player.srcIndex = srcIndex;
    player.targets = targets;
    if (enableTitleLink) player.canvasLink = canvasLink;

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
       - volume panel
       - if tracks exists: captions button for video players
       - appearance of the player: big play button and aspect ratio of the player 
        based on media type
       - file download menu
    */
    if (player.getChild('controlBar') != null && !canvasIsEmpty) {
      var controlBar = player.getChild('controlBar');
      // Index of the volumepanel/mutetoggle in the player's control bar
      var volumeIndex = IS_MOBILE ? controlBar.children().findIndex(function (c) {
        return c.name_ == 'MuteToggle';
      }) : controlBar.children().findIndex(function (c) {
        return c.name_ == 'VolumePanel';
      });
      /*
        Track-scrubber button: remove if the Manifest is not a playlist manifest
        or the current Canvas doesn't have structure items. Or add back in if it's
        not present otherwise.
       */
      if (!(hasStructure || isPlaylist)) {
        controlBar.removeChild('videoJSTrackScrubber');
      } else if (!controlBar.getChild('videoJSTrackScrubber')) {
        // Add track-scrubber button after duration display if it is not available
        controlBar.addChild('videoJSTrackScrubber', {
          trackScrubberRef: trackScrubberRef,
          timeToolRef: scrubberTooltipRef
        }, volumeIndex + 1);
      }
      /**
       * Volume panel display on desktop browsers:
       * For audio: volume panel is inline with a sticky volume slider
       * For video: volume panel is not inline.
       * For mobile devices the player uses MuteToggle for both audio
       * and video.
       */
      if (!IS_MOBILE) {
        controlBar.removeChild('volumePanel');
        controlBar.addChild('volumePanel', {
          inline: !isVideo
        }, volumeIndex);
        /* 
          Trigger ready event to reset the volume slider in the refreshed 
          volume panel. This is needed on player reload, since volume slider 
          is set on either 'ready' or 'volumechange' events.
        */
        player.trigger('volumechange');
      }
      if ((tracks === null || tracks === void 0 ? void 0 : tracks.length) > 0 && isVideo && !controlBar.getChild('subsCapsButton')) {
        var subsCapBtn = controlBar.addChild('subsCapsButton', {}, volumeIndex + 1);
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
      if (enableFileDownload) {
        // Index of the full-screen toggle in the player's control bar
        var fullscreenIndex = controlBar.children().findIndex(function (c) {
          return c.name_ == 'FullscreenToggle';
        });
        var fileDownloadIndex = controlBar.children().findIndex(function (c) {
          return c.name_ == 'VideoJSFileDownload';
        });
        // If fileDownload button is not present, add it at the index of fullscreen toggle
        fileDownloadIndex = fileDownloadIndex < 0 ? fullscreenIndex : fileDownloadIndex;
        controlBar.removeChild('videoJSFileDownload');
        if ((renderingFiles === null || renderingFiles === void 0 ? void 0 : renderingFiles.length) > 0) {
          var fileOptions = {
            title: 'Download Files',
            controlText: 'Alternate resource download',
            files: renderingFiles
          };
          controlBar.addChild('videoJSFileDownload', _objectSpread$5({}, fileOptions), fileDownloadIndex);
        }
      }
    }

    /**
     * Set structStart variable in the updated player to update the progressBar with the
     * correct time when using StructuredNavigation to switch between canvases.
     * Set this before loadedmetadata event, because progress-bar uses this value in the
     * update() function before that event emits.
     */
    player.structStart = currentTimeRef.current;
    playerLoadedMetadata(player);
  };

  /**
   * Setup on loadedmetadata event is broken out of initial setup function,
   * since this needs to be called when reloading the player on Canvas change
   * @param {Object} player Video.js player instance
   */
  var playerLoadedMetadata = function playerLoadedMetadata(player) {
    player.one('loadedmetadata', function () {
      console.log('Player loadedmetadata');

      // Update control-bar width on player reload
      setControlBar(player);
      player.duration(canvasDuration);

      /**
       * By default VideoJS instance doesn't load enough data on page load for Safari browsers,
       * to seek to timepoints using structured navigation/markers. Therefore, force the player
       * reach a ready state, where enough information is available for the user to use these
       * functionalities by invoking player.load().
       * This is especially required, when player/tab is muted for audio players in Safari.
       * Since, it is not possible to detect muted tabs in JS the condition avoids
       * checking for muted state altogether.
       * Without this, Safari will not reach player.readyState() = 4, the state
       * which indicates the player that enough data is available on the media
       * for playback.
       * Have this execute before handling player events, so that the player functions as
       * expected across all browsers.
       */
      if ((IS_SAFARI || IS_IOS) && player.readyState() != 4) {
        player.load();
      }
      isEndedRef.current ? player.currentTime(0) : player.currentTime(currentTimeRef.current);
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
            /**
             * Set currentTime to updated currentTime either through structure navigation
             * or scrubbing that had taken place prior to fully loading the player.
             */
            player.currentTime(currentTimeRef.current);
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
      var mediaRange = getMediaFragment(player.src(), canvasDuration);
      if (mediaRange != undefined) {
        player.playableDuration = mediaRange.end - mediaRange.start;
        player.altStart = mediaRange.start;
      } else {
        player.playableDuration = canvasDuration;
        player.altStart = targets[srcIndex].altStart;
      }
      player.canvasIndex = cIndexRef.current;

      /**
       * Update currentNavItem on loadedmetadata event in Safari, as it doesn't 
       * trigger the 'timeupdate' event intermittently on load.
       */
      if (IS_SAFARI) {
        handleTimeUpdate();
      }
    });
  };
  var _useVideoJSPlayer = useVideoJSPlayer({
      options: options,
      playerInitSetup: playerInitSetup,
      updatePlayer: updatePlayer,
      startQuality: startQuality,
      tracks: tracks,
      videoJSRef: videoJSRef,
      videoJSLangMap: videoJSLangMap
    }),
    activeId = _useVideoJSPlayer.activeId,
    fragmentMarker = _useVideoJSPlayer.fragmentMarker,
    isReadyRef = _useVideoJSPlayer.isReadyRef,
    playerRef = _useVideoJSPlayer.playerRef,
    setActiveId = _useVideoJSPlayer.setActiveId,
    setFragmentMarker = _useVideoJSPlayer.setFragmentMarker,
    setIsReady = _useVideoJSPlayer.setIsReady;
  var cIndexRef = useRef();
  cIndexRef.current = useMemo(function () {
    return canvasIndex;
  }, [canvasIndex]);
  var activeIdRef = useRef();
  activeIdRef.current = useMemo(function () {
    return activeId;
  }, [activeId]);

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
          if (startCaptioned && activeTextTrackRef.current) {
            textTracks.tracks_.filter(function (t) {
              return t.label === activeTextTrackRef.current.label && t.language === activeTextTrackRef.current.language;
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

      // Enable the first caption when captions are enabled in the session
      if (firstSubCap && startCaptioned) {
        firstSubCap.mode = 'showing';
        activeTextTrackRef.current = firstSubCap;
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
          activeTextTrackRef.current = textTracks[_i];
        }
      }
      var subsOn = trackModes.includes('showing') ? true : false;
      handleCaptionChange(subsOn);
      setStartCaptioned(subsOn);
    });
  };

  /**
   * Add CSS class to icon to indicate captions are on/off in player control bar
   * @param {Boolean} subsOn flag to indicate captions are on/off
   */
  var handleCaptionChange = function handleCaptionChange(subsOn) {
    var player = playerRef.current;
    /**
     * When subsCapsButton is not setup on Video.js initialization step, and is 
     * later added in updatePlayer() function player.controlBar.getChild() method
     * needs to be used to access it.
     */
    var subsCapsBtn = player.controlBar.getChild('subsCapsButton');
    /* 
      For audio instances Video.js is setup to not to build the CC button 
      in Ramp's player control bar.
    */
    if (subsCapsBtn == undefined || !subsCapsBtn || !(subsCapsBtn !== null && subsCapsBtn !== void 0 && subsCapsBtn.children_)) {
      return;
    }
    if (subsOn) {
      subsCapsBtn.children_[0].addClass('captions-on');
      captionsOnRef.current = true;
    } else {
      subsCapsBtn.children_[0].removeClass('captions-on');
      captionsOnRef.current = false;
      // Clear active text track
      activeTextTrackRef.current = null;
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
  var handleEnded = useMemo(function () {
    return throttle_1(function () {
      var isLastCanvas = cIndexRef.current === lastCanvasIndex;
      /**
       * Do nothing if Canvas is not multi-sourced AND autoAdvance is turned off 
       * OR current Canvas is the last Canvas in the Manifest
       */
      if ((!autoAdvanceRef.current || isLastCanvas) && !hasMultiItems) {
        return;
      } else {
        // Remove all the existing structure related markers in the player
        if (playerRef.current && playerRef.current.markers) {
          playerRef.current.pause();
          setFragmentMarker(null);
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
            playerRef.current.play();
          } else {
            return;
          }
        } else if ((structItems === null || structItems === void 0 ? void 0 : structItems.length) > 0) {
          var nextItem = structItems[cIndexRef.current + 1];
          if (nextItem) {
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
            var firstTimespanInNextCanvas = canvasSegments.filter(function (t) {
              return t.canvasIndex === nextItem.canvasIndex && t.itemIndex === 1;
            });
            // If the nextItem doesn't have an ID (a Canvas media fragment) pick the first timespan
            // in the next Canvas
            var nextFirstItem = nextItem.id != undefined ? nextItem : firstTimespanInNextCanvas[0];
            var start = 0;
            if (nextFirstItem != undefined && nextFirstItem.id != undefined) {
              start = nextFirstItem.times.start;
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
              // Only play if the next item is not an inaccessible item
              if (!nextItem.isEmpty) playerRef.current.play();
            }
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
  var handleTimeUpdate = useMemo(function () {
    return throttle_1(function () {
      var player = playerRef.current;
      if (player && isReadyRef.current) {
        var _player$currentTime;
        var playerTime = (_player$currentTime = player.currentTime()) !== null && _player$currentTime !== void 0 ? _player$currentTime : currentTimeRef.current;
        if (hasMultiItems && srcIndexRef.current > 0) {
          playerTime = playerTime + targets[srcIndexRef.current].altStart;
        }
        var activeSegment = getActiveSegment(playerTime);
        // the active segment has changed
        if (activeIdRef.current !== (activeSegment === null || activeSegment === void 0 ? void 0 : activeSegment.id)) {
          if (!activeSegment) {
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
              var _activeSegment$times = activeSegment.times,
                start = _activeSegment$times.start,
                end = _activeSegment$times.end;
              playerDispatch({
                endTime: end,
                startTime: start,
                type: 'setTimeFragment'
              });
              if (start !== end) {
                // don't let marker extend past the end of the canvas
                var markerEnd = end > activeSegment.canvasDuration ? activeSegment.canvasDuration : end;
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
        /**
         * Active segment is re-calculated on 'timeupdate' event. This active segment is then, used to
         * update the active timespan in StrucutredNavigation component and to enable time-rail
         * highlight for structure within the player using fragmentMarkers.
         * When playback is happening uninterrupted by StructuredNavigation, the most granular timespan
         * gets highlighted in both places if there are overlapping timespans (default behavior).
         * When structured navigation is used during playback, the clicked timespan should take
         * precedence over the above behavior to visualize the user interaction. For this, 'getActiveSegment'
         * in the above code uses 'clickedUrl' (media-fragment of the clicked timespan) global state variable
         * to filter the active segment.
         * Once player's currentTime gets out of range of the last clicked timespan,
         * clear 'clickedUrl' in global state to enable the default behavior in creating highlights 
         * and clear player.structStart used for progress updates in iOS native player.
         */
        if (clickedUrlRef.current) {
          var _getMediaFragment = getMediaFragment(clickedUrlRef.current, player.duration),
            _start = _getMediaFragment.start,
            _end = _getMediaFragment.end;
          if (player.currentTime() < _start || player.currentTime() > _end) {
            var _player$targets$0$sta, _player$targets$;
            playerDispatch({
              type: 'clearClickedUrl'
            });
            player.structStart = (_player$targets$0$sta = player === null || player === void 0 ? void 0 : (_player$targets$ = player.targets[0]) === null || _player$targets$ === void 0 ? void 0 : _player$targets$.start) !== null && _player$targets$0$sta !== void 0 ? _player$targets$0$sta : 0;
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
    var player = playerRef.current;
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
    if (isPlaylist) {
      // For playlists timespans and canvasIdex are mapped one-to-one
      return canvasSegments[cIndexRef.current];
    } else {
      var timeRounded = roundToPrecision(time);
      // Segments that contains the current time of the player
      var possibleActiveSegments = canvasSegments.filter(function (c) {
        var inCanvas = checkSrcRange(c.times, c.canvasDuration);
        if (inCanvas && timeRounded >= c.times.start && timeRounded < c.times.end) {
          return c;
        }
      });
      /**
       * If the last clicked timespan is a possibly active segment, then remove others.
       * This prioritizes and visualizes user interactions with StructuredNavigation. 
       */
      if (clickedUrlRef.current) {
        var clickedSegment = possibleActiveSegments.filter(function (s) {
          return s.id === clickedUrlRef.current;
        });
        possibleActiveSegments = (clickedSegment === null || clickedSegment === void 0 ? void 0 : clickedSegment.length) > 0 ? clickedSegment : possibleActiveSegments;
      }
      // Find the relevant media segment from given possibilities
      var _iterator = _createForOfIteratorHelper$2(possibleActiveSegments),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var segment = _step.value;
          var isCanvas = segment.isCanvas,
            _canvasDuration = segment.canvasDuration,
            _canvasIndex = segment.canvasIndex,
            times = segment.times;
          if (_canvasIndex == cIndexRef.current + 1) {
            // Canvases without structure has the Canvas information
            // in Canvas-level item as a navigable link
            if (isCanvas) {
              return segment;
            }
            var isInRange = checkSrcRange(times, _canvasDuration);
            var isInSegment = timeRounded >= times.start && timeRounded < times.end;
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
   * Click event handler for previous/next buttons in inaccessible
   * message display
   * @param {Number} c updated Canvas index upon event trigger
   */
  var handlePrevNextClick = function handlePrevNextClick(c) {
    switchPlayer(c, true);
  };

  /**
   * Keydown event handler for previou/next buttons in inaccessible
   * message display.
   * IMPORTANT: btnName param should be either 'nextBtn' or 'previousBtn'
   * @param {Event} e keydown event
   * @param {Number} c update Canvas index upon event trigger
   * @param {String} btnName name of the pressed button
   */
  var handlePrevNextKeydown = function handlePrevNextKeydown(e, c, btnName) {
    if (e.which === 32 || e.which === 13) {
      switchPlayer(c, true, btnName);
    }
  };
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
      textAlign: 'center',
      color: '#fff',
      backgroundColor: 'black',
      zIndex: 101,
      aspectRatio: !playerRef.current ? '16/9' : ''
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "ramp--media-player_inaccessible-message-content",
    "data-testid": "inaccessible-message-content",
    dangerouslySetInnerHTML: {
      __html: placeholderText
    }
  }), lastCanvasIndex > 0 && /*#__PURE__*/React.createElement("div", {
    className: "ramp--media-player_inaccessible-message-buttons",
    "data-testid": "inaccessible-message-buttons"
  }, canvasIndex >= 1 && /*#__PURE__*/React.createElement("button", {
    "aria-label": "Go back to previous item",
    onClick: function onClick() {
      return handlePrevNextClick(canvasIndex - 1);
    },
    onKeyDown: function onKeyDown(e) {
      return handlePrevNextKeydown(e, canvasIndex - 1, 'previousBtn');
    },
    "data-testid": "inaccessible-previous-button"
  }, /*#__PURE__*/React.createElement(SectionButtonIcon, {
    flip: true
  }), " Previous"), canvasIndex != lastCanvasIndex && /*#__PURE__*/React.createElement("button", {
    "aria-label": "Go to next item",
    onClick: function onClick() {
      return handlePrevNextClick(canvasIndex + 1);
    },
    onKeyDown: function onKeyDown(e) {
      return handlePrevNextKeydown(e, canvasIndex + 1, 'nextBtn');
    },
    "data-testid": "inaccessible-next-button"
  }, "Next ", /*#__PURE__*/React.createElement(SectionButtonIcon, null))), canvasIndex != lastCanvasIndex && lastCanvasIndex > 0 && /*#__PURE__*/React.createElement("p", {
    "data-testid": "inaccessible-message-timer",
    className: cx('ramp--media-player_inaccessible-message-timer', autoAdvanceRef.current ? '' : 'hidden')
  }, "Next item in ".concat(messageTime, " second").concat(messageTime === 1 ? '' : 's'))), /*#__PURE__*/React.createElement("video", {
    "data-testid": "videojs-".concat(isVideo ? 'video' : 'audio', "-element"),
    "data-canvasindex": cIndexRef.current,
    ref: videoJSRef,
    className: cx('video-js vjs-big-play-centered vjs-theme-ramp vjs-disabled', IS_ANDROID ? 'is-mobile' : ''),
    onTouchStart: saveTouchStartCoords,
    onTouchEnd: mobilePlayToggle,
    style: {
      display: "".concat(canvasIsEmptyRef.current ? 'none' : '')
    }
  })), (hasStructure || isPlaylist) && /*#__PURE__*/React.createElement("div", {
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
  }, !IS_TOUCH_ONLY && /*#__PURE__*/React.createElement("span", {
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
  enableFileDownload: PropTypes.bool,
  enableTitleLink: PropTypes.bool,
  isVideo: PropTypes.bool,
  options: PropTypes.object,
  placeholderText: PropTypes.string,
  scrubberTooltipRef: PropTypes.object,
  tracks: PropTypes.array,
  trackScrubberRef: PropTypes.object,
  videoJSLangMap: PropTypes.string,
  withCredentials: PropTypes.bool
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

function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$4(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$4(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var PLAYER_ID = 'iiif-media-player';

/**
 * Parse resource related information form the current canvas in manifest,
 * and build an options object for Video.js using that information.
 * @param {Object} props
 * @param {Boolean} props.enableFileDownload
 * @param {Boolean} props.enablePIP
 * @param {Boolean} props.enablePlaybackRate
 * @param {Boolean} props.enableTitleLink
 * @param {Boolean} props.withCredentials
 * @param {String} props.language
 */
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
    withCredentials = _ref$withCredentials === void 0 ? false : _ref$withCredentials,
    _ref$language = _ref.language,
    language = _ref$language === void 0 ? 'en' : _ref$language;
  var manifestState = useManifestState();
  var playerState = usePlayerState();
  var _useErrorBoundary = useErrorBoundary(),
    showBoundary = _useErrorBoundary.showBoundary;
  var srcIndex = manifestState.srcIndex,
    playlist = manifestState.playlist,
    structures = manifestState.structures;
  var isPlaylist = playlist.isPlaylist;
  var hasStructure = structures.hasStructure;
  var currentTime = playerState.currentTime;
  var trackScrubberRef = useRef();
  var timeToolRef = useRef();
  var videoJSLangMap = useRef('{}');
  var _useMediaPlayer = useMediaPlayer(),
    canvasIsEmpty = _useMediaPlayer.canvasIsEmpty,
    canvasIndex = _useMediaPlayer.canvasIndex,
    isMultiCanvased = _useMediaPlayer.isMultiCanvased,
    lastCanvasIndex = _useMediaPlayer.lastCanvasIndex;
  var _useSetupPlayer = useSetupPlayer({
      enableFileDownload: enableFileDownload,
      lastCanvasIndex: lastCanvasIndex,
      withCredentials: withCredentials
    }),
    isMultiSourced = _useSetupPlayer.isMultiSourced,
    isVideo = _useSetupPlayer.isVideo,
    playerConfig = _useSetupPlayer.playerConfig,
    ready = _useSetupPlayer.ready,
    renderingFiles = _useSetupPlayer.renderingFiles,
    nextItemClicked = _useSetupPlayer.nextItemClicked,
    switchPlayer = _useSetupPlayer.switchPlayer;
  var error = playerConfig.error,
    poster = playerConfig.poster,
    sources = playerConfig.sources,
    targets = playerConfig.targets,
    tracks = playerConfig.tracks;

  // Using dynamic imports to enforce code-splitting in webpack
  // https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import
  var loadVideoJSLanguageMap = useMemo(function () {
    return /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
      var resources;
      return regenerator.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return import("video.js/dist/lang/".concat(language, ".json"));
          case 3:
            resources = _context.sent;
            videoJSLangMap.current = JSON.stringify(resources);
            _context.next = 11;
            break;
          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            console.warn("".concat(language, " is not available, defaulting to English"));
            videoJSLangMap.current = JSON.stringify(en);
          case 11:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[0, 7]]);
    }));
  }, [language]);
  useEffect(function () {
    try {
      loadVideoJSLanguageMap();
    } catch (e) {
      showBoundary(e);
    }
  }, []);

  // Default VideoJS options not updated with the Canvas data
  var defaultOptions = useMemo(function () {
    return {
      autoplay: false,
      id: PLAYER_ID,
      playbackRates: enablePlaybackRate ? [0.5, 0.75, 1, 1.5, 2] : [],
      experimentalSvgIcons: true,
      controls: true,
      fluid: true,
      language: language,
      // Setting inactivity timeout to zero in mobile and tablet devices translates to
      // user is always active. And the control bar is not hidden when user is active.
      // With this user can always use the controls when the media is playing.
      inactivityTimeout: IS_MOBILE || IS_TOUCH_ONLY ? 0 : 2000,
      // In iOS devices the player uses native iOS player either by default or on fullscreen-mode.
      // For instance where iOS player is used for playback, native text track functionality
      // needs to be turned ON for captions to work properly between VideoJS player and
      // iOS player. 
      // Therefore, turn on 'nativeTextTracks' option for browser and OS combinations
      // where the native iOS player is used by default or on fullscreen-mode.
      // i.e. Both Safari and Chrome on iPhones, only Chrome on iPads.
      html5: {
        nativeTextTracks: !IS_ANDROID && (IS_IPAD && !IS_SAFARI || IS_IPHONE)
      },
      // Make error display modal dismissable
      errorDisplay: {
        uncloseable: false
      },
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
      videoJSTitleLink: enableTitleLink,
      sources: []
    };
  }, [language, enablePlaybackRate, enableTitleLink]);

  // Build VideoJS options for the current Canvas from defaultOptions
  var videoJSOptions = useMemo(function () {
    return !canvasIsEmpty ? _objectSpread$4(_objectSpread$4({}, defaultOptions), {}, {
      aspectRatio: isVideo ? '16:9' : '1:0',
      audioOnlyMode: !isVideo,
      bigPlayButton: isVideo,
      poster: isVideo ? poster : null,
      controlBar: {
        // Define and order control bar controls
        // See https://docs.videojs.com/tutorial-components.html for options of what
        // seem to be supported controls
        children: [isMultiCanvased ? 'videoJSPreviousButton' : '', 'playToggle', isMultiCanvased ? 'videoJSNextButton' : '', 'videoJSProgress', 'videoJSCurrentTime', 'timeDivider', 'durationDisplay', 'customControlSpacer',
        // Spacer element from VideoJS
        IS_MOBILE ? 'muteToggle' : 'volumePanel', tracks.length > 0 && isVideo ? 'subsCapsButton' : '', hasStructure || isPlaylist ? 'videoJSTrackScrubber' : '', 'qualitySelector', enablePlaybackRate ? 'playbackRateMenuButton' : '', enablePIP ? 'pictureInPictureToggle' : '', enableFileDownload ? 'videoJSFileDownload' : '', 'fullscreenToggle'
        // 'vjsYo',             custom component
        ],

        videoJSProgress: {
          nextItemClicked: nextItemClicked
        },
        // Make the volume slider horizontal for audio in non-mobile browsers
        volumePanel: !IS_MOBILE && {
          inline: !isVideo
        },
        videoJSCurrentTime: {
          srcIndex: srcIndex,
          targets: targets,
          currentTime: currentTime || 0
        },
        videoJSFileDownload: enableFileDownload && {
          title: 'Download Files',
          controlText: 'Alternate resource download',
          files: renderingFiles
        },
        videoJSPreviousButton: isMultiCanvased && {
          canvasIndex: canvasIndex,
          switchPlayer: switchPlayer
        },
        videoJSNextButton: isMultiCanvased && {
          canvasIndex: canvasIndex,
          lastCanvasIndex: lastCanvasIndex,
          switchPlayer: switchPlayer
        },
        videoJSTrackScrubber: (hasStructure || isPlaylist) && {
          trackScrubberRef: trackScrubberRef,
          timeToolRef: timeToolRef,
          isPlaylist: isPlaylist
        }
      },
      sources: isMultiSourced ? [sources[srcIndex]] : sources,
      errorDisplay: {
        // Show the close button for the error modal, if more than one source OR multiple 
        // canvases are available
        uncloseable: (sources === null || sources === void 0 ? void 0 : sources.length) > 1 || isMultiCanvased ? false : true
      }
    }) : _objectSpread$4(_objectSpread$4({}, defaultOptions), {}, {
      sources: []
    });
  }, [isVideo, playerConfig, srcIndex]);
  if (ready && videoJSOptions != undefined || canvasIsEmpty) {
    return /*#__PURE__*/React.createElement("div", {
      "data-testid": "media-player",
      className: "ramp--media_player",
      role: "complementary",
      "aria-label": "media player"
    }, /*#__PURE__*/React.createElement(VideoJSPlayer, {
      enableFileDownload: enableFileDownload,
      enableTitleLink: enableTitleLink,
      isVideo: isVideo,
      options: videoJSOptions,
      placeholderText: error,
      scrubberTooltipRef: timeToolRef,
      tracks: tracks,
      trackScrubberRef: trackScrubberRef,
      videoJSLangMap: videoJSLangMap.current,
      withCredentials: withCredentials
    }));
  } else {
    return null;
  }
};
MediaPlayer.propTypes = {
  enableFileDownload: PropTypes.bool,
  enablePIP: PropTypes.bool,
  enablePlaybackRate: PropTypes.bool,
  enableTitleLink: PropTypes.bool,
  withCredentials: PropTypes.bool,
  language: PropTypes.string
};

var _extends_1 = createCommonjsModule(function (module) {
function _extends() {
  return module.exports = _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports, _extends.apply(null, arguments);
}
module.exports = _extends, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _extends = /*@__PURE__*/getDefaultExportFromCjs(_extends_1);

var CollapseExpandButton = function CollapseExpandButton(_ref) {
  var numberOfSections = _ref.numberOfSections;
  var _useCollapseExpandAll = useCollapseExpandAll(),
    collapseExpandAll = _useCollapseExpandAll.collapseExpandAll,
    isCollapsed = _useCollapseExpandAll.isCollapsed;
  var handleClick = function handleClick() {
    collapseExpandAll();
  };

  /**
   * Handle keydown event when focused on the button
   * @param {Event} e 
   */
  var handleKeyDown = function handleKeyDown(e) {
    // Toggle collapse/expand all when 'Enter' key is pressed
    if (e.keyCode === 13) {
      e.preventDefault();
      handleClick();
    }
    // Expand all sections if they are collapsed and ArrowRight key is pressed
    if (isCollapsed && e.keyCode === 39) {
      handleClick();
    }
    // Collapse all sections if they are expanded and ArrowLeft key is pressed
    if (!isCollapsed && e.keyCode === 37) {
      handleClick();
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    className: "ramp--structured-nav__collapse-all-btn",
    "data-testid": "collapse-expand-all-btn",
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    role: "button"
  }, isCollapsed ? 'Expand' : 'Close', numberOfSections > 1 ? " ".concat(numberOfSections, " Sections") : ' Section', /*#__PURE__*/React.createElement("i", {
    className: "arrow ".concat(isCollapsed ? 'down' : 'up')
  }));
};

/**
 * Build leaf-level nodes in the structures in Manifest. These nodes can be
 * either timespans (with media fragment) or titles (w/o media fragment).
 * @param {Object} props
 * @param {Number} props.canvasDuration duration of the Canvas associated with the item
 * @param {Number} props.canvasIndex index of the Canvas associated with the item
 * @param {Number} props.duration duration of the item
 * @param {String} props.id media fragemnt of the item
 * @param {Boolean} props.isTitle flag to indicate item w/o mediafragment
 * @param {Boolean} props.isCanvas flag to indicate item is at Canvas-level
 * @param {Boolean} props.isClickable flag to indicate item is within resource duration
 * @param {Boolean} props.isEmpty flag to indicate Canvas associated with item is inaccessible
 * @param {String} props.label text label of the item
 * @param {String} props.summary summary associated with the item (in playlist context)
 * @param {String} props.homepage homepage associated with the item (in playlist context)
 * @param {String} props.isRoot root level node for structure
 * @param {Array} props.items list of children for the item
 * @param {Number} props.itemIndex index of the item within the section/canvas
 * @param {String} props.rangeId unique id of the item
 * @param {Number} props.sectionCount total number of sections in structure
 * @param {Object} props.sectionRef React ref of the section element associated with the item
 * @param {Object} props.structureContainerRef React ref of the structure container
 * @param {Object} props.times start and end times of structure item
 * @param {Function} props.setFocusedItem set the focused item as active item for keyboard navigation
 */
var TreeNode = function TreeNode(_ref) {
  var canvasDuration = _ref.canvasDuration,
    canvasIndex = _ref.canvasIndex,
    duration = _ref.duration,
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
    sectionCount = _ref.sectionCount,
    sectionRef = _ref.sectionRef,
    structureContainerRef = _ref.structureContainerRef,
    times = _ref.times,
    setFocusedItem = _ref.setFocusedItem;
  var liRef = useRef(null);
  var _useCollapseExpandAll = useCollapseExpandAll(),
    isCollapsed = _useCollapseExpandAll.isCollapsed,
    updateSectionStatus = _useCollapseExpandAll.updateSectionStatus;
  // Root structure items are always expanded
  var _useState = useState(isRoot ? false : true),
    _useState2 = _slicedToArray(_useState, 2),
    sectionIsCollapsed = _useState2[0],
    setSectionIsCollapsed = _useState2[1];
  var _useActiveStructure = useActiveStructure({
      itemId: id,
      itemIndex: itemIndex,
      liRef: isSection ? sectionRef : liRef,
      sectionRef: sectionRef,
      structureContainerRef: structureContainerRef,
      isCanvas: isCanvas,
      isEmpty: isEmpty,
      canvasDuration: canvasDuration,
      setSectionIsCollapsed: setSectionIsCollapsed,
      times: times
    }),
    currentNavItem = _useActiveStructure.currentNavItem,
    handleClick = _useActiveStructure.handleClick,
    isActiveLi = _useActiveStructure.isActiveLi,
    isActiveSection = _useActiveStructure.isActiveSection,
    isPlaylist = _useActiveStructure.isPlaylist,
    screenReaderTime = _useActiveStructure.screenReaderTime;

  // Identify item as a section for canvases in non-playlist contexts
  var isSection = useMemo(function () {
    return isCanvas && !isPlaylist;
  }, [isCanvas, isPlaylist]);
  var hasChildren = useMemo(function () {
    return (items === null || items === void 0 ? void 0 : items.length) > 0;
  }, [items]);

  /*
    Auto-scroll active structure item with mediafragment into view only when user 
    is not actively interacting with structured navigation
  */
  useEffect(function () {
    if (liRef.current && (currentNavItem === null || currentNavItem === void 0 ? void 0 : currentNavItem.id) == id && liRef.current.isClicked != undefined && !liRef.current.isClicked && structureContainerRef.current.isScrolling != undefined && !structureContainerRef.current.isScrolling && !isTitle) {
      autoScroll(liRef.current, structureContainerRef);
    }
    // Reset isClicked if active structure item is set
    if (liRef.current) {
      liRef.current.isClicked = false;
    }
  }, [currentNavItem]);

  // Collapse/Expand section when all sections are collapsed/expanded respectively
  useEffect(function () {
    // Do nothing for root structure items
    if (!isRoot && isCollapsed != sectionIsCollapsed) setSectionIsCollapsed(isCollapsed);
  }, [isCollapsed]);

  /*
    Auto-scroll active section into view only when user is not
    actively interacting with structured navigation
  */
  useEffect(function () {
    if (canvasIndex + 1 === itemIndex && sectionRef.current && sectionRef.current.isClicked != undefined && !sectionRef.current.isClicked && structureContainerRef.current.isScrolling != undefined && !structureContainerRef.current.isScrolling && isSection) {
      autoScroll(sectionRef.current, structureContainerRef);
    }
    if (sectionRef.current) sectionRef.current.isClicked = false;
  }, [canvasIndex, isSection]);
  useEffect(function () {
    if (isActiveSection && isSection) {
      autoScroll(sectionRef.current, structureContainerRef);
    }
  }, [isActiveSection]);

  // Build aria-label based on the structure item and context
  var ariaLabel = useMemo(function () {
    if (isPlaylist) {
      return isEmpty ? "Restricted playlist item ".concat(itemIndex).concat(label, " starts a ").concat(CANVAS_MESSAGE_TIMEOUT / 1000, " \n          second timer to auto-advance to next playlist item") : "Playlist item ".concat(itemIndex).concat(label, " ").concat(duration, " starting at ").concat(screenReaderTime);
    } else if (isSection) {
      return id != undefined ? "Load media for Canvas ".concat(itemIndex, ",").concat(label, ",").concat(duration) : isRoot ? "Table of contents for ".concat(label, ",").concat(duration) : "Section for Canvas ".concat(itemIndex).concat(label, ",").concat(duration);
    } else {
      return "Structure item with label ".concat(itemIndex).concat(label, " ").concat(duration, " starting at ").concat(screenReaderTime, " in Canvas ").concat(canvasIndex);
    }
  }, [screenReaderTime, isPlaylist, isSection]);
  var toggleOpen = function toggleOpen() {
    // Update collapse/expand status in the component state
    setSectionIsCollapsed(!sectionIsCollapsed);
    /**
     * Update section status in 'useCollapseExpandAll' hook, to keep track of
     * collapse/expand statuses of each section in UI. When all these are manually updated,
     * use it to change the 'isCollapsed' global state variable accordingly.
     */
    updateSectionStatus(itemIndex - 1, !sectionIsCollapsed);
  };

  // Handle click on section heading button
  var handleSectionClick = function handleSectionClick(e) {
    handleClick(e);
    if (isActiveSection) toggleOpen();
  };

  /**
   * Handle keydown event when focused on a clickable section item
   * @param {Event} e 
   */
  var handleSectionKeyDown = function handleSectionKeyDown(e) {
    // Do nothing when focused on a none time-synced item, e.g.: section without a mediafragment
    if (id === undefined) return;
    // Expand section and update player for keypresses on Enter/Space keys
    if (e.keyCode === 13 || e.keyCode === 32) {
      handleClick(e);
      // Only toggle collapsible section is it's collapsed
      if (sectionIsCollapsed) toggleOpen();
    }
    // If the section is collapsed, toggle it on ArrowRight keypress
    if (e.keyCode == 39 && sectionIsCollapsed) {
      toggleOpen();
    }
    // If the section is expanded, toggle it on ArrowLeft keypress
    if (e.keyCode === 37 && !sectionIsCollapsed) {
      toggleOpen();
      /**
       * When section is collapsed update the focused item in StructuredNavigation 
       * to move focus to the next section on next ArrowDown keypress.
       * activeItem is used in the keydown event handler to re-calculate the next
       * focusable item in the UI outside of the collapsed section.
       */
      setFocusedItem(e.target);
    }
    // If the section is expanded, move focus to the first child on ArrowRight keypress
    if (e.keyCode === 39 && !sectionIsCollapsed && liRef.current) {
      var children = liRef.current.querySelectorAll('a.ramp--structured-nav__item-link');
      if ((children === null || children === void 0 ? void 0 : children.length) > 0) {
        children[0].focus();
        setFocusedItem(children[0]);
      }
      e.stopPropagation();
    }
  };
  var handleLinkKeyDown = function handleLinkKeyDown(e) {
    // ArrowRight keypress does nothing, prevent +5 second jump in playerHotKeys
    if (e.keyCode === 39) {
      e.stopPropagation();
    }
    // ArrowLeft kepress moves the focus to the current section item
    if (e.keyCode === 37 && sectionRef.current) {
      sectionRef.current.focus();
      /**
       * Set activeItem as the current section item. 
       * This helps to navigate to the first child on the next ArrowDown keypress 
       * event without jumping to the previously focused child.
       */
      setFocusedItem(sectionRef.current);
    }
    // Activate the timespan link on Space key press
    if (e.keyCode === 32) {
      handleClick(e);
    }
  };
  var collapsibleButton = function collapsibleButton() {
    return /*#__PURE__*/React.createElement("span", {
      className: "collapse-expand-button",
      tabIndex: -1,
      role: "button",
      "aria-expanded": !sectionIsCollapsed ? 'true' : 'false',
      "aria-label": "".concat(!sectionIsCollapsed ? 'Collapse' : 'Expand', " ").concat(label, " section"),
      "data-testid": "section-collapse-icon",
      onClick: toggleOpen
    }, /*#__PURE__*/React.createElement("i", {
      className: cx('arrow', !sectionIsCollapsed ? 'up' : 'down')
    }));
  };
  var renderTreeNode = function renderTreeNode() {
    return /*#__PURE__*/React.createElement(Fragment, {
      key: rangeId
    }, isSection // Render items as SectionHeadings in non-playlist contexts
    ? /*#__PURE__*/React.createElement("div", {
      className: cx('ramp--structured-nav__section', 'ramp--structured-nav__section-head-buttons', isActiveSection ? 'active' : ''),
      "data-testid": "treeitem-section",
      "data-mediafrag": id !== null && id !== void 0 ? id : '',
      tabIndex: -1
    }, /*#__PURE__*/React.createElement("button", {
      "data-testid": id == undefined ? 'treeitem-section-span' : 'treeitem-section-button',
      ref: sectionRef,
      onClick: id != undefined ? handleSectionClick : null,
      onKeyDown: id != undefined ? handleSectionKeyDown : null,
      "aria-label": ariaLabel,
      role: "button",
      className: cx('ramp--structured-nav__section-title', id == undefined && 'not-clickable', isActiveSection ? 'active' : ''),
      tabIndex: -1
    }, /*#__PURE__*/React.createElement("span", {
      className: "ramp--structured-nav__title",
      "aria-label": label
    }, isRoot ? '' : "".concat(itemIndex, "."), /*#__PURE__*/React.createElement("span", {
      className: "ramp--structured-nav__section-label"
    }, label), duration != '' && /*#__PURE__*/React.createElement("span", {
      className: "ramp--structured-nav__section-duration"
    }, duration))), hasChildren && !isRoot && collapsibleButton()) : /*#__PURE__*/React.createElement(React.Fragment, null, isTitle ? /*#__PURE__*/React.createElement("span", {
      className: "ramp--structured-nav__item-title"
    }, label) : /*#__PURE__*/React.createElement(Fragment, {
      key: id
    }, /*#__PURE__*/React.createElement("div", {
      className: "tracker"
    }), isClickable ? /*#__PURE__*/React.createElement("a", {
      role: "button",
      className: "ramp--structured-nav__item-link",
      href: homepage && homepage != '' ? homepage : id,
      "aria-label": ariaLabel,
      onClick: handleClick,
      onKeyDown: handleLinkKeyDown,
      tabIndex: -1
    }, isEmpty && /*#__PURE__*/React.createElement(LockedSVGIcon, null), "".concat(itemIndex, "."), /*#__PURE__*/React.createElement("span", {
      className: "structured-nav__item-label",
      "aria-label": label
    }, label, " ", duration.length > 0 ? " (".concat(duration, ")") : '')) : /*#__PURE__*/React.createElement("span", {
      "aria-label": label
    }, label))));
  };
  if (label != '') {
    return /*#__PURE__*/React.createElement("li", {
      "data-testid": "tree-item",
      ref: liRef,
      role: "treeitem",
      className: cx('ramp--structured-nav__tree-item', isSection ? 'section-tree-item' : '', isActiveLi ? 'active' : ''),
      "data-label": label,
      "data-summary": summary,
      "aria-expanded": (items === null || items === void 0 ? void 0 : items.length) > 0 ? 'true' : undefined,
      "aria-posinset": isPlaylist ? itemIndex : null
    }, renderTreeNode(), (!sectionIsCollapsed && hasChildren || isTitle) && /*#__PURE__*/React.createElement("ul", {
      className: "ramp--structured-nav__tree",
      role: "group",
      "data-testid": "tree-group"
    }, items.map(function (item, index) {
      return /*#__PURE__*/React.createElement(TreeNode, _extends({}, item, {
        key: index,
        sectionCount: sectionCount,
        sectionRef: sectionRef,
        structureContainerRef: structureContainerRef,
        setFocusedItem: setFocusedItem
      }));
    })));
  }
};
TreeNode.propTypes = {
  canvasDuration: PropTypes.number.isRequired,
  canvasIndex: PropTypes.number.isRequired,
  duration: PropTypes.string.isRequired,
  id: PropTypes.string,
  isTitle: PropTypes.bool.isRequired,
  isCanvas: PropTypes.bool.isRequired,
  isClickable: PropTypes.bool.isRequired,
  isEmpty: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  summary: PropTypes.string,
  homepage: PropTypes.string,
  isRoot: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
  itemIndex: PropTypes.number,
  rangeId: PropTypes.string.isRequired,
  sectionCount: PropTypes.number.isRequired,
  sectionRef: PropTypes.object.isRequired,
  structureContainerRef: PropTypes.object.isRequired,
  times: PropTypes.object.isRequired,
  setFocusedItem: PropTypes.func
};

function _createForOfIteratorHelper$1(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }
function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

/**
 * Parse structures property in the Manifest, and build UI as needed.
 * For playlists: structures is displayed as a list of items.
 * For all the other manifests: each Canvas Range is highlighted as a section in the
 * display and their child elements are displayed in collapsible UI elements
 * respectively.
 * @param {Object} props
 * @param {String} props.showAllSectionsButton
 */
var StructuredNavigation = function StructuredNavigation(_ref) {
  var _structureItemsRef$cu, _structureItemsRef$cu2;
  var _ref$showAllSectionsB = _ref.showAllSectionsButton,
    showAllSectionsButton = _ref$showAllSectionsB === void 0 ? false : _ref$showAllSectionsB,
    _ref$sectionsHeading = _ref.sectionsHeading,
    sectionsHeading = _ref$sectionsHeading === void 0 ? 'Sections' : _ref$sectionsHeading;
  var manifestDispatch = useManifestDispatch();
  var playerDispatch = usePlayerDispatch();
  var _usePlayerState = usePlayerState(),
    clickedUrl = _usePlayerState.clickedUrl,
    isClicked = _usePlayerState.isClicked,
    isPlaying = _usePlayerState.isPlaying,
    player = _usePlayerState.player;
  var _useManifestState = useManifestState(),
    allCanvases = _useManifestState.allCanvases,
    canvasDuration = _useManifestState.canvasDuration,
    canvasIndex = _useManifestState.canvasIndex,
    hasMultiItems = _useManifestState.hasMultiItems,
    targets = _useManifestState.targets,
    manifest = _useManifestState.manifest,
    playlist = _useManifestState.playlist,
    canvasIsEmpty = _useManifestState.canvasIsEmpty,
    canvasSegments = _useManifestState.canvasSegments;
  var _useErrorBoundary = useErrorBoundary(),
    showBoundary = _useErrorBoundary.showBoundary;
  var canvasStructRef = useRef();
  var structureItemsRef = useRef();
  var canvasIsEmptyRef = useRef(canvasIsEmpty);
  var hasRootRangeRef = useRef(false);
  var structureContainerRef = useRef();
  var scrollableStructure = useRef();
  var hasCollapsibleStructRef = useRef(false);

  // Store focused item when changed from TreeNode component
  var focusedItemRef = useRef(null);
  var setFocusedItem = function setFocusedItem(el) {
    focusedItemRef.current = el;
  };
  // Store focused item index in the structure
  var focusedItemIndexRef = useRef(-1);
  var setFocusedItemIndex = function setFocusedItemIndex(i) {
    focusedItemIndexRef.current = i;
  };
  var structureContentRef = useRef(null);
  useEffect(function () {
    // Update currentTime and canvasIndex in state if a
    // custom start time and(or) canvas is given in manifest
    if (manifest) {
      try {
        var _getStructureRanges = getStructureRanges(manifest, allCanvases, playlist.isPlaylist),
          structures = _getStructureRanges.structures,
          timespans = _getStructureRanges.timespans,
          markRoot = _getStructureRanges.markRoot,
          hasCollapsibleStructure = _getStructureRanges.hasCollapsibleStructure;
        structureItemsRef.current = structures;
        canvasStructRef.current = structures;
        hasRootRangeRef.current = markRoot;
        hasCollapsibleStructRef.current = hasCollapsibleStructure && showAllSectionsButton && !playlist.isPlaylist;
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
  useEffect(function () {
    if (canvasIsEmpty && playlist.isPlaylist) {
      manifestDispatch({
        item: canvasSegments[canvasIndex],
        type: 'switchItem'
      });
    }
  }, [canvasIsEmpty, canvasIndex]);
  useEffect(function () {
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
      var currentCanvasIndex = allCanvases.findIndex(function (c) {
        return c.canvasURL === getCanvasId(clickedUrl);
      });
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

        // Use this value in iOS to set the initial progress
        // in the custom progress bar
        player.structStart = timeFragmentStart;
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
      }
    }
  }, [isClicked, player]);

  // Structured nav is populated by the time the player hook fires so we listen for
  // that to run the check on whether the structured nav is scrollable.
  useEffect(function () {
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

  /**
   * Update isScrolling flag within structure container ref, which is
   * used by TreeNode component to decide to/not to auto scroll the content
   * @param {Boolean} state 
   */
  var handleMouseOver = function handleMouseOver(state) {
    structureContainerRef.current.isScrolling = state;
  };
  var handleKeyDown = function handleKeyDown(e) {
    // Get all linked structure items in the component
    var structureItems = structureContainerRef.current.querySelectorAll('button.ramp--structured-nav__section-title, a.ramp--structured-nav__item-link');
    if ((structureItems === null || structureItems === void 0 ? void 0 : structureItems.length) > 0) {
      // Re-calculate the nextIndex when focused item is changed from within TreeNode
      if (focusedItemRef.current) {
        var focusedIndex = Array.prototype.indexOf.call(structureItems, focusedItemRef.current);
        setFocusedItemIndex(focusedIndex);
        //  Reset focused item
        setFocusedItem(null);
      }
      var nextIndex = focusedItemIndexRef.current;
      /**
       * Default behavior is prevented (e.preventDefault()) only for the handled 
       * key combinations to allow other keyboard shortcuts to work as expected.
       */
      if (e.key === 'ArrowDown') {
        // Wraps focus back to first cue when the end of transcript is reached
        nextIndex = (focusedItemIndexRef.current + 1) % structureItems.length;
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        nextIndex = (focusedItemIndexRef.current - 1 + structureItems.length) % structureItems.length;
        e.preventDefault();
      } else if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (structureContainerRef.current.parentElement.parentElement && nextIndex < 0) {
            /**
             * Return focus to the container at root level on (Shift + Tab) key combination 
             * press without navigating through the structure items first
             */
            structureContainerRef.current.parentElement.parentElement.focus();
          } else {
            /**
             * Return focus to parent container on (Shift + Tab) key combination press after
             * the user has navigated through the structure items
             */
            e.preventDefault();
            structureContainerRef.current.parentElement.focus();
          }
          return;
        }
      }

      // Update focus to the next/previous structure item in the list
      if (nextIndex > -1 && nextIndex < structureItems.length) {
        structureItems[focusedItemIndexRef.current] ? structureItems[focusedItemIndexRef.current].tabIndex = -1 : null;
        structureItems[nextIndex].tabIndex = 0;
        structureItems[nextIndex].focus();
        setFocusedItemIndex(nextIndex);
      }
    }
  };
  if (!manifest) {
    return /*#__PURE__*/React.createElement("p", null, "No manifest - Please provide a valid manifest.");
  }
  return /*#__PURE__*/React.createElement("div", {
    className: cx('ramp--structured-nav', showAllSectionsButton && !playlist.isPlaylist ? ' display' : ''),
    role: "complementary",
    "aria-label": "structured navigation"
  }, showAllSectionsButton && !playlist.isPlaylist && /*#__PURE__*/React.createElement("div", {
    className: "ramp--structured-nav__sections"
  }, /*#__PURE__*/React.createElement("span", {
    className: cx('ramp--structured-nav__sections-text', hasRootRangeRef.current && 'hidden' // hide 'Sections' text when a root Range exists
    )
  }, sectionsHeading), hasCollapsibleStructRef.current && /*#__PURE__*/React.createElement(CollapseExpandButton, {
    numberOfSections: (_structureItemsRef$cu = structureItemsRef.current) === null || _structureItemsRef$cu === void 0 ? void 0 : _structureItemsRef$cu.length
  })), /*#__PURE__*/React.createElement("div", {
    className: "ramp--structured-nav__border",
    tabIndex: -1
  }, /*#__PURE__*/React.createElement("div", {
    "data-testid": "structured-nav",
    className: cx('ramp--structured-nav__content', scrollableStructure.current && 'scrollable', (playlist === null || playlist === void 0 ? void 0 : playlist.isPlaylist) && 'playlist-items', hasRootRangeRef.current && 'ramp--structured-nav__content-with_root'),
    ref: structureContainerRef,
    onScroll: handleScrollable,
    onMouseLeave: function onMouseLeave() {
      return handleMouseOver(false);
    },
    onMouseOver: function onMouseOver() {
      return handleMouseOver(true);
    },
    tabIndex: 0,
    onKeyDown: handleKeyDown
  }, ((_structureItemsRef$cu2 = structureItemsRef.current) === null || _structureItemsRef$cu2 === void 0 ? void 0 : _structureItemsRef$cu2.length) > 0 ? /*#__PURE__*/React.createElement("ul", {
    className: "ramp--structured-nav__tree",
    role: "tree",
    "data-testid": "nested-tree",
    "aria-label": "nested structure tree content",
    ref: structureContentRef
  }, structureItemsRef.current.map(function (item, index) {
    return /*#__PURE__*/React.createElement(TreeNode, _extends({}, item, {
      key: index,
      sectionCount: structureItemsRef.current.length,
      sectionRef: /*#__PURE__*/createRef(),
      structureContainerRef: structureContainerRef,
      setFocusedItem: setFocusedItem
    }));
  })) : /*#__PURE__*/React.createElement("p", {
    className: "ramp--no-structure"
  }, "There are no structures in the manifest"), /*#__PURE__*/React.createElement("div", {
    "aria-live": "assertive",
    className: "ramp--structured-nav__sr-only"
  })), /*#__PURE__*/React.createElement("span", {
    className: cx(scrollableStructure.current && 'scrollable')
  }, "Scroll to see more")));
};
StructuredNavigation.propTypes = {};

var objectWithoutPropertiesLoose = createCommonjsModule(function (module) {
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
module.exports = _objectWithoutPropertiesLoose, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var objectWithoutProperties = createCommonjsModule(function (module) {
function _objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o,
    r,
    i = objectWithoutPropertiesLoose(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
module.exports = _objectWithoutProperties, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _objectWithoutProperties = /*@__PURE__*/getDefaultExportFromCjs(objectWithoutProperties);

/**
 * Build the file download button for the displayed transcript file
 * in the transcript viewer.
 * @param {Object} props
 * @param {String} fileUrl downloadable link to the file in server
 * @param {String} fileName 
 * @param {Boolean} machineGenerated set to true for machine generated files
 * @param {String} fileExt extension of the file
 */
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

/**
 * Build seletor and downloader for transcripts in the current Canvas
 * @param {Object} props
 * @param {Function} props.selectTranscript callback func to update transcript selection
 * @param {Array} props.transcriptData list of the information for each transcirpt in the Canvas
 * @param {Object} props.transcriptInfo information of the selected transcript
 * @param {Boolean} props.noTranscript flag to indicate unsupported transcript selection
 */
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
var TranscriptSelector$1 = /*#__PURE__*/memo(TranscriptSelector);

/**
 * Build search within UI in the transcript search and handle user queries
 * @param {Object} props
 * @param {Object} props.searchResults result set from the current search
 * @param {String} props.searchQuery search query entered by the user
 * @param {Number} props.focusedMatchIndex index of the focused the search hit
 * @param {Function} props.setFocusedMatchIndex callback func to update focused match in search hits
 * @param {Function} props.setSearchQuery callback func to set search query
 */
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
function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$3(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var MACHINE_GEN_MESSAGE = 'Machine-generated transcript may contain errors.';

/**
 * Build menu for the displaying transcript search, search navigation,
 * and transcript selector
 * @param {Object} props
 * @param {Boolean} props.showSearch show/hide search UI
 * @param {Function} props.setAutoScrollEnabled callback func to change auto-scroll preference
 * @param {Boolean} props.autoScrollEnabled flag to indicate auto-scroll transcript check
 * @param {String} props.searchQuery user entered search query
 * @param {Function} props.setSearchQuery callback func to update search query
 * @param {Object} props.searchResults result set from the current search
 * @param {Number} props.focusedMatchIndex index of the focused search hit
 * @param {Function} props.setFocusedMatchIndex callback func to update focused search hit with 
 * search navigation
 */
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
TranscriptMenu.propTypes = _objectSpread$3(_objectSpread$3({
  showSearch: PropTypes.bool,
  autoScrollEnabled: PropTypes.bool.isRequired,
  setAutoScrollEnabled: PropTypes.func.isRequired
}, TranscriptSelector$1.propTypes), TranscriptMenu.propTypes);

var taggedTemplateLiteral = createCommonjsModule(function (module) {
function _taggedTemplateLiteral(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, {
    raw: {
      value: Object.freeze(t)
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

/**
 * Parse the content search response from the search service, and then use it to calculate
 * number of search hits for each transcripts, and create a list of matched transcript
 * lines for the search in the current transcript
 * @param {Object} response JSON response from content search API
 * @param {String} query search query from transcript search
 * @param {Array} trancripts content of the displayed transcript with ids
 * @param {Object} selectedTranscript url and timed/non-timed info of the selected transcript
 * @param {Array} canvasTranscripts transcripts info for the current canvas
 * @returns a list of matched transcript lines for the current search
 */
var parseContentSearchResponse = function parseContentSearchResponse(response, query, trancripts, selectedTranscript, canvasTranscripts) {
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

  // Get the timed transcript formats
  var timedTextFormats = [].concat(_toConsumableArray(TRANSCRIPT_MIME_TYPES.webvtt), _toConsumableArray(TRANSCRIPT_MIME_TYPES.srt));

  // Calculate search hit count for each transcript in the Canvas
  var _loop = function _loop() {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
      key = _Object$entries$_i[0],
      value = _Object$entries$_i[1];
    var fileFormat = canvasTranscripts.filter(function (ct) {
      return ct.url == key;
    })[0].format;
    var isTimed = timedTextFormats.includes(fileFormat);
    var searchHits = value;
    // For timed transcripts remove search response where target doesn't have media-fragments
    if (isTimed) {
      searchHits = value.filter(function (v) {
        return v.target != v.targetURI;
      });
    }
    hitCounts.push({
      transcriptURL: key,
      numberOfHits: searchHits.reduce(function (acc, a) {
        return acc + a.hitCount;
      }, 0)
    });
  };
  for (var _i = 0, _Object$entries = Object.entries(allSearchHits); _i < _Object$entries.length; _i++) {
    _loop();
  }
  var filteredSearchHits = allSearchHits[selectedTranscript.url];
  // Cleanup search hits based on the target, where target doesn't have 
  // media fragment information for timed transcript
  if (selectedTranscript.isTimed) {
    filteredSearchHits = filteredSearchHits.filter(function (s) {
      return s.target != s.targetURI;
    });
  }

  // Get all the matching transcript lines with the query in the current transcript
  var matchedTranscriptLines = getMatchedTranscriptLines(filteredSearchHits, query, trancripts);
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
      if (matchOffset !== -1 && transcriptId != -1) {
        var match = addHighlightTags(value, transcripts[transcriptId].text);
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
      var _ref;
      t.matchCount = (_ref = _toConsumableArray(mappedTextCleaned.matchAll(qRegex))) === null || _ref === void 0 ? void 0 : _ref.length;
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
    var _ref2;
    var queryRegex = new RegExp(String.raw(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["", ""])), queryFormatted), 'gi');
    if (((_ref2 = _toConsumableArray(text.matchAll(queryRegex))) === null || _ref2 === void 0 ? void 0 : _ref2.length) === 0) {
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
  var _ref3;
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
  var hitCount = (_ref3 = _toConsumableArray(text.matchAll(highlightedTerm))) === null || _ref3 === void 0 ? void 0 : _ref3.length;
  return hitCount;
};

/**
 * Apply text-highlight class for the search hits by comparing the text
 * from search response with the styled text in the transcript display
 * @param {String} searchResText search response text with <em> tags
 * @param {String} styledText styled text in transcript display
 * @returns {String}
 */
var addHighlightTags = function addHighlightTags(searchResText, styledText) {
  var emPositions = findEmPositions(searchResText);
  return applyHighlightTags(styledText, emPositions);
};

/**
 * Extract plain text content from a text with HTML tags
 * @param {String} html text with HTML tags
 * @returns {String}
 */
var stripHtml = function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '');
};

/**
 * Find all <em> tag positions and merge consecutive ones where
 * the search query it truncated into multiple strings by a
 * punctuation or white space
 * @param {String} text with <em> tags from search response
 * @returns {Array}
 */
var findEmPositions = function findEmPositions(text) {
  var emPositions = [];
  var emRegex = /<em>(.*?)<\/em>/g;
  var match;

  // Find all individual <em> positions
  var allMatches = [];
  while ((match = emRegex.exec(text)) !== null) {
    allMatches.push({
      content: match[1],
      index: match.index,
      fullMatch: match[0]
    });
  }
  if (allMatches.length === 0) return emPositions;

  // Get plain text without HTML
  var plainText = stripHtml(text);

  // Calculate positions in plain text
  var plainTextIndex = 0;
  var htmlPos = 0;
  for (var _i2 = 0, _allMatches = allMatches; _i2 < _allMatches.length; _i2++) {
    var _match = _allMatches[_i2];
    // Find position in plain text up to this <em> tag
    var prefix = stripHtml(text.substring(htmlPos, _match.index));
    var startIndex = plainTextIndex + prefix.length;
    var endIndex = startIndex + _match.content.length;
    emPositions.push({
      start: startIndex,
      end: endIndex,
      content: _match.content
    });
    plainTextIndex = endIndex;
    htmlPos = _match.index + _match.fullMatch.length;
  }
  if (emPositions.length <= 1) return emPositions;
  var merged = [];
  var i = 0;
  // Merge highlights when search query is a phrase/separated by a punctuation/white space
  while (i < emPositions.length) {
    var current = emPositions[i];
    var j = i + 1;

    // Look ahead to see if there are consecutive positions with non-text characters
    while (j < emPositions.length && emPositions[j].start <= current.end + 2) {
      var nonTextContent = plainText.substring(current.end, emPositions[j].start);
      current = {
        start: current.start,
        end: emPositions[j].end,
        content: current.content + nonTextContent + emPositions[j].content
      };
      j++;
    }
    merged.push(current);
    i = j;
  }
  return merged;
};

/**
 * Get the plain text of a node including its children to identify nested HTML 
 * within search hit
 * @param {Object} node current HTML node
 * @returns {String}
 */
var getNodePlainText = function getNodePlainText(node) {
  if (node.nodeType === Node.TEXT_NODE) return node.nodeValue;
  if (node.nodeType === Node.ELEMENT_NODE) {
    var text = '';
    for (var child = node.firstChild; child; child = child.nextSibling) {
      text += getNodePlainText(child);
    }
    return text;
  }
  return '';
};

/**
 * Apply text-highlight class to the merged search hits
 * @param {String} targetText text to apply text-highlight class
 * @param {Array} positions highlight indices in the text
 * @returns {String}
 */
var applyHighlightTags = function applyHighlightTags(targetText, positions) {
  if (positions.length === 0) return targetText;

  // Create a DOM element to parse the HTML
  var tempDiv = typeof document !== 'undefined' ? document.createElement('div') : null;
  tempDiv.innerHTML = targetText;
  function highlightInNode(node, highlights) {
    var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    if (highlights.length === 0) return offset;
    if (node.nodeType === Node.TEXT_NODE) {
      var text = node.nodeValue;
      var newNodes = [];
      var curr = 0;
      var highlight = highlights.filter(function (h) {
        return h.start < offset + text.length && h.end > offset;
      });
      if (highlight.length === 0) return offset + text.length;
      for (var i = 0; i < highlight.length; i++) {
        var h = highlight[i];
        var start = Math.max(0, h.start - offset);
        var end = Math.min(text.length, h.end - offset);
        if (curr < start) {
          newNodes.push(document.createTextNode(text.slice(curr, start)));
        }
        var span = document.createElement('span');
        span.className = 'ramp--transcript_highlight';
        span.textContent = text.slice(start, end);
        newNodes.push(span);
        curr = end;
      }
      if (curr < text.length) {
        newNodes.push(document.createTextNode(text.slice(curr)));
      }
      var _iterator = _createForOfIteratorHelper(newNodes.reverse()),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var n = _step.value;
          node.after(n);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      node.remove();
      return offset + text.length;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Check if any search hits matche the plain text of this node
      var nodeText = getNodePlainText(node);
      var _iterator2 = _createForOfIteratorHelper(highlights),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _h = _step2.value;
          if (nodeText === _h.content) {
            var _span = document.createElement('span');
            _span.className = 'ramp--transcript_highlight';
            // Add all children into the span
            while (node.firstChild) {
              _span.appendChild(node.firstChild);
            }
            node.appendChild(_span);
            return offset + nodeText.length;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      var child = node.firstChild;
      var childOffset = offset;
      while (child) {
        var next = child.nextSibling;
        childOffset = highlightInNode(child, highlights, childOffset);
        child = next;
      }
      return childOffset;
    } else {
      return offset;
    }
  }
  highlightInNode(tempDiv, positions);
  return tempDiv.innerHTML;
};

var _templateObject;
function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$2(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
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
        return [].concat(_toConsumableArray(results), [_objectSpread$2(_objectSpread$2({}, matchedItem), {}, {
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
var contentSearchFactory = function contentSearchFactory(searchService, items, selectedTranscript, canvasTranscripts) {
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
            parsed = parseContentSearchResponse(json, query, items, selectedTranscript, canvasTranscripts);
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
  return opts && opts.isSearchable ? _objectSpread$2(_objectSpread$2(_objectSpread$2({}, defaultSearchOpts), opts), {}, {
    enabled: true
  }) : _objectSpread$2(_objectSpread$2({}, defaultSearchOpts), {}, {
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
    canvasTranscripts = _ref3.canvasTranscripts,
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
  var _useState7 = useState([]),
    _useState8 = _slicedToArray(_useState7, 2),
    markedSearchHits = _useState8[0],
    setMarkedSearchHits = _useState8[1];
  var abortControllerRef = useRef(null);
  var debounceTimerRef = useRef(0);
  var _useMemo = useMemo(function () {
      var transcriptsDisplayed = transcripts || [];
      var itemsWithIds = transcriptsDisplayed.map(function (item, idx) {
        return typeof item === 'string' ? {
          text: item,
          id: idx
        } : _objectSpread$2({
          id: idx
        }, item);
      });
      var itemsIndexed = itemsWithIds.reduce(function (acc, item) {
        return _objectSpread$2(_objectSpread$2({}, acc), {}, _defineProperty({}, item.id, item));
      }, {});
      var matcher = matcherFactory(itemsWithIds);
      if (searchService != null && searchService != undefined) {
        matcher = contentSearchFactory(searchService, itemsWithIds, selectedTranscript, canvasTranscripts);
      }
      return {
        matcher: matcher,
        itemsWithIds: itemsWithIds,
        itemsIndexed: itemsIndexed
      };
    }, [transcripts, matcherFactory, selectedTranscript === null || selectedTranscript === void 0 ? void 0 : selectedTranscript.url]),
    matcher = _useMemo.matcher,
    itemsWithIds = _useMemo.itemsWithIds,
    itemsIndexed = _useMemo.itemsIndexed;
  var playerDispatch = useContext(PlayerDispatchContext);
  var manifestState = useContext(ManifestStateContext);

  // Read searchService from either Canvas/Manifest
  useEffect(function () {
    if (manifestState && canvasIndex >= 0) {
      var manifest = manifestState.manifest,
        allCanvases = manifestState.allCanvases;
      var serviceId = null;
      if (allCanvases !== null && allCanvases !== void 0 && allCanvases.length) {
        serviceId = allCanvases[canvasIndex].searchService;
      } else if (manifest) {
        serviceId = getSearchService(manifest);
      }
      setSearchService(serviceId);
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
      setSearchResults(_objectSpread$2(_objectSpread$2({}, searchResults), {}, {
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
      setSearchResults(_objectSpread$2(_objectSpread$2({}, searchResults), {}, {
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

    // Check for the marked search results in the cache
    var markedTranscript = markedSearchHits.length > 0 && markedSearchHits.filter(function (s) {
      return s.url == selectedTranscript.url;
    }).length > 0;
    // Use cached search results when switching between transcripts with same query
    if (allSearchResults != null && markedTranscript) {
      var selectedMarkedTranscript = markedSearchHits.filter(function (s) {
        return s.url == selectedTranscript.url;
      })[0];
      markMatchedItems(selectedMarkedTranscript.markedSearchHits, searchResults === null || searchResults === void 0 ? void 0 : searchResults.counts, allSearchResults);
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
    // Cache the highlighted transcript cues 
    setMarkedSearchHits({
      url: selectedTranscript.url,
      markedSearchHits: matchedTranscriptLines
    });
    var searchResults = {
      results: itemsWithIds,
      matchingIds: [],
      ids: sorter(_toConsumableArray(itemsWithIds)).map(function (item) {
        return item.id;
      }),
      counts: (hitCounts === null || hitCounts === void 0 ? void 0 : hitCounts.length) > 0 ? hitCounts : []
    };
    if (matchedTranscriptLines === undefined) {
      setSearchResults(_objectSpread$2({}, searchResults));
      return;
    }
    var matchingItemsIndexed = matchedTranscriptLines.reduce(function (acc, match) {
      return _objectSpread$2(_objectSpread$2({}, acc), {}, _defineProperty({}, match.id, match));
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
      setSearchResults(_objectSpread$2(_objectSpread$2({}, searchResults), {}, {
        results: matchingItemsIndexed,
        ids: sortedMatchIds,
        matchingIds: sortedMatchIds
      }));
    } else {
      var joinedIndexed = _objectSpread$2(_objectSpread$2({}, itemsIndexed), matchingItemsIndexed);
      var sortedItemIds = sorter(Object.values(joinedIndexed), false).map(function (item) {
        return item.id;
      });
      searchResults = _objectSpread$2(_objectSpread$2({}, searchResults), {}, {
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
    canvasTranscriptsWithCount.push(_objectSpread$2(_objectSpread$2({}, ct), {}, {
      numberOfHits: numberOfHits
    }));
  });
  return canvasTranscriptsWithCount;
};
var useFocusedMatch = function useFocusedMatch(_ref6) {
  var searchResults = _ref6.searchResults;
  var _useState9 = useState(null),
    _useState10 = _slicedToArray(_useState9, 2),
    focusedMatchIndex = _useState10[0],
    setFocusedMatchIndex = _useState10[1];
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
function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$1(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
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
var TranscriptLine = /*#__PURE__*/memo(function (_ref) {
  var item = _ref.item,
    goToItem = _ref.goToItem,
    isActive = _ref.isActive,
    isFirstItem = _ref.isFirstItem,
    focusedMatchId = _ref.focusedMatchId,
    setFocusedMatchId = _ref.setFocusedMatchId,
    autoScrollEnabled = _ref.autoScrollEnabled,
    showMetadata = _ref.showMetadata,
    showNotes = _ref.showNotes,
    transcriptContainerRef = _ref.transcriptContainerRef,
    focusedMatchIndex = _ref.focusedMatchIndex;
  var itemRef = useRef(null);
  var isFocused = item.id === focusedMatchId;
  var wasFocusedRef = useRef(isFocused);
  var wasActiveRef = useRef(isActive);
  // React ref to store previous focusedMatchIndex
  var prevFocusedIndexRef = useRef(-1);
  // React ref to store previous focusedMatchId
  var prevFocusedIdRef = useRef(-1);
  // React ref to iterate through multiple hits within a focused cue
  var activeRelativeCountRef = useRef(0);
  useEffect(function () {
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
  useEffect(function () {
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

    // Handle click on a link in the cue text in the same tab
    if (e.target.tagName == 'A') {
      // Check if the href value is a valid URL before navigation
      var urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
      var href = e.target.getAttribute('href');
      if (!(href !== null && href !== void 0 && href.match(urlRegex))) {
        e.preventDefault();
      } else {
        window.open(href, '_self');
        return;
      }
    }
    if (item.match && focusedMatchId !== item.id) {
      setFocusedMatchId(item.id);
    } else if (focusedMatchId !== null && item.tag === TRANSCRIPT_CUE_TYPES.timedCue) {
      autoScroll(itemRef.current, transcriptContainerRef, true);
    }
    goToItem(item);
  };

  /**
   * Seek the player to the start time of the focused cue, and mark it as active
   * when using Enter/Space keys to select the focused cue
   * @param {Event} e keyboard event
   * @returns 
   */
  var handleKeyDown = function handleKeyDown(e) {
    if (e.keyCode == 13 || e.keyCode == 32) {
      onClick(e);
    } else {
      return;
    }
  };
  var cueText = useMemo(function () {
    return buildSpeakerText(item, item.tag === TRANSCRIPT_CUE_TYPES.nonTimedLine);
  }, [item]);

  /** Build text portion of the transcript cue element */
  var cueTextElement = useMemo(function () {
    switch (item.tag) {
      case TRANSCRIPT_CUE_TYPES.metadata:
        return showMetadata ? /*#__PURE__*/React.createElement("span", {
          dangerouslySetInnerHTML: {
            __html: cueText
          }
        }) : null;
      case TRANSCRIPT_CUE_TYPES.note:
        return showNotes ? /*#__PURE__*/React.createElement("span", {
          dangerouslySetInnerHTML: {
            __html: cueText
          }
        }) : null;
      case TRANSCRIPT_CUE_TYPES.timedCue:
        return /*#__PURE__*/React.createElement("span", {
          className: "ramp--transcript_text",
          "data-testid": "transcript_timed_text",
          dangerouslySetInnerHTML: {
            __html: cueText
          }
        });
      case TRANSCRIPT_CUE_TYPES.nonTimedLine:
        return /*#__PURE__*/React.createElement("p", {
          className: "ramp--transcript_untimed_item",
          dangerouslySetInnerHTML: {
            __html: cueText
          }
        });
      default:
        return null;
    }
  }, [cueText, showNotes]);
  var testId = useMemo(function () {
    switch (item.tag) {
      case TRANSCRIPT_CUE_TYPES.note:
        return 'transcript_note';
      case TRANSCRIPT_CUE_TYPES.metadata:
        return 'transcript_metadata';
      case TRANSCRIPT_CUE_TYPES.timedCue:
        return 'transcript_item';
      case TRANSCRIPT_CUE_TYPES.nonTimedLine:
        return 'transcript_untimed_text';
      default:
        return null;
    }
  }, [item.tag, showNotes]);
  if (!item.tag) return null;
  return /*#__PURE__*/React.createElement("span", {
    ref: itemRef,
    className: cx('ramp--transcript_item', isActive && 'active', isFocused && 'focused', item.tag === TRANSCRIPT_CUE_TYPES.nonTimedLine && 'untimed', item.tag === TRANSCRIPT_CUE_TYPES.metadata && 'metadata-block'),
    "data-testid": testId
    /* For untimed cues,
     - set tabIndex for keyboard navigation
     - onClick handler to scroll them to top on click
     - set aria-label with full cue text */,
    tabIndex: isFirstItem && item.begin == undefined ? 0 : -1,
    onClick: item.begin == undefined ? onClick : null,
    "aria-label": item.begin == undefined && screenReaderFriendlyText(cueText)
  }, item.tag === TRANSCRIPT_CUE_TYPES.timedCue && typeof item.begin === 'number' && /*#__PURE__*/React.createElement("span", {
    className: "ramp--transcript_time",
    "data-testid": "transcript_time",
    role: "button",
    onClick: onClick,
    onKeyDown: handleKeyDown,
    tabIndex: isFirstItem ? 0 : -1,
    "aria-label": "".concat(screenReaderFriendlyTime(item.begin), ", ").concat(screenReaderFriendlyText(cueText))
  }, "[", timeToHHmmss(item.begin, true), "]"), cueTextElement);
});
var TranscriptList = /*#__PURE__*/memo(function (_ref2) {
  var seekPlayer = _ref2.seekPlayer,
    currentTime = _ref2.currentTime,
    searchResults = _ref2.searchResults,
    focusedMatchId = _ref2.focusedMatchId,
    transcriptInfo = _ref2.transcriptInfo,
    setFocusedMatchId = _ref2.setFocusedMatchId,
    autoScrollEnabled = _ref2.autoScrollEnabled,
    showMetadata = _ref2.showMetadata,
    showNotes = _ref2.showNotes,
    transcriptContainerRef = _ref2.transcriptContainerRef,
    focusedMatchIndex = _ref2.focusedMatchIndex;
  var _useState = useState(null),
    _useState2 = _slicedToArray(_useState, 2),
    manuallyActivatedItemId = _useState2[0],
    setManuallyActivatedItem = _useState2[1];
  var goToItem = useCallback(function (item) {
    if (typeof item.begin === 'number') {
      seekPlayer(item.begin);
      setManuallyActivatedItem(null);
    } else {
      setManuallyActivatedItem(item.id);
    }
  }, [seekPlayer]);
  var testId = Object.keys(TRANSCRIPT_TYPES).find(function (key) {
    return TRANSCRIPT_TYPES[key] === transcriptInfo.tType;
  });

  // Ref for container of transcript cue elements
  var transcriptListRef = useRef(null);

  /**
   * Get the first non-metadata and non-note item's id for setting up roving tabIndex for 
   * each cue in TranscriptLine component
   */
  var firstItemId = useMemo(function () {
    if (searchResults !== null && searchResults !== void 0 && searchResults.results && Object.values(searchResults.results).length > 0) {
      var firstTimedCue = Object.values(searchResults.results).find(function (result) {
        return result.tag != TRANSCRIPT_CUE_TYPES.metadata && result.tag != TRANSCRIPT_CUE_TYPES.note;
      });
      if (firstTimedCue) {
        return firstTimedCue.id;
      }
    }
    return null;
  }, [searchResults]);

  // Index of the focused cue in the transcript list
  var currentIndex = useRef(0);
  var setCurrentIndex = function setCurrentIndex(i) {
    return currentIndex.current = i;
  };

  /**
   * Handle keyboard accessibility within the transcript component using
   * roving tabindex strategy.
   * To start off all the transcript cue elements' tabIndex is set to -1,
   * except for the first cue, which is set to 0.
   * Then detect 'ArrowDown' and 'ArrowUp' key events to move focus down and
   * up respectively through the cues list.
   * @param {Event} e keyboard event
   */
  var handleKeyDown = function handleKeyDown(e) {
    // Get the timestamp for each cue for timed transcript, as these are focusable
    var cueTimes = transcriptListRef.current.querySelectorAll('.ramp--transcript_time');
    // Get the non-empty cues for untimed transcript
    var cueList = Array.from(transcriptListRef.current.children).filter(function (c) {
      var _c$textContent;
      return ((_c$textContent = c.textContent) === null || _c$textContent === void 0 ? void 0 : _c$textContent.length) > 0;
    });
    var cueLength = (cueTimes === null || cueTimes === void 0 ? void 0 : cueTimes.length) || (cueList === null || cueList === void 0 ? void 0 : cueList.length) || 0;
    if (cueLength > 0) {
      var nextIndex = currentIndex.current;
      /**
       * Default behavior is prevented (e.preventDefault()) only for the handled 
       * key combinations to allow other keyboard shortcuts to work as expected.
       */
      if (e.key === 'ArrowDown') {
        // Wraps focus back to first cue when the end of transcript is reached
        nextIndex = (currentIndex.current + 1) % cueLength;
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        nextIndex = (currentIndex.current - 1 + cueLength) % cueLength;
        e.preventDefault();
      }
      if (nextIndex !== currentIndex.current) {
        if ((cueTimes === null || cueTimes === void 0 ? void 0 : cueTimes.length) > 0) {
          // Use timestamps of timed cues for navigation
          cueTimes[currentIndex.current].tabIndex = -1;
          cueTimes[nextIndex].tabIndex = 0;
          cueTimes[nextIndex].focus();
          // Scroll the cue into view
          autoScroll(cueTimes[nextIndex], transcriptContainerRef);
        } else if ((cueList === null || cueList === void 0 ? void 0 : cueList.length) > 0) {
          // Use whole cues for navigation for untimed cues
          cueList[currentIndex.current].tabIndex = -1;
          cueList[nextIndex].tabIndex = 0;
          cueList[nextIndex].focus();
          // Scroll the cue to the top of container
          autoScroll(cueList[nextIndex], transcriptContainerRef, true);
        }
        setCurrentIndex(nextIndex);
      }
    }
  };
  if (transcriptInfo.tError) {
    return /*#__PURE__*/React.createElement("p", {
      key: "no-transcript",
      id: "no-transcript",
      "data-testid": "no-transcript",
      role: "listitem"
    }, transcriptInfo.tError);
  } else if (!searchResults.results || searchResults.results.length === 0) {
    return /*#__PURE__*/React.createElement(Spinner, null);
  } else {
    return /*#__PURE__*/React.createElement("div", {
      "data-testid": "transcript_".concat(testId),
      onKeyDown: handleKeyDown,
      ref: transcriptListRef,
      "aria-label": "Scrollable transcript cues"
    }, searchResults.ids.map(function (itemId) {
      return /*#__PURE__*/React.createElement(TranscriptLine, {
        key: itemId,
        goToItem: goToItem,
        focusedMatchId: focusedMatchId,
        isActive: manuallyActivatedItemId === itemId || typeof searchResults.results[itemId].begin === 'number' && searchResults.results[itemId].tag !== TRANSCRIPT_CUE_TYPES.note && searchResults.results[itemId].tag !== TRANSCRIPT_CUE_TYPES.metadata && searchResults.results[itemId].begin <= currentTime && currentTime <= searchResults.results[itemId].end,
        item: searchResults.results[itemId],
        isFirstItem: firstItemId === itemId,
        autoScrollEnabled: autoScrollEnabled,
        setFocusedMatchId: setFocusedMatchId,
        showMetadata: showMetadata,
        showNotes: showNotes,
        transcriptContainerRef: transcriptContainerRef,
        focusedMatchIndex: focusedMatchIndex
      });
    }));
  }
});

/**
 * Parse and display transcript content for the current Canvas.
 * @param {Object} props
 * @param {String} props.playerID
 * @param {String} props.manifestUrl
 * @param {Boolean} props.showMetadata
 * @param {Boolean} props.showNotes
 * @param {Object} props.search
 * @param {Array} props.transcripts
 */
var Transcript = function Transcript(_ref3) {
  var playerID = _ref3.playerID,
    manifestUrl = _ref3.manifestUrl,
    _ref3$showMetadata = _ref3.showMetadata,
    showMetadata = _ref3$showMetadata === void 0 ? false : _ref3$showMetadata,
    _ref3$showNotes = _ref3.showNotes,
    showNotes = _ref3$showNotes === void 0 ? false : _ref3$showNotes,
    _ref3$search = _ref3.search,
    search = _ref3$search === void 0 ? {} : _ref3$search,
    _ref3$transcripts = _ref3.transcripts,
    transcripts = _ref3$transcripts === void 0 ? [] : _ref3$transcripts;
  var _useState3 = useState(-1),
    _useState4 = _slicedToArray(_useState3, 2),
    currentTime = _useState4[0],
    _setCurrentTime = _useState4[1];
  var setCurrentTime = useMemo(function () {
    return throttle_1(_setCurrentTime, 50);
  }, []);

  // Read and parse transcript(s) as state changes
  var _useTranscripts = useTranscripts({
      manifestUrl: manifestUrl,
      playerID: playerID,
      setCurrentTime: setCurrentTime,
      showMetadata: showMetadata,
      showNotes: showNotes,
      transcripts: transcripts
    }),
    canvasIndexRef = _useTranscripts.canvasIndexRef,
    canvasTranscripts = _useTranscripts.canvasTranscripts,
    isEmpty = _useTranscripts.isEmpty,
    isLoading = _useTranscripts.isLoading,
    NO_SUPPORT_MSG = _useTranscripts.NO_SUPPORT_MSG,
    playerRef = _useTranscripts.playerRef,
    selectedTranscript = _useTranscripts.selectedTranscript,
    selectTranscript = _useTranscripts.selectTranscript,
    transcript = _useTranscripts.transcript,
    transcriptInfo = _useTranscripts.transcriptInfo;

  /* 
    Enable search only for timed text as it is only working for these transcripts
    TODO:: remove 'isSearchable' if/when search is supported for other formats
   */
  var _useSearchOpts = useSearchOpts(_objectSpread$1(_objectSpread$1({}, search), {}, {
      isSearchable: transcriptInfo.tType === TRANSCRIPT_TYPES.timedText || transcriptInfo.tType === TRANSCRIPT_TYPES.docx || transcriptInfo.tType === TRANSCRIPT_TYPES.plainText,
      showMarkers: transcriptInfo.tType === TRANSCRIPT_TYPES.timedText
    })),
    initialSearchQuery = _useSearchOpts.initialSearchQuery,
    searchOpts = _objectWithoutProperties(_useSearchOpts, _excluded);
  var _useState5 = useState(initialSearchQuery),
    _useState6 = _slicedToArray(_useState5, 2),
    searchQuery = _useState6[0],
    setSearchQuery = _useState6[1];
  var searchResults = useFilteredTranscripts(_objectSpread$1(_objectSpread$1({}, searchOpts), {}, {
    query: searchQuery,
    transcripts: transcript,
    canvasIndex: canvasIndexRef.current,
    selectedTranscript: selectedTranscript,
    canvasTranscripts: canvasTranscripts
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
  var _useState7 = useState(true),
    _useState8 = _slicedToArray(_useState7, 2),
    _autoScrollEnabled = _useState8[0],
    _setAutoScrollEnabled = _useState8[1];
  var autoScrollEnabledRef = useRef(_autoScrollEnabled);
  var setAutoScrollEnabled = function setAutoScrollEnabled(a) {
    autoScrollEnabledRef.current = a;
    _setAutoScrollEnabled(a); // force re-render
  };

  var transcriptContainerRef = useRef();
  var seekPlayer = useCallback(function (time) {
    setCurrentTime(time); // so selecting an item works in tests
    if (playerRef.current) playerRef.current.currentTime(time);
  }, []);
  if (!isLoading) {
    var _transcriptInfo$tErro;
    return /*#__PURE__*/React.createElement("div", {
      className: "ramp--transcript_nav",
      "data-testid": "transcript_nav",
      key: transcriptInfo.title,
      role: "complementary",
      "aria-label": "transcript display"
    }, !isEmpty && /*#__PURE__*/React.createElement(TranscriptMenu, {
      showSearch: searchOpts.enabled,
      selectTranscript: selectTranscript,
      transcriptData: tanscriptHitCounts,
      transcriptInfo: transcriptInfo,
      noTranscript: ((_transcriptInfo$tErro = transcriptInfo.tError) === null || _transcriptInfo$tErro === void 0 ? void 0 : _transcriptInfo$tErro.length) > 0 && transcriptInfo.tError != NO_SUPPORT_MSG,
      setAutoScrollEnabled: setAutoScrollEnabled,
      setFocusedMatchIndex: setFocusedMatchIndex,
      focusedMatchIndex: focusedMatchIndex,
      autoScrollEnabled: autoScrollEnabledRef.current,
      searchResults: searchResults,
      searchQuery: searchQuery,
      setSearchQuery: setSearchQuery
    }), /*#__PURE__*/React.createElement("div", {
      className: cx('transcript_content', transcript ? '' : 'static'),
      "data-testid": "transcript_content_".concat(transcriptInfo.tType),
      "aria-label": "Attached Transcript content",
      ref: transcriptContainerRef,
      tabIndex: -1
    }, /*#__PURE__*/React.createElement(TranscriptList, {
      currentTime: currentTime,
      seekPlayer: seekPlayer,
      searchResults: searchResults,
      focusedMatchId: focusedMatchId,
      transcriptInfo: transcriptInfo,
      setFocusedMatchId: setFocusedMatchId,
      autoScrollEnabled: autoScrollEnabledRef.current && searchQuery === null,
      showMetadata: showMetadata,
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
  showMetadata: PropTypes.bool,
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
 * Parse and display metadata, rights, and requiredStatement information
 * related to the current resource. The display of the scope of this information
 * can be customized using props as needed.
 * @param {Object} props
 * @param {Boolean} props.displayOnlyCanvasMetadata
 * @param {Boolean} props.displayAllMetadata
 * @param {Boolean} props.displayTitle
 * @param {Boolean} props.showHeading
 * @param {String} props.itemHeading
 * @param {String} props.sectionHeaading
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
  var _useState = useState(),
    _useState2 = _slicedToArray(_useState, 2),
    manifestMetadata = _useState2[0],
    setManifestMetadata = _useState2[1];
  // Metadata for all Canavases in state
  var _useState3 = useState(),
    _useState4 = _slicedToArray(_useState3, 2);
    _useState4[0];
    var _setCanvasesMetadata = _useState4[1];
  // Current Canvas metadata in state
  var _useState5 = useState(),
    _useState6 = _slicedToArray(_useState5, 2),
    canvasMetadata = _useState6[0],
    setCanvasMetadata = _useState6[1];
  // Boolean flags set according to user props to hide/show metadata
  var _useState7 = useState(),
    _useState8 = _slicedToArray(_useState7, 2),
    showManifestMetadata = _useState8[0],
    setShowManifestMetadata = _useState8[1];
  var _useState9 = useState(),
    _useState10 = _slicedToArray(_useState9, 2),
    showCanvasMetadata = _useState10[0],
    setShowCanvasMetadata = _useState10[1];
  var _useState11 = useState(),
    _useState12 = _slicedToArray(_useState11, 2),
    manifestRights = _useState12[0],
    setManifestRights = _useState12[1];
  var _useState13 = useState(),
    _useState14 = _slicedToArray(_useState13, 2),
    canvasRights = _useState14[0],
    setCanvasRights = _useState14[1];
  var _useState15 = useState(false),
    _useState16 = _slicedToArray(_useState15, 2),
    hasMetadata = _useState16[0],
    setHasMetadata = _useState16[1];
  var canvasesMetadataRef = useRef();
  var setCanvasesMetadata = function setCanvasesMetadata(m) {
    _setCanvasesMetadata(m);
    canvasesMetadataRef.current = m;
  };
  /**
   * On the initialization of the component read metadata from the Manifest
   * and/or Canvases based on the input props and set the initial set(s) of
   * metadata in the component's state
   */
  useEffect(function () {
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
        var _manifestMeta;
        var manifestMeta = parsedMetadata.manifestMetadata;
        if (!displayTitle) {
          manifestMeta = manifestMeta.filter(function (md) {
            return md.label.toLowerCase() != 'title';
          });
        }
        setManifestMetadata(manifestMeta);
        setHasMetadata(((_manifestMeta = manifestMeta) === null || _manifestMeta === void 0 ? void 0 : _manifestMeta.length) > 0);
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
  useEffect(function () {
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
      var _metadata;
      var metadata = canvasData.metadata,
        rights = canvasData.rights;
      if (!displayTitle && metadata != undefined) {
        metadata = metadata.filter(function (md) {
          return md.label.toLowerCase() != 'title';
        });
      }
      setCanvasMetadata(metadata);
      setHasMetadata(((_metadata = metadata) === null || _metadata === void 0 ? void 0 : _metadata.length) > 0);
      if (rights != undefined && (rights === null || rights === void 0 ? void 0 : rights.length) > 0) {
        setCanvasRights(rights);
      }
    }
  };
  var buildMetadata = function buildMetadata(metadata) {
    var metadataPairs = [];
    if ((metadata === null || metadata === void 0 ? void 0 : metadata.length) > 0) {
      metadata.map(function (md, index) {
        metadataPairs.push( /*#__PURE__*/React.createElement(Fragment, {
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
  var manifestMetadataBlock = useMemo(function () {
    if (showManifestMetadata && (manifestMetadata === null || manifestMetadata === void 0 ? void 0 : manifestMetadata.length) > 0) {
      return /*#__PURE__*/React.createElement(React.Fragment, null, displayAllMetadata && /*#__PURE__*/React.createElement("span", null, itemHeading), buildMetadata(manifestMetadata), (manifestRights === null || manifestRights === void 0 ? void 0 : manifestRights.length) > 0 && /*#__PURE__*/React.createElement("span", {
        className: "ramp--metadata-rights-heading",
        "data-testid": "manifest-rights"
      }, "Rights"), buildMetadata(manifestRights));
    }
  }, [manifestMetadata]);
  var canvasMetadataBlock = useMemo(function () {
    if (showCanvasMetadata && (canvasMetadata === null || canvasMetadata === void 0 ? void 0 : canvasMetadata.length) > 0) {
      return /*#__PURE__*/React.createElement(React.Fragment, null, displayAllMetadata && /*#__PURE__*/React.createElement("span", null, sectionHeaading), buildMetadata(canvasMetadata), (canvasRights === null || canvasRights === void 0 ? void 0 : canvasRights.length) > 0 && /*#__PURE__*/React.createElement("span", {
        className: "ramp--metadata-rights-heading",
        "data-testid": "canvas-rights"
      }, "Rights"), buildMetadata(canvasRights));
    }
  }, [canvasMetadata]);
  return /*#__PURE__*/React.createElement("div", {
    "data-testid": "metadata-display",
    className: "ramp--metadata-display",
    role: "complementary",
    "aria-label": "metadata display"
  }, showHeading && /*#__PURE__*/React.createElement("div", {
    className: "ramp--metadata-display-title",
    "data-testid": "metadata-display-title"
  }, /*#__PURE__*/React.createElement("h4", null, "Details")), hasMetadata ? /*#__PURE__*/React.createElement("div", {
    className: "ramp--metadata-display-content"
  }, manifestMetadataBlock, canvasMetadataBlock) : /*#__PURE__*/React.createElement("div", {
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

/**
 * Display supplemental files as downloadable links, referenced in both 
 * manifest and at each canvas as rendering files.
 * @param {Object} props
 * @param {String} props.itemHeading
 * @param {String} props.sectionHeaading
 * @param {Boolean} props.showHeading
 */
var SupplementalFiles = function SupplementalFiles(_ref) {
  var _ref$itemHeading = _ref.itemHeading,
    itemHeading = _ref$itemHeading === void 0 ? 'Item files' : _ref$itemHeading,
    _ref$sectionHeading = _ref.sectionHeading,
    sectionHeading = _ref$sectionHeading === void 0 ? 'Section files' : _ref$sectionHeading,
    _ref$showHeading = _ref.showHeading,
    showHeading = _ref$showHeading === void 0 ? true : _ref$showHeading;
  var _useManifestState = useManifestState(),
    renderings = _useManifestState.renderings;
  var _useState = useState(),
    _useState2 = _slicedToArray(_useState, 2),
    manifestSupplementalFiles = _useState2[0],
    setManifestSupplementalFiles = _useState2[1];
  var _useState3 = useState(),
    _useState4 = _slicedToArray(_useState3, 2),
    canvasSupplementalFiles = _useState4[0],
    setCanvasSupplementalFiles = _useState4[1];
  var _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    hasSectionFiles = _useState6[0],
    setHasSectionFiles = _useState6[1];
  var _useState7 = useState(false),
    _useState8 = _slicedToArray(_useState7, 2),
    hasFiles = _useState8[0],
    setHasFiles = _useState8[1];
  var _useErrorBoundary = useErrorBoundary(),
    showBoundary = _useErrorBoundary.showBoundary;
  useEffect(function () {
    try {
      var _renderings$manifest;
      setManifestSupplementalFiles(renderings === null || renderings === void 0 ? void 0 : renderings.manifest);
      var canvasFiles = renderings === null || renderings === void 0 ? void 0 : renderings.canvas;
      var canvasFilesSize = 0;
      if (canvasFiles) {
        setCanvasSupplementalFiles(canvasFiles);

        // Calculate number of total files for all the canvases
        canvasFilesSize = canvasFiles.reduce(function (acc, f) {
          return acc + f.files.length;
        }, 0);
        setHasSectionFiles(canvasFilesSize > 0 ? true : false);
      }
      if (canvasFilesSize > 0 || (renderings === null || renderings === void 0 ? void 0 : (_renderings$manifest = renderings.manifest) === null || _renderings$manifest === void 0 ? void 0 : _renderings$manifest.length) > 0) {
        setHasFiles(true);
      } else {
        setHasFiles(false);
      }
    } catch (error) {
      showBoundary(error);
    }
  }, [renderings]);
  var filesDisplay = useMemo(function () {
    return /*#__PURE__*/React.createElement(React.Fragment, null, hasFiles && /*#__PURE__*/React.createElement("div", {
      className: "ramp--supplemental-files-display-content",
      "data-testid": "supplemental-files-display-content"
    }, Array.isArray(manifestSupplementalFiles) && manifestSupplementalFiles.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h4", null, itemHeading), /*#__PURE__*/React.createElement("dl", {
      key: "item-files"
    }, manifestSupplementalFiles.map(function (file, index) {
      return /*#__PURE__*/React.createElement(Fragment, {
        key: index
      }, /*#__PURE__*/React.createElement("dd", {
        key: "item-file-".concat(index)
      }, /*#__PURE__*/React.createElement("a", {
        href: file.id,
        key: index
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
          key: index
        }, file.label));
      }));
    }))), !hasFiles && /*#__PURE__*/React.createElement("div", {
      "data-testid": "supplemental-files-empty",
      className: "ramp--supplemental-files-empty"
    }, /*#__PURE__*/React.createElement("p", null, "No Supplemental file(s) in Manifest")));
  }, [hasFiles, hasSectionFiles]);
  return /*#__PURE__*/React.createElement("div", {
    "data-testid": "supplemental-files",
    className: "ramp--supplemental-files",
    role: "complementary",
    "aria-label": "supplemental files"
  }, showHeading && /*#__PURE__*/React.createElement("div", {
    className: "ramp--supplemental-files-heading",
    "data-testid": "supplemental-files-heading"
  }, /*#__PURE__*/React.createElement("h4", null, "Files")), filesDisplay);
};

/**
 * A toggle button to enable/disable auto-play across multiple
 * canvases
 * @param {Object} props
 * @param {String} props.label
 * @param {Boolean} props.showLabel
 */
var AutoAdvanceToggle = function AutoAdvanceToggle(_ref) {
  var _ref$label = _ref.label,
    label = _ref$label === void 0 ? 'Autoplay' : _ref$label,
    _ref$showLabel = _ref.showLabel,
    showLabel = _ref$showLabel === void 0 ? true : _ref$showLabel;
  var _useManifestState = useManifestState(),
    autoAdvance = _useManifestState.autoAdvance;
  var manifestDispatch = useManifestDispatch();
  var handleChange = function handleChange(e) {
    e.target.setAttribute('aria-checked', String(!autoAdvance));
    manifestDispatch({
      autoAdvance: !autoAdvance,
      type: 'setAutoAdvance'
    });
  };

  /**
   * On Space/Enter keypresses enable toggle button
   * @param {Event} e keydown event
   */
  var handleKeyDown = function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleChange(e);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    role: "switch",
    onClick: handleChange,
    onKeyDown: handleKeyDown,
    "aria-checked": String(autoAdvance),
    tabIndex: 0,
    "data-testid": "auto-advance",
    className: "ramp--auto-advance"
  }, showLabel && /*#__PURE__*/React.createElement("span", {
    className: "ramp--auto-advance-label",
    "data-testid": "auto-advance-label"
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "slider"
  }, /*#__PURE__*/React.createElement("span", {
    "data-testid": "auto-advance-toggle"
  })));
};
AutoAdvanceToggle.propTypes = {
  label: PropTypes.string,
  showLabel: PropTypes.bool
};

/**
 * Build and handle creation of new markers for playlists. This component is rendered
 * on page when the user has permissions to create new markers in a given playlist Manifest.
 * @param {Object} props
 * @param {String} props.newMarkerEndpoint annotationService to POST create markers request
 * @param {Number} props.canvasId URI of the current Canvas
 * @param {Function} props.handleCreate callback function to update global state
 * @param {String} props.csrfToken token to authenticate POST request
 */
var CreateMarker = function CreateMarker(_ref) {
  var newMarkerEndpoint = _ref.newMarkerEndpoint,
    canvasId = _ref.canvasId,
    handleCreate = _ref.handleCreate,
    csrfToken = _ref.csrfToken;
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isOpen = _useState2[0],
    setIsOpen = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    isValid = _useState4[0],
    setIsValid = _useState4[1];
  var _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    saveError = _useState6[0],
    setSaveError = _useState6[1];
  var _useState7 = useState(''),
    _useState8 = _slicedToArray(_useState7, 2),
    errorMessage = _useState8[0],
    setErrorMessage = _useState8[1];
  var _useState9 = useState(),
    _useState10 = _slicedToArray(_useState9, 2),
    markerTime = _useState10[0],
    setMarkerTime = _useState10[1];
  var controller;
  var _useMediaPlayer = useMediaPlayer(),
    getCurrentTime = _useMediaPlayer.getCurrentTime;
  useEffect(function () {
    // Close new marker form on Canvas change
    setIsOpen(false);

    // Remove all fetch requests on unmount
    return function () {
      var _controller;
      (_controller = controller) === null || _controller === void 0 ? void 0 : _controller.abort();
    };
  }, [canvasId]);
  var handleAddMarker = function handleAddMarker() {
    var currentTime = timeToHHmmss(getCurrentTime(), true, true);
    validateTime(currentTime);
    setIsOpen(true);
  };
  var handleCreateSubmit = useCallback(function (e) {
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
    controller = new AbortController();
    fetch(newMarkerEndpoint, requestOptions, {
      signal: controller.signal
    }).then(function (response) {
      if (response.status != 201) {
        throw new Error();
      } else {
        return response.json();
      }
    }).then(function (json) {
      var newMarker = parseMarkerAnnotation(json);
      if (newMarker) {
        handleCreate(newMarker);
      }
      setIsOpen(false);
    })["catch"](function (e) {
      console.error('CreateMarker -> handleCreateMarker() -> failed to create annotation; ', e);
      setSaveError(true);
      setErrorMessage('Marker creation failed.');
    });
  }, [canvasId]);
  var handleCreateCancel = useCallback(function () {
    setIsOpen(false);
    setIsValid(false);
    setErrorMessage('');
    setSaveError(false);
  });
  var validateTime = function validateTime(e) {
    var _e$target$value, _e$target;
    var value = (_e$target$value = e === null || e === void 0 ? void 0 : (_e$target = e.target) === null || _e$target === void 0 ? void 0 : _e$target.value) !== null && _e$target$value !== void 0 ? _e$target$value : e;
    setMarkerTime(value);
    var isValid = validateTimeInput(value);
    setIsValid(isValid);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "ramp-markers-display__new-marker",
    "data-testid": "create-new-marker"
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
    className: cx('ramp--markers-display__create-marker', isValid ? 'time-valid' : 'time-invalid'),
    name: "time",
    value: markerTime,
    onChange: validateTime
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
  csrfToken: PropTypes.string
};

/**
 * Build a table row for each 'highlighting; annotation in the current Canvas in the Manifest.
 * These are timepoint annotations. When user has permissions to edit annotations, an actions
 * column is populated for each annotation with edit and delete actions.
 * @param {Object} props
 * @param {Object} props.marker each marker parsed from annotations
 * @param {Function} props.handleSubmit callback func to update state on marker edit action
 * @param {Function} props.handleDelete callback func to update state on marker delete action
 * @param {Function} props.toggleIsEditing callback function to update global state
 * @param {String} props.csrfToken token to authenticate POST request
 */
var MarkerRow = function MarkerRow(_ref) {
  var marker = _ref.marker,
    handleSubmit = _ref.handleSubmit,
    handleDelete = _ref.handleDelete,
    toggleIsEditing = _ref.toggleIsEditing,
    csrfToken = _ref.csrfToken;
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    editing = _useState2[0],
    setEditing = _useState2[1];
  var _useState3 = useState(true),
    _useState4 = _slicedToArray(_useState3, 2),
    isValid = _useState4[0],
    setIsValid = _useState4[1];
  var _useState5 = useState(),
    _useState6 = _slicedToArray(_useState5, 2),
    tempMarker = _useState6[0],
    setTempMarker = _useState6[1];
  var _useState7 = useState(false),
    _useState8 = _slicedToArray(_useState7, 2),
    deleting = _useState8[0],
    setDeleting = _useState8[1];
  var _useState9 = useState(false),
    _useState10 = _slicedToArray(_useState9, 2),
    saveError = _useState10[0],
    setSaveError = _useState10[1];
  var _useState11 = useState(''),
    _useState12 = _slicedToArray(_useState11, 2),
    errorMessage = _useState12[0],
    setErrorMessage = _useState12[1];
  var controller;
  var _useMarkers = useMarkers(),
    hasAnnotationService = _useMarkers.hasAnnotationService,
    isDisabled = _useMarkers.isDisabled;
  var _useMediaPlayer = useMediaPlayer(),
    player = _useMediaPlayer.player;

  // Remove all fetch requests on unmount
  useEffect(function () {
    return function () {
      var _controller;
      (_controller = controller) === null || _controller === void 0 ? void 0 : _controller.abort();
    };
  }, []);
  useEffect(function () {
    setMarkerLabel(marker.value);
    setMarkerTime(marker.timeStr);
  }, [marker]);
  var markerLabelRef = useRef(marker.value);
  var setMarkerLabel = function setMarkerLabel(label) {
    markerLabelRef.current = label;
  };
  var markerOffsetRef = useRef(timeToS(marker.timeStr));
  var markerTimeRef = useRef(marker.timeStr);
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
    controller = new AbortController();
    fetch(marker.id, requestOptions, {
      signal: controller.signal
    }).then(function (response) {
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
    controller = new AbortController();
    fetch(marker.id, requestOptions, {
      signal: controller.signal
    }).then(function (response) {
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
  var handleMarkerClick = useCallback(function (e) {
    e.preventDefault();
    var currentTime = parseFloat(e.target.dataset['offset']);
    if (player) {
      var _player$targets$ = player.targets[0],
        start = _player$targets$.start,
        end = _player$targets$.end;
      switch (true) {
        case currentTime >= start && currentTime <= end:
          player.currentTime(currentTime);
          break;
        case currentTime < start:
          player.currentTime(start);
          break;
        case currentTime > end:
          player.currentTime(end);
          break;
      }
    }
  }, [player]);
  if (editing) {
    return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
      id: "marker-edit-label",
      "data-testid": "edit-label",
      defaultValue: markerLabelRef.current,
      type: "text",
      className: "ramp--markers-display__edit-marker",
      onChange: function onChange(e) {
        return setMarkerLabel(e.target.value);
      },
      name: "label"
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
      className: cx('ramp--markers-display__edit-marker', isValid ? 'time-valid' : 'time-invalid'),
      id: "marker-edit-time",
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
      disabled: isDisabled
    }, /*#__PURE__*/React.createElement(EditIcon, null), " Edit"), /*#__PURE__*/React.createElement("button", {
      className: "ramp--markers-display__edit-button-danger",
      "data-testid": "delete-button",
      disabled: isDisabled,
      onClick: toggleDelete
    }, /*#__PURE__*/React.createElement(DeleteIcon, null), " Delete"))));
  }
};
MarkerRow.propTypes = {
  marker: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  toggleIsEditing: PropTypes.func.isRequired,
  csrfToken: PropTypes.string
};

var AnnotationSetSelect = function AnnotationSetSelect(_ref) {
  var _ref$canvasAnnotation = _ref.canvasAnnotationSets,
    canvasAnnotationSets = _ref$canvasAnnotation === void 0 ? [] : _ref$canvasAnnotation,
    _ref$duration = _ref.duration,
    duration = _ref$duration === void 0 ? 0 : _ref$duration,
    setDisplayedAnnotationSets = _ref.setDisplayedAnnotationSets,
    setAutoScrollEnabled = _ref.setAutoScrollEnabled,
    autoScrollEnabled = _ref.autoScrollEnabled;
  var _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    selectedAnnotationSets = _useState2[0],
    setSelectedAnnotationSets = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    selectedAll = _useState4[0],
    setSelectedAll = _useState4[1];
  var _useState5 = useState([]),
    _useState6 = _slicedToArray(_useState5, 2),
    timedAnnotationSets = _useState6[0],
    setTimedAnnotationSets = _useState6[1];
  var multiSelectRef = useRef(null);
  var selectButtonRef = useRef(null);
  var dropDownRef = useRef(null);

  // Need to keep this as a state variable for re-rendering UI
  var _useState7 = useState(false),
    _useState8 = _slicedToArray(_useState7, 2),
    isOpen = _useState8[0],
    _setIsOpen = _useState8[1];
  // Use a ref to keep track of the dropdown state in the event listener
  var isOpenRef = useRef(false);
  var setIsOpen = function setIsOpen(value) {
    isOpenRef.current = value;
    _setIsOpen(value);
  };
  var toggleDropdown = function toggleDropdown() {
    return setIsOpen(!isOpenRef.current);
  };

  // Index of the focused option in the list
  var currentIndex = useRef(0);
  var setCurrentIndex = function setCurrentIndex(i) {
    return currentIndex.current = i;
  };
  useEffect(function () {
    // Reset state when Canvas changes
    setSelectedAnnotationSets([]);
    setDisplayedAnnotationSets([]);
    setSelectedAll(false);
    setIsOpen(false);
    if ((canvasAnnotationSets === null || canvasAnnotationSets === void 0 ? void 0 : canvasAnnotationSets.length) > 0) {
      // Sort annotation sets alphabetically
      var annotationSets = canvasAnnotationSets.sort(function (a, b) {
        return a.label.localeCompare(b.label);
      });
      setTimedAnnotationSets(annotationSets);
      // Select the first annotation set on page load
      findOrFetchandParseLinkedAnnotations(annotationSets[0]);
    } else {
      setTimedAnnotationSets([]);
    }

    // Add event listener to close the dropdown when clicking outside of it
    document.addEventListener('click', handleClickOutside);

    // Remove event listener on unmount
    return function () {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [canvasAnnotationSets]);
  var isSelected = useCallback(function (set) {
    return selectedAnnotationSets.includes(set.label);
  }, [selectedAnnotationSets]);

  /**
   * Fetch linked annotations and parse its content only on first time selection
   * of the annotation set
   * @param {Object} annotationSet checked/unchecked set
   */
  var findOrFetchandParseLinkedAnnotations = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(annotationSet) {
      var items, parsedAnnotationPage, annotations;
      return regenerator.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            items = annotationSet.items;
            if (isSelected(annotationSet)) {
              _context.next = 15;
              break;
            }
            if (!(annotationSet.url && !annotationSet.items)) {
              _context.next = 14;
              break;
            }
            if (annotationSet !== null && annotationSet !== void 0 && annotationSet.linkedResource) {
              _context.next = 10;
              break;
            }
            _context.next = 6;
            return parseExternalAnnotationPage(annotationSet.url, duration);
          case 6:
            parsedAnnotationPage = _context.sent;
            items = (parsedAnnotationPage === null || parsedAnnotationPage === void 0 ? void 0 : parsedAnnotationPage.length) > 0 ? parsedAnnotationPage[0].items : [];
            _context.next = 14;
            break;
          case 10:
            _context.next = 12;
            return parseExternalAnnotationResource(annotationSet);
          case 12:
            annotations = _context.sent;
            items = annotations;
          case 14:
            // Mark annotation set as selected
            makeSelection(annotationSet, items);
          case 15:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function findOrFetchandParseLinkedAnnotations(_x) {
      return _ref2.apply(this, arguments);
    };
  }();

  /**
  * Remove unchecked annotation and its label from state. This function updates
  * as a wrapper for updating both state variables in one place to avoid inconsistencies
  * @param {Object} annotationSet selected annotation set
  */
  var clearSelection = function clearSelection(annotationSet) {
    setSelectedAnnotationSets(function (prev) {
      return prev.filter(function (item) {
        return item !== annotationSet.label;
      });
    });
    setDisplayedAnnotationSets(function (prev) {
      return prev.filter(function (a) {
        return a.label != annotationSet.label;
      });
    });
  };

  /**
   * Add checked annotation and its label to state. This function updates
   * as a wrapper for updating both state variables in one place to avoid inconsistencies
   * @param {Object} annotationSet selected annotation set
   * @param {Array} items list of timed annotations
   */
  var makeSelection = function makeSelection(annotationSet, items) {
    if (items != undefined) {
      annotationSet.items = items;
      setSelectedAnnotationSets(function (prev) {
        return [].concat(_toConsumableArray(prev), [annotationSet.label]);
      });
      setDisplayedAnnotationSets(function (prev) {
        return [].concat(_toConsumableArray(prev), [annotationSet]);
      });
    }
  };

  /**
   * Event handler for the checkbox for 'Show all Annotation sets' option
   * Check/uncheck all Annotation sets as slected/not-selected
   */
  var handleSelectAll = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(e) {
      var selectAllUpdated;
      return regenerator.wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            selectAllUpdated = !selectedAll;
            setSelectedAll(selectAllUpdated);
            if (!selectAllUpdated) {
              _context2.next = 7;
              break;
            }
            _context2.next = 5;
            return Promise.all(timedAnnotationSets.map(function (annotationSet) {
              findOrFetchandParseLinkedAnnotations(annotationSet);
            }));
          case 5:
            _context2.next = 9;
            break;
          case 7:
            // Clear all selections
            setSelectedAnnotationSets([]);
            setDisplayedAnnotationSets([]);
          case 9:
            // Stop propogation of the event to stop bubbling this event upto playerHotKeys
            e.stopPropagation();

            // Close the dropdown
            toggleDropdown();
          case 11:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function handleSelectAll(_x2) {
      return _ref3.apply(this, arguments);
    };
  }();

  /**
   * Event handler for the check-box for each annotation set in the dropdown
   * @param {Object} annotationSet checked/unchecked set
   */
  var handleSelect = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(annotationSet) {
      return regenerator.wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            findOrFetchandParseLinkedAnnotations(annotationSet);

            // Uncheck and clear annotation set in state
            if (isSelected(annotationSet)) clearSelection(annotationSet);
          case 2:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return function handleSelect(_x3) {
      return _ref4.apply(this, arguments);
    };
  }();

  // Close the dropdown when clicked outside of it
  var handleClickOutside = function handleClickOutside(e) {
    var _multiSelectRef$curre;
    if (!(multiSelectRef !== null && multiSelectRef !== void 0 && (_multiSelectRef$curre = multiSelectRef.current) !== null && _multiSelectRef$curre !== void 0 && _multiSelectRef$curre.contains(e.target)) && isOpenRef.current) {
      setIsOpen(false);
    }
  };

  /**
   * Open/close the dropdown and move focus to the first option in the drowdown
   * menu as needed based on the keys pressed when dropdown is in focus
   * @param {Event} e keydown event from dropdown button
   */
  var handleDropdownKeyPress = function handleDropdownKeyPress(e) {
    var handleHomeEndKeys = function handleHomeEndKeys() {
      // If dropdown is open and pressed key is either Home or PageUp/End or PageDown
      if (isOpenRef.current && dropDownRef.current) {
        // Get all options in the dropdown
        var allOptions = dropDownRef.current.children;
        // Move focus to the first option in the list
        if ((e.key === 'Home' || e.key === 'PageUp') && (allOptions === null || allOptions === void 0 ? void 0 : allOptions.length) > 0) {
          allOptions[0].focus();
          setCurrentIndex(0);
        }
        // Move focus to the last option in the list
        if ((e.key === 'End' || e.key === 'PageDown') && (allOptions === null || allOptions === void 0 ? void 0 : allOptions.length) > 0) {
          allOptions[allOptions.length - 1].focus();
          setCurrentIndex(allOptions.length - 1);
        }
      }
    };
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        toggleDropdown();
        break;
      case 'ArrowDown':
      case 'ArrowUp':
        if (!isOpenRef.current) setIsOpen(true);
        // Move focus to the first option in the list
        var firstOption = document.querySelector(".annotations-dropdown-item");
        if (firstOption) {
          e.preventDefault();
          firstOption.focus();
          setCurrentIndex(0);
        }
        break;
      case 'Home':
      case 'PageUp':
      case 'End':
      case 'PageDown':
        handleHomeEndKeys();
        break;
      case 'Escape':
        e.preventDefault();
        if (isOpenRef.current) toggleDropdown();
        break;
      default:
        // Do nothing if a combination key is pressed
        if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey || e.key.length > 1) {
          return;
        }
        if (!isOpenRef.current) setIsOpen(true);
        handlePrintableChars(e);
        break;
    }
  };

  /**
   * Handle keyboard events for each annotation set option.
   * @param {Event} e keyboard event
   */
  var handleAnnotationSetKeyPress = function handleAnnotationSetKeyPress(e) {
    var allOptions = dropDownRef.current.children;
    var nextIndex = currentIndex.current;
    switch (e.key) {
      case 'Enter':
      case ' ':
        // On Enter/Space select the focused annotation set
        e.preventDefault();
        var option = timedAnnotationSets.filter(function (a) {
          return e.target.id == a.label;
        })[0];
        if (option != undefined) {
          handleSelect(option);
        } else {
          handleSelectAll(e);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        // Move to next option on ArrowDown keypress and wraps to first option when end is reached
        nextIndex = (currentIndex.current + 1) % allOptions.length;
        break;
      case 'ArrowUp':
        e.preventDefault();
        // Move to previous option on ArrowUp keypress and wraps to last option when top is reached
        nextIndex = (currentIndex.current - 1 + allOptions.length) % allOptions.length;
        break;
      case 'Home':
      case 'PageUp':
        e.preventDefault();
        // Move to the first option the in the list
        nextIndex = 0;
        break;
      case 'End':
      case 'PageDown':
        e.preventDefault();
        // Move to the last option in the list
        nextIndex = allOptions.length - 1;
        break;
      case 'Escape':
        e.preventDefault();
        // Close the dropdown and move focus to dropdown button
        toggleDropdown();
        selectButtonRef.current.focus();
        break;
      case 'Tab':
        // Close dropdown and move focus out to the next element in the DOM
        toggleDropdown();
        break;
      default:
        handlePrintableChars(e);
        break;
    }

    // Focus option at nextIndex and scroll it into view
    if (nextIndex !== currentIndex.current) {
      allOptions[nextIndex].focus();
      allOptions[nextIndex].scrollIntoView();
      setCurrentIndex(nextIndex);
    }
  };

  /**
   * When a printable character is pressed match it against the first character
   * of each option in the list and focus the first option with a match
   * @param {Event} e keydown event
   */
  var handlePrintableChars = function handlePrintableChars(e) {
    var keyChar = e.key;
    var isPrintableChar = keyChar.length === 1 && keyChar.match(/\S/);
    setTimeout(function () {
      if (isPrintableChar && dropDownRef.current) {
        var allOptions = dropDownRef.current.children;
        // Ignore first option for select all when there are multiple options
        var ignoreSelectAll = allOptions.length > 1 ? true : false;
        for (var i in allOptions) {
          var _allOptions$i$textCon;
          if (ignoreSelectAll && i == 0) {
            continue;
          }
          if (((_allOptions$i$textCon = allOptions[i].textContent) === null || _allOptions$i$textCon === void 0 ? void 0 : _allOptions$i$textCon.trim()[0].toLowerCase()) === keyChar) {
            allOptions[i].focus();
            setCurrentIndex(i);
            break;
          }
        }
      }
    }, 0);
  };

  /**
   * Handle keydown event for the checkbox for turning auto-scroll on/off
   * @param {Event} e keydown event
   */
  var handleAutoScrollKeyPress = function handleAutoScrollKeyPress(e) {
    if (e.key == ' ' || e.key == 'Enter') {
      e.preventDefault();
      setAutoScrollEnabled(function (prev) {
        return !prev;
      });
    }
  };
  if ((timedAnnotationSets === null || timedAnnotationSets === void 0 ? void 0 : timedAnnotationSets.length) > 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "ramp--annotations__select"
    }, /*#__PURE__*/React.createElement("label", null, "Annotation sets: "), /*#__PURE__*/React.createElement("div", {
      className: "ramp--annotations__multi-select",
      "data-testid": "annotation-multi-select",
      ref: multiSelectRef
    }, /*#__PURE__*/React.createElement("span", {
      className: "ramp--annotations__multi-select-header",
      onClick: toggleDropdown,
      onKeyDown: handleDropdownKeyPress,
      "aria-haspopup": true,
      "aria-expanded": isOpen,
      "aria-controls": "annotations-dropdown-menu",
      id: "dropdown-button",
      role: "button",
      tabIndex: 0,
      ref: selectButtonRef
    }, selectedAnnotationSets.length > 0 ? "".concat(selectedAnnotationSets.length, " of ").concat(timedAnnotationSets.length, " sets selected") : 'Select Annotation set(s)', /*#__PURE__*/React.createElement("span", {
      className: "annotations-dropdown-arrow ".concat(isOpen ? 'open' : '')
    }, "\u25BC")), isOpen && /*#__PURE__*/React.createElement("ul", {
      className: "annotations-dropdown-menu",
      role: "listbox",
      "aria-labelledby": "dropdown-button",
      "aria-multiselectable": true,
      tabIndex: -1,
      ref: dropDownRef
    },
    // Only show select all option when there's more than one annotation set
    (timedAnnotationSets === null || timedAnnotationSets === void 0 ? void 0 : timedAnnotationSets.length) > 1 && /*#__PURE__*/React.createElement("li", {
      key: "select-all",
      className: "annotations-dropdown-item",
      role: "option",
      tabIndex: 0,
      "aria-selected": selectedAll,
      onKeyDown: handleAnnotationSetKeyPress,
      id: "select-all-annotation-sets"
    }, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      "aria-checked": selectedAll,
      checked: selectedAll,
      onChange: handleSelectAll,
      tabIndex: 0,
      role: "checkbox"
    }), "Show all Annotation sets")), timedAnnotationSets.map(function (annotationSet, index) {
      return /*#__PURE__*/React.createElement("li", {
        key: "annotaion-set-".concat(index),
        className: "annotations-dropdown-item",
        role: "option",
        tabIndex: 0,
        "aria-selected": isSelected(annotationSet),
        onKeyDown: handleAnnotationSetKeyPress,
        id: annotationSet.label
      }, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("input", {
        type: "checkbox",
        "aria-checked": isSelected(annotationSet),
        checked: isSelected(annotationSet),
        onChange: function onChange() {
          return handleSelect(annotationSet);
        },
        tabIndex: 0,
        role: "checkbox"
      }), annotationSet.label));
    })), /*#__PURE__*/React.createElement("div", {
      className: "ramp--annotations__scroll",
      "data-testid": "annotations-scroll"
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      id: "scroll-check",
      name: "scrollcheck",
      "aria-checked": autoScrollEnabled,
      title: "Auto-scroll with media",
      checked: autoScrollEnabled,
      onChange: function onChange() {
        setAutoScrollEnabled(!autoScrollEnabled);
      },
      onKeyDown: handleAutoScrollKeyPress
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "scroll-check",
      title: "Auto-scroll with media"
    }, "Auto-scroll with media"))));
  } else {
    return null;
  }
};
AnnotationSetSelect.propTypes = {
  canvasAnnotationSets: PropTypes.array.isRequired,
  duration: PropTypes.number.isRequired,
  setDisplayedAnnotationSets: PropTypes.func.isRequired,
  setAutoScrollEnabled: PropTypes.func.isRequired,
  autoScrollEnabled: PropTypes.bool.isRequired
};

var AnnotationRow = function AnnotationRow(_ref) {
  var annotation = _ref.annotation,
    autoScrollEnabled = _ref.autoScrollEnabled,
    containerRef = _ref.containerRef,
    displayedAnnotations = _ref.displayedAnnotations,
    displayMotivations = _ref.displayMotivations,
    index = _ref.index,
    showMoreSettings = _ref.showMoreSettings;
  var canvasId = annotation.canvasId,
    motivation = annotation.motivation,
    time = annotation.time,
    value = annotation.value;
  var enableShowMore = showMoreSettings.enableShowMore,
    MAX_LINES = showMoreSettings.textLineLimit;
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isActive = _useState2[0],
    setIsActive = _useState2[1];
  var _useMediaPlayer = useMediaPlayer(),
    player = _useMediaPlayer.player,
    currentTime = _useMediaPlayer.currentTime;
  var _useAnnotationRow = useAnnotationRow({
      canvasId: canvasId,
      annotationId: annotation.id,
      startTime: time === null || time === void 0 ? void 0 : time.start,
      endTime: time === null || time === void 0 ? void 0 : time.end,
      currentTime: currentTime,
      displayedAnnotations: displayedAnnotations
    }),
    checkCanvas = _useAnnotationRow.checkCanvas,
    inPlayerRange = _useAnnotationRow.inPlayerRange;

  // React refs for UI elements
  var annotationRef = useRef(null);
  var annotationTagsRef = useRef(null);
  var annotationTimesRef = useRef(null);
  var annotationTextsRef = useRef(null);
  var moreTagsButtonRef = useRef(null);
  var isShowMoreRef = useRef(true);
  var setIsShowMoreRef = function setIsShowMoreRef(state) {
    return isShowMoreRef.current = state;
  };

  // TextualBodies with purpose tagging to be displayed as tags next to time range
  var tags = useMemo(function () {
    return value.filter(function (v) {
      return v.purpose.includes('tagging');
    });
  }, [value]);

  // TextualBodies with supported purpose (motivation) values to be displayed as text
  var texts = useMemo(function () {
    var textsToShow = value.filter(function (v) {
      return SUPPORTED_MOTIVATIONS.some(function (m) {
        return v.purpose.includes(m);
      });
    });
    if ((textsToShow === null || textsToShow === void 0 ? void 0 : textsToShow.length) > 0) {
      // Join texts with line breaks into a single text block
      var annotationText = textsToShow.map(function (t) {
        return t.value;
      }).join('<br>');
      return annotationText;
    } else {
      return '';
    }
  }, [value]);

  /**
   * Display only the annotations with at least one of the specified motivations
   * when the component is initialized.
   * The default value of 'displayMotivations' is set to an empty array, 
   * in which case the component displays all annotations related to Canvas.
   */
  var canDisplay = useMemo(function () {
    return (displayMotivations === null || displayMotivations === void 0 ? void 0 : displayMotivations.length) > 0 ? displayMotivations.some(function (m) {
      return motivation.includes(m);
    }) : true;
  }, [annotation, displayMotivations]);

  // Custom hook to handle show more/less functionality for texts and tags
  var _useShowMoreOrLess = useShowMoreOrLess({
      autoScrollEnabled: autoScrollEnabled,
      enableShowMore: enableShowMore,
      inPlayerRange: inPlayerRange,
      MAX_LINES: MAX_LINES,
      refs: {
        annotationRef: annotationRef,
        annotationTagsRef: annotationTagsRef,
        annotationTextsRef: annotationTextsRef,
        annotationTimesRef: annotationTimesRef,
        containerRef: containerRef,
        moreTagsButtonRef: moreTagsButtonRef
      },
      setIsShowMoreRef: setIsShowMoreRef,
      setIsActive: setIsActive,
      tags: tags,
      texts: texts
    }),
    hasLongerTags = _useShowMoreOrLess.hasLongerTags,
    hasLongerText = _useShowMoreOrLess.hasLongerText,
    setShowMoreTags = _useShowMoreOrLess.setShowMoreTags,
    showMoreTags = _useShowMoreOrLess.showMoreTags,
    setTextToShow = _useShowMoreOrLess.setTextToShow,
    textToShow = _useShowMoreOrLess.textToShow,
    toggleTagsView = _useShowMoreOrLess.toggleTagsView,
    truncatedText = _useShowMoreOrLess.truncatedText;

  /**
   * Click event handler for annotations displayed in the UI.
   * Seek the player to;
   * - start time of an Annotation with a time range
   * - timestamp of an Annotation with a single time-point.
   */
  var handleOnClick = useCallback(function (e) {
    var _player$targets;
    e.preventDefault();
    checkCanvas(annotation);
    var currTime = time === null || time === void 0 ? void 0 : time.start;
    if (player && (player === null || player === void 0 ? void 0 : (_player$targets = player.targets) === null || _player$targets === void 0 ? void 0 : _player$targets.length) > 0) {
      var _player$targets$ = player.targets[0],
        start = _player$targets$.start,
        end = _player$targets$.end;
      switch (true) {
        case currTime >= start && currTime <= end:
          player.currentTime(currTime);
          break;
        case currTime < start:
          player.currentTime(start);
          break;
        case currTime > end:
          player.currentTime(end);
          break;
      }
    }
  }, [annotation, player]);

  /**
   * Validate and handle click events on a link in the annotation text
   * @param {Event} e 
   * @returns 
   */
  var handleLinkClicks = function handleLinkClicks(e) {
    // Handle click on a link in the text in the same tab without seeking the player
    if (e.target.tagName == 'A') {
      // Check if the href value is a valid URL before navigation
      var urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
      var href = e.target.getAttribute('href');
      if (!(href !== null && href !== void 0 && href.match(urlRegex))) {
        e.preventDefault();
      } else {
        window.open(e.target.href, '_self');
        return;
      }
    }
  };

  /**
   * Click event handler for the 'Show more'/'Show less' button for
   * each annotation text.
   */
  var handleShowMoreLessClick = function handleShowMoreLessClick() {
    if (!isShowMoreRef.current) {
      setTextToShow(truncatedText);
      // Scroll to the top of the annotation when 'Show less' button is clicked
      autoScroll(annotationRef.current, containerRef, true);
    } else {
      setTextToShow(texts);
    }
    setIsShowMoreRef(!isShowMoreRef.current);
  };

  /**
   * Keydown event handler for show more/less button in the annotation text
   * @param {Event} e keydown event
   */
  var handleShowMoreLessKeydown = function handleShowMoreLessKeydown(e) {
    if (e.key == 'Enter' || e.key == ' ') {
      e.preventDefault();
      handleShowMoreLessClick();
    }
  };

  /**
   * Click event handler for show/hide overflowing tags button for
   * each annotation row.
   */
  var handleShowMoreTagsClicks = function handleShowMoreTagsClicks() {
    var nextState = !showMoreTags;
    toggleTagsView(nextState);
    setShowMoreTags(nextState);
    // Scroll to the top of the annotation when 'Show less' button is clicked
    if (nextState) {
      autoScroll(annotationRef.current, containerRef, true);
    }
  };

  /**
   * Enable keyboard activation of the show/hide overflowing tags
   * button for 'Space' (32) and 'Enter' (13) keys.
   */
  var handleShowMoreTagsKeyDown = function handleShowMoreTagsKeyDown(e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleShowMoreTagsClicks();
    }
  };

  /**
   * Seek the player to the start time of the activated annotation, and mark it as active
   * when using Enter/Space keys to select the focused annotation
   * @param {Event} e keyboard event
   * @returns 
   */
  var handleKeyDown = function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      handleOnClick(e);
    }
  };

  /**
   * Screen reader friendly label for the annotation row, that includes the start and/or 
   * end time of the annotation and the text to be read by the screen reader.
   */
  var screenReaderLabel = useMemo(function () {
    var textToRead = screenReaderFriendlyText(textToShow);
    var startTimeToRead = (time === null || time === void 0 ? void 0 : time.start) != undefined ? screenReaderFriendlyTime(time === null || time === void 0 ? void 0 : time.start) : '';
    if ((time === null || time === void 0 ? void 0 : time.end) != undefined) {
      return "From ".concat(startTimeToRead, " to ").concat(screenReaderFriendlyTime(time.end), ", ").concat(textToRead);
    } else {
      return "".concat(startTimeToRead, ", ").concat(textToRead);
    }
  }, [time, textToShow]);
  if (canDisplay) {
    return /*#__PURE__*/React.createElement("div", {
      key: "li_".concat(index),
      ref: annotationRef,
      "data-testid": "annotation-row",
      className: cx('ramp--annotations__annotation-row', isActive && 'active'),
      "aria-label": screenReaderLabel
    }, /*#__PURE__*/React.createElement("div", {
      key: "row_".concat(index),
      role: "button",
      tabIndex: index === 0 ? 0 : -1,
      onClick: handleOnClick,
      onKeyDown: handleKeyDown,
      "aria-label": screenReaderLabel,
      "data-testid": "annotation-row-button",
      className: "ramp--annotations__annotation-row-time-tags"
    }, /*#__PURE__*/React.createElement("div", {
      key: "times_".concat(index),
      className: "ramp--annotations__annotation-times",
      ref: annotationTimesRef
    }, (time === null || time === void 0 ? void 0 : time.start) != undefined && /*#__PURE__*/React.createElement("span", {
      className: "ramp--annotations__annotation-start-time",
      "data-testid": "annotation-start-time"
    }, timeToHHmmss(time === null || time === void 0 ? void 0 : time.start, true, true)), (time === null || time === void 0 ? void 0 : time.end) != undefined && /*#__PURE__*/React.createElement("span", {
      className: "ramp--annotations__annotation-end-time",
      "data-testid": "annotation-end-time"
    }, " - ".concat(timeToHHmmss(time === null || time === void 0 ? void 0 : time.end, true, true)))), /*#__PURE__*/React.createElement("div", {
      key: "tags_".concat(index),
      className: "ramp--annotations__annotation-tags",
      "data-testid": "annotation-tags-".concat(index),
      ref: annotationTagsRef
    }, (tags === null || tags === void 0 ? void 0 : tags.length) > 0 && tags.map(function (tag, i) {
      return /*#__PURE__*/React.createElement("p", {
        key: "tag_".concat(i),
        className: "ramp--annotations__annotation-tag",
        "data-testid": "annotation-tag-".concat(i),
        style: {
          backgroundColor: tag.tagColor
        }
      }, tag.value);
    }), hasLongerTags && /*#__PURE__*/React.createElement("button", {
      key: "show-more-tags_".concat(index),
      role: "button",
      "aria-label": showMoreTags ? 'Show hidden tags' : 'Hide overflowing tags',
      "aria-pressed": showMoreTags ? 'false' : 'true',
      className: "ramp--annotations__show-more-tags",
      "data-testid": "show-more-annotation-tags-".concat(index),
      onClick: handleShowMoreTagsClicks,
      onKeyDown: handleShowMoreTagsKeyDown,
      ref: moreTagsButtonRef
    }, /*#__PURE__*/React.createElement("i", {
      className: "arrow ".concat(showMoreTags ? 'right' : 'left')
    })))), /*#__PURE__*/React.createElement("div", {
      key: "text_".concat(index),
      className: "ramp--annotations__annotation-texts",
      ref: annotationTextsRef
    }, (textToShow === null || textToShow === void 0 ? void 0 : textToShow.length) > 0 && /*#__PURE__*/React.createElement("p", {
      key: "text_".concat(index),
      "data-testid": "annotation-text-".concat(index),
      className: "ramp--annotations__annotation-text",
      onClick: handleLinkClicks,
      dangerouslySetInnerHTML: {
        __html: textToShow
      }
    }), hasLongerText && enableShowMore && /*#__PURE__*/React.createElement("button", {
      key: "show-more_".concat(index),
      role: "button",
      "aria-label": isShowMoreRef.current ? 'show more' : 'show less',
      "aria-pressed": isShowMoreRef.current ? 'false' : 'true',
      className: "ramp--annotations__show-more-less",
      "data-testid": "annotation-show-more-".concat(index),
      onClick: handleShowMoreLessClick,
      onKeyDown: handleShowMoreLessKeydown
    }, isShowMoreRef.current ? 'Show more' : 'Show less')));
  } else {
    return null;
  }
};
AnnotationRow.propTypes = {
  annotation: PropTypes.object.isRequired,
  autoScrollEnabled: PropTypes.bool.isRequired,
  containerRef: PropTypes.object.isRequired,
  displayedAnnotations: PropTypes.array,
  displayMotivations: PropTypes.array.isRequired,
  index: PropTypes.number,
  showMoreSettings: PropTypes.object.isRequired
};

var AnnotationList = function AnnotationList(_ref) {
  var annotations = _ref.annotations,
    canvasIndex = _ref.canvasIndex,
    duration = _ref.duration,
    displayMotivations = _ref.displayMotivations,
    showMoreSettings = _ref.showMoreSettings;
  var _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    canvasAnnotationSets = _useState2[0],
    setCanvasAnnotationSets = _useState2[1];
  var _useState3 = useState([]),
    _useState4 = _slicedToArray(_useState3, 2),
    displayedAnnotationSets = _useState4[0],
    setDisplayedAnnotationSets = _useState4[1];
  var _useState5 = useState(true),
    _useState6 = _slicedToArray(_useState5, 2),
    autoScrollEnabled = _useState6[0],
    setAutoScrollEnabled = _useState6[1];
  var _useState7 = useState(true),
    _useState8 = _slicedToArray(_useState7, 2),
    isLoading = _useState8[0],
    setIsLoading = _useState8[1];
  var annotationDisplayRef = useRef(null);
  var annotationRowContainerRef = useRef(null);

  // Index of the focused annotation row in the list
  var currentIndex = useRef(0);
  var setCurrentIndex = function setCurrentIndex(i) {
    return currentIndex.current = i;
  };

  /**
   * Update annotation sets for the current Canvas
   */
  useEffect(function () {
    // Re-set isLoading on Canvas change
    setIsLoading(true);
    if ((annotations === null || annotations === void 0 ? void 0 : annotations.length) > 0) {
      var _annotations$filter$ = annotations.filter(function (a) {
          return a.canvasIndex === canvasIndex;
        })[0];
        _annotations$filter$._;
        var annotationSets = _annotations$filter$.annotationSets;
      // Filter timed annotationSets to be displayed in Annotations component
      // Avoids PDF, Docx files linked as 'supplementing' annotations
      if ((annotationSets === null || annotationSets === void 0 ? void 0 : annotationSets.length) > 0) {
        setCanvasAnnotationSets(annotationSets.filter(function (a) {
          return a.timed;
        }));
      }
    }
  }, [annotations, canvasIndex]);

  /**
   * Filter and merge annotations parsed from either an AnnotationPage or a linked
   * resource in Annotation objects within an AnnotationPage for selected annotation
   * sets.
   */
  var displayedAnnotations = useMemo(function () {
    return (displayedAnnotationSets === null || displayedAnnotationSets === void 0 ? void 0 : displayedAnnotationSets.length) > 0 ? sortAnnotations(displayedAnnotationSets.map(function (a) {
      return a.items;
    }).flat()) : [];
  }, [displayedAnnotationSets]);

  /**
   * Identify any of the displayed annotation sets have linked resource(s).
   * This value is used to initiate a delayed state update to the 'isLoading'
   * variable, to stop displaying a no annotations message while fetch requests
   * are in progress.
   */
  var hasExternalAnnotations = useMemo(function () {
    return (displayedAnnotationSets === null || displayedAnnotationSets === void 0 ? void 0 : displayedAnnotationSets.length) > 0 ? displayedAnnotationSets.map(function (a) {
      return a.linkedResource;
    }).reduce(function (acc, curr) {
      return acc || curr;
    }, false) : false;
  }, [displayedAnnotationSets]);

  /**
   * Set timeout function with an AbortController
   * @param {Function} callback 
   * @param {Number} delay milliseconds number to wait
   * @param {Object} signal abort signal from AbortController
   */
  var setTimeoutWithAbort = function setTimeoutWithAbort(callback, delay, signal) {
    if (signal !== null && signal !== void 0 && signal.aborted) {
      return;
    }
    var timeOutId = setTimeout(function () {
      if (!(signal !== null && signal !== void 0 && signal.aborted)) {
        callback();
      }
    }, delay);
    // Listener to abort signal to clear existing timeout
    signal === null || signal === void 0 ? void 0 : signal.addEventListener('abort', function () {
      clearTimeout(timeOutId);
    });
  };

  /**
   * Check if the annotations related to the Canvas have motivation(s) specified
   * by the user when the component is initialized.
   * If none of the annotations in the Canvas has at least one the specified
   * motivation(s), then a message is displayed to the user.
   */
  var hasDisplayAnnotations = useMemo(function () {
    // AbortController for timeout function to toggle 'isLoading'
    var abortController;
    if ((displayedAnnotations === null || displayedAnnotations === void 0 ? void 0 : displayedAnnotations.length) > 0 && displayedAnnotations[0] != undefined) {
      var _abortController;
      // If annotations are read before executing the timeout in the else condition,
      // abort the timeout
      (_abortController = abortController) === null || _abortController === void 0 ? void 0 : _abortController.abort();
      // Once annotations are present remove the Spinner
      setIsLoading(false);
      var motivations = displayedAnnotations.map(function (a) {
        return a.motivation;
      });
      // Check if any of the annotations have the specified motivation(s) or default motivations
      return (displayMotivations === null || displayMotivations === void 0 ? void 0 : displayMotivations.length) > 0 ? displayMotivations.some(function (m) {
        return motivations.flat().includes(m);
      }) : SUPPORTED_MOTIVATIONS.some(function (m) {
        return motivations.flat().includes(m);
      });
    } else {
      var _abortController2;
      // Abort existing abortControll before creating a new one
      (_abortController2 = abortController) === null || _abortController2 === void 0 ? void 0 : _abortController2.abort();
      /**
       * Initiate a delayed call to toggle 'isLoading' with an abortController.
       * This allows the UI to wait for annotations from any linked resources before 
       * displaying a no annotations message while the fetch requests are in progress.
       */
      abortController = new AbortController();
      if (hasExternalAnnotations) {
        setTimeoutWithAbort(function () {
          setIsLoading(false);
        }, 500, abortController.signal);
      }
      return false;
    }
  }, [displayedAnnotations]);
  var annotationSetSelect = useMemo(function () {
    return /*#__PURE__*/React.createElement(AnnotationSetSelect, {
      key: canvasIndex,
      canvasAnnotationSets: canvasAnnotationSets,
      duration: duration,
      setDisplayedAnnotationSets: setDisplayedAnnotationSets,
      setAutoScrollEnabled: setAutoScrollEnabled,
      autoScrollEnabled: autoScrollEnabled
    });
  }, [autoScrollEnabled, canvasAnnotationSets]);

  /**
   * Handle keyboard accessibility within the annotations component using
   * roving tabindex strategy.
   * All annotation rows are given 'tabIndex' -1 except for the first annotation row
   * in the list, which is set to 0.
   * Then as the user uses 'ArrowDown' and 'ArrowDown' keys move up and down through
   * the annotation rows the focus is moved enabling activation of each focused cue
   * in the AnnotationRow component using keyboard.
   * @param {Event} e keydown event
   */
  var handleKeyDown = function handleKeyDown(e) {
    // Get all annotation rows by the click-able element className
    var annotationRows = annotationRowContainerRef.current.querySelectorAll('.ramp--annotations__annotation-row-time-tags');
    if ((annotationRows === null || annotationRows === void 0 ? void 0 : annotationRows.length) > 0) {
      var nextIndex = currentIndex.current;
      if (e.key === 'ArrowDown') {
        // Wraps focus back to first cue when the end of annotations list is reached
        nextIndex = (currentIndex.current + 1) % annotationRows.length;
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        nextIndex = (currentIndex.current - 1 + annotationRows.length) % annotationRows.length;
        e.preventDefault();
      }
      if (nextIndex !== currentIndex.current) {
        annotationRows[currentIndex.current].tabIndex = -1;
        annotationRows[nextIndex].tabIndex = 0;
        annotationRows[nextIndex].focus();
        // Scroll the focused annotation row into view
        autoScroll(annotationRows[nextIndex], annotationDisplayRef, true);
        setCurrentIndex(nextIndex);
      }
    }
  };
  var annotationRows = useMemo(function () {
    if (isLoading) {
      return /*#__PURE__*/React.createElement(Spinner, null);
    } else {
      if (hasDisplayAnnotations && (displayedAnnotations === null || displayedAnnotations === void 0 ? void 0 : displayedAnnotations.length) > 0) {
        return /*#__PURE__*/React.createElement("div", {
          onKeyDown: handleKeyDown,
          ref: annotationRowContainerRef,
          "aria-label": "Scrollable time-synced annotations list"
        }, displayedAnnotations.map(function (annotation, index) {
          return /*#__PURE__*/React.createElement(AnnotationRow, {
            key: index,
            annotation: annotation,
            displayMotivations: displayMotivations,
            autoScrollEnabled: autoScrollEnabled,
            containerRef: annotationDisplayRef,
            displayedAnnotations: displayedAnnotations,
            showMoreSettings: showMoreSettings,
            index: index
          });
        }));
      } else {
        return /*#__PURE__*/React.createElement("p", {
          "data-testid": "no-annotations-message"
        }, (displayMotivations === null || displayMotivations === void 0 ? void 0 : displayMotivations.length) > 0 ? "No Annotations were found with ".concat(displayMotivations.join('/'), " motivation.") : 'No Annotations were found for the selected set(s).');
      }
    }
  }, [hasDisplayAnnotations, displayedAnnotations, isLoading, autoScrollEnabled]);
  if ((canvasAnnotationSets === null || canvasAnnotationSets === void 0 ? void 0 : canvasAnnotationSets.length) > 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "ramp--annotations__list",
      "data-testid": "annotations-list"
    }, annotationSetSelect, /*#__PURE__*/React.createElement("div", {
      className: "ramp--annotations__content",
      "data-testid": "annotations-content",
      tabIndex: -1,
      ref: annotationDisplayRef
    }, annotationRows));
  } else {
    return /*#__PURE__*/React.createElement("p", {
      "data-testid": "no-annotation-sets-message"
    }, "No Annotations sets were found for the Canvas.");
  }
};
AnnotationList.propTypes = {
  annotations: PropTypes.array.isRequired,
  canvasIndex: PropTypes.number.isRequired,
  displayMotivations: PropTypes.array.isRequired,
  duration: PropTypes.number.isRequired,
  showMoreSettings: PropTypes.object.isRequired
};

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

/**
 * Display annotations from 'annotations' list associated with the current Canvas
 * @param {Object} props
 * @param {Boolean} props.showHeading
 * @param {String} props.headingText
 * @param {Array<String>} props.displayMotivations
 */
var Annotations = function Annotations(_ref) {
  var _document$getElements;
  var _ref$displayMotivatio = _ref.displayMotivations,
    displayMotivations = _ref$displayMotivatio === void 0 ? [] : _ref$displayMotivatio,
    _ref$headingText = _ref.headingText,
    headingText = _ref$headingText === void 0 ? 'Annotations' : _ref$headingText,
    _ref$showHeading = _ref.showHeading,
    showHeading = _ref$showHeading === void 0 ? true : _ref$showHeading,
    showMoreSettings = _ref.showMoreSettings;
  // Default showMoreSettings
  var defaultShowMoreSettings = {
    enableShowMore: false,
    textLineLimit: 6
  };

  // Fill in missing properties, e.g. if prop only set to { enableShowMore: true }
  showMoreSettings = _objectSpread(_objectSpread({}, defaultShowMoreSettings), showMoreSettings);
  var _useManifestState = useManifestState(),
    allCanvases = _useManifestState.allCanvases,
    annotations = _useManifestState.annotations,
    canvasDuration = _useManifestState.canvasDuration,
    canvasIndex = _useManifestState.canvasIndex,
    playlist = _useManifestState.playlist;
  var manifestDispatch = useManifestDispatch();

  // Parse and store annotations and markers in global state on Manifest load and Canvas changes 
  useAnnotations();
  var annotationServiceId = playlist.annotationServiceId,
    hasAnnotationService = playlist.hasAnnotationService,
    isPlaylist = playlist.isPlaylist,
    markers = playlist.markers;
  var _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2);
    _useState2[0];
    var setCanvasPlaylistsMarkers = _useState2[1];
  var _useErrorBoundary = useErrorBoundary(),
    showBoundary = _useErrorBoundary.showBoundary;
  var canvasIdRef = useRef();

  // Using a ref updates markers table immediately after marker edit/creation
  var canvasPlaylistsMarkersRef = useRef([]);
  var setCanvasMarkers = function setCanvasMarkers(list) {
    setCanvasPlaylistsMarkers.apply(void 0, _toConsumableArray(list));
    canvasPlaylistsMarkersRef.current = list;
  };

  // Retrieves the CRSF authenticity token when component is embedded in a Rails app.
  var csrfToken = (_document$getElements = document.getElementsByName('csrf-token')[0]) === null || _document$getElements === void 0 ? void 0 : _document$getElements.content;

  /**
   * For playlist manifests, this component is used to display annotations
   * with 'highlighting' motivations. These are single time-point annotations used
   * as markers in playlists.
   */
  useEffect(function () {
    try {
      if (isPlaylist && (markers === null || markers === void 0 ? void 0 : markers.length) > 0) {
        // Check if markers are available for the current Canvas and update state
        var canvasMarkers = markers.filter(function (a) {
          return a.canvasIndex === canvasIndex;
        });
        if ((canvasMarkers === null || canvasMarkers === void 0 ? void 0 : canvasMarkers.length) > 0) {
          setCanvasMarkers(canvasMarkers[0].canvasMarkers);
        } else {
          setCanvasMarkers([]);
        }
      }
      if (allCanvases != undefined && (allCanvases === null || allCanvases === void 0 ? void 0 : allCanvases.length) > 0) {
        canvasIdRef.current = allCanvases[canvasIndex].canvasId;
      }
    } catch (error) {
      showBoundary(error);
    }
  }, [isPlaylist, canvasIndex, markers]);

  /**
   * Handle highlighting annotation creation and editing submission in
   * playlist manifests.
   * @param {String} label label of the marker
   * @param {String} time time of the marker in HH:MM:SS format
   * @param {String} id unique identifier of the marker
   */
  var handleSubmit = useCallback(function (label, time, id) {
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
  });

  /**
   * Handle deletion of a highlighting annotation marker in playlist manifests.
   * @param {String} id unique identifier of the marker to delete
   */
  var handleDelete = useCallback(function (id) {
    var remainingMarkers = canvasPlaylistsMarkersRef.current.filter(function (m) {
      return m.id != id;
    });
    // Update markers in state for displaying in the player UI
    setCanvasMarkers(remainingMarkers);
    manifestDispatch({
      updatedMarkers: remainingMarkers,
      type: 'setPlaylistMarkers'
    });
  });

  /**
   * Handle creation of a new highlighting annotation marker in playlist manifests.
   * @param {Object} newMarker new marker object to add to the markers list
   * @param {String} newMarker.id unique identifier of the new marker
   * @param {Number} newMarker.time time of the new marker in seconds
   * @param {String} newMarker.timeStr time of the new marker in HH:MM:SS format
   * @param {Number} newMarker.canvasId index of the Canvas where the marker is created
   * @param {String} newMarker.value label of the new marker
   */
  var handleCreate = useCallback(function (newMarker) {
    setCanvasMarkers([].concat(_toConsumableArray(canvasPlaylistsMarkersRef.current), [newMarker]));
    manifestDispatch({
      updatedMarkers: canvasPlaylistsMarkersRef.current,
      type: 'setPlaylistMarkers'
    });
  });

  /**
   * Toggle editing state for the markers table in playlist manifests.
   * @param {Boolean} flag true to enable editing, false to disable
   */
  var toggleIsEditing = useCallback(function (flag) {
    manifestDispatch({
      isEditing: flag,
      type: 'setIsEditing'
    });
  });
  var createMarker = useMemo(function () {
    if (hasAnnotationService) {
      return /*#__PURE__*/React.createElement(CreateMarker, {
        newMarkerEndpoint: annotationServiceId,
        canvasId: canvasIdRef.current,
        handleCreate: handleCreate,
        csrfToken: csrfToken
      });
    }
  }, [hasAnnotationService, canvasIdRef.current, csrfToken]);
  var markersTable = useMemo(function () {
    if (canvasPlaylistsMarkersRef.current.length > 0) {
      return /*#__PURE__*/React.createElement("table", {
        className: "ramp--markers-display_table",
        "data-testid": "markers-display-table"
      }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, /*#__PURE__*/React.createElement("label", {
        htmlFor: "marker-edit-label"
      }, "Name")), /*#__PURE__*/React.createElement("th", null, /*#__PURE__*/React.createElement("label", {
        htmlFor: "marker-edit-time"
      }, "Time")), hasAnnotationService && /*#__PURE__*/React.createElement("th", null, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, canvasPlaylistsMarkersRef.current.map(function (marker, index) {
        return /*#__PURE__*/React.createElement(MarkerRow, {
          key: index,
          marker: marker,
          handleSubmit: handleSubmit,
          handleDelete: handleDelete,
          toggleIsEditing: toggleIsEditing,
          csrfToken: csrfToken
        });
      })));
    }
  }, [canvasPlaylistsMarkersRef.current]);
  return /*#__PURE__*/React.createElement("div", {
    className: "ramp--annotations-display",
    "data-testid": "annotations-display",
    role: "complementary",
    "aria-label": "annotations display"
  }, showHeading && /*#__PURE__*/React.createElement("div", {
    className: "ramp--annotations__title",
    "data-testid": "annotations-display-title"
  }, /*#__PURE__*/React.createElement("h4", null, headingText)), isPlaylist && /*#__PURE__*/React.createElement(React.Fragment, null, createMarker, markersTable), (annotations === null || annotations === void 0 ? void 0 : annotations.length) > 0 && !isPlaylist && /*#__PURE__*/React.createElement(AnnotationList, {
    annotations: annotations,
    canvasIndex: canvasIndex,
    displayMotivations: displayMotivations,
    duration: canvasDuration,
    showMoreSettings: showMoreSettings
  }));
};
Annotations.propTypes = {
  displayMotivations: PropTypes.array,
  headingText: PropTypes.string,
  showHeading: PropTypes.bool,
  showMoreSettings: PropTypes.object
};

export { Annotations, AutoAdvanceToggle, IIIFPlayer, MediaPlayer, MetadataDisplay, StructuredNavigation, SupplementalFiles, Transcript };
