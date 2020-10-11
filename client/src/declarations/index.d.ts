export type TStatus = "idle" | "pending" | "fulfilled" | "rejected";
export type TTimeframe = "day" | "week" | "month" | "all" | "archived";

export interface IEvent {
  _id?: string;
  title: string;
  description?: string;
  day: Date;
  startsAt?: string;
  endsAt?: string;
  location?: string;
  participants: array<any>;
  author: any;
}
export interface IUser {
  _id: string;
  username: string;
  email?: string;
  screeName?: string;
  twitterId?: string;
  profileImageUrl?: string;
  createdEvents?: any;
  joinedEvents?: any;
}

export interface IAuthInitialState {
  user: null | IUser;
  isAuth: boolean;
  status: TStatus;
  error: string;
  successMessage: string;
  authDialogIsOpen: boolean;
  authDialogActiveTab: number;
  userToUpdate: string;
  passwordResetStatus: TStatus;
  passwordResetError: string;
}
export interface IDeckBuilderInitialState {
  searchStatus: TStatus;
  error: string;
  searchResult:any
  mainDeckList:any;
  mainDeckLength:number,
  deckName:string,
  deckFormat:string,
}

export interface IUsersInitialState {
  userPersonalProfile: IUser | null;
  status: TStatus;
  updateStatus: TStatus;
  eventsSelection: "myEvents" | "joined" | "archived";
  error: string;
}

export interface IStore {
  auth: IAuthInitialState;
  users: IUsersInitialState;
  deckBuilder:IDeckBuilderInitialState
}
