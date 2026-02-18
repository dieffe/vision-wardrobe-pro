import { useState, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Sparkles, Camera, CheckCircle, X, ChevronLeft } from "lucide-react";
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
      <DialogContent className="max-w-[430px] w-full h-[85dvh] bottom-0 top-auto translate-y-0 rounded-t-3xl rounded-b-none p-0 overflow-hidden ios-modal-bg border-0 fixed left-1/2 -translate-x-1/2">

        {/* Handle */}
        <div className="ios-sheet-handle" />

        {/* iOS-style nav header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-1">
          {step !== "upload" ? (
            <button
              onClick={() => setStep("upload")}
              className="flex items-center gap-0.5 text-[16px] font-medium text-accent active:opacity-60"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
              Back
            </button>
          ) : <div className="w-16" />}

          <h2 className="text-[17px] font-semibold text-foreground tracking-tight">
            {step === "upload" && "Add Piece"}
            {step === "analyzing" && "Analysing"}
            {step === "review" && "Review"}
          </h2>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center active:opacity-60"
          >
            <X size={15} className="text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-6 pt-4">
          {/* STEP: Upload */}
          {step === "upload" && (
            <div className="space-y-4">
              <p className="text-[14px] text-muted-foreground">Upload a photo — our AI will recreate it on a mannequin.</p>

              <div
                className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 cursor-pointer ${
                  dragOver ? "border-accent bg-rose-light/40" : "border-border"
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
                  capture="environment"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full gradient-rose flex items-center justify-center">
                    <Upload size={24} className="text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-[16px] font-semibold text-foreground">Choose Photo</p>
                    <p className="text-[13px] text-muted-foreground mt-0.5">or drag and drop</p>
                  </div>
                </div>
              </div>

              {/* Camera button */}
              <button
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-border bg-card py-4 text-[16px] font-medium text-foreground active:opacity-70"
                onClick={() => fileRef.current?.click()}
              >
                <Camera size={18} className="text-accent" />
                Take Photo
              </button>
            </div>
          )}

          {/* STEP: Analyzing */}
          {step === "analyzing" && (
            <div className="flex flex-col items-center gap-6 pt-4">
              <div className="relative">
                <div className="w-36 h-48 rounded-2xl overflow-hidden shadow-card">
                  <img src={previewUrl || mannequinBase} alt="uploaded" className="w-full h-full object-cover object-top" />
                </div>
                <div className="absolute -right-3 -top-3 w-11 h-11 rounded-full gradient-rose flex items-center justify-center shadow-soft">
                  <Sparkles size={18} className="text-primary-foreground animate-pulse" />
                </div>
              </div>

              <div className="text-center">
                <p className="text-[17px] font-semibold text-foreground">AI is working…</p>
                <p className="text-[13px] text-muted-foreground mt-1">Rendering your piece on a mannequin</p>
              </div>

              <div className="w-full space-y-3">
                {["Detecting garment type", "Analysing colour & fabric", "Rendering on mannequin"].map((text, i) => (
                  <div
                    key={text}
                    className="flex items-center gap-3 opacity-0 animate-slide-up"
                    style={{ animationDelay: `${i * 600}ms`, animationFillMode: "forwards" }}
                  >
                    <CheckCircle size={16} className="text-accent shrink-0" />
                    <p className="text-[14px] text-muted-foreground">{text}</p>
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
                  <div className="w-32 h-40 rounded-2xl overflow-hidden shadow-card ring-2 ring-accent/30">
                    <img src={previewUrl} alt="garment" className="w-full h-full object-cover object-top" />
                  </div>
                </div>
              )}

              {/* iOS grouped list style form */}
              <div className="rounded-2xl overflow-hidden bg-card border border-border divide-y divide-border">
                <div className="flex items-center px-4 py-3 gap-3">
                  <span className="text-[14px] text-muted-foreground w-20 shrink-0">Name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 bg-transparent text-[14px] text-foreground outline-none font-medium"
                    placeholder="Garment name"
                  />
                </div>
                <div className="flex items-center px-4 py-3 gap-3">
                  <span className="text-[14px] text-muted-foreground w-20 shrink-0">Category</span>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="flex-1 bg-transparent border-0 shadow-none p-0 h-auto text-[14px] font-medium focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Tops", "Bottoms", "Dresses", "Outerwear", "Accessories"].map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center px-4 py-3 gap-3">
                  <span className="text-[14px] text-muted-foreground w-20 shrink-0">Brand</span>
                  <input
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="flex-1 bg-transparent text-[14px] text-foreground outline-none font-medium"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <button
                className="w-full ios-primary-btn justify-center disabled:opacity-40"
                onClick={handleAdd}
                disabled={!name || !category}
              >
                Save to Wardrobe
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
