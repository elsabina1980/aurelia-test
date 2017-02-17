import { autoinject, inject, computedFrom } from "aurelia-framework";
import { PasswordGenerator } from "./pass-generator";
import { ISites } from "./interfaces/export";

const itemsKey = "seedsAndSites";
@inject(PasswordGenerator)
export class App {
  constructor(private passgen: PasswordGenerator) {
    // todo : dynamic get
    this.sites = this.loadSeeds();
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
  setvals() {
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
  deleteSeed(site: ISites){
    this.sites.splice(this.sites.indexOf(site), 1);
    this.listHasChanged = true;
  }
  setEmptyCustomSite():void{
    this.customSite = {
      seed: "",
      url: "",
      displayName: ""
    }
  }
  private loadSeeds(): any {
    const items = localStorage.getItem(itemsKey);

    return items ? JSON.parse(items) : this.passgen.defaultSites;
  }

  saveSeeds(): void {
    localStorage.setItem(itemsKey, JSON.stringify(this.sites));
    this.listHasChanged = false;
  }
}
