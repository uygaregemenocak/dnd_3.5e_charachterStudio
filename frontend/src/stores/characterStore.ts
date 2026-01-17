import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

type ClassEntry = {
  id: string;
  level: number;
};

type EquipmentEntry = {
  id: string;
  notes?: string;
};

type ClassData = {
  id: string;
  name: string;
  hitDie: number;
  skillPointsPerLevel: number;
  progression: {
    bab: number;
    saves: {
      fortitude: number;
      reflex: number;
      will: number;
    };
    levels?: Array<{
      level: number;
      features?: string[];
    }>;
  };
};

const classDefinitions: Record<string, ClassData> = {
  wizard: {
    id: "wizard",
    name: "Wizard",
    hitDie: 4,
    skillPointsPerLevel: 2,
    progression: {
      bab: 0.5,
      saves: {
        fortitude: 0,
        reflex: 0,
        will: 2
      },
      levels: [
        { level: 1, features: ["scribe_scroll", "summon_familiar"] },
        { level: 2, features: [] },
        { level: 3, features: [] },
        { level: 4, features: [] },
        { level: 5, features: ["bonus_feat"] }
      ]
    }
  },
  fighter: {
    id: "fighter",
    name: "Fighter",
    hitDie: 10,
    skillPointsPerLevel: 2,
    progression: {
      bab: 1,
      saves: {
        fortitude: 2,
        reflex: 0,
        will: 0
      },
      levels: [
        { level: 1, features: ["bonus_feat"] },
        { level: 2, features: ["bonus_feat"] },
        { level: 3, features: [] },
        { level: 4, features: ["bonus_feat"] }
      ]
    }
  },
  paladin: {
    id: "paladin",
    name: "Paladin",
    hitDie: 10,
    skillPointsPerLevel: 2,
    progression: {
      bab: 1,
      saves: {
        fortitude: 2,
        reflex: 0,
        will: 0
      },
      levels: [
        { level: 1, features: ["detect_evil", "smite_evil_1_per_day"] },
        { level: 2, features: ["divine_grace", "lay_on_hands"] },
        { level: 3, features: ["divine_health"] }
      ]
    }
  },
  abjurant_champion: {
    id: "abjurant_champion",
    name: "Abjurant Champion",
    hitDie: 10,
    skillPointsPerLevel: 2,
    progression: {
      bab: 1,
      saves: {
        fortitude: 2,
        reflex: 0,
        will: 1
      },
      levels: [
        { level: 1, features: ["abjurant_armor", "extended_abjuration"] },
        { level: 2, features: ["swift_abjuration"] },
        { level: 3, features: ["martial_arcanist"] }
      ]
    }
  }
};

export const classCatalog = Object.values(classDefinitions);

type CharacterState = {
  abilities: Record<AbilityKey, number>;
  selectedClasses: ClassEntry[];
  selectedFeats: string[];
  equipment: EquipmentEntry[];
  skillRanks: Record<string, number>;
  getAbilityModifier: (ability: AbilityKey) => number;
  getTotalBAB: () => number;
  getSave: (type: "fortitude" | "reflex" | "will") => number;
  setAbility: (ability: AbilityKey, value: number) => void;
  addClass: (classId: string) => void;
  removeClass: (classId: string) => void;
  setClassLevel: (classId: string, level: number) => void;
  addFeat: (featId: string) => void;
  removeFeat: (featId: string) => void;
  addEquipment: (name: string) => void;
  removeEquipment: (id: string) => void;
};

const calculateBAB = (progression: ClassData["progression"], levels: number) => {
  return Math.floor(progression.bab * levels);
};

export const useCharacterStore = create<CharacterState>()(
  persist(
    immer((set, get) => ({
    abilities: {
      str: 10,
      dex: 10,
      con: 10,
      int: 10,
      wis: 10,
      cha: 10
    },
    selectedClasses: [{ id: "wizard", level: 1 }],
    selectedFeats: [],
    equipment: [],
    skillRanks: {},
    getAbilityModifier: (ability) => {
      const score = get().abilities[ability];
      return Math.floor((score - 10) / 2);
    },
    getTotalBAB: () => {
      const classes = get().selectedClasses;
      return classes.reduce((acc, cls) => {
        const definition = classDefinitions[cls.id];
        if (!definition) return acc;
        return acc + calculateBAB(definition.progression, cls.level);
      }, 0);
    },
    getSave: (type) => {
      const classes = get().selectedClasses;
      return classes.reduce((acc, cls) => {
        const definition = classDefinitions[cls.id];
        if (!definition) return acc;
        return acc + definition.progression.saves[type] * cls.level;
      }, 0);
    },
    setAbility: (ability, value) =>
      set((draft) => {
        draft.abilities[ability] = value;
      }),
    addClass: (classId) =>
      set((draft) => {
        const existing = draft.selectedClasses.find((entry) => entry.id === classId);
        if (existing) {
          existing.level = Math.min(existing.level + 1, 20);
        } else {
          draft.selectedClasses.push({ id: classId, level: 1 });
        }
      }),
    removeClass: (classId) =>
      set((draft) => {
        draft.selectedClasses = draft.selectedClasses.filter((entry) => entry.id !== classId);
      }),
    setClassLevel: (classId, level) =>
      set((draft) => {
        const existing = draft.selectedClasses.find((entry) => entry.id === classId);
        if (existing) {
          existing.level = Math.max(1, Math.min(level, 20));
        }
      }),
    addFeat: (featId) =>
      set((draft) => {
        if (!draft.selectedFeats.includes(featId)) {
          draft.selectedFeats.push(featId);
        }
      }),
    removeFeat: (featId) =>
      set((draft) => {
        draft.selectedFeats = draft.selectedFeats.filter((id) => id !== featId);
      }),
    addEquipment: (name) =>
      set((draft) => {
        draft.equipment.push({ id: `${name}-${Date.now()}`, notes: "" });
      }),
    removeEquipment: (id) =>
      set((draft) => {
        draft.equipment = draft.equipment.filter((entry) => entry.id !== id);
      })
  })),
    {
      name: "dnd-character-storage",
      version: 1,
    }
  )
);
