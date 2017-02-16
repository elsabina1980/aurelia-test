import { autoinject, inject } from "aurelia-framework";
import { PasswordGenerator } from "./pass-generator";
import { ISites } from "./interfaces/export";

@inject(PasswordGenerator)
export class App {
  constructor(private passgen: PasswordGenerator) {
    // todo : dynamic get
    this.sites = [
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
    ]
  }

  sites: Array<ISites> = [];
  message = 'Hello World!';

  setvals(mypassValue: string) {
    var mypass = document.getElementById("main");

    document.getElementById("customRoot").setAttribute('value', mypassValue);

    /*     	   Seed    masterpassword */
    for (var i = 0; i < this.sites.length; i++) {
      this.passwordHash(this.sites[i].seed, mypass);
    }
  }
  passwordHash(passbox, master) {
    var newpass = this.passgen.b64_sha1(master.value + ':' + passbox);
    newpass = newpass.substr(0, 8) + '1a';
    if (master.value.length == 0 || master.value == null) {
      newpass = '';
    }
    document.getElementById(passbox).setAttribute('value', newpass);
  }
}
