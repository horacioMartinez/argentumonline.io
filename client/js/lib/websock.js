/*
 * from noVNC: HTML5 VNC client
 * Copyright (C) 2012 Joel Martin
 * Licensed under MPL 2.0 (see LICENSE.txt)
 *
 * See README.md for usage and integration instructions.
 */

"use strict";
/*jslint bitwise: false, white: false */
/*global window, console, document, navigator, ActiveXObject */

// Globals defined here
var Util = {};

/*
 * Make arrays quack
 */

Array.prototype.push8 = function (num) {
    this.push(num & 0xFF);
};

Array.prototype.push16 = function (num) {
    this.push((num >> 8) & 0xFF,
        (num     ) & 0xFF);
};
Array.prototype.push32 = function (num) {
    this.push((num >> 24) & 0xFF,
        (num >> 16) & 0xFF,
        (num >> 8) & 0xFF,
        (num      ) & 0xFF);
};

// IE does not support map (even in IE9)
//This prototype is provided by the Mozilla foundation and
//is distributed under the MIT license.
//http://www.ibiblio.org/pub/Linux/LICENSES/mit.license
if (!Array.prototype.map) {
    Array.prototype.map = function (fun /*, thisp*/) {
        var len = this.length;
        if (typeof fun != "function")
            throw new TypeError();

        var res = new Array(len);
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this)
                res[i] = fun.call(thisp, this[i], i, this);
        }

        return res;
    };
}

// 
// requestAnimationFrame shim with setTimeout fallback
//

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

/* 
 * ------------------------------------------------------
 * Namespaced in Util
 * ------------------------------------------------------
 */

/*
 * Logging/debug routines
 */

Util._log_level = 'warn';
Util.init_logging = function (level) {
    if (typeof level === 'undefined') {
        level = Util._log_level;
    } else {
        Util._log_level = level;
    }
    if (typeof window.console === "undefined") {
        if (typeof window.opera !== "undefined") {
            window.console = {
                'log': window.opera.postError,
                'warn': window.opera.postError,
                'error': window.opera.postError
            };
        } else {
            window.console = {
                'log': function (m) {
                },
                'warn': function (m) {
                },
                'error': function (m) {
                }
            };
        }
    }

    Util.Debug = Util.Info = Util.Warn = Util.Error = function (msg) {
    };
    switch (level) {
        case 'debug':
            Util.Debug = function (msg) {
                console.log(msg);
            };
        case 'info':
            Util.Info = function (msg) {
                console.log(msg);
            };
        case 'warn':
            Util.Warn = function (msg) {
                console.warn(msg);
            };
        case 'error':
            Util.Error = function (msg) {
                console.error(msg);
            };
        case 'none':
            break;
        default:
            throw("invalid logging type '" + level + "'");
    }
};
Util.get_logging = function () {
    return Util._log_level;
};
// Initialize logging level
Util.init_logging();

