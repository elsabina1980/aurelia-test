import { ISites } from "../interfaces/export";

declare var firebase;
export class Firebase {
  constructor() {
    this.initialized();
  }
  private isInitialized = false;
  firebaseRef = null;
  defaultSeeds: Array<ISites>;


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

  getDefaultSeeds(isInitialized?: boolean): Promise<any> {
    if (!isInitialized)
      return this.firebaseRef.database().ref("passusers/defaultseedlist").once("value")

    this.firebaseRef.database().ref("passusers/defaultseedlist").once("value")
      .then(r => {
        this.defaultSeeds = JSON.parse(r.val());
      });

  }

  saveCustomSeedList(userId: string, seedList: Array<ISites>) {
    firebase.database().ref('passseedlist/' + userId).set({
      seedList: JSON.stringify(seedList)
    });
    
  }
  getCustomSeedList(userId: string): Promise<any> {
    return this.firebaseRef.database()
      .ref('passusers/seedList' + userId)
      .once("value")
  }
  writeUserTest(userId: string, name, email) {
    firebase.database().ref('passusers/' + userId).set({
      username: name,
      email: email
    });
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
      this.getDefaultSeeds(true)
    }
  }
}