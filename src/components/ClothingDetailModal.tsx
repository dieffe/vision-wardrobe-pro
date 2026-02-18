import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Heart, Trash2, ChevronDown, Shirt, Tag, RotateCcw } from "lucide-react";
import { ClothingItem } from "./ClothingCard";

interface ClothingDetailModalProps {
  item: ClothingItem | null;
  open: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onWear?: (id: string) => void;
}

export const ClothingDetailModal = ({
  item,
  open,
  onClose,
  onToggleFavorite,
  onDelete,
  onWear,
}: ClothingDetailModalProps) => {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[430px] w-full h-[96dvh] bottom-0 top-auto translate-y-0 rounded-t-[28px] rounded-b-none p-0 overflow-hidden border-0 fixed left-1/2 -translate-x-1/2 flex flex-col" style={{ background: "hsl(var(--background))" }}>

        {/* Drag handle */}
        <div className="ios-sheet-handle shrink-0" />

        {/* Top nav row */}
        <div className="flex items-center justify-between px-5 pt-1 pb-2 shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-[15px] font-medium active:opacity-50 transition-opacity"
            style={{ color: "hsl(var(--accent))" }}
          >
            <ChevronDown size={18} strokeWidth={2.5} />
            <span>Close</span>
          </button>

          <h2 className="text-[17px] font-semibold tracking-tight" style={{ color: "hsl(var(--foreground))" }}>
            {item.category}
          </h2>

          <button
            onClick={() => { onDelete(item.id); onClose(); }}
            className="flex items-center gap-1 text-[15px] font-medium active:opacity-50 transition-opacity"
            style={{ color: "hsl(var(--destructive))" }}
          >
            <Trash2 size={15} />
            <span>Delete</span>
          </button>
        </div>

        {/* Hero image */}
        <div className="relative mx-4 rounded-2xl overflow-hidden shrink-0" style={{ height: "46%" }}>
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover object-top"
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, hsl(var(--background)) 0%, transparent 45%)",
            }}
          />

          {/* Favorite FAB */}
          <button
            onClick={() => onToggleFavorite(item.id)}
            className="absolute top-3 right-3 w-11 h-11 rounded-full flex items-center justify-center active:scale-90 transition-transform shadow-card"
            style={{ background: "hsl(var(--background) / 0.85)", backdropFilter: "blur(12px)" }}
          >
            <Heart
              size={19}
              strokeWidth={2}
              className={item.favorite ? "" : ""}
              style={{
                fill: item.favorite ? "hsl(var(--rose))" : "transparent",
                color: item.favorite ? "hsl(var(--rose))" : "hsl(var(--muted-foreground))",
              }}
            />
          </button>

          {/* Category pill */}
          <div className="absolute top-3 left-3">
            <span
              className="text-[10px] font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full"
              style={{ background: "hsl(var(--background) / 0.82)", backdropFilter: "blur(12px)", color: "hsl(var(--foreground))" }}
            >
              {item.category}
            </span>
          </div>

          {/* Name + brand over gradient */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
            <p
              className="text-[28px] font-bold leading-tight tracking-tight"
              style={{ color: "hsl(var(--foreground))", fontFamily: "var(--font-display)" }}
            >
              {item.name}
            </p>
            {item.brand && (
              <p
                className="text-[12px] uppercase tracking-[0.14em] mt-0.5"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {item.brand}
              </p>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto ios-scroll px-4 pt-4 space-y-3 pb-4">

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: RotateCcw, label: "Times Worn", value: `${item.timesWorn}×` },
              { icon: Heart, label: "Favourite", value: item.favorite ? "Yes" : "No" },
              { icon: Shirt, label: "Colour", value: item.color },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl px-3 py-3 flex flex-col items-center gap-1 text-center"
                style={{ background: "hsl(var(--card))", border: "0.5px solid hsl(var(--border))" }}
              >
                <Icon size={16} style={{ color: "hsl(var(--accent))" }} />
                <p className="text-[18px] font-bold tracking-tight" style={{ color: "hsl(var(--foreground))", fontFamily: "var(--font-display)" }}>
                  {value}
                </p>
                <p className="text-[10px] uppercase tracking-widest" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div
              className="rounded-2xl px-4 py-3"
              style={{ background: "hsl(var(--card))", border: "0.5px solid hsl(var(--border))" }}
            >
              <div className="flex items-center gap-1.5 mb-2.5">
                <Tag size={12} style={{ color: "hsl(var(--muted-foreground))" }} />
                <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Tags
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[12px] font-medium px-3 py-1 rounded-full uppercase tracking-wide"
                    style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Details list */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "hsl(var(--card))", border: "0.5px solid hsl(var(--border))" }}
          >
            {[
              { label: "Colour", value: item.color },
              { label: "Category", value: item.category },
              ...(item.brand ? [{ label: "Brand", value: item.brand }] : []),
              { label: "Worn", value: `${item.timesWorn} times` },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                className="flex items-center justify-between px-4 py-3.5"
                style={{
                  borderBottom: i < arr.length - 1 ? "0.5px solid hsl(var(--border))" : "none",
                }}
              >
                <span className="text-[14px]" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {row.label}
                </span>
                <span className="text-[14px] font-medium" style={{ color: "hsl(var(--foreground))" }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className="px-4 shrink-0"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 16px) + 12px)" }}
        >
          <button
            onClick={() => { onWear?.(item.id); onClose(); }}
            className="w-full ios-primary-btn justify-center text-[16px]"
            style={{ borderRadius: "16px", padding: "16px" }}
          >
            <Shirt size={18} />
            Wear Today
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
