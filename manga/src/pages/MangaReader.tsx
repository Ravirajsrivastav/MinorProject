import { useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import mangaCover1 from "@/assets/manga-cover-1.jpg";

const MangaReader = () => {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 45;

  const manga = {
    id: "1",
    title: "Shadow Legends",
    chapter: "Chapter 1: The Beginning",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        {/* Reader Controls */}
        <div className="sticky top-16 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <h1 className="font-bold text-foreground">{manga.title}</h1>
                  <p className="text-sm text-muted-foreground">{manga.chapter}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Select defaultValue="1">
                  <SelectTrigger className="w-[180px] bg-card/50">
                    <SelectValue placeholder="Select chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Chapter 1</SelectItem>
                    <SelectItem value="2">Chapter 2</SelectItem>
                    <SelectItem value="3">Chapter 3</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium px-3">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Manga Pages */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card
                key={i}
                className="overflow-hidden rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm animate-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <img
                  src={mangaCover1}
                  alt={`Page ${currentPage + i}`}
                  className="w-full object-contain"
                />
              </Card>
            ))}
          </div>

          {/* Navigation */}
          <div className="max-w-3xl mx-auto mt-8 flex justify-between">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="mr-2 h-5 w-5" />
              Previous
            </Button>
            <Button
              variant="neon"
              size="lg"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaReader;
