import {Message} from '../../../../shared/model/message';
import {User} from '../../../../shared/model/user';

export const bob: User = {
  firstName: 'Bob',
  lastName: 'Smith',
  photoUrl: 'https://placekitten.com/90/90?image=1'
};

export const steve: User = {
  firstName: 'Steve',
  lastName: 'Anderson',
  photoUrl: 'https://placekitten.com/90/90?image=2'
};


export const dummyData: Message[] = [
  {
    createAt: new Date(),
    sender: bob,
    message: `ved not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was
     popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more rece`,
  }, {
    createAt: new Date(),
    sender: steve,
    message: ` is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard
     dummy text ever since th`,
  },
  {
    createAt: new Date(),
    sender: bob,
    message: `ved not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was
     popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more rece`,
  }, {
    createAt: new Date(),
    sender: steve,
    message: ` is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard
     dummy text ever since th`,
  }, {
    createAt: new Date(),
    sender: bob,
    message: `ved not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was
     popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more rece`,
  },
];

