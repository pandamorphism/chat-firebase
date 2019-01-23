export type Chatroom = {
  name: string;
  id: string;
  participants: { [participantId: string]: boolean }
};

export type NewChatroom = Pick<Chatroom, 'name' | 'participants'>;
