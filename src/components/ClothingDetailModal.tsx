import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, Edit2, Trash2, Tag } from "lucide-react";
import { ClothingItem } from "./ClothingCard";

interface ClothingDetailModalProps {
  item: ClothingItem | null;
  open: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ClothingDetailModal = ({ item, open, onClose, onToggleFavorite, onDelete }: ClothingDetailModalProps) => {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-background border-border rounded-2xl p-0 overflow-hidden">
        {/* Mannequin image */}
        <div className="relative aspect-[3/4] bg-muted">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

          {/* Actions */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => onToggleFavorite(item.id)}
              className="p-2.5 rounded-full bg-background/80 backdrop-blur-sm hover:scale-110 transition-transform"
            >
              <Heart size={16} className={item.favorite ? "fill-rose text-rose" : "text-muted-foreground"} />
            </button>
            <button
              onClick={() => { onDelete(item.id); onClose(); }}
              className="p-2.5 rounded-full bg-background/80 backdrop-blur-sm hover:scale-110 transition-transform"
            >
              <Trash2 size={16} className="text-muted-foreground" />
            </button>
          </div>

          {/* Category */}
          <div className="absolute top-4 left-4">
            <span className="font-body text-xs uppercase tracking-widest bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-muted-foreground">
              {item.category}
            </span>
          </div>

          {/* Name overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="font-display text-2xl text-foreground">{item.name}</h2>
            {item.brand && (
              <p className="font-body text-sm text-muted-foreground uppercase tracking-widest mt-0.5">{item.brand}</p>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <div className="flex gap-6">
            <div>
              <p className="font-body text-xs uppercase tracking-widest text-muted-foreground">Colour</p>
              <p className="font-body text-sm text-foreground mt-1">{item.color}</p>
            </div>
            <div>
              <p className="font-body text-xs uppercase tracking-widest text-muted-foreground">Times Worn</p>
              <p className="font-body text-sm text-foreground mt-1">{item.timesWorn}</p>
            </div>
          </div>

          {item.tags.length > 0 && (
            <div>
              <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1">
                <Tag size={10} /> Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span key={tag} className="font-body text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
