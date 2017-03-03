import { autoinject } from "aurelia-framework";
import { Firebase } from "./firebase";
import { ISites, IUser, ISeedList } from "../interfaces/export";
import { Spinner } from "./spinner";
var firebase;

@autoinject
export class User {
  constructor(private db: Firebase, private spinner: Spinner) {
    this.initializeSeeds();

  }

  private itemsKey = "localSeedList";

  private authToken = null;
  private user = null;
  public defaultSeedList: Array<ISites> = JSON.parse("[{\"seed\": \"amazon\", \"url\": \"https://www.amazon.com/\", \"displayName\": \"Amazon\" }, { \"seed\": \"apple\", \"url\": \"https://www.apple.com/\", \"displayName\": \"Apple\" },{ \"seed\": \"box\", \"url\": \"https://app.box.com/login/\", \"displayName\": \"Box\" }, { \"seed\": \"ebay\", \"url\": \"https://signin.ebay.com/\", \"displayName\": \"Ebay\" } , { \"seed\": \"facebook\", \"url\": \"https://www.facebook.com/\", \"displayName\": \"Facebook\" }, { \"seed\": \"google\", \"url\": \"https://www.google.com/\", \"displayName\": \"Google\" }, { \"seed\": \"linkedin\", \"url\": \"https://www.linkedin.com/\", \"displayName\": \"LinkedIn\" }, { \"seed\": \"nytimes\", \"url\": \"https://myaccount.nytimes.com/\", \"displayName\": \"NYTimes\" }, { \"seed\": \"outlook\", \"url\": \"https://www.outlook.com/\", \"displayName\": \"Outlook\" }, { \"seed\": \"paypal\", \"url\": \"https://www.paypal.com/\", \"displayName\": \"PayPal\" }, { \"seed\": \"tumblr\", \"url\": \"https://www.tumblr.com/\", \"displayName\": \"Tumblr\" }, { \"seed\": \"twitter\", \"url\": \"https://twitter.com/\", \"displayName\": \"Twitter\" }, { \"seed\": \"wikipedia\", \"url\": \"https://www.wikipedia.org/\", \"displayName\": \"Wikipedia\" }, { \"seed\": \"wordpress\", \"url\": \"https://www.wordpress.com/\", \"displayName\": \"WordPress\" }, { \"seed\": \"yahoo\", \"url\": \"https://login.yahoo.com/\", \"displayName\": \"Yahoo\" }]");
  isLoggedIn: boolean = false;
  userData: IUser = {
    displayName: "",
    email: "",
    photo: "",
    seedList: null
  }

  login(type: string) {
    this.spinner.on();
    this.db.login(type).then((result: any) => {
      // The token for this session

      if (result.refreshToken) {
        this.userData = {
          displayName: result.displayName,
          email: result.email,
          photo: result.photoURL,
          seedList: null
        }

      } else {
        this.authToken = result.credential.accessToken;
        localStorage.setItem("credentials", JSON.stringify(result.credential));
        // The user object containing information about the current user
        this.user = result.user;
        //this.db.firebaseRef.getInstance().setPersistenceEnabled(true);
        // Set a class variable to true to state we are logged in

        this.userData = {
          displayName: this.user.displayName,
          email: this.user.email,
          photo: this.user.photoURL,
          seedList: null
        }

      }

      this.db
        .getCustomSeedList(this.user.uid)
        .then(r => {
          this.userData.seedList = r.seedList;
          this.isLoggedIn = true;
          this.spinner.off();
        });
    }).catch(error => {
      let errorCode = error.code;
      let errorMessage = error.message;
      let email = error.email;
      let credential = error.credential;

      if (errorCode == "auth/invalid-credential") {
        alert("After 2 hours you need to login manually again");
      }
      this.spinner.off();
      localStorage.removeItem("credentials");
    });
  }
  logout() {
    this.db.logout().then(() => {
      this.isLoggedIn = false;
    }).catch(error => {
      throw new Error(error);
    });;
  }
  saveSeedList(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const uid = this.user ? this.user.uid : null;
      this.db.saveCustomSeedList(uid, this.userData.seedList).then(isChangeOnline => {
        if (!isChangeOnline) {
          this.db.saveLocalSeeds({ lastChange: null, seedList: this.userData.seedList }, true);
        }
        resolve(true)
      }).catch(r => {
        this.db.saveLocalSeeds({ lastChange: null, seedList: this.userData.seedList }, true);
      })
    })
  }
  private initializeSeeds() {
    this.login("facebook");
    // const localSeeds: ISeedList = this.db.getLocalSeedList();

    // if (!localSeeds) {
    //   localStorage.removeItem(this.itemsKey);
    //   this.db.saveLocalSeeds({ lastChange: null, seedList: this.defaultSeedList }, true);
    //   this.userData.seedList = this.defaultSeedList;
    // } else {
    //   this.userData.seedList = localSeeds.seedList;
    // }

    //TODO Try to Login ONInit

    // this.db.getDefaultSeeds()
    //   .then(r => {
    //     let serverDefaultList = JSON.parse(r.val());
    //     this.userData.seedList = serverDefaultList || localSeeds || this.defaultSeedList;
    //   });
  }
}