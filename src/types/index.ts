export type User = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  bio: string;
  followers: number;
  following: number;
};

export type Post = {
  id: string;
  author: User;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
};
