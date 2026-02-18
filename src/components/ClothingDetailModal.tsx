import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Heart, Trash2, X } from "lucide-react";
import { ClothingItem } from "./ClothingCard";

interface ClothingDetailModalProps {
  item: ClothingItem | null;
  open: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ClothingDetailModal = ({
  item,
  open,
  onClose,
  onToggleFavorite,
  onDelete,
}: ClothingDetailModalProps) => {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[430px] w-full h-[90dvh] bottom-0 top-auto translate-y-0 rounded-t-3xl rounded-b-none p-0 overflow-hidden ios-modal-bg border-0 fixed left-1/2 -translate-x-1/2">
        <div className="ios-sheet-handle" />

        {/* iOS nav */}
        <div className="flex items-center justify-between px-5 pt-2 pb-1">
          <button
            onClick={() => { onDelete(item.id); onClose(); }}
            className="flex items-center gap-1 text-[15px] font-medium text-destructive active:opacity-60"
          >
            <Trash2 size={15} />
            Delete
          </button>
          <h2 className="text-[17px] font-semibold text-foreground tracking-tight">{item.category}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center active:opacity-60"
          >
            <X size={15} className="text-muted-foreground" />
          </button>
        </div>

        {/* Mannequin image — tall */}
        <div className="relative mx-4 rounded-2xl overflow-hidden" style={{ height: "52%" }}>
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />

          {/* Favorite */}
          <button
            onClick={() => onToggleFavorite(item.id)}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-background/75 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform"
          >
            <Heart size={18} className={item.favorite ? "fill-rose text-rose" : "text-muted-foreground"} />
          </button>

          {/* Name over image */}
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
            <p className="text-[26px] font-bold text-foreground tracking-tight leading-tight">{item.name}</p>
            {item.brand && (
              <p className="text-[13px] text-muted-foreground uppercase tracking-widest mt-0.5">{item.brand}</p>
            )}
          </div>
        </div>

        {/* Details — iOS grouped list */}
        <div className="px-4 pt-4 space-y-3 overflow-y-auto">
          <div className="rounded-2xl overflow-hidden bg-card border border-border divide-y divide-border">
            <div className="ios-list-item justify-between">
              <span className="text-[14px] text-muted-foreground">Colour</span>
              <span className="text-[14px] font-medium text-foreground">{item.color}</span>
            </div>
            <div className="ios-list-item justify-between">
              <span className="text-[14px] text-muted-foreground">Times Worn</span>
              <span className="text-[14px] font-medium text-foreground">{item.timesWorn}×</span>
            </div>
            <div className="ios-list-item justify-between">
              <span className="text-[14px] text-muted-foreground">Favourite</span>
              <span className="text-[14px] font-medium text-foreground">{item.favorite ? "Yes ♥" : "No"}</span>
            </div>
          </div>

          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 px-1">
              {item.tags.map((tag) => (
                <span key={tag} className="text-[12px] font-medium bg-muted text-muted-foreground px-3 py-1 rounded-full uppercase tracking-wide">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
