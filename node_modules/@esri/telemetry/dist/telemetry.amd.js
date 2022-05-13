define('telemetry', ['analytics', '@analytics/aws-pinpoint'], function (Analytics, awsPinpointPlugin) { 'use strict';

Analytics = 'default' in Analytics ? Analytics['default'] : Analytics;
awsPinpointPlugin = 'default' in awsPinpointPlugin ? awsPinpointPlugin['default'] : awsPinpointPlugin;

var Storage = {
  storage: {},
  memory: true,
  get: function get(key) {
    var stored = void 0;
    try {
      stored = window.localStorage && window.localStorage.getItem(key) || this.storage[key];
    } catch (e) {
      stored = this.storage[key];
    }
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return undefined;
      }
    } else {
      return undefined;
    }
  },
  set: function set(key, value) {
    // handle Safari private mode (setItem is not allowed)
    value = JSON.stringify(value);
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      if (!this.memory) {
        console.error('setting local storage failed, falling back to in-memory storage');
        this.memory = true;
      }
      this.storage[key] = value;
    }
  },
  delete: function _delete(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      if (!this.memory) {
        console.error('setting local storage failed, falling back to in-memory storage');
        this.memory = true;
      }
      delete this.storage[key];
    }
  }
};

var COGNITO_KEY = 'TELEMETRY_COGNITO_CREDENTIALS';

function getCredentials(IdentityPoolId) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var fipsSubdomainSuffix = options.fips === true ? '-fips' : '';
  var COGNITO_URL = 'https://cognito-identity' + fipsSubdomainSuffix + '.us-east-1.amazonaws.com/';
  var cached = Storage.get(COGNITO_KEY);
  if (cached && Date.now() / 1000 < cached.Expiration) return Promise.resolve(cached);

  var fetchOptions = {
    method: 'POST',
    headers: {
      'Content-type': 'application/x-amz-json-1.1',
      'X-Amz-Target': 'AWSCognitoIdentityService.GetId'
    },
    body: JSON.stringify({ IdentityPoolId: IdentityPoolId })
  };

  return fetch(COGNITO_URL, fetchOptions).then(function (response) {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  }).then(function (response) {
    var IdentityId = response.IdentityId;

    var options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/x-amz-json-1.1',
        'X-Amz-Target': 'AWSCognitoIdentityService.GetCredentialsForIdentity'
      },
      body: JSON.stringify({ IdentityId: IdentityId })
    };
    return fetch(COGNITO_URL, options);
  }).then(function (response) {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  }).then(function (_ref) {
    var Credentials = _ref.Credentials;

    Storage.set(COGNITO_KEY, Credentials);
    return Credentials;
  });
}

function formatTelemetryAttributes(_ref) {
  var telemetryData = _ref.telemetryData,
      _ref$dimensionLookup = _ref.dimensionLookup,
      dimensionLookup = _ref$dimensionLookup === undefined ? {} : _ref$dimensionLookup,
      _ref$excludeKeys = _ref.excludeKeys,
      excludeKeys = _ref$excludeKeys === undefined ? [] : _ref$excludeKeys;

  return Object.keys(telemetryData).filter(function (key) {
    return !excludeKeys.includes(key);
  }).map(function (key) {
    if (dimensionLookup[key]) {
      return {
        key: getCustomDimensionKey(dimensionLookup, key),
        value: telemetryData[key] };
    }

    return {
      key: key,
      value: getValue(telemetryData, key)
    };
  }).reduce(function (acc, _ref2) {
    var key = _ref2.key,
        value = _ref2.value;

    acc[key] = value;
    return acc;
  }, {});
}

function getValue(data, key) {
  if (key === 'json') {
    return data[key] ? JSON.stringify(data[key]) : 'null';
  }

  return data[key] === undefined ? 'null' : data[key].toString();
}

function getCustomDimensionKey(lookup, key) {
  return 'dimension' + lookup[key];
}

var METRICS = ['size', 'duration', 'position', 'number', 'count'];

