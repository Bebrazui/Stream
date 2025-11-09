import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const categories = [
    { name: "Programming", href: "/search?q=programming" },
    { name: "Nature", href: "/search?q=nature" },
    { name: "Games", href: "/search?q=games" },
    { name: "Other", href: "/search?q=other" },
];

export function RightSidebar() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col space-y-2">
                        {categories.map((category) => (
                            <Button key={category.name} variant="ghost" className="justify-start" asChild>
                                <Link href={category.href}>{category.name}</Link>
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Who to follow</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Coming soon!</p>
                </CardContent>
            </Card>
        </div>
    )
}
