import { ArrowRight, TrendingUp, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AnimeCard from "@/components/AnimeCard";
import { Button } from "@/components/ui/button";
import heroBanner from "@/assets/hero-banner.jpg";
import animeCover1 from "@/assets/anime-cover-1.jpg";
import animeCover2 from "@/assets/anime-cover-2.jpg";
import animeCover3 from "@/assets/anime-cover-3.jpg";
import mangaCover1 from "@/assets/manga-cover-1.jpg";

const Home = () => {
  const trendingAnime = [
    {
      id: "1",
      title: "Cyber Nexus Chronicles",
      coverUrl: animeCover1,
      rating: 4.8,
      tags: ["Action", "Sci-Fi"],
      type: "anime" as const,
    },
    {
      id: "2",
      title: "Mystic Realm Guardians",
      coverUrl: animeCover2,
      rating: 4.6,
      tags: ["Fantasy", "Magic"],
      type: "anime" as const,
    },
    {
      id: "3",
      title: "Mecha Revolution",
      coverUrl: animeCover3,
      rating: 4.7,
      tags: ["Mecha", "Action"],
      type: "anime" as const,
    },
  ];

  const latestManga = [
    {
      id: "1",
      title: "Shadow Legends",
      coverUrl: mangaCover1,
      rating: 4.9,
      tags: ["Adventure", "Mystery"],
      type: "manga" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBanner}
            alt="Hero"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl space-y-6 animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-neon bg-clip-text text-transparent">
                Your Gateway to
              </span>
              <br />
              <span className="text-foreground">Infinite Anime</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Stream anime, read manga, and create AI-powered anime art all in one place
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/anime/1">
                <Button variant="neon" size="lg" className="group">
                  Start Watching
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/ai-generator">
                <Button variant="outline" size="lg">
                  Try AI Generator
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Anime */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">Trending Anime</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {trendingAnime.map((anime) => (
            <AnimeCard key={anime.id} {...anime} />
          ))}
        </div>
      </section>

      {/* Latest Manga */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="h-6 w-6 text-accent" />
          <h2 className="text-3xl font-bold text-foreground">Latest Manga</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {latestManga.map((manga) => (
            <AnimeCard key={manga.id} {...manga} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
