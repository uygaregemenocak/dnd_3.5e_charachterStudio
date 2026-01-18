import { ChangeEvent, useCallback, useState } from "react";
import { LayoutDashboard, Hammer, ScrollText, Sword, Shield, BookOpen, Info, Plus, Minus } from "lucide-react";
import BuilderWizard from "./components/Builder/BuilderWizard";
import ItemCraftingCalculator from "./components/Crafting/ItemCraftingCalculator";
import CharacterSummary from "./components/Builder/CharacterSummary";
import { useCharacterStore } from "./stores/characterStore";
import { formatModifier } from "./lib/utils";

const abilityOrder = ["str", "dex", "con", "int", "wis", "cha"] as const;

const abilityDescriptions: Record<string, string> = {
  str: "Strength measures muscle and physical power. Affects melee attack rolls and damage.",
  dex: "Dexterity measures agility, reflexes, and balance. Affects AC, Reflex saves, and ranged attacks.",
  con: "Constitution measures health and stamina. Affects HP and Fortitude saves.",
  int: "Intelligence determines how well your character learns and reasons. Affects skill points and Wizard spells.",
  wis: "Wisdom describes a character's willpower, common sense, perception, and intuition. Affects Will saves and Cleric/Druid spells.",
  cha: "Charisma measures force of personality, persuasiveness, and leadership. Affects social skills and Sorcerer/Bard spells."
};

type View = "dashboard" | "sheet" | "crafting" | "compendium";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  
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
          <NavButton 
            active={currentView === "dashboard"} 
            onClick={() => setCurrentView("dashboard")}
            icon={<LayoutDashboard size={16} />} 
            label="Dashboard" 
          />
          <NavButton 
            active={currentView === "sheet"} 
            onClick={() => setCurrentView("sheet")}
            icon={<ScrollText size={16} />} 
            label="Character Sheet" 
          />
          <NavButton 
            active={currentView === "crafting"} 
            onClick={() => setCurrentView("crafting")}
            icon={<Hammer size={16} />} 
            label="Crafting" 
          />
          <NavButton 
            active={currentView === "compendium"} 
            onClick={() => setCurrentView("compendium")}
            icon={<BookOpen size={16} />} 
            label="Compendium" 
          />
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
          
          {/* Top Bar Stats (Always Visible) */}
          <header className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {abilityOrder.map((ability) => {
              const mod = getAbilityModifier(ability);
              const currentValue = abilities[ability];
              return (
                <div key={ability} className="group relative bg-gradient-to-br from-card to-muted/30 border-2 border-border rounded-xl p-4 flex flex-col items-center justify-center hover:border-primary/50 hover:shadow-lg transition-all">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <div className="group/tooltip relative">
                        <Info size={14} className="text-muted-foreground hover:text-primary cursor-help" />
                        <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-popover border border-border rounded-lg text-xs text-popover-foreground shadow-xl hidden group-hover/tooltip:block z-50 pointer-events-none">
                          <p className="font-semibold mb-1">{ability.toUpperCase()}</p>
                          <p className="text-muted-foreground">{abilityDescriptions[ability]}</p>
                        </div>
                     </div>
                  </div>
                  
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 mb-3">{ability}</span>
                  
                  {/* Score Display */}
                  <div className="text-4xl font-bold text-foreground mb-3 tabular-nums">
                    {currentValue}
                  </div>
                  
                  {/* Increment/Decrement Buttons */}
                  <div className="flex gap-2 mb-3 w-full">
                    <button
                      onClick={() => setAbility(ability, Math.max(1, currentValue - 1))}
                      className="flex-1 bg-muted hover:bg-destructive/20 hover:text-destructive border border-border hover:border-destructive/50 rounded-lg p-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={currentValue <= 1}
                    >
                      <Minus size={14} className="mx-auto" />
                    </button>
                    <button
                      onClick={() => setAbility(ability, Math.min(30, currentValue + 1))}
                      className="flex-1 bg-muted hover:bg-primary/20 hover:text-primary border border-border hover:border-primary/50 rounded-lg p-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={currentValue >= 30}
                    >
                      <Plus size={14} className="mx-auto" />
                    </button>
                  </div>
                  
                  {/* Modifier */}
                  <div className={`text-base font-bold px-3 py-1 rounded-lg ${
                    mod >= 0 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {formatModifier(mod)}
                  </div>
                </div>
              );
            })}
          </header>

          {/* Combat Summary (Always Visible) */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={<Sword size={20} />} label="BAB" value={`+${totalBAB()}`} color="text-red-500" bg="bg-red-500/10" />
            <StatCard icon={<Shield size={20} />} label="Fortitude" value={`+${getSave("fortitude")}`} color="text-orange-500" bg="bg-orange-500/10" />
            <StatCard icon={<Shield size={20} />} label="Reflex" value={`+${getSave("reflex")}`} color="text-emerald-500" bg="bg-emerald-500/10" />
            <StatCard icon={<Shield size={20} />} label="Will" value={`+${getSave("will")}`} color="text-blue-500" bg="bg-blue-500/10" />
          </section>

          {/* Dynamic Content based on View */}
          {currentView === "dashboard" && (
            <div className="space-y-8 fade-in">
              <BuilderWizard />
              <CharacterSummary />
            </div>
          )}

          {currentView === "sheet" && (
             <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
               <ScrollText size={48} className="mx-auto mb-4 opacity-20" />
               <h3 className="text-lg font-medium text-foreground">Character Sheet</h3>
               <p>Full character sheet view coming soon...</p>
             </div>
          )}

          {currentView === "crafting" && (
            <div className="fade-in">
               <ItemCraftingCalculator />
            </div>
          )}

          {currentView === "compendium" && (
             <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
               <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
               <h3 className="text-lg font-medium text-foreground">Compendium</h3>
               <p>Searchable spells, feats, and items database coming soon...</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full px-3 py-2 rounded-lg flex items-center gap-3 text-sm font-medium transition-colors text-left
        ${active 
          ? "bg-accent/50 text-accent-foreground" 
          : "text-muted-foreground hover:bg-accent/30 hover:text-foreground"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

function StatCard({ icon, label, value, color, bg }: { icon: React.ReactNode; label: string; value: string; color: string; bg: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 hover:border-primary/30 transition-colors">
      <div className={`h-10 w-10 rounded-full ${bg} flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase font-semibold">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