// Set configuration default for Crockford style function namespaces
Util.conf_default = function (cfg, api, defaults, v, mode, type, defval, desc) {
    var getter, setter;

    // Default getter function
    getter = function (idx) {
        if ((type in {'arr': 1, 'array': 1}) &&
            (typeof idx !== 'undefined')) {
            return cfg[v][idx];
        } else {
            return cfg[v];
        }
    };

    // Default setter function
    setter = function (val, idx) {
        if (type in {'boolean': 1, 'bool': 1}) {
            if ((!val) || (val in {'0': 1, 'no': 1, 'false': 1})) {
                val = false;
            } else {
                val = true;
            }
        } else if (type in {'integer': 1, 'int': 1}) {
            val = parseInt(val, 10);
        } else if (type === 'str') {
            val = String(val);
        } else if (type === 'func') {
            if (!val) {
                val = function () {
                };
            }
        }
        if (typeof idx !== 'undefined') {
            cfg[v][idx] = val;
        } else {
            cfg[v] = val;
        }
    };

    // Set the description
    api[v + '_description'] = desc;

    // Set the getter function
    if (typeof api['get_' + v] === 'undefined') {
        api['get_' + v] = getter;
    }

    // Set the setter function with extra sanity checks
    if (typeof api['set_' + v] === 'undefined') {
        api['set_' + v] = function (val, idx) {
            if (mode in {'RO': 1, 'ro': 1}) {
                throw(v + " is read-only");
            } else if ((mode in {'WO': 1, 'wo': 1}) &&
                (typeof cfg[v] !== 'undefined')) {
                throw(v + " can only be set once");
            }
            setter(val, idx);
        };
    }

    // Set the default value
    if (typeof defaults[v] !== 'undefined') {
        defval = defaults[v];
    } else if ((type in {'arr': 1, 'array': 1}) &&
        (!(defval instanceof Array))) {
        defval = [];
    }
    // Coerce existing setting to the right type
    //Util.Debug("v: " + v + ", defval: " + defval + ", defaults[v]: " + defaults[v]);
    setter(defval);
};

// Set group of configuration defaults
Util.conf_defaults = function (cfg, api, defaults, arr) {
    var i;
    for (i = 0; i < arr.length; i++) {
        Util.conf_default(cfg, api, defaults, arr[i][0], arr[i][1],
            arr[i][2], arr[i][3], arr[i][4]);
    }
};

/*
 * Cross-browser routines
 */


// Dynamically load scripts without using document.write()
// Reference: http://unixpapa.com/js/dyna.html
//
// Handles the case where load_scripts is invoked from a script that
// itself is loaded via load_scripts. Once all scripts are loaded the
// window.onscriptsloaded handler is called (if set).
Util.get_include_uri = function () {
    return (typeof INCLUDE_URI !== "undefined") ? INCLUDE_URI : "include/";
}
Util._loading_scripts = [];
Util._pending_scripts = [];
Util.load_scripts = function (files) {
    var head = document.getElementsByTagName('head')[0], script,
        ls = Util._loading_scripts, ps = Util._pending_scripts;
    for (var f = 0; f < files.length; f++) {
        script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = Util.get_include_uri() + files[f];
        //console.log("loading script: " + script.src);
        script.onload = script.onreadystatechange = function (e) {
            while (ls.length > 0 && (ls[0].readyState === 'loaded' ||
            ls[0].readyState === 'complete')) {
                // For IE, append the script to trigger execution
                var s = ls.shift();
                //console.log("loaded script: " + s.src);
                head.appendChild(s);
            }
            if (!this.readyState ||
                (Util.Engine.presto && this.readyState === 'loaded') ||
                this.readyState === 'complete') {
                if (ps.indexOf(this) >= 0) {
                    this.onload = this.onreadystatechange = null;
                    //console.log("completed script: " + this.src);
                    ps.splice(ps.indexOf(this), 1);

                    // Call window.onscriptsload after last script loads
                    if (ps.length === 0 && window.onscriptsload) {
                        window.onscriptsload();
                    }
                }
            }
        };
        // In-order script execution tricks
        if (Util.Engine.trident) {
            // For IE wait until readyState is 'loaded' before
            // appending it which will trigger execution
            // http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
            ls.push(script);
        } else {
            // For webkit and firefox set async=false and append now
            // https://developer.mozilla.org/en-US/docs/HTML/Element/script
            script.async = false;
            head.appendChild(script);
        }
        ps.push(script);
    }
}

// Get DOM element position on page
Util.getPosition = function (obj) {
    var x = 0, y = 0;
    if (obj.offsetParent) {
        do {
            x += obj.offsetLeft;
            y += obj.offsetTop;
            obj = obj.offsetParent;
        } while (obj);
    }
    return {'x': x, 'y': y};
};

