import { useState, useRef, useEffect } from "react";
import { Wand2, Sparkles, Upload, Download, X, Settings } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface RefinementOptions {
  contrast: number;
  lineWeight: 'light' | 'medium' | 'bold';
  shadingStyle: 'screentone' | 'crosshatch' | 'minimal';
  detailLevel: 'simple' | 'detailed' | 'complex';
}

const AIGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [styleReference, setStyleReference] = useState<File | null>(null);
  const [stylePreview, setStylePreview] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showRefinement, setShowRefinement] = useState(false);
  const [refinementOptions, setRefinementOptions] = useState<RefinementOptions>({
    contrast: 50,
    lineWeight: 'medium',
    shadingStyle: 'screentone',
    detailLevel: 'detailed',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const styleInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const presetPrompts = [
    "Cyberpunk anime girl with neon hair",
    "Mecha warrior in epic battle",
    "Magical fantasy landscape",
    "Anime portrait in watercolor style",
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, isStyleReference = false) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 10MB",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (PNG, JPG)",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (isStyleReference) {
          setStyleReference(file);
          setStylePreview(result);
        } else {
          setUploadedImage(file);
          setImagePreview(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (isStyleReference = false) => {
    if (isStyleReference) {
      setStyleReference(null);
      setStylePreview(null);
      if (styleInputRef.current) styleInputRef.current.value = '';
    } else {
      setUploadedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const AnimatedScrollbar = ({ value, onChange, min = 0, max = 100, label }: {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    label: string;
  }) => {
    const [isDragging, setIsDragging] = useState(false);
    const scrollbarRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
      updateValue(e);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateValue(e as unknown as React.MouseEvent);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const updateValue = (e: React.MouseEvent) => {
      if (scrollbarRef.current) {
        const rect = scrollbarRef.current.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const newValue = Math.round(min + percentage * (max - min));
        onChange(newValue);
      }
    };

    useEffect(() => {
      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
      }
    }, [isDragging]);

    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className="text-primary font-medium">{value}</span>
        </div>
        <div
          ref={scrollbarRef}
          className="relative h-2 bg-muted rounded-full cursor-pointer hover:bg-muted/80 transition-colors"
          onMouseDown={handleMouseDown}
        >
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-200 ease-out"
            style={{ width: `${percentage}%` }}
          />
          <div
            className="absolute top-1/2 w-4 h-4 bg-primary border-2 border-background rounded-full shadow-lg transform -translate-y-1/2 transition-all duration-200 ease-out hover:scale-110"
            style={{ left: `${percentage}%`, transform: 'translate(-50%, -50%)' }}
          />
        </div>
      </div>
    );
  };

  const OptionSelector = ({ value, onChange, options, label }: {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    label: string;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
      <div className="space-y-2" ref={ref}>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{label}</span>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full p-2 bg-background border border-border rounded-lg text-left hover:bg-muted/50 transition-colors flex items-center justify-between"
          >
            <span>{selectedOption?.label}</span>
            <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-lg shadow-lg overflow-hidden">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2 text-left hover:bg-primary/10 transition-colors ${
                    value === option.value ? 'bg-primary/20 text-primary' : ''
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleGenerate = async (mode: 'text2img' | 'img2img' | 'styleTransfer') => {
    if (!prompt.trim() && mode !== 'img2img') {
      toast({
        title: "Prompt required",
        description: "Please enter a prompt to generate an image",
        variant: "destructive",
      });
      return;
    }

    if (mode === 'img2img' && !uploadedImage) {
      toast({
        title: "Image required",
        description: "Please upload an image to transform",
        variant: "destructive",
      });
      return;
    }

    if (mode === 'styleTransfer' && !styleReference) {
      toast({
        title: "Style reference required",
        description: "Please upload a style reference image",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const formData = new FormData();
      
      if (mode === 'img2img' && uploadedImage) {
        formData.append('image', uploadedImage);
      }
      
      if (mode === 'styleTransfer' && styleReference) {
        formData.append('styleReference', styleReference);
      }

      formData.append('genre', 'anime');
      formData.append('prompt', prompt);
      formData.append('count', '1');
      formData.append('mode', mode);
      formData.append('refinementOptions', JSON.stringify(refinementOptions));

      const response = await fetch("http://localhost:4070/api/generate", {
        method: "POST",
        body: formData,
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
            {/* Refinement Panel */}
            <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Refinement Options</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRefinement(!showRefinement)}
                >
                  {showRefinement ? 'Hide' : 'Show'} Options
                </Button>
              </div>
              
              {showRefinement && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                  <AnimatedScrollbar
                    value={refinementOptions.contrast}
                    onChange={(value) => setRefinementOptions(prev => ({ ...prev, contrast: value }))}
                    min={0}
                    max={100}
                    label="Contrast"
                  />
                  
                  <OptionSelector
                    value={refinementOptions.lineWeight}
                    onChange={(value) => setRefinementOptions(prev => ({ ...prev, lineWeight: value as 'light' | 'medium' | 'bold' }))}
                    options={[
                      { value: 'light', label: 'Light Lines' },
                      { value: 'medium', label: 'Medium Lines' },
                      { value: 'bold', label: 'Bold Lines' },
                    ]}
                    label="Line Weight"
                  />
                  
                  <OptionSelector
                    value={refinementOptions.shadingStyle}
                    onChange={(value) => setRefinementOptions(prev => ({ ...prev, shadingStyle: value as 'screentone' | 'crosshatch' | 'minimal' }))}
                    options={[
                      { value: 'screentone', label: 'Screentone' },
                      { value: 'crosshatch', label: 'Crosshatch' },
                      { value: 'minimal', label: 'Minimal' },
                    ]}
                    label="Shading Style"
                  />
                  
                  <OptionSelector
                    value={refinementOptions.detailLevel}
                    onChange={(value) => setRefinementOptions(prev => ({ ...prev, detailLevel: value as 'simple' | 'detailed' | 'complex' }))}
                    options={[
                      { value: 'simple', label: 'Simple' },
                      { value: 'detailed', label: 'Detailed' },
                      { value: 'complex', label: 'Complex' },
                    ]}
                    label="Detail Level"
                  />
                </div>
              )}
            </Card>

            <Tabs defaultValue="text2img" className="space-y-8">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-card/50">
                <TabsTrigger value="text2img">Text → Anime</TabsTrigger>
                <TabsTrigger value="img2img">Photo → Anime</TabsTrigger>
                <TabsTrigger value="styleTransfer">Style Transfer</TabsTrigger>
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
                      onClick={() => handleGenerate('text2img')}
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
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => handleFileUpload(e, false)}
                      accept="image/*"
                      className="hidden"
                    />
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Uploaded"
                          className="w-full max-h-64 object-cover rounded-xl"
                        />
                        <button
                          onClick={() => removeFile(false)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-muted-foreground">
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                    )}

                    <Textarea
                      placeholder="Describe the anime style you want (optional)..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-24 bg-background/50 resize-none"
                    />

                    <Button 
                      variant="neon" 
                      size="lg" 
                      className="w-full"
                      onClick={() => handleGenerate('img2img')}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <div className="h-5 w-5 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Transforming...
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-2 h-5 w-5" />
                          Transform to Anime
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="styleTransfer" className="space-y-6">
                <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="text-sm font-semibold text-foreground">
                        Upload style reference
                      </label>
                      <input
                        type="file"
                        ref={styleInputRef}
                        onChange={(e) => handleFileUpload(e, true)}
                        accept="image/*"
                        className="hidden"
                      />
                      {stylePreview ? (
                        <div className="relative">
                          <img
                            src={stylePreview}
                            alt="Style reference"
                            className="w-full max-h-64 object-cover rounded-xl"
                          />
                          <button
                            onClick={() => removeFile(true)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div 
                          className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
                          onClick={() => styleInputRef.current?.click()}
                        >
                          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground mb-2">
                            Click to upload style reference
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Upload your favorite manga artist's style
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-semibold text-foreground">
                        Describe what you want to generate
                      </label>
                      <Textarea
                        placeholder="E.g., A character in the style of the uploaded reference, fighting scene, dramatic pose..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-32 bg-background/50 resize-none"
                      />
                    </div>

                    <Button 
                      variant="neon" 
                      size="lg" 
                      className="w-full"
                      onClick={() => handleGenerate('styleTransfer')}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <div className="h-5 w-5 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Applying Style...
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-2 h-5 w-5" />
                          Apply Style Transfer
                        </>
                      )}
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
                      setUploadedImage(null);
                      setImagePreview(null);
                      setStyleReference(null);
                      setStylePreview(null);
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
