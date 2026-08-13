import { motion } from "framer-motion";
import { ShieldCheck, Wallet, Radar, Recycle } from "lucide-react";

const items = [
  { icon: ShieldCheck, label: "Prestataires vérifiés" },
  { icon: Wallet, label: "Wave · Orange Money · Free" },
  { icon: Radar, label: "Suivi GPS en direct" },
  { icon: Recycle, label: "Dépotage tracé & agréé" },
];

const TrustBar = () => {
  return (
    <section className="border-y border-border bg-card/60 backdrop-blur-sm">
      <div className="container py-6">
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <motion.li
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-3"
            >
              <span className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="w-4 h-4 text-primary" />
              </span>
              <span className="text-xs md:text-sm font-medium text-muted-foreground leading-tight">
                {item.label}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TrustBar;
