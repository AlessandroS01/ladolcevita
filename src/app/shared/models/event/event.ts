import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export class Event {
  id?: string;
  en?: EventDetails;
  it?: EventDetails;
  ko?: EventDetails;
  address?: string;
  date_time?: Timestamp;
  photo?: string;
}


export class EventDetails {
  title?: string;
  description?: string;
}
