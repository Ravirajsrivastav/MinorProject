import { useParams } from "react-router-dom";
import { Star, Plus, Play } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import animeCover1 from "@/assets/anime-cover-1.jpg";

const AnimeDetail = () => {
  const { id } = useParams();

  const anime = {
    id: "1",
    title: "Cyber Nexus Chronicles",
    coverUrl: animeCover1,
    rating: 4.8,
    tags: ["Action", "Sci-Fi", "Thriller"],
    description:
      "In a dystopian future where humanity merges with technology, a group of rebels fights against an AI-controlled megacorporation that threatens human freedom. Follow the journey of elite hackers as they uncover dark secrets and battle for humanity's survival.",
    episodes: 24,
    status: "Ongoing",
    studio: "NeoAnime Studios",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        {/* Hero Section */}
        <div className="relative h-[50vh] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={anime.coverUrl}
              alt={anime.title}
              className="h-full w-full object-cover blur-xl scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 -mt-32 relative z-10">
          <div className="grid md:grid-cols-[300px,1fr] gap-8">
            {/* Poster */}
            <Card className="overflow-hidden rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm shadow-glow-primary">
              <img
                src={anime.coverUrl}
                alt={anime.title}
                className="w-full aspect-[2/3] object-cover"
              />
            </Card>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-neon bg-clip-text text-transparent">
                  {anime.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/50">
                    <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
                    <span className="font-semibold">{anime.rating}</span>
                  </div>
                  <Badge variant="secondary">{anime.status}</Badge>
                  <span className="text-muted-foreground">{anime.episodes} Episodes</span>
                  <span className="text-muted-foreground">{anime.studio}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {anime.tags.map((tag) => (
                    <Badge key={tag} className="bg-secondary/50">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {anime.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <Button variant="neon" size="lg" className="group">
                  <Play className="mr-2 h-5 w-5" fill="currentColor" />
                  Watch Episode 1
                </Button>
                <Button variant="outline" size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Add to Watchlist
                </Button>
              </div>

              {/* Video Player Placeholder */}
              <Card className="overflow-hidden rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="h-20 w-20 mx-auto rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center border-2 border-primary">
                      <Play className="h-10 w-10 text-primary ml-1" fill="currentColor" />
                    </div>
                    <p className="text-muted-foreground">Episode 1: The Awakening</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetail;