// Get mouse event position in DOM element
Util.getEventPosition = function (e, obj, scale) {
    var evt, docX, docY, pos;
    //if (!e) evt = window.event;
    evt = (e ? e : window.event);
    evt = (evt.changedTouches ? evt.changedTouches[0] : evt.touches ? evt.touches[0] : evt);
    if (evt.pageX || evt.pageY) {
        docX = evt.pageX;
        docY = evt.pageY;
    } else if (evt.clientX || evt.clientY) {
        docX = evt.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft;
        docY = evt.clientY + document.body.scrollTop +
            document.documentElement.scrollTop;
    }
    pos = Util.getPosition(obj);
    if (typeof scale === "undefined") {
        scale = 1;
    }
    return {'x': (docX - pos.x) / scale, 'y': (docY - pos.y) / scale};
};

// Event registration. Based on: http://www.scottandrew.com/weblog/articles/cbs-events
Util.addEvent = function (obj, evType, fn) {
    if (obj.attachEvent) {
        var r = obj.attachEvent("on" + evType, fn);
        return r;
    } else if (obj.addEventListener) {
        obj.addEventListener(evType, fn, false);
        return true;
    } else {
        throw("Handler could not be attached");
    }
};

Util.removeEvent = function (obj, evType, fn) {
    if (obj.detachEvent) {
        var r = obj.detachEvent("on" + evType, fn);
        return r;
    } else if (obj.removeEventListener) {
        obj.removeEventListener(evType, fn, false);
        return true;
    } else {
        throw("Handler could not be removed");
    }
};

Util.stopEvent = function (e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    else {
        e.cancelBubble = true;
    }

    if (e.preventDefault) {
        e.preventDefault();
    }
    else {
        e.returnValue = false;
    }
};

// Set browser engine versions. Based on mootools.
Util.Features = {xpath: !!(document.evaluate), air: !!(window.runtime), query: !!(document.querySelector)};

Util.Engine = {
    // Version detection break in Opera 11.60 (errors on arguments.callee.caller reference)
    //'presto': (function() {
    //         return (!window.opera) ? false : ((arguments.callee.caller) ? 960 : ((document.getElementsByClassName) ? 950 : 925)); }()),
    'presto': (function () {
        return (!window.opera) ? false : true;
    }()),

    'trident': (function () {
        return (!window.ActiveXObject) ? false : ((window.XMLHttpRequest) ? ((document.querySelectorAll) ? 6 : 5) : 4);
    }()),
    'webkit': (function () {
        try {
            return (navigator.taintEnabled) ? false : ((Util.Features.xpath) ? ((Util.Features.query) ? 525 : 420) : 419);
        } catch (e) {
            return false;
        }
    }()),
    //'webkit': (function() {
    //        return ((typeof navigator.taintEnabled !== "unknown") && navigator.taintEnabled) ? false : ((Util.Features.xpath) ? ((Util.Features.query) ? 525 : 420) : 419); }()),
    'gecko': (function () {
        return (!document.getBoxObjectFor && window.mozInnerScreenX == null) ? false : ((document.getElementsByClassName) ? 19 : 18);
    }())
};
if (Util.Engine.webkit) {
    // Extract actual webkit version if available
    Util.Engine.webkit = (function (v) {
        var re = new RegExp('WebKit/([0-9\.]*) ');
        v = (navigator.userAgent.match(re) || ['', v])[1];
        return parseFloat(v, 10);
    })(Util.Engine.webkit);
}

Util.Flash = (function () {
    var v, version;
    try {
        v = navigator.plugins['Shockwave Flash'].description;
    } catch (err1) {
        try {
            v = new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version');
        } catch (err2) {
            v = '0 r0';
        }
    }
    version = v.match(/\d+/g);
    return {version: parseInt(version[0] || 0 + '.' + version[1], 10) || 0, build: parseInt(version[2], 10) || 0};
}());

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// From: http://hg.mozilla.org/mozilla-central/raw-file/ec10630b1a54/js/src/devtools/jint/sunspider/string-base64.js

