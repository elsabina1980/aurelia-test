import { ISites } from "./sites";

export interface IUser{
  seedList: Array<ISites>;
  displayName: string;
  email: string;
  photo: any;
}