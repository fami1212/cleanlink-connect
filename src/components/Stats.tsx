import { motion } from "framer-motion";

const Stats = () => {
  const stats = [
    { value: "500+", label: "Interventions" },
    { value: "50+", label: "Prestataires" },
    { value: "4.8", label: "Note /5" },
    { value: "24h", label: "Disponibilité" },
  ];

  return (
    <section className="py-20 bg-foreground relative overflow-hidden">
      {/* Subtle texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
      }} />

      <div className="container relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <p className="font-display text-4xl md:text-5xl font-bold text-accent mb-2">
                {stat.value}
              </p>
              <p className="text-sm text-background/50 font-medium uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