function formatTelemetryMetrtics(telemetryData) {
  var metricLookup = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return Object.keys(telemetryData).filter(function (key) {
    return metricLookup[key] || METRICS.includes(key);
  }).map(function (key) {
    if (metricLookup[key]) {
      return {
        key: getCustomMetricKey(metricLookup, key),
        value: telemetryData[key]
      };
    }

    return {
      key: key,
      value: telemetryData[key]
    };
  }).reduce(function (acc, _ref) {
    var key = _ref.key,
        value = _ref.value;

    acc[key] = value;
    return acc;
  }, {});
}

function getCustomMetricKey(lookup, key) {
  return 'metric' + lookup[key];
}

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
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
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
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







var interopRequireWildcard = function (obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj.default = obj;
    return newObj;
  }
};



























var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

function createEventLog(_ref) {
  var _ref$event = _ref.event,
      event = _ref$event === undefined ? {} : _ref$event,
      _ref$dimensionLookup = _ref.dimensionLookup,
      dimensionLookup = _ref$dimensionLookup === undefined ? {} : _ref$dimensionLookup,
      _ref$metricLookup = _ref.metricLookup,
      metricLookup = _ref$metricLookup === undefined ? {} : _ref$metricLookup;
  var _event$eventType = event.eventType,
      eventType = _event$eventType === undefined ? 'other' : _event$eventType;

  var metrics = formatTelemetryMetrtics(event, metricLookup);
  var eventAttributes = formatTelemetryAttributes({
    telemetryData: _extends({ eventType: eventType }, event),
    dimensionLookup: dimensionLookup,
    excludeKeys: ['workflow'].concat(toConsumableArray(Object.keys(metrics)), toConsumableArray(Object.keys(metricLookup)))
  });

  return _extends({
    name: eventType,
    referrer: document.referrer,
    hostname: window.location.hostname,
    path: window.location.pathname
  }, eventAttributes, metrics);
}

function createPageViewLog(_ref) {
  var page = _ref.page,
      _ref$previousPage = _ref.previousPage,
      previousPage = _ref$previousPage === undefined ? {} : _ref$previousPage,
      _ref$options = _ref.options,
      options = _ref$options === undefined ? {} : _ref$options,
      _ref$dimensionLookup = _ref.dimensionLookup,
      dimensionLookup = _ref$dimensionLookup === undefined ? {} : _ref$dimensionLookup,
      _ref$metricLookup = _ref.metricLookup,
      metricLookup = _ref$metricLookup === undefined ? {} : _ref$metricLookup;

  var metrics = formatTelemetryMetrtics(options, metricLookup);
  var attributes = formatTelemetryAttributes({
    telemetryData: options,
    dimensionLookup: dimensionLookup,
    excludeKeys: ['workflow'].concat(toConsumableArray(Object.keys(metrics)), toConsumableArray(Object.keys(metricLookup)))
  });

  var _ref2 = document || {},
      referrer = _ref2.referrer,
      title = _ref2.title;

  var _ref3 = window && window.location ? window.location : {},
      hostname = _ref3.hostname,
      pathname = _ref3.pathname;

  return _extends({
    name: 'pageView',
    referrer: referrer,
    hostname: hostname,
    path: page || pathname,
    pageUrl: page || pathname,
    pageName: title,
    previousPageUrl: previousPage.pageUrl,
    previousPageName: previousPage.pageName
  }, attributes, metrics);
}

var Amazon = function () {
  function Amazon(options) {
    classCallCheck(this, Amazon);
    var _options$app = options.app,
        app = _options$app === undefined ? {} : _options$app,
        fips = options.fips,
        userPoolID = options.userPoolID;

    this.analytics = Analytics({
      app: app.name,
      plugins: [awsPinpointPlugin({
        fips: fips,
        pinpointAppId: app.id,
        getCredentials: function getCredentials$$1() {
          return getCredentials(userPoolID, { fips: fips });
        }
      })]
    });

    this.name = 'amazon';
    _extends(this, options);
  }

  createClass(Amazon, [{
    key: 'logPageView',
    value: function logPageView(page, options) {
      var telemetryPayload = createPageViewLog({
        page: page,
        previousPage: this.previousPage,
        options: options,
        dimensionLookup: this.dimensions,
        metricLookup: this.metrics
      });
      this.previousPage = telemetryPayload.attributes;
      this.analytics.track('pageView', telemetryPayload);
    }
  }, {
    key: 'logEvent',
    value: function logEvent() {
      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var telemetryPayload = createEventLog({
        event: event,
        dimensionLookup: this.dimensions,
        metricLookup: this.metrics
      });
      var name = telemetryPayload.name;

      this.analytics.track(name, telemetryPayload);
    }
  }]);
  return Amazon;
}();

