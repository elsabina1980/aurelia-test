import { ISites } from "./interfaces/export";
export class PasswordGenerator {
  constructor() {
    this.b64pad = "";
    this.chrsz = 8;
  }
  b64pad: string;
  chrsz: number;
  mypass: string;
  defaultSites:Array<ISites> = [
        { seed: "amazon", url: "https://www.amazon.com/", displayName: "Amazon" }
      , { seed: "apple", url: "https://www.apple.com/", displayName: "Apple" }
      , { seed: "box", url: "https://app.box.com/login/", displayName: "Box" }
      , { seed: "ebay", url: "https://signin.ebay.com/", displayName: "Ebay" }
      , { seed: "facebook", url: "https://www.facebook.com/", displayName: "Facebook" }
      , { seed: "google", url: "https://www.google.com/", displayName: "Google" }
      , { seed: "linkedin", url: "https://www.linkedin.com/", displayName: "LinkedIn" }
      , { seed: "nytimes", url: "https://myaccount.nytimes.com/", displayName: "NYTimes" }
      , { seed: "outlook", url: "https://www.outlook.com/", displayName: "Outlook" }
      , { seed: "paypal", url: "https://www.paypal.com/", displayName: "PayPal" }
      , { seed: "tumblr", url: "https://www.tumblr.com/", displayName: "Tumblr" }
      , { seed: "twitter", url: "https://twitter.com/", displayName: "Twitter" }
      , { seed: "wikipedia", url: "https://www.wikipedia.org/", displayName: "Wikipedia" }
      , { seed: "wordpress", url: "https://www.wordpress.com/", displayName: "WordPress" }
      , { seed: "yahoo", url: "https://login.yahoo.com/", displayName: "Yahoo" }
    ];

  b64_sha1(s) {
    return this.binb2b64(this.core_sha1(this.str2binb(s), s.length * this.chrsz));
  }
  binb2b64(binarray: any) {
    const tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let str = "";
    for (let i = 0; i < binarray.length * 4; i += 3) {
      const triplet = (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16)
        | (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8)
        | ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF);
      for (let j = 0; j < 4; j++) {
        if (i * 8 + j * 6 > binarray.length * 32) str += this.b64pad;
        else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
      }
    }
    return str;
  }

  core_sha1(x, len) {
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
        if (j < 16) w[j] = x[i + j];
        else w[j] = this.rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
        var t = this.safe_add(this.safe_add(this.rol(a, 5), this.sha1_ft(j, b, c, d)),
          this.safe_add(this.safe_add(e, w[j]), this.sha1_kt(j)));
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

  }

  rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
  }
  safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }
  str2binb(str) {
    var bin = Array();
    var mask = (1 << this.chrsz) - 1;
    for (var i = 0; i < str.length * this.chrsz; i += this.chrsz)
      bin[i >> 5] |= (str.charCodeAt(i / this.chrsz) & mask) << (24 - i % 32);
    return bin;
  }

  sha1_ft(t, b, c, d) {
    if (t < 20) return (b & c) | ((~b) & d);
    if (t < 40) return b ^ c ^ d;
    if (t < 60) return (b & c) | (b & d) | (c & d);
    return b ^ c ^ d;
  }
  sha1_kt(t) {
    return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 :
      (t < 60) ? -1894007588 : -899497514;
  }
}