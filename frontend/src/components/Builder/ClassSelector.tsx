const classes = [
  { id: "wizard", name: "Wizard", type: "Core" },
  { id: "fighter", name: "Fighter", type: "Core" },
  { id: "abjurant_champion", name: "Abjurant Champion", type: "Prestige" },
  { id: "paladin", name: "Paladin", type: "Core" }
];

export default function ClassSelector() {
  return (
    <div className="rounded-xl bg-slate-900/70 border border-white/5 p-4 space-y-2">
      <p className="text-sm text-slate-400">Class</p>
      <div className="grid grid-cols-2 gap-2">
        {classes.map((cls) => (
          <div key={cls.id} className="px-3 py-2 bg-slate-800 rounded-lg border border-slate-700 text-sm font-medium text-white">
            <p>{cls.name}</p>
            <small className="text-slate-500">{cls.type}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
