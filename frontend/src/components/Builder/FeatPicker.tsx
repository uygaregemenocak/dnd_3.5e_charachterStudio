const feats = [
  { id: "power_attack", name: "Power Attack", type: "Combat" },
  { id: "spell_focus_evocation", name: "Spell Focus (Evocation)", type: "Metamagic" },
  { id: "combat_casting", name: "Combat Casting", type: "Combat" },
  { id: "skill_focus", name: "Skill Focus (Knowledge [Arcana])", type: "Skill" }
];

export default function FeatPicker() {
  return (
    <div className="rounded-xl bg-slate-900/70 border border-white/5 p-4">
      <p className="text-sm text-slate-400">Feats (Preview)</p>
      <div className="mt-3 space-y-2">
        {feats.map((feat) => (
          <div key={feat.id} className="flex items-center justify-between px-3 py-2 bg-slate-800 rounded-lg border border-slate-700">
            <span className="text-sm text-white">{feat.name}</span>
            <span className="text-xs text-slate-400">{feat.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
