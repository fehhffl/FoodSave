import { ConsumerUser } from '../types';

export const consumerUsers: ConsumerUser[] = [
  {
    id: 'usr_lucas',
    name: 'Lucas Andrade',
    email: 'lucas.andrade@email.com',
    password: '123456',
    city: 'Sorocaba, SP',
    joinedAt: '2026-03-01T10:00:00Z',
  },
];

export const findConsumer = (email: string, password: string) =>
  consumerUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );
