import { useMemo, useState } from "react";
import { Plus, Trash2, Box, Sparkles, Swords, Shield, Info, ChevronRight, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { useCharacterStore, classCatalog } from "../../stores/characterStore";
import { formatTitle } from "../../lib/utils";

const featChoices = [
  { id: "power_attack", name: "Power Attack", description: "Trade attack bonus for extra damage on melee attacks.", prerequisites: { str: 13 } },
  { id: "combat_casting", name: "Combat Casting", description: "+4 bonus on Concentration checks to cast defensively.", prerequisites: {} },
  { id: "spell_focus_evocation", name: "Spell Focus (Evocation)", description: "+1 DC for all Evocation spells you cast.", prerequisites: {} },
  { id: "skill_focus_knowledge", name: "Skill Focus (Knowledge)", description: "+3 bonus on all checks with selected Knowledge skill.", prerequisites: {} }
];

type TabType = "classes" | "feats" | "inventory";

export default function BuilderWizard() {
  const [activeTab, setActiveTab] = useState<TabType>("classes");
  const [classChoice, setClassChoice] = useState("wizard");
  const [featChoice, setFeatChoice] = useState("power_attack");
  const [equipmentName, setEquipmentName] = useState("");
  const [ignoreRequirements, setIgnoreRequirements] = useState(false);

  const selectedClasses = useCharacterStore((state) => state.selectedClasses);
  const selectedFeats = useCharacterStore((state) => state.selectedFeats);
  const equipment = useCharacterStore((state) => state.equipment);
  const abilities = useCharacterStore((state) => state.abilities);
  const addClass = useCharacterStore((state) => state.addClass);
  const removeClass = useCharacterStore((state) => state.removeClass);
  const setClassLevel = useCharacterStore((state) => state.setClassLevel);
  const addFeat = useCharacterStore((state) => state.addFeat);
  const removeFeat = useCharacterStore((state) => state.removeFeat);
  const addEquipment = useCharacterStore((state) => state.addEquipment);
  const removeEquipment = useCharacterStore((state) => state.removeEquipment);
  const getTotalBAB = useCharacterStore((state) => state.getTotalBAB);

  const sortedClasses = useMemo(
    () =>
      selectedClasses
        .slice()
        .sort((a, b) => a.id.localeCompare(b.id))
        .map((entry) => ({
          ...entry,
          classData: classCatalog.find((cls) => cls.id === entry.id)
        })),
    [selectedClasses]
  );

  const totalLevel = sortedClasses.reduce((acc, c) => acc + c.level, 0);

  const selectedClassData = classCatalog.find(c => c.id === classChoice);
  const selectedFeatData = featChoices.find(f => f.id === featChoice);

  // Check if class/feat can be added
  const canAddClass = ignoreRequirements || checkClassRequirements(selectedClassData, { bab: getTotalBAB(), abilities });
  const canAddFeat = ignoreRequirements || checkFeatRequirements(selectedFeatData, abilities);

  return (
    <section className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border bg-muted/20 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Shield size={20} className="text-primary" />
            Character Configuration
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Build your character's progression, feats, and inventory.</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={ignoreRequirements}
              onChange={(e) => setIgnoreRequirements(e.target.checked)}
              className="rounded border-border"
            />
            <span className="text-muted-foreground">Ignore Requirements</span>
          </label>
          <div className="flex gap-2 text-xs font-medium bg-background border border-border px-3 py-1.5 rounded-lg">
            <span className="text-muted-foreground">Total Level:</span>
            <span className="text-primary font-bold">{totalLevel}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-muted/10 px-6 flex gap-1">
        <TabButton active={activeTab === "classes"} onClick={() => setActiveTab("classes")} icon={<Swords size={16} />} label="Classes" count={selectedClasses.length} />
        <TabButton active={activeTab === "feats"} onClick={() => setActiveTab("feats")} icon={<Sparkles size={16} />} label="Feats" count={selectedFeats.length} />
        <TabButton active={activeTab === "inventory"} onClick={() => setActiveTab("inventory")} icon={<Box size={16} />} label="Inventory" count={equipment.length} />
      </div>

      {/* Tab Content */}
      <div className="p-6 grid lg:grid-cols-3 gap-6 min-h-[500px]">
        <div className="lg:col-span-2">
          {activeTab === "classes" && (
            <div className="space-y-4">
              {/* Add Class Control */}
              <div className="flex gap-3 items-start bg-muted/30 p-4 rounded-lg border border-border">
                <div className="flex-1 space-y-3">
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <select
                        value={classChoice}
                        onChange={(event) => setClassChoice(event.target.value)}
                        className="w-full appearance-none bg-background border border-border rounded-lg pl-3 pr-8 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                      >
                        {classCatalog.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name} (d{cls.hitDie})
                          </option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-3 top-3 text-muted-foreground rotate-90 pointer-events-none" size={16} />
                    </div>
                    <button
                      onClick={() => canAddClass && addClass(classChoice)}
                      disabled={!canAddClass}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-lg transition-colors shadow-sm flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus size={16} />
                      Add
                    </button>
                  </div>
                  {!canAddClass && !ignoreRequirements && (
                    <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 px-3 py-2 rounded border border-destructive/20">
                      <AlertCircle size={14} />
                      <span>Requirements not met. Enable "Ignore Requirements" to add anyway.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Classes List */}
              <div className="space-y-4">
                {sortedClasses.map((entry) => (
                  <ClassCard
                    key={entry.id}
                    classEntry={entry}
                    onRemove={() => removeClass(entry.id)}
                    onLevelChange={(level) => setClassLevel(entry.id, level)}
                  />
                ))}
                {sortedClasses.length === 0 && (
                  <EmptyState text="No classes added yet. Add your first class above!" />
                )}
              </div>
            </div>
          )}

          {activeTab === "feats" && (
            <div className="space-y-4">
              {/* Add Feat Control */}
              <div className="flex gap-3 items-start bg-muted/30 p-4 rounded-lg border border-border">
                <div className="flex-1 space-y-3">
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <select
                        value={featChoice}
                        onChange={(event) => setFeatChoice(event.target.value)}
                        className="w-full appearance-none bg-background border border-border rounded-lg pl-3 pr-8 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                      >
                        {featChoices.map((feat) => (
                          <option key={feat.id} value={feat.id}>
                            {feat.name}
                          </option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-3 top-3 text-muted-foreground rotate-90 pointer-events-none" size={16} />
                    </div>
                    <button
                      onClick={() => canAddFeat && addFeat(featChoice)}
                      disabled={!canAddFeat}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-lg transition-colors shadow-sm flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus size={16} />
                      Add
                    </button>
                  </div>
                  {!canAddFeat && !ignoreRequirements && (
                    <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 px-3 py-2 rounded border border-destructive/20">
                      <AlertCircle size={14} />
                      <span>Requirements not met. Enable "Ignore Requirements" to add anyway.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Feats List */}
              <div className="grid md:grid-cols-2 gap-3">
                {selectedFeats.map((featId) => {
                  const feat = featChoices.find(f => f.id === featId);
                  return (
                    <FeatCard
                      key={featId}
                      name={feat?.name || formatTitle(featId)}
                      description={feat?.description || "No description available."}
                      onRemove={() => removeFeat(featId)}
                    />
                  );
                })}
              </div>
              {selectedFeats.length === 0 && (
                <EmptyState text="No feats selected. Choose feats to enhance your character!" />
              )}
            </div>
          )}

          {activeTab === "inventory" && (
            <div className="space-y-4">
              {/* Add Item Control */}
              <div className="flex gap-3 items-center bg-muted/30 p-4 rounded-lg border border-border">
                <label className="text-sm font-medium text-muted-foreground min-w-[80px]">Add Item:</label>
                <input
                  value={equipmentName}
                  onChange={(event) => setEquipmentName(event.target.value)}
                  placeholder="Enter item name..."
                  className="flex-1 bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && equipmentName.trim()) {
                      addEquipment(equipmentName.trim());
                      setEquipmentName("");
                    }
                  }}
                />
                <button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-lg transition-colors shadow-sm flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    if (equipmentName.trim()) {
                      addEquipment(equipmentName.trim());
                      setEquipmentName("");
                    }
                  }}
                  disabled={!equipmentName.trim()}
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>

              {/* Inventory Grid */}
              <div className="grid md:grid-cols-3 gap-3">
                {equipment.map((item) => (
                  <InventoryCard
                    key={item.id}
                    name={item.id.split("-")[0]}
                    onRemove={() => removeEquipment(item.id)}
                  />
                ))}
              </div>
              {equipment.length === 0 && (
                <EmptyState text="Inventory is empty. Add items to track your gear!" />
              )}
            </div>
          )}
        </div>

        {/* Preview Panel (Right Side) */}
        <div className="lg:col-span-1">
          {activeTab === "classes" && selectedClassData && (
            <ClassPreview classData={selectedClassData} canAdd={canAddClass} ignoreMode={ignoreRequirements} currentBAB={getTotalBAB()} currentAbilities={abilities} />
          )}
          {activeTab === "feats" && selectedFeatData && (
            <FeatPreview featData={selectedFeatData} canAdd={canAddFeat} ignoreMode={ignoreRequirements} currentAbilities={abilities} />
          )}
        </div>
      </div>
    </section>
  );
}

function checkClassRequirements(cls: any, state: { bab: number; abilities: Record<string, number> }) {
  // Placeholder: Prestige classes might need BAB or ability requirements
  return true;
}

function checkFeatRequirements(feat: any, abilities: Record<string, number>) {
  if (!feat?.prerequisites) return true;
  if (feat.prerequisites.str && abilities.str < feat.prerequisites.str) return false;
  return true;
}

function ClassPreview({ classData, canAdd, ignoreMode, currentBAB, currentAbilities }: any) {
  const requirements = [
    { label: "BAB", value: "Any", met: true },
    { label: "Abilities", value: "None", met: true }
  ];

  return (
    <div className="bg-muted/20 border border-border rounded-lg p-5 space-y-4 sticky top-6">
      <div className="pb-3 border-b border-border">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Info size={16} className="text-primary" />
          Class Details
        </h3>
      </div>

      <div>
        <h4 className="text-2xl font-bold text-foreground mb-1">{classData.name}</h4>
        <div className="flex gap-2 text-xs">
          <span className="bg-muted px-2 py-1 rounded border border-border">Hit Die: d{classData.hitDie}</span>
          <span className="bg-muted px-2 py-1 rounded border border-border">Skills: {classData.skillPointsPerLevel}/level</span>
        </div>
      </div>

      <div className="space-y-2">
        <h5 className="text-xs font-bold uppercase text-muted-foreground">Saving Throws</h5>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-background/50 px-2 py-1.5 rounded text-center">
            <div className="text-muted-foreground">Fort</div>
            <div className="font-semibold">{classData.progression.saves.fortitude > 1 ? "Good" : "Poor"}</div>
          </div>
          <div className="bg-background/50 px-2 py-1.5 rounded text-center">
            <div className="text-muted-foreground">Ref</div>
            <div className="font-semibold">{classData.progression.saves.reflex > 1 ? "Good" : "Poor"}</div>
          </div>
          <div className="bg-background/50 px-2 py-1.5 rounded text-center">
            <div className="text-muted-foreground">Will</div>
            <div className="font-semibold">{classData.progression.saves.will > 1 ? "Good" : "Poor"}</div>
          </div>
        </div>
      </div>

      {classData.progression.levels && classData.progression.levels.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-xs font-bold uppercase text-muted-foreground">Level 1 Features</h5>
          <div className="space-y-1">
            {classData.progression.levels[0].features.map((f: string, i: number) => (
              <div key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-primary" />
                {formatTitle(f)}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2 pt-3 border-t border-border">
        <h5 className="text-xs font-bold uppercase text-muted-foreground">Requirements</h5>
        {requirements.map((req, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{req.label}</span>
            <div className="flex items-center gap-2">
              <span>{req.value}</span>
              {req.met ? (
                <CheckCircle2 size={14} className="text-emerald-500" />
              ) : (
                <XCircle size={14} className="text-destructive" />
              )}
            </div>
          </div>
        ))}
      </div>

      {!canAdd && !ignoreMode && (
        <div className="bg-destructive/10 border border-destructive/20 rounded p-3 text-xs text-destructive flex items-start gap-2">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>This class cannot be added due to unmet requirements.</span>
        </div>
      )}
    </div>
  );
}

function FeatPreview({ featData, canAdd, ignoreMode, currentAbilities }: any) {
  const requirements = [];
  if (featData.prerequisites?.str) {
    requirements.push({
      label: "Strength",
      value: `${featData.prerequisites.str}+`,
      met: currentAbilities.str >= featData.prerequisites.str
    });
  }

  return (
    <div className="bg-muted/20 border border-border rounded-lg p-5 space-y-4 sticky top-6">
      <div className="pb-3 border-b border-border">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Sparkles size={16} className="text-yellow-500" />
          Feat Details
        </h3>
      </div>

      <div>
        <h4 className="text-xl font-bold text-foreground mb-2">{featData.name}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{featData.description}</p>
      </div>

      {requirements.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-border">
          <h5 className="text-xs font-bold uppercase text-muted-foreground">Requirements</h5>
          {requirements.map((req, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{req.label}</span>
              <div className="flex items-center gap-2">
                <span>{req.value}</span>
                {req.met ? (
                  <CheckCircle2 size={14} className="text-emerald-500" />
                ) : (
                  <XCircle size={14} className="text-destructive" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!canAdd && !ignoreMode && (
        <div className="bg-destructive/10 border border-destructive/20 rounded p-3 text-xs text-destructive flex items-start gap-2">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>This feat cannot be taken due to unmet prerequisites.</span>
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon, label, count }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; count: number }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 flex items-center gap-2 text-sm font-medium transition-colors border-b-2 ${
        active
          ? "border-primary text-primary bg-background"
          : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
      }`}
    >
      {icon}
      {label}
      <span className="ml-1 px-1.5 py-0.5 rounded-full bg-muted text-[10px] font-bold">{count}</span>
    </button>
  );
}

function ClassCard({ classEntry, onRemove, onLevelChange }: { classEntry: any; onRemove: () => void; onLevelChange: (level: number) => void }) {
  const cls = classEntry.classData;
  if (!cls) return null;

  const currentLevel = classEntry.level;
  const currentLevelData = cls.progression?.levels?.[currentLevel - 1];

  return (
    <div className="bg-muted/30 border border-border rounded-lg p-5 space-y-4 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-foreground">{cls.name}</h3>
            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded border border-border">
              Hit Die: d{cls.hitDie}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {cls.skillPointsPerLevel} skill points per level
          </p>
        </div>
        <button
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive transition-colors p-2"
          title="Remove Class"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="flex items-center gap-4 bg-background/50 rounded-lg p-3 border border-border">
        <label className="text-sm font-medium text-muted-foreground">Level:</label>
        <input
          className="w-20 bg-background border border-border rounded px-3 py-1.5 text-center text-sm font-bold focus:ring-2 focus:ring-primary outline-none"
          type="number"
          min={1}
          max={20}
          value={currentLevel}
          onChange={(e) => onLevelChange(Number(e.target.value) || 1)}
        />
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${(currentLevel / 20) * 100}%` }}
          />
        </div>
      </div>

      {currentLevelData?.features && currentLevelData.features.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase text-muted-foreground">Level {currentLevel} Features:</h4>
          <div className="space-y-1.5">
            {currentLevelData.features.map((feature: string, idx: number) => (
              <FeatureBadge key={idx} name={formatTitle(feature)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureBadge({ name }: { name: string }) {
  return (
    <div className="group relative inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors">
      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
      {name}
      <Info size={12} className="text-primary/60" />
      <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-popover border border-border rounded-lg text-xs text-popover-foreground shadow-xl hidden group-hover:block z-50 pointer-events-none">
        Feature description will appear here when data is available.
      </div>
    </div>
  );
}

function FeatCard({ name, description, onRemove }: { name: string; description: string; onRemove: () => void }) {
  return (
    <div className="group bg-muted/30 border border-border rounded-lg p-4 hover:border-primary/50 transition-all hover:shadow-sm relative">
      <button
        onClick={onRemove}
        className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
      >
        <Trash2 size={14} />
      </button>
      <div className="flex items-start gap-2 mb-2">
        <Sparkles size={14} className="text-yellow-500 mt-0.5 shrink-0" />
        <h4 className="font-semibold text-sm text-foreground pr-6">{name}</h4>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function InventoryCard({ name, onRemove }: { name: string; onRemove: () => void }) {
  return (
    <div className="group bg-muted/30 border border-border rounded-lg p-4 hover:border-primary/50 transition-all hover:shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Box size={16} className="text-blue-400" />
        <span className="text-sm font-medium">{name}</span>
      </div>
      <button
        onClick={onRemove}
        className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-border rounded-lg bg-muted/10">
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
