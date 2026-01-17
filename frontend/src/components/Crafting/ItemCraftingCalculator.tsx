const formulas = [
  { name: "Spell-Triggered", baseGP: 1000, xp: 0 },
  { name: "Spell Completion", baseGP: 2000, xp: 0 },
  { name: "Wondrous Item", baseGP: 1500, xp: 25 }
];

export default function ItemCraftingCalculator() {
  return (
    <section className="rounded-2xl bg-slate-900/60 border border-white/5 p-4 space-y-3">
      <header>
        <p className="text-sm text-slate-400">Crafting Calculator</p>
        <h3 className="text-xl text-white font-semibold">Item Creation Costs</h3>
      </header>
      <div className="grid md:grid-cols-3 gap-3">
        {formulas.map((formula) => (
          <div key={formula.name} className="rounded-xl bg-slate-800/80 border border-slate-700 p-3">
            <p className="text-sm text-slate-300">{formula.name}</p>
            <p className="text-2xl font-bold">{formula.baseGP} gp</p>
            <p className="text-xs text-slate-500">XP: {formula.xp}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500">Spell level, caster level, and adjustments apply downstream.</p>
    </section>
  );
}
