import { ChangeEvent, useCallback } from "react";
import BuilderWizard from "./components/Builder/BuilderWizard";
import ItemCraftingCalculator from "./components/Crafting/ItemCraftingCalculator";
import PrestigeTracker from "./components/Builder/PrestigeTracker";
import { useCharacterStore } from "./stores/characterStore";

const abilityOrder = ["str", "dex", "con", "int", "wis", "cha"] as const;

export default function App() {
  const abilities = useCharacterStore((state) => state.abilities);
  const setAbility = useCharacterStore((state) => state.setAbility);
  const getAbilityModifier = useCharacterStore((state) => state.getAbilityModifier);
  const totalBAB = useCharacterStore((state) => state.getTotalBAB);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const ability = event.target.name as keyof typeof abilities;
      setAbility(ability, Number(event.target.value || 0));
    },
    [setAbility]
  );

  return (
    <div className="space-y-6 w-full max-w-5xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl">
      <header>
        <h1 className="text-3xl font-semibold text-white">Redblade 3.5e Engine</h1>
        <p className="text-slate-300 mt-1">Reactive ability score calculator + builder preview.</p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {abilityOrder.map((ability) => (
          <label key={ability} className="flex flex-col">
            <span className="text-xs uppercase tracking-wide text-slate-400">{ability.toUpperCase()}</span>
            <input
              className="mt-1 rounded-lg px-3 py-2 bg-slate-900 border border-slate-700 text-white"
              name={ability}
              type="number"
              min="1"
              max="30"
              value={abilities[ability]}
              onChange={handleChange}
            />
            <small className="text-slate-400 mt-1">Mod: {getAbilityModifier(ability)}</small>
          </label>
        ))}
      </section>

      <section className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-slate-900/60 border border-white/5 p-4">
          <p className="text-sm text-slate-400">Base Attack Bonus</p>
          <p className="text-2xl font-bold">{totalBAB()}</p>
        </div>
      </section>

      <BuilderWizard />
      <PrestigeTracker />
      <ItemCraftingCalculator />
    </div>
  );
}
