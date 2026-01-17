import { Shield, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useCharacterStore, classCatalog } from "../../stores/characterStore";
import { formatTitle } from "../../lib/utils";

export default function CharacterSummary() {
  const selectedClasses = useCharacterStore((state) => state.selectedClasses);
  const [expandedClasses, setExpandedClasses] = useState<Set<string>>(new Set());

  const classesWithData = selectedClasses.map((entry) => ({
    ...entry,
    classData: classCatalog.find((cls) => cls.id === entry.id)
  })).filter(c => c.classData);

  const totalLevel = selectedClasses.reduce((acc, c) => acc + c.level, 0);

  const toggleExpand = (classId: string) => {
    setExpandedClasses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(classId)) {
        newSet.delete(classId);
      } else {
        newSet.add(classId);
      }
      return newSet;
    });
  };

  if (classesWithData.length === 0) {
    return (
      <section className="bg-card border border-border rounded-xl shadow-sm p-8 text-center">
        <Shield size={48} className="mx-auto mb-4 opacity-20 text-muted-foreground" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Classes Yet</h3>
        <p className="text-sm text-muted-foreground">Add classes to see your character's progression here.</p>
      </section>
    );
  }

  return (
    <section className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border bg-muted/20">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Shield size={20} className="text-primary" />
          Character Overview
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          All classes and abilities for this character
        </p>
        <div className="mt-3 inline-flex items-center gap-2 bg-background border border-border px-3 py-1.5 rounded-lg text-xs font-medium">
          <span className="text-muted-foreground">Total Character Level:</span>
          <span className="text-primary font-bold text-sm">{totalLevel}</span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {classesWithData.map((classEntry) => {
          const cls = classEntry.classData!;
          const isExpanded = expandedClasses.has(classEntry.id);
          
          // Get all features up to current level
          const allFeatures: { level: number; features: string[] }[] = [];
          if (cls.progression.levels) {
            for (let i = 0; i < classEntry.level && i < cls.progression.levels.length; i++) {
              const levelData = cls.progression.levels[i];
              if (levelData.features && levelData.features.length > 0) {
                allFeatures.push({
                  level: levelData.level,
                  features: levelData.features
                });
              }
            }
          }

          return (
            <div key={classEntry.id} className="bg-muted/20 border border-border rounded-lg overflow-hidden">
              {/* Class Header */}
              <button
                onClick={() => toggleExpand(classEntry.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 min-w-[60px]">
                    <span className="text-xs text-muted-foreground font-medium">Level</span>
                    <span className="text-xl font-bold text-primary">{classEntry.level}</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-foreground">{cls.name}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-muted px-2 py-0.5 rounded border border-border">
                        d{cls.hitDie} HD
                      </span>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded border border-border">
                        {cls.skillPointsPerLevel} Skills/lvl
                      </span>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded border border-border">
                        BAB: +{Math.floor(cls.progression.bab * classEntry.level)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {allFeatures.length} feature{allFeatures.length !== 1 ? 's' : ''}
                  </span>
                  {isExpanded ? (
                    <ChevronUp size={20} className="text-muted-foreground" />
                  ) : (
                    <ChevronDown size={20} className="text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-border p-4 bg-background/50 space-y-4">
                  {/* Saving Throws */}
                  <div>
                    <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Saving Throws</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <SaveDisplay 
                        label="Fortitude" 
                        value={cls.progression.saves.fortitude * classEntry.level}
                        progression={cls.progression.saves.fortitude > 1 ? "Good" : "Poor"}
                      />
                      <SaveDisplay 
                        label="Reflex" 
                        value={cls.progression.saves.reflex * classEntry.level}
                        progression={cls.progression.saves.reflex > 1 ? "Good" : "Poor"}
                      />
                      <SaveDisplay 
                        label="Will" 
                        value={cls.progression.saves.will * classEntry.level}
                        progression={cls.progression.saves.will > 1 ? "Good" : "Poor"}
                      />
                    </div>
                  </div>

                  {/* Class Features */}
                  {allFeatures.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3">Class Features</h4>
                      <div className="space-y-3">
                        {allFeatures.map((levelGroup, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="text-xs font-semibold text-primary flex items-center gap-2">
                              <div className="h-px flex-1 bg-border" />
                              <span>Level {levelGroup.level}</span>
                              <div className="h-px flex-1 bg-border" />
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                              {levelGroup.features.map((feature, featureIdx) => (
                                <FeatureItem key={featureIdx} name={formatTitle(feature)} />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {allFeatures.length === 0 && (
                    <div className="text-center py-6 text-sm text-muted-foreground">
                      No special features at current level
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SaveDisplay({ label, value, progression }: { label: string; value: number; progression: string }) {
  return (
    <div className="bg-muted/30 border border-border rounded-lg p-2.5 text-center">
      <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">{label}</div>
      <div className="text-lg font-bold text-foreground">+{value}</div>
      <div className={`text-[10px] font-medium ${progression === "Good" ? "text-emerald-500" : "text-muted-foreground"}`}>
        {progression}
      </div>
    </div>
  );
}

function FeatureItem({ name }: { name: string }) {
  return (
    <div className="group relative bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-primary/20 transition-colors">
      <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
      <span className="text-sm font-medium text-foreground">{name}</span>
      <div className="absolute bottom-full left-0 mb-2 w-72 p-3 bg-popover border border-border rounded-lg text-xs text-popover-foreground shadow-xl hidden group-hover:block z-50 pointer-events-none">
        <p className="font-semibold mb-1">{name}</p>
        <p className="text-muted-foreground">Detailed description will appear here when data is available.</p>
      </div>
    </div>
  );
}
