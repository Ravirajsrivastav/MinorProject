import { Link } from "react-router-dom";
import { Sparkles, Home, BookOpen, Wand2, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-primary group-hover:animate-glow" />
              <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/40 transition-all" />
            </div>
            <span className="text-2xl font-bold bg-gradient-neon bg-clip-text text-transparent">
              Mangaverse
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Home className="h-5 w-5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link to="/manga/1" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <BookOpen className="h-5 w-5" />
              <span className="hidden sm:inline">Manga</span>
            </Link>
            <Link to="/ai-generator" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Wand2 className="h-5 w-5" />
              <span className="hidden sm:inline">AI Generator</span>
            </Link>
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
