import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Check, Share2, Gift, Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";

const Referral = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const code = useMemo(() => {
    const base = (user?.id ?? "linkeco").replace(/-/g, "").toUpperCase();
    return `ECO-${base.slice(0, 6)}`;
  }, [user?.id]);

  const shareUrl = `${window.location.origin}/app/auth?ref=${code}`;
  const shareText = `Rejoins Link'eco avec mon code ${code} et commande ta vidange en 3 clics : ${shareUrl}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success(t("ref.copied"));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Link'eco", text: shareText, url: shareUrl });
        return;
      } catch {
        /* user cancelled */
      }
    }
    await navigator.clipboard.writeText(shareText);
    toast.success("Lien copié dans le presse-papier");
  };

  const steps = [t("ref.step1"), t("ref.step2"), t("ref.step3")];

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Header */}
      <div className="glass-strong border-b border-border/50 safe-area-top sticky top-0 z-30">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-display text-lg font-semibold text-foreground">{t("ref.title")}</h1>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-5">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-emerald p-6 shadow-green"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent/20 blur-3xl" />
          <Gift className="w-10 h-10 text-accent mb-3" />
          <h2 className="font-display text-2xl font-bold text-primary-foreground mb-2">
            {t("ref.headline")}
          </h2>
          <p className="text-primary-foreground/80 text-sm leading-relaxed">{t("ref.sub")}</p>
        </motion.div>

        {/* Code card */}
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            {t("ref.yourCode")}
          </p>
          <p className="font-display text-3xl font-bold text-foreground tracking-widest mb-4">
            {code}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {t("ref.copy")}
            </Button>
            <Button variant="hero" className="flex-1" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              {t("ref.share")}
            </Button>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-accent" />
            <h3 className="font-display font-semibold text-foreground">{t("ref.how")}</h3>
          </div>
          <ol className="space-y-4">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="w-7 h-7 shrink-0 rounded-full bg-primary/10 text-primary font-display font-bold text-sm flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-sm text-foreground pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border p-4 text-muted-foreground">
          <Users className="w-5 h-5 shrink-0" />
          <p className="text-xs">
            Les réductions sont appliquées automatiquement sur votre prochaine commande après la
            première vidange de votre filleul.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Referral;
