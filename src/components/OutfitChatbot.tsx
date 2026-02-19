import { useState, useRef, useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sparkles, Send, X, RefreshCw, Briefcase, Sun, Moon, Coffee, Heart, Music } from "lucide-react";
import { ClothingItem } from "./ClothingCard";
import { useToast } from "@/hooks/use-toast";

interface OutfitChatbotProps {
  open: boolean;
  onClose: () => void;
  wardrobe: ClothingItem[];
}

type Message = {
  role: "user" | "assistant";
  content: string;
};

const quickPrompts = [
  { icon: Briefcase, label: "Work", prompt: "What should I wear for a professional work day?" },
  { icon: Coffee, label: "Casual", prompt: "Give me a casual, relaxed outfit for the weekend." },
  { icon: Moon, label: "Evening", prompt: "I need a chic evening outfit for dinner out." },
  { icon: Heart, label: "Date", prompt: "What's the perfect romantic date night outfit?" },
  { icon: Sun, label: "Weekend", prompt: "Something comfortable for a sunny weekend day?" },
  { icon: Music, label: "Party", prompt: "I'm going to a party — what should I wear?" },
];

export const OutfitChatbot = ({ open, onClose, wardrobe }: OutfitChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/outfit-chat`;

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Hi! I'm your personal stylist ✨ Tell me about your occasion or mood, and I'll curate the perfect outfit from your wardrobe. You can also tap one of the quick options below.",
        },
      ]);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsStreaming(true);

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          wardrobe: wardrobe.map((item) => ({
            name: item.name,
            category: item.category,
            color: item.color,
            brand: item.brand,
            tags: item.tags,
          })),
        }),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error || "Request failed");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
                  );
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Flush remaining
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw || !raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
                  );
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch { /* ignore */ }
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast({ title: "Stylist unavailable", description: msg, variant: "destructive" });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't connect right now. Please try again! 💫" },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hi! I'm your personal stylist ✨ Tell me about your occasion or mood, and I'll curate the perfect outfit from your wardrobe.",
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="h-[92dvh] rounded-t-3xl p-0 border-0 ios-modal-bg max-w-[430px] mx-auto left-1/2 -translate-x-1/2 flex flex-col"
      >
        <div className="ios-sheet-handle" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-4 shrink-0">
          <button
            onClick={handleReset}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center active:opacity-60"
            aria-label="Reset chat"
          >
            <RefreshCw size={14} className="text-muted-foreground" />
          </button>

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

        {/* Messages */}
        <div className="flex-1 overflow-y-auto ios-scroll px-4 space-y-3 pb-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full gradient-rose flex items-center justify-center shrink-0 mr-2 mt-0.5">
                  <Sparkles size={12} className="text-primary-foreground" />
                </div>
              )}
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "gradient-rose text-primary-foreground rounded-br-sm"
                    : "bg-card border border-border text-foreground rounded-bl-sm"
                }`}
              >
                {msg.content}
                {isStreaming && i === messages.length - 1 && msg.role === "assistant" && (
                  <span className="inline-flex gap-0.5 ml-1 align-middle">
                    {[0, 1, 2].map((j) => (
                      <span
                        key={j}
                        className="w-1 h-1 rounded-full bg-muted-foreground animate-bounce inline-block"
                        style={{ animationDelay: `${j * 150}ms` }}
                      />
                    ))}
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompts (show only at start) */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2 shrink-0">
            <div className="flex gap-2 overflow-x-auto scrollbar-none py-1">
              {quickPrompts.map((q) => {
                const Icon = q.icon;
                return (
                  <button
                    key={q.label}
                    onClick={() => sendMessage(q.prompt)}
                    disabled={isStreaming}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full bg-muted border border-border text-[12px] font-medium text-foreground active:scale-95 transition-transform disabled:opacity-50"
                  >
                    <Icon size={12} className="text-accent" />
                    {q.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-4 pb-6 pt-2 shrink-0">
          <div className="flex items-center gap-2 bg-muted rounded-2xl pl-4 pr-2 py-2 border border-border focus-within:border-accent transition-colors">
            <input
              ref={inputRef}
              type="text"
              placeholder="Describe your occasion or ask anything…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isStreaming}
              className="flex-1 bg-transparent border-none outline-none text-[14px] text-foreground placeholder:text-muted-foreground disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isStreaming}
              className="w-8 h-8 rounded-xl gradient-rose flex items-center justify-center shrink-0 disabled:opacity-40 active:scale-95 transition-all"
              aria-label="Send"
            >
              <Send size={14} className="text-primary-foreground" />
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
