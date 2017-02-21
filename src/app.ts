import { autoinject, inject, computedFrom } from "aurelia-framework";
import { PasswordGenerator } from "./pass-generator";
import { ISites } from "./interfaces/export";
import { User } from "./services/user";


const itemsKey = "seedsAndSites";
@inject(PasswordGenerator, User)
export class App {
  constructor(private passgen: PasswordGenerator, private user: User) {
  }


  isPasswordMasked: boolean = true;
  listHasChanged: boolean = false;
  customSite: ISites = { url: "", seed: "", displayName: "" };
  myPassword: string;
  sites: Array<ISites> = [];

  @computedFrom("isPasswordMasked")
  get passwordType(): string {
    return this.isPasswordMasked ? 'password' : 'text';
  }
  setVals() {
    /*     	   Seed    masterpassword */
    for (var i = 0; i < this.sites.length; i++) {
      this.passwordHash(this.sites[i].seed, this.myPassword);
    }
  }
  passwordHash(passbox, master) {
    var newpass = this.passgen.b64_sha1(master + ':' + passbox);
    newpass = newpass.substr(0, 8) + '1a' || "";

    document.getElementById(passbox).setAttribute('value', newpass);
  }
  addCustomSeedToList(): void {
    this.customSite.seed = this.customSite.displayName.toLowerCase();
    this.sites.push(this.customSite)
    this.setEmptyCustomSite();
    this.listHasChanged = true;
  }
  deleteSeed(site: ISites) {
    this.sites.splice(this.sites.indexOf(site), 1);
    this.listHasChanged = true;
  }
  setEmptyCustomSite(): void {
    this.customSite = {
      seed: "",
      url: "",
      displayName: ""
    }
  }

  saveSeeds(): void {
    localStorage.setItem(itemsKey, JSON.stringify(this.sites));
    this.listHasChanged = false;
  }
}
