export interface IMessage {
  id: number;
  text: string;
}

export interface IChat {
  [userId: number]: IMessage[];
}
export interface IUser {
  id: number;
  name: string;
  chat: IChat;
}

export interface IMainStore {
  users: IUser[];
}
