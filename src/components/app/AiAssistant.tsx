import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Combien coûte une vidange ?",
  "Comment suivre ma commande ?",
  "Devenir prestataire ?",
];

const AiAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Bonjour 👋 Je suis Léa, votre assistante Link'eco. Comment puis-je vous aider aujourd'hui ?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const url = `https://jlggvbeyakutqalevgau.supabase.co/functions/v1/ai-assistant`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: "Erreur" }));
        toast.error(err.error || "Erreur de l'assistant");
        setLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistant = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              assistant += delta;
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: assistant };
                return copy;
              });
            }
          } catch {}
        }
      }
    } catch (e) {
      toast.error("Connexion impossible à l'assistant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating launcher */}
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-2xl bg-gradient-gold shadow-gold flex items-center justify-center ring-2 ring-accent/30"
        aria-label="Ouvrir l'assistant IA"
      >
        <Sparkles className="w-6 h-6 text-accent-foreground" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-background animate-pulse" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center bg-foreground/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-md h-[85vh] sm:h-[600px] sm:rounded-3xl rounded-t-3xl bg-background border border-border shadow-float flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-hero-dark p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold">
                      <Sparkles className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-accent font-semibold">Assistant IA</p>
                      <h2 className="font-display font-bold text-white text-base">Léa · Link'eco</h2>
                    </div>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-gradient-emerald text-primary-foreground rounded-br-sm"
                          : "glass border border-border/60 text-foreground rounded-bl-sm"
                      }`}
                    >
                      {m.content || (loading && i === messages.length - 1 ? <Loader2 className="w-4 h-4 animate-spin" /> : null)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggestions */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2 flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-xs px-3 py-1.5 rounded-full bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors font-medium"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="p-3 border-t border-border/60 flex items-center gap-2 bg-card"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Posez votre question..."
                  className="flex-1 bg-muted/40 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 rounded-xl bg-gradient-gold text-accent-foreground flex items-center justify-center shadow-gold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiAssistant;
