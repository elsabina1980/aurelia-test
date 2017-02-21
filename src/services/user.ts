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
          this.userData.seedList = serverSeedList && serverSeedList.seedList && serverSeedList.seedList.length
            ? serverSeedList.seedList
            : this.userData.seedList;
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
    const localSeeds = localStorage.getItem(this.itemsKey);
    this.db.getDefaultSeeds()
      .then(r => {
        this.userData.seedList = localSeeds ? JSON.parse(localSeeds) : JSON.parse(r.val());
      });
  }
}