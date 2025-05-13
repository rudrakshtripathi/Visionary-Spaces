import { Palette } from 'lucide-react';

interface HeaderProps {
  userName?: string | null;
}

export function Header({ userName }: HeaderProps) {
  return (
    <header className="py-6 px-4 md:px-8 border-b border-border/60 shadow-sm bg-card">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2">
          {/* Left side: Logo and Title */}
          <div className="flex items-center gap-3">
            <Palette className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Visionary Spaces
            </h1>
          </div>
          {/* Right side: Welcome message */}
          {userName && (
            <div className="text-right mt-2 sm:mt-0">
              <p className="text-lg text-muted-foreground">
                Welcome, <span className="font-semibold text-primary">{userName}</span>!
              </p>
            </div>
          )}
        </div>
        {/* Centered Quote below */}
        <p className="text-lg font-bold text-foreground text-center mt-3">
          Redesign the space. Redefine the vibe.
        </p>
      </div>
    </header>
  );
}
