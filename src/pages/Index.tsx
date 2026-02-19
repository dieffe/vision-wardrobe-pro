import { useState } from "react";
import { Plus, Sparkles, Search, Shirt, Heart, Home } from "lucide-react";
import { ClothingCard, ClothingItem } from "@/components/ClothingCard";
import { AddClothingModal } from "@/components/AddClothingModal";
import { OutfitChatbot } from "@/components/OutfitChatbot";
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

type Tab = "wardrobe" | "favorites" | "outfits";

const Index = () => {
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>(INITIAL_WARDROBE);
  const [addOpen, setAddOpen] = useState(false);
  const [outfitOpen, setOutfitOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("wardrobe");

  const filtered = wardrobe.filter((item) => {
    const matchCat = activeCategory === "All" || item.category === activeCategory;
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.brand?.toLowerCase().includes(search.toLowerCase());
    const matchFav = activeTab === "favorites" ? item.favorite : true;
    return matchCat && matchSearch && matchFav;
  });

  const toggleFavorite = (id: string) => {
    setWardrobe((prev) =>
      prev.map((item) => (item.id === id ? { ...item, favorite: !item.favorite } : item))
    );
  };

  const deleteItem = (id: string) => {
    setWardrobe((prev) => prev.filter((item) => item.id !== id));
  };

  const wearItem = (id: string) => {
    setWardrobe((prev) =>
      prev.map((item) => (item.id === id ? { ...item, timesWorn: item.timesWorn + 1 } : item))
    );
  };

  const addItem = (item: ClothingItem) => {
    setWardrobe((prev) => [item, ...prev]);
  };

  const handleTabPress = (tab: Tab) => {
    if (tab === "outfits") {
      setOutfitOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  const pageTitle = activeTab === "favorites" ? "Favourites" : "My Wardrobe";

  return (
    <div className="ios-app flex flex-col bg-background" style={{ height: "100dvh" }}>

      {/* iOS Status Bar placeholder */}
      <div className="ios-status-bar" />

      {/* iOS Large Title Nav Bar */}
      <div className="ios-navbar">
        <div className="px-4 pt-2 pb-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-muted-foreground tracking-widest uppercase">
              {wardrobe.length} pieces
            </span>
            <button
              onClick={() => setAddOpen(true)}
              className="ios-icon-btn"
              aria-label="Add piece"
            >
              <Plus size={22} strokeWidth={2.5} className="text-accent" />
            </button>
          </div>
          <h1 className="ios-large-title">{pageTitle}</h1>
        </div>

        {/* iOS Search bar */}
        <div className="px-4 pb-3">
          <div className="ios-search-bar">
            <Search size={14} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ios-search-input"
            />
          </div>
        </div>

        {/* Category scroll pills */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-150 ${
                activeCategory === cat
                  ? "gradient-rose text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto ios-scroll pb-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <Plus size={32} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-xl font-semibold text-foreground tracking-tight">Nothing here yet</p>
              <p className="text-[14px] text-muted-foreground mt-1">
                Add your first piece to start your digital wardrobe.
              </p>
            </div>
            <button
              onClick={() => setAddOpen(true)}
              className="ios-primary-btn mt-1"
            >
              <Plus size={16} /> Add your first piece
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 px-4 pt-3 animate-fade-in">
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
      </div>

      {/* iOS Tab Bar */}
      <div className="ios-tab-bar">
        <button
          className={`ios-tab-item ${activeTab === "wardrobe" ? "ios-tab-active" : ""}`}
          onClick={() => handleTabPress("wardrobe")}
        >
          <Home size={24} strokeWidth={activeTab === "wardrobe" ? 2.5 : 1.8} />
          <span>Wardrobe</span>
        </button>
        <button
          className={`ios-tab-item ${activeTab === "favorites" ? "ios-tab-active" : ""}`}
          onClick={() => handleTabPress("favorites")}
        >
          <Heart
            size={24}
            strokeWidth={activeTab === "favorites" ? 2.5 : 1.8}
            className={activeTab === "favorites" ? "fill-accent text-accent" : ""}
          />
          <span>Favourites</span>
        </button>
        <button
          className="ios-tab-item"
          onClick={() => handleTabPress("outfits")}
        >
          <Sparkles size={24} strokeWidth={1.8} />
          <span>Outfit AI</span>
        </button>
      </div>

      {/* Modals */}
      <AddClothingModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={addItem} />
      <OutfitChatbot open={outfitOpen} onClose={() => setOutfitOpen(false)} wardrobe={wardrobe} />
      <ClothingDetailModal
        item={selectedItem}
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onToggleFavorite={toggleFavorite}
        onDelete={deleteItem}
        onWear={wearItem}
      />
    </div>
  );
};

export default Index;
