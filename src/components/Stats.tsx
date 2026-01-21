const Stats = () => {
  const stats = [
    { value: "500+", label: "Interventions réalisées" },
    { value: "50+", label: "Prestataires partenaires" },
    { value: "4.8/5", label: "Note moyenne" },
    { value: "24h", label: "Disponibilité" },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-secondary to-accent">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-primary-foreground/80">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
