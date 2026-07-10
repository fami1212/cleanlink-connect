import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Loader2, Mic, MicOff, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { logAiEvent } from "@/lib/aiUsage";

type Msg = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "linkeco_ai_chat_v1";

const INTRO: Msg = {
  role: "assistant",
  content:
    "Bonjour 👋 Je suis **Léa**, votre assistante Link'eco. Je peux vous aider à :\n- Estimer un tarif de vidange 💧\n- Réserver un prestataire 🚛\n- Suivre une commande 📍\n\nQue puis-je faire pour vous ?",
};

const SUGGESTIONS_CLIENT = [
  "💧 Combien coûte une vidange ?",
  "📍 Comment réserver près de moi ?",
  "📦 Où est ma commande ?",
  "🚛 Devenir prestataire",
];

const SUGGESTIONS_PROVIDER = [
  "💰 Comment fonctionnent les paiements ?",
  "📄 Quels documents fournir ?",
  "📊 Voir mes gains",
  "🆘 Contacter le support",
];

const ACTION_ROUTES: Record<string, string> = {
  order: "/app/order",
  history: "/app/profile/history",
  provider: "/app/provider/register",
  messages: "/app/messages",
  help: "/app/help",
  tracking: "/app/tracking",
  profile: "/app/profile",
};

const AiAssistant = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isProviderRoute = location.pathname.startsWith("/app/provider");

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [INTRO];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {}
  }, [messages]);

  const resetChat = () => {
    setMessages([INTRO]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const startVoice = () => {
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast.error("Reconnaissance vocale non supportée sur ce navigateur");
      return;
    }
    const rec = new SR();
    rec.lang = "fr-FR";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setInput(text);
      setListening(false);
      send(text);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    setListening(true);
    rec.start();
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

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
        body: JSON.stringify({
          messages: next,
          context: {
            route: location.pathname,
            role: isProviderRoute ? "prestataire" : "client",
            authenticated: !!user,
          },
        }),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: "Erreur" }));
        const status = res.status === 429 ? "rate_limited" : res.status === 402 ? "no_credits" : "error";
        logAiEvent("assistant_message", status, { http: res.status });
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
      logAiEvent("assistant_message", "success", {});
    } catch {
      logAiEvent("assistant_message", "network", {});
      toast.error("Connexion impossible à l'assistant");
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (href: string) => {
    const m = href.match(/^#action:(\w+)/);
    if (!m) return false;
    const route = ACTION_ROUTES[m[1]];
    if (route) {
      setOpen(false);
      navigate(route);
      return true;
    }
    return false;
  };

  const suggestions = isProviderRoute ? SUGGESTIONS_PROVIDER : SUGGESTIONS_CLIENT;

  return (
    <>
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
              className="w-full sm:max-w-md h-[88vh] sm:h-[640px] sm:rounded-3xl rounded-t-3xl bg-background border border-border shadow-float flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-hero-dark p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold">
                      <Sparkles className="w-5 h-5 text-accent-foreground" />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-background" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-accent font-semibold">
                        Assistant IA · En ligne
                      </p>
                      <h2 className="font-display font-bold text-white text-base">Léa · Link'eco</h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={resetChat}
                      className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                      aria-label="Nouvelle conversation"
                      title="Nouvelle conversation"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setOpen(false)}
                      className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-background to-muted/20">
                {messages.map((m, i) => {
                  const isLastAssistant = i === messages.length - 1 && m.role === "assistant";
                  const isTyping = loading && isLastAssistant && !m.content;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          m.role === "user"
                            ? "bg-gradient-emerald text-primary-foreground rounded-br-sm"
                            : "glass border border-border/60 text-foreground rounded-bl-sm"
                        }`}
                      >
                        {isTyping ? (
                          <span className="flex items-center gap-1 py-1">
                            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" />
                          </span>
                        ) : m.role === "user" ? (
                          m.content
                        ) : (
                          <div className="prose prose-sm max-w-none prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0 prose-strong:text-foreground prose-a:no-underline">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                a: ({ href, children }) => {
                                  if (href?.startsWith("#action:")) {
                                    return (
                                      <button
                                        onClick={() => handleActionClick(href)}
                                        className="inline-flex items-center gap-1 mt-1 px-3 py-1.5 rounded-full bg-gradient-gold text-accent-foreground text-xs font-semibold shadow-gold hover:opacity-90 transition-opacity"
                                      >
                                        {children}
                                      </button>
                                    );
                                  }
                                  return (
                                    <a href={href} target="_blank" rel="noreferrer" className="text-accent underline">
                                      {children}
                                    </a>
                                  );
                                },
                              }}
                            >
                              {m.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Suggestions */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2 flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s.replace(/^[^\s]+\s/, ""))}
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
                <button
                  type="button"
                  onClick={listening ? stopVoice : startVoice}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    listening
                      ? "bg-destructive text-destructive-foreground animate-pulse"
                      : "bg-muted/40 hover:bg-muted text-foreground"
                  }`}
                  aria-label="Dictée vocale"
                >
                  {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={listening ? "Parlez..." : "Posez votre question..."}
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
