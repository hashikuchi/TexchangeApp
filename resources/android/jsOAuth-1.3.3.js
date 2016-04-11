var exports = exports || this;

exports.OAuth = function(global) {
    function Collection(obj) {
        var i, args = arguments, args_callee = args.callee, collection = (args.length, this);
        if (!(this instanceof args_callee)) return new args_callee(obj);
        for (i in obj) obj.hasOwnProperty(i) && (collection[i] = obj[i]);
        return collection;
    }
    function Hash() {}
    function URI(url) {
        var parsed_uri, scheme, host, port, path, query, anchor, args = arguments, args_callee = args.callee, parser = /^([^:\/?#]+?:\/\/)*([^\/:?#]*)?(:[^\/?#]*)*([^?#]*)(\?[^#]*)?(#(.*))*/, uri = this;
        if (!(this instanceof args_callee)) return new args_callee(url);
        uri.scheme = "";
        uri.host = "";
        uri.port = "";
        uri.path = "";
        uri.query = new QueryString();
        uri.anchor = "";
        if (null !== url) {
            parsed_uri = url.match(parser);
            scheme = parsed_uri[1];
            host = parsed_uri[2];
            port = parsed_uri[3];
            path = parsed_uri[4];
            query = parsed_uri[5];
            anchor = parsed_uri[6];
            scheme = void 0 !== scheme ? scheme.replace("://", "").toLowerCase() : "http";
            port = port ? port.replace(":", "") : "https" === scheme ? "443" : "80";
            scheme = "http" == scheme && "443" === port ? "https" : scheme;
            query = query ? query.replace("?", "") : "";
            anchor = anchor ? anchor.replace("#", "") : "";
            ("https" === scheme && "443" !== port || "http" === scheme && "80" !== port) && (host = host + ":" + port);
            uri.scheme = scheme;
            uri.host = host;
            uri.port = port;
            uri.path = path || "/";
            uri.query.setQueryParams(query);
            uri.anchor = anchor || "";
        }
    }
    function QueryString(obj) {
        var i, args = arguments, args_callee = args.callee, querystring = (args.length, 
        this);
        if (!(this instanceof args_callee)) return new args_callee(obj);
        if (void 0 != obj) for (i in obj) obj.hasOwnProperty(i) && (querystring[i] = obj[i]);
        return querystring;
    }
    function OAuth(options) {
        if (!(this instanceof OAuth)) return new OAuth(options);
        return this.init(options);
    }
    function toHeaderString(params) {
        var i, realm, arr = [];
        for (i in params) params[i] && void 0 !== params[i] && "" !== params[i] && ("realm" === i ? realm = i + '="' + params[i] + '"' : arr.push(i + '="' + OAuth.urlEncode(params[i] + "") + '"'));
        arr.sort();
        realm && arr.unshift(realm);
        return arr.join(", ");
    }
    function toSignatureBaseString(method, url, header_params, query_params) {
        var i, arr = [], encode = OAuth.urlEncode;
        for (i in header_params) void 0 !== header_params[i] && "" !== header_params[i] && arr.push([ OAuth.urlEncode(i), OAuth.urlEncode(header_params[i] + "") ]);
        for (i in query_params) void 0 !== query_params[i] && "" !== query_params[i] && (header_params[i] || arr.push([ encode(i), encode(query_params[i] + "") ]));
        arr = arr.sort(function(a, b) {
            return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0;
        }).map(function(el) {
            return el.join("=");
        });
        return [ method, encode(url), encode(arr.join("&")) ].join("&");
    }
    function getTimestamp() {
        return parseInt(+new Date() / 1e3, 10);
    }
    function getNonce(key_length) {
        function rand() {
            return Math.floor(Math.random() * chars.length);
        }
        key_length = key_length || 64;
        var i, key_bytes = key_length / 8, value = "", key_iter = key_bytes / 4, key_remainder = key_bytes % 4, chars = [ "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2A", "2B", "2C", "2D", "2E", "2F", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3A", "3B", "3C", "3D", "3E", "3F", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4A", "4B", "4C", "4D", "4E", "4F", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5A", "5B", "5C", "5D", "5E", "5F", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6A", "6B", "6C", "6D", "6E", "6F", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7A", "7B", "7C", "7D", "7E" ];
        for (i = 0; key_iter > i; i++) value += chars[rand()] + chars[rand()] + chars[rand()] + chars[rand()];
        for (i = 0; key_remainder > i; i++) value += chars[rand()];
        return value;
    }
    function Request() {
        var XHR;
        XHR = "undefined" != typeof global.Titanium && "undefined" != typeof global.Titanium.Network.createHTTPClient ? global.Titanium.Network.createHTTPClient() : "undefined" != typeof require ? new require("xhr").XMLHttpRequest() : new global.XMLHttpRequest();
        return XHR;
    }
    function zeroPad(length) {
        var arr = new Array(++length);
        return arr.join(0).split("");
    }
    function stringToByteArray(str) {
        var code, i, bytes = [];
        for (i = 0; i < str.length; i++) {
            code = str.charCodeAt(i);
            128 > code ? bytes.push(code) : 2048 > code ? bytes.push(192 + (code >> 6), 128 + (63 & code)) : 65536 > code ? bytes.push(224 + (code >> 12), 128 + (code >> 6 & 63), 128 + (63 & code)) : 2097152 > code && bytes.push(240 + (code >> 18), 128 + (code >> 12 & 63), 128 + (code >> 6 & 63), 128 + (63 & code));
        }
        return bytes;
    }
    function wordsToByteArray(words) {
        var i, bytes = [];
        for (i = 0; i < 32 * words.length; i += 8) bytes.push(words[i >>> 5] >>> 24 - i % 32 & 255);
        return bytes;
    }
    function byteArrayToHex(byteArray) {
        var i, hex = [], l = byteArray.length;
        for (i = 0; l > i; i++) {
            hex.push((byteArray[i] >>> 4).toString(16));
            hex.push((15 & byteArray[i]).toString(16));
        }
        return hex.join("");
    }
    function byteArrayToString(byteArray) {
        var i, string = "", l = byteArray.length;
        for (i = 0; l > i; i++) string += String.fromCharCode(byteArray[i]);
        return string;
    }
    function leftrotate(value, shift) {
        return value << shift | value >>> 32 - shift;
    }
    function SHA1(message) {
        if (void 0 !== message) {
            var crypto, digest, m = message;
            m.constructor === String && (m = stringToByteArray(m));
            crypto = this instanceof SHA1 ? this : new SHA1(message);
            digest = crypto.hash(m);
            return byteArrayToHex(digest);
        }
        if (!(this instanceof SHA1)) return new SHA1();
        return this;
    }
    function HMAC(fn, key, message, toHex) {
        var byteArray, oPad, iPad, i, k = stringToByteArray(key), m = stringToByteArray(message), l = k.length;
        if (l > fn.blocksize) {
            k = fn.hash(k);
            l = k.length;
        }
        k = k.concat(zeroPad(fn.blocksize - l));
        oPad = k.slice(0);
        iPad = k.slice(0);
        for (i = 0; i < fn.blocksize; i++) {
            oPad[i] ^= 92;
            iPad[i] ^= 54;
        }
        byteArray = fn.hash(oPad.concat(fn.hash(iPad.concat(m))));
        if (toHex) return byteArrayToHex(byteArray);
        return byteArrayToString(byteArray);
    }
    Hash.prototype = {
        join: function(string) {
            string = string || "";
            return this.values().join(string);
        },
        keys: function() {
            var i, arr = [], self = this;
            for (i in self) self.hasOwnProperty(i) && arr.push(i);
            return arr;
        },
        values: function() {
            var i, arr = [], self = this;
            for (i in self) self.hasOwnProperty(i) && arr.push(self[i]);
            return arr;
        },
        shift: function() {
            throw "not implimented";
        },
        unshift: function() {
            throw "not implimented";
        },
        push: function() {
            throw "not implimented";
        },
        pop: function() {
            throw "not implimented";
        },
        sort: function() {
            throw "not implimented";
        },
        ksort: function(func) {
            var i, value, key, self = this, keys = self.keys();
            void 0 == func ? keys.sort() : keys.sort(func);
            for (i = 0; i < keys.length; i++) {
                key = keys[i];
                value = self[key];
                delete self[key];
                self[key] = value;
            }
            return self;
        },
        toObject: function() {
            var i, obj = {}, self = this;
            for (i in self) self.hasOwnProperty(i) && (obj[i] = self[i]);
            return obj;
        }
    };
    Collection.prototype = new Hash();
    URI.prototype = {
        scheme: "",
        host: "",
        port: "",
        path: "",
        query: "",
        anchor: "",
        toString: function() {
            var self = this, query = self.query + "";
            return self.scheme + "://" + self.host + self.path + ("" != query ? "?" + query : "") + ("" !== self.anchor ? "#" + self.anchor : "");
        }
    };
    QueryString.prototype = new Collection();
    QueryString.prototype.toString = function() {
        var i, self = this, q_arr = [], ret = "", val = "", encode = OAuth.urlEncode;
        self.ksort();
        for (i in self) if (self.hasOwnProperty(i) && void 0 != i && void 0 != self[i]) {
            val = encode(i) + "=" + encode(self[i]);
            q_arr.push(val);
        }
        q_arr.length > 0 && (ret = q_arr.join("&"));
        return ret;
    };
    QueryString.prototype.setQueryParams = function(query) {
        var i, query_array, query_array_length, key_value, args = arguments, args_length = args.length, querystring = this;
        if (1 == args_length) {
            if ("object" == typeof query) for (i in query) query.hasOwnProperty(i) && (querystring[i] = query[i]); else if ("string" == typeof query) {
                query_array = query.split("&");
                for (i = 0, query_array_length = query_array.length; query_array_length > i; i++) {
                    key_value = query_array[i].split("=");
                    querystring[key_value[0]] = key_value[1];
                }
            }
        } else for (i = 0; arg_length > i; i += 2) querystring[args[i]] = args[i + 1];
    };
    var OAUTH_VERSION_1_0 = "1.0";
    OAuth.prototype = {
        realm: "",
        requestTokenUrl: "",
        authorizationUrl: "",
        accessTokenUrl: "",
        init: function(options) {
            var empty = "";
            var oauth = {
                enablePrivilege: options.enablePrivilege || false,
                callbackUrl: options.callbackUrl || "oob",
                consumerKey: options.consumerKey,
                consumerSecret: options.consumerSecret,
                accessTokenKey: options.accessTokenKey || empty,
                accessTokenSecret: options.accessTokenSecret || empty,
                verifier: empty,
                signatureMethod: options.signatureMethod || "HMAC-SHA1"
            };
            this.realm = options.realm || empty;
            this.requestTokenUrl = options.requestTokenUrl || empty;
            this.authorizationUrl = options.authorizationUrl || empty;
            this.accessTokenUrl = options.accessTokenUrl || empty;
            this.getAccessToken = function() {
                return [ oauth.accessTokenKey, oauth.accessTokenSecret ];
            };
            this.getAccessTokenKey = function() {
                return oauth.accessTokenKey;
            };
            this.getAccessTokenSecret = function() {
                return oauth.accessTokenSecret;
            };
            this.getAccessConsumerKey = function() {
                return oauth.consumerKey;
            };
            this.getAccessConsumerSecret = function() {
                return oauth.consumerSecret;
            };
            this.setAccessToken = function(tokenArray, tokenSecret) {
                tokenSecret && (tokenArray = [ tokenArray, tokenSecret ]);
                oauth.accessTokenKey = tokenArray[0];
                oauth.accessTokenSecret = tokenArray[1];
            };
            this.getVerifier = function() {
                return oauth.verifier;
            };
            this.setVerifier = function(verifier) {
                oauth.verifier = verifier;
            };
            this.setCallbackUrl = function(url) {
                oauth.callbackUrl = url;
            };
            this.request = function(options) {
                var method, url, data, headers, success, failure, xhr, i, headerParams, signatureMethod, signatureString, signature, appendQueryString, params, withFile, query = [], signatureData = {};
                method = options.method || "GET";
                url = URI(options.url);
                data = options.data || {};
                headers = options.headers || {};
                success = options.success || function() {};
                failure = options.failure || function() {};
                withFile = function() {
                    var hasFile = false;
                    for (var name in data) "undefined" != typeof data[name].fileName && (hasFile = true);
                    return hasFile;
                }();
                appendQueryString = options.appendQueryString ? options.appendQueryString : false;
                oauth.enablePrivilege && netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead UniversalBrowserWrite");
                xhr = Request();
                xhr.onreadystatechange = function() {
                    if (4 === xhr.readyState) {
                        var match, regex = /^(.*?):\s*(.*?)\r?$/gm, requestHeaders = headers, responseHeaders = {}, responseHeadersString = "";
                        if (!xhr.getAllResponseHeaders) {
                            if (!!xhr.getResponseHeaders) {
                                responseHeadersString = xhr.getResponseHeaders();
                                for (var i = 0, len = responseHeadersString.length; len > i; ++i) responseHeaders[responseHeadersString[i][0]] = responseHeadersString[i][1];
                            }
                        } else {
                            responseHeadersString = xhr.getAllResponseHeaders();
                            while (match = regex.exec(responseHeadersString)) responseHeaders[match[1]] = match[2];
                        }
                        var includeXML = false;
                        "Content-Type" in responseHeaders && "text/xml" == responseHeaders["Content-Type"] && (includeXML = true);
                        var responseObject = {
                            text: xhr.responseText,
                            xml: includeXML ? xhr.responseXML : "",
                            requestHeaders: requestHeaders,
                            responseHeaders: responseHeaders
                        };
                        xhr.status >= 200 && xhr.status <= 226 || 304 == xhr.status || 0 === xhr.status ? success(responseObject) : xhr.status >= 400 && 0 !== xhr.status && failure(responseObject);
                        if ("undefined" != typeof global.Titanium) {
                            xhr.onerror = null;
                            xhr.onload = null;
                            xhr.onreadystatechange = null;
                            xhr.ondatastream = null;
                            xhr = null;
                        }
                    }
                };
                headerParams = {
                    oauth_callback: oauth.callbackUrl,
                    oauth_consumer_key: oauth.consumerKey,
                    oauth_nonce: getNonce(),
                    oauth_signature_method: oauth.signatureMethod,
                    oauth_timestamp: getTimestamp(),
                    oauth_token: oauth.accessTokenKey,
                    oauth_verifier: oauth.verifier,
                    oauth_version: OAUTH_VERSION_1_0
                };
                signatureMethod = oauth.signatureMethod;
                if (!("Content-Type" in headers && "application/x-www-form-urlencoded" != headers["Content-Type"] || withFile)) {
                    params = url.query.toObject();
                    for (i in params) signatureData[i] = params[i];
                    for (i in data) signatureData[i] = data[i];
                }
                urlString = url.scheme + "://" + url.host + url.path;
                signatureString = toSignatureBaseString(method, urlString, headerParams, signatureData);
                signature = OAuth.signatureMethod[signatureMethod](oauth.consumerSecret, oauth.accessTokenSecret, signatureString);
                headerParams.oauth_signature = signature;
                this.realm && (headerParams["realm"] = this.realm);
                if (appendQueryString || "GET" == method) {
                    url.query.setQueryParams(data);
                    query = null;
                } else if (withFile) {
                    if (withFile) {
                        query = new FormData();
                        for (i in data) query.append(i, data[i]);
                    }
                } else if ("string" == typeof data) {
                    query = data;
                    "Content-Type" in headers || (headers["Content-Type"] = "text/plain");
                } else if ("undefined" != typeof global.Titanium) query = data; else {
                    for (i in data) query.push(OAuth.urlEncode(i) + "=" + OAuth.urlEncode(data[i] + ""));
                    query = query.sort().join("&");
                    "Content-Type" in headers || (headers["Content-Type"] = "application/x-www-form-urlencoded");
                }
                xhr.open(method, url + "", true);
                "Content-Type" in headers && "undefined" != typeof global.Titanium && "android" === global.Titanium.Platform.osname && delete headers["Content-Type"];
                "Authorization" in headers || xhr.setRequestHeader("Authorization", "OAuth " + toHeaderString(headerParams));
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                for (i in headers) xhr.setRequestHeader(i, headers[i]);
                xhr.send(query);
            };
            return this;
        },
        get: function(url, success, failure) {
            this.request({
                url: url,
                success: success,
                failure: failure
            });
        },
        post: function(url, data, success, failure) {
            this.request({
                method: "POST",
                url: url,
                data: data,
                success: success,
                failure: failure
            });
        },
        getJSON: function(url, success, failure) {
            this.get(url, function(data) {
                success(JSON.parse(data.text));
            }, failure);
        },
        postJSON: function(url, data, success, failure) {
            this.request({
                method: "POST",
                url: url,
                data: JSON.stringify(data),
                success: function(data) {
                    success(JSON.parse(data.text));
                },
                failure: failure,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        },
        parseTokenRequest: function(tokenRequest, content_type) {
            switch (content_type) {
              case "text/xml":
                var token = tokenRequest.xml.getElementsByTagName("token");
                var secret = tokenRequest.xml.getElementsByTagName("secret");
                obj[OAuth.urlDecode(token[0])] = OAuth.urlDecode(secret[0]);
                break;

              default:
                var i = 0, arr = tokenRequest.text.split("&"), len = arr.length, obj = {};
                for (;len > i; ++i) {
                    var pair = arr[i].split("=");
                    obj[OAuth.urlDecode(pair[0])] = OAuth.urlDecode(pair[1]);
                }
            }
            return obj;
        },
        fetchRequestToken: function(success, failure) {
            var oauth = this;
            oauth.setAccessToken("", "");
            var url = oauth.authorizationUrl;
            this.get(this.requestTokenUrl, function(data) {
                var token = oauth.parseTokenRequest(data, data.responseHeaders["Content-Type"] || void 0);
                oauth.setAccessToken([ token.oauth_token, token.oauth_token_secret ]);
                success(url + "?" + data.text);
            }, failure);
        },
        fetchAccessToken: function(success, failure) {
            var oauth = this;
            this.get(this.accessTokenUrl, function(data) {
                var token = oauth.parseTokenRequest(data, data.responseHeaders["Content-Type"] || void 0);
                oauth.setAccessToken([ token.oauth_token, token.oauth_token_secret ]);
                oauth.setVerifier("");
                success(data);
            }, failure);
        }
    };
    OAuth.signatureMethod = {
        "HMAC-SHA1": function(consumer_secret, token_secret, signature_base) {
            var passphrase, signature, encode = OAuth.urlEncode;
            consumer_secret = encode(consumer_secret);
            token_secret = encode(token_secret || "");
            passphrase = consumer_secret + "&" + token_secret;
            signature = HMAC(SHA1.prototype, passphrase, signature_base);
            return global.btoa(signature);
        }
    };
    OAuth.urlEncode = function(string) {
        function hex(code) {
            var hex = code.toString(16).toUpperCase();
            hex.length < 2 && (hex = 0 + hex);
            return "%" + hex;
        }
        if (!string) return "";
        string += "";
        var i, c, reserved_chars = /[ \r\n!*"'();:@&=+$,\/?%#\[\]<>{}|`^\\\u0080-\uffff]/, str_len = string.length, string_arr = string.split("");
        for (i = 0; str_len > i; i++) if (c = string_arr[i].match(reserved_chars)) {
            c = c[0].charCodeAt(0);
            128 > c ? string_arr[i] = hex(c) : 2048 > c ? string_arr[i] = hex(192 + (c >> 6)) + hex(128 + (63 & c)) : 65536 > c ? string_arr[i] = hex(224 + (c >> 12)) + hex(128 + (c >> 6 & 63)) + hex(128 + (63 & c)) : 2097152 > c && (string_arr[i] = hex(240 + (c >> 18)) + hex(128 + (c >> 12 & 63)) + hex(128 + (c >> 6 & 63)) + hex(128 + (63 & c)));
        }
        return string_arr.join("");
    };
    OAuth.urlDecode = function(string) {
        if (!string) return "";
        return string.replace(/%[a-fA-F0-9]{2}/gi, function(match) {
            return String.fromCharCode(parseInt(match.replace("%", ""), 16));
        });
    };
    SHA1.prototype = new SHA1();
    SHA1.prototype.blocksize = 64;
    SHA1.prototype.hash = function(m) {
        function fn(t, B, C, D) {
            switch (t) {
              case 0:
                return B & C | ~B & D;

              case 1:
              case 3:
                return B ^ C ^ D;

              case 2:
                return B & C | B & D | C & D;
            }
            return -1;
        }
        var lb, hb, l, pad, ml, blocks, b, block, bl, w, i, A, B, C, D, E, t, n, TEMP, H = [ 1732584193, 4023233417, 2562383102, 271733878, 3285377520 ], K = [ 1518500249, 1859775393, 2400959708, 3395469782 ];
        m.constructor === String && (m = stringToByteArray(m.encodeUTF8()));
        l = m.length;
        pad = Math.ceil((l + 9) / this.blocksize) * this.blocksize - (l + 9);
        hb = Math.floor(l / 4294967296);
        lb = Math.floor(l % 4294967296);
        ml = [ 8 * hb >> 24 & 255, 8 * hb >> 16 & 255, 8 * hb >> 8 & 255, 8 * hb & 255, 8 * lb >> 24 & 255, 8 * lb >> 16 & 255, 8 * lb >> 8 & 255, 8 * lb & 255 ];
        m = m.concat([ 128 ], zeroPad(pad), ml);
        blocks = Math.ceil(m.length / this.blocksize);
        for (b = 0; blocks > b; b++) {
            block = m.slice(b * this.blocksize, (b + 1) * this.blocksize);
            bl = block.length;
            w = [];
            for (i = 0; bl > i; i++) w[i >>> 2] |= block[i] << 24 - 8 * (i - 4 * (i >> 2));
            A = H[0];
            B = H[1];
            C = H[2];
            D = H[3];
            E = H[4];
            for (t = 0; 80 > t; t++) {
                t >= 16 && (w[t] = leftrotate(w[t - 3] ^ w[t - 8] ^ w[t - 14] ^ w[t - 16], 1));
                n = Math.floor(t / 20);
                TEMP = leftrotate(A, 5) + fn(n, B, C, D) + E + K[n] + w[t];
                E = D;
                D = C;
                C = leftrotate(B, 30);
                B = A;
                A = TEMP;
            }
            H[0] += A;
            H[1] += B;
            H[2] += C;
            H[3] += D;
            H[4] += E;
        }
        return wordsToByteArray(H);
    };
    return OAuth;
}(this);

!function(global) {
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    global.btoa = global.btoa || function(string) {
        var ascii, index, i = 0, length = string.length, output = "";
        for (;length > i; i += 3) {
            ascii = [ string.charCodeAt(i), string.charCodeAt(i + 1), string.charCodeAt(i + 2) ];
            index = [ ascii[0] >> 2, (3 & ascii[0]) << 4 | ascii[1] >> 4, (15 & ascii[1]) << 2 | ascii[2] >> 6, 63 & ascii[2] ];
            isNaN(ascii[1]) && (index[2] = 64);
            isNaN(ascii[2]) && (index[3] = 64);
            output += b64.charAt(index[0]) + b64.charAt(index[1]) + b64.charAt(index[2]) + b64.charAt(index[3]);
        }
        return output;
    };
}(this);