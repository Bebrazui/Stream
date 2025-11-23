'use client';

import Link from "next/link";
import { SuggestedUsers } from '@/components/users/suggested-users';
import { Button } from "@/components/ui/button";

const categories = [
    { name: "Programming", href: "/search?q=programming" },
    { name: "Nature", href: "/search?q=nature" },
    { name: "Games", href: "/search?q=games" },
    { name: "Other", href: "/search?q=other" },
];

// A sidebar that blends into the dark parallax background
export function RightSidebar() {
    return (
        <div className="space-y-8 p-4 text-white/90">
            {/* Categories Section */}
            <div className="space-y-4">
                <h3 className="px-4 text-lg font-semibold tracking-tight">Categories</h3>
                <div className="flex flex-col space-y-1">
                    {categories.map((category) => (
                        <Button 
                            key={category.name} 
                            variant="ghost" 
                            className="justify-start px-4 py-2 text-base text-white/80 hover:bg-white/10 hover:text-white"
                            asChild
                        >
                            <Link href={category.href}>{category.name}</Link>
                        </Button>
                    ))}
                </div>
            </div>

            {/* Suggested Users Section */}
            <div className="space-y-4">
                <h3 className="px-4 text-lg font-semibold tracking-tight">Who to follow</h3>
                <div className="px-4">
                    <SuggestedUsers initialUsers={[]} />
                </div>
            </div>
        </div>
    )
}
