import { useQuery } from '~/src/apiRequests';

export type PostType = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

export type UserType = {
  id: number;
  name: string;
  avatarUrl: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
};

const resolveAfter = (time: number) => new Promise(res => setTimeout(res, time, time));

export function usePosts() {
  return useQuery('posts', () =>
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json() as Promise<PostType[]>)
      .then(data => resolveAfter(1000).then(() => data))
  );
}

export function usePost(id?: number) {
  return useQuery(`post${String(id)}`, () => {
    if (!id) {
      throw new Error('No id was provided for post');
    }
    return fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then(response => response.json() as Promise<PostType>)
      .then(data => resolveAfter(1000).then(() => data));
  });
}

export function useUser(id?: number) {
  return useQuery(`user${String(id)}`, () => {
    if (!id) {
      throw new Error('No id was provided for user');
    }
    return fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(response => response.json())
      .then(
        user =>
          ({ ...user, avatarUrl: 'https://www.w3schools.com/w3images/avatar5.png' } as UserType)
      )
      .then(data => resolveAfter(1000).then(() => data));
  });
}
