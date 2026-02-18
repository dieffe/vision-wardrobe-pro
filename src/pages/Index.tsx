import { useState } from "react";
import { Plus, Sparkles, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClothingCard, ClothingItem } from "@/components/ClothingCard";
import { AddClothingModal } from "@/components/AddClothingModal";
import { OutfitSuggester } from "@/components/OutfitSuggester";
import { ClothingDetailModal } from "@/components/ClothingDetailModal";

import mannequinBlouse from "@/assets/mannequin-blouse.png";
import mannequinBlazer from "@/assets/mannequin-blazer.png";
import mannequinDress from "@/assets/mannequin-dress.png";
import mannequinPants from "@/assets/mannequin-pants.png";

const INITIAL_WARDROBE: ClothingItem[] = [
  {
    id: "1",
    name: "Silk Blouse",
    category: "Tops",
    color: "Ivory White",
    brand: "Massimo Dutti",
    image: mannequinBlouse,
    tags: ["office", "versatile"],
    favorite: true,
    timesWorn: 12,
  },
  {
    id: "2",
    name: "Double-Breasted Blazer",
    category: "Outerwear",
    color: "Midnight Black",
    brand: "Zara",
    image: mannequinBlazer,
    tags: ["formal", "classic"],
    favorite: false,
    timesWorn: 8,
  },
  {
    id: "3",
    name: "Floral Midi Dress",
    category: "Dresses",
    color: "Dusty Rose",
    brand: "& Other Stories",
    image: mannequinDress,
    tags: ["occasion", "feminine"],
    favorite: true,
    timesWorn: 4,
  },
  {
    id: "4",
    name: "Wide-Leg Linen Trousers",
    category: "Bottoms",
    color: "Camel",
    brand: "Arket",
    image: mannequinPants,
    tags: ["casual", "summer"],
    favorite: false,
    timesWorn: 6,
  },
];

const CATEGORIES = ["All", "Tops", "Bottoms", "Dresses", "Outerwear", "Accessories"];

const Index = () => {
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>(INITIAL_WARDROBE);
  const [addOpen, setAddOpen] = useState(false);
  const [outfitOpen, setOutfitOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = wardrobe.filter((item) => {
    const matchCat = activeCategory === "All" || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.brand?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleFavorite = (id: string) => {
    setWardrobe((prev) =>
      prev.map((item) => item.id === id ? { ...item, favorite: !item.favorite } : item)
    );
  };

  const deleteItem = (id: string) => {
    setWardrobe((prev) => prev.filter((item) => item.id !== id));
  };

  const addItem = (item: ClothingItem) => {
    setWardrobe((prev) => [item, ...prev]);
  };

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl text-foreground tracking-tight">WardroBio</h1>
            <p className="font-body text-xs text-muted-foreground tracking-widest uppercase">
              {wardrobe.length} pieces
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOutfitOpen(true)}
              className="rounded-xl border-border font-body font-light gap-2 hidden sm:flex hover:bg-muted"
            >
              <Sparkles size={14} className="text-accent" />
              Get an outfit
            </Button>
            <Button
              size="sm"
              onClick={() => setAddOpen(true)}
              className="rounded-xl font-body font-light gap-2 gradient-rose border-0 text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Plus size={16} />
              Add piece
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search your wardrobe…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl border-border font-body font-light bg-background h-10"
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full font-body text-sm transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Wardrobe grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Plus size={24} className="text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-display text-2xl text-foreground">Nothing here yet</p>
              <p className="font-body text-sm text-muted-foreground mt-1">
                Add your first piece to start building your digital wardrobe.
              </p>
            </div>
            <Button
              onClick={() => setAddOpen(true)}
              className="rounded-xl font-body gap-2 gradient-rose border-0 text-primary-foreground hover:opacity-90 mt-2"
            >
              <Plus size={16} /> Add your first piece
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-fade-in">
            {filtered.map((item) => (
              <ClothingCard
                key={item.id}
                item={item}
                onToggleFavorite={toggleFavorite}
                onClick={setSelectedItem}
              />
            ))}
          </div>
        )}

        {/* Mobile outfit button */}
        <button
          onClick={() => setOutfitOpen(true)}
          className="sm:hidden fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-3.5 rounded-full gradient-rose text-primary-foreground shadow-hover font-body font-medium text-sm z-30"
        >
          <Sparkles size={16} />
          Get an outfit
        </button>
      </main>

      {/* Modals */}
      <AddClothingModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={addItem}
      />

      <OutfitSuggester
        open={outfitOpen}
        onClose={() => setOutfitOpen(false)}
        wardrobe={wardrobe}
      />

      <ClothingDetailModal
        item={selectedItem}
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onToggleFavorite={toggleFavorite}
        onDelete={deleteItem}
      />
    </div>
  );
};

export default Index;
