import { Palette } from 'lucide-react';

export function Header() {
  return (
    <header className="py-6 px-4 md:px-8 border-b border-border/60 shadow-sm bg-card">
      <div className="container mx-auto flex items-center gap-3">
        <Palette className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Visionary Spaces
        </h1>
      </div>
    </header>
  );
}
