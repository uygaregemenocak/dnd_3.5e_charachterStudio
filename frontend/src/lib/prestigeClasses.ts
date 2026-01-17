export type PrestigeRequirement = {
  bab: number;
  spells: string[];
  feats: string[];
  special?: string;
};

export type PrestigeClass = {
  id: string;
  name: string;
  hitDie: number;
  requirements: PrestigeRequirement;
};

export const prestigeClasses: PrestigeClass[] = [
  {
    id: "abjurant_champion",
    name: "Abjurant Champion",
    hitDie: 10,
    requirements: {
      bab: 5,
      spells: ["arcane"],
      feats: ["combat_casting"],
      special: "Proficient with martial weapons"
    }
  },
  {
    id: "eldritch_knight",
    name: "Eldritch Knight",
    hitDie: 10,
    requirements: {
      bab: 5,
      spells: ["arcane"],
      feats: ["weapon_focus"],
      special: "Able to cast 3rd-level arcane spells"
    }
  }
];
