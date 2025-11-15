
import { SiteHeader } from "@/components/layout/site-header";
import { SiteSidebar } from "@/components/layout/site-sidebar";
import { getPosts } from "@/lib/actions";
import { PostList } from "@/components/posts/post-list";
import { SuggestedUsers } from "@/components/users/suggested-users";

// Эта функция теперь выполняется на сервере для получения данных
export default async function Home() {
  // 1. Получаем данные постов на сервере
  const posts = await getPosts();

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="flex-1">
            <div className="container mx-auto flex flex-row py-8">
                <SiteSidebar className="w-1/4" />
                <div className="w-1/2 px-4">
                    <h1 className="text-2xl font-bold mb-4">Feed</h1>
                    {/* 2. Передаем данные в клиентский компонент для отрисовки */}
                    <PostList posts={posts} />
                </div>
                <aside className="w-1/4 pl-8">
                    <SuggestedUsers />
                </aside>
            </div>
        </main>
    </div>
  );
}
