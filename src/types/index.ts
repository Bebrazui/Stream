export type PostCategory = 'programming' | 'nature' | 'games' | 'other';

export type User = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  bio?: string; // Optional bio field
};

export type Post = {
  id: string;
  content: string;
  imageUrl?: string;
  author: User;
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
};
