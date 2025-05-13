
export function Footer() {
  return (
    <footer className="py-6 px-4 md:px-8 border-t border-border/60 mt-auto bg-card">
      <div className="container mx-auto text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Visionary Spaces. Reimagine your world.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          <strong>Created by Rudraksh Tripathi</strong>
        </p>
      </div>
    </footer>
  );
}
