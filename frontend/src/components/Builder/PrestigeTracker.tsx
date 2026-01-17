import { GraduationCap, CheckCircle2, XCircle } from "lucide-react";
import { prestigeClasses } from "../../lib/prestigeClasses";
import { formatTitle } from "../../lib/utils";

export default function PrestigeTracker() {
  return (
    <section className="bg-card border border-border rounded-xl shadow-sm overflow-hidden h-full">
      <div className="p-6 border-b border-border bg-muted/20">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <GraduationCap size={20} className="text-primary" />
          Prestige Paths
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Track requirements for advanced classes.</p>
      </div>

      <div className="p-6 space-y-4">
        {prestigeClasses.map((pc) => (
          <div key={pc.id} className="bg-muted/30 border border-border rounded-lg p-4 space-y-3 hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">{pc.name}</h3>
              <div className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">d{pc.hitDie}</div>
            </div>
            
            <div className="space-y-2 text-sm">
              <RequirementRow label="Base Attack" value={`${pc.requirements.bab}+`} met={false} />
              <RequirementRow 
                label="Feats" 
                value={pc.requirements.feats.map(f => formatTitle(f)).join(", ")} 
                met={false} 
              />
              <RequirementRow 
                label="Spells" 
                value={pc.requirements.spells.join(", ")} 
                met={true} 
              />
              {pc.requirements.special && (
                 <RequirementRow label="Special" value={pc.requirements.special} met={false} />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RequirementRow({ label, value, met }: { label: string; value: string; met: boolean }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-muted-foreground min-w-[80px]">{label}</span>
      <div className="flex items-center gap-2 text-right flex-1 justify-end">
        <span className={met ? "text-emerald-400" : "text-foreground"}>{value}</span>
        {met ? (
          <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
        ) : (
          <XCircle size={14} className="text-muted-foreground/30 shrink-0" />
        )}
      </div>
    </div>
  );
}
