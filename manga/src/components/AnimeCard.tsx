import { Link } from "react-router-dom";
import { Star, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AnimeCardProps {
  id: string;
  title: string;
  coverUrl: string;
  rating: number;
  tags: string[];
  type: "anime" | "manga";
}

const AnimeCard = ({ id, title, coverUrl, rating, tags, type }: AnimeCardProps) => {
  const linkTo = type === "anime" ? `/anime/${id}` : `/manga/${id}`;

  return (
    <Link to={linkTo} className="group">
      <Card className="relative overflow-hidden rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-glow-primary">
        <div className="aspect-[2/3] relative overflow-hidden">
          <img
            src={coverUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center border-2 border-primary">
                <Play className="h-8 w-8 text-primary ml-1" fill="currentColor" />
              </div>
            </div>
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm">
            <Star className="h-3 w-3 text-yellow-400" fill="currentColor" />
            <span className="text-xs font-semibold text-white">{rating}</span>
          </div>
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs px-2 py-0 bg-secondary/50">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default AnimeCard;
