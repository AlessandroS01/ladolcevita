import {Timestamp} from "@firebase/firestore";
import {Details} from "../common/details-subparagraphs";

export class Article {
  id?: string;
  en?: Details;
  it?: Details;
  ko?: Details;
  email?:string;
  photo?:string;
  date_time?: Timestamp;
  lecture_time?: string;
}
