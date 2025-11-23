import { Post, User, Comment } from '@/types';

// Sample Users
const user1: User = {
  id: 'user-1',
  name: 'John Doe',
  username: 'johndoe',
  avatarUrl: '/avatars/01.png',
  hasPremium: true,
  profileTheme: 'ocean',
  avatarFrame: 'gold-border',
};

const user2: User = {
  id: 'user-2',
  name: 'Jane Smith',
  username: 'janesmith',
  avatarUrl: '/avatars/02.png',
};

const user3: User = {
    id: 'user-3',
    name: 'Alice Johnson',
    username: 'alicej',
    avatarUrl: '/avatars/03.png',
    hasPremium: true,
    profileTheme: 'sunrise',
    avatarFrame: 'neon-glow',
};

// Sample Comments
const comment1: Comment = {
  id: 'comment-1',
  text: 'This is a great post!',
  author: user2,
  createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
};

const comment2: Comment = {
  id: 'comment-2',
  text: 'I totally agree with you.',
  author: user3,
  createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 minutes ago
};

// Sample Posts
export const placeholderPosts: Post[] = [
  {
    id: 'post-1',
    content: 'Just finished a great book on web development. Highly recommended!',
    author: user1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    likes: 15,
    likedBy: ['user-2', 'user-3'],
    shares: 5,
    commentCount: 2,
    comments: [comment1, comment2],
    category: 'programming',
  },
  {
    id: 'post-2',
    content: 'Beautiful sunset at the beach today. #nofilter',
    imageUrl: '/placeholder.svg',
    author: user2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    likes: 42,
    likedBy: ['user-1'],
    shares: 12,
    commentCount: 0,
    comments: [],
    category: 'nature',
  },
  {
    id: 'post-3',
    content: 'Excited to announce my new project! It is a tool for developers to create stunning UIs.',
    author: user3,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    likes: 120,
    shares: 30,
    commentCount: 0,
    comments: [],
    category: 'other',
  },
];
