import { useState } from "react";
import { Wand2, Sparkles, Upload, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const AIGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const presetPrompts = [
    "Cyberpunk anime girl with neon hair",
    "Mecha warrior in epic battle",
    "Magical fantasy landscape",
    "Anime portrait in watercolor style",
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a prompt to generate an image",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("http://localhost:4070/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          genre: "anime",
          prompt: prompt,
          count: 1,
        }),
      });

      const data = await response.json();

      if (data.ok) {
        setGeneratedImage(`http://localhost:4070${data.imageUrl}`);
        toast({
          title: "Image generated!",
          description: "Your anime artwork is ready",
        });
      } else {
        throw new Error(data.error || "Failed to generate image");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate image",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 space-y-4 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/50 mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">AI Powered</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold">
              <span className="bg-gradient-neon bg-clip-text text-transparent">
                Anime Art Generator
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your ideas into stunning anime artwork using advanced AI
            </p>
          </div>

          {/* Generator Interface */}
          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="text2img" className="space-y-8">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-card/50">
                <TabsTrigger value="text2img">Text → Anime</TabsTrigger>
                <TabsTrigger value="img2img">Photo → Anime</TabsTrigger>
              </TabsList>

              <TabsContent value="text2img" className="space-y-6">
                <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-foreground">
                      Describe your anime artwork
                    </label>
                    <Textarea
                      placeholder="E.g., A cyberpunk anime girl with glowing purple hair, neon city background, highly detailed..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-32 bg-background/50 resize-none"
                    />
                    
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Quick presets:</p>
                      <div className="flex flex-wrap gap-2">
                        {presetPrompts.map((preset) => (
                          <Badge
                            key={preset}
                            variant="secondary"
                            className="cursor-pointer hover:bg-primary/20 transition-colors"
                            onClick={() => setPrompt(preset)}
                          >
                            {preset}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      variant="neon"
                      size="lg"
                      className="w-full"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <div className="h-5 w-5 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-2 h-5 w-5" />
                          Generate Artwork
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="img2img" className="space-y-6">
                <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-foreground">
                      Upload your photo
                    </label>
                    <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG up to 10MB
                      </p>
                    </div>

                    <Textarea
                      placeholder="Describe the anime style you want (optional)..."
                      className="min-h-24 bg-background/50 resize-none"
                    />

                    <Button variant="neon" size="lg" className="w-full">
                      <Wand2 className="mr-2 h-5 w-5" />
                      Transform to Anime
                    </Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Generated Result */}
            {generatedImage && (
              <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm animate-scale-in">
                <h3 className="text-xl font-bold mb-4 text-foreground">Generated Artwork</h3>
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={generatedImage}
                      alt="Generated"
                      className="w-full object-contain max-h-[600px] mx-auto"
                    />
                  </div>
                  <div className="flex justify-center gap-4">
                    <Button variant="outline" size="lg" onClick={() => {
                      if (generatedImage) {
                        const link = document.createElement('a');
                        link.href = generatedImage;
                        link.download = generatedImage.split('/').pop() || 'manga-artwork.png';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }
                    }}>
                      <Download className="mr-2 h-5 w-5" />
                      Download
                    </Button>
                    <Button variant="neon" size="lg" onClick={() => {
                      setGeneratedImage(null);
                      setPrompt("");
                    }}>
                      Generate Another
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGenerator;