/*jslint white: false, bitwise: false, plusplus: false */
/*global console */

var Base64 = {

    /* Convert data (an array of integers) to a Base64 string. */
    toBase64Table: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split(''),
    base64Pad: '=',

    encode: function (data) {
        "use strict";
        var result = '';
        var toBase64Table = Base64.toBase64Table;
        var base64Pad = Base64.base64Pad;
        var length = data.length;
        var i;
        // Convert every three bytes to 4 ascii characters.
        /* BEGIN LOOP */
        for (i = 0; i < (length - 2); i += 3) {
            result += toBase64Table[data[i] >> 2];
            result += toBase64Table[((data[i] & 0x03) << 4) + (data[i + 1] >> 4)];
            result += toBase64Table[((data[i + 1] & 0x0f) << 2) + (data[i + 2] >> 6)];
            result += toBase64Table[data[i + 2] & 0x3f];
        }
        /* END LOOP */

        // Convert the remaining 1 or 2 bytes, pad out to 4 characters.
        if (length % 3) {
            i = length - (length % 3);
            result += toBase64Table[data[i] >> 2];
            if ((length % 3) === 2) {
                result += toBase64Table[((data[i] & 0x03) << 4) + (data[i + 1] >> 4)];
                result += toBase64Table[(data[i + 1] & 0x0f) << 2];
                result += base64Pad;
            } else {
                result += toBase64Table[(data[i] & 0x03) << 4];
                result += base64Pad + base64Pad;
            }
        }

        return result;
    },

    /* Convert Base64 data to a string */
    toBinaryTable: [
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 0, -1, -1,
        -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
        -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
    ],

    decode: function (data, offset) {
        "use strict";
        offset = typeof(offset) !== 'undefined' ? offset : 0;
        var toBinaryTable = Base64.toBinaryTable;
        var base64Pad = Base64.base64Pad;
        var result, result_length, idx, i, c, padding;
        var leftbits = 0; // number of bits decoded, but yet to be appended
        var leftdata = 0; // bits decoded, but yet to be appended
        var data_length = data.indexOf('=') - offset;

        if (data_length < 0) {
            data_length = data.length - offset;
        }

        /* Every four characters is 3 resulting numbers */
        result_length = (data_length >> 2) * 3 + Math.floor((data_length % 4) / 1.5);
        result = new Array(result_length);

        // Convert one by one.
        /* BEGIN LOOP */
        for (idx = 0, i = offset; i < data.length; i++) {
            c = toBinaryTable[data.charCodeAt(i) & 0x7f];
            padding = (data.charAt(i) === base64Pad);
            // Skip illegal characters and whitespace
            if (c === -1) {
                console.error("Illegal character code " + data.charCodeAt(i) + " at position " + i);
                continue;
            }

            // Collect data into leftdata, update bitcount
            leftdata = (leftdata << 6) | c;
            leftbits += 6;

            // If we have 8 or more bits, append 8 bits to the result
            if (leftbits >= 8) {
                leftbits -= 8;
                // Append if not padding.
                if (!padding) {
                    result[idx++] = (leftdata >> leftbits) & 0xff;
                }
                leftdata &= (1 << leftbits) - 1;
            }
        }
        /* END LOOP */

        // If there are any bits left, the base64 string was corrupted
        if (leftbits) {
            throw {
                name: 'Base64-Error',
                message: 'Corrupted base64 string'
            };
        }

        return result;
    }

};
/* End of Base64 namespace */






/*
 * Websock: high-performance binary WebSockets
 * Copyright (C) 2012 Joel Martin
 * Licensed under MPL 2.0 (see LICENSE.txt)
 *
 * Websock is similar to the standard WebSocket object but Websock
 * enables communication with raw TCP sockets (i.e. the binary stream)
 * via websockify. This is accomplished by base64 encoding the data
 * stream between Websock and websockify.
 *
 * Websock has built-in receive queue buffering; the message event
 * does not contain actual data but is simply a notification that
 * there is new data available. Several rQ* methods are available to
 * read binary data off of the receive queue.
 */