function mapMetricsAndDimensions(_ref) {
  var _ref$customTelemetryD = _ref.customTelemetryData,
      customTelemetryData = _ref$customTelemetryD === undefined ? {} : _ref$customTelemetryD,
      _ref$dimensionLookup = _ref.dimensionLookup,
      dimensionLookup = _ref$dimensionLookup === undefined ? {} : _ref$dimensionLookup,
      _ref$metricLookup = _ref.metricLookup,
      metricLookup = _ref$metricLookup === undefined ? {} : _ref$metricLookup;

  return Object.keys(customTelemetryData).map(function (key) {
    if (dimensionLookup[key]) {
      return {
        key: getCustomDimensionKey$1(dimensionLookup, key),
        value: customTelemetryData[key] };
    }
    if (metricLookup[key]) {
      return {
        key: getCustomMetricKey$1(metricLookup, key),
        value: customTelemetryData[key]
      };
    }
  }).filter(function (val) {
    return val;
  }).reduce(function (acc, _ref2) {
    var key = _ref2.key,
        value = _ref2.value;

    acc[key] = value;
    return acc;
  }, {});
}

function getCustomDimensionKey$1(lookup, key) {
  return "dimension" + lookup[key];
}

function getCustomMetricKey$1(lookup, key) {
  return "metric" + lookup[key];
}

// This module performs dynamic importing in Telemetry.js which allows for test stubbing
var dynamicImport = (function () {
  var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(moduleSpecifier) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return Promise.resolve("" + moduleSpecifier).then(function (s) {
              return interopRequireWildcard(require(s));
            });

          case 2:
            return _context.abrupt("return", _context.sent);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function dynamicImport(_x) {
    return _ref.apply(this, arguments);
  }

  return dynamicImport;
})();

var MODULE_SPECIFIER = 'universal-analytics';

var Google = function () {
  function Google() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, Google);

    this.name = 'google';
    _extends(this, options);
  }

  createClass(Google, [{
    key: 'logPageView',
    value: function logPageView(page, options) {
      var pageviewObj = buildPageViewObject(page, options, this.dimensions, this.metrics);
      getBrowserTrackingFunctions(function (browserTrackers) {
        browserTrackers.forEach(function (browserTracker) {
          browserTracker.send(pageviewObj);
        });
      });
    }
  }, {
    key: 'logEvent',
    value: function logEvent(event) {
      var eventObject = buildEventObject(event, this.dimensions, this.metrics);

      // If server-side, execute universal analytics and exit
      if (this.serverTracker) {
        return this.serverTracker.event(eventObject).send();
      }

      getBrowserTrackingFunctions(function (browserTrackers) {
        browserTrackers.forEach(function (browserTracker) {
          browserTracker.send(eventObject);
        });
      });
    }
  }], [{
    key: 'load',
    value: function () {
      var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(options) {
        var ua;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                ua = void 0;

                if (!(typeof window === 'undefined')) {
                  _context.next = 12;
                  break;
                }

                _context.prev = 2;
                _context.next = 5;
                return dynamicImport(MODULE_SPECIFIER);

              case 5:
                ua = _context.sent;
                _context.next = 11;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context['catch'](2);
                throw new Error('Failed to import ' + MODULE_SPECIFIER + '. ' + _context.t0.message);

              case 11:
                options.serverTracker = getServerSideTrackingFunction(ua.default, options.trackingId);

              case 12:
                return _context.abrupt('return', new Google(options));

              case 13:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 8]]);
      }));

      function load(_x2) {
        return _ref.apply(this, arguments);
      }

      return load;
    }()
  }]);
  return Google;
}();

