
import type { User } from "@/types";

// Демонстрационные данные пользователей
// В настоящем приложении это была бы база данных
export const USERS: User[] = [
    {
        id: '1',
        name: 'Alice Johnson',
        username: 'alicej',
        password: 'password123', // Пароли должны быть хешированы в продакшене!
        avatarUrl: '/avatars/alice.png',
        bannerUrl: '/banners/banner-1.jpg',
        bio: 'Full-stack developer with a passion for open-source and coffee. ☕'
    },
    {
        id: '2',
        name: 'Bob Smith',
        username: 'bobsmith',
        password: 'password123',
        avatarUrl: '/avatars/bob.png',
        bannerUrl: '/banners/banner-2.jpg',
        bio: 'Photographer and nature enthusiast. Capturing the beauty of the world, one photo at a time. 🌲📸'
    },
    {
        id: '3',
        name: 'Charlie Brown',
        username: 'charlieb',
        password: 'password123',
        avatarUrl: '/avatars/charlie.png',
        bannerUrl: '/banners/banner-3.jpg',
        bio: 'AI researcher exploring the frontiers of machine learning. Fascinated by LLMs and their potential.'
    },
    {
        id: '4',
        name: 'Diana Prince',
        username: 'diana',
        password: 'password123',
        avatarUrl: '/avatars/diana.png',
        bannerUrl: '/banners/banner-4.jpg',
        bio: 'Art historian & curator. Lover of ancient artifacts and mysterious stories.'
    },
];
