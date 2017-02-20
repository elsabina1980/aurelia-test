import { autoinject, computedFrom } from "aurelia-framework";
import { Firebase } from "./firebase";
import { ISites, IUser } from "../interfaces/export";

var firebase;

@autoinject
export class User {
  constructor(private db: Firebase) {

  }
  private itemsKey = "seedsAndSites";
  private authToken = null;
  private user = null;
  isLoggedIn = firebase.auth().currentUser.uid ? true : false;;

  @computedFrom("isLoggedIn")
  get userData(): IUser {
    const userData: IUser = {
      displayName: "",
      email: "",
      photo: "",
      seedList: null
    }
    let seedList: Array<ISites> = [];
    if (!this.isLoggedIn) {
      const defaultSeeds = this.db.defaultSeeds;
      const localSeeds = localStorage.getItem(this.itemsKey);

      userData.seedList = localSeeds ? JSON.parse(localSeeds) : defaultSeeds;
      
      return userData;
      
    } else {
      userData.displayName = this.user.displayName;
      userData.email = this.user.email;
      userData.photo = this.user.photoURL;
      this.db
        .getCustomSeedList(this.user.uid)
        .then(r => {
          const customSeedList =  JSON.parse(r.val());
          
          if(customSeedList && customSeedList.length){
            userData.seedList = customSeedList;
          }
          
          return userData;
        })
    }
  }
  login(type: string) {
    this.db.login(type).then((result: any) => {
      // The token for this session
      this.authToken = result.credential.accessToken;

      // The user object containing information about the current user
      this.user = result.user;

      // Set a class variable to true to state we are logged in
      this.isLoggedIn = true;
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
}