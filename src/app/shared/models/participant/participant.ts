import {User} from "../user/user.model";
import {Event} from "../event/event";

export class Participant {
  event?: string;
  email?: string;
}

export class ParticipantFulfilled {
  event?: Event;
  user?: User;
}
