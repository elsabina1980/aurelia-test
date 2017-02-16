define('interfaces/sites',["require", "exports"], function (require, exports) {
    "use strict";
});

define('interfaces/export',["require", "exports"], function (require, exports) {
    "use strict";
});

define('pass-generator',["require", "exports"], function (require, exports) {
    "use strict";
    var PasswordGenerator = (function () {
        function PasswordGenerator() {
            this.defaultSites = [
                { seed: "amazon", url: "https://www.amazon.com/", displayName: "Amazon" },
                { seed: "apple", url: "https://www.apple.com/", displayName: "Apple" },
                { seed: "box", url: "https://app.box.com/login/", displayName: "Box" },
                { seed: "ebay", url: "https://signin.ebay.com/", displayName: "Ebay" },
                { seed: "facebook", url: "https://www.facebook.com/", displayName: "Facebook" },
                { seed: "google", url: "https://www.google.com/", displayName: "Google" },
                { seed: "linkedin", url: "https://www.linkedin.com/", displayName: "LinkedIn" },
                { seed: "nytimes", url: "https://myaccount.nytimes.com/", displayName: "NYTimes" },
                { seed: "outlook", url: "https://www.outlook.com/", displayName: "Outlook" },
                { seed: "paypal", url: "https://www.paypal.com/", displayName: "PayPal" },
                { seed: "tumblr", url: "https://www.tumblr.com/", displayName: "Tumblr" },
                { seed: "twitter", url: "https://twitter.com/", displayName: "Twitter" },
                { seed: "wikipedia", url: "https://www.wikipedia.org/", displayName: "Wikipedia" },
                { seed: "wordpress", url: "https://www.wordpress.com/", displayName: "WordPress" },
                { seed: "yahoo", url: "https://login.yahoo.com/", displayName: "Yahoo" }
            ];
            this.b64pad = "";
            this.chrsz = 8;
        }
        PasswordGenerator.prototype.b64_sha1 = function (s) {
            return this.binb2b64(this.core_sha1(this.str2binb(s), s.length * this.chrsz));
        };
        PasswordGenerator.prototype.binb2b64 = function (binarray) {
            var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i += 3) {
                var triplet = (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16)
                    | (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8)
                    | ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF);
                for (var j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > binarray.length * 32)
                        str += this.b64pad;
                    else
                        str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
                }
            }
            return str;
        };
        PasswordGenerator.prototype.core_sha1 = function (x, len) {
            x[len >> 5] |= 0x80 << (24 - len % 32);
            x[((len + 64 >> 9) << 4) + 15] = len;
            var w = Array(80);
            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;
            var e = -1009589776;
            for (var i = 0; i < x.length; i += 16) {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;
                var olde = e;
                for (var j = 0; j < 80; j++) {
                    if (j < 16)
                        w[j] = x[i + j];
                    else
                        w[j] = this.rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
                    var t = this.safe_add(this.safe_add(this.rol(a, 5), this.sha1_ft(j, b, c, d)), this.safe_add(this.safe_add(e, w[j]), this.sha1_kt(j)));
                    e = d;
                    d = c;
                    c = this.rol(b, 30);
                    b = a;
                    a = t;
                }
                a = this.safe_add(a, olda);
                b = this.safe_add(b, oldb);
                c = this.safe_add(c, oldc);
                d = this.safe_add(d, oldd);
                e = this.safe_add(e, olde);
            }
            return Array(a, b, c, d, e);
        };
        PasswordGenerator.prototype.rol = function (num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        };
        PasswordGenerator.prototype.safe_add = function (x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        };
        PasswordGenerator.prototype.str2binb = function (str) {
            var bin = Array();
            var mask = (1 << this.chrsz) - 1;
            for (var i = 0; i < str.length * this.chrsz; i += this.chrsz)
                bin[i >> 5] |= (str.charCodeAt(i / this.chrsz) & mask) << (24 - i % 32);
            return bin;
        };
        PasswordGenerator.prototype.sha1_ft = function (t, b, c, d) {
            if (t < 20)
                return (b & c) | ((~b) & d);
            if (t < 40)
                return b ^ c ^ d;
            if (t < 60)
                return (b & c) | (b & d) | (c & d);
            return b ^ c ^ d;
        };
        PasswordGenerator.prototype.sha1_kt = function (t) {
            return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 :
                (t < 60) ? -1894007588 : -899497514;
        };
        return PasswordGenerator;
    }());
    exports.PasswordGenerator = PasswordGenerator;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app',["require", "exports", "aurelia-framework", "./pass-generator"], function (require, exports, aurelia_framework_1, pass_generator_1) {
    "use strict";
    var itemsKey = "seedsAndSites";
    var App = (function () {
        function App(passgen) {
            this.passgen = passgen;
            this.isPasswordMasked = true;
            this.listHasChanged = false;
            this.customSite = { url: "", seed: "", displayName: "" };
            this.sites = [];
            this.sites = this.loadSeeds();
        }
        Object.defineProperty(App.prototype, "passwordType", {
            get: function () {
                return this.isPasswordMasked ? 'password' : 'text';
            },
            enumerable: true,
            configurable: true
        });
        App.prototype.setvals = function (mypassValue) {
            for (var i = 0; i < this.sites.length; i++) {
                this.passwordHash(this.sites[i].seed, this.myPassword);
            }
        };
        App.prototype.passwordHash = function (passbox, master) {
            var newpass = this.passgen.b64_sha1(master + ':' + passbox);
            newpass = newpass.substr(0, 8) + '1a' || "";
            document.getElementById(passbox).setAttribute('value', newpass);
        };
        App.prototype.addCustomSeedToList = function () {
            this.customSite.seed = this.customSite.displayName.toLowerCase();
            this.sites.push(this.customSite);
            this.setEmptyCustomSite();
            this.listHasChanged = true;
        };
        App.prototype.deleteSeed = function (site) {
            this.sites.splice(this.sites.indexOf(site), 1);
            this.listHasChanged = true;
        };
        App.prototype.setEmptyCustomSite = function () {
            this.customSite = {
                seed: "",
                url: "",
                displayName: ""
            };
        };
        App.prototype.loadSeeds = function () {
            var items = localStorage.getItem(itemsKey);
            return items ? JSON.parse(items) : this.passgen.defaultSites;
        };
        App.prototype.saveSeeds = function () {
            localStorage.setItem(itemsKey, JSON.stringify(this.sites));
            this.listHasChanged = false;
        };
        return App;
    }());
    __decorate([
        aurelia_framework_1.computedFrom("isPasswordMasked"),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [])
    ], App.prototype, "passwordType", null);
    App = __decorate([
        aurelia_framework_1.inject(pass_generator_1.PasswordGenerator),
        __metadata("design:paramtypes", [pass_generator_1.PasswordGenerator])
    ], App);
    exports.App = App;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('main',["require", "exports", "./environment"], function (require, exports, environment_1) {
    "use strict";
    Promise.config({
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\r\n  <p>\r\n    Using the same password for multiple email, shopping and social networking websites is risky, it means that a security breach\r\n    at one website will compromise all your accounts, possibly even leading to identity theft.\r\n  </p>\r\n  <p>\r\n    So, the idea is that you memorise just one, reasonably long/secure master password and use that to generate a set of non-dictionary\r\n    passwords. Copy and paste the new password(s) into the website and set your web browser to remember them.\r\n  </p>\r\n  <p>All the websites get different passwords, but you only have to remember one!</p>\r\n  <form role=\"form\" submit.delete=\"setVals()\">\r\n    <label for=\"mainPassBox\">Password</label>\r\n    <input type.bind=\"passwordType\" value.bind=\"myPassword\" id=\"mainPassBox\" />\r\n    <input type=\"checkbox\" checked.bind=\"isPasswordMasked\" id=\"isPassMaskCBox\" />\r\n    <label for=\"isPassMaskCBox\">show/hide Password</label>\r\n    <button>Set Paswords</button>\r\n  </form>\r\n  <div repeat.for=\"site of sites\">\r\n    <label for.bind=\"site.seed\">${site.displayName}</label>\r\n    <input id.bind=\"site.seed\" type=\"text\" class=\"site-pass-input\" />\r\n    <button click.delegate=\"deleteSeed(site)\">Delete</button>\r\n  </div>\r\n  <p>Here you can add new sites to generate passwords</p>\r\n  <form role=\"form\" submit.delegate=\"addCustomSeedToList()\">\r\n    <label for=\"siteName\">Site name</label>\r\n    <input value.bind=\"customSite.displayName\" id=\"siteName\" type=\"text\" required/>\r\n    <label for=\"sitUrl\">Url</label>\r\n    <input value.bind=\"customSite.url\" id=\"siteUrl\" type=\"url\" />\r\n    <button type=\"submit\">Add Custom Site</button>\r\n  </form>\r\n  <div if.bind=\"listHasChanged\">\r\n    <p>You can save your custom Sites List to your browser memory</p>\r\n    <button click.delegate=\"saveSeeds()\">Remember Custom List</button>\r\n  </div>\r\n</template>\r\n"; });
//# sourceMappingURL=app-bundle.js.map