function getServerSideTrackingFunction(fn, trackingId) {
  if (typeof trackingId === 'undefined') {
    throw new TypeError('Google Analytics Tracking ID not provided');
  }
  return fn(trackingId);
}

function getBrowserTrackingFunctions(callback) {
  if (window.ga) {
    window.ga(function () {
      callback(window.ga.getAll());
    });
  } else {
    console.log(new Error('Google Analytics trackers not available'));
  }
}
function buildPageViewObject(page, options) {
  var dimensions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var metrics = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var standardTelemetry = {
    hitType: 'pageview',
    page: page || window.location.pathname
  };

  var mappedCustomTelemetryData = mapMetricsAndDimensions({
    customTelemetryData: options,
    dimensionLookup: dimensions,
    metricLookup: metrics
  });

  return _extends({}, standardTelemetry, mappedCustomTelemetryData);
}

function buildEventObject(event) {
  var dimensions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var metrics = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var standardTelemetryData = {
    hitType: 'event',
    eventCategory: event.category || 'none',
    eventAction: event.action,
    eventLabel: event.label
  };

  var mappedCustomTelemetryData = mapMetricsAndDimensions({
    customTelemetryData: event,
    dimensionLookup: dimensions,
    metricLookup: metrics });
  return _extends({}, standardTelemetryData, mappedCustomTelemetryData);
}

