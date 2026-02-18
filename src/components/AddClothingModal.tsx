import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Sparkles, Camera, CheckCircle } from "lucide-react";
import mannequinBase from "@/assets/mannequin-base.png";
import { ClothingItem } from "./ClothingCard";

interface AddClothingModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (item: ClothingItem) => void;
}

type Step = "upload" | "analyzing" | "review";

export const AddClothingModal = ({ open, onClose, onAdd }: AddClothingModalProps) => {
  const [step, setStep] = useState<Step>("upload");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setStep("analyzing");
    // Simulate AI analysis
    setTimeout(() => {
      setName("Silk Button-Up Blouse");
      setCategory("Tops");
      setBrand("Zara");
      setStep("review");
    }, 2800);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleAdd = () => {
    const newItem: ClothingItem = {
      id: Date.now().toString(),
      name,
      category,
      color: "White",
      brand,
      image: previewUrl || mannequinBase,
      tags: ["casual", "versatile"],
      favorite: false,
      timesWorn: 0,
    };
    onAdd(newItem);
    handleClose();
  };

  const handleClose = () => {
    setStep("upload");
    setPreviewUrl(null);
    setName("");
    setCategory("");
    setBrand("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-background border-border rounded-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl font-light text-foreground">
              {step === "upload" && "Add a piece"}
              {step === "analyzing" && "Analysing..."}
              {step === "review" && "Looking good"}
            </DialogTitle>
            <p className="font-body text-sm text-muted-foreground mt-1">
              {step === "upload" && "Upload a photo — our AI will do the rest"}
              {step === "analyzing" && "AI is recreating your garment on a mannequin"}
              {step === "review" && "Confirm the details before saving"}
            </p>
          </DialogHeader>
        </div>

        <div className="px-8 pb-8">
          {/* STEP: Upload */}
          {step === "upload" && (
            <div className="space-y-4">
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
                  dragOver ? "border-accent bg-rose-light/50" : "border-border hover:border-accent/50 hover:bg-muted/50"
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full gradient-rose flex items-center justify-center">
                    <Upload size={22} className="text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-body font-medium text-foreground">Drop your photo here</p>
                    <p className="font-body text-sm text-muted-foreground mt-1">or click to browse</p>
                  </div>
                  <p className="font-body text-xs text-muted-foreground">JPG, PNG, HEIC up to 20MB</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="font-body text-xs text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <Button
                variant="outline"
                className="w-full rounded-xl border-border font-body font-light gap-2 h-12"
                onClick={() => fileRef.current?.click()}
              >
                <Camera size={16} />
                Take a photo
              </Button>
            </div>
          )}

          {/* STEP: Analyzing */}
          {step === "analyzing" && (
            <div className="flex flex-col items-center gap-6 py-4">
              <div className="relative">
                <div className="w-32 h-44 rounded-xl overflow-hidden shadow-card">
                  <img src={previewUrl || mannequinBase} alt="uploaded" className="w-full h-full object-cover object-top" />
                </div>
                <div className="absolute -right-3 -top-3 w-10 h-10 rounded-full gradient-rose flex items-center justify-center shadow-soft">
                  <Sparkles size={16} className="text-primary-foreground animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <p className="font-body text-sm text-muted-foreground">Identifying fabric, colour & fit…</p>
              </div>
              <div className="w-full space-y-2">
                {["Detecting garment type", "Analysing colour palette", "Rendering on mannequin"].map((text, i) => (
                  <div key={text} className="flex items-center gap-3 opacity-0 animate-slide-up" style={{ animationDelay: `${i * 600}ms`, animationFillMode: "forwards" }}>
                    <CheckCircle size={14} className="text-accent shrink-0" />
                    <p className="font-body text-sm text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP: Review */}
          {step === "review" && (
            <div className="space-y-5 animate-slide-up">
              {previewUrl && (
                <div className="flex justify-center">
                  <div className="w-28 h-36 rounded-xl overflow-hidden shadow-card ring-2 ring-accent/30">
                    <img src={previewUrl} alt="garment" className="w-full h-full object-cover object-top" />
                  </div>
                </div>
              )}
              <div className="space-y-3">
                <div>
                  <Label className="font-body text-xs uppercase tracking-widest text-muted-foreground">Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 rounded-xl border-border font-body font-light bg-background"
                  />
                </div>
                <div>
                  <Label className="font-body text-xs uppercase tracking-widest text-muted-foreground">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="mt-1 rounded-xl border-border font-body font-light bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Tops", "Bottoms", "Dresses", "Outerwear", "Accessories"].map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-body text-xs uppercase tracking-widest text-muted-foreground">Brand</Label>
                  <Input
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="mt-1 rounded-xl border-border font-body font-light bg-background"
                    placeholder="Optional"
                  />
                </div>
              </div>
              <Button
                className="w-full rounded-xl h-12 font-body font-medium gradient-rose border-0 text-primary-foreground hover:opacity-90 transition-opacity"
                onClick={handleAdd}
                disabled={!name || !category}
              >
                Save to wardrobe
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
