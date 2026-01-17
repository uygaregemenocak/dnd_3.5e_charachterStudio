import { useMemo, useState } from "react";
import { Plus, Trash2, Box, Sparkles, UserPlus } from "lucide-react";
import { useCharacterStore, classCatalog } from "../../stores/characterStore";
import { formatTitle } from "../../lib/utils";

const featChoices = [
  { id: "power_attack", name: "Power Attack" },
  { id: "combat_casting", name: "Combat Casting" },
  { id: "spell_focus_evocation", name: "Spell Focus (Evocation)" },
  { id: "skill_focus_knowledge", name: "Skill Focus (Knowledge)" }
];

export default function BuilderWizard() {
  const [classChoice, setClassChoice] = useState("wizard");
  const [featChoice, setFeatChoice] = useState("power_attack");
  const [equipmentName, setEquipmentName] = useState("");

  const selectedClasses = useCharacterStore((state) => state.selectedClasses);
  const selectedFeats = useCharacterStore((state) => state.selectedFeats);
  const equipment = useCharacterStore((state) => state.equipment);
  const addClass = useCharacterStore((state) => state.addClass);
  const removeClass = useCharacterStore((state) => state.removeClass);
  const setClassLevel = useCharacterStore((state) => state.setClassLevel);
  const addFeat = useCharacterStore((state) => state.addFeat);
  const removeFeat = useCharacterStore((state) => state.removeFeat);
  const addEquipment = useCharacterStore((state) => state.addEquipment);
  const removeEquipment = useCharacterStore((state) => state.removeEquipment);

  const sortedClasses = useMemo(
    () =>
      selectedClasses
        .slice()
        .sort((a, b) => a.id.localeCompare(b.id))
        .map((entry) => ({
          ...entry,
          name: classCatalog.find((cls) => cls.id === entry.id)?.name ?? entry.id
        })),
    [selectedClasses]
  );

  return (
    <section className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border bg-muted/20">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <UserPlus size={20} className="text-primary" />
          Character Builder
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Configure your character's progression.</p>
      </div>

      <div className="p-6 grid md:grid-cols-3 gap-6">
        {/* Classes Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Classes</h3>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{sortedClasses.length} Active</span>
          </div>
          
          <div className="flex gap-2">
            <select
              value={classChoice}
              onChange={(event) => setClassChoice(event.target.value)}
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            >
              {classCatalog.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => addClass(classChoice)}
              className="bg-primary text-primary-foreground p-2 rounded-lg hover:bg-primary/90 transition-colors"
              title="Add Class"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="space-y-2">
            {sortedClasses.map((entry) => (
              <div
                key={entry.id}
                className="group flex items-center gap-3 bg-muted/30 border border-border rounded-lg p-3 transition-colors hover:border-primary/50"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{formatTitle(entry.name)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">Lvl</span>
                    <input
                      className="w-12 bg-background border border-border rounded px-1 py-0.5 text-xs text-center"
                      type="number"
                      min={1}
                      max={20}
                      value={entry.level}
                      onChange={(event) =>
                        setClassLevel(entry.id, Number(event.target.value) || 1)
                      }
                    />
                  </div>
                </div>
                <button
                  className="text-muted-foreground hover:text-destructive transition-colors p-1 opacity-0 group-hover:opacity-100"
                  onClick={() => removeClass(entry.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Feats Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Feats</h3>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{selectedFeats.length}</span>
          </div>

          <div className="flex gap-2">
            <select
              value={featChoice}
              onChange={(event) => setFeatChoice(event.target.value)}
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            >
              {featChoices.map((feat) => (
                <option key={feat.id} value={feat.id}>
                  {feat.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => addFeat(featChoice)}
              className="bg-primary text-primary-foreground p-2 rounded-lg hover:bg-primary/90 transition-colors"
              title="Add Feat"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="space-y-2">
            {selectedFeats.map((feat) => (
              <div
                key={feat}
                className="group flex items-center justify-between bg-muted/30 border border-border rounded-lg p-3 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-yellow-500" />
                  <span className="text-sm font-medium">{formatTitle(feat)}</span>
                </div>
                <button
                  className="text-muted-foreground hover:text-destructive transition-colors p-1 opacity-0 group-hover:opacity-100"
                  onClick={() => removeFeat(feat)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {selectedFeats.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border rounded-lg">
                No feats selected
              </div>
            )}
          </div>
        </div>

        {/* Equipment Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Inventory</h3>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{equipment.length} Items</span>
          </div>

          <div className="flex gap-2">
            <input
              value={equipmentName}
              onChange={(event) => setEquipmentName(event.target.value)}
              placeholder="Add item..."
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && equipmentName.trim()) {
                  addEquipment(equipmentName.trim());
                  setEquipmentName("");
                }
              }}
            />
            <button
              className="bg-primary text-primary-foreground p-2 rounded-lg hover:bg-primary/90 transition-colors"
              onClick={() => {
                if (equipmentName.trim().length === 0) return;
                addEquipment(equipmentName.trim());
                setEquipmentName("");
              }}
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {equipment.map((item) => (
              <div
                key={item.id}
                className="group flex items-center justify-between bg-muted/30 border border-border rounded-lg p-3 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Box size={14} className="text-blue-400" />
                  <span className="text-sm">{item.id.split("-")[0]}</span>
                </div>
                <button
                  className="text-muted-foreground hover:text-destructive transition-colors p-1 opacity-0 group-hover:opacity-100"
                  onClick={() => removeEquipment(item.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {equipment.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border rounded-lg">
                Empty inventory
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
