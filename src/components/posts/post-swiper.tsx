'use client';

import React, { useState, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Keyboard } from 'swiper/modules';
import 'swiper/css';

import { Post, PostCategory } from '@/types';
import PostCard from './post-card';
import { usePosts } from '@/hooks/use-posts';

// Определяем темы и соответствующие им цвета фона
const themes: Record<PostCategory | 'For You', string> = {
  'For You': 'bg-transparent',
  programming: 'bg-transparent',
  nature: 'bg-transparent',
  games: 'bg-transparent',
  other: 'bg-transparent',
};

type Theme = keyof typeof themes;

export function PostSwiper() {
  const { posts, isLoading, error } = usePosts();
  const [activeTheme, setActiveTheme] = useState<Theme>('For You');

  // Фильтруем посты на основе активной темы
  const filteredPosts = useMemo(() => {
    if (activeTheme === 'For You') {
      return posts;
    }
    return posts.filter((post: Post) => post.category === activeTheme);
  }, [posts, activeTheme]);

  const handleThemeChange = (swiper: any) => {
    const newTheme = Object.keys(themes)[swiper.activeIndex] as Theme;
    setActiveTheme(newTheme);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading posts...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-full">Error: {error}</div>;
  }

  return (
    <div className={`h-full w-full transition-colors duration-500 ${themes[activeTheme]}`}>
        {/* Горизонтальный свайпер для тем */}
        <Swiper
          modules={[Keyboard]}
          spaceBetween={0}
          slidesPerView={1}
          onSlideChange={handleThemeChange}
          keyboard={{ enabled: true }}
          className="w-full h-full"
        >
            {Object.keys(themes).map(theme => (
                <SwiperSlide key={theme}>
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <h1 className="text-5xl font-bold text-white/80 absolute top-16 capitalize">{theme}</h1>
                        
                        {/* Вертикальный свайпер для постов */}
                        <Swiper
                          direction={"vertical"}
                          modules={[Mousewheel, Keyboard]}
                          spaceBetween={50}
                          slidesPerView={1}
                          mousewheel
                          keyboard={{ enabled: true }}
                          className="w-full max-w-2xl h-full"
                          nested // Важно для вложенных свайперов
                        >
                            {filteredPosts.length > 0 ? (
                                filteredPosts.map((post: Post) => (
                                    <SwiperSlide key={post.id}>
                                      <div className="flex items-center justify-center h-full">
                                        <PostCard post={post} />
                                      </div>
                                    </SwiperSlide>
                                ))
                            ) : (
                                <SwiperSlide>
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-white/80">No posts found in this category.</p>
                                    </div>
                                </SwiperSlide>
                            )}
                        </Swiper>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    </div>
  );
}
