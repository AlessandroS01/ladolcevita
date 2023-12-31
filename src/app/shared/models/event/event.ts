import { Timestamp } from "@firebase/firestore";
import {Details} from "../common/details-subparagraphs";

export class Event {
  id?: string;
  en?: Details;
  it?: Details;
  ko?: Details;
  address?: string;
  date_time?: Timestamp;
  photo?: string;
}



