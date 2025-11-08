'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lightbulb, Sparkles } from 'lucide-react';
import { suggestPost, type SuggestPostOutput } from '@/ai/flows/ai-post-suggestions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';

type AiSuggestionButtonProps = {
  onSuggestionClick: (suggestion: string) => void;
};

// Mock user activity
const mockUserActivity = `
- Liked a post about hiking in the mountains.
- Commented on a recipe for spicy noodles.
- Viewed several posts about new JavaScript frameworks.
- Followed a user who posts about photography.
- Liked a video of a cat playing the piano.
`;

export function AiSuggestionButton({ onSuggestionClick }: AiSuggestionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestPostOutput | null>(null);
  const { toast } = useToast();

  const handleFetchSuggestions = async () => {
    if (suggestions) return; // Don't re-fetch if we already have them

    setIsLoading(true);
    try {
      const result = await suggestPost({ userRecentActivity: mockUserActivity });
      setSuggestions(result);
    } catch (error) {
      console.error('Failed to get AI suggestions:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch AI suggestions. Please try again.',
      });
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseSuggestion = (suggestion: string) => {
    onSuggestionClick(suggestion);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handleFetchSuggestions}>
          <Lightbulb className="mr-2 h-4 w-4" />
          Get Suggestions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            AI Post Suggestions
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-28" />
                </div>
            </div>
             <div className="space-y-2">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-12 w-full" />
            </div>
          </div>
        ) : (
          suggestions && (
            <div className="space-y-6 py-4">
              <div>
                <h3 className="mb-3 font-semibold">Suggested Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {suggestions.topicSuggestions.map((topic, index) => (
                    <Button
                      key={index}
                      variant="secondary"
                      size="sm"
                      onClick={() => handleUseSuggestion(topic)}
                    >
                      {topic}
                    </Button>
                  ))}
                </div>
              </div>
               <div>
                <h3 className="mb-3 font-semibold">Suggested Formats</h3>
                <div className="flex flex-wrap gap-2">
                    {suggestions.formatSuggestions.map((format, index) => (
                        <Badge key={index} variant="outline">{format}</Badge>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">Reasoning</h3>
                <p className="text-sm text-muted-foreground">
                  {suggestions.reasoning}
                </p>
              </div>
            </div>
          )
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
