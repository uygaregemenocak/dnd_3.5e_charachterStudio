import { Hammer, Coins } from "lucide-react";

const formulas = [
  { name: "Spell-Triggered", baseGP: 1000, xp: 0 },
  { name: "Spell Completion", baseGP: 2000, xp: 0 },
  { name: "Wondrous Item", baseGP: 1500, xp: 25 }
];

export default function ItemCraftingCalculator() {
  return (
    <section className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border bg-muted/20">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Hammer size={20} className="text-primary" />
          Crafting Calculator
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Estimate creation costs for magical items.</p>
      </div>
      
      <div className="p-6 grid md:grid-cols-3 gap-4">
        {formulas.map((formula) => (
          <div key={formula.name} className="bg-muted/30 border border-border rounded-lg p-4 flex flex-col gap-2 hover:border-primary/50 transition-colors cursor-pointer group">
            <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">{formula.name}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold">{formula.baseGP.toLocaleString()}</span>
              <span className="text-xs text-yellow-500 font-bold">gp</span>
            </div>
            {formula.xp > 0 && (
              <div className="flex items-center gap-1 text-xs text-purple-400">
                <SparklesIcon />
                {formula.xp} XP cost
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="px-6 pb-6 text-xs text-muted-foreground">
        * Base costs shown. Final price depends on spell level, caster level, and market modifiers.
      </div>
    </section>
  );
}

function SparklesIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}
