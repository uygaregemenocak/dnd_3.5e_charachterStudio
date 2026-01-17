import RaceSelector from "./RaceSelector";
import ClassSelector from "./ClassSelector";
import FeatPicker from "./FeatPicker";

export default function BuilderWizard() {
  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-lg font-semibold text-white">Character Builder</h2>
        <p className="text-slate-400 text-sm">Step through race, class, and feat selection.</p>
      </header>
      <div className="grid md:grid-cols-3 gap-4">
        <RaceSelector />
        <ClassSelector />
        <FeatPicker />
      </div>
    </section>
  );
}
