export type User = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  bio: string;
  followers: number;
  following: number;
};

export type PostCategory = 'programming' | 'nature' | 'games' | 'other';

export type Post = {
  id: string;
  author: User;
  content: string;
  category: PostCategory;
  imageUrl?: string;
  linkUrl?: string;
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
};
