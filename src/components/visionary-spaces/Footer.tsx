
import { Github, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-6 px-4 md:px-8 border-t border-border/60 mt-auto bg-transparent">
      <div className="container mx-auto text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Visionary Spaces. Reimagine your world.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          <strong>Created by Rudraksh Tripathi</strong>
        </p>
        <div className="flex justify-center items-center space-x-4 mt-2">
          <a
            href="https://github.com/rudrakshtripathi"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Rudraksh Tripathi's GitHub profile"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/rudraksh--tripathi/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Rudraksh Tripathi's LinkedIn profile"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

