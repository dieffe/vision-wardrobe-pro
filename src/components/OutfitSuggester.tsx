import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sparkles, RefreshCw, Briefcase, Sun, Moon, Coffee, Heart, Music, X, ChevronLeft } from "lucide-react";
import { ClothingItem } from "./ClothingCard";

interface OutfitSuggesterProps {
  open: boolean;
  onClose: () => void;
  wardrobe: ClothingItem[];
}

const occasions = [
  { id: "work", label: "Work", icon: Briefcase, description: "Professional" },
  { id: "casual", label: "Casual", icon: Coffee, description: "Relaxed" },
  { id: "evening", label: "Evening", icon: Moon, description: "Chic" },
  { id: "date", label: "Date Night", icon: Heart, description: "Romantic" },
  { id: "weekend", label: "Weekend", icon: Sun, description: "Comfortable" },
  { id: "party", label: "Party", icon: Music, description: "Festive" },
];

const outfitSuggestions: Record<string, { title: string; description: string; pieces: string[] }[]> = {
  work: [
    { title: "The Power Edit", description: "Sharp, confident and effortlessly professional.", pieces: ["Black Blazer", "Silk Blouse", "Wide-leg Trousers"] },
    { title: "Quiet Luxury", description: "Understated elegance that commands attention.", pieces: ["Camel Trousers", "White Silk Blouse"] },
  ],
  casual: [{ title: "Weekend Ease", description: "Put-together without trying.", pieces: ["Silk Blouse", "Camel Trousers"] }],
  evening: [{ title: "Evening Bloom", description: "Feminine and quietly glamorous.", pieces: ["Floral Midi Dress", "Black Blazer"] }],
  date: [{ title: "Soft Romantic", description: "Delicate and dreamy for a special evening.", pieces: ["Floral Midi Dress"] }],
  weekend: [{ title: "Sunday Mood", description: "Relaxed layers for a slow day.", pieces: ["Silk Blouse", "Wide-leg Trousers"] }],
  party: [{ title: "Festive Chic", description: "Stand out with effortless confidence.", pieces: ["Floral Midi Dress", "Black Blazer"] }],
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
  const wardrobeImages = wardrobe.slice(0, 4);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="h-[90dvh] rounded-t-3xl p-0 border-0 ios-modal-bg max-w-[430px] mx-auto left-1/2 -translate-x-1/2"
      >
        <div className="ios-sheet-handle" />

        {/* iOS navigation */}
        <div className="flex items-center justify-between px-5 pt-3 pb-1">
          {selectedOccasion ? (
            <button
              onClick={() => setSelectedOccasion(null)}
              className="flex items-center gap-0.5 text-[16px] font-medium text-accent active:opacity-60"
            >
              <ChevronLeft size={20} strokeWidth={2.5} /> Back
            </button>
          ) : <div className="w-16" />}

          <div className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-accent" />
            <h2 className="text-[17px] font-semibold text-foreground tracking-tight">AI Stylist</h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center active:opacity-60"
          >
            <X size={15} className="text-muted-foreground" />
          </button>
        </div>

        <div className="overflow-y-auto h-full pb-10 px-4 pt-4">
          {!selectedOccasion && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">What's the occasion?</p>
                <p className="text-[14px] text-muted-foreground mt-1">I'll build the perfect outfit from your wardrobe.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                {occasions.map((occ) => {
                  const Icon = occ.icon;
                  return (
                    <button
                      key={occ.id}
                      onClick={() => handleOccasionSelect(occ.id)}
                      className="text-left rounded-2xl p-4 bg-card border border-border active:scale-95 transition-transform"
                    >
                      <div className="w-9 h-9 rounded-xl gradient-rose flex items-center justify-center mb-3">
                        <Icon size={16} className="text-primary-foreground" />
                      </div>
                      <p className="text-[15px] font-semibold text-foreground">{occ.label}</p>
                      <p className="text-[12px] text-muted-foreground mt-0.5">{occ.description}</p>
                    </button>
                  );
                })}
              </div>

              {wardrobe.length > 0 && (
                <div className="pt-2">
                  <p className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-1">Your Wardrobe</p>
                  <div className="grid grid-cols-4 gap-2">
                    {wardrobe.slice(0, 8).map((item) => (
                      <div key={item.id} className="aspect-[2/3] rounded-xl overflow-hidden bg-muted">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedOccasion && (
            <div className="animate-slide-up space-y-4">
              <div>
                <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">
                  {occasions.find((o) => o.id === selectedOccasion)?.label}
                </p>
                <p className="text-[14px] text-muted-foreground mt-1">Your AI-curated outfit</p>
              </div>

              {isGenerating ? (
                <div className="rounded-2xl border border-border bg-card p-8 flex flex-col items-center gap-4">
                  <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-2.5 h-2.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                  </div>
                  <p className="text-[14px] text-muted-foreground">Curating your perfect look…</p>
                </div>
              ) : currentOutfit ? (
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-[18px] font-bold text-foreground tracking-tight">{currentOutfit.title}</p>
                        <p className="text-[13px] text-muted-foreground mt-0.5">{currentOutfit.description}</p>
                      </div>
                      {currentSuggestions.length > 1 && (
                        <button
                          onClick={() => {
                            setIsGenerating(true);
                            setTimeout(() => {
                              setOutfitIndex((p) => (p + 1) % currentSuggestions.length);
                              setIsGenerating(false);
                            }, 900);
                          }}
                          className="p-2.5 rounded-xl bg-muted active:opacity-60"
                        >
                          <RefreshCw size={14} className="text-muted-foreground" />
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {wardrobeImages.slice(0, currentOutfit.pieces.length).map((item, i) => (
                        <div key={item.id} className="flex-1 rounded-xl overflow-hidden aspect-[2/3] bg-muted">
                          <img src={item.image} alt={currentOutfit.pieces[i]} className="w-full h-full object-cover object-top" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Pieces</p>
                    {currentOutfit.pieces.map((piece, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                        <p className="text-[14px] text-foreground">{piece}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
