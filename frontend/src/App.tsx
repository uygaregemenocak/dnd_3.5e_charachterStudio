import { ChangeEvent, useCallback } from "react";
import { LayoutDashboard, Hammer, ScrollText, Sword, Shield, BookOpen } from "lucide-react";
import BuilderWizard from "./components/Builder/BuilderWizard";
import ItemCraftingCalculator from "./components/Crafting/ItemCraftingCalculator";
import PrestigeTracker from "./components/Builder/PrestigeTracker";
import { useCharacterStore } from "./stores/characterStore";
import { formatModifier } from "./lib/utils";

const abilityOrder = ["str", "dex", "con", "int", "wis", "cha"] as const;

export default function App() {
  const abilities = useCharacterStore((state) => state.abilities);
  const setAbility = useCharacterStore((state) => state.setAbility);
  const getAbilityModifier = useCharacterStore((state) => state.getAbilityModifier);
  const totalBAB = useCharacterStore((state) => state.getTotalBAB);
  const getSave = useCharacterStore((state) => state.getSave);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const ability = event.target.name as keyof typeof abilities;
      const val = Math.max(1, Math.min(30, Number(event.target.value) || 0));
      setAbility(ability, val);
    },
    [setAbility]
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card p-6 flex flex-col gap-8 sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Sword size={20} />
          </div>
          <h1 className="font-bold text-lg tracking-tight">Arcane Forge</h1>
        </div>

        <nav className="space-y-2">
          <div className="px-3 py-2 bg-accent/50 text-accent-foreground rounded-lg flex items-center gap-3 text-sm font-medium">
            <LayoutDashboard size={16} />
            Dashboard
          </div>
          <div className="px-3 py-2 text-muted-foreground hover:bg-accent/30 hover:text-foreground rounded-lg flex items-center gap-3 text-sm font-medium transition-colors cursor-pointer">
            <ScrollText size={16} />
            Character Sheet
          </div>
          <div className="px-3 py-2 text-muted-foreground hover:bg-accent/30 hover:text-foreground rounded-lg flex items-center gap-3 text-sm font-medium transition-colors cursor-pointer">
            <Hammer size={16} />
            Crafting
          </div>
          <div className="px-3 py-2 text-muted-foreground hover:bg-accent/30 hover:text-foreground rounded-lg flex items-center gap-3 text-sm font-medium transition-colors cursor-pointer">
            <BookOpen size={16} />
            Compendium
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <p>Version 0.1.0-alpha</p>
            <p className="mt-1">D&D 3.5e System</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Top Bar Stats */}
          <header className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {abilityOrder.map((ability) => {
              const mod = getAbilityModifier(ability);
              return (
                <div key={ability} className="bg-card border border-border rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden group hover:border-primary/50 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{ability}</span>
                  <div className="flex items-baseline gap-1">
                    <input
                      className="w-12 text-center bg-transparent text-2xl font-bold focus:outline-none border-b border-dashed border-border focus:border-primary p-0"
                      name={ability}
                      type="number"
                      value={abilities[ability]}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={`text-sm font-medium mt-1 ${mod >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {formatModifier(mod)}
                  </div>
                </div>
              );
            })}
          </header>

          {/* Combat Summary */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                <Sword size={20} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">BAB</p>
                <p className="text-2xl font-bold">+{totalBAB()}</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Fortitude</p>
                <p className="text-2xl font-bold">+{getSave("fortitude")}</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Reflex</p>
                <p className="text-2xl font-bold">+{getSave("reflex")}</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Will</p>
                <p className="text-2xl font-bold">+{getSave("will")}</p>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <BuilderWizard />
              <ItemCraftingCalculator />
            </div>
            <div className="space-y-8">
              <PrestigeTracker />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
