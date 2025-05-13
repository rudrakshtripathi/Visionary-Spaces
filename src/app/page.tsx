'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Sparkles } from 'lucide-react';

export default function WelcomePage() {
  const [userName, setUserName] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      router.push(`/design?name=${encodeURIComponent(userName.trim())}`);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden">
      <Image
        src="https://picsum.photos/1920/1080"
        alt="Abstract bedroom background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 -z-10 opacity-30"
        data-ai-hint="bedroom interior"
        priority
      />
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-background to-secondary/30" />
      
      <main className="z-10 flex flex-col items-center justify-center flex-1 w-full">
        <Card className="w-full max-w-md shadow-2xl rounded-lg bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
              <Palette className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">Welcome to Visionary Spaces</CardTitle>
            <CardDescription className="text-md text-muted-foreground pt-2">
              Enter your name and let's begin your journey of imagination.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="text"
                placeholder="Your Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="h-12 text-lg"
                required
                aria-label="Your Name"
              />
              <Button type="submit" className="w-full h-12 text-lg" disabled={!userName.trim()}>
                <Sparkles className="mr-2 h-5 w-5" />
                Begin Your Imagination
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <footer className="z-10 py-6 mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Visionary Spaces.
        </p>
         <p className="text-sm text-muted-foreground mt-1">
          <strong>Created by Rudraksh Tripathi</strong>
        </p>
      </footer>
    </div>
  );
}
