import { getSessionUser } from "@/lib/session";
import { PostForm } from "@/components/posts/post-form";
import { createPost } from "@/lib/actions";

export default async function ComposePage() {
  const user = await getSessionUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent text-white p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <PostForm createPostAction={createPost} user={user} />
      </div>
    </div>
  );
}
