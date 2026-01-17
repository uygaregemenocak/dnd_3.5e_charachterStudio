const races = [
  { id: "human", name: "Human", levelAdjustment: 0 },
  { id: "dwarf", name: "Dwarf", levelAdjustment: 0 },
  { id: "half_elf", name: "Half-Elf", levelAdjustment: 0 },
  { id: "dragonborn", name: "Dragonborn", levelAdjustment: 1 }
];

export default function RaceSelector() {
  return (
    <div className="rounded-xl bg-slate-900/70 border border-white/5 p-4 space-y-2">
      <p className="text-sm text-slate-400">Race</p>
      <div className="grid grid-cols-2 gap-2">
        {races.map((race) => (
          <div
            key={race.id}
            className="px-3 py-2 bg-slate-800 rounded-lg border border-slate-700 text-sm font-medium text-white"
          >
            <p>{race.name}</p>
            <small className="text-slate-500">LA +{race.levelAdjustment}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
