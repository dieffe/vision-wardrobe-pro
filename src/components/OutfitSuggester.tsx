import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, Briefcase, Sun, Moon, Coffee, Heart, Music } from "lucide-react";
import { ClothingItem } from "./ClothingCard";

interface OutfitSuggesterProps {
  open: boolean;
  onClose: () => void;
  wardrobe: ClothingItem[];
}

const occasions = [
  { id: "work", label: "Work", icon: Briefcase, description: "Professional & polished" },
  { id: "casual", label: "Casual", icon: Coffee, description: "Relaxed & effortless" },
  { id: "evening", label: "Evening", icon: Moon, description: "Chic & sophisticated" },
  { id: "date", label: "Date Night", icon: Heart, description: "Romantic & confident" },
  { id: "weekend", label: "Weekend", icon: Sun, description: "Comfortable & stylish" },
  { id: "party", label: "Party", icon: Music, description: "Bold & festive" },
];

const outfitSuggestions: Record<string, { title: string; description: string; pieces: string[] }[]> = {
  work: [
    { title: "The Power Edit", description: "Sharp, confident and effortlessly professional.", pieces: ["Black Blazer", "Silk Blouse", "Wide-leg Trousers"] },
    { title: "Quiet Luxury", description: "Understated elegance that commands attention.", pieces: ["Camel Trousers", "White Silk Blouse"] },
  ],
  casual: [
    { title: "Weekend Ease", description: "Put-together without trying.", pieces: ["Silk Blouse", "Camel Trousers"] },
  ],
  evening: [
    { title: "Evening Bloom", description: "Feminine and quietly glamorous.", pieces: ["Floral Midi Dress", "Black Blazer"] },
  ],
  date: [
    { title: "Soft Romantic", description: "Delicate and dreamy for a special evening.", pieces: ["Floral Midi Dress"] },
  ],
  weekend: [
    { title: "Sunday Mood", description: "Relaxed layers for a slow day.", pieces: ["Silk Blouse", "Wide-leg Trousers"] },
  ],
  party: [
    { title: "Festive Chic", description: "Stand out with effortless confidence.", pieces: ["Floral Midi Dress", "Black Blazer"] },
  ],
};

export const OutfitSuggester = ({ open, onClose, wardrobe }: OutfitSuggesterProps) => {
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [outfitIndex, setOutfitIndex] = useState(0);

  const handleOccasionSelect = (id: string) => {
    setSelectedOccasion(id);
    setIsGenerating(true);
    setOutfitIndex(0);
    setTimeout(() => setIsGenerating(false), 1600);
  };

  const currentSuggestions = selectedOccasion ? outfitSuggestions[selectedOccasion] || [] : [];
  const currentOutfit = currentSuggestions[outfitIndex];

  const handleRefresh = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setOutfitIndex((prev) => (prev + 1) % currentSuggestions.length);
      setIsGenerating(false);
    }, 1000);
  };

  const wardrobeImages = wardrobe.slice(0, 4);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg bg-background border-border p-0 overflow-y-auto">
        {/* Header */}
        <div className="px-8 pt-10 pb-6 gradient-hero border-b border-border">
          <SheetHeader className="text-left">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full gradient-rose flex items-center justify-center">
                <Sparkles size={14} className="text-primary-foreground" />
              </div>
              <span className="font-body text-xs uppercase tracking-widest text-muted-foreground">AI Stylist</span>
            </div>
            <SheetTitle className="font-display text-3xl font-light text-foreground leading-tight">
              What's the occasion?
            </SheetTitle>
            <p className="font-body text-sm text-muted-foreground mt-1">
              I'll build the perfect outfit from your wardrobe.
            </p>
          </SheetHeader>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Occasion picker */}
          <div className="grid grid-cols-2 gap-3">
            {occasions.map((occ) => {
              const Icon = occ.icon;
              const isSelected = selectedOccasion === occ.id;
              return (
                <button
                  key={occ.id}
                  onClick={() => handleOccasionSelect(occ.id)}
                  className={`relative text-left rounded-xl p-4 border transition-all duration-200 ${
                    isSelected
                      ? "border-accent bg-rose-light shadow-soft"
                      : "border-border bg-card hover:border-accent/40 hover:bg-muted/50"
                  }`}
                >
                  <Icon size={18} className={isSelected ? "text-accent" : "text-muted-foreground"} />
                  <p className={`font-body font-medium text-sm mt-2 ${isSelected ? "text-foreground" : "text-foreground"}`}>
                    {occ.label}
                  </p>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">{occ.description}</p>
                </button>
              );
            })}
          </div>

          {/* Outfit suggestion */}
          {selectedOccasion && (
            <div className="animate-slide-up">
              {isGenerating ? (
                <div className="rounded-2xl border border-border bg-card p-6 flex flex-col items-center gap-4">
                  <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2.5 h-2.5 rounded-full bg-accent animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>
                  <p className="font-body text-sm text-muted-foreground">Curating your perfect look…</p>
                </div>
              ) : currentOutfit ? (
                <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-card">
                  {/* Outfit pieces */}
                  <div className="p-5 border-b border-border">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-display text-xl text-foreground">{currentOutfit.title}</p>
                        <p className="font-body text-sm text-muted-foreground mt-0.5">{currentOutfit.description}</p>
                      </div>
                      {currentSuggestions.length > 1 && (
                        <button
                          onClick={handleRefresh}
                          className="p-2 rounded-full hover:bg-muted transition-colors"
                        >
                          <RefreshCw size={14} className="text-muted-foreground" />
                        </button>
                      )}
                    </div>

                    {/* Mannequin cards for the outfit pieces */}
                    <div className="flex gap-3">
                      {wardrobeImages.slice(0, currentOutfit.pieces.length).map((item, i) => (
                        <div key={item.id} className="flex-1 rounded-xl overflow-hidden aspect-[2/3] bg-muted shadow-soft">
                          <img
                            src={item.image}
                            alt={currentOutfit.pieces[i]}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-3">Pieces</p>
                    {currentOutfit.pieces.map((piece, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                        <p className="font-body text-sm text-foreground">{piece}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Wardrobe snapshot */}
          {!selectedOccasion && wardrobe.length > 0 && (
            <div>
              <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-3">Your wardrobe</p>
              <div className="grid grid-cols-4 gap-2">
                {wardrobe.slice(0, 8).map((item) => (
                  <div key={item.id} className="aspect-[2/3] rounded-lg overflow-hidden bg-muted shadow-soft">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
