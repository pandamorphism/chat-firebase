import {User} from './user';

export type Message = {
  message: string;
  createAt: Date & {seconds?: number};
  sender: User;
};
