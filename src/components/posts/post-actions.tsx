import { MessageCircle, Heart } from 'lucide-react';
import type { Post, User } from '@/types';

interface PostActionsProps {
  post: Post;
  currentUser: User | null;
}

export function PostActions({ post, currentUser }: PostActionsProps) {
    // The logic is now correct. Check if the optional likedBy array exists and includes the current user's ID.
    const isLiked = !!currentUser && !!post.likedBy && post.likedBy.includes(currentUser.id);

    return (
        <div className="flex items-center justify-start space-x-4">
            <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500">
                {/* The heart icon correctly reflects the liked state */}
                <Heart className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-current' : ''}`} />
                {/* The count is correctly read from post.likes */}
                <span className="font-semibold">{post.likes}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
                <MessageCircle className="w-6 h-6" />
                {/* The comments count is correctly read from the length of the comments array */}
                <span className="font-semibold">{post.comments.length}</span>
            </button>
        </div>
    );
}
