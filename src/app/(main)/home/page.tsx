import { PostCard } from '@/components/posts/post-card';
import { getPosts } from '@/lib/actions';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

export default async function HomePage() {
  const posts = await getPosts();
  return (
    <div className="h-full w-full">
      <Carousel
        opts={{dragFree: true}}
        orientation="vertical"
        className="w-full h-full"
      >
        <CarouselContent className="h-full">
          {posts.map((post) => (
            <CarouselItem key={post.id} className="basis-full">
              {/* This div is now a full-height container with padding, which is the correct context for the self-constraining PostCard. */}
              <div className="flex h-full w-full items-center justify-center py-4">
                <PostCard post={post} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
