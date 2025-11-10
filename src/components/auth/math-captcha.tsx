'use client';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { generateCaptcha } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';

// Function to get a random small rotation
const getRandomRotation = () => Math.floor(Math.random() * 15) - 7; // -7 to 7 degrees
// Function to get a random vertical shift
const getRandomVerticalShift = () => Math.floor(Math.random() * 6) - 3; // -3px to 3px


export function MathCaptcha() {
  const [question, setQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { setValue, control } = useFormContext();

  const fetchNewCaptcha = async () => {
    setIsLoading(true);
    try {
        const { captchaQuestion, captchaToken } = await generateCaptcha();
        setQuestion(captchaQuestion);
        setValue('captchaToken', captchaToken, { shouldValidate: true });
    } catch (error) {
        console.error("Failed to load CAPTCHA question.");
        setQuestion("Error loading question.");
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNewCaptcha();
  }, []);

  return (
    <div className="space-y-4">
        <div className="p-4 rounded-lg bg-stone-200 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 select-none flex justify-center items-center h-24">
            {isLoading ? (
                <Skeleton className="h-12 w-full" />
            ) : (
                <div 
                    className="flex items-center justify-center"
                    style={{ fontFamily: '"Sedgwick Ave Display", cursive', filter: 'blur(0.8px)' }}
                    aria-hidden="true" // Hide from screen readers as it's intentionally hard to read
                >
                    {question.split('').map((char, index) => (
                        <span 
                            key={index}
                            className="text-4xl font-bold text-stone-500 dark:text-stone-400"
                            style={{
                                display: 'inline-block',
                                transform: `rotate(${getRandomRotation()}deg) translateY(${getRandomVerticalShift()}px)`,
                                textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                                // Add a bit of random spacing as well
                                marginLeft: char === ' ' ? '1rem' : `${Math.random() * 4}px`,
                            }}
                        >
                            {char}
                        </span>
                    ))}
                </div>
            )}
        </div>
        {/* Accessible label for screen readers */}
        <label htmlFor="captchaAnswer" className="sr-only">Security Question: {question}</label>
      <FormField
        control={control}
        name="captchaAnswer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Your Answer</FormLabel>
            <FormControl>
              <Input {...field} id="captchaAnswer" placeholder="Enter the result" autoComplete="off" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="captchaToken"
        render={({ field }) => (
            <FormItem className="hidden">
                <FormControl>
                    <Input {...field} type="hidden" />
                </FormControl>
             </FormItem>
        )}
      />
    </div>
  );
}
