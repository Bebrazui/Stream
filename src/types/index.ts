export type PostCategory = 'programming' | 'nature' | 'games' | 'other';
export type ProfileTheme = 'default' | 'dark' | 'ocean' | 'sunrise' | 'premium-galaxy';
export type AvatarFrame = 'circle' | 'none' | 'gold-border' | 'neon-glow' | 'vintage';

export type User = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  bannerUrl?: string;
  bio?: string; 
  profileTheme?: ProfileTheme;
  avatarFrame?: AvatarFrame;
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
