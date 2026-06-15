import { motion } from "framer-motion";

const Stats = () => {
  const stats = [
    { value: "500+", label: "Interventions" },
    { value: "50+", label: "Prestataires" },
    { value: "4.8", label: "Note / 5" },
    { value: "24h", label: "Disponibilité" },
  ];

  return (
    <section className="py-20 bg-[hsl(160_80%_6%)] relative overflow-hidden">
      {/* Mesh + dots */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
      }} />

      <div className="container relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 rounded-2xl glass-dark"
            >
              <p className="font-display text-4xl md:text-5xl font-bold text-aurora mb-2">
                {stat.value}
              </p>
              <p className="text-xs text-white/50 font-semibold uppercase tracking-widest">
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