/*
(c) 2009-2013 by Jeff Mott. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions, and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions, and the following disclaimer in the documentation or other materials provided with the distribution.
Neither the name CryptoJS nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS," AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE, ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
var CryptoJS = function (h, s) {
  var f = {},
      g = f.lib = {},
      q = function q() {},
      m = g.Base = { extend: function extend(a) {
      q.prototype = this;var c = new q();a && c.mixIn(a);c.hasOwnProperty('init') || (c.init = function () {
        c.$super.init.apply(this, arguments);
      });c.init.prototype = c;c.$super = this;return c;
    }, create: function create() {
      var a = this.extend();a.init.apply(a, arguments);return a;
    }, init: function init() {}, mixIn: function mixIn(a) {
      for (var c in a) {
        a.hasOwnProperty(c) && (this[c] = a[c]);
      }a.hasOwnProperty('toString') && (this.toString = a.toString);
    }, clone: function clone() {
      return this.init.prototype.extend(this);
    } },
      r = g.WordArray = m.extend({ init: function init(a, c) {
      a = this.words = a || [];this.sigBytes = c != s ? c : 4 * a.length;
    }, toString: function toString(a) {
      return (a || k).stringify(this);
    }, concat: function concat(a) {
      var c = this.words,
          d = a.words,
          b = this.sigBytes;a = a.sigBytes;this.clamp();if (b % 4) for (var e = 0; e < a; e++) {
        c[b + e >>> 2] |= (d[e >>> 2] >>> 24 - 8 * (e % 4) & 255) << 24 - 8 * ((b + e) % 4);
      } else if (d.length > 65535) for (e = 0; e < a; e += 4) {
        c[b + e >>> 2] = d[e >>> 2];
      } else c.push.apply(c, d);this.sigBytes += a;return this;
    }, clamp: function clamp() {
      var a = this.words,
          c = this.sigBytes;a[c >>> 2] &= 4294967295 << 32 - 8 * (c % 4);a.length = h.ceil(c / 4);
    }, clone: function clone() {
      var a = m.clone.call(this);a.words = this.words.slice(0);return a;
    }, random: function random(a) {
      for (var c = [], d = 0; d < a; d += 4) {
        c.push(4294967296 * h.random() | 0);
      }return new r.init(c, a);
    } }),
      l = f.enc = {},
      k = l.Hex = { stringify: function stringify(a) {
      var c = a.words;a = a.sigBytes;for (var d = [], b = 0; b < a; b++) {
        var e = c[b >>> 2] >>> 24 - 8 * (b % 4) & 255;d.push((e >>> 4).toString(16));d.push((e & 15).toString(16));
      }return d.join('');
    }, parse: function parse(a) {
      for (var c = a.length, d = [], b = 0; b < c; b += 2) {
        d[b >>> 3] |= parseInt(a.substr(b, 2), 16) << 24 - 4 * (b % 8);
      }return new r.init(d, c / 2);
    } },
      n = l.Latin1 = { stringify: function stringify(a) {
      var c = a.words;a = a.sigBytes;for (var d = [], b = 0; b < a; b++) {
        d.push(String.fromCharCode(c[b >>> 2] >>> 24 - 8 * (b % 4) & 255));
      }return d.join('');
    }, parse: function parse(a) {
      for (var c = a.length, d = [], b = 0; b < c; b++) {
        d[b >>> 2] |= (a.charCodeAt(b) & 255) << 24 - 8 * (b % 4);
      }return new r.init(d, c);
    } },
      j = l.Utf8 = { stringify: function stringify(a) {
      try {
        return decodeURIComponent(escape(n.stringify(a)));
      } catch (c) {
        throw Error('Malformed UTF-8 data');
      }
    }, parse: function parse(a) {
      return n.parse(unescape(encodeURIComponent(a)));
    } },
      u = g.BufferedBlockAlgorithm = m.extend({ reset: function reset() {
      this._data = new r.init();this._nDataBytes = 0;
    }, _append: function _append(a) {
      typeof a === 'string' && (a = j.parse(a));this._data.concat(a);this._nDataBytes += a.sigBytes;
    }, _process: function _process(a) {
      var c = this._data,
          d = c.words,
          b = c.sigBytes,
          e = this.blockSize,
          f = b / (4 * e),
          f = a ? h.ceil(f) : h.max((f | 0) - this._minBufferSize, 0);a = f * e;b = h.min(4 * a, b);if (a) {
        for (var g = 0; g < a; g += e) {
          this._doProcessBlock(d, g);
        }g = d.splice(0, a);c.sigBytes -= b;
      }return new r.init(g, b);
    }, clone: function clone() {
      var a = m.clone.call(this);
      a._data = this._data.clone();return a;
    }, _minBufferSize: 0 });g.Hasher = u.extend({ cfg: m.extend(), init: function init(a) {
      this.cfg = this.cfg.extend(a);this.reset();
    }, reset: function reset() {
      u.reset.call(this);this._doReset();
    }, update: function update(a) {
      this._append(a);this._process();return this;
    }, finalize: function finalize(a) {
      a && this._append(a);return this._doFinalize();
    }, blockSize: 16, _createHelper: function _createHelper(a) {
      return function (c, d) {
        return new a.init(d).finalize(c);
      };
    }, _createHmacHelper: function _createHmacHelper(a) {
      return function (c, d) {
        return new t.HMAC.init(a, d).finalize(c);
      };
    } });var t = f.algo = {};return f;
}(Math);
(function (h) {
  for (var s = CryptoJS, f = s.lib, g = f.WordArray, q = f.Hasher, f = s.algo, m = [], r = [], l = function l(a) {
    return 4294967296 * (a - (a | 0)) | 0;
  }, k = 2, n = 0; n < 64;) {
    var j;a: {
      j = k;for (var u = h.sqrt(j), t = 2; t <= u; t++) {
        if (!(j % t)) {
          j = !1;break a;
        }
      }j = !0;
    }j && (n < 8 && (m[n] = l(h.pow(k, 0.5))), r[n] = l(h.pow(k, 1 / 3)), n++);k++;
  }var a = [],
      f = f.SHA256 = q.extend({ _doReset: function _doReset() {
      this._hash = new g.init(m.slice(0));
    }, _doProcessBlock: function _doProcessBlock(c, d) {
      for (var b = this._hash.words, e = b[0], f = b[1], g = b[2], j = b[3], h = b[4], m = b[5], n = b[6], q = b[7], p = 0; p < 64; p++) {
        if (p < 16) {
          a[p] = c[d + p] | 0;
        } else {
          var k = a[p - 15],
              l = a[p - 2];a[p] = ((k << 25 | k >>> 7) ^ (k << 14 | k >>> 18) ^ k >>> 3) + a[p - 7] + ((l << 15 | l >>> 17) ^ (l << 13 | l >>> 19) ^ l >>> 10) + a[p - 16];
        }k = q + ((h << 26 | h >>> 6) ^ (h << 21 | h >>> 11) ^ (h << 7 | h >>> 25)) + (h & m ^ ~h & n) + r[p] + a[p];l = ((e << 30 | e >>> 2) ^ (e << 19 | e >>> 13) ^ (e << 10 | e >>> 22)) + (e & f ^ e & g ^ f & g);q = n;n = m;m = h;h = j + k | 0;j = g;g = f;f = e;e = k + l | 0;
      }b[0] = b[0] + e | 0;b[1] = b[1] + f | 0;b[2] = b[2] + g | 0;b[3] = b[3] + j | 0;b[4] = b[4] + h | 0;b[5] = b[5] + m | 0;b[6] = b[6] + n | 0;b[7] = b[7] + q | 0;
    }, _doFinalize: function _doFinalize() {
      var a = this._data,
          d = a.words,
          b = 8 * this._nDataBytes,
          e = 8 * a.sigBytes;
      d[e >>> 5] |= 128 << 24 - e % 32;d[(e + 64 >>> 9 << 4) + 14] = h.floor(b / 4294967296);d[(e + 64 >>> 9 << 4) + 15] = b;a.sigBytes = 4 * d.length;this._process();return this._hash;
    }, clone: function clone() {
      var a = q.clone.call(this);a._hash = this._hash.clone();return a;
    } });s.SHA256 = q._createHelper(f);s.HmacSHA256 = q._createHmacHelper(f);
})(Math);
(function () {
  var h = CryptoJS,
      s = h.enc.Utf8;h.algo.HMAC = h.lib.Base.extend({ init: function init(f, g) {
      f = this._hasher = new f.init();typeof g === 'string' && (g = s.parse(g));var h = f.blockSize,
          m = 4 * h;g.sigBytes > m && (g = f.finalize(g));g.clamp();for (var r = this._oKey = g.clone(), l = this._iKey = g.clone(), k = r.words, n = l.words, j = 0; j < h; j++) {
        k[j] ^= 1549556828, n[j] ^= 909522486;
      }r.sigBytes = l.sigBytes = m;this.reset();
    }, reset: function reset() {
      var f = this._hasher;f.reset();f.update(this._iKey);
    }, update: function update(f) {
      this._hasher.update(f);return this;
    }, finalize: function finalize(f) {
      var g = this._hasher;f = g.finalize(f);g.reset();return g.finalize(this._oKey.clone().concat(f));
    } });
})();

var anonymize = function (user) {
  if (!user) return undefined;
  return CryptoJS.SHA256(user).toString(CryptoJS.enc.Hex);
};

var internalOrgs = ['esri.com', 'esriuk.com', 'esri.de', 'esri.ca', 'esrifrance.fr', 'esri.nl', 'esri-portugal.pt', 'esribulgaria.com', 'esri.fi', 'esri.kr', 'esrimalaysia.com.my', 'esri.es', 'esriaustralia.com.au', 'esri-southafrica.com', 'esri.cl', 'esrichina.com.cn', 'esri.co', 'esriturkey.com.tr', 'geodata.no', 'esriitalia.it', 'esri.pl'];

/*
 * Determines whether or not the telemetry library should be enabled based on passed in options
 */
