import type { User, Post } from '@/types';

export const users: User[] = [
  {
    id: 'user-1',
    name: 'Sarah Lee',
    username: 'sarahlee',
    avatarUrl: 'https://picsum.photos/seed/user1/200/200',
    bio: 'Photographer & Designer. Capturing moments and creating beauty.',
    followers: 1204,
    following: 345,
  },
  {
    id: 'user-2',
    name: 'John Maverick',
    username: 'johnmav',
    avatarUrl: 'https://picsum.photos/seed/user2/200/200',
    bio: 'Exploring the world, one city at a time. Tech enthusiast.',
    followers: 876,
    following: 501,
  },
  {
    id: 'user-3',
    name: 'Emily Chen',
    username: 'emilychen',
    avatarUrl: 'https://picsum.photos/seed/user3/200/200',
    bio: 'Food blogger and recipe developer. Lover of all things spicy.',
    followers: 2300,
    following: 120,
  },
  {
    id: 'user-4',
    name: 'Alex Rivera',
    username: 'alexrivera',
    avatarUrl: 'https://picsum.photos/seed/user4/200/200',
    bio: 'Musician and sound engineer. Making waves.',
    followers: 540,
    following: 89,
  },
];

export const currentUser: User = {
  id: 'user-5',
  name: 'You',
  username: 'currentuser',
  avatarUrl: 'https://picsum.photos/seed/currentUser/200/200',
  bio: 'Just browsing...',
  followers: 42,
  following: 123,
};

export const posts: Post[] = [
  {
    id: 'post-1',
    author: users[0],
    content: "Absolutely breathtaking views from my morning hike! 🌄 Nature is the best artist.",
    imageUrl: 'https://picsum.photos/seed/post1/600/400',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    likes: 152,
    comments: 12,
    shares: 8,
  },
  {
    id: 'post-2',
    author: users[1],
    content: "Finally got my hands on the new 'Innovate' framework. The developer experience is incredible. Check it out!",
    linkUrl: 'https://github.com/vercel/next.js',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    likes: 98,
    comments: 23,
    shares: 15,
  },
  {
    id: 'post-3',
    author: users[2],
    content: "This new cafe has the best latte art I've ever seen. And the taste is just as good! ☕️",
    imageUrl: 'https://picsum.photos/seed/post2/600/400',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    likes: 304,
    comments: 45,
    shares: 22,
  },
  {
    id: 'post-4',
    author: users[3],
    content: "Just dropped a new track on SoundCloud! It's an ambient piece I've been working on for a while. Link in bio.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    likes: 78,
    comments: 19,
    shares: 5,
  },
  {
    id: 'post-5',
    author: users[0],
    content: "Design tip of the day: Use a consistent color palette to create a cohesive and professional look. Soft blues and purples are a great combo!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    likes: 210,
    comments: 31,
    shares: 18,
  },
  {
    id: 'post-6',
    author: users[1],
    content: "Exploring the city lights tonight. There's something magical about a city at night.",
    imageUrl: 'https://picsum.photos/seed/post3/600/400',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(), // 28 hours ago
    likes: 180,
    comments: 25,
    shares: 11,
  },
];
