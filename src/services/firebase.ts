import { ISites, ISeedList } from "../interfaces/export";

declare var firebase;
export class Firebase {
  constructor() {
    this.initialized();
  }
  private isInitialized = false;
  private itemsKey = "localSeedList";
  firebaseRef = null;

  // This mostly gets called on subsequent page loads to determine
  // what the current status of the user is with "user" being an object
  // return by Firebase with credentials and other info inside of it
  login(type): Promise<any> {
    let provider;

    // Determine which provider to use depending on provided type
    // which is passed through from app.html
    if (type === 'google') {
      provider = new firebase.auth.GoogleAuthProvider();
    } else if (type === 'facebook') {
      provider = new firebase.auth.FacebookAuthProvider();
    } else if (type === 'twitter') {
      provider = new firebase.auth.TwitterAuthProvider();
    }

    // Call the Firebase signin method for our provider
    // then take the successful or failed result and deal with
    // it accordingly.
    return firebase.auth().signInWithPopup(provider);
  }

  logout(): Promise<any> {
    // Self-explanatory signout code
    return firebase.auth().signOut()
  }



  getCustomSeedList(userId: string): Promise<ISeedList> {

    return new Promise((resolve, reject) => {
      const localSeeds = this.getLocalSeedList();

      if (!userId) {
        resolve(localSeeds)
        return;
      }

      this.firebaseRef.database()
        .ref(`passseedlists/${userId}`)
        .once("value").then((r) => {
          const serverSeeds: ISeedList = !r.lastChange ? r.val() : r;
          if (typeof serverSeeds.seedList == "string") {
            serverSeeds.seedList = JSON.parse(serverSeeds.seedList);
          }
          if (!serverSeeds || serverSeeds.lastChange < localSeeds.lastChange) {
            this.saveCustomSeedList(userId, localSeeds.seedList)
            resolve(localSeeds);
            return;
          }

          this.saveLocalSeeds(serverSeeds);
          resolve(serverSeeds);
        })
    }
    )
  }

  getLocalSeedList(): ISeedList {
    const localSeeds = JSON.parse(localStorage.getItem(this.itemsKey));
    if (typeof localSeeds.seedList == "string") {
      localSeeds.seedList = JSON.parse(localSeeds.seedList);
    }

    return localSeeds && localSeeds.seedList
      ? localSeeds
      : null
  }

  saveLocalSeeds(seedSitesList: ISeedList, setTimestamp?: boolean) {
    localStorage.setItem(this.itemsKey, JSON.stringify({
      lastChange: setTimestamp ? new Date().getTime() : seedSitesList.lastChange,
      seedList: seedSitesList.seedList
    }
    ));
  }

  saveCustomSeedList(userId: string, seedList: Array<ISites>): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.saveLocalSeeds({ lastChange: null, seedList: seedList }, true);

      if (!userId) {
        resolve(false);
        return;
      }

      firebase.database()
        .ref(`passseedlists/${userId}`)
        .set({
          lastChange: new Date().getTime(),
          seedList: JSON.stringify(seedList)
        },
        (error) => {
          resolve(error ? false : true);
        });
    })
  }

  initialized() {
    if (!this.isInitialized) {
      this.isInitialized = true;
      const config = {
        apiKey: "AIzaSyDzZM9MJm8Mt7W7gbrqKzHf5MJksNjDxAI",
        authDomain: "passgen-737ad.firebaseapp.com",
        databaseURL: "https://passgen-737ad.firebaseio.com",
        storageBucket: "passgen-737ad.appspot.com",
        messagingSenderId: "739446105290"
      }
      this.firebaseRef = firebase.initializeApp(config);
      //this.getDefaultSeeds()
    }
  }
}