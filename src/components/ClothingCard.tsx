import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";

export interface ClothingItem {
  id: string;
  name: string;
  category: string;
  color: string;
  brand?: string;
  image: string;
  tags: string[];
  favorite: boolean;
  timesWorn: number;
}

interface ClothingCardProps {
  item: ClothingItem;
  onToggleFavorite: (id: string) => void;
  onClick: (item: ClothingItem) => void;
}

const categoryColors: Record<string, string> = {
  Tops: "bg-rose-light text-charcoal",
  Bottoms: "bg-sand text-charcoal",
  Dresses: "bg-secondary text-charcoal",
  Outerwear: "bg-muted text-muted-foreground",
  Accessories: "bg-accent text-accent-foreground",
};

export const ClothingCard = ({ item, onToggleFavorite, onClick }: ClothingCardProps) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-card hover:shadow-hover hover:-translate-y-1"
      style={{ background: "var(--gradient-card)" }}
      onClick={() => onClick(item)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {!imgLoaded && (
          <div className="absolute inset-0 animate-shimmer" />
        )}
        <img
          src={item.image}
          alt={item.name}
          className={`w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImgLoaded(true)}
        />

        {/* Favorite button */}
        <button
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm transition-all duration-200 hover:scale-110 z-10"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item.id);
          }}
        >
          <Heart
            size={14}
            className={item.favorite ? "fill-rose text-rose" : "text-muted-foreground"}
          />
        </button>

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-[10px] font-body font-medium tracking-widest uppercase px-2 py-1 rounded-full ${categoryColors[item.category] || "bg-muted text-muted-foreground"}`}>
            {item.category}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="font-display text-lg leading-snug text-foreground">{item.name}</p>
        {item.brand && (
          <p className="font-body text-xs text-muted-foreground mt-0.5 tracking-wide uppercase">{item.brand}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <p className="font-body text-xs text-muted-foreground">
            Worn <span className="text-foreground font-medium">{item.timesWorn}x</span>
          </p>
          <div className="flex gap-1">
            {item.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[10px] font-body bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
