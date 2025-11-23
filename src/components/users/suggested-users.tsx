
'use client';

import { User } from "@/types";
import { UserCard } from "./user-card";
import { motion } from "framer-motion";
import { RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";

interface SuggestedUsersProps {
  initialUsers: User[];
}

// MOCK: In a real app, this would be a server action `getSuggestedUsers`
async function fetchNewSuggestions(): Promise<User[]> {
    console.log("--- MOCKED: Fetching new user suggestions ---");
    await new Promise(r => setTimeout(r, 500)); // Simulate delay
    // Return a new set of mock users
    const timestamp = Date.now();
    return [
        { id: `mock-${timestamp}-1`, name: 'New User A', username: 'newusera', avatarUrl: `https://i.pravatar.cc/150?u=new-a-${timestamp}` },
        { id: `mock-${timestamp}-2`, name: 'New User B', username: 'newuserb', avatarUrl: `https://i.pravatar.cc/150?u=new-b-${timestamp}` },
        { id: `mock-${timestamp}-3`, name: 'New User C', username: 'newuserc', avatarUrl: `https://i.pravatar.cc/150?u=new-c-${timestamp}` },
    ];
}

export function SuggestedUsers({ initialUsers }: SuggestedUsersProps) {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [isPending, startTransition] = useTransition();

    const handleRefresh = () => {
        startTransition(async () => {
            const newUsers = await fetchNewSuggestions();
            setUsers(newUsers);
        });
    };

  return (
    <motion.div 
        className="bg-card/50 backdrop-blur-lg border border-border/20 rounded-xl p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
    >
        <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">Who to Follow</h2>
            <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isPending}>
                <RefreshCw className={isPending ? "animate-spin" : ""} size={16}/>
            </Button>
        </div>
        <div className="space-y-3">
            {users.map((user) => (
                <UserCard key={user.id} user={user} />
            ))}
        </div>
    </motion.div>
  );
}
