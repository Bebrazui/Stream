export type PostCategory = 'programming' | 'nature' | 'games' | 'other';

export type User = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  bio?: string; 
};

export type Comment = {
    id: string;
    text: string;
    author: User;
    createdAt: string;
}

export type Post = {
  id: string;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  author: User;
  createdAt: string;
  likes: number;
  likedBy?: string[];
  comments: Comment[];
  commentCount: number;
  shares: number;
};
