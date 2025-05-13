'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-lg">
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
      <footer className="py-6 mt-8 text-center">
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
