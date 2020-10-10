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
export interface IEventsdInitialState {
  events: array<IEvent>;
  eventsStatus: TStatus;
  eventsError: string | null;
  eventDetail: IEvent | null;
  eventDetailStatus: TStatus;
  eventDetailError: string | null;
  eventUpdateStatus: TStatus;
  eventUpdateError: string | null;
  eventSubscriptionStatus: { status: TStatus; eventId: string | undefined };
  status: TStatus;
  error: string;
}
export interface ITimeframeInitialState {
  status: TStatus;
  error: string;
  timeframe: TTimeframe;
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
  events: IMainBoardInitialState;
  users: IUsersInitialState;
  timeframe: ITimeframeInitialState;
}
