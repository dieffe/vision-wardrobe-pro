import { useState } from "react";
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
      className="ios-card cursor-pointer active:scale-95 transition-transform duration-150"
      onClick={() => onClick(item)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] bg-muted overflow-hidden">
        {!imgLoaded && <div className="absolute inset-0 animate-shimmer" />}
        <img
          src={item.image}
          alt={item.name}
          className={`w-full h-full object-cover object-top transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImgLoaded(true)}
        />

        {/* Favorite button */}
        <button
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-background/75 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform z-10"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item.id);
          }}
        >
          <Heart
            size={13}
            className={item.favorite ? "fill-rose text-rose" : "text-muted-foreground"}
          />
        </button>

        {/* Category label */}
        <div className="absolute top-2.5 left-2.5">
          <span className="text-[9px] font-semibold tracking-widest uppercase px-2 py-1 rounded-full bg-background/75 backdrop-blur-sm text-foreground">
            {item.category}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="px-3 py-2.5">
        <p className="text-[14px] font-semibold text-foreground tracking-tight leading-snug">{item.name}</p>
        {item.brand && (
          <p className="text-[11px] text-muted-foreground mt-0.5 uppercase tracking-wide">{item.brand}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <p className="text-[11px] text-muted-foreground">
            Worn <span className="text-foreground font-semibold">{item.timesWorn}×</span>
          </p>
          {item.tags.slice(0, 1).map((tag) => (
            <span key={tag} className="text-[9px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full uppercase tracking-wide">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
