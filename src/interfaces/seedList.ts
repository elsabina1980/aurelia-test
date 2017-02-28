import { ISites } from "./sites";

export interface ISeedList {
    lastChange: Date,
    seedList: Array<ISites>
}