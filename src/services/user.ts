import { autoinject } from "aurelia-framework";
import { Firebase } from "./firebase";
import { ISites, IUser } from "../interfaces/export";

var firebase;

@autoinject
export class User {
  constructor(private db: Firebase) {
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
    this.db.login(type).then((result: any) => {
      // The token for this session
      this.authToken = result.credential.accessToken;

      // The user object containing information about the current user
      this.user = result.user;
      //this.db.firebaseRef.getInstance().setPersistenceEnabled(true);
      // Set a class variable to true to state we are logged in

      this.isLoggedIn = true;
      this.userData = {
        displayName: this.user.displayName,
        email: this.user.email,
        photo: this.user.photoURL,
        seedList: null
      }
      this.db
        .getCustomSeedList(this.user.uid)
        .then(r => {
          const serverSeedList = JSON.parse(r.val());
          if (serverSeedList && serverSeedList.seedList && serverSeedList.seedList.length) {
            this.userData.seedList = serverSeedList.seedList;
          } else {
            const localSeedList = this.db.getLocalSeedList();
            this.userData.seedList = localSeedList || this.defaultSeedList;
          }
        });

    }).catch(error => {
      let errorCode = error.code;
      let errorMessage = error.message;
      let email = error.email;
      let credential = error.credential;

    });
  }
  logout() {
    this.db.logout().then(() => {
      this.isLoggedIn = false;
    }).catch(error => {
      throw new Error(error);
    });;
  }

  initializeSeeds() {
    const localSeeds = JSON.parse(localStorage.getItem(this.itemsKey));
    this.userData.seedList = localSeeds || this.defaultSeedList;
    //TODO Try to Login ONInit

    // this.db.getDefaultSeeds()
    //   .then(r => {
    //     let serverDefaultList = JSON.parse(r.val());
    //     this.userData.seedList = serverDefaultList || localSeeds || this.defaultSeedList;
    //   });
  }
}