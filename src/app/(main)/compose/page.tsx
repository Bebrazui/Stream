
import { PostForm } from "@/components/posts/post-form";
import { createPost } from "@/lib/actions";
import { LiquidGlass } from "@/components/ui/liquid-glass";

export default function ComposePage() {
  return (
    <LiquidGlass className="min-h-screen w-full flex flex-col items-center p-4 py-16 md:p-8 md:py-24 text-white">
       <div className="w-full max-w-2xl">
         <h1 className="mb-6 font-headline text-3xl font-bold text-center">Create Post</h1>
         <PostForm createPostAction={createPost} />
       </div>
    </LiquidGlass>
  )
}
