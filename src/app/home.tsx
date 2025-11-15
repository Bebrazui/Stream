
import { SiteHeader } from "@/components/layout/site-header";
import { SiteSidebar } from "@/components/layout/site-sidebar";
import { getPosts } from "@/lib/actions";
import { PostList } from "@/components/posts/post-list";
import { RightSidebar } from "@/components/layout/right-sidebar";


// Эта функция теперь выполняется на сервере для получения данных
export default async function Home() {
  // 1. Получаем данные постов на сервере
  const posts = await getPosts();

  return (
    <div className="grid grid-cols-12 min-h-screen">
      <div className="col-span-2 border-r border-white/10">
          <SiteSidebar />
      </div>
      <main className="col-span-7 py-8">
          <PostList posts={posts} />
      </main>
      <aside className="col-span-3 border-l border-white/10">
          <RightSidebar />
      </aside>
  </div>
  );
}
