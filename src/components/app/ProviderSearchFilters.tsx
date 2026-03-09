import { useState } from "react";
import { Search, SlidersHorizontal, Star, MapPin, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface ProviderFilters {
  search: string;
  minRating: number;
  maxDistance: number; // km
  serviceType: string | null;
}

interface ProviderSearchFiltersProps {
  filters: ProviderFilters;
  onChange: (filters: ProviderFilters) => void;
}

const SERVICE_OPTIONS = [
  { value: null, label: "Tous" },
  { value: "fosse_septique", label: "Fosse septique" },
  { value: "latrines", label: "Latrines" },
  { value: "urgence", label: "Urgence" },
  { value: "curage", label: "Curage" },
];

const RATING_OPTIONS = [
  { value: 0, label: "Tous" },
  { value: 3, label: "3+" },
  { value: 4, label: "4+" },
  { value: 4.5, label: "4.5+" },
];

const DISTANCE_OPTIONS = [
  { value: 100, label: "Tous" },
  { value: 5, label: "5 km" },
  { value: 10, label: "10 km" },
  { value: 20, label: "20 km" },
];

const ProviderSearchFilters = ({ filters, onChange }: ProviderSearchFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = filters.minRating > 0 || filters.maxDistance < 100 || filters.serviceType !== null;

  const resetFilters = () => {
    onChange({ ...filters, minRating: 0, maxDistance: 100, serviceType: null });
  };

  return (
    <div className="space-y-2">
      {/* Search bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un prestataire..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ ...filters, search: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2.5 rounded-xl border transition-colors ${
            hasActiveFilters
              ? "bg-primary border-primary text-primary-foreground"
              : "bg-card border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Filter chips */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-card border border-border rounded-xl p-3 space-y-3">
              {/* Rating filter */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                  <Star className="w-3 h-3" /> Note minimum
                </p>
                <div className="flex gap-1.5">
                  {RATING_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => onChange({ ...filters, minRating: opt.value })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        filters.minRating === opt.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance filter */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Distance max
                </p>
                <div className="flex gap-1.5">
                  {DISTANCE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => onChange({ ...filters, maxDistance: opt.value })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        filters.maxDistance === opt.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Service type filter */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1.5">Service</p>
                <div className="flex flex-wrap gap-1.5">
                  {SERVICE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value ?? "all"}
                      onClick={() => onChange({ ...filters, serviceType: opt.value })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        filters.serviceType === opt.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="w-full py-1.5 text-xs text-destructive font-medium hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProviderSearchFilters;
