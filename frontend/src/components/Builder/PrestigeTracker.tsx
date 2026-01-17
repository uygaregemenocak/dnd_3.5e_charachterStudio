import { prestigeClasses } from "../../lib/prestigeClasses";

export default function PrestigeTracker() {
  return (
    <section className="rounded-2xl bg-slate-900/50 border border-white/10 p-4 space-y-3">
      <header>
        <p className="text-sm text-slate-400">Prestige Watchlist</p>
        <h3 className="text-lg font-semibold text-white">Prerequisite Overview</h3>
      </header>
      <div className="grid gap-3">
        {prestigeClasses.map((pc) => (
          <div key={pc.id} className="rounded-xl bg-slate-800/80 border border-slate-700/70 p-3">
            <p className="text-sm text-slate-200 font-medium">{pc.name}</p>
            <p className="text-xs text-slate-400">
              BAB {pc.requirements.bab}+, feats: {pc.requirements.feats.join(", ")}
            </p>
            <p className="text-xs text-slate-400">Spell path: {pc.requirements.spells.join(", ")}</p>
            {pc.requirements.special && (
              <p className="text-xs italic text-slate-500">{pc.requirements.special}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
