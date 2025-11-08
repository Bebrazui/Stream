import { PostForm } from "@/components/posts/post-form";
import { createPost } from "@/lib/actions";

export default function ComposePage() {
  return (
    <div className="mx-auto max-w-2xl">
       <h1 className="mb-6 font-headline text-3xl font-bold">Create Post</h1>
       <PostForm createPostAction={createPost} />
    </div>
  )
}