var telemetryEnabled = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var portal = options.portal || {};

  if (options.disabled) {
    // Tracking is manually disabled
    return false;
  }

  if (hasDoNotTrackEnabled()) {
    // user's browser has turned off tracking
    return false;
  }

  if (typeof portal.eueiEnabled !== 'undefined' && portal.eueiEnabled === false) {
    // Portal does not allow tracking
    return false;
  }

  if (portal.eueiEnabled && portal.user && portal.user.orgId === portal.id) {
    // Portal allows tracking; except when user is anonymous or doesn't belong to portal's org
    return true;
  }

  if (portal.user && !portal.user.orgId && portal.ipCntryCode === 'US') {
    // Public user in the United States on a portal that allows tracking
    return true;
  }

  if (!portal.user && portal.ipCntryCode === 'US') {
    // Anonymous user in the United States on a portal that allows tracking
    return true;
  }

  if (Object.keys(portal).length > 0) {
    // Initialized with a Portal object but does not meet tracking conditions
    return false;
  }

  // Default condition not initialized with a Portal-Self object
  return true;
};

function hasDoNotTrackEnabled() {
  return (typeof navigator !== 'undefined' && navigator.doNotTrack) === '1' || typeof window !== 'undefined' && window.doNotTrack === '1';
}

var Telemetry = function () {
  function Telemetry(options) {
    classCallCheck(this, Telemetry);

    // Make sure failure to init this library cannot have side-effects
    try {
      this.trackers = [];
      this.workflows = {};
      this.test = options.test;
      this.debug = options.debug;

      this.disabled = !telemetryEnabled(options);
      if (this.disabled) console.log('Telemetry Disabled');

      if (options.portal && options.portal.user) {
        var subscriptionInfo = options.portal.subscriptionInfo || {};
        this.setUser(options.portal.user, subscriptionInfo.type);
      } else if (options.user) {
        this.setUser(options.user);
      }

      if (typeof window !== 'undefined' && !this.disabled) {
        this._initializeBrowserTrackers(options);
      }
    } catch (e) {
      console.error('Telemetry Disabled');
      console.error(e);
      this.disabled = true;
    }
  }

  // This method is used to implement telemetry.js in node


  createClass(Telemetry, [{
    key: '_initializeBrowserTrackers',
    value: function _initializeBrowserTrackers(options) {
      if (options.amazon) {
        var amazon = new Amazon(options.amazon);
        this.trackers.push(amazon);
      }

      if (options.google) {
        var google = new Google(options.google);
        this.trackers.push(google);
      }
      if (!this.trackers.length) console.error(new Error('No trackers configured'));
    }
  }, {
    key: 'setUser',
    value: function setUser() {
      var user = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var orgType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Public';

      user = typeof user === 'string' ? { username: user } : user;
      this.user = user;
      this.user.accountType = orgType;
      var internalDomain = void 0;
      if (user.email && user.email.split) {
        var domain = user.email.split('@')[1];
        internalDomain = internalOrgs.filter(function (org) {
          return domain === org;
        }).length > 0;
      }

      if (internalDomain || ['In House', 'Demo and Marketing'].indexOf(orgType) > -1) {
        this.user.internalUser = true;
      }
    }
  }, {
    key: 'logPageView',
    value: function logPageView(page) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var attributes = this.preProcess(options);
      if (this.debug) console.log('Tracking page view', JSON.stringify(attributes));
      if (this.test && !this.disabled) return attributes;
      var trackers = this.trackers.filter(function (_ref) {
        var disabled = _ref.disabled;
        return !disabled;
      });

      if (!trackers.length || this.disabled) {
        if (!this.disabled) console.error(new Error('Page view was not logged because no trackers are configured.'));
        return false;
      }

      var promises = trackers.map(function (tracker) {
        return tracker.logPageView(page, attributes);
      });

      Promise.all(promises).then();
      return true;
    }
  }, {
    key: 'logEvent',
    value: function logEvent() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var event = this.preProcess(options);

      if (this.debug) console.log('Tracking event', JSON.stringify(event));
      if (this.test) return event;
      var trackers = this.trackers.filter(function (_ref2) {
        var disabled = _ref2.disabled;
        return !disabled;
      });

      if (!trackers.length || this.disabled) {
        if (!this.disabled) console.error(new Error('Event was not logged because no trackers are configured.'));
        return false;
      }

      var promises = trackers.map(function (tracker) {
        return tracker.logEvent(event);
      });

      Promise.all(promises).then();
      return true;
    }
  }, {
    key: 'logError',
    value: function logError() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var event = _extends({ eventType: 'error' }, options);
      this.logEvent(event);
    }
  }, {
    key: 'startWorkflow',
    value: function startWorkflow(name) {
      var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var workflow = {
        name: name,
        start: Date.now(),
        steps: [],
        workflowId: Math.floor((1 + Math.random()) * 0x100000000000).toString(16)
      };
      this._saveWorkflow(workflow);
      var workflowObj = _extends({ name: name, step: 'start' }, attributes);
      this._logWorkflow(workflowObj);
      return workflow;
    }
  }, {
    key: 'stepWorkflow',
    value: function stepWorkflow(name, step) {
      var attributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var details = typeof options === 'string' ? attributes : attributes.details;
      var workflowObj = _extends({ name: name, step: step, details: details }, attributes);
      this._logWorkflow(workflowObj);
    }
  }, {
    key: 'endWorkflow',
    value: function endWorkflow(name) {
      var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var workflowObj = _extends({ name: name, step: 'finish' }, attributes);
      this._logWorkflow(workflowObj);
    }
  }, {
    key: 'cancelWorkflow',
    value: function cancelWorkflow(name) {
      var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var workflowObj = _extends({ name: name, step: 'cancel' }, attributes);
      this._logWorkflow(workflowObj);
    }
  }, {
    key: 'getWorkflow',
    value: function getWorkflow(name) {
      var workflow = Storage.get('TELEMETRY-WORKFLOW:' + name);
      // do not let old workflows be returned
      if (workflow) {
        var workflowAge = Date.now() - workflow.start;
        var timeout = 30 * 60 * 1000;
        if (workflowAge < timeout) {
          return workflow;
        } else {
          this._deleteWorkflow(workflow);
        }
      }
    }
  }, {
    key: '_saveWorkflow',
    value: function _saveWorkflow(workflow) {
      Storage.set('TELEMETRY-WORKFLOW:' + workflow.name, workflow);
    }
  }, {
    key: '_deleteWorkflow',
    value: function _deleteWorkflow(workflow) {
      Storage.delete('TELEMETRY-WORKFLOW:' + workflow.name);
    }
  }, {
    key: '_logWorkflow',
    value: function _logWorkflow() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      /*
      const workflow = {
        name: 'add layer to map',
        step: 'start',
        details: 'some details about the step'
      }
      */
      options = this.preProcess(options);
      var workflow = this.getWorkflow(options.name);
      if (!workflow) {
        this.startWorkflow(options.name);
        workflow = this.getWorkflow(options.name);
      }
      workflow.steps.push(options.step);
      workflow.duration = (Date.now() - workflow.start) / 1000;

      if (['cancel', 'finish'].indexOf(options.step) > -1) {
        this._deleteWorkflow(workflow);
      } else {
        this._saveWorkflow(workflow);
      }

      var track = _extends(options, {
        eventType: 'workflow',
        category: options.name,
        action: options.step,
        label: options.details,
        duration: workflow.duration,
        workflowId: workflow.workflowId
      });

      this.logEvent(track);
    }
  }, {
    key: 'preProcess',
    value: function preProcess() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var userOptions = {};
      if (this.user) {
        userOptions = {
          user: anonymize(this.user.username),
          org: anonymize(this.user.orgId),
          lastLogin: this.user.lastLogin,
          userSince: this.user.created,
          internalUser: this.user.internalUser || false,
          accountType: this.user.accountType
        };
      }

      return _extends({}, options, userOptions);
    }
  }, {
    key: 'disableTracker',
    value: function disableTracker(trackerName) {
      var tracker = this.trackers.find(function (_ref3) {
        var name = _ref3.name;
        return name === trackerName;
      });
      if (tracker) {
        tracker.disabled = true;
      }
    }
  }, {
    key: 'enableTracker',
    value: function enableTracker(trackerName) {
      var tracker = this.trackers.find(function (_ref4) {
        var name = _ref4.name;
        return name === trackerName;
      });
      if (tracker) {
        tracker.disabled = false;
      }
    }
  }], [{
    key: 'load',
    value: function () {
      var _ref5 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(options) {
        var telemetry, googleTracker;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                telemetry = new Telemetry(options);

                if (!(typeof window === 'undefined' && options.google)) {
                  _context.next = 6;
                  break;
                }

                _context.next = 4;
                return Google.load(options.google);

              case 4:
                googleTracker = _context.sent;

                telemetry.trackers.push(googleTracker);

              case 6:
                return _context.abrupt('return', telemetry);

              case 7:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function load(_x12) {
        return _ref5.apply(this, arguments);
      }

      return load;
    }()
  }]);
  return Telemetry;
}();

return Telemetry;

});
//# sourceMappingURL=telemetry.amd.js.map
