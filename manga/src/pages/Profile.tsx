import { Star, BookOpen, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimeCard from "@/components/AnimeCard";
import animeCover1 from "@/assets/anime-cover-1.jpg";
import animeCover2 from "@/assets/anime-cover-2.jpg";

const Profile = () => {
  const user = {
    name: "Anime Fan",
    email: "fan@mangaverse.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
    watchlistCount: 24,
    reviewsCount: 12,
  };

  const watchlist = [
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
  ];

  const reviews = [
    {
      id: "1",
      title: "Cyber Nexus Chronicles",
      rating: 5,
      text: "Amazing anime! The animation quality is top-notch and the story keeps you hooked.",
      date: "2 days ago",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <Card className="p-8 mb-8 border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-24 w-24 rounded-2xl object-cover border-2 border-primary/50"
                />
                <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-primary flex items-center justify-center border-2 border-background">
                  <Star className="h-4 w-4 text-white" fill="currentColor" />
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-accent" />
                    <span className="text-sm">
                      <span className="font-semibold">{user.watchlistCount}</span> in watchlist
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm">
                      <span className="font-semibold">{user.reviewsCount}</span> reviews
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Content Tabs */}
          <Tabs defaultValue="watchlist" className="space-y-8">
            <TabsList className="bg-card/50">
              <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="watchlist" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {watchlist.map((item) => (
                  <AnimeCard key={item.id} {...item} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              {reviews.map((review) => (
                <Card
                  key={review.id}
                  className="p-6 border-border/50 bg-card/50 backdrop-blur-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-foreground">{review.title}</h3>
                        <p className="text-sm text-muted-foreground">{review.date}</p>
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 border border-primary/50">
                        <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
                        <span className="font-semibold">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.text}</p>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