/*jslint browser: true, bitwise: false, plusplus: false */
/*global Util, Base64 */


// Load Flash WebSocket emulator if needed

// To force WebSocket emulator even when native WebSocket available
//window.WEB_SOCKET_FORCE_FLASH = true;
// To enable WebSocket emulator debug:
//window.WEB_SOCKET_DEBUG=1;
var Websock_native = {}
if (window.WebSocket && !window.WEB_SOCKET_FORCE_FLASH) {
    Websock_native = true;
} else if (window.MozWebSocket && !window.WEB_SOCKET_FORCE_FLASH) {
    Websock_native = true;
    window.WebSocket = window.MozWebSocket;
} else {
    /* no builtin WebSocket so load web_socket.js */

    Websock_native = false;
    (function () {
        window.WEB_SOCKET_SWF_LOCATION = Util.get_include_uri() +
            "web-socket-js/WebSocketMain.swf";
        if (Util.Engine.trident) {
            Util.Debug("Forcing uncached load of WebSocketMain.swf");
            window.WEB_SOCKET_SWF_LOCATION += "?" + Math.random();
        }
        Util.load_scripts(["web-socket-js/swfobject.js",
            "web-socket-js/web_socket.js"]);
    }());
}

function Websock() {
    "use strict";

    var api = {},         // Public API
        websocket = null, // WebSocket object
        mode = 'base64',  // Current WebSocket mode: 'binary', 'base64'
        rQ = [],          // Receive queue
        rQi = 0,          // Receive queue index
        rQmax = 10000,    // Max receive queue size before compacting
        sQ = [],          // Send queue

        eventHandlers = {
            'message': function () {
            },
            'open': function () {
            },
            'close': function () {
            },
            'error': function () {
            }
        },

        test_mode = false;

//
// Queue public functions
//

    function get_sQ() {
        return sQ;
    }

    function get_rQ() {
        return rQ;
    }

    function get_rQi() {
        return rQi;
    }

    function set_rQi(val) {
        rQi = val;
    }

    function rQlen() {
        return rQ.length - rQi;
    }

    function rQpeek8() {
        return (rQ[rQi]      );
    }

    function rQshift8() {
        return (rQ[rQi++]      );
    }

    function rQunshift8(num) {
        if (rQi === 0) {
            rQ.unshift(num);
        } else {
            rQi -= 1;
            rQ[rQi] = num;
        }

    }

    /* Modificadas para que lea los numeros en little endian (horacio) */

    function rQshift16() {
        return (rQ[rQi++]      ) +
            (rQ[rQi++] << 8 );
    }

    function rQshift32() {
        return (rQ[rQi++]) +
            (rQ[rQi++] << 8) +
            (rQ[rQi++] << 16) +
            (rQ[rQi++] << 24);
    }

    function rQshiftStr(len) {
        if (typeof(len) === 'undefined') {
            len = rQlen();
        }
        var arr = rQ.slice(rQi, rQi + len);
        rQi += len;
        return String.fromCharCode.apply(null, arr);
    }

    function rQshiftBytes(len) {
        if (typeof(len) === 'undefined') {
            len = rQlen();
        }
        rQi += len;
        return rQ.slice(rQi - len, rQi);
    }

    function rQslice(start, end) {
        if (end) {
            return rQ.slice(rQi + start, rQi + end);
        } else {
            return rQ.slice(rQi + start);
        }
    }

// Check to see if we must wait for 'num' bytes (default to FBU.bytes)
// to be available in the receive queue. Return true if we need to
// wait (and possibly print a debug message), otherwise false.
    function rQwait(msg, num, goback) {
        var rQlen = rQ.length - rQi; // Skip rQlen() function call
        if (rQlen < num) {
            if (goback) {
                if (rQi < goback) {
                    throw("rQwait cannot backup " + goback + " bytes");
                }
                rQi -= goback;
            }
            //Util.Debug("   waiting for " + (num-rQlen) +
            //           " " + msg + " byte(s)");
            return true;  // true means need more data
        }
        return false;
    }

//
// Private utility routines
//

    function encode_message() {
        if (mode === 'binary') {
            // Put in a binary arraybuffer
            return (new Uint8Array(sQ)).buffer;
        } else {
            // base64 encode
            return Base64.encode(sQ);
        }
    }

    function decode_message(data) {
        //Util.Debug(">> decode_message: " + data);
        if (mode === 'binary') {
            // push arraybuffer values onto the end
            var u8 = new Uint8Array(data);
            for (var i = 0; i < u8.length; i++) {
                rQ.push(u8[i]);
            }
        } else {
            // base64 decode and concat to the end
            rQ = rQ.concat(Base64.decode(data, 0));
        }
        //Util.Debug(">> decode_message, rQ: " + rQ);
    }

//
// Public Send functions
//

    function flush() {
        if (websocket.bufferedAmount !== 0) {
            Util.Debug("bufferedAmount: " + websocket.bufferedAmount);
        }
        if (websocket.bufferedAmount < api.maxBufferedAmount) {
            //Util.Debug("arr: " + arr);
            //Util.Debug("sQ: " + sQ);
            if (sQ.length > 0) {
                websocket.send(encode_message(sQ));
                sQ = [];
            }
            return true;
        } else {
            Util.Info("Delaying send, bufferedAmount: " +
                websocket.bufferedAmount);
            return false;
        }
    }

// overridable for testing
    function send(arr) {
        //Util.Debug(">> send_array: " + arr);
        sQ = sQ.concat(arr);
        return flush();
    }

    function send_string(str) {
        //Util.Debug(">> send_string: " + str);
        api.send(str.split('').map(
            function (chr) {
                return chr.charCodeAt(0);
            }));
    }

//
// Other public functions

    function recv_message(e) {
        //Util.Debug(">> recv_message: " + e.data.length);

        try {
            decode_message(e.data);
            if (rQlen() > 0) {
                eventHandlers.message();
                // Compact the receive queue
                if (rQ.length > rQmax) {
                    //Util.Debug("Compacting receive queue");
                    rQ = rQ.slice(rQi);
                    rQi = 0;
                }
            } else {
                Util.Debug("Ignoring empty message");
            }
        } catch (exc) {
            if (typeof exc.stack !== 'undefined') {
                Util.Warn("recv_message, caught exception: " + exc.stack);
            } else if (typeof exc.description !== 'undefined') {
                Util.Warn("recv_message, caught exception: " + exc.description);
            } else {
                Util.Warn("recv_message, caught exception:" + exc);
            }
            if (typeof exc.name !== 'undefined') {
                eventHandlers.error(exc.name + ": " + exc.message);
            } else {
                eventHandlers.error(exc);
            }
        }
        //Util.Debug("<< recv_message");
    }

// Set event handlers
    function on(evt, handler) {
        eventHandlers[evt] = handler;
    }

    function init(protocols, ws_schema) {
        rQ = [];
        rQi = 0;
        sQ = [];
        websocket = null;

        var bt = false,
            wsbt = false,
            try_binary = false;

        // Check for full typed array support
        if (('Uint8Array' in window) &&
            ('set' in Uint8Array.prototype)) {
            bt = true;
        }
        // Check for full binary type support in WebSocket
        // Inspired by:
        // https://github.com/Modernizr/Modernizr/issues/370
        // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/websockets/binary.js
        try {
            if (bt && ('binaryType' in WebSocket.prototype || !!(new WebSocket(ws_schema + '://.').binaryType))) {
                Util.Info("Detected binaryType support in WebSockets");
                wsbt = true;
            }
        } catch (exc) {
            // Just ignore failed test localhost connections
        }

        // Default protocols if not specified
        if (typeof(protocols) === "undefined") {
            if (wsbt) {
                protocols = ['binary', 'base64'];
            } else {
                protocols = 'base64';
            }
        }

        // If no binary support, make sure it was not requested
        if (!wsbt) {
            if (protocols === 'binary') {
                throw("WebSocket binary sub-protocol requested but not supported");
            }
            if (typeof(protocols) === "object") {
                var new_protocols = [];
                for (var i = 0; i < protocols.length; i++) {
                    if (protocols[i] === 'binary') {
                        Util.Error("Skipping unsupported WebSocket binary sub-protocol");
                    } else {
                        new_protocols.push(protocols[i]);
                    }
                }
                if (new_protocols.length > 0) {
                    protocols = new_protocols;
                } else {
                    throw("Only WebSocket binary sub-protocol was requested and not supported.");
                }
            }
        }

        return protocols;
    }

    function open(uri, protocols) {
        var ws_schema = uri.match(/^([a-z]+):\/\//)[1];
        protocols = init(protocols, ws_schema);

        if (test_mode) {
            websocket = {};
        } else {
            websocket = new WebSocket(uri, protocols);
            if (protocols.indexOf('binary') >= 0) {
                websocket.binaryType = 'arraybuffer';
            }
        }

        websocket.onmessage = recv_message;
        websocket.onopen = function () {
            Util.Debug(">> WebSock.onopen");
            if (websocket.protocol) {
                mode = websocket.protocol;
                Util.Info("Server chose sub-protocol: " + websocket.protocol);
            } else {
                mode = 'base64';
                Util.Error("Server select no sub-protocol!: " + websocket.protocol);
            }
            eventHandlers.open();
            Util.Debug("<< WebSock.onopen");
        };
        websocket.onclose = function (e) {
            Util.Debug(">> WebSock.onclose");
            eventHandlers.close(e);
            Util.Debug("<< WebSock.onclose");
        };
        websocket.onerror = function (e) {
            Util.Debug(">> WebSock.onerror: " + e);
            eventHandlers.error(e);
            Util.Debug("<< WebSock.onerror");
        };
    }

    function close() {
        if (websocket) {
            if ((websocket.readyState === WebSocket.OPEN) ||
                (websocket.readyState === WebSocket.CONNECTING)) {
                Util.Info("Closing WebSocket connection");
                websocket.close();
            }
            websocket.onmessage = function (e) {
                return;
            };
        }
    }

// Override internal functions for testing
// Takes a send function, returns reference to recv function
    function testMode(override_send, data_mode) {
        test_mode = true;
        mode = data_mode;
        api.send = override_send;
        api.close = function () {
        };
        return recv_message;
    }

    function constructor() {
        // Configuration settings
        api.maxBufferedAmount = 200;

        // Direct access to send and receive queues
        api.get_sQ = get_sQ;
        api.get_rQ = get_rQ;
        api.get_rQi = get_rQi;
        api.set_rQi = set_rQi;

        // Routines to read from the receive queue
        api.rQlen = rQlen;
        api.rQpeek8 = rQpeek8;
        api.rQshift8 = rQshift8;
        api.rQunshift8 = rQunshift8;
        api.rQshift16 = rQshift16;
        api.rQshift32 = rQshift32;
        api.rQshiftStr = rQshiftStr;
        api.rQshiftBytes = rQshiftBytes;
        api.rQslice = rQslice;
        api.rQwait = rQwait;

        api.flush = flush;
        api.send = send;
        api.send_string = send_string;

        api.on = on;
        api.init = init;
        api.open = open;
        api.close = close;
        api.testMode = testMode;

        return api;
    }

    return constructor();

}
